import {
  Outfit,
  Jockey_One,
  McLaren,
  Playfair_Display,
  Bebas_Neue,
  Caveat,
  Pacifico,
  Cinzel,
  Righteous,
  Lobster,
  Poiret_One,
  Plus_Jakarta_Sans,
  Abril_Fatface,
  Dancing_Script,
  Montserrat,
  Satisfy,
  Oswald,
  Great_Vibes,
} from "next/font/google"

// Outfit adalah variable font: satu file mencakup semua weight (300-800).
export const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })
export const jockey = Jockey_One({ weight: "400", subsets: ["latin"], preload: false })
export const mclaren = McLaren({ weight: "400", subsets: ["latin"], preload: false })

export const playfair = Playfair_Display({ subsets: ["latin"], preload: false })
export const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], preload: false })
export const caveat = Caveat({ subsets: ["latin"], preload: false })
export const pacifico = Pacifico({ weight: "400", subsets: ["latin"], preload: false })
export const cinzel = Cinzel({ subsets: ["latin"], preload: false })
export const righteous = Righteous({ weight: "400", subsets: ["latin"], preload: false })
export const lobster = Lobster({ weight: "400", subsets: ["latin"], preload: false })
export const poiret = Poiret_One({ weight: "400", subsets: ["latin"], preload: false })
export const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], preload: false })
export const abril = Abril_Fatface({ weight: "400", subsets: ["latin"], preload: false })
export const dancing = Dancing_Script({ subsets: ["latin"], preload: false })
export const montserrat = Montserrat({ subsets: ["latin"], preload: false })
export const satisfy = Satisfy({ weight: "400", subsets: ["latin"], preload: false })
export const oswald = Oswald({ subsets: ["latin"], preload: false })
export const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], preload: false })

export interface HeroFontOption {
  id: string
  name: string
  category: string
  description?: string
  className: string
}

export const HERO_FONTS: HeroFontOption[] = [
  { id: "jockey", name: "Jockey One", category: "Display / Bold", className: jockey.className, description: "Bold & Sporty (Bawaan)" },
  { id: "bebas", name: "Bebas Neue", category: "Display / Bold", className: bebas.className, description: "Tegas & Huruf Kapital Ramping" },
  { id: "righteous", name: "Righteous", category: "Display / Bold", className: righteous.className, description: "Modern Retro Display" },
  { id: "oswald", name: "Oswald", category: "Display / Bold", className: oswald.className, description: "Klasik Bold Tegak" },

  { id: "mclaren", name: "McLaren", category: "Modern & Ramah", className: mclaren.className, description: "Ceria & Bersahabat" },
  { id: "outfit", name: "Outfit", category: "Modern & Ramah", className: outfit.className, description: "Geometris & Minimalis" },
  { id: "plus_jakarta", name: "Plus Jakarta Sans", category: "Modern & Ramah", className: plusJakarta.className, description: "Kontemporer Elegan" },
  { id: "montserrat", name: "Montserrat", category: "Modern & Ramah", className: montserrat.className, description: "Bersih & Populer" },

  { id: "playfair", name: "Playfair Display", category: "Serif & Mewah", className: playfair.className, description: "Klasik Mewah & Estetik" },
  { id: "cinzel", name: "Cinzel", category: "Serif & Mewah", className: cinzel.className, description: "Elegan Ala Butik" },
  { id: "abril", name: "Abril Fatface", category: "Serif & Mewah", className: abril.className, description: "Tebal & Dramatis" },
  { id: "poiret", name: "Poiret One", category: "Serif & Mewah", className: poiret.className, description: "Art Deco Ramping" },

  { id: "caveat", name: "Caveat", category: "Tulisan Tangan / Script", className: caveat.className, description: "Papan Tulis Kafe Santai" },
  { id: "pacifico", name: "Pacifico", category: "Tulisan Tangan / Script", className: pacifico.className, description: "Kuas Santai & Hangat" },
  { id: "lobster", name: "Lobster", category: "Tulisan Tangan / Script", className: lobster.className, description: "Retro Diner Klasik" },
  { id: "dancing", name: "Dancing Script", category: "Tulisan Tangan / Script", className: dancing.className, description: "Luwes Mengalir" },
  { id: "satisfy", name: "Satisfy", category: "Tulisan Tangan / Script", className: satisfy.className, description: "Kaligrafi Lembut" },
  { id: "great_vibes", name: "Great Vibes", category: "Tulisan Tangan / Script", className: greatVibes.className, description: "Kaligrafi Anggun" },
]

export const getHeroFontClass = (id?: string | null): string => {
  if (!id) return jockey.className
  const found = HERO_FONTS.find(f => f.id === id)
  return found ? found.className : jockey.className
}
