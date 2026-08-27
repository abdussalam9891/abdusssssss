






// export function initRevealAnimations() {
//   const reveals = document.querySelectorAll(".reveal");

//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (!entry.isIntersecting) return;

//         entry.target.classList.add("active");
//         observer.unobserve(entry.target);
//       });
//     },
//     {
//       threshold: 0.15,
//       rootMargin: "0px 0px -60px 0px",
//     }
//   );

//   const parentMap = new Map();

//   reveals.forEach((item) => {
//     const parent = item.parentElement;

//     const delay = parentMap.get(parent) || 0;
//     item.style.transitionDelay = `${delay}ms`;

//     parentMap.set(parent, delay + 120);

//     observer.observe(item);
//   });
// }






let observer;

export function initRevealAnimations() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );
  }

  const reveals = document.querySelectorAll(".reveal:not(.active)");

  const parentMap = new Map();

  reveals.forEach((item) => {
    const parent = item.parentElement;

    const delay = parentMap.get(parent) || 0;

    item.style.transitionDelay = `${delay}ms`;

    parentMap.set(parent, delay + 120);

    observer.observe(item);
  });
}
