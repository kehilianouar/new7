// Store Components
import HeroSection from "@/components/store/HeroSection";
import ProductSection from "@/components/store/ProductSection";
import StoreFeatures from "@/components/store/StoreFeatures";
import CategoriesSection from "@/components/store/CategoriesSection";
import Footer from "@/components/shared/footer";

// Store Data
import { mockProducts, mockBanners } from "@/data/store/products";
import ProductCard from "@/components/store/ProductCard";
import Title from "@/components/ui/title";
import Link from "next/link";

export default async function Home() {
  // تصفية المنتجات حسب الفئات
  const bestSellers = mockProducts.filter(p => p.isBestSeller).slice(0, 8);
  const onSaleProducts = mockProducts.filter(p => p.isOnSale || p.discount).slice(0, 8);
  const newProducts = mockProducts.filter(p => p.isNew).slice(0, 8);
  const allProducts = mockProducts.slice(0, 16);

  return (
    <main className="flex flex-col gap-8 md:gap-6">
      <HeroSection banners={mockBanners} />
      <div className="mx-4 md:mx-8 flex flex-col gap-6 md:gap-8">        
        <CategoriesSection />
        <ProductSection title="الأكثر مبيعاً" products={bestSellers} viewAllLink="/products?filter=bestsellers" />
        <ProductSection title="العروض الخاصة" products={onSaleProducts} viewAllLink="/products?filter=sale" />
        <ProductSection title="وصلنا حديثاً" products={newProducts} viewAllLink="/products?filter=new" />
        
        {/* قسم جميع المنتجات بشكل شبكة */}
        <section className="px-4 md:px-6 py-4 md:py-6 bg-[#ffffff1a] border-1 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <Title>جميع المنتجات</Title>
<Link
  href="/products"
  className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
>
  شاهد الكل
</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        
        <StoreFeatures />
      </div>
      <Footer />
    </main>
  );
}