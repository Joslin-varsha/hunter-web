"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiArrowRight,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";

export default function OrderHistoryPage() {
  const router = useRouter();
  const { orders, addToCart } = useShop();

  const handleReorder = (item) => {
    addToCart(item.product, item.selectedSize, item.quantity);
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-0">
      <TopBar />
      <Navbar />

      {/* Clean Minimalist Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-4 sm:pb-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {/* Mobile View: Back Button */}
          <button
            onClick={() => router.back()}
            className="sm:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-600 transition active:scale-95 mb-1.5"
            aria-label="Go Back"
          >
            <FiArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>

          {/* Desktop View: Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-0.5">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Order History</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight uppercase">
            My Orders <span className="text-gray-400 font-medium text-sm sm:text-2xl">({orders.length})</span>
          </h1>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold uppercase tracking-wider text-black underline hover:opacity-75 transition hidden sm:inline"
        >
          + Explore Catalog
        </Link>
      </div>

      <div className="max-w-[1550px] mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8">
        {orders.length === 0 ? (
          /* Empty Order History State */
          <div className="py-16 text-center bg-gray-50 rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto p-6 sm:p-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
              <FiPackage className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase">No Past Orders Yet</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              You haven't placed any orders with HUNTER yet. Explore our streetwear catalog and place your first drop!
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-7 sm:px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Start Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                className="bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Order Header Bar */}
                <div className="p-3.5 sm:p-6 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                      <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-black uppercase tracking-wider">
                          Order #{order.orderId}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {order.status || "Processing"}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mt-0.5">
                        Placed on {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto sm:ml-0">
                    <div className="text-right">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
                      <p className="text-sm sm:text-lg font-black text-black">
                        ₹{(order.grandTotal || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-3.5 sm:p-6 divide-y divide-gray-200">
                  {order.items &&
                    order.items.map((item, itemIdx) => (
                      <div
                        key={item.cartItemId || itemIdx}
                        className="py-3 sm:py-4 flex items-center justify-between gap-3"
                      >
                        {/* Item Image & Specs */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="relative w-14 h-16 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                            <Image
                              src={item.product?.image || item.product?.cover_image_url || "/placeholder.png"}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 truncate">
                              {item.product?.category || "HUNTER"}
                            </p>
                            <h4 className="text-xs sm:text-sm font-extrabold text-black line-clamp-2 leading-tight">
                              {item.product?.name}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-gray-600 font-semibold mt-1">
                              Size: <span className="font-extrabold text-black">{item.selectedSize}</span> | Qty:{" "}
                              <span className="font-extrabold text-black">{item.quantity}</span>
                            </p>
                            <span className="text-xs sm:text-sm font-black text-black mt-1 block">
                              ₹{((item.price || 0) * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Link
                            href="/cart"
                            onClick={() => handleReorder(item)}
                            className="inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95 shadow"
                          >
                            <FiRefreshCw className="w-3 h-3" />
                            <span>Buy Again</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Order Footer Info */}
                {order.shippingAddress && order.shippingAddress.street && (
                  <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-gray-100/80 border-t border-gray-200 text-[11px] sm:text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiMapPin className="w-3.5 h-3.5 text-black flex-shrink-0" />
                      <span>Ship to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiCreditCard className="w-3.5 h-3.5 text-black flex-shrink-0" />
                      <span>Paid via: {order.paymentMethod || "Razorpay"}</span>
                    </span>
                  </div>
                )}
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
