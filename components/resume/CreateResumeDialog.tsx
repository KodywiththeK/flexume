"use client";

import { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { TEMPLATE_DESCRIPTIONS, TEMPLATES } from "@/constants/resume";
import { useResumeStore } from "@/store/resume-store";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

export default function CreateResumeDialog({ children }: PropsWithChildren) {
  const { createResume } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [newResumeTemplate, setNewResumeTemplate] =
    useState<(typeof TEMPLATES)[number]>("classic");
  const router = useRouter();

  const handleCreate = () => {
    if (!newResumeTitle.trim()) return;
    createResume(newResumeTitle, newResumeTemplate);
    setNewResumeTitle("");
    setNewResumeTemplate("classic");
    setIsDialogOpen(false);
    router.push(ROUTES.RESUME_EDIT);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 이력서 만들기</DialogTitle>
          <DialogDescription>
            새 이력서의 제목과 템플릿을 선택하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">이력서 제목</Label>
            <Input
              id="title"
              value={newResumeTitle}
              onChange={(e) => setNewResumeTitle(e.target.value)}
              placeholder="예: 개발자 이력서"
            />
          </div>
          <div className="grid gap-2">
            <Label>템플릿 선택</Label>
            <RadioGroup
              value={newResumeTemplate}
              onValueChange={(value) =>
                setNewResumeTemplate(value as (typeof TEMPLATES)[number])
              }
              className="grid grid-cols-3 gap-4"
            >
              {TEMPLATES.map((template) => (
                <div key={template}>
                  <RadioGroupItem
                    value={template}
                    id={`new-${template}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`new-${template}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2">
                      {template.charAt(0).toUpperCase() + template.slice(1)}
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {TEMPLATE_DESCRIPTIONS[template]}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            취소
          </Button>
          <Button onClick={handleCreate} disabled={!newResumeTitle.trim()}>
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
