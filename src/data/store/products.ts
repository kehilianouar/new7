import { Product, Category, Banner } from "@/types/store";

// بيانات وهمية للمنتجات
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "واي بروتين جولد ستاندرد",
    description: "بروتين عالي الجودة لبناء العضلات وتحسين الأداء الرياضي",
    price: 8500,
    originalPrice: 10000,
    discount: 15,
    slug: "whey-protein-gold-standard",
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
    rating: 4.8,
    reviewsCount: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "كرياتين مونوهيدرات",
    description: "كرياتين نقي لزيادة القوة والطاقة أثناء التمرين",
    price: 3500,
    slug: "creatine-monohydrate",
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
      "عدد الحصص": "60 حصة"
    },
    usage: "تناول 5 جرام يومياً مع الماء أو العصير",
    ingredients: ["كرياتين مونوهيدرات 100%"],
    isNew: true,
    rating: 4.6,
    reviewsCount: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "تيشيرت رياضي للرجال",
    description: "تيشيرت رياضي مريح ومناسب للتمرين",
    price: 2500,
    slug: "sports-tshirt-men",
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
      "النوع": "رياضي"
    },
    isOnSale: true,
    rating: 4.4,
    reviewsCount: 67,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "شورت رياضي",
    description: "شورت رياضي مريح للتمرين والجري",
    price: 1800,
    slug: "sports-shorts",
    images: [
      "https://images.pexels.com/photos/7319070/pexels-photo-7319070.jpeg"
    ],
    category: "clothing",
    subcategory: "shorts",
    brand: "Adidas",
    inStock: true,
    stockQuantity: 40,
    variants: [
      { id: "v15", name: "المقاس", value: "S", stockQuantity: 10 },
      { id: "v16", name: "المقاس", value: "M", stockQuantity: 12 },
      { id: "v17", name: "المقاس", value: "L", stockQuantity: 10 },
      { id: "v18", name: "المقاس", value: "XL", stockQuantity: 8 }
    ],
    isNew: true,
    rating: 4.3,
    reviewsCount: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockCategories: Category[] = [
  {
    id: "supplements",
    name: "المكملات الغذائية",
    description: "مكملات غذائية عالية الجودة لتحسين الأداء الرياضي",
    image: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg",
    isActive: true
  },
  {
    id: "protein",
    name: "البروتين",
    parentId: "supplements",
    isActive: true
  },
  {
    id: "creatine",
    name: "الكرياتين",
    parentId: "supplements",
    isActive: true
  },
  {
    id: "clothing",
    name: "الملابس الرياضية",
    description: "ملابس رياضية عصرية ومريحة",
    image: "https://images.pexels.com/photos/8844344/pexels-photo-8844344.jpeg",
    isActive: true
  },
  {
    id: "shirts",
    name: "التيشيرتات",
    parentId: "clothing",
    isActive: true
  },
  {
    id: "shorts",
    name: "الشورتات",
    parentId: "clothing",
    isActive: true
  }
];

export const mockBanners: Banner[] = [
  {
    id: "1",
    title: "عروض خاصة على المكملات الغذائية",
    description: "خصم يصل إلى 30% على جميع أنواع البروتين",
    image: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg",
    link: "/products?category=supplements",
    isActive: true,
    order: 1
  },
  {
    id: "2",
    title: "مجموعة جديدة من الملابس الرياضية",
    description: "اكتشف أحدث صيحات الموضة الرياضية",
    image: "https://images.pexels.com/photos/8844344/pexels-photo-8844344.jpeg",
    link: "/products?category=clothing",
    isActive: true,
    order: 2
  },
  {
    id: "3",
    title: "توصيل مجاني للطلبات فوق 4 منتجات",
    description: "استفد من عرض التوصيل المجاني",
    image: "https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg",
    link: "/products",
    isActive: true,
    order: 3
  }
];