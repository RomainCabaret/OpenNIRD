import { Navbar } from "@/components/navbar/Navbar";
import { UserProvider } from "@/context/UserContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dinroundpro = localFont({
  src: [
    {
      path: "./fonts/dinroundpro_black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/dinroundpro_bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/dinroundpro_light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/dinroundpro_medi.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/dinroundpro.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-dinroundpro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "nuit info 2025",
  description: "H2Ocean Application",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      style={{ "--sidebar-width": "280px" } as React.CSSProperties}
    >
      <body
        className={`${dinroundpro.variable} bg-[#0B1221] text-white antialiased overflow-hidden`}
      >
        <UserProvider>
          <div className="flex min-h-screen w-full">
            <Navbar />

            <main className="relative h-screen w-full overflow-hidden pb-[80px] md:pb-0 md:pl-[var(--sidebar-width)] transition-all duration-300 ease-in-out">
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
