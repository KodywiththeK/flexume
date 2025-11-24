"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const NotionIntegration = () => {
  const [apiKey, setApiKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    if (!apiKey) {
      toast({
        title: "API 키가 필요합니다",
        description: "Notion API 키를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      // 여기에 실제 Notion 연결 로직 구현
      // 현재는 단순히 성공 메시지만 표시
      setTimeout(() => {
        toast({
          title: "Notion 연결 성공",
          description: "Notion API가 성공적으로 연결되었습니다.",
        })
        setIsConnecting(false)
      }, 1500)
    } catch (error) {
      toast({
        title: "연결 실패",
        description: "Notion API 연결 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notion 연동 설정</CardTitle>
        <CardDescription>Notion API 키를 입력하여 Notion과 연동하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Notion API 키
            </label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_..."
              type="password"
            />
            <p className="text-xs text-muted-foreground">Notion 통합 페이지에서 API 키를 생성할 수 있습니다.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? "연결 중..." : "Notion 연결하기"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default NotionIntegration
