"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

import { NotionBlockRenderer } from "./notion-block-renderer";
import {
  SelectedBlockProvider,
  SelectedBlockContext,
} from "./selected-block-context";
import { BlockStructurePanel } from "./block-structure-panel";

import type {
  ManualPageBreakOverrides,
  NotionResume,
  PDFSettings,
} from "@/types/notion-resume";

import { mmToPx } from "@/lib/helpers";
import { useNotionResumeEditor } from "@/hooks/use-notion-editor";
import { usePdfExport } from "@/hooks/use-pdf-export";
import { BlockTypeStylesDialog } from "./block-type-styles-dialog";
import { EditorTopBar } from "./notion-editor-top-bar";
import { PDFSettingsDialog } from "./pdf-settings-dialog";
import { PreviewTopBar } from "./preview-top-bar";
import { PreviewWrapper } from "./preview-wrapper";
import { TemplateDialog } from "./template-dialog";

interface NotionResumeRendererProps {
  resume: NotionResume;
  onRefresh?: () => void;
}

export function NotionResumeRenderer({
  resume,
  onRefresh,
}: NotionResumeRendererProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [showStructurePanel, setShowStructurePanel] = useState(true);
  const [structurePanelPosition, setStructurePanelPosition] = useState<
    "left" | "right"
  >("left");

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [blockStylesDialogOpen, setBlockStylesDialogOpen] = useState(false);
  const [pdfSettingsOpen, setPdfSettingsOpen] = useState(false);

  // ✅ manualBreaksPx -> manualOverrides
  const [manualOverrides, setManualOverrides] =
    useState<ManualPageBreakOverrides>(null);

  const [pdfSettings, setPdfSettings] = useState<PDFSettings>({
    scale: 1,
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    showPageNumbers: true,
    pageSize: "a4",
    orientation: "portrait",
    footer: { enabled: true, text: "", align: "center" } as any,
  } as PDFSettings);

  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { exportPdf } = usePdfExport();

  const {
    notionResume,
    setNotionResume,
    blockTypeStyles,
    usedBlockTypes,
    globalStyles,
    handleTemplateChange,
    handleStyleChange,
    handleBlockTypeStyleChange,
    handleResetBlockTypeStyle,
  } = useNotionResumeEditor(resume);

  useEffect(() => setNotionResume(resume), [resume, setNotionResume]);

  // ✅ 내용/용지 설정 바뀌면 manualOverride 리셋
  useEffect(() => {
    setManualOverrides(null);
  }, [
    notionResume.blocks,
    notionResume.selectedTemplate,
    pdfSettings.pageSize,
    pdfSettings.orientation,
    pdfSettings.margins.top,
    pdfSettings.margins.bottom,
    pdfSettings.margins.left,
    pdfSettings.margins.right,
    pdfSettings.scale,
  ]);

  const printStyleEl = useMemo(() => {
    const sizeStr =
      pdfSettings.pageSize === "a4"
        ? "A4"
        : pdfSettings.pageSize === "letter"
        ? "letter"
        : "legal";

    const orientStr = pdfSettings.orientation;
    const marginStr = `${pdfSettings.margins.top}mm ${pdfSettings.margins.right}mm ${pdfSettings.margins.bottom}mm ${pdfSettings.margins.left}mm`;

    const css = `
@media print {
  @page { size: ${sizeStr} ${orientStr}; margin: ${marginStr}; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-root { width: auto !important; margin: 0 !important; background: white !important; }
  .print-shadow { box-shadow: none !important; }
}
`.trim();

    return <style>{css}</style>;
  }, [pdfSettings]);

  const handlePreview = () => {
    setIsEditing(false);
    setShowPreview(true);
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
    setIsEditing(true);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await exportPdf({
        resumeRef,
        notionResume,
        pdfSettings,
        manualOverrides, // ✅ 변경
        onSuccess: () =>
          toast({
            title: "PDF 생성 완료",
            description: "이력서가 PDF로 저장되었습니다.",
          }),
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "PDF 생성 실패",
        description: "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const toggleStructurePanel = () => setShowStructurePanel((v) => !v);
  const toggleStructurePanelPosition = () =>
    setStructurePanelPosition((p) => (p === "left" ? "right" : "left"));

  if (showPreview) {
    const footerEnabled = pdfSettings.footer?.enabled ?? false;
    const footerText = pdfSettings.footer?.text ?? "";
    const footerAlign = pdfSettings.footer?.align ?? "center";
    const showNums = pdfSettings.showPageNumbers ?? true;

    const alignClass =
      footerAlign === "left"
        ? "text-left"
        : footerAlign === "right"
        ? "text-right"
        : "text-center";

    return (
      <div className="relative">
        {printStyleEl}
        <PreviewTopBar
          onBack={handleBackFromPreview}
          onDownload={handleDownloadPDF}
          isGenerating={isGeneratingPDF}
        />

        <div className="relative print-root">
          <PreviewWrapper
            settings={pdfSettings}
            globalStyle={globalStyles}
            manualOverrides={manualOverrides} // ✅ 변경
            onManualOverridesChange={setManualOverrides}
            enableManualBreaks
            renderPageOverlay={(pageIndex, pageCount) => {
              if (!footerEnabled && !showNums) return null;

              const leftPx = mmToPx(
                pdfSettings.margins.left,
                pdfSettings.scale
              );
              const rightPx = mmToPx(
                pdfSettings.margins.right,
                pdfSettings.scale
              );
              const bottomPx = mmToPx(
                pdfSettings.margins.bottom,
                pdfSettings.scale
              );

              return (
                <div
                  className={`pointer-events-none absolute left-0 right-0 ${alignClass}`}
                  style={{
                    bottom: Math.max(6, bottomPx - 32),
                    paddingLeft: leftPx,
                    paddingRight: rightPx,
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  {footerText && <span>{footerText}</span>}
                  {showNums && (
                    <span className={footerText ? "ml-2" : ""}>
                      {pageIndex + 1} / {pageCount}
                    </span>
                  )}
                </div>
              );
            }}
          >
            <div ref={resumeRef} className="print-shadow">
              {!!notionResume.title && (
                <h1 className="text-3xl font-bold mb-8">
                  {notionResume.title}
                </h1>
              )}
              {notionResume.blocks.map((block) => (
                <NotionBlockRenderer
                  key={block.id}
                  block={block}
                  isEditing={false}
                />
              ))}
            </div>
          </PreviewWrapper>
        </div>
      </div>
    );
  }

  return (
    <SelectedBlockProvider>
      {printStyleEl}

      <div className="space-y-6">
        <EditorTopBar
          title={notionResume.title || "Untitled Resume"}
          showStructurePanel={showStructurePanel}
          structurePanelPosition={structurePanelPosition}
          onToggleStructurePanel={toggleStructurePanel}
          onToggleStructurePanelPosition={toggleStructurePanelPosition}
          onRefresh={onRefresh}
          onPreview={handlePreview}
          onOpenPdfSettings={() => setPdfSettingsOpen(true)}
          isGeneratingPDF={isGeneratingPDF}
        />

        <div className="flex gap-2">
          <TemplateDialog
            open={templateDialogOpen}
            onOpenChange={setTemplateDialogOpen}
            selectedTemplate={notionResume.selectedTemplate}
            onSelectTemplate={handleTemplateChange}
          />

          <BlockTypeStylesDialog
            open={blockStylesDialogOpen}
            onOpenChange={setBlockStylesDialogOpen}
            usedBlockTypes={usedBlockTypes}
            blockTypeStyles={blockTypeStyles}
            onChangeBlockTypeStyle={handleBlockTypeStyleChange}
            onResetBlockTypeStyle={handleResetBlockTypeStyle}
          />
        </div>

        <PDFSettingsDialog
          open={pdfSettingsOpen}
          onOpenChange={setPdfSettingsOpen}
          settings={pdfSettings}
          onChange={setPdfSettings}
        />

        <div className="flex gap-6">
          {showStructurePanel && structurePanelPosition === "left" && (
            <div className="w-72 flex-shrink-0 sticky top-20 self-start">
              <SelectedBlockContext.Consumer>
                {({ selectedBlockId, setSelectedBlockId }) => (
                  <BlockStructurePanel
                    blocks={notionResume.blocks}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={(id) => setSelectedBlockId(id)}
                  />
                )}
              </SelectedBlockContext.Consumer>
            </div>
          )}

          <div
            className={`bg-white border rounded-md px-16 py-24 shadow-sm ${
              showStructurePanel ? "flex-1" : "w-full"
            }`}
          >
            <div className="max-w-4xl mx-auto" style={globalStyles}>
              {!!notionResume.title && (
                <h1 className="text-3xl font-bold mb-12">
                  {notionResume.title}
                </h1>
              )}

              {notionResume.blocks.map((block) => (
                <NotionBlockRenderer
                  key={block.id}
                  block={block}
                  onStyleChange={handleStyleChange}
                  isEditing={isEditing}
                />
              ))}
            </div>
          </div>

          {showStructurePanel && structurePanelPosition === "right" && (
            <div className="w-72 flex-shrink-0 sticky top-20 self-start">
              <SelectedBlockContext.Consumer>
                {({ selectedBlockId, setSelectedBlockId }) => (
                  <BlockStructurePanel
                    blocks={notionResume.blocks}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={(id) => setSelectedBlockId(id)}
                  />
                )}
              </SelectedBlockContext.Consumer>
            </div>
          )}
        </div>
      </div>
    </SelectedBlockProvider>
  );
}
