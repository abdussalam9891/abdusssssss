// export const API_BASE_URL =
//   "https://backend.globalshopify.com";



  export const API_BASE_URL ="https://pm3721cg-3000.inc1.devtunnels.ms";




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

  // Same shared-backend caveat as CART/ORDERS above — mirrors Mivo's
  // confirmed, working frontend integration.
  GIFT_CARDS: {
    MY_CARDS: "/giftcardscustomer/mycard",
  },

  // This store and Mivo Jewels run on the same backend — the shape
  // below mirrors Mivo's confirmed, working frontend integration
  // rather than an independent probe against banshiwale's own
  // traffic, per services/cartService.js's header comment.
  CART: {
    ADD: "/addtocart/addToCart",
    GET: (domain) =>
      `/addtocart/getcart?domain=${encodeURIComponent(domain)}`,
    REMOVE: (productId) =>
      `/addtocart/removecart/${productId}`,
  },

  // Same shared-backend caveat as CART above — mirrors Mivo's
  // confirmed order/Cashfree integration (see services/ordersService.js).
  ORDERS: {
    CREATE: "/orders/createorder",
    GET_ONE: (orderId) =>
      `/orders/getorder/${orderId}`,
    MY_ORDERS: "/orders/my-orders",
    CANCEL: (orderId) =>
      `/orders/cancel/${orderId}`,
    RETURN: (orderId) =>
      `/orders/return/${orderId}`,
    CHECK_CF_PAYMENT: (cfOrderId) =>
      `/orders/check-cf-payment/${cfOrderId}`,
    CF_PAYMENT_RETURN: "/orders/cf-payment-return",
  },

};
