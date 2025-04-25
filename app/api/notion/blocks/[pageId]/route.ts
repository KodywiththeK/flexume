import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function GET(request: NextRequest, { params }: { params: { pageId: string } }) {
  const accessToken = request.cookies.get("notion_access_token")?.value
  const { pageId } = params

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated with Notion" }, { status: 401 })
  }

  try {
    const notion = new Client({ auth: accessToken })

    // 페이지 정보 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId })

    // 페이지 내용(블록) 가져오기
    const { results } = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100, // 최대 100개 블록 가져오기
    })

    // 중첩 블록 처리 (재귀적으로 자식 블록 가져오기)
    const blocksWithChildren = await fetchChildBlocks(notion, results)

    return NextResponse.json({
      page,
      blocks: blocksWithChildren,
    })
  } catch (error) {
    console.error("Failed to fetch Notion blocks:", error)
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
  }
}

// 재귀적으로 자식 블록 가져오기
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
