"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/currency-provider";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  colors?: string[];
}

export function ProductCard({ id, name, price, imageUrl, description, colors }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <div className="h-full">
      <Link href={`/products/${id}`} className="group flex flex-col h-full cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
        
        {/* Top Image Area */}
        <div className="relative aspect-[4/5] w-full bg-gray-50 overflow-hidden">
          
          {/* Badge */}
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            Yeni
          </div>

          {/* Product Image */}
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: imageUrl ? `url(${imageUrl})` : 'url("https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1200/v1/production/colorway/en-US/images/6tv96mP23O0B1yTbbD06P9/1")' 
            }}
          />
        </div>

        {/* Text Info (Title & Colors Left, Price Right) */}
        <div className="flex justify-between items-end p-4 md:p-6 pt-2 md:pt-4 text-black bg-white mt-auto">
          
          <div className="flex flex-col pr-4">
            <h3 className="text-[10px] md:text-sm font-bold tracking-wider mb-0.5 md:mb-1">
              {name}
            </h3>
            <p className="text-[9px] md:text-xs text-black/60 font-medium mb-2">
              {description || "Essential Item"}
            </p>
            {/* Color Swatches Bottom Left */}
            {(colors && colors.length > 0) && (
              <div className="flex gap-1.5 items-center mt-1">
                {colors.slice(0, 3).map((hex, idx) => (
                  <div key={idx} className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: hex }} />
                ))}
                {colors.length > 3 && <span className="text-[9px] text-gray-400 font-bold">+{colors.length - 3}</span>}
              </div>
            )}
          </div>
          
          {/* Prices Bottom Right */}
          <div className="flex flex-col items-end text-[10px] md:text-xs font-bold leading-tight pb-0.5 whitespace-nowrap">
            <span>
              {formatPrice(price)}
            </span>
          </div>
        </div>

      </Link>
    </div>
  );
}
