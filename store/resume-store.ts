"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BlockType,
  Resume,
  ResumeBlock,
  ResumeVersion,
} from "@/types/resume";

interface ResumeState {
  resumes: Resume[];
  currentResumeId: string | null;
  currentVersionId: string | null;

  // 임시 편집 상태 관리를 위한 필드 추가
  draftVersion: ResumeVersion | null;
  isEditing: boolean;

  // Getters
  currentResume: Resume | null;
  currentVersion: ResumeVersion | null;

  // Actions
  createResume: (
    title: string,
    templateType: "classic" | "modern" | "minimal"
  ) => string;
  createVersion: (data: {
    name: string;
    memo?: string;
    tags?: string[];
  }) => void;
  selectResume: (resumeId: string) => void;
  selectVersion: (versionId: string) => void;
  deleteResume: (resumeId: string) => void;
  deleteVersion: (versionId: string) => void;

  // 편집 및 저장 관련 액션 추가
  startEditing: () => void;
  saveChanges: () => void;
  cancelEditing: () => void;

  // Block actions
  addBlock: (type: BlockType) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  toggleBlockVisibility: (blockId: string) => void;
  updateBlockContent: (blockId: string, content: any) => void;

  // Template actions
  updateTemplate: (templateType: "classic" | "modern" | "minimal") => void;
  updateTemplateStyle: (style: Record<string, any>) => void;
}

// Helper function to generate default blocks for a new resume
const generateDefaultBlocks = (): ResumeBlock[] => {
  return [
    {
      id: crypto.randomUUID(),
      type: "profile",
      isHidden: false,
      content: {
        name: "",
        email: "",
        phone: "",
        links: [{ label: "GitHub", url: "" }],
      },
    },
    {
      id: crypto.randomUUID(),
      type: "summary",
      isHidden: false,
      content: {
        content: "",
      },
    },
  ];
};

