import { API_BASE_URL, API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";

export const authService = {

  login: async (credentials) => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  },

  getProfile: async () => {
    return apiClient.get(
      API_ENDPOINTS.AUTH.GET_PROFILE
    );
  },

  updateProfile: async (userId, profileData) => {
    return apiClient.put(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE(userId),
      profileData
    );
  },

  logout: async () => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.LOGOUT
    );
  },

  googleLogin: async (data) => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
      data
    );
  },

  register: async (userData) => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
  },

  changePassword: async (passwordData) => {
    return apiClient.put(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      passwordData
    );
  },

  sendResetOTP: async (email) => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
  },

  verifyOTPAndResetPassword: async (data) => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
  },

};
