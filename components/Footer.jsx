import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#F8F9FB] text-gray-500">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 px-6 md:px-16 lg:px-32 py-14 border-b border-gray-300">
        {/* Logo & About */}
        <div className="md:w-1/3">
          <Image className="w-28 md:w-32" src={assets.logo} alt="Quick Cart logo" />
          <p className="mt-6 text-sm leading-relaxed">
            Start exploring. Start saving. Start smiling. <br />
            Welcome to your personal shopping hub — <strong>Quick Cart</strong>! 😊
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-600 hover:text-orange-600 transition text-xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-600 hover:text-orange-600 transition text-xl"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div className="md:w-1/3">
          <h2 className="font-semibold text-gray-900 mb-5 text-sm md:text-base">Company</h2>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#" className="hover:text-orange-600 hover:underline transition">Home</a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 hover:underline transition">About us</a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 hover:underline transition">Contact us</a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 hover:underline transition">Privacy policy</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:w-1/3">
          <h2 className="font-semibold text-gray-900 mb-5 text-sm md:text-base">Get in touch</h2>
          <div className="text-sm space-y-2">
            <p>📞 +91-7815034128</p>
            <p>📧 routaditya478@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <p className="py-4 text-center text-xs md:text-sm text-gray-500/70">
        © 2025 <strong>aditya-world</strong>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
