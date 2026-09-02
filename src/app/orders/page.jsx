"use client";

import { useState, useEffect } from "react";
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
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useShop } from "../../context/ShopContext";

export default function OrderHistoryPage() {
  const router = useRouter();
  const {
    apiOrders,
    apiOrdersPagination,
    isOrdersLoading,
    ordersError,
    loadApiOrders,
    addToCart,
  } = useShop();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch API orders on page / limit change
  useEffect(() => {
    loadApiOrders({ page, limit });
  }, [page, limit]);

  const handleReorder = (item) => {
    if (item && item.product) {
      addToCart(item.product, item.selectedSize || "M", item.quantity || 1);
    }
  };

  // Status badge styling helper
  const getStatusBadge = (statusStr) => {
    const status = (statusStr || "pending").toLowerCase();
    if (status.includes("deliver") || status.includes("complet")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (status.includes("ship") || status.includes("pick")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (status.includes("cancel") || status.includes("fail")) {
      return "bg-rose-100 text-rose-800 border-rose-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  const displayOrders = apiOrders || [];
  const totalOrdersCount = apiOrdersPagination?.total_orders || displayOrders.length;
  const totalPages = apiOrdersPagination?.total_pages || Math.ceil(totalOrdersCount / limit) || 1;

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
            My Orders <span className="text-gray-400 font-medium text-sm sm:text-2xl">({totalOrdersCount})</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadApiOrders({ page, limit })}
            disabled={isOrdersLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 hover:border-black text-xs font-bold uppercase tracking-wider text-black transition active:scale-95 disabled:opacity-50"
            title="Refresh Orders"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isOrdersLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-black underline hover:opacity-75 transition hidden sm:inline"
          >
            + Explore Catalog
          </Link>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8">
        {/* Loading State */}
        {isOrdersLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Fetching Order History...
            </p>
          </div>
        ) : displayOrders.length === 0 ? (
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
            {displayOrders.map((order, idx) => {
              const orderId = order.product_order_id || order.orderId || `ORD-${order.id || idx + 1}`;
              const orderStatus = order.product_order_status || order.status || "Pending";
              const rawDate = order.order_date || order.date || order.created_at;
              const formattedDate = rawDate
                ? new Date(rawDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              const grandTotal =
                order.final_price !== undefined && order.final_price !== null
                  ? order.final_price
                  : order.grandTotal || order.product_price || 0;

              const orderItems =
                order.items && order.items.length > 0
                  ? order.items
                  : [
                      {
                        cartItemId: `item-${order.id || idx}`,
                        product: {
                          id: order.product_id || order.id,
                          name: `Product Drop #${order.product_id || order.id || "101"}`,
                          price: order.product_price || grandTotal,
                          category: "HUNTER Streetwear",
                          image: "/placeholder.png",
                        },
                        selectedSize: "M",
                        quantity: 1,
                        price: order.product_price || grandTotal,
                      },
                    ];

              return (
                <div
                  key={order.id || order.product_order_id || idx}
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
                          <Link
                            href={`/orders/${order.id || order.product_order_id || orderId}`}
                            className="text-xs sm:text-sm font-black text-black uppercase tracking-wider hover:underline hover:text-purple-700 transition"
                          >
                            Order #{orderId}
                          </Link>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                              orderStatus
                            )}`}
                          >
                            {orderStatus}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mt-0.5">
                          Placed on {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto sm:ml-0 text-right">
                      <div>
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
                        <p className="text-sm sm:text-lg font-black text-black">
                          ₹{Number(grandTotal).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-3.5 sm:p-6 divide-y divide-gray-200">
                    {orderItems.map((item, itemIdx) => (
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
                              {item.product?.name || "Streetwear Item"}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-gray-600 font-semibold mt-1">
                              Size: <span className="font-extrabold text-black">{item.selectedSize || "Standard"}</span> | Qty:{" "}
                              <span className="font-extrabold text-black">{item.quantity || 1}</span>
                            </p>
                            <span className="text-xs sm:text-sm font-black text-black mt-1 block">
                              ₹{((item.price || grandTotal) * (item.quantity || 1)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                          <Link
                            href={`/orders/${order.id || order.product_order_id || orderId}`}
                            className="inline-flex items-center gap-1 bg-gray-100 hover:bg-black hover:text-white text-black border border-gray-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition active:scale-95 shadow-sm"
                          >
                            <span>View Details</span>
                            <FiArrowRight className="w-3 h-3" />
                          </Link>

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

                  {/* Order Footer Breakdown */}
                  <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-gray-100/80 border-t border-gray-200 text-[11px] sm:text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium">
                      <FiCreditCard className="w-3.5 h-3.5 text-black flex-shrink-0" />
                      <span>
                        Payment: {order.payment_type || order.paymentMethod || "Prepaid"}
                      </span>
                    </span>
                    {(order.delivery_price > 0 || order.tax_price > 0) && (
                      <span className="font-semibold text-gray-500">
                        Delivery: ₹{order.delivery_price || 0} | Tax: ₹{order.tax_price || 0} ({order.tax_in_percentage || 0}%)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls Bar */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-semibold">
                Showing Page <span className="font-black text-black">{page}</span> of{" "}
                <span className="font-black text-black">{totalPages}</span> ({totalOrdersCount} Total Orders)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isOrdersLoading}
                  className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-black transition text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-full text-xs font-black transition ${
                        pageNum === page
                          ? "bg-black text-white shadow"
                          : "bg-gray-100 text-black hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isOrdersLoading}
                  className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-black transition text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <span>Next</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}

