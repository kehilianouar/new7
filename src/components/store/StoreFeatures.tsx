"use client";
import { Truck, Shield, CreditCard, Headphones } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Title from "@/components/ui/title";

const features = [
  {
    icon: CreditCard,
    title: "الدفع عند الاستلام",
    description: "ادفع فقط عند وصول طلبك إليك"
  },
  {
    icon: Shield,
    title: "منتجات أصلية 100%",
    description: "جميع منتجاتنا أصلية ومضمونة الجودة"
  },
  {
    icon: Truck,
    title: "توصيل مجاني",
    description: "توصيل مجاني للطلبات التي تحتوي على 4 منتجات فأكثر"
  },
  {
    icon: Headphones,
    title: "دعم فني 24/7",
    description: "فريق الدعم متاح لمساعدتك في أي وقت"
  }
];

export default function StoreFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".feature-card");
    
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section className="px-2 md:px-4 py-6 md:py-8 bg-[#ffffff1a] border-1 rounded-xl" ref={containerRef}>
      <Title className="text-center mb-8">مميزات متجرنا</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 text-center hover:bg-white/10 transition-all duration-300 hover:border-primary/30"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <feature.icon className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">
              {feature.title}
            </h3>
            
            <p className="text-sm text-white/70 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}