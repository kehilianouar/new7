"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Banner } from "@/types/store";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";

export default function HeroSection({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (!emblaApi || !containerRef.current) return;

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);

      gsap.fromTo(
        [titleRef.current, descriptionRef.current, btnRef.current],
        { y: 50, opacity: 0, visibility: "visible" },
        {
          y: 0,
          opacity: 1,
          delay: 0.3,
          stagger: { amount: 1 },
        }
      );
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [selectedIndex, emblaApi]);

  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

  return (
    <section className="w-screen min-h-[100svh] relative bg-black" ref={containerRef}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {activeBanners.map((banner, index) => (
            <div key={banner.id} className="min-w-full h-[100svh] relative" dir="rtl">
              <Image
                fill
                priority
                unoptimized
                src={banner.image}
                alt={banner.title}
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 w-screen h-[50%] bg-gradient-to-t from-[#09090b] to-transparent" />
              <div className="absolute bottom-35 md:bottom-24 z-20 w-full flex justify-center text-center slide-content">
                <div className="w-full md:w-3/4 lg:w-1/2 text-white space-y-2 mx-4 md:mx-8">
                  <Title ref={selectedIndex === index ? titleRef : null} className="title invisible">
                    {banner.title}
                  </Title>

                  {banner.description && (
                    <p ref={selectedIndex === index ? descriptionRef : null} className="description invisible text-sm md:text-base text-white/80 text-center">
                      {banner.description}
                    </p>
                  )}

                  <div ref={selectedIndex === index ? btnRef : null} className="button invisible">
                    <Button
                      className="w-full rounded-full bg-primary hover:bg-primary/80 text-black px-6 py-2 text-sm md:text-base font-bold"
                      onClick={() => banner.link && router.push(banner.link)}
                    >
                      تسوق الآن
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-25 md:bottom-10 w-full flex justify-center gap-2 z-30">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "bg-primary w-8" : "bg-white/40 w-2.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}