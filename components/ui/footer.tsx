"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const FooterColumn = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="col-span-1 border-b border-white/10 md:border-none pb-2 md:pb-0">
      <button 
        className="w-full flex justify-between items-center md:cursor-default md:pointer-events-none py-4 md:py-0 md:mb-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-bold uppercase tracking-[0.2em] text-[11px] text-white/50">{title}</h4>
        <svg 
          className={`w-4 h-4 text-white/50 md:hidden transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 md:h-auto ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-full md:opacity-100"}`}>
        {children}
      </div>
    </div>
  );
};

export function Footer() {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';

  return (
    <div className="px-2 md:px-3 pb-2 md:pb-3 bg-transparent">
      <footer className="bg-black text-white pt-12 md:pt-16 pb-8 md:pb-12 px-8 md:px-16 rounded-2xl">
        <div className="container mx-auto max-w-[1400px]">
          
          {/* Top Section: Logo & Newsletter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 border-b border-white/10 pb-8">
            
            {/* Massive Logo (Left) */}
            <div className="w-full md:w-1/2 flex items-center overflow-visible">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity w-full max-w-[200px] md:max-w-[300px]">
                <Image 
                  src="/logo-white-cleaned.png" 
                  alt="TSA Logo" 
                  width={300} 
                  height={100} 
                  className="object-contain w-full h-auto scale-125 md:scale-150 origin-left" 
                />
              </Link>
            </div>

            {/* Newsletter (Right) */}
            <div className="w-full md:w-1/2 md:pl-8 lg:pl-16">
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] mb-1.5">
                Yeniliklərdən xəbərdar olun
              </h3>
              <p className="text-[11px] md:text-xs font-light opacity-70 mb-3 leading-relaxed max-w-sm">
                Xəbər bülletenimizə abunə olun, yeni buraxılış və endirimlərdən ilk siz xəbərdar olun.
              </p>
              <form className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 group">
                <input 
                  type="email" 
                  placeholder="E-poçt ünvanınızı daxil edin" 
                  className="bg-transparent border-b border-white/30 text-white placeholder:text-white/40 w-full md:w-auto md:flex-1 py-1.5 focus:outline-none focus:border-white transition-colors text-xs font-light"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest text-[9px] py-2 px-4 md:py-2.5 md:px-5 transition-colors whitespace-nowrap mt-2 md:mt-0 rounded-full"
                >
                  Abunə Ol
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Section: 4 Link Columns */}
          <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-8 mb-12">
            
            <FooterColumn title="Brend">
              <ul className="flex flex-col gap-4 text-sm font-light opacity-90 pb-4 md:pb-0">
                <li><Link href="/about" className="hover:opacity-60 transition-opacity">Haqqımızda</Link></li>
                <li><Link href="/about" className="hover:opacity-60 transition-opacity">Materiallarımız</Link></li>
                <li><Link href="/about" className="hover:opacity-60 transition-opacity">Keyfiyyət Standartı</Link></li>
                <li><Link href="/shop" className="hover:opacity-60 transition-opacity">Kolleksiyalar</Link></li>
                <li><Link href="/orders" className="hover:opacity-60 transition-opacity">Sifarişlərim</Link></li>
              </ul>
            </FooterColumn>
            
            <FooterColumn title="Kateqoriyalar">
              <ul className="flex flex-col gap-4 text-sm font-light opacity-90 pb-4 md:pb-0">
                <li><Link href="/shop?category=hoodie" className="hover:opacity-60 transition-opacity">Hoodie</Link></li>
                <li><Link href="/shop?category=tshirt" className="hover:opacity-60 transition-opacity">T-Şört</Link></li>
                <li><Link href="/shop?category=outfit" className="hover:opacity-60 transition-opacity">Geyim Dəstləri</Link></li>
                <li><Link href="/shop?category=accessory" className="hover:opacity-60 transition-opacity">Aksesuarlar</Link></li>
                <li><Link href="/shop?category=bestseller" className="hover:opacity-60 transition-opacity">Ən Çox Satılanlar</Link></li>
                <li><Link href="/shop?category=new-arrivals" className="hover:opacity-60 transition-opacity">Yeni Gələnlər</Link></li>
              </ul>
            </FooterColumn>

            <FooterColumn title="Məkanlar">
              <ul className="flex flex-col gap-4 text-sm font-light opacity-90 pb-4 md:pb-0">
                <li><span className="block text-white/90">Bakı, Azərbaycan</span></li>
                <li><span className="block text-white/50 text-xs">Mərkəzi Showroom & Çatdırılma</span></li>
                <li><span className="block text-white/50 text-xs">Bütün ölkə üzrə sürətli çatdırılma</span></li>
              </ul>
            </FooterColumn>

            <FooterColumn title="Əlaqə & Dəstək">
              <ul className="flex flex-col gap-4 text-sm font-light opacity-90 pb-4 md:pb-0">
                <li><Link href="tel:+994500000000" className="hover:opacity-60 transition-opacity">+994 (50) 000-00-00</Link></li>
                <li><Link href="mailto:info@tokyostreetapparel.com" className="hover:opacity-60 transition-opacity underline underline-offset-4 decoration-white/30">info@tokyostreetapparel.com</Link></li>
                <li><Link href="/track" className="hover:opacity-60 transition-opacity">Sifarişin İzlənməsi</Link></li>
              </ul>
            </FooterColumn>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] font-light opacity-50 uppercase tracking-widest gap-6 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-center md:text-left">
              <p>© 2026 Tokyo Street Apparel. Bütün hüquqlar qorunur.</p>
              <p className="hidden md:block">|</p>
              <p>Developed by <a href="https://codfy.tech" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity font-bold text-white">Codfy Digital Agency</a></p>
            </div>
            <div className="flex gap-6 md:gap-8">
              <Link href="#" className="hover:opacity-100 transition-opacity">Məxfilik Siyasəti</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity">İstifadə Şərtləri</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
