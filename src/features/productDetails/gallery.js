import {
  productState,
  setActiveImage,
} from "./state.js";

export function initGallery() {

  const buttons =
    document.querySelectorAll(".product-thumbnail");

  const image =
    document.getElementById("productMainImage");

  if (!buttons.length || !image) return;

  // Normalized product: `gallery` is an ordered list of urls.
  const images =
    productState.product?.gallery || [];

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const index =
        Number(button.dataset.index);

      setActiveImage(index);

      image.src = images[index];

      buttons.forEach((btn) => {
        btn.classList.remove("border-[#A07936]");
        btn.classList.add("border-[#ECE5D8]");
      });

      button.classList.remove("border-[#ECE5D8]");
      button.classList.add("border-[#A07936]");

    });

  });

}
