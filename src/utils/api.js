// API Configuration and Utility Functions

export const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL || "http://52.66.7.6:3000";
export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "hunter-mens-wear";

// Next.js rewrite proxy in browser bypasses CORS & Security blocks
export const BASE_URL = typeof window !== "undefined" ? "/api" : API_HOST;
export const HOME_BASE_URL = BASE_URL;

/**
 * Get Secure Authorization Headers dynamically
 */
export function getAuthHeaders(customHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...customHeaders,
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("hunter_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

/**
 * Safely parse JSON API response to prevent SyntaxError crashes on 500 HTML responses
 */
async function safeJsonParse(response) {
  try {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`API response is non-JSON (${response.status}):`, text.substring(0, 150));
      return {
        status: "error",
        status_code: response.status,
        message: text.includes("Internal Server Error")
          ? "Internal Server Error (500). Please verify backend database logs or payload fields."
          : `Server returned error (${response.status}).`,
      };
    }
  } catch (err) {
    return {
      status: "error",
      message: err.message || "Failed to read response from server.",
    };
  }
}

/**
 * Register a new customer
 * @param {Object} customerData
 */
export async function registerCustomer(customerData) {
  try {
    const response = await fetch(`${BASE_URL}/customer/register/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        first_name: customerData.firstName || "",
        last_name: customerData.lastName || "",
        email: customerData.email || "",
        mobile: customerData.mobile || "",
        password: customerData.password || "",
        subscribe: customerData.subscribe ? "on" : "off",
        ref_code: customerData.refCode || "",
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Registration Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to connect to registration server.",
    };
  }
}

/**
 * Login customer
 * @param {Object} credentials
 */
export async function loginCustomer(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/customer/login/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Login Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to connect to authentication server.",
    };
  }
}

/**
 * Verify OTP Code
 * @param {Object} otpData - { email: string, otp: string }
 */
export async function verifyOTP(otpData) {
  try {
    const response = await fetch(`${BASE_URL}/customer/verify-otp/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: otpData.email,
        otp: otpData.otp,
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to verify OTP with authentication server.",
    };
  }
}

/**
 * Request Password Reset OTP
 * @param {string} email
 */
export async function forgotPassword(email) {
  try {
    const response = await fetch(`${BASE_URL}/customer/forgot-password/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to send password reset request.",
    };
  }
}

/**
 * Reset Customer Password
 * @param {Object} resetData - { email: string, password: string, passwordConfirmation: string, otp: string|number }
 */
export async function resetPassword(resetData) {
  try {
    const response = await fetch(`${BASE_URL}/customer/reset-password/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: resetData.email,
        password: resetData.password,
        password_confirmation: resetData.passwordConfirmation,
        otp: Number(resetData.otp),
      }),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to reset password with authentication server.",
    };
  }
}

/**
 * Fetch Order Countries List
 */
export async function fetchCountries() {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/countries`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Countries Error:", error);
    return {
      status: "error",
      countries: [{ id: 101, name: "India" }],
    };
  }
}

/**
 * Fetch States by Country ID
 * @param {number|string} countryId
 */
export async function fetchStates(countryId = 101) {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/states/${countryId}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch States Error:", error);
    return {
      status: "error",
      states: [],
    };
  }
}

/**
 * Fetch Cities/Districts by State ID
 * @param {number|string} stateId
 */
export async function fetchCities(stateId) {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/cities/${stateId}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Cities Error:", error);
    return {
      status: "error",
      cities: [],
    };
  }
}

/**
 * Fetch Order Payment Methods List
 */
export async function fetchPaymentMethods() {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/payment-methods`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Payment Methods Error:", error);
    return {
      status: "error",
      payment_methods: [
        { name: "Razorpay", label: "Prepaid", advance_amount: 0 },
        { name: "Advance_Pay", label: "Advance Pay [Now You will pay Shipping Amount.Balance will pay on Delivery]", advance_amount: 150 },
      ],
    };
  }
}

/**
 * Fetch Store Home Data (Store details, Categories, Bestseller Products, All Products)
 * Base URL: https://blue-enabled-therefore-anywhere.trycloudflare.com
 */
export async function fetchHomeData() {
  try {
    const response = await fetch(`${HOME_BASE_URL}/${STORE_SLUG}/home`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Home Data Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}

/**
 * Fetch Product List by Category, Page, Search, and Price Filters
 * Endpoint: GET /hunter-mens-wear/product-list
 */
export async function fetchProductList({
  page = 1,
  product_tag = "",
  product_brand = "",
  min_price = 0,
  max_price = 0,
  filter_product = "all",
  search = "",
} = {}) {
  try {
    const paramsObj = {
      page: String(page),
      filter_product: String(filter_product || "all"),
    };

    if (product_tag) paramsObj.product_tag = String(product_tag);
    if (product_brand) paramsObj.product_brand = String(product_brand);
    if (min_price) paramsObj.min_price = String(min_price);
    if (max_price) paramsObj.max_price = String(max_price);
    if (search) {
      paramsObj.search = String(search);
      paramsObj.query = String(search);
      paramsObj.q = String(search);
    }

    const queryParams = new URLSearchParams(paramsObj);

    const response = await fetch(
      `${HOME_BASE_URL}/${STORE_SLUG}/product-list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Product List Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}

/**
 * Fetch Single Product Details by Product Slug or ID
 * Endpoint: GET /hunter-mens-wear/product/{slug}
 */
export async function fetchProductDetails(productSlug) {
  try {
    const response = await fetch(
      `${HOME_BASE_URL}/${STORE_SLUG}/product/${productSlug}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Fetch Product Details Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}

/**
 * Process Customer Order
 * Endpoint: POST /customer/order/process/{STORE_SLUG}
 * @param {Object} orderPayload
 */
export async function processOrder(orderPayload) {
  try {
    const response = await fetch(`${BASE_URL}/customer/order/process/${STORE_SLUG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await safeJsonParse(response);
    return data;
  } catch (error) {
    console.error("Process Order Error:", error);
    return {
      status: "error",
      message: error.message || "Failed to process order with backend server.",
    };
  }
}

