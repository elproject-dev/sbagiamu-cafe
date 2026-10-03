"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Outfit } from "next/font/google"

const outfit = Outfit({ weight: ["300", "400", "500", "600", "700", "800"], subsets: ["latin"] })

export default function ProdukPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [produks, setProduks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduks = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true })

      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
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
    return (
      item.title.toLowerCase().includes(query) ||
      item.price.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="w-[90vw] max-w-lg p-0 border-none bg-transparent shadow-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-full [&>button]:p-2 [&>button]:right-2 [&>button]:top-2 [&>button]:hover:bg-black/70">
          {selectedImage && <img src={selectedImage} alt="Preview" className="w-full h-auto max-h-[85vh] rounded-sm object-contain shadow-2xl" />}
        </DialogContent>
      </Dialog>
      <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">
        <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] md:pt-[20px] pb-20 flex flex-col relative z-10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-0 md:mt-4">
            <h1 className={`hidden sm:block text-[24px] md:text-[30px] leading-[1.2] text-primary transition-colors ${outfit.className} font-[300]`}>Produk Hari Ini</h1>
            <div className="relative w-full sm:max-w-xs ml-auto">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProduks.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.src)}
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
