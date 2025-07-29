'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const SellerOrdersPage = () => {
  const { getToken, user, currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/seller-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch seller orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Seller Orders</h2>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found for your products.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="p-4 border rounded-md bg-white shadow-sm">
              <p className="text-gray-800 font-semibold">Order ID: {order._id}</p>
              <p className="text-sm text-gray-500 mb-2">
                Placed on {new Date(order.date).toLocaleString()}
              </p>

              <p className="font-medium text-gray-700 mb-1">Shipping Address:</p>
              <p className="text-gray-600 text-sm">
                {order.address.fullName}, {order.address.area}, {order.address.city}, {order.address.state} - {order.address.pincode} <br />
                Phone: {order.address.phoneNumber}
              </p>

              <div className="mt-3 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{currency}{item.product.price || item.product.offerPrice}</span>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-right font-semibold text-gray-800">
                Total: {currency}{order.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
