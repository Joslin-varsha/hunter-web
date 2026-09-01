"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { useShop } from "../src/context/ShopContext";

export default function CategoryIcons() {
  const { categories, isHomeLoading } = useShop();

  const isLoading = isHomeLoading || (!categories || categories.length === 0);

  const getIconUrl = (cat) => {
    if (cat.icon_path) {
      return cat.icon_path.startsWith("http")
        ? cat.icon_path
        : `https://meetay.com/${cat.icon_path}`;
    }
    if (cat.image_url) return cat.image_url;
    return "";
  };

  const displayCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: getIconUrl(cat),
    link: `/products?category=${cat.id}`,
  }));

  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 overflow-hidden">
      <ScrollReveal direction="up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 gap-2">
          <div>
            <p className="uppercase tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs text-gray-400 font-bold mb-0.5 sm:mb-1">
              EXPLORE BY STYLE
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black">
              Product Categories
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-1 text-[11px] sm:text-sm font-black text-gray-700 hover:text-black uppercase tracking-[1px] sm:tracking-[2px] transition whitespace-nowrap"
          >
            <span>VIEW ALL</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Circular Line-Art Icon Category Badges - Larger Sizing */}
        {isLoading ? (
          <div className="flex items-center gap-3 sm:gap-8 overflow-hidden pt-2 pb-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse flex flex-col items-center flex-shrink-0 w-24 sm:w-36 lg:w-40 space-y-3">
                <div className="w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-start lg:justify-between gap-3.5 sm:gap-8 overflow-x-auto pt-2 pb-6 px-1 scrollbar-none snap-x snap-mandatory">
            {displayCategories.map((cat, idx) => (
              <Link
                key={cat.id || idx}
                href={cat.link || "/products"}
                className="group flex flex-col items-center flex-shrink-0 snap-start cursor-pointer w-24 sm:w-36 lg:w-40"
              >
                {/* Circular light-grey background container */}
                <div className="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-[#f3f4f6] group-hover:bg-[#e5e7eb] border border-gray-100 flex items-center justify-center p-4 sm:p-7 transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:shadow-md">
                  {cat.icon && (
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Category Label */}
                <span className="mt-3.5 text-xs sm:text-sm font-black tracking-wider text-black group-hover:text-gray-800 transition uppercase text-center line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
