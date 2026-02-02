import { emmet } from "emmet-elem";
import "./appTitle.css";

function appTitle(title) {
  const outer = emmet(`div.appTitle>div.inner>h1.text{${title}}`);

  return outer;
}

export { appTitle };
