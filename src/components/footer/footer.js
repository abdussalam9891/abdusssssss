import { websiteService } from "../../services/websiteService.js";
import { createFooterLinks } from "./footerLinks.js";

import { createCopyright } from "./copyright.js";

export async function createFooter() {

  const socialLinks =
    await websiteService.getSocialLinks();

  return `
<footer
  id="footer"
  class="
    mt-24
    py-8
    bg-[#181818]
    text-white
  "
>

  ${createFooterLinks(socialLinks)}

  ${createCopyright()}

</footer>
`;
}
