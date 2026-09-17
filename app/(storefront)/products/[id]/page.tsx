"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Star, Truck, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/app/actions";
import { useCart } from "@/components/cart-context";
import { useCurrency } from "@/components/currency-provider";

// Global constants mirroring admin panel
const GLOBAL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GLOBAL_COLORS = [
  { name: 'Black', hex: '#18181b' },
  { name: 'White', hex: '#fbfbfb' },
  { name: 'Charcoal', hex: '#3f3f46' },
  { name: 'Navy', hex: '#1e293b' },
  { name: 'Beige', hex: '#e5e0d8' },
  { name: 'Olive', hex: '#4b5320' },
  { name: 'Red', hex: '#991b1b' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Pink', hex: '#fbcfe8' },
  { name: 'Green', hex: '#166534' },
  { name: 'Yellow', hex: '#ca8a04' },
  { name: 'Purple', hex: '#6b21a8' },
  { name: 'Gray', hex: '#a1a1aa' },
  { name: 'Brown', hex: '#78350f' }
];

// Mock Database for the PDP fallback
const DEFAULT_PRODUCT = {
  id: "default-product",
  name: "Wool Runner Fluffs",
  price: 135,
  description: "The cozy comfort of our classic Wool Runner, now with an ultra-plush, textured upper.",
  colors: ["White", "Black", "Beige"],
  sizes: ["M", "L", "XL"],
  image: "https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_600/v1/production/colorway/en-US/images/6tv96mP23O0B1yTbbD06P9/1",
  images: [
    "https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_600/v1/production/colorway/en-US/images/6tv96mP23O0B1yTbbD06P9/1",
    "https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_600/v1/production/colorway/en-US/images/5L4jU25l6iWv0aY5Yt8z7W/1",
    "https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_600/v1/production/colorway/en-US/images/2Q1aD6s9L7z0bY5k4Z4c8X/1",
    "https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_600/v1/production/colorway/en-US/images/7T8bN5v8K4x1cY9m3V2b5Z/1"
  ]
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  
  const [product, setProduct] = useState<any>(DEFAULT_PRODUCT);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    getProducts().then(all => {
      const found = all.find(p => p.id === resolvedParams.id);
      if (found) {
        setProduct({
          id: found.id,
          name: found.name,
          price: parseFloat(found.price.replace(/[^0-9.]/g, '')) || 0,
          description: found.description || "",
          colors: found.colors || [],
          sizes: found.sizes || [],
          image: found.image,
          images: [found.image, found.image, found.image, found.image]
        });
      }
      setLoading(false);
    });
  }, [resolvedParams.id]);

  
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedSize, setSelectedSize] = useState<string>("M"); 
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    if (!loading) {
      if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
      setActiveImage(0);
    }
  }, [product, loading]);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const [isAdding, setIsAdding] = useState(false);
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      color: selectedColor || "Default",
      size: selectedSize || "OS",
      price: typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : (typeof product.price === 'number' ? product.price : 0),
      quantity: 1,
      image: product.image || (product.images && product.images[0]) || ''
    });

    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-transparent text-black font-sans pb-24 md:pb-0 -mt-24 md:-mt-28">
      
      <main className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row pt-24 md:pt-28">
        
        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col md:px-4 lg:px-12 mb-8 md:mb-0">
          
          {/* Main Large Image */}
          <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden md:rounded-2xl mb-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={`${product.name} view ${activeImage + 1}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Thumbnails Scroll */}
          <div className="flex overflow-x-auto gap-3 md:gap-4 snap-x snap-mandatory hide-scrollbar px-4 md:px-0 py-2">
            {product.images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 md:w-20 aspect-square shrink-0 snap-start rounded-md md:rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                  activeImage === i 
                    ? 'border-black shadow-md scale-105 z-10' 
                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sticky Sidebar Details */}
        <div className="w-full md:w-1/2 lg:w-1/2 px-6 md:px-12 lg:px-16 py-8 md:py-4">
          <motion.div 
            className="md:sticky md:top-28"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            
            {/* Breadcrumbs */}
            <motion.div variants={itemVariants} className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center space-x-2">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-black transition-colors">Mağaza</Link>
              <span>/</span>
              <span className="text-black truncate">{product.name}</span>
            </motion.div>

            {/* Title & Price */}
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70">
              {product.name}
            </motion.h1>
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
              <span className="text-xl md:text-2xl font-bold">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-1 text-black/50 text-[10px] uppercase tracking-widest font-bold bg-gray-100 px-3 py-1 rounded-full">
                <Star className="w-3 h-3 fill-black text-black" />
                <span>4.8 (124)</span>
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm font-medium text-black/60 mb-10 leading-relaxed max-w-md">
              {product.description}
            </motion.p>

            {/* Color Selection */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Color: <span className="text-black/60 ml-1">{selectedColor}</span></h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {(product.colors || []).map((colorName: string) => {
                  const colorObj = GLOBAL_COLORS.find(c => c.name === colorName);
                  const hex = colorObj ? colorObj.hex : '#000000';
                  return (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className="group relative w-12 h-12 rounded-full border border-black/10 focus:outline-none transition-transform hover:scale-110 flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: hex }}
                      title={colorName}
                    >
                      {selectedColor === colorName && (
                        <motion.div 
                          layoutId="colorRing"
                          className="absolute -inset-1.5 rounded-full border border-black"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Ölçü Seç</h3>
                <button onClick={() => setShowSizeGuide(true)} className="text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-black underline underline-offset-4">Ölçü Cədvəli</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(product.sizes || []).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                        selectedSize === size 
                          ? 'bg-black text-white shadow-md shadow-black/20 scale-[1.02] border border-black' 
                          : 'bg-white text-black border border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:scale-[1.02]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
              </div>
            </motion.div>

            {/* Desktop Səbətə Əlavə Et */}
            <motion.div variants={itemVariants}>
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`hidden md:flex w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 items-center justify-center group mb-12 shadow-xl shadow-black/10 ${
                  isAdding ? 'bg-green-600 text-white scale-95' : 'bg-black text-white hover:bg-black/80 hover:scale-[1.02]'
                }`}
              >
                {isAdding ? (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center">
                    <Check className="w-5 h-5 mr-2" strokeWidth={3} />
                    Added to Cart
                  </motion.div>
                ) : (
                  <>
                    Səbətə Əlavə Et — {formatPrice(product.price)}
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                  </>
                )}
              </button>
            </motion.div>

            {/* Accordions */}
            <motion.div variants={itemVariants} className="border-t border-black/10">
              {[
                { id: "details", title: "Məhsul Detalları", content: product.description || "Bu məhsul üçün təsvir əlavə edilməyib." },
                { id: "sustainability", title: "Davamlılıq", content: "Karbon neytral məhsul. Ətraf mühitə təsiri minimuma endirmək üçün bərpa olunan materiallardan hazırlanıb." },
                { id: "shipping", title: "Çatdırılma və Qaytarılma", content: "50 ₼-dən yuxarı sifarişlərdə pulsuz çatdırılma. 30 gün ərzində sualsız pulsuz qaytarma." }
              ].map((section) => (
                <div key={section.id} className="border-b border-black/10">
                  <button 
                    onClick={() => toggleAccordion(section.id)}
                    className="w-full flex justify-between items-center py-5 group"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{section.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeAccordion === section.id ? 'rotate-180' : 'opacity-50 group-hover:opacity-100'}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm text-black/60 font-medium leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-col space-y-4 bg-gray-50 p-6 rounded-2xl">
              <div className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/60">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                  <Truck className="w-4 h-4" strokeWidth={1.5} />
                </div>
                50 ₼-dən yuxarı pulsuz çatdırılma
              </div>
              <div className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/60">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                  <Check className="w-4 h-4" strokeWidth={1.5} />
                </div>
                30 gün ərzində pulsuz qaytarma
              </div>
            </motion.div>

          </motion.div>
        </div>

      </main>

      {/* Mobile Sticky Səbətə Əlavə Et */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-black/10 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-4 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-2 transition-all duration-300 ${
            isAdding ? 'bg-green-600 text-white scale-95' : 'bg-black text-white hover:scale-[1.02]'
          }`}
        >
          {isAdding ? (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center">
              <Check className="w-4 h-4 mr-2" strokeWidth={3} />
              Added to Cart
            </motion.div>
          ) : (
            `Səbətə Əlavə Et — ${formatPrice(product.price)}`
          )}
        </button>
      </div>

      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-widest">Ölçü Cədvəli</h2>
                  <button onClick={() => setShowSizeGuide(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] uppercase tracking-widest text-black/50 border-b border-black/10">
                      <tr>
                        <th className="pb-3 font-bold">Ölçü</th>
                        <th className="pb-3 font-bold">Köks (sm)</th>
                        <th className="pb-3 font-bold">Bel (sm)</th>
                        <th className="pb-3 font-bold">Uzunluq (sm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {[
                        { size: 'XS', chest: '86', waist: '71', length: '68' },
                        { size: 'S', chest: '91', waist: '76', length: '70' },
                        { size: 'M', chest: '96', waist: '81', length: '72' },
                        { size: 'L', chest: '101', waist: '86', length: '74' },
                        { size: 'XL', chest: '106', waist: '91', length: '76' },
                        { size: '2XL', chest: '111', waist: '96', length: '78' },
                        { size: '3XL', chest: '116', waist: '101', length: '80' },
                      ].map(row => (
                        <tr key={row.size}>
                          <td className="py-4 font-bold">{row.size}</td>
                          <td className="py-4 text-black/70">{row.chest}</td>
                          <td className="py-4 text-black/70">{row.waist}</td>
                          <td className="py-4 text-black/70">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
