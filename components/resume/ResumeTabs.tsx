"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ControlPanel from "../control-panel";
import ResumeBlocks from "../resume-blocks";
import TemplateSelector from "../template-selector";
import VersionManager from "../version-manager";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResumeTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "edit";
  const [activeTab, setActiveTab] = useState(initialTab);
  // URL의 query param을 activeTab 상태와 동기화
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    router.replace(`?${params.toString()}`);
  }, [activeTab, router]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full mt-6"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="edit">편집</TabsTrigger>
        <TabsTrigger value="template">템플릿</TabsTrigger>
        <TabsTrigger value="versions">버전 관리</TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <ControlPanel />
          </div>
          <div className="md:col-span-3 bg-white rounded-lg shadow-md p-8 min-h-[1000px]">
            <DndProvider backend={HTML5Backend}>
              <ResumeBlocks />
            </DndProvider>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="template" className="mt-6">
        <TemplateSelector />
      </TabsContent>
      <TabsContent value="versions" className="mt-6">
        <VersionManager setActiveTab={setActiveTab} />
      </TabsContent>
    </Tabs>
  );
}
