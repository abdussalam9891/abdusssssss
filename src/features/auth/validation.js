import {
    GOOGLE_CLIENT_ID,
} from "../../config.js";
import { authService } from "../../services/authService.js";
import { showToast } from "../../utils/toast.js";
import { consumeAuthRedirect } from "../../utils/authRedirect.js";

// import { hydrateAuth } from "./authState.js";




export function initLoginValidation() {

  const form =
    document.getElementById("loginForm");

  if (!form) return;


  // ========================================
  // GOOGLE LOGIN
  // ========================================

  const googleLoginBtn =
    document.getElementById("googleLoginBtn");


  if (googleLoginBtn) {

    // ======================================
    // GOOGLE CREDENTIAL CALLBACK
    // ======================================

    const handleGoogleCredential =
      async (response) => {

        const credential =
          response?.credential;


        if (!credential) {

          showToast({
            type: "error",
            title: "Google Login Failed",
            message:
              "Google did not return a valid credential.",
          });

          return;
        }


        googleLoginBtn.disabled = true;


        try {

          showToast({
            type: "info",
            title: "Signing In",
            message:
              "Signing you in with Google...",
          });


          // ==================================
          // SEND GOOGLE ID TOKEN TO BACKEND
          // ==================================

          const result =
            await authService.googleLogin({
              token: credential,
            });


          // ==================================
          // GET YOUR APPLICATION JWT
          // ==================================

          const token =
            result?.data?.token;


          if (!token) {

            throw new Error(
              "Google login succeeded but application token was not received."
            );

          }


          // ==================================
          // SAVE APPLICATION JWT
          // ==================================

          localStorage.setItem(
            "token",
            token
          );


          // ==================================
          // UPDATE AUTH STATE
          // ==================================

          window.dispatchEvent(
            new CustomEvent("authChanged")
          );


          // ==================================
          // SUCCESS
          // ==================================

          showToast({
            type: "success",
            title: "Welcome",
            message:
              "You're successfully signed in with Google.",
          });


          // ==================================
          // REDIRECT
          // ==================================

          // Back to whatever page opened the sign-in modal (e.g.
          // the product they were adding to cart), or the homepage.
          window.location.href =
            consumeAuthRedirect();


        } catch (error) {

          console.error(
            "GOOGLE LOGIN ERROR:",
            error
          );


          showToast({
            type: "error",
            title: "Google Login Failed",
            message:
              error?.message ||
              "Unable to sign in with Google.",
          });


        } finally {

          googleLoginBtn.disabled = false;

        }

      };


    // ======================================
    // INITIALIZE GOOGLE
    // ======================================

    const initializeGoogleLogin =
      () => {

        if (
          !window.google ||
          !window.google.accounts ||
          !window.google.accounts.id
        ) {

          console.error(
            "Google Identity Services is not loaded."
          );

          return false;

        }


        if (!GOOGLE_CLIENT_ID) {

          console.error(
            "GOOGLE_CLIENT_ID is missing."
          );

          return false;

        }


        window.google.accounts.id.initialize({

          client_id:
            GOOGLE_CLIENT_ID,

          callback:
            handleGoogleCredential,

          auto_select: false,

          cancel_on_tap_outside: true,

        });


        return true;

      };


    // ======================================
    // GOOGLE BUTTON
    // ======================================

    googleLoginBtn.addEventListener(
      "click",
      () => {

        // Google script hasn't loaded yet
        if (
          !window.google ||
          !window.google.accounts ||
          !window.google.accounts.id
        ) {

          showToast({
            type: "error",
            title: "Google Unavailable",
            message:
              "Google Sign-In is still loading. Please try again.",
          });

          return;
        }


        // Open Google authentication
        window.google.accounts.id.prompt(
          (notification) => {

            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {

              const reason =
                notification.getNotDisplayedReason?.() ||
                notification.getSkippedReason?.();

              console.error(
                "GOOGLE PROMPT NOT DISPLAYED:",
                reason
              );

              showToast({
                type: "error",
                title: "Google Sign-In Unavailable",
                message:
                  reason === "unregistered_origin"
                    ? "This site isn't authorized for Google Sign-In yet. Add this origin in Google Cloud Console."
                    : "Google Sign-In couldn't start. Please try again.",
              });

            }

          }
        );

      }
    );


    // ======================================
    // GOOGLE SCRIPT LOADING
    // ======================================

    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.id
    ) {

      initializeGoogleLogin();

    } else {

      window.addEventListener(
        "load",
        initializeGoogleLogin,
        { once: true }
      );

    }

  }


  // ========================================
  // NORMAL EMAIL/PASSWORD LOGIN
  // ========================================

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const email =
        form.email.value.trim();

      const password =
        form.password.value;


      // ======================================
      // VALIDATION
      // ======================================

      if (!email || !password) {

        showToast({
          type: "error",
          title: "Missing Information",
          message:
            "Please fill all fields.",
        });

        return;

      }


      const submitBtn =
        form.querySelector(
          '[type="submit"]'
        );


      submitBtn?.setAttribute(
        "disabled",
        "true"
      );


      try {

        // ====================================
        // LOGIN API
        // ====================================

        const response =
          await authService.login({
            email,
            password,
          });


        // ====================================
        // GET JWT
        // ====================================

        const token =
          response?.data?.token;


        if (!token) {

          throw new Error(
            "Login successful but token was not received."
          );

        }


        // ====================================
        // SAVE JWT
        // ====================================

        localStorage.setItem(
          "token",
          token
        );


        // ====================================
        // UPDATE AUTH STATE
        // ====================================

        window.dispatchEvent(
          new CustomEvent("authChanged")
        );


        // ====================================
        // SUCCESS
        // ====================================

        showToast({
          type: "success",
          title: "Welcome back",
          message:
            "You're logged in.",
        });


        // ====================================
        // REDIRECT
        // ====================================

        // Back to whatever page opened the sign-in modal (e.g. the
        // product they were adding to cart), or the homepage.
        window.location.href =
          consumeAuthRedirect();


      } catch (error) {

        console.error(
          "LOGIN ERROR:",
          error
        );


        showToast({
          type: "error",
          title: "Login Failed",
          message:
            error?.message ||
            "Something went wrong.",
        });


      } finally {

        submitBtn?.removeAttribute(
          "disabled"
        );

      }

    }
  );

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
        message: "Welcome to banshiwale.",
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
  const form = document.getElementById("forgotPasswordForm");

  if (!form) return;

  const emailStep = document.getElementById("emailStep");
  const otpStep = document.getElementById("otpStep");

  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");
  const newPasswordInput =
    document.getElementById("newPassword");
  const confirmPasswordInput =
    document.getElementById("confirmPassword");

  const submitBtn =
    document.getElementById("forgotPasswordSubmitBtn");

  const submitText =
    document.getElementById("forgotPasswordSubmitText");

  if (
    !emailStep ||
    !otpStep ||
    !emailInput ||
    !otpInput ||
    !newPasswordInput ||
    !confirmPasswordInput ||
    !submitBtn ||
    !submitText
  ) {
    console.error(
      "Forgot password form elements are missing."
    );

    return;
  }

  let otpSent = false;

  // ========================================
  // OTP — digits only
  // ========================================

  otpInput.addEventListener("input", () => {
    otpInput.value = otpInput.value
      .replace(/\D/g, "")
      .slice(0, 6);
  });

  // ========================================
  // Submit
  // ========================================

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // ========================================
    // STEP 1 — SEND OTP
    // ========================================

    if (!otpSent) {
      const email = emailInput.value.trim();

      if (!email) {
        showToast({
          type: "warning",
          title: "Email Required",
          message:
            "Please enter your email address.",
        });

        emailInput.focus();

        return;
      }

      submitBtn.disabled = true;

      try {
        await authService.sendResetOTP(email);

        showToast({
          type: "success",
          title: "OTP Sent",
          message:
            "We've sent a verification code to your email.",
        });

        otpSent = true;

        emailStep.classList.add("hidden");
        otpStep.classList.remove("hidden");

        submitText.textContent = "Reset Password";

        otpInput.focus();

      } catch (error) {
        console.error(
          "SEND RESET OTP ERROR:",
          error
        );

        showToast({
          type: "error",
          title: "Request Failed",
          message:
            error.message ||
            "Unable to send verification code.",
        });

      } finally {
        submitBtn.disabled = false;
      }

      return;
    }

    // ========================================
    // STEP 2 — VERIFY OTP + RESET PASSWORD
    // ========================================

    const email = emailInput.value.trim();
    const otp = otpInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword =
      confirmPasswordInput.value;

    // OTP validation
    if (!otp || otp.length !== 6) {
      showToast({
        type: "warning",
        title: "Invalid OTP",
        message:
          "Please enter the 6-digit verification code.",
      });

      otpInput.focus();

      return;
    }

    // Password validation
    if (!newPassword || !confirmPassword) {
      showToast({
        type: "warning",
        title: "Password Required",
        message:
          "Please enter and confirm your new password.",
      });

      return;
    }

    if (newPassword.length < 6) {
      showToast({
        type: "warning",
        title: "Weak Password",
        message:
          "Password must be at least 6 characters long.",
      });

      newPasswordInput.focus();

      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        title: "Password Mismatch",
        message:
          "New password and confirm password do not match.",
      });

      confirmPasswordInput.focus();

      return;
    }

    submitBtn.disabled = true;

    try {
      await authService.verifyOTPAndResetPassword({
        email,
        otp,
        newPassword,
      });

      showToast({
        type: "success",
        title: "Password Reset",
        message:
          "Your password has been reset successfully.",
      });

      setTimeout(() => {
        window.location.href =
          "/pages/login.html";
      }, 1000);

    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      showToast({
        type: "error",
        title: "Reset Failed",
        message:
          error.message ||
          "Invalid OTP or unable to reset password.",
      });

    } finally {
      submitBtn.disabled = false;
    }
  });
}
