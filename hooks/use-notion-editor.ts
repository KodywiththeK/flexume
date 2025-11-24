"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  NotionResume,
  StyledResumeBlock,
  BlockStyle,
  NotionBlockType,
} from "@/types/notion-resume";
import { getTemplate } from "@/lib/resume-templates";

export function useNotionResumeEditor(initial: NotionResume) {
  const [notionResume, setNotionResume] = useState<NotionResume>(initial);
  const [blockTypeStyles, setBlockTypeStyles] = useState<
    Record<NotionBlockType, BlockStyle>
  >({} as Record<NotionBlockType, BlockStyle>);

  const usedBlockTypes = useMemo<NotionBlockType[]>(() => {
    const types = new Set<NotionBlockType>();
    const walk = (blocks: StyledResumeBlock[]) => {
      blocks.forEach((b) => {
        types.add(b.type);
        if (b.children?.length) walk(b.children);
      });
    };
    walk(notionResume.blocks);
    return Array.from(types);
  }, [notionResume.blocks]);

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      const template = getTemplate(templateId);

      const updateBlockStyles = (
        blocks: StyledResumeBlock[]
      ): StyledResumeBlock[] =>
        blocks.map((block) => {
          const defaultStyle = template.blockStyles[block.type] || {};
          const typeStyle = blockTypeStyles[block.type] || {};
          const customStyle = notionResume.customStyles[block.id] || {};
          const children = block.children
            ? updateBlockStyles(block.children)
            : undefined;

          return {
            ...block,
            style: { ...defaultStyle, ...typeStyle, ...customStyle },
            children,
          };
        });

      setNotionResume((prev) => ({
        ...prev,
        blocks: updateBlockStyles(prev.blocks),
        selectedTemplate: templateId,
      }));
    },
    [blockTypeStyles, notionResume.customStyles]
  );

  const handleStyleChange = useCallback(
    (blockId: string, style: BlockStyle) => {
      const updateBlockStyle = (
        blocks: StyledResumeBlock[]
      ): StyledResumeBlock[] =>
        blocks.map((block) => {
          if (block.id === blockId) {
            return { ...block, style: { ...block.style, ...style } };
          }
          if (block.children?.length) {
            return { ...block, children: updateBlockStyle(block.children) };
          }
          return block;
        });

      setNotionResume((prev) => ({
        ...prev,
        blocks: updateBlockStyle(prev.blocks),
        customStyles: {
          ...prev.customStyles,
          [blockId]: { ...prev.customStyles[blockId], ...style },
        },
      }));
    },
    []
  );

  const handleBlockTypeStyleChange = useCallback(
    (blockType: NotionBlockType, style: BlockStyle) => {
      setBlockTypeStyles((prev) => ({
        ...prev,
        [blockType]: { ...prev[blockType], ...style },
      }));

      const updateBlocksOfType = (
        blocks: StyledResumeBlock[]
      ): StyledResumeBlock[] =>
        blocks.map((block) => {
          if (block.type === blockType) {
            return { ...block, style: { ...block.style, ...style } };
          }
          if (block.children?.length) {
            return { ...block, children: updateBlocksOfType(block.children) };
          }
          return block;
        });

      setNotionResume((prev) => ({
        ...prev,
        blocks: updateBlocksOfType(prev.blocks),
      }));
    },
    []
  );

  const handleResetBlockTypeStyle = useCallback(
    (blockType: NotionBlockType) => {
      setBlockTypeStyles((prev) => {
        const next = { ...prev };
        delete next[blockType];
        return next;
      });

      const template = getTemplate(notionResume.selectedTemplate);
      const defaultStyle = template.blockStyles[blockType] || {};

      const resetBlocksOfType = (
        blocks: StyledResumeBlock[]
      ): StyledResumeBlock[] =>
        blocks.map((block) => {
          if (block.type === blockType) {
            const customStyle = notionResume.customStyles[block.id] || {};
            return {
              ...block,
              style: { ...defaultStyle, ...customStyle },
            };
          }
          if (block.children?.length) {
            return { ...block, children: resetBlocksOfType(block.children) };
          }
          return block;
        });

      setNotionResume((prev) => ({
        ...prev,
        blocks: resetBlocksOfType(prev.blocks),
      }));
    },
    [notionResume.selectedTemplate, notionResume.customStyles]
  );

  const globalStyles = useMemo(() => {
    const template = getTemplate(notionResume.selectedTemplate);
    return {
      fontFamily: template.globalStyles.fontFamily,
      color: template.globalStyles.textColor,
      backgroundColor: template.globalStyles.backgroundColor,
    } as React.CSSProperties;
  }, [notionResume.selectedTemplate]);

  return {
    notionResume,
    setNotionResume,
    blockTypeStyles,
    usedBlockTypes,
    globalStyles,

    handleTemplateChange,
    handleStyleChange,
    handleBlockTypeStyleChange,
    handleResetBlockTypeStyle,
  };
}
