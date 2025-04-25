import NotionIntegration from "@/components/notion/notion-integration"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotionSettingsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mb-8 gap-2">
          <ArrowLeft size={16} />
          <span>홈으로 돌아가기</span>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Notion 설정</h1>

        <NotionIntegration />
      </div>
    </div>
  )
}
