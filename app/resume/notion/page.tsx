"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotionAuthStore } from "@/store/notion-auth-store"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"
import { NotionAuthStatus } from "@/components/notion/notion-auth-status"
import { NotionAuthButton } from "@/components/notion/notion-auth-button"

export default function NotionResumePage() {
  const { isAuthenticatedWithNotion, checkAuthStatus } = useNotionAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus()
      setIsLoading(false)
    }

    initAuth()
  }, [checkAuthStatus])

  useEffect(() => {
    // URL 파라미터 처리
    const notionAuth = searchParams.get("notion_auth")
    const error = searchParams.get("error")
    const logout = searchParams.get("logout")

    if (notionAuth === "success") {
      toast({
        title: "Notion 연동 성공",
        description: "이제 Notion에서 이력서를 불러올 수 있습니다.",
      })
    } else if (error) {
      toast({
        title: "Notion 연동 실패",
        description: `오류가 발생했습니다: ${error}`,
        variant: "destructive",
      })
    } else if (logout === "success") {
      toast({
        title: "Notion 연결 해제됨",
        description: "Notion 계정 연결이 해제되었습니다.",
      })
    }
  }, [searchParams, toast])

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mb-8 gap-2">
          <ArrowLeft size={16} />
          <span>홈으로 돌아가기</span>
        </Link>

        {!isLoading && <NotionAuthStatus />}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <svg viewBox="0 0 120 126" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M 20.6927 21.9315C 24.5836 25.0924 26.0432 24.8512 33.3492 24.3638L 105.312 20.3159C 106.771 20.3159 105.072 19.0937 104.579 18.8525L 92.0826 10.4263C 89.6387 8.72319 86.2305 6.78003 80.6149 7.26748L 15.3957 11.8C 13.4352 12.0412 12.9425 13.0161 13.9279 14.2384L 20.6927 21.9315ZM 24.8278 37.9074L 24.8278 110.689C 24.8278 114.574 26.7883 116.035 31.1435 115.789L 106.298 111.499C 110.653 111.252 111.146 108.815 111.146 105.895L 111.146 33.6183C 111.146 30.6988 109.925 28.9956 107.235 29.2368L 28.7404 33.6183C 25.8078 33.8595 24.8278 35.5627 24.8278 37.9074ZM 99.8473 41.5544C 100.34 44.2327 99.8473 46.9109 96.9146 47.1521L 93.0456 47.6394L 93.0456 100.145C 90.1129 101.851 87.4229 102.825 85.2207 102.825C 81.6071 102.825 80.6217 101.608 77.9317 98.1969L 53.5231 61.0883L 53.5231 97.4684L 61.3183 99.4181C 61.3183 99.4181 61.3183 102.825 56.2102 102.825L 38.5045 103.8C 38.0118 102.583 38.5045 99.6593 40.7067 99.1719L 44.5757 98.1969L 44.5757 51.9232L 38.5045 51.4358C 38.0118 48.7575 39.2345 45.3466 43.0981 45.1054L 61.8109 44.2327L 87.1787 82.0556L 87.1787 48.6132L 80.8661 48.1258C 80.3734 45.2054 82.3394 42.7741 85.2721 42.5329L 99.8473 41.5544ZM 7.6557 5.07682C 10.0996 3.61356 13.4352 2.88507 17.7904 2.63388L 85.9607 0C 91.5763 0.241185 94.7453 1.21595 98.1291 3.85424L 113.348 13.9909C 117.217 16.6292 119.169 19.0937 120 22.5046L 120 111.993C 120 117.834 117.955 121.728 112.832 122.458L 30.1581 127C 25.8078 127.241 22.4168 126.754 19.7268 124.84L 6.1747 115.548C 2.5611 113.151 0 109.257 0 105.411L 0 16.1418C 0 12.0412 2.5611 7.93109 7.6557 5.07682Z" />
              </svg>
              Notion 이력서 불러오기
            </CardTitle>
            <CardDescription className="text-lg">
              Notion에서 작성한 이력서를 불러와서 Flexume 스타일로 변환해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthenticatedWithNotion ? (
              <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 text-lime-800">
                <h3 className="font-medium mb-2">Notion 계정이 연결되었습니다!</h3>
                <p className="mb-4">
                  이제 Notion 페이지를 선택하여 이력서를 불러올 수 있습니다. Notion에서 작성한 콘텐츠는 그대로
                  유지하면서 Flexume에서 스타일만 커스터마이징할 수 있습니다.
                </p>
                <Link href="/resume/notion/import">
                  <Button className="flex items-center gap-2">
                    Notion 페이지 선택하기
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 text-lime-800">
                <h3 className="font-medium mb-2">Notion 계정 연결이 필요합니다</h3>
                <p className="mb-4">
                  Notion 이력서를 불러오려면 먼저 Notion 계정을 연결해야 합니다. 아래 버튼을 클릭하여 Notion 계정을
                  연결하세요.
                </p>
                <NotionAuthButton />
              </div>
            )}

            <div className="grid gap-4">
              <h3 className="font-medium text-lg">주요 기능</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">✓ 콘텐츠 유지</h4>
                  <p className="text-sm text-gray-600">Notion에서 작성한 이력서 콘텐츠를 그대로 유지합니다.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">✓ 스타일 커스터마이징</h4>
                  <p className="text-sm text-gray-600">
                    다양한 템플릿과 스타일 옵션으로 이력서를 시각적으로 개선합니다.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">✓ 블록별 스타일링</h4>
                  <p className="text-sm text-gray-600">각 블록마다 개별적으로 스타일을 적용할 수 있습니다.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">✓ PDF 다운로드</h4>
                  <p className="text-sm text-gray-600">스타일이 적용된 이력서를 고품질 PDF로 다운로드할 수 있습니다.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              {!isAuthenticatedWithNotion ? (
                <div className="mb-4">
                  <NotionAuthButton />
                </div>
              ) : (
                <Link href="/resume/notion/import">
                  <Button className="flex items-center gap-2">
                    Notion 페이지 선택하기
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              )}
              <Button asChild variant="outline" className="ml-2">
                <Link href="/resume/create" className="flex items-center gap-2">
                  <FileText size={16} />
                  일반 이력서 만들기
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
