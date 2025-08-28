"use client";

import Link from "next/link";
import Image from "next/image";
import Title from "@/components/ui/title";

const categories = [
  {
    id: "bestsellers",
    name: "الأكثر مبيعاً",
    icon: "/images/categories/bestseller.png",
    href: "/products?filter=bestsellers",
    color: "from-red-500 to-orange-500"
  },
  {
    id: "offers",
    name: "عروض مميزة",
    icon: "/images/categories/promotion.png", 
    href: "/products?filter=sale",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "mens",
    name: "ملابس رجالية",
    icon: "/images/categories/mens.png",
    href: "/products?category=clothing&gender=mens",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "womens", 
    name: "القسم النسائي",
    icon: "/images/categories/womens.png",
    href: "/products?category=clothing&gender=womens",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "equipment",
    name: "معدات وعناية شخصية",
    icon: "/images/categories/equipment.png",
    href: "/products?category=equipment",
    color: "from-purple-500 to-indigo-500"
  }
];

export default function CategoriesSection() {
  return (
    <section className="px-2 md:px-4 py-6 md:py-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl backdrop-blur-sm">
      <Title className="text-center mb-6 md:mb-8">فئات المتجر</Title>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
          >
            {/* Circular Icon Container */}
            <div className="relative mb-3 md:mb-4">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gray-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gray-300 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {/* Icon Container */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 backdrop-blur-sm border border-gray-200/30 rounded-full flex items-center justify-center group-hover:border-gray-300 transition-all duration-300">
                {/* Actual category icon */}
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-0 invert-[0.1]"
                />
              </div>
              
              {/* Hover Indicator */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Category Name */}
            <span className="text-white text-xs md:text-sm font-medium group-hover:text-primary transition-colors duration-300">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse delay-1000"></div>
    </section>
  );
}
