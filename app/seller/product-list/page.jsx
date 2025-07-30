'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { assets } from "@/assets/assets";

const ProductList = () => {
  const { getToken, user, router } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>

          <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-300">
            <table className="table-fixed w-full">
              <thead className="text-gray-900 text-sm text-left bg-gray-100 border-b">
                <tr>
                  <th className="w-2/3 md:w-1/4 px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium max-sm:hidden">Brand</th>
                  <th className="px-4 py-3 font-medium max-sm:hidden">Color</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium max-sm:hidden">Action</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                      <div className="bg-gray-200 rounded p-2">
                        <Image
                          src={product.image?.[0] || assets.upload_area}
                          alt="product"
                          className="w-16 h-16 object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category || "N/A"}</td>
                    <td className="px-4 py-3 max-sm:hidden">{product.brand || "Generic"}</td>
                    <td className="px-4 py-3 max-sm:hidden">{product.color || "Multi"}</td>
                    <td className="px-4 py-3 font-medium text-black">${product.offerPrice}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3.5 w-3.5"
                          src={assets.redirect_icon}
                          alt="redirect"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
