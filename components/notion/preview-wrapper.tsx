"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import type {
  ManualPageBreakOverrides,
  PDFSettings,
} from "@/types/notion-resume";
import { MM_TO_PX, getPageMm, mmToPx } from "@/lib/helpers";
import { buildAutoBreaksPx, mergeAutoWithOverrides } from "@/lib/page-breaks";

type HoverLine = {
  pageIndex: number; // break index
  yInPage: number;
  globalY: number;
  percentInPage: number;
};

type Props = {
  settings: PDFSettings;
  globalStyle: React.CSSProperties;
  children: React.ReactNode;
  onPageCount?: (n: number) => void;
  renderPageOverlay?: (pageIndex: number, pageCount: number) => React.ReactNode;

  manualOverrides: ManualPageBreakOverrides;
  onManualOverridesChange: (next: ManualPageBreakOverrides) => void;
  enableManualBreaks?: boolean;
};

export function PreviewWrapper({
  settings,
  globalStyle,
  children,
  onPageCount,
  renderPageOverlay,
  manualOverrides,
  onManualOverridesChange,
  enableManualBreaks = true,
}: Props) {
  const pageInfo = useMemo(() => getPageMm(settings), [settings]);

  const pageWpx = pageInfo.w * MM_TO_PX * settings.scale;
  const pageHpx = pageInfo.h * MM_TO_PX * settings.scale;

  const marginTopPx = mmToPx(settings.margins.top, settings.scale);
  const marginBottomPx = mmToPx(settings.margins.bottom, settings.scale);
  const marginLeftPx = mmToPx(settings.margins.left, settings.scale);
  const marginRightPx = mmToPx(settings.margins.right, settings.scale);

  const contentWpx = pageWpx - marginLeftPx - marginRightPx;
  const contentHpx = pageHpx - marginTopPx - marginBottomPx;

  const measureRef = useRef<HTMLDivElement | null>(null);
  const [totalHeightPx, setTotalHeightPx] = useState(0);
  const [hoverLine, setHoverLine] = useState<HoverLine | null>(null);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setTotalHeightPx(el.scrollHeight);
  }, [children, contentWpx, globalStyle]);

  const autoBreaksPx = useMemo(
    () => buildAutoBreaksPx(totalHeightPx, contentHpx),
    [totalHeightPx, contentHpx]
  );

  const breaksPx = useMemo(
    () => mergeAutoWithOverrides(autoBreaksPx, manualOverrides, totalHeightPx),
    [autoBreaksPx, manualOverrides, totalHeightPx]
  );

  const pageCount = Math.max(1, breaksPx.length + 1);

  useEffect(() => {
    onPageCount?.(pageCount);
  }, [pageCount, onPageCount]);

  const getSliceRange = useCallback(
    (pageIndex: number) => {
      const start = pageIndex === 0 ? 0 : breaksPx[pageIndex - 1];
      const end =
        pageIndex < breaksPx.length ? breaksPx[pageIndex] : totalHeightPx;
      return { start, end };
    },
    [breaksPx, totalHeightPx]
  );

  const resetManual = () => onManualOverridesChange(null);

  // ✅ y(페이지 내 좌표) -> hoverLine 생성 (표시용)
  const computeHoverLine = useCallback(
    (pageIndex: number, clientYInContentBox: number) => {
      const { start, end } = getSliceRange(pageIndex);
      const rawGlobalY = start + clientYInContentBox;

      const minGap = 12;
      const prev = pageIndex === 0 ? 0 : breaksPx[pageIndex - 1];
      const next =
        pageIndex < breaksPx.length ? breaksPx[pageIndex] : totalHeightPx;

      const minY = prev + minGap;
      const maxY = next - minGap;

      const clamped = Math.min(Math.max(rawGlobalY, minY), maxY);
      const yInPage = Math.min(Math.max(clamped - start, 0), end - start);
      const percentInPage = Math.round((yInPage / contentHpx) * 100);

      return { pageIndex, yInPage, globalY: clamped, percentInPage };
    },
    [breaksPx, totalHeightPx, contentHpx, getSliceRange]
  );

  const updateHoverLine = (pageIndex: number, clientYInContentBox: number) => {
    if (!enableManualBreaks) return;
    setHoverLine(computeHoverLine(pageIndex, clientYInContentBox));
  };

  // ✅ 핵심: 클릭할 때 hoverLine이 아니라 "지금 클릭한 좌표"로 바로 break 저장
  const onClickToSetBreak = (
    pageIndex: number,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!enableManualBreaks) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const line = computeHoverLine(pageIndex, y);
    const breakIdx = line.pageIndex;

    const next: ManualPageBreakOverrides = {
      ...(manualOverrides ?? {}),
      [breakIdx]: line.globalY,
    };

    onManualOverridesChange(next);
    setHoverLine(line); // 클릭 후에도 라인 유지
  };

  return (
    <div className="w-full flex justify-center bg-gray-100 py-10">
      <div className="space-y-8 relative">
        {/* 측정용 연속 콘텐츠 */}
        <div
          ref={measureRef}
          className="absolute -left-[99999px] top-0 w-[1px] overflow-visible"
          style={{ ...globalStyle, width: contentWpx }}
        >
          {children}
        </div>

        {enableManualBreaks && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="bg-transparent text-xs"
              onClick={resetManual}
              disabled={!manualOverrides}
            >
              페이지 넘김 자동으로 되돌리기
            </Button>
          </div>
        )}

        {Array.from({ length: pageCount }).map((_, pageIndex) => {
          const { start, end } = getSliceRange(pageIndex);
          const offsetY = start;

          const sliceHeightPx = Math.max(0, end - start);
          const visibleHeightPx = Math.min(sliceHeightPx, contentHpx);

          const splitPercent =
            pageIndex < breaksPx.length
              ? Math.max(
                  0,
                  Math.min(100, Math.round((sliceHeightPx / contentHpx) * 100))
                )
              : null;

          return (
            <div
              key={`page-${pageIndex}`}
              className="relative bg-white shadow-sm overflow-hidden"
              style={{ width: pageWpx, height: pageHpx }}
            >
              {/* ✅ content box */}
              <div
                className="absolute"
                style={{
                  top: marginTopPx,
                  left: marginLeftPx,
                  width: contentWpx,
                  height: contentHpx,
                  boxSizing: "border-box",
                  cursor: enableManualBreaks ? "row-resize" : "default",
                }}
                onPointerMoveCapture={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  updateHoverLine(pageIndex, y);
                }}
                onPointerLeave={() => setHoverLine(null)}
                onPointerDownCapture={(e) => onClickToSetBreak(pageIndex, e)}
              >
                <div
                  style={{
                    position: "relative",
                    width: contentWpx,
                    height: visibleHeightPx,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      ...globalStyle,
                      width: contentWpx,
                      transform: `translateY(-${offsetY}px)`,
                    }}
                  >
                    {children}
                  </div>
                </div>

                {visibleHeightPx < contentHpx && (
                  <div style={{ height: contentHpx - visibleHeightPx }} />
                )}

                {splitPercent !== null ? (
                  <div className="pointer-events-none absolute top-2 right-2 z-10">
                    <div className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
                      이 페이지 {splitPercent}%
                    </div>
                  </div>
                ) : (
                  <div className="pointer-events-none absolute top-2 right-2 z-10">
                    <div className="bg-black/40 text-white text-[10px] px-2 py-1 rounded-full">
                      마지막 페이지
                    </div>
                  </div>
                )}

                {enableManualBreaks &&
                  hoverLine &&
                  hoverLine.pageIndex === pageIndex && (
                    <div
                      className="pointer-events-none absolute left-0 right-0"
                      style={{
                        top: hoverLine.yInPage,
                        height: 0,
                        borderTop: "2px dashed #3b82f6",
                      }}
                    >
                      <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
                        클릭하면 여기서 페이지 나눔 ({hoverLine.percentInPage}%)
                      </div>
                    </div>
                  )}
              </div>

              {renderPageOverlay?.(pageIndex, pageCount)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
