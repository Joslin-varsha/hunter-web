"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useShop } from "../src/context/ShopContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getCartCount, getWishlistCount } = useShop();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const navItems = [
    { name: "Home", href: "/", icon: FiHome },
    { name: "Shop", href: "/products", icon: FiGrid },
    { name: "Saved", href: "/wishlist", icon: FiHeart, badge: wishlistCount },
    { name: "Bag", href: "/cart", icon: FiShoppingBag, badge: cartCount },
    { name: "Account", href: "/account", icon: FiUser },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 px-2 py-2 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-2 transition-all ${
              isActive ? "text-black font-bold" : "text-gray-500 hover:text-black"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${isActive ? "font-bold" : "font-medium"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
