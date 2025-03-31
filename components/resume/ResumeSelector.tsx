"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useResumeStore } from "@/store/resume-store";

interface ResumeSelectorProps {
  disabled?: boolean;
}

export default function ResumeSelector({ disabled }: ResumeSelectorProps) {
  const { resumes, getCurrentResume, selectResume, isEditing } =
    useResumeStore();
  const currentResume = getCurrentResume();

  const handleSelectResume = (resumeId: string) => {
    if (!resumeId) return;
    selectResume(resumeId);
  };

  return (
    <Select
      value={currentResume?.id || ""}
      onValueChange={handleSelectResume}
      disabled={disabled || isEditing}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="이력서 선택" />
      </SelectTrigger>
      <SelectContent>
        {resumes.map((resume) => (
          <SelectItem key={resume.id} value={resume.id}>
            {resume.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
