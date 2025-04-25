"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ResumeEditor from "@/components/resume-editor";
import { useNotionAuthStore } from "@/store/notion-auth-store";
import { useToast } from "@/components/ui/use-toast";

export default function CreateResumePage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setNotionAuth } = useNotionAuthStore();

  useEffect(() => {
    // Notion 인증 결과 처리
    const notionAuth = searchParams.get("notion_auth");
    const error = searchParams.get("error");

    if (notionAuth === "success") {
      // 인증 성공 처리
      setNotionAuth({
        isAuthenticated: true,
        userId: "mock-user-id", // 실제 구현에서는 API 응답에서 받은 값 사용
        userName: "Notion User", // 실제 구현에서는 API 응답에서 받은 값 사용
      });

      toast({
        title: "Notion 연동 성공",
        description: "이제 Notion에서 이력서를 불러올 수 있습니다.",
        variant: "default",
      });
    } else if (error) {
      // ���증 실패 처리
      toast({
        title: "Notion 연동 실패",
        description: `오류가 발생했습니다: ${error}`,
        variant: "destructive",
      });
    }
  }, [searchParams, setNotionAuth, toast]);

  return <ResumeEditor />;
}
