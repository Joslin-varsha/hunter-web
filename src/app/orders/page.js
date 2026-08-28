"use client";

import Image from "next/image";
import Link from "next/link";
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
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";

export default function OrderHistoryPage() {
  const { orders, addToCart } = useShop();

  const handleReorder = (item) => {
    addToCart(item.product, item.selectedSize, item.quantity);
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-12">
      <TopBar />
      <Navbar />

      {/* Clean Minimalist Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 pb-6 border-b border-gray-100 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Order History</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            My Orders <span className="text-gray-400 font-medium">({orders.length})</span>
          </h1>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold uppercase tracking-wider text-black underline hover:opacity-75 transition hidden sm:inline"
        >
          + Explore Catalog
        </Link>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        {orders.length === 0 ? (
          /* Empty Order History State */
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto p-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
              <FiPackage className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">No Past Orders Yet</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              You haven't placed any orders with HUNTER yet. Explore our streetwear catalog and place your first drop!
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Start Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Order Header Bar */}
                <div className="p-4 sm:p-6 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
                      <FiPackage className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-black uppercase tracking-wider">
                          Order #{order.orderId}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {order.status || "Processing"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                        Placed on {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto sm:ml-0">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
                      <p className="text-base sm:text-lg font-black text-black">
                        ${order.grandTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Tracking Steps */}
                <div className="px-4 sm:px-6 py-4 bg-gray-100/60 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xl mx-auto">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mb-1">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-black uppercase">Confirmed</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold mb-1 animate-pulse">
                        <FiClock className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase">Processing</span>
                    </div>

                    <div className="flex flex-col items-center opacity-40">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold mb-1">
                        <FiTruck className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600 uppercase">Shipped</span>
                    </div>

                    <div className="flex flex-col items-center opacity-40">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold mb-1">
                        <FiCheckCircle className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600 uppercase">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-4 sm:p-6 divide-y divide-gray-200">
                  {order.items &&
                    order.items.map((item, itemIdx) => (
                      <div
                        key={item.cartItemId || itemIdx}
                        className="py-3 sm:py-4 flex items-center justify-between gap-4"
                      >
                        {/* Item Image & Specs */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">
                              {item.product.category}
                            </p>
                            <h4 className="text-xs sm:text-sm font-extrabold text-black line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-gray-600 font-semibold mt-1">
                              Size: <span className="font-extrabold text-black">{item.selectedSize}</span> | Qty:{" "}
                              <span className="font-extrabold text-black">{item.quantity}</span>
                            </p>
                            <span className="text-xs font-black text-black mt-1 block">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <Link
                            href="/cart"
                            onClick={() => handleReorder(item)}
                            className="inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95 shadow"
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
                  <div className="px-4 sm:px-6 py-3 bg-gray-100/80 border-t border-gray-200 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiMapPin className="w-3.5 h-3.5 text-black" />
                      Ship to: {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiCreditCard className="w-3.5 h-3.5 text-black" />
                      Paid via: {order.paymentMethod || "Credit Card"}
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
