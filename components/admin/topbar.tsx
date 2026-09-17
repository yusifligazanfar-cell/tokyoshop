"use client";

import { Bell, Search, User } from "lucide-react";

export function AdminTopbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search products, orders, or customers..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
        />
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4 pl-8">
        <button className="relative p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="w-px h-6 bg-gray-200 mx-2" />
        
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-bold leading-tight">Admin User</span>
            <span className="text-xs text-gray-500 leading-tight">Store Owner</span>
          </div>
        </button>
      </div>
    </header>
  );
}
