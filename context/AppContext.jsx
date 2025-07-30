'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // ✅ Fetch all products
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
    }
  };

  // ✅ Fetch user data and cart
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
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error fetching user data');
    }
  };

  // ✅ Add to cart
  const addToCart = async (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] ? cartData[itemId] + 1 : 1;
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          '/api/cart/update',
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Item added to cart successfully');
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }

    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

  // ✅ Update quantity or remove
  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          '/api/cart/update',
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Cart updated');
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Get valid cart count
  const getCartCount = () => {
    return Object.entries(cartItems).reduce((acc, [itemId, quantity]) => {
      const productExists = products.some(p => p._id === itemId);
      return productExists ? acc + quantity : acc;
    }, 0);
  };

  // ✅ Get total cart amount
  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((item) => item._id === id);
      if (product) {
        total += product.offerPrice * cartItems[id];
      }
    }
    return Math.floor(total * 100) / 100;
  };

  // ✅ Auto cleanup invalid cart items after products fetched
  useEffect(() => {
    const cleanInvalidCartItems = () => {
      const validIds = new Set(products.map(p => p._id));
      const updatedCart = { ...cartItems };
      let hasInvalidItems = false;

      Object.keys(updatedCart).forEach(id => {
        if (!validIds.has(id)) {
          delete updatedCart[id];
          hasInvalidItems = true;
        }
      });

      if (hasInvalidItems) {
        setCartItems(updatedCart);
        console.log("🧹 Cleaned invalid cart items");
      }
    };

    if (products.length > 0) {
      cleanInvalidCartItems();
    }
  }, [products]);

  // Initial fetches
  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
