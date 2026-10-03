"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Disc2,
  ChartBar,
  Box,
  Pointer,
  Users,
  Settings2,
  User2,
  Menu,
  Settings,
  HdIcon,
  LayoutGrid,
  CirclePercent,
  CalendarDays,
  HandCoins,
  CircleUser,
  Shield,
  ShieldUser,
  Database,
  UserCog,
  IdCard,
  ScanBarcode,
  Megaphone,
  Send,
  MapPin,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

import { supabase } from "@/lib/supabase"

const defaultMainLinks = [
  { href: "/home", label: "Beranda", icon: LayoutGrid },
  { href: "/produk", label: "Product", icon: Box },
  { href: "/card", label: "Card", icon: ScanBarcode },
  { href: "/promo", label: "Promo", icon: CirclePercent },
  { href: "/article", label: "Insight", icon: FileText },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)] rounded-t-2xl">
        {/* Main bottom bar */}
        <div className="grid grid-cols-5 py-2 px-1 relative z-10 bg-background rounded-t-2xl">
          {defaultMainLinks.map((link) => {
            const Icon = link.icon
            const isActive =
              pathname === link.href ||
              (link.href !== "/home" && pathname.startsWith(link.href))
            return link.label === "Card" ? (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center justify-center w-16 mx-auto transition-all duration-200 group"
              >
                <div className={cn(
                  "absolute -top-7 flex items-center justify-center w-14 h-14 shrink-0 aspect-square rounded-full shadow-lg border-2 border-muted transition-transform group-hover:-translate-y-1 bg-black text-white"
                )}
                style={{ borderRadius: '50%' }}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 mx-auto py-1 rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 mb-1",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[9px] font-medium text-center leading-tight",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
