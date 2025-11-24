"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useNotionAuthStore } from "@/store/notion-auth-store"
import { NotionPageSelector } from "@/components/notion/notion-page-selector"

export default function NotionImportPage() {
  const router = useRouter()
  const { isAuthenticatedWithNotion, checkAuthStatus } = useNotionAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus()
      setIsLoading(false)
    }

    initAuth()
  }, [checkAuthStatus])

  useEffect(() => {
    if (!isLoading && !isAuthenticatedWithNotion) {
      router.push("/resume/notion")
    }
  }, [isLoading, isAuthenticatedWithNotion, router])

  const handlePageSelect = (page: any) => {
    router.push(`/resume/notion/${page.id}/customize`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/resume/notion" className="flex items-center text-gray-500 hover:text-gray-700 gap-2 mb-8">
          <ArrowLeft size={16} />
          <span>뒤로 가기</span>
        </Link>

        <NotionPageSelector onSelect={handlePageSelect} />
      </div>
    </div>
  )
}
