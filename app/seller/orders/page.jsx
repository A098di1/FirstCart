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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(`/api/order/update-status`, {
        orderId,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Order status updated");
        fetchSellerOrders();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating order status");
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
                  <div key={i} className="flex flex-col md:flex-row justify-between text-sm border-b py-1">
                    <div>
                      <p className="font-medium">{item.product.name} × {item.quantity}</p>
                      <p className="text-gray-500 text-xs">
                        Brand: {item.product.brand || "N/A"} | Color: {item.product.color || "N/A"}
                      </p>
                    </div>
                    <p>{currency}{item.product.price || item.product.offerPrice}</p>
                  </div>
                ))}
              </div>

              <p className="font-semibold text-lg text-gray-800 mt-3">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(order.amount)}
              </p>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
                {order.status === "Cancelled" ? (
                  <span className="text-red-600 font-semibold">{order.status}</span>
                ) : (
                  <select
                    className="border text-sm px-2 py-1 rounded"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
