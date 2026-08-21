export function initFooterNewsletter() {
  const form = document.getElementById("footerNewsletterForm");
  const emailInput = document.getElementById("footerNewsletterEmail");
  const message = document.getElementById("footerNewsletterMessage");

  if (!form || !emailInput || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Placeholder: wire this to your actual email provider
    // (Mailchimp, Klaviyo, a backend endpoint, etc.) before launch.
    // Right now this only validates and shows a confirmation —
    // no email is actually captured or sent anywhere yet.
    message.textContent = `Thanks — we'll send updates to ${emailInput.value}.`;
    message.classList.remove("hidden");

    form.reset();
  });
}
