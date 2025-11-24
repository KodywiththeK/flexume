"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LogOut, Menu, NotebookPen, X } from "lucide-react";
import { useState } from "react";
import { useNotionAuthStore } from "@/store/notion-auth-store";
import { NotionLogo } from "../notion/notion-logo";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticatedWithNotion, notionUserName, logout } =
    useNotionAuthStore();

  // Check if we're on the landing page
  const isLandingPage = pathname === "/";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="flex items-center">
              <span className="text-lime-600">FLEX</span>UME
            </Link>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/resume/create"
            className={`text-sm font-medium ${
              pathname.includes("/resume/create")
                ? "text-lime-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            이력서 만들기
          </Link>
          <Link
            href="/resume/notion"
            className={`text-sm font-medium ${
              pathname.includes("/resume/notion")
                ? "text-lime-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Notion 연동
          </Link>

          {isAuthenticatedWithNotion && (
            <div className="flex items-center gap-2 text-sm">
              <NotionLogo className="w-3 h-3" />
              <span className="text-gray-600">
                {notionUserName || "Notion User"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 h-7 px-2"
                onClick={() => logout()}
              >
                <LogOut size={14} />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              로그인
            </Button>
            <Button size="sm">회원가입</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            <Link
              href="/resume/create"
              className={`flex items-center gap-2 p-2 rounded-md ${
                pathname.includes("/resume/create")
                  ? "bg-lime-50 text-lime-600"
                  : "text-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={18} />
              이력서 만들기
            </Link>
            <Link
              href="/resume/notion"
              className={`flex items-center gap-2 p-2 rounded-md ${
                pathname.includes("/resume/notion")
                  ? "bg-lime-50 text-lime-600"
                  : "text-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <NotebookPen size={18} />
              Notion 연동
            </Link>

            {isAuthenticatedWithNotion && (
              <div className="flex items-center justify-between p-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <NotionLogo className="w-4 h-4" />
                  <span className="text-gray-600">
                    {notionUserName || "Notion User"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} className="mr-1" />
                  연결 해제
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Button variant="outline" className="justify-start">
                로그인
              </Button>
              <Button className="justify-start">회원가입</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
