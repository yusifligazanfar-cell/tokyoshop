"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Package } from "lucide-react";
import { getOrders } from "@/app/actions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("Son 30 gün");

  useEffect(() => {
    getOrders().then(data => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Yüklənir...</div>;

  // Filter orders by selected timeRange based on actual date
  const now = new Date();

  const filteredOrders = orders.filter(order => {
    if (!order.date) return true;
    const orderDate = new Date(order.date.replace(" ", "T"));
    if (isNaN(orderDate.getTime())) return true;
    
    const diffTime = now.getTime() - orderDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (timeRange === "Son 7 gün") {
      return diffDays <= 7 && diffDays >= -1;
    } else if (timeRange === "Son 30 gün") {
      return diffDays <= 30 && diffDays >= -1;
    } else if (timeRange === "Bu il") {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Calculate stats from REAL filtered orders
  let totalSales = 0;
  let totalItems = 0;
  const productSales: Record<string, { qty: number, revenue: number }> = {};

  filteredOrders.forEach(order => {
    const amount = parseFloat(order.total?.replace(/[^0-9.]/g, '') || "0") || 0;
    totalSales += amount;
    totalItems += order.items || 1;

    // Aggregate products
    if (order.products && Array.isArray(order.products)) {
      order.products.forEach((p: any) => {
        const pPrice = parseFloat(p.price?.replace(/[^0-9.]/g, '') || "0") || 0;
        const pAmount = pPrice * (p.qty || 1);
        if (!productSales[p.name]) {
          productSales[p.name] = { qty: 0, revenue: 0 };
        }
        productSales[p.name].qty += p.qty || 1;
        productSales[p.name].revenue += pAmount;
      });
    }
  });

  const topProducts = Object.keys(productSales).map(key => ({
    name: key,
    sales: productSales[key].qty,
    revenue: `${productSales[key].revenue.toFixed(2)} ₼`
  })).sort((a, b) => b.sales - a.sales);

  // Dynamic Chart Data based on real orders
  let chartData: { name: string; total: number }[] = [];

  const azMonths = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];

  if (timeRange === "Son 7 gün") {
    // Generate the last 7 days labels
    const daysMap: Record<string, number> = {};
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${d.getDate()} ${azMonths[d.getMonth()]}`;
      labels.push(label);
      daysMap[label] = 0;
    }

    filteredOrders.forEach(order => {
      if (order.date) {
        const d = new Date(order.date.replace(" ", "T"));
        if (!isNaN(d.getTime())) {
          const label = `${d.getDate()} ${azMonths[d.getMonth()]}`;
          const amount = parseFloat(order.total?.replace(/[^0-9.]/g, '') || "0") || 0;
          if (daysMap[label] !== undefined) {
            daysMap[label] += amount;
          }
        }
      }
    });

    chartData = labels.map(label => ({ name: label, total: daysMap[label] || 0 }));

  } else if (timeRange === "Son 30 gün") {
    // 6 intervals across the 30 days
    const intervalMap: Record<string, number> = {};
    const labels: string[] = [];
    const step = 5;
    for (let i = 25; i >= 0; i -= step) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${d.getDate()} ${azMonths[d.getMonth()]}`;
      labels.push(label);
      intervalMap[label] = 0;
    }

    filteredOrders.forEach(order => {
      if (order.date) {
        const d = new Date(order.date.replace(" ", "T"));
        if (!isNaN(d.getTime())) {
          const amount = parseFloat(order.total?.replace(/[^0-9.]/g, '') || "0") || 0;
          const orderLabel = `${d.getDate()} ${azMonths[d.getMonth()]}`;
          if (intervalMap[orderLabel] !== undefined) {
            intervalMap[orderLabel] += amount;
          } else if (labels.length > 0) {
            intervalMap[labels[labels.length - 1]] += amount;
          }
        }
      }
    });

    chartData = labels.map(label => ({ name: label, total: intervalMap[label] || 0 }));

  } else {
    // "Bu il" - 12 Months
    const monthTotals = new Array(12).fill(0);
    filteredOrders.forEach(order => {
      if (order.date) {
        const d = new Date(order.date.replace(" ", "T"));
        if (!isNaN(d.getTime())) {
          const amount = parseFloat(order.total?.replace(/[^0-9.]/g, '') || "0") || 0;
          monthTotals[d.getMonth()] += amount;
        }
      }
    });

    chartData = azMonths.map((m, idx) => ({ name: m, total: monthTotals[idx] }));
  }

  const kpis = [
    { title: "Ümumi Satış (Total Sales)", value: `${totalSales.toFixed(2)} ₼`, change: filteredOrders.length > 0 ? "+100%" : "0%", trend: "up" },
    { title: "Sifarişlər (Orders)", value: filteredOrders.length.toString(), change: filteredOrders.length > 0 ? `+${filteredOrders.length}` : "0", trend: "up" },
    { title: "Satılan Məhsullar (Items)", value: `${totalItems} ədəd`, change: totalItems > 0 ? `+${totalItems}` : "0", trend: "up" },
    { title: "Orta Sifariş Dəyəri (AOV)", value: `${filteredOrders.length > 0 ? (totalSales / filteredOrders.length).toFixed(2) : "0.00"} ₼`, change: "+0.0%", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analitika (Analytics)</h1>
          <p className="text-sm text-gray-500 mt-1">Mağazanızın real performansını izləyin.</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm font-medium cursor-pointer"
        >
          <option value="Son 7 gün">Son 7 gün</option>
          <option value="Son 30 gün">Son 30 gün</option>
          <option value="Bu il">Bu il</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">{kpi.title}</h3>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-black tracking-tight text-gray-900">{kpi.value}</p>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                kpi.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Over Time (Recharts) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Zamana görə satışlar ({timeRange})</h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Canlı statistika</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dx={-10} tickFormatter={(value) => `${value} ₼`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)} ₼`, 'Satış']}
                />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col max-h-96 overflow-hidden">
          <h3 className="font-bold text-gray-900 mb-6">Ən çox satılan məhsullar</h3>
          <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-400 group-hover:text-green-600 group-hover:border-green-200 transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{product.sales} satış</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-md">{product.revenue}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Hələ satış qeydə alınmayıb.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
