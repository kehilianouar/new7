"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, createCategory, createBanner, updateStoreSettings, updateShippingPrices } from "@/firebase/storeActions";
import { Product, Category, Banner, StoreSettings, WilayaShipping } from "@/types/store";
import { toast } from "sonner";
import { Package, Tags, Image as ImageIcon, Settings } from "lucide-react";

export default function InitializeStoreData() {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initializeData = async () => {
    setLoading(true);
    try {
      // Sample products
      const sampleProducts: Omit<Product, 'id'>[] = [
        {
          name: "واي بروتين جولد ستاندرد",
          description: "بروتين عالي الجودة لبناء العضلات وتحسين الأداء الرياضي. يحتوي على 24 جرام بروتين لكل حصة مع أحماض أمينية أساسية.",
          price: 8500,
          originalPrice: 10000,
          discount: 15,
          images: [
            "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg",
            "https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg"
          ],
          category: "supplements",
          subcategory: "protein",
          brand: "Optimum Nutrition",
          inStock: true,
          stockQuantity: 50,
          variants: [
            { id: "v1", name: "النكهة", value: "شوكولاتة", stockQuantity: 20 },
            { id: "v2", name: "النكهة", value: "فانيليا", stockQuantity: 15 },
            { id: "v3", name: "النكهة", value: "فراولة", stockQuantity: 15 },
            { id: "v4", name: "الحجم", value: "2.27 كيلو", price: 8500, stockQuantity: 30 },
            { id: "v5", name: "الحجم", value: "4.54 كيلو", price: 15000, stockQuantity: 20 }
          ],
          specifications: {
            "البروتين لكل حصة": "24 جرام",
            "عدد الحصص": "74 حصة",
            "السعرات الحرارية": "120 سعرة"
          },
          usage: "امزج ملعقة واحدة مع 180-240 مل من الماء أو الحليب. تناول 1-2 حصة يومياً",
          ingredients: ["واي بروتين", "نكهات طبيعية", "ليسيثين الصويا"],
          isBestSeller: true,
          isNew: false,
          isOnSale: true,
          isFeatured: true,
          rating: 4.8,
          reviewsCount: 156,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "كرياتين مونوهيدرات",
          description: "كرياتين نقي 100% لزيادة القوة والطاقة أثناء التمرين. يساعد على تحسين الأداء الرياضي وبناء العضلات.",
          price: 3500,
          images: [
            "https://images.pexels.com/photos/6551070/pexels-photo-6551070.jpeg"
          ],
          category: "supplements",
          subcategory: "creatine",
          brand: "Universal Nutrition",
          inStock: true,
          stockQuantity: 30,
          variants: [
            { id: "v6", name: "الحجم", value: "300 جرام", price: 3500, stockQuantity: 20 },
            { id: "v7", name: "الحجم", value: "500 جرام", price: 5000, stockQuantity: 10 }
          ],
          specifications: {
            "الكرياتين لكل حصة": "5 جرام",
            "عدد الحصص": "60 حصة",
            "النقاء": "99.9%"
          },
          usage: "تناول 5 جرام يومياً مع الماء أو العصير، يفضل بعد التمرين",
          ingredients: ["كرياتين مونوهيدرات 100%"],
          isNew: true,
          isBestSeller: false,
          isOnSale: false,
          isFeatured: false,
          rating: 4.6,
          reviewsCount: 89,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "تيشيرت رياضي للرجال",
          description: "تيشيرت رياضي مريح ومناسب للتمرين، مصنوع من قطن عالي الجودة مع تقنية امتصاص العرق.",
          price: 2500,
          images: [
            "https://images.pexels.com/photos/8844344/pexels-photo-8844344.jpeg"
          ],
          category: "clothing",
          subcategory: "shirts",
          brand: "Nike",
          inStock: true,
          stockQuantity: 25,
          variants: [
            { id: "v8", name: "المقاس", value: "S", stockQuantity: 5 },
            { id: "v9", name: "المقاس", value: "M", stockQuantity: 8 },
            { id: "v10", name: "المقاس", value: "L", stockQuantity: 7 },
            { id: "v11", name: "المقاس", value: "XL", stockQuantity: 5 },
            { id: "v12", name: "اللون", value: "أسود", stockQuantity: 12 },
            { id: "v13", name: "اللون", value: "أزرق", stockQuantity: 8 },
            { id: "v14", name: "اللون", value: "أحمر", stockQuantity: 5 }
          ],
          specifications: {
            "المادة": "100% قطن",
            "النوع": "رياضي",
            "العناية": "غسيل عادي"
          },
          usage: "مناسب للتمرين والاستخدام اليومي",
          isOnSale: true,
          isNew: false,
          isBestSeller: false,
          isFeatured: false,
          rating: 4.4,
          reviewsCount: 67,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Sample categories
      const sampleCategories: Omit<Category, 'id'>[] = [
        {
          name: "المكملات الغذائية",
          description: "مكملات غذائية عالية الجودة لتحسين الأداء الرياضي",
          image: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg",
          isActive: true
        },
        {
          name: "البروتين",
          parentId: "supplements",
          isActive: true
        },
        {
          name: "الكرياتين",
          parentId: "supplements",
          isActive: true
        },
        {
          name: "الملابس الرياضية",
          description: "ملابس رياضية عصرية ومريحة",
          image: "https://images.pexels.com/photos/8844344/pexels-photo-8844344.jpeg",
          isActive: true
        },
        {
          name: "التيشيرتات",
          parentId: "clothing",
          isActive: true
        }
      ];

      // Sample banners
      const sampleBanners: Omit<Banner, 'id'>[] = [
        {
          title: "عروض خاصة على المكملات الغذائية",
          description: "خصم يصل إلى 30% على جميع أنواع البروتين",
          image: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg",
          link: "/products?category=supplements",
          isActive: true,
          order: 1
        },
        {
          title: "مجموعة جديدة من الملابس الرياضية",
          description: "اكتشف أحدث صيحات الموضة الرياضية",
          image: "https://images.pexels.com/photos/8844344/pexels-photo-8844344.jpeg",
          link: "/products?category=clothing",
          isActive: true,
          order: 2
        }
      ];

      // Default store settings
      const defaultSettings: StoreSettings = {
        storeName: "GYM DADA STORE",
        storeDescription: "متجر المكملات الغذائية والملابس الرياضية",
        contactInfo: {
          phone: "+213123456789",
          email: "info@gymdada.com",
          address: "الجزائر العاصمة"
        },
        socialMedia: {
          facebook: "https://facebook.com/gymdada",
          instagram: "https://instagram.com/gymdada"
        },
        shippingSettings: {
          freeShippingThreshold: 10000,
          defaultDeskPrice: 500,
          defaultHomePrice: 800
        },
        paymentMethods: ["cod"],
        excludedWilayas: []
      };

      // Create all data
      await Promise.all([
        ...sampleProducts.map(product => createProduct(product)),
        ...sampleCategories.map(category => createCategory(category)),
        ...sampleBanners.map(banner => createBanner(banner)),
        updateStoreSettings(defaultSettings)
      ]);

      toast.success("تم تهيئة بيانات المتجر بنجاح!");
      setInitialized(true);
      
    } catch (error) {
      console.error("Error initializing store data:", error);
      toast.error("خطأ في تهيئة بيانات المتجر");
    } finally {
      setLoading(false);
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setSaving(true);
     try {
-      console.log("Saving settings:", { storeSettings, wilayas });
-      await new Promise((resolve) => setTimeout(resolve, 1000));
-      toast.success("تم حفظ الإعدادات بنجاح");
+      // Save store settings and shipping prices
+      const [settingsSuccess, shippingSuccess] = await Promise.all([
+        updateStoreSettings(storeSettings),
+        updateShippingPrices(wilayas)
+      ]);
+      
+      if (settingsSuccess && shippingSuccess) {
+        toast.success("تم حفظ الإعدادات بنجاح");
+      } else {
+        toast.error("فشل في حفظ بعض الإعدادات");
+      }
     } catch (error) {
       console.error("Error saving settings:", error);
       toast.error("خطأ في حفظ الإعدادات");
@@ .. @@
   return (
     <div className="space-y-6">
       <Title>إعدادات المتجر</Title>

+      {/* Initialize Store Data Card */}
+      {!initialized && (
+        <Card className="bg-blue-500/20 border-blue-500/30">
+          <CardHeader>
+            <CardTitle className="text-blue-400 flex items-center gap-2">
+              <Package size={20} />
+              تهيئة بيانات المتجر
+            </CardTitle>
+          </CardHeader>
+          <CardContent>
+            <p className="text-blue-400/80 mb-4">
+              يبدو أن المتجر جديد. هل تريد تهيئة بيانات تجريبية للبدء؟
+            </p>
+            <Button
+              onClick={initializeData}
+              disabled={loading}
+              className="bg-blue-500 hover:bg-blue-600 text-white"
+            >
+              {loading ? "جاري التهيئة..." : "تهيئة بيانات المتجر"}
+            </Button>
+          </CardContent>
+        </Card>
+      )}

       <form onSubmit={handleSubmit} className="space-y-6">