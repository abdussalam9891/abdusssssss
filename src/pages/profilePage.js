import { initProfilePage } from "../features/profile/profilePageInit.js";

export function loadProfilePage() {

  const container =
    document.getElementById("profilePage");

  if (!container) return;


  try {

    initProfilePage();

  } catch (error) {

    console.error(
      "[loadProfilePage] initProfilePage failed:",
      error
    );

  }

}
