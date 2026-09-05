import { FootageAsset, FootageTag, ScriptVariant, Category } from '@/types/core';

export interface FootageLibrary {
  assets: FootageAsset[];
}

export function createFootageLibrary(assets: FootageAsset[]): FootageLibrary {
  return { assets };
}

export function findBestMatch(assets: FootageAsset[], tag: FootageTag): FootageAsset | null {
  const matches = assets.filter(a => a.tags.includes(tag));
  if (matches.length === 0) return null;
  // Pick the first match or could add scoring logic based on resolution/duration
  return matches[0];
}

export function findAllMatches(assets: FootageAsset[], tag: FootageTag): FootageAsset[] {
  return assets.filter(a => a.tags.includes(tag));
}

export function findMissingTags(assets: FootageAsset[], scripts: ScriptVariant[]): FootageTag[] {
  const requiredTags = new Set<FootageTag>();
  for (const script of scripts) {
    for (const phase of script.phases) {
      requiredTags.add(phase.requiredFootageTag);
    }
  }

  const missingTags: FootageTag[] = [];
  const requiredTagsArray = Array.from(requiredTags);
  for (const tag of requiredTagsArray) {
    if (!findBestMatch(assets, tag)) {
      missingTags.push(tag);
    }
  }

  return missingTags;
}

export function generateSearchQueries(missingTags: FootageTag[], category: Category): Record<FootageTag, string[]> {
  const categoryContext: Record<Category, string> = {
    COSMETICS: 'beauty skincare makeup',
    PET_SUPPLIES: 'pet dog cat puppy',
    EDUCATION: 'study student classroom',
    FASHION: 'clothing style fashion',
    TECH: 'technology gadget smartphone',
    HOME: 'home decor interior'
  };

  const context = categoryContext[category];
  const queries: Record<FootageTag, string[]> = {} as Record<FootageTag, string[]>;

  const tagKeywords: Record<FootageTag, string[]> = {
    PRODUCT_HERO: ['product shot', 'item display', 'clean background product'],
    PRODUCT_IN_USE: ['using product', 'applying', 'hands on'],
    PRODUCT_PACKSHOT: ['packaging', 'box', 'label'],
    TEXTURE_MACRO: ['macro texture', 'close up material', 'detailed surface'],
    BEFORE_AFTER: ['transformation', 'comparison', 'change'],
    PERSON_FRUSTRATED: ['frustrated person', 'stressed', 'sad face'],
    PERSON_HAPPY: ['happy person', 'smiling', 'satisfied customer'],
    HANDS_UNBOX: ['unboxing', 'opening package', 'hands opening'],
    LIFESTYLE_AMBIENT: ['lifestyle aesthetic', 'cozy ambient', 'daily life'],
    EXPERT_AUTHORITY: ['professional', 'doctor', 'expert speaking'],
    UGC_TESTIMONIAL: ['selfie video talking', 'review', 'vlog style'],
    PET_CUTE: ['cute dog', 'playing cat', 'funny pet'],
    PET_BATH: ['washing dog', 'pet bath', 'grooming'],
    NATURE_INGREDIENT: ['natural ingredients', 'leaves', 'fresh herbs']
  };

  for (const tag of missingTags) {
    const baseKeywords = tagKeywords[tag] || [tag.toLowerCase().replace('_', ' ')];
    queries[tag] = baseKeywords.map(kw => `${context} ${kw}`);
  }

  return queries;
}
