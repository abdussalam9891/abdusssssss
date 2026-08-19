import { initWishlistPage } from "../features/wishlist/wishlistPageInit.js";

export function loadWishlistPage() {

  const container =
    document.getElementById("wishlistPage");

  if (!container) return;


  try {

    initWishlistPage();

  } catch (error) {

    console.error(
      "[loadWishlistPage] initWishlistPage failed:",
      error
    );

  }

}
