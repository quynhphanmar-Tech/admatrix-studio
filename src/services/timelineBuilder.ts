import {
  ScriptVariant,
  FootageAsset,
  ViralComment,
  VideoTimeline,
  TimelineClip,
  OverlayLayer,
  FootageTag,
  TransitionType,
  OverlayAnimation,
  OverlayType
} from '@/types/core';
import { findBestMatch } from './footageLibrary';

const FALLBACK_TAGS: Partial<Record<FootageTag, FootageTag>> = {
  PRODUCT_PACKSHOT: 'PRODUCT_HERO',
  PRODUCT_HERO: 'PRODUCT_IN_USE',
  TEXTURE_MACRO: 'PRODUCT_HERO',
  PERSON_FRUSTRATED: 'LIFESTYLE_AMBIENT',
  PERSON_HAPPY: 'LIFESTYLE_AMBIENT',
  UGC_TESTIMONIAL: 'PERSON_HAPPY',
  EXPERT_AUTHORITY: 'PERSON_HAPPY',
};

export function buildTimeline(
  script: ScriptVariant,
  assets: FootageAsset[],
  viralComment?: ViralComment
): VideoTimeline {
  const clips: TimelineClip[] = [];
  const overlays: OverlayLayer[] = [];

  // PROGRESS_BAR continuous
  overlays.push({
    type: 'PROGRESS_BAR',
    startSec: 0,
    endSec: script.totalDurationSec,
    content: '',
    position: { x: 0, y: 1270 },
    animation: 'NONE',
    style: { fontSize: 0, fontWeight: 'normal', color: '#fe2c55', bgColor: '#22d3ee' }
  });

  // CTA_BUTTON in last 5 seconds
  const ctaStart = Math.max(0, script.totalDurationSec - 5);
  overlays.push({
    type: 'CTA_BUTTON',
    startSec: ctaStart,
    endSec: script.totalDurationSec,
    content: 'MUA NGAY',
    position: { x: 360, y: 1100 }, // Centered roughly
    animation: 'SLIDE_UP',
    style: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', bgColor: '#fe2c55', borderRadius: 8 }
  });

  // VIRAL COMMENT if any (0-5s)
  if (viralComment) {
    overlays.push({
      type: 'COMMENT_STICKER',
      startSec: 0,
      endSec: 5,
      content: viralComment.text,
      position: { x: 360, y: 200 },
      animation: 'BOUNCE',
      style: { fontSize: 20, fontWeight: 'bold', color: '#000000', bgColor: '#ffffff', borderRadius: 12 }
    });
  }

  // BADGE
  overlays.push({
    type: 'BADGE',
    startSec: 0,
    endSec: script.totalDurationSec,
    content: script.label,
    position: { x: 360, y: 50 },
    animation: 'FADE_IN',
    style: { fontSize: 16, fontWeight: 'bold', color: '#22d3ee', bgColor: 'rgba(0,0,0,0.5)', borderRadius: 4 }
  });

  // Process each phase
  for (let i = 0; i < script.phases.length; i++) {
    const phase = script.phases[i];
    
    // Find footage
    let asset = findBestMatch(assets, phase.requiredFootageTag);
    if (!asset && FALLBACK_TAGS[phase.requiredFootageTag]) {
      asset = findBestMatch(assets, FALLBACK_TAGS[phase.requiredFootageTag]!);
    }
    
    // Default fallback if still no match
    if (!asset && assets.length > 0) {
      asset = assets[0];
    }

    if (asset) {
      const transition: TransitionType = i === 0 ? 'CUT' : 'CROSSFADE';
      clips.push({
        footageAssetId: asset.id,
        footageUrl: asset.url,
        footageType: asset.type,
        startOnTimelineSec: phase.startSec,
        durationSec: phase.durationSec,
        transition,
        kenBurns: asset.type === 'IMAGE' ? { startScale: 1, endScale: 1.1 } : undefined,
        playbackSpeed: 1,
      });
    }

    // Subtitle overlay
    if (phase.textOverlay) {
      const overlayType: OverlayType = phase.phaseType === 'HOOK' ? 'HOOK_TEXT' : 'SUBTITLE';
      const animation: OverlayAnimation = phase.phaseType === 'HOOK' ? 'BOUNCE' : 'FADE_IN';
      const color = phase.phaseType === 'HOOK' ? '#fe2c55' : '#ffffff';
      
      overlays.push({
        type: overlayType,
        startSec: phase.startSec,
        endSec: phase.endSec,
        content: phase.textOverlay,
        position: { x: 360, y: phase.phaseType === 'HOOK' ? 400 : 900 },
        animation,
        style: { fontSize: phase.phaseType === 'HOOK' ? 32 : 24, fontWeight: 'bold', color, bgColor: 'rgba(0,0,0,0.6)' }
      });
    }
  }

  return {
    scriptVariantId: script.id,
    totalDurationSec: script.totalDurationSec,
    resolution: { width: 720, height: 1280 },
    fps: 30,
    clips,
    overlays,
    audioTrack: {
      bgmStyle: 'TRENDING_TIKTOK',
      voiceoverScript: script.voiceoverScript
    }
  };
}
