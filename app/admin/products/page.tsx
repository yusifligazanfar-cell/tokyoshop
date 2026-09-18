"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Filter, MoreHorizontal, Plus, Search, X, UploadCloud, ChevronDown } from "lucide-react";
import { getProducts, addProduct as addProductAction, updateProduct as updateProductAction, deleteProduct, Product } from "@/app/actions";
import { compressImage } from "@/lib/utils";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("Bütün");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  
  useEffect(() => {
    getProducts().then(fetchedProducts => {
      setProducts(fetchedProducts || []);
      setIsLoading(false);
    });
  }, []);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [price, setPrice] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);

  // Profit/Margin calc
  const profit = price - cost;
  const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : 0;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsCompressing(true);
      try {
        for (const file of files) {
          // 6MB+ və ya istənilən böyük şəkli avtomatik sıxışdırıb yüngül WebP formatına salır
          const compressedBase64 = await compressImage(file, 1400, 0.82);
          setImagesPreview(prev => [...prev, compressedBase64]);
        }
      } catch (err) {
        console.error("Şəkil sıxışdırmada xəta:", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
    setImagesPreview([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPrice(0);
    setCost(0);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagesPreview(product.image ? [product.image] : []);
    setSelectedSizes(product.sizes || []);
    setSelectedColors(product.colors || []);
    const pPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    setPrice(isNaN(pPrice) ? 0 : pPrice);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) {
      setProducts(products.filter(p => p.id !== id));
      await deleteProduct(id);
      handleModalClose();
    }
  };

  const tabs = ["Bütün", "Aktiv", "Qaralama", "Arxiv"];

  const filteredProducts = products.filter(product => {
    const matchesTab = activeTab === "Bütün" || product.status === activeTab;
    const matchesSearch = searchQuery.trim() === "" || 
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.vendor && product.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.type && product.type.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleExport = () => { /* Export Logic */ };
  const handleImportClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* Import Logic */ };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let totalInventory = 0;
    const hasVariants = selectedSizes.length > 0 || selectedColors.length > 0;
    if (hasVariants) {
      const sizes = selectedSizes.length > 0 ? selectedSizes : ['Standard'];
      const colors = selectedColors.length > 0 ? selectedColors : ['Standard'];
      sizes.forEach(size => {
        colors.forEach(color => {
           const val = formData.get(`inventory_${size}_${color}`);
           if (val) totalInventory += parseInt(val as string, 10);
        });
      });
    } else {
      totalInventory = parseInt((formData.get("inventory") as string) || "0", 10);
    }
    
    const inventoryMatrix: Record<string, number> = {};
    if (hasVariants) {
      const sizes = selectedSizes.length > 0 ? selectedSizes : ['Standard'];
      const colors = selectedColors.length > 0 ? selectedColors : ['Standard'];
      sizes.forEach(size => {
        colors.forEach(color => {
           const val = formData.get(`inventory_${size}_${color}`);
           if (val) inventoryMatrix[`${size}_${color}`] = parseInt(val as string, 10);
        });
      });
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `PRD-00${products.length + 1}`,
      name: formData.get("name") as string || "Yeni Məhsul",
      description: formData.get("description") as string || "",
      status: formData.get("status") as string || "Qaralama",
      inventory: `${totalInventory} ədəd`,
      type: formData.get("type") as string || "Geyim",
      vendor: formData.get("vendor") as string || "Tokyo",
      price: `${formData.get("price") || "0.00"} ₼`,
      image: imagesPreview.length > 0 ? imagesPreview[0] : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100",
      sizes: selectedSizes,
      colors: selectedColors,
      inventoryMatrix: inventoryMatrix,
      placement: formData.getAll("collections") as string[]
    };
    
    if (editingProduct) {
      await updateProductAction(newProduct);
      setProducts(products.map(p => p.id === newProduct.id ? newProduct : p));
    } else {
      await addProductAction(newProduct);
      setProducts([newProduct, ...products]);
    }
    
    handleModalClose();
  };

  // Default color list for the UI
  const availableColors = [
    { name: 'Black', hex: '#18181b' },
    { name: 'White', hex: '#fbfbfb' },
    { name: 'Charcoal', hex: '#3f3f46' },
    { name: 'Navy', hex: '#1e293b' },
    { name: 'Beige', hex: '#e5e0d8' },
    { name: 'Olive', hex: '#4b5320' },
    { name: 'Red', hex: '#991b1b' },
    { name: 'Blue', hex: '#2563eb' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Məhsullar</h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            İxrac et
          </button>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={handleImportClick} className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            İdxal et
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Məhsul əlavə et
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="px-2 pt-2 border-b border-gray-200 flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>

        <div className="p-4 flex gap-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Məhsulları axtar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300" 
            />
          </div>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" /> Daha çox filtr
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-6 py-3">Məhsul</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">İnventar</th>
                <th className="px-6 py-3">Növ</th>
                <th className="px-6 py-3">İstehsalçı</th>
                <th className="px-6 py-3 text-right">Qiymət</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-2" />
                    <p className="text-xs font-medium">Məhsullar yüklənir...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-sm font-medium">Heç bir məhsul tapılmadı</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} onClick={(e) => { if ((e.target as HTMLElement).tagName !== 'INPUT') handleEditProduct(product); }} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-gray-900 group-hover:underline underline-offset-4">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${product.status === 'Aktiv' ? 'bg-green-100 text-green-800' : product.status === 'Qaralama' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.inventory}</td>
                    <td className="px-6 py-4 text-gray-500">{product.type}</td>
                    <td className="px-6 py-4 text-gray-500">{product.vendor}</td>
                    <td className="px-6 py-4 font-medium text-right">{product.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Shopify Style in AZ) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto transition-opacity">
          <div className="bg-[#F4F4F5] rounded-xl shadow-2xl border border-gray-200 w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-4">
                <button type="button" onClick={handleModalClose} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Məhsulu yenilə' : 'Məhsul əlavə et'}</h2>
              </div>
              <div className="flex gap-3 items-center">
                {editingProduct && (
                   <button type="button" onClick={() => handleDeleteProduct(editingProduct.id)} className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 shadow-sm transition-colors mr-2">
                     Sil
                   </button>
                )}
                <button type="button" onClick={handleModalClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm">
                  Ləğv et
                </button>
                <button type="button" onClick={(e) => {
                  const form = document.getElementById("productForm") as HTMLFormElement;
                  if(form) form.requestSubmit();
                }} className="px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 shadow-sm transition-colors">
                  Yadda saxla
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="productForm" onSubmit={handleAddProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                
                {/* Left Column (Main details) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Title & Description */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
                    <div className="space-y-1">
                      <label className="block text-[13px] font-medium text-gray-700">Başlıq</label>
                      <input required name="name" type="text" defaultValue={editingProduct?.name} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="Məsələn: Qısaqol T-shirt" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[13px] font-medium text-gray-700">Təsvir</label>
                      <textarea required name="description" defaultValue={editingProduct?.description} rows={5} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 resize-none" placeholder="Məhsul haqqında ətraflı məlumat..."></textarea>
                    </div>
                  </div>

                  {/* Media (Multiple Images with Auto-Compression) */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[14px] font-bold text-gray-900">Media (Şəkillər)</label>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ⚡ Avtomatik Sıxışdırma Aktivdir (MB ➔ KB WebP)
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-1">
                      Şəkilləri seçin. Sistem 5-10 MB-lıq böyük şəkilləri avtomatik olaraq yüksək keyfiyyətli yüngül KB ölçüsünə salır.
                    </p>
                    
                    {isCompressing && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2.5 rounded-lg border border-blue-100 animate-pulse">
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Şəkillər sıxışdırılır və optimallaşdırılır...</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                      {imagesPreview.map((src, index) => (
                        <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                          <Image src={src} alt="Preview" fill className="object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-400 hover:text-green-600" onClick={() => uploadInputRef.current?.click()}>
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-[12px] font-medium">Əlavə et</span>
                      </div>
                    </div>
                    <input ref={uploadInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </div>

                  {/* Pricing (with Profit and Margin) */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <label className="block text-[14px] font-bold text-gray-900">Qiymət (Pricing)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">Qiymət (Price)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₼</span>
                          <input required name="price" type="number" step="0.01" value={price || ""} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">Endirimsiz qiymət (Compare-at)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₼</span>
                          <input type="number" step="0.01" className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="0.00" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-600" />
                        <span className="text-[13px] text-gray-700">Bu məhsul üçün vergi hesabla (Charge tax on this product)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">Maya dəyəri (Cost)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₼</span>
                          <input type="number" step="0.01" value={cost || ""} onChange={(e) => setCost(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">Gəlir (Profit)</label>
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-medium text-gray-700">
                          {profit > 0 ? `₼${profit.toFixed(2)}` : "--"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">Marja (Margin)</label>
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-medium text-gray-700">
                          {Number(margin) > 0 ? `${margin}%` : "--"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory & Shipping */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
                    <label className="block text-[14px] font-bold text-gray-900">İnventar və Çatdırılma</label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">Ümumi Say (Total Quantity)</label>
                        <input name="inventory" type="number" disabled={selectedSizes.length > 0 || selectedColors.length > 0} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 disabled:bg-gray-50" placeholder={selectedSizes.length > 0 || selectedColors.length > 0 ? "Avtomatik hesablanır" : "0"} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[13px] font-medium text-gray-700">SKU (Anbar Kodu)</label>
                        <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" />
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-600" />
                        <span className="text-[13px] text-gray-700">İnventarı izlə (Inventory tracked)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-600" />
                        <span className="text-[13px] text-gray-700">Bitdikdə belə satmağa davam et (Sell when out of stock)</span>
                      </label>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-gray-100">
                      <label className="block text-[13px] font-medium text-gray-700">Fiziki Məhsul Çəkisi (kq)</label>
                      <input type="number" step="0.1" className="w-1/2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="0.0" />
                    </div>
                  </div>

                  {/* Options: Sizes & Colors Grid */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
                    <label className="block text-[14px] font-bold text-gray-900">Variantlar (Seçimlər)</label>
                    <p className="text-[12px] text-gray-500 mb-4">Hansı ölçü və rənglərin stokda olduğunu seçin.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-[13px] font-medium text-gray-700">Mövcud Ölçülər</label>
                        <div className="grid grid-cols-3 gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50/50 shadow-inner">
                          {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                            <label key={size} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => toggleSize(size)} className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded checked:border-green-600 checked:bg-green-600 transition-all focus:ring-2 focus:ring-green-600/20" />
                                <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none scale-50 peer-checked:scale-100 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <span className="text-[13px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{size}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[13px] font-medium text-gray-700">Mövcud Rənglər</label>
                        <div className="grid grid-cols-2 gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50/50 shadow-inner max-h-[160px] overflow-y-auto custom-scrollbar">
                          {availableColors.map((color) => (
                            <label key={color.name} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                              <div className="relative flex items-center justify-center shrink-0">
                                <input type="checkbox" checked={selectedColors.includes(color.name)} onChange={() => toggleColor(color.name)} className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded checked:border-green-600 checked:bg-green-600 transition-all focus:ring-2 focus:ring-green-600/20" />
                                <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none scale-50 peer-checked:scale-100 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div className="w-3 h-3 rounded-full border border-gray-200 shadow-sm shrink-0" style={{ backgroundColor: color.hex }}></div>
                              <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors truncate" title={color.name}>{color.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Matrix (Auto-generates inputs for selected variants) */}
                    {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                      <div className="pt-6 mt-4 border-t border-gray-100">
                        <label className="block text-[13px] font-medium text-gray-700 mb-3">Seçilmiş Variantların Sayı (Stok)</label>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[12px] text-gray-600">
                              <tr>
                                {selectedSizes.length > 0 && <th className="px-4 py-2 font-medium">Ölçü</th>}
                                {selectedColors.length > 0 && <th className="px-4 py-2 font-medium">Rəng</th>}
                                <th className="px-4 py-2 font-medium text-right">Anbarda (Stok)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-[13px]">
                              {(selectedSizes.length > 0 ? selectedSizes : ['Standard']).map((size) => (
                                (selectedColors.length > 0 ? selectedColors : ['Standard']).map((color) => (
                                  <tr key={`${size}_${color}`} className="hover:bg-gray-50/50 transition-colors">
                                    {selectedSizes.length > 0 && <td className="px-4 py-2 font-bold text-gray-800">{size}</td>}
                                    {selectedColors.length > 0 && <td className="px-4 py-2 font-medium text-gray-600">{color}</td>}
                                    <td className="px-4 py-2 text-right">
                                      <input type="number" name={`inventory_${size}_${color}`} defaultValue={editingProduct?.inventoryMatrix?.[`${size}_${color}`] || "0"} min="0" className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-right ml-auto" />
                                    </td>
                                  </tr>
                                ))
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column (Organization & Status) */}
                <div className="space-y-6">
                  
                  {/* Status */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <label className="block text-[14px] font-bold text-gray-900">Status</label>
                    <select name="status" defaultValue={editingProduct?.status || "Aktiv"} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600">
                      <option value="Aktiv">Aktiv (Active)</option>
                      <option value="Qaralama">Qaralama (Draft)</option>
                    </select>
                  </div>

                  {/* Publishing */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-[14px] font-bold text-gray-900">Yayımlanma (Publishing)</label>
                    </div>
                    <ul className="text-[13px] text-gray-700 space-y-2">
                      <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Onlayn Mağaza</li>
                      <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Satış Nöqtəsi (POS)</li>
                    </ul>
                  </div>

                  {/* Product Organization */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
                    <label className="block text-[14px] font-bold text-gray-900">Məhsulun təşkili</label>
                    
                    <div className="space-y-1">
                      <label className="block text-[13px] font-medium text-gray-700">Məhsul növü (Type)</label>
                      <input name="type" type="text" defaultValue={editingProduct?.type || ""} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="Məs: Geyim" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[13px] font-medium text-gray-700">İstehsalçı (Vendor)</label>
                      <input name="vendor" type="text" defaultValue={editingProduct?.vendor || "Tokyo"} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[13px] font-medium text-gray-700">Kolleksiyalar (Collections)</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50/50 custom-scrollbar">
                        {[
                          { id: 'bestseller', label: 'Bestseller' },
                          { id: 'new-arrivals', label: 'New Arrivals' },
                          { id: 'shop', label: 'Shop All (View All)' },
                          { id: 'hoodie', label: 'Hoodies' },
                          { id: 'tshirt', label: 'T-Shirts' },
                          { id: 'accessory', label: 'Accessory' },
                          { id: 'outfit', label: 'Outfit' },
                        ].map(col => (
                          <label key={col.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                            <div className="relative flex items-center justify-center">
                              <input type="checkbox" name="collections" value={col.id} defaultChecked={editingProduct?.placement?.includes(col.id)} className="peer appearance-none w-4 h-4 border border-gray-300 rounded checked:border-green-600 checked:bg-green-600 transition-all focus:ring-2 focus:ring-green-600/20" />
                              <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none scale-50 peer-checked:scale-100 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-[13px] font-medium text-gray-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[13px] font-medium text-gray-700">Etiketlər (Tags)</label>
                      <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600" placeholder="Etiket əlavə et..." />
                    </div>
                  </div>

                </div>
              </form>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
