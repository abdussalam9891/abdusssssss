 import { logout } from "../auth/authState.js";

let closeTimeout;

export function initAccountDropdown() {
  const wrapper = document.getElementById("accountWrapper");
  const dropdown = document.getElementById("accountDropdown");

  if (!wrapper || !dropdown) return;

   function openDropdown() {
    clearTimeout(closeTimeout);

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
    closeTimeout = setTimeout(() => {
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
    }, 120);
  }

  wrapper.addEventListener("mouseenter", openDropdown);
  wrapper.addEventListener("mouseleave", closeDropdown);

  // ← ye add karo
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", async () => {
    logoutBtn.disabled = true;      // double-click se do baar API call na ho
    await logout();
    window.location.href = "/index.html";
  });
}














