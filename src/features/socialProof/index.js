import {
  createSocialProofContainer,
  createSocialProofCard,
} from "../../components/socialProof/index.js";

import { productService } from "../../services/productService.js";
import { getPrimaryImage } from "../../utils/productImages.js";
import { getProductDetailsHref } from "../../utils/format.js";
import { isAuthPage } from "../../utils/isAuthPage.js";

// There's no real "who's browsing right now" signal from the
// backend, so this pairs a rotating cast of fictional Indian shopper
// names with *real* catalog products (name, photo, link all genuine)
// rather than inventing fake products too.
const CUSTOMER_NAMES = [
  "Vikram Joshi",
  "Ishaan Bhatt",
  "Aarav Mehta",
  "Priya Sharma",
  "Ananya Singh",
  "Rohan Kapoor",
  "Isha Patel",
  "Neha Verma",
  "Arjun Rao",
  "Kavya Nair",
  "Meera Iyer",
  "Rahul Gupta",
  "Zoya Khan",
  "Aditya Malhotra",
  "Divya Reddy",
  "Karan Chopra",
];

const DISMISS_KEY = "socialProofDismissed";

const FIRST_DELAY_MS = 6000;
const VISIBLE_DURATION_MS = 5500;
const GAP_BETWEEN_MS = 9000;
const HIDE_TRANSITION_MS = 500;

function isExcludedPage() {
  const path = window.location.pathname.toLowerCase();

  return (
    isAuthPage() ||
    path.endsWith("/checkout.html")
  );
}

function pickRandom(list, exclude) {

  const pool =
    list.length > 1
      ? list.filter((item) => item !== exclude)
      : list;

  return pool[
    Math.floor(Math.random() * pool.length)
  ];
}

// Independent, backend-optional widget — a failed or empty product
// fetch just means it never appears, same spirit as the WhatsApp
// button's "static shell first, hydrate after" pattern (though here
// there's nothing meaningful to show before the products arrive).
export async function initSocialProofToasts() {

  if (isExcludedPage()) return;

  try {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
  } catch {
    // Storage unavailable (private mode etc.) — proceed, just
    // without remembering a dismissal across the session.
  }

  if (document.getElementById("socialProofToast")) return;

  let products = [];

  try {

    const response =
      await productService.getPublicProducts({
        page: 1,
        limit: 12,
        sort: "featured",
      });

    products =
      (response?.data?.products || []).filter(
        (product) => product?.name
      );

  } catch (error) {

    console.error(
      "[SocialProof] Failed to load products for the activity widget.",
      error
    );

  }

  // Nothing to show — and nothing appended to the DOM either, so a
  // later retry (e.g. after a transient network failure) isn't
  // blocked by the guard above finding a stale, empty shell.
  if (!products.length) return;

  // A second init could have run while the fetch above was
  // in-flight; re-check right before inserting.
  if (document.getElementById("socialProofToast")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    createSocialProofContainer()
  );

  const container =
    document.getElementById("socialProofToast");

  const slot =
    document.getElementById("socialProofCardSlot");

  let dismissed = false;
  let lastProduct = null;
  let lastName = "";
  let cycleTimer = null;

  function buildEntry() {

    const product =
      pickRandom(products, lastProduct);

    lastProduct = product;

    const customerName =
      pickRandom(CUSTOMER_NAMES, lastName);

    lastName = customerName;

    return {
      customerName,
      productLabel: product.name,
      imageUrl: getPrimaryImage(product),
      href: getProductDetailsHref(
        product._id,
        product.slug
      ),
    };
  }

  function scheduleNext() {

    if (dismissed) return;

    cycleTimer = setTimeout(show, GAP_BETWEEN_MS);
  }

  function hide(after) {

    container.classList.add(
      "opacity-0",
      "pointer-events-none",
      "-translate-x-3"
    );

    if (after) {
      cycleTimer = setTimeout(after, HIDE_TRANSITION_MS);
    }
  }

  function show() {

    if (dismissed) return;

    slot.innerHTML =
      createSocialProofCard(buildEntry());

    slot
      .querySelector("#socialProofClose")
      ?.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        dismissed = true;

        clearTimeout(cycleTimer);

        try {
          sessionStorage.setItem(DISMISS_KEY, "1");
        } catch {
          // Ignore — dismissal just won't be remembered.
        }

        hide();

      });

    window.lucide?.createIcons();

    requestAnimationFrame(() => {
      container.classList.remove(
        "opacity-0",
        "pointer-events-none",
        "-translate-x-3"
      );
    });

    cycleTimer = setTimeout(
      () => hide(scheduleNext),
      VISIBLE_DURATION_MS
    );
  }

  cycleTimer = setTimeout(show, FIRST_DELAY_MS);

}
