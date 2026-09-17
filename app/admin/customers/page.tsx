"use client";

import { useState, useEffect } from "react";
import { Filter, Search, Download, Plus, X, User, Mail, MapPin, ShoppingBag, CreditCard, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCustomers, addCustomerAction, deleteCustomerAction, Customer } from "@/app/actions";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Bütün");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getCustomers().then(data => {
      setCustomers(data || []);
      setIsLoading(false);
    });
  }, []);

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const tabs = ["Bütün", "Yeni", "Geri dönən", "Abunə olanlar"];

  // Search and Filtering
  const filteredCustomers = customers.filter(customer => {
    if (activeTab === "Yeni" && customer.orders > 1) return false;
    if (activeTab === "Geri dönən" && customer.orders <= 1) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!customer.name.toLowerCase().includes(q) && !customer.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Export Logic
  const handleExport = () => {
    const headers = ["ID", "Ad", "Email", "Telefon", "Məkan", "Sifarişlər", "Xərclənən", "Status", "Qoşulma Tarixi"];
    const csvContent = [
      headers.join(","),
      ...customers.map(c => `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.location}","${c.orders}","${c.spent}","${c.status}","${c.joinDate}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tokyo_customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Customer Logic
  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCustomer: Customer = {
      id: `CUS-00${customers.length + 1}`,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || "-",
      location: formData.get("location") as string || "Bakı, Azərbaycan",
      orders: 0,
      spent: "0.00 ₼",
      status: "Aktiv",
      joinDate: new Date().toLocaleDateString("az-AZ", { day: 'numeric', month: 'short', year: 'numeric' })
    };
    
    await addCustomerAction(newCustomer);
    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
  };

  // Delete Customer Logic
  const handleDeleteCustomer = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Bu müştərini silmək istədiyinizə əminsiniz?")) {
      await deleteCustomerAction(id);
      setCustomers(customers.filter(c => c.id !== id));
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Müştərilər (Customers)</h1>
            <p className="text-sm text-gray-500 mt-1">Bütün müştərilərinizi bir yerdən idarə edin.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> İxrac et (Export)
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Müştəri əlavə et
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Tabs */}
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

          {/* Toolbar */}
          <div className="p-4 flex gap-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Müştəriləri axtar (ad və ya e-poçt)..." 
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
              />
            </div>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 whitespace-nowrap">
              <Filter className="w-4 h-4" /> Daha çox filtr
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="px-6 py-3">Müştəri adı</th>
                  <th className="px-6 py-3">Məkan (Location)</th>
                  <th className="px-6 py-3">Sifarişlər</th>
                  <th className="px-6 py-3 text-right">Xərclənən məbləğ</th>
                  <th className="px-6 py-3 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-2" />
                      <p className="text-xs font-medium">Müştərilər yüklənir...</p>
                    </td>
                  </tr>
                ) : currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      onClick={() => setSelectedCustomer(customer)}
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 group-hover:underline underline-offset-4">{customer.name}</div>
                        <div className="text-gray-500 text-[13px] mt-0.5">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-[13px]">{customer.location}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-gray-100 text-gray-700">
                          {customer.orders} sifariş
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black font-mono text-gray-900 text-right">{customer.spent}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => handleDeleteCustomer(customer.id, e)} 
                          className="text-red-400 hover:text-red-600 transition-colors p-1" 
                          title="Sil"
                        >
                          <X className="w-5 h-5 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Axtarışınıza uyğun müştəri tapılmadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {filteredCustomers.length} müştəridən {currentCustomers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} arası göstərilir
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Əvvəlki (Previous)
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Sonrakı (Next)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Slide-over */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%", boxShadow: "-20px 0 25px -5px rgba(0, 0, 0, 0)" }}
              animate={{ x: 0, boxShadow: "-20px 0 25px -5px rgba(0, 0, 0, 0.3)" }}
              exit={{ x: "100%", boxShadow: "-20px 0 25px -5px rgba(0, 0, 0, 0)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-[#F4F4F5] z-50 overflow-y-auto border-l border-gray-200 shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Müştəri Detalları</h2>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-sm font-medium text-gray-500">{selectedCustomer.id}</p>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      selectedCustomer.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Əlaqə Məlumatları</h4>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{selectedCustomer.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm pt-4 border-t border-gray-100 mt-2">
                    <span className="text-gray-500">Qoşulma tarixi:</span>
                    <span className="font-bold text-gray-900">{selectedCustomer.joinDate}</span>
                  </div>
                </div>

                {/* Sales Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-2xl font-black text-gray-900">{selectedCustomer.orders}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase mt-1">Sifariş</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <CreditCard className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xl font-black text-gray-900 font-mono">{selectedCustomer.spent}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase mt-1">Xərclənib</p>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                    className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Müştərini sil
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md flex flex-col relative overflow-hidden">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Müştəri əlavə et</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-6 space-y-5">
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">Ad və Soyad</label>
                <input required name="name" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="Məsələn: Əli Əliyev" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">E-poçt ünvanı</label>
                <input required name="email" type="email" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="ali@example.com" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">Telefon</label>
                <input name="phone" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="+994 50 123 45 67" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">Məkan (Şəhər, Ölkə)</label>
                <input name="location" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400" placeholder="Bakı, Azərbaycan" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Ləğv et
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Yadda saxla
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
