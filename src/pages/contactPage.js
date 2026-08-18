import { initContact } from "../features/contact/contact.js";

export function initContactPage() {

  // If this page doesn't contain the contact section,
  // do nothing.
  const section =
    document.getElementById("contact-form");

  if (!section) return;


  /*
   * initContact renders the static contact section
   * synchronously and hydrates backend contact details in the
   * background, so the page never waits on a request.
   */

  try {

    initContact();

  } catch (error) {

    console.error(
      "[Contact] Failed to initialize the contact form:",
      error
    );

  }

}
