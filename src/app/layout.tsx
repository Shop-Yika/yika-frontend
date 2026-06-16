import type { Metadata } from "next";
import { Geist, Geist_Mono, Averia_Serif_Libre, Inter, Newsreader } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { auth } from "@/auth";

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const averiaSerif = Averia_Serif_Libre({
    variable: "--font-averia",
    subsets: ["latin"],
    weight: ["300", "400", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({
    variable: "--font-newsreader",
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: {
        default:  "Yíká — Fashion Rental Marketplace",
        template: "%s | Yíká",
    },
    description:
        "Rent luxury and everyday fashion from brands and individuals across Canada. " +
        "Browse dresses, tops, outerwear, and more.",
    openGraph: {
        title:       "Yíká — Fashion Rental Marketplace",
        description: "Rent fashion. Wear more. Own less.",
        siteName:    "Yíká",
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Pre-fetch the session on the server so SessionProvider can hydrate
    // the client without an extra round-trip.
    const session = await auth();

    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${averiaSerif.variable} ${inter.variable} ${newsreader.variable}`}>
        <head>
            <link
                href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className="font-satoshi antialiased flex flex-col min-h-screen">
        {/* SessionProvider makes useSession() available in all client components */}
        <SessionProvider session={session}>
            <Navbar />
            <div className="flex-1 pt-[76.87px]">
                <div className="max-w-full mx-auto w-full">{children}</div>
            </div>
            <Footer />
        </SessionProvider>
        </body>
        </html>
    );
}