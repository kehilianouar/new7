"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/types/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface ProductVariantModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number, selectedVariants: { [key: string]: string }) => void;
}

export default function ProductVariantModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductVariantModalProps) {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  // Group variants by name (size, color, flavor, etc.)
  const groupedVariants = product.variants?.reduce((acc, variant) => {
    if (!acc[variant.name]) {
      acc[variant.name] = [];
    }
    acc[variant.name].push(variant);
    return acc;
  }, {} as { [key: string]: ProductVariant[] });

  const handleVariantSelect = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(quantity, selectedVariants);
    onClose();
    // Reset state for next use
    setSelectedVariants({});
    setQuantity(1);
  };

  const allVariantsSelected = groupedVariants 
    ? Object.keys(groupedVariants).every(name => selectedVariants[name])
    : true;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700 rounded-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-white text-xl font-bold text-center">
            اختر الخصائص
          </DialogTitle>
          
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">{product.name}</h3>
              <p className="text-primary font-bold text-lg">
                {product.price.toLocaleString()} دج
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-gray-400 line-through text-sm">
                  {product.originalPrice.toLocaleString()} دج
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Variant Selection */}
          {groupedVariants && Object.entries(groupedVariants).map(([variantName, variants]) => (
            <div key={variantName} className="space-y-3">
              <h4 className="text-white font-medium text-sm capitalize">
                {variantName}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantName, variant.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedVariants[variantName] === variant.value
                        ? 'bg-primary text-black border-2 border-primary'
                        : 'bg-gray-800 text-white border-2 border-gray-600 hover:border-primary/50'
                    }`}
                  >
                    {variant.value}
                    {variant.price && variant.price !== product.price && (
                      <span className="text-xs text-primary ml-1">
                        (+{variant.price - product.price} دج)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">الكمية:</h4>
            <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-2 w-fit">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-white font-bold text-lg w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCartClick}
            disabled={!allVariantsSelected || !product.inStock}
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-xl text-lg transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart size={20} className="ml-2" />
            {product.inStock ? 'تأكيد الإضافة إلى السلة' : 'نفد من المخزن'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
