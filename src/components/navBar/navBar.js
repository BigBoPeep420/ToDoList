import { navButton } from "../navButton/navButton.js";
import { emmet } from "emmet-elem";
import { stringToElement } from "@/modules/utils/domParse.js";
import "./navBar.css";
import iconHome from "@/assets/icons/home.svg";
import iconWorkspaces from "@/assets/icons/format-list-text.svg";
import iconSettings from "@/assets/icons/cog-box.svg";
import iconMenuLeft from "@/assets/icons/arrow-collapse-left.svg";
import iconMenuRight from "@/assets/icons/arrow-collapse-right.svg";

function navBar() {
  let open = false;
  const icons = {
    open: stringToElement(iconMenuLeft, "svg"),
    closed: stringToElement(iconMenuRight, "svg"),
  };
  const outer = emmet(`nav#navBar[popover="auto"]`);
  const inner = emmet("div.inner");
  outer.append(inner);

  const navGroupA = emmet("ul.navButtonGroup");
  navGroupA.append(
    navButton(
      [stringToElement(iconHome, "svg"), emmet("p{Home}")],
      "home",
      toggleNavBar,
    ),
    navButton(
      [stringToElement(iconWorkspaces, "svg"), emmet("p{Workspaces}")],
      "workspaces",
      toggleNavBar,
    ),
  );
  const navGroupB = emmet("ul.navButtonGroup");
  navGroupB.append(
    navButton(
      [stringToElement(iconSettings, "svg"), emmet("p{Settings}")],
      "settings",
      toggleNavBar,
    ),
  );
  inner.append(navGroupA, navGroupB);

  const toggleBtn = emmet(`button#toggle[type="button"]`);
  toggleBtn.appendChild(icons.closed);
  toggleBtn.addEventListener("click", (e) => {
    toggleNavBar();
  });
  outer.appendChild(toggleBtn);

  return outer;

  function toggleNavBar(show = null) {
    if (show == "true") {
      outer.showPopover();
      open = true;
      toggleBtn.replaceChildren(icons.open);
      return;
    } else if (show == "false") {
      outer.hidePopover();
      open = false;
      toggleBtn.replaceChildren(icons.closed);
    } else {
      toggleBtn.replaceChildren(open ? icons.closed : icons.open);
      open = !open;
      outer.togglePopover();
    }
  }
}

export { navBar };
