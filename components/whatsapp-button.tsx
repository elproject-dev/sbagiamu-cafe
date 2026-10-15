"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Send,
  CheckCheck,
  AlertTriangle,
  Coffee,
  Sparkles,
  CalendarDays,
  MessageCircleQuestion,
  ChevronRight,
  RotateCcw,
} from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

const DEFAULT_PHONE = "6285877669199" // SBAGIAMU Cafe Wahid Hasyim

interface QuickTopic {
  id: string
  title: string
  icon: typeof Coffee
  description?: string
  isComplaint?: boolean
  template: string
}

const QUICK_TOPICS: QuickTopic[] = [
  {
    id: "complaint",
    title: "Keluhan & Masukan Pelanggan",
    icon: AlertTriangle,
    isComplaint: true,
    description: "Prioritas tindak lanjut oleh tim manajemen",
    template: `Halo Tim Sbagiamu Cafe, saya ingin menyampaikan keluhan/masukan:\n\n• Nama: \n• No. Meja / Outlet: \n• Kategori: \n• Detail Keluhan: \n\nMohon bantuannya untuk ditindaklanjuti. Terima kasih.`,
  },
  {
    id: "menu",
    title: "Rekomendasi & Info Menu",
    icon: Coffee,
    template: "Halo Sbagiamu Cafe, boleh minta rekomendasi menu favorit dan minuman spesial hari ini?",
  },
  {
    id: "promo",
    title: "Promo & Poin Member",
    icon: Sparkles,
    template: "Halo Sbagiamu Cafe, saya mau tanya promo yang sedang berlangsung dan info redeem poin member.",
  },
  {
    id: "reservasi",
    title: "Reservasi Tempat & Event",
    icon: CalendarDays,
    template: "Halo Sbagiamu Cafe, saya ingin menanyakan ketersediaan dan reservasi meja/tempat untuk acara.",
  },
  {
    id: "cs",
    title: "Tanya Customer Service",
    icon: MessageCircleQuestion,
    template: "Halo Sbagiamu Cafe, saya ingin berkonsultasi langsung dengan CS.",
  },
]

