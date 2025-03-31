"use client";

import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateResumeDialog from "@/components/resume/CreateResumeDialog";
import { ROUTES } from "@/constants/route";

export default function Home() {
  const router = useRouter();
  const { resumes, selectResume } = useResumeStore();

  const handleSelectResume = (resumeId: string) => {
    selectResume(resumeId);
    router.push(ROUTES.RESUME_EDIT);
  };

  return (
    <div className="container mx-auto py-12 flex flex-col gap-10">
      <h2 className="text-2xl font-bold text-center">내 이력서</h2>
      <div>
        {resumes.length === 0 ? (
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">아직 이력서가 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              새로운 이력서를 만들어 시작하세요
            </p>
            <CreateResumeDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />새 이력서 만들기
              </Button>
            </CreateResumeDialog>
          </div>
        ) : (
          <div className="grid gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectResume(resume.id)}
              >
                <h2 className="text-xl font-medium mb-2">{resume.title}</h2>
                <p className="text-muted-foreground">
                  마지막 수정: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
