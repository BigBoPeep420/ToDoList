import "./navButton.css";
import { emmet } from "emmet-elem";

function navButton(content = [], viewName, onClick = null) {
  const view = viewName;
  const outer = emmet(`button.navButton[type="button"]`);

  content.forEach((v) => {
    outer.appendChild(v);
  });

  outer.addEventListener("click", async (e) => {
    if (view === "#" || !view) return;

    const cont = document.getElementById("content");
    try {
      const mod = await import(`@/views/${view}.js`);
      if (mod) {
        cont.dataset.view = view;
        cont.replaceChildren();
        cont.appendChild(mod.default());
      }
    } catch (error) {
      console.error(error);
      const home = await import("@/views/home.js");
      cont.replaceChildren();
      cont.appendChild(home.default());
    }

    if (onClick) {
      try {
        onClick(e);
      } catch (error) {
        console.log(error);
      }
    }
  });

  return outer;
}

export { navButton };
