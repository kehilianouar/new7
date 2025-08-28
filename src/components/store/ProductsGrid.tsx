"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/store";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export default function ProductsGrid({ 
  products, 
  currentPage, 
  totalPages, 
  totalProducts 
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `/products?${params.toString()}`;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const  endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <Button
          key="prev"
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageUrl(currentPage - 1))}
          className="px-3"
        >
          <ChevronRight size={16} />
        </Button>
      );
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => router.push(createPageUrl(1))}
          className="px-3"
        >
          1
        </Button>
      );
      
      if (startPage > 2) {
        buttons.push(<span key="dots1" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => router.push(createPageUrl(i))}
          className="px-3"
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots2" className="px-2">...</span>);
      }
      
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => router.push(createPageUrl(totalPages))}
          className="px-3"
        >
          {totalPages}
        </Button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <Button
          key="next"
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageUrl(currentPage + 1))}
          className="px-3"
        >
          <ChevronLeft size={16} />
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-white/70">
        <span>
          عرض {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalProducts)} من {totalProducts} منتج
        </span>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">لا توجد منتجات متاحة</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
}