import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#111111] text-white mt-8 sm:mt-12 hidden lg:block">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-12 lg:py-16">

        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">

            <h2 className="text-3xl sm:text-5xl font-black tracking-[6px] sm:tracking-[8px]">
              HUNTER
            </h2>

            <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-base leading-relaxed sm:leading-8 max-w-md">
              Premium streetwear inspired by modern urban culture.
              Designed for those who live boldly and wear confidence every day.
            </p>

            {/* Newsletter */}
            <div className="mt-6 sm:mt-10 flex max-w-md">

              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#1a1a1a] border border-gray-800 text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-4 rounded-l-full outline-none focus:border-gray-600 transition"
              />

              <button className="bg-white text-black px-5 sm:px-8 rounded-r-full text-xs sm:text-sm font-semibold hover:bg-gray-200 transition">
                Join
              </button>

            </div>

          </div>

          {/* Shop */}
          <div>
            <h3 className="uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-gray-200">
              Shop
            </h3>

            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-gray-400">
              <li><Link href="#products" className="hover:text-white transition">Oversized Tops</Link></li>
              <li><Link href="#products" className="hover:text-white transition">Hoodies & Fleeces</Link></li>
              <li><Link href="#products" className="hover:text-white transition">Cargos & Denim</Link></li>
              <li><Link href="#new-arrivals" className="hover:text-white transition">Outerwear & Drops</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-gray-200">
              Company
            </h3>

            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-gray-400">
              <li><Link href="#about" className="hover:text-white transition">About</Link></li>
              <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition">Journal</Link></li>
              <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-gray-200">
              Support
            </h3>

            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">Shipping</Link></li>
              <li><Link href="#" className="hover:text-white transition">Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">

          <p className="text-xs sm:text-sm text-gray-500">
            © 2026 HUNTER. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-lg sm:text-xl">

            <Link href="#" aria-label="Instagram">
              <FiInstagram className="hover:text-white text-gray-400 transition" />
            </Link>

            <Link href="#" aria-label="Facebook">
              <FiFacebook className="hover:text-white text-gray-400 transition" />
            </Link>

            <Link href="#" aria-label="Twitter">
              <FiTwitter className="hover:text-white text-gray-400 transition" />
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}