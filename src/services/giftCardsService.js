import { API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";


/*
 * GET /giftcardscustomer/mycard  (requires auth — logged-in user's
 * own gift cards only)
 *   -> { success, data: [ { _id, giftCode, amount } ] }
 *
 * Mirrors Mivo Jewels' confirmed-working frontend integration, same
 * shared-backend caveat as services/cartService.js's header comment.
 */
export const giftCardsService = {

  getMyGiftCards: async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.GIFT_CARDS.MY_CARDS
      );

    if (Array.isArray(response?.data)) return response.data;

    if (Array.isArray(response?.gifts)) return response.gifts;

    return [];
  },

};
