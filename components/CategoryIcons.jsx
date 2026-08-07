"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const categoryPhotoItems = [
  {
    name: "T-Shirt",
    tag: "Oversized Tees",
    image: "/images/tshirt.png",
    link: "/products",
  },
  {
    name: "Jean",
    tag: "Vintage Denim",
    image: "/images/jean.png",
    link: "/products",
  },
  {
    name: "Shirt",
    tag: "Rugby & Polos",
    image: "/images/shirt.png",
    link: "/products",
  },
  {
    name: "Hoodies",
    tag: "Heavy Fleece",
    image: "/images/hoodiee.png",
    link: "/products",
  },
  {
    name: "Track Pant",
    tag: "Street Pants",
    image: "/images/track.png",
    link: "/products",
  },
  {
    name: "Jacket",
    tag: "Urban Outerwear",
    image: "/images/jacket.png",
    link: "/products",
  },
  {
    name: "Pant",
    tag: "Cargo & Utility",
    image: "/images/pant.png",
    link: "/products",
  },
  {
    name: "Shorts",
    tag: "Summer Fits",
    image: "/images/shorts.png",
    link: "/products",
  },
   {
    name: "Co-ord set",
    tag: "Matching Sets",
    image: "/images/coord.png",
    link: "/products",
  },
  {
    name: "Cap",
    tag: "Caps & Beanies",
    image: "/images/cap.png",
    link: "/products",
  },
  {
    name: "Shoe",
    tag: "High-Top Kicks",
    image: "/images/shoe.png",
    link: "/products",
  },
  
  {
    name: "Watch",
    tag: "Timepieces",
    image: "/images/watch.png",
    link: "/products",
  },
  {
    name: "Perfume",
    tag: "Fragrance",
    image: "/images/perfume.png",
    link: "/products",
  },
  {
    name: "Specs",
    tag: "Eyewear",
    image: "/images/specs.png",
    link: "/products",
  },
  {
    name: "Wallet",
    tag: "Leather Goods",
    image: "/images/wallet.png",
    link: "/products",
  },
  {
    name: "Accessories",
    tag: "Urban Extras",
    image: "/images/access.png",
    link: "/products",
  },
 
];

export default function CategoryIcons() {
  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 overflow-hidden">
      <ScrollReveal direction="up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="uppercase tracking-[4px] sm:tracking-[5px] text-xs text-gray-500 mb-1 font-semibold">
              Explore By Style
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Product Categories
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 hover:text-black uppercase tracking-[2px] transition"
          >
            <span>View All</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Circular Photo Category Badges - Horizontal Touch Scroll */}
        <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto pt-1 pb-4 px-1 scrollbar-none snap-x snap-mandatory">
          {categoryPhotoItems.map((cat) => (
            <Link
              key={cat.name}
              href={cat.link}
              className="group flex flex-col items-center flex-shrink-0 snap-start cursor-pointer w-24 sm:w-32"
            >
              {/* Fully Rounded Circle Photo Container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-black transition-colors duration-300 shadow-sm group-hover:shadow-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 96px, 128px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-115"
                />

                {/* Subtle Hover Dark Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
              </div>

              {/* Category Label */}
              <span className="mt-2.5 text-xs sm:text-sm font-black tracking-wide text-gray-900 group-hover:text-black transition uppercase text-center line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
