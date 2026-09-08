import { postalCodeService } from "../../services/postalCodeService.js";
import { escapeHtml } from "./model.js";

const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;


export function initDeliveryChecker() {

  const input =
    document.getElementById("productPincodeInput");

  const button =
    document.getElementById("productPincodeCheck");

  const result =
    document.getElementById("productPincodeResult");

  if (!input || !button || !result) return;


  function setResult(message, tone) {

    result.innerHTML = message;

    result.classList.remove(
      "text-[#777]",
      "text-[#B3261E]",
      "text-[#2F6B3A]"
    );

    result.classList.add(
      tone === "error"
        ? "text-[#B3261E]"
        : tone === "success"
        ? "text-[#2F6B3A]"
        : "text-[#777]"
    );

  }


  async function check() {

    const pincode =
      input.value.trim();


    if (!PINCODE_PATTERN.test(pincode)) {

      setResult(
        "Please enter a valid 6-digit pincode.",
        "error"
      );

      return;
    }


    setResult("Checking delivery availability&hellip;", "muted");

    button.disabled = true;


    try {

      const result =
        await postalCodeService.check(pincode);


      if (!result || !result.deliverable) {

        setResult(
          `This product is not deliverable to ` +
          `<span class="font-medium text-[#181818]">${escapeHtml(pincode)}</span>.`,
          "error"
        );

        return;
      }


      const { postOffice } = result;

      const location =
        [postOffice.Name, postOffice.District, postOffice.State]
          .filter(Boolean)
          .join(", ");


      setResult(
        (location
          ? `<span class="block font-medium text-[#181818]">Delivering to ${escapeHtml(location)}</span>`
          : "") +
        `<span class="block${location ? " mt-1" : ""}">Delivery available for ` +
        `<span class="font-medium text-[#181818]">${escapeHtml(pincode)}</span></span>`,
        "success"
      );

    } catch (error) {

      // Network failure, timeout, or the backend erroring on this
      // pincode all resolve to the same honest "can't deliver
      // here" message rather than crashing the checker.
      setResult(
        `This product is not deliverable to ` +
        `<span class="font-medium text-[#181818]">${escapeHtml(pincode)}</span>.`,
        "error"
      );

    } finally {

      button.disabled = false;

    }

  }


  input.addEventListener("input", () => {

    input.value =
      input.value.replace(/\D/g, "").slice(0, 6);

  });


  input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      check();

    }

  });


  button.addEventListener("click", check);

}
