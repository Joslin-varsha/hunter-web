"use client";

import Link from "next/link";
import { FiHome, FiGrid, FiHeart, FiShoppingBag } from "react-icons/fi";

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200/80 px-6 py-2 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <Link
        href="/"
        className="flex flex-col items-center gap-1 text-black font-semibold transition"
      >
        <FiHome className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] uppercase tracking-wider font-bold">Home</span>
      </Link>

      <Link
        href="#products"
        className="flex flex-col items-center gap-1 text-gray-500 hover:text-black transition"
      >
        <FiGrid className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] uppercase tracking-wider font-medium">Shop</span>
      </Link>

      <Link
        href="#new-arrivals"
        className="flex flex-col items-center gap-1 text-gray-500 hover:text-black transition"
      >
        <FiHeart className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] uppercase tracking-wider font-medium">Saved</span>
      </Link>

      <Link
        href="#products"
        className="relative flex flex-col items-center gap-1 text-gray-500 hover:text-black transition"
      >
        <div className="relative">
          <FiShoppingBag className="w-5 h-5 stroke-[2]" />
          <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
            0
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-medium">Bag</span>
      </Link>
    </div>
  );
}
