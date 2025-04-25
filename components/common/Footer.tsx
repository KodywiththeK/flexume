import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <h2 className="text-xl font-bold">
              <span className="text-lime-600">FLEX</span>UME
            </h2>
            <p className="text-sm text-gray-600 mt-2">채용공고에 맞춘 이력서 편집기</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h3 className="font-medium mb-4">서비스</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/resume/create" className="hover:text-lime-600">
                    이력서 만들기
                  </Link>
                </li>
                <li>
                  <Link href="/resume/notion" className="hover:text-lime-600">
                    Notion 연동
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-lime-600">
                    템플릿 갤러리
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">회사</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-lime-600">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-lime-600">
                    블로그
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-lime-600">
                    채용
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">정보</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/terms" className="hover:text-lime-600">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-lime-600">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-lime-600">
                    고객센터
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Flexume. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
