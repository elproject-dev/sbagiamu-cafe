import { Outfit, Jockey_One, McLaren } from "next/font/google"

// Outfit adalah variable font: satu file mencakup semua weight (300-800).
export const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })
export const jockey = Jockey_One({ weight: "400", subsets: ["latin"], preload: false })
export const mclaren = McLaren({ weight: "400", subsets: ["latin"], preload: false })
