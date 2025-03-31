import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-end gap-4">
          <h1 className="text-2xl font-bold">
            <Link href="/">FLEXUME</Link>
          </h1>
          <p className="text-sm text-gray-500">
            채용공고에 맞춘 이력서를 쉽게 만들고, 자유롭게 구성하고, PDF로
            깔끔하게 제출하세요.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">로그인/회원가입</Button>
        </div>
      </div>
    </header>
  );
}
