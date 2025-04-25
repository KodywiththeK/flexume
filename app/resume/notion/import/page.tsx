"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNotionAuthStore } from "@/store/notion-auth-store";
import { NotionPageSelector } from "@/components/notion/notion-page-selector";
import { NotionResumeRenderer } from "@/components/notion/notion-resume-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NotionResume } from "@/types/notion-resume";

export default function NotionImportPage() {
  const router = useRouter();
  const { isAuthenticatedWithNotion, checkAuthStatus } = useNotionAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [notionResume, setNotionResume] = useState<NotionResume | null>(null);
  const [activeTab, setActiveTab] = useState("select");
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };

    initAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    // 인증되지 않은 경우 리디렉션
    if (!isLoading && !isAuthenticatedWithNotion) {
      router.push("/resume/notion");
    }
  }, [isLoading, isAuthenticatedWithNotion, router]);

  const handlePageSelect = async (page: any) => {
    try {
      setIsLoading(true);

      // 선택한 페이지로 이력서 생성 API 호출
      const response = await fetch("/api/notion/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId: page.id,
          templateId: "modern", // 기본 템플릿
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create resume");
      }

      const data = await response.json();
      console.log(data);

      setSelectedPage(page);
      setNotionResume(data);
      setActiveTab("customize");

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!selectedPage) return;

    try {
      setIsLoading(true);

      // 동일한 페이지로 이력서 다시 생성
      const response = await fetch("/api/notion/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId: selectedPage.id,
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
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
            href="/resume/notion"
            className="flex items-center text-gray-500 hover:text-gray-700 gap-2"
          >
            <ArrowLeft size={16} />
            <span>뒤로 가기</span>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="select">페이지 선택</TabsTrigger>
            <TabsTrigger value="customize" disabled={!notionResume}>
              스타일 커스터마이징
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <NotionPageSelector onSelect={handlePageSelect} />
          </TabsContent>

          <TabsContent value="customize">
            {notionResume && (
              <NotionResumeRenderer
                resume={notionResume}
                onRefresh={handleRefresh}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
