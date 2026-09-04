import { isAuthPage } from "./isAuthPage.js";

/*
 * Where to send the customer back to after they sign in.
 *
 * The sign-in modal (features/auth/authTriggers.js) is opened from
 * wherever the gated action was — a product page's Add to Cart, a
 * wishlist heart — and its buttons navigate away to the login /
 * register pages. Remembering the page here lets the login form
 * (features/auth/validation.js) return the customer to it so they
 * can finish what they were doing, instead of dropping them on the
 * homepage.
 *
 * Session-scoped and consumed once, so a remembered page never
 * leaks into an unrelated later sign-in.
 */

const STORAGE_KEY = "banshiwale_auth_redirect";

const DEFAULT_REDIRECT = "/index.html";

export function rememberAuthRedirect() {
  if (isAuthPage()) return;

  const target =
    window.location.pathname +
    window.location.search +
    window.location.hash;

  try {
    sessionStorage.setItem(STORAGE_KEY, target);

  } catch (error) {
    console.warn(
      "[Auth] Could not remember redirect target:",
      error
    );
  }
}

export function consumeAuthRedirect(
  fallback = DEFAULT_REDIRECT
) {
  let target = null;

  try {
    target = sessionStorage.getItem(STORAGE_KEY);

    sessionStorage.removeItem(STORAGE_KEY);

  } catch (error) {
    console.warn(
      "[Auth] Could not read redirect target:",
      error
    );
  }

  // Same-origin paths only — never a full URL from storage.
  if (
    !target ||
    !target.startsWith("/") ||
    target.startsWith("//")
  ) {
    return fallback;
  }

  const path = target.split(/[?#]/)[0].toLowerCase();

  if (
    path.endsWith("/login.html") ||
    path.endsWith("/register.html") ||
    path.endsWith("/forgotpassword.html")
  ) {
    return fallback;
  }

  return target;
}
