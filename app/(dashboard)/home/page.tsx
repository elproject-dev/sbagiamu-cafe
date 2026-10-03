"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { outfit, jockey } from "@/lib/fonts"
import { supabase } from "@/lib/supabase";
import { CalendarDays, MapPin } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


import { LoadingSpinner } from "@/components/loading-spinner";

export default function HomePage() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [heroText, setHeroText] = useState("Nikmati Kualitas Coffee Pilihan Premium \\nReal Bean Real Coffee \\n100 % Bahagia");
  const [heroImage, setHeroImage] = useState("/LOGO AI NEW-01.png");
  const [hero2Text, setHero2Text] = useState("Nikmati Kualitas Coffee Pilihan Premium \\nReal Bean Real Coffee \\n100 % Bahagia");
  const [hero2Image, setHero2Image] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [runningTexts, setRunningTexts] = useState<any[]>([]);
  const [rtConfig, setRtConfig] = useState({ is_enabled: false, speed: 'normal' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bannerPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const productPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  useEffect(() => {
    async function fetchData() {
      try {
        const [bannersRes, promosRes, productsRes, configRes, articlesRes] = await Promise.all([
          supabase.from("banner").select("*").order("created_at", { ascending: false }),
          supabase.from("promo").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5),
          supabase.from("products").select("*").eq("is_active", true).order("sort_order", { ascending: true, nullsFirst: false }).order("id", { ascending: true }).limit(10),
          supabase.from("app_config").select("key, value").in("key", ["hero_banner_text", "hero_banner_image", "hero_banner2_text", "hero_banner2_image"]),
          supabase.from("article").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5)
        ]);

        if (bannersRes.data) setBanners(bannersRes.data);
        if (promosRes.data) setPromos(promosRes.data);
        if (productsRes.data) setProducts(productsRes.data);
        if (articlesRes.data) setArticles(articlesRes.data);
        if (configRes.data) {
          configRes.data.forEach(item => {
            if (item.key === 'hero_banner_text') setHeroText(item.value);
            if (item.key === 'hero_banner_image') setHeroImage(item.value);
            if (item.key === 'hero_banner2_text') setHero2Text(item.value);
            if (item.key === 'hero_banner2_image') setHero2Image(item.value);
          });
        }

        try {
          const rtRes = await supabase.from("running_text").select("*").eq("is_active", true).order("created_at", { ascending: true });
          const rtConfRes = await supabase.from("running_text_config").select("*").eq("id", 1).limit(1);
          if (rtRes.data) setRunningTexts(rtRes.data);
          if (rtConfRes.data && rtConfRes.data.length > 0) setRtConfig(rtConfRes.data[0]);
        } catch (rtErr) {
          console.error("Error fetching running text:", rtErr);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[100dvh] bg-background flex flex-col items-center justify-center font-sans">
        <LoadingSpinner text="Memuat beranda..." />
      </div>
    );
  }

  return (
    <>
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="w-[90vw] max-w-lg p-0 border-none bg-transparent shadow-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-full [&>button]:p-2 [&>button]:right-2 [&>button]:top-2 [&>button]:hover:bg-black/70">
          {selectedImage && <img src={selectedImage} alt="Preview" className="w-full h-auto max-h-[85vh] rounded-sm object-contain shadow-2xl" />}
        </DialogContent>
      </Dialog>

      <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">

        <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[20px] pb-20 flex flex-col relative z-10">

          {/* Running Text / Marquee Section */}
          {rtConfig.is_enabled && runningTexts.length > 0 && (
            <div className="w-full bg-transparent border-y-2 border-primary text-primary py-2 lg:py-3 mb-4 mt-4 lg:mt-6 overflow-hidden flex items-center">
              <div
                className="animate-marquee font-medium text-sm lg:text-base flex whitespace-nowrap"
                style={{ animationDuration: rtConfig.speed === 'slow' ? '400s' : rtConfig.speed === 'fast' ? '150s' : '250s' }}
              >
                <div className="flex gap-8 px-4">
                  {Array(15).fill(runningTexts).flat().map((rt, idx) => (
                    <span key={idx} className="flex items-center gap-3">
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-current opacity-40 shrink-0"></span>
                      {rt.text}
                    </span>
                  ))}
                </div>
                <div className="flex gap-8 px-4" aria-hidden="true">
                  {Array(15).fill(runningTexts).flat().map((rt, idx) => (
                    <span key={`dup1-${idx}`} className="flex items-center gap-3">
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-current opacity-40 shrink-0"></span>
                      {rt.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Banner Text Section */}
          <section className="flex flex-col-reverse lg:flex-row justify-between items-start w-full lg:min-h-[227px] mt-2 lg:mt-[20px] relative">
            {/* frame text */}
            <div className="w-full lg:w-[927px] relative lg:mt-0 pt-[21px] pb-[21px]">
              {isLoading ? (
                <div className="w-full lg:w-[850px] flex flex-col gap-4 items-center lg:items-start pt-4 lg:pt-0">
                  <div className="h-10 w-3/4 bg-primary/15 animate-pulse rounded" />
                  <div className="h-10 w-1/2 bg-primary/15 animate-pulse rounded" />
                  <div className="h-10 w-1/3 bg-primary/15 animate-pulse rounded" />
                </div>
              ) : (
                <h1 className={`w-full lg:w-[850px] text-[24px] md:text-[36px] lg:text-[48px] leading-[120%] text-primary text-center lg:text-left transition-colors font-normal whitespace-pre-wrap break-words ${jockey.className}`}>
                  {heroText}
                </h1>
              )}
            </div>
            {/* logo banner */}
            <div className="w-full lg:w-[453px] aspect-[2/1] lg:h-[226.5px] lg:absolute lg:right-0 lg:top-0 bg-primary/15 relative flex-shrink-0 mx-auto lg:mx-0 overflow-hidden rounded-sm">
              {isLoading ? (
                <div className="w-full h-full bg-primary/15 animate-pulse" />
              ) : heroImage.startsWith('http') || heroImage.startsWith('/') ? (
                <Image
                  src={heroImage}
                  alt="Logo AI"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/15" />
              )}
            </div>
          </section>

          {/* Decorative Line 2 */}
          <div
            className="w-full h-0 border-t-[2px] md:border-t-[5px] border-primary dark:border-primary/30 mt-8 lg:mt-[20px] transition-colors"
            style={{ transform: "rotate(0.17deg)" }}
          />

          {/* Hero Banners */}
          <section className="w-full mt-10">
            {isLoading ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="w-full aspect-[2/1] lg:h-[226.5px] bg-primary/15 animate-pulse rounded-sm transition-colors" />
                ))}
              </div>
            ) : banners.length > 0 ? (
              <div className="relative w-full rounded-sm group overflow-hidden">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[bannerPlugin.current]}
                  className="w-full"
                >
                  <CarouselContent>
                    {banners.map((item, idx) => (
                      <CarouselItem key={item.id || idx} className="md:basis-1/2 lg:basis-1/3">
                        <div className="w-full aspect-[2/1] lg:h-[226.5px] bg-primary/15 relative flex items-center justify-center text-gray-500 text-sm overflow-hidden rounded-sm">
                          {item.src ? (
                            <img src={item.src} alt={item.title} className="w-full h-full object-cover absolute inset-0" />
                          ) : (
                            item.title
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Boba / Slider Dots via CarouselDots */}
                  {banners.length > 1 && (
                    <div className="mt-6">
                      <CarouselDots realCount={banners.length} />
                    </div>
                  )}
                </Carousel>
              </div>
            ) : (
              <div className="w-full text-center text-gray-500 py-10 border rounded-sm border-dashed border-zinc-300 dark:border-zinc-700">Belum ada banner aktif</div>
            )}
          </section>

          {/* Decorative Line 3 */}
          <div className="w-full h-0 border-t-[2px] md:border-t-[5px] border-primary dark:border-primary/30 mt-6 transition-colors" />

          {/* Promotion Title Area */}
          <div className="flex justify-between items-baseline mt-3">
            <h2 className={`text-[20px] md:text-[30px] leading-[1.2] text-primary transition-colors ${outfit.className} font-[300]`}>
              Promotion
            </h2>
            <Link
              href="/promo"
              className={`text-[16px] md:text-[20px] leading-[20px] md:leading-[25px] font-[300] text-primary/80 hover:underline transition-colors ${outfit.className}`}
            >
              see all
            </Link>
          </div>

          {/* Promo Cards */}
          <section className="w-full flex flex-col gap-[20px] mt-4">
            {isLoading ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="w-full h-[264px] bg-primary/15 animate-pulse transition-colors" />
              ))
            ) : promos.length > 0 ? (
              promos.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col md:flex-row w-full h-auto md:h-[264px] transition-colors md:gap-[20px] gap-4">
                  {/* foto promo */}
                  <div className="w-full md:w-[264px] md:h-[264px] aspect-square shrink-0 bg-primary/15 relative flex items-center justify-center overflow-hidden shadow-sm rounded-md md:rounded-none">
                    {item.src ? (
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="text-gray-500">Foto</span>
                    )}
                  </div>

                  {/* pagagraf promo */}
                  <div className="flex-1 flex flex-col bg-primary-soft shadow-sm overflow-hidden group-hover:shadow-md transition-shadow rounded-md md:rounded-none">
                    {/* Title Header */}
                    <div className="w-full px-[17px] py-3 md:py-4 flex items-center shrink-0 border-b border-primary/10">
                      <h3 className={`font-semibold text-[16px] md:text-[24px] leading-tight text-primary line-clamp-2 ${outfit.className}`}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Frame 7 - Description Box */}
                    <div className="flex-1 bg-card-alt w-full p-[17px] flex flex-col justify-between overflow-hidden">
                      <p className={`font-normal text-[14px] md:text-[16px] leading-relaxed text-primary/80 line-clamp-3 md:line-clamp-4 ${outfit.className}`}>
                        {item.promo || "Detail promo tidak tersedia."}
                      </p>
                      <div className="mt-3">
                        <span className={`font-medium text-[14px] md:text-[16px] text-brand-accent cursor-pointer hover:underline ${outfit.className}`} onClick={() => router.push(`/promo/${item.id}`)}>
                          more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-10">Belum ada promo aktif</div>
            )}
          </section>

          {/* Decorative Line Between Promo and Banner */}
          <div
            className="w-full h-0 border-t-[2px] md:border-t-[5px] border-primary dark:border-primary/30 mt-[40px] transition-colors"
            style={{ transform: "rotate(0.17deg)" }}
          />

          {/* Hero Banner 2 Section */}
          <section className="flex flex-col lg:flex-row justify-between items-start w-full lg:min-h-[227px] mt-[40px] relative">
            {/* logo banner */}
            <div className="w-full lg:w-[453px] aspect-[2/1] lg:h-[226.5px] lg:absolute lg:left-0 lg:top-0 bg-primary/15 relative flex-shrink-0 mx-auto lg:mx-0 overflow-hidden rounded-sm">
              {isLoading ? (
                <div className="w-full h-full bg-primary/15 animate-pulse" />
              ) : hero2Image.startsWith('http') || hero2Image.startsWith('/') ? (
                <Image
                  src={hero2Image}
                  alt="Banner 2"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            {/* frame text */}
            <div className="w-full lg:w-[927px] relative mt-4 lg:mt-0 lg:ml-auto pt-[21px] pb-[21px] flex justify-center lg:justify-end">
              {isLoading ? (
                <div className="w-full lg:w-[850px] flex flex-col gap-4 items-center lg:items-end pt-4 lg:pt-0">
                  <div className="h-10 w-3/4 bg-primary/15 animate-pulse rounded" />
                  <div className="h-10 w-1/2 bg-primary/15 animate-pulse rounded" />
                  <div className="h-10 w-1/3 bg-primary/15 animate-pulse rounded" />
                </div>
              ) : (
                <h1 className={`w-full lg:w-[850px] text-[24px] md:text-[36px] lg:text-[48px] leading-[120%] text-primary text-center lg:text-right transition-colors font-normal whitespace-pre-wrap break-words ${jockey.className}`}>
                  {hero2Text}
                </h1>
              )}
            </div>
          </section>

          {/* Decorative Line 4 */}
          <div className="w-full h-0 border-t-[2px] md:border-t-[5px] border-primary dark:border-primary/30 mt-[40px] transition-colors" />

          {/* New Product Title Area */}
          <div className="flex justify-between items-baseline mt-3">
            <h2 className={`text-[20px] md:text-[30px] leading-[1.2] text-primary transition-colors ${outfit.className} font-[300]`}>
              New Product
            </h2>
            <Link
              href="/produk"
              className={`text-[16px] md:text-[20px] leading-[20px] md:leading-[25px] font-[300] text-primary/80 hover:underline transition-colors ${outfit.className}`}
            >
              see all
            </Link>
          </div>

          {/* Product Cards */}
          <section className="w-full mt-1 md:mt-4">
            {isLoading ? (
              <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="w-full aspect-[3/4] bg-primary/15 animate-pulse transition-colors" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="relative w-full">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[productPlugin.current]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4 py-2 md:py-4">
                    {products.map((item, idx) => (
                      <CarouselItem key={item.id || idx} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                        <div
                          className="flex flex-col w-full rounded-none overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-primary/10 bg-card transition-colors cursor-pointer group transform-gpu"
                          onClick={() => setSelectedImage(item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `https://wnozfcqgcmvxvkxbxgfj.supabase.co/storage/v1/object/public/product-images/${item.image_url}`) : null)}
                        >
                          <div className="w-full aspect-square bg-primary/15 relative overflow-hidden flex items-center justify-center text-gray-500 text-sm transition-colors">
                            {item.image_url ? (
                              <img
                                src={item.image_url.startsWith('http') ? item.image_url : `https://wnozfcqgcmvxvkxbxgfj.supabase.co/storage/v1/object/public/product-images/${item.image_url}`}
                                alt={item.name}
                                className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              "Produk"
                            )}
                          </div>
                          <div className="h-[60px] lg:h-[80px] w-full flex flex-col justify-center px-1 lg:px-[10px]">
                            <p className={`text-[14px] lg:text-[20px] text-primary font-[400] truncate transition-colors ${outfit.className}`}>
                              {item.name}
                            </p>
                            <p className={`text-[14px] lg:text-[24px] text-primary font-[800] mt-1 transition-colors ${outfit.className}`}>
                              Rp {Number(item.price).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            ) : (
              <div className="w-full text-center text-gray-500 py-10">Belum ada produk aktif</div>
            )}
          </section>

          {/* Decorative Line above Lokasi */}
          <div className="w-full h-0 border-t-[2px] md:border-t-[5px] border-primary dark:border-primary/30 mt-[40px] transition-colors" />

          {/* Lokasi Section */}
          <section className="w-full mt-[40px] mb-2 flex flex-col md:flex-row items-center justify-between bg-card-alt p-6 md:p-8 border border-primary/20 rounded-md shadow-sm gap-4 transition-colors">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className={`text-[20px] md:text-[28px] font-[600] text-primary ${outfit.className}`}>
                Temukan Lokasi Kami
              </h2>
              <p className={`text-[14px] md:text-[16px] text-primary/70 ${outfit.className}`}>
                Kunjungi outlet terdekat untuk menikmati sajian spesial kami secara langsung.
              </p>
            </div>
            <button
              onClick={() => router.push('/lokasi')}
              className={`flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-[100px] hover:opacity-90 transition-opacity font-medium text-[14px] md:text-[16px] shrink-0 shadow-md ${outfit.className}`}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Lihat Lokasi
            </button>
          </section>

          {/* Decorative Line 5 */}
          <div className="w-full h-0 border-t-[2px] md:border-t-[5px] border-primary dark:border-primary/30 mt-[40px] transition-colors" />

          {/* Article Title Area */}
          <div className="flex justify-between items-baseline mt-3">
            <h2 className={`text-[20px] md:text-[30px] leading-[1.2] text-primary transition-colors ${outfit.className} font-[300]`}>
              Insight
            </h2>
            <Link
              href="/article"
              className={`text-[16px] md:text-[20px] leading-[20px] md:leading-[25px] font-[300] text-primary/80 hover:underline transition-colors ${outfit.className}`}
            >
              see all
            </Link>
          </div>

          {/* Article Cards */}
          <section className="w-full flex flex-col gap-[20px] mt-4">
            {isLoading ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="w-full h-[226.5px] bg-primary/15 animate-pulse transition-colors" />
              ))
            ) : articles.length > 0 ? (
              articles.map((item, idx) => (
                <div key={item.id || idx} onClick={() => router.push(`/article/${item.id}`)} className="flex flex-col md:flex-row w-full h-auto transition-colors cursor-pointer group md:gap-[20px] gap-4">
                  {/* foto article */}
                  <div className="w-full md:w-[453px] aspect-[2/1] shrink-0 bg-primary/15 relative flex items-center justify-center overflow-hidden shadow-sm rounded-md md:rounded-none">
                    {item.src ? (
                      <Image
                        src={item.src}
                        alt={item.title || "Insight"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">Foto</span>
                    )}
                  </div>

                  {/* pagagraf article */}
                  <div className="flex-1 flex flex-col bg-primary-soft shadow-sm overflow-hidden group-hover:shadow-md transition-shadow rounded-md md:rounded-none">
                    {/* Title Header */}
                    <div className="w-full px-[17px] py-3 md:py-4 flex items-center shrink-0 border-b border-primary/10">
                      <h3 className={`font-semibold text-[16px] md:text-[24px] leading-tight text-primary line-clamp-2 ${outfit.className}`}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Frame 7 - Description Box */}
                    <div className="flex-1 bg-card-alt w-full p-[17px] flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="flex items-center text-[12px] md:text-[14px] text-primary/70 mb-2">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <p className={`font-normal text-[14px] md:text-[16px] leading-relaxed text-primary/80 line-clamp-3 md:line-clamp-4 ${outfit.className}`}>
                          {item.description || "Detail article tidak tersedia."}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className={`font-medium text-[14px] md:text-[16px] text-brand-accent cursor-pointer hover:underline ${outfit.className}`} onClick={() => router.push(`/article/${item.id}`)}>
                          more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-10">Belum ada article aktif</div>
            )}
          </section>

        </main>
      </div>
    </>
  );
}
