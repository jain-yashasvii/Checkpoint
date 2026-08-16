import { InformationCard, CardHint, InvestigationActionType } from '../types/game';

/**
 * Returns structured 3-tier forensic hints for any InformationCard.
 * Tier 1: Guiding Question & SIFT Angle (Gentle nudge)
 * Tier 2: Recommended Investigation Vector & Clue Lead (Direct action suggestion)
 * Tier 3: Forensic Detail Spotlight (Points to specific artifact/discrepancy)
 */
export function getCardHints(card: InformationCard): CardHint[] {
  if (card.hints && card.hints.length >= 3) {
    return card.hints;
  }

  const category = card.roundCategory;
  const domain = card.allegedSource.domain;
  const mediaType = card.attachedMedia.type;

  // Custom hint generations based on card specifics
  const hints: CardHint[] = [];

  // --- TIER 1: Guiding SIFT Question ---
  if (category === 'source') {
    hints.push({
      level: 1,
      title: 'Lateral Domain & Masthead Inspection',
      hintText: `Look closely at the domain name "${domain}" and the publication details. Does this match official organizational web addresses (.org / .edu / .gov vs .co / .net / .biz)?`,
      recommendedVector: 'check_source',
      siftTip: 'SIFT Principle: Stop & Check the source masthead, registrar age, and credentials before trusting the claim.'
    });
  } else if (category === 'evidence') {
    hints.push({
      level: 1,
      title: 'Data & Methodology Scrutiny',
      hintText: 'Inspect the stated methodology and numbers carefully. Look at the chart axes, sample size, or funding sources mentioned.',
      recommendedVector: 'inspect_metadata',
      siftTip: 'SIFT Principle: Trace claims back to the primary peer-reviewed dataset or raw statistical methodology.'
    });
  } else if (category === 'context') {
    hints.push({
      level: 1,
      title: 'Timeline & Geographical Context',
      hintText: `Verify whether this event actually took place on ${card.publicationDate}. Is the visual imagery recent, or recycled from an older disaster or past event?`,
      recommendedVector: 'verify_date',
      siftTip: 'SIFT Principle: Find trusted independent news wire coverage to corroborate matching time and location.'
    });
  } else {
    // ai_manipulation
    hints.push({
      level: 1,
      title: 'Synthetic Generation Signatures',
      hintText: 'Inspect anatomical features, specular reflections, background textures, or audio frequency cutoffs for AI generation anomalies.',
      recommendedVector: 'analyze_ai_artifacts',
      siftTip: 'SIFT Principle: Examine generative AI artifact boundaries, symmetrical lighting consistency, and biometric realism.'
    });
  }

  // --- TIER 2: Recommended Vector & Cross-Check Action ---
  let recommendedVector: InvestigationActionType = 'cross_check_network';
  let vectorDesc = '';

  if (category === 'source') {
    recommendedVector = 'check_source';
    vectorDesc = 'Spend a token on "Check Source & WHOIS" or "Cross-Check News Wires". Check if reputable global fact-checking networks or major news agencies have reported on this announcement.';
  } else if (category === 'evidence') {
    recommendedVector = 'inspect_metadata';
    vectorDesc = 'Spend a token on "Inspect EXIF & Geometry" to audit chart baselines or inspect document metadata for truncated axes or lack of control groups.';
  } else if (category === 'context') {
    recommendedVector = 'verify_date';
    vectorDesc = 'Spend a token on "Verify Timeline & Dates" to check historical news archives and satellite / geolocation records.';
  } else {
    recommendedVector = 'analyze_ai_artifacts';
    vectorDesc = 'Spend a token on "Analyze AI & GAN Artifacts" to run spectral audio analysis or diffusion pixel noise inspection.';
  }

  const crossCheckQuestion = card.suggestedCrossCheckQuestions?.[0] || 'Has this claim been independently replicated by accredited international wires?';

  hints.push({
    level: 2,
    title: 'Actionable Cross-Check Strategy',
    hintText: `${vectorDesc} Key question to ask during cross-examination: "${crossCheckQuestion}"`,
    recommendedVector,
    siftTip: 'SIFT Principle: Investigate the source network laterally rather than staying on the claim page.'
  });

  // --- TIER 3: Specific Forensic Detail Spotlight ---
  let tier3Title = 'Forensic Anomaly Spotlight';
  let tier3Text = '';

  if (card.attachedMedia.visualArtifactHints && card.attachedMedia.visualArtifactHints.length > 0) {
    tier3Text = `Key visual red flags to scrutinize in the evidence attachment: ${card.attachedMedia.visualArtifactHints.join('; ')}.`;
  } else if (card.attachedMedia.chartData) {
    tier3Text = `Examine the chart carefully: check if the baseline starts at zero or if the vertical Y-axis has been truncated to exaggerate minor percentage shifts.`;
  } else if (mediaType === 'audio') {
    tier3Text = `Listen to the audio waveform cadence: notice whether there are natural breathing pauses, room reverberations, or unnatural 8kHz spectral frequency cutoffs typical of voice cloning.`;
  } else {
    tier3Text = `Compare the headline urgency against established scientific or institutional consensus: claims creating artificial panic or offering instant rewards with countdown timers often indicate phishing or deceptive framing.`;
  }

  hints.push({
    level: 3,
    title: tier3Title,
    hintText: tier3Text,
    recommendedVector,
    siftTip: 'SIFT Principle: Trace evidence back to the original context and verify multi-source corroboration.'
  });

  return hints;
}
