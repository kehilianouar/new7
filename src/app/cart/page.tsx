import { Suspense } from "react";
import CartContent from "@/components/store/CartContent";
import Footer from "@/components/shared/footer";
import Loading from "./loading";

export const metadata = {
  title: "السلة - GYM DADA STORE",
  description: "مراجعة منتجاتك وإتمام الطلب"
};

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16 md:pt-24">
        <Suspense fallback={<Loading />}>
          <CartContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}