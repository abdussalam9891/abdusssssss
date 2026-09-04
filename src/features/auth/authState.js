import { authService } from "../../services/authService.js";

let currentUser = null;

// Whether the first profile lookup of this page load has settled,
// and the request itself while it is still in flight.
let hydrated = false;
let hydrationPromise = null;

export function getCurrentUser() {
  return currentUser;
}

export function isLoggedIn() {
  return !!currentUser;
}

/*
 * Resolves once the visitor's signed-in state is actually known.
 *
 * hydrateAuth() below runs in the background on every page load, so
 * anything reading isLoggedIn() in response to an early click — the
 * add-to-cart / wishlist guard in authGuard.js above all — would
 * otherwise see a still-empty currentUser and treat a signed-in
 * customer as a guest.
 */
export function whenAuthReady() {
  if (hydrated) return Promise.resolve(currentUser);

  return hydrateAuth();
}

export function hydrateAuth() {
  // main.js and features/auth/account.js both kick this off on every
  // page load; share the one in-flight request between them.
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    try {
      const response = await authService.getProfile();

      currentUser = response?.data?.user || null;

    } catch (error) {
      console.error("AUTH HYDRATION FAILED:", error);

      currentUser = null;
    }

    hydrated = true;
    hydrationPromise = null;

    window.dispatchEvent(
      new CustomEvent("authChanged")
    );

    return currentUser;
  })();

  return hydrationPromise;
}

export function logout() {
  return authService.logout().finally(() => {
    localStorage.removeItem("token");

    currentUser = null;

    hydrated = true;

    window.dispatchEvent(
      new CustomEvent("authChanged")
    );
  });
}
