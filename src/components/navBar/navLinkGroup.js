import { emmet } from "emmet-elem";

/**
 * Creates a list of navigation links
 * @param {Object[]} options - Array of Objects with content and target props
 * @param {HTMLElement[]} options[].content - Array of HTML Elements that make up each link
 * @param {string} options[].viewName - String with name of View OR external link to navigate to
 * @returns {HTMLDivElement} A finished element with populated links
 */
function navLinkGroup(navigate, options = []) {
  const outer = emmet("div.navLinkGroup");
  const inner = emmet("ul.inner");
  outer.appendChild(inner);

  options.forEach((opt) => {
    const div = emmet(`div.navLink`);

    div.append(...opt.content);
    div.target = opt.target;

    inner.appendChild(div);
  });

  outer.addEventListener("click", (e) => {
    const targ = e.target.closest(".navLink");
    if (targ) {
      navigate(targ.target, {});
      return;
    }
  });

  return outer;
}

export { navLinkGroup };
