import { 
  InformationCard, 
  PlayerPersona, 
  RoundResolution, 
  VerificationBadge, 
  SupportedLanguage, 
  InvestigationActionType,
  MILTheme,
  RoundCategory
} from '../types/game';

// Translations for standard investigation clue action types & titles
export const LOCALIZED_ACTION_NAMES: Record<SupportedLanguage, Record<InvestigationActionType, { title: string; pillar: string; tag: string }>> = {
  en: {
    check_source: { title: 'Check Source & WHOIS', pillar: 'Stop & Check', tag: 'DOMAIN TRACE' },
    verify_date: { title: 'Verify Timeline & Dates', pillar: 'Find Coverage', tag: 'TEMPORAL RECORD' },
    cross_check_network: { title: 'Cross-Check News Wires', pillar: 'Investigate', tag: 'LATERAL WIRES' },
    inspect_metadata: { title: 'Inspect EXIF & Geometry', pillar: 'Trace Context', tag: 'GEOMETRY / EXIF' },
    analyze_ai_artifacts: { title: 'Forensic GAN & Audio Scan', pillar: 'Spot Artifacts', tag: 'AI SPECTROGRAM' },
  },
  es: {
    check_source: { title: 'Verificar Fuente y WHOIS', pillar: 'Detener y Verificar', tag: 'RASTRO DE DOMINIO' },
    verify_date: { title: 'Verificar Línea de Tiempo', pillar: 'Buscar Cobertura', tag: 'REGISTRO TEMPORAL' },
    cross_check_network: { title: 'Cruce con Agencias de Noticias', pillar: 'Investigar', tag: 'CABLE DE NOTICIAS' },
    inspect_metadata: { title: 'Inspeccionar EXIF y Geometría', pillar: 'Rastrear Contexto', tag: 'METADATOS / EXIF' },
    analyze_ai_artifacts: { title: 'Escaneo Forense de IA y Audio', pillar: 'Detectar Anomalías', tag: 'ESPECTROGRAMA IA' },
  },
  hi: {
    check_source: { title: 'स्रोत एवं WHOIS जांचें', pillar: 'रुकें और जांचें', tag: 'डोमेन विश्लेषण' },
    verify_date: { title: 'समय-सीमा एवं तारीखें जांचें', pillar: 'कवरेज खोजें', tag: 'समय रिकॉर्ड' },
    cross_check_network: { title: 'समाचार एजेंसियों से मिलान करें', pillar: 'पड़ताल करें', tag: 'समाचार वायर' },
    inspect_metadata: { title: 'EXIF एवं ज्यामिति जांचें', pillar: 'संदर्भ खोजें', tag: 'मेटाडेटा / EXIF' },
    analyze_ai_artifacts: { title: 'एआई एवं ऑडियो स्कैन', pillar: 'विकृतियां पहचानें', tag: 'एआई स्पेक्ट्रोग्राम' },
  },
  fr: {
    check_source: { title: 'Vérifier la Source et le WHOIS', pillar: 'Stopper et Vérifier', tag: 'TRACÉ DU DOMAINE' },
    verify_date: { title: 'Vérifier la Chronologie', pillar: 'Trouver une Couverture', tag: 'REGISTRE TEMPOREL' },
    cross_check_network: { title: 'Recouper avec les Agences', pillar: 'Enquêter', tag: 'DÉPÊCHES LATÉRALES' },
    inspect_metadata: { title: 'Inspecter les Métadonnées EXIF', pillar: 'Tracer le Contexte', tag: 'GÉOMÉTRIE / EXIF' },
    analyze_ai_artifacts: { title: 'Analyse Forensique IA & Audio', pillar: 'Repérer les Anomalies', tag: 'SPECTROGRAMME IA' },
  },
  ar: {
    check_source: { title: 'فحص المصrod وبيانات WHOIS', pillar: 'توقف وتحقق', tag: 'تتبع النطاق' },
    verify_date: { title: 'التحقق من التسلسل الزمني', pillar: 'البحث عن التغطية', tag: 'السجل الزمني' },
    cross_check_network: { title: 'التحقق المتقاطع مع وكالات الأنباء', pillar: 'تحقيق شامل', tag: 'الوكالات الإخبارية' },
    inspect_metadata: { title: 'فحص البيانات الوصفية EXIF', pillar: 'تتبع السياق', tag: 'بيانات الصورة' },
    analyze_ai_artifacts: { title: 'المسح الجنائي للذكاء الاصطناعي والصوت', pillar: 'كشف التزييف', tag: 'طيف الذكاء الاصطناعي' },
  },
  de: {
    check_source: { title: 'Quelle & WHOIS Prüfen', pillar: 'Stoppen & Prüfen', tag: 'DOMAIN-TRACE' },
    verify_date: { title: 'Zeitachse & Daten Prüfen', pillar: 'Berichterstattung Suchen', tag: 'ZEITLICHES PROTOKOLL' },
    cross_check_network: { title: 'Quervergleich mit Nachrichtenagenturen', pillar: 'Recherchieren', tag: 'AGENTURMELDUNGEN' },
    inspect_metadata: { title: 'EXIF & Bildgeometrie Prüfen', pillar: 'Kontext Verfolgen', tag: 'GEOMETRIE / EXIF' },
    analyze_ai_artifacts: { title: 'Forensischer KI- & Audioscan', pillar: 'Anomalien Erkennen', tag: 'KI-SPEKTROGRAMM' },
  },
  ja: {
    check_source: { title: '情報源・WHOISドメイン調査', pillar: '立ち止まって確認', tag: 'ドメイン追跡' },
    verify_date: { title: 'タイムライン・公開日照合', pillar: '他社の報道を探す', tag: '時系列記録' },
    cross_check_network: { title: '通信社ニュース横断照合', pillar: '深く調査する', tag: '通信社ワイヤー' },
    inspect_metadata: { title: 'EXIFメタデータ・構図鑑定', pillar: '文脈を辿る', tag: 'EXIF / 画像構造' },
    analyze_ai_artifacts: { title: 'AI生成GAN・音声波形スキャン', pillar: '不自然な痕跡を発見', tag: 'AIスペクトログラム' },
  },
};

