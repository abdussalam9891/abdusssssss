export const API_BASE_URL =
  "https://pm3721cg-3000.inc1.devtunnels.ms";

export const GOOGLE_CLIENT_ID =
  "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  export const STORE_DOMAIN = "miva";

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
  },
};
