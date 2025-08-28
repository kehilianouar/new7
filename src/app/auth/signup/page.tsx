// app/auth/signup/page.tsx
"use client";
// React
import { useEffect, useState } from "react"

// Next.js
import Image from "next/image"
import { useRouter } from "next/navigation"

// Firebase
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"

// Components
import SignupForm from "@/components/auth/signupForm";
import Footer from "@/components/shared/footer"; // Importing Footer
import Title from "@/components/ui/title"

export default function SignupPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true) // ⬅️ حالة فحص المستخدم

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/")
      } else {
        setChecking(false) // ⬅️ السماح بعرض الصفحة لو مفيش يوزر
      }
    })
    return () => unsub()
  }, [router])
  if (checking) return null // ⬅️ متعرضش حاجة لحد ما نتأكد

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Spacing for header */}
      <div className="pt-16 md:pt-20"></div>
      
      <div className="flex-1 flex items-center justify-center p-2 md:p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 bg-cover bg-center relative overflow-hidden">
        {/* خلفيات ديكوريشن */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-yellow-600/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="bg-black/30 w-full max-w-3xl backdrop-blur-3xl p-3 md:p-4 rounded-2xl mb-8 md:mb-12">
          <div className="flex items-center justify-between">
            <div className="mb-2">
              <Title className="mb-2">GYM DADA STORE</Title>
              <p className="text-primary text-base lg:text-lg">
                متجر المكملات الرياضية المفضل لديك
              </p>
            </div>
            <Image
              src="/images/gymdada.png"
              alt="GYM DADA STORE Logo"
              width={100}
              height={100}
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
              priority
            />
          </div>

          <SignupForm />

          {/* الفوتر */}
          <p className="text-center mt-8 text-white/60 text-sm">
            جميع الحقوق محفوظة
            <span className="inline-block w-2 h-2 mx-2 rounded-full bg-white/60" />
            GYM DADA STORE &#x00A9; {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Spacing for footer */}
      <div className="pb-8 md:pb-12"></div>
        <Footer />
    </div>
  );
}
