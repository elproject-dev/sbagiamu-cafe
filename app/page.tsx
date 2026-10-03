"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TopBar } from "@/components/top-bar";
import { LoadingSpinner } from "@/components/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import { McLaren, Outfit } from "next/font/google";

const mclaren = McLaren({ weight: ["400"], subsets: ["latin"] });
const outfit = Outfit({ weight: ["400"], subsets: ["latin"] });

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
      <main className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:block pb-12 lg:pb-0 justify-start pt-12 lg:pt-0">

        {/* Left Side: Text */}
        <div className="order-2 lg:order-none relative px-5 lg:px-0 mt-4 lg:mt-0 z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h1
            className={`hidden md:block lg:absolute lg:left-[20px] lg:top-[259px] lg:w-[900px] lg:h-[70px] text-primary-foreground dark:text-foreground text-[28px] md:text-[32px] lg:text-[48px] leading-[1.2] lg:leading-[70px] tracking-[0.1em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${mclaren.className}`}
          >
            Nikmati Coffee Pilihan Premium
          </h1>
          <h2
            className={`lg:absolute lg:left-[20px] lg:top-[322px] lg:w-auto lg:h-auto text-primary-foreground dark:text-foreground text-[20px] md:text-[24px] lg:text-[32px] leading-[1.4] tracking-[0.1em] mt-2 lg:mt-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] whitespace-normal ${mclaren.className}`}
          >
            Real Bean, Real Coffee <br className="block lg:hidden" />
            <span className="hidden lg:inline"> </span>100% Bahagia
          </h2>
        </div>

        <div className="order-3 lg:order-none relative lg:absolute lg:left-[20px] lg:top-[390px] px-5 lg:px-0 mt-6 lg:mt-0 flex flex-col items-center lg:items-start justify-center gap-[12px] lg:gap-[16px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <button
            className={`flex flex-row justify-center items-center px-[20px] py-[8px] gap-[8px] w-[145px] h-[32px] bg-primary-foreground dark:bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-[100px] text-primary dark:text-background font-normal text-[12px] leading-[15px] hover:opacity-90 transition-opacity ${outfit.className}`}
            onClick={() => router.push('/home')}
          >
            Lihat Promo
          </button>
        </div>

        {/* Right Side: Logo AI Image */}
        <Link href="/home" className="order-1 lg:order-none relative lg:absolute lg:right-[20px] lg:top-[80px] w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[461px] lg:h-[461px] -mt-4 lg:mt-0 self-center mx-auto lg:mx-0 hover:scale-105 transition-transform duration-300 -z-10 mix-blend-multiply">
          <Image
            src="/LOGO AI NEW-07.png"
            alt="Logo"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain animate-zoom-soft"
          />
        </Link>
      </main>
    </div>
  );
}
