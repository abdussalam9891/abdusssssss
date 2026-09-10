import { createLoginPage } from "../components/auth/authPages.js";

import { initLogin } from "../features/auth/authPage.js";

export function loadLoginPage() {
  const container =
    document.getElementById("loginContainer");

  if (!container) return;

  container.innerHTML =
    createLoginPage();

    window.lucide?.createIcons();

  initLogin();
}
