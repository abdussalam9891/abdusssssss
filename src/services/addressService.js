import { API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";


/*
 * All four routes require an authenticated user — apiClient
 * already attaches the bearer token from localStorage when one
 * exists.
 *
 * The request body for add/update is confirmed against the
 * backend's own validation error: the Address schema requires
 * `fullName`, `address` (a single free-text line, not split into
 * line1/line2), and `mobile` — see
 * components/profile/addressFormModal.js and
 * features/profile/addresses.js, which build that exact shape.
 * `city`, `state`, `pincode`, `isDefault` are also sent.
 *
 * The success *response* envelope for GET /address/getaddress and
 * the mutating routes still isn't pinned down against a live
 * authenticated reply, so list/single extraction below tries the
 * common shapes this backend uses elsewhere (`{ data: [...] }`,
 * `{ addresses: [...] }`, a bare array, etc.) rather than assuming
 * one. Each address is expected to carry an `_id`.
 */

function extractList(response) {

  const candidates = [
    response?.data?.addresses,
    response?.addresses,
    response?.data?.address,
    response?.data,
    response,
  ];

  const list =
    candidates.find(
      (value) => Array.isArray(value)
    );

  if (!list) {

    console.warn(
      "[addressService] Unexpected getaddress response shape:",
      response
    );

    return [];
  }

  return list;
}


function extractOne(response) {

  return (
    response?.data?.address ||
    response?.address ||
    response?.data ||
    null
  );
}


export const addressService = {

  getAddresses: async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.ADDRESS.LIST
      );

    return extractList(response);
  },


  addAddress: async (address) => {

    const response =
      await apiClient.post(
        API_ENDPOINTS.ADDRESS.ADD,
        address
      );

    return extractOne(response);
  },


  updateAddress: async (addressId, address) => {

    const response =
      await apiClient.put(
        API_ENDPOINTS.ADDRESS.UPDATE(addressId),
        address
      );

    return extractOne(response);
  },


  deleteAddress: async (addressId) => {

    return apiClient.delete(
      API_ENDPOINTS.ADDRESS.DELETE(addressId)
    );
  },

};
