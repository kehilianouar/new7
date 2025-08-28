"use client";
// React
import { useEffect, useState } from "react";

// Next.js
import Image from "next/image";
import { useRouter } from "next/navigation";

// Icons
import { CheckCircle, Package, MapPin, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

// Firebase
import {
  getCurrentUser,
  getUserProfile,
  logoutUser,
  sendVerificationLink,
} from "@/firebase/authActions";

// E-commerce Actions
import { getUserOrders } from "@/firebase/ecommerceActions";

// Components
import Title from "@/components/ui/title";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EditProfileForm from "@/components/auth/editProfileForm";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Footer from "@/components/shared/footer";

// Types
import { Order } from "@/types/store";

export default function ProfilePage() {
  const router = useRouter();
  const [timer, setTimer] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'addresses'>('info');

  useEffect(() => {
    const lastSent = sessionStorage.getItem("lastVerificationSent");
    if (lastSent) {
      const diff = 60 - Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      if (diff > 0) {
        setTimer(diff);
      } else {
        sessionStorage.removeItem("lastVerificationSent");
      }
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sessionStorage.removeItem("lastVerificationSent");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSendVerification = async () => {
    if (isSending || timer > 0) return;

    setIsSending(true);
    try {
      await sendVerificationLink();

      const now = Date.now();
      sessionStorage.setItem("lastVerificationSent", now.toString());
      setTimer(60);

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error: any) {
      alert("فيه مشكلة: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getCurrentUser();

      if (user) {
        setIsEmailVerified(user.emailVerified);
      } else {
        router.replace("/");
        return;
      }

      const data = await getUserProfile(user.uid);
      if (!data || Object.keys(data).length <= 1) {
        router.replace("/auth/complete-profile");
        return;
      }

      // Fetch user orders
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);

      setProfile(data);
      setUserChecked(true);
    };

    fetchProfile();
  }, [router]);

  if (!userChecked) return <Loading />;

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/auth/login");
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <li className="flex border-b border-white/10 p-1.5 w-full">
      <span className="text-white/90">{label}&nbsp;:&nbsp;</span>
      <span className="text-white/80">{value}</span>
    </li>
  );

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 size={16} className="text-green-400" />;
      case 'shipped':
        return <Truck size={16} className="text-blue-400" />;
      case 'processing':
        return <Clock size={16} className="text-yellow-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return <Package size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      'pending': 'قيد الانتظار',
      'confirmed': 'تم التأكيد',
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغى'
    };
    return statusMap[status];
  };

  return (
    <>
      <div className="min-h-screen flex flex-col relative z-0">
        {/* الخلفية */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={profile.avatar || "/images/default-avatar.png"}
            alt="صورة المستخدم"
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            priority
            className="object-cover saturate-200"
          />
          <div
            className="absolute inset-0 bg-black/40"
            style={{ backdropFilter: "blur(200px)" }}
          />
        </div>

        {/* المحتوى */}
        <main className="flex-1 pt-16 md:pt-28 px-4 md:px-8 relative z-10">
          <div
            className={`w-full fixed bottom-17 md:bottom-7 right-1/2 translate-x-1/2 z-45 transition-all duration-500
              ${showAlert
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5 pointer-events-none"
              }`}
          >
            <Alert
              variant="default"
              className="w-fit mx-auto shadow-lg overflow-hidden flex items-center gap-2"
            >
              <CheckCircle />
              <AlertTitle className="text-foreground w-full">
                تم إرسال رابط التفعيل إلى إيميلك
              </AlertTitle>
            </Alert>
          </div>

          <div className="flex flex-col md:flex-row gap-6 pb-8 items-center md:items-stretch">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white/20">
              <Image
                src={profile.avatar || "/images/default-avatar.png"}
                alt="صورة المستخدم"
                fill
                className="object-cover"
              />
            </div>

            <div className="w-full flex flex-col justify-between text-white self-stretch">
              <Title>بيانات الحساب</Title>

              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => setEditOpen(true)}
                  className="flex-1 rounded-xl"
                >
                  تعديل بياناتي
                </Button>
                <Button
                  onClick={() => setLogoutConfirmOpen(true)}
                  variant="default"
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-500/50 text-white"
                >
                  تسجيل خروج
                </Button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-white/20 mb-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  المعلومات الشخصية
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  الطلبات ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'addresses'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  العناوين
                </button>
              </div>

              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <ul className="flex flex-col gap-2 text-base">
                  <InfoRow label="الاسم" value={profile.name} />
                  <InfoRow label="البريد الإلكتروني" value={profile.email} />
                  <InfoRow label="تاريخ الميلاد" value={profile.birthdate} />
                  <InfoRow label="مزود الدخول" value={profile.provider} />
                  <InfoRow
                    label="تأكيد الإيميل"
                    value={
                      isEmailVerified ? (
                        <span className="text-green-400 flex items-center gap-1">
                          مؤكد <CheckCircle size={16} />
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 ">
                          <span className="text-red-400">غير مؤكد</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSendVerification}
                            disabled={isSending || timer > 0}
                          >
                            {timer > 0
                              ? `إعادة الإرسال خلال ${timer}ث`
                              : "تفعيل الإيميل"}
                          </Button>
                        </div>
                      )
                    }
                  />
                  <InfoRow
                    label="تاريخ إنشاء الحساب"
                    value={new Date(profile.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                </ul>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <Package size={48} className="mx-auto mb-4 opacity-50" />
                      <p>لا توجد طلبات حتى الآن</p>
                      <Button 
                        onClick={() => router.push('/products')}
                        className="mt-4"
                      >
                        تصفح المنتجات
                      </Button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-white font-medium">
                              الطلب #{order.id.slice(-6)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-white/60">المجموع</p>
                            <p className="text-white font-medium">{order.total.toLocaleString()} دج</p>
                          </div>
                          <div>
                            <p className="text-white/60">تاريخ الطلب</p>
                            <p className="text-white">
                              {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60">عدد المنتجات</p>
                            <p className="text-white">{order.items.length} منتج</p>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() => router.push(`/order/${order.id}`)}
                        >
                          عرض تفاصيل الطلب
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {profile.addresses && profile.addresses.length > 0 ? (
                    profile.addresses.map((address: any, index: number) => (
                      <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={16} className="text-primary" />
                          <span className="text-white font-medium">{address.name}</span>
                          {address.isDefault && (
                            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                              افتراضي
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm">{address.address}</p>
                        <p className="text-white/60 text-sm">
                          {address.baladiya}، {address.wilaya}
                        </p>
                        <p className="text-white/60 text-sm">{address.phone}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                      <p>لا توجد عناوين مسجلة</p>
                      <Button 
                        onClick={() => setEditOpen(true)}
                        className="mt-4"
                      >
                        إضافة عنوان
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#1a1a1a] w-[95%] max-w-md rounded-2xl px-4 md:px-8 py-8 shadow-2xl border border-white/10">
          <DialogTitle className="text-xl font-bold text-center">
            تعديل البيانات الشخصية
          </DialogTitle>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-white/60 text-center -mt-2">
              عدل بياناتك واحفظ التغييرات
            </p>
            <EditProfileForm
              initialName={profile.name}
              initialBirthdate={profile.birthdate}
              initialAvatar={profile.avatar}
              onSuccess={() => {
                window.location.reload();
                setEditOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="bg-[#1a1a1a] w-[95%] max-w-md rounded-2xl px-6 py-8 shadow-2xl border border-white/10">
          <DialogTitle className="text-xl font-bold text-center">
            هل انت متأكد من تسجيل الخروج
          </DialogTitle>
          <div className="flex justify-between gap-2">
            <Button
              onClick={() => setLogoutConfirmOpen(false)}
              className="flex-1 rounded-xl bg-gray-600 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 rounded-xl bg-red-500 hover:bg-red-500/60"
            >
              تأكيد الخروج
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
