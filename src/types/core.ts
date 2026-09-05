// ═══════════════════════════════════════════════════════════════
// AdMatrix v2 — Core Type Definitions
// Pipeline: Deconstruct → 12 Scripts → Footage → Assembly → A/B
// ═══════════════════════════════════════════════════════════════

// ────────────────────── FOOTAGE SYSTEM ──────────────────────

export type FootageTag =
  | 'PRODUCT_HERO'
  | 'PRODUCT_IN_USE'
  | 'PRODUCT_PACKSHOT'
  | 'TEXTURE_MACRO'
  | 'BEFORE_AFTER'
  | 'PERSON_FRUSTRATED'
  | 'PERSON_HAPPY'
  | 'HANDS_UNBOX'
  | 'LIFESTYLE_AMBIENT'
  | 'EXPERT_AUTHORITY'
  | 'UGC_TESTIMONIAL'
  | 'PET_CUTE'
  | 'PET_BATH'
  | 'NATURE_INGREDIENT';

export const FOOTAGE_TAG_LABELS: Record<FootageTag, string> = {
  PRODUCT_HERO: '📦 Sản phẩm chính diện',
  PRODUCT_IN_USE: '🤲 Đang sử dụng',
  PRODUCT_PACKSHOT: '🏷️ Bao bì & Label',
  TEXTURE_MACRO: '🔬 Cận cảnh texture',
  BEFORE_AFTER: '🔄 Trước & Sau',
  PERSON_FRUSTRATED: '😟 Người lo lắng',
  PERSON_HAPPY: '😊 Người vui vẻ',
  HANDS_UNBOX: '📤 Unbox / Mở hộp',
  LIFESTYLE_AMBIENT: '🏠 Lifestyle',
  EXPERT_AUTHORITY: '👨‍⚕️ Chuyên gia',
  UGC_TESTIMONIAL: '📱 Review khách hàng',
  PET_CUTE: '🐶 Thú cưng dễ thương',
  PET_BATH: '🛁 Tắm thú cưng',
  NATURE_INGREDIENT: '🌿 Thành phần tự nhiên',
};

export interface FootageAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  source: 'USER_UPLOAD' | 'PEXELS' | 'PIXABAY';
  url: string;
  thumbnailUrl: string;
  tags: FootageTag[];
  durationSec?: number;
  width: number;
  height: number;
  license: string;
  fileName?: string;
  detectedObjects?: string[];
  detectedMood?: string;
  detectedScene?: string;
}

// ────────────────────── SCRIPT DECONSTRUCTION ──────────────────────

export type PhaseType = 'HOOK' | 'PROBLEM' | 'SOLUTION' | 'DEMO' | 'PROOF' | 'CTA'
  | 'TURNING' | 'RESULT' | 'STEP_1' | 'STEP_2' | 'STEP_3'
  | 'MORNING' | 'EVENING' | 'EXPLAIN' | 'MECHANISM' | 'COMPARE'
  | 'ANSWER' | 'SETUP' | 'STOCK' | 'BONUS' | 'TOTAL'
  | 'DAY1' | 'DAY7' | 'REVEAL' | 'CONTRAST' | 'PROCESS'
  | 'AFTER' | 'RECOMMEND' | 'GUARANTEE' | 'SCIENCE'
  | 'USER1' | 'USER2' | 'USER3' | 'COMPILATION'
  | 'ITEM1' | 'ITEM2' | 'ITEM3' | 'PRODUCT' | 'DATA';

export interface ScriptPhase {
  phaseType: PhaseType;
  label: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  spokenText: string;
  visualDescription: string;
  textOverlay: string;
  cameraWork: string;
  emotionBeat: string;
  requiredFootageTag: FootageTag;
}

export interface ViralComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  likes: string;
  type: 'OBJECTION' | 'PRAISE' | 'QUESTION' | 'FUNNY';
  selectedAsHook?: boolean;
}

export interface DeconstructedScript {
  sourceVideoUrl: string;
  sourceTitle: string;
  totalDurationSec: number;
  phases: ScriptPhase[];
  primaryJTBD: string;
  targetEmotion: string;
  objections: string[];
  proofMechanisms: string[];
  viralComments: ViralComment[];
  audioMood: 'UPBEAT' | 'EMOTIONAL' | 'ASMR' | 'DRAMATIC';
  pacing: 'FAST_CUT' | 'SLOW_REVEAL' | 'RHYTHMIC';
}

// ────────────────────── 12-SCRIPT MATRIX ──────────────────────

export type ScriptArchetype =
  | 'PAIN_POINT_EMOTIONAL'
  | 'STAT_SHOCK_RATIONAL'
  | 'COMMENT_REPLY_SOCIAL'
  | 'BEFORE_AFTER_TRANSFORM'
  | 'TUTORIAL_HOWTO'
  | 'POV_DAY_IN_LIFE'
  | 'EXPERT_AUTHORITY'
  | 'INGREDIENT_DEEPDIVE'
  | 'UGC_MASHUP'
  | 'SCARCITY_FOMO'
  | 'VALUE_STACK'
  | 'CHALLENGE_DARE';

