"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiHelpCircle,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import TopBar from "../../../components/TopBar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MobileBottomNav from "../../../components/MobileBottomNav";

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Free shipping applies to orders above $60.",
    },
    {
      q: "How can I track my order?",
      a: "You can track your order live from the My Orders page or via the tracking link sent to your registered email upon dispatch.",
    },
    {
      q: "What is your return & exchange policy?",
      a: "We offer a 14-day exchange window for all unworn streetwear items in original condition with tags attached.",
    },
    {
      q: "Which payment methods are accepted?",
      a: "We accept Visa, Mastercard, American Express, Apple Pay, and Cash on Delivery (COD).",
    },
  ];

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-12">
      <TopBar />
      <Navbar />

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 pb-6 border-b border-gray-100 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Help & Support</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Help & Support
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Support Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FiMail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-black uppercase">Email Support</h3>
            <p className="text-xs text-gray-500 mt-1">support@hunterwear.com</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FiPhone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-black uppercase">Phone Assistance</h3>
            <p className="text-xs text-gray-500 mt-1">+1 (800) 555-HUNTER</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-black uppercase">Live Chat</h3>
            <p className="text-xs text-gray-500 mt-1">Available 24/7 Mon-Fri</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div>
          <h2 className="text-xl font-black uppercase text-black mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-black uppercase"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-gray-600 border-t border-gray-200/50 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6 sm:p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <h2 className="text-xl font-black uppercase text-black mb-2">Send Us A Message</h2>
          <p className="text-xs text-gray-500 mb-6">Have a question about your order or drop size? Drop us a line below.</p>

          {submitted ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200 flex items-center gap-3 text-xs font-bold">
              <FiCheck className="w-5 h-5 text-green-600 stroke-[3]" />
              <span>Thank you! Your message has been sent. We'll reply within 24 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                />
                <input
                  required
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-black"
                />
              </div>

              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-semibold outline-none focus:border-black resize-none"
              />

              <button
                type="submit"
                className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition flex items-center gap-2 shadow-md"
              >
                <FiSend className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
