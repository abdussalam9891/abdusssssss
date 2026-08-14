import { websiteService } from "../services/websiteService.js";

export async function initContactPage() {
  try {
    const contactInfo =
      await websiteService.getContactInfo();

    if (!contactInfo) return;

    // ==============================
    // WHATSAPP
    // ==============================

    const whatsappLinks =
      document.querySelectorAll(
        "[data-contact-whatsapp]"
      );

    whatsappLinks.forEach((link) => {

      const number =
        contactInfo.whatsapp;

      if (!number) return;

      const cleanNumber =
        number.replace(/\D/g, "");

      link.href =
        `https://wa.me/91${cleanNumber}`;

    });


    // ==============================
    // PHONE
    // ==============================

    const phoneLinks =
      document.querySelectorAll(
        "[data-contact-phone]"
      );

    phoneLinks.forEach((link) => {

      const number =
        contactInfo.phone;

      if (!number) return;

      const cleanNumber =
        number.replace(/\D/g, "");

      link.href =
        `tel:+91${cleanNumber}`;

    });


    const phoneTexts =
      document.querySelectorAll(
        "[data-contact-phone-text]"
      );

    phoneTexts.forEach((element) => {

      element.textContent =
        contactInfo.phone || "";

    });


    // ==============================
    // EMAIL
    // ==============================

    const emailLinks =
      document.querySelectorAll(
        "[data-contact-email]"
      );

    emailLinks.forEach((link) => {

      const email =
        contactInfo.email;

      if (!email) return;

      link.href =
        `mailto:${email}`;

    });


    const emailTexts =
      document.querySelectorAll(
        "[data-contact-email-text]"
      );

    emailTexts.forEach((element) => {

      element.textContent =
        contactInfo.email || "";

    });

  } catch (error) {

    console.error(
      "[Contact] Failed to load contact information:",
      error
    );

  }
}
