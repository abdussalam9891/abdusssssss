import {
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

import { apiClient } from "./apiClient.js";


/*
 * GET /customercoupons/getAvailableCoupons/:domain
 *   -> { success, data: { coupons: [
 *        { _id, couponCode, discount, minPurchase } ] } }
 */
export const offersService = {

  getAvailableCoupons: async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.COUPONS.AVAILABLE(STORE_DOMAIN)
      );

    return Array.isArray(response?.data?.coupons)
      ? response.data.coupons
      : [];
  },

};
