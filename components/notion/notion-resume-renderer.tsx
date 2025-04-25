"use client";

import { useState, useRef, useEffect } from "react";
import { NotionBlockRenderer } from "./notion-block-renderer";
import {
  SelectedBlockProvider,
  SelectedBlockContext,
} from "./selected-block-context";
import { TemplateSelector } from "./template-selector";
import { BlockTypeStyleEditor } from "./block-type-style-editor";
import { PDFPreviewSettings } from "./pdf-preview-settings";
import { BlockStructurePanel } from "./block-structure-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Eye, PanelLeft, PanelRight } from "lucide-react";
import type {
  NotionResume,
  StyledResumeBlock,
  BlockStyle,
  PDFSettings,
  NotionBlockType,
} from "@/types/notion-resume";
import { getTemplate } from "@/lib/resume-templates";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/components/ui/use-toast";

interface NotionResumeRendererProps {
  resume: NotionResume;
  onRefresh?: () => void;
}

export function NotionResumeRenderer({
  resume,
  onRefresh,
}: NotionResumeRendererProps) {
  const [notionResume, setNotionResume] = useState<NotionResume>(resume);
  const [isEditing, setIsEditing] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activeTab, setActiveTab] = useState<"template" | "block-styles">(
    "template"
  );
  const [blockTypeStyles, setBlockTypeStyles] = useState<
    Record<NotionBlockType, BlockStyle>
  >({} as Record<NotionBlockType, BlockStyle>);
  const [showStructurePanel, setShowStructurePanel] = useState(true);
  const [structurePanelPosition, setStructurePanelPosition] = useState<
    "left" | "right"
  >("left");
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 사용된 블록 타입 목록 추출
  const usedBlockTypes = useRef<NotionBlockType[]>([]);

  // 사용된 블록 타입 추출
  useEffect(() => {
    const extractBlockTypes = (
      blocks: StyledResumeBlock[]
    ): NotionBlockType[] => {
      const types: NotionBlockType[] = [];

      blocks.forEach((block) => {
        if (!types.includes(block.type)) {
          types.push(block.type);
        }

        if (block.children && block.children.length > 0) {
          const childTypes = extractBlockTypes(block.children);
          childTypes.forEach((type) => {
            if (!types.includes(type)) {
              types.push(type);
            }
          });
        }
      });

      return types;
    };

    usedBlockTypes.current = extractBlockTypes(notionResume.blocks);
  }, [notionResume.blocks]);

  // 페이지 수 계산
  useEffect(() => {
    if (showPreview && resumeRef.current) {
      // A4 크기: 210 x 297 mm (793.7 x 1122.5 px at 96 DPI)
      const a4Height = 1122.5;
      const contentHeight = resumeRef.current.scrollHeight;
      const estimatedPages = Math.ceil(contentHeight / a4Height);
      setPageCount(estimatedPages);
    }
  }, [showPreview, notionResume]);

  // 템플릿 변경 핸들러
  const handleTemplateChange = (templateId: string) => {
    const template = getTemplate(templateId);

    // 모든 블록에 템플릿 스타일 적용
    const updateBlockStyles = (
      blocks: StyledResumeBlock[]
    ): StyledResumeBlock[] => {
      return blocks.map((block) => {
        const defaultStyle = template.blockStyles[block.type] || {};

        // 블록 타입별 공통 스타일 적용
        const typeStyle = blockTypeStyles[block.type] || {};

        // 커스텀 스타일이 있으면 유지
        const customStyle = notionResume.customStyles[block.id] || {};

        // 자식 블록이 있으면 재귀적으로 처리
        const children = block.children
          ? updateBlockStyles(block.children)
          : undefined;

        return {
          ...block,
          style: { ...defaultStyle, ...typeStyle, ...customStyle },
          children,
        };
      });
    };

    const updatedBlocks = updateBlockStyles(notionResume.blocks);

    setNotionResume({
      ...notionResume,
      blocks: updatedBlocks,
      selectedTemplate: templateId,
    });
  };

  // 블록 스타일 변경 핸들러
  const handleStyleChange = (blockId: string, style: BlockStyle) => {
    // 블록 찾기 및 스타일 업데이트
    const updateBlockStyle = (
      blocks: StyledResumeBlock[]
    ): StyledResumeBlock[] => {
      return blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            style: { ...block.style, ...style },
          };
        }

        // 자식 블록이 있으면 재귀적으로 처리
        if (block.children && block.children.length > 0) {
          return {
            ...block,
            children: updateBlockStyle(block.children),
          };
        }

        return block;
      });
    };

    const updatedBlocks = updateBlockStyle(notionResume.blocks);

    // 커스텀 스타일 저장
    const updatedCustomStyles = {
      ...notionResume.customStyles,
      [blockId]: { ...notionResume.customStyles[blockId], ...style },
    };

    setNotionResume({
      ...notionResume,
      blocks: updatedBlocks,
      customStyles: updatedCustomStyles,
    });
  };

  // 블록 타입별 공통 스타일 변경 핸들러
  const handleBlockTypeStyleChange = (
    blockType: NotionBlockType,
    style: BlockStyle
  ) => {
    // 블록 타입별 스타일 업데이트
    const updatedBlockTypeStyles = {
      ...blockTypeStyles,
      [blockType]: { ...blockTypeStyles[blockType], ...style },
    };

    setBlockTypeStyles(updatedBlockTypeStyles);

    // 해당 타입의 모든 블록에 스타일 적용
    const updateBlocksOfType = (
      blocks: StyledResumeBlock[]
    ): StyledResumeBlock[] => {
      return blocks.map((block) => {
        // 현재 블록이 해당 타입인 경우 스타일 적용
        if (block.type === blockType) {
          return {
            ...block,
            style: { ...block.style, ...style },
          };
        }

        // 자식 블록이 있으면 재귀적으로 처리
        if (block.children && block.children.length > 0) {
          return {
            ...block,
            children: updateBlocksOfType(block.children),
          };
        }

        return block;
      });
    };

    const updatedBlocks = updateBlocksOfType(notionResume.blocks);

    setNotionResume({
      ...notionResume,
      blocks: updatedBlocks,
    });
  };

  // 블록 타입별 스타일 초기화 핸들러
  const handleResetBlockTypeStyle = (blockType: NotionBlockType) => {
    // 블록 타입별 스타일 초기화
    const updatedBlockTypeStyles = { ...blockTypeStyles };
    delete updatedBlockTypeStyles[blockType];

    setBlockTypeStyles(updatedBlockTypeStyles);

    // 템플릿 기본 스타일 가져오기
    const template = getTemplate(notionResume.selectedTemplate);
    const defaultStyle = template.blockStyles[blockType] || {};

    // 해당 타입의 모든 블록에 기본 스타일 적용
    const resetBlocksOfType = (
      blocks: StyledResumeBlock[]
    ): StyledResumeBlock[] => {
      return blocks.map((block) => {
        // 현재 블록이 해당 타입인 경우 기본 스타일 적용
        if (block.type === blockType) {
          // 커스텀 스타일은 유지
          const customStyle = notionResume.customStyles[block.id] || {};

          return {
            ...block,
            style: { ...defaultStyle, ...customStyle },
          };
        }

        // 자식 블록이 있으면 재귀적으로 처리
        if (block.children && block.children.length > 0) {
          return {
            ...block,
            children: resetBlocksOfType(block.children),
          };
        }

        return block;
      });
    };

    const updatedBlocks = resetBlocksOfType(notionResume.blocks);

    setNotionResume({
      ...notionResume,
      blocks: updatedBlocks,
    });
  };

  // PDF 미리보기 핸들러
  const handlePreview = () => {
    setIsEditing(false);
    setShowPreview(true);
  };

  // PDF 다운로드 핸들러
  const handleDownloadPDF = async (settings: PDFSettings) => {
    if (!resumeRef.current) return;

    setIsGeneratingPDF(true);

    try {
      // A4 크기: 210 x 297 mm
      const pageWidth =
        settings.pageSize === "a4"
          ? 210
          : settings.pageSize === "letter"
          ? 215.9
          : 215.9;
      const pageHeight =
        settings.pageSize === "a4"
          ? 297
          : settings.pageSize === "letter"
          ? 279.4
          : 355.6;

      const pdf = new jsPDF({
        orientation: settings.orientation,
        unit: "mm",
        format: settings.pageSize,
      });

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2 * settings.scale, // 고해상도 및 사용자 설정 스케일 적용
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // 최적화 옵션 추가
        imageTimeout: 0,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95); // JPEG 형식으로 변환하여 용량 최적화

      // 이미지 크기 계산 (여백 적용)
      const imgWidth =
        pageWidth - settings.margins.left - settings.margins.right;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 첫 페이지 추가
      pdf.addImage(
        imgData,
        "JPEG",
        settings.margins.left,
        settings.margins.top,
        imgWidth,
        imgHeight
      );

      // 페이지 번호 추가 (첫 페이지)
      if (settings.showPageNumbers) {
        pdf.setFontSize(8);
        pdf.text(
          `1 / ${Math.ceil(
            imgHeight /
              (pageHeight - settings.margins.top - settings.margins.bottom)
          )}`,
          pageWidth / 2,
          pageHeight - 5
        );
      }

      // 여러 페이지 처리
      const pageContentHeight =
        pageHeight - settings.margins.top - settings.margins.bottom;
      if (imgHeight > pageContentHeight) {
        let heightLeft = imgHeight - pageContentHeight;
        let position = -pageContentHeight;
        let pageNum = 2;

        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(
            imgData,
            "JPEG",
            settings.margins.left,
            settings.margins.top + position,
            imgWidth,
            imgHeight
          );

          // 페이지 번호 추가
          if (settings.showPageNumbers) {
            pdf.setFontSize(8);
            pdf.text(
              `${pageNum} / ${Math.ceil(imgHeight / pageContentHeight)}`,
              pageWidth / 2,
              pageHeight - 5
            );
          }

          heightLeft -= pageContentHeight;
          position -= pageContentHeight;
          pageNum++;
        }
      }

      // PDF 저장
      pdf.save(`${notionResume.title || "notion-resume"}.pdf`);

      toast({
        title: "PDF 생성 완료",
        description: "이력서가 PDF로 저장되었습니다.",
      });
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      toast({
        title: "PDF 생성 실패",
        description: "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 미리보기 종료 핸들러
  const handleBackFromPreview = () => {
    setShowPreview(false);
    setIsEditing(true);
  };

  // 템플릿 전역 스타일 적용
  const getGlobalStyles = () => {
    const template = getTemplate(notionResume.selectedTemplate);
    return {
      fontFamily: template.globalStyles.fontFamily,
      color: template.globalStyles.textColor,
      backgroundColor: template.globalStyles.backgroundColor,
    };
  };

  // 블록 구조 패널 토글
  const toggleStructurePanel = () => {
    setShowStructurePanel(!showStructurePanel);
  };

  // 블록 구조 패널 위치 변경
  const toggleStructurePanelPosition = () => {
    setStructurePanelPosition(
      structurePanelPosition === "left" ? "right" : "left"
    );
  };

  // PDF 미리보기 모드
  if (showPreview) {
    return (
      <div className="space-y-6">
        <PDFPreviewSettings
          onBack={handleBackFromPreview}
          onDownload={handleDownloadPDF}
          pageCount={pageCount}
        />

        <div className="bg-gray-100 p-8 flex justify-center">
          <div
            className="bg-white shadow-lg w-[210mm] min-h-[297mm] print:shadow-none"
            ref={resumeRef}
            style={getGlobalStyles()}
          >
            <div className="p-8">
              {notionResume.blocks.map((block) => (
                <NotionBlockRenderer
                  key={block.id}
                  block={block}
                  isEditing={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 편집 모드
  return (
    <SelectedBlockProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {notionResume.title || "Untitled Resume"}
          </h1>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleStructurePanel}
              title={showStructurePanel ? "구조 패널 숨기기" : "구조 패널 표시"}
            >
              {structurePanelPosition === "left" ? (
                <PanelLeft size={16} />
              ) : (
                <PanelRight size={16} />
              )}
            </Button>
            {showStructurePanel && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleStructurePanelPosition}
                title="패널 위치 변경"
              >
                {structurePanelPosition === "left" ? (
                  <PanelRight size={16} />
                ) : (
                  <PanelLeft size={16} />
                )}
              </Button>
            )}
            {onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw size={16} />
                Notion에서 다시 불러오기
              </Button>
            )}
            <Button onClick={handlePreview} className="flex items-center gap-1">
              <Eye size={16} />
              PDF 미리보기
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>참고:</strong> 이력서 콘텐츠는 Notion에서 직접 수정해야
            합니다. 여기서는 스타일만 변경할 수 있습니다.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "template" | "block-styles")
          }
        >
          <TabsList className="mb-4">
            <TabsTrigger value="template">템플릿 선택</TabsTrigger>
            <TabsTrigger value="block-styles">블록 타입별 스타일</TabsTrigger>
          </TabsList>

          <TabsContent value="template">
            <TemplateSelector
              selectedTemplate={notionResume.selectedTemplate}
              onSelectTemplate={handleTemplateChange}
            />
          </TabsContent>

          <TabsContent value="block-styles">
            <BlockTypeStyleEditor
              blockTypes={usedBlockTypes.current}
              blockTypeStyles={blockTypeStyles}
              onUpdateBlockTypeStyle={handleBlockTypeStyleChange}
              onResetBlockTypeStyle={handleResetBlockTypeStyle}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-6">
          {/* 블록 구조 패널 (왼쪽) */}
          {showStructurePanel && structurePanelPosition === "left" && (
            <div className="w-72 flex-shrink-0 sticky top-20 self-start">
              <SelectedBlockContext.Consumer>
                {({ selectedBlockId, setSelectedBlockId }) => (
                  <BlockStructurePanel
                    blocks={notionResume.blocks}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={(blockId) => setSelectedBlockId(blockId)}
                  />
                )}
              </SelectedBlockContext.Consumer>
            </div>
          )}

          {/* 메인 콘텐츠 */}
          <div
            className={`bg-white border rounded-md p-8 shadow-sm ${
              showStructurePanel ? "flex-1" : "w-full"
            }`}
          >
            <div className="max-w-4xl mx-auto" style={getGlobalStyles()}>
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

          {/* 블록 구조 패널 (오른쪽) */}
          {showStructurePanel && structurePanelPosition === "right" && (
            <div className="w-72 flex-shrink-0 sticky top-20 self-start">
              <SelectedBlockContext.Consumer>
                {({ selectedBlockId, setSelectedBlockId }) => (
                  <BlockStructurePanel
                    blocks={notionResume.blocks}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={(blockId) => setSelectedBlockId(blockId)}
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
