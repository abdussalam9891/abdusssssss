import { createAuthLayout } from "./authLayout.js";
import { createLoginForm } from "./loginForm.js";

export function createLoginPage() {
  return createAuthLayout({
    title: "Welcome Back",

    eyebrow: "Sign In",

    description:
      "Access your account, wishlist and orders.",

    form: createLoginForm(),
  });
}
