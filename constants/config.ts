export const CONFIG = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://flexume.vercel.app",
  // 서버에서만 사용: process.env.NOTION_API_KEY
  // 클라이언트에서는 NEXT_PUBLIC_ 접두사 제거
}
