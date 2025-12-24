"use client"

import { useDispatch, useSelector } from "react-redux"
import { setTheme, toggleTheme, type ThemeMode } from "@/redux/features/themeSlice"
import type { RootState } from "@/redux/store"

export default function ThemeToggle() {
  const mode = useSelector((s: RootState) => s.theme.mode)
  const dispatch = useDispatch()

  const handleToggle = () => {
    console.log("[v0] Current theme mode:", mode)
    dispatch(toggleTheme())
    console.log("[v0] Theme toggled via button")
  }

  const handleSelect = (newMode: ThemeMode) => {
    console.log("[v0] Theme changed via dropdown from", mode, "to", newMode)
    dispatch(setTheme(newMode))
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className="border border-black rounded-md px-3 py-1"
        title="Toggle light/dark"
      >
        Toggle {mode === "light" ? "🌙" : "☀️"}
      </button>

      {/* Dropdown styles change with theme */}
      {/* <select
        value={mode}
        onChange={(e) => handleSelect(e.target.value as ThemeMode)}
        className={`border border-black rounded-md px-2 py-1 
          ${mode === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}`}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select> */}
    </div>
  )
}
