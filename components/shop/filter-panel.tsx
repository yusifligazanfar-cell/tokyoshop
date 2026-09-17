"use client";

import { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Size', 'Color', 'Price', 'Product Type', 'Material']);

  const sizes = ["S", "M", "L", "XL", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "15"];
  const colors = [
    { name: "Black", code: "#000000" },
    { name: "Grey", code: "#808080" },
    { name: "White", code: "#FFFFFF", border: true },
    { name: "Beige", code: "#F5F5DC", border: true },
    { name: "Red", code: "#FF0000" },
    { name: "Yellow", code: "#FFFF00" },
    { name: "Green", code: "#008000" },
    { name: "Blue", code: "#0000FF" },
  ];
  const prices = ["Under $75", "$76 - $100", "$101 - $125", "$126 - $150", "Over $150"];
  const productTypes = ["Everyday Sneakers", "Flats", "Running Shoes", "Slip Ons", "Slippers", "Corablar"];
  const materials = ["Alternative-Leather", "Canvas", "Cotton", "Sugar", "Tree"];

  const toggleItem = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  // Calculate total selected
  const totalSelected = selectedSizes.length + selectedColors.length + selectedPrices.length + selectedTypes.length + selectedMaterials.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop + Centering Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 pt-20 md:p-8 md:pt-24"
            onClick={onClose}
          >
            {/* Popup Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl h-[75vh] md:h-[80vh] bg-white text-black flex flex-col shadow-2xl overflow-hidden rounded-[2rem] relative mt-4"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Modern Pattern Background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23000' stroke-width='1' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

            {/* Header */}
            <div className="relative flex justify-between items-center px-8 py-8 border-b border-black/5 bg-white/50 backdrop-blur-md">
              <button onClick={onClose} className="flex items-center space-x-3 group hover:opacity-70 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                  <X className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                  Filtrləri Bağla
                </h2>
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 bg-black/5 px-3 py-1 rounded-full">
                13 Products
              </span>
            </div>

            {/* Scrollable Content */}
            <div className="relative flex-1 overflow-y-auto hide-scrollbar p-2">
              
              {/* SIZE */}
              <div className="border-b border-black/10">
                <button 
                  onClick={() => toggleItem('Size', expandedSections, setExpandedSections)}
                  className="w-full flex justify-between items-center p-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                >
                  Size
                  <div className={`transition-transform duration-300 ${expandedSections.includes('Size') ? 'rotate-180' : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('Size') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-xs text-black/70 mb-6 leading-relaxed">
                          Most of our shoes only come in full sizes. If you&apos;re a half size, select your nearest whole size too.
                        </p>
                        <div className="grid grid-cols-4 gap-2 md:gap-3">
                          {sizes.map((size) => (
                            <button 
                              key={size}
                              onClick={() => toggleItem(size, selectedSizes, setSelectedSizes)}
                              className={`w-full aspect-square md:h-12 border flex items-center justify-center text-[11px] md:text-xs font-medium transition-colors ${
                                selectedSizes.includes(size)
                                  ? "border-black bg-black text-white"
                                  : "border-black/20 hover:border-black/50 bg-transparent text-black"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* COLOR */}
              <div className="border-b border-black/10">
                <button 
                  onClick={() => toggleItem('Color', expandedSections, setExpandedSections)}
                  className="w-full flex justify-between items-center p-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                >
                  Color
                  <div className={`transition-transform duration-300 ${expandedSections.includes('Color') ? 'rotate-180' : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('Color') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="grid grid-cols-4 gap-4">
                          {colors.map((color) => (
                            <button 
                              key={color.name}
                              onClick={() => toggleItem(color.name, selectedColors, setSelectedColors)}
                              className="flex flex-col items-center space-y-2 group cursor-pointer bg-transparent border-none p-0"
                            >
                              <div className={`relative flex items-center justify-center w-9 h-9 rounded-full ${
                                selectedColors.includes(color.name) ? 'ring-2 ring-black ring-offset-2' : ''
                              } transition-all`}>
                                <div 
                                  className={`w-8 h-8 rounded-full ${color.border ? 'border border-black/20' : ''} group-hover:scale-110 transition-transform`}
                                  style={{ backgroundColor: color.code }}
                                />
                              </div>
                              <span className={`text-[10px] text-center ${selectedColors.includes(color.name) ? 'text-black font-bold' : 'text-black/70'}`}>
                                {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PRICE */}
              <div className="border-b border-black/10">
                <button 
                  onClick={() => toggleItem('Price', expandedSections, setExpandedSections)}
                  className="w-full flex justify-between items-center p-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                >
                  Price
                  <div className={`transition-transform duration-300 ${expandedSections.includes('Price') ? 'rotate-180' : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('Price') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="space-y-3">
                          {prices.map((price) => (
                            <label key={price} className="flex items-center space-x-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleItem(price, selectedPrices, setSelectedPrices); }}>
                              <div className="w-5 h-5 border border-black/20 group-hover:border-black/50 transition-colors flex items-center justify-center">
                                <div className={`w-3 h-3 bg-black transition-transform ${selectedPrices.includes(price) ? 'scale-100' : 'scale-0 group-active:scale-100'}`} />
                              </div>
                              <span className={`text-sm ${selectedPrices.includes(price) ? 'font-bold' : ''}`}>{price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PRODUCT TYPE */}
              <div className="border-b border-black/10">
                <button 
                  onClick={() => toggleItem('Product Type', expandedSections, setExpandedSections)}
                  className="w-full flex justify-between items-center p-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                >
                  Product Type
                  <div className={`transition-transform duration-300 ${expandedSections.includes('Product Type') ? 'rotate-180' : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('Product Type') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="space-y-3">
                          {productTypes.map((type) => (
                            <label key={type} className="flex items-center space-x-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleItem(type, selectedTypes, setSelectedTypes); }}>
                              <div className="w-5 h-5 border border-black/20 group-hover:border-black/50 transition-colors flex items-center justify-center">
                                <div className={`w-3 h-3 bg-black transition-transform ${selectedTypes.includes(type) ? 'scale-100' : 'scale-0 group-active:scale-100'}`} />
                              </div>
                              <span className={`text-sm ${selectedTypes.includes(type) ? 'font-bold' : ''}`}>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MATERIAL */}
              <div className="pb-24">
                <button 
                  onClick={() => toggleItem('Material', expandedSections, setExpandedSections)}
                  className="w-full flex justify-between items-center p-6 text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                >
                  Material
                  <div className={`transition-transform duration-300 ${expandedSections.includes('Material') ? 'rotate-180' : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('Material') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="space-y-3">
                          {materials.map((mat) => (
                            <label key={mat} className="flex items-center space-x-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleItem(mat, selectedMaterials, setSelectedMaterials); }}>
                              <div className="w-5 h-5 border border-black/20 group-hover:border-black/50 transition-colors flex items-center justify-center">
                                <div className={`w-3 h-3 bg-black transition-transform ${selectedMaterials.includes(mat) ? 'scale-100' : 'scale-0 group-active:scale-100'}`} />
                              </div>
                              <span className={`text-sm ${selectedMaterials.includes(mat) ? 'font-bold' : ''}`}>{mat}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="absolute bottom-0 w-full p-6 bg-white border-t border-black/10">
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setSelectedPrices([]);
                    setSelectedTypes([]);
                    setSelectedMaterials([]);
                  }}
                  className="flex-1 py-4 border border-black text-black text-xs uppercase tracking-widest font-bold hover:bg-black/5 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-black/80 transition-colors"
                >
                  View Results {totalSelected > 0 ? `(${totalSelected})` : ""}
                </button>
              </div>
            </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
