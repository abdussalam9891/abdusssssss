/*
 * The backend lets store admins type category/subcategory values
 * freely ("Silver Ring", "silver ring", "Silver-Ring", ...). These
 * helpers exist ONLY to compare/dedupe such values consistently on
 * the frontend — they never touch the original strings that get
 * displayed or sent back to the backend.
 */

// Comparison key only. Not a taxonomy: "Rings" and "Ring" collapse
// to the same key, but so would any other word that merely ends in
// "s" — this is a best-effort dedupe, not a category hierarchy.
export function normalizeForComparison(value) {

  if (value === null || value === undefined) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/([^s])s$/, "$1");
}

// Defensively coerces a field that may arrive as a string, an
// array, null/undefined, or an empty array into a flat string list.
export function toStringList(value) {

  if (Array.isArray(value)) {

    return value.filter(
      (item) =>
        typeof item === "string" &&
        item.trim().length
    );

  }

  if (
    typeof value === "string" &&
    value.trim().length
  ) {
    return [value];
  }

  return [];
}
