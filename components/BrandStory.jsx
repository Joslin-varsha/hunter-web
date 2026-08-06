"use client";

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

export default function BrandStory() {
  return (
    <section
      id="about"
      className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left Content */}
        <ScrollReveal direction="right" delay={100}>
          <div className="max-w-xl">

            <p className="uppercase tracking-[4px] sm:tracking-[5px] text-xs text-gray-500 mb-2 sm:mb-3">
              Our Story
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight text-black">
              Born in the streets,
              <br />
              made for the culture.
            </h2>

            <p className="mt-4 sm:mt-8 text-gray-600 text-base sm:text-lg leading-relaxed sm:leading-8">
              More than just menswear, Hunter Men represents individuality,
              confidence, and the spirit of modern urban culture. Inspired by
              street lifestyle, every collection is crafted with heavyweight
              fabrics, bold silhouettes, and timeless tailoring that elevate
              everyday men's style.
            </p>

            <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg leading-relaxed sm:leading-8 hidden sm:block">
              From oversized graphic drops to tactical utility pieces, our mission
              remains clear: engineer menswear that blends raw comfort, durability,
              and authenticity for the next generation of icons.
            </p>

            <button className="group mt-6 sm:mt-10 flex items-center gap-3 bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-gray-900 active:scale-95 hover:scale-105 shadow-md">
              Discover Our Story

              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

          </div>
        </ScrollReveal>

        {/* Right Image */}
        <ScrollReveal direction="left" delay={250}>
          <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">

            <Image
              src="/images/brand-story.jpg"
              alt="Brand Story"
              width={800}
              height={1000}
              className="w-full h-[380px] sm:h-[500px] lg:h-[650px] object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:bg-black/25 transition duration-500" />

            {/* Floating Card */}
            <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-5 text-white max-w-[85%]">

              <p className="uppercase tracking-[3px] text-[10px] sm:text-xs opacity-80 font-medium">
                Since 2019
              </p>

              <h3 className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">
                Designed for Everyday Icons
              </h3>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}