"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const logos = [
  { name: "CEE-Examination", image: "/logos/cee-examlogo.png" },
  { name: "IOM", image: "/logos/IOM.png" },
  { name: "Lok Sewa", image: "/logos/cee-examlogo.png" },
  { name: "Kathmandu University", image: "/logos/ku.png" },
  { name: "IOE", image: "/logos/iom.png" },
];

export default function LogoTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 1; // Slow speed (0.5px per frame)

    const animate = () => {
      // Move from left to right by decreasing scrollLeft
      scrollContainer.scrollLeft -= scrollSpeed;

      // Reset to the end when reaching the start
      if (scrollContainer.scrollLeft <= 0) {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const scrollAmount = scrollContainer.offsetWidth * 0.8;
    scrollContainer.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="py-12 md:py-16 bg-background"
      aria-labelledby="partners-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            Trusted Partners
          </motion.div>
          <motion.h2
            id="partners-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
          >
            Institutions We Support
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Prepare with past questions from Nepal’s top educational institutions.
          </motion.p>
        </div>

        {/* Logo Ticker */}
        <div className="relative">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:[mask-image:none]">
            <div
              ref={scrollRef}
              className="flex items-center gap-6 md:gap-12 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[...logos, ...logos].map((logo, index) => (
                <motion.div
                  key={`${logo.name}-${index}`}
                  className="flex-shrink-0 snap-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-4 rounded-lg bg-card border border-border/20 hover:shadow-md transition-shadow duration-300 h-20 w-36 md:h-24 md:w-44 flex items-center justify-center">
                    <Image
                      src={logo.image || "/placeholder.svg"}
                      alt={`${logo.name} logo`}
                      height={50}
                      width={150}
                      className="h-auto w-auto max-h-[70%] max-w-[80%] object-contain"
                    />
                  </div>
                  <p className="mt-2 text-sm text-center text-muted-foreground font-medium">
                    {logo.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Visible on Mobile Only */}
          <div className="md:hidden flex justify-between mt-6">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-background border border-border/50 text-foreground hover:bg-muted transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-background border border-border/50 text-foreground hover:bg-muted transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}