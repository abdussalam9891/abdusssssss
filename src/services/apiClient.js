import { API_BASE_URL, API_ENDPOINTS } from "../config.js";

// An unreachable host makes fetch() hang for the browser's own
// connection timeout (often 1-2 minutes), which leaves every
// backend-hydrated section stuck on its loading state. Fail fast
// instead so sections can show their error/fallback state promptly.
const DEFAULT_TIMEOUT = 20000;

async function request(endpoint, options = {}) {

  const {
    method = "GET",
    body,
    headers = {},
    timeout,
  } = options;


  const isFormData =
    body instanceof FormData;


  // Uploads are legitimately slow, so they opt out of the default
  // timeout unless a caller asks for one explicitly.
  const timeoutMs =
    timeout !== undefined
      ? timeout
      : isFormData
        ? 0
        : DEFAULT_TIMEOUT;


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


  const controller =
    timeoutMs > 0
      ? new AbortController()
      : null;


  const timeoutId =
    controller
      ? setTimeout(
          () => controller.abort(),
          timeoutMs
        )
      : null;


  let response;

  try {

    response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method,

          headers: requestHeaders,

          credentials: "include",

          ...(controller
            ? { signal: controller.signal }
            : {}),

          ...(body !== undefined
            ? {
                body: isFormData
                  ? body
                  : JSON.stringify(body),
              }
            : {}),
        }
      );

  } catch (error) {

    if (error?.name === "AbortError") {

      throw new Error(
        `Request timed out after ${timeoutMs}ms`
      );

    }

    throw error;

  } finally {

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

  }


  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }


  if (!response.ok) {

    const error =
      new Error(
        data?.message ||
        data?.error ||
        "Something went wrong"
      );


    // Additive: lets callers tell an answered request apart
    // from a network/timeout failure (e.g. a 404 "not found"
    // state vs. an unreachable backend). Existing callers that
    // only read `message` are unaffected.
    error.status =
      response.status;


    throw error;

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
