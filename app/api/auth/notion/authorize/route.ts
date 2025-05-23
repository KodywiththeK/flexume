import { CONFIG } from "@/constants/config";
import { NextResponse } from "next/server";

const { APP_URL, NOTION_API_KEY } = CONFIG;
export async function GET() {
  // Notion OAuth 인증 URL 생성
  const clientId = NOTION_API_KEY;
  const redirectUri = `${APP_URL}/api/auth/notion/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "Notion API Key is not configured" },
      { status: 500 }
    );
  }

  // 상태 값 생성 (CSRF 방지)
  const state = Math.random().toString(36).substring(2);

  // 쿠키에 상태 값 저장
  const response = NextResponse.redirect(
    `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&state=${state}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`
  );

  response.cookies.set("notion_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10분
    path: "/",
  });

  return response;
}
