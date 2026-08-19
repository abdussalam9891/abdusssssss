/*
 * Purely client-side format validation. There is no backend
 * serviceability endpoint to call, so this never claims a real
 * per-pincode delivery estimate — see
 * components/productDetails/deliveryChecker.js.
 */

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


  function check() {

    const pincode =
      input.value.trim();


    if (!PINCODE_PATTERN.test(pincode)) {

      setResult(
        "Please enter a valid 6-digit pincode.",
        "error"
      );

      return;
    }


    setResult(
      `We deliver across India. Delivery timelines to ` +
      `<span class="font-medium text-[#181818]">${pincode}</span> ` +
      `vary by location — enquire below and our team will confirm ` +
      `exact timelines, or see our ` +
      `<a href="/pages/shipping-policy.html" class="underline decoration-[#A07936] underline-offset-4 hover:text-[#A07936]">Shipping Policy</a>.`,
      "success"
    );

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
