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
  Textarea,
} from "@/components/ui";

type AwardItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
};

type AwardsData = {
  items: AwardItem[];
};

type AwardsBlockProps = {
  block: ResumeBlock;
};

export default function AwardsBlock({ block }: AwardsBlockProps) {
  const { updateBlockContent } = useResumeStore();
  const [awards, setAwards] = useState<AwardsData>(
    block.content || {
      items: [
        {
          id: crypto.randomUUID(),
          title: "",
          issuer: "",
          date: "",
          description: "",
        },
      ],
    }
  );

  // Update local state when block content changes
  useEffect(() => {
    if (block.content) {
      setAwards(block.content);
    }
  }, [block.content]);

  const handleItemChange = (
    index: number,
    field: keyof AwardItem,
    value: string
  ) => {
    const updatedItems = [...awards.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    const updatedAwards = { ...awards, items: updatedItems };
    setAwards(updatedAwards);
    updateBlockContent(block.id, updatedAwards);
  };

  const addAwardItem = () => {
    const updatedItems = [
      ...awards.items,
      {
        id: crypto.randomUUID(),
        title: "",
        issuer: "",
        date: "",
        description: "",
      },
    ];

    const updatedAwards = { ...awards, items: updatedItems };
    setAwards(updatedAwards);
    updateBlockContent(block.id, updatedAwards);
  };

  const removeAwardItem = (index: number) => {
    const updatedItems = awards.items.filter((_, i) => i !== index);
    const updatedAwards = { ...awards, items: updatedItems };
    setAwards(updatedAwards);
    updateBlockContent(block.id, updatedAwards);
  };

  return (
    <div className="space-y-6">
      {awards.items.map((item, itemIndex) => (
        <Card key={item.id} className="border border-muted">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">수상 #{itemIndex + 1}</h3>
              {awards.items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAwardItem(itemIndex)}
                  className="text-destructive h-8 w-8"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${itemIndex}`}>수상명</Label>
                <Input
                  id={`title-${itemIndex}`}
                  value={item.title}
                  onChange={(e) =>
                    handleItemChange(itemIndex, "title", e.target.value)
                  }
                  placeholder="우수 개발자상"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`issuer-${itemIndex}`}>수여 기관</Label>
                  <Input
                    id={`issuer-${itemIndex}`}
                    value={item.issuer}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "issuer", e.target.value)
                    }
                    placeholder="한국소프트웨어협회"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${itemIndex}`}>수상일</Label>
                  <Input
                    id={`date-${itemIndex}`}
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleItemChange(itemIndex, "date", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${itemIndex}`}>
                  설명 (선택사항)
                </Label>
                <Textarea
                  id={`description-${itemIndex}`}
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(itemIndex, "description", e.target.value)
                  }
                  placeholder="수상 내역에 대한 추가 설명을 입력하세요."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addAwardItem}
        className="w-full"
      >
        <Plus size={16} className="mr-2" />
        수상 내역 추가
      </Button>
    </div>
  );
}
