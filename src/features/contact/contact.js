import { createContactForm } from "../../components/contact/contactForm.js";
import { contactService } from "../../services/contactService.js";
import { showToast } from "../../utils/toast.js";


export function initContact() {

  const section =
    document.getElementById("contact-form");

  if (!section) return;


  // ==========================================
  // RENDER FORM
  // ==========================================

  section.innerHTML =
    createContactForm();


  // ==========================================
  // ELEMENTS
  // ==========================================

  const form =
    document.getElementById("contactForm");

  const nameInput =
    document.getElementById("contactName");

  const emailInput =
    document.getElementById("contactEmail");

  const phoneInput =
    document.getElementById("contactPhone");

  const messageInput =
    document.getElementById("contactMessage");

  const submitButton =
    document.getElementById("contactSubmitButton");

  const submitText =
    document.getElementById("contactSubmitText");


  if (!form) return;


  // ==========================================
  // INPUT VALIDATION / NORMALIZATION
  // ==========================================


  // ------------------------------------------
  // NAME
  // ------------------------------------------

  if (nameInput) {

    nameInput.addEventListener("input", () => {

      nameInput.value =
        nameInput.value
          .replace(
            /[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g,
            ""
          )
          .replace(/\s{2,}/g, " ");

    });

  }


  // ------------------------------------------
  // EMAIL
  // ------------------------------------------

  if (emailInput) {

    emailInput.addEventListener("input", () => {

      emailInput.value =
        emailInput.value
          .replace(/\s/g, "")
          .toLowerCase();

    });

  }


  // ------------------------------------------
  // PHONE
  // ------------------------------------------

  if (phoneInput) {

    phoneInput.addEventListener("input", () => {

      let value =
        phoneInput.value
          .replace(/[^\d+]/g, "");


      // Allow + only at the beginning

      if (value.includes("+")) {

        value =
          "+" +
          value.replace(/\+/g, "");

      }


      // Maximum 15 digits

      const hasPlus =
        value.startsWith("+");

      const digits =
        value
          .replace(/\+/g, "")
          .slice(0, 15);


      phoneInput.value =
        hasPlus
          ? `+${digits}`
          : digits;

    });

  }


  // ==========================================
  // FORM SUBMIT
  // ==========================================

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      // ========================================
      // GET VALUES
      // ========================================

      const formData =
        new FormData(form);


      const name =
        formData
          .get("name")
          ?.trim()
          .replace(/\s{2,}/g, " ");


      const email =
        formData
          .get("email")
          ?.trim()
          .toLowerCase();


      const phone =
        formData
          .get("phone")
          ?.trim();


      const message =
        formData
          .get("message")
          ?.trim();


      // ========================================
      // REGEX
      // ========================================

      const nameRegex =
        /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;


      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


      const phoneRegex =
        /^\+?[0-9]{10,15}$/;


      // ========================================
      // REQUIRED VALIDATION
      // ========================================

      if (!name) {

        showToast({
          type: "warning",
          title: "Name Required",
          message: "Please enter your full name.",
        });

        nameInput.focus();

        return;

      }


      if (!email) {

        showToast({
          type: "warning",
          title: "Email Required",
          message: "Please enter your email address.",
        });

        emailInput.focus();

        return;

      }


      if (!phone) {

        showToast({
          type: "warning",
          title: "Phone Required",
          message: "Please enter your phone number.",
        });

        phoneInput.focus();

        return;

      }


      if (!message) {

        showToast({
          type: "warning",
          title: "Message Required",
          message: "Please enter your message.",
        });

        messageInput.focus();

        return;

      }


      // ========================================
      // NAME VALIDATION
      // ========================================

      if (
        name.length < 2 ||
        name.length > 80 ||
        !nameRegex.test(name)
      ) {

        showToast({
          type: "warning",
          title: "Invalid Name",
          message:
            "Please enter a valid name using letters only.",
        });

        nameInput.focus();

        return;

      }


      // ========================================
      // EMAIL VALIDATION
      // ========================================

      if (
        email.length > 254 ||
        !emailRegex.test(email)
      ) {

        showToast({
          type: "warning",
          title: "Invalid Email",
          message:
            "Please enter a valid email address.",
        });

        emailInput.focus();

        return;

      }


      // ========================================
      // PHONE VALIDATION
      // ========================================

      if (!phoneRegex.test(phone)) {

        showToast({
          type: "warning",
          title: "Invalid Phone Number",
          message:
            "Please enter a valid phone number.",
        });

        phoneInput.focus();

        return;

      }


      // ========================================
      // MESSAGE VALIDATION
      // ========================================

      if (message.length < 10) {

        showToast({
          type: "warning",
          title: "Message Too Short",
          message:
            "Please enter at least 10 characters in your message.",
        });

        messageInput.focus();

        return;

      }


      if (message.length > 2000) {

        showToast({
          type: "warning",
          title: "Message Too Long",
          message:
            "Your message cannot exceed 2000 characters.",
        });

        messageInput.focus();

        return;

      }


      // ========================================
      // REQUEST PAYLOAD
      // ========================================

      const contactData = {

        name,

        email,

        phone,

        message,

        domainName: "banshiwaale"

      };


      // ========================================
      // LOADING STATE
      // ========================================

      submitButton.disabled = true;

      submitText.textContent =
        "Sending...";


      showToast({
        type: "info",
        title: "Sending Message",
        message:
          "Please wait while we send your message.",
      });


      // ========================================
      // API REQUEST
      // ========================================

      try {

        await contactService.contactUs(
          contactData
        );


        // ======================================
        // SUCCESS
        // ======================================

        form.reset();


        showToast({
          type: "success",
          title: "Message Sent",
          message:
            "Thank you for contacting us. Our team will get back to you soon.",
        });


      } catch (error) {

        console.error(
          "[initContact] Contact form submission failed:",
          error
        );


        showToast({
          type: "error",
          title: "Message Not Sent",
          message:
            error?.message ||
            "Something went wrong. Please try again.",
        });


      } finally {

        submitButton.disabled = false;

        submitText.textContent =
          "Send Message";

      }

    }
  );

}
