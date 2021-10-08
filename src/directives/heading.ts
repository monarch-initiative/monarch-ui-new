import { kebabCase } from "lodash";

// heading directive
// usage: v-heading
// adds a kebab-case id to an element and link button

// when element created
const mounted = (element: HTMLElement): void => {
  // make id for heading based on contents
  const id = kebabCase(element.getAttribute("id") || element.innerText);
  element.setAttribute("id", id);

  // make anchor link
  const anchor = document.createElement("a");
  anchor.innerHTML = "🔗";
  anchor.classList.add("anchor");
  anchor.href = "#" + id;
  element.append(anchor);
};

// create directive
const directive = {
  mounted,
};

export default directive;
