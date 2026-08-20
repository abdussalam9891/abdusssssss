function getModalElements() {
  return {
    modal: document.getElementById("customizeModal"),
    panel: document.getElementById("customizePanel"),
    overlay: document.getElementById("customizeOverlay"),
  };
}

function openModal() {
  const { modal, panel, overlay } = getModalElements();

  if (!modal || !panel || !overlay) return false;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0");

    panel.classList.remove("opacity-0");
    panel.classList.remove("scale-95");
  });

  document.documentElement.classList.add("overflow-hidden");

  return true;
}

function closeModal() {
  const { modal, panel, overlay } = getModalElements();

  if (!modal || !panel || !overlay) return;

  overlay.classList.add("opacity-0");

  panel.classList.add("opacity-0");
  panel.classList.add("scale-95");

  document.documentElement.classList.remove("overflow-hidden");

  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 500);
}

// Exposed so other entry points (e.g. the account dropdown's
// "Custom Jewellery" link, which may navigate here from a page
// that has no modal markup) can open it once it's on the page.
export function openCustomizeModal() {
  return openModal();
}

export function initCustomizeModal() {
  // Delegated listeners: the modal can be opened from multiple
  // trigger elements sitewide (homepage floating button, account
  // dropdown, mobile nav), not all of which exist when this runs.
  document.addEventListener("click", (e) => {
    if (
      e.target.closest("#closeCustomizeModal") ||
      e.target.id === "customizeOverlay"
    ) {
      closeModal();
      return;
    }

    const trigger = e.target.closest(
      ".js-open-customize-modal"
    );

    if (!trigger) return;

    // If the modal isn't on this page, let the trigger's default
    // behavior (navigating to the homepage) proceed instead.
    if (openModal()) {
      e.preventDefault();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}
