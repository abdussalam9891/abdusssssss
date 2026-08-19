import { isLoggedIn } from "./authState.js";
import { openAuthModal }
from "./index.js";

export function requireAuth(callback, type = "timer") {
  if (isLoggedIn()) {
    callback?.();
    return true;
  }

  openAuthModal(type);

  return false;
}
