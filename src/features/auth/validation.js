import { showToast } from "../../utils/toast.js";
import { authService } from "../../services/authService.js";
// import { hydrateAuth } from "./authState.js";


// ========================================
// Login validation
// ========================================

export function initLoginValidation() {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      showToast({
        type: "error",
        title: "Missing Information",
        message: "Please fill all fields.",
      });

      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');

    submitBtn?.setAttribute("disabled", "true");

   try {
  const response = await authService.login({
  email,
  password,
});

console.log("LOGIN RESPONSE:", response);

const token = response?.data?.token;

if (!token) {
  throw new Error("Login successful but token was not received.");
}

localStorage.setItem("token", token);

window.dispatchEvent(
  new CustomEvent("authChanged")
);

  showToast({
    type: "success",
    title: "Welcome back",
    message: "You're logged in.",
  });

  window.location.href = "/index.html";

} catch (error) {
  showToast({
    type: "error",
    title: "Login Failed",
    message: error.message || "Something went wrong.",
  });

} finally {
  submitBtn?.removeAttribute("disabled");
}

});
}


// ========================================
// Register input sanitization
// ========================================

function initRegisterInputValidation(form) {
  const firstNameInput = form.firstName;
  const lastNameInput = form.lastName;
  const mobileInput = form.mobileNumber;


  // Names:
  // Allow letters, spaces, hyphens and apostrophes
  const sanitizeName = (value) => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
  };


  // Mobile:
  // Digits only + maximum 10 digits
  const sanitizeMobile = (value) => {
    return value.replace(/\D/g, "").slice(0, 10);
  };


  firstNameInput.addEventListener("input", () => {
    firstNameInput.value = sanitizeName(
      firstNameInput.value
    );
  });


  lastNameInput.addEventListener("input", () => {
    lastNameInput.value = sanitizeName(
      lastNameInput.value
    );
  });


  mobileInput.addEventListener("input", () => {
    mobileInput.value = sanitizeMobile(
      mobileInput.value
    );
  });
}


// ========================================
// Register validation
// ========================================

export function initRegisterValidation() {
  const form = document.getElementById("registerForm");

  if (!form) return;


  // Initialize live input validation
  initRegisterInputValidation(form);


  form.addEventListener("submit", async (event) => {
    event.preventDefault();


    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const mobileNumber = form.mobileNumber.value.trim();

    // Don't trim passwords
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const agreeToTerms = form.agreeToTerms.checked;


    // ========================================
    // Required fields
    // ========================================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobileNumber ||
      !password ||
      !confirmPassword
    ) {
      showToast({
        type: "error",
        title: "Missing Information",
        message: "Please fill all fields.",
      });

      return;
    }


    // ========================================
    // Name validation
    // ========================================

    const nameRegex =
      /^[a-zA-ZÀ-ÿ]+(?:[\s'-][a-zA-ZÀ-ÿ]+)*$/;


    if (!nameRegex.test(firstName)) {
      showToast({
        type: "error",
        title: "Invalid First Name",
        message:
          "First name can contain letters, spaces, hyphens and apostrophes only.",
      });

      form.firstName.focus();

      return;
    }


    if (!nameRegex.test(lastName)) {
      showToast({
        type: "error",
        title: "Invalid Last Name",
        message:
          "Last name can contain letters, spaces, hyphens and apostrophes only.",
      });

      form.lastName.focus();

      return;
    }


    // ========================================
    // Mobile validation
    // ========================================

    const mobileRegex = /^[6-9]\d{9}$/;


    if (!mobileRegex.test(mobileNumber)) {
      showToast({
        type: "error",
        title: "Invalid Mobile Number",
        message:
          "Please enter a valid 10-digit Indian mobile number.",
      });

      form.mobileNumber.focus();

      return;
    }


    // ========================================
    // Password validation
    // ========================================

    if (password !== confirmPassword) {
      showToast({
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match.",
      });

      form.confirmPassword.focus();

      return;
    }


    // ========================================
    // Terms validation
    // ========================================

    if (!agreeToTerms) {
      showToast({
        type: "warning",
        title: "Terms Required",
        message:
          "Please agree to the Terms & Privacy Policy.",
      });

      return;
    }


    // ========================================
    // Submit
    // ========================================

    const submitBtn =
      form.querySelector('[type="submit"]');

    submitBtn?.setAttribute("disabled", "true");


    try {
      await authService.register({
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        confirmPassword,
        agreeToTerms,
      });


      // await hydrateAuth();


      showToast({
        type: "success",
        title: "Account Created",
        message: "Welcome to Banshiwala.",
      });


      window.location.href = "/index.html";

    } catch (error) {
  console.error("LOGIN ERROR:", error);
  console.error("STACK:", error.stack);

  showToast({
    type: "error",
    title: "Login Failed",
    message: error.message || "Something went wrong.",
  });
} finally {
      submitBtn?.removeAttribute("disabled");
    }
  });
}


// ========================================
// Forgot password validation
// ========================================

export function initForgotPasswordValidation() {
  const form = document.getElementById(
    "forgotPasswordForm"
  );

  if (!form) return;


  form.addEventListener("submit", async (event) => {
    event.preventDefault();


    const email = form.email.value.trim();


    if (!email) {
      showToast({
        type: "warning",
        title: "Email Required",
        message: "Please enter your email address.",
      });

      return;
    }


    const submitBtn =
      form.querySelector('[type="submit"]');

    submitBtn?.setAttribute("disabled", "true");


    try {
      await authService.sendResetOTP(email);


      showToast({
        type: "success",
        title: "OTP Sent",
        message: "Check your email for the reset code.",
      });

    } catch (error) {
      showToast({
        type: "error",
        title: "Request Failed",
        message:
          error.message || "Something went wrong.",
      });

    } finally {
      submitBtn?.removeAttribute("disabled");
    }
  });
}
