"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiRefreshCw,
  FiShoppingBag,
  FiAlertCircle,
  FiCalendar,
  FiTag,
  FiAward,
  FiXCircle,
} from "react-icons/fi";
import TopBar from "../../../../components/TopBar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import MobileBottomNav from "../../../../components/MobileBottomNav";
import { useShop } from "../../../context/ShopContext";
import { fetchOrderDetails } from "../../../utils/api";

export default function OrderDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;
  const router = useRouter();
  const { addToCart, apiOrders } = useShop();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await fetchOrderDetails(orderId);
        if (res?.status === 1 && res?.data?.order) {
          setOrder(res.data.order);
        } else if (res?.data?.orders && res.data.orders.length > 0) {
          setOrder(res.data.orders[0]);
        } else {
          // Fallback to locally loaded API order from ShopContext if server details endpoint returns 404
          const foundInList = apiOrders?.find(
            (o) => String(o.id) === String(orderId) || String(o.product_order_id) === String(orderId)
          );
          if (foundInList) {
            setOrder(foundInList);
          } else {
            setError(res?.message || "Unable to fetch order details from server.");
          }
        }
      } catch (err) {
        console.error("Order detail error:", err);
        setError("An error occurred while fetching order details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId, apiOrders]);

  const handleReorder = (item) => {
    if (item && item.product) {
      addToCart(item.product, item.selectedSize || "M", item.quantity || 1);
    }
  };

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

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-0">
      <TopBar />
      <Navbar />

      {/* Header Bar */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-gray-600 transition active:scale-95 mb-2"
          >
            <FiArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Orders</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-black">Orders</Link>
            <span>/</span>
            <span className="text-black font-semibold">#{order?.product_order_id || orderId}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-black uppercase tracking-tight">
            Order Details <span className="text-gray-400 font-medium">#{order?.product_order_id || orderId}</span>
          </h1>
        </div>

        {order && (
          <span className={`self-start sm:self-center text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${getStatusBadge(order.product_order_status)}`}>
            Status: {order.product_order_status || "Pending"}
          </span>
        )}
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Loading Order Details #{orderId}...
            </p>
          </div>
        ) : error && !order ? (
          <div className="py-16 text-center max-w-xl mx-auto p-6 bg-red-50 rounded-3xl border border-red-200 text-red-700 space-y-4">
            <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-black uppercase">Order Not Found</h3>
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition"
            >
              <FiArrowLeft />
              <span>Return to Orders List</span>
            </Link>
          </div>
        ) : (
          order && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Items List & Milestone Tracker */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                
                {/* 1. Order Milestones Timeline */}
                <div className="bg-gray-50 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-gray-200">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-black" />
                    <span>Order Progress Timeline</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className={`p-3 rounded-2xl border ${order.order_date || order.created_at ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <FiPackage className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-black uppercase">Placed</p>
                      <p className="text-[9px] font-semibold opacity-75">{formatDate(order.order_date || order.created_at) || "Done"}</p>
                    </div>

                    <div className={`p-3 rounded-2xl border ${order.confirmed_date ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <FiCheckCircle className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-black uppercase">Confirmed</p>
                      <p className="text-[9px] font-semibold opacity-75">{formatDate(order.confirmed_date) || (order.delivered_status ? "Done" : "Pending")}</p>
                    </div>

                    <div className={`p-3 rounded-2xl border ${order.shipped_date || order.picked_date ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <FiTruck className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-black uppercase">Shipped</p>
                      <p className="text-[9px] font-semibold opacity-75">{formatDate(order.shipped_date || order.picked_date) || "In Transit"}</p>
                    </div>

                    <div className={`p-3 rounded-2xl border ${order.delivered_status ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <FiCheckCircle className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-black uppercase">Delivered</p>
                      <p className="text-[9px] font-semibold opacity-75">{formatDate(order.delivery_date) || "Expected Soon"}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Order Items List */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                      <FiShoppingBag className="w-4 h-4 text-black" />
                      <span>Purchased Streetwear Drops</span>
                    </h3>
                    <span className="text-xs text-gray-400 font-bold">
                      {(order.items && order.items.length) || 1} Item(s)
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {(order.items && order.items.length > 0 ? order.items : [
                      {
                        cartItemId: `item-${order.id}`,
                        product: {
                          id: order.product_id || order.id,
                          name: `HUNTER Streetwear Drop #${order.product_id || order.id}`,
                          price: order.product_price || order.final_price || 150,
                          category: "HUNTER Collection",
                          image: "/placeholder.png",
                        },
                        selectedSize: "M",
                        quantity: 1,
                        price: order.product_price || order.final_price || 150,
                      }
                    ]).map((item, idx) => (
                      <div key={item.cartItemId || idx} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <Image
                              src={item.product?.image || item.product?.cover_image_url || "/placeholder.png"}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] uppercase font-bold text-gray-400">
                              {item.product?.category || "HUNTER Streetwear"}
                            </p>
                            <h4 className="text-xs sm:text-sm font-black text-black leading-tight truncate">
                              {item.product?.name || `Product #${order.product_id}`}
                            </h4>
                            <p className="text-xs text-gray-600 font-semibold mt-1">
                              Size: <span className="font-extrabold text-black">{item.selectedSize || "M"}</span> | Qty: <span className="font-extrabold text-black">{item.quantity || 1}</span>
                            </p>
                            <p className="text-sm font-black text-black mt-1">
                              ₹{((item.price || order.product_price || order.final_price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/cart"
                          onClick={() => handleReorder(item)}
                          className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition shadow active:scale-95 flex items-center gap-1.5"
                        >
                          <FiRefreshCw className="w-3.5 h-3.5" />
                          <span>Buy Again</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Order Summary Card */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Price Breakdown Card */}
                <div className="bg-[#111111] text-white p-6 rounded-2xl sm:rounded-3xl shadow-xl space-y-5 border border-gray-800">
                  <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 border-b border-gray-800 pb-3 flex items-center justify-between">
                    <span>Payment Summary</span>
                    <FiCreditCard className="w-4 h-4 text-white" />
                  </h3>

                  <div className="space-y-3 text-xs font-semibold">
                    <div className="flex justify-between text-gray-400">
                      <span>Product Price:</span>
                      <span className="text-white font-bold">₹{Number(order.product_price || 0).toLocaleString("en-IN")}</span>
                    </div>

                    {order.coupon_price > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Coupon Discount:</span>
                        <span>- ₹{Number(order.coupon_price).toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-400">
                      <span>Delivery Shipping:</span>
                      <span className="text-white font-bold">₹{Number(order.delivery_price || 0).toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>GST Tax ({order.tax_in_percentage || 0}%):</span>
                      <span className="text-white font-bold">₹{Number(order.tax_price || 0).toLocaleString("en-IN")}</span>
                    </div>

                    {order.reward_points > 0 && (
                      <div className="flex justify-between text-amber-400">
                        <span>Reward Points Earned:</span>
                        <span>+{order.reward_points} PTS</span>
                      </div>
                    )}

                    <hr className="border-gray-800 pt-1" />

                    <div className="flex justify-between text-base sm:text-lg font-black text-white pt-1">
                      <span>Final Paid Total:</span>
                      <span className="text-emerald-400">₹{Number(order.final_price || order.product_price || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-[11px] text-gray-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[9px] text-gray-400">Payment Status</span>
                      <span className="font-black text-emerald-400 uppercase text-[10px]">
                        {order.payment_status || "Paid / Approved"}
                      </span>
                    </div>
                    {order.payment_type && (
                      <p className="text-gray-400 text-[10px]">
                        Paid via: <strong className="text-white">{order.payment_type}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-6 rounded-2xl sm:rounded-3xl border border-gray-200 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-black" />
                    <span>Order Meta Details</span>
                  </h4>

                  <div className="space-y-2 text-xs text-gray-600 font-medium">
                    <p><strong className="text-black font-bold">Order ID:</strong> #{order.product_order_id || order.id}</p>
                    <p><strong className="text-black font-bold">Customer ID:</strong> {order.customer_id}</p>
                    <p><strong className="text-black font-bold">Guest Order:</strong> {order.is_guest ? "Yes" : "No"}</p>
                    {order.lottery_code && (
                      <p><strong className="text-black font-bold">Lottery Code:</strong> {order.lottery_code}</p>
                    )}
                    {order.additional_note && (
                      <p><strong className="text-black font-bold">Note:</strong> {order.additional_note}</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
