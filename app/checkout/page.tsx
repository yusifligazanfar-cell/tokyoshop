"use client";

import { useCart } from "@/components/cart-context";
import { createOrderAction, getShippingRates, type ShippingRate } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/components/currency-provider";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, Download, Scissors, RefreshCw, RotateCcw, Package, Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shippingRatesList, setShippingRatesList] = useState<ShippingRate[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);

  // POS Printing Animation States
  const [printProgress, setPrintProgress] = useState(0);
  const [isPrinting, setIsPrinting] = useState(true);
  const [isTorn, setIsTorn] = useState(false);

  useEffect(() => {
    getShippingRates().then(rates => {
      setShippingRatesList(rates);
      if (rates.length > 0) setSelectedShippingId(rates[0].id);
    });
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const selectedRate = shippingRatesList.find(r => r.id === selectedShippingId);
  const shipping = selectedRate ? selectedRate.price : 0;
  const total = subtotal + shipping;

  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const startPrintingSimulation = () => {
    setIsPrinting(true);
    setPrintProgress(0);
    setIsTorn(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsPrinting(false);
      }
      setPrintProgress(current);
    }, 80);
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const orderId = "#" + Math.floor(1000 + Math.random() * 9000);
    const shippingStr = shipping === 0 ? "0.00 ₼ (PULSUZ)" : formatPrice(shipping);
    const subtotalStr = formatPrice(subtotal);
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleString("az-AZ"),
      customer: formData.get("fname") + " " + formData.get("lname"),
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subtotal: subtotalStr,
      shipping: shippingStr,
      shippingCost: shipping,
      shippingRateName: selectedRate?.name || "Standart Çatdırılma",
      total: formatPrice(total),
      payment: "Ödənilib",
      fulfillment: "Hazırlanır",
      items: items.length,
      address: `${formData.get("address")}, ${formData.get("city")}, ${formData.get("state")} ${formData.get("zip")}`,
      products: items.map(i => ({ name: i.name, qty: i.quantity, price: formatPrice(i.price * i.quantity), image: i.image || "" })),
      timeline: [
        { time: new Date().toLocaleString("az-AZ"), title: "Sifariş yaradıldı", desc: "Müştəri veb-sayt üzərindən sifariş verdi.", icon: "cart" },
        { time: new Date().toLocaleString("az-AZ"), title: "Ödəniş qəbul edildi", desc: `${formatPrice(total)} (Epoint / Kart).`, icon: "payment" }
      ]
    };
    const res = await createOrderAction(newOrder);
    setIsSubmitting(false);
    if (res.success) {
      setPlacedOrder(newOrder);
      clearCart();
      setOrderPlaced(true);
      startPrintingSimulation();
    }
  };

  const handleTearReceipt = () => {
    setIsTorn(true);
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

    const logoImg = new window.Image();
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
      ctx.fillText(order.date || new Date().toLocaleString("az-AZ"), 40, 344);

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

      const prods = order.products && order.products.length > 0 ? order.products : [{ name: "MƏHSUL", qty: 1, price: order.total }];

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
      ctx.fillText(order.total, width - 40, currentY);

      currentY += 22;
      ctx.textAlign = "left";
      ctx.fillStyle = "#555555";
      ctx.fillText("ÇATDIRILMA:", 40, currentY);
      ctx.textAlign = "right";
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#137333";
      ctx.fillText("0.00 ₼ (PULSUZ)", width - 40, currentY);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (orderPlaced && placedOrder) {
    return (
      <div className="min-h-screen bg-[#EFECE7] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-black selection:text-white">
        
        {/* Top Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-full font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>ÖDƏNİŞ TƏSDİQLƏNDİ • SİFARİŞ #{placedOrder.id.replace('#', '')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Təşəkkür Edirik!
          </h1>
          <p className="text-black/60 text-xs sm:text-sm mt-1 font-medium">
            Ödəniş uğurla qəbul edildi və kassa qəbziniz çap olunur.
          </p>
        </motion.div>

        {/* 3D POS Terminal Enclosure */}
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-[#1C1C1F] rounded-3xl p-4 sm:p-6 border-4 border-[#2A2A2E] shadow-2xl relative overflow-hidden">
            
            {/* Terminal Top Hardware Details */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  ● EPOINT SMART POS v4.2
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                {isPrinting ? `ÇAP GEDİR (${printProgress}%)` : "ÇAP TAMAMLANDI"}
              </span>
            </div>

            {/* Terminal Slit LCD Status & Tooth Blade */}
            <div className="bg-[#121214] rounded-2xl p-4 mb-3 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  STATUS
                </span>
                <span className="text-xs font-mono font-bold text-white flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isPrinting ? "Kağız ötürülür..." : isTorn ? "Qəbz ayrıldı" : "Kəsilməyə hazırdır"}
                </span>
              </div>

              {/* Progress bar line inside LCD */}
              <div className="w-full sm:w-48 bg-emerald-950/60 h-2.5 rounded-full overflow-hidden border border-emerald-800/40">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-75 ease-linear"
                  style={{ width: `${printProgress}%` }}
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
                transform: `translateY(${printProgress - 100}%)`,
                transition: 'transform 0.08s linear'
              }}
              className="overflow-visible"
            >
              <motion.div 
                drag={!isTorn && !isPrinting ? "y" : false}
                dragConstraints={{ top: 0, bottom: 100 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 30 || info.velocity.y > 60) {
                    handleTearReceipt();
                  }
                }}
                animate={
                  isTorn 
                    ? { y: 36, rotate: -1.5 } 
                    : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`relative origin-top transition-transform ${!isTorn && !isPrinting ? 'cursor-grab active:cursor-grabbing' : ''}`}
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
                  {!isTorn && !isPrinting && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/5 rounded-full text-[10px] font-mono text-black/50 font-bold uppercase flex items-center gap-1.5 animate-pulse pointer-events-none">
                      <span>🖐️ Aşağı dart & cır</span>
                    </div>
                  )}

                  {/* Side Tear Notch Holes */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EFECE7]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EFECE7]" />

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
                      <strong className="text-black text-sm">INV-{placedOrder.id.replace('#', '')}</strong>
                      <span className="text-[9px] uppercase font-bold text-black/40 block mt-2">TARİX // SAAT</span>
                      <span className="text-black/80">{placedOrder.date}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-black/40 block">MÜŞTƏRİ</span>
                      <strong className="text-black text-sm uppercase">{placedOrder.customer}</strong>
                      <span className="text-black/60 block truncate">{placedOrder.email}</span>
                      <span className="text-black/60 block truncate">{placedOrder.phone}</span>
                    </div>
                  </div>

                  {/* Destination */}
                  {placedOrder.address && (
                    <div className="pb-5 mb-5 border-b border-dashed border-black/15 text-[11px]">
                      <span className="text-[9px] uppercase font-bold text-black/40 block mb-0.5">ÇATDIRILMA ÜNVANI</span>
                      <p className="text-black/80 font-medium">{placedOrder.address}</p>
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
                        {placedOrder.products && placedOrder.products.length > 0 ? (
                          placedOrder.products.map((p: any, pIdx: number) => (
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
                            <td className="py-2.5 text-center">{placedOrder.items || 1}x</td>
                            <td className="py-2.5 text-right">{placedOrder.total}</td>
                            <td className="py-2.5 text-right font-black text-black">{placedOrder.total}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculation & Totals */}
                  <div className="space-y-1.5 pt-4 border-t-2 border-dashed border-black/20 text-xs">
                    <div className="flex justify-between text-black/70">
                      <span>ARA CƏMİ:</span>
                      <span className="font-bold text-black">{placedOrder.subtotal || placedOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-black/70">
                      <span>ÇATDIRILMA ({placedOrder.shippingRateName ? placedOrder.shippingRateName.toUpperCase() : "STANDART"}):</span>
                      <span className={`font-bold ${placedOrder.shipping === "0.00 ₼ (PULSUZ)" || placedOrder.shipping === "0.00 ₼" || !placedOrder.shipping ? "text-emerald-700" : "text-black"}`}>
                        {placedOrder.shipping || "0.00 ₼ (PULSUZ)"}
                      </span>
                    </div>
                    <div className="flex justify-between text-black/70 pb-2 border-b border-black/10">
                      <span>ÖDƏNİŞ METODU:</span>
                      <span className="font-bold text-black">EPOINT / KART</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-black text-black pt-1">
                      <span>YEKUN ÖDƏNİŞ:</span>
                      <span>{placedOrder.total}</span>
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
                        AUTH-{placedOrder.id.replace('#', '')}-EPOINT-AZ
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
            <div className="mt-14 sm:mt-20 pt-2 pb-8 text-center">
              {isPrinting ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/80 text-white font-mono text-xs rounded-full shadow-lg">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Kassa lenti çıxır... ({printProgress}%)</span>
                </div>
              ) : !isTorn ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center"
                >
                  <button
                    onClick={handleTearReceipt}
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
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <button
                    onClick={() => downloadReceiptImage(placedOrder)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Qəbzi Yüklə (PNG Şəkil)</span>
                  </button>

                  <Link
                    href={`/track?id=${placedOrder.id.replace('#', '')}`}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-black hover:text-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-2xl shadow-sm border border-black/15 flex items-center justify-center gap-2 transition-all"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Sifarişi İzlə</span>
                  </Link>

                  <Link
                    href="/orders"
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-black hover:text-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-2xl shadow-sm border border-black/15 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Bütün Sifarişlərim</span>
                  </Link>
                </motion.div>
              )}
            </div>

          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative">
      
      {/* Left Half - Forms */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex justify-end pt-12 pb-20 px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="w-full max-w-2xl">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <Link href="/" className="flex items-center group">
              <img src="/logo-black-cleaned.png" alt="Tokyo Store" className="h-20 sm:h-28 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            <Link href="/shop" className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-colors flex items-center group">
              <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" /> Səbətə qayıt
            </Link>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-12" onSubmit={handleCheckout}>
            {/* Əlaqə */}
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-medium text-gray-900 tracking-tight">Əlaqə</h2>
                <span className="text-xs font-medium text-gray-500">Already have an account? <a href="#" className="text-black underline underline-offset-4">Log in</a></span>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input type="email" id="email" name="email" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Email" />
                  <label htmlFor="email" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">E-poçt</label>
                </div>
                <div className="relative">
                  <input type="tel" id="phone" name="phone" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Phone" />
                  <label htmlFor="phone" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Telefon Nömrəsi (İstəyə bağlı)</label>
                </div>
              </div>
            </div>

            {/* Çatdırılma */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900 tracking-tight">Çatdırılma</h2>
              <div className="space-y-4">
                <div className="relative">
                  <select id="country" defaultValue="" className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Select a country</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <label htmlFor="country" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500">Ölkə / Region</label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input type="text" id="fname" name="fname" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Ad" />
                    <label htmlFor="fname" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Ad</label>
                  </div>
                  <div className="relative">
                    <input type="text" id="lname" name="lname" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Soyad" />
                    <label htmlFor="lname" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Soyad</label>
                  </div>
                </div>

                <div className="relative">
                  <input type="text" id="address" name="address" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Ünvan" />
                  <label htmlFor="address" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Ünvan</label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="relative col-span-1">
                    <input type="text" id="city" name="city" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Şəhər" />
                    <label htmlFor="city" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Şəhər</label>
                  </div>
                  <div className="relative col-span-1">
                    <input type="text" id="state" name="state" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="Bölgə" />
                    <label htmlFor="state" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Bölgə</label>
                  </div>
                  <div className="relative col-span-1">
                    <input type="text" id="zip" name="zip" required className="peer w-full bg-white border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-transparent" placeholder="ZIP" />
                    <label htmlFor="zip" className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-semibold peer-focus:text-gray-900">Poçt indeksi</label>
                  </div>
                </div>
              </div>
            </div>

            
            {/* Çatdırılma üsulu */}
            {shippingRatesList.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-gray-900 tracking-tight">Çatdırılma üsulu</h2>
                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                  {shippingRatesList.map((rate, index) => (
                    <label key={rate.id} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${index !== shippingRatesList.length - 1 ? 'border-b border-gray-300' : ''}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="shipping_method" 
                          value={rate.id}
                          checked={selectedShippingId === rate.id}
                          onChange={() => setSelectedShippingId(rate.id)}
                          className="w-4 h-4 text-black focus:ring-black border-gray-300"
                        />
                        <span className="text-sm text-gray-900">{rate.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {rate.price === 0 ? 'Pulsuz' : `${rate.price.toFixed(2)} ₼`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Ödəniş */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900 tracking-tight">Ödəniş</h2>
              <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>
              
              {/* Express Checkout */}
              <div className="flex flex-col items-center mb-6">
                <button className="w-full bg-black text-white rounded-md py-3 flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="font-semibold text-[15px]">Pay</span><span className="font-bold text-[15px] ml-1">with</span><svg className="w-10 h-4 ml-1.5" viewBox="0 0 24 10" fill="currentColor"><path d="M11.6667 3.25C11.6667 2.14543 12.5621 1.25 13.6667 1.25C14.7712 1.25 15.6667 2.14543 15.6667 3.25C15.6667 4.35457 14.7712 5.25 13.6667 5.25C12.5621 5.25 11.6667 4.35457 11.6667 3.25Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M12.9234 5.92213C12.4285 5.76016 11.8903 5.67253 11.3323 5.67253C10.6019 5.67253 9.91423 5.82772 9.29658 6.10398C8.91036 6.27674 8.65089 6.64333 8.61868 7.06734L8.53036 8.22998C8.50856 8.51701 8.26949 8.73693 7.9816 8.73693H6.84074C6.5562 8.73693 6.31908 8.5218 6.29221 8.23933L6.10444 6.26573C6.01256 5.29965 6.01256 4.32171 6.10444 3.35564L6.15579 2.81594C6.18266 2.53347 6.41978 2.31833 6.70432 2.31833H7.84518C8.13247 2.31833 8.37123 2.53723 8.39414 2.82343C8.4234 3.189 8.44186 3.56069 8.44955 3.93816C9.2882 3.12563 10.4357 2.61833 11.6963 2.61833C14.2887 2.61833 16.3904 4.72004 16.3904 7.31253C16.3904 8.01248 16.2372 8.67634 15.9619 9.27302C15.8236 9.57274 15.5135 9.75709 15.1824 9.75709H13.6826C13.2558 9.75709 12.8732 9.50508 12.7236 9.12192L12.5186 8.59733C12.3957 8.28292 12.441 7.9255 12.6393 7.64654L12.9234 5.92213ZM11.6667 8.25C13.0474 8.25 14.1667 7.13071 14.1667 5.75C14.1667 4.36929 13.0474 3.25 11.6667 3.25C10.2859 3.25 9.16667 4.36929 9.16667 5.75C9.16667 7.13071 10.2859 8.25 11.6667 8.25Z" fill="currentColor"/></svg>
                </button>
                <div className="w-full flex items-center my-6">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="px-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Və ya kartla ödə</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900">Kart məlumatları</h3>
                  
                  {/* Stripe-like connected inputs */}
                  <div className="bg-white rounded-md shadow-sm border border-gray-300 overflow-hidden relative z-10 transition-shadow focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600">
                    {/* Card Number Row */}
                    <div className="relative border-b border-gray-300 group">
                      <input 
                        type="text" 
                        placeholder="Card number" 
                        className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 focus:outline-none placeholder-gray-400 font-mono" 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 bg-white pl-2">
                        <div className="w-8 h-5 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-[8px] font-black text-blue-900">VISA</div>
                        <div className="w-8 h-5 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-[8px] font-black text-red-600">MC</div>
                      </div>
                    </div>
                    
                    {/* Expiry & CVC Row */}
                    <div className="flex">
                      <div className="w-1/2 relative border-r border-gray-300 group">
                        <input 
                          type="text" 
                          placeholder="MM / YY" 
                          className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 focus:outline-none placeholder-gray-400 font-mono" 
                        />
                      </div>
                      <div className="w-1/2 relative group">
                        <input 
                          type="text" 
                          placeholder="CVC" 
                          className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 focus:outline-none placeholder-gray-400 font-mono" 
                        />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900">Kartın üzərindəki ad</h3>
                  <input 
                    type="text" 
                    placeholder="Kartın üzərindəki ad" 
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow placeholder-gray-400" 
                  />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900">Country or region</h3>
                  <select defaultValue="" className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow appearance-none cursor-pointer">
                    <option value="" disabled>Select a country</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={items.length === 0 || isSubmitting}
              className="w-full bg-[#0570DE] text-white px-4 py-3.5 rounded-md font-semibold text-[15px] transition-all hover:bg-[#0058b8] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-sm"
            >
              Pay {formatPrice(total)}
            </button>
            <div className="flex items-center justify-center pt-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              AES-256 SSL Encryption
            </div>
          </motion.form>
        </div>
      </div>

      {/* Right Half - Order Summary (Receipt Style) */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#0A0A0A] text-black pt-12 pb-20 px-6 lg:px-12 xl:px-20 border-l border-white/10 lg:fixed lg:right-0 lg:top-0 lg:bottom-0 overflow-y-auto flex justify-center items-start relative">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm bg-white relative mt-8 z-10"
          style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.1))" }}
        >
          {/* Jagged Top Edge (using CSS radial-gradient) */}
          <div className="absolute top-0 left-0 right-0 h-2 -translate-y-full w-full bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle at 50% 0, transparent 50%, white 51%)", backgroundSize: "10px 10px" }}></div>

          <div className="p-8 font-mono text-sm border-x border-gray-100 min-h-[500px] flex flex-col">
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Tokyo</h2>
              <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Receipt #890-432-1</p>
              <p className="text-gray-500 uppercase text-[10px] tracking-widest">{new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              <span>Qty</span>
              <span>Item</span>
              <span>Amount</span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {items.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Your cart is empty.</p>
              ) : (
                items.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    key={`${item.id}-${index}`} 
                    className="flex justify-between items-start"
                  >
                    <div className="w-8 font-bold">{item.quantity}</div>
                    <div className="flex-1 px-2">
                      <h3 className="font-bold text-gray-900 uppercase leading-none">{item.name}</h3>
                      <p className="text-gray-500 text-[10px] uppercase mt-1">{item.color} / {item.size}</p>
                    </div>
                    <div className="font-bold text-right">{formatPrice(item.price * item.quantity)}</div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-6 space-y-2">
              <div className="flex justify-between text-gray-600 text-xs font-bold uppercase tracking-widest">
                <span>Ara Cəm</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs font-bold uppercase tracking-widest">
                <span>Çatdırılma</span>
                <span>{shipping === 0 ? 'Pulsuz' : `${shipping.toFixed(2)} ₼`}</span>
              </div>
              
              <div className="flex justify-between items-end pt-4 pb-2">
                <span className="text-base font-black uppercase tracking-widest text-gray-900">Yekun</span>
                <span className="text-xl font-black text-black">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="text-center border-t-2 border-dashed border-gray-300 pt-6 mt-6">
              <p className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">Sifarişiniz üçün təşəkkürlər</p>
              {/* Mock Barcode */}
              <div className="w-full h-12 bg-black mt-4 mx-auto opacity-80" style={{ backgroundImage: "repeating-linear-gradient(to right, white, white 2px, transparent 2px, transparent 4px, white 4px, white 7px, transparent 7px, transparent 8px, white 8px, white 10px)"}}></div>
              <p className="text-gray-400 font-mono text-[9px] tracking-[0.4em] mt-2 text-center ml-2">189304928472910</p>
            </div>
          </div>

          {/* Jagged Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-2 translate-y-full w-full bg-repeat-x rotate-180" style={{ backgroundImage: "radial-gradient(circle at 50% 0, transparent 50%, white 51%)", backgroundSize: "10px 10px" }}></div>
        </motion.div>
      </div>

    </div>
  );
}
