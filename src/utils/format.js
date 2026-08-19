export function formatPrice(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) return "";


  return `₹${number.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}


// Backend/user-entered strings are rendered through innerHTML
// templates, so escape them here rather than trusting input.
export function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
