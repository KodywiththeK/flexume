export const MM_TO_PX = 96 / 25.4; // 96dpi 기준

export function getPageMm(settings: {
  pageSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";
}) {
  const base = (() => {
    switch (settings.pageSize) {
      case "a4":
        return { w: 210, h: 297 };
      case "letter":
        return { w: 215.9, h: 279.4 };
      case "legal":
        return { w: 215.9, h: 355.6 };
      default:
        return { w: 210, h: 297 };
    }
  })();

  if (settings.orientation === "landscape") {
    return { w: base.h, h: base.w };
  }
  return base;
}

export function mmToPx(mm: number) {
  return mm * MM_TO_PX;
}

export function getContentPx(settings: {
  margins: { top: number; right: number; bottom: number; left: number };
  pageSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";
  footerGapMm?: number;
  footerFontSize?: number;
}) {
  const { w, h } = getPageMm(settings);

  const pageWpx = mmToPx(w);
  const pageHpx = mmToPx(h);

  const padTopPx = mmToPx(settings.margins.top);
  const padRightPx = mmToPx(settings.margins.right);
  const padBottomPx = mmToPx(settings.margins.bottom);
  const padLeftPx = mmToPx(settings.margins.left);

  // ✅ 꼬리말 영역(콘텐츠에서 제외)
  const footerGapPx = mmToPx(settings.footerGapMm ?? 6);
  const footerFontPx = (settings.footerFontSize ?? 10) * (96 / 72); // pt -> px 근사
  const footerAreaPx = footerGapPx + footerFontPx + 4; // 약간의 여유

  const contentWpx = pageWpx - padLeftPx - padRightPx;
  const contentHpx = pageHpx - padTopPx - padBottomPx - footerAreaPx;

  return {
    pageWpx,
    pageHpx,
    contentWpx,
    contentHpx,
    padTopPx,
    padRightPx,
    padBottomPx,
    padLeftPx,
    footerAreaPx,
  };
}
