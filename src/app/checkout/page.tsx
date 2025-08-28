import { Suspense } from "react";
import CheckoutContent from "@/components/store/CheckoutContent";
import Footer from "@/components/shared/footer";
import Loading from "./loading";

export const metadata = {
  title: "إتمام الطلب - GYM DADA STORE",
  description: "أكمل طلبك وأدخل بيانات الشحن"
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16 md:pt-24">
        <Suspense fallback={<Loading />}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}