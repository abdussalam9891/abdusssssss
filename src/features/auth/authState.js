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

    const response =
      await authService.getProfile();

    currentUser =
      response?.data || null;

  } catch (error) {

    currentUser = null;

  }

  window.dispatchEvent(
    new CustomEvent("authChanged")
  );

  return currentUser;
}

export function logout() {

  return authService.logout().finally(() => {

    currentUser = null;

    window.dispatchEvent(
      new CustomEvent("authChanged")
    );

  });

}
