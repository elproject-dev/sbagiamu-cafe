"use client";
import React, { useState, useEffect } from "react";
import { BiHomeSmile, BiBox, BiBarcodeReader, BiMap, BiSun, BiMoon } from "react-icons/bi";
import { MdOutlineEvent } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { outfit } from "@/lib/fonts"
import { cn } from "@/lib/utils";

import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { LogOutIcon, CircleUser, Coffee } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TopBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const storyScrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isStoryOpen) {
            const resetScroll = () => {
                if (storyScrollRef.current) {
                    storyScrollRef.current.scrollTop = 0;
                }
            };
            resetScroll();
            const raf = requestAnimationFrame(resetScroll);
            const timer = setTimeout(resetScroll, 60);
            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(timer);
            };
        }
    }, [isStoryOpen]);

    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [logoConfig, setLogoConfig] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const cached = localStorage.getItem("topbar_logo_config");
                if (cached) {
                    const parsed = JSON.parse(cached);
                    return {
                        mode: parsed.mode || "logo_only",
                        logoUrl: parsed.logoUrl || "/LOGO AI NEW-05.png",
                        logoSize: parsed.logoSize ? Number(parsed.logoSize) : 34,
                        logoColor: parsed.logoColor || "white",
                        companyName: parsed.companyName || "SBAGIAMU",
                        textSize: parsed.textSize ? Number(parsed.textSize) : 22,
                    };
                }
            } catch (e) {}
        }
        return {
            mode: "logo_only",
            logoUrl: "/LOGO AI NEW-05.png",
            logoSize: 34,
            logoColor: "white",
            companyName: "SBAGIAMU",
            textSize: 22,
        };
    });

    useEffect(() => {
        setMounted(true);

        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser({
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Pengguna",
                    email: session.user.email || "",
                    avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
                });
            } else {
                setUser({ name: "Belum Login", email: "Mode Tamu", avatar: "" });
            }
            setIsCheckingUser(false);
        };
        fetchUser();

        // Fetch topbar logo config from Supabase app_config (only re-render if actually changed)
        const fetchLogoConfig = async () => {
            try {
                const { data } = await supabase
                    .from("app_config")
                    .select("key, value")
                    .in("key", [
                        "topbar_display_mode",
                        "topbar_logo_url",
                        "topbar_logo_size",
                        "topbar_logo_color",
                        "topbar_company_name",
                        "topbar_text_size",
                    ]);

                if (data && data.length > 0) {
                    const cfg: Record<string, string> = {};
                    data.forEach((item: any) => {
                        cfg[item.key] = item.value;
                    });
                    setLogoConfig(prev => {
                        const updated = {
                            mode: cfg.topbar_display_mode || prev.mode,
                            logoUrl: cfg.topbar_logo_url || prev.logoUrl,
                            logoSize: cfg.topbar_logo_size ? parseInt(cfg.topbar_logo_size, 10) : prev.logoSize,
                            logoColor: cfg.topbar_logo_color || prev.logoColor,
                            companyName: cfg.topbar_company_name || prev.companyName,
                            textSize: cfg.topbar_text_size ? parseInt(cfg.topbar_text_size, 10) : prev.textSize,
                        };
                        const isSame =
                            prev.mode === updated.mode &&
                            prev.logoUrl === updated.logoUrl &&
                            prev.logoSize === updated.logoSize &&
                            prev.logoColor === updated.logoColor &&
                            prev.companyName === updated.companyName &&
                            prev.textSize === updated.textSize;
                        if (isSame) return prev;

                        try {
                            localStorage.setItem("topbar_logo_config", JSON.stringify(updated));
                        } catch (e) {}
                        return updated;
                    });
                }
            } catch (e) {}
        };
        fetchLogoConfig();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session?.user) {
                setUser({
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Pengguna",
                    email: session.user.email || "",
                    avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
                });
            } else {
                setUser({ name: "Belum Login", email: "Mode Tamu", avatar: "" });
            }
            setIsCheckingUser(false);
        });

        // Listen for live instant preview updates
        const handleConfigUpdate = (e: any) => {
            if (e.detail) {
                setLogoConfig(prev => {
                    const updated = { ...prev, ...e.detail };
                    try {
                        localStorage.setItem("topbar_logo_config", JSON.stringify(updated));
                    } catch (err) {}
                    return updated;
                });
            }
        };
        window.addEventListener("topbar-config-updated", handleConfigUpdate as EventListener);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener("topbar-config-updated", handleConfigUpdate as EventListener);
        };
    }, []);

    const handleLogout = async () => {
        if (user?.name === "Belum Login") {
            router.push("/login");
        } else {
            await supabase.auth.signOut();
            router.push("/");
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-[50px] bg-primary dark:bg-background shadow-[0px_4px_4px_rgba(0,0,0,0.25)] z-50 transition-colors">
            <div className="w-full max-w-[1440px] mx-auto h-full px-4 lg:px-[20px] flex items-center justify-between relative">
                {/* Logo SBAGIAMU (Klik untuk membuka Cerita SBAGIAMU) */}
                <div className="flex items-center z-10" suppressHydrationWarning>
                    <button
                        type="button"
                        onClick={(e) => {
                            (e.currentTarget as HTMLButtonElement)?.blur();
                            setIsStoryOpen(true);
                        }}
                        className="flex items-center gap-[10px] select-none cursor-pointer group hover:opacity-90 active:scale-[0.98] transition-all text-left bg-transparent border-0 p-0 focus:outline-none"
                        title="Klik untuk membaca Cerita SBAGIAMU"
                    >
                        {logoConfig.mode !== "text_only" && (
                            <img
                                src={logoConfig.logoUrl || "/LOGO AI NEW-05.png"}
                                alt={logoConfig.companyName || "SBAGIAMU"}
                                style={{
                                    height: `${logoConfig.logoSize}px`,
                                    width: "auto",
                                    aspectRatio: "2/1",
                                }}
                                className={cn(
                                    "max-h-[46px] object-contain drop-shadow-sm select-none group-hover:scale-105 transition-transform",
                                    logoConfig.logoColor === "white" ? "brightness-0 invert" : ""
                                )}
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                }}
                            />
                        )}
                        {(logoConfig.mode === "logo_and_text" || logoConfig.mode === "text_only") && (
                            <span
                                style={{ fontSize: `${logoConfig.textSize}px` }}
                                className="font-sans font-[700] leading-none text-primary-foreground dark:text-foreground group-hover:text-primary-soft transition-colors"
                            >
                                {logoConfig.companyName}
                            </span>
                        )}
                    </button>
                </div>

                {/* Top Navigation - Centered (Desktop) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center gap-[32px] w-auto h-[25px]">
                    <Link href="/home" className={`text-[20px] leading-[25px] ${pathname?.startsWith('/home') || pathname === '/' ? 'font-[700] text-primary-soft dark:text-primary hover:opacity-80 transition-opacity' : 'font-[300] text-primary-foreground dark:text-foreground hover:text-primary-soft dark:text-primary transition-colors'} ${outfit.className}`}>
                        Home
                    </Link>
                    <Link href="/produk" className={`text-[20px] leading-[25px] ${pathname?.startsWith('/produk') ? 'font-[700] text-primary-soft dark:text-primary hover:opacity-80 transition-opacity' : 'font-[300] text-primary-foreground dark:text-foreground hover:text-primary-soft dark:text-primary transition-colors'} ${outfit.className}`}>
                        Product
                    </Link>
                    <Link href="/promo" className={`text-[20px] leading-[25px] ${pathname?.startsWith('/promo') ? 'font-[700] text-primary-soft dark:text-primary hover:opacity-80 transition-opacity' : 'font-[300] text-primary-foreground dark:text-foreground hover:text-primary-soft dark:text-primary transition-colors'} ${outfit.className}`}>
                        Promo
                    </Link>
                    <Link href="/member" className={`text-[20px] leading-[25px] ${pathname?.startsWith('/member') ? 'font-[700] text-primary-soft dark:text-primary hover:opacity-80 transition-opacity' : 'font-[300] text-primary-foreground dark:text-foreground hover:text-primary-soft dark:text-primary transition-colors'} ${outfit.className}`}>
                        Member
                    </Link>
                    <Link href="/lokasi" className={`text-[20px] leading-[25px] ${pathname?.startsWith('/lokasi') ? 'font-[700] text-primary-soft dark:text-primary hover:opacity-80 transition-opacity' : 'font-[300] text-primary-foreground dark:text-foreground hover:text-primary-soft dark:text-primary transition-colors'} ${outfit.className}`}>
                        Outlet
                    </Link>
                    <Link href="/article" className={`text-[20px] leading-[25px] ${pathname?.startsWith('/article') ? 'font-[700] text-primary-soft dark:text-primary hover:opacity-80 transition-opacity' : 'font-[300] text-primary-foreground dark:text-foreground hover:text-primary-soft dark:text-primary transition-colors'} ${outfit.className}`}>
                        Insight
                    </Link>
                </div>

                {/* Right side: Theme Toggle & Avatar */}
                <div className="flex items-center gap-4 lg:gap-[20px]">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center justify-center hover:opacity-70 transition-opacity text-primary-foreground dark:text-foreground"
                        >
                            {theme === 'dark' ? (
                                <BiMoon className="w-5 h-5 md:w-[25px] md:h-[25px]" />
                            ) : (
                                <BiSun className="w-5 h-5 md:w-[25px] md:h-[25px]" />
                            )}
                        </button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-center outline-none">
                            {isCheckingUser ? (
                                <div className="w-[36px] h-[36px] rounded-full bg-card-alt animate-pulse border-2 border-card-alt" />
                            ) : user?.name === "Belum Login" ? (
                                <div className="w-[36px] h-[36px] rounded-full border-2 border-primary/30 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center bg-card-alt text-primary">
                                    <CircleUser className="w-[20px] h-[20px] stroke-[1.5]" />
                                </div>
                            ) : (
                                <Avatar className="w-[36px] h-[36px] rounded-full border-2 border-primary/30 cursor-pointer hover:opacity-90 transition-opacity bg-card-alt">
                                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} referrerPolicy="no-referrer" />
                                    <AvatarFallback className="rounded-full bg-card-alt text-primary">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="min-w-56 rounded-sm bg-card-alt border-primary/20 text-primary"
                            side="bottom"
                            align="end"
                            sideOffset={8}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        {user?.name === "Belum Login" ? (
                                            <div className="size-8 rounded-full flex items-center justify-center bg-background border border-primary/20 text-primary">
                                                <CircleUser className="size-5 stroke-[1.5]" />
                                            </div>
                                        ) : (
                                            <Avatar className="size-8 border border-primary/20">
                                                <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} referrerPolicy="no-referrer" />
                                                <AvatarFallback className="rounded-full text-xs bg-primary/20 text-primary">
                                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{user?.name}</span>
                                            <span className="truncate text-xs text-primary/70">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-primary/10" />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-500 focus:!text-white focus:**:!text-white dark:text-red-500 dark:focus:bg-red-600 dark:focus:!text-white">
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                {user?.name === "Belum Login" ? "Masuk / Login" : "Keluar"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Pop-up Modal: Cerita SBAGIAMU (Our Story) */}
            <Dialog open={isStoryOpen} onOpenChange={setIsStoryOpen}>
                <DialogContent
                    className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-card-alt text-primary border border-primary/20 rounded-2xl shadow-2xl"
                >
                    {/* Header Paling Atas (Pinned / Tetap Terlihat) */}
                    <div className="p-5 sm:p-6 pb-4 border-b border-primary/10 pr-12 flex-shrink-0">
                        <DialogHeader className="flex flex-col items-center text-center">
                            <DialogTitle className={`text-2xl sm:text-3xl font-bold tracking-tight text-primary ${outfit.className}`}>
                                Cerita SBAGIAMU
                            </DialogTitle>
                            <DialogDescription className="text-xs text-primary/70 font-medium">
                                Premium Street Coffee & Tea — Teman Bahagiamu
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Konten Cerita yang Scrollable (Selalu Reset ke Paling Atas saat Dibuka) */}
                    <div
                        ref={storyScrollRef}
                        className="overflow-y-auto p-5 sm:p-6 pt-4 flex-1 space-y-3.5 text-xs sm:text-sm leading-relaxed text-primary/90 font-normal"
                    >
                        <p className="text-justify first-letter:text-2xl sm:first-letter:text-3xl first-letter:font-bold first-letter:text-primary first-letter:mr-1">
                            Lahir pada tahun 2025, <strong className="font-semibold text-primary">SBAGIAMU Kopi dan Teh</strong> hadir dengan cara pandang berbeda dalam menikmati kopi dan teh. Kami percaya, menikmati minuman berkualitas tidak harus selalu dengan duduk berlama-lama di sebuah coffee shop. Terkadang, cukup dengan singgah sejenak di tengah kesibukan, mengambil secangkir kopi atau teh favorit, lalu melanjutkan perjalanan dengan semangat yang baru.
                        </p>

                        <p className="text-justify">
                            Mengusung konsep <strong className="font-semibold text-primary">premium street coffee & tea</strong>, SBAGIAMU memadukan kualitas, kepraktisan, dan harga yang bersahabat dalam satu pengalaman. Kami menghadirkan kopi yang dibuat dari biji kopi asli dan teh dengan cita rasa yang autentik, melalui proses penyajian yang mengutamakan kualitas di setiap cangkir. Semua dirancang agar kopi dan teh berkualitas dapat menjadi bagian dari keseharian siapa saja, tanpa harus terasa rumit atau mahal.
                        </p>

                        <p className="text-justify">
                            Bagi kami, SBAGIAMU bukan sekadar tempat membeli kopi dan teh. Kami ingin menjadi teman di sela-sela aktivitas, tempat singgah untuk berbagi kebahagiaan sebelum melanjutkan perjalanan, atau pilihan sederhana untuk menemani hari yang sibuk. Baik untuk dibawa pergi maupun dinikmati sejenak di tempat, setiap sajian SBAGIAMU hadir untuk memberikan pengalaman yang hangat, praktis, dan menyenangkan.
                        </p>

                        <p className="text-justify">
                            Kami percaya bahwa kebahagiaan tidak selalu membutuhkan waktu yang panjang atau momen yang istimewa. Terkadang, kebahagiaan dimulai dari hal sederhana: secangkir kopi yang pas, teh yang menyegarkan, dan jeda singkat yang membuat hari senantiasa bahagia.
                        </p>

                        {/* Highlight Slogan Box */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 text-center flex flex-col items-center justify-center gap-1 shadow-sm mt-3">
                            <span className={`text-sm sm:text-base font-bold text-primary tracking-wide ${outfit.className}`}>
                                SBAGIAMU Kopi dan Teh, Teman Bahagiamu.
                            </span>
                            <span className="text-[11px] text-primary/70 italic">
                                Real Bean, Real Coffee, 100% Bahagia
                            </span>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-primary/10 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStoryOpen(false);
                                    router.push('/home');
                                }}
                                className="text-xs text-primary/70 hover:text-primary hover:underline transition-colors order-2 sm:order-1 cursor-pointer"
                            >
                                Kembali ke Beranda
                            </button>
                            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsStoryOpen(false)}
                                    className="flex-1 sm:flex-none text-xs rounded-none border-primary/20 cursor-pointer"
                                >
                                    Tutup
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsStoryOpen(false);
                                        router.push('/produk');
                                    }}
                                    className="flex-1 sm:flex-none text-xs rounded-none cursor-pointer"
                                >
                                    Lihat Menu Kami
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
