"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiUser,
  FiPackage,
  FiShield,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiLogIn,
  FiChevronRight,
  FiHeart,
  FiShoppingBag,
  FiAward,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";

export default function AccountPage() {
  const {
    user,
    login,
    logout,
    orders,
    getWishlistCount,
    getCartCount,
    addresses,
    addAddress,
    setDefaultAddress,
    deleteAddress,
  } = useShop();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    label: "Home",
    firstName: user?.name ? user.name.split(" ")[0] : "Alex",
    lastName: user?.name ? user.name.split(" ")[1] || "Morgan" : "Morgan",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    isDefault: false,
  });

  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  const handleCreateAddress = (e) => {
    e.preventDefault();
    addAddress(newAddrForm);
    setIsAddModalOpen(false);
    setNewAddrForm({
      label: "Home",
      firstName: user?.name ? user.name.split(" ")[0] : "Alex",
      lastName: user?.name ? user.name.split(" ")[1] || "Morgan" : "Morgan",
      phone: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      isDefault: false,
    });
  };

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-12">
      <TopBar />
      <Navbar />

      {/* Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-4 border-b border-gray-100 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-0.5">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Account</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Account Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        
        {/* Full Width 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* 1. LEFT COLUMN TOP: Luxury Profile Card (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="bg-[#111111] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              {user && user.isLoggedIn ? (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white text-black font-black text-lg sm:text-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "AM"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-xl font-black uppercase tracking-tight truncate">
                          {user.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 bg-white/10 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20 flex-shrink-0">
                          <FiAward className="w-2.5 h-2.5 text-amber-400" />
                          VIP
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
                    </div>
                  </div>

                  <hr className="border-gray-800" />

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                      <span>HUNTER Club Member</span>
                    </div>

                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-gray-400 font-black text-lg flex items-center justify-center border border-white/10">
                      <FiUser className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                        Guest User
                      </h2>
                      <p className="text-xs text-gray-400">Sign in to manage orders & details</p>
                    </div>
                  </div>

                  <button
                    onClick={() => login("Alex Morgan", "alex.morgan@example.com")}
                    className="w-full py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95"
                  >
                    <FiLogIn className="w-4 h-4" />
                    <span>Login / Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. RIGHT COLUMN: Quick Stats & Navigation Lists (lg:col-span-7 lg:row-span-2) */}
          <div className="lg:col-span-7 lg:row-span-2 space-y-6">
            
            {/* Quick Stat Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Link
                href="/orders"
                className="p-3.5 sm:p-5 bg-gray-50 hover:bg-gray-100/90 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-xl font-black text-black">{orders.length}</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">
                  My Orders
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="p-3.5 sm:p-5 bg-gray-50 hover:bg-gray-100/90 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-xl font-black text-black">{wishlistCount}</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">
                  Wishlist
                </p>
              </Link>

              <Link
                href="/cart"
                className="p-3.5 sm:p-5 bg-gray-50 hover:bg-gray-100/90 rounded-2xl sm:rounded-3xl border border-gray-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-1.5 shadow group-hover:scale-105 transition-transform">
                  <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-xl font-black text-black">{cartCount}</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 tracking-wider">
                  Cart Bag
                </p>
              </Link>
            </div>

            {/* Shopping & Account Links */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 px-1">
                Shopping & Account
              </h3>

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                <Link
                  href="/orders"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiPackage className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        My Orders & Live Tracking
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        View status, order timeline & 1-click reorder
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">({orders.length})</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </div>
                </Link>

                <Link
                  href="/wishlist"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiHeart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Saved Favorites
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Your saved streetwear drops & wishlist items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">({wishlistCount})</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Information & Policies Links */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 px-1">
                Help & Store Policies
              </h3>

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                <Link
                  href="/privacy"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiShield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Privacy Policy
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Data security & customer privacy practices
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/terms"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiFileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Terms & Conditions
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Store rules, exchange policies & warranty
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/support"
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <FiHelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-black uppercase">
                        Help & Support
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        24/7 Assistance, FAQs & contact form
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

          </div>

          {/* 3. MY ADDRESS BOOK SECTION (Placed LAST on Mobile via order-last) */}
          <div className="lg:col-span-5 order-last lg:order-none">
            <div className="p-4 sm:p-5 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4 text-black" />
                  My Address Book ({addresses.length})
                </h3>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1.5 bg-black text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider hover:bg-gray-800 transition flex items-center gap-1 shadow"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Saved Address List */}
              <div className="space-y-3 pt-1">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? "bg-white border-black shadow-md ring-2 ring-black/5"
                        : "bg-white/80 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-black uppercase">
                          {addr.label || "Home"}
                        </span>
                        {addr.isDefault ? (
                          <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                            <FiCheck className="w-3 h-3 text-green-600" />
                            DEFAULT ADDRESS
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[10px] font-bold uppercase text-black underline hover:opacity-75"
                          >
                            Set Default
                          </button>
                        )}
                        {addresses.length > 1 && (
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition"
                            title="Delete"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-700 font-medium space-y-0.5">
                      <p className="font-extrabold text-black">
                        {addr.firstName} {addr.lastName}
                      </p>
                      <p>
                        {addr.street} {addr.apartment}
                      </p>
                      <p>
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p className="text-gray-500 font-semibold pt-0.5">{addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Add New Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-black">
                Add New Delivery Address
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Address Label (e.g. Home, Work, Apartment)
                </label>
                <input
                  required
                  type="text"
                  value={newAddrForm.label}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, label: e.target.value })}
                  placeholder="Home"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddrForm.firstName}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, firstName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddrForm.lastName}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, lastName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={newAddrForm.phone}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  required
                  type="text"
                  value={newAddrForm.street}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                  placeholder="123 Streetwear Ave"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Apartment, Suite (Optional)
                </label>
                <input
                  type="text"
                  value={newAddrForm.apartment}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, apartment: e.target.value })}
                  placeholder="Apt 4B"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddrForm.city}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-semibold outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddrForm.state}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                    placeholder="State"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-semibold outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    ZIP
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddrForm.zip}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, zip: e.target.value })}
                    placeholder="90001"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-semibold outline-none focus:border-black"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={newAddrForm.isDefault}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Set as Default Delivery Address
                </span>
              </label>

              <button
                type="submit"
                className="w-full mt-4 bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-xl"
              >
                Save & Set Address
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
