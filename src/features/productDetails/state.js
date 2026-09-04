import { pickDefaultSize, pickDefaultVariant } from "./model.js";


export const productState = {

  product: null,

  activeImageIndex: 0,

  activeTab: "description",

  quantity: 1,

  selectedSize: null,

  selectedVariant: null,

};


export function setProduct(product) {

  productState.product = product;

  // Every fresh product starts a fresh purchase intent.
  productState.quantity = 1;

  productState.activeImageIndex = 0;

  productState.selectedSize =
    pickDefaultSize(product);

  productState.selectedVariant =
    pickDefaultVariant(product);


  // The default variant (if any) drives the first paint too —
  // same object the rest of the app reads as "the product," so
  // gallery/pricing/cart all agree from the start instead of only
  // updating once the shopper clicks a variant.
  if (productState.selectedVariant) {

    applyVariantToProduct(
      product,
      productState.selectedVariant
    );

  }

}


export function applyVariantToProduct(product, variant) {

  if (!product || !variant) return;


  product.gallery = variant.images;

  product.price = variant.price ?? product.price;

  product.finalPrice =
    variant.finalPrice ?? product.finalPrice;

  product.discountType =
    variant.discountType || product.discountType;

  product.discountValue = variant.discountValue;

  product.hasDiscount = variant.discountValue > 0;

  product.makingCharges =
    variant.makingCharges ?? product.makingCharges;

  product.taxRate =
    variant.taxRate ?? product.taxRate;

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

export function setSelectedVariant(variant) {

  productState.selectedVariant = variant;

  applyVariantToProduct(
    productState.product,
    variant
  );

  /*
   * The new variant can carry fewer photos than the one before it —
   * a finish with a single image after one with four is normal — so
   * an index left pointing into the old gallery would open the
   * lightbox on nothing. The re-rendered gallery starts on its first
   * image, and this keeps state saying the same thing.
   */
  productState.activeImageIndex = 0;

}
