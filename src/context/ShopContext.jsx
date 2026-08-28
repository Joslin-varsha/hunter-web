"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchHomeData } from "../utils/api";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    isLoggedIn: false,
  });

  // Store Home API States
  const [categories, setCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [allApiProducts, setAllApiProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch Store Home API Data
  useEffect(() => {
    async function loadStoreHomeData() {
      const res = await fetchHomeData();
      if (res?.status === 1 && res?.data) {
        setCategories(res.data.categories || []);
        setTopCategories(res.data.top_categories || []);
        setBestsellerProducts(res.data.bestseller_products || []);
        setAllApiProducts(res.data.all_products || []);
        setStoreInfo(res.data.store || null);
      }
    }
    loadStoreHomeData();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hunter_cart");
      const savedWishlist = localStorage.getItem("hunter_wishlist");
      const savedOrders = localStorage.getItem("hunter_orders");
      const savedUser = localStorage.getItem("hunter_user");

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Failed to load shop state from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart, isLoaded]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlist, isLoaded]);

  // Sync orders to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders to localStorage:", error);
    }
  }, [orders, isLoaded]);

  // Sync user to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  }, [user, isLoaded]);

  // Login action
  const login = (userData) => {
    const fn = userData?.customer?.first_name || (userData?.name ? userData.name.split(" ")[0] : "Joslin");
    const ln = userData?.customer?.last_name || (userData?.name ? userData.name.split(" ").slice(1).join(" ") : "Varsha");
    const fullName = `${fn} ${ln}`.trim();

    const newUserState = {
      name: fullName,
      email: userData?.customer?.email || userData?.email || "joslinvarsha55@gmail.com",
      isLoggedIn: true,
      token: userData?.token || "",
      customer: userData?.customer || null,
    };

    setUser(newUserState);
    if (userData?.token) {
      try {
        localStorage.setItem("hunter_token", userData.token);
      } catch (e) {
        console.error("Token storage error:", e);
      }
    }
  };

  // Logout action
  const logout = () => {
    setUser({
      name: "",
      email: "",
      isLoggedIn: false,
      token: "",
      customer: null,
    });
    try {
      localStorage.removeItem("hunter_token");
      localStorage.removeItem("hunter_user");
    } catch (e) {
      console.error("Token clear error:", e);
    }
  };

  // Cart operations
  const addToCart = (product, selectedSize = "M", quantity = 1) => {
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${selectedSize}`;
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            product,
            selectedSize,
            quantity,
            price: product.price,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Add order
  const addOrder = (orderData) => {
    const formattedOrder = {
      id: orderData.orderId || `HNR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Processing",
      items: orderData.items || [],
      grandTotal: orderData.grandTotal || 0,
      shippingAddress: orderData.shippingAddress || {},
      paymentMethod: orderData.paymentMethod || "Prepaid",
    };

    setOrders((prev) => [formattedOrder, ...prev]);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total cart price
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get total item count in cart
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        user,
        categories,
        topCategories,
        bestsellerProducts,
        allApiProducts,
        storeInfo,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        addOrder,
        clearCart,
        getCartTotal,
        getCartCount,
        getWishlistCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
