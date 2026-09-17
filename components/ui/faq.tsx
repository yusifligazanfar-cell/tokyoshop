"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Qaytarma siyasətiniz nədir?",
    answer: "We offer a 30-day trial for all our products. If you're not completely satisfied, you can return them for a full refund, no questions asked, even if they've been worn outdoors."
  },
  {
    question: "Materiallarınız davamlı mənbələrdən əldə edilirmi?",
    answer: "Absolutely. Davamlılıq is at the core of everything we do. We use renewable materials like ZQ Merino wool, FSC-certified eucalyptus tree fiber, and our proprietary SweetFoam® made from sugarcane."
  },
  {
    question: "Məhsullarımı necə qorumalı və yumalıyam?",
    answer: "Most of our apparel and shoes are machine washable! Simply remove any insoles and laces, place them in a delicates bag, and wash on a gentle cycle with cold water. Always let them air dry."
  },
  {
    question: "Beynəlxalq çatdırılma təklif edirsinizmi?",
    answer: "We currently ship to over 30 countries worldwide. Çatdırılma costs, taxes, and estimated delivery times are automatically calculated at checkout based on your exact location."
  },
  {
    question: "Ölçülər necədir?",
    answer: "Our products generally run true to size. If you fall between sizes or have a wider foot, we recommend sizing up for the most comfortable fit."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 px-6 bg-black text-white mx-2 md:mx-3 mb-2 rounded-2xl relative overflow-hidden">
      
      {/* Decorative Modern Pattern Background (Cross/Plus Grid) */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 26v8M26 30h8' stroke='%23ffffff' stroke-width='1' stroke-linecap='round' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Subtle Gradient Overlay to fade the pattern at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-80" />

      <div className="container mx-auto max-w-[800px] relative z-10">
        
        {/* Centered Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-4">
            Tez-Tez Verilən Suallar
          </h2>
          <p className="text-white/50 font-light text-sm md:text-base">
            Məhsullarımız və xidmətlərimiz haqqında bilməli olduğunuz hər şey.
          </p>
        </div>

        {/* Clean Accordion */}
        <div className="flex flex-col border-t border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className="border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-6 text-left flex justify-between items-center focus:outline-none group"
                >
                  <span className="text-base md:text-lg font-medium group-hover:text-white/70 transition-colors pr-8">
                    {faq.question}
                  </span>
                  
                  <span className={`text-2xl font-light transition-transform duration-300 ease-in-out shrink-0 text-white/40 group-hover:text-white ${
                    isOpen ? "rotate-45" : ""
                  }`}>
                    +
                  </span>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-60 opacity-100 pb-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-white/60 font-light text-sm md:text-base leading-relaxed pr-12">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
