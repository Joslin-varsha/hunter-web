"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const slides = [
  {
    id: 1,
    image: "/images/hero2.png",
    imageMobile: "/images/hero22.png", // <--- Replace with your portrait mobile image (e.g. "/images/hero-mobile1.png")
  },
  {
    id: 2,
    image: "/images/hero1.png",
    imageMobile: "/images/hero11.png", // <--- Replace with your portrait mobile image (e.g. "/images/hero-mobile2.png")
  },
  {
    id: 3,
    image: "/images/heroo.png",
    imageMobile: "/images/herooo.png", // <--- Replace with your portrait mobile image (e.g. "/images/hero-mobile3.png")
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
    <section className="w-full pt-0 pb-0 overflow-hidden">
      {/* Full-Width Edge-to-Edge Hero Banner */}
      <div className="w-full">
        <div
          className="relative w-full h-[calc(100dvh-120px)] sm:h-[calc(100vh-132px)] min-h-[380px] max-h-[780px] overflow-hidden bg-gray-900 group"
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
                {/* Desktop View Image */}
                <Image
                  src={slide.image}
                  alt={`Hero Slide Desktop ${slide.id}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="hidden sm:block object-cover object-center animate-hero-zoom"
                />

                {/* Mobile View Image */}
                <Image
                  src={slide.imageMobile || slide.image}
                  alt={`Hero Slide Mobile ${slide.id}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="sm:hidden object-cover object-center animate-hero-zoom"
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
        </div>

      {/* Edge-to-Edge Full Width Marquee Ticker Bar */}
      <div className="w-full bg-[#111111] text-white py-3 px-0 overflow-hidden shadow-sm border-t border-black">
        <div className="animate-marquee flex items-center gap-20 whitespace-nowrap text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
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