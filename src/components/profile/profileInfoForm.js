import { escapeHtml } from "../../utils/format.js";


const INPUT_CLASSES = `
  w-full

  rounded-2xl

  border
  border-[#DDD7CF]

  bg-white

  px-5
  py-3.5

  text-[15px]

  text-ink

  outline-none

  transition-all
  duration-300

  placeholder:text-[#A5A09A]

  focus:border-primary
  focus:ring-1
  focus:ring-primary

  disabled:bg-[#FAF8F5]
  disabled:text-[#8A8A8A]
`;


function field({ id, name, label, type = "text", value = "", disabled = false, extra = "", wrapperClass = "" }) {

  return `
<div class="${wrapperClass}">

  <label
    for="${id}"

    class="
      mb-2
      block

      text-[13px]
      font-medium

      text-ink
    "
  >
    ${label}
  </label>

  <input
    id="${id}"
    name="${name}"
    type="${type}"
    value="${escapeHtml(value)}"
    ${disabled ? "disabled" : ""}
    ${extra}

    class="${INPUT_CLASSES}"
  />

</div>
`;
}


// yyyy-mm-dd, matching <input type="date">'s expected value/max format.
function toDateInputValue(value) {

  if (!value) return "";

  const isoLike =
    String(value).slice(0, 10);

  return /^\d{4}-\d{2}-\d{2}$/.test(isoLike) ? isoLike : "";
}


export function createProfileInfoForm(user = {}) {

  const firstName =
    user?.firstName || "";

  const lastName =
    user?.lastName || "";

  const email =
    user?.email || "";

  const mobileNumber =
    user?.mobileNumber || user?.phone || "";

  const dob =
    toDateInputValue(user?.dob || user?.dateOfBirth);

  const todayIso =
    new Date().toISOString().slice(0, 10);

  return `

<div
  class="
    rounded-[28px]

    border
    border-[#F3EEE6]

    bg-white

    p-6
    sm:p-8
  "
>

  <h2
    class="
      font-serif
      italic

      text-[24px]
      sm:text-[28px]

      text-ink
    "
  >
    My Profile
  </h2>

  <p class="mt-2 text-[14px] text-[#8A8A8A]">
    Keep your personal information up to date.
  </p>


  <form
    id="profileInfoForm"

    class="
      mt-8

      grid

      grid-cols-1
      gap-6

      sm:grid-cols-2
    "
  >

    ${field({
      id: "profileFirstName",
      name: "firstName",
      label: "First Name",
      value: firstName,
      extra: 'autocomplete="given-name" maxlength="50" required',
    })}

    ${field({
      id: "profileLastName",
      name: "lastName",
      label: "Last Name",
      value: lastName,
      extra: 'autocomplete="family-name" maxlength="50" required',
    })}

    ${field({
      id: "profileEmail",
      name: "email",
      label: "Email Address",
      type: "email",
      value: email,
      disabled: true,
    })}

    ${field({
      id: "profileMobileNumber",
      name: "mobileNumber",
      label: "Mobile Number",
      type: "tel",
      value: mobileNumber,
      extra: 'autocomplete="tel" inputmode="numeric" maxlength="10" required',
    })}

    ${field({
      id: "profileDob",
      name: "dob",
      label: `Date of Birth <span class="font-normal text-[#A5A09A]">(Optional)</span>`,
      type: "date",
      value: dob,
      extra: `autocomplete="bday" max="${todayIso}"`,
    })}

    <div class="sm:col-span-2">

      <button
        type="submit"
        id="profileInfoSubmitButton"

        class="
          inline-flex

          items-center
          justify-center

          rounded-full

          bg-ink

          px-9
          py-3.5

          text-[13px]

          font-medium

          uppercase

          tracking-[0.18em]

          text-white

          transition-colors
          duration-300

          hover:bg-primary

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <span id="profileInfoSubmitText">Save Changes</span>
      </button>

    </div>

  </form>

</div>

`;
}
