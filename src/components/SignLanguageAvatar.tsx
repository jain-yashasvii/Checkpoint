import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Hand, 
  Move, 
  Minimize2, 
  Maximize2, 
  X, 
  LayoutGrid, 
  ChevronDown,
  Check
} from 'lucide-react';
import { audioSystem } from '../utils/audio';

export type SignGesture = 'idle' | 'fact' | 'evidence' | 'verify' | 'doubt' | 'source' | 'deception';

export type DockPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'center' | 'custom';

interface SignLanguageAvatarProps {
  currentGesture?: SignGesture;
  currentCaption?: string;
  speakerName?: string;
  isHighContrast?: boolean;
  onClose?: () => void;
}

const GESTURE_DESCRIPTIONS: Record<SignGesture, { title: string; asGloss: string; description: string }> = {
  idle: {
    title: 'Attentive Stance',
    asGloss: '[READY / ATTENTIVE]',
    description: 'Interpreter listening and ready to translate claims in real-time.',
  },
  fact: {
    title: 'Signing: FACT / TRUE',
    asGloss: '[TRUE / AUTHENTIC / CONFIRMED]',
    description: 'Index finger touches chin and extends outward in decisive affirmation.',
  },
  evidence: {
    title: 'Signing: EVIDENCE / PROOF',
    asGloss: '[PROOF / SHOW DATA / METHOD]',
    description: 'Both flat hands spread open moving downward to present tangible proof.',
  },
  verify: {
    title: 'Signing: INVESTIGATE / SIFT',
    asGloss: '[LATERAL SEARCH / CROSS-EXAMINE]',
    description: 'C-handshapes alternating in circular search gesture across two perspectives.',
  },
  doubt: {
    title: 'Signing: QUESTION / UNCERTAIN',
    asGloss: '[DOUBT / SUSPICIOUS / PAUSE]',
    description: 'Bent index finger curls repeatedly with furrowed brow indicating inquiry.',
  },
  source: {
    title: 'Signing: SOURCE / ORIGIN',
    asGloss: '[ORIGIN / PUBLISHER / ROOTS]',
    description: 'Hands emerge from central baseline pointing back to the foundational publisher.',
  },
  deception: {
    title: 'Signing: FALSE / IMPOSTER',
    asGloss: '[DECEPTION / FAKE / WARNING]',
    description: 'Index finger brushes across tip of nose in swift horizontal denial motion.',
  },
};

const STORAGE_KEY_POS = 'info_imposter_sign_avatar_pos';
const STORAGE_KEY_DOCK = 'info_imposter_sign_avatar_dock';
const STORAGE_KEY_SIZE = 'info_imposter_sign_avatar_size';
const STORAGE_KEY_OPACITY = 'info_imposter_sign_avatar_opacity';

