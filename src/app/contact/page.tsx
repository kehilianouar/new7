"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Title from "@/components/ui/title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/shared/footer";

const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  subject: z.string().min(5, "الموضوع يجب أن يكون على الأقل 5 أحرف"),
  message: z.string().min(10, "الرسالة يجب أن تكون على الأقل 10 أحرف"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "">("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("");
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Contact form submitted:", data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-4 max-w-2xl mx-auto mt-16 md:mt-20">
        <Title className="text-center">اتصل بنا</Title>
        
        <p className="mt-4 text-white text-center">
          نحن هنا لمساعدتك. تواصل معنا لأي استفسارات أو ملاحظات.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-white mb-2">الاسم</label>
            <Input
              {...register("name")}
              placeholder="اسمك الكامل"
              className="w-full"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-white mb-2">البريد الإلكتروني</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="بريدك الإلكتروني"
              className="w-full"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-white mb-2">الموضوع</label>
            <Input
              {...register("subject")}
              placeholder="موضوع الرسالة"
              className="w-full"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-white mb-2">الرسالة</label>
            <Textarea
              {...register("message")}
              placeholder="اكتب رسالتك هنا..."
              rows={5}
              className="w-full"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
          </Button>

          {submitStatus === "success" && (
            <p className="text-green-500 text-center mt-4">
              تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا!
            </p>
          )}

          {submitStatus === "error" && (
            <p className="text-red-500 text-center mt-4">
              حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
            </p>
          )}
        </form>

        <div className="mt-8 p-6 bg-white/10 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4">معلومات الاتصال</h3>
          <div className="space-y-2 text-white">
            <p>📧 البريد الإلكتروني: info@gymdada.com</p>
            <p>📞 الهاتف: +213 XXX XXX XXX</p>
            <p>📍 العنوان: الجزائر</p>
            <p>⏰ ساعات العمل: الأحد - الخميس، 9 ص - 5 م</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
