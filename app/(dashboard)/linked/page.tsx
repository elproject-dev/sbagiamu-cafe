"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { outfit } from "@/lib/fonts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const linkKeys = [
  { key: "grabfood_link", label: "GrabFood Link", default: "https://food.grab.com/" },
  { key: "shopeefood_link", label: "ShopeeFood Link", default: "https://shopee.co.id/shopeefood" },
  { key: "gofood_link", label: "GoFood Link", default: "https://gofood.co.id/" },
  { key: "google_review_link", label: "Google Review Link", default: "https://google.com/maps" },
  { key: "instagram_link", label: "Instagram Link", default: "https://instagram.com" },
  { key: "facebook_link", label: "Facebook Link", default: "https://facebook.com" },
  { key: "tiktok_link", label: "TikTok Link", default: "https://tiktok.com" },
  { key: "youtube_link", label: "YouTube Link", default: "https://youtube.com" },
  { key: "website_link", label: "Website Link", default: "https://sbagiamu.com" },
]

export default function LinkedPage() {
  const [links, setLinks] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchLinks = async () => {
      const keys = linkKeys.map(l => l.key)
      const { data, error } = await supabase.from('app_config').select('*').in('key', keys)
      
      if (!error && data) {
        const currentLinks: Record<string, string> = {}
        data.forEach(item => {
          currentLinks[item.key] = item.value
        })
        
        // Fill defaults if missing
        linkKeys.forEach(l => {
          if (!currentLinks[l.key]) {
            currentLinks[l.key] = l.default
          }
        })
        setLinks(currentLinks)
      } else {
        toast.add({ title: "Gagal memuat link", type: "error" })
      }
      setIsLoading(false)
    }
    fetchLinks()
  }, [])

  const handleChange = (key: string, value: string) => {
    setLinks(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    let hasError = false;

    for (const [key, value] of Object.entries(links)) {
      const { data } = await supabase.from('app_config').select('id').eq('key', key).maybeSingle()
      if (data) {
        const { error } = await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
        if (error) hasError = true;
      } else {
        const { error } = await supabase.from('app_config').insert({ key, value })
        if (error) hasError = true;
      }
    }
    
    if (hasError) {
      toast.add({ title: "Gagal menyimpan", description: "Beberapa tautan gagal disimpan", type: "error" })
    } else {
      toast.add({ title: "Link berhasil disimpan", type: "success" })
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <LoadingSpinner text="Memuat konfigurasi link..." />
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="mb-5 md:mb-6">
        <h1 className={`text-[20px] md:text-2xl font-bold text-primary ${outfit.className}`}>Manajemen Linked</h1>
        <p className="text-[13px] md:text-base text-primary/70 mt-1 md:mt-2">Atur tautan eksternal untuk aplikasi Sbagiamu Cafe.</p>
      </div>

      <div className="bg-card-alt border border-primary/20 rounded-xl p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {linkKeys.map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="text-sm font-medium text-primary">{item.label}</label>
              <Input
                value={links[item.key] || ""}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder={`Masukkan ${item.label}`}
                className="w-full bg-background"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-primary/10 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
