import { API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";


/*
 * GET /postalcode/:pincode
 *
 *   200 -> { success, data: [ { Name, District, State,
 *            DeliveryStatus, ... } ] }
 *
 * A pincode can map to several post office branches, and each
 * branch carries its own DeliveryStatus ("Delivery" /
 * "Non-Delivery") — one branch in the list being a non-delivery
 * office doesn't mean the pincode itself is unserviceable, so a
 * pincode counts as deliverable if *any* returned branch has
 * DeliveryStatus "Delivery". A pincode with no matching post
 * office at all still comes back as a successful response with an
 * empty `data` array rather than an error status.
 */
export const postalCodeService = {

  check: async (pincode) => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.POSTALCODE.CHECK(pincode)
      );

    const postOffices =
      Array.isArray(response?.data)
        ? response.data
        : [];

    if (!postOffices.length) return null;


    const deliveryOffice =
      postOffices.find(
        (office) => office?.DeliveryStatus === "Delivery"
      );


    return {
      deliverable: Boolean(deliveryOffice),
      postOffice: deliveryOffice || postOffices[0],
    };
  },

};
