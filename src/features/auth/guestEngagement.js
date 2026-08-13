import { isAuthPage } from "../../utils/isAuthPage.js";
import { isLoggedIn } from "./authState.js";
import { openAuthModal } from "./authTriggers.js";

const STORAGE_KEY = "banshiwale_guest_prompt";

const PROMPTS = {

  timer: {
    title: "Join banshiwale",
    subtitle:
      "Create an account to save your favourites, track your orders and enjoy a faster checkout.",
  },

  wishlist: {
    title: "Save Your Wishlist",
    subtitle:
      "Create an account to keep your favourite jewellery safe across all your devices.",
  },

  profile: {
    title: "Access Your Account",
    subtitle:
      "Sign in to view your profile, orders and saved addresses.",
  },

  checkout: {
    title: "Checkout Faster",
    subtitle:
      "Save your details securely and complete future purchases in seconds.",
  },

  orders: {
    title: "Track Your Orders",
    subtitle:
      "Sign in to view your order history and delivery updates.",
  },

  address: {
    title: "Save Your Addresses",
    subtitle:
      "Create an account for faster and smoother checkout.",
  },

};

function hasSeenToday() {

  const last = localStorage.getItem(STORAGE_KEY);

  if (!last) return false;

  return (
    Date.now() - Number(last)
    < 1000 * 60 * 60 * 24
  );

}

function markSeen() {

  localStorage.setItem(
    STORAGE_KEY,
    Date.now()
  );

}

export function showGuestPrompt(type = "timer") {

  if (isLoggedIn()) return;

  const prompt =
    PROMPTS[type] || PROMPTS.timer;

 openAuthModal(type);

}



export function initGuestEngagement() {
  if (isLoggedIn()) return;

  if (isAuthPage()) return;

  // if (hasSeenToday()) return;

  setTimeout(() => {
    showGuestPrompt("timer");
    markSeen();
  }, 2555000);
}
