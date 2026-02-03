import { Donezo } from "./modules/toDo/toDo.js";
import "./styles/main.css";
import "./styles/layout.css";
import { appTitle } from "./components/appTitle/appTitle.js";
import { navBar } from "@/components/navBar/navBar.js";

const elems = {
  header: document.getElementById("header"),
  content: document.getElementById("content"),
  footer: document.getElementById("footer"),
};
const donezo = Donezo();
const utilities = { donezo: donezo, navigate: navigate };

elems.header.append(appTitle("Donezo"));
document.body.appendChild(navBar(utilities));

async function navigate(target, { ...args }) {
  if (/\./.test(target)) {
    window.open(target);
  } else {
    const content = document.getElementById("content");
    const body = document.body;
    try {
      const mod = await import(`@/views/${target}.js`);
      content.replaceChildren(mod.default(utilities, args));
      body.dataset.view = target;
    } catch (error) {
      console.error(error);
      const mod = await import("@/views/home.js");
      content.replaceChildren(mod.default(utilities, args));
      body.dataset.view = "home";
    }
  }
  document.getElementById("navBar").togglePopover();
}
