import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mockProducts, mockCategories } from "@/data/store/products";
import ProductsGrid from "@/components/store/ProductsGrid";
import ProductFilters from "@/components/store/ProductFilters";
import Title from "@/components/ui/title";
import Footer from "@/components/shared/footer";
import Loading from "@/app/products/loading";

export const metadata = {
  title: "فئات المنتجات - GYM DADA STORE",
  description: "تصفح منتجات GYM DADA STORE حسب الفئة"
};

interface SearchParams {
  page?: string;
  search?: string;
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  
  // Find category info
  const categoryInfo = mockCategories.find(cat => cat.id === category);
  if (!categoryInfo) {
    notFound();
  }

  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const itemsPerPage = 12;

  // Filter products by category
  let filteredProducts = mockProducts.filter(p => p.category === category);

  if (resolvedSearchParams.search) {
    const searchTerm = resolvedSearchParams.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16 md:pt-24 mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <div className="mb-6">
            <Title className="mb-2">{categoryInfo.name}</Title>
            {categoryInfo.description && (
              <p className="text-white/70">{categoryInfo.description}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Products Grid */}
            <div className="w-full">
              <Suspense fallback={<Loading />}>
                <ProductsGrid 
                  products={paginatedProducts}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalProducts={filteredProducts.length}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return mockCategories
    .filter(cat => !cat.parentId) // Only main categories
    .map((category) => ({
      category: category.id,
    }));
}