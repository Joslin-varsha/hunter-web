"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    isLoggedIn: true,
  });

  // Multiple Addresses Array
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      label: "Home",
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 234-5678",
      street: "742 Evergreen Terrace",
      apartment: "Apt 4B",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Work",
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 987-6543",
      street: "100 Innovation Way",
      apartment: "Suite 500",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
      isDefault: false,
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hunter_cart");
      const savedWishlist = localStorage.getItem("hunter_wishlist");
      const savedOrders = localStorage.getItem("hunter_orders");
      const savedUser = localStorage.getItem("hunter_user");
      const savedAddrs = localStorage.getItem("hunter_addresses");

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedAddrs) setAddresses(JSON.parse(savedAddrs));
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

  // Sync addresses to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("hunter_addresses", JSON.stringify(addresses));
    } catch (error) {
      console.error("Failed to save addresses to localStorage:", error);
    }
  }, [addresses, isLoaded]);

  // Address Actions
  const addAddress = (newAddr) => {
    const formatted = {
      id: `addr-${Date.now()}`,
      label: newAddr.label || "Home",
      firstName: newAddr.firstName || user.name.split(" ")[0] || "Alex",
      lastName: newAddr.lastName || user.name.split(" ")[1] || "Morgan",
      email: newAddr.email || user.email || "alex.morgan@example.com",
      phone: newAddr.phone || "",
      street: newAddr.street || "",
      apartment: newAddr.apartment || "",
      city: newAddr.city || "",
      state: newAddr.state || "",
      zip: newAddr.zip || "",
      country: newAddr.country || "United States",
      isDefault: newAddr.isDefault || addresses.length === 0,
    };

    setAddresses((prev) => {
      let updated = [...prev];
      if (formatted.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [formatted, ...updated];
    });
  };

  const setDefaultAddress = (addressId) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }))
    );
  };

  const deleteAddress = (addressId) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  // Helper to get current default address
  const getDefaultAddress = () => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  };

  // User Auth Actions
  const login = (name = "Alex Morgan", email = "alex.morgan@example.com") => {
    setUser({ name, email, isLoggedIn: true });
  };

  const logout = () => {
    setUser({ name: "", email: "", isLoggedIn: false });
  };

  // Add item to cart
  const addToCart = (product, size = "L", quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prevCart,
        {
          cartItemId: `${product.id}-${size}-${Date.now()}`,
          product,
          selectedSize: size,
          quantity,
          price: product.price,
        },
      ];
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Toggle wishlist item
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Add new order to Order History
  const addOrder = (orderData) => {
    const formattedOrder = {
      orderId: orderData.orderId || `HNR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Processing",
      items: orderData.items || [],
      grandTotal: orderData.grandTotal || 0,
      shippingAddress: orderData.shippingAddress || {},
      paymentMethod: orderData.paymentMethod || "Credit Card",
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
        addresses,
        addAddress,
        setDefaultAddress,
        deleteAddress,
        getDefaultAddress,
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
