"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";

const EditProduct = () => {
  const { getToken } = useAppContext();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Earphone",
    brand: "",
    color: "",
    price: "",
    offerPrice: "",
    image: [],
  });

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/${params.id}`);
      if (data.success) {
        setForm(data.product);
      } else {
        toast.error("Product not found");
        router.push("/seller");
      }
    } catch (error) {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/api/product/update/${params.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success("Product updated successfully");
        router.push("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  useEffect(() => {
    if (params.id) fetchProduct();
  }, [params.id]);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            className="w-full border p-2"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleInputChange}
              className="w-full border p-2"
              required
            />
          </div>
          <div>
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={form.color}
              onChange={handleInputChange}
              className="w-full border p-2"
              required
            />
          </div>
          <div>
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full border p-2"
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              className="w-full border p-2"
              required
            />
          </div>
          <div>
            <label>Offer Price</label>
            <input
              type="number"
              name="offerPrice"
              value={form.offerPrice}
              onChange={handleInputChange}
              className="w-full border p-2"
              required
            />
          </div>
        </div>

        <div>
          <label>Image Preview</label>
          <div className="flex gap-2 flex-wrap">
            {form.image?.map((img, index) => (
              <Image
                key={index}
                src={img}
                width={80}
                height={80}
                alt="product image"
                className="object-cover border"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
