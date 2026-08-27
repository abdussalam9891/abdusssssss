import { createAuthLayout } from "./authLayout.js";
import { createRegisterForm } from "./registerForm.js";

export function createRegisterPage() {
  return createAuthLayout({
    title: "Create Account",

    eyebrow: "Join Us",

    description:
      "Join banshiwale and start shopping.",

    form: createRegisterForm(),
  });
}
