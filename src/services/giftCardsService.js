import { API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";

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
