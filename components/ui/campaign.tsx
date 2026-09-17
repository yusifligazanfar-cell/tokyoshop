import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CampaignProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  align?: "left" | "right" | "center";
}

export function Campaign({
  title,
  subtitle,
  imageUrl,
  ctaText = "Discover",
  ctaLink = "/collections",
  align = "center",
}: CampaignProps) {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center bg-muted overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[#333333] opacity-50" />
      </div>

      <div
        className={`relative z-10 container mx-auto px-6 md:px-12 flex flex-col ${
          align === "left"
            ? "items-start text-left"
            : align === "right"
            ? "items-end text-right"
            : "items-center text-center"
        }`}
      >
        <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-white mb-6 max-w-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 max-w-xl mb-12">
            {subtitle}
          </p>
        )}
        <Link
          href={ctaLink}
          className="group flex items-center space-x-4 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors"
        >
          <span className="text-sm uppercase tracking-widest">{ctaText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
