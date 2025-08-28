"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Title from "@/components/ui/title";
import { getAllProducts, deleteProduct } from "@/firebase/ecommerceActions";
import { Product } from "@/types/store";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      const success = await deleteProduct(productId);
      if (success) {
        setProducts(products.filter(p => p.id !== productId));
        toast.success('تم حذف المنتج بنجاح');
      } else {
        toast.error('فشل في حذف المنتج');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('خطأ في حذف المنتج');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>إدارة المنتجات</Title>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>إدارة المنتجات</Title>
        <Link href="/admin/products/add">
          <Button className="bg-primary text-black hover:bg-primary/80">
            <Plus size={20} />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            المنتجات ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              لا توجد منتجات
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={product.images[0] || '/default-image.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-white/60">{product.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="text-primary font-bold">
                        {product.price.toLocaleString()} دج
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={product.inStock ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {product.inStock ? `متوفر (${product.stockQuantity})` : 'نفد'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}