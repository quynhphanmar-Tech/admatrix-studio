import { ABTestVariant, ARCHETYPE_LABELS } from '@/types/core';

export function calculateCTR(impressions: number, clicks: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

export function calculateCVR(clicks: number, conversions: number): number {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;
}

export function calculateCPA(spend: number, conversions: number): number {
  if (conversions === 0) return 0;
  return spend / conversions;
}

export function calculateROAS(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return revenue / spend;
}

export function findWinner(variants: ABTestVariant[]): ABTestVariant | null {
  if (variants.length === 0) return null;
  
  let winner: ABTestVariant | null = null;
  let maxRoas = -1;

  for (const variant of variants) {
    if (variant.metrics.conversions > 0 && variant.roas > maxRoas) {
      maxRoas = variant.roas;
      winner = variant;
    }
  }

  return winner;
}

export function generateInsight(variants: ABTestVariant[]): string {
  const winner = findWinner(variants);
  if (!winner) {
    return 'Chưa có đủ dữ liệu chuyển đổi để đưa ra kết luận. Hãy tiếp tục chạy chiến dịch.';
  }

  // Find the worst variant for comparison
  let loser = variants[0];
  let minRoas = Infinity;
  for (const variant of variants) {
    if (variant.roas < minRoas) {
      minRoas = variant.roas;
      loser = variant;
    }
  }

  if (winner.scriptVariantId === loser.scriptVariantId) {
    return `Script ${winner.label} đang dẫn đầu với ROAS ${winner.roas.toFixed(2)}. Đề xuất tiếp tục scale budget.`;
  }

  const roasRatio = (winner.roas / (loser.roas || 1)).toFixed(1);
  return `Hook dạng ${winner.label} outperform ${roasRatio}x so với ${loser.label}. Đề xuất: Scale budget cho Script ${winner.scriptVariantId}.`;
}
