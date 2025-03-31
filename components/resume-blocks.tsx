"use client";

import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { useDrag, useDrop } from "react-dnd";
import type { ResumeBlock } from "@/types/resume";
import ProfileBlock from "./blocks/profile-block";
import SummaryBlock from "./blocks/summary-block";
import ExperienceBlock from "./blocks/experience-block";
import EducationBlock from "./blocks/education-block";
import ProjectsBlock from "./blocks/projects-block";
import SkillsBlock from "./blocks/skills-block";
import CertificationsBlock from "./blocks/certifications-block";
import AwardsBlock from "./blocks/awards-block";
import EtcBlock from "./blocks/etc-block";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// 드래그 아이템 타입 정의
interface DragItem {
  index: number;
  id: string;
  type: string;
}

type BlockItemProps = {
  block: ResumeBlock;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
};

const BlockItem = ({ block, index, moveBlock }: BlockItemProps) => {
  const { toggleBlockVisibility, removeBlock, isEditing } = useResumeStore();
  const ref = useRef<HTMLDivElement>(null);

  // 드래그 설정
  const [{ isDragging }, drag] = useDrag({
    type: "BLOCK",
    item: { index, id: block.id, type: "BLOCK" } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isEditing, // 편집 모드일 때만 드래그 가능
  });

  // 드롭 설정
  const [{ handlerId }, drop] = useDrop({
    accept: "BLOCK",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // 자기 자신 위에 드롭하는 경우 무시
      if (dragIndex === hoverIndex) {
        return;
      }

      // 드래그 중인 아이템의 위치와 크기 계산
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // 드롭 영역의 중간 지점 계산
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 마우스 위치 계산
      const clientOffset = monitor.getClientOffset();

      // 드롭 영역의 상단에서부터 마우스까지의 거리 계산
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      // 드래그 방향에 따른 처리
      // 위에서 아래로 드래그할 때는 중간을 넘어야 이동
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 아래에서 위로 드래그할 때는 중간을 넘어야 이동
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 실제 이동 수행
      moveBlock(dragIndex, hoverIndex);

      // 참조 인덱스 업데이트
      item.index = hoverIndex;
    },
  });

  // drag와 drop 참조 결합
  drag(drop(ref));

  const renderBlockContent = () => {
    switch (block.type) {
      case "profile":
        return <ProfileBlock block={block} />;
      case "summary":
        return <SummaryBlock block={block} />;
      case "experience":
        return <ExperienceBlock block={block} />;
      case "education":
        return <EducationBlock block={block} />;
      case "projects":
        return <ProjectsBlock block={block} />;
      case "skills":
        return <SkillsBlock block={block} />;
      case "certifications":
        return <CertificationsBlock block={block} />;
      case "awards":
        return <AwardsBlock block={block} />;
      case "etc":
        return <EtcBlock block={block} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div
      ref={ref}
      className={`mb-4 ${isDragging ? "opacity-50" : "opacity-100"} ${
        block.isHidden ? "opacity-50" : ""
      }`}
      data-handler-id={handlerId}
    >
      <Card>
        <div className="flex items-center p-2 bg-muted border-b">
          <div
            className={`cursor-${isEditing ? "move" : "not-allowed"} p-1`}
            title={
              isEditing ? "드래그하여 위치 변경" : "편집 모드에서만 이동 가능"
            }
          >
            <GripVertical size={20} className={isEditing ? "" : "opacity-50"} />
          </div>
          <div className="ml-2 font-medium capitalize">{block.type}</div>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBlockVisibility(block.id)}
              title={block.isHidden ? "Show block" : "Hide block"}
              disabled={!isEditing}
            >
              {block.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeBlock(block.id)}
              className="text-destructive"
              title="Remove block"
              disabled={!isEditing}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <CardContent className={`p-4 ${block.isHidden ? "hidden" : ""}`}>
          {renderBlockContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default function ResumeBlocks() {
  const { currentVersion, moveBlock, isEditing, draftVersion } =
    useResumeStore();
  console.log(currentVersion);

  const [blocks, setBlocks] = useState<ResumeBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!currentVersion) {
    return <div className="text-center py-10">No resume version selected</div>;
  }

  const handleMoveBlock = (dragIndex: number, hoverIndex: number) => {
    if (!isEditing) return; // 편집 모드가 아니면 이동 불가
    moveBlock(dragIndex, hoverIndex);
  };

  useEffect(() => {
    if (isEditing) {
      setBlocks(draftVersion?.blocks || []);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setBlocks(currentVersion.blocks);
        setIsLoading(false);
      }, 1000);
    }
  }, [currentVersion, isEditing, draftVersion]);

  return (
    <div className="space-y-4">
      {blocks?.map((block, index) => (
        <BlockItem
          key={block.id}
          block={block}
          index={index}
          moveBlock={handleMoveBlock}
        />
      ))}
      {currentVersion.blocks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          {isEditing
            ? "왼쪽 패널에서 블록을 추가해주세요"
            : "편집 모드에서 왼쪽 패널의 블록을 추가할 수 있습니다"}
        </div>
      )}

      {!isEditing && currentVersion.blocks.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm text-center">
          <p>편집 모드에서 블록을 추가하거나 수정할 수 있습니다.</p>
          <p>상단의 '편집' 버튼을 클릭하여 편집 모드로 전환하세요.</p>
        </div>
      )}
    </div>
  );
}
