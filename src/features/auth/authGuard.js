import { isLoggedIn, whenAuthReady } from "./authState.js";

import {
  initAuthModal,
  openAuthModal,
} from "./authTriggers.js";

/*
 * Gate for anything that needs an account (add to cart, wishlist,
 * reviews): runs the action for a signed-in customer, otherwise
 * shows the sign-in modal for `type` and does nothing else.
 *
 * Async because the signed-in state isn't known until the profile
 * lookup started on page load has settled — clicking Add to Cart a
 * moment after the page appears must not prompt a customer who is
 * already signed in.
 */
export async function requireAuth(callback, type = "timer") {
  await whenAuthReady();

  if (isLoggedIn()) {
    callback?.();
    return true;
  }

  // main.js mounts the modal once auth resolves; mount it here too
  // so a click that lands before that still gets a prompt.
  initAuthModal();

  openAuthModal(type);

  return false;
}
