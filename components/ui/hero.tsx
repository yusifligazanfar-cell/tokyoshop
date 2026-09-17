"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full px-2 md:px-3 pt-0 pb-0 -mt-36 md:-mt-44 z-10">
      <div 
        className="group relative w-full h-[85vh] min-h-[600px] rounded-lg md:rounded-xl overflow-hidden bg-cover bg-center shadow-sm flex items-center justify-center"
        style={{ backgroundImage: 'url("https://cdn.shopify.com/s/files/1/0654/7793/5332/files/Portada-1.gif?v=1753084803")' }}
      >
        {/* Very subtle overlay to ensure readability without being too dark */}
        <div className="absolute inset-0 bg-black/15 transition-colors duration-1000 group-hover:bg-black/25" />
        
        {/* Pure Minimalist Content (Zara / Apple style) */}
        <div className="relative z-10 text-center pointer-events-none mt-12 md:mt-24">
          <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-light tracking-tight text-white leading-[1.1] drop-shadow-sm">
            İnanılmaz rahat.<br/>
            <span className="font-medium text-white/90">Tamamilə təbii.</span>
          </h1>
        </div>
        
      </div>
    </section>
  );
}
