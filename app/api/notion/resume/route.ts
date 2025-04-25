import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { convertNotionToStyledBlocks } from "@/lib/notion-converter"
import { getTemplate } from "@/lib/resume-templates"

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("notion_access_token")?.value

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated with Notion" }, { status: 401 })
  }

  try {
    const { pageId, templateId = "modern" } = await request.json()

    if (!pageId) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 })
    }

    const notion = new Client({ auth: accessToken })

    // 페이지 정보 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId })

    // 페이지 내용(블록) 가져오기
    const { results } = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    // 중첩 블록 처리
    const blocksWithChildren = await fetchChildBlocks(notion, results)

    // 기본 템플릿 가져오기
    const template = getTemplate(templateId)

    // Notion 블록을 스타일이 적용된 이력서 블록으로 변환
    const styledBlocks = convertNotionToStyledBlocks(blocksWithChildren, template)

    // 페이지 제목 추출
    const title = extractPageTitle(page)

    // 노션 이력서 객체 생성
    const notionResume = {
      id: crypto.randomUUID(),
      pageId,
      title,
      blocks: styledBlocks,
      selectedTemplate: templateId,
      customStyles: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(notionResume)
  } catch (error) {
    console.error("Failed to create Notion resume:", error)
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 })
  }
}

// 재귀적으로 자식 블록 가져오기 (위와 동일한 함수)
async function fetchChildBlocks(notion: Client, blocks: any[]) {
  const blocksWithChildren = await Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        const { results } = await notion.blocks.children.list({
          block_id: block.id,
          page_size: 100,
        })

        const children = await fetchChildBlocks(notion, results)
        return { ...block, children }
      }
      return block
    }),
  )

  return blocksWithChildren
}

// 페이지 제목 추출
function extractPageTitle(page: any): string {
  try {
    // 페이지 제목 추출 로직
    const titleProperty = Object.values(page.properties).find((prop: any) => prop.type === "title") as any

    if (titleProperty?.title?.length > 0) {
      return titleProperty.title.map((t: any) => t.plain_text).join("")
    }

    return "Untitled Resume"
  } catch (error) {
    console.error("Failed to extract page title:", error)
    return "Untitled Resume"
  }
}
