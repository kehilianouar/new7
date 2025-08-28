"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "@/components/ui/title";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function CartContent() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success("تم حذف المنتج من السلة");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("تم إفراغ السلة");
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-4 md:mx-8">
        <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <Title className="mb-4">السلة فارغة</Title>
          <p className="text-white/70 mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <Button 
            onClick={() => router.push("/products")}
            className="bg-primary hover:bg-primary/80 text-black font-bold"
          >
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 md:mx-8 space-y-6">
      {/* Cart Header */}
      <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
        <div className="flex justify-between items-center">
<Title>{`السلة (${cart.itemsCount} منتج)`}</Title>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearCart}
            className="text-xs"
          >
            إفراغ السلة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}
              className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-sm md:text-base">
                        {item.product.name}
                      </h3>
                      <p className="text-white/70 text-xs">{item.product.brand}</p>
                      
                      {/* Selected Variants */}
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs bg-white/10 px-2 py-1 rounded text-white/80"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="text-white font-bold w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>

                    <div className="text-left">
                      <div className="text-primary font-bold">
                        {(item.price * item.quantity).toLocaleString()} دج
                      </div>
                      <div className="text-white/60 text-xs">
                        {item.price.toLocaleString()} دج × {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6 sticky top-24">
            <Title className="mb-4">ملخص الطلب</Title>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white/80">
                <span>المجموع الفرعي</span>
                <span>{getCartTotal().toLocaleString()} دج</span>
              </div>
              
              <div className="flex justify-between text-white/80">
                <span>الشحن</span>
                <span>يحسب عند الطلب</span>
              </div>
              
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>المجموع</span>
                  <span className="text-primary">{getCartTotal().toLocaleString()} دج</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3"
              >
                إتمام الطلب
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/products")}
                className="w-full"
              >
                متابعة التسوق
              </Button>
            </div>

            {/* Free Shipping Notice */}
            {cart.itemsCount >= 4 && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm text-center font-medium">
                  🎉 مبروك! حصلت على الشحن المجاني
                </p>
              </div>
            )}
            
            {cart.itemsCount < 4 && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm text-center">
                  أضف {4 - cart.itemsCount} منتج أكثر للحصول على الشحن المجاني
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}