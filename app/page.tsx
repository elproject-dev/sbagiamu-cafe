"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TopBar } from "@/components/top-bar";
import { LoadingSpinner } from "@/components/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import { mclaren, outfit } from "@/lib/fonts"


export default function LandingPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Fallback: never let the loading screen hang (getSession may stall on auth lock)
    const timeout = setTimeout(() => {
      if (!cancelled) setIsCheckingSession(false);
    }, 1500);

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        if (session?.user) {
          router.replace("/home");
          return;
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
      if (!cancelled) setIsCheckingSession(false);
    };
    checkUser();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <LoadingSpinner text="Memuat..." />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-primary dark:bg-background overflow-hidden flex flex-col">
      {/* Background Image */}
      <div
        className="absolute -left-[5px] top-[100px] w-[calc(100%+5px)] h-[calc(100%+80px)] z-0"
        style={{
          backgroundImage: "url('/cofee-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      />

      {/* Decorative Ellipses */}
      <div className="absolute w-[456px] h-[456px] left-[50%] lg:left-[-164px] top-[164px] bg-primary opacity-[0.05] z-0 -translate-x-1/2 lg:translate-x-0 rounded-full" />
      <div className="hidden lg:block absolute w-[109px] h-[109px] left-[485px] top-[82px] bg-destructive/30 opacity-[0.05] z-0 rounded-full" />
      <div className="hidden lg:block absolute w-[109px] h-[109px] left-[1348px] top-[122px] bg-card-alt opacity-[0.05] z-0 rounded-full" />
      <div className="hidden lg:block absolute w-[550px] h-[550px] left-[-66px] top-[-53px] bg-destructive/30 opacity-[0.05] z-0 rounded-full" />

      {/* TopBar (Sembunyikan) */}
      <div className="hidden">
        <TopBar />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 md:px-12 lg:px-20 pb-12 lg:pb-0 pt-0 gap-6 lg:gap-4">

        {/* Left Side: Text and Button */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full lg:w-3/5 gap-4 lg:gap-6">
          <h1
            className={`hidden lg:block text-primary-foreground dark:text-foreground lg:text-[48px] xl:text-[60px] leading-[1.2] tracking-[0.1em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${mclaren.className}`}
          >
            Nikmati Coffee <br />
            Pilihan Premium
          </h1>
          <h2
            className={`text-primary-foreground dark:text-foreground text-[20px] md:text-[28px] lg:text-[32px] leading-[1.4] tracking-[0.1em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] whitespace-normal ${mclaren.className}`}
          >
            Real Bean, Real Coffee <br />
            100% Bahagia
          </h2>

          <button
            className={`mt-2 flex flex-row justify-center items-center px-[20px] py-[8px] gap-[8px] w-[145px] h-[32px] lg:w-[160px] lg:h-[40px] bg-primary-foreground dark:bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-[100px] text-primary dark:text-background font-normal text-[12px] lg:text-[14px] leading-[15px] hover:opacity-90 transition-opacity ${outfit.className}`}
            onClick={() => router.push('/home')}
          >
            Lihat Promo
          </button>
        </div>

        {/* Right Side: Logo AI Image */}
        <Link href="/home" className="order-1 lg:order-2 relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[460px] lg:h-[460px] shrink-0 hover:scale-105 transition-transform duration-300 -z-10 mix-blend-multiply">
          <Image
            src="/LOGO AI NEW-07.png"
            alt="Logo"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain animate-zoom-soft"
          />
        </Link>
      </main>
    </div>
  );
}
