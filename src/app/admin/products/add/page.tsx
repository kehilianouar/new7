"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Title from "@/components/ui/title";
import { createProduct } from "@/firebase/storeActions";
import { Product } from "@/types/store";
import { toast } from "sonner";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: 0,
    originalPrice: 0,
    stockQuantity: 0,
    inStock: true,
    isNew: false,
    isFeatured: false,
    rating: 0,
    images: [],
    variants: [],
    variantPrices: {}
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  const addImageUrl = () => {
    if (currentImageUrl.trim() && !imageUrls.includes(currentImageUrl)) {
      setImageUrls(prev => [...prev, currentImageUrl]);
      setCurrentImageUrl("");
    }
  };

  const removeImageUrl = (url: string) => {
    setImageUrls(prev => prev.filter(u => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        images: imageUrls,
        inStock: formData.stockQuantity! > 0
      };

      const productId = await createProduct(productData as Omit<Product, 'id'>);
      if (productId) {
        toast.success('تم إضافة المنتج بنجاح');
        router.push('/admin/products');
      } else {
        toast.error('فشل في إضافة المنتج');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('خطأ في إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "supplements",
    "clothing",
    "accessories",
    "equipment",
    "nutrition"
  ];

  return (
    <div className="space-y-6">
      <Title>إضافة منتج جديد</Title>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">اسم المنتج *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل اسم المنتج"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">العلامة التجارية *</label>
                <Input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل العلامة التجارية"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">وصف المنتج *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="أدخل وصف المنتج"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">الفئة *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-white/20 rounded bg-white/10 text-white"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">السعر (دج) *</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">السعر الأصلي (دج)</label>
                <Input
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">الكمية في المخزون *</label>
                <Input
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">التقييم</label>
                <Input
                  name="rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div className="flex items-end space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-white text-sm">متوفر</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-white text-sm">جديد</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-white text-sm">مميز</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">صور المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                placeholder="رابط الصورة"
                className="flex-1"
              />
              <Button type="button" onClick={addImageUrl}>
                <Upload size={16} />
                إضافة
              </Button>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-black hover:bg-primary/80"
          >
            {loading ? "جاري الإضافة..." : "إضافة المنتج"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}
