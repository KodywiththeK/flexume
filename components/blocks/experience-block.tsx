"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/store/resume-store";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeBlock } from "@/types/resume";
import {
  Card,
  CardContent,
  Button,
  Label,
  Input,
  Checkbox,
  Textarea,
} from "@/components/ui";

type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrentPosition: boolean;
  description: string;
  achievements: string[];
};

type ExperienceData = {
  items: ExperienceItem[];
};

type ExperienceBlockProps = {
  block: ResumeBlock;
};

export default function ExperienceBlock({ block }: ExperienceBlockProps) {
  const { updateBlockContent } = useResumeStore();
  const [experience, setExperience] = useState<ExperienceData>(
    block.content || {
      items: [
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrentPosition: false,
          description: "",
          achievements: [""],
        },
      ],
    }
  );

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setExperience(block.content);
    }
  }, [block.content]);

  const handleItemChange = (
    index: number,
    field: keyof ExperienceItem,
    value: any
  ) => {
    const updatedItems = [...experience.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    const updatedExperience = { ...experience, items: updatedItems };
    setExperience(updatedExperience);
    updateBlockContent(block.id, updatedExperience);
  };

  const handleAchievementChange = (
    itemIndex: number,
    achievementIndex: number,
    value: string
  ) => {
    const updatedItems = [...experience.items];
    const updatedAchievements = [...updatedItems[itemIndex].achievements];
    updatedAchievements[achievementIndex] = value;

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      achievements: updatedAchievements,
    };

    const updatedExperience = { ...experience, items: updatedItems };
    setExperience(updatedExperience);
    updateBlockContent(block.id, updatedExperience);
  };

  const addAchievement = (itemIndex: number) => {
    const updatedItems = [...experience.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      achievements: [...updatedItems[itemIndex].achievements, ""],
    };

    const updatedExperience = { ...experience, items: updatedItems };
    setExperience(updatedExperience);
    updateBlockContent(block.id, updatedExperience);
  };

  const removeAchievement = (itemIndex: number, achievementIndex: number) => {
    const updatedItems = [...experience.items];
    const updatedAchievements = updatedItems[itemIndex].achievements.filter(
      (_, i) => i !== achievementIndex
    );

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      achievements: updatedAchievements,
    };

    const updatedExperience = { ...experience, items: updatedItems };
    setExperience(updatedExperience);
    updateBlockContent(block.id, updatedExperience);
  };

  const addExperienceItem = () => {
    const updatedItems = [
      ...experience.items,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrentPosition: false,
        description: "",
        achievements: [""],
      },
    ];

    const updatedExperience = { ...experience, items: updatedItems };
    setExperience(updatedExperience);
    updateBlockContent(block.id, updatedExperience);
  };

  const removeExperienceItem = (index: number) => {
    const updatedItems = experience.items.filter((_, i) => i !== index);
    const updatedExperience = { ...experience, items: updatedItems };
    setExperience(updatedExperience);
    updateBlockContent(block.id, updatedExperience);
  };

  return (
    <div className="space-y-6">
      {experience.items.map((item, itemIndex) => (
        <Card key={item.id} className="border border-muted">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">경력 #{itemIndex + 1}</h3>
              {experience.items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperienceItem(itemIndex)}
                  className="text-destructive h-8 w-8"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`company-${itemIndex}`}>회사명</Label>
                  <Input
                    id={`company-${itemIndex}`}
                    value={item.company}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "company", e.target.value)
                    }
                    placeholder="회사명"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`position-${itemIndex}`}>직책/직무</Label>
                  <Input
                    id={`position-${itemIndex}`}
                    value={item.position}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "position", e.target.value)
                    }
                    placeholder="프론트엔드 개발자"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${itemIndex}`}>시작일</Label>
                  <Input
                    id={`startDate-${itemIndex}`}
                    type="date"
                    value={item.startDate}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`endDate-${itemIndex}`}>종료일</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${itemIndex}`}
                        checked={item.isCurrentPosition}
                        onCheckedChange={(checked) =>
                          handleItemChange(
                            itemIndex,
                            "isCurrentPosition",
                            checked
                          )
                        }
                      />
                      <label
                        htmlFor={`current-${itemIndex}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        현재 재직중
                      </label>
                    </div>
                  </div>
                  <Input
                    id={`endDate-${itemIndex}`}
                    type="date"
                    value={item.endDate}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "endDate", e.target.value)
                    }
                    disabled={item.isCurrentPosition}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${itemIndex}`}>직무 설명</Label>
                <Textarea
                  id={`description-${itemIndex}`}
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(itemIndex, "description", e.target.value)
                  }
                  placeholder="담당했던 업무에 대해 간략히 설명해주세요."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>주요 성과</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(itemIndex)}
                    className="h-8"
                  >
                    <Plus size={16} className="mr-1" />
                    성과 추가
                  </Button>
                </div>

                {item.achievements.map((achievement, achievementIndex) => (
                  <div
                    key={achievementIndex}
                    className="flex gap-2 items-start"
                  >
                    <Input
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(
                          itemIndex,
                          achievementIndex,
                          e.target.value
                        )
                      }
                      placeholder="주요 성과를 입력하세요"
                      className="flex-1"
                    />
                    {item.achievements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeAchievement(itemIndex, achievementIndex)
                        }
                        className="text-destructive h-10 w-10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExperienceItem}
        className="w-full"
      >
        <Plus size={16} className="mr-2" />
        경력 추가
      </Button>
    </div>
  );
}
