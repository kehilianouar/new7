"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const currentCategory = searchParams.get('category');
  const currentFilter = searchParams.get('filter');

  const createFilterUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset page when filtering
    params.delete('page');
    
    return `/products?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    router.push('/products');
  };

  const mainCategories = categories.filter(cat => !cat.parentId);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">البحث</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search size={16} />
          </Button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">الفئات</h3>
        <div className="space-y-2">
          <Button
            variant={!currentCategory ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => router.push(createFilterUrl('category', null))}
          >
            جميع الفئات
          </Button>
          
          {mainCategories.map(category => (
            <Button
              key={category.id}
              variant={currentCategory === category.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => router.push(createFilterUrl('category', category.id))}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">فلاتر خاصة</h3>
        <div className="space-y-2">
          <Button
            variant={currentFilter === 'bestsellers' ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => router.push(createFilterUrl('filter', 'bestsellers'))}
          >
            الأكثر مبيعاً
          </Button>
          
          <Button
            variant={currentFilter === 'sale' ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => router.push(createFilterUrl('filter', 'sale'))}
          >
            العروض الخاصة
          </Button>
          
          <Button
            variant={currentFilter === 'new' ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => router.push(createFilterUrl('filter', 'new'))}
          >
            وصلنا حديثاً
          </Button>
        </div>
      </div>

      {/* Clear Filters */}
      {(currentCategory || currentFilter || searchTerm) && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={clearFilters}
        >
          مسح جميع الفلاتر
        </Button>
      )}
    </div>
  );
}