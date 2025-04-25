declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NOTION_API_KEY: string
      NOTION_API_SECRET: string
      NEXT_PUBLIC_APP_URL?: string
    }
  }
}

export {}
