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
    GOOGLE_LOGIN: "/user/google-login",
    REGISTER: "/user/createUser",
    CHANGE_PASSWORD: "/user/changepassword",
    FORGOT_PASSWORD: "/user/forgot-password",
    VERIFY_OTP: "/user/verify-otp",
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

};