// Localized deck names & categories
export const LOCALIZED_DECK_INFO: Record<SupportedLanguage, Record<RoundCategory, { name: string; tag: string }>> = {
  en: {
    source: { name: 'Source Integrity Deck', tag: '◆ SOURCE DECK' },
    evidence: { name: 'Evidence Authenticity Deck', tag: '▲ EVIDENCE DECK' },
    context: { name: 'Context & Framing Deck', tag: '⬟ CONTEXT DECK' },
    ai_manipulation: { name: 'AI & Synthesis Deck', tag: '✦ AI SYNTHESIS DECK' },
  },
  es: {
    source: { name: 'Mazo de Integridad de Fuente', tag: '◆ MAZO FUENTE' },
    evidence: { name: 'Mazo de Autenticidad de Evidencia', tag: '▲ MAZO EVIDENCIA' },
    context: { name: 'Mazo de Contexto y Enfoque', tag: '⬟ MAZO CONTEXTO' },
    ai_manipulation: { name: 'Mazo de IA y Síntesis', tag: '✦ MAZO IA SÍNTESIS' },
  },
  hi: {
    source: { name: 'स्रोत प्रमाणिकता डेक', tag: '◆ स्रोत डेक' },
    evidence: { name: 'साक्ष्य प्रमाणिकता डेक', tag: '▲ साक्ष्य डेक' },
    context: { name: 'संदर्भ एवं प्रस्तुति डेक', tag: '⬟ संदर्भ डेक' },
    ai_manipulation: { name: 'एआई एवं डिजिटल सिंथेसिस डेक', tag: '✦ एआई डेक' },
  },
  fr: {
    source: { name: 'Deck Intégrité de la Source', tag: '◆ DECK SOURCE' },
    evidence: { name: 'Deck Authenticité des Preuves', tag: '▲ DECK PREUVES' },
    context: { name: 'Deck Contexte et Cadrage', tag: '⬟ DECK CONTEXTE' },
    ai_manipulation: { name: 'Deck Synthèse et IA', tag: '✦ DECK IA SYNTHÈSE' },
  },
  ar: {
    source: { name: 'حزمة موثوقية المصدر', tag: '◆ حزمة المصدر' },
    evidence: { name: 'حزمة صحة الأدلة', tag: '▲ حزمة الأدلة' },
    context: { name: 'حزمة السياق والتأطير', tag: '⬟ حزمة السياق' },
    ai_manipulation: { name: 'حزمة الذكاء الاصطناعي والتزييف', tag: '✦ حزمة الذكاء الاصطناعي' },
  },
  de: {
    source: { name: 'Quellen-Integritäts-Deck', tag: '◆ QUELLEN-DECK' },
    evidence: { name: 'Evidenz-Authentizitäts-Deck', tag: '▲ EVIDENZ-DECK' },
    context: { name: 'Kontext- & Framing-Deck', tag: '⬟ KONTEXT-DECK' },
    ai_manipulation: { name: 'KI- & Synthese-Deck', tag: '✦ KI-SYNTHESE-DECK' },
  },
  ja: {
    source: { name: '情報源の真正性デッキ', tag: '◆ 情報源デッキ' },
    evidence: { name: '根拠データの確からしさデッキ', tag: '▲ 根拠デッキ' },
    context: { name: '文脈とフレーミングデッキ', tag: '⬟ 文脈デッキ' },
    ai_manipulation: { name: 'AI・合成メディア鑑定デッキ', tag: '✦ AI鑑定デッキ' },
  },
};

