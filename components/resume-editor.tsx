"use client";

import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useResumeStore } from "@/store/resume-store";
import ResumeBlocks from "./resume-blocks";
import ControlPanel from "./control-panel";
import TemplateSelector from "./template-selector";
import VersionManager from "./version-manager";
import PDFPreview from "./pdf-preview";
import { Button } from "@/components/ui/button";
import { Download, Eye, Plus, Save, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";

export default function ResumeEditor() {
  const [activeTab, setActiveTab] = useState("edit");
  const [showPreview, setShowPreview] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [newResumeTemplate, setNewResumeTemplate] = useState<
    "classic" | "modern" | "minimal"
  >("classic");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 강제 리렌더링을 위한 상태 추가
  const [forceUpdate, setForceUpdate] = useState(0);

  const {
    resumes,
    currentResume,
    currentVersion,
    createResume,
    selectResume,
    isEditing,
    startEditing,
    saveChanges,
    cancelEditing,
    draftVersion,
  } = useResumeStore();
  console.log("draftVersion", draftVersion);
  console.log("currentVersion", currentVersion);

  // 디버깅용 로그 함수
  const logDebugInfo = useCallback(() => {
    console.log("===== DEBUG INFO =====");
    console.log("Resumes:", resumes);
    console.log("Current Resume:", useResumeStore.getState().currentResume);
    console.log(
      "Current Version:",
      currentResume
        ? currentResume.versions.find(
            (v) => v.versionId === currentVersion?.versionId
          )
        : null
    );
    console.log("Is Editing:", isEditing);
    console.log("=====================");
  }, [resumes, currentResume, currentVersion, isEditing]);

  // 컴포넌트 마운트 시 스토어 초기화
  useEffect(() => {
    console.log("Mounting ResumeEditor component");
    // 첫 번째 마운트 시 모든 상태가 로드된 후 강제 리렌더링
    setTimeout(() => {
      setForceUpdate((prev) => prev + 1);
      logDebugInfo();
    }, 100);
  }, [logDebugInfo]);

  // 이력서 목록이나 현재 이력서 ID가 변경될 때 UI 업데이트
  useEffect(() => {
    const storeState = useResumeStore.getState();

    console.log("Resumes or currentResume changed:", {
      resumesCount: resumes.length,
      currentResumeId: storeState.currentResumeId,
      hasCurrentResume: !!currentResume,
    });

    if (resumes.length > 0 && !currentResume) {
      console.log("No current resume selected, selecting first resume");
      // 이력서가 있는데 선택된 이력서가 없는 경우, 첫 번째 이력서 선택
      selectResume(resumes[0].id);

      // 상태 업데이트 후 강제 리렌더링
      setTimeout(() => {
        setForceUpdate((prev) => prev + 1);
        logDebugInfo();
      }, 100);
    }
  }, [resumes, currentResume, selectResume, logDebugInfo]);

  const handleCreateResume = () => {
    if (!newResumeTitle.trim()) return;

    console.log("Creating new resume:", newResumeTitle, newResumeTemplate);
    createResume(newResumeTitle, newResumeTemplate);
    setNewResumeTitle("");
    setNewResumeTemplate("classic");
    setIsDialogOpen(false);

    // 강제 리렌더링
    setTimeout(() => {
      setForceUpdate((prev) => prev + 1);
      setActiveTab("edit");
      logDebugInfo();
    }, 200);
  };

  const handleSelectResume = (resumeId: string) => {
    console.log("Selecting resume with ID:", resumeId);
    selectResume(resumeId);

    // 상태 업데이트 후 강제 리렌더링
    setTimeout(() => {
      setForceUpdate((prev) => prev + 1);
      logDebugInfo();
    }, 100);
  };

  // 편집 시작 핸들러
  const handleStartEditing = () => {
    startEditing();
    setForceUpdate((prev) => prev + 1);
  };

  // 변경사항 저장 핸들러
  const handleSaveChanges = () => {
    saveChanges();
    setForceUpdate((prev) => prev + 1);
  };

  // 편집 취소 핸들러
  const handleCancelEditing = () => {
    cancelEditing();
    setForceUpdate((prev) => prev + 1);
  };

  if (showPreview) {
    return <PDFPreview onBack={() => setShowPreview(false)} />;
  }

  // 디버깅용 로그
  console.log("Render ResumeEditor:", {
    resumesCount: resumes.length,
    currentResumeId: currentResume?.id,
    currentVersionId: currentVersion?.versionId,
    forceUpdate,
    isEditing,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">이력서 편집기</h1>

            {resumes.length > 0 && (
              <select
                className="border rounded px-2 py-1 text-sm"
                value={currentResume?.id || ""}
                onChange={(e) => handleSelectResume(e.target.value)}
                disabled={isEditing}
              >
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            )}

            {/* 현재 편집 중인 이력서와 버전 정보 표시 */}
            {currentResume && currentVersion && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-1">
                  {currentResume.title}
                </Badge>
                <span className="text-muted-foreground">/</span>
                <Badge variant="outline" className="px-2 py-1">
                  {currentVersion.name}
                </Badge>
                {isEditing && (
                  <Badge variant="secondary" className="px-2 py-1">
                    편집 중
                  </Badge>
                )}
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isEditing}>
                  <Plus size={16} className="mr-1" />새 이력서
                </Button>
              </DialogTrigger>
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
                        setNewResumeTemplate(value as any)
                      }
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="classic"
                          id="new-classic"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="new-classic"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="mb-2">Classic</div>
                          <div className="text-xs text-center text-muted-foreground">
                            기본 이력서 스타일
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="modern"
                          id="new-modern"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="new-modern"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="mb-2">Modern</div>
                          <div className="text-xs text-center text-muted-foreground">
                            컬러 포인트 강조
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="minimal"
                          id="new-minimal"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="new-minimal"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="mb-2">Minimal</div>
                          <div className="text-xs text-center text-muted-foreground">
                            심플한 디자인
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleCreateResume}
                    disabled={!newResumeTitle.trim()}
                  >
                    생성
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            {/* 저장 및 편집 관련 버튼 */}
            {currentResume && currentVersion && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancelEditing}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      취소
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      저장
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleStartEditing}
                    className="flex items-center gap-2"
                  >
                    편집
                  </Button>
                )}
              </>
            )}

            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
              disabled={!currentResume || !currentVersion}
            >
              <Eye size={16} />
              미리보기
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowPreview(true)}
              disabled={!currentResume || !currentVersion}
            >
              <Download size={16} />
              PDF 다운로드
            </Button>
          </div>
        </header>

        {currentResume && currentVersion ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-4">
              이력서를 만들어 시작하세요
            </h2>
            <p className="text-muted-foreground mb-6">
              블록 기반 이력서 편집기로 쉽게 이력서를 만들고 관리할 수 있습니다.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} className="mr-2" />새 이력서 만들기
            </Button>
          </div>
        )}

        {/* 상태 디버깅 정보 (개발 중에만 사용) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md text-xs">
            <p>디버깅 정보:</p>
            <p>이력서 개수: {resumes.length}</p>
            <p>현재 이력서 ID: {currentResume?.id || "없음"}</p>
            <p>현재 버전 ID: {currentVersion?.versionId || "없음"}</p>
            <p>편집 중: {isEditing ? "예" : "아니오"}</p>
            <p>강제 업데이트 카운터: {forceUpdate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
