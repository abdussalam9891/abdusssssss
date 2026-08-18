// export function createHeroContent(heroSlides = []) {
//   return `
//     <div
//       class="
//         absolute
//         inset-0
//         z-30
//         flex
//         items-center
//       "
//     >

//       <div
//         class="
//           mx-auto
//           w-full
//           max-w-7xl
//           px-8
//           lg:px-14
//         "
//       >

//         ${heroSlides
//           .map((slide, index) => {

//             const title =
//               slide.heading || "";

//             const description =
//               slide.subheading || "";

//             const redirectUrl =
//               slide.redirectUrl || "/pages/products.html";

//             return `
//               <div
//                 class="
//                   hero-content

//                   ${
//                     index === 0
//                       ? "opacity-100 visible"
//                       : "opacity-0 invisible absolute"
//                   }

//                   max-w-[760px]

//                   transition-opacity
//                   duration-700
//                 "

//                 data-content="${index}"
//               >




//                 <p
//                   class="
//                     hero-description
//                     mt-10
//                     max-w-[600px]
//                     text-[18px]
//                     leading-8
//                     text-white/80
//                   "
//                 >
//                   ${description}
//                 </p>


//                 <div
//                   class="
//                     hero-actions
//                     mt-14
//                   "
//                 >

//                   <a
//                     href="${redirectUrl}"

//                     class="
//                       hero-button
//                       group
//                       relative
//                       inline-flex
//                       items-center
//                       justify-center
//                       gap-4
//                       overflow-hidden
//                       rounded-full
//                       border
//                       border-white/20
//                       bg-white/10
//                       px-8
//                       py-4
//                       text-sm
//                       font-medium
//                       uppercase
//                       tracking-[0.18em]
//                       text-white
//                       backdrop-blur-xl
//                       transition-all
//                       duration-500
//                       hover:-translate-y-1
//                       hover:border-primary
//                       hover:shadow-[0_20px_45px_rgba(160,121,54,.35)]
//                     "
//                   >

//                     <span
//                       class="
//                         absolute
//                         inset-0
//                         origin-left
//                         scale-x-0
//                         rounded-full
//                         bg-primary
//                         transition-transform
//                         duration-700
//                         ease-[cubic-bezier(0.22,1,0.36,1)]
//                         group-hover:scale-x-100
//                       "
//                     ></span>

//                     <span
//                       class="
//                         relative
//                         z-10
//                         inline-flex
//                         items-center
//                         gap-4
//                         transition-colors
//                         duration-300
//                         group-hover:text-black
//                       "
//                     >

//                       Shop Now

//                       <span
//                         class="
//                           transition-transform
//                           duration-500
//                           group-hover:translate-x-2
//                         "
//                       >
//                         →
//                       </span>

//                     </span>

//                   </a>

//                 </div>

//               </div>
//             `;

//           })
//           .join("")}

//       </div>
//     </div>
//   `;
// }
