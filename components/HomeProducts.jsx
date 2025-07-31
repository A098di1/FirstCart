"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    setLoading(true);
    let result = [...products];

    // Filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    if (sortOption === "lowToHigh") {
      result.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOption === "highToLow") {
      result.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    setFilteredProducts(result);
    setTimeout(() => setLoading(false), 500); // Simulate loading
  }, [products, selectedCategory, sortOption]);

  return (
    <div className="flex flex-col items-center pt-14 px-4 md:px-10">
      <div className="flex justify-between w-full mb-6">
        <p className="text-2xl font-medium">Popular products</p>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-1 rounded text-sm text-gray-700"
        >
          <option value="default">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              selectedCategory === cat
                ? "bg-orange-600 text-white"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full pb-14">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
            ))
          : filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
      </div>

      <button
        onClick={() => router.push("/all-products")}
        className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
