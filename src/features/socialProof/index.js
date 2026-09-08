import {
  createSocialProofContainer,
  createSocialProofCard,
} from "../../components/socialProof/index.js";

import { isAuthPage } from "../../utils/isAuthPage.js";

// There's no real "who's browsing right now" signal from the
// backend, so this pairs a rotating cast of fictional Indian shopper
// names with static local photos of men wearing our jewellery —
// entirely static, no backend call and nothing to click through to.
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

const TIME_LABELS = [
  "Just now",
  "1 min before",
  "2 min before",
  "3 min before",
  "5 min before",
  "8 min before",
  "10 min before",
];

// Static local photos (men wearing the jewellery) — no product
// fetch, no click-through, just a rotating cast of looks.
const PRODUCTS = [
  {
    productLabel: "Sterling Silver Curb Bracelet",
    imageUrl: "/src/assets/images/auth-men-silver.jpg",
  },
  {
    productLabel: "Men's Chain Link Bracelet",
    imageUrl: "/src/assets/bracelets/1-2.webp",
  },
  {
    productLabel: "Men's Figaro Bracelet",
    imageUrl: "/src/assets/bracelets/2-2.webp",
  },
  {
    productLabel: "Men's Curb Chain Necklace",
    imageUrl: "/src/assets/chains/1-2.webp",
  },
  {
    productLabel: "Men's Diamond Band Ring",
    imageUrl: "/src/assets/rings/1-2.webp",
  },
  {
    productLabel: "Men's Channel Set Ring",
    imageUrl: "/src/assets/rings/2-2.webp",
  },
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

// Fully static widget — no backend call, no product fetch, and the
// card is never a link (see socialProofWidget.js), so there's
// nothing to click through to.
export async function initSocialProofToasts() {

  if (isExcludedPage()) return;

  try {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
  } catch {
    // Storage unavailable (private mode etc.) — proceed, just
    // without remembering a dismissal across the session.
  }

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
  let lastTimeLabel = "";
  let cycleTimer = null;

  function buildEntry() {

    const product =
      pickRandom(PRODUCTS, lastProduct);

    lastProduct = product;

    const customerName =
      pickRandom(CUSTOMER_NAMES, lastName);

    lastName = customerName;

    const timeLabel =
      pickRandom(TIME_LABELS, lastTimeLabel);

    lastTimeLabel = timeLabel;

    return {
      customerName,
      productLabel: product.productLabel,
      imageUrl: product.imageUrl,
      timeLabel,
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
