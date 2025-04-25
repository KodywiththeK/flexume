import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/common/Footer"
import { FileText, NotebookPen } from "lucide-react"
import ResumePreview from "@/components/landing/ResumePreview"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                채용공고에 맞춘 이력서를 <span className="text-lime-600">쉽게</span> 만들고{" "}
                <span className="text-lime-600">깔끔하게</span> 제출하세요
              </h1>
              <p className="text-xl text-gray-600">
                로그인 없이 바로 시작하는 블록 기반 이력서 편집기. 채용공고별 맞춤 이력서를 손쉽게 관리하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/resume/create">
                    <FileText size={20} />
                    지금 이력서 만들기
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/resume/notion">
                    <NotebookPen size={20} />
                    Notion 이력서 불러오기
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-lime-200 rounded-lg"></div>
                <div className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-lime-600"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">블록 기반 편집</h3>
              <p className="text-gray-600">
                드래그 앤 드롭으로 이력서 섹션을 자유롭게 구성하고 편집할 수 있습니다. 필요한 블록만 선택하여 맞춤형
                이력서를 만들어보세요.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-lime-600"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">다양한 템플릿</h3>
              <p className="text-gray-600">
                클래식, 모던, 미니멀 등 다양한 디자인 템플릿을 제공합니다. 원하는 스타일로 이력서를 꾸밀 수 있습니다.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-lime-600"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">PDF 변환</h3>
              <p className="text-gray-600">
                완성된 이력서를 깔끔한 PDF 형식으로 변환하여 다운로드할 수 있습니다. 지원서 제출이 더 쉬워집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">이용 방법</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">템플릿 선택</h3>
              <p className="text-gray-600">원하는 디자인 템플릿을 선택하세요</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">블록 추가</h3>
              <p className="text-gray-600">필요한 섹션 블록을 추가하고 내용을 입력하세요</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">디자인 조정</h3>
              <p className="text-gray-600">폰트, 색상, 간격 등을 조정하여 완성도를 높이세요</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">PDF 다운로드</h3>
              <p className="text-gray-600">완성된 이력서를 PDF로 다운로드하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-lime-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">지금 바로 이력서를 만들어보세요</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            로그인 없이 바로 시작할 수 있습니다. 블록 기반 편집기로 쉽고 빠르게 전문적인 이력서를 완성하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/resume/create">
                <FileText size={20} />
                이력서 만들기
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/resume/notion">
                <NotebookPen size={20} />
                Notion 연동하기
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
