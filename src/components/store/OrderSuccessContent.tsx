"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import { getOrderById } from "@/firebase/storeActions";
import { CheckCircle, Package, Phone, MapPin } from "lucide-react";

export default function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      };
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="mx-4 md:mx-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#ffffff1a] border border-white/10 rounded-xl p-6 md:p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          {/* Success Message */}
          <Title className="mb-4 text-green-400">تم إرسال طلبك بنجاح!</Title>
          
          <p className="text-white/80 mb-6 leading-relaxed">
            شكراً لك على ثقتك في GYM DADA STORE. تم استلام طلبك وسنتواصل معك خلال 24 ساعة لتأكيد الطلب وتحديد موعد التوصيل.
          </p>

          {/* Order Details */}
          {order && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-right">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Package size={18} />
                تفاصيل الطلب
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">رقم الطلب:</span>
                  <span className="text-white font-mono">#{order.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/70">المجموع الكلي:</span>
                  <span className="text-primary font-bold">{order.total.toLocaleString()} دج</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/70">طريقة الدفع:</span>
                  <span className="text-white">الدفع عند الاستلام</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/70">حالة الطلب:</span>
                  <span className="text-yellow-400">قيد المراجعة</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2 justify-center">
              <Phone size={18} />
              معلومات التواصل
            </h3>
            <p className="text-blue-400/80 text-sm">
              في حالة وجود أي استفسار، يمكنك التواصل معنا على:
            </p>
            <p className="text-blue-400 font-bold mt-1">0555 123 456</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/products")}
              className="bg-primary hover:bg-primary/80 text-black font-bold"
            >
              متابعة التسوق
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              العودة للرئيسية
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <h4 className="font-bold text-yellow-400 mb-2">ملاحظات مهمة:</h4>
            <ul className="text-yellow-400/80 text-sm space-y-1 text-right">
              <li>• سنتواصل معك لتأكيد الطلب خلال 24 ساعة</li>
              <li>• مدة التوصيل من 2-5 أيام عمل حسب المنطقة</li>
              <li>• يمكنك الدفع نقداً عند استلام الطلب</li>
              <li>• جميع منتجاتنا أصلية ومضمونة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}