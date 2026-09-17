"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ShoppingBag, Menu, ArrowRight } from "lucide-react";
import { SearchOverlay } from "./search-overlay";
import { CartOverlay } from "./cart-overlay";
import { useCart } from "@/components/cart-context";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isCartOpen, setIsCartOpen, items } = useCart();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Menu Toggle on Scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] flex items-center gap-2"
          >
            <button
              onClick={() => setSearchOpen(true)}
              className="bg-white/90 backdrop-blur text-black p-3 md:p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform border border-black/5"
              aria-label="Axtarış"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white/90 backdrop-blur text-black p-3 md:p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform relative border border-black/5"
              aria-label="Səbət"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-black text-white p-3 md:p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-[50] flex justify-center px-4 pt-6 pb-0 md:px-6 md:pt-6 md:pb-0">
        <header className="w-full h-12 md:h-14 max-w-[1600px] flex justify-between items-center bg-white rounded-xl md:rounded-2xl px-3 md:px-5 py-0 shadow-sm text-black border border-black/5">
          
          {/* Top Left: Logo */}
          <div className="flex items-center min-w-[100px]">
            <Link
              href="/"
              className="flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <Image src="/logo-black-cleaned.png" alt="TSA Logo" width={120} height={34} className="object-contain" priority />
            </Link>
          </div>

          {/* Premium Links (Center) */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/shop?category=bestseller" className="text-[10px] md:text-xs uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">ƏN ÇOX SATILANLAR</Link>
            <Link href="/shop?category=new-arrivals" className="text-[10px] md:text-xs uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">YENİ GƏLƏNLƏR</Link>
            
            {/* Shop All with Dropdown */}
            <div className="relative group py-4 -my-4">
              <Link href="/shop" className="text-[10px] md:text-xs uppercase tracking-widest font-bold hover:opacity-50 transition-opacity flex items-center gap-1.5">
                BÜTÜN MAĞAZA
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </Link>
              
              {/* Ultra-Modern Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[100]">
                <div className="bg-white/95 backdrop-blur-3xl border border-black/5 rounded-3xl shadow-2xl flex flex-col w-[800px] p-6 overflow-hidden relative">
                  
                  {/* Subtle Top Indicator */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-black/10 rounded-b-full" />

                  <div className="flex justify-between items-end mb-6 border-b border-black/10 pb-4">
                    <h3 className="text-xl font-black tracking-tighter lowercase">kolleksiyalar</h3>
                    <Link href="/shop" className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors flex items-center gap-1 group/all">
                      Hamısına bax 
                      <ArrowRight className="w-3 h-3 group-hover/all:translate-x-1 transition-transform" strokeWidth={2} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { name: 'HOODIE', id: 'hoodie', img: '/hoodies.webp' },
                      { name: 'T-ŞÖRT', id: 'tshirt', img: '/tees.webp' },
                      { name: 'AKSESUAR', id: 'accessory', img: '/local4.webp' },
                      { name: 'GEYİM DƏSTİ', id: 'outfit', img: '/local5.webp' }
                    ].map((cat) => (
                      <Link 
                        key={cat.id}
                        href={`/shop?category=${cat.id}`} 
                        className="group/card relative aspect-[3/4] rounded-2xl overflow-hidden flex items-end justify-center pb-6 bg-[#F5F5F2]"
                      >
                        <div className="absolute inset-0 bg-cover saturate-50 group-hover:saturate-100 bg-center transition-transform duration-1000 group-hover/card:scale-110" style={{ backgroundImage: `url(${cat.img})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex flex-col items-center translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                          <span className="text-white text-xs uppercase tracking-widest font-bold mb-1">{cat.name}</span>
                          <span className="text-white/70 text-[9px] uppercase tracking-widest font-bold border-b border-white/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100">İndi Al</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/orders" className="text-[10px] md:text-xs uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">SİFARİŞLƏRİM</Link>
            <Link href="/about" className="text-[10px] md:text-xs uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">HAQQIMIZDA</Link>
          </div>

          {/* Right Actions: Search & Cart (Always visible) */}
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
            <button 
              onClick={() => setSearchOpen(true)} 
              className="p-1.5 hover:opacity-60 transition-opacity flex items-center justify-center"
              aria-label="Axtarış"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:opacity-60 transition-opacity relative flex items-center justify-center"
              aria-label="Səbət"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-1.5 hover:opacity-60 transition-opacity flex items-center justify-center"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </header>
      </div>

      {/* Cart Drawer */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "circle(0% at 100% 0)" }}
            animate={{ clipPath: "circle(150% at 100% 0)" }}
            exit={{ clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col p-6 md:p-12 overflow-y-auto overflow-x-hidden bg-black text-white"
          >
            {/* Solid Black Background overlay */}
            <div className="absolute inset-0 bg-black z-0" />

            {/* Background Noise */}
            <div className="absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center w-full max-w-[1600px] mx-auto relative z-10">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                <Image src="/logo-white-cleaned.png" alt="TSA Logo" width={140} height={40} className="object-contain" />
              </Link>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Axtarış"
                >
                  <Search className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => { setMenuOpen(false); setIsCartOpen(true); }}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors relative"
                  aria-label="Səbət"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
                  aria-label="Bağla"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center w-full max-w-[1600px] mx-auto mt-12 overflow-y-auto relative z-10">
              
              {/* Minimalist Numbered Links */}
              <div className="flex flex-col w-full border-t border-white/10">
                
                {[
                  { num: "01", label: "YENİ GƏLƏNLƏR", href: "/shop?category=new-arrivals" },
                  { num: "02", label: "ƏN ÇOX SATILANLAR", href: "/shop?category=bestseller" },
                  { num: "03", label: "BÜTÜN MƏHSULLAR", href: "/shop" },
                  { num: "04", label: "SİFARİŞLƏRİM", href: "/orders" },
                  { num: "05", label: "SİFARİŞİ İZLƏ", href: "/track" },
                  { num: "06", label: "HAQQIMIZDA", href: "/about" },
                ].map((item, index) => (
                  <motion.div 
                    key={item.num}
                    initial={{ opacity: 0, rotateX: -20, y: 20 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-white/10"
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setMenuOpen(false)} 
                      className="w-full flex items-center justify-between py-6 md:py-10 group hover:pl-4 md:hover:pl-8 transition-all duration-700 ease-out"
                    >
                      <div className="flex items-start gap-4 md:gap-6">
                        <span className="text-white/20 text-xs md:text-sm font-mono mt-2 md:mt-4 group-hover:-translate-y-2 group-hover:text-white transition-all duration-500">
                          {item.num}
                        </span>
                        <div className="relative overflow-hidden py-1">
                          {/* Main Text */}
                          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 group-hover:-translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
                            {item.label}
                          </h2>
                          {/* Hover Text (Outline or Colored) */}
                          <h2 className="absolute top-1 left-0 text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase text-transparent opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.9)' }}>
                            {item.label}
                          </h2>
                        </div>
                      </div>
                      
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:bg-white group-hover:text-black transition-all duration-700">
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                      </div>
                    </Link>
                  </motion.div>
                ))}

              </div>
            </div>

            {/* Footer / Contact */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white/40 text-xs md:text-sm uppercase tracking-widest font-bold"
            >
              <div className="flex flex-col space-y-2">
                <span className="text-white">TOKYO STREET APPAREL © 2026</span>
                <span>BAKI, AZƏRBAYCAN</span>
              </div>
              <div className="flex gap-8">
                <Link href="#" className="hover:text-white transition-colors">INSTAGRAM</Link>
                <Link href="#" className="hover:text-white transition-colors">TIKTOK</Link>
                <Link href="#" className="hover:text-white transition-colors">ƏLAQƏ</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
