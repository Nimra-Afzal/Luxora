"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function ThemeWatcher() {
  const mode = useSelector((s: RootState) => s.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return null;
}
