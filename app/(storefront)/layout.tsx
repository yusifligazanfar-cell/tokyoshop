import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#1E1E1E] text-[#F3F2EE] text-[10px] md:text-xs text-center py-2 px-4 uppercase tracking-wider font-medium z-50 relative">
        Artan tələbat səbəbindən sifarişlərin çatdırılması 30 günə qədər çəkə bilər.
      </div>
      <Header />
      <main className="flex-1 flex flex-col pt-24 md:pt-28">
        {children}
      </main>
      <Footer />
    </>
  );
}
