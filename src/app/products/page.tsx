import { Suspense } from "react";
import { mockProducts, mockCategories } from "@/data/store/products";
import ProductsGrid from "@/components/store/ProductsGrid";
import ProductFilters from "@/components/store/ProductFilters";
import Title from "@/components/ui/title";
import Footer from "@/components/shared/footer";
import Loading from "./loading";

export const metadata = {
  title: "المنتجات - GYM DADA STORE",
  description: "تصفح جميع منتجات GYM DADA STORE من المكملات الغذائية والملابس الرياضية"
};

interface SearchParams {
  category?: string;
  filter?: string;
  page?: string;
  search?: string;
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const itemsPerPage = 12;

  // Filter products based on search params
  let filteredProducts = [...mockProducts];

  if (params.category) {
    filteredProducts = filteredProducts.filter(p => p.category === params.category);
  }

  if (params.filter) {
    switch (params.filter) {
      case 'bestsellers':
        filteredProducts = filteredProducts.filter(p => p.isBestSeller);
        break;
      case 'sale':
        filteredProducts = filteredProducts.filter(p => p.isOnSale || p.discount);
        break;
      case 'new':
        filteredProducts = filteredProducts.filter(p => p.isNew);
        break;
    }
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
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
          <Title className="mb-4">جميع المنتجات</Title>
          
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