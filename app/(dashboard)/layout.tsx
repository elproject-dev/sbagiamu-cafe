"use client"

import { useEffect, useState } from "react"

import { BottomNavigation } from "@/components/bottom-navigation"
import { TopBar } from "@/components/top-bar"
import { AdminFAB } from "@/components/admin-fab"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
import { LoadingSpinner } from "@/components/loading-spinner"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter()
 const [isAdmin, setIsAdmin] = useState(false)
 const [isCheckingRole, setIsCheckingRole] = useState(true)

 useEffect(() => {
 // Cek apakah ada error di URL (seperti saat user membatalkan login)
 if (window.location.hash.includes("error=access_denied") || window.location.search.includes("error=access_denied")) {
 toast.add({ title: "Akses Ditolak", description: "Anda membatalkan proses login.", type: "error" })
 router.replace("/")
 return
 }

 // Cek sesi yang ada untuk menentukan hak akses
 const checkAuthAndRole = async () => {
 const { data: { session } } = await supabase.auth.getSession()
 let userIsAdmin = false

 if (session?.user?.email) {
 if (session.user.email === "elproject.dev@gmail.com" || session.user.email === "sbagiamu.pos@gmail.com") {
 userIsAdmin = true
 setIsAdmin(true)
 }
 }

 // Daftar halaman yang HANYA boleh diakses oleh Admin
 const adminRoutes = ["/analytics", "/broadcast", "/pelanggan", "/settings"]
 const currentPath = window.location.pathname
 const isTryingToAccessAdminRoute = adminRoutes.some(route => currentPath.startsWith(route))

 if (isTryingToAccessAdminRoute && !userIsAdmin) {
 toast.add({ title: "Akses Ditolak", description: "Halaman ini khusus untuk Admin.", type: "error" })
 router.replace("/home")
 } else {
 setIsCheckingRole(false)
 }
 }

 checkAuthAndRole()

 const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
 if (!session?.user) {
 setIsAdmin(false)
 }
 })

 return () => subscription.unsubscribe()
 }, [router])

 if (isCheckingRole) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-zinc-50">
 <LoadingSpinner text="Memuat antarmuka..." />
 </div>
 )
 }

 return (
 <>
 <div className="flex flex-col min-h-screen w-full bg-card-alt dark:bg-zinc-950 transition-colors">
 <div className="w-full h-[60px] shrink-0 z-50 sticky top-0 relative">
 <TopBar />
 </div>
 <div className="flex flex-1 flex-col pb-16 lg:pb-0">
 {children}
 </div>
 <BottomNavigation />
 {isAdmin && <AdminFAB />}
 </div>
 </>
 )
}