export const ARCHETYPE_LABELS: Record<ScriptArchetype, { vi: string; emoji: string; color: string }> = {
  PAIN_POINT_EMOTIONAL: { vi: 'Nỗi Đau Cảm Xúc', emoji: '😢', color: '#ef4444' },
  STAT_SHOCK_RATIONAL: { vi: 'Số Liệu Sốc', emoji: '📊', color: '#3b82f6' },
  COMMENT_REPLY_SOCIAL: { vi: 'Trả Lời Comment', emoji: '💬', color: '#8b5cf6' },
  BEFORE_AFTER_TRANSFORM: { vi: 'Trước & Sau', emoji: '✨', color: '#10b981' },
  TUTORIAL_HOWTO: { vi: 'Hướng Dẫn Sử Dụng', emoji: '📝', color: '#f59e0b' },
  POV_DAY_IN_LIFE: { vi: 'POV Ngày Thường', emoji: '👀', color: '#ec4899' },
  EXPERT_AUTHORITY: { vi: 'Chuyên Gia Khuyên Dùng', emoji: '👨‍⚕️', color: '#06b6d4' },
  INGREDIENT_DEEPDIVE: { vi: 'Phân Tích Thành Phần', emoji: '🔬', color: '#84cc16' },
  UGC_MASHUP: { vi: 'Tổng Hợp Review', emoji: '📱', color: '#f97316' },
  SCARCITY_FOMO: { vi: 'Khẩn Cấp FOMO', emoji: '⏰', color: '#dc2626' },
  VALUE_STACK: { vi: 'Combo Giá Trị', emoji: '💰', color: '#eab308' },
  CHALLENGE_DARE: { vi: 'Thử Thách 7 Ngày', emoji: '🎯', color: '#14b8a6' },
};

export interface ScriptVariant {
  id: string;
  index: number;
  archetype: ScriptArchetype;
  label: string;
  hookStrategy: string;
  storyArc: string;
  proofType: string;
  ctaMechanism: string;
  phases: ScriptPhase[];
  totalDurationSec: number;
  voiceoverScript: string;
  caption: string;
  hashtags: string[];
  estimatedCTR: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ────────────────────── VIDEO TIMELINE ──────────────────────

export type TransitionType = 'CUT' | 'CROSSFADE' | 'SLIDE_LEFT' | 'ZOOM_IN' | 'GLITCH';
export type OverlayAnimation = 'FADE_IN' | 'SLIDE_UP' | 'BOUNCE' | 'TYPEWRITER' | 'NONE';
export type OverlayType = 'HOOK_TEXT' | 'SUBTITLE' | 'BADGE' | 'COMMENT_STICKER' | 'CTA_BUTTON' | 'PROGRESS_BAR';

export interface TimelineClip {
  footageAssetId: string;
  footageUrl: string;
  footageType: 'IMAGE' | 'VIDEO';
  startOnTimelineSec: number;
  durationSec: number;
  sourceStartSec?: number;
  transition: TransitionType;
  kenBurns?: { startScale: number; endScale: number };
  playbackSpeed?: number;
  colorGrade?: 'WARM' | 'COOL' | 'HIGH_CONTRAST' | 'VINTAGE';
}

export interface OverlayLayer {
  type: OverlayType;
  startSec: number;
  endSec: number;
  content: string;
  position: { x: number; y: number };
  animation: OverlayAnimation;
  style: {
    fontSize: number;
    fontWeight: string;
    color: string;
    bgColor?: string;
    borderRadius?: number;
  };
}

export interface VideoTimeline {
  scriptVariantId: string;
  totalDurationSec: number;
  resolution: { width: number; height: number };
  fps: number;
  clips: TimelineClip[];
  overlays: OverlayLayer[];
  audioTrack: {
    bgmStyle: string;
    voiceoverScript: string;
  };
}

// ────────────────────── A/B TEST ──────────────────────

export interface ABTestMetrics {
  impressions: number;
  views: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
}

export interface ABTestVariant {
  scriptVariantId: string;
  archetype: ScriptArchetype;
  label: string;
  videoExported: boolean;
  metrics: ABTestMetrics;
  ctr: number;
  cvr: number;
  cpa: number;
  roas: number;
}

export interface ABTestCampaign {
  id: string;
  name: string;
  productName: string;
  createdAt: string;
  variants: ABTestVariant[];
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED';
  winnerVariantId?: string;
}

// ────────────────────── GENERATION CONFIG ──────────────────────

export type Category = 'COSMETICS' | 'PET_SUPPLIES' | 'EDUCATION' | 'FASHION' | 'TECH' | 'HOME';

export interface GenerationConfig {
  productName: string;
  productBenefit: string;
  category: Category;
  commentInsight?: string;
  sourceScript: DeconstructedScript;
}

// ────────────────────── PEXELS API RESPONSE ──────────────────────

export interface PexelsVideo {
  id: number;
  url: string;
  image: string;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
  }>;
  user: {
    name: string;
    url: string;
  };
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

export interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  width: number;
  height: number;
}

export interface PexelsPhotoSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  photos: PexelsPhoto[];
}
