import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotionAuthState {
  isAuthenticatedWithNotion: boolean
  notionUserId: string | null
  notionUserName: string | null
  notionWorkspaces: string[] | null

  // Actions
  setNotionAuth: (data: {
    isAuthenticated: boolean
    userId?: string | null
    userName?: string | null
    workspaces?: string[] | null
  }) => void
  clearNotionAuth: () => void
  checkAuthStatus: () => Promise<void>
  logout: () => Promise<void>
  reAuthenticate: () => Promise<void>
}

export const useNotionAuthStore = create<NotionAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticatedWithNotion: false,
      notionUserId: null,
      notionUserName: null,
      notionWorkspaces: null,

      setNotionAuth: (data) =>
        set({
          isAuthenticatedWithNotion: data.isAuthenticated,
          notionUserId: data.userId || null,
          notionUserName: data.userName || null,
          notionWorkspaces: data.workspaces || null,
        }),

      clearNotionAuth: () =>
        set({
          isAuthenticatedWithNotion: false,
          notionUserId: null,
          notionUserName: null,
          notionWorkspaces: null,
        }),

      checkAuthStatus: async () => {
        try {
          const response = await fetch("/api/auth/notion/status")
          const data = await response.json()

          if (data.isAuthenticated && data.user) {
            set({
              isAuthenticatedWithNotion: true,
              notionUserId: data.user.id,
              notionUserName: data.user.name,
              // 워크스페이스 정보는 별도 API 호출로 가져올 수 있음
            })
          } else {
            set({
              isAuthenticatedWithNotion: false,
              notionUserId: null,
              notionUserName: null,
              notionWorkspaces: null,
            })
          }
        } catch (error) {
          console.error("Failed to check Notion auth status:", error)
          set({
            isAuthenticatedWithNotion: false,
            notionUserId: null,
            notionUserName: null,
            notionWorkspaces: null,
          })
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/notion/logout")
          set({
            isAuthenticatedWithNotion: false,
            notionUserId: null,
            notionUserName: null,
            notionWorkspaces: null,
          })
        } catch (error) {
          console.error("Failed to logout from Notion:", error)
        }
      },

      reAuthenticate: async () => {
        try {
          // 먼저 로그아웃
          await get().logout()
          // 새 인증 시작
          window.location.href = "/api/auth/notion/authorize"
        } catch (error) {
          console.error("Failed to re-authenticate with Notion:", error)
        }
      },
    }),
    {
      name: "notion-auth-storage",
    },
  ),
)
