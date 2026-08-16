import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Move, 
  X, 
  LayoutGrid, 
  Volume2, 
  Check, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { audioSystem } from '../utils/audio';

export type CCDockPosition = 'bottom-center' | 'top-center' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'custom';

interface ClosedCaptionsProps {
  speakerName: string;
  speakerAvatar?: string;
  text: string;
  isHighContrast?: boolean;
  phaseLabel?: string;
  onClose?: () => void;
}

const STORAGE_KEY_CC_POS = 'info_imposter_cc_pos';
const STORAGE_KEY_CC_DOCK = 'info_imposter_cc_dock';

export const ClosedCaptions: React.FC<ClosedCaptionsProps> = ({
  speakerName,
  speakerAvatar = '🎙️',
  text,
  isHighContrast = false,
  phaseLabel,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showDockMenu, setShowDockMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Ref required by react-draggable to avoid deprecated findDOMNode
  const nodeRef = useRef<HTMLDivElement>(null);

  // Position state (controlled by react-draggable)
  const [dockPosition, setDockPosition] = useState<CCDockPosition>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CC_DOCK);
      if (saved && ['bottom-center', 'top-center', 'bottom-left', 'bottom-right', 'top-left', 'top-right', 'custom'].includes(saved)) {
        return saved as CCDockPosition;
      }
    } catch {
      // fallback
    }
    return 'bottom-center';
  });

  const calculateDockCoords = useCallback((dock: CCDockPosition, width = 580, height = 90) => {
    const margin = 20;
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;

    switch (dock) {
      case 'bottom-center':
        return { x: Math.max(margin, (winW - width) / 2), y: Math.max(margin, winH - height - 80) };
      case 'top-center':
        return { x: Math.max(margin, (winW - width) / 2), y: margin + 65 };
      case 'bottom-left':
        return { x: margin, y: Math.max(margin, winH - height - 80) };
      case 'bottom-right':
        return { x: Math.max(margin, winW - width - margin), y: Math.max(margin, winH - height - 80) };
      case 'top-left':
        return { x: margin, y: margin + 65 };
      case 'top-right':
        return { x: Math.max(margin, winW - width - margin), y: margin + 65 };
      default: {
        return { x: Math.max(margin, (winW - width) / 2), y: Math.max(margin, winH - height - 80) };
      }
    }
  }, []);

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CC_POS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return calculateDockCoords('bottom-center');
  });

  // Keep clamped on resize
  useEffect(() => {
    const handleResize = () => {
      if (dockPosition !== 'custom') {
        const elem = nodeRef.current;
        const width = elem ? elem.offsetWidth : 580;
        const height = elem ? elem.offsetHeight : 90;
        setPosition(calculateDockCoords(dockPosition, width, height));
      } else {
        setPosition(prev => {
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const clampedX = Math.min(Math.max(10, prev.x), Math.max(10, winW - 100));
          const clampedY = Math.min(Math.max(10, prev.y), Math.max(10, winH - 60));
          return { x: clampedX, y: clampedY };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dockPosition, calculateDockCoords]);

  // Snap to Preset Position
  const handleSnapToDock = (dock: CCDockPosition) => {
    audioSystem.playClick();
    setDockPosition(dock);
    try {
      localStorage.setItem(STORAGE_KEY_CC_DOCK, dock);
    } catch {}

    if (dock !== 'custom') {
      const elem = nodeRef.current;
      const width = elem ? elem.offsetWidth : 580;
      const height = elem ? elem.offsetHeight : 90;
      const newPos = calculateDockCoords(dock, width, height);
      setPosition(newPos);
      try {
        localStorage.setItem(STORAGE_KEY_CC_POS, JSON.stringify(newPos));
      } catch {}
    }
    setShowDockMenu(false);
  };

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea')) return;

    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = position.x;
    const initialY = position.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const cardW = nodeRef.current?.offsetWidth || 500;
      const cardH = nodeRef.current?.offsetHeight || 80;
      const newX = Math.min(Math.max(10, initialX + deltaX), Math.max(10, winW - cardW - 10));
      const newY = Math.min(Math.max(10, initialY + deltaY), Math.max(10, winH - cardH - 10));

      setPosition({ x: newX, y: newY });
      setDockPosition('custom');
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setIsDragging(false);

      const deltaX = upEvent.clientX - startX;
      const deltaY = upEvent.clientY - startY;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const cardW = nodeRef.current?.offsetWidth || 500;
      const cardH = nodeRef.current?.offsetHeight || 80;
      const finalX = Math.min(Math.max(10, initialX + deltaX), Math.max(10, winW - cardW - 10));
      const finalY = Math.min(Math.max(10, initialY + deltaY), Math.max(10, winH - cardH - 10));

      try {
        localStorage.setItem(STORAGE_KEY_CC_POS, JSON.stringify({ x: finalX, y: finalY }));
        localStorage.setItem(STORAGE_KEY_CC_DOCK, 'custom');
      } catch {}
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  if (!text) return null;

  return (
    <aside
      ref={nodeRef}
      aria-live="polite"
      aria-atomic="true"
      aria-label="Real-time live dialogue closed captions (draggable)"
      style={{
        position: 'fixed',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: 0,
        top: 0,
        zIndex: 55,
      }}
      className={`select-none transition-shadow duration-200 max-w-2xl w-[92vw] sm:w-[580px] rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400 font-bold shadow-yellow-950/50'
          : 'bg-slate-950/95 text-slate-100 border-indigo-500/50 shadow-indigo-950/70'
      } ${isDragging ? 'ring-2 ring-indigo-400 scale-[1.01] shadow-2xl shadow-indigo-500/20' : ''}`}
    >
      {/* Caption Header / Grab Handle Bar with onPointerDown */}
      <div
        onPointerDown={handlePointerDown}
        className={`flex items-center justify-between px-3 py-1.5 rounded-t-2xl cursor-grab active:cursor-grabbing border-b transition-colors touch-none ${
          isHighContrast
            ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300'
            : 'bg-gradient-to-r from-indigo-950/80 via-slate-900/80 to-slate-950/80 border-indigo-500/20'
        }`}
      >
        <div className="flex items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-base select-none">{speakerAvatar}</span>
              <span className={`font-bold ${isHighContrast ? 'text-yellow-300' : 'text-cyan-400'}`}>
                {speakerName}
              </span>
              {phaseLabel && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {phaseLabel}
                </span>
              )}
            </div>
            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono hidden sm:inline-flex">
              <Move className="w-2.5 h-2.5 text-indigo-400" /> Drag to move
            </span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1">
            {/* Dock Presets Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDockMenu(!showDockMenu)}
                className={`p-1 rounded-md text-slate-300 hover:text-white transition ${
                  showDockMenu ? 'bg-indigo-600 text-white' : 'hover:bg-white/10'
                }`}
                title="Reposition / Snap to Dock"
                aria-label="Reposition Closed Captions"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              {showDockMenu && (
                <div
                  className={`absolute right-0 top-7 w-48 p-2 rounded-xl shadow-2xl border z-50 text-xs space-y-1 ${
                    isHighContrast
                      ? 'bg-black text-yellow-300 border-yellow-400'
                      : 'bg-slate-900/95 text-slate-200 border-slate-700 shadow-black'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Snap Position:
                  </div>
                  {(
                    [
                      { key: 'bottom-center', label: '⬇️ Bottom Center' },
                      { key: 'top-center', label: '⬆️ Top Center' },
                      { key: 'bottom-left', label: '↙️ Bottom Left' },
                      { key: 'bottom-right', label: '↘️ Bottom Right' },
                      { key: 'top-left', label: '↖️ Top Left' },
                      { key: 'top-right', label: '↗️ Top Right' },
                    ] as const
                  ).map(pos => (
                    <button
                      key={pos.key}
                      onClick={() => handleSnapToDock(pos.key)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition ${
                        dockPosition === pos.key
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span>{pos.label}</span>
                      {dockPosition === pos.key && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Minimize Toggle */}
            <button
              onClick={() => {
                audioSystem.playClick();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition"
              title={isMinimized ? 'Expand captions' : 'Minimize captions'}
              aria-label={isMinimized ? 'Expand captions' : 'Minimize captions'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close / Dismiss */}
            {onClose && (
              <button
                onClick={() => {
                  audioSystem.playClick();
                  onClose();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition"
                title="Dismiss Live Captions"
                aria-label="Dismiss Live Captions"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Caption Body Text */}
        {!isMinimized && (
          <div className="px-4 py-2.5">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              "{text}"
            </p>
          </div>
        )}
      </aside>
  );
};
