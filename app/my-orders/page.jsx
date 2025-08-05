'use client';

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import { toast } from "sonner";

const statusSteps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const getStepClass = (currentStep, step) => {
    const currentIndex = statusSteps.indexOf(currentStep);
    const stepIndex = statusSteps.indexOf(step);
    if (stepIndex < currentIndex) return "bg-green-600";
    if (stepIndex === currentIndex) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>

        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Order Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-full border ${
                selectedStatus === status ? "bg-orange-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div
                key={index}
                className="p-5 bg-white border border-gray-200 shadow-sm rounded-md space-y-4"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 max-w-[60%]">
                    <img
                      className="w-16 h-16 object-contain"
                      src={assets.box_icon.src}
                      alt="box"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.items
                          .map((item) =>
                            item.product
                              ? `${item.product.name} x ${item.quantity}`
                              : `Unknown x ${item.quantity}`
                          )
                          .join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {currency}
                    {order.amount}
                  </p>
                </div>

                {/* Address */}
                <div className="text-sm text-gray-700 leading-5">
                  <p className="font-medium">{order.address?.fullName || "No Name"}</p>
                  <p>
                    {order.address?.area}, {order.address?.city}, {order.address?.state}
                  </p>
                  <p>{order.address?.phoneNumber}</p>
                </div>

                {/* Payment + Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-700">
                  <div className="space-y-0.5">
                    <p>Method: {order.payment_method || "COD"}</p>
                    <p>
                      Payment:{" "}
                      <span
                        className={`font-medium ${
                          order.payment_status === "Paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.payment_status || "Pending"}
                      </span>
                    </p>
                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <p className="text-sm font-medium text-blue-700">
                      Status: {order.status}
                    </p>
                    {order.status === "Order Placed" && (
                      <button
                        className="text-sm text-red-600 underline"
                        onClick={async () => {
                          try {
                            const token = await getToken();
                            const res = await axios.patch('/api/order/cancel', {
                              orderId: order._id
                            }, {
                              headers: { Authorization: `Bearer ${token}` }
                            });

                            if (res.data.success) {
                              toast.success("Order cancelled!");
                              fetchOrders();
                            } else {
                              toast.error(res.data.message);
                            }
                          } catch (err) {
                            toast.error("Cancellation failed");
                          }
                        }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Tracking */}
                <div className="flex justify-between items-center pt-4">
                  {statusSteps.map((step, i) => (
                    <div className="flex flex-col items-center w-full text-xs" key={i}>
                      <div
                        className={`w-4 h-4 rounded-full mb-1 ${getStepClass(
                          order.status,
                          step
                        )}`}
                      ></div>
                      <span className="text-center text-gray-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
