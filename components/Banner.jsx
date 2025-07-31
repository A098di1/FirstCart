import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 px-6 md:px-20 py-16 bg-gradient-to-br from-[#e6e9f2] to-[#dfe3ee] shadow-lg rounded-2xl overflow-hidden my-16">

      {/* JBL Image */}
      <div className="w-full md:w-1/4 flex justify-center">
        <Image
          className="max-w-[180px] md:max-w-[220px] animate-float"
          src={assets.jbl_soundbox_image}
          alt="jbl_soundbox_image"
        />
      </div>

      {/* Text Content */}
      <div className="text-center md:text-left md:w-2/4 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Level Up Your <br className="hidden md:block" />
          <span className="text-orange-600">Gaming Experience</span>
        </h2>
        <p className="text-gray-700 text-base md:text-lg max-w-md mx-auto md:mx-0">
          From immersive sound to precise controls — everything you need to win.
        </p>
        <button className="group inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm md:text-base transition shadow-lg hover:shadow-xl">
          Buy now
          <Image
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
          />
        </button>
      </div>

      {/* Controller Image */}
      <div className="hidden md:flex justify-end w-1/4">
        <Image
          className="max-w-[280px] animate-float-slow"
          src={assets.md_controller_image}
          alt="md_controller_image"
        />
      </div>

      {/* Small controller (mobile only) */}
      <div className="md:hidden">
        <Image
          className="w-44 mx-auto mt-6 animate-float"
          src={assets.sm_controller_image}
          alt="sm_controller_image"
        />
      </div>
    </div>
  );
};

export default Banner;
