"use client"

import { useEffect, useState } from "react"
import { useNotionAuthStore } from "@/store/notion-auth-store"
import { NotionLogo } from "./notion-logo"
import { Button } from "@/components/ui/button"
import { LogOut, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NotionAuthStatus() {
  const { isAuthenticatedWithNotion, notionUserName, checkAuthStatus, logout, reAuthenticate } = useNotionAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isReauthDialogOpen, setIsReauthDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast({
        title: "Notion 연결 해제됨",
        description: "Notion 계정 연결이 해제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "Notion 연결 해제 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReauthenticate = async () => {
    setIsReauthDialogOpen(true)
  }

  const confirmReauthenticate = async () => {
    setIsLoading(true)
    try {
      await reAuthenticate()
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "Notion 재연결 중 문제가 발생했습니다.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (!isAuthenticatedWithNotion) {
    return null
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 flex-1">
        <NotionLogo className="w-5 h-5" />
        <div>
          <p className="text-sm font-medium">
            <span className="text-gray-600">연결된 계정:</span> {notionUserName || "Notion User"}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReauthenticate}
          disabled={isLoading}
          className="text-gray-600"
        >
          <RefreshCw size={14} className="mr-1" />
          재연결
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading} className="text-red-600">
          <LogOut size={14} className="mr-1" />
          연결 해제
        </Button>
      </div>

      <AlertDialog open={isReauthDialogOpen} onOpenChange={setIsReauthDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notion 계정 재연결</AlertDialogTitle>
            <AlertDialogDescription>
              다시 연결하면 이전 이력서 내용은 덮어씌워질 수 있습니다. 그래도 진행하시겠어요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReauthenticate}>계속 연결하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
