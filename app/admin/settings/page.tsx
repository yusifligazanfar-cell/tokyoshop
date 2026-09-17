"use client";

import { useState, useEffect } from "react";
import { getShippingRates, saveShippingRates, getStoreSettings, saveStoreSettings, type StoreSettings } from "@/app/actions";
import { 
  Store, 
  CreditCard, 
  Truck, 
  Bell, 
  Users, 
  ShieldCheck, 
  Globe, 
  Receipt,
  ChevronRight,
  Save,
  CheckCircle2
} from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    id: "store",
    name: "Mağaza məlumatları",
    description: "Mağazanızın adı, əlaqə məlumatları və ünvanı.",
    icon: Store
  },
  {
    id: "payments",
    name: "Ödəniş üsulları",
    description: "Stripe, PayPal və digər ödəniş təminatçıları.",
    icon: CreditCard
  },
  {
    id: "shipping",
    name: "Çatdırılma",
    description: "Çatdırılma tarifləri, zonaları və qaydaları.",
    icon: Truck
  },
  {
    id: "taxes",
    name: "Vergilər",
    description: "Vergi dərəcələri və hesablamaları.",
    icon: Receipt
  },
  {
    id: "notifications",
    name: "Bildirişlər",
    description: "Müştəri e-poçtları və SMS bildirişləri.",
    icon: Bell
  },
  {
    id: "users",
    name: "İstifadəçilər və İcazələr",
    description: "Komanda üzvləri və onların sistemə çıxış səlahiyyətləri.",
    icon: Users
  },
  {
    id: "policies",
    name: "Qaydalar və Şərtlər",
    description: "Məxfilik siyasəti, qaytarma şərtləri və s.",
    icon: ShieldCheck
  },
  {
    id: "domains",
    name: "Domenlər",
    description: "Mağazanızın veb-sayt ünvanları.",
    icon: Globe
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("store");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(settings => setStoreSettings(settings));
  }, []);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showManageDomainModal, setShowManageDomainModal] = useState<any>(null);
  const [newDomain, setNewDomain] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState<any>(null);
  const [notificationTemplates, setNotificationTemplates] = useState({
    "Sifariş təsdiqi": `Hörmətli müştəri,

Sifarişiniz təsdiqləndi. Bizi seçdiyiniz üçün təşəkkür edirik!

Sifariş nömrəniz: #{"{{order_number}}"}

Hörmətlə,
Tokyo Store komandası`,
    "Çatdırılma yenilənməsi (Göndərildi)": `Hörmətli müştəri,

Sifarişiniz artıq kuryerə təhvil verildi və sizə doğru yoldadır!

Sifariş nömrəniz: #{"{{order_number}}"}

Hörmətlə,
Tokyo Store komandası`,
    "Sifariş ləğvi": `Hörmətli müştəri,

Çox təəssüf ki, sifarişiniz ləğv edildi.

Sifariş nömrəniz: #{"{{order_number}}"}

Hörmətlə,
Tokyo Store komandası`
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Admin" });
  const [users, setUsers] = useState([
    { id: 1, name: "Qəzənfər Yusifli", email: "gazanfaryusifli@gmail.com", role: "Sahib (Owner)", initials: "GY" }
  ]);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [showAddShippingModal, setShowAddShippingModal] = useState(false);
  const [newShipping, setNewShipping] = useState({ name: "", price: "0" });
  
  useEffect(() => {
    getShippingRates().then(rates => setShippingRates(rates));
  }, []);

  const [domains, setDomains] = useState([
    { id: 1, name: "tokyostore.az", isPrimary: true, status: "Qoşulub" }
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    
    if (activeTab === "store" && storeSettings) {
      await saveStoreSettings(storeSettings);
    }
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tənzimləmələr</h1>
          <p className="text-sm text-gray-500 mt-1">Mağazanızın əsas parametrlərini buradan idarə edin.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : showSuccess ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Yadda saxlanılır..." : showSuccess ? "Saxlanıldı!" : "Yadda saxla"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {SETTINGS_SECTIONS.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive 
                    ? 'bg-white shadow-sm border border-gray-200 text-black' 
                    : 'text-gray-600 hover:bg-white/50 hover:text-black border border-transparent'
                }`}
              >
                <section.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                <span className="text-[14px] font-medium">{section.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {activeTab === "store" && storeSettings && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                <h2 className="font-bold text-gray-900">Mağaza məlumatları</h2>
                <p className="text-[13px] text-gray-500 mt-1">Sizin və müştərilərinizin istifadə edəcəyi əsas profil məlumatları.</p>
              </div>
              
              <div className="p-8 space-y-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Mağazanın adı</label>
                      <input 
                        type="text" 
                        value={storeSettings.name}
                        onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Mağazanın əlaqə e-poçtu</label>
                      <input 
                        type="email" 
                        value={storeSettings.contactEmail}
                        onChange={(e) => setStoreSettings({...storeSettings, contactEmail: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Müştəri xidmətləri e-poçtu</label>
                      <input 
                        type="email" 
                        value={storeSettings.supportEmail}
                        onChange={(e) => setStoreSettings({...storeSettings, supportEmail: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Telefon nömrəsi</label>
                      <input 
                        type="tel" 
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Ünvan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Ölkə/Region</label>
                      <input 
                        type="text" 
                        value={storeSettings.country}
                        onChange={(e) => setStoreSettings({...storeSettings, country: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Şəhər</label>
                      <input 
                        type="text" 
                        value={storeSettings.city}
                        onChange={(e) => setStoreSettings({...storeSettings, city: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Küçə, bina, mənzil</label>
                    <input 
                      type="text" 
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow" 
                    />
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Standart və Formatlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Valyuta</label>
                      <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 font-medium cursor-not-allowed">AZN (Azərbaycan Manatı)</div>
                      <p className="text-[11px] text-gray-500 mt-2">Əsas valyutanı dəyişmək üçün dəstək komandası ilə əlaqə saxlayın.</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">Saat qurşağı</label>
                      <select 
                        value={storeSettings.timezone}
                        onChange={(e) => setStoreSettings({...storeSettings, timezone: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-shadow bg-white"
                      >
                        <option value="Baku">(GMT+04:00) Baku</option>
                        <option value="Istanbul">(GMT+03:00) Istanbul</option>
                        <option value="London">(GMT+00:00) London</option>
                        <option value="New_York">(GMT-05:00) New York</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "shipping" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-gray-900">Çatdırılma tarifləri</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Haraya və hansı qiymətə çatdırılma etdiyinizi tənzimləyin.</p>
                </div>
                <button onClick={() => setShowAddShippingModal(true)} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Yeni tarif yarat</button>
              </div>
              <div className="p-6 space-y-6">
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <h3 className="font-bold text-gray-900 text-sm">Azərbaycan (Daxili)</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {shippingRates.length === 0 ? (
                       <p className="text-sm text-gray-500 text-center py-4">Hələ heç bir çatdırılma tarifi əlavə edilməyib.</p>
                    ) : (
                      shippingRates.map((rate) => (
                        <div key={rate.id} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                          <span className="text-gray-700">{rate.name}</span>
                          <div className="flex items-center gap-4">
                            <span className={`font-bold ${rate.price === 0 ? 'text-green-600' : ''}`}>
                              {rate.price === 0 ? 'Pulsuz' : `${rate.price.toFixed(2)} ₼`}
                            </span>
                            <button 
                              onClick={async () => {
                                const newRates = shippingRates.filter(r => r.id !== rate.id);
                                setShippingRates(newRates);
                                await saveShippingRates(newRates);
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Add Shipping Modal */}
              {showAddShippingModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Yeni çatdırılma tarifi</h2>
                    <div className="space-y-4 mb-6 mt-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Tarifin adı (Məs: Ekspress çatdırılma)</label>
                        <input 
                          type="text" 
                          value={newShipping.name}
                          onChange={(e) => setNewShipping({...newShipping, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Qiyməti (AZN)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={newShipping.price}
                          onChange={(e) => setNewShipping({...newShipping, price: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setShowAddShippingModal(false); setNewShipping({name: "", price: "0"}); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Ləğv et</button>
                      <button onClick={async () => {
                        if (newShipping.name) {
                          const newRate = { id: Date.now(), name: newShipping.name, price: parseFloat(newShipping.price) || 0 };
                          const newRates = [...shippingRates, newRate];
                          setShippingRates(newRates);
                          await saveShippingRates(newRates);
                          setNewShipping({name: "", price: "0"});
                          setShowAddShippingModal(false);
                        }
                      }} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Əlavə et</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "taxes" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                <h2 className="font-bold text-gray-900">Vergilər</h2>
                <p className="text-[13px] text-gray-500 mt-1">Məhsul qiymətlərinə daxil olan vergi dərəcələri.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="taxIncluded" defaultChecked className="mt-1 border-gray-300 rounded text-black focus:ring-black" />
                  <div>
                    <label htmlFor="taxIncluded" className="font-medium text-gray-900 text-sm">Bütün qiymətlərə vergi daxildir</label>
                    <p className="text-xs text-gray-500 mt-1">Müştərilər ödəniş səhifəsində əlavə vergi görməyəcəklər.</p>
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">Ölkə vergiləri</h3>
                  <div className="flex justify-between items-center text-sm p-4 border border-gray-200 rounded-xl">
                    <span className="text-gray-700 font-medium">Azərbaycan (ƏDV)</span>
                    <span className="font-bold">18%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                <h2 className="font-bold text-gray-900">Müştəri bildirişləri</h2>
                <p className="text-[13px] text-gray-500 mt-1">Müştərilərə avtomatik göndərilən e-poçtlar.</p>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Sifariş təsdiqi</td>
                      <td className="p-4 text-right"><button onClick={() => setShowNotificationModal("Sifariş təsdiqi")} className="text-blue-600 hover:underline">Şablonu redaktə et</button></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Çatdırılma yenilənməsi (Göndərildi)</td>
                      <td className="p-4 text-right"><button onClick={() => setShowNotificationModal("Çatdırılma yenilənməsi (Göndərildi)")} className="text-blue-600 hover:underline">Şablonu redaktə et</button></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Sifariş ləğvi</td>
                      <td className="p-4 text-right"><button onClick={() => setShowNotificationModal("Sifariş ləğvi")} className="text-blue-600 hover:underline">Şablonu redaktə et</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Notification Template Modal */}
              {showNotificationModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col h-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{showNotificationModal}</h2>
                        <p className="text-sm text-gray-500 mt-1">Müştəriyə göndəriləcək e-poçt şablonu</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto min-h-0 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-gray-700 block mb-2">E-poçt mətni</label>
                          <textarea 
                            rows={10} 
                            value={notificationTemplates[showNotificationModal as keyof typeof notificationTemplates]}
                            onChange={(e) => setNotificationTemplates({
                              ...notificationTemplates, 
                              [showNotificationModal]: e.target.value
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-mono" 
                          />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-2">Dəstəklənən dəyişənlər:</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600">{"{{order_number}}"}</span>
                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600">{"{{customer_name}}"}</span>
                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600">{"{{total_price}}"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button onClick={() => setShowNotificationModal(null)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Ləğv et</button>
                      <button onClick={() => setShowNotificationModal(null)} className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800">Yadda saxla</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "users" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-gray-900">İstifadəçilər</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Admin panelə girişi olan komanda üzvləri.</p>
                </div>
                <button onClick={() => setShowAddUserModal(true)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800">İstifadəçi əlavə et</button>
              </div>
              <div className="p-6 space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {user.initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${user.role === 'Sahib (Owner)' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Yeni komanda üzvü əlavə et</h2>
                    <p className="text-sm text-gray-500 mb-6">Bu istifadəçiyə admin panelə giriş icazəsi veriləcək.</p>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Ad və Soyad</label>
                        <input 
                          type="text" 
                          placeholder="Məsələn: Əli Əliyev" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">E-poçt</label>
                        <input 
                          type="email" 
                          placeholder="ali@tokyostore.az" 
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Səlahiyyət (Rol)</label>
                        <select 
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm bg-white"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Meneçer">Meneçer</option>
                          <option value="Müştəri Xidmətləri">Müştəri Xidmətləri</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setShowAddUserModal(false); setNewUser({name: "", email: "", role: "Admin"}); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Ləğv et</button>
                      <button onClick={() => {
                        if (newUser.name && newUser.email) {
                          const initials = newUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          setUsers([...users, { id: Date.now(), name: newUser.name, email: newUser.email, role: newUser.role, initials }]);
                          setNewUser({name: "", email: "", role: "Admin"});
                          setShowAddUserModal(false);
                        }
                      }} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Əlavə et</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "policies" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                <h2 className="font-bold text-gray-900">Mağaza qaydaları</h2>
                <p className="text-[13px] text-gray-500 mt-1">Müştərilərin Check-out səhifəsində gördüyü qaydalar.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Qaytarma siyasəti (Refund policy)</label>
                  <textarea rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" defaultValue="Məhsulları 30 gün ərzində qaytara bilərsiniz..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Məxfilik siyasəti (Privacy policy)</label>
                  <textarea rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" defaultValue="Şəxsi məlumatlarınız qorunur..." />
                </div>
              </div>
            </div>
          )}

          
          {activeTab === "domains" && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                <h2 className="font-bold text-gray-900">Domenlər</h2>
                <p className="text-[13px] text-gray-500 mt-1">Müştərilərin saytınıza daxil olmaq üçün istifadə etdiyi ünvanlar.</p>
              </div>
              <div className="p-6 space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{domain.name}</h3>
                        <p className="text-xs text-green-700 mt-0.5">{domain.isPrimary ? "Əsas domen • " : ""}{domain.status}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowManageDomainModal(domain)} className="text-sm font-medium text-gray-700 hover:text-black bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-colors">İdarə et</button>
                  </div>
                ))}
                
                <button onClick={() => setShowDomainModal(true)} className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-blue-600 hover:bg-gray-50 hover:border-blue-300 transition-colors">
                  + Yeni domen qoş
                </button>
              </div>

              {/* Add Domain Modal */}
              {showDomainModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Yeni domen qoş</h2>
                    <p className="text-sm text-gray-500 mb-6">Mövcud domeninizi bura əlavə edərək mağazanıza yönləndirə bilərsiniz.</p>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Domen adı</label>
                        <input 
                          type="text" 
                          placeholder="misal.com" 
                          value={newDomain}
                          onChange={(e) => setNewDomain(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setShowDomainModal(false); setNewDomain(""); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Ləğv et</button>
                      <button onClick={() => {
                        if (newDomain) {
                          setDomains([...domains, { id: Date.now(), name: newDomain, isPrimary: false, status: "Doğrulanır..." }]);
                          setNewDomain("");
                          setShowDomainModal(false);
                          
                          // Mock verification
                          setTimeout(() => {
                            setDomains(prev => prev.map(d => d.name === newDomain ? { ...d, status: "Qoşulub" } : d));
                          }, 2000);
                        }
                      }} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Qoş</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manage Domain Modal */}
              {showManageDomainModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Domeni idarə et</h2>
                    <p className="text-sm text-gray-500 mb-6">Domenin DNS parametrlərinə baxın və ya domeni sistemdən silin.</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">A Record</span>
                        <p className="text-sm font-mono font-medium text-gray-900 mt-1">76.76.21.21</p>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">CNAME</span>
                        <p className="text-sm font-mono font-medium text-gray-900 mt-1">cname.tokyostore.az</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button className="text-sm font-bold text-red-600 hover:text-red-800" onClick={() => setShowManageDomainModal(false)}>Domeni sil</button>
                      <button onClick={() => setShowManageDomainModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Bağla</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
