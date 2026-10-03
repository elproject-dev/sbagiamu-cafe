"use client";
import React, { useState, useEffect } from "react";
import { BiHomeSmile, BiBox, BiBarcodeReader, BiMap, BiSun, BiMoon } from "react-icons/bi";
import { MdOutlineEvent } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { outfit } from "@/lib/fonts"

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

export function TopBar() {
 const router = useRouter();
 const pathname = usePathname();
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);
 const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);
 const [isCheckingUser, setIsCheckingUser] = useState(true);

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

 return () => subscription.unsubscribe();
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
 {/* Logo SBAGIAMU */}
 <div className="flex items-center z-10">
 <Link href="/home" className="flex items-center gap-[12px]">
 {/* Vector */}
 <span className="font-sans font-[700] text-[18px] md:text-[24px] leading-[24px] md:leading-[30px] text-primary-foreground dark:text-foreground">
 SBAGIAMU
 </span>
 </Link>
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
 </div>
 );
}
