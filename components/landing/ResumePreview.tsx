export default function ResumePreview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">홍길동</h2>
          <p className="text-gray-600">프론트엔드 개발자</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>example@email.com</p>
          <p>010-1234-5678</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2">소개</h3>
        <p className="text-sm text-gray-700">
          5년차 프론트엔드 개발자로 사용자 경험을 중시하는 웹 애플리케이션 개발에 전문성을 가지고 있습니다. React,
          TypeScript, Next.js를 활용한 프로젝트 경험이 풍부합니다.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2">경력</h3>
        <div className="mb-3">
          <div className="flex justify-between">
            <h4 className="font-medium">ABC 테크놀로지</h4>
            <span className="text-sm text-gray-600">2020.03 - 현재</span>
          </div>
          <p className="text-sm font-medium">시니어 프론트엔드 개발자</p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>React와 TypeScript를 활용한 웹 애플리케이션 개발</li>
            <li>성능 최적화를 통한 페이지 로딩 속도 40% 개선</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between">
            <h4 className="font-medium">XYZ 소프트웨어</h4>
            <span className="text-sm text-gray-600">2018.01 - 2020.02</span>
          </div>
          <p className="text-sm font-medium">프론트엔드 개발자</p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>Vue.js를 활용한 대시보드 UI 개발</li>
            <li>REST API 연동 및 데이터 시각화 구현</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2">기술 스택</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">React</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">TypeScript</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">Next.js</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">Redux</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">Tailwind CSS</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">Git</span>
        </div>
      </div>
    </div>
  )
}
