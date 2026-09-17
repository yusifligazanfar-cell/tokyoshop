import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/ui/hero";
import { HorizontalGallery } from "@/components/ui/horizontal-gallery";
import { Campaign } from "@/components/ui/campaign";
import { ProductCard } from "@/components/product/product-card";
import { FAQ } from "@/components/ui/faq";
import { HoodieAnatomy } from "@/components/product/hoodie-anatomy";

import { getProducts } from "@/app/actions";

export default async function Home() {
  const allProducts = await getProducts();
  const displayProducts = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || p.type,
    price: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
    colors: p.colors || [],
    imageUrl: p.image
  }));


  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Horizontal Gallery Category Section */}
      <HorizontalGallery />

      {/* YENİ GƏLƏNLƏR Section */}
      <section className="pb-10 md:pb-16 px-6 md:px-8 mt-4 md:mt-8">
        <div className="container mx-auto max-w-[1600px]">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase border-b-2 border-black pb-1 inline-block">
              YENİ GƏLƏNLƏR
            </h2>
            <div className="flex space-x-2 md:space-x-3">
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300">
                <span className="sr-only">Əvvəlki</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300">
                <span className="sr-only">Sonrakı</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          
          {/* Scrollable Carousel */}
          <div className="flex overflow-x-auto gap-2 md:gap-3 items-start pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {displayProducts.slice(0, 6).map((product, i) => (
              <div key={i} className="w-[85vw] md:w-[28%] shrink-0 snap-start">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />
        </div>
      </section>

      {/* Modern Media / Bento Editorial Section */}
      <section className="pt-8 md:pt-12 pb-20 md:pb-32 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
            <h2 className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase border-b-2 border-black pb-1 inline-block shrink-0">
              Dizaynla Hərəkət
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-xl font-light text-left md:text-right">
              Materiallarımızı sizinlə birlikdə qüsursuz hərəkət etməsi üçün dizayn etdik, gündəlik rutininizə yeni bir rahatlıq standartı gətiririk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-stretch">
            
            {/* Block 1: Massive Video */}
            <div className="lg:col-span-7 group relative w-full min-h-[500px] lg:min-h-full rounded-3xl overflow-hidden bg-black cursor-pointer">
              {/* Vimeo iframe */}
              <div className="absolute inset-0 w-full h-full scale-[1.3] md:scale-[1.15] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                <iframe 
                  src="https://player.vimeo.com/video/774023793?background=1&autoplay=1&loop=1&byline=0&title=0" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                <span className="inline-block px-4 py-1.5 border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-white/10 mb-4">
                  Film
                </span>
                <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4">Proses</h3>
                <p className="text-base font-light opacity-90 max-w-md mb-6">Təbii elementləri necə misilsiz rahatlığa çevirdiyimizin pərdəarxasına nəzər salın.</p>
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>

            {/* Right Column: Stacked Bento Blocks matching exact image aspect ratio */}
            <div className="lg:col-span-5 flex flex-col gap-5 md:gap-8 justify-between">
              {/* Block 2: Modern Product (Top - Minimalist Studio Gray Background) */}
              <Link href="/shop" className="group relative w-full aspect-square rounded-3xl overflow-hidden bg-[#E8E8E5] cursor-pointer block border border-black/5 shadow-sm p-6 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/muasir-forma-chatgpt.png"
                    alt="Müasir Forma"
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Block 3: Lifestyle (Bottom - Exact 1:1 square ratio of sfpne5.jpg) */}
              <Link href="/shop" className="group relative w-full aspect-square rounded-3xl overflow-hidden bg-[#0A0A0A] cursor-pointer block border border-black/5">
                {/* Image 1: Default (sfpne5.jpg 1:1) */}
                <Image
                  src="/sfpne5.jpg"
                  alt="Hərəkətdə"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
                />
                {/* Image 2: Hover (usjp1n.jpg 1:1) */}
                <Image
                  src="/usjp1n.jpg"
                  alt="Kolleksiyanı Kəşf Et"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white z-10">
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-1">Hərəkətdə</h3>
                  <span className="text-xs font-bold uppercase tracking-widest border-b-2 border-white pb-0.5 inline-block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">Kolleksiyanı Kəşf Et</span>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ƏN ÇOX SATILANLAR Products - Edge to Edge Background */}
      <section className="w-full bg-[#EFECE7] py-20 md:py-28 px-4 md:px-8">
        <div className="container mx-auto max-w-[1600px]">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase border-b-2 border-black pb-1 inline-block">
              ƏN ÇOX SATILANLAR
            </h2>
            <Link 
              href="/shop" 
              className="group flex items-center gap-1.5 text-xs md:text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              <span>Hamısına bax</span>
              <svg 
                width="15" 
                height="15" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 gap-y-12 md:gap-y-16">
            {displayProducts.slice(0, 8).map((product, i) => (
              <ProductCard 
                key={i} 
                {...product} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* World-Class Ultra-Modern Interactive Hoodie Anatomy Section */}
      <HoodieAnatomy />


        {/* Features / Benefits Section */}
        <section className="relative w-full mb-32 z-20">
           {/* Section Background (Image) */}
           <div 
             className="absolute inset-0 bg-cover bg-center overflow-hidden"
             style={{ backgroundImage: 'url("/immage.webp")' }}
           >
             {/* Dark overlay for text readability (Very slight blur) */}
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
           </div>
           
           <div className="relative py-24 md:py-32 flex flex-col items-center justify-center min-h-[60vh] overflow-hidden">
           
           {/* Soft Glowing Ambient Background Orbs */}
           <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-white/10 rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] opacity-60 animate-pulse" />
           <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-white/5 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] opacity-40 animate-pulse delay-700" />
           
           <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
             
             {/* Card 1 */}
             <div className="group relative w-full h-full flex flex-col p-8 md:p-12 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.1)] overflow-hidden">
                {/* Card Internal Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-8 md:mb-12 flex items-center justify-center rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-700 shrink-0">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">Müştəri Rəyləri</h3>
                  <p className="text-white/60 font-light text-base md:text-lg leading-relaxed mt-auto">
                    Minlərlə xoşbəxt müştəri. Bizim üçün ən böyük dəyər sizin güvəninizdir.
                  </p>
                </div>
             </div>

             {/* Card 2 */}
             <div className="group relative w-full h-full flex flex-col p-8 md:p-12 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.1)] overflow-hidden">
                {/* Card Internal Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-8 md:mb-12 flex items-center justify-center rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-700 shrink-0">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">Premium Keyfiyyət</h3>
                  <p className="text-white/60 font-light text-base md:text-lg leading-relaxed mt-auto">
                    Yalnız ən yüksək dərəcəli, uzunömürlü və təbii materiallar.
                  </p>
                </div>
             </div>

             {/* Card 3 */}
             <div className="group relative w-full h-full flex flex-col p-8 md:p-12 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.1)] overflow-hidden">
                {/* Card Internal Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-8 md:mb-12 flex items-center justify-center rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-700 shrink-0">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="4" y="8" rx="2" ry="2"/><path d="M2 13h20"/><path d="M16 8V6a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"/></svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">Sürətli Çatdırılma</h3>
                  <p className="text-white/60 font-light text-base md:text-lg leading-relaxed mt-auto">
                    Sifarişləriniz qapınıza qədər ən qısa zamanda çatdırılır.
                  </p>
                </div>
             </div>

           </div>
           </div>
         </section>

      {/* FAQ Section */}
      

      <FAQ />

      {/* Ultra-Modern Partners Section matching site header style */}
      <section className="py-16 md:py-24 bg-transparent text-black overflow-hidden relative">
        
        {/* Section Header: Consistent with site headings */}
        <div className="container mx-auto max-w-[1600px] px-6 md:px-8 mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase border-b-2 border-black pb-1 inline-block">
            Partnyorlarımız
          </h2>
        </div>

        {/* Clean Vibrant Color Infinite Ribbon */}
        <div className="flex w-full overflow-hidden marquee-mask py-4">
          <div className="flex items-center shrink-0 animate-marquee-fast">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-14 sm:gap-20 md:gap-28 px-7 sm:px-10 md:px-14 items-center shrink-0">
                  
                  {/* CODFY */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/partner-logo-1.png" 
                      alt="CODFY" 
                      className="h-11 sm:h-15 md:h-18 lg:h-20 w-auto object-contain brightness-0 opacity-95 group-hover/brand:opacity-100 transition-all select-none" 
                    />
                  </div>

                  {/* Bolt (Vivid Green) */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/bolt-logo.png" 
                      alt="Bolt" 
                      className="h-12 sm:h-16 md:h-20 lg:h-22 w-auto object-contain opacity-100 transition-all select-none translate-y-0.5" 
                    />
                  </div>

                  {/* Epoint (Vivid Official Gradient/SVG) */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/epoint-logo.svg" 
                      alt="Epoint" 
                      className="h-12 sm:h-16 md:h-20 lg:h-22 w-auto object-contain opacity-100 transition-all select-none translate-y-1" 
                    />
                  </div>

                  {/* ADWAVE */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/partner-logo-2.png" 
                      alt="ADWAVE" 
                      className="h-9 sm:h-13 md:h-15 lg:h-17 w-auto object-contain brightness-0 opacity-95 group-hover/brand:opacity-100 transition-all select-none" 
                    />
                  </div>

                </div>
             ))}
          </div>
          <div className="flex items-center shrink-0 animate-marquee-fast" aria-hidden="true">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-14 sm:gap-20 md:gap-28 px-7 sm:px-10 md:px-14 items-center shrink-0">
                  
                  {/* CODFY */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/partner-logo-1.png" 
                      alt="CODFY" 
                      className="h-11 sm:h-15 md:h-18 lg:h-20 w-auto object-contain brightness-0 opacity-95 group-hover/brand:opacity-100 transition-all select-none" 
                    />
                  </div>

                  {/* Bolt (Vivid Green) */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/bolt-logo.png" 
                      alt="Bolt" 
                      className="h-12 sm:h-16 md:h-20 lg:h-22 w-auto object-contain opacity-100 transition-all select-none translate-y-0.5" 
                    />
                  </div>

                  {/* Epoint (Vivid Official Gradient/SVG) */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/epoint-logo.svg" 
                      alt="Epoint" 
                      className="h-12 sm:h-16 md:h-20 lg:h-22 w-auto object-contain opacity-100 transition-all select-none translate-y-1" 
                    />
                  </div>

                  {/* ADWAVE */}
                  <div className="relative group/brand flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img 
                      src="/partner-logo-2.png" 
                      alt="ADWAVE" 
                      className="h-9 sm:h-13 md:h-15 lg:h-17 w-auto object-contain brightness-0 opacity-95 group-hover/brand:opacity-100 transition-all select-none" 
                    />
                  </div>

                </div>
             ))}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeFast {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
          }
          .animate-marquee-fast {
            animation: marqueeFast 28s linear infinite;
            will-change: transform;
          }
          .marquee-mask:hover .animate-marquee-fast {
            animation-play-state: paused;
          }
          .marquee-mask {
            -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
            mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
          }
        `}} />
      </section>

    </div>
  );
}