// Localized UNESCO MIL Themes Info
export const LOCALIZED_MIL_THEMES: Record<SupportedLanguage, Record<MILTheme, { title: string; shortDesc: string; unescoAlignment: string }>> = {
  en: {
    ai_and_mil: {
      title: 'AI & Generative Media Forensics',
      shortDesc: 'Innovative solutions addressing challenges posed by AI through MIL, synthetic GAN artifacts, and biometric voice-cloning detection.',
      unescoAlignment: 'Addressing AI challenges through Media & Information Literacy'
    },
    mil_education: {
      title: 'MIL Education & Open Pedagogy',
      shortDesc: 'Creative approaches to MIL learning in the digital age, gamified lateral reading, and institutional fact-checking curriculum.',
      unescoAlignment: 'Creative approaches to MIL learning in the digital age'
    },
    community_impact: {
      title: 'Community Impact & Crisis Integrity',
      shortDesc: 'MIL-based interventions that empower grassroots communities against disaster disinfo, public health panic, and local rumors.',
      unescoAlignment: 'MIL-based interventions that empower communities'
    },
    youth_engagement: {
      title: 'Youth Engagement & Peer Defense',
      shortDesc: 'Strategies to position youth organizations, student unions, and campus ambassadors as active MIL change agents.',
      unescoAlignment: 'Strategies to position youth organizations as MIL change agents'
    },
    open_track: {
      title: 'Open Track & Multi-Sensory Accessibility',
      shortDesc: 'Inclusive MIL solutions supporting screen readers, tactile representations, multimodal sign avatars, and multilingual access.',
      unescoAlignment: 'Other MIL-related ideas aligned with global inclusivity themes'
    }
  },
  es: {
    ai_and_mil: {
      title: 'Forense de IA y Medios Generativos',
      shortDesc: 'Soluciones innovadoras para los desafíos de la IA mediante AMI, detección de artefactos GAN y clonación de voz biométrica.',
      unescoAlignment: 'Afrontar los desafíos de la IA a través de la Alfabetización Mediática e Informacional'
    },
    mil_education: {
      title: 'Educación AMI y Pedagogía Abierta',
      shortDesc: 'Enfoques creativos para el aprendizaje de AMI en la era digital, lectura lateral gamificada y currículo de verificación.',
      unescoAlignment: 'Enfoques creativos para el aprendizaje de AMI en la era digital'
    },
    community_impact: {
      title: 'Impacto Comunitario e Integridad en Crisis',
      shortDesc: 'Intervenciones comunitarias contra desinformación en desastres, pánico sanitario y rumores locales.',
      unescoAlignment: 'Intervenciones basadas en AMI que empoderan a las comunidades'
    },
    youth_engagement: {
      title: 'Compromiso Juvenil y Defensa de Pares',
      shortDesc: 'Estrategias para posicionar a organizaciones juveniles y estudiantes como agentes de cambio AMI.',
      unescoAlignment: 'Estrategias para posicionar a las organizaciones juveniles como agentes de cambio AMI'
    },
    open_track: {
      title: 'Pista Abierta y Accesibilidad Multisensorial',
      shortDesc: 'Soluciones AMI inclusivas con lectores de pantalla, representaciones táctiles y avatares en lengua de señas.',
      unescoAlignment: 'Otras iniciativas alineadas con la inclusión y diversidad global'
    }
  },
  hi: {
    ai_and_mil: {
      title: 'एआई एवं जनरेटिव मीडिया फोरेंसिक',
      shortDesc: 'MIL के माध्यम से एआई चुनौतियों का समाधान, डीपफेक पहचान, और वॉयस क्लोनिंग डिटेक्शन।',
      unescoAlignment: 'मीडिया और सूचना साक्षरता के माध्यम से एआई चुनौतियों का समाधान'
    },
    mil_education: {
      title: 'MIL शिक्षा एवं मुक्त शिक्षण',
      shortDesc: 'डिजिटल युग में MIL सीखने के रचनात्मक तरीके, खेल आधारित तथ्य-जांच और शैक्षिक पाठ्यक्रम।',
      unescoAlignment: 'डिजिटल युग में MIL सीखने के नए एवं रचनात्मक दृष्टिकोण'
    },
    community_impact: {
      title: 'सामुदायिक प्रभाव एवं संकट में सत्यनिष्ठा',
      shortDesc: 'आपदा में भ्रामक सूचनाओं, स्वास्थ्य घोटालों और स्थानीय अफवाहों से समुदायों को सशक्त बनाना।',
      unescoAlignment: 'समुदायों को सशक्त बनाने वाले MIL आधारित हस्तक्षेप'
    },
    youth_engagement: {
      title: 'युवा नेतृत्व एवं सहकर्मी सुरक्षा',
      shortDesc: 'युवा संगठनों और छात्र समूहों को MIL परिवर्तन एजेंट के रूप में स्थापित करने की रणनीतियां।',
      unescoAlignment: 'युवा संगठनों को MIL परिवर्तन एजेंट बनाने की रणनीतियां'
    },
    open_track: {
      title: 'ओपन ट्रैक एवं बहु-संवेदी सुलभता',
      shortDesc: 'स्क्रीन रीडर, स्पर्श प्रतीक, सांकेतिक भाषा अवतार और बहुभाषी सुलभता का समर्थन।',
      unescoAlignment: 'वैश्विक समावेशिता और नवाचार से जुड़े अन्य विचार'
    }
  },
  fr: {
    ai_and_mil: {
      title: 'Forensique IA & Médias Génératifs',
      shortDesc: 'Solutions innovantes répondant aux défis posés par l\'IA grâce à l\'EMI et la détection de deepfakes.',
      unescoAlignment: 'Répondre aux défis de l\'IA grâce à l\'Éducation aux Médias et à l\'Information'
    },
    mil_education: {
      title: 'Éducation EMI & Pédagogie Ouverte',
      shortDesc: 'Approches créatives pour l\'apprentissage de l\'EMI à l\'ère numérique et la lecture latérale.',
      unescoAlignment: 'Approches créatives pour l\'apprentissage de l\'EMI à l\'ère numérique'
    },
    community_impact: {
      title: 'Impact Communautaire & Intégrité de Crise',
      shortDesc: 'Interventions locales pour protéger les communautés contre les rumeurs sanitaires et de crise.',
      unescoAlignment: 'Interventions basées sur l\'EMI pour autonomiser les communautés'
    },
    youth_engagement: {
      title: 'Engagement Jeunesse & Défense entre Pairs',
      shortDesc: 'Stratégies pour positionner les organisations de jeunesse comme moteurs de l\'EMI.',
      unescoAlignment: 'Stratégies pour positionner les organisations de jeunesse en agents du changement'
    },
    open_track: {
      title: 'Piste Ouverte & Accessibilité Multisensorielle',
      shortDesc: 'Solutions EMI inclusives avec prise en charge des lecteurs d\'écran et avatars en langue des signes.',
      unescoAlignment: 'Autres initiatives alignées sur l\'inclusion et la diversité mondiale'
    }
  },
  ar: {
    ai_and_mil: {
      title: 'الذكاء الاصطناعي والأدلة الجنائية الرقمية',
      shortDesc: 'حلول مبتكرة لمواجهة تحديات الذكاء الاصطناعي من خلال محو الأمية الإعلامية وكشف التزييف العميق.',
      unescoAlignment: 'معالجة تحديات الذكاء الاصطناعي من خلال محو الأمية الإعلامية والمعلوماتية'
    },
    mil_education: {
      title: 'التربية الإعلامية والتعليم المفتوح',
      shortDesc: 'مناهج تفاعلية لتعليم التربية الإعلامية والتحقق المتقاطع في العصر الرقمي.',
      unescoAlignment: 'مناهج مبتكرة لتعليم التربية الإعلامية في العصر الرقمي'
    },
    community_impact: {
      title: 'المجتمع والنزاهة في الأزمات',
      shortDesc: 'مبادرات لتمكين المجتمعات المحلية ضد الشائعات الصحية المضللة وأوقات الكوارث.',
      unescoAlignment: 'مبادرات قائمة على التربية الإعلامية لتمكين المجتمعات'
    },
    youth_engagement: {
      title: 'تمكين الشباب والمواطنة الرقمية',
      shortDesc: 'استراتيجيات لتمكين المنظمات الشبابية والطلاب كرواد تغيير في التحقق الإعلامي.',
      unescoAlignment: 'استراتيجيات لوضع منظمات الشباب كعوامل تغيير في التربية الإعلامية'
    },
    open_track: {
      title: 'المسار المفتوح والشمولية الحسية',
      shortDesc: 'حلول شاملة تدعم قارئات الشاشة والرموز اللمسية ولغة الإشارة والتعدد اللغوي.',
      unescoAlignment: 'أفكار ومبادرات أخرى متوافقة مع أهداف الشمولية العالمية'
    }
  },
  de: {
    ai_and_mil: {
      title: 'KI- & Generative Medienforensik',
      shortDesc: 'Innovative Lösungen für Herausforderungen durch KI mittels MIL, Erkennung von GAN-Artefakten und Stimmklonen.',
      unescoAlignment: 'Bewältigung von KI-Herausforderungen durch Medien- und Informationskompetenz'
    },
    mil_education: {
      title: 'MIL-Bildung & Offene Pädagogik',
      shortDesc: 'Kreative Ansätze zum Erlernen von MIL im digitalen Zeitalter, spielerisches Lateral Reading und Faktencheck-Methoden.',
      unescoAlignment: 'Kreative Ansätze für das Erlernen von MIL im digitalen Zeitalter'
    },
    community_impact: {
      title: 'Gemeinschaft & Krisenintegrität',
      shortDesc: 'MIL-basierte Maßnahmen zum Schutz lokaler Gemeinschaften vor Krisen-Desinformation und Gerüchten.',
      unescoAlignment: 'MIL-basierte Interventionen zur Stärkung von Gemeinschaften'
    },
    youth_engagement: {
      title: 'Jugendengagement & Peer-Defense',
      shortDesc: 'Strategien, um Jugendorganisationen und Studierende als MIL-Botschafter zu etablieren.',
      unescoAlignment: 'Strategien zur Positionierung von Jugendorganisationen als MIL-Wandler'
    },
    open_track: {
      title: 'Offener Track & Multisensorische Inklusion',
      shortDesc: 'Barrierefreie MIL-Lösungen mit Screenreader-Unterstützung, taktiler Symbolik und Gebärdensprach-Avataren.',
      unescoAlignment: 'Weitere MIL-Ideen im Einklang mit globalen Inklusionsthemen'
    }
  },
  ja: {
    ai_and_mil: {
      title: 'AIと生成メディアの真偽鑑定',
      shortDesc: 'MILを通じたAIの課題解決、GAN生成画像の痕跡検出、生体音声クローンの見破り。',
      unescoAlignment: 'メディア・情報リテラシーによるAI課題への対応'
    },
    mil_education: {
      title: 'MIL教育とオープンな学び',
      shortDesc: 'デジタル時代におけるMIL学習の創造的アプローチ、ゲーム感覚の横断照合、検証カリキュラム。',
      unescoAlignment: 'デジタル時代におけるMIL学習の創造的アプローチ'
    },
    community_impact: {
      title: 'コミュニティと危機時の情報誠実性',
      shortDesc: '災害デマ、健康デマ、地域デマから草の根コミュニティを守るMIL実践。',
      unescoAlignment: 'コミュニティを力づけるMILベースの実践'
    },
    youth_engagement: {
      title: '若者の主体性とピアファクトチェック',
      shortDesc: '若者団体や学生ネットワークをMILチェンジエージェントとして位置付ける戦略。',
      unescoAlignment: '若者組織をMIL変革の推進者として位置付ける戦略'
    },
    open_track: {
      title: 'オープントラック＆多感覚アクセシビリティ',
      shortDesc: 'スクリーンリーダー、触覚記号、手話アバター、多言語対応を備えたインクルーシブなMIL。',
      unescoAlignment: '世界的なインクルージョンと多様性に沿ったMILの取り組み'
    }
  },
};

