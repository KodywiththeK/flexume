"use client"

import type React from "react"

import Header from "@/components/common/Header"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <Header />
      <main className={`min-h-screen ${pathname === "/" ? "bg-white" : "bg-gray-50"}`}>{children}</main>
    </>
  )
}
