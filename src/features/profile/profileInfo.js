import { authService } from "../../services/authService.js";
import { getCurrentUser, hydrateAuth } from "../auth/authState.js";
import { showToast } from "../../utils/toast.js";
import { createProfileInfoForm } from "../../components/profile/profileInfoForm.js";


const NAME_REGEX =
  /^[a-zA-ZÀ-ÿ]+(?:[\s'-][a-zA-ZÀ-ÿ]+)*$/;

const MOBILE_REGEX =
  /^[6-9]\d{9}$/;


/*
 * The panel's innerHTML (and therefore the <form> element itself)
 * is rebuilt from scratch on every call — the submit listener
 * below is bound to that fresh node each time, so there's nothing
 * stale left listening on the previous, now-discarded form.
 */
export function initProfileInfo() {

  const panel =
    document.getElementById("profileInfoPanel");

  if (!panel) return;


  const user =
    getCurrentUser();

  panel.innerHTML =
    createProfileInfoForm(user || {});


  const form =
    document.getElementById("profileInfoForm");

  if (!form) return;


  const submitButton =
    document.getElementById("profileInfoSubmitButton");

  const submitText =
    document.getElementById("profileInfoSubmitText");


  form.mobileNumber.addEventListener("input", () => {

    form.mobileNumber.value =
      form.mobileNumber.value
        .replace(/\D/g, "")
        .slice(0, 10);

  });


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const firstName =
      form.firstName.value.trim();

    const lastName =
      form.lastName.value.trim();

    const mobileNumber =
      form.mobileNumber.value.trim();

    const dob =
      form.dob.value;


    if (!firstName || !NAME_REGEX.test(firstName)) {

      showToast({
        type: "warning",
        title: "Invalid First Name",
        message: "Please enter a valid first name.",
      });

      form.firstName.focus();

      return;
    }


    if (!lastName || !NAME_REGEX.test(lastName)) {

      showToast({
        type: "warning",
        title: "Invalid Last Name",
        message: "Please enter a valid last name.",
      });

      form.lastName.focus();

      return;
    }


    if (!MOBILE_REGEX.test(mobileNumber)) {

      showToast({
        type: "warning",
        title: "Invalid Mobile Number",
        message:
          "Please enter a valid 10-digit Indian mobile number.",
      });

      form.mobileNumber.focus();

      return;
    }


    if (dob && new Date(dob) > new Date()) {

      showToast({
        type: "warning",
        title: "Invalid Date of Birth",
        message: "Date of birth can't be in the future.",
      });

      form.dob.focus();

      return;
    }


    const currentUser =
      getCurrentUser();

    const userId =
      currentUser?._id || currentUser?.id;

    if (!userId) {

      showToast({
        type: "error",
        title: "Update Failed",
        message:
          "Could not determine your account. Please sign in again.",
      });

      return;
    }


    submitButton.disabled = true;

    submitText.textContent =
      "Saving...";


    try {

      await authService.updateProfile(userId, {
        firstName,
        lastName,
        mobileNumber,
        dob: dob || null,
      });


      // Refreshes the shared in-memory user (dispatches
      // authChanged), so the sidebar/navbar/overview greeting all
      // pick up the new name without a page reload.
      await hydrateAuth();


      showToast({
        type: "success",
        title: "Profile Updated",
        message: "Your details have been saved.",
      });


    } catch (error) {

      console.error(
        "[Profile] Failed to update profile:",
        error
      );

      showToast({
        type: "error",
        title: "Update Failed",
        message:
          error?.message ||
          "Something went wrong. Please try again.",
      });


    } finally {

      submitButton.disabled = false;

      submitText.textContent =
        "Save Changes";

    }

  });

}
