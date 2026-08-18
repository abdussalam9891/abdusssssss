import { websiteService } from "../../services/websiteService.js";


const ENQUIRY_BUTTON_IDS = [
  "productEnquiryButton",
  "productStickyEnquiryButton",
];


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
    ENQUIRY_BUTTON_IDS
      .map(
        (id) =>
          document.getElementById(id)
      )
      .filter(Boolean);


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


    buttons.forEach((button) => {

      const message =
        button.dataset.enquiryMessage || "";


      button.href =
        `${whatsapp}?text=${encodeURIComponent(message)}`;

      button.target = "_blank";

      button.rel = "noopener noreferrer";

    });


  } catch (error) {

    console.error(
      "[Product Details] Failed to load the WhatsApp enquiry " +
      "number. Falling back to the contact page.",
      error
    );

  }

}
