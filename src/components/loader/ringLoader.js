/*
 * Branded loading indicator: a silver signet ring turning on its
 * axis, with a light glint sweeping the band and a soft shadow that
 * narrows as the ring turns edge-on. Replaces the plain border
 * spinners on views that wait on the backend (product details,
 * orders, search, quick add). Same ring as the 404 page's "0".
 *
 * Styles live in src/css/main.css (".ring-loader") since this can
 * appear on any page via the search overlay. It fades in only after
 * a short delay, so fast responses never flash it, and stands still
 * under prefers-reduced-motion.
 *
 * The caller owns the role="status" / aria-live wrapper, as with the
 * spinners this replaced — this only renders the visual + message.
 */

// Gradient/mask ids must be unique per instance: if two loaders share
// ids and the first sits inside a display:none container (e.g. a
// hidden loading state), Chrome fails to paint the second one's fills.
let instanceCount = 0;


export function createRingLoader({
  message = "",
  size = "md",
  className = "",
} = {}) {

  const id = `ringLoader${++instanceCount}`;

  const messageHTML = message
    ? `
  <p class="ring-loader__text">
    ${message}<span class="ring-loader__dots" aria-hidden="true">...</span>
  </p>`
    : `<span class="sr-only">Loading</span>`;

  return `
<div class="ring-loader ring-loader--${size} ${className}">

  <div class="ring-loader__stage" aria-hidden="true">

    <svg
      class="ring-loader__ring"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="${id}Silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FDFDFD" />
          <stop offset="0.35" stop-color="#C4C4C4" />
          <stop offset="0.55" stop-color="#EDEDED" />
          <stop offset="0.8" stop-color="#9A9A9A" />
          <stop offset="1" stop-color="#D6D6D6" />
        </linearGradient>

        <linearGradient id="${id}Gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#E9CF8F" />
          <stop offset="0.5" stop-color="#C9A45C" />
          <stop offset="1" stop-color="#A07936" />
        </linearGradient>

        <linearGradient id="${id}Glint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.95" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
        </linearGradient>

        <mask id="${id}Mask">
          <circle cx="100" cy="122" r="58" fill="none" stroke="#fff" stroke-width="15" />
          <rect x="66" y="28" width="68" height="40" rx="11" fill="#fff" />
        </mask>
      </defs>

      <circle cx="100" cy="122" r="58" fill="none" stroke="url(#${id}Silver)" stroke-width="15" />
      <circle cx="100" cy="122" r="65.5" fill="none" stroke="#8A8A8A" stroke-opacity="0.45" stroke-width="1" />
      <circle cx="100" cy="122" r="50.5" fill="none" stroke="#8A8A8A" stroke-opacity="0.35" stroke-width="1" />

      <path d="M72 64 Q64 76 58 84" fill="none" stroke="url(#${id}Silver)" stroke-width="10" stroke-linecap="round" />
      <path d="M128 64 Q136 76 142 84" fill="none" stroke="url(#${id}Silver)" stroke-width="10" stroke-linecap="round" />

      <rect x="66" y="28" width="68" height="40" rx="11" fill="url(#${id}Silver)" stroke="#8A8A8A" stroke-opacity="0.6" stroke-width="1" />
      <rect x="75" y="36" width="50" height="24" rx="7" fill="url(#${id}Gold)" />

      <g mask="url(#${id}Mask)">
        <g transform="rotate(18 100 110)">
          <rect class="ring-loader__glint" x="40" y="-10" width="28" height="240" fill="url(#${id}Glint)" />
        </g>
      </g>
    </svg>

    <span class="ring-loader__shadow"></span>

  </div>
  ${messageHTML}
</div>
`;
}
