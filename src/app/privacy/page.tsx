"use client";

import Title from "@/components/ui/title";
import Footer from "@/components/shared/footer";

export default function PrivacyPolicyPage() {
  return (  
    <>
      <div className="p-4 mt-16 md:mt-20">
        <Title className="text-center">سياسة الخصوصية</Title>
        <p className="mt-4 text-white">
          نحن في GYM DADA STORE نلتزم بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها ومشاركتها.
        </p>
        <h2 className="mt-6 text-lg font-bold">جمع المعلومات</h2>
        <p className="mt-2 text-white">
          نقوم بجمع المعلومات التي تقدمها عند التسجيل في الموقع، مثل الاسم، البريد الإلكتروني، وتفاصيل الدفع.
        </p>
        <h2 className="mt-6 text-lg font-bold">استخدام المعلومات</h2>
        <p className="mt-2 text-white">
          نستخدم المعلومات لتحسين خدماتنا، معالجة الطلبات، والتواصل معك بشأن حسابك أو طلباتك.
        </p>
        <h2 className="mt-6 text-lg font-bold">حماية المعلومات</h2>
        <p className="mt-2 text-white">
          نحن نتخذ تدابير أمنية لحماية معلوماتك من الوصول غير المصرح به أو الاستخدام.
        </p>
        <h2 className="mt-6 text-lg font-bold">تغييرات على سياسة الخصوصية</h2>
        <p className="mt-2 text-white">
          قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات من خلال نشر السياسة الجديدة على هذه الصفحة.
        </p>
      </div>
      <Footer />
    </>
  );
}
