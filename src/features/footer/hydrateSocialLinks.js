import { websiteService } from "../../services/websiteService.js";
import { createSocialIcons } from "./footerLinks.js";

export async function hydrateFooterSocialLinks() {

  const container =
    document.getElementById("footerSocialLinks");

  if (!container) return;

  try {

    const socialLinks =
      await websiteService.getSocialLinks();

    container.innerHTML =
      createSocialIcons(socialLinks);

  } catch (error) {

    console.error(
      "[Footer] Failed to load social links:",
      error
    );

    // Keep the existing fallback ("#") links already rendered.

  }

}
