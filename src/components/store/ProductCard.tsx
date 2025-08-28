"use client";
// React & Next
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Types
import { Product, ProductVariant } from "@/types/store";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";

// Context
import { useCart } from "@/contexts/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  // State variables for product card
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [showError, setShowError] = useState(false);

  // Effect to initialize variants with the first option
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const initialVariants = product.variants.reduce<{ [key: string]: string }>((acc, variant) => {
        acc[variant.name] = variant.value;
        return acc;
      }, {});
      setSelectedVariants(initialVariants);
    }
  }, [product.variants]);

  // Calculate the current price based on selected variants
  const currentPrice = useMemo(() => {
    if (product.variantPrices && Object.keys(selectedVariants).length > 0) {
      const variantKey = Object.values(selectedVariants).join('-');
      return product.variantPrices[variantKey] || product.price;
    }
    return product.price;
  }, [selectedVariants, product.variantPrices, product.price]);

  // Calculate the discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  const handleVariantChange = (variantName: string, optionValue: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: optionValue
    }));
    setShowError(false);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      const allVariantsSelected = product.variants.every(variant => selectedVariants[variant.name]);
      if (!allVariantsSelected) {
        setShowError(true);
        return;
      }
    }
    addToCart(product, 1, selectedVariants);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      const allVariantsSelected = product.variants.every(variant => selectedVariants[variant.name]);
      if (!allVariantsSelected) {
        setShowError(true);
        return;
      }
    }
    // Logic for a quick purchase: add to cart and redirect to checkout page
    addToCart(product, 1, selectedVariants);
    router.push('/checkout'); 
  };
  
  const handleCardClick = () => {
    // Navigate to product page for more details
    if (product.slug) {
      router.push(`/store/products/${product.slug}`);
    } else {
      router.push(`/store/products/${product.id}`);
    }
  };

  return (
    <div
      dir="rtl"
      className="cursor-pointer relative w-full max-w-[280px] mx-auto rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 flex flex-col backdrop-blur-md transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square overflow-hidden" onClick={handleCardClick}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        
        {/* Top Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              جديد
            </Badge>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              خصم {discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
            className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <Heart 
              size={16} 
              className={`${isWishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
          </button>
        </div>
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            size="sm"
            onClick={handleAddToCartClick}
            className="bg-primary text-black hover:bg-primary/80 text-xs px-3 py-1"
          >
            <ShoppingCart size={14} />
          </Button>
          <Button
            size="sm"
            onClick={handleCardClick}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black text-xs px-3 py-1"
          >
            <Eye size={14} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          {/* Brand & Name */}
          <div className="flex flex-col flex-1">
            <span className="text-primary text-xs font-medium uppercase mb-1">
              {product.brand}
            </span>
            <h3 className="font-semibold text-sm text-white line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer" onClick={handleCardClick}>
              {product.name}
            </h3>
          </div>
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 min-w-max mr-2">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold text-lg">
            {currentPrice.toLocaleString('en-US')} دج
          </span>
          {product.originalPrice && product.originalPrice > currentPrice && (
            <span className="text-gray-500 line-through text-xs">
              {product.originalPrice.toLocaleString('en-US')} دج
            </span>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {Object.entries(
              product.variants.reduce<{ [key: string]: ProductVariant[] }>((acc, variant) => {
                if (!acc[variant.name]) {
                  acc[variant.name] = [];
                }
                acc[variant.name].push(variant);
                return acc;
              }, {})
            ).slice(0, 1).map(([variantName, variants]) => (
              <div key={variantName} className="flex flex-col">
                <span className={`text-xs font-medium mb-1 ${showError && !selectedVariants[variantName] ? 'text-red-500' : 'text-gray-300'}`}>
                  {variantName}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {variants.slice(0, 3).map((variant) => (
                    <button
                      key={variant.id}
                      onClick={(e) => { e.stopPropagation(); handleVariantChange(variantName, variant.value); }}
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        selectedVariants[variantName] === variant.value
                          ? 'bg-primary text-black'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {showError && (
              <p className="text-red-500 text-xs mt-1">
                الرجاء اختيار الخصائص المطلوبة.
              </p>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button
            size="sm"
            onClick={handleAddToCartClick}
            className="flex-1 bg-primary text-black font-medium text-xs py-2 h-9 hover:bg-primary/80 transition-colors"
            disabled={!product.inStock}
          >
            <ShoppingCart size={14} className="ml-1" />
            أضف للسلة
          </Button>
        </div>
        
        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
            <span className="text-white font-bold text-base">نفد من المخزن</span>
          </div>
        )}
      </div>
    </div>
  );
}
