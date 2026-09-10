import { createAuthLayout } from "./authLayout.js";
import { createLoginForm } from "./loginForm.js";
import { createRegisterForm } from "./registerForm.js";
import { createForgotPasswordForm } from "./forgotPasswordForm.js";

export function createLoginPage() {
  return createAuthLayout({
    title: "Welcome Back",

    description:
      "Access your account, wishlist and orders.",

    form: createLoginForm(),
  });
}

export function createRegisterPage() {
  return createAuthLayout({
    title: "Create Account",

    form: createRegisterForm(),
  });
}

export function createForgotPasswordPage() {
  return createAuthLayout({
    title: "Forgot Password",

    description:
      "Enter your registered email address and we'll send you a secure password reset link.",

    form: createForgotPasswordForm(),
  });
}
