"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { Loader2, Mail, Phone, User, CreditCard, Award, MapPin, Calendar, Hash, ShoppingCart, Gift, Star, Percent, Sparkles } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

import { cn } from "@/lib/utils"

interface MemberData {
 name: string
 email: string
 phone: string
 points: number
 isMember: boolean
}

import { usePathname } from "next/navigation"

export default function MemberPage() {
 const pathname = usePathname()
 const isCardView = pathname === "/card"
 const [memberData, setMemberData] = useState<MemberData | null>(null)

 const showInfoAkun = !isCardView && memberData?.isMember
 const [isLoading, setIsLoading] = useState(true)

 const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
 const [regPhone, setRegPhone] = useState("")

 const [isSubmitting, setIsSubmitting] = useState(false)

 const handleRegisterMember = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsSubmitting(true)
 try {
 const { data: { session } } = await supabase.auth.getSession()
 if (!session?.user) throw new Error("Anda harus login")
 const userEmail = session.user.email || ""
 const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0]

 // Cek apakah nomor telepon sudah terdaftar di tabel customers (POS)
 const { data: phoneInCustomers } = await supabase.from('customers').select('id').eq('phone', regPhone).limit(1)
 if (phoneInCustomers && phoneInCustomers.length > 0) {
 throw new Error("Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.")
 }

 // Cek apakah nomor telepon sudah terdaftar di tabel pelanggan (Aplikasi)
 const { data: phoneInPelanggan } = await supabase.from('pelanggan').select('id').eq('phone', regPhone).limit(1)
 if (phoneInPelanggan && phoneInPelanggan.length > 0) {
 throw new Error("Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.")
 }

 const { data: existing } = await supabase.from('pelanggan').select('id').eq('email', userEmail).limit(1)

 const payload = {
 name: userName,
 email: userEmail,
 phone: regPhone,
 is_active: true
 }

 if (existing && existing.length > 0) {
 const { error } = await supabase.from('pelanggan').update(payload).eq('email', userEmail)
 if (error) throw error
 } else {
 const { error } = await supabase.from('pelanggan').insert([payload])
 if (error) throw error
 }

 // 3. Insert ke customers table agar sinkron dengan POS
 const { data: existingCustomer } = await supabase.from('customers').select('id').eq('phone', regPhone).limit(1)
 if (!existingCustomer || existingCustomer.length === 0) {
 await supabase.from('customers').insert([{
 name: userName,
 email: userEmail,
 phone: regPhone,
 membership_type: "member",
 points: 0,
 total_spent: 0
 }])
 }

 toast.add({ title: "Berhasil", description: "Member berhasil didaftarkan", type: "success" })

 setIsRegisterModalOpen(false)
 // Reload halaman agar data poin lama langsung terambil dari database
 window.location.reload()

 } catch (error: any) {
 toast.add({ title: "Gagal Mendaftar", description: error.message, type: "error" })
 } finally {
 setIsSubmitting(false)
 }
 }

 useEffect(() => {
 const fetchMemberData = async () => {
 try {
 setIsLoading(true)

 // 1. Dapatkan user session
 const { data: { session } } = await supabase.auth.getSession()
 if (!session?.user) return

 const userEmail = session.user.email || ""
 let userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0]
 let userPhone = session.user.phone || ""
 let userPoints = 0
 let userIsMember = false
 let memberCardId = "-"

 // 2. Cek apakah ada di tabel customers (sinkron dengan POS) berdasarkan email
 if (userEmail) {
 const { data: customerByEmail } = await supabase
 .from('customers')
 .select('phone, points, membership_type, name')
 .eq('email', userEmail)
 .limit(1)

 if (customerByEmail && customerByEmail.length > 0) {
 const c = customerByEmail[0]
 if (!userPhone && c.phone) userPhone = c.phone
 if (c.name) userName = c.name
 userIsMember = true
 userPoints = c.points || 0
 }
 }

 // 3. Jika belum ditemukan phone-nya, coba cari dari tabel pelanggan berdasarkan email
 if (userEmail && !userPhone) {
 const { data: pelangganData } = await supabase
 .from('pelanggan')
 .select('name, phone')
 .eq('email', userEmail)
 .limit(1)

 if (pelangganData && pelangganData.length > 0) {
 const p = pelangganData[0]
 if (!userPhone && p.phone) userPhone = p.phone
 if (p.name && !userIsMember) userName = p.name
 userIsMember = true
 }
 }

 // 4. Ambil data poin dari tabel customers (berdasarkan phone) jika belum terdeteksi dari email
 if (userPhone && userPhone !== "-" && !userIsMember) {
 const { data: customerByPhone } = await supabase
 .from('customers')
 .select('points, membership_type, name')
 .eq('phone', userPhone)
 .limit(1)

 if (customerByPhone && customerByPhone.length > 0) {
 userIsMember = true // Terdeteksi sebagai member di POS
 userPoints = customerByPhone[0].points || 0
 if (customerByPhone[0].name) userName = customerByPhone[0].name
 }
 }

 if (!userPhone) userPhone = "-"

 setMemberData({
 name: userName,
 email: userEmail,
 phone: userPhone,
 points: userPoints,
 isMember: userIsMember
 })
 } catch (error) {
 console.error("Failed to fetch member data", error)
 } finally {
 setIsLoading(false)
 }
 }

 fetchMemberData()
 }, [])

 return (
 <>
 <div className="w-full min-h-screen bg-background dark:bg-background flex flex-1 flex-col py-4 md:pt-[40px] md:pb-[80px] px-4 md:px-[20px] items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col gap-4 w-full max-w-[1400px]">


 {isLoading ? (
 <LoadingSpinner text="Memuat profil member..." />
 ) : memberData ? (
 <div className={cn("animate-in fade-in slide-in-from-bottom-4 duration-700", !showInfoAkun ? "flex justify-center" : "grid gap-8 lg:grid-cols-12")}>
 {/* Bagian Kiri/Tengah: Kartu Premium */}
 <div className={cn("flex flex-col gap-6", !showInfoAkun ? "w-full max-w-2xl" : "lg:col-span-7")}>
 {memberData.isMember ? (
 <div className="relative overflow-hidden p-5 sm:p-8 text-white shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black ring-1 ring-white/10 rounded-sm">
 {/* Efek Cahaya / Glassmorphism */}
 <div className="absolute top-0 right-0 -mt-16 -mr-16 bg-gradient-to-b from-white/10 to-transparent w-64 h-64 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 left-0 -mb-16 -ml-16 bg-gradient-to-t from-primary/20 to-transparent w-64 h-64 rounded-full blur-3xl pointer-events-none" />

 {/* Konten Kartu */}
 <div className="relative z-10 flex flex-col h-full min-h-[180px] sm:min-h-[240px] justify-between">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-lg sm:text-xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Sbagiamu Cafe</h3>
 <p className="text-[10px] sm:text-xs font-medium text-white/40 tracking-widest mt-1">MEMBERSHIP CARD</p>
 </div>
 {/* Chip Hologram */}
 <div className="w-10 h-7 sm:w-12 sm:h-9 rounded bg-gradient-to-br from-yellow-200/90 via-yellow-400/80 to-yellow-600/90 shadow-inner flex items-center justify-center overflow-hidden">
 <div className="w-full h-[1px] bg-black/20" />
 </div>
 </div>

 <div className="mt-8 sm:mt-12 transition-all duration-500">
 <div className="flex flex-row justify-between items-end gap-2 sm:gap-6">
 <div className="flex flex-col">
 <span className="text-[10px] sm:text-xs font-medium text-white/50 tracking-widest uppercase mb-1">Total Poin</span>
 <div className="flex items-baseline gap-1 sm:gap-1.5">
 <span className="text-3xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 drop-shadow-sm pr-1 sm:pr-2 pb-1">
 {memberData.points.toLocaleString('id-ID')}
 </span>
 <span className="text-sm sm:text-lg font-bold text-white/40">pts</span>
 </div>
 </div>

 </div>

 <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-white/10 flex justify-between items-center">
 <div>
 <span className="text-[8px] sm:text-[10px] font-medium text-white/40 tracking-widest uppercase block mb-0.5 sm:mb-1">Nama Pemilik</span>
 <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white/90">{memberData.name}</span>
 </div>
 <div className="text-right">
 <span className="text-[8px] sm:text-[10px] font-medium text-white/40 tracking-widest uppercase block mb-0.5 sm:mb-1">Status</span>
 <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Aktif</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="flex flex-col items-center justify-center bg-card-alt p-4 sm:p-6 text-center rounded-2xl border border-primary/10 shadow-sm w-full min-h-[240px] transition-all hover:shadow-md mt-24 sm:mt-0">
 <div className="flex flex-col items-center gap-2 sm:gap-2 w-full max-w-sm mx-auto mt-4">
 <img src="/logo-member1.png" alt="Sbagiamu Cafe Logo" className="h-30 sm:h-40 object-contain drop-shadow-sm transition-all dark:brightness-0 dark:invert dark:sepia dark:saturate-[2] dark:hue-rotate-[330deg] dark:opacity-90" />
 <div className="space-y-2">
 <h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">Gabung Member</h3>
 <p className="text-primary/80 text-xs leading-relaxed">
 Dapatkan poin setiap belanja dan nikmati promo eksklusif khusus untuk Anda yang ikut bergabung menjadi member.
 </p>
 </div>
 <Button className="w-[85%] sm:w-3/4 mt-3 h-9 sm:h-10 rounded-sm font-semibold shadow-md hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm px-6" onClick={() => setIsRegisterModalOpen(true)}>
 Daftar Sekarang
 </Button>
 </div>
 </div>
 )}
 </div>

 {/* Bagian Kanan: Info Akun */}
 {showInfoAkun && (
 <div className="lg:col-span-5 flex flex-col">
 <div className="bg-card border-l-4 border-l-primary shadow-sm flex flex-col h-full transition-all hover:shadow-md">
 <div className="p-5 grid grid-cols-2 gap-3 flex-1 content-center">
 <div className="bg-background dark:bg-muted/20 border rounded-none p-3 shadow-sm transition-all hover:shadow-md col-span-2">
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">No. Telp</p>
 <p className="font-medium text-foreground text-sm truncate">{memberData.phone}</p>
 </div>

 <div className="bg-background dark:bg-muted/20 border rounded-none p-3 shadow-sm transition-all hover:shadow-md col-span-2">
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Email Login</p>
 <p className="font-medium text-foreground text-sm truncate">{memberData.email}</p>
 </div>


 </div>
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="flex justify-center w-full mt-8 lg:mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col items-center justify-center bg-card-alt p-4 sm:p-6 text-center rounded-2xl border-none shadow-sm w-full max-w-2xl min-h-[240px] transition-all hover:shadow-md">
 <div className="flex flex-col items-center gap-2 sm:gap-2 w-full max-w-sm mx-auto mt-4">
 <img src="/logo-member1.png" alt="Sbagiamu Cafe Logo" className="h-30 sm:h-40 object-contain drop-shadow-sm dark:brightness-0 dark:invert" />
 <div className="space-y-2">
 <h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">Anda Belum Login</h3>
 <p className="text-primary/80 text-xs leading-relaxed">
 Silakan masuk ke akun Anda terlebih dahulu untuk mengakses menu Member dan menikmati fitur poin serta diskon eksklusif.
 </p>
 </div>
 <Button className="w-full mt-2 h-11 sm:h-12 rounded-full font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base" onClick={() => window.location.href = "/login?next=/member"}>
 Masuk / Login
 </Button>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
 <DialogContent className="sm:max-w-[425px] rounded-sm bg-background border-primary/20 shadow-xl">
 <button type="button" tabIndex={0} className="sr-only" aria-hidden="true" />
 <DialogHeader>
 <DialogTitle className="text-[18px] text-primary font-bold">Pendaftaran Member Baru</DialogTitle>
 <DialogDescription className="text-[12px] text-primary/70">
 Lengkapi data Anda untuk bergabung menjadi
 <br />
 member setia Sbagiamu Cafe.
 </DialogDescription>
 </DialogHeader>
 <form onSubmit={handleRegisterMember} className="space-y-4 py-4">
 <div className="space-y-2">
 <Label htmlFor="regEmail" className="text-primary font-medium">Email Terdaftar</Label>
 <Input id="regEmail" type="email" readOnly disabled value={memberData?.email || ""} className="bg-black/5 dark:bg-background border-primary/20 text-primary/60 cursor-not-allowed rounded-sm" />
 </div>
 <div className="space-y-2">
 <Label htmlFor="regPhone" className="text-primary font-medium">No. WhatsApp / Telp Aktif</Label>
 <Input id="regPhone" type="tel" required placeholder="Masukkan No.Telp" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="border-primary/30 focus-visible:ring-primary dark:bg-background dark:placeholder:text-primary-soft/40 dark:focus-visible:ring-primary-soft rounded-sm" />
 </div>
 <DialogFooter className="pt-6 gap-2">
 <Button type="button" variant="outline" onClick={() => setIsRegisterModalOpen(false)} disabled={isSubmitting} className="border-primary/50 text-primary hover:bg-primary/10 rounded-sm h-9 px-5 text-sm font-medium transition-all">Batal</Button>
 <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white rounded-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 h-9 px-6 text-sm">
 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 Daftar Sekarang
 </Button>
 </DialogFooter>
 </form>
 </DialogContent>
 </Dialog>
 </>
 )
}

