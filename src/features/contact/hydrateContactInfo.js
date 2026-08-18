import { websiteService } from "../../services/websiteService.js";


/*
 * Contact details are backend-provided. The page renders its
 * static structure first; this fills the [data-contact-*] hooks
 * in place afterwards.
 *
 * It covers both the hooks inside the rendered contact card and
 * the ones that ship as static markup on the contact page
 * (e.g. the hero "Chat on WhatsApp" button).
 *
 * On failure nothing is invented: values fall back to the
 * existing "unavailable" wording and a visible error line is
 * shown next to the contact details.
 */


const UNAVAILABLE = {

  whatsapp: "Contact unavailable",

  email: "Email unavailable",

  phone: "Phone unavailable",

  address: "Office address unavailable",

  supportTime: "Support hours unavailable",

};


function setText(selector, value) {

  document
    .querySelectorAll(selector)
    .forEach((element) => {

      element.textContent = value;

    });
}


function setHref(selector, value) {

  document
    .querySelectorAll(selector)
    .forEach((element) => {

      if (value) {

        element.href = value;

      } else {

        element.removeAttribute("href");

      }

    });
}


function showError() {

  document
    .querySelectorAll("[data-contact-error]")
    .forEach((element) => {

      element.classList.remove("hidden");

    });
}


function renderUnavailable() {

  setText(
    "[data-contact-whatsapp-text]",
    UNAVAILABLE.whatsapp
  );

  setText(
    "[data-contact-email-text]",
    UNAVAILABLE.email
  );

  setText(
    "[data-contact-phone-text]",
    UNAVAILABLE.phone
  );

  setText(
    "[data-contact-address]",
    UNAVAILABLE.address
  );

  setText(
    "[data-contact-support-time]",
    UNAVAILABLE.supportTime
  );


  showError();
}


export async function hydrateContactInfo() {

  try {

    const contactInfo =
      await websiteService.getContactInfo();


    if (!contactInfo) {

      renderUnavailable();

      return;
    }


    const {
      whatsapp = "",
      phone = "",
      email = "",
      address = "",
      supportTime = "",
    } = contactInfo;


    // ==============================
    // WHATSAPP
    // ==============================

    const whatsappDigits =
      whatsapp.replace(/\D/g, "");


    if (whatsappDigits) {

      setHref(
        "[data-contact-whatsapp]",
        `https://wa.me/91${whatsappDigits}`
      );

    }


    setText(
      "[data-contact-whatsapp-text]",
      whatsapp ||
      phone ||
      UNAVAILABLE.whatsapp
    );


    // ==============================
    // PHONE
    // ==============================

    const phoneDigits =
      phone.replace(/\D/g, "");


    if (phoneDigits) {

      setHref(
        "[data-contact-phone]",
        `tel:+91${phoneDigits}`
      );

    }


    setText(
      "[data-contact-phone-text]",
      phone || UNAVAILABLE.phone
    );


    // ==============================
    // EMAIL
    // ==============================

    if (email) {

      setHref(
        "[data-contact-email]",
        `mailto:${email}`
      );

    }


    setText(
      "[data-contact-email-text]",
      email || UNAVAILABLE.email
    );


    // ==============================
    // ADDRESS / SUPPORT HOURS
    // ==============================

    setText(
      "[data-contact-address]",
      address || UNAVAILABLE.address
    );


    setText(
      "[data-contact-support-time]",
      supportTime || UNAVAILABLE.supportTime
    );


  } catch (error) {

    console.error(
      "[Contact] Failed to load contact information:",
      error
    );


    renderUnavailable();

  }

}