// Create a deep copy of an object
const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Create the store with persistence
export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      currentVersionId: null,
      draftVersion: null,
      isEditing: false,

      // Getters
      get currentResume() {
        const { resumes, currentResumeId } = get();
        if (!currentResumeId || !resumes || resumes.length === 0) return null;
        const resume = resumes.find((r) => r.id === currentResumeId);
        return resume || null;
      },

      get currentVersion() {
        const { currentResume, currentVersionId, draftVersion, isEditing } =
          get();

        // 편집 중이고 임시 버전이 있으면 임시 버전 반환
        if (isEditing && draftVersion) {
          return draftVersion;
        }

        if (!currentResume) return null;
        if (!currentVersionId && currentResume.versions.length > 0) {
          // 선택된 버전이 없으면 첫 번째 버전 반환
          return currentResume.versions[0];
        }
        return (
          currentResume.versions.find(
            (v) => v.versionId === currentVersionId
          ) || null
        );
      },

      // Actions
      createResume: (title, templateType) => {
        const newResumeId = crypto.randomUUID();
        const newVersionId = crypto.randomUUID();

        const newResume: Resume = {
          id: newResumeId,
          title,
          templateType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versions: [
            {
              versionId: newVersionId,
              name: "기본 버전",
              blocks: generateDefaultBlocks(),
              lastEditedAt: new Date().toISOString(),
            },
          ],
          style: {
            fontFamily: "noto-sans",
            fontSize: "14px",
            lineHeight: 1.5,
            accentColor: "#3b82f6",
            blockSpacing: "24px",
          },
        };

        set((state) => {
          // 새 이력서 추가
          const updatedResumes = [...state.resumes, newResume];

          // 디버깅 로그
          console.log(
            "Creating resume:",
            newResumeId,
            "with version:",
            newVersionId
          );
          console.log(
            "Updated resumes:",
            updatedResumes.map((r) => r.id)
          );

          return {
            resumes: updatedResumes,
            currentResumeId: newResumeId,
            currentVersionId: newVersionId,
            isEditing: false,
            draftVersion: null,
          };
        });

        // 생성된 이력서 ID 반환
        return newResumeId;
      },

      createVersion: (data) => {
        const { currentResume, currentVersion } = get();
        if (!currentResume || !currentVersion) return;

        const newVersionId = crypto.randomUUID();
        const newVersion: ResumeVersion = {
          versionId: newVersionId,
          name: data.name,
          memo: data.memo,
          tags: data.tags,
          blocks: deepCopy(currentVersion.blocks), // Deep copy blocks
          lastEditedAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedResumes = state.resumes.map((resume) => {
            if (resume.id === state.currentResumeId) {
              return {
                ...resume,
                versions: [...resume.versions, newVersion],
                updatedAt: new Date().toISOString(),
              };
            }
            return resume;
          });

          return {
            resumes: updatedResumes,
            currentVersionId: newVersionId,
            isEditing: false,
            draftVersion: null,
          };
        });
      },

      selectResume: (resumeId) => {
        // 이력서 ID가 비어있는 경우 처리
        if (!resumeId) {
          console.warn("Attempted to select resume with empty ID");
          return;
        }

        const { resumes } = get();
        const resume = resumes.find((r) => r.id === resumeId);
        if (!resume) {
          console.warn(`Resume with ID ${resumeId} not found`);
          return;
        }

        const versionId =
          resume.versions.length > 0 ? resume.versions[0].versionId : null;

        // 디버깅 로그
        console.log(
          `Selecting resume: ${resumeId}, with version: ${versionId}`
        );
        console.log(
          "Available resumes:",
          resumes.map((r) => ({ id: r.id, title: r.title }))
        );

        set({
          currentResumeId: resumeId,
          currentVersionId: versionId,
          currentResume: resume,
          currentVersion:
            resume.versions.find((v) => v.versionId === versionId) || null,
          isEditing: false,
          draftVersion: null,
        });
      },

      selectVersion: (versionId) => {
        if (!versionId) {
          console.warn("Attempted to select version with empty ID");
          return;
        }

        const { currentResume } = get();
        if (!currentResume) {
          console.warn("Cannot select version: no resume is selected");
          return;
        }

        const versionExists = currentResume.versions.some(
          (v) => v.versionId === versionId
        );
        if (!versionExists) {
          console.warn(
            `Version with ID ${versionId} not found in current resume`
          );
          return;
        }

        set({
          currentVersionId: versionId,
          currentVersion:
            currentResume.versions.find((v) => v.versionId === versionId) ||
            null,
          isEditing: false,
          draftVersion: null,
        });
      },

      deleteResume: (resumeId) => {
        set((state) => {
          const updatedResumes = state.resumes.filter((r) => r.id !== resumeId);

          // If we're deleting the current resume, select another one if available
          let newCurrentResumeId = state.currentResumeId;
          let newCurrentVersionId = state.currentVersionId;

          if (resumeId === state.currentResumeId) {
            newCurrentResumeId = updatedResumes[0]?.id || null;
            newCurrentVersionId =
              updatedResumes[0]?.versions[0]?.versionId || null;
          }

          return {
            resumes: updatedResumes,
            currentResumeId: newCurrentResumeId,
            currentVersionId: newCurrentVersionId,
            isEditing: false,
            draftVersion: null,
          };
        });
      },

      deleteVersion: (versionId) => {
        set((state) => {
          const currentResume = state.resumes.find(
            (r) => r.id === state.currentResumeId
          );
          if (!currentResume) return state;

          // Don't delete if it's the only version
          if (currentResume.versions.length <= 1) return state;

          const updatedVersions = currentResume.versions.filter(
            (v) => v.versionId !== versionId
          );

          // Update the current resume with the filtered versions
          const updatedResumes = state.resumes.map((resume) => {
            if (resume.id === state.currentResumeId) {
              return {
                ...resume,
                versions: updatedVersions,
                updatedAt: new Date().toISOString(),
              };
            }
            return resume;
          });

          // If we're deleting the current version, select another one
          let newCurrentVersionId = state.currentVersionId;
          if (versionId === state.currentVersionId) {
            newCurrentVersionId = updatedVersions[0]?.versionId || null;
          }

          return {
            resumes: updatedResumes,
            currentVersionId: newCurrentVersionId,
            isEditing: false,
            draftVersion: null,
          };
        });
      },

      // 편집 시작 - 현재 버전의 복사본을 만들어 임시 버전으로 설정
      startEditing: () => {
        const { currentResume, currentVersionId } = get();
        if (!currentResume) return;

        const currentVersion = currentResume.versions.find(
          (v) => v.versionId === currentVersionId
        );

        if (!currentVersion) {
          if (currentResume.versions.length === 0) return;
          // 버전이 선택되지 않았으면 첫 번째 버전 사용
          const firstVersion = currentResume.versions[0];
          set({
            currentVersionId: firstVersion.versionId,
            draftVersion: deepCopy(firstVersion),
            isEditing: true,
          });
        } else {
          set({
            draftVersion: deepCopy(currentVersion),
            isEditing: true,
          });
        }
      },

      // 변경사항 저장
      saveChanges: () => {
        const { currentResumeId, currentVersionId, draftVersion } = get();
        if (!currentResumeId || !currentVersionId || !draftVersion) return;

        set((state) => {
          const updatedResumes = state.resumes.map((resume) => {
            if (resume.id === currentResumeId) {
              const updatedVersions = resume.versions.map((version) => {
                if (version.versionId === currentVersionId) {
                  return {
                    ...draftVersion,
                    lastEditedAt: new Date().toISOString(),
                  };
                }
                return version;
              });

              return {
                ...resume,
                versions: updatedVersions,
                updatedAt: new Date().toISOString(),
              };
            }
            return resume;
          });

          return {
            resumes: updatedResumes,
            isEditing: false,
            draftVersion: null,
            currentVersion: updatedResumes
              .find((r) => r.id === currentResumeId)
              ?.versions.find((v) => v.versionId === currentVersionId),
          };
        });
      },

      // 편집 취소
      cancelEditing: () => {
        set({
          isEditing: false,
          draftVersion: null,
        });
      },

      // Block actions
      addBlock: (type) => {
        const { currentResume, currentVersionId, isEditing, draftVersion } =
          get();
        if (!currentResume) return;

        console.log("Adding block:", type);

        // Create a new block based on type
        const newBlock: ResumeBlock = {
          id: crypto.randomUUID(),
          type,
          isHidden: false,
          content: {},
        };

        // Initialize content based on block type
        switch (type) {
          case "profile":
            newBlock.content = {
              name: "",
              email: "",
              phone: "",
              links: [{ label: "GitHub", url: "" }],
            };
            break;
          case "summary":
            newBlock.content = { content: "" };
            break;
          case "experience":
            newBlock.content = {
              items: [
                {
                  id: crypto.randomUUID(),
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  isCurrentPosition: false,
                  description: "",
                  achievements: [""],
                },
              ],
            };
            break;
          case "education":
            newBlock.content = {
              items: [
                {
                  id: crypto.randomUUID(),
                  school: "",
                  degree: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  status: "graduated",
                },
              ],
            };
            break;
          case "projects":
            newBlock.content = {
              items: [
                {
                  id: crypto.randomUUID(),
                  title: "",
                  role: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  skills: [],
                },
              ],
            };
            break;
          case "skills":
            newBlock.content = {
              categories: [
                {
                  id: crypto.randomUUID(),
                  name: "프론트엔드",
                  skills: [],
                },
              ],
            };
            break;
          case "certifications":
            newBlock.content = {
              items: [
                {
                  id: crypto.randomUUID(),
                  name: "",
                  issuer: "",
                  date: "",
                  description: "",
                },
              ],
            };
            break;
          case "awards":
            newBlock.content = {
              items: [
                {
                  id: crypto.randomUUID(),
                  title: "",
                  issuer: "",
                  date: "",
                  description: "",
                },
              ],
            };
            break;
          case "etc":
            newBlock.content = { content: "" };
            break;
          default:
            break;
        }

        // 편집 중이면 임시 버전에 블록 추가
        if (isEditing && draftVersion) {
          set({
            draftVersion: {
              ...draftVersion,
              blocks: [...draftVersion.blocks, newBlock],
              lastEditedAt: new Date().toISOString(),
            },
          });
          return;
        }

        // 편집 중이 아니면 편집 모드로 전환하고 임시 버전에 블록 추가
        const currentVersion =
          currentResume.versions.find(
            (v) => v.versionId === currentVersionId
          ) || currentResume.versions[0];

        if (!currentVersion) return;

        const newDraftVersion = deepCopy(currentVersion);
        newDraftVersion.blocks.push(newBlock);

        set({
          currentVersionId: currentVersion.versionId,
          draftVersion: newDraftVersion,
          isEditing: true,
        });
      },

      removeBlock: (blockId) => {
        const { isEditing, draftVersion } = get();

        // 편집 중이면 임시 버전에서 블록 제거
        if (isEditing && draftVersion) {
          set({
            draftVersion: {
              ...draftVersion,
              blocks: draftVersion.blocks.filter(
                (block) => block.id !== blockId
              ),
              lastEditedAt: new Date().toISOString(),
            },
          });
          return;
        }

        // 편집 중이 아니면 편집 모드로 전환하고 임시 버전에서 블록 제거
        const { currentResume, currentVersionId } = get();
        if (!currentResume) return;

        const currentVersion =
          currentResume.versions.find(
            (v) => v.versionId === currentVersionId
          ) || currentResume.versions[0];

        if (!currentVersion) return;

        const newDraftVersion = deepCopy(currentVersion);
        newDraftVersion.blocks = newDraftVersion.blocks.filter(
          (block) => block.id !== blockId
        );

        set({
          currentVersionId: currentVersion.versionId,
          draftVersion: newDraftVersion,
          isEditing: true,
        });
      },

      moveBlock: (fromIndex, toIndex) => {
        const { isEditing, draftVersion } = get();

        // 편집 중이면 임시 버전에서 블록 이동
        if (isEditing && draftVersion) {
          const blocks = [...draftVersion.blocks];
          const [movedBlock] = blocks.splice(fromIndex, 1);
          blocks.splice(toIndex, 0, movedBlock);

          set({
            draftVersion: {
              ...draftVersion,
              blocks,
              lastEditedAt: new Date().toISOString(),
            },
          });
          return;
        }

        // 편집 중이 아니면 편집 모드로 전환하고 임시 버전에서 블록 이동
        const { currentResume, currentVersionId } = get();
        if (!currentResume) return;

        const currentVersion =
          currentResume.versions.find(
            (v) => v.versionId === currentVersionId
          ) || currentResume.versions[0];

        if (!currentVersion) return;

        const newDraftVersion = deepCopy(currentVersion);
        const blocks = newDraftVersion.blocks;
        const [movedBlock] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, movedBlock);

        set({
          currentVersionId: currentVersion.versionId,
          draftVersion: newDraftVersion,
          isEditing: true,
        });
      },

      toggleBlockVisibility: (blockId) => {
        const { isEditing, draftVersion } = get();

        // 편집 중이면 임시 버전에서 블록 가시성 토글
        if (isEditing && draftVersion) {
          const updatedBlocks = draftVersion.blocks.map((block) => {
            if (block.id === blockId) {
              return {
                ...block,
                isHidden: !block.isHidden,
              };
            }
            return block;
          });

          set({
            draftVersion: {
              ...draftVersion,
              blocks: updatedBlocks,
              lastEditedAt: new Date().toISOString(),
            },
          });
          return;
        }

        // 편집 중이 아니면 편집 모드로 전환하고 임시 버전에서 블록 가시성 토글
        const { currentResume, currentVersionId } = get();
        if (!currentResume) return;

        const currentVersion =
          currentResume.versions.find(
            (v) => v.versionId === currentVersionId
          ) || currentResume.versions[0];

        if (!currentVersion) return;

        const newDraftVersion = deepCopy(currentVersion);
        newDraftVersion.blocks = newDraftVersion.blocks.map((block) => {
          if (block.id === blockId) {
            return {
              ...block,
              isHidden: !block.isHidden,
            };
          }
          return block;
        });

        set({
          currentVersionId: currentVersion.versionId,
          draftVersion: newDraftVersion,
          isEditing: true,
        });
      },

      updateBlockContent: (blockId, content) => {
        const { isEditing, draftVersion } = get();

        // 편집 중이면 임시 버전에서 블록 내용 업데이트
        if (isEditing && draftVersion) {
          const blockIndex = draftVersion.blocks.findIndex(
            (block) => block.id === blockId
          );

          if (blockIndex === -1) return;

          const updatedBlocks = [...draftVersion.blocks];
          updatedBlocks[blockIndex] = {
            ...updatedBlocks[blockIndex],
            content,
          };

          set({
            draftVersion: {
              ...draftVersion,
              blocks: updatedBlocks,
              lastEditedAt: new Date().toISOString(),
            },
          });
          return;
        }

        // 편집 중이 아니면 편집 모드로 전환하고 임시 버전에서 블록 내용 업데이트
        const { currentResume, currentVersionId } = get();
        if (!currentResume) return;

        const currentVersion =
          currentResume.versions.find(
            (v) => v.versionId === currentVersionId
          ) || currentResume.versions[0];

        if (!currentVersion) return;

        const newDraftVersion = deepCopy(currentVersion);
        const blockIndex = newDraftVersion.blocks.findIndex(
          (block) => block.id === blockId
        );

        if (blockIndex === -1) return;

        newDraftVersion.blocks[blockIndex] = {
          ...newDraftVersion.blocks[blockIndex],
          content,
        };

        set({
          currentVersionId: currentVersion.versionId,
          draftVersion: newDraftVersion,
          isEditing: true,
        });
      },

      // Template actions
      updateTemplate: (templateType) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;

        set((state) => {
          const updatedResumes = state.resumes.map((resume) => {
            if (resume.id === currentResumeId) {
              return {
                ...resume,
                templateType,
                updatedAt: new Date().toISOString(),
              };
            }
            return resume;
          });

          return { resumes: updatedResumes };
        });
      },

      updateTemplateStyle: (style) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;

        set((state) => {
          const updatedResumes = state.resumes.map((resume) => {
            if (resume.id === currentResumeId) {
              return {
                ...resume,
                style: { ...resume.style, ...style },
                updatedAt: new Date().toISOString(),
              };
            }
            return resume;
          });

          return { resumes: updatedResumes };
        });
      },
    }),
    {
      name: "resume-storage", // name of the item in localStorage
      partialize: (state) => ({
        resumes: state.resumes,
        currentResumeId: state.currentResumeId,
        currentVersionId: state.currentVersionId,
      }),
    }
  )
);

// Initialize with a default resume if none exists
export const initializeStore = () => {
  const { resumes, createResume, selectResume } = useResumeStore.getState();
  console.log("Initializing store with", resumes.length, "resumes");

  if (resumes.length === 0) {
    // 이력서가 없는 경우 기본 이력서 생성
    const newResumeId = createResume("내 이력서", "classic");
    console.log("Created default resume with ID:", newResumeId);
  } else {
    // 이력서가 있지만 선택된 이력서가 없는 경우 첫 번째 이력서 선택
    const { currentResumeId } = useResumeStore.getState();
    if (!currentResumeId) {
      selectResume(resumes[0].id);
      console.log("Selected first resume:", resumes[0].id);
    }
  }
};
