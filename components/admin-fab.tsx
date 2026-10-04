"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
 FileChartColumnIcon,
 UsersIcon,
 Settings2Icon,
 X,
 Settings,
 Megaphone,
 Link2
} from "lucide-react"
import { cn } from "@/lib/utils"

const adminMenus = [
 {
 name: "Analytics",
 url: "/analytics",
 icon: FileChartColumnIcon,
 },
 {
 name: "Broadcast",
 url: "/broadcast",
 icon: Megaphone,
 },
 {
 name: "Pelanggan",
 url: "/pelanggan",
 icon: UsersIcon,
 },
 {
 name: "Manajemen",
 url: "/settings",
 icon: Settings2Icon,
 },
 {
 name: "Linked",
 url: "/linked",
 icon: Link2,
 },
]

export function AdminFAB() {
 const [isOpen, setIsOpen] = useState(false)
 const pathname = usePathname()
 const fabRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
 setIsOpen(false)
 }
 }

 if (isOpen) {
 document.addEventListener("mousedown", handleClickOutside)
 }

 return () => {
 document.removeEventListener("mousedown", handleClickOutside)
 }
 }, [isOpen])

 return (
 <div ref={fabRef} className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-[100] flex flex-col items-center">
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 15, scale: 0.8 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 15, scale: 0.8 }}
 transition={{ duration: 0.2 }}
 className="flex flex-col items-center gap-3 mb-4"
 >
 {adminMenus.map((menu, index) => {
 const Icon = menu.icon
 const isActive = pathname === menu.url

 return (
 <Link href={menu.url} key={menu.name} onClick={() => setIsOpen(false)} title={menu.name}>
 <div className={cn(
 "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",
 isActive 
 ? "bg-primary text-white shadow-md shadow-primary/20" 
 : "bg-primary-soft/80 dark:bg-background/80 text-primary hover:bg-primary-soft dark:hover:bg-background"
 )}>
 <Icon className="w-5 h-5" />
 </div>
 </Link>
 )
 })}
 </motion.div>
 )}
 </AnimatePresence>

 <button
 onClick={() => setIsOpen(!isOpen)}
 className="w-14 h-14 bg-primary-soft dark:bg-background text-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
 >
 <motion.div
 animate={{ rotate: isOpen ? 180 : 0 }}
 transition={{ duration: 0.3, ease: "easeInOut" }}
 className="flex items-center justify-center"
 >
 {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
 </motion.div>
 </button>
 </div>
 )
}
