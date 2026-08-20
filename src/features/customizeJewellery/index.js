import { initCustomizeModal, openCustomizeModal } from "./modal.js";

import {
  initCustomizeProducts,
} from "./customizeProducts.js";

import {
  initCustomizeJewelleryValidation,
} from "./validation.js";

import {
  createCustomizeJewelleryButton,
  createCustomizeJewelleryModal,
} from "../../components/customizeJewellery/index.js";


export function initCustomizeJewellery() {

  // Render the floating button + modal markup into whichever
  // containers exist on this page (home, products, product
  // details, ...). Pages without these containers simply skip
  // rendering.

  const buttonContainer =
    document.getElementById(
      "customizeJewellery"
    );


  if (buttonContainer) {

    buttonContainer.innerHTML =
      createCustomizeJewelleryButton();

  }


  const drawerContainer =
    document.getElementById(
      "customizeJewelleryDrawer"
    );


  if (drawerContainer) {

    drawerContainer.innerHTML =
      createCustomizeJewelleryModal();


    // Reached via a "Custom Jewellery" link from another page
    // (e.g. the account dropdown), where the modal markup above
    // didn't exist yet. Open it now that it's on the page.
    if (window.location.hash === "#customize-jewellery") {

      openCustomizeModal();

    }

  }


  window.lucide?.createIcons();

  initCustomizeModal();

  initCustomizeProducts();

  initCustomizeJewelleryValidation();

}
