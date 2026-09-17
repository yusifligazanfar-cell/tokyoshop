"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const categories = [
  { label: "YENİ GƏLƏNLƏR", href: "/shop?category=new-arrivals", img: "/local3.webp" },
  { label: "ƏN ÇOX SATILANLAR", href: "/shop?category=bestseller", img: "/local1.webp" },
  { label: "HOODIE", href: "/shop?category=hoodie", img: "/hoodies.webp" },
  { label: "T-ŞÖRT", href: "/shop?category=tshirt", img: "/tees.webp" },
  { label: "AKSESUAR", href: "/shop?category=accessory", img: "/local4.webp" },
  { label: "GEYİM DƏSTİ", href: "/shop?category=outfit", img: "/local5.webp" },
];

export function HorizontalGallery() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Shift based on 6 items
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section ref={targetRef} className="relative h-[550vh] bg-black mt-2 md:mt-4">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Gallery Strip */}
        <motion.div style={{ x }} className="flex gap-2 md:gap-4 px-6 md:px-12 items-center">
          
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={cat.href}
              className="group relative flex-shrink-0 w-[85vw] h-[60vh] md:w-auto md:h-[75vh] md:aspect-square rounded-none overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
            >
              <div 
                className="w-full h-full bg-cover saturate-50 group-hover:saturate-100 bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url("${cat.img}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex justify-between items-end">
                <h3 className="text-3xl md:text-5xl font-bold uppercase text-white tracking-tighter leading-none group-hover:scale-105 origin-bottom-left transition-transform duration-500">
                  {cat.label}
                </h3>
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:-rotate-45">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
          
          <div className="flex-shrink-0 w-[10vw]" /> {/* Spacer at the end */}
        </motion.div>
      </div>
    </section>
  );
}
