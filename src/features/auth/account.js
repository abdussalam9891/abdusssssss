import {
  getCurrentUser,
  hydrateAuth,
  logout,
} from "./authState.js";

import { createAccountDropdown } from "../../components/accountDropdown/dropdown.js";

export function initAccount() {
  const wrapper = document.getElementById("accountWrapper");
  const button = document.getElementById("accountButton");

  if (!wrapper || !button) return;

  // ========================================
  // Render dropdown
  // ========================================

  function render() {
    const existingDropdown =
      document.getElementById("accountDropdown");

    existingDropdown?.remove();

    wrapper.insertAdjacentHTML(
      "beforeend",
      createAccountDropdown(getCurrentUser())
    );
  }

  // ========================================
  // Open
  // ========================================

  function openDropdown() {
    const dropdown =
      document.getElementById("accountDropdown");

    if (!dropdown) return;

    dropdown.classList.remove(
      "opacity-0",
      "invisible",
      "translate-y-3"
    );

    dropdown.classList.add(
      "opacity-100",
      "visible",
      "translate-y-0"
    );
  }

  // ========================================
  // Close
  // ========================================

  function closeDropdown() {
    const dropdown =
      document.getElementById("accountDropdown");

    if (!dropdown) return;

    dropdown.classList.remove(
      "opacity-100",
      "visible",
      "translate-y-0"
    );

    dropdown.classList.add(
      "opacity-0",
      "invisible",
      "translate-y-3"
    );
  }

  // ========================================
  // ACCOUNT BUTTON
  // ========================================

  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const dropdown =
      document.getElementById("accountDropdown");

    if (!dropdown) return;

    const isOpen =
      dropdown.classList.contains("visible");

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // ========================================
  // DESKTOP LOGIN / LOGOUT
  // Event Delegation
  // ========================================

  wrapper.addEventListener("click", async (event) => {


    console.log(
    "WRAPPER CLICK:",
    event.target
  );

  const logoutBtn =
    event.target.closest("#logoutBtn");

  console.log(
    "LOGOUT BTN FOUND:",
    logoutBtn
  );


  

    // --------------------------------------
    // LOGIN
    // --------------------------------------

    const loginBtn =
      event.target.closest("#loginBtn");

    if (loginBtn) {
      event.preventDefault();

      window.dispatchEvent(
        new CustomEvent("openLogin")
      );

      closeDropdown();

      return;
    }

    // --------------------------------------
    // LOGOUT
    // --------------------------------------

    const logoutBtn =
      event.target.closest("#logoutBtn");

    if (!logoutBtn) return;

    event.preventDefault();
    event.stopPropagation();

    console.log("DESKTOP LOGOUT CLICKED");

    if (logoutBtn.disabled) return;

    logoutBtn.disabled = true;

    try {
      await logout();

      console.log("DESKTOP LOGOUT SUCCESS");

      closeDropdown();

      // authChanged will also trigger render()
      // but keeping render here makes the UI immediate.
      render();

    } catch (error) {
      console.error(
        "Desktop logout failed:",
        error
      );

      logoutBtn.disabled = false;
    }
  });

  // ========================================
  // Click Outside
  // ========================================

  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) {
      closeDropdown();
    }
  });

  // ========================================
  // Auth Changed
  // ========================================

  window.addEventListener(
    "authChanged",
    () => {
      render();
    }
  );

  // ========================================
  // Initial Render
  // ========================================

  render();

  // ========================================
  // Restore Existing Session
  // ========================================

  hydrateAuth();
}
