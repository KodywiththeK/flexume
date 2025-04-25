import { CONFIG } from "@/constants/config";
import { type NextRequest, NextResponse } from "next/server";

const { NOTION_API_KEY, NOTION_API_SECRET, APP_URL } = CONFIG;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // 저장된 상태 값 확인
  const savedState = request.cookies.get("notion_oauth_state")?.value;

  // 에러 처리
  if (error) {
    return NextResponse.redirect(
      new URL(`/resume/notion?error=${error}`, request.url)
    );
  }

  // 상태 값 검증 (CSRF 방지)
  if (!state || state !== savedState) {
    return NextResponse.redirect(
      new URL("/resume/notion?error=invalid_state", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/resume/notion?error=no_code", request.url)
    );
  }

  try {
    // Notion API를 호출하여 액세스 토큰 획득
    const clientId = NOTION_API_KEY;
    const clientSecret = NOTION_API_SECRET;
    const redirectUri = `${APP_URL}/api/auth/notion/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/resume/notion?error=missing_credentials", request.url)
      );
    }

    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL("/resume/notion?error=token_exchange_failed", request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    // 사용자 정보 가져오기
    const userResponse = await fetch("https://api.notion.com/v1/users/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Notion-Version": "2022-06-28",
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to fetch user data");
      return NextResponse.redirect(
        new URL("/resume/notion?error=user_fetch_failed", request.url)
      );
    }

    const userData = await userResponse.json();

    // 성공 응답 생성
    const response = NextResponse.redirect(
      new URL("/resume/notion?notion_auth=success", request.url)
    );

    // 토큰 및 사용자 정보를 쿠키에 저장 (HttpOnly)
    response.cookies.set("notion_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 60 * 60 * 24 * 7, // 7일 또는 토큰 만료 시간
      path: "/",
    });

    // 사용자 정보를 클라이언트에서 접근 가능한 쿠키에 저장 (민감하지 않은 정보만)
    response.cookies.set("notion_user_name", userData.name || "Notion User", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("notion_user_id", userData.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 60 * 60 * 24 * 7,
      path: "/",
    });

    // 쿠키에서 상태 값 제거
    response.cookies.delete("notion_oauth_state");

    return response;
  } catch (error) {
    console.error("Failed to exchange code for token:", error);
    return NextResponse.redirect(
      new URL("/resume/notion?error=token_exchange_failed", request.url)
    );
  }
}
