import { addressService } from "../../services/addressService.js";
import { showToast } from "../../utils/toast.js";
import { createAddressSelector } from "../../components/checkout/addressSelector.js";


/*
 * The "Add / Edit Address" modal markup
 * (components/profile/addressFormModal.js) is shared with the
 * profile page, but each page only ever renders one copy of it in
 * its own document, so reusing the same element ids here is safe.
 * The open/close/validate/submit wiring below is intentionally a
 * separate, smaller copy of features/profile/addresses.js's modal
 * logic (checkout only needs "add" + "select", not the full manage
 * panel) rather than a shared extraction, per CLAUDE.md's
 * "don't refactor unrelated code" rule.
 */

const NAME_REGEX =
  /^[a-zA-ZÀ-ÿ]+(?:[\s'-][a-zA-ZÀ-ÿ]+)*$/;

const PHONE_REGEX =
  /^[6-9]\d{9}$/;

const PINCODE_REGEX =
  /^[1-9][0-9]{5}$/;


let cachedAddresses = [];
let selectedAddressId = "";
let onChangeCallback = null;
let modalControlsBound = false;


export function getSelectedAddress() {

  return (
    cachedAddresses.find(
      (address) =>
        (address._id || address.id) === selectedAddressId
    ) || null
  );

}


function renderSection() {

  const container =
    document.getElementById("checkoutAddressSection");

  if (!container) return;


  container.innerHTML =
    createAddressSelector(
      cachedAddresses,
      selectedAddressId
    );

  window.lucide?.createIcons();

}


function selectAddress(id) {

  selectedAddressId = id;

  renderSection();

  onChangeCallback?.();

}


function pickDefaultSelection() {

  if (
    selectedAddressId &&
    cachedAddresses.some(
      (address) =>
        (address._id || address.id) === selectedAddressId
    )
  ) {
    return;
  }


  const defaultAddress =
    cachedAddresses.find(
      (address) => address.isDefault || address.default
    );

  const fallback =
    defaultAddress || cachedAddresses[0];

  selectedAddressId =
    fallback
      ? fallback._id || fallback.id || ""
      : "";

}


async function loadAddresses() {

  try {

    cachedAddresses =
      await addressService.getAddresses();

  } catch (error) {

    console.error(
      "[Checkout] Failed to load addresses:",
      error
    );

    cachedAddresses = [];

  }


  pickDefaultSelection();

  renderSection();

  onChangeCallback?.();

}


// ==========================================
// ADD / EDIT MODAL
// ==========================================

function getModalElements() {

  return {
    modal: document.getElementById("addressFormModal"),
    panel: document.getElementById("addressFormModalPanel"),
    form: document.getElementById("addressForm"),
    title: document.getElementById("addressFormModalTitle"),
    idInput: document.getElementById("addressFormId"),
    errorMessage: document.getElementById("addressFormError"),
  };

}


function openModal(address = null) {

  const { modal, panel, form, title, idInput, errorMessage } =
    getModalElements();

  if (!modal || !panel || !form) return;


  form.reset();

  errorMessage?.classList.add("hidden");


  if (address) {

    title.textContent = "Edit Address";

    idInput.value =
      address._id || address.id || "";

    form.fullName.value =
      address.fullName || address.name || "";

    form.mobile.value =
      address.mobile || address.phone || "";

    form.address.value =
      address.address ||
      [address.addressLine1, address.addressLine2]
        .filter(Boolean)
        .join(", ") ||
      "";

    form.city.value = address.city || "";

    form.state.value = address.state || "";

    form.pincode.value =
      address.pincode || address.postalCode || "";

    form.isDefault.checked =
      Boolean(address.isDefault || address.default);

  } else {

    title.textContent = "Add Address";

    idInput.value = "";

  }


  modal.classList.remove("hidden");
  modal.classList.add("flex");

  requestAnimationFrame(() => {
    panel.classList.remove("opacity-0", "scale-95");
  });

  document.documentElement.classList.add("overflow-hidden");

}


function closeModal() {

  const { modal, panel } = getModalElements();

  if (!modal || !panel) return;


  panel.classList.add("opacity-0", "scale-95");

  document.documentElement.classList.remove("overflow-hidden");

  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 300);

}


function validateAddressForm(form) {

  const fullName = form.fullName.value.trim();
  const mobile = form.mobile.value.trim();
  const address = form.address.value.trim();
  const city = form.city.value.trim();
  const state = form.state.value.trim();
  const pincode = form.pincode.value.trim();


  if (!fullName || !NAME_REGEX.test(fullName)) {
    return "Please enter a valid full name.";
  }

  if (!PHONE_REGEX.test(mobile)) {
    return "Please enter a valid 10-digit mobile number.";
  }

  if (!address) {
    return "Please enter your address.";
  }

  if (!city) {
    return "Please enter your city.";
  }

  if (!state) {
    return "Please enter your state.";
  }

  if (!PINCODE_REGEX.test(pincode)) {
    return "Please enter a valid 6-digit pincode.";
  }

  return null;

}


function initModalControls() {

  if (modalControlsBound) return;

  modalControlsBound = true;


  const overlay =
    document.getElementById("addressFormModalOverlay");

  const closeButton =
    document.getElementById("closeAddressFormModal");

  const cancelButton =
    document.getElementById("cancelAddressFormModal");

  const form =
    document.getElementById("addressForm");

  const phoneInput =
    document.getElementById("addressFormMobile");

  const pincodeInput =
    document.getElementById("addressFormPincode");


  overlay?.addEventListener("click", closeModal);
  closeButton?.addEventListener("click", closeModal);
  cancelButton?.addEventListener("click", closeModal);


  phoneInput?.addEventListener("input", () => {

    phoneInput.value =
      phoneInput.value.replace(/\D/g, "").slice(0, 10);

  });


  pincodeInput?.addEventListener("input", () => {

    pincodeInput.value =
      pincodeInput.value.replace(/\D/g, "").slice(0, 6);

  });


  form?.addEventListener("submit", async (event) => {

    event.preventDefault();


    const errorMessage =
      document.getElementById("addressFormError");

    const submitButton =
      document.getElementById("submitAddressFormButton");

    const submitText =
      document.getElementById("submitAddressFormButtonText");


    const validationError =
      validateAddressForm(form);

    if (validationError) {

      if (errorMessage) {
        errorMessage.textContent = validationError;
        errorMessage.classList.remove("hidden");
      }

      return;
    }


    errorMessage?.classList.add("hidden");


    const payload = {
      fullName: form.fullName.value.trim(),
      mobile: form.mobile.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value.trim(),
      pincode: form.pincode.value.trim(),
      isDefault: form.isDefault.checked,
    };

    const addressId = form.addressId.value;


    submitButton.disabled = true;

    submitText.textContent =
      addressId ? "Saving..." : "Adding...";


    try {

      let saved;

      if (addressId) {

        saved =
          await addressService.updateAddress(addressId, payload);

        showToast({
          type: "success",
          title: "Address Updated",
          message: "Your address has been updated.",
        });

      } else {

        saved =
          await addressService.addAddress(payload);

        showToast({
          type: "success",
          title: "Address Added",
          message: "Your new address has been saved.",
        });

      }


      closeModal();

      const savedId =
        saved?._id || saved?.id || addressId;

      if (savedId) selectedAddressId = savedId;

      await loadAddresses();


    } catch (error) {

      console.error(
        "[Checkout] Failed to save address:",
        error
      );

      if (errorMessage) {

        errorMessage.textContent =
          error?.message ||
          "Something went wrong. Please try again.";

        errorMessage.classList.remove("hidden");

      }


    } finally {

      submitButton.disabled = false;

      submitText.textContent = "Save Address";

    }

  });

}


function initSectionControls() {

  const container =
    document.getElementById("checkoutAddressSection");

  if (!container) return;


  container.addEventListener("click", (event) => {

    if (event.target.closest("#checkoutAddAddressButton")) {
      openModal();
      return;
    }


    const editButton =
      event.target.closest("[data-address-edit]");

    if (editButton) {

      const id = editButton.dataset.addressId;

      const address =
        cachedAddresses.find(
          (item) => (item._id || item.id) === id
        );

      if (address) openModal(address);

      return;
    }


    const option =
      event.target.closest("[data-address-option]");

    if (option) {
      selectAddress(option.dataset.addressId);
    }

  });


  container.addEventListener("change", (event) => {

    if (event.target.name !== "checkoutAddress") return;

    selectAddress(event.target.value);

  });

}


/*
 * onChange fires whenever the selected address changes (including
 * after the initial load resolves) so the order summary panel can
 * re-validate the Pay Now button.
 */
export function initAddressPanel(onChange) {

  onChangeCallback = onChange || null;


  const container =
    document.getElementById("checkoutAddressSection");

  if (!container) return;


  initSectionControls();

  initModalControls();


  loadAddresses();

}
