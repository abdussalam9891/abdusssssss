import { initCustomizeModal } from "./modal.js";

import {
  initCustomizeProducts,
} from "./customizeProducts.js";

import {
  initCustomizeJewelleryValidation,
} from "./validation.js";


export function initCustomizeJewellery() {

  initCustomizeModal();

  initCustomizeProducts();

  initCustomizeJewelleryValidation();

}
