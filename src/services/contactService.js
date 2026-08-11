import { API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";


export const contactService = {

  contactUs: async (contactData) => {

    return apiClient.post(
      API_ENDPOINTS.CONTACT.CONTACT_US,
      contactData
    );

  },

};
