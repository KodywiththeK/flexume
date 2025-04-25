import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("notion_access_token")?.value

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated with Notion" }, { status: 401 })
  }

  try {
    const notion = new Client({ auth: accessToken })

    // 사용자의 페이지 목록 조회
    const response = await notion.search({
      filter: {
        property: "object",
        value: "page",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Failed to fetch Notion pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}
