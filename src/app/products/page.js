"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { categoriesList, allProducts } from "../../data/products";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiStar,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPriceRange, setMaxPriceRange] = useState(200);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toggle category checkbox
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setSortBy("featured");
    setMaxPriceRange(200);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Category Filter
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.category) ||
          (product.categoryKey && selectedCategories.includes(product.categoryKey));

        // Search Filter
        const matchesSearch =
          searchQuery.trim() === "" ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Price Filter
        const matchesPrice = product.price <= maxPriceRange;

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.id - b.id; // Featured default
      });
  }, [selectedCategories, searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      {/* Page Header Banner */}
      <div className="bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[4px] text-gray-400 font-semibold mb-2">
              HUNTER Streetwear Catalog
            </p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              SHOP ALL PRODUCTS
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Explore our full collection of premium streetwear, outerwear, and urban essentials.
            </p>
          </div>

          {/* Header Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 border border-gray-700 text-sm px-4 py-3 rounded-full outline-none focus:border-white transition"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            ) : (
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar & Products Grid */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-28 lg:pb-12">
        {/* Mobile Filter Button & Sort Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100 mb-6 sm:mb-8 sticky top-16 z-30 bg-white/95 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition"
            >
              <FiFilter className="w-4 h-4" />
              Filters ({selectedCategories.length})
            </button>

            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Showing <span className="text-black font-bold">{filteredProducts.length}</span> Products
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 hidden sm:inline">
              Sort By:
            </span>
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-gray-100 text-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 pr-8 rounded-full border border-gray-200 outline-none cursor-pointer focus:ring-2 focus:ring-black/10"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(selectedCategories.length > 0 || searchQuery || maxPriceRange < 200) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-400 font-medium mr-1">Active Filters:</span>
            {selectedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
              >
                <span>{cat}</span>
                <FiX className="w-3.5 h-3.5" />
              </button>
            ))}
            {maxPriceRange < 200 && (
              <button
                onClick={() => setMaxPriceRange(200)}
                className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
              >
                <span>Under ${maxPriceRange}</span>
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-gray-200 text-black text-xs font-medium px-3 py-1.5 rounded-full">
                "{searchQuery}"
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold uppercase tracking-wider text-red-600 underline ml-2 hover:text-red-800"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden lg:block lg:col-span-1 bg-gray-50/70 p-6 rounded-3xl border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <h2 className="text-lg font-black tracking-wide uppercase">
                Categories
              </h2>
              {selectedCategories.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gray-500 hover:text-black font-semibold underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Checkbox Category List */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                const categoryCount = allProducts.filter(
                  (p) => p.category === cat || p.categoryKey === cat
                ).length;

                return (
                  <label
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className="flex items-center justify-between cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-gray-200/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-black border-black text-white"
                            : "border-gray-300 bg-white group-hover:border-black"
                        }`}
                      >
                        {isSelected && <FiCheck className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors ${
                          isSelected ? "text-black font-bold" : "text-gray-700 group-hover:text-black"
                        }`}
                      >
                        {cat}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-gray-400">
                      ({categoryCount})
                    </span>
                  </label>
                );
              })}
            </div>

            {/* PRICE RANGE FILTER */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
                  Price Range
                </h3>
                <span className="text-xs font-bold text-black bg-gray-200 px-2 py-0.5 rounded-md">
                  Up to ${maxPriceRange}
                </span>
              </div>

              <input
                type="range"
                min="25"
                max="200"
                step="5"
                value={maxPriceRange}
                onChange={(e) => setMaxPriceRange(Number(e.target.value))}
                className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[11px] text-gray-400 font-semibold mt-1">
                <span>$25</span>
                <span>$200</span>
              </div>

              {/* Quick Price Preset Buttons */}
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {[50, 100, 150].map((price) => (
                  <button
                    key={price}
                    onClick={() => setMaxPriceRange(price)}
                    className={`text-[10px] font-bold uppercase py-1.5 rounded-lg border transition ${
                      maxPriceRange === price
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-200 hover:border-black"
                    }`}
                  >
                    &lt; ${price}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-2xl font-bold text-gray-800">No Products Found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try unchecking some filters or clearing your search term.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer flex flex-col rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f6f6f6]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />

                      {/* Tag Badge */}
                      {product.tag && (
                        <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                          {product.tag}
                        </span>
                      )}

                      {/* Quick View */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 opacity-90 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 w-[80%]">
                        <button className="w-full bg-white/95 backdrop-blur-md text-black py-2.5 rounded-full text-xs font-semibold shadow-lg hover:bg-black hover:text-white transition-all">
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex justify-between items-start pt-3 px-1">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-black line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[11px] uppercase tracking-[2px] text-gray-500 mt-0.5 font-medium">
                          {product.category}
                        </p>
                      </div>

                      <span className="text-sm sm:text-base font-bold text-black ml-2">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white flex flex-col justify-between shadow-2xl">
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-black uppercase tracking-wider">
                  Filter Categories
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-black hover:opacity-70"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Checkboxes */}
              <div className="mt-6 space-y-3">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isSelected
                              ? "bg-black border-black text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <FiCheck className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-medium text-black">{cat}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* MOBILE PRICE RANGE FILTER */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
                    Price Range
                  </h3>
                  <span className="text-xs font-bold text-black bg-gray-200 px-2 py-0.5 rounded-md">
                    Up to ${maxPriceRange}
                  </span>
                </div>

                <input
                  type="range"
                  min="25"
                  max="200"
                  step="5"
                  value={maxPriceRange}
                  onChange={(e) => setMaxPriceRange(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                />

                <div className="flex justify-between text-[11px] text-gray-400 font-semibold mt-1">
                  <span>$25</span>
                  <span>$200</span>
                </div>

                {/* Quick Price Preset Buttons */}
                <div className="grid grid-cols-3 gap-1.5 mt-3">
                  {[50, 100, 150].map((price) => (
                    <button
                      key={price}
                      onClick={() => setMaxPriceRange(price)}
                      className={`text-[10px] font-bold uppercase py-1.5 rounded-lg border transition ${
                        maxPriceRange === price
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-black"
                      }`}
                    >
                      &lt; ${price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 bg-gray-200 text-black py-3 rounded-full text-xs font-semibold uppercase"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 bg-black text-white py-3 rounded-full text-xs font-semibold uppercase"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
