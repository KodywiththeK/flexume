"use client";

import { useResumeStore } from "@/store/resume-store";

export default function DebugPanel() {
  const { resumes, isEditing, getCurrentResume, getCurrentVersion } =
    useResumeStore();
  const currentResume = getCurrentResume();
  const currentVersion = getCurrentVersion();
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-md text-xs">
      <p>디버깅 정보:</p>
      <p>이력서 개수: {resumes.length}</p>
      <p>현재 이력서 ID: {currentResume?.id || "없음"}</p>
      <p>현재 버전 ID: {currentVersion?.versionId || "없음"}</p>
      <p>편집 중: {isEditing ? "예" : "아니오"}</p>
    </div>
  );
}
