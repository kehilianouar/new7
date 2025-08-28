"use client";

import Title from "@/components/ui/title";
import Footer from "@/components/shared/footer";

export default function TermsPage() {
  return (
    <>
      <div className="p-4 mt-16 md:mt-20">
        <Title className="text-center">الشروط والأحكام</Title>
        <p className="mt-4 text-white">
          مرحبًا بك في GYM DADA STORE. باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية.
        </p>
        <h2 className="mt-6 text-lg font-bold">استخدام الموقع</h2>
        <p className="mt-2 text-white">
          يجب أن يكون عمرك 18 عامًا على الأقل لاستخدام موقعنا. أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور.
        </p>
        <h2 className="mt-6 text-lg font-bold">المنتجات والخدمات</h2>
        <p className="mt-2 text-white">
          نحن نحتفظ بالحق في تعديل أو إيقاف أي منتج أو خدمة في أي وقت دون إشعار مسبق.
        </p>
        <h2 className="mt-6 text-lg font-bold">الأسعار والدفع</h2>
        <p className="mt-2 text-white">
          جميع الأسعار معروضة بالدينار الجزائري. نحن نحتفظ بالحق في تغيير الأسعار في أي وقت.
        </p>
        <h2 className="mt-6 text-lg font-bold">المرتجعات والاستبدال</h2>
        <p className="mt-2 text-white">
          نقبل المرتجعات خلال 14 يومًا من تاريخ الاستلام. يجب أن تكون المنتجات في حالتها الأصلية.
        </p>
        <h2 className="mt-6 text-lg font-bold">الملكية الفكرية</h2>
        <p className="mt-2 text-white">
          جميع المحتويات على هذا الموقع محمية بحقوق النشر والملكية الفكرية.
        </p>
      </div>
      <Footer />
    </>
  );
}
