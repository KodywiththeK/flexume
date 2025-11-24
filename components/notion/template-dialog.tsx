"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "./template-selector";

export function TemplateDialog({
  open,
  onOpenChange,
  selectedTemplate,
  onSelectTemplate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent"
          onClick={() => onOpenChange(true)}
        >
          템플릿 선택
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>템플릿 선택</DialogTitle>
        </DialogHeader>

        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={onSelectTemplate}
        />

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
