const slides = [
  {
    title: "Crafted for Every Celebration",
    description:
      "Join banshiwale to save your wishlist, track your orders, and enjoy a seamless shopping experience.",
  },
  {
    title: "Timeless Elegance",
    description:
      "Discover handcrafted jewellery that celebrates life's special moments with unmatched craftsmanship.",
  },
  {
    title: "Luxury You Can Trust",
    description:
      "Hallmarked gold, certified diamonds, secure payments, and exceptional customer support.",
  },
];

let sliderInterval = null;

export function initAuthTextSlider() {
  const heading = document.getElementById("authHeading");
  const description = document.getElementById("authDescription");

  if (!heading || !description) return;

  if (sliderInterval) {
    clearInterval(sliderInterval);
  }

  let index = 0;

  sliderInterval = setInterval(() => {
    index = (index + 1) % slides.length;

    heading.classList.remove("auth-text-animation");
    description.classList.remove("auth-text-animation");

    // Restart animation
    void heading.offsetWidth;
    void description.offsetWidth;

    heading.textContent = slides[index].title;
    description.textContent = slides[index].description;

    heading.classList.add("auth-text-animation");
    description.classList.add("auth-text-animation");
  }, 5000);
}
