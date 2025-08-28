"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { saveUserProfile } from "@/firebase/authActions";
import { toast } from "sonner";

const AVATARS = Array.from({ length: 12 }, (_, i) => `/images/avatars/${i + 1}.png`);

export default function OptionalProfileForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    avatar: AVATARS[0]
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkip = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      // Generate random name
      const randomNames = ['زائر', 'عميل', 'مستخدم'];
      const randomName = `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${Math.floor(Math.random() * 1000)}`;
      
      await updateProfile(user, {
        displayName: randomName,
        photoURL: AVATARS[Math.floor(Math.random() * AVATARS.length)]
      });

      await saveUserProfile(user.uid, {
        uid: user.uid,
        name: randomName,
        email: user.email || "",
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        role: 'customer',
        isEmailVerified: user.emailVerified,
        provider: user.providerData[0]?.providerId || "email",
        createdAt: new Date(),
        favoriteProducts: [],
        recentViews: [],
        addresses: [],
        orders: []
      });

      router.push("/");
    } catch (error) {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال الاسم");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.avatar
      });

      await saveUserProfile(user.uid, {
        uid: user.uid,
        name: formData.name,
        email: user.email || "",
        birthdate: formData.birthdate,
        avatar: formData.avatar,
        role: 'customer',
        isEmailVerified: user.emailVerified,
        provider: user.providerData[0]?.providerId || "email",
        createdAt: new Date(),
        favoriteProducts: [],
        recentViews: [],
        addresses: [],
        orders: []
      });

      router.push("/");
    } catch (error) {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">أكمل ملفك الشخصي</h2>
        <p className="text-white/70">يمكنك إكمال بياناتك أو تخطي هذه الخطوة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label className="text-white">الاسم (اختياري)</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="أدخل اسمك"
          />
        </div>

        {/* Birthdate */}
        <div>
          <Label className="text-white">تاريخ الميلاد (اختياري)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input
                  readOnly
                  value={formData.birthdate}
                  placeholder="اختر تاريخ الميلاد"
                  className="pl-10 cursor-pointer"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.birthdate ? new Date(formData.birthdate) : undefined}
                onSelect={(date) =>
                  handleInputChange('birthdate', date ? date.toLocaleDateString("en-CA") : "")
                }
                captionLayout="dropdown"
                fromYear={1940}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Avatar Selection */}
        <div>
          <Label className="text-white">اختر صورة شخصية</Label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {AVATARS.map((url, i) => (
              <Image
                key={i}
                src={url}
                width={60}
                height={60}
                alt={`Avatar ${i + 1}`}
                className={`w-15 h-15 rounded-full border-2 cursor-pointer transition-all hover:scale-105 ${
                  formData.avatar === url ? "border-primary scale-105" : "border-transparent"
                }`}
                onClick={() => handleInputChange('avatar', url)}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-black hover:bg-primary/80"
          >
            {loading ? "جاري الحفظ..." : "حفظ البيانات"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
            className="flex-1"
          >
            تخطي
          </Button>
        </div>
      </form>
    </div>
  );
}