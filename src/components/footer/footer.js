import { createFooterLinks } from "./footerLinks.js";

import { createCopyright } from "./copyright.js";

export function createFooter() {

  return `
<footer
  id="footer"
  class="
    mt-24
    bg-[#181818]
    text-white
  "
>

  ${createFooterLinks()}

  ${createCopyright()}

</footer>
`;
}
