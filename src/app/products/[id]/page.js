"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHeart,
  FiShoppingBag,
  FiArrowLeft,
  FiCheck,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import TopBar from "../../../../components/TopBar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import MobileBottomNav from "../../../../components/MobileBottomNav";
import ScrollReveal from "../../../../components/ScrollReveal";
import { allProducts } from "../../../data/products";
import { useShop } from "../../../context/ShopContext";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const router = useRouter();

  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const product = allProducts.find((p) => p.id === productId) || allProducts[0];

  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const isSaved = isInWishlist(product.id);

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // Related products from same category or fallback
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const [hideMobileBottomBar, setHideMobileBottomBar] = useState(false);

  // Hide sticky mobile action bar when user scrolls into Related Drops section (Meesho app style)
  useEffect(() => {
    const targetSection = document.getElementById("related-drops-section");
    if (!targetSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideMobileBottomBar(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(targetSection);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    router.push(`/cart?buyNow=true&id=${product.id}&size=${selectedSize}&qty=${quantity}`);
  };

  return (
    <main className="min-h-screen bg-white pb-36 lg:pb-12">
      <TopBar />
      <Navbar />

      {/* Added to Cart Toast Banner */}
      {showAddedToast && (
        <div className="fixed top-20 right-4 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
            <FiCheck className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Added to Bag!</p>
            <p className="text-[11px] text-gray-300">
              {product.name} ({selectedSize}) x{quantity}
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition">
            Products
          </Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Product Image Gallery (Compact aspect-square on mobile) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative aspect-square sm:aspect-[3/4] w-full max-w-[450px] rounded-3xl overflow-hidden bg-[#f6f6f6] shadow-md border border-gray-100 group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Tag Badge */}
              {product.tag && (
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  {product.tag}
                </span>
              )}

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md active:scale-95 ${
                  isSaved
                    ? "bg-red-500 text-white"
                    : "bg-white/80 text-black hover:bg-black hover:text-white"
                }`}
                aria-label="Toggle Wishlist"
              >
                <FiHeart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Category */}
              <p className="text-xs uppercase tracking-[3px] font-bold text-gray-500 mb-1">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 sm:mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-black">${product.price}</span>
                <span className="text-xs text-gray-400 font-medium">
                  Tax included. Free shipping over $60.
                </span>
              </div>

              <hr className="my-4 sm:my-6 border-gray-100" />

              {/* Size Selector */}
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Select Size: <span className="font-extrabold">{selectedSize}</span>
                  </span>
                  <button className="text-[11px] font-bold uppercase tracking-wider text-gray-500 underline hover:text-black">
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase transition-all border ${
                        selectedSize === size
                          ? "bg-black text-white border-black shadow-md scale-105"
                          : "bg-gray-50 text-black border-gray-200 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-5 sm:mb-6">
                <span className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Quantity:
                </span>

                <div className="inline-flex items-center border border-gray-200 rounded-full bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black font-bold flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="w-10 sm:w-12 text-center text-xs font-black text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black font-bold flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Visible on desktop (hidden on mobile to prevent double buttons) */}
              <div className="hidden sm:grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  <FiShoppingBag className="w-4 h-4 stroke-[2]" />
                  Add to Bag • ${(product.price * quantity).toFixed(2)}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-black/90 hover:bg-black text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  Buy Now
                </button>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <div className="flex flex-col items-center">
                  <FiTruck className="w-5 h-5 text-black mb-1" />
                  <span className="text-[10px] font-bold uppercase text-gray-700">Free Express</span>
                </div>
                <div className="flex flex-col items-center">
                  <FiRefreshCw className="w-5 h-5 text-black mb-1" />
                  <span className="text-[10px] font-bold uppercase text-gray-700">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center">
                  <FiShield className="w-5 h-5 text-black mb-1" />
                  <span className="text-[10px] font-bold uppercase text-gray-700">Secure Payment</span>
                </div>
              </div>

              {/* Product Accordion / Details */}
              <div className="mt-8 border-t border-gray-100 pt-6 space-y-4">
                <div>
                  <button
                    onClick={() => setActiveTab(activeTab === "details" ? "" : "details")}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-black"
                  >
                    <span>Product Details & Specs</span>
                    {activeTab === "details" ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {activeTab === "details" && (
                    <div className="mt-2 text-xs text-gray-600 space-y-1.5 leading-relaxed pl-1">
                      <p>• Premium 450GSM Heavyweight 100% Cotton Fleece</p>
                      <p>• Engineered for an authentic oversized streetwear fit</p>
                      <p>• Ribbed cuffs and hem with reinforced double stitching</p>
                      <p>• Pre-shrunk fabric to preserve shape after washing</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={() => setActiveTab(activeTab === "shipping" ? "" : "shipping")}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-black"
                  >
                    <span>Shipping & Delivery Policy</span>
                    {activeTab === "shipping" ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {activeTab === "shipping" && (
                    <div className="mt-2 text-xs text-gray-600 space-y-1.5 leading-relaxed pl-1">
                      <p>• Orders dispatched within 24-48 business hours.</p>
                      <p>• Fast express shipping available nationwide.</p>
                      <p>• 14-day hassle-free exchange & return policy.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Related Products */}
        <div id="related-drops-section" className="mt-16 pt-10 border-t border-gray-100">
          
          {/* Action Buttons rendered at top of Related Products on mobile */}
          <div className="flex items-center gap-3 mb-8 sm:hidden">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition text-center"
            >
              Add to Bag
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-black/90 text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition text-center"
            >
              Buy Now
            </button>
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[4px] text-gray-400 font-semibold mb-1">
              You Might Also Like
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
              Related Drops
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {fallbackRelated.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group cursor-pointer flex flex-col rounded-2xl transition-all duration-500 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f6f6f6]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.tag && (
                    <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-start pt-3 px-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-black ml-2">
                    ${item.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile E-Commerce Sticky Bottom Action Bar (Hides when reaching Related Drops like Meesho app) */}
      {!hideMobileBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-gray-200 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center gap-3 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition text-center"
          >
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-black/90 text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition text-center"
          >
            Buy Now
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
