'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";

// Format currency in ₹
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const OrderSummary = () => {
  const {
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
    products
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load addresses');
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const calculateTotal = () => {
    const subtotal = getCartAmount();
    const tax = subtotal * 0.02;
    return subtotal + tax;
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    const cartItemsArray = Object.entries(cartItems)
      .map(([productId, quantity]) => {
        const productExists = products.find(p => p._id === productId);
        if (!productExists) return null;
        return { product: productId, quantity };
      })
      .filter(item => item && item.quantity > 0);

    if (cartItemsArray.length === 0) {
      toast.error("Your cart has invalid or unavailable products. Please update it.");
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      // Create payment order on server
     const amountInPaise = Math.round(calculateTotal() * 100);
console.log("Amount in paise:", amountInPaise);

const { data: orderData } = await axios.post(
  "/api/payment/razorpay-order",
  { amount: amountInPaise },
  { headers: { Authorization: `Bearer ${token}` } }
);



      console.log("Razorpay Key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "QuickCart",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          const { data: verifyRes } = await axios.post("/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            const { data } = await axios.post(
              "/api/order/create",
              {
                address: selectedAddress._id,
                items: cartItemsArray,
                totalAmount: calculateTotal(),
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
              toast.success("Order placed successfully!");
              setCartItems({});
              router.push("/order-placed");
            } else {
              toast.error(data.message || "Order failed.");
            }
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#F97316",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
              disabled={isLoading}
            />
            <button 
              className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700"
              disabled={isLoading}
            >
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{formatINR(getCartAmount())}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {formatINR(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{formatINR(calculateTotal())}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || getCartCount() === 0 || !selectedAddress}
      >
        {isLoading ? 'Processing...' : 'Pay & Place Order'}
      </button>
    </div>
  );
};

export default OrderSummary;
