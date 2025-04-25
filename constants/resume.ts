export const TEMPLATES = ["classic", "modern", "minimal"] as const
export const TEMPLATE_DESCRIPTIONS: Record<(typeof TEMPLATES)[number], string> = {
  classic: "기본 이력서 스타일",
  modern: "컬러 포인트 강조",
  minimal: "심플한 디자인",
}
