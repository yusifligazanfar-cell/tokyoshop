"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  Store
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#F1F2F4] border-r border-gray-200 h-screen flex flex-col sticky top-0">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
        <Link href="/admin" className="font-black text-xl tracking-tighter lowercase">
          tokyo admin
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-white text-black shadow-sm border border-gray-200' 
                  : 'text-gray-600 hover:bg-gray-200/50 hover:text-black'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200/50 hover:text-black transition-colors"
        >
          <Store className="w-4 h-4 text-gray-500" />
          View Store
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200/50 hover:text-black transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-500" />
          Settings
        </Link>
      </div>
    </div>
  );
}
