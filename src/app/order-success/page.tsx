import { Suspense } from "react";
import OrderSuccessContent from "@/components/store/OrderSuccessContent";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "تم إرسال الطلب بنجاح - GYM DADA STORE",
  description: "شكراً لك! تم إرسال طلبك بنجاح"
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16 md:pt-24">
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}