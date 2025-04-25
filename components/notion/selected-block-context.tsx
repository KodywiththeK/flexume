"use client";

import { createContext, useState, type ReactNode } from "react";

interface SelectedBlockContextType {
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
}

export const SelectedBlockContext = createContext<SelectedBlockContextType>({
  selectedBlockId: null,
  setSelectedBlockId: () => {},
});

export function SelectedBlockProvider({ children }: { children: ReactNode }) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <SelectedBlockContext.Provider
      value={{ selectedBlockId, setSelectedBlockId }}
    >
      {children}
    </SelectedBlockContext.Provider>
  );
}
