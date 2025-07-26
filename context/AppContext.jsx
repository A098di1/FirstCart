'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { productsDummyData } from '@/assets/assets'; // Assume dummy data used until backend is fully connected

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // ✅ Fetch dummy products (replace later with real API)
  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  // ✅ Fetch authenticated user data from backend
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === 'seller') {
        setIsSeller(true);
      }

      const token = await getToken();

      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching user data');
    }
  };

  // ✅ Add item to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] ? cartData[itemId] + 1 : 1;
    setCartItems(cartData);
  };

  // ✅ Update cart quantity or remove item
  const updateCartQuantity = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  // ✅ Get total cart items count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, quantity) => acc + quantity, 0);
  };

  // ✅ Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // ✅ Fetch product data on mount
  useEffect(() => {
    fetchProductData();
  }, []);

  // ✅ Fetch user data when logged in
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // ✅ Provide global state values
  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
