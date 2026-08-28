"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiCheck,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useShop } from "../../context/ShopContext";
import { allProducts } from "../../data/products";
import { fetchCountries, fetchStates, fetchCities, fetchPaymentMethods } from "../../utils/api";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "true";
  const buyNowId = Number(searchParams.get("id"));
  const buyNowSize = searchParams.get("size") || "L";
  const buyNowQty = Number(searchParams.get("qty")) || 1;

  const { user, cart, clearCart, addOrder } = useShop();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // 1. Customer Information State (Pre-filled if user logged in)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (user?.isLoggedIn || user?.email) {
      const fn = user?.customer?.first_name || (user?.name ? user.name.split(" ")[0] : "") || "";
      const ln = user?.customer?.last_name || (user?.name ? user.name.split(" ").slice(1).join(" ") : "") || "";
      setCustomerInfo({
        firstName: fn,
        lastName: ln,
        phone: user?.customer?.mobile || "",
        email: user?.customer?.email || user?.email || "",
      });
    }
  }, [user]);

  // API States
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [billingCitiesList, setBillingCitiesList] = useState([]);
  const [shippingCitiesList, setShippingCitiesList] = useState([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);

  // Load Countries, States for default country, and Payment Methods
  useEffect(() => {
    async function initCheckoutData() {
      // 1. Fetch Countries
      const countryRes = await fetchCountries();
      if (countryRes?.status === "success" && Array.isArray(countryRes.countries) && countryRes.countries.length > 0) {
        setCountriesList(countryRes.countries);
        const firstCountry = countryRes.countries[0];
        setBillingAddress((prev) => ({ ...prev, country: prev.country || firstCountry.name }));
        setShippingAddress((prev) => ({ ...prev, country: prev.country || firstCountry.name }));

        // 2. Fetch States for the first country dynamically
        const stateRes = await fetchStates(firstCountry.id);
        if (stateRes?.status === "success" && Array.isArray(stateRes.states)) {
          setStatesList(stateRes.states);
        }
      }

      // 3. Fetch Payment Methods
      const pmRes = await fetchPaymentMethods();
      if (pmRes?.status === "success" && Array.isArray(pmRes.payment_methods) && pmRes.payment_methods.length > 0) {
        setPaymentMethodsList(pmRes.payment_methods);
        setPaymentMethod(pmRes.payment_methods[0].name);
      }
    }
    initCheckoutData();
  }, []);

  // Country Change Handlers
  const handleBillingCountryChange = async (countryName) => {
    setBillingAddress((prev) => ({ ...prev, country: countryName, state: "", district: "" }));
    setStatesList([]);
    setBillingCitiesList([]);
    const selectedCountry = countriesList.find((c) => c.name === countryName);
    if (selectedCountry?.id) {
      const stateRes = await fetchStates(selectedCountry.id);
      if (stateRes?.status === "success" && Array.isArray(stateRes.states)) {
        setStatesList(stateRes.states);
      }
    }
  };

  const handleShippingCountryChange = async (countryName) => {
    setShippingAddress((prev) => ({ ...prev, country: countryName, state: "", district: "" }));
    setShippingCitiesList([]);
    const selectedCountry = countriesList.find((c) => c.name === countryName);
    if (selectedCountry?.id) {
      const stateRes = await fetchStates(selectedCountry.id);
      if (stateRes?.status === "success" && Array.isArray(stateRes.states)) {
        setStatesList(stateRes.states);
      }
    }
  };

  // State Change Handlers
  const handleBillingStateChange = async (stateName) => {
    setBillingAddress((prev) => ({ ...prev, state: stateName, district: "" }));
    const selectedSt = statesList.find((s) => s.name === stateName);
    if (selectedSt?.id) {
      const res = await fetchCities(selectedSt.id);
      if (res?.status === "success" && Array.isArray(res.cities)) {
        setBillingCitiesList(res.cities);
      }
    } else {
      setBillingCitiesList([]);
    }
  };

  const handleShippingStateChange = async (stateName) => {
    setShippingAddress((prev) => ({ ...prev, state: stateName, district: "" }));
    const selectedSt = statesList.find((s) => s.name === stateName);
    if (selectedSt?.id) {
      const res = await fetchCities(selectedSt.id);
      if (res?.status === "success" && Array.isArray(res.cities)) {
        setShippingCitiesList(res.cities);
      }
    } else {
      setShippingCitiesList([]);
    }
  };

  // 2. Billing Information State (Fresh every buy)
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    country: "",
    state: "",
    district: "",
    postalCode: "",
  });

  // 3. Shipping Address State
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    country: "",
    state: "",
    district: "",
    postalCode: "",
  });

  // 4. Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  // Active payment method details
  const activePaymentObj = paymentMethodsList.find((pm) => pm.name === paymentMethod);
  const advanceAmount = activePaymentObj?.advance_amount || 0;

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMsg("");
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "HUNTER10" || couponCode.trim().toUpperCase() === "WELCOME") {
      setCouponDiscount(150);
      setCouponApplied(true);
      setCouponMsg("Coupon code applied successfully! (-₹150)");
    } else {
      setCouponMsg("Invalid coupon code.");
    }
  };

  // Buy now product item
  const buyNowProduct = allProducts.find((p) => p.id === buyNowId);

  // Active checkout items
  const checkoutItems =
    isBuyNow && buyNowProduct
      ? [
          {
            cartItemId: `buynow-${buyNowProduct.id}-${buyNowSize}`,
            product: buyNowProduct,
            selectedSize: buyNowSize,
            quantity: buyNowQty,
            price: buyNowProduct.price || 950,
          },
        ]
      : cart;

  // Price Calculation
  const subtotal = checkoutItems.reduce(
    (total, item) => total + (item.price || item.product?.price || 950) * item.quantity,
    0
  );
  const tax = 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + tax);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedId = `HNR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    const activeShipping = shipToDifferentAddress ? shippingAddress : billingAddress;

    addOrder({
      orderId: generatedId,
      items: checkoutItems,
      grandTotal,
      shippingAddress: activeShipping,
      paymentMethod,
    });

    setOrderPlaced(true);
    if (!isBuyNow) {
      clearCart();
    }
  };

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-12">
      <TopBar />
      <Navbar />

      {/* Clean Header */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-8 pb-3 sm:pb-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-0.5">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-black transition">
              Cart
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Checkout</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-black text-black tracking-tight uppercase">
            Secure Checkout
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3.5 py-2 rounded-full border border-green-200">
          <FiShield className="w-4 h-4" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8">
        {orderPlaced ? (
          /* Order Confirmation View */
          <div className="py-10 text-center bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 max-w-xl mx-auto p-5 sm:p-8 shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <FiCheck className="w-8 h-8 stroke-[3]" />
            </div>
            <span className="text-[10px] uppercase tracking-[3px] text-gray-500 font-bold">
              Order Confirmed
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase mt-1">
              Thank You For Your Order!
            </h2>
            <p className="text-xs font-mono font-bold text-purple-600 mt-1">
              Order ID: {orderId}
            </p>

            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 text-left max-w-md mx-auto space-y-1.5 text-xs text-gray-700">
              <p>
                <strong className="text-black">Customer:</strong> {customerInfo.firstName}{" "}
                {customerInfo.lastName} ({customerInfo.email})
              </p>
              <p>
                <strong className="text-black">Phone:</strong> {customerInfo.phone}
              </p>
              <p>
                <strong className="text-black">Billing Address:</strong> {billingAddress.street},{" "}
                {billingAddress.district}, {billingAddress.state} {billingAddress.postalCode},{" "}
                {billingAddress.country}
              </p>
              {shipToDifferentAddress && (
                <p>
                  <strong className="text-black">Shipping Address:</strong> {shippingAddress.street},{" "}
                  {shippingAddress.district}, {shippingAddress.state} {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </p>
              )}
              <p>
                <strong className="text-black">Payment Method:</strong>{" "}
                {activePaymentObj?.label || paymentMethod}
              </p>
              <p className="pt-1 text-sm font-black text-black">
                Grand Total: ₹{grandTotal.toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <span>Continue Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          /* Structured Checkout Form & Summary Grid */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Left Column: 4 Clean Checkout Sections */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION 1: CUSTOMER INFORMATION */}
              <div className="space-y-3.5">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  1. Customer Information
                </h2>

                <div className="p-4 sm:p-6 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                        }
                        placeholder="Joslin"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                        }
                        placeholder="Varsha"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        placeholder="9940843790"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        placeholder="joslinvarsha55@gmail.com"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BILLING INFORMATION */}
              <div className="space-y-3.5 pt-2">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  2. Billing Information
                </h2>

                <div className="p-4 sm:p-6 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={billingAddress.street}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, street: e.target.value })
                      }
                      placeholder="Enter here..."
                      className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={billingAddress.country}
                        onChange={(e) => handleBillingCountryChange(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                      >
                        {countriesList.length === 0 && <option value="">Select Country</option>}
                        {countriesList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={billingAddress.state}
                        onChange={(e) => handleBillingStateChange(e.target.value)}
                        className="w-full bg-white border border-purple-600 ring-1 ring-purple-600 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none transition cursor-pointer"
                      >
                        <option value="">Select State</option>
                        {statesList.map((st) => (
                          <option key={st.id || st.name} value={st.name}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={billingAddress.district}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, district: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                      >
                        <option value="">Select District</option>
                        {billingCitiesList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={billingAddress.postalCode}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, postalCode: e.target.value })
                        }
                        placeholder="Enter here..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SHIPPING ADDRESS */}
              <div className="space-y-3.5 pt-2">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  3. Shipping Address
                </h2>

                <div className="p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200/80">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shipToDifferentAddress}
                      onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">
                      Ship To A Different Address?
                    </span>
                  </label>

                  {/* Separate Shipping Address Form if checked */}
                  {shipToDifferentAddress && (
                    <div className="space-y-4 pt-4 mt-3 border-t border-gray-200/80">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Shipping Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={shippingAddress.street}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, street: e.target.value })
                          }
                          placeholder="Enter shipping address here..."
                          className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={shippingAddress.country}
                            onChange={(e) => handleShippingCountryChange(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                          >
                            {countriesList.length === 0 && <option value="">Select Country</option>}
                            {countriesList.map((c) => (
                              <option key={c.id || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={shippingAddress.state}
                            onChange={(e) => handleShippingStateChange(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                          >
                            <option value="">Select State</option>
                            {statesList.map((st) => (
                              <option key={st.id || st.name} value={st.name}>
                                {st.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            District <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={shippingAddress.district}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, district: e.target.value })
                            }
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition cursor-pointer"
                          >
                            <option value="">Select District</option>
                            {shippingCitiesList.map((c) => (
                              <option key={c.id || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                            }
                            placeholder="Enter here..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-black outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: PAYMENT METHOD */}
              <div className="space-y-3.5 pt-2">
                <h2 className="text-base sm:text-lg font-extrabold text-black">
                  4. Payment Method
                </h2>

                <div className="p-4 sm:p-6 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-3">
                  {paymentMethodsList.map((pm) => (
                    <label
                      key={pm.name}
                      onClick={() => setPaymentMethod(pm.name)}
                      className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        paymentMethod === pm.name
                          ? "bg-white border-black shadow-sm"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === pm.name}
                        onChange={() => setPaymentMethod(pm.name)}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                        {pm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Order Summary Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              <div className="p-4 sm:p-6 bg-gray-50/90 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
                
                {/* Order Summary Header */}
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
                    Order Summary: [{checkoutItems.reduce((acc, item) => acc + item.quantity, 0)}]
                  </h3>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => {
                    const imgSrc =
                      Array.isArray(item?.product?.images) && item.product.images.length > 0
                        ? item.product.images[0]
                        : typeof item?.product?.image === "string"
                        ? item.product.image
                        : Array.isArray(item?.product?.image) && item.product.image.length > 0
                        ? item.product.image[0]
                        : "/images/placeholder.jpg";

                    const prodName = item?.product?.name || item?.product?.title || "HUNTER Apparel";
                    const itemPrice = item.price || item.product?.price || 950;

                    return (
                      <div
                        key={item.cartItemId || Math.random()}
                        className="flex items-start gap-3 p-2 bg-white rounded-xl border border-gray-200"
                      >
                        <div className="relative w-14 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={imgSrc}
                            alt={prodName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-extrabold text-black truncate leading-tight">
                              {prodName}
                            </h4>
                            <span className="text-xs font-black text-black whitespace-nowrap">
                              ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-700 font-semibold mt-1">
                            <strong className="text-black">Size:</strong> {item.selectedSize}
                          </p>

                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {item.quantity} x ₹{itemPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Enter Coupon Code Row */}
                <div className="pt-2 border-t border-gray-200/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-black outline-none focus:border-black transition"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition active:scale-95"
                    >
                      Apply
                    </button>
                  </div>

                  {couponMsg && (
                    <p className={`text-[11px] font-semibold mt-1.5 ${couponApplied ? "text-green-600" : "text-red-500"}`}>
                      {couponMsg}
                    </p>
                  )}
                </div>

                {/* Subtotal, Coupon, Tax, Total Rows */}
                <div className="space-y-2.5 pt-3 border-t border-gray-200 text-xs text-gray-700 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-black">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Coupon</span>
                    <span className="font-extrabold text-black">
                      {couponDiscount > 0 ? `- ₹${couponDiscount.toLocaleString("en-IN")}` : "- ₹0,00"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-extrabold text-black">₹0,00</span>
                  </div>

                  <div className="flex justify-between pt-2.5 border-t border-gray-200 text-sm sm:text-base font-black text-black">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {/* To Pay Advance Amount Line (Only if selected payment method has advance_amount > 0) */}
                  {advanceAmount > 0 && (
                    <div className="pt-2">
                      <p className="text-xs sm:text-sm font-black text-black">
                        To Pay Advance Amount ₹{advanceAmount}
                      </p>
                    </div>
                  )}
                </div>

                {/* Complete Order Button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                >
                  <span>Complete Order</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
