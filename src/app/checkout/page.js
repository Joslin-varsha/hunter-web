"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiCheck,
  FiLock,
  FiTruck,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiFileText,
  FiArrowLeft,
  FiArrowRight,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useShop } from "../../context/ShopContext";
import { allProducts } from "../../data/products";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "true";
  const buyNowId = Number(searchParams.get("id"));
  const buyNowSize = searchParams.get("size") || "L";
  const buyNowQty = Number(searchParams.get("qty")) || 1;

  const { cart, clearCart, getCartTotal, addOrder, addresses, getDefaultAddress } = useShop();

  const defaultAddr = getDefaultAddress();

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?.id || "");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Customer Info State (Auto-filled from defaultAddr)
  const [customerInfo, setCustomerInfo] = useState({
    email: defaultAddr?.email || "",
    phone: defaultAddr?.phone || "",
    firstName: defaultAddr?.firstName || "",
    lastName: defaultAddr?.lastName || "",
  });

  // Shipping Address State (Auto-filled from defaultAddr)
  const [shippingAddress, setShippingAddress] = useState({
    street: defaultAddr?.street || "",
    apartment: defaultAddr?.apartment || "",
    city: defaultAddr?.city || "",
    state: defaultAddr?.state || "",
    zip: defaultAddr?.zip || "",
    country: defaultAddr?.country || "United States",
  });

  // Handler to switch selected address
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setCustomerInfo({
      email: addr.email || "",
      phone: addr.phone || "",
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
    });
    setShippingAddress({
      street: addr.street || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "United States",
    });
  };

  // Billing Address State
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  // Payment State
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

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
            price: buyNowProduct.price,
          },
        ]
      : cart;

  // Price Calculation
  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const freeShippingThreshold = 60;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
  const grandTotal = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedId = `HNR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    addOrder({
      orderId: generatedId,
      items: checkoutItems,
      grandTotal,
      shippingAddress,
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

            <div className="mt-4 p-3.5 bg-white rounded-xl border border-gray-200 text-left max-w-md mx-auto space-y-1.5 text-xs text-gray-600">
              <p>
                <strong className="text-black">Customer:</strong> {customerInfo.firstName}{" "}
                {customerInfo.lastName} ({customerInfo.email})
              </p>
              <p>
                <strong className="text-black">Shipping:</strong> {shippingAddress.street},{" "}
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              </p>
              <p>
                <strong className="text-black">Payment:</strong> {paymentMethod.toUpperCase()} • ${grandTotal.toFixed(2)}
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
          /* Separate Checkout Form & Summary Grid */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Left Column: Structured Checkout Forms */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              
              {/* COMPACT DELIVERY ADDRESS CARD WITH CHANGE ADDRESS BUTTON */}
              <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] sm:text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-base font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <FiMapPin className="w-3.5 h-3.5 text-black" />
                        Delivery Address
                      </h2>
                      <span className="text-[9px] uppercase font-extrabold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 inline-block mt-0.5">
                        ✓ Default Profile Address
                      </span>
                    </div>
                  </div>

                  {/* Change Address Button -> Navigates to /account address book */}
                  <Link
                    href="/account"
                    className="px-3 py-1.5 bg-black text-white rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider hover:bg-gray-800 transition shadow active:scale-95 flex items-center gap-1"
                  >
                    <span>Change Address</span>
                    <FiChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Compact Address Summary Box */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 space-y-1 font-medium">
                  <p className="font-extrabold text-black text-xs sm:text-sm">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </p>
                  <p className="text-gray-600">
                    {shippingAddress.street} {shippingAddress.apartment}
                  </p>
                  <p className="text-gray-600">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}, {shippingAddress.country}
                  </p>
                  <div className="pt-1.5 flex flex-wrap gap-3 text-[11px] text-gray-500 font-semibold border-t border-gray-100 mt-1.5">
                    <span>📧 {customerInfo.email}</span>
                    <span>📞 {customerInfo.phone}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BILLING INFORMATION */}
              <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] sm:text-xs">
                    2
                  </div>
                  <h2 className="text-xs sm:text-base font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <FiFileText className="w-3.5 h-3.5" />
                    Billing Information
                  </h2>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-3.5 h-3.5 accent-black rounded cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Same as shipping address
                  </span>
                </label>

                {!sameAsShipping && (
                  <div className="space-y-3 pt-3 border-t border-gray-200 mt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                        Billing Street Address *
                      </label>
                      <input
                        required
                        type="text"
                        value={billingAddress.street}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, street: e.target.value })
                        }
                        placeholder="Billing Street"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          required
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) =>
                            setBillingAddress({ ...billingAddress, city: e.target.value })
                          }
                          placeholder="City"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          required
                          type="text"
                          value={billingAddress.state}
                          onChange={(e) =>
                            setBillingAddress({ ...billingAddress, state: e.target.value })
                          }
                          placeholder="State"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          required
                          type="text"
                          value={billingAddress.zip}
                          onChange={(e) =>
                            setBillingAddress({ ...billingAddress, zip: e.target.value })
                          }
                          placeholder="ZIP"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: PAYMENT METHOD */}
              <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] sm:text-xs">
                    3
                  </div>
                  <h2 className="text-xs sm:text-base font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <FiCreditCard className="w-3.5 h-3.5" />
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-2.5 sm:p-3 rounded-xl border text-center text-[10px] sm:text-xs font-extrabold uppercase transition-all ${
                      paymentMethod === "card"
                        ? "bg-black text-white border-black shadow"
                        : "bg-white text-gray-700 border-gray-200 hover:border-black"
                    }`}
                  >
                    Credit / Debit Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 sm:p-3 rounded-xl border text-center text-[10px] sm:text-xs font-extrabold uppercase transition-all ${
                      paymentMethod === "cod"
                        ? "bg-black text-white border-black shadow"
                        : "bg-white text-gray-700 border-gray-200 hover:border-black"
                    }`}
                  >
                    Cash On Delivery
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                        Name on Card *
                      </label>
                      <input
                        required
                        type="text"
                        value={paymentDetails.nameOnCard}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })
                        }
                        placeholder="Alex Morgan"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        required
                        type="text"
                        maxLength="19"
                        value={paymentDetails.cardNumber}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                        }
                        placeholder="4532 •••• •••• 8910"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="12/28"
                          value={paymentDetails.expiry}
                          onChange={(e) =>
                            setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                          CVV Code *
                        </label>
                        <input
                          required
                          type="text"
                          maxLength="4"
                          placeholder="891"
                          value={paymentDetails.cvv}
                          onChange={(e) =>
                            setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Items Summary & Complete Button */}
            <div className="lg:col-span-5">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm sticky top-24">
                <h2 className="text-xs sm:text-base font-black uppercase tracking-wider text-black mb-3">
                  Order Summary ({checkoutItems.length})
                </h2>

                {/* Items Preview */}
                <div className="divide-y divide-gray-200 max-h-52 overflow-y-auto mb-4 pr-1">
                  {checkoutItems.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#f6f6f6] border border-gray-200 flex-shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-black line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-gray-500 font-semibold">
                            Size: {item.selectedSize} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-black flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Calculations */}
                <div className="space-y-2 text-xs border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-green-600 uppercase">FREE</span>
                    ) : (
                      <span className="font-bold text-black">${shipping.toFixed(2)}</span>
                    )}
                  </div>

                  <hr className="border-gray-200 my-2" />

                  <div className="flex justify-between text-sm sm:text-base font-black text-black">
                    <span>Total Amount</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Submit */}
                <button
                  type="submit"
                  className="w-full mt-4 bg-black text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
                >
                  <FiLock className="w-3.5 h-3.5" />
                  <span>Complete Order • ${grandTotal.toFixed(2)}</span>
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
