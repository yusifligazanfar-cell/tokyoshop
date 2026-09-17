"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Users, Activity } from "lucide-react";
import { getOrders, getProducts } from "@/app/actions";
import Link from "next/link";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getProducts()]).then(([ordersData, productsData]) => {
      setOrders(ordersData);
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Yüklənir...</div>;

  let totalSales = 0;
  orders.forEach(order => {
    totalSales += parseFloat(order.total.replace(/[^0-9.]/g, ''));
  });

  const activeProducts = products.filter(p => p.status === 'Aktiv').length;

  let lowStockProduct = null;
  for (const p of products) {
    if (p.inventory) {
      for (const size of Object.keys(p.inventory)) {
        for (const color of Object.keys(p.inventory[size])) {
          const qty = Number(p.inventory[size][color]);
          if (qty > 0 && qty <= 5) {
            lowStockProduct = { name: p.name || p.title, size, color, qty };
            break;
          }
        }
        if (lowStockProduct) break;
      }
    }
    if (lowStockProduct) break;
  }

  const stats = [
    { name: 'Ümumi Gəlir (Total Revenue)', value: `${totalSales.toFixed(2)} ₼`, change: '+20.1%', icon: DollarSign },
    { name: 'Sifarişlər (Orders)', value: orders.length.toString(), change: '+12.5%', icon: ShoppingBag },
    { name: 'Aktiv Müştərilər', value: '2,834', change: '+5.4%', icon: Users },
    { name: 'Anbardakı Məhsullar', value: activeProducts.toString(), change: '-2.1%', icon: Package },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">İdarə Paneli (Dashboard)</h1>
          <p className="text-sm text-gray-500 mt-1">Bu gün mağazanızda baş verənlərin xülasəsi.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            İxrac et (Export)
          </button>
          <Link href="/admin/analytics" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors inline-block">
            Hesabatlara bax (Reports)
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100">
                <stat.icon className="w-5 h-5 text-gray-700" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-[13px] font-semibold mb-1">{stat.name}</h3>
            <p className="text-3xl font-black tracking-tight text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-900">Son Sifarişlər (Recent Orders)</h2>
            <Link href="/admin/orders" className="text-[13px] text-green-600 font-bold hover:text-green-800 flex items-center gap-1 transition-colors">
              Hamısına bax <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[12px] uppercase tracking-wider">Sifariş ID</th>
                  <th className="px-6 py-4 text-[12px] uppercase tracking-wider">Müştəri</th>
                  <th className="px-6 py-4 text-[12px] uppercase tracking-wider">Tarix</th>
                  <th className="px-6 py-4 text-[12px] uppercase tracking-wider">Cəmi</th>
                  <th className="px-6 py-4 text-[12px] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500 text-[13px]">{order.date}</td>
                    <td className="px-6 py-4 font-bold font-mono">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                        ${order.payment === 'Ödənilib' ? 'bg-green-100 text-green-800' : 
                          order.payment === 'Gözləyir' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {order.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products/Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" /> Fəaliyyət (Store Activity)
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            
            {orders[0] && (
              <div className="flex gap-4 relative">
                {orders[1] && <div className="absolute top-8 left-[9px] w-0.5 h-10 bg-gray-100"></div>}
                <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Yeni sifariş: {orders[0].id}</p>
                  <p className="text-[13px] text-gray-500 mt-1">{orders[0].customer} - {orders[0].total} məbləğində.</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">{orders[0].date}</p>
                </div>
              </div>
            )}
            
            {orders[1] && (
              <div className="flex gap-4 relative">
                <div className="absolute top-8 left-[9px] w-0.5 h-10 bg-gray-100"></div>
                <div className="w-5 h-5 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">{orders[1].payment === 'Ödənilib' ? 'Ödəniş qəbul edildi' : 'Sifariş gözləmədədir'}</p>
                  <p className="text-[13px] text-gray-500 mt-1">{orders[1].customer} ({orders[1].id}) üçün sifariş statusu yeniləndi.</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">{orders[1].date}</p>
                </div>
              </div>
            )}

            {lowStockProduct ? (
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Aşağı stok xəbərdarlığı</p>
                  <p className="text-[13px] text-gray-500 mt-1">{lowStockProduct.name} ({lowStockProduct.color} / {lowStockProduct.size}) bitmək üzrədir ({lowStockProduct.qty} ədəd qalıb).</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">Son yoxlama</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Stok vəziyyəti normaldır</p>
                  <p className="text-[13px] text-gray-500 mt-1">Bütün məhsullar anbar ehtiyaclarını qarşılayır.</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">Son yoxlama</p>
                </div>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
