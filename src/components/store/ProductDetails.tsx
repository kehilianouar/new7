"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ShoppingCart, Star, Plus, Minus, Share2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ProductSection from "./ProductSection";
import Title from "@/components/ui/title";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Group variants by name
  const variantGroups = product.variants?.reduce((groups, variant) => {
    if (!groups[variant.name]) {
      groups[variant.name] = [];
    }
    groups[variant.name].push(variant);
    return groups;
  }, {} as { [key: string]: typeof product.variants }) || {};

  const handleAddToCart = () => {
    // Check if all required variants are selected
    const requiredVariants = Object.keys(variantGroups);
    const missingVariants = requiredVariants.filter(name => !selectedVariants[name]);
    
    if (missingVariants.length > 0) {
      toast.error(`يرجى اختيار: ${missingVariants.join(', ')}`);
      return;
    }

    addToCart(product, quantity, selectedVariants);
    toast.success(`تم إضافة ${product.name} إلى السلة`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط");
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  return (
    <div className="mx-4 md:mx-8 space-y-6">
      {/* Product Details */}
      <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-green-500 text-white">جديد</Badge>
                )}
                {discountPercentage && (
                  <Badge className="bg-red-500 text-white">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-primary text-black">الأكثر مبيعاً</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-white/20'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {product.name}
                  </h1>
                  <p className="text-white/70 mb-2">{product.brand}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart 
                      size={20} 
                      className={isWishlisted ? 'text-red-500 fill-red-500' : ''} 
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating!) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white/80">{product.rating}</span>
                  <span className="text-white/60">({product.reviewsCount} تقييم)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString()} دج
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-white/50 line-through">
                    {product.originalPrice.toLocaleString()} دج
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">الوصف</h3>
              <p className="text-white/80 leading-relaxed">{product.description}</p>
            </div>

            {/* Variants */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="space-y-4">
                {Object.entries(variantGroups).map(([variantName, variants]) => (
                  <div key={variantName}>
                    <label className="block text-white font-medium mb-2">
                      {variantName}
                    </label>
                    <Select
                      value={selectedVariants[variantName] || ''}
                      onValueChange={(value) => 
                        setSelectedVariants(prev => ({ ...prev, [variantName]: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`اختر ${variantName}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.value}>
                            {variant.value}
                            {variant.price && variant.price !== product.price && (
                              <span className="text-primary mr-2">
                                (+{(variant.price - product.price).toLocaleString()} دج)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-white font-medium mb-2">الكمية</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="text-xl font-bold text-white w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (product.stockQuantity || 99)}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart size={20} />
                {product.inStock ? 'أضف إلى السلة' : 'نفد من المخزن'}
              </Button>
              
              <div className="text-center">
                <span className="text-white/70 text-sm">
                  متوفر في المخزن: {product.stockQuantity} قطعة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specifications */}
        {product.specifications && (
          <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-white mb-4">المواصفات</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/70">{key}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        {product.usage && (
          <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-white mb-4">طريقة الاستخدام</h3>
            <p className="text-white/80 leading-relaxed">{product.usage}</p>
          </div>
        )}
      </div>

      {/* Ingredients */}
      {product.ingredients && product.ingredients.length > 0 && (
        <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4">المكونات</h3>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-white">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <ProductSection
          title="منتجات ذات صلة"
          products={relatedProducts}
        />
      )}
    </div>
  );
}