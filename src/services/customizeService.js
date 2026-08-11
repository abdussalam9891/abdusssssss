import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

export const customizeService = {

  async createRequest(formData) {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CUSTOMIZE.CREATE_REQUEST(
        STORE_DOMAIN
      )}`,
      {
        method: "POST",

        headers: {
          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),
        },

        credentials: "include",

        // IMPORTANT:
        // Do NOT set Content-Type manually.
        // Browser automatically sets multipart/form-data
        // boundary when using FormData.
        body: formData,
      }
    );


    // ==========================================
    // RESPONSE
    // ==========================================

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "Failed to submit customization request."
      );

    }


    // ==========================================
    // SUCCESS
    // ==========================================

    return data;

  },

};