// Localized Bot Personas
export const LOCALIZED_PERSONAS: Record<SupportedLanguage, Record<string, { name: string; roleTitle: string; description: string; debateStyle: string }>> = {
  en: {
    bot_aris: {
      name: 'Dr. Aris Vance',
      roleTitle: 'Senior Investigative Editor',
      description: 'Methodical and skeptical. Inspects domain registration age, editorial mastheads, and wire service syndication.',
      debateStyle: 'Asks probing questions regarding publisher provenance and press syndicate confirmation.'
    },
    bot_maya: {
      name: 'Maya Lin',
      roleTitle: 'Cyber & AI Forensics Analyst',
      description: 'Specializes in synthetic GAN artifacts, EXIF metadata tampering, audio spectral anomalies, and deepfakes.',
      debateStyle: 'Highlights pixel compression anomalies, earlobe warping, and audio waveform cadence.'
    },
    bot_brenda: {
      name: 'Brenda "Viral" Cole',
      roleTitle: 'Community Social Lead',
      description: 'Reacts quickly to sensational headlines, emotional triggers, and urgency cues; learns as clues are revealed.',
      debateStyle: 'Focuses on public resonance, viral reach, and emotional shock value before realizing discrepancies.'
    },
    bot_samir: {
      name: 'Samir Patel',
      roleTitle: 'University Data Scientist',
      description: 'Obsessed with sample sizes, statistical significance, cherry-picked baselines, and peer review status.',
      debateStyle: 'Dissects graphs with truncated y-axes and questions p-hacking or missing control groups.'
    },
    bot_chloe: {
      name: 'Chloe Moreau',
      roleTitle: 'Open-Source Intelligence (OSINT) Sleuth',
      description: 'Cross-examines timelines, reverse image sightings, geolocation landmarks, and translation drift.',
      debateStyle: 'Calls out recycled media from past years and mismatched weather or shadow angles.'
    }
  },
  es: {
    bot_aris: {
      name: 'Dr. Aris Vance',
      roleTitle: 'Editor de Investigación Senior',
      description: 'Metódico y escéptico. Inspecciona antigüedad del dominio, consejos editoriales y cables de agencias.',
      debateStyle: 'Formula preguntas incisivas sobre la procedencia de la editorial y confirmación de agencias.'
    },
    bot_maya: {
      name: 'Maya Lin',
      roleTitle: 'Analista Forense de Ciberseguridad e IA',
      description: 'Especialista en artefactos sintéticos GAN, metadatos EXIF, anomalías de audio y deepfakes.',
      debateStyle: 'Destaca artefactos de compresión, distorsión de texturas y cadencia de ondas sonoras.'
    },
    bot_brenda: {
      name: 'Brenda "Viral" Cole',
      roleTitle: 'Líder de Redes Comunitarias',
      description: 'Reacciona a titulares sensacionalistas y urgencia emocional; aprende al revelarse pistas.',
      debateStyle: 'Se enfoca en el impacto viral y la emoción antes de notar discrepancias lógicas.'
    },
    bot_samir: {
      name: 'Samir Patel',
      roleTitle: 'Científico de Datos Universitario',
      description: 'Enfocado en tamaño de muestra, significancia estadística y revisión por pares.',
      debateStyle: 'Analiza gráficos con ejes truncados y cuestiona la falta de grupos de control.'
    },
    bot_chloe: {
      name: 'Chloe Moreau',
      roleTitle: 'Detective de Inteligencia Abierta (OSINT)',
      description: 'Cruza cronologías, búsqueda inversa de imágenes, geolocalización y sombras.',
      debateStyle: 'Señala fotos recicladas de años anteriores e inconsistencias climáticas.'
    }
  },
  hi: {
    bot_aris: {
      name: 'डॉ. एरिस वेंस',
      roleTitle: 'वरिष्ठ खोजी संपादक',
      description: 'व्यवस्थित एवं संशयवादी। डोमेन आयु, संपादकीय बोर्ड और समाचार एजेंसियों के सिंडिकेशन की जांच करते हैं।',
      debateStyle: 'स्रोत की प्रामाणिकता और मुख्य समाचार एजेंसियों की पुष्टि पर सवाल उठाते हैं।'
    },
    bot_maya: {
      name: 'माया लिन',
      roleTitle: 'साइबर एवं एआई फोरेंसिक विशेषज्ञ',
      description: 'सिंथेटिक एआई विकृतियों, EXIF मेटाडेटा, ऑडियो स्पेक्ट्रम और डीपफेक जांच में माहिर।',
      debateStyle: 'पिक्सेल विसंगतियों, कृत्रिम त्वचा बनावट और ऑडियो तरंगों की ओर ध्यान दिलाती हैं।'
    },
    bot_brenda: {
      name: 'ब्रेंडा "वायरल" कोल',
      roleTitle: 'सोशल मीडिया कम्युनिटी लीड',
      description: 'सनसनीखेज सुर्खियों और तात्कालिकता पर तेजी से प्रतिक्रिया देती हैं; सुराग मिलने पर सीखती हैं।',
      debateStyle: 'शुरुआत में वायरल ट्रेंड्स पर ध्यान देती हैं, फिर विसंगतियों को समझती हैं।'
    },
    bot_samir: {
      name: 'समीर पटेल',
      roleTitle: 'डेटा वैज्ञानिक',
      description: 'नमूना आकार (Sample Size), सांख्यिकीय महत्व और पीयर रिव्यू पर ध्यान केंद्रित करते हैं।',
      debateStyle: 'भ्रामक ग्राफ, कटे हुए Y-अक्ष और नियंत्रण समूह की कमी पर सवाल उठाते हैं।'
    },
    bot_chloe: {
      name: 'क्लो मोरो',
      roleTitle: 'ओपन-सोर्स इंटेलिजेंस (OSINT) विश्लेषक',
      description: 'समय-सीमा, रिवर्स इमेज सर्च, भौगोलिक स्थिति और मौसम के मिलान की जांच करती हैं।',
      debateStyle: 'पुरानी तस्वीरों के पुनः उपयोग और छाया या मौसम की बेमेलता को उजागर करती हैं।'
    }
  },
  fr: {
    bot_aris: {
      name: 'Dr. Aris Vance',
      roleTitle: 'Rédacteur en Chef d\'Investigation',
      description: 'Méthodique et sceptique. Inspecte l\'âge des domaines WHOIS et la syndication des agences de presse.',
      debateStyle: 'Pose des questions incisives sur la réputation de l\'éditeur et la confirmation par les dépêches.'
    },
    bot_maya: {
      name: 'Maya Lin',
      roleTitle: 'Analyste en Cybercriminalité et Forensique IA',
      description: 'Spécialiste des artefacts GAN, métadonnées EXIF altérées et deepfakes vocaux.',
      debateStyle: 'Met en évidence la compression anormale des pixels et les anomalies d\'ondes sonores.'
    },
    bot_brenda: {
      name: 'Brenda "Viral" Cole',
      roleTitle: 'Responsable Communautaire Réseaux Sociaux',
      description: 'Réagit promptement aux titres sensationnels et aux déclencheurs émotionnels.',
      debateStyle: 'Se concentre sur la portée virale et l\'impact émotionnel avant de réaliser les incohérences.'
    },
    bot_samir: {
      name: 'Samir Patel',
      roleTitle: 'Data Scientist Universitaire',
      description: 'Obsédé par la taille des échantillons, la rigueur statistique et les revues par les pairs.',
      debateStyle: 'Décortique les graphiques aux axes tronqués et questionne l\'absence de groupe témoin.'
    },
    bot_chloe: {
      name: 'Chloe Moreau',
      roleTitle: 'Enquêtrice en Sources Ouvertes (OSINT)',
      description: 'Recoupe les chronologies, la recherche inversée d\'images et les repères géographiques.',
      debateStyle: 'Dénonce les médias recyclés d\'années passées et les ombres incohérentes.'
    }
  },
  ar: {
    bot_aris: {
      name: 'د. أريس فانس',
      roleTitle: 'محرر تحقيقات استقصائية أول',
      description: 'منهجي ومتشكك. يفحص عمر تسجيل النطاق والهيئة التحريرية والتوزيع الإخباري.',
      debateStyle: 'يطرح أسئلة استقصائية حول موثوقية الناشر وتأكيد وكالات الأنباء.'
    },
    bot_maya: {
      name: 'مايا لين',
      roleTitle: 'محللة الأدلة الجنائية الرقمية والذكاء الاصطناعي',
      description: 'متخصصة في كشف عيوب التوليد الاصطناعي، والبيانات الوصفية EXIF، والتزييف الصوتي.',
      debateStyle: 'تسلط الضوء على تشوهات البكسل وعيوب الترددات الصوتية.'
    },
    bot_brenda: {
      name: 'بريندا "فايرال" كول',
      roleTitle: 'مسؤولة التواصل الاجتماعي المجتمعي',
      description: 'تتفاعل بسرعة مع العناوين المثيرة والمشاعر اللحظية؛ وتتعلم مع كشف الأدلة.',
      debateStyle: 'تركز على الانتشار الفيروسي والتأثير العاطفي قبل إدراك التناقضات.'
    },
    bot_samir: {
      name: 'سمير باتيل',
      roleTitle: 'عالم بيانات جامعي',
      description: 'يركز على حجم العينات والدلالة الإحصائية ومراجعة الأقران العلمية.',
      debateStyle: 'يحلل الرسوم البيانية المبتورة ويشكك في غياب المجموعات الضابطة.'
    },
    bot_chloe: {
      name: 'كلوي مورو',
      roleTitle: 'محققة الاستخبارات مفتوحة المصدر (OSINT)',
      description: 'تفحص التسلسل الزمني والبحث العكسي عن الصور وتطابق الظلال والمواقع.',
      debateStyle: 'تكشف الصور ومقاطع الفيديو القديمة المعاد تدويرها وتناقضات الطقس.'
    }
  },
  de: {
    bot_aris: {
      name: 'Dr. Aris Vance',
      roleTitle: 'Leitender Investigativ-Redakteur',
      description: 'Methodisch und skeptisch. Prüft WHOIS-Domainalter, Impressum und Agenturmeldungen.',
      debateStyle: 'Stellt präzise Fragen zur Verlagsherkunft und Bestätigung durch Nachrichtenagenturen.'
    },
    bot_maya: {
      name: 'Maya Lin',
      roleTitle: 'Cyber- & KI-Forensik-Analystin',
      description: 'Spezialisiert auf synthetische GAN-Artefakte, manipulierte EXIF-Metadaten und Stimmklone.',
      debateStyle: 'Hebt Pixelverzerrungen, Texturanomalien und Tonkurven-Unregelmäßigkeiten hervor.'
    },
    bot_brenda: {
      name: 'Brenda "Viral" Cole',
      roleTitle: 'Community- & Social-Lead',
      description: 'Reagiert schnell auf emotionale Trigger und Dringlichkeitsmerkmale; lernt durch Hinweise dazu.',
      debateStyle: 'Betont virale Reichweite und emotionale Wirkung, bevor Unstimmigkeiten auffallen.'
    },
    bot_samir: {
      name: 'Samir Patel',
      roleTitle: 'Universitärer Datenwissenschaftler',
      description: 'Fokussiert auf Stichprobengrößen, statistische Signifikanz und Peer-Review-Status.',
      debateStyle: 'Zerlegt Diagramme mit abgeschnittenen Y-Achsen und hinterfragt Kontrollgruppen.'
    },
    bot_chloe: {
      name: 'Chloe Moreau',
      roleTitle: 'Open-Source-Intelligence (OSINT) Ermittlerin',
      description: 'Prüft Zeitachsen, Bild-Rückwärtssuche, Geodaten und Schattenwinkel.',
      debateStyle: 'Entlarvt recycelte Fotos vergangener Jahre und unpassende Wetterlagen.'
    }
  },
  ja: {
    bot_aris: {
      name: 'アリス・ヴァンス博士',
      roleTitle: '調査報道シニアエディター',
      description: '几帳面で批判的思考に長ける。ドメイン登録年月、編集方針、通信社配信を精査。',
      debateStyle: '発行元の真正性や大手通信社での裏付け確認について鋭い質問を投げかける。'
    },
    bot_maya: {
      name: 'マヤ・リン',
      roleTitle: 'サイバー・AIフォレンジック分析官',
      description: 'GAN生成物の痕跡、EXIFメタデータの改ざん、音声波形異常、ディープフェイク鑑定を専門とする。',
      debateStyle: '画素圧縮の不自然さ、皮膚テクスチャの歪み、音声波形の不自然な断絶を指摘する。'
    },
    bot_brenda: {
      name: 'ブレンダ・コール',
      roleTitle: 'ソーシャルコミュニティリード',
      description: 'センセーショナルな見出しや感情を刺激する投稿に素早く反応するが、証拠で冷静になる。',
      debateStyle: '最初は拡散力や社会的インパクトに注目するが、手がかりを見て矛盾に気づく。'
    },
    bot_samir: {
      name: 'サミール・パテル',
      roleTitle: 'データサイエンティスト',
      description: 'サンプルサイズ、統計的有意性、ベースラインの恣意的切り出し、査読状況を徹底検証。',
      debateStyle: 'Y軸が切り詰められたグラフや対照実験のない不完全な統計を論理的に分解する。'
    },
    bot_chloe: {
      name: 'クロエ・モロー',
      roleTitle: 'OSINT（オープンソース情報）捜査員',
      description: '時系列、画像逆引き検索、撮影地の地理情報、影の角度や気象条件を照合。',
      debateStyle: '過去の災害写真の使い回しや、季節と合わない影・天候の不一致を暴く。'
    }
  }
};

