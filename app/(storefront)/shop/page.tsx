import { ShopHeader } from "@/components/shop/shop-header";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/app/actions";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  
  let title = "Shop All";
  let subtitle = "Discover our entire collection of everyday essentials.";

  if (category) {
    if (category === 'bestseller' || category === 'bestsellers') { title = "Bestsellers"; subtitle = "Our most loved pieces, chosen by you."; }
    else if (category === 'new-arrivals') { title = "Yeni Gələnlər"; subtitle = "The latest additions to our collection."; }
    else if (category === 'hoodie') { title = "Hoodies"; subtitle = "Cozy, comfortable, and classic."; }
    else if (category === 'tshirt') { title = "T-Shirts"; subtitle = "Breezy comfort for every day."; }
    else if (category === 'accessory') { title = "Accessories"; subtitle = "The perfect finishing touches."; }
    else if (category === 'outfit') { title = "Sets & Outfits"; subtitle = "Curated sets for effortless style."; }
    else { title = category.replace('-', ' '); }
  }

  const allProducts = await getProducts();
  
  const products = category 
    ? allProducts.filter(p => p.placement?.includes(category) || p.type.toLowerCase().replace('-', '') === category.replace('-', '')) 
    : allProducts;

  const displayProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || p.type,
    price: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
    imageUrl: p.image
  }));

  return (
    <div className="container mx-auto max-w-[1600px] px-4 md:px-6 -mt-16 md:-mt-20 pb-16 md:pb-24 flex-1 relative z-10">
      
      {/* Title removed per user request to match /shop */}

      <ShopHeader />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mt-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
