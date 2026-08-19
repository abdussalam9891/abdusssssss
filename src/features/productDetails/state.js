import { pickDefaultSize } from "./model.js";


export const productState = {

  product: null,

  activeImageIndex: 0,

  activeTab: "description",

  quantity: 1,

  selectedSize: null,

};


export function setProduct(product) {

  productState.product = product;

  // Every fresh product starts a fresh purchase intent.
  productState.quantity = 1;

  productState.selectedSize =
    pickDefaultSize(product);

}

export function setQuantity(quantity) {

  productState.quantity = quantity;

}

export function setActiveImage(index) {

  productState.activeImageIndex = index;

}

export function setActiveTab(tab) {

  productState.activeTab = tab;

}

export function setSelectedSize(size) {

  productState.selectedSize = size;

}
