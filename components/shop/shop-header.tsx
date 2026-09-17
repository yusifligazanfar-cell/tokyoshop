"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterPanel } from "./filter-panel";

export function ShopHeader() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Önə çıxanlar");

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-black text-white rounded-full px-4 py-3 md:px-6 md:py-4 w-full relative">
        
        {/* Left Side: Filtrlər Button */}
        <div className="flex items-center">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="group flex items-center space-x-3 text-sm font-bold hover:opacity-70 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-transparent group-hover:bg-white/10 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="uppercase tracking-widest text-xs md:text-sm">
              FILTER <span className="font-normal text-white/50 tracking-normal capitalize ml-1">(13 products)</span>
            </span>
          </button>
        </div>

        {/* Right Side: Önə çıxanlar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center space-x-4 border border-white/20 rounded-full px-6 py-2.5 hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
              {selectedSort}
            </span>
            <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-transform ${isSortOpen ? "rotate-180" : ""}`}>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isSortOpen && (
            <>
              {/* Invisible overlay to close on click outside */}
              <div className="fixed inset-0 z-[90]" onClick={() => setIsSortOpen(false)} />
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-2xl shadow-xl border border-black/10 overflow-hidden z-[100] flex flex-col py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {["Önə çıxanlar", "Yeni Gələnlər", "Qiymət: Ucuzdan Bahaya", "Qiymət: Bahadan Ucuza"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedSort(option);
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-5 py-3 text-xs uppercase tracking-wider hover:bg-black/5 transition-colors ${selectedSort === option ? "font-bold" : "font-medium text-black/70"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
}
