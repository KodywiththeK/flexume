// "@/lib/page-breaks"
import type { ManualPageBreakOverrides } from "@/types/notion-resume";

/**
 * 1) 자동 breaks(= 페이지 높이 기반) 생성
 */
export function buildAutoBreaksPx(totalHeightPx: number, contentHpx: number) {
  if (totalHeightPx <= 0 || contentHpx <= 0) return [];
  const breaks: number[] = [];
  let cursor = contentHpx;
  while (cursor < totalHeightPx) {
    breaks.push(cursor);
    cursor += contentHpx;
  }
  return breaks;
}

/**
 * 2) auto + overrides를 '페이지 인덱스 순서'로 merge
 *    - 절대 "값 기준 sort" 하지 않는다.
 *    - 각 break i는 (prevBreak, nextBaseline) 사이로 clamp
 *    - overrides가 auto보다 길면 페이지 수가 늘어날 수 있도록 len 확장
 */
export function mergeAutoWithOverrides(
  autoBreaksPx: number[],
  overrides: ManualPageBreakOverrides,
  totalHeightPx: number,
  minGapPx = 12
) {
  if (!overrides) return autoBreaksPx;

  const overrideIdxs = Object.keys(overrides).map(Number);
  const maxOverrideIdx =
    overrideIdxs.length > 0 ? Math.max(...overrideIdxs) : -1;

  const len = Math.max(autoBreaksPx.length, maxOverrideIdx + 1);

  const merged: number[] = [];
  let prev = 0;

  for (let i = 0; i < len; i++) {
    const baseline = overrides[i] ?? autoBreaksPx[i];

    // baseline이 없으면(= auto도 없고 override도 없음) 더 이상 break 없음
    if (typeof baseline !== "number") break;

    const nextBaseline =
      overrides[i + 1] ?? autoBreaksPx[i + 1] ?? totalHeightPx;

    const minY = prev + minGapPx;
    const maxY = nextBaseline - minGapPx;

    // clamp
    const clamped = Math.min(Math.max(baseline, minY), maxY);

    // 전체 높이 안전 clamp
    const safe = Math.min(Math.max(clamped, 1), totalHeightPx - 1);

    merged.push(safe);
    prev = safe;
  }

  return merged;
}
