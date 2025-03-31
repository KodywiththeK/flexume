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
  getCurrentResume: () => Resume | null;
  getCurrentVersion: () => ResumeVersion | null;

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

// Create the store with persistence using localStorage
export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      currentVersionId: null,
      draftVersion: null,
      isEditing: false,

      // Getters
      getCurrentResume: () => {
        const { resumes, currentResumeId } = get();
        return resumes.find((r) => r.id === currentResumeId) || null;
      },
      getCurrentVersion: () => {
        const { getCurrentResume, currentVersionId } = get();
        const currentResume = getCurrentResume();
        if (!currentResume) return null;
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
          const updatedResumes = [...state.resumes, newResume];

          return {
            resumes: updatedResumes,
            currentResumeId: newResumeId,
            currentVersionId: newVersionId,
            isEditing: false,
            draftVersion: null,
          };
        });

        return newResumeId;
      },

      createVersion: (data) => {
        const { getCurrentResume, getCurrentVersion } = get();
        const currentResume = getCurrentResume();
        const currentVersion = getCurrentVersion();

        if (!currentResume || !currentVersion) return;

        const newVersionId = crypto.randomUUID();
        const newVersion: ResumeVersion = {
          versionId: newVersionId,
          name: data.name,
          memo: data.memo,
          tags: data.tags,
          blocks: deepCopy(currentVersion.blocks),
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

        set({
          currentResumeId: resumeId,
          currentVersionId: versionId,
          isEditing: false,
          draftVersion: null,
        });
      },

      selectVersion: (versionId) => {
        if (!versionId) {
          console.warn("Attempted to select version with empty ID");
          return;
        }

        const { getCurrentResume } = get();
        const currentResume = getCurrentResume();
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
          isEditing: false,
          draftVersion: null,
        });
      },

      deleteResume: (resumeId) => {
        set((state) => {
          const updatedResumes = state.resumes.filter((r) => r.id !== resumeId);
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

          if (currentResume.versions.length <= 1) return state;

          const updatedVersions = currentResume.versions.filter(
            (v) => v.versionId !== versionId
          );

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

      startEditing: () => {
        const { getCurrentResume, getCurrentVersion } = get();
        const currentResume = getCurrentResume();
        const currentVersion = getCurrentVersion();
        if (!currentResume) return;

        if (!currentVersion) {
          if (currentResume.versions.length === 0) return;
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
          };
        });
      },

      cancelEditing: () => {
        set({
          isEditing: false,
          draftVersion: null,
        });
      },

      addBlock: (type) => {
        const { getCurrentResume, isEditing, draftVersion, currentVersionId } =
          get();
        const currentResume = getCurrentResume();
        if (!currentResume) return;

        const newBlock: ResumeBlock = {
          id: crypto.randomUUID(),
          type,
          isHidden: false,
          content: {},
        };

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

        const { getCurrentResume, currentVersionId } = get();
        const currentResume = getCurrentResume();
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

        const { getCurrentResume, currentVersionId } = get();
        const currentResume = getCurrentResume();
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

        const { getCurrentResume, currentVersionId } = get();
        const currentResume = getCurrentResume();
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

        const { getCurrentResume, currentVersionId } = get();
        const currentResume = getCurrentResume();
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
      name: "resume-storage",
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
    const newResumeId = createResume("내 이력서", "classic");
    console.log("Created default resume with ID:", newResumeId);
  } else {
    const { currentResumeId } = useResumeStore.getState();
    if (!currentResumeId) {
      selectResume(resumes[0].id);
      console.log("Selected first resume:", resumes[0].id);
    }
  }
};
