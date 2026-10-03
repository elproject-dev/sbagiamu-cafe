"use client"

import { useEffect, useState } from "react"

const SPLASH_KEY = "splash-shown"
const SHOW_MS = 1400
const FADE_MS = 500

export function SplashScreen() {
  // "visible" -> tampil, "fading" -> fade out, "hidden" -> dihapus dari DOM
  const [phase, setPhase] = useState<"visible" | "fading" | "hidden">("visible")

  useEffect(() => {
    let alreadyShown = false
    try {
      alreadyShown = sessionStorage.getItem(SPLASH_KEY) === "1"
      sessionStorage.setItem(SPLASH_KEY, "1")
    } catch {
      // abaikan jika storage tidak tersedia
    }

    if (alreadyShown) {
      setPhase("hidden")
      return
    }

    const fadeTimer = setTimeout(() => setPhase("fading"), SHOW_MS)
    const hideTimer = setTimeout(() => setPhase("hidden"), SHOW_MS + FADE_MS)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (phase === "hidden") return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/2sbagiamu.png"
        alt="Sbagiamu Kopi Teh"
        className="w-56 h-56 md:w-72 md:h-72 object-contain animate-zoom-soft"
      />
    </div>
  )
}
