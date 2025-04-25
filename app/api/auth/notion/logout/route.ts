import { NextResponse } from "next/server"

export async function GET() {
  const response = NextResponse.redirect(new URL("/resume/notion?logout=success", "http://localhost:3000"))

  // 모든 Notion 관련 쿠키 제거
  response.cookies.delete("notion_access_token")
  response.cookies.delete("notion_user_name")
  response.cookies.delete("notion_user_id")

  return response
}
