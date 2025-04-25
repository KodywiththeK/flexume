"use client"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { cn } from "@/lib/utils"
import Link from "next/link"

type MarkdownType = {
  markdown: string
  className?: string
}

export default function MarkdownViewer({ markdown, className }: MarkdownType) {
  const cleanedMarkdown = String(markdown).replace(/^[-]{4,}$/gm, "\n---\n")
  return (
    <div className={cn(className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ children, className, ...rest }) {
            return (
              <code
                {...rest}
                className={cn(
                  className,
                  "mx-1 rounded bg-grey-200 px-[6px] py-1 text-xs font-medium text-red-500 sm:text-sm",
                )}
              >
                {String(children).replace(/\n$/, "")}
              </code>
            )
          },
          h3: ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>,
          ul: ({ children }) => <ul className="flex list-disc flex-col gap-1 pl-4 md:pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="flex list-decimal flex-col gap-1 pl-4 md:pl-5">{children}</ol>,
          li: ({ children }) => <li className="whitespace-normal marker:text-grey-800">{children}</li>,
          img: ({ src, alt }) => (
            <Image className="rounded-xl" src={src || ""} alt={alt || ""} width={800} height={600} />
          ),
          strong: ({ children }) => <span className="font-bold">{children}</span>,
          em: ({ children, node }) => {
            const isPurple = (node?.children[0] as any)?.tagName === "strong"
            return isPurple ? (
              <span className="font-semibold text-violet-600">{children}</span>
            ) : (
              <em className="font-semibold italic">{children}</em>
            )
          },
          a: ({ href, children }) => (
            <Link
              href={href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-main-600 transition-all hover:underline"
            >
              {children}
            </Link>
          ),
          p: ({ children }) => <p className="whitespace-pre-wrap break-words">{children}</p>,
          div: ({ children }) => <div className="whitespace-pre-wrap">{children}</div>,
          hr: () => <div className="mx-2 border-t border-grey-200" />,
        }}
      >
        {cleanedMarkdown}
      </ReactMarkdown>
    </div>
  )
}
