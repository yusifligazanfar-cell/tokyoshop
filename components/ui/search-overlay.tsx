"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, PackageX } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/components/currency-provider";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockDatabase = [
  { id: "1", name: "Heavyweight Hoodie", price: 120, image: "bg-[#57524F]" },
  { id: "2", name: "Oversized Tee", price: 65, image: "bg-[#7D8D82]" },
  { id: "3", name: "Cargo Trousers", price: 140, image: "bg-[#5C7C8A]" },
  { id: "4", name: "Wool Runners", price: 110, image: "bg-[#EAEAEA]" },
  { id: "5", name: "Tree Dashers", price: 135, image: "bg-[#F5F5DC]" },
  { id: "6", name: "Slip-ons", price: 95, image: "bg-[#D3D3D3]" },
  { id: "7", name: "Everyday Sneakers", price: 120, image: "bg-[#E6E6FA]" },
  { id: "8", name: "Premium Flats", price: 100, image: "bg-[#F0FFF0]" },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400); // Wait for animation
    } else {
      setQuery(""); // Clear query on close
    }
  }, [isOpen]);

  const popularSearches = ["Wool Runners", "Tree Dashers", "Slip-ons", "Corablar", "Men's Sale"];

  // Filtrlər products based on query
  const filteredProducts = mockDatabase.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-2xl flex flex-col items-center pt-24 md:pt-40 px-6 md:px-12 text-black overflow-y-auto pb-24"
        >
          {/* Subtle Grid Pattern Overlay */}
          <div 
            className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23000' stroke-width='1' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Bağla Button */}
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 p-4 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors group z-[210]"
          >
            <X className="w-8 h-8 text-black/40 group-hover:text-black group-hover:rotate-90 transition-all duration-300" strokeWidth={1} />
          </button>

          {/* Massive Search Input */}
          <div className="w-full max-w-5xl relative z-10 flex flex-col items-center mt-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative flex items-center justify-center"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="axtar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter outline-none placeholder:text-black/10 text-black"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute right-0 p-4 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />
                </button>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-px bg-black/10 mt-8 mb-12 origin-center"
            />

            {/* Search Suggestions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-8">
                Popular Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl">
                {popularSearches.map((item, i) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (i * 0.05), duration: 0.3 }}
                    whileHover={{ scale: 1.05, backgroundColor: "#000", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuery(item)}
                    className="px-6 py-3 rounded-full border border-black/10 text-xs md:text-sm font-bold tracking-widest uppercase transition-colors"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quick Results */}
            <AnimatePresence>
              {query.length >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-16 overflow-hidden"
                >
                  <div className="flex justify-between items-end mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">
                      Nəticələr: <span className="text-black">"{query}"</span>
                    </h3>
                    {filteredProducts.length > 0 && (
                      <Link href={`/shop?search=${query}`} onClick={onClose} className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center group border-b border-black/20 pb-1 hover:border-black transition-colors">
                        Hamısına bax ({filteredProducts.length})
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-2 transition-transform" strokeWidth={2} />
                      </Link>
                    )}
                  </div>
                  
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {filteredProducts.slice(0, 4).map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} onClick={onClose} className="group cursor-pointer">
                          <div className={`aspect-[4/5] ${product.image} rounded-2xl mb-4 overflow-hidden relative`}>
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                          </div>
                          <h4 className="text-sm font-bold truncate group-hover:underline underline-offset-4">{product.name}</h4>
                          <p className="text-xs text-black/50 mt-1 font-medium">{formatPrice(product.price)}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-black/40">
                      <PackageX className="w-12 h-12 mb-4 opacity-50" strokeWidth={1} />
                      <p className="text-sm font-bold uppercase tracking-widest">Məhsul tapılmadı</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
