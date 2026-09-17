"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextType = {
  currencyCode: string;
  exchangeRate: number;
  formatPrice: (basePrice: number | string) => string;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: "AZN",
  exchangeRate: 1,
  formatPrice: (price) => `${Number(price).toFixed(2)} ₼`,
  isLoading: true,
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState("AZN");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initCurrency() {
      try {
        // 1. Detect user's currency via IP
        const ipRes = await fetch("https://ipapi.co/currency/");
        let userCurrency = await ipRes.text();
        userCurrency = userCurrency.trim();

        if (!userCurrency || userCurrency.length !== 3 || userCurrency === "Undefined") {
          userCurrency = "AZN"; // Fallback
        }

        setCurrencyCode(userCurrency);

        // 2. Fetch exchange rates (Base AZN)
        if (userCurrency !== "AZN") {
          const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/AZN");
          const rateData = await rateRes.json();
          if (rateData && rateData.rates && rateData.rates[userCurrency]) {
            setExchangeRate(rateData.rates[userCurrency]);
          }
        }
      } catch (err) {
        // Silently fallback to AZN without console.error 
        // to avoid triggering the Next.js dev error overlay on adblockers
        setCurrencyCode("AZN");
        setExchangeRate(1); 
      } finally {
        setIsLoading(false);
      }
    }

    initCurrency();
  }, []);

  const formatPrice = (basePrice: number | string) => {
    const numericPrice = typeof basePrice === "string" ? parseFloat(basePrice.replace(/[^0-9.]/g, '')) : basePrice;
    if (isNaN(numericPrice)) return "0.00 ₼";

    const converted = numericPrice * exchangeRate;

    // Return a stable string during hydration or if currency is AZN (to match admin panel format exactly)
    if (isLoading || currencyCode === "AZN") {
      return `${converted.toFixed(2)} ₼`;
    }

    // Use Intl.NumberFormat for foreign currencies (e.g. USD, EUR)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currencyCode, exchangeRate, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}
