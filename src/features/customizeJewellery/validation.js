import { showToast } from "../../utils/toast.js";
import { customizeService } from "../../services/customizeService.js";

export function initCustomizeJewelleryValidation() {
  const form =
    document.getElementById("customJewelleryForm");

  if (!form) return;

  if (form.dataset.initialized) return;

  form.dataset.initialized = "true";

  const fullNameInput =
    form.querySelector('[name="fullName"]');

  const phoneInput =
    form.querySelector('[name="phone"]');

  const emailInput =
    form.querySelector('[name="email"]');

  const categoryInput =
    form.querySelector('[name="category"]');

  const productIdInput =
    form.querySelector('[name="productId"]');

  const descriptionInput =
    form.querySelector('[name="description"]');

  const imageInput =
    form.querySelector('[name="referenceImage"]');


  // ==========================================
  // LIVE VALIDATION
  // ==========================================

  fullNameInput?.addEventListener("input", () => {
    fullNameInput.value =
      fullNameInput.value
        .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, "")
        .replace(/\s{2,}/g, " ");
  });


  phoneInput?.addEventListener("input", () => {
    phoneInput.value =
      phoneInput.value
        .replace(/\D/g, "")
        .slice(0, 10);
  });


  emailInput?.addEventListener("input", () => {
    emailInput.value =
      emailInput.value
        .replace(/\s/g, "")
        .toLowerCase();
  });


  // ==========================================
  // SUBMIT
  // ==========================================

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName =
      fullNameInput?.value
        .trim()
        .replace(/\s{2,}/g, " ") || "";

    const phone =
      phoneInput?.value.trim() || "";

    const email =
      emailInput?.value
        .trim()
        .toLowerCase() || "";

    const category =
      categoryInput?.value || "";

    const productId =
      productIdInput?.value.trim() || "";

    const description =
      descriptionInput?.value.trim() || "";

    const image =
      imageInput?.files?.[0] || null;


    // ==========================================
    // REQUIRED
    // ==========================================

    if (!fullName) {
      showToast({
        type: "warning",
        title: "Name Required",
        message: "Please enter your full name.",
      });

      fullNameInput?.focus();
      return;
    }


    if (!phone) {
      showToast({
        type: "warning",
        title: "Phone Required",
        message: "Please enter your phone number.",
      });

      phoneInput?.focus();
      return;
    }


    if (!email) {
      showToast({
        type: "warning",
        title: "Email Required",
        message: "Please enter your email address.",
      });

      emailInput?.focus();
      return;
    }


    if (!category) {
      showToast({
        type: "warning",
        title: "Jewellery Type Required",
        message: "Please select a jewellery type.",
      });

      categoryInput?.focus();
      return;
    }


    // ==========================================
    // NAME
    // ==========================================

    const nameRegex =
      /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    if (
      fullName.length < 2 ||
      fullName.length > 80 ||
      !nameRegex.test(fullName)
    ) {
      showToast({
        type: "warning",
        title: "Invalid Name",
        message: "Please enter a valid full name.",
      });

      fullNameInput?.focus();
      return;
    }


    // ==========================================
    // PHONE
    // ==========================================

    if (!/^[6-9]\d{9}$/.test(phone)) {
      showToast({
        type: "warning",
        title: "Invalid Phone Number",
        message:
          "Please enter a valid 10-digit Indian mobile number.",
      });

      phoneInput?.focus();
      return;
    }


    // ==========================================
    // EMAIL
    // ==========================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

      emailInput?.focus();
      return;
    }


    // ==========================================
    // DESCRIPTION
    // ==========================================

    if (!description) {
      showToast({
        type: "warning",
        title: "Description Required",
        message:
          "Please tell us about your customization.",
      });

      descriptionInput?.focus();
      return;
    }


    if (description.length > 2000) {
      showToast({
        type: "warning",
        title: "Description Too Long",
        message:
          "Please keep your description under 2000 characters.",
      });

      descriptionInput?.focus();
      return;
    }


    // ==========================================
    // IMAGE
    // OPTIONAL — ONLY ONE
    // ==========================================

    if (image) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ];

      if (!allowedTypes.includes(image.type)) {
        showToast({
          type: "warning",
          title: "Invalid Image",
          message:
            "Please upload a JPG, PNG, WEBP or AVIF image.",
        });

        return;
      }

      if (image.size > 20 * 1024 * 1024) {
        showToast({
          type: "warning",
          title: "Image Too Large",
          message:
            "The image must be smaller than 20 MB.",
        });

        return;
      }
    }


    // ==========================================
    // FORMDATA
    // ==========================================

    const formData =
      new FormData();

    formData.append(
      "fullName",
      fullName
    );

    formData.append(
      "phone",
      phone
    );

    formData.append(
      "email",
      email
    );

    formData.append(
      "category",
      category
    );

    formData.append(
      "productId",
      productId
    );

    formData.append(
      "description",
      description
    );


    // IMPORTANT:
    // Only append image when user selected one.
    // Backend multer currently expects "referenceImage".

    if (image) {
      formData.append(
        "referenceImage",
        image
      );
    }


    // ==========================================
    // SUBMIT
    // ==========================================

    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );

    if (submitButton) {
      submitButton.disabled = true;
    }


    try {

      showToast({
        type: "info",
        title: "Submitting Request",
        message:
          "Please wait while we submit your customization request.",
      });


      const response =
        await customizeService.createRequest(
          formData
        );


      console.log(
        "[Customize] API response:",
        response
      );


      form.reset();


      showToast({
        type: "success",
        title: "Request Submitted",
        message:
          "Our jewellery consultant will contact you shortly.",
      });


    } catch (error) {

      console.error(
        "[Customize] Submission failed:",
        error
      );


      showToast({
        type: "error",
        title: "Request Failed",
        message:
          error?.message ||
          "Unable to submit your request. Please try again.",
      });


    } finally {

      if (submitButton) {
        submitButton.disabled = false;
      }

    }
  });
}
