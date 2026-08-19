import { websiteService } from "../../services/websiteService.js";
import { productState } from "./state.js";
import { buildEnquiryMessage } from "../../components/productDetails/enquiryButton.js";


const ENQUIRY_BUTTON_IDS = [
  "productEnquiryButton",
  "productStickyEnquiryButton",
];


// Resolved once per product view; refreshEnquiryLinks() reuses it
// so a quantity change doesn't re-fetch website data.
let resolvedWhatsapp = null;


function getButtons() {

  return ENQUIRY_BUTTON_IDS
    .map(
      (id) =>
        document.getElementById(id)
    )
    .filter(Boolean);

}


/*
 * Rebuilds each enquiry button's message (and, once resolved,
 * its WhatsApp href) from the current product + quantity in
 * state. Called on load and again whenever the quantity
 * selector changes.
 */

export function refreshEnquiryLinks() {

  const product =
    productState.product;

  if (!product) return;


  const message =
    buildEnquiryMessage(
      product,
      productState.quantity,
      productState.selectedSize?.label || ""
    );


  getButtons().forEach((button) => {

    button.dataset.enquiryMessage =
      message;


    if (resolvedWhatsapp) {

      button.href =
        `${resolvedWhatsapp}?text=${encodeURIComponent(message)}`;

    }

  });

}


/*
 * The enquiry buttons render as contact-page links so they work
 * without the backend. Once website data resolves, they are
 * upgraded to WhatsApp deep links using the backend-provided
 * number (website.whatsappNumber).
 *
 * A failure keeps the contact-page fallback — no placeholder
 * number is ever rendered.
 */

export async function initEnquiryLinks() {

  const buttons =
    getButtons();

  if (!buttons.length) return;


  try {

    const { whatsapp } =
      await websiteService.getSocialLinks();


    if (!whatsapp) {

      console.warn(
        "[Product Details] No whatsappNumber configured in the " +
        "backend website data. Enquiry buttons link to the " +
        "contact page until one is set."
      );

      return;
    }


    resolvedWhatsapp = whatsapp;


    buttons.forEach((button) => {

      button.target = "_blank";

      button.rel = "noopener noreferrer";

    });


    refreshEnquiryLinks();


  } catch (error) {

    console.error(
      "[Product Details] Failed to load the WhatsApp enquiry " +
      "number. Falling back to the contact page.",
      error
    );

  }

}
