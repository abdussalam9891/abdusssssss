import { createAuthLayout } from "./authLayout.js";
import { createForgotPasswordForm } from "./forgotPasswordForm.js";

export function createForgotPasswordPage() {
  return createAuthLayout({
    title: "Forgot Password",

    description:
      "Enter your registered email address and we'll send you a secure password reset link.",

    form: createForgotPasswordForm(),
  });
}
