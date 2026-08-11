import { showToast } from "../../utils/toast.js";
import { authService } from "../../services/authService.js";

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
    return;
  }

  let otpSent = false;

  // ========================================
  // OTP input sanitization
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
          message: "Please enter your email address.",
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

        // Switch to OTP step
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

    // ----------------------------------------
    // OTP validation
    // ----------------------------------------

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

    // ----------------------------------------
    // Password validation
    // ----------------------------------------

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

    // ----------------------------------------
    // Submit reset request
    // ----------------------------------------

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

      // Give toast a moment before navigation
      setTimeout(() => {
        window.location.href = "/pages/login.html";
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
