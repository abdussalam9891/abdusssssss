import {
  getCurrentUser,
  hydrateAuth,
  logout,
} from "./authState.js";

import { createAccountDropdown } from "../../components/accountDropdown/dropdown.js";

export function initAccount() {

  const wrapper =
    document.getElementById("accountWrapper");

  const button =
    document.getElementById("accountButton");

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

    bindDropdownActions();
  }


  // ========================================
  // Bind login / logout
  // ========================================

  function bindDropdownActions() {

    const loginBtn =
      document.getElementById("loginBtn");

    const logoutBtn =
      document.getElementById("logoutBtn");


    // LOGIN

    loginBtn?.addEventListener(
      "click",
      () => {

        window.dispatchEvent(
          new CustomEvent("openLogin")
        );

        closeDropdown();
      }
    );


    // LOGOUT

    logoutBtn?.addEventListener(
      "click",
      async () => {

        logoutBtn.disabled = true;

        try {

          await logout();

        } catch (error) {

          console.error(
            "Logout failed:",
            error
          );

        }

        closeDropdown();

        render();
      }
    );
  }


  // ========================================
  // Dropdown open / close
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
  // Toggle
  // ========================================

  button.addEventListener(
    "click",
    (event) => {

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
    }
  );


  // ========================================
  // Click outside
  // ========================================

  document.addEventListener(
    "click",
    (event) => {

      if (!wrapper.contains(event.target)) {
        closeDropdown();
      }

    }
  );


  // ========================================
  // Auth changed
  // ========================================

  window.addEventListener(
    "authChanged",
    () => {

      render();

    }
  );


  // ========================================
  // Initial render
  // ========================================

  render();


  // ========================================
  // Check existing session
  // ========================================

  hydrateAuth();
}
