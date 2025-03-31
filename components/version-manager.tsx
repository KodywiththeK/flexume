"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Badge,
} from "@/components/ui";
import { Copy, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Props = {
  setActiveTab: (value: string) => void;
};

export default function VersionManager({ setActiveTab }: Props) {
  const {
    getCurrentResume,
    currentVersionId,
    selectVersion,
    createVersion,
    deleteVersion,
  } = useResumeStore();
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionMemo, setNewVersionMemo] = useState("");
  const [newVersionTags, setNewVersionTags] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentResume = getCurrentResume();

  if (!currentResume) {
    return <div className="text-center py-10">No resume selected</div>;
  }

  const handleCreateVersion = () => {
    createVersion({
      name: newVersionName,
      memo: newVersionMemo,
      tags: newVersionTags.split(",").map((tag) => tag.trim()),
    });
    setNewVersionName("");
    setNewVersionMemo("");
    setNewVersionTags("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">이력서 버전 관리</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>새 버전 생성</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 이력서 버전 생성</DialogTitle>
              <DialogDescription>
                현재 이력서를 복사하여 새 버전을 만듭니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">버전 이름</Label>
                <Input
                  id="name"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="예: 토스 지원용"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="memo">메모 (선택사항)</Label>
                <Textarea
                  id="memo"
                  value={newVersionMemo}
                  onChange={(e) => setNewVersionMemo(e.target.value)}
                  placeholder="이 버전에 대한 메모를 남겨주세요"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                <Input
                  id="tags"
                  value={newVersionTags}
                  onChange={(e) => setNewVersionTags(e.target.value)}
                  placeholder="예: 토스, FE, 2023"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateVersion}>생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentResume.versions.map((version) => (
          <Card
            key={version.versionId}
            className={`${
              version.versionId === currentVersionId
                ? "border-primary"
                : "border-border"
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{version.name}</CardTitle>
              <CardDescription>
                마지막 수정: {formatDate(version.lastEditedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {version.memo && <p className="text-sm mb-2">{version.memo}</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                {version.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteVersion(version.versionId)}
                className="text-destructive"
              >
                <Trash2 size={16} className="mr-1" />
                삭제
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Copy version logic
                  }}
                >
                  <Copy size={16} className="mr-1" />
                  복사
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectVersion(version.versionId);
                    setActiveTab("edit");
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  편집
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