/**
 * Returns localized persona details
 */
export function getLocalizedPersona(persona: PlayerPersona, lang: SupportedLanguage): PlayerPersona {
  const dict = LOCALIZED_PERSONAS[lang] || LOCALIZED_PERSONAS.en;
  const match = dict[persona.id];
  if (!match) return persona;
  return {
    ...persona,
    name: match.name,
    roleTitle: match.roleTitle,
    personalityDescription: match.description,
    debateStyle: match.debateStyle,
  };
}

/**
 * Returns localized action label
 */
export function getLocalizedActionInfo(actionType: InvestigationActionType, lang: SupportedLanguage) {
  const dict = LOCALIZED_ACTION_NAMES[lang] || LOCALIZED_ACTION_NAMES.en;
  return dict[actionType] || LOCALIZED_ACTION_NAMES.en[actionType];
}

/**
 * Returns localized deck name
 */
export function getLocalizedDeckInfo(category: RoundCategory, lang: SupportedLanguage) {
  const dict = LOCALIZED_DECK_INFO[lang] || LOCALIZED_DECK_INFO.en;
  return dict[category] || LOCALIZED_DECK_INFO.en[category];
}

/**
 * Returns localized MIL theme info
 */
export function getLocalizedMILTheme(theme: MILTheme, lang: SupportedLanguage) {
  const dict = LOCALIZED_MIL_THEMES[lang] || LOCALIZED_MIL_THEMES.en;
  return dict[theme] || LOCALIZED_MIL_THEMES.en[theme];
}
