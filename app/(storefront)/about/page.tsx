"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, ArrowUpRight, MapPin, Mail, Sparkles, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#EFECE7] text-black font-sans pb-24 md:pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6 md:pt-12">
        
        {/* Top Hero Marquee Header Banner */}
        <div className="bg-black text-white rounded-3xl p-8 md:p-14 mb-8 md:mb-12 relative overflow-hidden flex flex-col justify-center min-h-[300px] md:min-h-[380px]">
          {/* Subtle noise and glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              MÜASİR KÜÇƏ DƏBİ.
            </h1>
            <p className="text-lg md:text-2xl font-light text-white/70 max-w-2xl mt-4 tracking-wide">
              Minimalist forma, memarlıq kəsimləri və premium geyim sənəti.
            </p>
          </div>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch">
          
          {/* Left Column: Brand Story + Social Buttons (Col 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 bg-white rounded-3xl p-8 md:p-12 border border-black/5 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 block mb-4">
                [ BREND HAQQINDA ]
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black mb-8 leading-[1.05]">
                Maksimal rahatlıq, kompromissiz keyfiyyət.
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl text-black/85 font-light leading-relaxed mb-6">
                <strong className="font-bold text-black">TOKYO STREET APPAREL</strong> — Bakıda fəaliyyət göstərən, minimalist dizayn və yüksək keyfiyyətli parçaları bir araya gətirən müstəqil geyim brendidir.
              </p>
              
              <p className="text-base sm:text-lg md:text-xl text-black/70 font-light leading-relaxed">
                Biz hər bir hoodie, t-shirt və dəstlərimizdə sıx toxunmuş ağır qrammajlı pambıqdan (480 GSM French Terry), xüsusi oversized kəsimlərdən və unikal detallardan istifadə edirik. Məqsədimiz gündəlik qarderobunuza həm maksimal rahatlıq, həm də fərqli stil qatmaqdır.
              </p>
            </div>

            {/* Social Action Pills */}
            <div className="pt-8 border-t border-black/10">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/40 block mb-4">
                Sosial Şəbəkələr & Birbaşa Əlaqə
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/994500000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-sm hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>

                {/* TikTok */}
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.48-.48.86-1.05 1.11-1.68.27-.72.41-1.48.41-2.25V8.01a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.56-.44z"/>
                    </svg>
                    <span>TikTok</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Photo Card + Modern Specs (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Visual Photo Card */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-black border border-black/5 group">
              <Image
                src="/sfpne5.jpg"
                alt="Tokyo Street Apparel Collection"
                fill
                priority
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white z-10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 block mb-1">
                    Editorial №01
                  </span>
                  <p className="text-xl font-black uppercase tracking-tight">
                    Tokyo Street Apparel
                  </p>
                </div>
                <span className="text-xs font-mono text-white/60">[ 2026 ]</span>
              </div>
            </div>

            {/* Direct Details Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-sm grid grid-cols-2 gap-5">
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Əlaqə Nömrəsi</span>
                <a href="tel:+994500000000" className="text-sm font-bold text-black hover:opacity-60 transition-opacity">+994 (50) 000-00-00</a>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">E-Poçt</span>
                <a href="mailto:info@tokyostreetapparel.com" className="text-sm font-bold text-black hover:opacity-60 transition-opacity truncate">info@tokyostreetapparel.com</a>
              </div>

              <div className="flex flex-col gap-1 border-t border-black/5 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Məkan</span>
                <span className="text-sm font-bold text-black">Bakı, Azərbaycan</span>
              </div>

              <div className="flex flex-col gap-1 border-t border-black/5 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Çatdırılma</span>
                <span className="text-sm font-bold text-black">Ölkə daxili sürətli</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
