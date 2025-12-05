"use client";

import LOGO from "@/img/LogoNuitInfoF3.png";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  HelpCircle,
  IdCard,
  Map,
  Pi,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingsModal } from "../Modal/SettingsModal";
import Image from "next/image";
import { GlobalIcon } from "../globalIcon/GlobalIcon";

interface Props {
  className?: string;
}

export const Navbar = ({ className = "" }: Props) => {
  const path = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // MODAL

  useEffect(() => {
    const newWidth = isCollapsed ? "88px" : "280px";

    document.documentElement.style.setProperty("--sidebar-width", newWidth);
  }, [isCollapsed]);

  const navItems = [
    {
      href: "/",
      text: "Parcours",
      mobileIcon: <Map className="w-6 h-6" />,
      icon: <Map className="w-6 h-6" />,
    },
    // {
    //   href: "/quest",
    //   text: "Quêtes",
    //   mobileIcon: <Trophy className="w-6 h-6" />,
    //   icon: <Trophy className="w-6 h-6" />,
    // },
    // {
    //   href: "/team",
    //   text: "Équipe",
    //   mobileIcon: <Users className="w-7 h-7" />,
    //   icon: <Users className="w-6 h-6" />,
    // },
    {
      href: "/chatbot",
      text: "Chatbot",
      mobileIcon: <HelpCircle className="w-7 h-7" />,
      icon: <HelpCircle className="w-6 h-6" />,
    },
  ];

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[1000] flex h-[80px] w-full items-center justify-between bg-[#0B1221] px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] md:hidden border-t border-white/10",
          className
        )}
      >
        {navItems.map((item, i) => {
          const isActive = path === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                isActive
                  ? "text-[#00E5FF] scale-110"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {isActive && (
                <div className="absolute -top-3 h-1 w-8 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
              )}
              {item.mobileIcon}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.text}
              </span>
            </Link>
          );
        })}
      </nav>

      <nav
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-[1000] h-screen flex-col justify-between bg-[#0B1221] py-8 font-sans transition-all duration-300 ease-in-out border-r border-white/5",
          isCollapsed ? "w-[88px]" : "w-[280px]",
          className
        )}
      >
        <div>
          <div
            className={cn(
              "mb-12 flex items-center gap-3 px-6 transition-all duration-300",
              isCollapsed ? "justify-center px-0" : ""
            )}
          >
            <div className="w-[200px] mx-auto">
              <img src="/LogoNuitInfoF3.png" alt="" />
            </div>

            {/*}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#0099FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <Droplet className="h-6 w-6 fill-current" />
              </div>

              <div
                className={cn(
                  "flex flex-col transition-opacity duration-200",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                <h1 className="text-xl font-black tracking-tight text-white whitespace-nowrap">
                  H2OCEAN
                </h1>
                <span className="text-[10px] font-bold tracking-widest text-[#00E5FF] uppercase whitespace-nowrap">
                  Global Initiative
                </span>
              </div>
            </Link>

          */}
          </div>

          <section className="flex flex-col w-full px-4 gap-2">
            {navItems.map((item, i) => {
              const isActive = path === item.href;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center h-12 rounded-xl transition-all duration-200 overflow-hidden",
                    isCollapsed ? "justify-center px-0" : "px-4 gap-4",
                    isActive
                      ? "bg-white/5 text-[#00E5FF]"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                  title={isCollapsed ? item.text : ""}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex-shrink-0",
                      isActive
                        ? "drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                        : ""
                    )}
                  >
                    {item.icon}
                  </div>

                  <p
                    className={cn(
                      "font-bold tracking-wide whitespace-nowrap transition-all duration-300",
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100"
                    )}
                  >
                    {item.text}
                  </p>
                </Link>
              );
            })}
          </section>
        </div>

        <div className="px-4 flex flex-col gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)} // OPEN MODAL
            className={cn(
              "flex items-center h-12 rounded-xl transition-colors hover:bg-white/5 text-slate-400 hover:text-white",
              isCollapsed ? "justify-center" : "gap-4 px-4"
            )}
          >
            <Settings className="w-6 h-6 flex-shrink-0" />
            <span
              className={cn(
                "font-bold transition-all duration-300 whitespace-nowrap",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              Paramètres
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
