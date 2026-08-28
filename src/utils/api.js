// API Configuration and Utility Functions

export const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL || "http://52.66.7.6:3000";

// Use Next.js rewrite proxy /api in browser to bypass Cloudflare Tunnel CORS & Provisional Header blocks
export const BASE_URL = typeof window !== "undefined" ? "/api" : API_HOST;
export const STORE_SLUG = "hunter-mens-wear";

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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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

    const data = await response.json();
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
 */
export async function fetchHomeData() {
  try {
    const response = await fetch(`${BASE_URL}/${STORE_SLUG}/home`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch Home Data Error:", error);
    return {
      status: 0,
      data: null,
    };
  }
}
