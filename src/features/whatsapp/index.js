import { createFloatingWhatsAppButton } from "../../components/whatsapp/index.js";
import { websiteService } from "../../services/websiteService.js";
import { isAuthPage } from "../../utils/isAuthPage.js";

const CONTACT_PAGE_URL = "/pages/contact.html";

// The WhatsApp number is backend-provided (website.whatsappNumber).
// No trustworthy number exists in the repository, so when it cannot be
// resolved the button falls back to the contact page rather than being
// rendered with an invented or placeholder number.
export async function initFloatingWhatsAppButton() {

  if (isAuthPage()) {
    return;
  }

  if (
    document.getElementById("whatsappFloatingButton")
  ) {
    return;
  }

  // Render the static shell first so the control is present on every
  // page regardless of backend availability.
  document.body.insertAdjacentHTML(
    "beforeend",
    createFloatingWhatsAppButton(CONTACT_PAGE_URL, false)
  );

  const button =
    document.getElementById("whatsappFloatingButton");

  // The product-details page renders a mobile-only sticky Buy Now
  // bar (#productStickyActionBar) asynchronously, after product
  // data loads. Keep the floating button clear of it whenever it's
  // present, and fall back to the default position when it's not.
  const CLEARANCE_ABOVE_BAR = 16;

  let syncTicking = false;

  function syncPositionAboveStickyBar() {

    syncTicking = false;

    const stickyBar = document.getElementById(
      "productStickyActionBar"
    );

    if (
      stickyBar &&
      stickyBar.offsetParent !== null
    ) {

      button.style.bottom =
        `${stickyBar.offsetHeight + CLEARANCE_ABOVE_BAR}px`;

    } else {

      button.style.bottom = "";

    }

  }

  function scheduleSync() {
    if (syncTicking) return;
    syncTicking = true;
    requestAnimationFrame(syncPositionAboveStickyBar);
  }

  scheduleSync();

  new MutationObserver(scheduleSync).observe(
    document.body,
    { childList: true, subtree: true }
  );

  window.addEventListener("resize", scheduleSync, {
    passive: true,
  });

  try {

    const { whatsapp } =
      await websiteService.getSocialLinks();

    if (whatsapp) {

      button.href = whatsapp;
      button.target = "_blank";
      button.rel = "noopener noreferrer";

      return;

    }

    console.warn(
      "[WhatsApp] No whatsappNumber configured in the backend website data. " +
      "The floating button links to the contact page until one is set."
    );

  } catch (error) {

    console.error(
      "[WhatsApp] Failed to load WhatsApp contact number. " +
      "Falling back to the contact page.",
      error
    );

  }

}
