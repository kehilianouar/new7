"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Title from "@/components/ui/title";
import { getBaladiyas } from "@/data/store/locations";
import { getStoreSettingsAndShippingPrices } from "/src/firebase/ecommerceActions.ts"; 
import { toast } from "sonner";
import { ShoppingBag, MapPin, Phone, User, Home, Building } from "lucide-react";

interface Wilaya {
  id: string;
  name: string;
  deskPrice: number;
  homePrice: number;
}

export default function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart, getCartTotal } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    wilaya: "",
    baladiya: "",
    address: "",
    shippingType: "home" as "home" | "office",
    notes: ""
  });
  
  const [availableWilayas, setAvailableWilayas] = useState<Wilaya[]>([]);
  const [availableBaladiyas, setAvailableBaladiyas] = useState<any[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart.items, router]);

  // Fetch store settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const settings = await getStoreSettingsAndShippingPrices();
      if (settings) {
        // Filter out excluded wilayas
        const filteredWilayas = settings.wilayaShippingPrices.filter(
          (wilaya) => !settings.excludedWilayas.includes(wilaya.id)
        );
        setAvailableWilayas(filteredWilayas);
        setFreeShippingThreshold(settings.shippingSettings.freeShippingThreshold);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  // Update baladiyas and shipping cost when wilaya or shipping type changes
  useEffect(() => {
    if (formData.wilaya) {
      const baladiyas = getBaladiyas(formData.wilaya);
      setAvailableBaladiyas(baladiyas || []);
      
      const selectedWilaya = availableWilayas.find(w => w.id === formData.wilaya);
      if (selectedWilaya) {
        let cost = 0;
        if (getCartTotal() >= freeShippingThreshold) {
          cost = 0;
        } else {
          cost = formData.shippingType === 'home' ? selectedWilaya.homePrice : selectedWilaya.deskPrice;
        }
        setShippingCost(cost);
      }
      
      // Reset baladiya selection
      setFormData(prev => ({ ...prev, baladiya: "" }));
    }
  }, [formData.wilaya, formData.shippingType, availableWilayas, getCartTotal, freeShippingThreshold]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'phone', 'wilaya', 'baladiya', 'address'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return false;
    }
    
    if (formData.phone.length < 10) {
      toast.error("رقم الهاتف غير صحيح");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate order submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order object
      const order = {
        id: Date.now().toString(),
        customerInfo: formData,
        items: cart.items,
        subtotal: getCartTotal(),
        shippingCost,
        total: getCartTotal() + shippingCost,
        status: 'pending',
        paymentMethod: 'cod',
        createdAt: new Date()
      };
      
      // Save order to localStorage (in real app, send to backend)
      const existingOrders = JSON.parse(localStorage.getItem('gym-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('gym-orders', JSON.stringify(existingOrders));
      
      // Clear cart
      clearCart();
      
      toast.success("تم إرسال طلبك بنجاح! سنتواصل معك قريباً");
      
      // Redirect to success page
      router.push(`/order-success?orderId=${order.id}`);
      
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="mx-4 md:mx-8 space-y-6">
      <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
        <Title>إتمام الطلب</Title>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={20} />
                المعلومات الشخصية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">الاسم الكامل *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-white">رقم الهاتف *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0555123456"
                    type="tel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} />
                عنوان الشحن
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">الولاية *</Label>
                    <Select value={formData.wilaya} onValueChange={(value) => handleInputChange('wilaya', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWilayas.map((wilaya) => (
                          <SelectItem key={wilaya.id} value={wilaya.id}>
                            {wilaya.name} ({wilaya.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">البلدية *</Label>
                    <Select 
                      value={formData.baladiya} 
                      onValueChange={(value) => handleInputChange('baladiya', value)}
                      disabled={!formData.wilaya}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البلدية" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBaladiyas.map((baladiya) => (
                          <SelectItem key={baladiya.id} value={baladiya.id}>
                            {baladiya.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">العنوان التفصيلي *</Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="أدخل عنوانك التفصيلي (الحي، الشارع، رقم المنزل...)"
                    required
                  />
                </div>
                
                {/* Shipping Type */}
                <div>
                  <Label className="text-white mb-3 block">نوع الشحن</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('shippingType', 'home')}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 justify-center text-center ${
                        formData.shippingType === 'home'
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-white/20 text-white/80 hover:border-white/40'
                      }`}
                    >
                      <Home size={20} />
                      <span>توصيل للمنزل</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('shippingType', 'office')}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 justify-center text-center ${
                        formData.shippingType === 'office'
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-white/20 text-white/80 hover:border-white/40'
                      }`}
                    >
                      <Building size={20} />
                      <span>مكتب التوصيل</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">ملاحظات إضافية</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي ملاحظات أو تعليمات خاصة للتوصيل..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-4 md:p-6 sticky top-24">
              <Title className="mb-4">ملخص الطلب</Title>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.items && cart.items.map((item) => (
                  <div key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-white/10 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.product?.name || 'Product'}
                      </h4>
                      <p className="text-white/60 text-xs">الكمية: {item.quantity || 1}</p>
                      <p className="text-primary text-sm font-bold">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString()} دج
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pricing */}
              <div className="space-y-3 mb-6 border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/80">
                  <span>المجموع الفرعي</span>
                  <span>{getCartTotal().toLocaleString()} دج</span>
                </div>
                
                <div className="flex justify-between text-white/80">
                  <span>الشحن</span>
                  <span className={shippingCost === 0 ? "text-green-400" : ""}>
                    {shippingCost === 0 ? "مجاني" : `${shippingCost.toLocaleString()} دج`}
                  </span>
                </div>
                
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>المجموع الكلي</span>
                    <span className="text-primary">{(getCartTotal() + shippingCost).toLocaleString()} دج</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 font-medium">
                  <Phone size={16} />
                  <span>الدفع عند الاستلام</span>
                </div>
                <p className="text-green-400/80 text-xs mt-1">
                  ادفع فقط عند وصول طلبك إليك
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    جاري التحميل...
                  </div>
                ) : isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    جاري إرسال الطلب...
                  </div>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    تأكيد الطلب
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}