import { emmet } from "emmet-elem";
import { stringToElement } from "@/modules/utils/domParse.js";
import "./navBar.css";
import { navLinkGroup } from "@/components/navBar/navLinkGroup.js";
import { workspaceManager } from "@/components/workspaceManager/workspaceManager.js";
import iconHome from "@/assets/icons/home.svg";
import iconWorkspaces from "@/assets/icons/format-list-text.svg";
import iconSettings from "@/assets/icons/cog-box.svg";
import iconMenuLeft from "@/assets/icons/arrow-collapse-left.svg";
import iconMenuRight from "@/assets/icons/arrow-collapse-right.svg";

function navBar(utilities) {
  const icons = {
    open: stringToElement(iconMenuLeft, "svg"),
    closed: stringToElement(iconMenuRight, "svg"),
    home: stringToElement(iconHome, "svg"),
    workspaces: stringToElement(iconWorkspaces, "svg"),
    settings: stringToElement(iconSettings, "svg"),
  };
  const outer = emmet(`nav#navBar[popover="auto"]`);
  const inner = emmet("div.inner");
  outer.append(inner);

  const toggleBtn = emmet(`button#toggle[type="button"]`);
  toggleBtn.appendChild(icons.closed);
  toggleBtn.addEventListener("click", (e) => {
    toggleNavBar();
  });
  outer.appendChild(toggleBtn);

  outer.addEventListener("toggle", (e) => {
    switch (e.newState) {
      case "open":
        toggleBtn.replaceChildren(icons.open);
        break;
      default:
        toggleBtn.replaceChildren(icons.closed);
        break;
    }
  });

  inner.appendChild(
    navLinkGroup(utilities.navigate, [
      { content: [icons.home, emmet("span{Home}")], target: "home" },
      {
        content: [icons.settings, emmet("span{Settings}")],
        target: "settings",
      },
    ]),
  );

  inner.appendChild(workspaceManager(utilities));

  return outer;

  function toggleNavBar(show = null) {
    if (show == "true") {
      outer.showPopover();
    } else if (show == "false") {
      outer.hidePopover();
    } else {
      outer.togglePopover();
    }
  }
}

export { navBar };
