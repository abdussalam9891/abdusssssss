const WHATSAPP_NUMBER = "919999999999"; // Replace

export function createStickyEnquiryBar(product) {

  const message = encodeURIComponent(
`Hello banshiwale,

I'm interested in:

${product.name}

Price: ₹${product.price.toLocaleString("en-IN")}

Could you share more details?`
  );

  return `

<div
class="
fixed

bottom-0
left-0
right-0

z-50

border-t
border-[#ECE5D8]

bg-white/95

backdrop-blur-xl

p-4

lg:hidden
"
>

<div
class="
flex

items-center

gap-4
"
>

<div
class="
min-w-0

flex-1
"
>

<p
class="
truncate

font-serif

text-[20px]

italic

text-[#181818]
"
>

${product.name}

</p>

<p
class="
mt-1

font-medium

text-[#A07936]
"
>

₹${product.price.toLocaleString("en-IN")}

</p>

</div>

<a

href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}"

target="_blank"

rel="noopener noreferrer"

class="
flex

shrink-0

items-center

gap-2

rounded-2xl

bg-[#181818]

px-6
py-4

text-[13px]

font-medium

uppercase

tracking-[0.16em]

text-white

transition-all
duration-300

hover:bg-[#A07936]
"
>

<i
data-lucide="message-circle"

class="
h-4
w-4
"
></i>

Enquire

</a>

</div>

</div>

`;

}
