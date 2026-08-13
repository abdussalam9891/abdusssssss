import { API_BASE_URL, API_ENDPOINTS } from "../config.js";

async function request(endpoint, options = {}) {

  const {
    method = "GET",
    body,
    headers = {},
  } = options;


  const isFormData =
    body instanceof FormData;


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;


  const authHeaders =
    token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};


  const requestHeaders = {
    ...authHeaders,
    ...headers,
  };


  // Only send JSON Content-Type when
  // there is actually a JSON request body.
  if (
    body !== undefined &&
    !isFormData
  ) {
    requestHeaders["Content-Type"] =
      "application/json";
  }


  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method,

        headers: requestHeaders,

        credentials: "include",

        ...(body !== undefined
          ? {
              body: isFormData
                ? body
                : JSON.stringify(body),
            }
          : {}),
      }
    );


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
