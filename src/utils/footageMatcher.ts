import { FootageAsset, FootageTag, ScriptPhase } from '../types/core';

const TAG_FALLBACKS: Record<FootageTag, FootageTag[]> = {
  PRODUCT_HERO: ['PRODUCT_PACKSHOT', 'PRODUCT_IN_USE'],
  PRODUCT_IN_USE: ['PRODUCT_HERO', 'HANDS_UNBOX'],
  PRODUCT_PACKSHOT: ['PRODUCT_HERO', 'TEXTURE_MACRO'],
  TEXTURE_MACRO: ['PRODUCT_HERO', 'PRODUCT_IN_USE'],
  BEFORE_AFTER: ['PERSON_FRUSTRATED', 'PERSON_HAPPY'],
  PERSON_FRUSTRATED: ['LIFESTYLE_AMBIENT', 'BEFORE_AFTER'],
  PERSON_HAPPY: ['LIFESTYLE_AMBIENT', 'UGC_TESTIMONIAL'],
  HANDS_UNBOX: ['PRODUCT_IN_USE', 'PRODUCT_HERO'],
  LIFESTYLE_AMBIENT: ['PERSON_HAPPY', 'NATURE_INGREDIENT'],
  EXPERT_AUTHORITY: ['UGC_TESTIMONIAL', 'PERSON_HAPPY'],
  UGC_TESTIMONIAL: ['PERSON_HAPPY', 'LIFESTYLE_AMBIENT'],
  PET_CUTE: ['PET_BATH', 'LIFESTYLE_AMBIENT'],
  PET_BATH: ['PET_CUTE', 'PRODUCT_IN_USE'],
  NATURE_INGREDIENT: ['TEXTURE_MACRO', 'LIFESTYLE_AMBIENT'],
};

export function matchFootageToPhase(
  phase: ScriptPhase,
  assets: FootageAsset[],
  usedAssetIds: Set<string>
): FootageAsset | null {
  if (!assets || assets.length === 0) return null;

  // 1. Try exact match
  const exactMatches = assets.filter((a) => a.tags.includes(phase.requiredFootageTag));
  
  if (exactMatches.length > 0) {
    // 2. Prefer unused exact matches
    const unusedExact = exactMatches.filter((a) => !usedAssetIds.has(a.id));
    if (unusedExact.length > 0) {
      // 3. Prefer VIDEO over IMAGE
      const videoMatches = unusedExact.filter((a) => a.type === 'VIDEO');
      return videoMatches.length > 0 ? videoMatches[0] : unusedExact[0];
    }
    const videoExact = exactMatches.filter((a) => a.type === 'VIDEO');
    return videoExact.length > 0 ? videoExact[0] : exactMatches[0];
  }

  // 4. Try fallbacks
  const fallbacks = TAG_FALLBACKS[phase.requiredFootageTag] || [];
  for (const tag of fallbacks) {
    const fallbackMatches = assets.filter((a) => a.tags.includes(tag as FootageTag));
    if (fallbackMatches.length > 0) {
      const unusedFallback = fallbackMatches.filter((a) => !usedAssetIds.has(a.id));
      if (unusedFallback.length > 0) {
        const videoMatches = unusedFallback.filter((a) => a.type === 'VIDEO');
        return videoMatches.length > 0 ? videoMatches[0] : unusedFallback[0];
      }
      const videoFallback = fallbackMatches.filter((a) => a.type === 'VIDEO');
      return videoFallback.length > 0 ? videoFallback[0] : fallbackMatches[0];
    }
  }

  // 5. Any available unused asset
  const unused = assets.filter((a) => !usedAssetIds.has(a.id));
  if (unused.length > 0) {
    return unused[0];
  }

  // 6. Any asset
  return assets[0];
}

export function matchAllPhasesToFootage(
  phases: ScriptPhase[],
  assets: FootageAsset[]
): Map<number, FootageAsset | null> {
  const result = new Map<number, FootageAsset | null>();
  const usedAssetIds = new Set<string>();

  phases.forEach((phase, index) => {
    const matched = matchFootageToPhase(phase, assets, usedAssetIds);
    if (matched) {
      usedAssetIds.add(matched.id);
    }
    result.set(index, matched);
  });

  return result;
}
