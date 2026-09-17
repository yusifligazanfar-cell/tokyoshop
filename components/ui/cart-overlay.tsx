"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart-context";
import { useCurrency } from "@/components/currency-provider";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const { items, updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
        />
      )}

      {isOpen && (
        <motion.div
          key="drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 right-0 bottom-0 z-[210] w-full md:w-[500px] bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col text-white overflow-hidden"
        >
          {/* Cinematic Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10 relative z-10">
            <h2 className="text-5xl font-black tracking-tighter lowercase text-transparent stroke-cart">
              bag.
              <span className="text-lg text-white/50 ml-4 font-sans not-tracking-normal">[{items.length}]</span>
            </h2>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar">
            {items.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                key={item.id} 
                className="group"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex gap-6">
                  {/* Image with Greyscale-to-Color Hover Effect */}
                  <Link href={`/products/${item.id}`} onClick={onClose} className="relative w-28 h-36 rounded-xl overflow-hidden bg-white/5 block shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className={`object-cover transition-all duration-700 ${hoveredId === item.id ? 'scale-110 grayscale-0' : 'scale-100 grayscale'}`} 
                    />
                  </Link>
                  
                  {/* Item Info */}
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/products/${item.id}`} onClick={onClose} className="font-bold text-xl uppercase tracking-widest leading-none hover:opacity-70 transition-opacity">
                          {item.name}
                        </Link>
                        <span className="font-mono text-lg">{formatPrice(item.price)}</span>
                      </div>
                      <p className="text-white/40 text-xs mt-2 uppercase tracking-[0.2em]">{item.color} // {item.size}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm font-mono text-white/50">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-white transition-colors p-2 -ml-2">-</button>
                        <span className="text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-white transition-colors p-2 -mr-2">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-white/30 hover:text-red-500 transition-colors p-2 -mr-2 flex items-center gap-2 text-xs uppercase tracking-widest">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Checkout Area */}
          {items.length > 0 && (
            <div className="p-8 border-t border-white/10 relative z-10 bg-[#0A0A0A]">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/50 uppercase tracking-[0.2em] text-xs">
                  <span>Ara Cəm</span>
                  <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/50 uppercase tracking-[0.2em] text-xs">
                  <span>Çatdırılma</span>
                  <span className="font-mono text-white">Pulsuz</span>
                </div>
                <div className="w-full h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between text-2xl font-black uppercase tracking-widest">
                  <span>Yekun</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Link href="/checkout" onClick={onClose} className="w-full relative overflow-hidden bg-white text-black px-8 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-transform hover:scale-[1.02] flex items-center justify-center group z-10 block text-center">
                <span className="relative z-10">Güvənli Ödəniş</span>
                <ArrowRight className="w-4 h-4 ml-4 relative z-10 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                <div className="absolute inset-0 bg-gray-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {/* Internal CSS for the stroke effect to ensure it loads immediately */}
      <style dangerouslySetInnerHTML={{__html: `
        .stroke-cart {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
      `}} />
    </AnimatePresence>
  );
}
