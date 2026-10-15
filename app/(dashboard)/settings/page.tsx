"use client"
import { toast } from "@/components/ui/toast"
import { Loader2, Pencil, Tag, Calendar, Package, Image as ImageIcon, Search, Plus, MapPin, X, AlignLeft, Store, Bell, Star, Megaphone, GripVertical, Type, PanelTop, Sliders, Check, Minus, Upload, Trash2, ImagePlus, MonitorSmartphone, Monitor, Smartphone, RotateCcw, ExternalLink } from "lucide-react"
import { uploadMedia, uploadLogoMedia, uploadLandingBgMedia } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { HERO_FONTS, getHeroFontClass } from "@/lib/fonts"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TablePagination } from "@/components/table-pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { ProdukSortableList } from "@/components/produk-sortable-list"

const formatRupiah = (value: string) => {
    const rawNumber = value.replace(/\D/g, "")
    if (!rawNumber) return ""
    const formatted = parseInt(rawNumber, 10).toLocaleString("id-ID")
    return `Rp ${formatted}`
}

const dummyPromos = [
    { id: 1, title: "Sayur Segar", promo: "Diskon 20%", src: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop" },
    { id: 2, title: "Bumbu Dapur", promo: "Beli 2 Gratis 1", src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop" },
    { id: 3, title: "Produk Susu", promo: "Hemat Rp 5.000", src: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=400&fit=crop" },
    { id: 4, title: "Perawatan Tubuh", promo: "Diskon Up To 50%", src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=400&fit=crop" },
    { id: 5, title: "Camilan Sehat", promo: "Promo Akhir Pekan", src: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop" },
    { id: 6, title: "Minuman Dingin", promo: "Beli 1 Gratis 1", src: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&h=400&fit=crop" },
    { id: 7, title: "Alat Kebersihan", promo: "Diskon 10%", src: "https://images.unsplash.com/photo-1584824486509-112e4181f1ce?w=600&h=400&fit=crop" },
    { id: 8, title: "Kebutuhan Bayi", promo: "Harga Spesial", src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=400&fit=crop" },
];

const dummyPilihanHariIni = [
    { id: 1, title: "Minyak Goreng 2L", price: "Rp 32.500", src: "https://images.unsplash.com/photo-1620021508207-1d575cde0440?w=400&h=400&fit=crop" },
    { id: 2, title: "Beras Premium 5kg", price: "Rp 68.000", src: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&h=400&fit=crop" },
    { id: 3, title: "Gula Pasir 1kg", price: "Rp 15.000", src: "https://images.unsplash.com/photo-1622485501177-3e6f98725f0a?w=400&h=400&fit=crop" },
    { id: 4, title: "Susu UHT 1L", price: "Rp 18.500", src: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop" },
    { id: 5, title: "Telur Ayam 1kg", price: "Rp 27.000", src: "https://images.unsplash.com/photo-1506976773554-152e46b8d4f4?w=400&h=400&fit=crop" },
    { id: 6, title: "Mie Instan Goreng", price: "Rp 3.000", src: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&h=400&fit=crop" },
];

const dummyProdukHariIni = [
    { id: 1, title: "Minyak Goreng 2L", price: "Rp 32.500", src: "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=600&h=400&fit=crop" },
    { id: 2, title: "Beras Premium 5kg", price: "Rp 69.000", src: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=600&h=400&fit=crop" },
];

const menuItems = [
    { id: 'topbar_logo', label: 'Logo Top Bar', icon: PanelTop },
    { id: 'landing_bg', label: 'Halaman Pembuka', icon: MonitorSmartphone },
    { id: 'promo', label: 'Manajemen Promo', icon: Tag },
    { id: 'pilihan', label: 'Insight', icon: Calendar },
    { id: 'produk', label: 'Produk', icon: Package },
    { id: 'banner', label: 'Banner', icon: ImageIcon },
    { id: 'hero_banner', label: 'Hero Banner Utama', icon: Store },
    { id: 'hero_banner2', label: 'Hero Banner 2', icon: Store },
    { id: 'lokasi', label: 'Kelola Outlet', icon: MapPin },
    { id: 'running_text', label: 'Running Text', icon: AlignLeft },
]

// Image upload now uses Supabase Storage bucket 'media'
// See lib/storage.ts for uploadMedia helper

export default function SettingsPage() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    // Topbar Logo Settings State
    const [topbarMode, setTopbarMode] = useState("logo_only")
    const [topbarLogoUrl, setTopbarLogoUrl] = useState("/LOGO AI NEW-05.png")
    const [topbarLogoSize, setTopbarLogoSize] = useState(34)
    const [topbarLogoColor, setTopbarLogoColor] = useState("white")
    const [topbarCompanyName, setTopbarCompanyName] = useState("SBAGIAMU")
    const [topbarTextSize, setTopbarTextSize] = useState(22)
    const [isSavingTopbar, setIsSavingTopbar] = useState(false)

    const updateTopbarLive = (updates: {
        mode?: string
        logoUrl?: string
        logoSize?: number
        logoColor?: string
        companyName?: string
        textSize?: number
    }) => {
        if (updates.mode !== undefined) setTopbarMode(updates.mode)
        if (updates.logoUrl !== undefined) setTopbarLogoUrl(updates.logoUrl)
        if (updates.logoSize !== undefined) setTopbarLogoSize(updates.logoSize)
        if (updates.logoColor !== undefined) setTopbarLogoColor(updates.logoColor)
        if (updates.companyName !== undefined) setTopbarCompanyName(updates.companyName)
        if (updates.textSize !== undefined) setTopbarTextSize(updates.textSize)

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("topbar-config-updated", { detail: updates }))
        }
    }

    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [customLogos, setCustomLogos] = useState<{ url: string; name: string; date: string }[]>([])
    const logoInputRef = useRef<HTMLInputElement>(null)

    // State Background, Font & Teks Halaman Pembuka (Landing Page)
    const [landingBgDesktop, setLandingBgDesktop] = useState("/cofee-bg.webp")
    const [landingBgMobile, setLandingBgMobile] = useState("/cofee-bg.webp")
    const [landingBgFit, setLandingBgFit] = useState("fill")
    const [landingFont, setLandingFont] = useState("mclaren")
    const [landingTitle, setLandingTitle] = useState("Nikmati Coffee\nPilihan Premium")
    const [landingSubtitle, setLandingSubtitle] = useState("Real Bean, Real Coffee\n100% Bahagia")
    const [landingBtn1Text, setLandingBtn1Text] = useState("Lihat Promo")
    const [landingBtn2Text, setLandingBtn2Text] = useState("Cek Poin")
    const [isUploadingBgDesktop, setIsUploadingBgDesktop] = useState(false)
    const [isUploadingBgMobile, setIsUploadingBgMobile] = useState(false)
    const [isSavingLandingBg, setIsSavingLandingBg] = useState(false)
    const desktopBgInputRef = useRef<HTMLInputElement>(null)
    const mobileBgInputRef = useRef<HTMLInputElement>(null)

    const handleUploadBg = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 15 * 1024 * 1024) {
            toast.add({
                title: "Ukuran Terlalu Besar",
                description: "Maksimal ukuran file background adalah 15MB.",
                type: "error",
            })
            return
        }

        if (type === 'desktop') setIsUploadingBgDesktop(true)
        else setIsUploadingBgMobile(true)

        try {
            const publicUrl = await uploadLandingBgMedia(file, type)
            if (!publicUrl) throw new Error("Gagal mengupload background ke database")

            const saveConfig = async (key: string, value: string) => {
                const { data } = await supabase.from('app_config').select('id').eq('key', key).maybeSingle()
                if (data) {
                    await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
                } else {
                    await supabase.from('app_config').insert({ key, value })
                }
            }

            if (type === 'desktop') {
                setLandingBgDesktop(publicUrl)
                await saveConfig('landing_bg_desktop', publicUrl)
                if (typeof window !== "undefined") {
                    try { localStorage.setItem('landing_bg_desktop', publicUrl) } catch (e) { }
                }
            } else {
                setLandingBgMobile(publicUrl)
                await saveConfig('landing_bg_mobile', publicUrl)
                if (typeof window !== "undefined") {
                    try { localStorage.setItem('landing_bg_mobile', publicUrl) } catch (e) { }
                }
            }

            toast.add({
                title: "Background Berhasil Diupload",
                description: `Background ${type === 'desktop' ? 'Desktop' : 'Mobile'} telah disimpan dan aktif.`,
                type: "success",
            })
        } catch (err: any) {
            toast.add({
                title: "Upload Gagal",
                description: err.message || "Terjadi kesalahan saat mengupload background.",
                type: "error",
            })
        } finally {
            if (type === 'desktop') setIsUploadingBgDesktop(false)
            else setIsUploadingBgMobile(false)
            e.target.value = ""
        }
    }

    const handleSaveLandingBg = async () => {
        setIsSavingLandingBg(true)
        try {
            const saveConfig = async (key: string, value: string) => {
                const { data } = await supabase.from('app_config').select('id').eq('key', key).maybeSingle()
                if (data) {
                    await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
                } else {
                    await supabase.from('app_config').insert({ key, value })
                }
            }
            await saveConfig('landing_bg_desktop', landingBgDesktop)
            await saveConfig('landing_bg_mobile', landingBgMobile)
            await saveConfig('landing_bg_fit', landingBgFit)
            await saveConfig('landing_font', landingFont)
            await saveConfig('landing_title', landingTitle)
            await saveConfig('landing_subtitle', landingSubtitle)
            await saveConfig('landing_btn1_text', landingBtn1Text)
            await saveConfig('landing_btn2_text', landingBtn2Text)

            if (typeof window !== "undefined") {
                try {
                    localStorage.setItem('landing_bg_desktop', landingBgDesktop)
                    localStorage.setItem('landing_bg_mobile', landingBgMobile)
                    localStorage.setItem('landing_bg_fit', landingBgFit)
                    localStorage.setItem('landing_font', landingFont)
                    localStorage.setItem('landing_title', landingTitle)
                    localStorage.setItem('landing_subtitle', landingSubtitle)
                    localStorage.setItem('landing_btn1_text', landingBtn1Text)
                    localStorage.setItem('landing_btn2_text', landingBtn2Text)
                } catch (e) { }
            }

            toast.add({
                title: "Berhasil Disimpan",
                description: "Pengaturan background, font, dan teks halaman pembuka telah disimpan.",
                type: "success",
            })
        } catch (err: any) {
            toast.add({
                title: "Gagal Menyimpan",
                description: err.message || "Terjadi kesalahan saat menyimpan pengaturan.",
                type: "error",
            })
        } finally {
            setIsSavingLandingBg(false)
        }
    }

    const handleUploadCustomLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.add({
                title: "Ukuran Terlalu Besar",
                description: "Maksimal ukuran file logo adalah 5MB.",
                type: "error",
            })
            return
        }

        setIsUploadingLogo(true)
        try {
            const publicUrl = await uploadLogoMedia(file)
            if (!publicUrl) {
                throw new Error("Gagal mengupload logo ke Supabase Storage")
            }

            const newLogoEntry = {
                url: publicUrl,
                name: file.name,
                date: new Date().toLocaleDateString("id-ID"),
            }

            const updatedList = [newLogoEntry, ...customLogos.filter((l) => l.url !== publicUrl)]
            setCustomLogos(updatedList)

            // Simpan riwayat custom logos ke Supabase app_config
            const saveConfig = async (key: string, value: string) => {
                const { data } = await supabase.from("app_config").select("id").eq("key", key).maybeSingle()
                if (data) {
                    await supabase.from("app_config").update({ value, updated_at: new Date().toISOString() }).eq("key", key)
                } else {
                    await supabase.from("app_config").insert({ key, value })
                }
            }
            await saveConfig("topbar_custom_logos", JSON.stringify(updatedList))

            // Langsung aktifkan logo baru dan update TopBar live preview
            updateTopbarLive({ logoUrl: publicUrl })

            toast.add({
                title: "Logo Berhasil Diupload",
                description: "Logo telah tersimpan di Supabase Storage & Top Bar diperbarui.",
                type: "success",
            })
        } catch (err: any) {
            toast.add({
                title: "Upload Gagal",
                description: err.message || "Terjadi kesalahan saat mengupload logo.",
                type: "error",
            })
        } finally {
            setIsUploadingLogo(false)
            if (logoInputRef.current) {
                logoInputRef.current.value = ""
            }
        }
    }

    const handleDeleteCustomLogo = async (urlToDelete: string) => {
        const updated = customLogos.filter((l) => l.url !== urlToDelete)
        setCustomLogos(updated)
        try {
            const { data } = await supabase.from("app_config").select("id").eq("key", "topbar_custom_logos").maybeSingle()
            if (data) {
                await supabase.from("app_config").update({ value: JSON.stringify(updated), updated_at: new Date().toISOString() }).eq("key", "topbar_custom_logos")
            }
            if (topbarLogoUrl === urlToDelete) {
                updateTopbarLive({ logoUrl: "/LOGO AI NEW-05.png" })
            }
            toast.add({ title: "Logo Dihapus dari Riwayat", type: "success" })
        } catch (e) { }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [activeMenu])
    const [isMounted, setIsMounted] = useState(false)

    const [promos, setPromos] = useState<any[]>([])
    const [searchPromoQuery, setSearchPromoQuery] = useState("")
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [newPromo, setNewPromo] = useState({ title: "", promo: "", src: "" })
    const [fileName, setFileName] = useState("")
    const [promoFile, setPromoFile] = useState<File | null>(null)

    // State untuk Pilihan (Event)
    const [pilihans, setPilihans] = useState<any[]>([])
    const [searchPilihanQuery, setSearchPilihanQuery] = useState("")
    const [selectedPilihanRows, setSelectedPilihanRows] = useState<number[]>([])
    const [isPilihanDialogOpen, setIsPilihanDialogOpen] = useState(false)
    const [editingPilihanId, setEditingPilihanId] = useState<number | null>(null)
    const [isSavingPilihan, setIsSavingPilihan] = useState(false)
    const [newPilihan, setNewPilihan] = useState({ title: "", description: "", src: "" })
    const [pilihanFileName, setPilihanFileName] = useState("")
    const [pilihanFile, setPilihanFile] = useState<File | null>(null)

    const [produks, setProduks] = useState<any[]>(dummyProdukHariIni)
    const [searchProdukQuery, setSearchProdukQuery] = useState("")
    const [selectedProdukRows, setSelectedProdukRows] = useState<number[]>([])
    const [isProdukDialogOpen, setIsProdukDialogOpen] = useState(false)
    const [editingProdukId, setEditingProdukId] = useState<number | null>(null)
    const [isSavingProduk, setIsSavingProduk] = useState(false)
    const [newProduk, setNewProduk] = useState({ title: "", price: "", src: "" })
    const [produkFileName, setProdukFileName] = useState("")
    const [produkFile, setProdukFile] = useState<File | null>(null)
    const [isSavingOrder, setIsSavingOrder] = useState(false)

    const [banners, setBanners] = useState<any[]>([])
    const [searchBannerQuery, setSearchBannerQuery] = useState("")
    const [selectedBannerRows, setSelectedBannerRows] = useState<number[]>([])
    const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
    const [editingBannerId, setEditingBannerId] = useState<number | null>(null)
    const [isSavingBanner, setIsSavingBanner] = useState(false)
    const [newBanner, setNewBanner] = useState({ title: "", src: "" })
    const [bannerFileName, setBannerFileName] = useState("")
    const [bannerFile, setBannerFile] = useState<File | null>(null)

    const [lokasis, setLokasis] = useState<any[]>([])
    const [searchLokasiQuery, setSearchLokasiQuery] = useState('')
    const [isLokasiDialogOpen, setIsLokasiDialogOpen] = useState(false)
    const [editingLokasiId, setEditingLokasiId] = useState<string | null>(null)
    const [lokasiFile, setLokasiFile] = useState<File | null>(null)
    const [lokasiFileName, setLokasiFileName] = useState('')
    const [isSavingLokasi, setIsSavingLokasi] = useState(false)
    const [selectedLokasiRows, setSelectedLokasiRows] = useState<string[]>([])
    const [newLokasi, setNewLokasi] = useState({ name: '', address: '', hours: '', phone: '', maps_url: '', image: '' })

    // Running Text states
    const [runningTexts, setRunningTexts] = useState<any[]>([])
    const [rtConfig, setRtConfig] = useState<{ is_enabled: boolean; speed: string }>({ is_enabled: true, speed: 'normal' })
    const [isSavingRtConfig, setIsSavingRtConfig] = useState(false)
    const [isRunningTextDialogOpen, setIsRunningTextDialogOpen] = useState(false)
    const [editingRunningTextId, setEditingRunningTextId] = useState<number | null>(null)
    const [isSavingRunningText, setIsSavingRunningText] = useState(false)
    const [newRunningText, setNewRunningText] = useState({ text: '', is_active: true })

    // Hero Banner states
    const [heroBannerText, setHeroBannerText] = useState("Nikmati Kualitas Coffee Pilihan Premium \\nReal Bean Real Coffee \\n100 % Bahagia")
    const [heroBannerFont, setHeroBannerFont] = useState("jockey")
    const [heroBannerImage, setHeroBannerImage] = useState("")
    const [heroBannerFileName, setHeroBannerFileName] = useState("")
    const [heroBannerFile, setHeroBannerFile] = useState<File | null>(null)
    const [isSavingHeroBanner, setIsSavingHeroBanner] = useState(false)

    // Hero Banner 2 states
    const [heroBanner2Text, setHeroBanner2Text] = useState("Nikmati Kualitas Coffee Pilihan Premium \\nReal Bean Real Coffee \\n100 % Bahagia")
    const [heroBanner2Font, setHeroBanner2Font] = useState("jockey")
    const [heroBanner2Image, setHeroBanner2Image] = useState("")
    const [heroBanner2FileName, setHeroBanner2FileName] = useState("")
    const [heroBanner2File, setHeroBanner2File] = useState<File | null>(null)
    const [isSavingHeroBanner2, setIsSavingHeroBanner2] = useState(false)

    const RUNNING_TEXT_TEMPLATES = [
        { label: '🛒 Selamat Datang', text: 'Selamat datang di Sbagiamu Cafe! Nikmati berbagai promo menarik hari ini.' },
        { label: '🎉 Promo Member', text: 'Member baru mendapatkan poin ekstra untuk setiap transaksi pertama!' },
        { label: '⚡ Diskon Hari Ini', text: 'Diskon spesial hari ini! Belanja minimum Rp 100.000 gratis ongkos kirim.' },
        { label: '🕐 Jam Operasional', text: 'Kami buka setiap hari pukul 07.00 – 22.00 WIB. Terima kasih telah berbelanja bersama kami!' },
        { label: '🌟 Promo Akhir Pekan', text: 'Promo akhir pekan! Dapatkan diskon hingga 50% untuk produk pilihan setiap Sabtu & Minggu.' },
    ]

    const filteredLokasis = lokasis.filter(l => l.name?.toLowerCase().includes(searchLokasiQuery.toLowerCase()))
    const isAllLokasiSelected = selectedLokasiRows.length === filteredLokasis.length && filteredLokasis.length > 0

    const handleSelectRowLokasi = (id: string, checked: boolean) => {
        if (checked) setSelectedLokasiRows([...selectedLokasiRows, id])
        else setSelectedLokasiRows(selectedLokasiRows.filter(r => r !== id))
    }

    const handleSelectAllLokasi = (checked: boolean) => {
        if (checked) setSelectedLokasiRows(filteredLokasis.map(l => l.id))
        else setSelectedLokasiRows([])
    }

    const handleEditClickLokasi = (lokasi: any) => {
        setEditingLokasiId(lokasi.id)
        setNewLokasi({ name: lokasi.name, address: lokasi.address, hours: lokasi.hours, phone: lokasi.phone, maps_url: lokasi.maps_url, image: lokasi.image })
        setLokasiFileName('')
        setLokasiFile(null)
        setIsLokasiDialogOpen(true)
    }

    const handleDeleteLokasi = async () => {
        if (selectedLokasiRows.length === 0) return
        const { error } = await supabase.from('lokasi').delete().in('id', selectedLokasiRows)
        if (!error) {
            setLokasis(lokasis.filter(l => !selectedLokasiRows.includes(l.id)))
            setSelectedLokasiRows([])
            toast.add({ title: 'Outlet berhasil dihapus', type: 'success' })
        } else {
            toast.add({ title: 'Gagal menghapus outlet', description: error.message, type: 'error' })
        }
    }

    const handleAddClickLokasi = () => {
        setEditingLokasiId(null)
        setNewLokasi({ name: '', address: '', hours: '', phone: '', maps_url: '', image: '' })
        setLokasiFileName('')
        setLokasiFile(null)
        setIsLokasiDialogOpen(true)
    }

    const handleSaveLokasi = async () => {
        setIsSavingLokasi(true)
        try {
            let imageUrl = newLokasi.image
            if (lokasiFile) {
                const url = await uploadMedia(lokasiFile, 'lokasi')
                if (url) imageUrl = url
            }

            const payload = {
                name: newLokasi.name,
                address: newLokasi.address,
                hours: newLokasi.hours,
                phone: newLokasi.phone,
                maps_url: newLokasi.maps_url,
                image: imageUrl
            }

            if (editingLokasiId) {
                const { error } = await supabase.from('lokasi').update(payload).eq('id', editingLokasiId)
                if (error) throw error
                setLokasis(lokasis.map(l => l.id === editingLokasiId ? { ...l, ...payload } : l))
                toast.add({ title: 'Outlet berhasil diperbarui', type: 'success' })
            } else {
                const { data, error } = await supabase.from('lokasi').insert([payload]).select()
                if (error) throw error
                if (data) setLokasis([...data, ...lokasis])
                toast.add({ title: 'Outlet berhasil ditambahkan', type: 'success' })
            }
            setIsLokasiDialogOpen(false)
            setNewLokasi({ name: '', address: '', hours: '', phone: '', maps_url: '', image: '' })
            setLokasiFile(null)
            setLokasiFileName('')
            setEditingLokasiId(null)
        } catch (error: any) {
            toast.add({ title: 'Terjadi kesalahan', description: error.message, type: 'error' })
        } finally {
            setIsSavingLokasi(false)
        }
    }

    const handleSaveHeroBanner = async () => {
        setIsSavingHeroBanner(true)
        try {
            let imageUrl = heroBannerImage
            if (heroBannerFile) {
                const url = await uploadMedia(heroBannerFile, 'hero_banner')
                if (url) imageUrl = url
            }

            const saveConfig = async (key: string, value: string) => {
                const { data } = await supabase.from('app_config').select('id').eq('key', key).maybeSingle()
                if (data) {
                    await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
                } else {
                    await supabase.from('app_config').insert({ key, value })
                }
            }

            await saveConfig('hero_banner_text', heroBannerText)
            await saveConfig('hero_banner_font', heroBannerFont)
            await saveConfig('hero_banner_image', imageUrl)

            setHeroBannerImage(imageUrl)
            toast.add({ title: 'Pengaturan Hero Banner Utama berhasil disimpan', type: 'success' })
        } catch (error: any) {
            toast.add({ title: 'Terjadi kesalahan', description: error.message, type: 'error' })
        } finally {
            setIsSavingHeroBanner(false)
        }
    }

    const handleSaveHeroBanner2 = async () => {
        setIsSavingHeroBanner2(true)
        try {
            let imageUrl = heroBanner2Image
            if (heroBanner2File) {
                const url = await uploadMedia(heroBanner2File, 'hero_banner')
                if (url) imageUrl = url
            }

            const saveConfig = async (key: string, value: string) => {
                const { data } = await supabase.from('app_config').select('id').eq('key', key).maybeSingle()
                if (data) {
                    await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
                } else {
                    await supabase.from('app_config').insert({ key, value })
                }
            }

            await saveConfig('hero_banner2_text', heroBanner2Text)
            await saveConfig('hero_banner2_font', heroBanner2Font)
            await saveConfig('hero_banner2_image', imageUrl)

            setHeroBanner2Image(imageUrl)
            toast.add({ title: 'Pengaturan Hero Banner 2 berhasil disimpan', type: 'success' })
        } catch (error: any) {
            toast.add({ title: 'Terjadi kesalahan', description: error.message, type: 'error' })
        } finally {
            setIsSavingHeroBanner2(false)
        }
    }

    const handleSaveTopbar = async () => {
        setIsSavingTopbar(true)
        try {
            const saveConfig = async (key: string, value: string) => {
                const { data } = await supabase.from('app_config').select('id').eq('key', key).maybeSingle()
                if (data) {
                    await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
                } else {
                    await supabase.from('app_config').insert({ key, value })
                }
            }

            await saveConfig('topbar_display_mode', topbarMode)
            await saveConfig('topbar_logo_url', topbarLogoUrl)
            await saveConfig('topbar_logo_size', topbarLogoSize.toString())
            await saveConfig('topbar_logo_color', topbarLogoColor)
            await saveConfig('topbar_company_name', topbarCompanyName)
            await saveConfig('topbar_text_size', topbarTextSize.toString())

            if (typeof window !== "undefined") {
                localStorage.setItem(
                    "topbar_logo_config",
                    JSON.stringify({
                        mode: topbarMode,
                        logoUrl: topbarLogoUrl,
                        logoSize: topbarLogoSize,
                        logoColor: topbarLogoColor,
                        companyName: topbarCompanyName,
                        textSize: topbarTextSize,
                    })
                )
            }

            toast.add({
                title: "Berhasil Disimpan",
                description: "Pengaturan logo Top Bar telah diperbarui.",
                type: "success",
            })
        } catch (error: any) {
            toast.add({
                title: "Gagal Menyimpan",
                description: error.message || "Terjadi kesalahan saat menyimpan.",
                type: "error",
            })
        } finally {
            setIsSavingTopbar(false)
        }
    }

    // fetch data effect
    useEffect(() => {
        const fetchLokasi = async () => {
            const { data } = await supabase.from('lokasi').select('*').order('created_at', { ascending: false })
            if (data) setLokasis(data)
        }
        const fetchHeroBanner = async () => {
            const { data } = await supabase.from('app_config').select('key, value').in('key', [
                'hero_banner_text', 'hero_banner_image', 'hero_banner_font',
                'hero_banner2_text', 'hero_banner2_image', 'hero_banner2_font',
                'topbar_display_mode', 'topbar_logo_url', 'topbar_logo_size', 'topbar_logo_color', 'topbar_company_name', 'topbar_text_size', 'topbar_custom_logos',
                'landing_bg_desktop', 'landing_bg_mobile', 'landing_bg_fit',
                'landing_font', 'landing_title', 'landing_subtitle', 'landing_btn1_text', 'landing_btn2_text'
            ]);
            if (data) {
                data.forEach(item => {
                    if (item.key === 'hero_banner_text') setHeroBannerText(item.value);
                    if (item.key === 'hero_banner_image') setHeroBannerImage(item.value);
                    if (item.key === 'hero_banner_font' && item.value) setHeroBannerFont(item.value);
                    if (item.key === 'hero_banner2_text') setHeroBanner2Text(item.value);
                    if (item.key === 'hero_banner2_image') setHeroBanner2Image(item.value);
                    if (item.key === 'hero_banner2_font' && item.value) setHeroBanner2Font(item.value);
                    if (item.key === 'topbar_display_mode' && item.value) setTopbarMode(item.value);
                    if (item.key === 'topbar_logo_url' && item.value) setTopbarLogoUrl(item.value);
                    if (item.key === 'topbar_logo_size' && item.value) setTopbarLogoSize(parseInt(item.value, 10));
                    if (item.key === 'topbar_logo_color' && item.value) setTopbarLogoColor(item.value);
                    if (item.key === 'topbar_company_name' && item.value) setTopbarCompanyName(item.value);
                    if (item.key === 'topbar_text_size' && item.value) setTopbarTextSize(parseInt(item.value, 10));
                    if (item.key === 'landing_bg_desktop' && item.value) setLandingBgDesktop(item.value);
                    if (item.key === 'landing_bg_mobile' && item.value) setLandingBgMobile(item.value);
                    if (item.key === 'landing_bg_fit' && item.value) setLandingBgFit(item.value);
                    if (item.key === 'landing_font' && item.value) setLandingFont(item.value);
                    if (item.key === 'landing_title' && item.value) setLandingTitle(item.value);
                    if (item.key === 'landing_subtitle' && item.value) setLandingSubtitle(item.value);
                    if (item.key === 'landing_btn1_text' && item.value) setLandingBtn1Text(item.value);
                    if (item.key === 'landing_btn2_text' && item.value) setLandingBtn2Text(item.value);
                    if (item.key === 'topbar_custom_logos' && item.value) {
                        try {
                            const parsed = JSON.parse(item.value);
                            if (Array.isArray(parsed)) setCustomLogos(parsed);
                        } catch (e) { }
                    }
                });
            }
        }
        fetchLokasi()
        fetchHeroBanner()
    }, [])

    const filteredPromos = promos.filter((p) => {
        const q = searchPromoQuery.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.promo.toLowerCase().includes(q)
    })

    const filteredPilihans = pilihans.filter((p) => {
        const q = searchPilihanQuery.toLowerCase()
        return p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    })

    const filteredProduks = produks.filter((p) => {
        const q = searchProdukQuery.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.price.toLowerCase().includes(q)
    })

    const filteredBanners = banners.filter((b) => {
        const q = searchBannerQuery.toLowerCase()
        return b.title.toLowerCase().includes(q)
    })

    const [isLoading, setIsLoading] = useState(true)

    const fetchAll = async () => {
        setIsLoading(true)
        const { data: promosData } = await supabase.from('promo').select('*').order('id', { ascending: true })
        if (promosData) setPromos(promosData)

        const { data: pilihansData } = await supabase.from('article').select('*').order('id', { ascending: true })
        if (pilihansData) setPilihans(pilihansData)

        const { data: produksData } = await supabase.from('products').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true })
        if (produksData) {
            const SUPABASE_URL = 'https://wnozfcqgcmvxvkxbxgfj.supabase.co'
            setProduks(produksData.map((item: any) => ({
                id: item.id,
                title: item.name,
                price: `Rp ${Number(item.price).toLocaleString('id-ID')}`,
                src: item.image_url
                    ? (item.image_url.startsWith('http')
                        ? item.image_url
                        : `${SUPABASE_URL}/storage/v1/object/public/product-images/${item.image_url}`)
                    : '',
                sort_order: item.sort_order,
                is_active: item.is_active,
                // keep raw for save operations
                _raw_name: item.name,
                _raw_price: item.price,
            })))
        }

        const { data: bannerData } = await supabase.from('banner').select('*').order('id', { ascending: true })
        if (bannerData) setBanners(bannerData)

        const { data: runningTextData } = await supabase.from('running_text').select('*').order('created_at', { ascending: true })
        if (runningTextData) setRunningTexts(runningTextData)

        const { data: rtCfg } = await supabase.from('running_text_config').select('*').eq('id', 1).single()
        if (rtCfg) setRtConfig({ is_enabled: rtCfg.is_enabled, speed: rtCfg.speed })
        setIsLoading(false)
    }

    useEffect(() => {
        fetchAll()
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    const isAllSelected = selectedRows.length === filteredPromos.length && filteredPromos.length > 0
    const isSomeSelected = selectedRows.length > 0 && selectedRows.length < filteredPromos.length

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(filteredPromos.map((p) => p.id))
        } else {
            setSelectedRows([])
        }
    }

    const handleSelectRow = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, id])
        } else {
            setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
        }
    }

    const handleDelete = async () => {
        const count = selectedRows.length
        const { error } = await supabase
            .from('promo')
            .delete()
            .in('id', selectedRows)
        if (!error) {
            const updated = promos.filter(p => !selectedRows.includes(p.id))
            setPromos(updated)
            setSelectedRows([])
            toast.add({ title: `${count} promo berhasil dihapus`, type: "success" })
        } else {
            toast.add({ title: "Gagal menghapus promo", description: error.message, type: "error" })
        }
    }

    const handleAddClick = () => {
        setEditingId(null)
        setNewPromo({ title: "", promo: "", src: "" })
        setFileName("")
        setPromoFile(null)
        setIsDialogOpen(true)
    }

    const handleEditClick = (promo: any) => {
        setEditingId(promo.id)
        setNewPromo({ title: promo.title, promo: promo.promo, src: promo.src })
        setFileName("Gambar saat ini")
        setIsDialogOpen(true)
    }

    const handleSavePromo = async () => {
        if (newPromo.title && newPromo.promo && (newPromo.src || promoFile)) {
            setIsSaving(true)
            let srcUrl = newPromo.src
            if (promoFile) {
                const url = await uploadMedia(promoFile, 'promo')
                if (url) srcUrl = url
            }
            const payload = { title: newPromo.title, promo: newPromo.promo, src: srcUrl }
            if (editingId) {
                const { error } = await supabase
                    .from('promo')
                    .update(payload)
                    .eq('id', editingId)
                if (!error) {
                    setPromos(promos.map(p => p.id === editingId ? { ...p, ...payload } : p))
                    toast.add({ title: "Promo berhasil diperbarui", type: "success" })
                } else {
                    toast.add({ title: "Gagal mengedit promo", description: error.message, type: "error" })
                }
            } else {
                const { data, error } = await supabase
                    .from('promo')
                    .insert([payload])
                    .select()
                if (data) {
                    setPromos([...data, ...promos])
                    toast.add({ title: "Promo baru berhasil ditambahkan", type: "success" })
                } else if (error) {
                    toast.add({ title: "Gagal menambah promo", description: error.message, type: "error" })
                }
            }
            setPromoFile(null)
            setIsSaving(false)
            setIsDialogOpen(false)
        }
    }

    const handleDeleteProduk = async () => {
        const count = selectedProdukRows.length
        const { error } = await supabase
            .from('products')
            .delete()
            .in('id', selectedProdukRows)
        if (!error) {
            const updated = produks.filter(p => !selectedProdukRows.includes(p.id))
            setProduks(updated)
            setSelectedProdukRows([])
            toast.add({ title: `${count} produk berhasil dihapus`, type: "success" })
        } else {
            toast.add({ title: "Gagal menghapus produk", description: error.message, type: "error" })
        }
    }

    const handleAddClickProduk = () => {
        setEditingProdukId(null)
        setNewProduk({ title: "", price: "", src: "" })
        setProdukFileName("")
        setProdukFile(null)
        setIsProdukDialogOpen(true)
    }

    const handleEditClickProduk = (produk: any) => {
        setEditingProdukId(produk.id)
        setNewProduk({ title: produk.title, price: produk.price, src: produk.src })
        setProdukFileName("Gambar saat ini")
        setIsProdukDialogOpen(true)
    }

    const handleSaveProduk = async () => {
        if (newProduk.title && newProduk.price) {
            setIsSavingProduk(true)
            let srcUrl = newProduk.src
            if (produkFile) {
                const url = await uploadMedia(produkFile, 'produk')
                if (url) srcUrl = url
            }
            // Extract raw number from formatted price like "Rp 15.000"
            const rawPrice = newProduk.price.replace(/[^0-9]/g, '')
            const SUPABASE_URL = 'https://wnozfcqgcmvxvkxbxgfj.supabase.co'
            const payload = {
                name: newProduk.title,
                price: rawPrice ? Number(rawPrice) : 0,
                image_url: srcUrl,
            }
            if (editingProdukId) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingProdukId)
                if (!error) {
                    setProduks(produks.map(p => p.id === editingProdukId ? {
                        ...p,
                        title: newProduk.title,
                        price: newProduk.price,
                        src: srcUrl.startsWith('http') ? srcUrl : srcUrl ? `${SUPABASE_URL}/storage/v1/object/public/product-images/${srcUrl}` : p.src,
                    } : p))
                    toast.add({ title: "Produk berhasil diperbarui", type: "success" })
                } else {
                    toast.add({ title: "Gagal mengedit produk", description: error.message, type: "error" })
                }
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([{ ...payload, sort_order: produks.length + 1 }])
                    .select()
                if (data && data[0]) {
                    const newItem = data[0]
                    setProduks([...produks, {
                        id: newItem.id,
                        title: newItem.name,
                        price: `Rp ${Number(newItem.price).toLocaleString('id-ID')}`,
                        src: newItem.image_url
                            ? (newItem.image_url.startsWith('http') ? newItem.image_url : `${SUPABASE_URL}/storage/v1/object/public/product-images/${newItem.image_url}`)
                            : '',
                        sort_order: newItem.sort_order,
                        is_active: newItem.is_active,
                    }])
                    toast.add({ title: "Produk baru berhasil ditambahkan", type: "success" })
                } else if (error) {
                    toast.add({ title: "Gagal menambah produk", description: error.message, type: "error" })
                }
            }
            setProdukFile(null)
            setIsSavingProduk(false)
            setIsProdukDialogOpen(false)
        }
    }

    const isAllProdukSelected = selectedProdukRows.length === filteredProduks.length && filteredProduks.length > 0
    const handleSelectAllProduk = (checked: boolean) => {
        if (checked) {
            setSelectedProdukRows(filteredProduks.map((p) => p.id))
        } else {
            setSelectedProdukRows([])
        }
    }
    const handleSelectRowProduk = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedProdukRows((prev) => [...prev, id])
        } else {
            setSelectedProdukRows((prev) => prev.filter((rowId) => rowId !== id))
        }
    }


    const isAllPilihanSelected = selectedPilihanRows.length === filteredPilihans.length && filteredPilihans.length > 0

    const handleSelectAllPilihan = (checked: boolean) => {
        if (checked) {
            setSelectedPilihanRows(filteredPilihans.map((p) => p.id))
        } else {
            setSelectedPilihanRows([])
        }
    }

    const handleSelectRowPilihan = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedPilihanRows((prev) => [...prev, id])
        } else {
            setSelectedPilihanRows((prev) => prev.filter((rowId) => rowId !== id))
        }
    }

    const handleDeletePilihan = async () => {
        const count = selectedPilihanRows.length
        const { error } = await supabase
            .from('article')
            .delete()
            .in('id', selectedPilihanRows)
        if (!error) {
            const updated = pilihans.filter(p => !selectedPilihanRows.includes(p.id))
            setPilihans(updated)
            setSelectedPilihanRows([])
            toast.add({ title: `${count} pilihan produk berhasil dihapus`, type: "success" })
        } else {
            toast.add({ title: "Gagal menghapus pilihan produk", description: error.message, type: "error" })
        }
    }

    const handleAddClickPilihan = () => {
        setEditingPilihanId(null)
        setNewPilihan({ title: "", description: "", src: "" })
        setPilihanFileName("")
        setPilihanFile(null)
        setIsPilihanDialogOpen(true)
    }

    const handleEditClickPilihan = (pilihan: any) => {
        setEditingPilihanId(pilihan.id)
        setNewPilihan({ title: pilihan.title, description: pilihan.description || "", src: pilihan.src })
        setPilihanFileName("Gambar saat ini")
        setIsPilihanDialogOpen(true)
    }

    const handleSavePilihan = async () => {
        if (newPilihan.title && newPilihan.description && (newPilihan.src || pilihanFile)) {
            setIsSavingPilihan(true)
            let srcUrl = newPilihan.src
            if (pilihanFile) {
                const url = await uploadMedia(pilihanFile, 'article')
                if (url) srcUrl = url
            }
            const payload = { title: newPilihan.title, description: newPilihan.description, src: srcUrl }
            if (editingPilihanId) {
                const { error } = await supabase
                    .from('article')
                    .update(payload)
                    .eq('id', editingPilihanId)
                if (!error) {
                    setPilihans(pilihans.map(p => p.id === editingPilihanId ? { ...p, ...payload } : p))
                    toast.add({ title: "Pilihan produk berhasil diperbarui", type: "success" })
                } else {
                    toast.add({ title: "Gagal mengedit pilihan produk", description: error.message, type: "error" })
                }
            } else {
                const { data, error } = await supabase
                    .from('article')
                    .insert([payload])
                    .select()
                if (data) {
                    setPilihans([...data, ...pilihans])
                    toast.add({ title: "Pilihan produk baru berhasil ditambahkan", type: "success" })
                } else if (error) {
                    toast.add({ title: "Gagal menambah pilihan produk", description: error.message, type: "error" })
                }
            }
            setPilihanFile(null)
            setIsSavingPilihan(false)
            setIsPilihanDialogOpen(false)
        }
    }

    const isAllBannerSelected = selectedBannerRows.length === filteredBanners.length && filteredBanners.length > 0
    const handleSelectAllBanner = (checked: boolean) => {
        if (checked) {
            setSelectedBannerRows(filteredBanners.map((b) => b.id))
        } else {
            setSelectedBannerRows([])
        }
    }

    const handleSelectRowBanner = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedBannerRows((prev) => [...prev, id])
        } else {
            setSelectedBannerRows((prev) => prev.filter((rowId) => rowId !== id))
        }
    }

    const handleDeleteBanner = async () => {
        const count = selectedBannerRows.length
        const { error } = await supabase
            .from('banner')
            .delete()
            .in('id', selectedBannerRows)
        if (!error) {
            const updated = banners.filter(b => !selectedBannerRows.includes(b.id))
            setBanners(updated)
            setSelectedBannerRows([])
            toast.add({ title: `${count} banner berhasil dihapus`, type: "success" })
        } else {
            toast.add({ title: "Gagal menghapus banner", description: error.message, type: "error" })
        }
    }

    const handleAddClickBanner = () => {
        setEditingBannerId(null)
        setNewBanner({ title: "", src: "" })
        setBannerFileName("")
        setBannerFile(null)
        setIsBannerDialogOpen(true)
    }

    const handleEditClickBanner = (banner: any) => {
        setEditingBannerId(banner.id)
        setNewBanner({ title: banner.title, src: banner.src })
        setBannerFileName("Gambar saat ini")
        setIsBannerDialogOpen(true)
    }

    const handleSaveBanner = async () => {
        if (newBanner.title && (newBanner.src || bannerFile)) {
            setIsSavingBanner(true)
            let srcUrl = newBanner.src
            if (bannerFile) {
                const url = await uploadMedia(bannerFile, 'banner')
                if (url) srcUrl = url
            }
            const payload: any = { title: newBanner.title, src: srcUrl }
            if (editingBannerId) {
                const { error } = await supabase
                    .from('banner')
                    .update(payload)
                    .eq('id', editingBannerId)
                if (!error) {
                    setBanners(banners.map(b => b.id === editingBannerId ? { ...b, ...payload } : b))
                    toast.add({ title: "Banner berhasil diperbarui", type: "success" })
                } else {
                    toast.add({ title: "Gagal mengedit banner", description: error.message, type: "error" })
                }
            } else {
                payload.is_active = true
                const { data, error } = await supabase
                    .from('banner')
                    .insert([payload])
                    .select()
                if (data) {
                    setBanners([...data, ...banners])
                    toast.add({ title: "Banner baru berhasil ditambahkan", type: "success" })
                } else if (error) {
                    toast.add({ title: "Gagal menambah banner", description: error.message, type: "error" })
                }
            }
            setBannerFile(null)
            setIsSavingBanner(false)
            setIsBannerDialogOpen(false)
        }
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-2 md:gap-4 py-2 md:py-4 px-4 lg:px-6">
            <div className="flex flex-row justify-between items-center gap-2">
                <h1 className="text-md md:text-xl font-bold tracking-tight text-primary">Pengaturan & Manajemen</h1>
            </div>

            <div className="flex flex-col gap-4 md:gap-4">
                {/* Top Grid Menu */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                            className={cn(
                                "group flex flex-col items-center justify-center gap-3 p-6 rounded-none border transition-all",
                                activeMenu === item.id
                                    ? "border-none bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "border-primary/20 bg-card-alt text-primary/80 hover:border-primary/50 hover:-translate-y-1 hover:shadow-md"
                            )}
                        >
                            <item.icon className={cn("w-8 h-8 transition-colors", activeMenu !== item.id && "group-hover:text-primary dark:group-hover:text-primary-soft")} />
                            <span className={cn("font-semibold text-xs md:text-sm transition-colors text-center", activeMenu !== item.id && "group-hover:text-primary dark:group-hover:text-primary-soft")}>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {activeMenu && (
                    <div className="flex-1 w-full pt-4 border-t animate-in fade-in duration-150">
                        {activeMenu === 'promo' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-md md:text-xl font-semibold tracking-tight text-primary">Manajemen Promo</h2>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative w-full sm:w-auto">
                                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                                            <Input
                                                placeholder="Cari promo..."
                                                value={searchPromoQuery}
                                                onChange={(e) => {
                                                    setSearchPromoQuery(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="pr-9 h-8"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-full justify-end sm:w-auto">
                                            {selectedRows.length > 0 && (
                                                <Button variant="secondary" onClick={handleDelete}>Hapus ({selectedRows.length})</Button>
                                            )}
                                            <Button onClick={handleAddClick}>Tambah Promo</Button>
                                        </div>
                                    </div>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 md:p-6 min-h-[60vh] max-h-[90vh] overflow-y-auto rounded-none">

                                        <DialogHeader>
                                            <DialogTitle className="text-xs md:text-sm font-semibold tracking-tight">{editingId ? "Edit Promo" : "Tambah Promo Baru"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 pt-4">
                                            {/* Kolom Kiri: Form Input */}
                                            <div className="flex flex-col gap-4 order-2 md:order-1">
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="title" className="text-xs">Nama Promo</Label>
                                                    <Input
                                                        id="title"
                                                        value={newPromo.title}
                                                        onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                                                        placeholder="Misal: Minyak Goreng"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="promo" className="text-xs">Keterangan</Label>
                                                    <Textarea
                                                        id="promo"
                                                        value={newPromo.promo}
                                                        onChange={(e) => setNewPromo({ ...newPromo, promo: e.target.value })}
                                                        placeholder="Misal: Diskon 20%"
                                                        className="text-xs resize-none"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1 mt-2">
                                                    <Label htmlFor="promo-src" className="text-xs flex items-center justify-between">
                                                        Upload Gambar <span className="text-[10px] text-primary/70 font-normal">(Rasio 1:1)</span>
                                                    </Label>
                                                    <div className="relative w-full h-8">
                                                        <Input
                                                            id="promo-src"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) {
                                                                    setFileName(file.name)
                                                                    setPromoFile(file)
                                                                    const reader = new FileReader()
                                                                    reader.onloadend = () => {
                                                                        setNewPromo({ ...newPromo, src: reader.result as string })
                                                                    }
                                                                    reader.readAsDataURL(file)
                                                                } else {
                                                                    setFileName("")
                                                                    setPromoFile(null)
                                                                    setNewPromo({ ...newPromo, src: "" })
                                                                }
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="promo-src"
                                                            className="cursor-pointer flex h-8 w-full items-center justify-between rounded-none border border-input bg-background dark:bg-muted/20 pl-3 pr-1 py-1 text-xs ring-offset-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                                        >
                                                            <span className={`truncate mr-2 font-normal text-xs ${fileName ? "text-foreground" : "text-primary/70"}`}>
                                                                {fileName || "Tidak ada yang dipilih"}
                                                            </span>
                                                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-none text-[10px] font-medium shrink-0">
                                                                Pilih File
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Button onClick={handleSavePromo} className="h-8 w-full text-xs" disabled={isSaving}>
                                                        {isSaving ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Menyimpan...
                                                            </>
                                                        ) : (
                                                            editingId ? "Edit" : "Simpan Promo"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Kolom Kanan: Preview */}
                                            <div className="flex flex-col items-center md:items-end justify-start order-1 md:order-2 mb-2 md:mb-0 md:mt-5">
                                                <div className="w-[170px] sm:w-[180px] md:w-[190px] lg:w-[185px] relative rounded-none border border-input overflow-hidden bg-muted/30 aspect-square shadow-sm">
                                                    {newPromo.src ? (
                                                        <img src={newPromo.src} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-primary/70 text-sm text-center p-4">
                                                            Pratinjau Gambar (1:1)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Mobile Card List */}
                                <div className="flex flex-col gap-3 md:hidden mt-2">
                                    {isLoading ? null : filteredPromos.length === 0 ? (
                                        <div className="text-center py-10 text-primary/70 bg-card-alt text-primary border rounded-none shadow-sm">
                                            Tidak ada data promo.
                                        </div>
                                    ) : (
                                        filteredPromos.slice((currentPage - 1) * 10, currentPage * 10).map((promo) => (
                                            <div key={promo.id} className="bg-card-alt text-primary border border-primary/20 rounded-none shadow-sm p-4 flex gap-4 relative transition-all hover:shadow-md">
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        checked={selectedRows.includes(promo.id)}
                                                        onCheckedChange={(c) => handleSelectRow(promo.id, !!c)}
                                                        aria-label={`Select ${promo.title}`}
                                                    />
                                                </div>
                                                <div className="w-16 h-16 shrink-0 cursor-pointer overflow-hidden rounded-none border border-primary/20" onClick={() => handleEditClick(promo)}>
                                                    <img src={promo.src} alt={promo.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between min-w-0">
                                                    <div onClick={() => handleEditClick(promo)} className="cursor-pointer space-y-1">
                                                        <div className="font-semibold text-foreground truncate text-sm leading-tight">{promo.title}</div>
                                                        <div className="text-xs text-primary/70 line-clamp-2 leading-snug">{promo.promo}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2 border-t pt-2">
                                                        <span className="text-xs text-primary/70">Status</span>
                                                        <Switch
                                                            checked={promo.is_active}
                                                            onCheckedChange={async (checked) => {
                                                                const { error } = await supabase.from('promo').update({ is_active: checked }).eq('id', promo.id)
                                                                if (!error) {
                                                                    setPromos(promos.map(p => p.id === promo.id ? { ...p, is_active: checked } : p))
                                                                    toast.add({ title: `Status promo ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" })
                                                                } else {
                                                                    toast.add({ title: "Gagal memperbarui status promo", description: error.message, type: "error" })
                                                                }
                                                            }}
                                                            aria-label={`Toggle status ${promo.title}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block rounded-none border border-primary/20 border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4">
                                    <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border [&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20">
                                        <TableHeader className="bg-primary-soft dark:bg-background">
                                            <TableRow className="border-b border-primary/20 hover:bg-primary-soft/40 dark:hover:bg-primary/40">
                                                <TableHead className="w-[50px] text-center">
                                                    <Checkbox
                                                        aria-label="Select all"
                                                        checked={isAllSelected}
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                </TableHead>
                                                <TableHead className="w-[100px] text-center font-medium">Foto</TableHead>
                                                <TableHead className="font-medium">Nama Promo</TableHead>
                                                <TableHead className="font-medium">Keterangan</TableHead>
                                                <TableHead className="text-center w-[120px] font-medium">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? null : (filteredPromos.slice((currentPage - 1) * 10, currentPage * 10).map((promo) => (
                                                <TableRow key={promo.id} className="border-b border-zinc-100 dark:border-zinc-800/50 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 group">
                                                    <TableCell className="text-center align-middle">
                                                        <Checkbox
                                                            aria-label={`Select ${promo.title}`}
                                                            checked={selectedRows.includes(promo.id)}
                                                            onCheckedChange={(c) => handleSelectRow(promo.id, !!c)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="p-3 align-middle cursor-pointer" onClick={() => handleEditClick(promo)}>
                                                        <div className="w-14 h-14 overflow-hidden rounded-none mx-auto border border-primary/20 shadow-sm group-hover:shadow-md transition-all">
                                                            <img
                                                                src={promo.src}
                                                                alt={promo.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-foreground align-middle cursor-pointer" onClick={() => handleEditClick(promo)}>{promo.title}</TableCell>
                                                    <TableCell className="text-primary/70 align-middle cursor-pointer max-w-[300px] truncate" onClick={() => handleEditClick(promo)}>{promo.promo}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch
                                                            checked={promo.is_active}
                                                            onCheckedChange={async (checked) => {
                                                                const { error } = await supabase.from('promo').update({ is_active: checked }).eq('id', promo.id)
                                                                if (!error) {
                                                                    setPromos(promos.map(p => p.id === promo.id ? { ...p, is_active: checked } : p))
                                                                    toast.add({ title: `Status promo ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" })
                                                                } else {
                                                                    toast.add({ title: "Gagal memperbarui status promo", description: error.message, type: "error" })
                                                                }
                                                            }}
                                                            aria-label={`Toggle status ${promo.title}`}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                            {!isLoading && filteredPromos.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center text-primary/70">
                                                        Tidak ada data promo.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4 md:mt-0 md:border-t-0">
                                    <TablePagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredPromos.length / 10)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>

                            </div>
                        )}

                        {activeMenu === 'pilihan' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-md md:text-xl font-semibold tracking-tight text-primary">Insight</h2>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                                            <Input
                                                placeholder="Cari insight..."
                                                value={searchPilihanQuery}
                                                onChange={(e) => {
                                                    setSearchPilihanQuery(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="pr-9 h-8"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-full justify-end sm:w-auto">
                                            {selectedPilihanRows.length > 0 && (
                                                <Button variant="secondary" onClick={handleDeletePilihan}>Hapus ({selectedPilihanRows.length})</Button>
                                            )}
                                            <Button onClick={handleAddClickPilihan}>Tambah Insight</Button>
                                        </div>
                                    </div>
                                </div>
                                <Dialog open={isPilihanDialogOpen} onOpenChange={setIsPilihanDialogOpen}>
                                    <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 md:p-6 min-h-[60vh] max-h-[90vh] overflow-y-auto rounded-none">
                                        <DialogHeader>
                                            <DialogTitle className="text-xs md:text-sm font-semibold tracking-tight">
                                                {editingPilihanId ? "Edit Insight" : "Tambah Insight"}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 pt-4">
                                            {/* Kolom Kiri: Form Input */}
                                            <div className="flex flex-col gap-4 order-2 md:order-1">
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="title" className="text-xs">Judul Insight</Label>
                                                    <Input
                                                        id="title"
                                                        value={newPilihan.title}
                                                        onChange={(e) => setNewPilihan({ ...newPilihan, title: e.target.value })}
                                                        placeholder="Misal: Insight Menarik"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="description" className="text-xs">Deskripsi Insight</Label>
                                                    <Textarea
                                                        id="description"
                                                        className="flex min-h-[60px] w-full rounded-none px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={newPilihan.description}
                                                        onChange={(e) => setNewPilihan({ ...newPilihan, description: e.target.value })}
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1 mt-2">
                                                    <Label htmlFor="pilihan-src" className="text-xs">Upload Gambar</Label>
                                                    <div className="relative w-full h-8">
                                                        <Input
                                                            id="pilihan-src"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) {
                                                                    setPilihanFileName(file.name)
                                                                    setPilihanFile(file)
                                                                    const reader = new FileReader()
                                                                    reader.onloadend = () => {
                                                                        setNewPilihan({ ...newPilihan, src: reader.result as string })
                                                                    }
                                                                    reader.readAsDataURL(file)
                                                                } else {
                                                                    setPilihanFileName("")
                                                                    setPilihanFile(null)
                                                                    setNewPilihan({ ...newPilihan, src: "" })
                                                                }
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="pilihan-src"
                                                            className="cursor-pointer flex h-8 w-full items-center justify-between rounded-none border border-input bg-background dark:bg-muted/20 pl-3 pr-1 py-1 text-xs ring-offset-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                                        >
                                                            <span className={`truncate mr-2 font-normal text-xs ${pilihanFileName ? "text-foreground" : "text-primary/70"}`}>
                                                                {pilihanFileName || "Tidak ada yang dipilih"}
                                                            </span>
                                                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-none text-[10px] font-medium shrink-0">
                                                                Pilih File
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Button onClick={handleSavePilihan} className="h-8 w-full text-xs" disabled={isSavingPilihan}>
                                                        {isSavingPilihan ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Menyimpan...
                                                            </>
                                                        ) : (
                                                            editingPilihanId ? "Edit Insight" : "Simpan Insight"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Kolom Kanan: Preview */}
                                            <div className="flex flex-col items-center md:items-end justify-start order-1 md:order-2 mb-2 md:mb-0 md:mt-5">
                                                <div className="w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px] relative rounded-none border border-input overflow-hidden bg-muted/30 aspect-[2/1] shadow-sm">
                                                    {newPilihan.src ? (
                                                        <img src={newPilihan.src} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-primary/70 text-[10px] sm:text-xs text-center p-2">
                                                            Pratinjau Gambar (2:1)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Mobile Card List */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {isLoading ? null : filteredPilihans.length === 0 ? (
                                        <div className="text-center py-10 text-primary/70 bg-card-alt text-primary border">
                                            Tidak ada data pilihan.
                                        </div>
                                    ) : (
                                        filteredPilihans.slice((currentPage - 1) * 10, currentPage * 10).map((pilihan) => (
                                            <div key={pilihan.id} className="bg-card-alt text-primary border shadow-sm p-3 flex gap-3 relative">
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        checked={selectedPilihanRows.includes(pilihan.id)}
                                                        onCheckedChange={(c) => handleSelectRowPilihan(pilihan.id, !!c)}
                                                        aria-label={`Select ${pilihan.title}`}
                                                    />
                                                </div>
                                                <div className="w-16 h-20 shrink-0 cursor-pointer" onClick={() => handleEditClickPilihan(pilihan)}>
                                                    <img src={pilihan.src} alt={pilihan.title} className="w-full h-full object-cover rounded-none border" />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between min-w-0">
                                                    <div onClick={() => handleEditClickPilihan(pilihan)} className="cursor-pointer">
                                                        <div className="font-semibold text-foreground truncate text-sm">{pilihan.title}</div>
                                                        <div className="text-xs text-primary/70 truncate">{pilihan.description || "-"}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2 border-t pt-2">
                                                        <span className="text-xs text-primary/70">Status</span>
                                                        <Switch
                                                            checked={pilihan.is_active}
                                                            onCheckedChange={async (checked) => {
                                                                const { error } = await supabase.from('article').update({ is_active: checked }).eq('id', pilihan.id)
                                                                if (!error) {
                                                                    setPilihans(pilihans.map(p => p.id === pilihan.id ? { ...p, is_active: checked } : p))
                                                                    toast.add({ title: `Status pilihan produk ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" })
                                                                } else {
                                                                    toast.add({ title: "Gagal memperbarui status pilihan produk", description: error.message, type: "error" })
                                                                }
                                                            }}
                                                            aria-label={`Toggle status ${pilihan.title}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden">
                                    <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border">
                                        <TableHeader className="bg-primary-soft dark:bg-background">
                                            <TableRow>
                                                <TableHead className="w-[50px] text-center">
                                                    <Checkbox
                                                        aria-label="Select all"
                                                        checked={isAllPilihanSelected}
                                                        onCheckedChange={handleSelectAllPilihan}
                                                    />
                                                </TableHead>
                                                <TableHead className="w-[160px] text-center">Foto Insight</TableHead>
                                                <TableHead>Judul Insight</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                                <TableHead className="text-center w-[100px]">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? null : (filteredPilihans.slice((currentPage - 1) * 10, currentPage * 10).map((pilihan) => (
                                                <TableRow key={pilihan.id}>
                                                    <TableCell className="text-center">
                                                        <Checkbox
                                                            aria-label={`Select ${pilihan.title}`}
                                                            checked={selectedPilihanRows.includes(pilihan.id)}
                                                            onCheckedChange={(c) => handleSelectRowPilihan(pilihan.id, !!c)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="p-2 cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40" onClick={() => handleEditClickPilihan(pilihan)}>
                                                        <img
                                                            src={pilihan.src}
                                                            alt={pilihan.title}
                                                            className="w-28 h-14 rounded-none object-cover border mx-auto"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors" onClick={() => handleEditClickPilihan(pilihan)}>{pilihan.title}</TableCell>
                                                    <TableCell className="cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors max-w-[200px] truncate" onClick={() => handleEditClickPilihan(pilihan)}>{pilihan.description || "-"}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch
                                                            checked={pilihan.is_active}
                                                            onCheckedChange={async (checked) => {
                                                                const { error } = await supabase.from('article').update({ is_active: checked }).eq('id', pilihan.id)
                                                                if (!error) {
                                                                    setPilihans(pilihans.map(p => p.id === pilihan.id ? { ...p, is_active: checked } : p))
                                                                    toast.add({ title: `Status pilihan produk ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" })
                                                                } else {
                                                                    toast.add({ title: "Gagal memperbarui status pilihan produk", description: error.message, type: "error" })
                                                                }
                                                            }}
                                                            aria-label={`Toggle status ${pilihan.title}`}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                            {!isLoading && filteredPilihans.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center text-primary/70">
                                                        Tidak ada data pilihan.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4 md:mt-0 md:border-t-0">
                                    <TablePagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredPilihans.length / 10)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>

                            </div>
                        )}

                        {activeMenu === 'produk' && (
                            <div className="flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-md md:text-xl font-semibold tracking-tight text-primary">Manajemen Produk</h2>
                                        <p className="text-xs text-primary/60 mt-0.5 flex items-center gap-1.5">

                                            Seret kartu produk ke atas untuk unggulan
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                                            <Input
                                                placeholder="Cari produk..."
                                                value={searchProdukQuery}
                                                onChange={(e) => {
                                                    setSearchProdukQuery(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="pr-9 h-8"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-full justify-end sm:w-auto">
                                        </div>
                                    </div>
                                </div>

                                {/* Status bar */}
                                <div className="flex items-center justify-between text-xs text-primary/60 px-1">
                                    <span>{filteredProduks.length} produk{searchProdukQuery ? ` ditemukan` : ` total`}</span>
                                    {isSavingOrder && (
                                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Menyimpan urutan...
                                        </span>
                                    )}
                                    {selectedProdukRows.length > 0 && (
                                        <span className="text-primary">{selectedProdukRows.length} dipilih</span>
                                    )}
                                </div>

                                {/* Drag & Drop List */}
                                <div className="rounded-none border border-primary/20 overflow-hidden">


                                    {isLoading ? (
                                        <div className="py-16 text-center text-primary/50 text-sm">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
                                            Memuat produk...
                                        </div>
                                    ) : filteredProduks.length === 0 ? (
                                        <div className="py-16 text-center text-primary/50 text-sm">
                                            {searchProdukQuery ? `Tidak ada produk yang cocok dengan "${searchProdukQuery}"` : 'Belum ada produk. Klik Tambah Produk untuk memulai.'}
                                        </div>
                                    ) : (
                                        <div className="p-2">
                                            <ProdukSortableList
                                                produks={filteredProduks}
                                                setProduks={(newList) => {
                                                    // Update produks state with new order
                                                    if (searchProdukQuery) {
                                                        // If searching, merge back
                                                        const filteredIds = new Set(newList.map((p: any) => p.id))
                                                        const nonFiltered = produks.filter((p: any) => !filteredIds.has(p.id))
                                                        setProduks([...newList, ...nonFiltered])
                                                    } else {
                                                        setProduks(newList)
                                                    }
                                                }}
                                                selectedRows={selectedProdukRows}
                                                onSelect={handleSelectRowProduk}
                                                isSavingOrder={isSavingOrder}
                                                setIsSavingOrder={setIsSavingOrder}
                                                onEdit={handleEditClickProduk}
                                                onSelectAll={handleSelectAllProduk}
                                                isAllSelected={produks.length > 0 && selectedProdukRows.length === produks.length}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {activeMenu === 'banner' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-md md:text-xl font-semibold tracking-tight text-primary">Manajemen Banner</h2>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                                            <Input
                                                placeholder="Cari banner..."
                                                value={searchBannerQuery}
                                                onChange={(e) => {
                                                    setSearchBannerQuery(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="pr-9 h-8"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-full justify-end sm:w-auto">
                                            {selectedBannerRows.length > 0 && (
                                                <Button variant="secondary" onClick={handleDeleteBanner}>Hapus ({selectedBannerRows.length})</Button>
                                            )}
                                            <Button onClick={handleAddClickBanner}>Tambah Banner</Button>
                                        </div>
                                    </div>
                                </div>
                                <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                                    <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-4xl p-4 md:p-6 min-h-[60vh] max-h-[90vh] overflow-y-auto rounded-none">

                                        <DialogHeader>
                                            <DialogTitle className="text-xs md:text-sm font-semibold tracking-tight">{editingBannerId ? "Edit Banner" : "Tambah Banner Baru"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 pt-4">
                                            {/* Kolom Kiri: Form Input */}
                                            <div className="flex flex-col gap-4 order-2 md:order-1">
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="banner-title" className="text-xs">Nama / Judul Banner</Label>
                                                    <Input
                                                        id="banner-title"
                                                        value={newBanner.title}
                                                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                                        placeholder="Misal: Promo Akhir Tahun"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1 mt-2">
                                                    <Label htmlFor="banner-src" className="text-xs">Upload Gambar Banner</Label>
                                                    <div className="relative w-full h-8">
                                                        <Input
                                                            id="banner-src"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) {
                                                                    setBannerFileName(file.name)
                                                                    setBannerFile(file)
                                                                    const reader = new FileReader()
                                                                    reader.onloadend = () => {
                                                                        setNewBanner({ ...newBanner, src: reader.result as string })
                                                                    }
                                                                    reader.readAsDataURL(file)
                                                                } else {
                                                                    setBannerFileName("")
                                                                    setBannerFile(null)
                                                                    setNewBanner({ ...newBanner, src: "" })
                                                                }
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="banner-src"
                                                            className="cursor-pointer flex h-8 w-full items-center justify-between rounded-none border border-input bg-background dark:bg-muted/20 pl-3 pr-1 py-1 text-xs ring-offset-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                                        >
                                                            <span className={`truncate mr-2 font-normal text-xs ${bannerFileName ? "text-foreground" : "text-primary/70"}`}>
                                                                {bannerFileName || "Tidak ada yang dipilih"}
                                                            </span>
                                                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-none text-[10px] font-medium shrink-0">
                                                                Pilih File
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Button onClick={handleSaveBanner} className="h-8 w-full text-xs" disabled={isSavingBanner}>
                                                        {isSavingBanner ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Menyimpan...
                                                            </>
                                                        ) : (
                                                            editingBannerId ? "Edit" : "Simpan Banner"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Kolom Kanan: Preview */}
                                            <div className="flex flex-col items-center md:items-end justify-start order-1 md:order-2 mb-2 md:mb-0 md:mt-5">
                                                <div className="w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px] relative rounded-none border border-input overflow-hidden bg-muted/30 aspect-[2/1] shadow-sm">
                                                    {newBanner.src ? (
                                                        <img src={newBanner.src} alt="Preview Banner" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-primary/70 text-[10px] sm:text-xs text-center p-2">
                                                            Pratinjau Banner Canva (2:1 / 1000x500mm)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Mobile Card List */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {isLoading ? null : filteredBanners.length === 0 ? (
                                        <div className="text-center py-10 text-primary/70 bg-card-alt text-primary border">
                                            Tidak ada data banner.
                                        </div>
                                    ) : (
                                        filteredBanners.slice((currentPage - 1) * 10, currentPage * 10).map((banner) => (
                                            <div key={banner.id} className="bg-card-alt text-primary border shadow-sm p-3 flex gap-3 relative flex-col">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex items-center mt-1">
                                                        <Checkbox
                                                            checked={selectedBannerRows.includes(banner.id)}
                                                            onCheckedChange={(c) => handleSelectRowBanner(banner.id, !!c)}
                                                            aria-label={`Select ${banner.title}`}
                                                        />
                                                    </div>
                                                    <div className="w-24 h-12 shrink-0 cursor-pointer" onClick={() => handleEditClickBanner(banner)}>
                                                        <img src={banner.src} alt={banner.title} className="w-full h-full object-cover rounded-none border" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-center min-w-0">
                                                        <div onClick={() => handleEditClickBanner(banner)} className="cursor-pointer">
                                                            <div className="font-semibold text-foreground truncate text-sm line-clamp-2">{banner.title}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-1 border-t pt-2">
                                                    <span className="text-xs text-primary/70">Status</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[11px] font-medium ${banner.is_active ? "text-primary" : "text-muted-foreground"}`}>
                                                            {banner.is_active ? "Aktif" : "Nonaktif"}
                                                        </span>
                                                        <Switch
                                                            checked={banner.is_active ?? true}
                                                            onCheckedChange={async (checked) => {
                                                                const { error } = await supabase.from('banner').update({ is_active: checked }).eq('id', banner.id)
                                                                if (!error) {
                                                                    setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: checked } : b))
                                                                    toast.add({ title: `Status banner ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" })
                                                                } else {
                                                                    toast.add({ title: "Gagal memperbarui status banner", description: error.message, type: "error" })
                                                                }
                                                            }}
                                                            aria-label={`Toggle status ${banner.title}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden">
                                    <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border">
                                        <TableHeader className="bg-primary-soft dark:bg-background">
                                            <TableRow>
                                                <TableHead className="w-[50px] text-center">
                                                    <Checkbox
                                                        aria-label="Select all"
                                                        checked={isAllBannerSelected}
                                                        onCheckedChange={handleSelectAllBanner}
                                                    />
                                                </TableHead>
                                                <TableHead className="w-[160px] text-center">Foto Banner</TableHead>
                                                <TableHead>Nama / Judul Banner</TableHead>
                                                <TableHead className="text-center w-[100px]">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? null : (filteredBanners.slice((currentPage - 1) * 10, currentPage * 10).map((banner) => (
                                                <TableRow key={banner.id}>
                                                    <TableCell className="text-center">
                                                        <Checkbox
                                                            aria-label={`Select ${banner.title}`}
                                                            checked={selectedBannerRows.includes(banner.id)}
                                                            onCheckedChange={(c) => handleSelectRowBanner(banner.id, !!c)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="p-2 cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40" onClick={() => handleEditClickBanner(banner)}>
                                                        <img
                                                            src={banner.src}
                                                            alt={banner.title}
                                                            className="w-28 h-14 rounded-none object-cover border mx-auto"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors" onClick={() => handleEditClickBanner(banner)}>
                                                        {banner.title}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className={`text-xs font-medium ${banner.is_active ? "text-primary" : "text-muted-foreground"}`}>
                                                                {banner.is_active ? "Aktif" : "Nonaktif"}
                                                            </span>
                                                            <Switch
                                                                checked={banner.is_active ?? true}
                                                                onCheckedChange={async (checked) => {
                                                                    const { error } = await supabase.from('banner').update({ is_active: checked }).eq('id', banner.id)
                                                                    if (!error) {
                                                                        setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: checked } : b))
                                                                        toast.add({ title: `Status banner ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: "success" })
                                                                    } else {
                                                                        toast.add({ title: "Gagal memperbarui status banner", description: error.message, type: "error" })
                                                                    }
                                                                }}
                                                                aria-label={`Toggle status ${banner.title}`}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                            {!isLoading && filteredBanners.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-primary/70">
                                                        Tidak ada data banner.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4 md:mt-0 md:border-t-0">
                                    <TablePagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredBanners.length / 10)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        )}
                        {activeMenu === 'topbar_logo' && (
                            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                                <Card className="bg-card-alt text-primary border-primary/20 shadow-sm rounded-none">
                                    <CardContent className="p-6 flex flex-col gap-6">
                                        {/* Header Info */}
                                        <div className="flex flex-col gap-1 border-b border-primary/10 pb-4">
                                            <h2 className="text-lg md:text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                                                <PanelTop className="w-5 h-5 text-primary" />
                                                Pengaturan Logo Aplikasi
                                            </h2>
                                            <p className="text-xs text-primary/70">
                                                Ganti teks dengan desain yang sudah di persiapkan.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Kolom Kiri: Mode & Ukuran */}
                                            <div className="flex flex-col gap-5">
                                                {/* Mode Tampilan */}
                                                <div className="space-y-2">
                                                    <div className="text-xs font-semibold">Mode Tampilan Top Bar</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[
                                                            { id: "logo_only", label: "Logo Desain", desc: "Hanya Gambar" },
                                                            { id: "text_only", label: "Teks Saja", desc: "Gunakan Text Saja" },
                                                            { id: "logo_and_text", label: "Logo + Teks", desc: "Kombinasi" },
                                                        ].map((m) => (
                                                            <button
                                                                key={m.id}
                                                                type="button"
                                                                onClick={() => updateTopbarLive({ mode: m.id })}
                                                                className={cn(
                                                                    "p-3 text-center border transition-all rounded-none cursor-pointer",
                                                                    topbarMode === m.id
                                                                        ? "bg-primary text-white border-primary shadow-sm"
                                                                        : "bg-background text-primary/80 border-primary/20 hover:border-primary/50"
                                                                )}
                                                            >
                                                                <div className="text-xs font-bold">{m.label}</div>
                                                                <div className={cn("text-[10px]", topbarMode === m.id ? "text-white/80" : "text-primary/60")}>
                                                                    {m.desc}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Pengatur Ukuran Logo (Besar / Kecil) */}
                                                {topbarMode !== "text_only" && (
                                                    <div className="space-y-3 p-4 bg-background border border-primary/15 rounded-none">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold flex items-center gap-1.5">
                                                                <Sliders className="w-4 h-4 text-primary" />
                                                                <span>Ukuran Tinggi Logo (Besar / Kecil)</span>
                                                            </span>
                                                            <span className="text-xs font-bold bg-primary-soft text-primary px-2.5 py-0.5 rounded font-mono">
                                                                {topbarLogoSize} px
                                                            </span>
                                                        </div>

                                                        {/* Slider Ukuran */}
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateTopbarLive({ logoSize: Math.max(18, topbarLogoSize - 1) })}
                                                                className="w-8 h-8 rounded-none border border-primary/20 flex items-center justify-center hover:bg-primary-soft text-primary font-bold shrink-0 cursor-pointer"
                                                                title="Perkecil 1px"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <input
                                                                type="range"
                                                                min="20"
                                                                max="46"
                                                                step="1"
                                                                value={topbarLogoSize}
                                                                onChange={(e) => updateTopbarLive({ logoSize: parseInt(e.target.value, 10) })}
                                                                className="flex-1 accent-[#844B09] cursor-pointer"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => updateTopbarLive({ logoSize: Math.min(46, topbarLogoSize + 1) })}
                                                                className="w-8 h-8 rounded-none border border-primary/20 flex items-center justify-center hover:bg-primary-soft text-primary font-bold shrink-0 cursor-pointer"
                                                                title="Perbesar 1px"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Preset Tombol Cepat */}
                                                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                                                            <span className="text-[11px] text-primary/70">Preset Cepat:</span>
                                                            {[
                                                                { label: "Kecil", size: 26 },
                                                                { label: "Sedang", size: 34 },
                                                                { label: "Besar", size: 42 },
                                                            ].map((preset) => (
                                                                <button
                                                                    key={preset.label}
                                                                    type="button"
                                                                    onClick={() => updateTopbarLive({ logoSize: preset.size })}
                                                                    className={cn(
                                                                        "px-2.5 py-1 text-[11px] font-medium border rounded-none transition-colors cursor-pointer",
                                                                        topbarLogoSize === preset.size
                                                                            ? "bg-primary text-white border-primary"
                                                                            : "bg-card-alt text-primary border-primary/20 hover:bg-primary-soft"
                                                                    )}
                                                                >
                                                                    {preset.label} ({preset.size}px)
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Warna Logo di Top Bar */}
                                                {topbarMode !== "text_only" && (
                                                    <div className="space-y-2">
                                                        <div className="text-xs font-semibold">Tampilan Warna Logo pada Top Bar</div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateTopbarLive({ logoColor: "white" })}
                                                                className={cn(
                                                                    "p-2.5 text-left border rounded-none transition-all flex items-center gap-2 cursor-pointer",
                                                                    topbarLogoColor === "white"
                                                                        ? "bg-primary text-white border-primary"
                                                                        : "bg-background text-primary border-primary/20 hover:border-primary/50"
                                                                )}
                                                            >
                                                                <div className="w-4 h-4 rounded-full bg-white border border-black/20 shrink-0" />
                                                                <div>
                                                                    <div className="text-xs font-semibold">Putih Monokrom</div>
                                                                    <div className="text-[10px] opacity-80">Rekomendasi (Kontras Jelas)</div>
                                                                </div>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateTopbarLive({ logoColor: "original" })}
                                                                className={cn(
                                                                    "p-2.5 text-left border rounded-none transition-all flex items-center gap-2 cursor-pointer",
                                                                    topbarLogoColor === "original"
                                                                        ? "bg-primary text-white border-primary"
                                                                        : "bg-background text-primary border-primary/20 hover:border-primary/50"
                                                                )}
                                                            >
                                                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-700 to-black shrink-0" />
                                                                <div>
                                                                    <div className="text-xs font-semibold">Warna Asli Gambar</div>
                                                                    <div className="text-[10px] opacity-80">Sesuai file sumber</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Kolom Kanan: Pilihan Desain Gambar & Teks */}
                                            <div className="flex flex-col gap-5">
                                                {/* Pilihan Gambar Logo & Upload Custom */}
                                                {topbarMode !== "text_only" && (
                                                    <div className="space-y-4">
                                                        {/* Upload Custom Logo ke Database / Supabase */}
                                                        <div className="space-y-2 p-3.5 bg-background border border-primary/20 rounded-none">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-semibold flex items-center gap-1.5">
                                                                    <Upload className="w-4 h-4 text-primary" />
                                                                    <span>Upload Logo Kustom Sendiri</span>
                                                                </span>
                                                                <span className="text-[10px] text-primary/70">PNG transparan, WebP, SVG, JPG (Max 5MB)</span>
                                                            </div>

                                                            <input
                                                                ref={logoInputRef}
                                                                type="file"
                                                                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                                                className="hidden"
                                                                onChange={handleUploadCustomLogo}
                                                                disabled={isUploadingLogo}
                                                            />

                                                            <div
                                                                onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                                                                className={cn(
                                                                    "p-4 border-2 border-dashed border-primary/30 hover:border-primary bg-card-alt/50 hover:bg-primary-soft/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center",
                                                                    isUploadingLogo && "opacity-60 cursor-not-allowed"
                                                                )}
                                                            >
                                                                {isUploadingLogo ? (
                                                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-primary py-2">
                                                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                                                        <span>Mengupload ke Supabase Storage...</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                                            <ImagePlus className="w-5 h-5" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs font-bold text-primary">Pilih File Logo dari Perangkat</div>
                                                                            <div className="text-[10px] text-primary/70">Otomatis diupload ke Database Storage &amp; diterapkan ke Top Bar</div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Riwayat Logo Kustom Terupload (jika ada) */}
                                                        {customLogos.length > 0 && (
                                                            <div className="space-y-2">
                                                                <div className="text-xs font-semibold flex items-center justify-between">
                                                                    <span>Logo Kustom Terupload di Database ({customLogos.length})</span>
                                                                </div>
                                                                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                                                                    {customLogos.map((item) => (
                                                                        <div
                                                                            key={item.url}
                                                                            className={cn(
                                                                                "p-2.5 border rounded-none flex items-center justify-between gap-3 transition-all",
                                                                                topbarLogoUrl === item.url
                                                                                    ? "bg-primary/15 border-primary shadow-sm"
                                                                                    : "bg-background border-primary/20 hover:border-primary/50"
                                                                            )}
                                                                        >
                                                                            <div
                                                                                onClick={() => updateTopbarLive({ logoUrl: item.url })}
                                                                                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                                                                            >
                                                                                <div className="w-14 h-7 bg-primary rounded flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                                                                    <img
                                                                                        src={item.url}
                                                                                        alt={item.name}
                                                                                        className={cn(
                                                                                            "max-h-full max-w-full object-contain",
                                                                                            topbarLogoColor === "white" ? "brightness-0 invert" : ""
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                    <div className="text-xs font-bold text-primary truncate">{item.name}</div>
                                                                                    <div className="text-[10px] text-primary/60 truncate">Diupload: {item.date}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                                {topbarLogoUrl === item.url && (
                                                                                    <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded">
                                                                                        Aktif
                                                                                    </span>
                                                                                )}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteCustomLogo(item.url)}
                                                                                    className="w-7 h-7 rounded text-primary/50 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                                                                                    title="Hapus dari daftar riwayat"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Status Logo yang Sedang Aktif */}
                                                        <div className="space-y-3 p-3.5 bg-background border border-primary/20 rounded-none">
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-xs font-semibold">Logo Aktif Saat Ini</div>
                                                                <span className="text-[10px] text-primary/60 font-mono">Top Bar</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 p-3 bg-card-alt/50 border border-primary/15">
                                                                <div className="w-16 h-8 bg-primary rounded flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                                                                    <img
                                                                        src={topbarLogoUrl || "/LOGO AI NEW-05.png"}
                                                                        alt="Logo Aktif"
                                                                        className={cn(
                                                                            "max-h-full max-w-full object-contain",
                                                                            topbarLogoColor === "white" ? "brightness-0 invert" : ""
                                                                        )}
                                                                        onError={(e) => {
                                                                            (e.target as HTMLElement).style.display = "none"
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-xs font-bold text-primary truncate">
                                                                        {topbarLogoUrl.startsWith("http") ? "Logo Database Cloud" : topbarLogoUrl.split("/").pop()}
                                                                    </div>
                                                                    <div className="text-[10px] text-primary/60 truncate font-mono">
                                                                        {topbarLogoUrl}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Input URL / Path Logo jika diperlukan */}
                                                            <div className="pt-1">
                                                                <Label htmlFor="topbarLogoUrlInput" className="text-[11px] text-primary/70 cursor-pointer">URL / Path Logo Aktif:</Label>
                                                                <Input
                                                                    id="topbarLogoUrlInput"
                                                                    value={topbarLogoUrl}
                                                                    onChange={(e) => updateTopbarLive({ logoUrl: e.target.value })}
                                                                    placeholder="/LOGO AI NEW-05.png"
                                                                    className="mt-1 h-8 text-xs bg-background rounded-none border-primary/20 font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Teks Nama Brand (jika mode text_only atau logo_and_text) */}
                                                {(topbarMode === "text_only" || topbarMode === "logo_and_text") && (
                                                    <div className="space-y-3 p-4 bg-background border border-primary/15 rounded-none">
                                                        <div className="space-y-1">
                                                            <Label htmlFor="topbarCompanyNameInput" className="text-xs font-semibold cursor-pointer">Teks Nama Brand</Label>
                                                            <Input
                                                                id="topbarCompanyNameInput"
                                                                value={topbarCompanyName}
                                                                onChange={(e) => updateTopbarLive({ companyName: e.target.value })}
                                                                placeholder="SBAGIAMU"
                                                                className="h-8 text-xs bg-card-alt rounded-none border-primary/20 font-bold"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-primary/70">Ukuran Font Teks:</span>
                                                                <span className="font-bold">{topbarTextSize} px</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="14"
                                                                max="32"
                                                                value={topbarTextSize}
                                                                onChange={(e) => updateTopbarLive({ textSize: parseInt(e.target.value, 10) })}
                                                                className="w-full accent-[#844B09] cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        {/* Action Footer */}
                                        <div className="border-t border-primary/10 pt-4 flex items-center justify-end gap-3">
                                            <Button
                                                onClick={handleSaveTopbar}
                                                disabled={isSavingTopbar}
                                                className="rounded-none bg-primary text-white hover:bg-primary/90 px-6 cursor-pointer"
                                            >
                                                {isSavingTopbar ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Simpan Perubahan
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {activeMenu === 'landing_bg' && (
                            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                                <Card className="bg-card-alt text-primary border-primary/20 shadow-sm rounded-none">
                                    <CardContent className="p-6 flex flex-col gap-6">
                                        {/* Header Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/10 pb-4">
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-lg md:text-xl font-bold tracking-tight text-primary flex items-center gap-2">

                                                    Pengaturan Halaman Pembuka & Login
                                                </h2>
                                                <p className="text-xs text-primary/70">
                                                    Atur gambar background (desktop & mobile), pilihan font tipografi, dan teks judul serta tombol pada halaman pembuka (/) serta background form login (/login).
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
                                                <a
                                                    href="/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-primary/20 text-primary bg-background hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Buka Halaman Pembuka
                                                </a>
                                                <a
                                                    href="/login"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-primary/20 text-primary bg-background hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Buka Form Login
                                                </a>
                                            </div>
                                        </div>

                                        {/* Pengaturan Font & Teks Halaman Pembuka */}
                                        <div className="space-y-4 p-4 border border-primary/20 bg-background/40">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-primary/10 pb-3">
                                                <div>
                                                    <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                                                        <Type className="w-4 h-4 text-primary" />
                                                        Tipografi & Teks Halaman Pembuka
                                                    </div>
                                                    <p className="text-[11px] text-primary/70">
                                                        Pilih jenis font tipografi dan sesuaikan teks judul utama, sub-judul, serta tombol aksi.
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-primary/20 text-primary self-start sm:self-auto">
                                                    Font Aktif: {HERO_FONTS.find(f => f.id === landingFont)?.name || landingFont} ({HERO_FONTS.find(f => f.id === landingFont)?.category || "Display"})
                                                </span>
                                            </div>

                                            {/* Font Selector */}
                                            <div className="space-y-1.5">
                                                <span id="landingFontSelectLabel" className="text-xs font-semibold text-primary block">
                                                    Pilih Font Tipografi
                                                </span>
                                                <Select value={landingFont} onValueChange={(val) => { if (val) setLandingFont(val) }}>
                                                    <SelectTrigger id="landingFontSelect" aria-labelledby="landingFontSelectLabel" className="w-full bg-background rounded-none border-primary/20">
                                                        <SelectValue placeholder="Pilih Font..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[320px]">
                                                        {HERO_FONTS.map(f => (
                                                            <SelectItem key={f.id} value={f.id} className="cursor-pointer py-2 border-b border-primary/5 last:border-0">
                                                                <div className="flex items-center justify-between w-full gap-4">
                                                                    <span className={cn(f.className, "text-base font-normal tracking-wide text-foreground")}>{f.name}</span>
                                                                    <span className="text-[11px] text-muted-foreground font-sans">({f.category})</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[10px] text-primary/70">
                                                    * Font yang dipilih akan otomatis mengubah gaya teks judul pada halaman pembuka.
                                                </p>
                                            </div>

                                            {/* Inputs for Title and Subtitle */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="landingTitleInput" className="text-xs font-semibold text-primary cursor-pointer">Judul Utama (Desktop)</Label>
                                                        <span className="text-[10px] text-primary/60 font-mono">Tampil di layar besar</span>
                                                    </div>
                                                    <Textarea
                                                        id="landingTitleInput"
                                                        value={landingTitle}
                                                        onChange={(e) => setLandingTitle(e.target.value)}
                                                        placeholder="Nikmati Coffee&#10;Pilihan Premium"
                                                        rows={3}
                                                        className="rounded-none resize-none bg-background text-xs"
                                                    />
                                                    <p className="text-[10px] text-primary/60">
                                                        * Gunakan Enter untuk membuat baris baru.
                                                    </p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="landingSubtitleInput" className="text-xs font-semibold text-primary cursor-pointer">Sub-Judul / Slogan</Label>
                                                        <span className="text-[10px] text-primary/60 font-mono">Desktop & Mobile</span>
                                                    </div>
                                                    <Textarea
                                                        id="landingSubtitleInput"
                                                        value={landingSubtitle}
                                                        onChange={(e) => setLandingSubtitle(e.target.value)}
                                                        placeholder="Real Bean, Real Coffee&#10;100% Bahagia"
                                                        rows={3}
                                                        className="rounded-none resize-none bg-background text-xs"
                                                    />
                                                    <p className="text-[10px] text-primary/60">
                                                        * Tampil di tampilan layar Desktop dan Mobile.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Inputs for Buttons */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="landingBtn1Input" className="text-xs font-semibold text-primary cursor-pointer">Teks Tombol 1 (Arah ke /home)</Label>
                                                    <Input
                                                        id="landingBtn1Input"
                                                        value={landingBtn1Text}
                                                        onChange={(e) => setLandingBtn1Text(e.target.value)}
                                                        placeholder="Lihat Promo"
                                                        className="h-9 text-xs bg-background rounded-none"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="landingBtn2Input" className="text-xs font-semibold text-primary cursor-pointer">Teks Tombol 2 (Arah ke /member)</Label>
                                                    <Input
                                                        id="landingBtn2Input"
                                                        value={landingBtn2Text}
                                                        onChange={(e) => setLandingBtn2Text(e.target.value)}
                                                        placeholder="Cek Poin"
                                                        className="h-9 text-xs bg-background rounded-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pilihan Mode Skala / Ukuran Penuh */}
                                        <div className="space-y-2 p-4 border border-primary/20 bg-background/40">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <div>
                                                    <div className="text-xs font-bold text-primary">Mode Ukuran / Skala Background</div>
                                                    <p className="text-[11px] text-primary/70">
                                                        Pilih bagaimana background ditampilkan pada layar perangkat (Paksa ukuran penuh atau proporsional).
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-primary/20 text-primary self-start sm:self-auto">
                                                    Aktif: {landingBgFit === 'fill' ? 'Paksa Ukuran Penuh (100% 100%)' : landingBgFit === 'cover' ? 'Penuh Proporsional (Cover)' : 'Contain'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                                {[
                                                    { id: "fill", label: "Paksa Ukuran Penuh (100% 100%)", desc: "Background dipaksa mengisi 100% lebar dan 100% tinggi layar penuh dari tepi ke tepi tanpa terpotong." },
                                                    { id: "cover", label: "Penuh Proporsional (Cover)", desc: "Menutup seluruh layar dengan menjaga rasio asli gambar (tepi mungkin ter-crop)." },
                                                    { id: "contain", label: "Proporsional Pas (Contain)", desc: "Gambar utuh tanpa terpotong dan tanpa distorsi rasio." },
                                                ].map((m) => (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => setLandingBgFit(m.id)}
                                                        className={cn(
                                                            "p-3 text-left border transition-all rounded-none cursor-pointer flex flex-col gap-1",
                                                            landingBgFit === m.id
                                                                ? "bg-primary text-white border-primary shadow-sm"
                                                                : "bg-background text-primary/80 border-primary/20 hover:border-primary/50"
                                                        )}
                                                    >
                                                        <div className="text-xs font-bold flex items-center justify-between">
                                                            <span>{m.label}</span>
                                                            {landingBgFit === m.id && <Check className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className={cn("text-[10px] leading-tight", landingBgFit === m.id ? "text-white/80" : "text-primary/60")}>
                                                            {m.desc}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Grid 2 Kolom: Desktop & Mobile */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Kolom 1: Desktop Background */}
                                            <div className="flex flex-col gap-4 p-4 border border-primary/20 bg-background/40">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Monitor className="w-4 h-4 text-primary" />
                                                        <span className="font-bold text-sm text-primary">Background Layar Desktop</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-primary/20 text-primary/80">
                                                        Layar Lebar (md+)
                                                    </span>
                                                </div>

                                                {/* Preview Aspect Ratio Video (16:9 Desktop Frame) */}
                                                <div className="space-y-1.5">
                                                    <div className="text-xs font-medium text-primary/80">Preview Desktop:</div>
                                                    <div
                                                        className="w-full aspect-video border border-primary/20 relative overflow-hidden shadow-inner flex flex-col justify-between p-3"
                                                        style={{
                                                            backgroundImage: `url('${landingBgDesktop || "/cofee-bg.webp"}')`,
                                                            backgroundSize: landingBgFit === "fill" ? "100% 100%" : landingBgFit === "contain" ? "contain" : "cover",
                                                            backgroundPosition: "center",
                                                            backgroundRepeat: "no-repeat",
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                                                        <div className="relative z-10 flex justify-between items-start">
                                                            <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded font-mono">
                                                                Desktop Mode
                                                            </span>
                                                            <div className="text-[9px] bg-white/80 text-black px-1.5 py-0.5 rounded font-semibold">
                                                                1920 × 1080
                                                            </div>
                                                        </div>
                                                        <div className="relative z-10 text-white drop-shadow-md">
                                                            <div className={cn("text-[12px] font-bold leading-tight whitespace-pre-line", getHeroFontClass(landingFont))}>
                                                                {landingTitle || "Nikmati Coffee\nPilihan Premium"}
                                                            </div>
                                                            <div className={cn("text-[9px] opacity-90 leading-tight whitespace-pre-line mt-1", getHeroFontClass(landingFont))}>
                                                                {landingSubtitle || "Real Bean, Real Coffee\n100% Bahagia"}
                                                            </div>
                                                            <div className="flex gap-1.5 mt-2">
                                                                <div className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold rounded-full shadow-sm">
                                                                    {landingBtn1Text || "Lihat Promo"}
                                                                </div>
                                                                <div className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold rounded-full shadow-sm">
                                                                    {landingBtn2Text || "Cek Poin"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Upload & Reset Controls */}
                                                <div className="flex flex-col gap-2 pt-2">
                                                    <input
                                                        type="file"
                                                        ref={desktopBgInputRef}
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleUploadBg(e, 'desktop')}
                                                    />

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            onClick={() => desktopBgInputRef.current?.click()}
                                                            disabled={isUploadingBgDesktop}
                                                            className="flex-1 rounded-none text-xs gap-2"
                                                        >
                                                            {isUploadingBgDesktop ? (
                                                                <>
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    Mengupload Desktop...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-3.5 h-3.5" />
                                                                    Upload Gambar Desktop
                                                                </>
                                                            )}
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setLandingBgDesktop("/cofee-bg.webp")}
                                                            title="Kembalikan ke Default"
                                                            className="rounded-none text-xs border-primary/20 gap-1.5 text-primary/80 hover:text-primary"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                            Reset
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label htmlFor="landingBgDesktopInput" className="text-[11px] text-primary/70 cursor-pointer">URL / Path Gambar Desktop:</Label>
                                                        <Input
                                                            id="landingBgDesktopInput"
                                                            value={landingBgDesktop}
                                                            onChange={(e) => setLandingBgDesktop(e.target.value)}
                                                            placeholder="/cofee-bg.webp atau https://..."
                                                            className="h-8 text-xs font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kolom 2: Mobile Background */}
                                            <div className="flex flex-col gap-4 p-4 border border-primary/20 bg-background/40">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="w-4 h-4 text-primary" />
                                                        <span className="font-bold text-sm text-primary">Background Layar Mobile</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-primary/20 text-primary/80">
                                                        Smartphone (&lt; md)
                                                    </span>
                                                </div>

                                                {/* Preview Aspect Ratio Mobile (Phone Frame Mockup) */}
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs font-medium text-primary/80">
                                                        <span>Preview Layar Mobile (Smartphone):</span>
                                                        <span className="text-[10px] text-primary/60 font-mono">Rasio 9:16</span>
                                                    </div>
                                                    <div className="flex justify-center w-full py-2">
                                                        <div
                                                            className="w-full max-w-[300px] sm:max-w-[320px] h-[480px] sm:h-[520px] border-[5px] border-primary/30 relative overflow-hidden shadow-xl flex flex-col justify-between p-4 rounded-[28px] bg-background/50"
                                                            style={{
                                                                backgroundImage: `url('${landingBgMobile || landingBgDesktop || "/cofee-bg.webp"}')`,
                                                                backgroundSize: landingBgFit === "fill" ? "100% 100%" : landingBgFit === "contain" ? "contain" : "cover",
                                                                backgroundPosition: "center",
                                                                backgroundRepeat: "no-repeat",
                                                            }}
                                                        >
                                                            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                                                            {/* Phone Dynamic Island / Speaker Notch & Status Bar */}
                                                            <div className="relative z-10 flex items-center justify-between text-[11px] text-white font-mono px-2">
                                                                <span className="font-semibold">09:41</span>
                                                                <div className="w-20 h-4 bg-black/70 rounded-full flex items-center justify-center">
                                                                    <div className="w-2 h-2 rounded-full bg-white/20 mr-1" />
                                                                </div>
                                                                <span className="text-[10px]">100%</span>
                                                            </div>

                                                            {/* Phone Main Content Mockup */}
                                                            <div className="relative z-10 text-center text-white drop-shadow-md my-auto flex flex-col items-center gap-3">
                                                                {/* Circular Cafe Emblem */}
                                                                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center p-3 border border-white/20 shadow-md">
                                                                    <div className="text-2xl">☕</div>
                                                                </div>

                                                                <div className="space-y-1 px-2">
                                                                    <div className={cn("text-sm sm:text-base font-bold leading-tight tracking-wide drop-shadow-md whitespace-pre-line", getHeroFontClass(landingFont))}>
                                                                        {landingSubtitle || "Real Bean, Real Coffee\n100% Bahagia"}
                                                                    </div>
                                                                </div>

                                                                {/* Buttons Group (Lebar & Tinggi Proporsional) */}
                                                                <div className="flex flex-row justify-center items-center gap-2 mt-3 w-full px-2">
                                                                    <div className="flex-1 max-w-[125px] h-[36px] bg-primary text-white text-xs font-medium rounded-full shadow-md flex items-center justify-center text-center px-2 truncate">
                                                                        {landingBtn1Text || "Lihat Promo"}
                                                                    </div>
                                                                    <div className="flex-1 max-w-[125px] h-[36px] bg-primary text-white text-xs font-medium rounded-full shadow-md flex items-center justify-center text-center px-2 truncate">
                                                                        {landingBtn2Text || "Cek Poin"}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Phone Home Bar & Resolution Info */}
                                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                                <div className="flex justify-between items-center w-full text-[10px] text-white/80 font-mono px-2">
                                                                    <span>Layar Penuh HP</span>
                                                                    <span>1080 × 1920</span>
                                                                </div>
                                                                <div className="w-24 h-1 bg-white/70 rounded-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Upload & Reset Controls */}
                                                <div className="flex flex-col gap-2 pt-2">
                                                    <input
                                                        type="file"
                                                        ref={mobileBgInputRef}
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleUploadBg(e, 'mobile')}
                                                    />

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            onClick={() => mobileBgInputRef.current?.click()}
                                                            disabled={isUploadingBgMobile}
                                                            className="flex-1 rounded-none text-xs gap-2"
                                                        >
                                                            {isUploadingBgMobile ? (
                                                                <>
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    Mengupload Mobile...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-3.5 h-3.5" />
                                                                    Upload Gambar Mobile
                                                                </>
                                                            )}
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setLandingBgMobile("/cofee-bg.webp")}
                                                            title="Kembalikan ke Default"
                                                            className="rounded-none text-xs border-primary/20 gap-1.5 text-primary/80 hover:text-primary"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                            Reset
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label htmlFor="landingBgMobileInput" className="text-[11px] text-primary/70 cursor-pointer">URL / Path Gambar Mobile:</Label>
                                                        <Input
                                                            id="landingBgMobileInput"
                                                            value={landingBgMobile}
                                                            onChange={(e) => setLandingBgMobile(e.target.value)}
                                                            placeholder="/cofee-bg.webp atau https://..."
                                                            className="h-8 text-xs font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-primary/10">
                                            <p className="text-xs text-primary/60">
                                                * Perubahan disimpan ke database dan langsung aktif di halaman pembuka.
                                            </p>
                                            <Button
                                                onClick={handleSaveLandingBg}
                                                disabled={isSavingLandingBg}
                                                className="w-full sm:w-auto px-6 rounded-none cursor-pointer"
                                            >
                                                {isSavingLandingBg ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Simpan Pengaturan Halaman Pembuka
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {activeMenu === 'hero_banner' && (
                            <div className="flex flex-col gap-4">
                                <Card className="bg-card-alt text-primary border-primary/20 shadow-sm rounded-none">
                                    <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="heroBannerTextInput" className="cursor-pointer">Teks Banner Utama</Label>
                                                <Textarea
                                                    id="heroBannerTextInput"
                                                    value={heroBannerText}
                                                    onChange={(e) => setHeroBannerText(e.target.value)}
                                                    placeholder="Masukkan teks untuk banner utama..."
                                                    rows={4}
                                                    className="rounded-none resize-none bg-background text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span id="heroBannerFontSelectLabel" className="flex items-center gap-1.5 font-medium text-xs">
                                                        <Type className="w-4 h-4 text-primary" />
                                                        <span>Font / Gaya Tipografi Banner Utama</span>
                                                    </span>
                                                    <span className="text-xs text-primary/70">
                                                        {HERO_FONTS.find(f => f.id === heroBannerFont)?.category || "Display"}
                                                    </span>
                                                </div>
                                                <Select value={heroBannerFont} onValueChange={(val) => { if (val) setHeroBannerFont(val) }}>
                                                    <SelectTrigger id="heroBannerFontSelect" aria-labelledby="heroBannerFontSelectLabel" className="w-full bg-background rounded-none border-primary/20">
                                                        <SelectValue placeholder="Pilih Font..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[320px]">
                                                        {HERO_FONTS.map(f => (
                                                            <SelectItem key={f.id} value={f.id} className="cursor-pointer py-2 border-b border-primary/5 last:border-0">
                                                                <div className="flex items-center justify-between w-full gap-4">
                                                                    <span className={cn(f.className, "text-base font-normal tracking-wide text-foreground")}>{f.name}</span>
                                                                    <span className="text-[11px] text-muted-foreground font-sans">({f.category})</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[11px] text-primary/70">
                                                    Font yang dipilih akan langsung diterapkan pada banner teks di halaman beranda.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold">Foto / Logo Banner Utama</div>
                                                <div className="flex flex-col gap-2 relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        id="heroBannerUpload"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setHeroBannerFile(e.target.files[0])
                                                                setHeroBannerFileName(e.target.files[0].name)
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                    <div className="flex items-center">
                                                        <label
                                                            htmlFor="heroBannerUpload"
                                                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors cursor-pointer"
                                                        >
                                                            Pilih File
                                                        </label>
                                                        <span className="ml-3 text-sm text-primary/70 truncate flex-1">
                                                            {heroBannerFileName || "Pilih gambar dari perangkat..."}
                                                        </span>
                                                        {(heroBannerFile || heroBannerImage) && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-primary/70 hover:text-destructive"
                                                                onClick={() => {
                                                                    setHeroBannerFile(null)
                                                                    setHeroBannerFileName("")
                                                                    setHeroBannerImage("")
                                                                    const fileInput = document.getElementById('heroBannerUpload') as HTMLInputElement
                                                                    if (fileInput) fileInput.value = ''
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs text-primary/70">Format yang didukung: JPG, PNG, WEBP.</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleSaveHeroBanner}
                                                disabled={isSavingHeroBanner}
                                                className="rounded-none mt-2 self-start"
                                            >
                                                {isSavingHeroBanner ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    "Simpan Perubahan"
                                                )}
                                            </Button>
                                        </div>
                                        <div className="w-full md:w-[350px] lg:w-[453px] flex-shrink-0 flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold">Preview Logo/Gambar Banner Utama</div>
                                                <div className="w-full aspect-[2/1] relative bg-muted rounded-sm overflow-hidden flex items-center justify-center border shadow-sm">
                                                    {heroBannerFile ? (
                                                        <img src={URL.createObjectURL(heroBannerFile)} alt="Preview Logo" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : heroBannerImage ? (
                                                        <img src={heroBannerImage} alt="Preview Logo" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : (
                                                        <span className="text-primary/70 text-sm">Pratinjau Logo Banner</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs font-semibold">Pratinjau Teks & Font Banner Utama</div>
                                                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                                        {HERO_FONTS.find(f => f.id === heroBannerFont)?.name || "Jockey One"}
                                                    </span>
                                                </div>
                                                <div className="w-full min-h-[120px] p-4 bg-background border border-primary/20 rounded-sm shadow-sm flex items-center justify-center text-center overflow-hidden">
                                                    <p className={cn(
                                                        "text-lg sm:text-xl lg:text-2xl text-primary whitespace-pre-wrap break-words leading-tight",
                                                        getHeroFontClass(heroBannerFont)
                                                    )}>
                                                        {heroBannerText || "Nikmati Kualitas Coffee Pilihan Premium\nReal Bean Real Coffee\n100 % Bahagia"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {activeMenu === 'hero_banner2' && (
                            <div className="flex flex-col gap-4">
                                <Card className="bg-card-alt text-primary border-primary/20 shadow-sm rounded-none">
                                    <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="heroBanner2TextInput" className="cursor-pointer">Teks Banner 2</Label>
                                                <Textarea
                                                    id="heroBanner2TextInput"
                                                    value={heroBanner2Text}
                                                    onChange={(e) => setHeroBanner2Text(e.target.value)}
                                                    placeholder="Masukkan teks untuk banner 2..."
                                                    rows={4}
                                                    className="rounded-none resize-none bg-background text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span id="heroBanner2FontSelectLabel" className="flex items-center gap-1.5 font-medium text-xs">
                                                        <Type className="w-4 h-4 text-primary" />
                                                        <span>Font / Gaya Tipografi Banner 2</span>
                                                    </span>
                                                    <span className="text-xs text-primary/70">
                                                        {HERO_FONTS.find(f => f.id === heroBanner2Font)?.category || "Display"}
                                                    </span>
                                                </div>
                                                <Select value={heroBanner2Font} onValueChange={(val) => { if (val) setHeroBanner2Font(val) }}>
                                                    <SelectTrigger id="heroBanner2FontSelect" aria-labelledby="heroBanner2FontSelectLabel" className="w-full bg-background rounded-none border-primary/20">
                                                        <SelectValue placeholder="Pilih Font..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[320px]">
                                                        {HERO_FONTS.map(f => (
                                                            <SelectItem key={f.id} value={f.id} className="cursor-pointer py-2 border-b border-primary/5 last:border-0">
                                                                <div className="flex items-center justify-between w-full gap-4">
                                                                    <span className={cn(f.className, "text-base font-normal tracking-wide text-foreground")}>{f.name}</span>
                                                                    <span className="text-[11px] text-muted-foreground font-sans">({f.category})</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[11px] text-primary/70">
                                                    Font yang dipilih akan langsung diterapkan pada banner 2 di halaman beranda.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold">Foto / Logo Banner 2</div>
                                                <div className="flex flex-col gap-2 relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        id="heroBanner2Upload"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setHeroBanner2File(e.target.files[0])
                                                                setHeroBanner2FileName(e.target.files[0].name)
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                    <div className="flex items-center">
                                                        <label
                                                            htmlFor="heroBanner2Upload"
                                                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors cursor-pointer"
                                                        >
                                                            Pilih File
                                                        </label>
                                                        <span className="ml-3 text-sm text-primary/70 truncate flex-1">
                                                            {heroBanner2FileName || "Pilih gambar dari perangkat..."}
                                                        </span>
                                                        {(heroBanner2File || heroBanner2Image) && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-primary/70 hover:text-destructive"
                                                                onClick={() => {
                                                                    setHeroBanner2File(null)
                                                                    setHeroBanner2FileName("")
                                                                    setHeroBanner2Image("")
                                                                    const fileInput = document.getElementById('heroBanner2Upload') as HTMLInputElement
                                                                    if (fileInput) fileInput.value = ''
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs text-primary/70">Format yang didukung: JPG, PNG, WEBP.</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleSaveHeroBanner2}
                                                disabled={isSavingHeroBanner2}
                                                className="rounded-none mt-2 self-start"
                                            >
                                                {isSavingHeroBanner2 ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    "Simpan Perubahan"
                                                )}
                                            </Button>
                                        </div>
                                        <div className="w-full md:w-[350px] lg:w-[453px] flex-shrink-0 flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold">Preview Logo/Gambar Banner 2</div>
                                                <div className="w-full aspect-[2/1] relative bg-muted rounded-sm overflow-hidden flex items-center justify-center border shadow-sm">
                                                    {heroBanner2File ? (
                                                        <img src={URL.createObjectURL(heroBanner2File)} alt="Preview Logo" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : heroBanner2Image ? (
                                                        <img src={heroBanner2Image} alt="Preview Logo" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : (
                                                        <span className="text-primary/70 text-sm">Pratinjau Logo Banner 2</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs font-semibold">Pratinjau Teks & Font Banner 2</div>
                                                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                                        {HERO_FONTS.find(f => f.id === heroBanner2Font)?.name || "Jockey One"}
                                                    </span>
                                                </div>
                                                <div className="w-full min-h-[120px] p-4 bg-background border border-primary/20 rounded-sm shadow-sm flex items-center justify-center text-center overflow-hidden">
                                                    <p className={cn(
                                                        "text-lg sm:text-xl lg:text-2xl text-primary whitespace-pre-wrap break-words leading-tight",
                                                        getHeroFontClass(heroBanner2Font)
                                                    )}>
                                                        {heroBanner2Text || "Nikmati Kualitas Coffee Pilihan Premium\nReal Bean Real Coffee\n100 % Bahagia"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {activeMenu === 'lokasi' && (
                            <div className="flex flex-col gap-3 md:gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <h2 className="text-lg md:text-xl font-semibold tracking-tight text-primary">Manajemen Outlet</h2>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                                            <Input
                                                placeholder="Cari outlet..."
                                                value={searchLokasiQuery}
                                                onChange={(e) => {
                                                    setSearchLokasiQuery(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="pr-9 h-8"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-full justify-end sm:w-auto">
                                            {selectedLokasiRows.length > 0 && (
                                                <Button variant="secondary" onClick={handleDeleteLokasi}>Hapus ({selectedLokasiRows.length})</Button>
                                            )}
                                            <Button onClick={handleAddClickLokasi} className="px-3 sm:px-4">
                                                <Plus className="h-4 w-4 sm:mr-2" />
                                                <span className="hidden sm:inline">Tambah Cabang</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <Dialog open={isLokasiDialogOpen} onOpenChange={setIsLokasiDialogOpen}>
                                    <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-4xl p-4 md:p-6 min-h-[60vh] max-h-[90vh] overflow-y-auto rounded-none">
                                        <DialogHeader>
                                            <DialogTitle className="text-xs md:text-sm font-semibold tracking-tight">{editingLokasiId ? "Edit Outlet" : "Tambah Outlet Baru"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 pt-4">
                                            <div className="flex flex-col gap-4 order-2 md:order-1">
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="lokasi-name" className="text-xs">Nama Cabang</Label>
                                                    <Input
                                                        id="lokasi-name"
                                                        value={newLokasi.name}
                                                        onChange={(e) => setNewLokasi({ ...newLokasi, name: e.target.value })}
                                                        placeholder="Misal: Sbagiamu Cafe Pusat"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="lokasi-address" className="text-xs">Alamat</Label>
                                                    <Input
                                                        id="lokasi-address"
                                                        value={newLokasi.address}
                                                        onChange={(e) => setNewLokasi({ ...newLokasi, address: e.target.value })}
                                                        placeholder="Misal: Jl. Magelang Km 5..."
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="lokasi-hours" className="text-xs">Jam Buka</Label>
                                                    <Input
                                                        id="lokasi-hours"
                                                        value={newLokasi.hours}
                                                        onChange={(e) => setNewLokasi({ ...newLokasi, hours: e.target.value })}
                                                        placeholder="Misal: 08:00 - 22:00"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="lokasi-phone" className="text-xs">Telepon</Label>
                                                    <Input
                                                        id="lokasi-phone"
                                                        value={newLokasi.phone}
                                                        onChange={(e) => setNewLokasi({ ...newLokasi, phone: e.target.value })}
                                                        placeholder="Misal: 0274-123456"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1">
                                                    <Label htmlFor="lokasi-maps_url" className="text-xs">Link Google Maps</Label>
                                                    <Input
                                                        id="lokasi-maps_url"
                                                        value={newLokasi.maps_url}
                                                        onChange={(e) => setNewLokasi({ ...newLokasi, maps_url: e.target.value })}
                                                        placeholder="Misal: https://maps.google.com/..."
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="grid w-full gap-1 mt-2">
                                                    <Label htmlFor="lokasi-image" className="text-xs">Upload Gambar Lokasi</Label>
                                                    <div className="relative w-full h-8">
                                                        <Input
                                                            id="lokasi-image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) {
                                                                    setLokasiFileName(file.name)
                                                                    setLokasiFile(file)
                                                                    const reader = new FileReader()
                                                                    reader.onloadend = () => {
                                                                        setNewLokasi({ ...newLokasi, image: reader.result as string })
                                                                    }
                                                                    reader.readAsDataURL(file)
                                                                } else {
                                                                    setLokasiFileName("")
                                                                    setLokasiFile(null)
                                                                    setNewLokasi({ ...newLokasi, image: "" })
                                                                }
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <Label
                                                            htmlFor="lokasi-image"
                                                            className="cursor-pointer flex h-8 w-full items-center justify-between rounded-none border border-input bg-background dark:bg-muted/20 pl-3 pr-1 py-1 text-xs ring-offset-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                                        >
                                                            <span className={`truncate mr-2 font-normal text-xs ${lokasiFileName ? "text-foreground" : "text-primary/70"}`}>
                                                                {lokasiFileName || "Tidak ada yang dipilih"}
                                                            </span>
                                                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-none text-[10px] font-medium shrink-0">
                                                                Pilih File
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Button onClick={handleSaveLokasi} className="h-8 w-full text-xs" disabled={isSavingLokasi}>
                                                        {isSavingLokasi ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Menyimpan...
                                                            </>
                                                        ) : (
                                                            editingLokasiId ? "Edit Outlet" : "Simpan Lokasi"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end justify-start order-1 md:order-2 mb-2 md:mb-0 md:mt-5">
                                                <div className="w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px] relative rounded-none border border-input overflow-hidden bg-muted/30 aspect-video shadow-sm">
                                                    {newLokasi.image ? (
                                                        <img src={newLokasi.image} alt="Preview Lokasi" className="w-full h-full object-cover absolute inset-0" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-primary/70 text-[10px] sm:text-xs text-center p-2">
                                                            Pratinjau Gambar Lokasi
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Mobile Card List */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {isLoading ? null : filteredLokasis.length === 0 ? (
                                        <div className="text-center py-10 text-primary/70 bg-card-alt text-primary border">
                                            Tidak ada data outlet.
                                        </div>
                                    ) : (
                                        filteredLokasis.slice((currentPage - 1) * 10, currentPage * 10).map((lokasi) => (
                                            <div key={lokasi.id} className="bg-card-alt text-primary border shadow-sm p-3 flex gap-3 relative flex-col">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex items-center mt-1">
                                                        <Checkbox
                                                            checked={selectedLokasiRows.includes(lokasi.id)}
                                                            onCheckedChange={(c) => handleSelectRowLokasi(lokasi.id, !!c)}
                                                            aria-label={`Select ${lokasi.name}`}
                                                        />
                                                    </div>
                                                    <div className="w-[120px] aspect-video shrink-0 cursor-pointer" onClick={() => handleEditClickLokasi(lokasi)}>
                                                        {lokasi.image ? (
                                                            <img src={lokasi.image} alt={lokasi.name} className="w-full h-full object-cover rounded-none border" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-muted border rounded-none">
                                                                <ImageIcon className="h-8 w-8 text-primary/70 opacity-50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-center min-w-0">
                                                        <div onClick={() => handleEditClickLokasi(lokasi)} className="cursor-pointer">
                                                            <div className="font-semibold text-foreground truncate text-sm line-clamp-2">{lokasi.name}</div>
                                                            <div className="text-xs text-primary/70 mt-1 line-clamp-2">{lokasi.address}</div>
                                                            <div className="text-xs text-primary/70 mt-1">{lokasi.hours}</div>
                                                            <div className="text-xs text-primary/70 mt-1">{lokasi.phone}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden">
                                    <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border">
                                        <TableHeader className="bg-primary-soft dark:bg-background">
                                            <TableRow>
                                                <TableHead className="w-[50px] text-center">
                                                    <Checkbox
                                                        aria-label="Select all"
                                                        checked={isAllLokasiSelected}
                                                        onCheckedChange={handleSelectAllLokasi}
                                                    />
                                                </TableHead>
                                                <TableHead className="w-[120px] text-center">Gambar</TableHead>
                                                <TableHead>Nama Cabang</TableHead>
                                                <TableHead>Alamat</TableHead>
                                                <TableHead>Jam Buka</TableHead>
                                                <TableHead>Telepon</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? null : (filteredLokasis.slice((currentPage - 1) * 10, currentPage * 10).map((lokasi) => (
                                                <TableRow key={lokasi.id}>
                                                    <TableCell className="text-center">
                                                        <Checkbox
                                                            aria-label={`Select ${lokasi.name}`}
                                                            checked={selectedLokasiRows.includes(lokasi.id)}
                                                            onCheckedChange={(c) => handleSelectRowLokasi(lokasi.id, !!c)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="p-2 cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40" onClick={() => handleEditClickLokasi(lokasi)}>
                                                        {lokasi.image ? (
                                                            <img
                                                                src={lokasi.image}
                                                                alt={lokasi.name}
                                                                className="w-[100px] aspect-video rounded-none object-cover border mx-auto"
                                                            />
                                                        ) : (
                                                            <div className="w-[100px] aspect-video mx-auto flex items-center justify-center bg-muted border rounded-none">
                                                                <ImageIcon className="h-6 w-6 text-primary/70 opacity-50" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors" onClick={() => handleEditClickLokasi(lokasi)}>
                                                        {lokasi.name}
                                                    </TableCell>
                                                    <TableCell className="cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors" onClick={() => handleEditClickLokasi(lokasi)}>
                                                        {lokasi.address}
                                                    </TableCell>
                                                    <TableCell className="cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors" onClick={() => handleEditClickLokasi(lokasi)}>
                                                        {lokasi.hours}
                                                    </TableCell>
                                                    <TableCell className="cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors" onClick={() => handleEditClickLokasi(lokasi)}>
                                                        {lokasi.phone}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                            {!isLoading && filteredLokasis.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center text-primary/70">
                                                        Tidak ada data outlet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4 md:mt-0 md:border-t-0">
                                    <TablePagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredLokasis.length / 10)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        )}

                        {activeMenu === 'running_text' && (
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-md md:text-xl font-semibold tracking-tight text-primary">Running Text</h2>
                                </div>

                                {/* ── GLOBAL CONFIG CARD ── */}
                                <div className="rounded-none border border-primary/20 bg-card-alt text-primary p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    {/* Master toggle */}
                                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                                        <div>
                                            <p className="text-sm font-semibold leading-tight">{rtConfig.is_enabled ? 'Aktif' : 'Nonaktif'}</p>
                                            <p className="text-[11px] text-primary/70">Tampilkan running text di beranda</p>
                                        </div>
                                        <Switch
                                            checked={rtConfig.is_enabled}
                                            onCheckedChange={async (v) => {
                                                setRtConfig({ ...rtConfig, is_enabled: v })
                                                const { error } = await supabase.from('running_text_config').upsert({ id: 1, is_enabled: v, speed: rtConfig.speed, updated_at: new Date().toISOString() })
                                                if (error) toast.add({ title: 'Gagal memperbarui', description: error.message, type: 'error' })
                                            }}
                                        />
                                    </div>

                                    {/* Speed selector */}
                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                                        <span className="text-sm whitespace-nowrap font-medium">Kecepatan</span>
                                        <Select
                                            value={rtConfig.speed}
                                            onValueChange={async (newSpeed) => {
                                                if (!newSpeed) return
                                                setRtConfig({ ...rtConfig, speed: newSpeed })
                                                const { error } = await supabase.from('running_text_config').upsert({ id: 1, is_enabled: rtConfig.is_enabled, speed: newSpeed, updated_at: new Date().toISOString() })
                                                if (error) toast.add({ title: 'Gagal memperbarui kecepatan', description: error.message, type: 'error' })
                                            }}
                                        >
                                            <SelectTrigger className="h-8 w-[100px] text-xs">
                                                <SelectValue placeholder="Pilih Kecepatan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="slow">Lambat</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="fast">Cepat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>

                                {/* ── TEMPLATE CEPAT ── */}
                                <div>
                                    <p className="text-xs font-semibold text-primary/70 mb-2 uppercase tracking-wider">Template Cepat — Klik untuk tambahkan</p>
                                    <div className="flex flex-wrap gap-2">
                                        {RUNNING_TEXT_TEMPLATES.map((tpl, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setEditingRunningTextId(null)
                                                    setNewRunningText({ text: tpl.text, is_active: true })
                                                    setIsRunningTextDialogOpen(true)
                                                }}
                                                className="px-3 py-1.5 text-xs rounded-sm border border-dashed border-primary/20 bg-card-alt text-primary hover:bg-primary-soft/40 dark:hover:bg-primary/40 hover:border-primary transition-colors font-medium"
                                            >
                                                {tpl.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ── DAFTAR TEKS ── */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Daftar Teks ({runningTexts.length})</p>
                                        <Button size="sm" variant="outline" onClick={() => {
                                            setEditingRunningTextId(null)
                                            setNewRunningText({ text: '', is_active: true })
                                            setIsRunningTextDialogOpen(true)
                                        }}>
                                            <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Teks
                                        </Button>
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden">
                                        <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border">
                                            <TableHeader className="bg-primary-soft dark:bg-background">
                                                <TableRow>
                                                    <TableHead className="w-[50px] text-center">No</TableHead>
                                                    <TableHead>Teks Berjalan</TableHead>
                                                    <TableHead className="text-center w-[100px]">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {runningTexts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="h-24 text-center text-sm text-primary/70">
                                                            Belum ada teks. Pilih template di atas atau klik <b>Tambah Teks</b>.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    runningTexts.map((rt, idx) => (
                                                        <TableRow key={rt.id}>
                                                            <TableCell
                                                                className="text-center text-primary/70 font-mono cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors"
                                                                onClick={() => {
                                                                    setEditingRunningTextId(rt.id)
                                                                    setNewRunningText({ text: rt.text, is_active: rt.is_active })
                                                                    setIsRunningTextDialogOpen(true)
                                                                }}
                                                            >
                                                                {idx + 1}
                                                            </TableCell>
                                                            <TableCell
                                                                className="font-medium cursor-pointer hover:bg-primary-soft/40 dark:hover:bg-primary/40 transition-colors"
                                                                onClick={() => {
                                                                    setEditingRunningTextId(rt.id)
                                                                    setNewRunningText({ text: rt.text, is_active: rt.is_active })
                                                                    setIsRunningTextDialogOpen(true)
                                                                }}
                                                            >
                                                                <p className={cn("text-sm min-w-0", !rt.is_active && "text-primary/70 line-through")}>
                                                                    {rt.text}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Switch
                                                                    checked={rt.is_active}
                                                                    onCheckedChange={async (checked) => {
                                                                        await supabase.from('running_text').update({ is_active: checked }).eq('id', rt.id)
                                                                        setRunningTexts(runningTexts.map(r => r.id === rt.id ? { ...r, is_active: checked } : r))
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Mobile List */}
                                    <div className="md:hidden flex flex-col gap-3">
                                        {runningTexts.length === 0 ? (
                                            <div className="py-10 text-center text-sm text-primary/70 border border-dashed rounded-none">
                                                Belum ada teks. Pilih template di atas atau klik <b>Tambah Teks</b>.
                                            </div>
                                        ) : (
                                            runningTexts.map((rt, idx) => (
                                                <div key={rt.id} className="flex flex-col gap-2 p-3 border rounded-sm bg-card-alt text-primary shadow-sm">
                                                    <div
                                                        className="flex-1 cursor-pointer"
                                                        onClick={() => {
                                                            setEditingRunningTextId(rt.id)
                                                            setNewRunningText({ text: rt.text, is_active: rt.is_active })
                                                            setIsRunningTextDialogOpen(true)
                                                        }}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-xs font-mono text-primary/70 mt-0.5">{idx + 1}.</span>
                                                            <p className={cn("text-sm leading-snug", !rt.is_active && "text-primary/70 line-through")}>
                                                                {rt.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between border-t border-border pt-2 mt-1">
                                                        <span className="text-[10px] text-primary/70 uppercase font-semibold tracking-wider">Status</span>
                                                        <Switch
                                                            checked={rt.is_active}
                                                            onCheckedChange={async (checked) => {
                                                                await supabase.from('running_text').update({ is_active: checked }).eq('id', rt.id)
                                                                setRunningTexts(runningTexts.map(r => r.id === rt.id ? { ...r, is_active: checked } : r))
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* ── DIALOG TAMBAH/EDIT ── */}
                                <Dialog open={isRunningTextDialogOpen} onOpenChange={setIsRunningTextDialogOpen}>
                                    <DialogContent className="w-[95vw] sm:max-w-md p-4 md:p-5 rounded-none">
                                        <DialogHeader>
                                            <DialogTitle className="text-sm">{editingRunningTextId ? 'Edit Teks' : 'Tambah Teks Baru'}</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4 pt-2">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="runningTextInput" className="cursor-pointer">Teks Berjalan</Label>
                                                <Textarea
                                                    id="runningTextInput"
                                                    value={newRunningText.text}
                                                    onChange={(e) => setNewRunningText({ ...newRunningText, text: e.target.value })}
                                                    placeholder="Masukkan teks yang akan berjalan di beranda..."
                                                    rows={3}
                                                    className="resize-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={newRunningText.is_active}
                                                    onCheckedChange={(v) => setNewRunningText({ ...newRunningText, is_active: v })}
                                                />
                                                <span className="text-xs font-medium cursor-pointer">{newRunningText.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                {editingRunningTextId && (
                                                    <Button
                                                        variant="destructive"
                                                        onClick={async () => {
                                                            await supabase.from('running_text').delete().eq('id', editingRunningTextId)
                                                            setRunningTexts(runningTexts.filter(r => r.id !== editingRunningTextId))
                                                            setIsRunningTextDialogOpen(false)
                                                            toast.add({ title: 'Teks dihapus', type: 'success' })
                                                        }}
                                                        className="shrink-0"
                                                    >
                                                        Hapus
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={async () => {
                                                        if (!newRunningText.text.trim()) return
                                                        setIsSavingRunningText(true)
                                                        try {
                                                            const payload = { text: newRunningText.text.trim(), is_active: newRunningText.is_active }
                                                            if (editingRunningTextId) {
                                                                const { error } = await supabase.from('running_text').update(payload).eq('id', editingRunningTextId)
                                                                if (error) throw error
                                                                setRunningTexts(runningTexts.map(r => r.id === editingRunningTextId ? { ...r, ...payload } : r))
                                                                toast.add({ title: 'Teks diperbarui', type: 'success' })
                                                            } else {
                                                                const { data, error } = await supabase.from('running_text').insert([payload]).select()
                                                                if (error) throw error
                                                                if (data) setRunningTexts([...runningTexts, ...data])
                                                                toast.add({ title: 'Teks berhasil ditambahkan', type: 'success' })
                                                            }
                                                            setIsRunningTextDialogOpen(false)
                                                        } catch (err: any) {
                                                            toast.add({ title: 'Gagal menyimpan', description: err.message, type: 'error' })
                                                        } finally {
                                                            setIsSavingRunningText(false)
                                                        }
                                                    }}
                                                    disabled={isSavingRunningText || !newRunningText.text.trim()}
                                                    className="flex-1"
                                                >
                                                    {isSavingRunningText ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                    Simpan
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}




                    </div>
                )}

            </div>
        </div>
    )
}
