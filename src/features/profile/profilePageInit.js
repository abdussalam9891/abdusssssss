import { isLoggedIn, getCurrentUser, logout } from "../auth/authState.js";
import { openAuthModal } from "../auth/index.js";

import { getWishlistCount } from "../wishlist/wishlistState.js";
import { getCartCount } from "../cart/cartState.js";

import { createProfileLayout } from "../../components/profile/profileLayout.js";
import { createProfileSidebar } from "../../components/profile/profileSidebar.js";
import { createProfileOverview } from "../../components/profile/profileOverview.js";

import { initProfileInfo } from "./profileInfo.js";
import { initProfileAddresses } from "./addresses.js";
import { initProfileOrders } from "./orders.js";


/*
 * Three tab panels live in the DOM together (see
 * components/profile/profileLayout.js) — switching tabs only
 * toggles which one is visible, matching the wishlist/cart pages'
 * "always render, toggle state" pattern rather than tearing down
 * and rebuilding on every click.
 */
const PANEL_IDS = {
  overview: "profileOverviewPanel",
  info: "profileInfoPanel",
  addresses: "profileAddressesPanel",
  orders: "profileOrdersPanel",
};

let activeTab = "overview";

// #profileShell itself is never replaced after the initial render
// (only its descendants' innerHTML changes), so a single delegated
// listener bound here safely survives every re-render below.
let shellListenersBound = false;


function showShellState(name) {

  const loginState =
    document.getElementById("profileLoginState");

  const shell =
    document.getElementById("profileShell");

  if (!loginState || !shell) return;


  loginState.classList.toggle(
    "hidden",
    name !== "login"
  );

  shell.classList.toggle(
    "hidden",
    name !== "shell"
  );

  shell.classList.toggle(
    "grid",
    name === "shell"
  );

}


function renderSidebar() {

  const sidebar =
    document.getElementById("profileSidebar");

  if (!sidebar) return;


  sidebar.innerHTML =
    createProfileSidebar(
      getCurrentUser(),
      activeTab
    );

  window.lucide?.createIcons();

}


function renderOverview() {

  const panel =
    document.getElementById("profileOverviewPanel");

  if (!panel) return;


  const user =
    getCurrentUser();

  panel.innerHTML =
    createProfileOverview({
      fullName: user?.firstName || "",
      wishlistCount: getWishlistCount(),
      cartCount: getCartCount(),
    });

  window.lucide?.createIcons();

}


function setActiveTab(tab) {

  if (!PANEL_IDS[tab]) return;

  activeTab = tab;


  Object.entries(PANEL_IDS).forEach(
    ([key, id]) => {

      document
        .getElementById(id)
        ?.classList.toggle(
          "hidden",
          key !== tab
        );

    }
  );


  renderSidebar();

  window.lucide?.createIcons();

}


function bindShellListeners() {

  if (shellListenersBound) return;

  shellListenersBound = true;


  const shell =
    document.getElementById("profileShell");

  if (!shell) return;


  shell.addEventListener("click", async (event) => {

    const tabLink =
      event.target.closest(".profile-nav-link");

    if (tabLink) {

      event.preventDefault();

      setActiveTab(tabLink.dataset.tab);

      return;
    }


    const logoutButton =
      event.target.closest("#profileLogoutButton");

    if (!logoutButton) return;


    logoutButton.disabled = true;

    try {

      await logout();

    } catch (error) {

      console.error(
        "[Profile] Logout failed:",
        error
      );

    } finally {

      window.location.href =
        "/index.html";

    }

  });

}


function initSignInButton() {

  document
    .getElementById("profileSignInButton")
    ?.addEventListener(
      "click",
      () => openAuthModal("profile")
    );

}


function render() {

  if (!isLoggedIn()) {

    showShellState("login");

    window.lucide?.createIcons();

    return;
  }


  showShellState("shell");

  bindShellListeners();


  renderOverview();

  // Independent per-panel initializers — a failure in one (e.g.
  // the addresses fetch) must not prevent the profile info form
  // or overview from rendering.
  try {
    initProfileInfo();
  } catch (error) {
    console.error(
      "[Profile] Failed to render profile info:",
      error
    );
  }

  try {
    initProfileAddresses();
  } catch (error) {
    console.error(
      "[Profile] Failed to render addresses:",
      error
    );
  }

  try {
    initProfileOrders();
  } catch (error) {
    console.error(
      "[Profile] Failed to render orders:",
      error
    );
  }


  setActiveTab(activeTab);

}


export function initProfilePage() {

  const container =
    document.getElementById("profilePage");

  if (!container) return;


  container.innerHTML =
    createProfileLayout();


  initSignInButton();

  render();


  window.addEventListener("authChanged", render);

  window.addEventListener("wishlistChanged", renderOverview);

  window.addEventListener("cartChanged", renderOverview);

}
