"use client"

import { useResumeStore } from "@/store/resume-store"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function TemplateSelector() {
  const { currentResume, updateTemplate, updateTemplateStyle } = useResumeStore()

  if (!currentResume) {
    return <div className="text-center py-10">No resume selected</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">템플릿 선택</h2>
        <RadioGroup
          defaultValue={currentResume.templateType}
          onValueChange={(value) => updateTemplate(value as "classic" | "modern" | "minimal")}
          className="grid grid-cols-1 gap-4"
        >
          <div>
            <RadioGroupItem value="classic" id="classic" className="peer sr-only" />
            <Label
              htmlFor="classic"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-2">Classic</div>
              <div className="w-full h-32 bg-gray-100 rounded flex flex-col p-2">
                <div className="w-full h-6 bg-gray-300 mb-2 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-1/3 h-20 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">기본 이력서 스타일, 전통 기업용</div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="modern" id="modern" className="peer sr-only" />
            <Label
              htmlFor="modern"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-2">Modern</div>
              <div className="w-full h-32 bg-gray-100 rounded flex flex-col p-2">
                <div className="w-full h-6 bg-blue-300 mb-2 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-1/3 h-20 bg-blue-100 rounded"></div>
                  <div className="w-2/3 h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">컬러 포인트 + 구역 구분 강조 (스타트업 적합)</div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="minimal" id="minimal" className="peer sr-only" />
            <Label
              htmlFor="minimal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-2">Minimal</div>
              <div className="w-full h-32 bg-white rounded flex flex-col p-2">
                <div className="w-full h-6 bg-gray-200 mb-2 rounded"></div>
                <div className="flex gap-4">
                  <div className="w-1/4 h-20 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-20 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">여백 중심, 심플하고 시각적 정리 강조</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">스타일 커스터마이징</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="font-family">폰트</Label>
                <Select defaultValue="noto-sans" onValueChange={(value) => updateTemplateStyle({ fontFamily: value })}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="폰트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noto-sans">Noto Sans KR</SelectItem>
                    <SelectItem value="pretendard">Pretendard</SelectItem>
                    <SelectItem value="spoqa-han-sans">Spoqa Han Sans</SelectItem>
                    <SelectItem value="nanum-gothic">나눔고딕</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="font-size">폰트 크기</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="font-size"
                    defaultValue={[14]}
                    max={20}
                    min={10}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => updateTemplateStyle({ fontSize: `${value[0]}px` })}
                  />
                  <span className="w-12 text-center">{14}px</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="line-height">줄 간격</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="line-height"
                    defaultValue={[1.5]}
                    max={2.5}
                    min={1}
                    step={0.1}
                    className="flex-1"
                    onValueChange={(value) => updateTemplateStyle({ lineHeight: value[0] })}
                  />
                  <span className="w-12 text-center">{1.5}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accent-color">포인트 컬러</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-12 h-10 p-1"
                    onChange={(e) => updateTemplateStyle({ accentColor: e.target.value })}
                  />
                  <Input
                    type="text"
                    defaultValue="#3b82f6"
                    className="flex-1"
                    onChange={(e) => updateTemplateStyle({ accentColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="block-spacing">블록 간격</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="block-spacing"
                    defaultValue={[24]}
                    max={48}
                    min={8}
                    step={4}
                    className="flex-1"
                    onValueChange={(value) => updateTemplateStyle({ blockSpacing: `${value[0]}px` })}
                  />
                  <span className="w-12 text-center">{24}px</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

