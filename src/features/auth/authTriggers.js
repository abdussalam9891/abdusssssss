
import { createAuthModal } from "./authModal.js";
import { AUTH_MODAL_DATA } from "./authModalData.js";
import { isAuthPage } from "../../utils/isAuthPage.js";
import { rememberAuthRedirect } from "../../utils/authRedirect.js";

let initialized = false;




export function initAuthModal() {
  if (initialized) return;

  initialized = true;

  // Insert modal first
  document.body.insertAdjacentHTML(
    "beforeend",
    createAuthModal()
  );

  window.lucide?.createIcons();

  const modal = document.getElementById("authModal");
  const overlay = document.getElementById("authOverlay");

  const closeBtn = document.getElementById(
    "closeAuthModal"
  );

  const dismissBtn = document.getElementById(
    "dismissAuthModal"
  );

  // Overlay
  overlay?.addEventListener(
    "click",
    closeAuthModal
  );

  // Close button
  closeBtn?.addEventListener(
    "click",
    closeAuthModal
  );

  // Maybe Later
  dismissBtn?.addEventListener(
    "click",
    closeAuthModal
  );

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !modal.classList.contains("hidden")
    ) {
      closeAuthModal();
    }
  });
}







export function openAuthModal(type = "timer") {


   if (isAuthPage()) return;


  // Both buttons below navigate to the login / register page, so
  // remember where the customer was — validation.js sends them back
  // here once they're signed in.
  rememberAuthRedirect();



  const data =
    AUTH_MODAL_DATA[type] ||
    AUTH_MODAL_DATA.timer;

  const modal =
    document.getElementById("authModal");

  if (!modal) return;

  // Content
  document.getElementById(
    "authModalTitle"
  ).textContent = data.title;

  document.getElementById(
    "authModalSubtitle"
  ).textContent = data.subtitle;

  // Icon
  const icon =
    document.getElementById(
      "authModalIcon"
    );

  const iconImg =
    document.getElementById(
      "authModalIconImg"
    );

  if (data.image) {
    icon.classList.add("hidden");
    iconImg.src = data.image;
    iconImg.classList.remove("hidden");
  } else {
    iconImg.classList.add("hidden");
    iconImg.src = "";
    icon.classList.remove("hidden");

    icon.setAttribute(
      "data-lucide",
      data.icon
    );
  }

  // Primary Button
  const primary =
    document.getElementById(
      "authPrimaryButton"
    );

  primary.textContent =
    data.primaryButton.text;

  primary.href =
    data.primaryButton.href;

  // Secondary Button
  const secondary =
    document.getElementById(
      "authSecondaryButton"
    );

  secondary.textContent =
    data.secondaryButton.text;

  secondary.href =
    data.secondaryButton.href;

  // Show modal
  modal.classList.remove("hidden");

  // Re-render Lucide icons
  window.lucide?.createIcons();

  requestAnimationFrame(() => {
    const overlay =
      document.getElementById(
        "authOverlay"
      );

    const dialog =
      document.getElementById(
        "authDialog"
      );

    overlay.classList.add(
      "opacity-100"
    );

    dialog.classList.remove(
      "opacity-0",
      "scale-95"
    );

    dialog.classList.add(
      "opacity-100",
      "scale-100"
    );
  });

  document.body.classList.add(
    "overflow-hidden"
  );
}

export function closeAuthModal() {
  const modal =
    document.getElementById(
      "authModal"
    );

  if (!modal) return;

  const overlay =
    document.getElementById(
      "authOverlay"
    );

  const dialog =
    document.getElementById(
      "authDialog"
    );

  overlay.classList.remove(
    "opacity-100"
  );

  dialog.classList.remove(
    "opacity-100",
    "scale-100"
  );

  dialog.classList.add(
    "opacity-0",
    "scale-95"
  );

  document.body.classList.remove(
    "overflow-hidden"
  );

  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}
