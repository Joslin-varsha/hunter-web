"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const slides = [
  {
    id: 1,
    image: "/images/hero2.png",
  },
  {
    id: 2,
    image: "/images/hero1.png",
  },
  {
    id: 3,
    image: "/images/heroo.png",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const marqueeItems = Array(12).fill("FREE SHIPPING ON ORDERS ABOVE $60");

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <section className="w-full pt-1 pb-0">
      {/* Main Hero Card Container */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <ScrollReveal direction="scale" delay={100}>
          <div
            className="relative w-full h-[calc(100vh-160px)] min-h-[480px] sm:min-h-[550px] max-h-[780px] rounded-[24px] sm:rounded-[36px] overflow-hidden bg-gray-900 shadow-xl group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Image Slides */}
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={`Hero Slide ${slide.id}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover object-center animate-hero-zoom"
                />
              </div>
            ))}

            {/* Controls: Arrow Navigation & Counter */}
            <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-30 flex items-center gap-3">
              {/* Slide Counter */}
              <span className="text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full font-mono text-xs sm:text-sm font-semibold tracking-widest border border-white/10 mr-1">
                0{currentSlide + 1} / 0{slides.length}
              </span>

              {/* Prev Button */}
              <button
                onClick={prevSlide}
                className="p-3 sm:p-3.5 rounded-full bg-black/40 hover:bg-white hover:text-black border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg"
                aria-label="Previous Slide"
              >
                <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="p-3 sm:p-3.5 rounded-full bg-black/40 hover:bg-white hover:text-black border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg"
                aria-label="Next Slide"
              >
                <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Bottom Left Slide Dots */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 z-30 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentSlide
                      ? "w-8 bg-white shadow-md"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Edge-to-Edge Full Width Marquee Ticker Bar */}
      <div className="mt-2 w-full bg-[#111111] text-white py-4 px-0 overflow-hidden shadow-sm border-y border-black">
        <div className="animate-marquee flex items-center gap-20 whitespace-nowrap text-[12px] sm:text-xs font-semibold tracking-widest uppercase">
          {marqueeItems.map((text, idx) => (
            <span key={idx} className="flex items-center gap-20">
              <span>{text}</span>
              <span className="text-base text-gray-400">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}