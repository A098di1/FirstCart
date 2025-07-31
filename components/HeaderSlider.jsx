'use client';

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, sliderData.length]);

  const handleSlideChange = (index) => setCurrentSlide(index);

  return (
    <div
      className="relative overflow-hidden w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-10 md:px-14 px-5 rounded-xl animate-fade"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="text-sm md:text-base text-orange-600 pb-1">
                {slide.offer}
              </p>
              <h1 className="max-w-lg text-2xl md:text-[40px] md:leading-[48px] font-semibold text-gray-800">
                {slide.title}
              </h1>
              <div className="flex items-center gap-3 mt-6">
                <button className="md:px-10 px-6 md:py-3 py-2 bg-orange-600 hover:bg-orange-700 rounded-full text-white font-medium transition">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 text-gray-700 hover:text-orange-600 transition font-medium">
                  {slide.buttonText2}
                  <Image
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                className="md:w-72 w-48 object-contain animate-float"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              currentSlide === index ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
