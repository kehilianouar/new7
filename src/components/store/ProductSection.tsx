"use client";
// Next
import { useRouter } from "next/navigation";
// External Libs
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
// Types
import { Product } from "@/types/store";
// Components
import ProductCard from "@/components/store/ProductCard";
import Title from "@/components/ui/title";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  showPagination?: boolean;
}

export default function ProductSection({ title, products, viewAllLink, showPagination }: ProductSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: true, direction: "rtl" });
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const cards = containerRef.current?.querySelectorAll(".product-card");
    if (!cards) return;

    // Animate visible cards to fade in and slide up
    const animateVisible = () => {
      const visibleIndexes = emblaApi.slidesInView();

      cards.forEach((card, i) => {
        if (visibleIndexes.includes(i)) {
          // Animate in
          gsap.to(card, { opacity: 1, y: 0, duration: .8, ease: "power3.out" });
        } else {
          // Animate out (optional)
          gsap.to(card, { opacity: 0, y: 50, duration: .8, ease: "power3.out" });
        }
      });
    };

    // Run animation on scroll and slide change
    emblaApi.on("scroll", animateVisible);
    emblaApi.on("select", animateVisible);

    // Cleanup listeners on unmount
    return () => {
      emblaApi.off("scroll", animateVisible);
      emblaApi.off("select", animateVisible);
    };
  }, [emblaApi]);

  return (
    <section className="px-4 md:px-6 py-4 md:py-6 bg-[#ffffff1a] border-1 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Title>{title}</Title>
        {viewAllLink && (
          <h3
            className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
            onClick={() => router.push(viewAllLink)}
          >
            شاهد الكل
          </h3>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6" ref={containerRef}>
          {products
            .filter((product) => product.images && product.images.length > 0)
            .map((product, i) => (
              <div key={i} className="product-card flex-shrink-0 w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}