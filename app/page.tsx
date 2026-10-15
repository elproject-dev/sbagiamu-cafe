"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TopBar } from "@/components/top-bar";
import { LoadingSpinner } from "@/components/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import { outfit, getHeroFontClass } from "@/lib/fonts"


export default function LandingPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Inisialisasi langsung dari cache localStorage agar ZERO flicker/flashback
  const [bgDesktop, setBgDesktop] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_bg_desktop") || "/cofee-bg.webp";
    }
    return "/cofee-bg.webp";
  });
  const [bgMobile, setBgMobile] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_bg_mobile") || "/cofee-bg.webp";
    }
    return "/cofee-bg.webp";
  });
  const [bgFit, setBgFit] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_bg_fit") || "fill";
    }
    return "fill";
  });
  const [landingFont, setLandingFont] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_font") || "mclaren";
    }
    return "mclaren";
  });
  const [landingTitle, setLandingTitle] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_title") || "Nikmati Coffee\nPilihan Premium";
    }
    return "Nikmati Coffee\nPilihan Premium";
  });
  const [landingSubtitle, setLandingSubtitle] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_subtitle") || "Real Bean, Real Coffee\n100% Bahagia";
    }
    return "Real Bean, Real Coffee\n100% Bahagia";
  });
  const [landingBtn1Text, setLandingBtn1Text] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_btn1_text") || "Lihat Promo";
    }
    return "Lihat Promo";
  });
  const [landingBtn2Text, setLandingBtn2Text] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing_btn2_text") || "Cek Poin";
    }
    return "Cek Poin";
  });

  useEffect(() => {
    let cancelled = false;
    // Fallback: never let the loading screen hang (getSession may stall on auth lock)
    const timeout = setTimeout(() => {
      if (!cancelled) setIsCheckingSession(false);
    }, 1500);

    const initPage = async () => {
      try {
        const [sessionRes, bgRes] = await Promise.allSettled([
          supabase.auth.getSession(),
          supabase
            .from("app_config")
            .select("key, value")
            .in("key", [
              "landing_bg_desktop",
              "landing_bg_mobile",
              "landing_bg_fit",
              "landing_font",
              "landing_title",
              "landing_subtitle",
              "landing_btn1_text",
              "landing_btn2_text",
            ]),
        ]);

        if (cancelled) return;

        if (sessionRes.status === "fulfilled" && sessionRes.value.data.session?.user) {
          router.replace("/home");
          return;
        }

        if (bgRes.status === "fulfilled" && bgRes.value.data) {
          bgRes.value.data.forEach((item) => {
            if (item.key === "landing_bg_desktop" && item.value) {
              setBgDesktop(item.value);
              try { localStorage.setItem("landing_bg_desktop", item.value); } catch (e) { }
            }
            if (item.key === "landing_bg_mobile" && item.value) {
              setBgMobile(item.value);
              try { localStorage.setItem("landing_bg_mobile", item.value); } catch (e) { }
            }
            if (item.key === "landing_bg_fit" && item.value) {
              setBgFit(item.value);
              try { localStorage.setItem("landing_bg_fit", item.value); } catch (e) { }
            }
            if (item.key === "landing_font" && item.value) {
              setLandingFont(item.value);
              try { localStorage.setItem("landing_font", item.value); } catch (e) { }
            }
            if (item.key === "landing_title" && item.value) {
              setLandingTitle(item.value);
              try { localStorage.setItem("landing_title", item.value); } catch (e) { }
            }
            if (item.key === "landing_subtitle" && item.value) {
              setLandingSubtitle(item.value);
              try { localStorage.setItem("landing_subtitle", item.value); } catch (e) { }
            }
            if (item.key === "landing_btn1_text" && item.value) {
              setLandingBtn1Text(item.value);
              try { localStorage.setItem("landing_btn1_text", item.value); } catch (e) { }
            }
            if (item.key === "landing_btn2_text" && item.value) {
              setLandingBtn2Text(item.value);
              try { localStorage.setItem("landing_btn2_text", item.value); } catch (e) { }
            }
          });
        }
      } catch (error) {
        console.error("Failed to initialize landing page:", error);
      } finally {
        if (!cancelled) setIsCheckingSession(false);
      }
    };

    initPage();

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
      {/* Background Image Desktop (Layar Lebar / Desktop md+) */}
      <div
        className="hidden md:block absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url('${bgDesktop || "/cofee-bg.webp"}')`,
          backgroundSize: bgFit === "fill" ? "100% 100%" : bgFit === "contain" ? "contain" : "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Background Image Mobile (Layar Smartphone < md) */}
      <div
        className="block md:hidden absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url('${bgMobile || bgDesktop || "/cofee-bg.webp"}')`,
          backgroundSize: bgFit === "fill" ? "100% 100%" : bgFit === "contain" ? "contain" : "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
            className={`hidden lg:block text-primary-foreground dark:text-foreground lg:text-[48px] xl:text-[60px] leading-[1.2] tracking-[0.1em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] whitespace-pre-line ${getHeroFontClass(landingFont)}`}
          >
            {landingTitle}
          </h1>
          <h2
            className={`text-primary-foreground dark:text-foreground text-[20px] md:text-[28px] lg:text-[32px] leading-[1.4] tracking-[0.1em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] whitespace-pre-line ${getHeroFontClass(landingFont)}`}
          >
            {landingSubtitle}
          </h2>

          <div className="mt-2 flex flex-row items-center gap-3 flex-wrap justify-center lg:justify-start">
            <button
              className={`flex flex-row justify-center items-center px-[22px] py-[10px] gap-[8px] w-[155px] h-[42px] min-[390px]:w-[160px] min-[390px]:h-[44px] lg:w-[170px] lg:h-[46px] bg-primary dark:bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-[100px] text-white dark:text-background font-medium text-[13px] min-[390px]:text-[14px] leading-tight hover:bg-orange-700 transition-opacity ${outfit.className}`}
              onClick={() => router.push('/home')}
            >
              {landingBtn1Text}
            </button>
            <button
              className={`flex flex-row justify-center items-center px-[22px] py-[10px] gap-[8px] w-[155px] h-[42px] min-[390px]:w-[160px] min-[390px]:h-[44px] lg:w-[170px] lg:h-[46px] bg-primary dark:bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-[100px] text-white shadow-lg dark:text-background font-medium text-[13px] min-[390px]:text-[14px] leading-tight hover:bg-orange-700  transition-opacity ${outfit.className}`}
              onClick={() => router.push('/member')}
            >
              {landingBtn2Text}
            </button>
          </div>
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
