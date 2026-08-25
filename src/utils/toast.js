let activeToasts = 0;

const ICONS = {
  success: "check-circle-2",
  error: "circle-x",
  warning: "triangle-alert",
  info: "info",
};

// Brand palette instead of Tailwind's stock green/red/yellow — every
// tone here is already used elsewhere on this site (gold accents,
// the wishlist-remove/error red, the discount-badge gold tint), so
// a toast reads as part of the jewellery site rather than a generic
// alert dropped on top of it.
const THEME = {
  success: {
    iconBg: "bg-[#FBF4E7]",
    iconText: "text-[#A07936]",
    bar: "bg-[#A07936]",
  },
  error: {
    iconBg: "bg-[#FBEAEA]",
    iconText: "text-[#B3261E]",
    bar: "bg-[#B3261E]",
  },
  warning: {
    iconBg: "bg-[#FBF4E7]",
    iconText: "text-[#946E1F]",
    bar: "bg-[#946E1F]",
  },
  info: {
    iconBg: "bg-[#F3F1EC]",
    iconText: "text-[#181818]",
    bar: "bg-[#181818]",
  },
};

export function showToast({
  type = "info",
  title = "",
  message = "",
  duration = 4000,
}) {
  const container =
    document.getElementById("toastContainer");

  if (!container) return;

  const theme =
    THEME[type] || THEME.info;

  const toast = document.createElement("div");

  toast.className = `
pointer-events-auto

w-[360px]
max-w-[calc(100vw-2rem)]

overflow-hidden

rounded-2xl

border
border-[#ECE5D8]

bg-white

shadow-[0_25px_70px_rgba(0,0,0,.15)]

opacity-0
translate-x-8

transition-all
duration-500
`;

  toast.style.transitionDelay =
    `${activeToasts * 40}ms`;

  toast.innerHTML = `

<div
class="
relative

flex

items-start

gap-4

p-5
"
>

<div
class="
flex

h-11
w-11

shrink-0

items-center
justify-center

rounded-full

${theme.iconBg}
${theme.iconText}
"
>

<i
data-lucide="${ICONS[type]}"
class="h-5 w-5"
></i>

</div>

<div class="flex-1">

<h4
class="
font-medium
text-[#181818]
"
>
${title}
</h4>

<p
class="
mt-1

text-sm
leading-6

text-[#666]
"
>
${message}
</p>

</div>

<button

class="
toastClose

text-[#B0AA9D]

transition
duration-300

hover:text-[#181818]
"
>

<i
data-lucide="x"
class="h-4 w-4"
></i>

</button>

</div>

<div
class="
toastProgress

h-[3px]

origin-left

${theme.bar}
"
></div>

`;

  container.appendChild(toast);

  activeToasts++;

  window.lucide?.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove(
      "opacity-0",
      "translate-x-8"
    );
  });

  const progress =
    toast.querySelector(".toastProgress");

  progress.animate(
    [
      { transform: "scaleX(1)" },
      { transform: "scaleX(0)" },
    ],
    {
      duration,
      easing: "linear",
      fill: "forwards",
    }
  );




  let startX = 0;

toast.addEventListener(
  "touchstart",
  (e) => {
    startX =
      e.touches[0].clientX;
  }
);

toast.addEventListener(
  "touchmove",
  (e) => {

    const delta =
      e.touches[0].clientX -
      startX;

    toast.style.transform =
      `translateX(${delta}px)`;

  }
);

toast.addEventListener(
  "touchend",
  (e) => {

    const delta =
      e.changedTouches[0].clientX -
      startX;

    if (Math.abs(delta) > 100) {
      removeToast();
    } else {
      toast.style.transform = "";
    }

  }
);



  const removeToast = () => {
    toast.classList.add(
      "opacity-0",
      "translate-x-8"
    );

    setTimeout(() => {
      toast.remove();

activeToasts = Math.max(
  activeToasts - 1,
  0
);

const toasts =
  container.children;

Array.from(toasts).forEach(
  (item) => {
    item.style.transition =
      "transform .35s ease";
  }
);
    }, 450);
  };

  toast
    .querySelector(".toastClose")
    ?.addEventListener(
      "click",
      removeToast
    );

 let remaining = duration;

let start = Date.now();

let timer = setTimeout(
  removeToast,
  remaining
);

toast.addEventListener("mouseenter", () => {

  clearTimeout(timer);

  remaining -=
    Date.now() - start;

});

toast.addEventListener("mouseleave", () => {

  start = Date.now();

  timer = setTimeout(
    removeToast,
    remaining
  );

});
}
