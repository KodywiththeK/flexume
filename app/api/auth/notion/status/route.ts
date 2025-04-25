import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("notion_access_token")?.value
  const userName = request.cookies.get("notion_user_name")?.value
  const userId = request.cookies.get("notion_user_id")?.value

  if (!accessToken) {
    return NextResponse.json({ isAuthenticated: false })
  }

  try {
    // 토큰 유효성 검사 (선택적)
    const response = await fetch("https://api.notion.com/v1/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": "2022-06-28",
      },
    })

    if (!response.ok) {
      // 토큰이 유효하지 않음
      const errorResponse = NextResponse.json({ isAuthenticated: false })

      // 쿠키 제거
      errorResponse.cookies.delete("notion_access_token")
      errorResponse.cookies.delete("notion_user_name")
      errorResponse.cookies.delete("notion_user_id")

      return errorResponse
    }

    // 토큰이 유효함
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        name: userName || "Notion User",
        id: userId,
      },
    })
  } catch (error) {
    console.error("Error checking Notion authentication status:", error)
    return NextResponse.json({ isAuthenticated: false })
  }
}
