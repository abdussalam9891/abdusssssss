 import { logout } from "../auth/authState.js";

let closeTimeout;

export function initAccountDropdown() {

   console.log("initAccountDropdown RAN"); 

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

 logoutBtn?.addEventListener("click", async () => {
  logoutBtn.disabled = true;

  try {
    await logout();
  } catch (error) {
    console.error("Logout API failed, clearing session locally anyway:", error);
  } finally {
    window.location.href = "/index.html";   // ab ye HAMESHA chalega, chahe API fail ho ya pass
  }
});
}














