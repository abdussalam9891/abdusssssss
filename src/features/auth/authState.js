import { authService } from "../../services/authService.js";

let currentUser = null;

export function getCurrentUser() {
  return currentUser;
}

export function isLoggedIn() {
  return !!currentUser;
}

export async function hydrateAuth() {
  try {
    const response = await authService.getProfile();

    currentUser = response?.data?.user || null;

  } catch (error) {
    console.error("AUTH HYDRATION FAILED:", error);

    currentUser = null;
  }

  window.dispatchEvent(
    new CustomEvent("authChanged")
  );

  return currentUser;
}

export function logout() {
  return authService.logout().finally(() => {
    localStorage.removeItem("token");

    currentUser = null;

    window.dispatchEvent(
      new CustomEvent("authChanged")
    );
  });
}
