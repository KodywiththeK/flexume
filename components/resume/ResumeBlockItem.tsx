"use client";

import { useResumeStore } from "@/store/resume-store";
import { GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileBlock from "../blocks/profile-block";
import SummaryBlock from "../blocks/summary-block";
import ExperienceBlock from "../blocks/experience-block";
import EducationBlock from "../blocks/education-block";
import ProjectsBlock from "../blocks/projects-block";
import SkillsBlock from "../blocks/skills-block";
import CertificationsBlock from "../blocks/certifications-block";
import AwardsBlock from "../blocks/awards-block";
import EtcBlock from "../blocks/etc-block";
import { useDragDrop } from "@/hooks/use-dnd";

interface BlockItemProps {
  block: any; // ResumeBlock (타입 정의에 맞게 변경)
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}

const ResumeBlockItem = ({ block, index, moveBlock }: BlockItemProps) => {
  const { toggleBlockVisibility, removeBlock, isEditing } = useResumeStore();

  // 커스텀 훅 사용: ref, isDragging, handlerId 반환
  const { ref, isDragging, handlerId } = useDragDrop({
    index,
    id: block.id,
    moveBlock,
    isEditing,
  });

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

export default ResumeBlockItem;
