"use client";

import { useSearchParams } from "next/navigation";
import { Package, Truck, CheckCircle2, Search, ArrowRight, ChevronRight, XCircle, RotateCcw, Box, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders } from "@/app/actions";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [orderId, setOrderId] = useState(initialId);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const performSearch = async (queryId: string) => {
    if (!queryId) return;
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      const allOrders = await getOrders();
      const cleanInput = queryId.trim().toLowerCase().replace("#", "");
      const found = allOrders.find((o: any) => {
        const cleanId = (o.id || "").toLowerCase().replace("#", "");
        return cleanId === cleanInput;
      });
      setOrderData(found || null);
    } catch (err) {
      console.error(err);
      setOrderData(null);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (initialId) {
      performSearch(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderId);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans track-page overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .track-page, .track-page * {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
      `}} />
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <header className="px-6 py-6 flex items-center justify-between z-10 border-b border-white/10">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          TOKYO<span className="text-gray-500 font-normal">/</span>TRK
        </Link>
        <Link href="/shop" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
          MAĞAZA <ChevronRight className="w-4 h-4" />
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 sm:p-12 z-10 w-full max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-12 text-center"
        >
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-4">GÖNDƏRİŞ</h1>
          <p className="text-gray-400 uppercase tracking-widest text-sm">Sifarişinizi izləmək üçün nömrəni daxil edin</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch} 
          className="w-full max-w-2xl flex relative mb-16"
        >
          <div className="relative w-full flex bg-[#111] border border-white/20 hover:border-white/50 transition-colors p-2 group">
            <Search className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="SIFARİŞ NÖMRƏSİ (MƏS: 1728)..."
              className="w-full pl-16 pr-32 py-5 bg-transparent focus:outline-none text-xl font-bold text-white placeholder:text-gray-600 uppercase tracking-widest"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 px-8 bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSearching ? "..." : "İZLƏ"}
            </button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {hasSearched && !isSearching && !orderData && (
            <motion.div 
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl p-12 bg-[#111] border border-red-500/50 text-center"
            >
              <h3 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-widest">SİFARİŞ TAPILMADI</h3>
              <p className="text-gray-400 font-mono">"{orderId}" NÖMRƏLİ SİFARİŞ BAZADA YOXDUR.</p>
            </motion.div>
          )}

          {hasSearched && !isSearching && orderData && (
            <motion.div 
              key="found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full grid lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Technical Details */}
              <div className="lg:col-span-1 bg-[#111] p-8 border border-white/10 flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <Box className="w-8 h-8 text-white" />
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-mono uppercase">Çatdırılma Statusu</p>
                      <p className="text-sm font-bold text-green-400 uppercase tracking-widest mt-1">
                        {orderData.fulfillment}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] text-gray-500 font-mono uppercase border-b border-white/10 pb-1.5 mb-1.5">SIFARİŞ ID</p>
                      <p className="text-2xl font-black tracking-tighter text-white">{orderData.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-mono uppercase border-b border-white/10 pb-1.5 mb-1.5">ÖDƏNİŞ / MƏBLƏĞ</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 font-bold uppercase rounded">{orderData.payment || "Ödənilib"}</span>
                        <span className="font-mono font-bold text-white text-base">{orderData.total}</span>
                      </div>
                    </div>
                    {orderData.products && orderData.products.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-500 font-mono uppercase border-b border-white/10 pb-1.5 mb-1.5">MƏHSULLAR</p>
                        <div className="space-y-1 mt-1">
                          {orderData.products.map((p: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-xs text-gray-300">
                              <span className="line-clamp-1">{p.name} × {p.qty}</span>
                              <span className="font-mono text-gray-400 shrink-0 ml-2">{p.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-gray-500 font-mono uppercase border-b border-white/10 pb-1.5 mb-1.5">MÜŞTƏRİ VƏ ÜNVAN</p>
                      <p className="text-xs text-white font-bold">{orderData.customer}</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">{orderData.address || "Qeyd edilməyib"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <Link href="/shop" className="text-xs text-gray-400 font-mono hover:text-white transition-colors flex justify-between items-center group">
                    YENİ ALIŞ-VERİŞ ET
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Brutalist Timeline */}
              <div className="lg:col-span-2 bg-[#111] p-8 sm:p-12 border border-white/10">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-10">Tarixçə // İz</h2>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/10">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 1.5, ease: "anticipate" }}
                      className="w-full bg-white" 
                    />
                  </div>

                  <div className="space-y-12 relative">
                    {orderData.timeline.map((event: any, idx: number) => {
                      let IconComponent = CheckCircle2;
                      let iconColor = "text-white";
                      
                      if (event.icon === 'cart') IconComponent = Package;
                      if (event.icon === 'payment') IconComponent = CheckCircle2;
                      if (event.icon === 'truck') IconComponent = Truck;
                      if (event.icon === 'package') IconComponent = Package;
                      if (event.icon === 'clock') {
                         if (event.title.includes("Ləğv") || event.title.includes("Qaytar")) {
                            iconColor = "text-red-500";
                            IconComponent = event.title.includes("Ləğv") ? XCircle : RotateCcw;
                         }
                      }

                      let customerTitle = event.title;
                      let customerDesc = event.desc;

                      if (event.title === "Hazırlanır") {
                        customerDesc = "Sifariş paketlənir və terminala göndərilmək üçün hazırlanır.";
                      } else if (event.title === "Kuryerə təhvil verildi") {
                        customerDesc = "Bağlama kuryer mərkəzindən çıxış etdi.";
                      } else if (event.title === "Poçta təhvil verildi") {
                        customerDesc = "Bağlama dövlət poçt şöbəsinə qəbul olundu.";
                      } else if (event.title === "Dəyişmə") {
                        customerTitle = "Dəyişmə protokolu";
                        customerDesc = "Məhsulun dəyişdirilməsi tələbi sistemə daxil edildi.";
                      } else if (event.title === "Qaytarılma") {
                        customerDesc = "Sifariş qaytarıldı, tranzaksiya ləğv olundu.";
                      } else if (event.title === "Ləğv edildi") {
                        customerDesc = "Sifariş inzibatçı və ya müştəri tərəfindən ləğv edildi.";
                      } else if (event.title === "Sifariş yaradıldı") {
                        customerDesc = "Sifariş bazaya uğurla daxil edildi.";
                      } else if (event.title === "Ödəniş qəbul edildi") {
                        customerDesc = "Ödəniş təsdiqləndi.";
                      }

                      const isLast = idx === orderData.timeline.length - 1;

                      return (
                        <div key={idx} className={`flex gap-8 relative ${isLast ? "opacity-100" : "opacity-50 hover:opacity-100 transition-opacity"}`}>
                          <div className={`relative z-10 w-8 h-8 bg-[#111] border-2 ${isLast ? "border-white" : "border-white/20"} ${iconColor} flex items-center justify-center shrink-0 mt-1`}>
                            {isLast ? <span className="w-2 h-2 bg-white" /> : <span className="w-1.5 h-1.5 bg-gray-500" />}
                          </div>
                          <div>
                            <h3 className={`font-black text-xl tracking-tight uppercase ${iconColor}`}>{customerTitle}</h3>
                            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-mono leading-relaxed max-w-md">{customerDesc}</p>
                            
                            {/* Technical Timestamp Mock */}
                            <p className="text-[10px] text-gray-600 font-mono mt-3 uppercase">SYS_LOG: {new Date().getTime()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
