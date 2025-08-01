'use client';
import React, { useEffect, useRef } from "react";

const RazorpayButton = () => {
  const ref = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_QzjHAE6wIxRA7J");
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return (
    <div ref={ref}></div> // Razorpay button will be injected here
  );
};

export default RazorpayButton;
