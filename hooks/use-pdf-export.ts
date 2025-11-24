"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type {
  ManualPageBreakOverrides,
  NotionResume,
  PDFSettings,
} from "@/types/notion-resume";
import { getPageMm } from "@/lib/helpers";
import { buildAutoBreaksPx, mergeAutoWithOverrides } from "@/lib/page-breaks";

type ExportArgs = {
  resumeRef: React.RefObject<HTMLDivElement | null>;
  notionResume: NotionResume;
  pdfSettings: PDFSettings;
  manualOverrides: ManualPageBreakOverrides;
  onSuccess?: () => void;
};

export function usePdfExport() {
  const exportPdf = async ({
    resumeRef,
    notionResume,
    pdfSettings,
    manualOverrides,
    onSuccess,
  }: ExportArgs) => {
    if (!resumeRef.current) return;

    const settings = pdfSettings;
    const pageMm = getPageMm(settings);
    const pageWidthMm = pageMm.w;
    const pageHeightMm = pageMm.h;

    const contentWmm =
      pageWidthMm - settings.margins.left - settings.margins.right;
    const contentHmm =
      pageHeightMm - settings.margins.top - settings.margins.bottom;

    const pdf = new jsPDF({
      orientation: settings.orientation,
      unit: "mm",
      format: settings.pageSize,
    });

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2 * settings.scale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      imageTimeout: 0,
      allowTaint: true,
    });

    const fullWpx = canvas.width;
    const fullHpx = canvas.height;

    const mmPerPx = contentWmm / fullWpx;
    const contentHpx = contentHmm / mmPerPx;

    const autoBreaksPx = buildAutoBreaksPx(fullHpx, contentHpx);

    // ✅ Preview와 같은 merge (인덱스 유지)
    const breaksPx = mergeAutoWithOverrides(
      autoBreaksPx,
      manualOverrides,
      fullHpx
    );

    const pageCount = Math.max(1, breaksPx.length + 1);

    const footerEnabled = settings.footer?.enabled ?? false;
    const footerText = settings.footer?.text ?? "";
    const footerAlign = settings.footer?.align ?? "center";
    const showNums = settings.showPageNumbers ?? true;

    const drawFooter = (pageIndex: number) => {
      if (!footerEnabled && !showNums) return;

      pdf.setFontSize(9);
      pdf.setTextColor(102);

      const yMm = pageHeightMm - Math.max(6, settings.margins.bottom - 6);

      let xMm = pageWidthMm / 2;
      if (footerAlign === "left") xMm = settings.margins.left;
      if (footerAlign === "right") xMm = pageWidthMm - settings.margins.right;

      const parts: string[] = [];
      if (footerEnabled && footerText) parts.push(footerText);
      if (showNums) parts.push(`${pageIndex + 1} / ${pageCount}`);

      pdf.text(parts.join("  "), xMm, yMm, {
        align:
          footerAlign === "left"
            ? "left"
            : footerAlign === "right"
            ? "right"
            : "center",
      });
    };

    const getSliceRange = (pageIndex: number) => {
      const start = pageIndex === 0 ? 0 : breaksPx[pageIndex - 1];
      const end = pageIndex < breaksPx.length ? breaksPx[pageIndex] : fullHpx;
      return { start, end };
    };

    for (let i = 0; i < pageCount; i++) {
      if (i > 0) pdf.addPage();

      const { start, end } = getSliceRange(i);
      const sy = Math.floor(start);
      const sh = Math.max(1, Math.floor(end - start));

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = fullWpx;
      sliceCanvas.height = sh;

      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) continue;

      ctx.drawImage(canvas, 0, sy, fullWpx, sh, 0, 0, fullWpx, sh);

      const sliceImg = sliceCanvas.toDataURL("image/jpeg", 0.95);
      const sliceHmm = sh * mmPerPx;

      pdf.addImage(
        sliceImg,
        "JPEG",
        settings.margins.left,
        settings.margins.top,
        contentWmm,
        sliceHmm
      );

      drawFooter(i);
    }

    pdf.save(`${notionResume.title || "notion-resume"}.pdf`);
    onSuccess?.();
  };

  return { exportPdf };
}
