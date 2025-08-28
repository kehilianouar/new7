"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { checkUserRole } from "@/firebase/authActions";
import Navbar from "@/components/shared/navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Footer from "@/components/shared/footer";
import Loaders from "@/components/loaders/loaders";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const userRole = await checkUserRole(user.uid);
      if (userRole !== 'admin') {
        router.replace('/');
        return;
      }

      setIsAuthorized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loaders />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16 md:pt-20">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 mr-64">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}