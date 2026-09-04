import { API_ENDPOINTS, STORE_DOMAIN } from "../config.js";
import { apiClient } from "./apiClient.js";


export const ordersService = {

  createOrder: async (payload) => {

    return apiClient.post(
      API_ENDPOINTS.ORDERS.CREATE,
      {
        ...payload,
        domain: STORE_DOMAIN,
      },
      // Observed live: this backend can take well over apiClient's
      // 8s default "fail fast" timeout to respond even though it
      // has already created the order (and sent the confirmation
      // email) — a write this critical shouldn't be given up on
      // just because it's slow. Give it real room before we treat
      // it as failed.
      { timeout: 30000 }
    );
  },


  getOrder: async (orderId) => {

    return apiClient.get(
      API_ENDPOINTS.ORDERS.GET_ONE(orderId)
    );
  },


  /*
   * GET /orders/my-orders (authMiddleware — returns only the
   * signed-in customer's own orders, never another customer's).
   *
   * Response envelope isn't pinned down against a live authenticated
   * reply for this store yet, so this unwraps every shape seen
   * elsewhere on this backend (`orders`, `data.orders`, or `data`
   * directly) and always returns an array.
   */

  getMyOrders: async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.ORDERS.MY_ORDERS
      );

    const list =
      response?.orders ||
      response?.data?.orders ||
      response?.data;

    return Array.isArray(list) ? list : [];
  },

};
