"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNotionAuthStore } from "@/store/notion-auth-store";
import { NotionResumeRenderer } from "@/components/notion/notion-resume-renderer";
import { Button } from "@/components/ui/button";
import type { NotionResume } from "@/types/notion-resume";

export default function NotionCustomizePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.pageId as string;
  const { isAuthenticatedWithNotion, checkAuthStatus } = useNotionAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [notionResume, setNotionResume] = useState<NotionResume | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
    };

    initAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isLoading && !isAuthenticatedWithNotion) {
      router.push("/resume/notion");
    }
  }, [isLoading, isAuthenticatedWithNotion, router]);

  useEffect(() => {
    const loadResume = async () => {
      if (!pageId || !isAuthenticatedWithNotion) return;

      try {
        setIsLoading(true);

        const response = await fetch("/api/notion/resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageId,
            templateId: "modern",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create resume");
        }

        const data = await response.json();
        setNotionResume(data);

        toast({
          title: "이력서 불러오기 성공",
          description: "Notion 페이지를 성공적으로 불러왔습니다.",
        });
      } catch (error: any) {
        toast({
          title: "이력서 불러오기 실패",
          description: error.message,
          variant: "destructive",
        });
        router.push("/resume/notion/import");
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [pageId, isAuthenticatedWithNotion, router, toast]);

  const handleRefresh = async () => {
    if (!notionResume) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/notion/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId,
          templateId: notionResume?.selectedTemplate || "modern",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh resume");
      }

      const data = await response.json();
      setNotionResume(data);

      toast({
        title: "이력서 새로고침 성공",
        description: "Notion 페이지를 다시 불러왔습니다.",
      });
    } catch (error: any) {
      toast({
        title: "이력서 새로고침 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!notionResume) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <Link
            href="/resume/notion/import"
            className="flex items-center text-gray-500 hover:text-gray-700 gap-2 mb-8"
          >
            <ArrowLeft size={16} />
            <span>뒤로 가기</span>
          </Link>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">이력서를 불러올 수 없습니다.</p>
            <Link href="/resume/notion/import">
              <Button variant="outline">페이지 다시 선택</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/resume/notion/import"
            className="flex items-center text-gray-500 hover:text-gray-700 gap-2"
          >
            <ArrowLeft size={16} />
            <span>페이지 목록으로</span>
          </Link>

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-1 bg-transparent"
          >
            <RefreshCw size={16} />
            Notion에서 다시 불러오기
          </Button>
        </div>

        <NotionResumeRenderer resume={notionResume} onRefresh={handleRefresh} />
      </div>
    </div>
  );
}
