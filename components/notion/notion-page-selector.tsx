"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { NotionLogo } from "./notion-logo"
import { FileText, Calendar, ArrowRight } from "lucide-react"

interface NotionPage {
  id: string
  object: string
  created_time: string
  last_edited_time: string
  properties: any
  url: string
}

interface NotionPageSelectorProps {
  onSelect: (page: NotionPage) => void
}

export function NotionPageSelector({ onSelect }: NotionPageSelectorProps) {
  const [pages, setPages] = useState<NotionPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchPages() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/notion/pages")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch pages")
        }

        const data = await response.json()
        setPages(data.results || [])
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "페이지 로드 실패",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [toast])

  // 페이지 제목 추출
  const getPageTitle = (page: NotionPage): string => {
    try {
      // 페이지 제목 추출 로직
      const titleProperty = Object.values(page.properties).find((prop: any) => prop.type === "title") as any

      if (titleProperty?.title?.length > 0) {
        return titleProperty.title.map((t: any) => t.plain_text).join("")
      }

      return "Untitled Page"
    } catch (error) {
      return "Untitled Page"
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <NotionLogo className="w-5 h-5" />
          <h2 className="text-lg font-medium">Notion 페이지 불러오는 중...</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <h3 className="font-medium flex items-center gap-2 mb-2">오류가 발생했습니다</h3>
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800 text-center">
        <h3 className="font-medium text-lg mb-2">페이지를 찾을 수 없습니다</h3>
        <p className="mb-4">Notion에서 이력서로 사용할 수 있는 페이지가 없습니다.</p>
        <Button variant="outline" className="mt-2" onClick={() => window.open("https://notion.so", "_blank")}>
          Notion에서 페이지 만들기
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <NotionLogo className="w-5 h-5" />
        <h2 className="text-lg font-medium">이력서로 사용할 Notion 페이지를 선택하세요</h2>
      </div>

      {pages.map((page) => (
        <Card
          key={page.id}
          className="overflow-hidden hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => onSelect(page)}
        >
          <CardContent className="p-0">
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  {getPageTitle(page)}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  마지막 수정: {formatDate(page.last_edited_time)}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                선택 <ArrowRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
