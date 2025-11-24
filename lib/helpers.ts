import type { PDFSettings } from "@/types/notion-resume";

// mm → px 변환 (96dpi 기준)
export const MM_TO_PX = 96 / 25.4;

export function getPageMm(settings: PDFSettings) {
  const isA4 = settings.pageSize === "a4";
  const isLetter = settings.pageSize === "letter";
  const portrait = settings.orientation === "portrait";

  const w = isA4 ? 210 : isLetter ? 215.9 : 215.9; // legal width = letter
  const h = isA4 ? 297 : isLetter ? 279.4 : 355.6;

  return portrait ? { w, h } : { w: h, h: w };
}

export function mmToPx(mm: number, scale: number) {
  return mm * MM_TO_PX * scale;
}

export function safeNumber(v: any, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
