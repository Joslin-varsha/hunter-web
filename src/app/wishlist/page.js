"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";
import { allProducts } from "../../data/products";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, getWishlistCount } = useShop();

  const savedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product, "L", 1);
    toggleWishlist(product.id);
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-12">
      <TopBar />
      <Navbar />

      {/* Clean Minimalist Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 pb-6 border-b border-gray-100 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[3px] text-gray-500 font-bold mb-1">
            Saved Favorites
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Wishlist <span className="text-gray-400 font-medium">({getWishlistCount()})</span>
          </h1>
        </div>

        {savedProducts.length > 0 && (
          <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
            {savedProducts.length} Saved Item{savedProducts.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        {savedProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
              <FiHeart className="w-8 h-8 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">No Saved Items</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Tap the heart icon on any streetwear product to save it to your wishlist.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Discover Streetwear</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl bg-white"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f6f6f6]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Remove Heart Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-red-500 text-white shadow-md active:scale-95 transition"
                    aria-label="Remove from Wishlist"
                  >
                    <FiHeart className="w-4 h-4 fill-current" />
                  </button>

                  {/* Move to Cart Quick Action */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-white/95 backdrop-blur-md text-black py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <FiShoppingBag className="w-3.5 h-3.5" />
                      Move to Bag
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex justify-between items-start pt-3 px-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 font-medium">
                      {product.category}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-black ml-2">
                    ${product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
