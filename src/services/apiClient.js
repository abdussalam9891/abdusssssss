import { API_BASE_URL, API_ENDPOINTS } from "../config.js";

async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
  } = options;

  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,

    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },

    credentials: "include",

    ...(body !== undefined
      ? {
          body: isFormData ? body : JSON.stringify(body),
        }
      : {}),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Something went wrong"
    );
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: "GET",
    }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
