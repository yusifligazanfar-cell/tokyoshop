"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Scissors, 
  Maximize2, 
  ShieldCheck, 
  Activity, 
  Compass, 
  ChevronRight, 
  ShoppingBag, 
  Check, 
  RotateCw, 
  Flame, 
  Radio,
  ArrowRight
} from "lucide-react";
import { useCart } from "@/components/cart-context";

interface AnatomyStep {
  id: string;
  stepNum: string;
  title: string;
  subtitle: string;
  headline: string;
  description: string;
  highlight: string;
  specs: { label: string; value: string; detail?: string }[];
  targetCoords: { top: string; left: string };
  camera: {
    scale: number;
    originX: number;
    originY: number;
    xPercent?: number;
    yPercent?: number;
  };
}

const ANATOMY_STEPS: AnatomyStep[] = [
  {
    id: "overview",
    stepNum: "01",
    title: "ÜMUMİ SİLUET",
    subtitle: "FULL SILHOUETTE // ARCHITECTURAL FIT",
    headline: "PREMIUM OVERSIZED KƏSİM VƏ BALANS",
    description: "Klassik Tokyo silueti və müasir brutalist kəsim. Ağır çəkili orqanik pambıq toxunuşu ilə həm möhkəm duruş, həm də ultra-rahat termal balans təmin edir.",
    highlight: "Double-Brushed Fleece",
    specs: [
      { label: "QRAMAJ", value: "480 GSM", detail: "Heavyweight Knit" },
      { label: "TƏRKİB", value: "100% ORQANİK", detail: "Combed Cotton" },
      { label: "KƏSİM", value: "RELAXED BOXY", detail: "Custom Drop" },
    ],
    targetCoords: { top: "50%", left: "50%" },
    camera: { scale: 1.0, originX: 0.5, originY: 0.5, xPercent: 0, yPercent: 0 },
  },
  {
    id: "hood",
    stepNum: "02",
    title: "BAŞLIQ (HOOD)",
    subtitle: "DOUBLE-LAYER // NO-COLLAPSE HOOD",
    headline: "İKİQAT QALIN TİKİŞLİ STRUKTUR BAŞLIQ",
    description: "Standart yumşaq başlıqlardan fərqli olaraq, 2-qat qalın orqanik parça konstruksiyası sayəsində geyindikdə və ya çıxardıqda sallaq qalmır, dik və estetik memarlıq formasını qoruyur.",
    highlight: "Zero-Sag Architecture",
    specs: [
      { label: "LAYLAR", value: "2-PLY DOUBLE", detail: "Self-Fabric Lined" },
      { label: "TİKİŞ", value: "FLATLOCK 6MM", detail: "Anti-Chafe Finish" },
      { label: "DÖZÜMLÜLÜK", value: "YÜKSƏK QALINLIQ", detail: "Structural Edge" },
    ],
    targetCoords: { top: "28%", left: "50%" },
    camera: { scale: 2.6, originX: 0.5, originY: 0.16, xPercent: 0, yPercent: 14 },
  },
  {
    id: "material",
    stepNum: "03",
    title: "MATERİAL VƏ PARÇA",
    subtitle: "480 GSM // 100% ORGANIC COMBED COTTON",
    headline: "480 GSM AĞIR ÇƏKİLİ PREMIUM PAMBIQ",
    description: "100% daranmış sıx orqanik pambıq toxunuşu. Daxili xüsusi fırçalanmış (double-brushed) təbii flis qatı həm bədənə maksimum yumşaqlıq bəxş edir, həm də soyuq havada ideal termal izolyasiya yaradır.",
    highlight: "Double-Brushed Fleece",
    specs: [
      { label: "QRAMAJ", value: "480 GSM", detail: "Heavyweight Knit" },
      { label: "TƏRKİB", value: "100% ORQANİK", detail: "Combed Cotton" },
      { label: "HİSSİYYAT", value: "ULTRA SOFT", detail: "Zero Irritation" },
    ],
    targetCoords: { top: "42%", left: "33%" },
    camera: { scale: 2.4, originX: 0.32, originY: 0.36, xPercent: 12, yPercent: 6 },
  },
  {
    id: "carpet-print",
    stepNum: "04",
    title: "ÇAPI VƏ İKONOQRAFİYA",
    subtitle: "HERITAGE PRINT // HIGH-DENSITY SERIGRAPHY",
    headline: "AZƏRBAYCAN XALÇA ŞƏBƏKƏSİ & HD İPƏK BASQI",
    description: "Ənənəvi Azərbaycan xalça naxışlarının mikro-detallı, 12-laylı HD ipək seriqrafiya çapı. Parçanın dərinliyinə hopan premium pigmentlər sayəsində heç vaxt çatlamır və yuyulmada rəngini itirmir.",
    highlight: "12-Pass HD Screenprint",
    specs: [
      { label: "TEXNOLOGİYA", value: "HD SILKSCREEN", detail: "Textured Pigment" },
      { label: "RƏNG DƏYƏRİ", value: "12 PIGMENT PASS", detail: "Micro-Details" },
      { label: "DÖZÜMLÜLÜK", value: "100+ YUYULMA", detail: "Anti-Fade Coating" },
    ],
    targetCoords: { top: "52%", left: "50%" },
    camera: { scale: 2.7, originX: 0.5, originY: 0.54, xPercent: 0, yPercent: -4 },
  },
  {
    id: "ribbing",
    stepNum: "05",
    title: "MANJET VƏ ƏTƏK",
    subtitle: "SHAPE-RETENTION RIBBING // HEAVY HEM",
    headline: "FORMA SAXLAYAN QALIN ELASTİK 2X2 RİB",
    description: "95% orqanik pambıq və 5% yüksək dartılma dözümlü elastik spandex tərkibli 2x2 qalın toxunuş. Yüzlərlə geyimdən və yuyulmadan sonra belə bilək və bel hissəsinin sallanmasını, boşalmasını əngəlləyir.",
    highlight: "2x2 Elastic Memory",
    specs: [
      { label: "TOXUNUŞ", value: "2X2 HEAVY RIB", detail: "Memory Retention" },
      { label: "SPANDEX", value: "5% HIGH-TENSILE", detail: "Snap-Back Fit" },
      { label: "MANJET ENİ", value: "6.5 CM", detail: "Comfort Grip" },
    ],
    targetCoords: { top: "93%", left: "21%" },
    camera: { scale: 2.7, originX: 0.20, originY: 0.98, xPercent: 18, yPercent: -42 },
  },
];

