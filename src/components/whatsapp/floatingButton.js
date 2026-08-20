export function createFloatingWhatsAppButton(
  href,
  isWhatsApp = true
) {
  return `
<a
  id="whatsappFloatingButton"

  href="${href}"
  ${
    isWhatsApp
      ? `target="_blank" rel="noopener noreferrer"`
      : ""
  }

  aria-label="Chat with us on WhatsApp"
  title="Chat with us on WhatsApp"

  class="
    group

    fixed
    bottom-20
    right-5

    lg:bottom-6

    z-[85]

    flex
    h-14
    w-14

    items-center
    justify-center

    rounded-full

    bg-[#25D366]

    text-white

    shadow-[0_10px_30px_rgba(37,211,102,0.4)]

    transition-all
    duration-300

    hover:scale-110
    hover:shadow-[0_14px_38px_rgba(37,211,102,0.55)]

    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#25D366]
  "
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
    class="h-7 w-7"
  >
    <path d="M16 3C8.83 3 3 8.72 3 15.78c0 2.54.74 4.99 2.14 7.11L3.5 29l6.32-1.61A13.1 13.1 0 0 0 16 28.56c7.17 0 13-5.72 13-12.78S23.17 3 16 3Zm0 23.12a10.9 10.9 0 0 1-5.57-1.53l-.4-.24-3.75.95 1-3.63-.26-.42a10.53 10.53 0 0 1-1.63-5.47C5.39 10.1 10.06 5.5 16 5.5s10.61 4.6 10.61 10.28S21.94 26.12 16 26.12Zm5.88-7.74c-.32-.16-1.9-.93-2.2-1.04-.29-.1-.5-.16-.71.16s-.82 1.03-1 1.24c-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.56-.94-.83-1.57-1.86-1.76-2.18-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.32-.26-.61-.53-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.11 1.08-1.11 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.35 5.38 4.69.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.54.27-.76.27-1.41.19-1.54-.08-.13-.29-.21-.61-.37Z"/>
  </svg>

</a>
`;
}
