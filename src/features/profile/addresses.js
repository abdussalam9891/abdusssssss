import { addressService } from "../../services/addressService.js";
import { showToast } from "../../utils/toast.js";
import { createAddressesPanel } from "../../components/profile/addressesPanel.js";
import { createAddressCard } from "../../components/profile/addressCard.js";


const NAME_REGEX =
  /^[a-zA-ZÀ-ÿ]+(?:[\s'-][a-zA-ZÀ-ÿ]+)*$/;

const PHONE_REGEX =
  /^[6-9]\d{9}$/;

const PINCODE_REGEX =
  /^[1-9][0-9]{5}$/;


let cachedAddresses = [];

// The address form modal (components/profile/addressFormModal.js)
// is rendered once as static page markup (see
// components/profile/profileLayout.js) and never rebuilt, so its
// listeners must only ever be bound once — unlike the address list
// itself, which is safe to fully replace/rebind on every load.
let modalControlsBound = false;


function getModalElements() {

  return {
    modal: document.getElementById("addressFormModal"),
    panel: document.getElementById("addressFormModalPanel"),
    form: document.getElementById("addressForm"),
    title: document.getElementById("addressFormModalTitle"),
    idInput: document.getElementById("addressFormId"),
    errorMessage: document.getElementById("addressFormError"),
    submitButton: document.getElementById("submitAddressFormButton"),
    submitText: document.getElementById("submitAddressFormButtonText"),
  };
}


function openModal(address = null) {

  const {
    modal,
    panel,
    form,
    title,
    idInput,
    errorMessage,
  } = getModalElements();

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

    form.city.value =
      address.city || "";

    form.state.value =
      address.state || "";

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

    panel.classList.remove(
      "opacity-0",
      "scale-95"
    );

  });

  document.documentElement.classList.add(
    "overflow-hidden"
  );

}


function closeModal() {

  const { modal, panel } =
    getModalElements();

  if (!modal || !panel) return;


  panel.classList.add(
    "opacity-0",
    "scale-95"
  );

  document.documentElement.classList.remove(
    "overflow-hidden"
  );

  setTimeout(() => {

    modal.classList.remove("flex");
    modal.classList.add("hidden");

  }, 300);

}


function renderList() {

  const list =
    document.getElementById("profileAddressList");

  const emptyState =
    document.getElementById("profileAddressEmptyState");

  if (!list) return;


  if (!cachedAddresses.length) {

    list.innerHTML = "";

    emptyState?.classList.remove("hidden");

    return;
  }


  emptyState?.classList.add("hidden");

  list.innerHTML =
    cachedAddresses
      .map((address) => createAddressCard(address))
      .join("");

  window.lucide?.createIcons();

}


export async function loadAddresses() {

  const list =
    document.getElementById("profileAddressList");

  const emptyState =
    document.getElementById("profileAddressEmptyState");

  const errorState =
    document.getElementById("profileAddressErrorState");

  if (!list) return;


  errorState?.classList.add("hidden");


  try {

    cachedAddresses =
      await addressService.getAddresses();

    renderList();


  } catch (error) {

    console.error(
      "[Profile] Failed to load addresses:",
      error
    );

    cachedAddresses = [];

    list.innerHTML = "";

    emptyState?.classList.add("hidden");

    errorState?.classList.remove("hidden");

  }

}


function validateAddressForm(form) {

  const fullName =
    form.fullName.value.trim();

  const mobile =
    form.mobile.value.trim();

  const address =
    form.address.value.trim();

  const city =
    form.city.value.trim();

  const state =
    form.state.value.trim();

  const pincode =
    form.pincode.value.trim();


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
      phoneInput.value
        .replace(/\D/g, "")
        .slice(0, 10);

  });


  pincodeInput?.addEventListener("input", () => {

    pincodeInput.value =
      pincodeInput.value
        .replace(/\D/g, "")
        .slice(0, 6);

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

        errorMessage.textContent =
          validationError;

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

    const addressId =
      form.addressId.value;


    submitButton.disabled = true;

    submitText.textContent =
      addressId ? "Saving..." : "Adding...";


    try {

      if (addressId) {

        await addressService.updateAddress(
          addressId,
          payload
        );

        showToast({
          type: "success",
          title: "Address Updated",
          message: "Your address has been updated.",
        });

      } else {

        await addressService.addAddress(payload);

        showToast({
          type: "success",
          title: "Address Added",
          message: "Your new address has been saved.",
        });

      }


      closeModal();

      await loadAddresses();


    } catch (error) {

      console.error(
        "[Profile] Failed to save address:",
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

      submitText.textContent =
        "Save Address";

    }

  });

}


function initListControls() {

  const addButton =
    document.getElementById("profileAddAddressButton");

  addButton?.addEventListener(
    "click",
    () => openModal()
  );


  const list =
    document.getElementById("profileAddressList");

  list?.addEventListener("click", async (event) => {

    const editButton =
      event.target.closest("[data-address-edit]");

    if (editButton) {

      const id =
        editButton.dataset.addressId;

      const address =
        cachedAddresses.find(
          (item) =>
            (item._id || item.id) === id
        );

      if (address) openModal(address);

      return;
    }


    const deleteButton =
      event.target.closest("[data-address-delete]");

    if (!deleteButton) return;


    const id =
      deleteButton.dataset.addressId;

    if (!id) return;


    deleteButton.disabled = true;


    try {

      await addressService.deleteAddress(id);

      showToast({
        type: "success",
        title: "Address Removed",
        message: "The address has been deleted.",
      });

      await loadAddresses();


    } catch (error) {

      console.error(
        "[Profile] Failed to delete address:",
        error
      );

      showToast({
        type: "error",
        title: "Delete Failed",
        message:
          error?.message ||
          "Could not delete this address.",
      });

      deleteButton.disabled = false;

    }

  });

}


/*
 * Rebuilds the panel shell (Add button + list container + empty/
 * error states) from scratch every call, so initListControls()
 * safely rebinds to fresh nodes each time — mirrors
 * features/profile/profileInfo.js. initModalControls() is guarded
 * separately since the modal itself is static, page-level markup.
 */
export function initProfileAddresses() {

  const panel =
    document.getElementById("profileAddressesPanel");

  if (!panel) return;


  panel.innerHTML =
    createAddressesPanel();


  initListControls();

  initModalControls();


  window.lucide?.createIcons();


  loadAddresses();

}