export function HoodieAnatomy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState<"red" | "white">("red");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const { addItem, setIsCartOpen } = useCart();

  // Scroll Progress across 400vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring physics for camera motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  const stepCount = ANATOMY_STEPS.length;
  const stepIndices = ANATOMY_STEPS.map((_, i) => i / (stepCount - 1));

  const scaleValues = ANATOMY_STEPS.map((s) => s.camera.scale);
  const originXValues = ANATOMY_STEPS.map((s) => s.camera.originX * 100);
  const originYValues = ANATOMY_STEPS.map((s) => s.camera.originY * 100);
  const xPercentValues = ANATOMY_STEPS.map((s) => s.camera.xPercent || 0);
  const yPercentValues = ANATOMY_STEPS.map((s) => s.camera.yPercent || 0);

  const scale = useTransform(smoothProgress, stepIndices, scaleValues);
  const originX = useTransform(smoothProgress, stepIndices, originXValues);
  const originY = useTransform(smoothProgress, stepIndices, originYValues);
  const xPercent = useTransform(smoothProgress, stepIndices, xPercentValues);
  const yPercent = useTransform(smoothProgress, stepIndices, yPercentValues);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const stepIndex = Math.min(
        stepCount - 1,
        Math.max(0, Math.round(latest * (stepCount - 1)))
      );
      setActiveStepIndex(stepIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, stepCount]);

  const currentStep = ANATOMY_STEPS[activeStepIndex];

  const scrollToStep = (index: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (index / (stepCount - 1)) * containerHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleQuickBuy = () => {
    addItem({
      productId: "hoodie-azerbaijan-carpet",
      name: "THIS IS AZERBAIJAN STYLE BALAM // CARPET HOODIE",
      price: 89,
      image: activeColor === "red" ? "/anatomy/hoodie-red-clean.png" : "/anatomy/hoodie-chalk.png",
      color: activeColor === "red" ? "Qarabağ Qırmızı" : "Raw Təbii Krem",
      size: "L",
      quantity: 1,
    });
    setIsCartOpen(true);
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[400vh] bg-[#EFECE7] text-black selection:bg-red-600 selection:text-white"
    >
      {/* Sticky Fullscreen 100vh Viewport Arena */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* TOP HUD LAB HEADER */}
        <div className="absolute top-6 left-6 right-6 md:top-8 md:left-12 md:right-12 z-40 flex justify-between items-center pointer-events-auto">
          {/* Brand & Lab Title */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-pulse" />
            <div>
              <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] uppercase text-black/90 block">
                TOKYO INNOVATION LAB // 2026
              </span>
              <span className="text-[9px] font-mono tracking-widest text-black/50 block">
                ANATOMICAL DISSECTION // ARCHIVE 01
              </span>
            </div>
          </div>
        </div>

        {/* CINEMATIC FULLSCREEN CAMERA VIEWPORT */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.div
            style={{
              scale,
              transformOrigin: useTransform(
                [originX, originY],
                ([ox, oy]) => `${ox}% ${oy}%`
              ),
              x: useTransform(xPercent, (v) => `${v}%`),
              y: useTransform(yPercent, (v) => `${v}%`),
            }}
            className="relative w-[62vw] max-w-[560px] aspect-[902/1090] flex items-center justify-center transition-all duration-75 will-change-transform"
          >
            {/* Primary High-Resolution Garment Layer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeColor}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full drop-shadow-[0_30px_70px_rgba(0,0,0,0.15)]"
              >
                <Image
                  src={
                    activeColor === "red"
                      ? "/anatomy/hoodie-red-clean.png"
                      : "/anatomy/hoodie-chalk.png"
                  }
                  alt="THIS IS AZERBAIJAN STYLE BALAM Heavyweight Hoodie"
                  fill
                  sizes="(max-width: 1200px) 90vw, 850px"
                  priority
                  className="object-contain filter drop-shadow-[0_20px_40px_rgba(220,38,38,0.15)]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Dynamic Target HUD Reticle that tracks the focal point */}
            <motion.div
              style={{
                top: currentStep.targetCoords.top,
                left: currentStep.targetCoords.left,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-700 ease-out"
            >
              {/* Pulsing Crosshair Target Box */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-red-600" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-red-600" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-red-600" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-red-600" />
                
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)] animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10" />

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/95 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest text-red-600 border border-red-500/30 shadow-sm whitespace-nowrap">
                  LOCK // {currentStep.id.toUpperCase()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* LEFT HUD: FLOATING SPECIFICATION CARD (ULTRA-MODERN CYBER-LUXURY DESIGN) */}
        <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 md:bottom-12 md:left-12 z-40 w-[calc(100vw-2rem)] max-w-[390px] sm:max-w-[430px] pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[28px] bg-white/90 backdrop-blur-3xl border border-black/10 p-6 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.09)] overflow-hidden"
            >
              {/* Step Title Header & Clean Progress Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-600 font-bold">
                  {currentStep.stepNum} / 05
                </span>
                <div className="flex items-center gap-1.5">
                  {ANATOMY_STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === activeStepIndex 
                          ? "w-5 bg-red-600" 
                          : "w-1.5 bg-black/15"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Clean Typography */}
              <div className="mb-4">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black leading-none uppercase">
                  {currentStep.title}
                </h3>
              </div>
              
              {/* Clean Natural Description */}
              <p className="text-xs sm:text-[13px] text-black/75 font-normal leading-relaxed mb-6">
                {currentStep.description}
              </p>

              {/* Action Buttons: Ultra-Modern Luxury Buy Pill */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleQuickBuy}
                  className="group/btn relative flex-1 overflow-hidden rounded-2xl bg-black text-white px-4 sm:px-5 py-3.5 transition-all duration-300 hover:bg-neutral-900 active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-between"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                  
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.15em] uppercase">
                      SİFARİŞ ET
                    </span>
                  </div>

                  <div className="flex items-center gap-2 relative z-10">
                    <span className="bg-white/15 text-white px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-tight">
                      89 ₼
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform duration-300">
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                  </div>
                </button>

                <Link
                  href="/shop"
                  className="w-12 h-12 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] border border-black/10 flex items-center justify-center text-black hover:text-red-600 transition-all group/link shrink-0"
                  title="Bütün kataloq"
                >
                  <ShoppingBag className="w-5 h-5 group-hover/link:scale-110 transition-transform" strokeWidth={1.75} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT HUD: STEP TIMELINE NAVIGATION */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end gap-3 pointer-events-auto">
          {ANATOMY_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => scrollToStep(idx)}
                className={`group flex items-center gap-3 transition-all duration-300 py-1`}
              >
                <span 
                  className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${
                    isActive 
                      ? "text-black opacity-100 font-bold translate-x-0" 
                      : "text-black/30 opacity-0 group-hover:opacity-80 translate-x-2 group-hover:translate-x-0"
                  }`}
                >
                  {step.title}
                </span>

                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isActive
                      ? "w-8 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.6)]"
                      : "w-2 bg-black/20 group-hover:bg-black/50"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* BOTTOM TELEMETRY BAR */}
        <div className="absolute bottom-4 right-6 md:right-12 z-30 hidden md:flex items-center gap-6 text-[9px] font-mono text-black/40 tracking-widest uppercase pointer-events-none">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-red-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span>MACRO-ZOOM: {currentStep.camera.scale}X</span>
          </div>
          <div>ROTATION: 0° LOCKED</div>
          <div>AZERBAIJAN STYLE BALAM // SPECIAL EDITION</div>
        </div>

      </div>
    </section>
  );
}
