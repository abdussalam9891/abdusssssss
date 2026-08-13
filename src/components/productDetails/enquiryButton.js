const WHATSAPP_NUMBER = "919999999999"; // Replace with your number

export function createEnquiryButton(product) {

  const message = encodeURIComponent(
`Hello banshiwale,

I'm interested in this jewellery piece.

Product: ${product.name}
Price: ₹${product.price.toLocaleString("en-IN")}

Could you please share more details?`
  );

  return `

<div
class="
pt-2
"
>

<a

href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}"

target="_blank"

rel="noopener noreferrer"

class="
group

relative

flex

w-full

items-center
justify-center

gap-3

overflow-hidden

rounded-2xl

bg-[#181818]

px-8
py-5

text-[14px]
font-medium

uppercase

tracking-[0.20em]

text-white

transition-all
duration-500

hover:-translate-y-1

hover:shadow-[0_22px_55px_rgba(0,0,0,.18)]
"

>

<span
class="
absolute
inset-0

origin-left

scale-x-0

bg-[#A07936]

transition-transform
duration-500

group-hover:scale-x-100
"
></span>

<i
data-lucide="message-circle"

class="
relative
z-10

h-5
w-5
"
></i>

<span
class="
relative
z-10
"
>

Enquire on WhatsApp

</span>

</a>

<p
class="
mt-4

text-center

text-[13px]

leading-6

text-[#777]
"
>

Talk directly with our jewellery expert for pricing,
customisation and availability.

</p>

</div>

`;

}
