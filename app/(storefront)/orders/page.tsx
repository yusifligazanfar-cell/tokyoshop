"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  MapPin, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  CreditCard,
  QrCode,
  ExternalLink,
  ArrowUpRight,
  FileText,
  Printer,
  X,
  Receipt,
  Scissors,
  Download,
  RotateCcw,
  RefreshCw
} from "lucide-react";
import { getOrders } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [tornOrders, setTornOrders] = useState<Record<string, boolean>>({});
  const [printProgress, setPrintProgress] = useState<Record<string, number>>({});
  const [isPrinting, setIsPrinting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getOrders().then(data => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  const startPrintingSimulation = (id: string) => {
    setIsPrinting(prev => ({ ...prev, [id]: true }));
    setPrintProgress(prev => ({ ...prev, [id]: 0 }));
    setTornOrders(prev => ({ ...prev, [id]: false }));

    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsPrinting(prev => ({ ...prev, [id]: false }));
      }
      setPrintProgress(prev => ({ ...prev, [id]: current }));
    }, 80); // ~2.0 seconds full realistic rolling print
  };

  const toggleInvoice = (id: string) => {
    if (activeInvoiceId === id) {
      setActiveInvoiceId(null);
    } else {
      setActiveInvoiceId(id);
      startPrintingSimulation(id);
    }
  };

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTearReceipt = (id: string) => {
    setTornOrders(prev => ({ ...prev, [id]: true }));
  };

  const downloadReceiptImage = (order: any) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 600;
    const height = 960;
    const scale = 2; // 2x High-Res Retina PNG

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    const logoImg = new Image();
    logoImg.src = "/logo-black-cleaned.png";
    logoImg.onload = () => {
      renderReceipt(logoImg);
    };
    logoImg.onerror = () => {
      renderReceipt(null);
    };

    const renderReceipt = (img: HTMLImageElement | null) => {
      // Pure White Receipt Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      // Top Comfortable Spacing & Big Luxury Brand Logo
      if (img) {
        const logoW = 260;
        const logoH = 74;
        ctx.drawImage(img, width / 2 - logoW / 2, 50, logoW, logoH);
      } else {
        ctx.fillStyle = "#111111";
        ctx.textAlign = "center";
        ctx.font = "900 36px monospace";
        ctx.fillText("TOKYO STORE", width / 2, 90);
      }

      ctx.textAlign = "center";
      ctx.font = "700 11px monospace";
      ctx.fillStyle = "#555555";
      ctx.fillText("••• ELEKTRON ALIŞ-VERİŞ QƏBZİ •••", width / 2, 145);

      ctx.font = "500 11px monospace";
      ctx.fillStyle = "#666666";
      ctx.fillText("TOKYO STORE AZERBAIJAN • BAKU, NIZAMI 12", width / 2, 168);
      ctx.fillText("VÖEN: 2907368582 • TEL: +994 50 123 45 67", width / 2, 186);

      // Verified Badge
      ctx.fillStyle = "#E6F4EA";
      ctx.fillRect(width / 2 - 120, 205, 240, 28);
      ctx.fillStyle = "#137333";
      ctx.font = "bold 11px monospace";
      ctx.fillText("✓ ÖDƏNİLDİ // VERIFIED RECEIPT", width / 2, 223);

      const drawDashed = (y: number) => {
        ctx.beginPath();
        ctx.setLineDash([5, 4]);
        ctx.moveTo(35, y);
        ctx.lineTo(width - 35, y);
        ctx.strokeStyle = "#DDDDDD";
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawDashed(255);

      // Metadata Grid
      ctx.textAlign = "left";
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#888888";
      ctx.fillText("QƏBZ №", 40, 280);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#111111";
      ctx.fillText(`INV-${order.id?.replace('#', '') || '1728'}`, 40, 300);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#888888";
      ctx.fillText("TARİX // SAAT", 40, 326);
      ctx.font = "600 11px monospace";
      ctx.fillStyle = "#333333";
      ctx.fillText(order.date || "2026-08-26 23:20:29", 40, 344);

      ctx.textAlign = "right";
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#888888";
      ctx.fillText("MÜŞTƏRİ", width - 40, 280);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#111111";
      ctx.fillText((order.customer || "").toUpperCase(), width - 40, 300);

      ctx.font = "500 11px monospace";
      ctx.fillStyle = "#666666";
      ctx.fillText(order.email || "", width - 40, 326);
      if (order.phone) ctx.fillText(order.phone, width - 40, 344);

      drawDashed(365);

      if (order.address) {
        ctx.textAlign = "left";
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "#888888";
        ctx.fillText("ÇATDIRILMA ÜNVANI:", 40, 390);
        ctx.font = "600 11px monospace";
        ctx.fillStyle = "#333333";
        ctx.fillText(order.address, 40, 408);
        drawDashed(430);
      }

      let currentY = order.address ? 455 : 395;

      // Table Header
      ctx.textAlign = "left";
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#777777";
      ctx.fillText("MƏHSUL", 40, currentY);
      ctx.textAlign = "center";
      ctx.fillText("SAY", width / 2 + 50, currentY);
      ctx.textAlign = "right";
      ctx.fillText("MƏBLƏĞ", width - 40, currentY);

      currentY += 14;
      ctx.beginPath();
      ctx.moveTo(40, currentY);
      ctx.lineTo(width - 40, currentY);
      ctx.strokeStyle = "#EEEEEE";
      ctx.stroke();

      currentY += 24;

      const prods = order.products && order.products.length > 0 ? order.products : [{ name: "THIS IS AZERBAIJAN STYLE", qty: 1, price: order.total || "37.00 ₼" }];

      prods.forEach((p: any) => {
        ctx.textAlign = "left";
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = "#111111";
        ctx.fillText((p.name || "").toUpperCase().slice(0, 30), 40, currentY);

        ctx.textAlign = "center";
        ctx.font = "600 13px monospace";
        ctx.fillText(`${p.qty || 1}x`, width / 2 + 50, currentY);

        ctx.textAlign = "right";
        ctx.font = "bold 13px monospace";
        ctx.fillText(p.price || order.total, width - 40, currentY);

        currentY += 32;
      });

      drawDashed(currentY);
      currentY += 24;

      // Calculations
      ctx.textAlign = "left";
      ctx.font = "600 12px monospace";
      ctx.fillStyle = "#555555";
      ctx.fillText("ARA CƏMİ:", 40, currentY);
      ctx.textAlign = "right";
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#111111";
      ctx.fillText(order.subtotal || order.total, width - 40, currentY);

      currentY += 22;
      ctx.textAlign = "left";
      ctx.fillStyle = "#555555";
      ctx.fillText("ÇATDIRILMA:", 40, currentY);
      ctx.textAlign = "right";
      ctx.font = "bold 13px monospace";
      const isFree = order.shipping === "0.00 ₼ (PULSUZ)" || order.shipping === "0.00 ₼" || !order.shipping;
      ctx.fillStyle = isFree ? "#137333" : "#111111";
      ctx.fillText(order.shipping || "0.00 ₼ (PULSUZ)", width - 40, currentY);

      currentY += 22;
      ctx.textAlign = "left";
      ctx.fillStyle = "#555555";
      ctx.fillText("ÖDƏNİŞ METODU:", 40, currentY);
      ctx.textAlign = "right";
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#111111";
      ctx.fillText("EPOINT / KART", width - 40, currentY);

      currentY += 24;
      drawDashed(currentY);
      currentY += 28;

      // Grand Total
      ctx.textAlign = "left";
      ctx.font = "900 16px monospace";
      ctx.fillStyle = "#000000";
      ctx.fillText("YEKUN ÖDƏNİŞ:", 40, currentY);
      ctx.textAlign = "right";
      ctx.font = "900 22px monospace";
      ctx.fillText(order.total, width - 40, currentY);

      currentY += 38;
      drawDashed(currentY);
      currentY += 28;

      // Barcode
      ctx.fillStyle = "#000000";
      const barcodePattern = [2,1,4,1,2,5,1,2,4,1,3,1,2,4,1,2,5,1,2,3,1,4,2,1,3,2,4,1,2,5,1,3,2,4];
      let barX = 40;
      barcodePattern.forEach((w) => {
        ctx.fillRect(barX, currentY, w * 1.9, 30);
        barX += w * 1.9 + 2.5;
      });

      currentY += 46;
      ctx.textAlign = "left";
      ctx.font = "600 9px monospace";
      ctx.fillStyle = "#888888";
      ctx.fillText(`AUTH-${order.id?.replace('#', '') || '1728'}-EPOINT-AZ`, 40, currentY);

      ctx.textAlign = "right";
      ctx.fillText("✓ ELEKTRON İMZA İLƏ TƏSDİQLƏNDİ", width - 40, currentY);

      // Instant Direct File Download
      const link = document.createElement("a");
      link.download = `tokyo-qebz-${(order.id || 'order').replace('#', '')}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || (
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (activeFilter === "processing") {
      return order.fulfillment === "Hazırlanır" || order.fulfillment === "İcra olunmayıb";
    }
    if (activeFilter === "delivered") {
      return order.fulfillment === "Çatdırıldı" || order.fulfillment === "İcra olunub";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#EFECE7] text-[#111111] pb-24 font-sans selection:bg-black selection:text-white -mt-10 md:-mt-14">
      
      {/* Top Header Section — Ultra Compact */}
      <section className="pt-2 md:pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2.5 border-b border-black/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              Sifarişlərim
            </h1>
            <p className="text-black/60 text-xs mt-0.5 max-w-lg font-medium leading-relaxed">
              Ödənişi tamamlanmış bütün sifarişlərinizin çatdırılma statusunu və rəsmi qəbzlərini buradan izləyin.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link 
              href="/track"
              className="px-3.5 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-xs border border-black/10 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Sifariş İzlə
            </Link>
            <Link 
              href="/shop"
              className="px-3.5 py-2 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-black/85 transition-all flex items-center gap-1.5"
            >
              Mağazaya Keç <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 mb-3.5">
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sifariş №, ad və ya telefon ilə axtar..."
              className="w-full bg-white border border-black/10 rounded-2xl pl-10 pr-3.5 py-2 text-xs sm:text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "Bütün Sifarişlər" },
              { id: "processing", label: "Hazırlanır" },
              { id: "delivered", label: "Çatdırılanlar" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeFilter === tab.id 
                    ? "bg-black text-white shadow-xs" 
                    : "bg-white text-black/70 hover:text-black hover:bg-white border border-black/10 shadow-xs"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Feed */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-2" />
            <p className="text-black/40 text-[10px] font-mono uppercase tracking-widest font-bold">Yüklənir...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-10 text-center max-w-lg mx-auto border border-black/10 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EFECE7] flex items-center justify-center mx-auto mb-2.5 border border-black/5">
              <Package className="w-6 h-6 text-black/40" />
            </div>
            <h3 className="text-base font-black tracking-tight uppercase mb-1">Sifariş Tapılmadı</h3>
            <p className="text-black/60 text-xs mb-4 leading-relaxed">
              Daxil etdiyiniz parametrlərə uyğun sifariş mövcud deyil və ya hələ ki heç bir alış-veriş edilməyib.
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-black/85 transition-all"
            >
              Alış-Verişə Başla
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => {
              const isDelivered = order.fulfillment === "Çatdırıldı" || order.fulfillment === "İcra olunub";
              const isPaid = order.payment === "Ödənilib";
              const isInvoiceOpen = activeInvoiceId === order.id;
              const isTorn = !!tornOrders[order.id];
              const progress = printProgress[order.id] ?? 100;
              const printing = !!isPrinting[order.id];

              return (
                <motion.div 
                  key={order.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Modern Order Header */}
                  <div className="px-4 sm:px-5 py-3 bg-[#F9F8F6] border-b border-black/10 flex flex-wrap items-center justify-between gap-2.5">
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold block">SİFARİŞ NÖMRƏSİ</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-base sm:text-lg font-black font-mono tracking-tight text-black">{order.id}</span>
                          <button 
                            onClick={(e) => handleCopy(order.id, e)}
                            className="p-1 hover:bg-black/5 rounded-md text-black/40 hover:text-black transition-colors"
                            title="Nömrəni Kopyala"
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="hidden sm:block border-l border-black/10 pl-5">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold block">SİFARİŞ TARİXİ</span>
                        <span className="text-xs text-black/80 font-medium">{order.date}</span>
                      </div>

                      <div className="hidden md:block border-l border-black/10 pl-5">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold block">ÖDƏNİŞ</span>
                        <span className="text-xs font-semibold text-black uppercase">
                          Epoint / Kart
                        </span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isPaid ? "bg-emerald-50 text-emerald-800 border border-emerald-300" : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}>
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {order.payment || "Ödənilib"}
                      </span>
                      
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-black text-white">
                        <Truck className="w-3 h-3 text-white" />
                        {order.fulfillment || "Hazırlanır"}
                      </span>
                    </div>

                  </div>

                  {/* 3-Step Live Progress Tracker */}
                  <div className="px-4 sm:px-5 py-3 border-b border-black/5 bg-white">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-full flex items-center mb-1">
                          <div className="w-full h-1.5 bg-black rounded-full" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black">
                          1. Ödəniş Alındı
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-full flex items-center mb-1">
                          <div className={`w-full h-1.5 rounded-full ${order.fulfillment !== "Ləğv edildi" ? "bg-black" : "bg-black/10"}`} />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black">
                          2. Hazırlanır
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-full flex items-center mb-1">
                          <div className={`w-full h-1.5 rounded-full ${isDelivered ? "bg-black" : "bg-black/10"}`} />
                        </div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDelivered ? "text-black" : "text-black/30"}`}>
                          3. Çatdırılma
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content Grid */}
                  <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      
                      {/* Products Gallery */}
                      <div className="lg:col-span-7 space-y-2.5">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-black/40 block mb-0.5">
                          MƏHSULLAR ({order.products?.length || order.items || 1} ƏDƏD)
                        </span>

                        {order.products && order.products.length > 0 ? (
                          order.products.map((prod: any, pIdx: number) => (
                            <div key={pIdx} className="flex items-center gap-3.5 bg-[#F9F8F6] p-3 rounded-xl border border-black/5 hover:border-black/15 transition-all">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-black/10 relative">
                                {prod.image ? (
                                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-black/30">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base font-black text-black tracking-tight uppercase truncate">{prod.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-black/60 font-medium">
                                  <span>Miqdar: <strong className="text-black font-bold">{prod.qty} ədəd</strong></span>
                                  <span>•</span>
                                  <span className="font-mono font-black text-black text-sm">{prod.price}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-black/60 font-medium">{order.items || 1} ədəd məhsul</div>
                        )}
                      </div>

                      {/* Right Meta & Actions */}
                      <div className="lg:col-span-5 bg-[#F9F8F6] p-4 rounded-xl border border-black/10 flex flex-col justify-between space-y-3">
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-black/10">
                            <span className="text-black/50 uppercase font-mono font-bold">Müştəri</span>
                            <span className="font-bold text-black text-sm">{order.customer}</span>
                          </div>

                          <div className="flex justify-between items-center pb-2 border-b border-black/10">
                            <span className="text-black/50 uppercase font-mono font-bold">E-poçt</span>
                            <span className="font-mono text-black font-semibold truncate max-w-[200px]">{order.email}</span>
                          </div>
                          
                          <div className="flex justify-between items-baseline pb-2 border-b border-black/10">
                            <span className="text-black/50 uppercase font-mono font-bold">Cəmi Məbləğ</span>
                            <span className="font-mono font-black text-xl text-black">{order.total}</span>
                          </div>

                          {order.address && (
                            <div className="pt-0.5">
                              <span className="text-black/50 uppercase font-mono font-bold block mb-0.5">Çatdırılma Ünvanı</span>
                              <p className="text-black/80 font-medium text-xs leading-relaxed">{order.address}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => toggleInvoice(order.id)}
                            className={`w-full py-3 px-4 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                              isInvoiceOpen 
                                ? "bg-black text-white shadow-sm" 
                                : "bg-white hover:bg-black hover:text-white text-black border border-black/15 shadow-xs"
                            }`}
                          >
                            <Receipt className="w-4 h-4" /> 
                            {isInvoiceOpen ? "Qəbzi Bağla ✕" : "Ödəniş Çeki (Invoice)"}
                          </button>

                          <Link 
                            href={`/track?id=${(order.id || "").replace('#', '')}`}
                            className="group/btn w-full py-3.5 px-5 rounded-full bg-black hover:bg-black/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
                          >
                            <Truck className="w-4 h-4" /> 
                            Sifarişi İzlə (Track)
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* LIVE POS TERMINAL REAL-TIME ROLLER PRINT & TEAR EXPERIENCE */}
                  <AnimatePresence>
                    {isInvoiceOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden border-t-2 border-dashed border-black/15 bg-[#F2EFEA] py-10 px-4 sm:px-8"
                      >
                        <div className="max-w-2xl mx-auto">
                          
                          {/* 3D POS Terminal Machine Body */}
                          <div className="bg-gradient-to-b from-[#25252a] to-[#121214] rounded-t-3xl p-6 border-t-2 border-x-2 border-black/70 shadow-2xl relative z-30 text-white font-mono">
                            
                            {/* POS Terminal Screen with Real-Time Progress Bar */}
                            <div className="bg-[#0A0E0C] p-4 rounded-xl border border-emerald-900/60 shadow-inner mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-400">
                              <div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/70 flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${printing ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
                                  EPOINT SMART POS v4.2
                                </div>
                                <div className="text-xs font-black tracking-wider mt-1 text-emerald-300 flex items-center gap-2">
                                  {printing ? (
                                    <span>⚙️ ÇAP EDİLİR... {progress}%</span>
                                  ) : isTorn ? (
                                    <span className="text-white">✓ QƏBZ QOPARILDI (TAMAMLANDI)</span>
                                  ) : (
                                    <span className="text-emerald-400 font-black">✓ ÇAP TAMAMLANDI — CIRIN!</span>
                                  )}
                                </div>
                              </div>

                              {/* Progress bar line inside LCD */}
                              <div className="w-full sm:w-48 bg-emerald-950/60 h-2.5 rounded-full overflow-hidden border border-emerald-800/40">
                                <div 
                                  className="h-full bg-emerald-400 transition-all duration-75 ease-linear"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Metallic Slit with Tooth Blade Guide */}
                            <div className="relative pt-1">
                              <div className="h-3.5 bg-black rounded-full border-2 border-[#333338] shadow-inner flex items-center justify-center overflow-hidden">
                                <div className="w-5/6 h-[2px] bg-neutral-700/80" />
                              </div>
                              {/* Sharp Tooth Cutter Strip Graphic */}
                              <div 
                                className="w-full h-2 bg-repeat-x opacity-70 -mt-1" 
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 6' width='12' height='6'%3E%3Cpolygon points='0,0 6,6 12,0' fill='%2366666e'/%3E%3C/svg%3E")`,
                                  backgroundSize: '12px 6px'
                                }} 
                              />
                            </div>

                          </div>

                          {/* Paper Feed Area — Connected directly inside terminal slot without shadows */}
                          <div className="relative z-20 overflow-hidden transition-all">
                            
                            {/* Realistic Feed Mask: Paper translates from -100% down to 0% so the leading tip emerges first */}
                            <div 
                              style={{ 
                                transform: `translateY(${progress - 100}%)`,
                                transition: 'transform 0.08s linear'
                              }}
                              className="overflow-visible"
                            >
                              <motion.div 
                                drag={!isTorn && !printing ? "y" : false}
                                dragConstraints={{ top: 0, bottom: 100 }}
                                dragElastic={0.3}
                                onDragEnd={(_, info) => {
                                  if (info.offset.y > 30 || info.velocity.y > 60) {
                                    handleTearReceipt(order.id);
                                  }
                                }}
                                animate={
                                  isTorn 
                                    ? { y: 36, rotate: -1.5 } 
                                    : { y: 0, rotate: 0 }
                                }
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className={`relative origin-top transition-transform ${!isTorn && !printing ? 'cursor-grab active:cursor-grabbing' : ''}`}
                              >
                                {/* Top Jagged Paper Teeth — Completely hidden and flush inside slit before tearing, only revealed upon tear */}
                                <div 
                                  className={`w-full overflow-hidden transition-all duration-300 ${isTorn ? "h-3 opacity-100" : "h-0 opacity-0"}`} 
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' width='16' height='8'%3E%3Cpolygon points='0,8 8,0 16,8' fill='%23ffffff'/%3E%3C/svg%3E")`,
                                    backgroundSize: '16px 8px',
                                    backgroundPosition: 'bottom'
                                  }} 
                                />

                                {/* Pure White Sharp-Corner Thermal Receipt Paper Body (Seamless flush inside slit) */}
                                <div className="bg-white rounded-none p-8 sm:p-10 text-xs font-mono relative select-none">
                                  
                                  {/* Drag / Pull Interactive Hint Badge */}
                                  {!isTorn && !printing && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/5 rounded-full text-[10px] font-mono text-black/50 font-bold uppercase flex items-center gap-1.5 animate-pulse pointer-events-none">
                                      <span>🖐️ Aşağı dart & cır</span>
                                    </div>
                                  )}

                                  {/* Side Tear Notch Holes */}
                                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F2EFEA]" />
                                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F2EFEA]" />

                                  {/* Receipt Header with Official Logo */}
                                  <div className="text-center pb-5 mb-5 border-b-2 border-dashed border-black/15">
                                    <div className="flex justify-center items-center my-2">
                                      <img src="/logo-black-cleaned.png" alt="Tokyo Store Logo" className="h-20 sm:h-24 max-w-[320px] w-auto object-contain" />
                                    </div>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-black/60 font-bold block mt-1">
                                      ••• ELEKTRON ALIŞ-VERİŞ QƏBZİ •••
                                    </span>
                                    <p className="text-[11px] text-black/60 mt-1.5 leading-relaxed">
                                      TOKYO STORE AZERBAIJAN • BAKU, NIZAMI 12<br />
                                      <strong className="text-black font-bold">VÖEN: 2907368582</strong> • TEL: +994 50 123 45 67
                                    </p>

                                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 font-mono text-[11px] font-bold uppercase">
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                                      ÖDƏNİLDİ // VERIFIED RECEIPT
                                    </div>
                                  </div>

                                  {/* Metadata Grid */}
                                  <div className="grid grid-cols-2 gap-4 pb-5 mb-5 border-b border-dashed border-black/15 text-[11px]">
                                    <div>
                                      <span className="text-[9px] uppercase font-bold text-black/40 block">QƏBZ №</span>
                                      <strong className="text-black text-sm">INV-{order.id.replace('#', '')}</strong>
                                      <span className="text-[9px] uppercase font-bold text-black/40 block mt-2">TARİX // SAAT</span>
                                      <span className="text-black/80">{order.date}</span>
                                    </div>

                                    <div className="text-right">
                                      <span className="text-[9px] uppercase font-bold text-black/40 block">MÜŞTƏRİ</span>
                                      <strong className="text-black text-sm uppercase">{order.customer}</strong>
                                      <span className="text-black/60 block truncate">{order.email}</span>
                                      <span className="text-black/60 block truncate">{order.phone}</span>
                                    </div>
                                  </div>

                                  {/* Destination */}
                                  {order.address && (
                                    <div className="pb-5 mb-5 border-b border-dashed border-black/15 text-[11px]">
                                      <span className="text-[9px] uppercase font-bold text-black/40 block mb-0.5">ÇATDIRILMA ÜNVANI</span>
                                      <p className="text-black/80 font-medium">{order.address}</p>
                                    </div>
                                  )}

                                  {/* Items Table */}
                                  <div className="mb-5">
                                    <table className="w-full text-left text-xs">
                                      <thead>
                                        <tr className="border-b border-black/10 uppercase text-black/50 text-[10px]">
                                          <th className="pb-2 font-bold">MƏHSUL</th>
                                          <th className="pb-2 text-center font-bold">SAY</th>
                                          <th className="pb-2 text-right font-bold">QİYMƏT</th>
                                          <th className="pb-2 text-right font-bold">MƏBLƏĞ</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-dashed divide-black/10 font-mono text-[11px]">
                                        {order.products && order.products.length > 0 ? (
                                          order.products.map((p: any, pIdx: number) => (
                                            <tr key={pIdx}>
                                              <td className="py-2.5 font-bold text-black uppercase">{p.name}</td>
                                              <td className="py-2.5 text-center">{p.qty}x</td>
                                              <td className="py-2.5 text-right">{p.price}</td>
                                              <td className="py-2.5 text-right font-black text-black">{p.price}</td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td className="py-2.5 font-bold text-black">Məhsul</td>
                                            <td className="py-2.5 text-center">{order.items || 1}x</td>
                                            <td className="py-2.5 text-right">{order.total}</td>
                                            <td className="py-2.5 text-right font-black text-black">{order.total}</td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Calculation & Totals */}
                                  <div className="space-y-1.5 pt-4 border-t-2 border-dashed border-black/20 text-xs">
                                    <div className="flex justify-between text-black/70">
                                      <span>ARA CƏMİ:</span>
                                      <span className="font-bold text-black">{order.subtotal || order.total}</span>
                                    </div>
                                    <div className="flex justify-between text-black/70">
                                      <span>ÇATDIRILMA ({order.shippingRateName ? order.shippingRateName.toUpperCase() : "STANDART"}):</span>
                                      <span className={`font-bold ${order.shipping === "0.00 ₼ (PULSUZ)" || order.shipping === "0.00 ₼" || !order.shipping ? "text-emerald-700" : "text-black"}`}>
                                        {order.shipping || "0.00 ₼ (PULSUZ)"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-black/70 pb-2 border-b border-black/10">
                                      <span>ÖDƏNİŞ METODU:</span>
                                      <span className="font-bold text-black">EPOINT / KART</span>
                                    </div>
                                    <div className="flex justify-between text-base sm:text-lg font-black text-black pt-1">
                                      <span>YEKUN ÖDƏNİŞ:</span>
                                      <span>{order.total}</span>
                                    </div>
                                  </div>

                                  {/* Barcode & Verification */}
                                  <div className="mt-6 pt-5 border-t-2 border-dashed border-black/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                                    <div>
                                      <div className="flex items-center justify-center sm:justify-start gap-0.5 h-7 opacity-75">
                                        {[2,1,4,1,2,5,1,2,4,1,3,1,2,4,1,2,5,1,2,3,1,4,2].map((w, bi) => (
                                          <span key={bi} className="bg-black h-full inline-block" style={{ width: `${w * 1.5}px` }} />
                                        ))}
                                      </div>
                                      <span className="text-[9px] text-black/50 uppercase tracking-[0.2em] block mt-1">
                                        AUTH-{order.id.replace('#', '')}-EPOINT-AZ
                                      </span>
                                    </div>

                                    <div className="text-[10px] text-black/40 text-center sm:text-right">
                                      ✓ ELEKTRON İMZA İLƏ TƏSDİQLƏNDİ<br />
                                      TOKYO.AZ • VÖEN: 2907368582
                                    </div>
                                  </div>

                                </div>

                                {/* Bottom Seamless Jagged Paper Teeth (LEADING TIP) */}
                                <div 
                                  className="w-full h-3 bg-repeat-x rounded-none -mt-[1px]" 
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' width='16' height='8'%3E%3Cpolygon points='0,0 8,8 16,0' fill='%23ffffff'/%3E%3C/svg%3E")`,
                                    backgroundSize: '16px 8px',
                                    backgroundPosition: 'top'
                                  }} 
                                />
                              </motion.div>
                            </div>

                            {/* INTERACTIVE CONTROLLER BELOW PRINTER */}
                            <div className="mt-14 sm:mt-20 pt-2 pb-6 text-center">
                              {printing ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/80 text-white font-mono text-xs rounded-full shadow-lg">
                                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                                  <span>Kassa lenti çıxır... ({progress}%)</span>
                                </div>
                              ) : !isTorn ? (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center justify-center"
                                >
                                  <button
                                    onClick={() => handleTearReceipt(order.id)}
                                    className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all border-2 border-white/20 hover:scale-105 cursor-pointer"
                                  >
                                    <Scissors className="w-4 h-4 rotate-90 text-emerald-400" />
                                    <span>✂️ Qəbzi Cır və Götür (Tear Receipt)</span>
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center justify-center gap-3"
                                >
                                  <button
                                    onClick={() => downloadReceiptImage(order)}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
                                  >
                                    <Download className="w-4 h-4 text-emerald-400" />
                                    <span>Qəbzi Yüklə (PNG Şəkil)</span>
                                  </button>
                                </motion.div>
                              )}
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
}
