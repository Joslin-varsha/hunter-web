"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiChevronRight } from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/products" },
    { name: "New Arrivals", href: "/#new-arrivals" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1550px] mx-auto h-16 px-4 sm:px-6 lg:px-10 grid grid-cols-3 items-center">
          
          {/* Left: Mobile Hamburger Icon (sm/md) & Desktop Links (lg+) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-black hover:opacity-70 transition focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              <FiMenu className="w-6 h-6 stroke-[2]" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-black text-gray-700 transition"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Brand Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-black tracking-[6px] text-black"
            >
              HUNTER
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex justify-end items-center gap-3 sm:gap-6">
            <button className="p-1.5 hover:text-black text-gray-700 transition" aria-label="Search">
              <FiSearch className="w-5 h-5 stroke-[2]" />
            </button>

            <button className="p-1.5 hover:text-black text-gray-700 transition hidden sm:block" aria-label="User Account">
              <FiUser className="w-5 h-5 stroke-[2]" />
            </button>

            <button className="relative p-1.5 hover:text-black text-gray-700 transition" aria-label="Cart">
              <FiShoppingBag className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-0 -right-1 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-[360px] bg-white flex flex-col justify-between transition-transform duration-300 ease-out shadow-2xl lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <span className="text-2xl font-black tracking-[5px]">HUNTER</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-black hover:opacity-70 transition"
              aria-label="Close Mobile Menu"
            >
              <FiX className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-gray-100 text-sm px-4 py-3 rounded-xl pr-10 outline-none focus:ring-2 focus:ring-black/10"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 px-2 text-base font-semibold text-gray-900 border-b border-gray-50 hover:bg-gray-50 rounded-lg transition"
              >
                <span>{link.name}</span>
                <FiChevronRight className="text-gray-400 w-4 h-4" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer info in Drawer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
            Streetwear Culture
          </p>
          <p className="text-xs text-gray-500">
            Free shipping on orders over $60. Made for everyday creators.
          </p>
        </div>
      </div>
    </>
  );
}