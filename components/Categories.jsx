"use client";

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

export default function Categories() {
  const categories = [
    {
      title: "Oversized Tees & Tops",
      image: "/images/mens.jpg",
      tag: "Top Rated Drop",
    },
    {
      title: "Hoodies & Sweatshirts",
      image: "/images/hoodies.jpg",
      tag: "Heavyweight Fleece",
    },
    {
      title: "Cargo Pants & Denim",
      image: "/images/cargo.jpg",
      tag: "Street Silhouettes",
    },
    {
      title: "Jackets",
      image: "/images/jaacket.jpg",
      tag: "Urban Outerwear",
    },
  ];

  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12">
      {/* Heading */}
      <ScrollReveal direction="up">
        <div className="mb-8 sm:mb-12">
          <p className="uppercase tracking-[4px] sm:tracking-[5px] text-xs text-gray-500 mb-2">
            Explore Collection
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
            Categories
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* LEFT */}
        <ScrollReveal direction="right" delay={150}>
          <div className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative h-[360px] sm:h-[480px] lg:h-[620px] overflow-hidden">
              <Image
                src={categories[0].image}
                alt={categories[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:bg-black/25 transition duration-500" />

              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white">
                <p className="uppercase tracking-[3px] text-[10px] sm:text-xs opacity-80 font-medium">
                  New Collection
                </p>

                <h3 className="text-2xl sm:text-4xl font-black mt-1.5 sm:mt-2">
                  {categories[0].title}
                </h3>

                <button className="mt-4 sm:mt-6 flex items-center gap-2 bg-white text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md">
                  Explore
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {categories.slice(1).map((item, index) => (
            <ScrollReveal
              key={item.title}
              direction="left"
              delay={250 + index * 150}
            >
              <div className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative h-[220px] sm:h-[260px] lg:h-[295px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:bg-black/25 transition duration-500" />

                  <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 text-white">
                    <h3 className="text-xl sm:text-3xl font-black">
                      {item.title}
                    </h3>

                    <button className="mt-3 sm:mt-4 flex items-center gap-2 bg-white text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md">
                      Explore
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}