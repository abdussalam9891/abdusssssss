import { createPaymentMethods } from "./paymentMethods.js";


let selectedMethod = "online";


export function getSelectedPaymentMethod() {

  return selectedMethod;
}


function renderSection() {

  const container =
    document.getElementById("checkoutPaymentSection");

  if (!container) return;


  container.innerHTML =
    createPaymentMethods(selectedMethod);

  window.lucide?.createIcons();

}


export function initPaymentPanel() {

  const container =
    document.getElementById("checkoutPaymentSection");

  if (!container) return;


  renderSection();


  container.addEventListener("change", (event) => {

    if (event.target.name !== "checkoutPayment") return;

    selectedMethod = event.target.value;

    renderSection();

  });

}