export const SignLanguageAvatar: React.FC<SignLanguageAvatarProps> = ({
  currentGesture = 'idle',
  currentCaption = '',
  speakerName = 'System Moderator',
  isHighContrast = false,
  onClose,
}) => {
  // Size mode: 'full' | 'compact' | 'bubble'
  const [viewMode, setViewMode] = useState<'full' | 'compact' | 'bubble'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SIZE);
      if (saved === 'full' || saved === 'compact' || saved === 'bubble') return saved;
    } catch {
      // fallback
    }
    return 'full';
  });

  const [opacity, setOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OPACITY);
      if (saved) return parseFloat(saved);
    } catch {
      // fallback
    }
    return 1;
  });

  // Dock preset
  const [dockPosition, setDockPosition] = useState<DockPosition>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCK);
      if (saved && ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'center', 'custom'].includes(saved)) {
        return saved as DockPosition;
      }
    } catch {
      // fallback
    }
    return 'bottom-left';
  });

  // Coordinates for react-draggable (controlled position)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Default bottom-left placement
    return { x: 20, y: typeof window !== 'undefined' ? Math.max(10, window.innerHeight - 360) : 480 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [showDockMenu, setShowDockMenu] = useState(false);
  const [frameTick, setFrameTick] = useState(0);

  // Ref required by react-draggable to avoid deprecated findDOMNode
  const nodeRef = useRef<HTMLDivElement>(null);

  // Calculate preset position based on container size and viewport
  const calculateDockCoords = useCallback((dock: DockPosition, width: number = 320, height: number = 330) => {
    const margin = 20;
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;

    switch (dock) {
      case 'bottom-left':
        return { x: margin, y: Math.max(margin, winH - height - margin) };
      case 'bottom-right':
        return { x: Math.max(margin, winW - width - margin), y: Math.max(margin, winH - height - margin) };
      case 'top-left':
        return { x: margin, y: margin + 60 }; // Below top nav
      case 'top-right':
        return { x: Math.max(margin, winW - width - margin), y: margin + 60 };
      case 'center':
        return { x: Math.max(margin, (winW - width) / 2), y: Math.max(margin, (winH - height) / 2) };
      default:
        return position;
    }
  }, [position]);

  // Handle snap to dock preset
  const handleSnapToDock = (dock: DockPosition) => {
    audioSystem.playClick();
    setDockPosition(dock);
    try {
      localStorage.setItem(STORAGE_KEY_DOCK, dock);
    } catch {}

    if (dock !== 'custom') {
      const width = viewMode === 'bubble' ? 70 : viewMode === 'compact' ? 240 : 320;
      const height = viewMode === 'bubble' ? 70 : viewMode === 'compact' ? 180 : 330;
      const newPos = calculateDockCoords(dock, width, height);
      setPosition(newPos);
      try {
        localStorage.setItem(STORAGE_KEY_POS, JSON.stringify(newPos));
      } catch {}
    }
    setShowDockMenu(false);
  };

  // Adjust on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (dockPosition !== 'custom') {
        const width = viewMode === 'bubble' ? 70 : viewMode === 'compact' ? 240 : 320;
        const height = viewMode === 'bubble' ? 70 : viewMode === 'compact' ? 180 : 330;
        setPosition(calculateDockCoords(dockPosition, width, height));
      } else {
        // Clamp to screen bounds
        setPosition(prev => {
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const clampedX = Math.min(Math.max(10, prev.x), Math.max(10, winW - 80));
          const clampedY = Math.min(Math.max(10, prev.y), Math.max(10, winH - 80));
          return { x: clampedX, y: clampedY };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dockPosition, viewMode, calculateDockCoords]);

  // Subtle continuous breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameTick(t => (t + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Save viewMode & opacity
  const handleSetViewMode = (mode: 'full' | 'compact' | 'bubble') => {
    audioSystem.playClick();
    setViewMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY_SIZE, mode);
    } catch {}

    // Adjust position if needed
    if (dockPosition !== 'custom') {
      const width = mode === 'bubble' ? 70 : mode === 'compact' ? 240 : 320;
      const height = mode === 'bubble' ? 70 : mode === 'compact' ? 180 : 330;
      setPosition(calculateDockCoords(dockPosition, width, height));
    }
  };

  const handleCycleOpacity = () => {
    audioSystem.playClick();
    const next = opacity === 1 ? 0.8 : opacity === 0.8 ? 0.6 : 1;
    setOpacity(next);
    try {
      localStorage.setItem(STORAGE_KEY_OPACITY, next.toString());
    } catch {}
  };

  // Native pointer drag handler
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
      const cardW = nodeRef.current?.offsetWidth || 280;
      const cardH = nodeRef.current?.offsetHeight || 200;
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
      const cardW = nodeRef.current?.offsetWidth || 280;
      const cardH = nodeRef.current?.offsetHeight || 200;
      const finalX = Math.min(Math.max(10, initialX + deltaX), Math.max(10, winW - cardW - 10));
      const finalY = Math.min(Math.max(10, initialY + deltaY), Math.max(10, winH - cardH - 10));

      try {
        localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ x: finalX, y: finalY }));
        localStorage.setItem(STORAGE_KEY_DOCK, 'custom');
      } catch {}
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const gestureInfo = GESTURE_DESCRIPTIONS[currentGesture] || GESTURE_DESCRIPTIONS.idle;
  const isAltGesture = currentGesture !== 'idle';
  const breathOffset = Math.sin(frameTick * 0.1) * 2;
  const handWiggle = Math.sin(frameTick * 0.3) * (isAltGesture ? 5 : 1);

  // If in floating mini bubble mode
  if (viewMode === 'bubble') {
    return (
      <div
        ref={nodeRef}
        onPointerDown={handlePointerDown}
        style={{
          position: 'fixed',
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          left: 0,
          top: 0,
          opacity,
          zIndex: 60,
          touchAction: 'none',
        }}
        className={`group cursor-grab active:cursor-grabbing select-none transition-shadow duration-200 ${
          isDragging ? 'scale-105 shadow-2xl' : ''
        }`}
      >
        <div
          className={`relative flex items-center gap-2 p-2 rounded-full shadow-2xl border transition-all ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
              : 'bg-slate-900/95 text-pink-300 border-pink-500/60 shadow-pink-950/60 backdrop-blur-xl hover:border-pink-400'
          }`}
        >
          {/* Animated Mini Icon with gesture indicator */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Hand className="w-5 h-5 animate-pulse" />
            {isAltGesture && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>

          <div className="hidden group-hover:flex items-center gap-2 pr-2 text-xs font-bold whitespace-nowrap">
            <span className="text-[11px] text-white">Sign Interpreter</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
              {gestureInfo.asGloss}
            </span>
          </div>

          {/* Quick Expand Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              handleSetViewMode('full');
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Expand Sign Interpreter"
            aria-label="Expand Sign Interpreter"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Quick Close Button */}
          {onClose && (
            <button
              onClick={e => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
              title="Close Sign Interpreter"
              aria-label="Close Sign Interpreter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <aside
      ref={nodeRef}
      aria-label="Sign language interpretation overlay"
      style={{
        position: 'fixed',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: 0,
        top: 0,
        opacity,
        zIndex: 60,
      }}
      className={`select-none transition-shadow duration-200 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400 shadow-yellow-950/40'
          : 'bg-slate-900/95 text-slate-100 border-pink-500/40 shadow-2xl shadow-black/80'
      } ${viewMode === 'compact' ? 'w-64 sm:w-72' : 'w-72 sm:w-80'} ${
        isDragging ? 'ring-2 ring-pink-500/80 shadow-pink-500/20 scale-[1.01]' : ''
      }`}
    >
      {/* Draggable Header Bar with Pointer Down */}
      <div
        onPointerDown={handlePointerDown}
        className={`flex items-center justify-between px-3 py-2.5 rounded-t-2xl cursor-grab active:cursor-grabbing border-b transition-colors touch-none ${
          isHighContrast
            ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
            : 'bg-gradient-to-r from-pink-950/90 via-indigo-950/90 to-slate-900/90 border-pink-500/20 text-xs font-semibold'
        }`}
      >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-pink-500/20 text-pink-300 pointer-events-none">
              <Hand className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="flex flex-col pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-[11px] sm:text-xs">
                  Sign Interpreter (ISL/ASL)
                </span>
              </div>
              <span className="text-[9px] text-pink-300/80 flex items-center gap-1 font-mono">
                <Move className="w-2.5 h-2.5" /> Drag anywhere on screen
              </span>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1">
            {/* Quick Dock Preset Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowDockMenu(!showDockMenu)}
                className={`p-1.5 rounded-lg transition ${
                  showDockMenu
                    ? 'bg-pink-500 text-white'
                    : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Dock Position Presets (Corners & Center)"
                aria-label="Dock Position Presets"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              {/* Dock Position Popover */}
              {showDockMenu && (
                <div
                  className={`absolute right-0 top-8 w-48 p-2 rounded-xl shadow-2xl border z-50 text-xs space-y-1 ${
                    isHighContrast
                      ? 'bg-black text-yellow-300 border-yellow-400'
                      : 'bg-slate-900/95 text-slate-200 border-slate-700 shadow-black'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Snap to Position:
                  </div>
                  {(
                    [
                      { key: 'bottom-left', label: '↙️ Bottom Left (Default)' },
                      { key: 'bottom-right', label: '↘️ Bottom Right' },
                      { key: 'top-left', label: '↖️ Top Left' },
                      { key: 'top-right', label: '↗️ Top Right' },
                      { key: 'center', label: '🎯 Center Float' },
                    ] as const
                  ).map(pos => (
                    <button
                      key={pos.key}
                      onClick={() => handleSnapToDock(pos.key)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition ${
                        dockPosition === pos.key
                          ? 'bg-pink-600 text-white font-bold'
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

            {/* Opacity Cycle Button */}
            <button
              onClick={handleCycleOpacity}
              className="px-1.5 py-1 rounded text-[10px] font-mono hover:bg-white/10 text-slate-300 hover:text-white transition"
              title={`Opacity: ${Math.round(opacity * 100)}% (Click to toggle 100% / 80% / 60%)`}
              aria-label="Change opacity"
            >
              {Math.round(opacity * 100)}%
            </button>

            {/* View Mode Switcher */}
            <button
              onClick={() => handleSetViewMode(viewMode === 'full' ? 'compact' : 'full')}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              title={viewMode === 'full' ? 'Switch to Compact View' : 'Switch to Full View'}
              aria-label="Toggle compact view"
            >
              {viewMode === 'full' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Minimize to Floating Bubble */}
            <button
              onClick={() => handleSetViewMode('bubble')}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              title="Minimize to Floating Bubble Badge"
              aria-label="Minimize to Floating Bubble"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Close/Dismiss Button */}
            {onClose && (
              <button
                onClick={() => {
                  audioSystem.playClick();
                  onClose();
                }}
                className="p-1.5 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-300 transition"
                title="Turn Off Sign Language Avatar"
                aria-label="Close Sign Language Avatar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="p-3">
          {/* Animated SVG Interpreter Character */}
          <div
            className={`relative w-full ${
              viewMode === 'compact' ? 'h-28' : 'h-36 sm:h-40'
            } bg-slate-950/90 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800`}
          >
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-radial from-pink-600/15 via-indigo-600/5 to-transparent pointer-events-none" />

            <svg
              viewBox="0 0 200 160"
              className="w-full h-full max-h-40 pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fed7aa" />
                  <stop offset="100%" stopColor="#fba779" />
                </linearGradient>
                <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#831843" />
                </linearGradient>
              </defs>

              {/* Torso & Shoulders with Breathing */}
              <path
                d={`M 50 ${160 + breathOffset} Q 100 ${110 + breathOffset} 150 ${160 + breathOffset} Z`}
                fill="url(#shirtGrad)"
              />
              <path
                d={`M 75 ${125 + breathOffset} Q 100 ${140 + breathOffset} 125 ${125 + breathOffset} Z`}
                fill="#500724"
              />

              {/* Neck */}
              <rect x="92" y={88 + breathOffset * 0.5} width="16" height="22" rx="3" fill="url(#skinGrad)" />

              {/* Head & Face */}
              <ellipse cx="100" cy={68 + breathOffset * 0.5} rx="26" ry="30" fill="url(#skinGrad)" />
              {/* Hair */}
              <path
                d={`M 74 ${62 + breathOffset * 0.5} Q 100 ${32 + breathOffset * 0.5} 126 ${62 + breathOffset * 0.5} Q 100 ${45 + breathOffset * 0.5} 74 ${62 + breathOffset * 0.5} Z`}
                fill="#1e293b"
              />

              {/* Eyes */}
              <ellipse cx="90" cy={66 + breathOffset * 0.5} rx="3" ry={isAltGesture ? 3.5 : 2.5} fill="#0f172a" />
              <ellipse cx="110" cy={66 + breathOffset * 0.5} rx="3" ry={isAltGesture ? 3.5 : 2.5} fill="#0f172a" />

              {/* Eyebrows (Dynamic for doubt vs affirmation) */}
              {currentGesture === 'doubt' ? (
                <>
                  <path d={`M 84 ${58 + breathOffset * 0.5} Q 92 ${63 + breathOffset * 0.5} 96 ${60 + breathOffset * 0.5}`} stroke="#0f172a" strokeWidth="2" fill="none" />
                  <path d={`M 104 ${60 + breathOffset * 0.5} Q 108 ${58 + breathOffset * 0.5} 116 ${56 + breathOffset * 0.5}`} stroke="#0f172a" strokeWidth="2" fill="none" />
                </>
              ) : (
                <>
                  <path d={`M 84 ${60 + breathOffset * 0.5} Q 90 ${56 + breathOffset * 0.5} 96 ${59 + breathOffset * 0.5}`} stroke="#0f172a" strokeWidth="2" fill="none" />
                  <path d={`M 104 ${59 + breathOffset * 0.5} Q 110 ${56 + breathOffset * 0.5} 116 ${60 + breathOffset * 0.5}`} stroke="#0f172a" strokeWidth="2" fill="none" />
                </>
              )}

              {/* Mouth */}
              {currentGesture === 'deception' ? (
                <path d={`M 92 ${84 + breathOffset * 0.5} Q 100 ${80 + breathOffset * 0.5} 108 ${84 + breathOffset * 0.5}`} stroke="#991b1b" strokeWidth="2" fill="none" />
              ) : (
                <path d={`M 93 ${82 + breathOffset * 0.5} Q 100 ${88 + breathOffset * 0.5} 107 ${82 + breathOffset * 0.5}`} stroke="#991b1b" strokeWidth="2" fill="none" />
              )}

              {/* Hands & Signing Gestures */}
              {currentGesture === 'idle' && (
                <>
                  {/* Resting hands */}
                  <circle cx={75 + handWiggle * 0.3} cy={135} r="10" fill="url(#skinGrad)" />
                  <circle cx={125 - handWiggle * 0.3} cy={135} r="10" fill="url(#skinGrad)" />
                </>
              )}

              {currentGesture === 'fact' && (
                <>
                  {/* Decisive pointing out */}
                  <line x1="100" y1="85" x2={100} y2={110 + handWiggle} stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="100" cy={112 + handWiggle} r="9" fill="url(#skinGrad)" />
                  <circle cx="70" cy={135} r="9" fill="url(#skinGrad)" />
                </>
              )}

              {currentGesture === 'evidence' && (
                <>
                  {/* Two flat open palms presenting data */}
                  <ellipse cx={68 + handWiggle} cy={115} rx="12" ry="7" fill="url(#skinGrad)" transform="rotate(-15 68 115)" />
                  <ellipse cx={132 - handWiggle} cy={115} rx="12" ry="7" fill="url(#skinGrad)" transform="rotate(15 132 115)" />
                </>
              )}

              {currentGesture === 'verify' && (
                <>
                  {/* SIFT search alternating hands */}
                  <circle cx={80 + handWiggle} cy={100} r="10" fill="url(#skinGrad)" />
                  <circle cx={120 - handWiggle} cy={108} r="10" fill="url(#skinGrad)" />
                  {/* Magnifying trace */}
                  <circle cx={100} cy={104} r="16" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                </>
              )}

              {currentGesture === 'doubt' && (
                <>
                  {/* Questioning hand up to chin */}
                  <circle cx={115 + handWiggle * 0.5} cy={76} r="8" fill="url(#skinGrad)" />
                  <circle cx={70} cy={135} r="9" fill="url(#skinGrad)" />
                </>
              )}

              {currentGesture === 'source' && (
                <>
                  {/* Open book palms */}
                  <rect x={76 - handWiggle * 0.3} y="110" width="22" height="14" rx="3" fill="url(#skinGrad)" transform="rotate(-20 87 117)" />
                  <rect x={102 + handWiggle * 0.3} y="110" width="22" height="14" rx="3" fill="url(#skinGrad)" transform="rotate(20 113 117)" />
                </>
              )}

              {currentGesture === 'deception' && (
                <>
                  {/* Horizontal swipe across nose */}
                  <line x1={70 - handWiggle} y1="72" x2={130 + handWiggle} y2="72" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 2" />
                  <circle cx={105 + handWiggle * 2} cy={72} r="9" fill="url(#skinGrad)" />
                </>
              )}
            </svg>

            {/* Gesture Badge on Canvas */}
            <div className="absolute top-2 right-2 bg-pink-950/80 px-2 py-0.5 rounded text-[10px] text-pink-300 font-mono border border-pink-500/30">
              {gestureInfo.asGloss}
            </div>
          </div>

          {/* Explanation Text in Full Mode */}
          {viewMode === 'full' && (
            <div className="mt-2 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className={isHighContrast ? 'text-yellow-300' : 'text-pink-300'}>
                  {gestureInfo.title}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {speakerName}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {gestureInfo.description}
              </p>
            </div>
          )}
        </div>

        {/* Live Mini Caption Footer */}
        {currentCaption && (
          <div className="px-3 py-1.5 bg-black/60 border-t border-slate-800 text-[11px] text-slate-200 line-clamp-2 rounded-b-2xl">
            <span className="text-pink-400 font-bold mr-1">CC:</span>
            {currentCaption}
          </div>
        )}
      </aside>
  );
};
