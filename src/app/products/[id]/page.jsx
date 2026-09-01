"use client";

import { useState, useEffect, use, useRef } from "react";
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
} from "react-icons/fi";
import TopBar from "../../../../components/TopBar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import ScrollReveal from "../../../../components/ScrollReveal";
import { useShop } from "../../../context/ShopContext";
import { fetchProductDetails, fetchProductList, fetchHomeData } from "../../../utils/api";

function formatShortSize(sizeStr) {
  if (!sizeStr) return "";
  const str = String(sizeStr).trim();
  const match = str.match(/^([A-Za-z0-9]+)\(/);
  if (match) return match[1];
  return str;
}

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productIdOrSlug = resolvedParams.id;
  const router = useRouter();

  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [liveProduct, setLiveProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [relatedProductsList, setRelatedProductsList] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showStickyBottomBar, setShowStickyBottomBar] = useState(true);
  const inlineActionsRef = useRef(null);

  // Hide mobile sticky bottom bar when static action buttons at end of product details enter viewport
  useEffect(() => {
    const targetNode = inlineActionsRef.current;
    if (!targetNode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBottomBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(targetNode);
    return () => observer.disconnect();
  }, [liveProduct]);

  // Fetch live product data from GET /hunter-mens-wear/product/{slug}
  useEffect(() => {
    async function loadDetails() {
      setIsLoading(true);
      let res = await fetchProductDetails(productIdOrSlug);

      // Smart Fallback: If numeric ID was passed (e.g. 4604) and server returned 0 "Product not found",
      // lookup slug from product list API and fetch by slug!
      if ((!res || res?.status === 0) && !isNaN(Number(productIdOrSlug))) {
        const listRes = await fetchProductList({ page: 1 });
        const homeRes = await fetchHomeData();

        const allCandidates = [
          ...(listRes?.data?.products || []),
          ...(homeRes?.data?.all_products || []),
          ...(homeRes?.data?.bestseller_products || []),
        ];

        const matched = allCandidates.find((p) => String(p.id) === String(productIdOrSlug));
        if (matched?.slug) {
          res = await fetchProductDetails(matched.slug);
        }
      }

      if (res?.status === 1 && res?.data?.product) {
        const prodData = res.data.product;
        setLiveProduct(prodData);

        // Populate size variants & auto-select first in-stock variant
        if (res.data.variants && res.data.variants.length > 0) {
          setVariants(res.data.variants);
          const firstInStockVariant = res.data.variants.find((v) => Number(v.stock) > 0);
          setSelectedSize(firstInStockVariant ? firstInStockVariant.variant : res.data.variants[0].variant);
        } else {
          const cat = (prodData.category || prodData.category_name || prodData.name || "").toLowerCase();
          let defaultSizes = ["S", "M", "L", "XL"];
          if (cat.includes("pant") || cat.includes("jean") || cat.includes("bottom") || cat.includes("short")) {
            defaultSizes = ["28", "30", "32", "34", "36"];
          } else if (cat.includes("cap") || cat.includes("hat") || cat.includes("watch") || cat.includes("accessory")) {
            defaultSizes = ["Adjustable"];
          }
          const generated = defaultSizes.map((s, i) => ({ id: `def-${i}`, variant: s, stock: 10 }));
          setVariants(generated);
          setSelectedSize(defaultSizes[0]);
        }

        // Product gallery images
        if (res.data.product_images && res.data.product_images.length > 0) {
          setProductImages(res.data.product_images);
        } else {
          setProductImages([]);
        }

        // Related products
        if (res.data.related_products) {
          setRelatedProductsList(res.data.related_products);
        }
      }
      setIsLoading(false);
    }

    if (productIdOrSlug) {
      loadDetails();
    }
  }, [productIdOrSlug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <TopBar />
        <Navbar />
        <div className="py-36 text-center">
          <div className="inline-block w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-4">
            Loading Product Details...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!liveProduct) {
    return (
      <main className="min-h-screen bg-white">
        <TopBar />
        <Navbar />
        <div className="py-36 text-center px-4">
          <h2 className="text-2xl font-black uppercase text-black">Product Not Found</h2>
          <p className="text-gray-500 text-xs mt-2">The requested product could not be loaded.</p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Back to Products
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const isSaved = isInWishlist(liveProduct.id);
  const imgUrl = liveProduct.cover_image_url || (liveProduct.cover_image_path ? `https://meetay.com/${liveProduct.cover_image_path}` : "");
  const formattedPrice = `₹${(liveProduct.sale_price || liveProduct.price || 0).toLocaleString("en-IN")}`;
  const formattedOriginalPrice = liveProduct.price > (liveProduct.sale_price || 0) ? `₹${liveProduct.price.toLocaleString("en-IN")}` : null;

  const matchedVariant = Array.isArray(variants) && variants.length > 0
    ? variants.find((v) => formatShortSize(v.variant) === selectedSize || v.variant === selectedSize) || variants[0]
    : null;
  const activeVariantId = matchedVariant?.id || liveProduct.variant_id || liveProduct.id;

  const handleAddToCart = () => {
    const itemToAdd = {
      id: liveProduct.id,
      name: liveProduct.name,
      price: liveProduct.sale_price || liveProduct.price,
      image: imgUrl,
      variant_id: activeVariantId,
      variants: variants,
    };
    addToCart(itemToAdd, selectedSize, quantity);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    const targetPrice = liveProduct.sale_price || liveProduct.price || 0;
    const url = `/checkout?buyNow=true&id=${liveProduct.id}&slug=${encodeURIComponent(liveProduct.slug || liveProduct.id)}&size=${encodeURIComponent(selectedSize)}&qty=${quantity}&name=${encodeURIComponent(liveProduct.name)}&price=${targetPrice}&img=${encodeURIComponent(imgUrl)}&variant_id=${activeVariantId}`;
    router.push(url);
  };

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
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
              {liveProduct.name} ({selectedSize}) x{quantity}
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb Header / Mobile Back Button */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5 border-b border-gray-100">
        {/* Mobile View: Back Button */}
        <button
          onClick={() => router.back()}
          className="sm:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-600 transition active:scale-95"
          aria-label="Go Back"
        >
          <FiArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back</span>
        </button>

        {/* Desktop View: Breadcrumb Navigation */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition">
            Products
          </Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-[200px]">
            {liveProduct.name}
          </span>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            <div className="relative aspect-square sm:aspect-[3/4] w-full max-w-[450px] rounded-3xl overflow-hidden bg-[#f6f6f6] shadow-md border border-gray-100 group">
              <img
                src={imgUrl}
                alt={liveProduct.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Tag Badge */}
              {liveProduct.trending === 1 && (
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  Trending
                </span>
              )}

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist({ ...liveProduct, selectedSize })}
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

            {/* Thumbnail Gallery (if product_images present) */}
            {productImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    className="w-16 h-20 rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img src={img.image_url || img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Category */}
              <p className="text-xs uppercase tracking-[3px] font-bold text-gray-500 mb-1">
                HUNTER STREETWEAR
              </p>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                {liveProduct.name}
              </h1>

              {/* Price */}
              <div className="mt-3 sm:mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-black">{formattedPrice}</span>
                {formattedOriginalPrice && (
                  <span className="text-base text-gray-400 line-through font-semibold">
                    {formattedOriginalPrice}
                  </span>
                )}
                <span className="text-xs text-gray-400 font-medium">
                  Tax included. Free shipping across India.
                </span>
              </div>

              <hr className="my-4 sm:my-6 border-gray-100" />

              {/* Size Selector strictly based on variant stock */}
              {variants.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-black">
                      Select Size: <span className="font-black text-black">{selectedSize}</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {variants.map((v) => {
                      const isOutOfStock = v.stock !== undefined && Number(v.stock) <= 0;
                      const isSelected = selectedSize === v.variant && !isOutOfStock;

                      return (
                        <button
                          key={v.id || v.variant}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(v.variant)}
                          className={`px-4 py-2.5 h-11 min-w-[48px] rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center border ${
                            isOutOfStock
                              ? "bg-gray-100 text-gray-400 border-gray-100 line-through opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "bg-black text-white border-black shadow-md scale-105"
                              : "bg-white text-black border-gray-200 hover:border-black"
                          }`}
                        >
                          <span>{v.variant}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-black mb-3">
                  Quantity
                </label>
                <div className="flex items-center w-36 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-12 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-sm text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-12 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Desktop Actions (Add to Bag & Buy Now) */}
              {(() => {
                const isAllOutOfStock = Array.isArray(variants) && variants.length > 0 && variants.every((v) => Number(v.stock) <= 0);

                return (
                  <div className="hidden lg:grid grid-cols-2 gap-3 sm:gap-4 my-6 sm:my-8">
                    <button
                      disabled={isAllOutOfStock}
                      onClick={handleAddToCart}
                      className={`w-full py-3.5 sm:py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-xl ${
                        isAllOutOfStock
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                          : "bg-black text-white hover:bg-gray-800 active:scale-[0.99]"
                      }`}
                    >
                      {isAllOutOfStock ? "OUT OF STOCK" : "ADD TO BAG"}
                    </button>
                    <button
                      disabled={isAllOutOfStock}
                      onClick={handleBuyNow}
                      className={`w-full py-3.5 sm:py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-xl ${
                        isAllOutOfStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          : "bg-amber-400 text-black hover:bg-amber-500 active:scale-[0.99]"
                      }`}
                    >
                      BUY IT NOW
                    </button>
                  </div>
                );
              })()}

              {/* Guarantee Perks Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 mb-6">
                <div className="flex flex-col items-center text-center p-2">
                  <FiTruck className="w-5 h-5 text-black mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black">
                    Fast Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2 border-x border-gray-200">
                  <FiRefreshCw className="w-5 h-5 text-black mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black">
                    Easy Exchange
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <FiShield className="w-5 h-5 text-black mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black">
                    100% Authentic
                  </span>
                </div>
              </div>

              {/* Collapsible Tabs */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setActiveTab(activeTab === "details" ? "" : "details")}
                    className="w-full flex items-center justify-between text-left text-xs font-black uppercase tracking-wider text-black py-1"
                  >
                    <span>Product Specification</span>
                    <span>{activeTab === "details" ? "-" : "+"}</span>
                  </button>
                  {activeTab === "details" && (
                    <div className="mt-3 text-xs text-gray-600 space-y-2 leading-relaxed">
                      <p>{liveProduct.description || "High premium heavyweight cotton streetwear fit."}</p>
                      <p>Weight: {liveProduct.product_weight || "0.600"} kg</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Actions at End of Product Details (Top of Related Drops) */}
              {(() => {
                const isAllOutOfStock = Array.isArray(variants) && variants.length > 0 && variants.every((v) => Number(v.stock) <= 0);

                return (
                  <div ref={inlineActionsRef} className="lg:hidden grid grid-cols-2 gap-3 my-6 pt-4 border-t border-gray-100">
                    <button
                      disabled={isAllOutOfStock}
                      onClick={handleAddToCart}
                      className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-xl ${
                        isAllOutOfStock
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                          : "bg-black text-white active:scale-[0.99]"
                      }`}
                    >
                      {isAllOutOfStock ? "OUT OF STOCK" : "ADD TO BAG"}
                    </button>
                    <button
                      disabled={isAllOutOfStock}
                      onClick={handleBuyNow}
                      className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-xl ${
                        isAllOutOfStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          : "bg-amber-400 text-black active:scale-[0.99]"
                      }`}
                    >
                      BUY IT NOW
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProductsList.length > 0 && (
        <section
          id="related-drops-section"
          className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 border-t border-gray-100"
        >
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="uppercase tracking-[4px] text-xs text-gray-400 font-bold mb-1">
                  YOU MAY ALSO LIKE
                </p>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                  Related Drops
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs sm:text-sm font-black text-gray-700 hover:text-black uppercase tracking-[2px] transition"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProductsList.slice(0, 4).map((rel) => {
                const relImg = rel.cover_image_url || (rel.cover_image_path ? `https://meetay.com/${rel.cover_image_path}` : "");
                const relPrice = `₹${(rel.sale_price || rel.price || 0).toLocaleString("en-IN")}`;

                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug || rel.id}`}
                    className="group cursor-pointer flex flex-col rounded-2xl bg-white border border-gray-100 p-2.5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f6f6f6] flex items-center justify-center">
                      <img
                        src={relImg}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-3 px-1">
                      <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-1">
                        {rel.name}
                      </h3>
                      <span className="text-xs sm:text-sm font-black text-black mt-1 block">
                        {relPrice}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Sticky Mobile Bottom Actions Bar */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3 transition-all duration-300 transform ${
          showStickyBottomBar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {(() => {
          const isAllOutOfStock = Array.isArray(variants) && variants.length > 0 && variants.every((v) => Number(v.stock) <= 0);

          return (
            <>
              <button
                disabled={isAllOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                  isAllOutOfStock
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white active:scale-95"
                }`}
              >
                <FiShoppingBag className="w-4 h-4" />
                <span>{isAllOutOfStock ? "OUT OF STOCK" : "ADD TO BAG"}</span>
              </button>
              <button
                disabled={isAllOutOfStock}
                onClick={handleBuyNow}
                className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                  isAllOutOfStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-amber-400 text-black active:scale-95"
                }`}
              >
                <span>BUY NOW</span>
              </button>
            </>
          );
        })()}
      </div>

      <Footer />
    </main>
  );
}
