// export const API_BASE_URL =
//   "https://pm3721cg-3000.inc1.devtunnels.ms";



  export const API_BASE_URL ="https://backend.globalshopify.com";




export const GOOGLE_CLIENT_ID =
  "304821804047-mbj0e5dcnr8iud8b22trh313nudcqkj2.apps.googleusercontent.com";

  export const STORE_DOMAIN = "banshiwaale";

export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: "/user/loginUser",
    LOGOUT: "/user/logout",
    GET_PROFILE: "/user/getProfile",
    UPDATE_PROFILE: (userId) =>
      `/user/updateProfile/${userId}`,
    GOOGLE_LOGIN: "/user/google-login",
    REGISTER: "/user/createUser",
    CHANGE_PASSWORD: "/user/changepassword",
    FORGOT_PASSWORD: "/user/forgot-password",
    VERIFY_OTP: "/user/verify-otp",
  },

  ADDRESS: {
    LIST: "/address/getaddress",
    ADD: "/address/addaddress",
    UPDATE: (addressId) =>
      `/address/updateaddress/${addressId}`,
    DELETE: (addressId) =>
      `/address/deleteaddress/${addressId}`,
  },

  CONTACT: {
    CONTACT_US: "/contactservice/contactus",
  },

  CUSTOMIZE: {
    CREATE_REQUEST: (domain) =>
      `/customize/createCustomizeRequest/${domain}`,
  },

  PRODUCTS: {
    PUBLIC_BY_STORE: (domain) =>
      `/product/public/store/${domain}`,
    SIMILAR_BY_SLUG: (slug) =>
      `/product/similar/slug/${slug}`,
  },

  WEBSITE: {
    PUBLIC: (domain) =>
      `/fullweb/public?domain=${encodeURIComponent(domain)}`,
  },

  WISHLIST: {
    GET: (domain) =>
      `/wishlist/getwishlist?domain=${encodeURIComponent(domain)}`,
    ADD: "/wishlist/addtowishlist",
    REMOVE: (productId) =>
      `/wishlist/removewishlist/${productId}`,
  },

  POSTALCODE: {
    CHECK: (pincode) =>
      `/postalcode/${pincode}`,
  },

  REVIEW: {
    LIST: (productId) =>
      `/review/getProductReviews/${productId}`,
    SUMMARY: (productId) =>
      `/review/starsummary/${productId}`,
    CREATE: "/review/createReview",
  },

  COUPONS: {
    AVAILABLE: (domain) =>
      `/customercoupons/getAvailableCoupons/${encodeURIComponent(domain)}`,
  },

  // Verified directly against the backend (all three require a
  // bearer token — an unauthenticated request 401s with "No token
  // provided" instead of 404ing, confirming the routes exist). Only
  // ADD is currently called from the frontend (see
  // services/cartService.js) — the cart itself still runs on
  // localStorage (features/cart/cartState.js) since GET/DELETE's
  // response contract hasn't been confirmed against a real
  // authenticated reply yet.
  CART: {
    ADD: "/addtocart/addToCart",
    GET: "/addtocart/getcart",
    REMOVE: (cartItemId) =>
      `/addtocart/removecart/${cartItemId}`,
  },

};
