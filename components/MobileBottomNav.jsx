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
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-200/90 px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[56px] min-h-[44px] transition-all active:scale-95 ${
              isActive ? "text-black font-extrabold" : "text-gray-500 hover:text-black font-medium"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${isActive ? "font-extrabold" : "font-semibold"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
