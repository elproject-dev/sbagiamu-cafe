"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Search, Tag, X } from "lucide-react"
import { Input } from "@/components/ui/input"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { outfit } from "@/lib/fonts"




export default function ProdukPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [produks, setProduks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [extLinks, setExtLinks] = useState<Record<string, string>>({})

  const orderPlatforms = [
    { name: "GrabFood", src: "/grabfood.png", href: extLinks.grabfood_link || "https://food.grab.com/" },
    { name: "ShopeeFood", src: "/shopeefood.png", href: extLinks.shopeefood_link || "https://shopee.co.id/shopeefood" },
    { name: "GoFood", src: "/gofood.png", href: extLinks.gofood_link || "https://gofood.co.id/" },
  ]
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('id, name').order('name', { ascending: true })
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchProduks = async () => {
      const { data: configData } = await supabase.from('app_config').select('key, value').in('key', ['grabfood_link', 'shopeefood_link', 'gofood_link'])
      if (configData) {
        const linksObj: Record<string, string> = {}
        configData.forEach(item => linksObj[item.key] = item.value)
        setExtLinks(linksObj)
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true })

      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          categoryId: item.category_id,
          title: item.name,
          price: `Rp ${Number(item.price).toLocaleString("id-ID")}`,
          src: item.image_url
            ? (item.image_url.startsWith('http')
              ? item.image_url
              : `https://wnozfcqgcmvxvkxbxgfj.supabase.co/storage/v1/object/public/product-images/${item.image_url}`)
            : "https://placehold.co/400x500?text=Produk"
        }))
        setProduks(formattedData)
      } else {
        setProduks([])
      }
      setIsMounted(true)
    }
    fetchProduks()
  }, [])

  if (!isMounted) {
    return <LoadingSpinner text="Memuat produk..." />
  }

  const filteredProduks = produks.filter((item) => {
    const query = searchQuery.toLowerCase()
    if (selectedCategory && item.categoryId !== selectedCategory.id) return false
    return (
      item.title.toLowerCase().includes(query) ||
      item.price.toLowerCase().includes(query)
    )
  })

  const suggestedCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="w-[90vw] max-w-sm p-0 overflow-hidden rounded-xl border-none bg-card gap-0">
          {selectedProduct && (
            <>
              <div className="w-full aspect-square bg-primary/15 relative">
                {selectedProduct.src && (
                  <img src={selectedProduct.src} alt={selectedProduct.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-x-0 bottom-0 px-5 pt-16 pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-0.5">
                  <DialogTitle className={`text-[20px] font-[600] text-white text-left drop-shadow ${outfit.className}`}>
                    {selectedProduct.title}
                  </DialogTitle>
                  <p className={`text-[18px] font-[800] text-white drop-shadow ${outfit.className}`}>{selectedProduct.price}</p>
                </div>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                <p className={`text-[13px] text-primary/70 ${outfit.className}`}>Pesan melalui</p>
                <div className="grid grid-cols-3 gap-3">
                  {orderPlatforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Pesan lewat ${p.name}`}
                      className="flex items-center justify-center rounded-lg bg-primary/5 py-2 hover:bg-primary/10 hover:scale-105 transition"
                    >
                      <img src={p.src} alt={p.name} className="w-[44px] h-[44px] object-contain" />
                    </a>
                  ))}
                </div>
              </div>

            </>
          )}
        </DialogContent>
      </Dialog>
      <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">
        <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] md:pt-[20px] pb-20 flex flex-col relative z-10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-0 md:mt-4">
            <h1 className={`hidden sm:block text-[24px] md:text-[30px] leading-[1.2] text-primary transition-colors ${outfit.className} font-[300]`}>Produk Hari Ini</h1>
            <div ref={searchBoxRef} className="w-full sm:max-w-xs ml-auto flex flex-col items-start">
              <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={selectedCategory ? `Cari di ${selectedCategory.name}...` : "Cari produk..."}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                className="pr-9"
              />
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-64 overflow-y-auto rounded-md border border-primary/20 bg-background text-primary shadow-lg animate-in fade-in-0 zoom-in-95">
                  <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-primary/60">Kategori</p>
                  {suggestedCategories.length > 0 ? (
                    suggestedCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(c)
                          setSearchQuery("")
                          setShowSuggestions(false)
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-primary/10 ${selectedCategory?.id === c.id ? "bg-primary/15" : ""}`}
                      >
                        <Tag className="h-3.5 w-3.5 opacity-70" />
                        {c.name}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-primary/60">Kategori tidak ditemukan</p>
                  )}
                </div>
              )}
              </div>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  <Tag className="h-3 w-3" />
                  {selectedCategory.name}
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProduks.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="flex flex-col w-full rounded-none overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-primary/10 bg-card transition-colors cursor-pointer group transform-gpu"
              >
                <div className="w-full aspect-square bg-primary/15 relative overflow-hidden flex items-center justify-center text-gray-500 text-sm transition-colors">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    "Produk"
                  )}
                </div>
                <div className="h-[60px] lg:h-[80px] w-full flex flex-col justify-center px-1 lg:px-[10px]">
                  <p className={`text-[14px] lg:text-[20px] text-primary font-[400] truncate transition-colors ${outfit.className}`}>
                    {item.title}
                  </p>
                  <p className={`text-[14px] lg:text-[24px] text-primary font-[800] mt-1 transition-colors ${outfit.className}`}>
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
            {filteredProduks.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Tidak ada produk yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  )
}
