"use client";

import { useState, useEffect } from "react";
import { Filter, Search, Download, X, MoreHorizontal, Copy, CheckCircle2, Truck, CreditCard, Printer, ExternalLink, Clock, Package, MapPin, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders, deleteOrder, updateOrderAction, Order } from "@/app/actions";

import Image from "next/image";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data || []);
      setIsLoading(false);
    });
  }, []);

  const [activeTab, setActiveTab] = useState("Bütün");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tabs = ["Bütün", "İcra olunmamış", "Ödənilməmiş", "Qaytarılmış"];

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    if (activeTab === "İcra olunmamış" && order.fulfillment !== "İcra olunmayıb") return false;
    if (activeTab === "Ödənilməmiş" && order.payment !== "Gözləyir") return false;
    if (activeTab === "Qaytarılmış" && order.fulfillment !== "Qaytarılıb") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!order.id.toLowerCase().includes(q) && !order.customer.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setIsMenuOpen(false); // reset menu state
  };

  const handleExport = () => {
    const headers = ["ID", "Tarix", "Müştəri", "Email", "Total", "Ödəniş", "İcra"];
    const csvContent = [
      headers.join(","),
      ...orders.map((o: Order) => `"${o.id}","${o.date}","${o.customer}","${o.email}","${o.total}","${o.payment}","${o.fulfillment}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tokyo_orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDeleteOrder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Bu sifarişi silmək istədiyinizə əminsiniz?")) {
      const res = await deleteOrder(id);
      if(res.success) {
        setOrders(orders.filter((o: Order) => o.id !== id));
        if(selectedOrder?.id === id) setSelectedOrder(null);
      }
    }
  };

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const priceRaw = parseFloat(formData.get("price") as string) || 0;
    const newOrder = {
      id: `#10${24 + orders.length}`,
      date: "İndi",
      customer: formData.get("customer") as string,
      email: formData.get("email") as string || "musteri@tokyo.az",
      phone: "-",
      total: `$${priceRaw.toFixed(2)}`,
      payment: "Ödənilib",
      fulfillment: "İcra olunmayıb",
      items: 1,
      address: "Məlumat yoxdur",
      products: [
        { name: formData.get("productName") as string, qty: 1, price: `$${priceRaw.toFixed(2)}`, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100" }
      ],
      timeline: [
        { time: "İndi", title: "Sifariş yaradıldı", desc: "Admin tərəfindən daxil edildi.", icon: "cart" },
        { time: "İndi", title: "Ödəniş qəbul edildi", desc: `$${priceRaw.toFixed(2)} (Nağd).`, icon: "payment" },
      ]
    };
    
    setOrders([newOrder, ...orders]);
    setIsCreateModalOpen(false);
  };

  const handleOrderAction = async (status: string, fulfillment: string, desc: string, icon: string, finalPayment?: string) => {
    if (!selectedOrder) return;
    const time = new Date().toLocaleString("az-AZ");
    
    const updated = {
      ...selectedOrder,
      fulfillment: fulfillment,
      payment: finalPayment || selectedOrder.payment,
      timeline: [
        ...selectedOrder.timeline,
        { time, title: status, desc, icon }
      ]
    };
    
    const res = await updateOrderAction(updated);
    if(res.success) {
      setOrders(orders.map((o: Order) => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sifarişlər</h1>
          <div className="flex gap-3">
            <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> İxrac et
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Sifariş yarat
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-2 pt-2 border-b border-gray-200 flex gap-2 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 flex gap-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="ID və ya adla axtarış..." 
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
              />
            </div>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 whitespace-nowrap">
              <Filter className="w-4 h-4" /> Daha çox filtr
            </button>
          </div>

          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="px-6 py-3">Sifariş</th>
                  <th className="px-6 py-3">Tarix</th>
                  <th className="px-6 py-3">Müştəri</th>
                  <th className="px-6 py-3">Ödəniş</th>
                  <th className="px-6 py-3">İcra</th>
                  <th className="px-6 py-3">Məhsul</th>
                  <th className="px-6 py-3 text-right">Cəmi</th>
                  <th className="px-6 py-3 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-2" />
                      <p className="text-xs font-medium">Sifarişlər yüklənir...</p>
                    </td>
                  </tr>
                ) : currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => openOrder(order)}
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="px-6 py-4 font-bold text-gray-900 group-hover:underline underline-offset-4">{order.id}</td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                      <td className="px-6 py-4 font-medium">{order.customer}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                          order.payment === 'Ödənilib' ? 'bg-green-100 text-green-800' :
                          order.payment === 'Gözləyir' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                          order.fulfillment === 'İcra olunub' ? 'bg-green-100 text-green-800' :
                          order.fulfillment === 'İcra olunmayıb' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.fulfillment}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.items} ədəd</td>
                      <td className="px-6 py-4 font-medium text-right">{order.total}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={(e) => handleDeleteOrder(order.id, e)} className="text-red-400 hover:text-red-600 transition-colors" title="Sil">
                          <X className="w-5 h-5 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      Axtarışınıza uyğun sifariş tapılmadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {filteredOrders.length} sifarişdən {currentOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} arası göstərilir
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Əvvəlki
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Sonrakı
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Slide-over */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 md:inset-10 bg-[#F4F4F5] z-50 overflow-y-auto md:rounded-2xl shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200 sticky top-0 z-30">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedOrder.id}</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">{selectedOrder.date}</p>
                </div>
                <div className="flex gap-3 relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {/* Dropdown Menu for 3 dots */}
                  {isMenuOpen && (
                    <div className="absolute top-12 right-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                      <button 
                        onClick={() => { window.print(); setIsMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Printer className="w-4 h-4 mr-2" /> Çap et
                      </button>
                      <button 
                        onClick={() => { window.open('/track?id=' + selectedOrder.id.replace('#',''), '_blank'); setIsMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> Sifariş statusu
                      </button>
                    </div>
                  )}

                  <button onClick={() => setSelectedOrder(null)} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                
                {/* Status Badges */}
                <div className="flex gap-4">
                  <div className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold ${
                    selectedOrder.payment === 'Ödənilib' ? 'bg-green-100 text-green-800' :
                    selectedOrder.payment === 'Gözləyir' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {selectedOrder.payment === 'Ödənilib' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                    {selectedOrder.payment}
                  </div>
                  <div className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold ${
                    selectedOrder.fulfillment === 'İcra olunub' ? 'bg-green-100 text-green-800' :
                    selectedOrder.fulfillment === 'İcra olunmayıb' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {selectedOrder.fulfillment === 'İcra olunub' ? <Truck className="w-4 h-4 mr-2" /> : <Package className="w-4 h-4 mr-2" />}
                    {selectedOrder.fulfillment}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Timeline & Products (takes 2/3 width) */}
                  <div className="md:col-span-2 space-y-8">
                    
                    {/* Products list */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Məhsullar ({selectedOrder.items} ədəd)</h3>
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {selectedOrder.products.map((prod: any, idx: number) => (
                          <li key={idx} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                {prod.image ? (
                                  <Image src={prod.image} alt={prod.name} fill className="object-cover" sizes="56px" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-400">ŞƏKİL</div>
                                )}
                              </div>
                              <div>
                                <p className="text-[15px] font-bold text-gray-900">{prod.name}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1">Say: {prod.qty}</p>
                              </div>
                            </div>
                            <span className="text-base font-black font-mono">{prod.price}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-6 bg-gray-50/50 border-t border-gray-200 space-y-3">
                        <div className="flex justify-between items-center text-[15px] text-gray-500 font-medium">
                          <span>Aralıq cəm</span>
                          <span className="font-mono">{selectedOrder.total}</span>
                        </div>
                        <div className="flex justify-between items-center text-[15px] text-gray-500 font-medium">
                          <span>Çatdırılma</span>
                          <span className="font-mono">$0.00</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="font-black text-gray-900 uppercase tracking-widest">Yekun məbləğ</span>
                          <span className="font-black text-2xl text-black font-mono">{selectedOrder.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline (Shopify style) */}
                    {selectedOrder.timeline && (
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest border-b border-gray-100 pb-4">Tarixçə (Timeline)</h3>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                          {selectedOrder.timeline.map((event: any, idx: number) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                                {event.icon === 'cart' && <Package className="w-4 h-4" />}
                                {event.icon === 'payment' && <CreditCard className="w-4 h-4" />}
                                {event.icon === 'truck' && <Truck className="w-4 h-4" />}
                                {event.icon === 'check' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                {event.icon === 'clock' && <Clock className="w-4 h-4" />}
                              </div>
                              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm relative">
                                <span className="absolute -top-3 left-4 md:left-auto md:right-4 bg-white text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-100">{event.time}</span>
                                <h4 className="font-bold text-gray-900 text-sm mt-1">{event.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{event.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Customer & Shipping (takes 1/3 width) */}
                  <div className="space-y-8">
                    {/* Customer Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 mb-5 uppercase tracking-widest border-b border-gray-100 pb-4">Müştəri</h3>
                      <div className="space-y-4 text-[14px]">
                        <div>
                          <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Ad</span>
                          <span className="font-bold text-gray-900">{selectedOrder.customer}</span>
                        </div>
                        <div className="group">
                          <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">E-poçt</span>
                          <div className="flex items-center text-blue-600 font-bold">
                            {selectedOrder.email}
                            <Copy className="w-3.5 h-3.5 ml-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-gray-400 hover:text-gray-900" />
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Telefon</span>
                          <span className="font-bold text-gray-900">{selectedOrder.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 mb-5 uppercase tracking-widest border-b border-gray-100 pb-4">Çatdırılma ünvanı</h3>
                      <div className="flex items-start text-gray-800">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
                        <p className="text-[14px] font-medium leading-relaxed">
                          <span className="font-bold text-black block mb-1">{selectedOrder.customer}</span>
                          {selectedOrder.address.split(',').map((part: string, i: number) => <span key={i} className="text-gray-600 block">{part.trim()}</span>)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 pb-12 border-t border-gray-200 mt-8">
                  <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Sifarişin idarəedilməsi</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button onClick={() => handleOrderAction("Hazırlanır", "Hazırlanır", "Müştərinin e-poçt ünvanına (Hazırlanır) mesajı göndərildi.", "package")} className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-left flex items-center justify-between group">
                      Hazırlanır
                      <span className="text-gray-400 group-hover:text-gray-700">📦</span>
                    </button>
                    <button onClick={() => handleOrderAction("Kuryerə təhvil verildi", "İcra olunub", "Müştərinin e-poçt ünvanına (Kuryerə təhvil verildi) mesajı göndərildi.", "truck")} className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-left flex items-center justify-between group">
                      Kuryerə ver
                      <span className="text-gray-400 group-hover:text-gray-700">🛵</span>
                    </button>
                    <button onClick={() => handleOrderAction("Poçta təhvil verildi", "İcra olunub", "Müştərinin e-poçt ünvanına (Poçta təhvil verildi) mesajı göndərildi.", "truck")} className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-left flex items-center justify-between group">
                      Poçta ver
                      <span className="text-gray-400 group-hover:text-gray-700">🏤</span>
                    </button>
                    <button onClick={() => handleOrderAction("Dəyişmə", "Dəyişdirilir", "Sifarişin dəyişdirilməsi barədə qeyd yaradıldı.", "clock")} className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm text-left flex items-center justify-between group">
                      Dəyişmə
                      <span className="text-blue-400 group-hover:text-blue-600">🔄</span>
                    </button>
                    <button onClick={() => handleOrderAction("Qaytarılma", "Qaytarılıb", "Sifariş geri qaytarıldı. Müştəriyə (Qaytarılma) e-poçtu göndərildi.", "clock", "Geri qaytarılıb")} className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-colors shadow-sm text-left flex items-center justify-between group">
                      Qaytarılma
                      <span className="text-orange-400 group-hover:text-orange-600">↩️</span>
                    </button>
                    <button onClick={() => handleOrderAction("Ləğv edildi", "Ləğv edilib", "Sifariş ləğv edildi. Müştəriyə (Ləğv edildi) e-poçtu göndərildi.", "clock", "Ləğv edilib")} className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl font-bold text-sm text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors shadow-sm text-left flex items-center justify-between group">
                      Ləğv et
                      <span className="text-red-400 group-hover:text-red-600">❌</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md flex flex-col relative overflow-hidden">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Yeni sifariş yarat</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">Müştəri adı</label>
                <input required name="customer" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="Məsələn: Əli Əliyev" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">E-poçt ünvanı</label>
                <input name="email" type="email" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="ali@example.com" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">Məhsul adı</label>
                <input required name="productName" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="Qara Köynək" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">Məbləğ ($)</label>
                <input required name="price" type="number" step="0.01" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="50.00" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Ləğv et
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Sifarişi Yarat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
