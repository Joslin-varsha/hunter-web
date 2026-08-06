"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const bestSellingProducts = [
  {
    id: 1,
    name: "Heavyweight Oversized Hoodie",
    category: "Hoodies",
    price: "$85",
    image: "/images/hoodie.jpg",
  },
  {
    id: 2,
    name: "Bomination Graphic Tee",
    category: "T-Shirts",
    price: "$38",
    image: "/images/bomination.jpg",
  },
  {
    id: 3,
    name: "Tactical Utility Cargo Pants",
    category: "Pants",
    price: "$72",
    image: "/images/cargoo.jpg",
  },
  {
    id: 4,
    name: "Off-Wrld Fleece Jacket",
    category: "Jackets",
    price: "$95",
    image: "/images/fleece.jpg",
  },
  {
    id: 5,
    name: "Vintage Acid Wash Tee",
    category: "T-Shirts",
    price: "$42",
    image: "/images/acidd.jpg",
  },
  {
    id: 6,
    name: "Relaxed Fit Black Shorts",
    category: "Shorts",
    price: "$45",
    image: "/images/shortss.jpg",
  },
  {
    id: 7,
    name: "Padded Streetwear Bomber",
    category: "Outerwear",
    price: "$110",
    image: "/images/bomber.jpg",
  },
  {
    id: 8,
    name: "Supreme Satin Applique Hooded Sweatshirt",
    category: "Hoodies",
    price: "$150",
    image: "/images/supreme.jpg",
  },
];

export default function BestSelling() {
  return (
    <section
      id="products"
      className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12"
    >
      {/* Header */}
      <ScrollReveal direction="up">
        <div className="flex justify-between items-end mb-8 sm:mb-12">
          <div>
            <p className="uppercase tracking-[4px] sm:tracking-[5px] text-xs text-gray-500 mb-1.5 sm:mb-2">
              Featured Collection
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
              Best Selling
            </h2>
          </div>

          <Link
            href="#products"
            className="group flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[2px]"
          >
            View All
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </ScrollReveal>

      {/* 2-Column Mobile & 4-Column Desktop Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {bestSellingProducts.map((item, idx) => (
          <ScrollReveal key={item.id} direction="up" delay={100 * (idx + 1)}>
            <div className="group cursor-pointer flex flex-col transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f6f6f6]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />
                
                {/* Quick View Button */}
                <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 translate-y-3 sm:translate-y-6 opacity-90 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="bg-white/95 backdrop-blur-md text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:bg-black hover:text-white transition-all">
                    Quick View
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start pt-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-black">
                    {item.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[2px] text-gray-500 mt-0.5 sm:mt-1">{item.category}</p>
                </div>

                <span className="text-base sm:text-lg font-bold text-black ml-2">
                  {item.price}
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}