const COMPLAINT_CATEGORIES = [
  "Rasa / Kualitas Menu",
  "Waktu Tunggu / Antrean",
  "Pelayanan Barista / Kasir",
  "Kebersihan / Fasilitas",
  "Salah Menu / Pesanan Kurang",
]

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [phone, setPhone] = useState(DEFAULT_PHONE)
  const [selectedComplaintCategory, setSelectedComplaintCategory] = useState<string | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Ambil nomor telepon dari lokasi utama jika tersedia
  useEffect(() => {
    async function fetchPhone() {
      try {
        const { data } = await supabase
          .from("lokasi")
          .select("phone")
          .limit(1)
          .maybeSingle()

        if (data?.phone) {
          // Format ke 62xxxx
          let cleaned = data.phone.replace(/[^0-9]/g, "")
          if (cleaned.startsWith("0")) {
            cleaned = "62" + cleaned.slice(1)
          }
          if (cleaned.length >= 10) {
            setPhone(cleaned)
          }
        }
      } catch (err) {
        // Fallback default phone
      }
    }
    fetchPhone()
  }, [])

  // Close chat saat klik di luar area widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
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

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSelectTopic = (topic: QuickTopic) => {
    setSelectedTopicId(topic.id)
    if (topic.isComplaint) {
      setSelectedComplaintCategory(null)
    }
    setMessage(topic.template)
  }

  const handleSelectCategory = (cat: string) => {
    setSelectedComplaintCategory(cat)
    setMessage(
      `Halo Tim Sbagiamu Cafe, saya ingin menyampaikan keluhan/masukan:\n\n• Kategori: ${cat}\n• Nama: \n• No. Meja / Outlet: \n• Detail Keluhan: \n\nMohon bantuannya untuk ditindaklanjuti. Terima kasih.`
    )
  }

  const handleResetTopic = () => {
    setSelectedTopicId(null)
    setSelectedComplaintCategory(null)
    setMessage("")
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const textToSend = message.trim()
      ? message
      : "Halo Sbagiamu Cafe, saya ingin bertanya seputar layanan cafe."

    const encodedText = encodeURIComponent(textToSend)
    const waUrl = `https://wa.me/${phone}?text=${encodedText}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      ref={chatRef}
      className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-[90] flex flex-col items-end font-sans select-none"
    >
      {/* Floating Chat Box Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[82vh] bg-[#0c1317] border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00a884] via-[#099273] to-[#128c7e] p-3.5 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-black/40 p-1 flex items-center justify-center font-bold text-white shadow-inner overflow-hidden border border-white/20">
                    <img
                      src="/logo.png"
                      alt="Sbagiamu Cafe"
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        ; (e.target as HTMLElement).style.display = "none"
                      }}
                    />
                    <Coffee className="w-5 h-5 text-emerald-200 hidden" />
                  </div>
                  {/* Status indicator dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#099273] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                    Sbagiamu Cafe Support
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    Online • Siap Mendengarkan
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              className="p-3.5 flex-1 overflow-y-auto space-y-3.5 max-h-[360px] text-sm bg-[#0b141a] [scrollbar-width:thin] [scrollbar-color:#1e2a30_transparent]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(37, 211, 102, 0.04) 0%, transparent 80%)",
              }}
            >
              {/* Date Badge */}
              <div className="text-center my-0.5">
                <span className="text-[10px] bg-[#182229] text-gray-400 px-2.5 py-0.5 rounded-md border border-white/5 font-mono">
                  Hari ini
                </span>
              </div>

              {/* CS Greeting Bubble */}
              <div className="flex items-start gap-2 max-w-[92%]">
                <div className="bg-[#1e2a30] text-gray-100 p-3 rounded-2xl rounded-tl-sm border border-white/10 shadow-md space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#00a884] flex items-center gap-1">
                      <span>☕</span> Sbagiamu Cafe CS
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono">Respon Cepat</span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-gray-200">
                    Halo! 👋 Selamat datang di <strong>Sbagiamu Cafe</strong>.
                  </p>
                  <p className="text-[12.5px] leading-relaxed text-gray-300">
                    Ada yang bisa kami bantu? Pilih topik cepat atau sampaikan kritik, saran, &amp; keluhan kamu langsung ke kami.
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 pt-1">
                    <span>Baru saja</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              {/* Quick Topics Container */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-[11px] font-medium text-gray-400">
                    {selectedTopicId ? "Topik Dipilih:" : "Pilih Topik Layanan Cepat:"}
                  </p>
                  {selectedTopicId && (
                    <button
                      onClick={handleResetTopic}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Ganti Topik
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  {QUICK_TOPICS.map((topic) => {
                    const Icon = topic.icon
                    const isSelected = selectedTopicId === topic.id
                    const isComplaint = topic.isComplaint

                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`text-xs p-2.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2.5 ${isSelected
                          ? isComplaint
                            ? "bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-sm"
                            : "bg-[#00a884]/20 border-[#00a884] text-emerald-300 shadow-sm"
                          : isComplaint
                            ? "bg-amber-950/30 border-amber-500/30 text-amber-300/90 hover:bg-amber-900/40 hover:border-amber-400/50"
                            : "bg-[#182229] border-white/10 text-gray-300 hover:bg-[#222e35] hover:border-white/20"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isComplaint
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                              }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <span className="font-medium block truncate text-[12px]">
                              {topic.title}
                            </span>
                            {topic.description && (
                              <span className="text-[10px] text-amber-400/80 block">
                                {topic.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      </button>
                    )
                  })}
                </div>

                {/* Sub-kategori khusus jika memilih Keluhan Pelanggan */}
                {selectedTopicId === "complaint" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2 mt-2"
                  >
                    <p className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Kategori Masalah / Keluhan:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {COMPLAINT_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleSelectCategory(cat)}
                          className={`text-[10.5px] px-2.5 py-1 rounded-lg border transition-all ${selectedComplaintCategory === cat
                            ? "bg-amber-500 text-black font-semibold border-amber-400 shadow"
                            : "bg-[#182229] border-amber-500/20 text-amber-200/90 hover:bg-amber-900/30"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Chat Footer / Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-[#182229] border-t border-white/10 flex flex-col gap-2"
            >
              {message && (
                <div className="text-[10.5px] text-gray-400 flex items-center justify-between">
                  <span>Pesan siap dikirim ke WhatsApp:</span>
                  <button
                    type="button"
                    onClick={() => setMessage("")}
                    className="text-gray-400 hover:text-white"
                  >
                    Kosongkan
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  rows={selectedTopicId === "complaint" ? 3 : 2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ketik pesan atau detail keluhan kamu..."
                  className="flex-1 bg-[#0b141a] text-white placeholder-gray-500 text-xs px-3 py-2 rounded-xl border border-white/10 focus:border-[#00a884] focus:outline-none transition-colors resize-none leading-relaxed"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#00a884] to-[#128c7e] hover:brightness-110 text-white p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 shrink-0 h-10 w-10"
                  aria-label="Kirim Pesan WhatsApp"
                  title="Kirim ke WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Trigger Button (Right Side Floating) */}
      <div className="relative flex items-center group">
        {/* Tooltip on Desktop hover */}
        {!isOpen && (
          <div className="hidden md:flex absolute right-16 items-center px-3 py-1.5 rounded-xl bg-zinc-900/90 text-white text-xs font-medium shadow-xl border border-white/10 backdrop-blur-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Chat WhatsApp &amp; Keluhan
          </div>
        )}

        <button
          onClick={handleToggle}
          aria-label="Chat WhatsApp Sbagiamu Cafe"
          className="relative p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.65)] transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border border-emerald-300/30 cursor-pointer"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-75 blur-sm transition-opacity duration-300 animate-pulse pointer-events-none"></span>

          {/* Outer ping animation when button is closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
          )}

          {/* Icon toggle */}
          <div className="relative z-10 flex items-center justify-center">
            {isOpen ? (
              <X className="w-7 h-7 stroke-[2.5]" />
            ) : (
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            )}
          </div>

          {/* Unread badge dot */}
          {!isOpen && (
            <span className="absolute -top-1 -right-0 flex h-5 w-5 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-[#121b22]"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
