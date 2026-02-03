import "@/styles/views/projectView.css";
import { emmet } from "emmet-elem";
import { projectManager } from "../components/projectManager/projectManager.js";

export default function (utilities, args) {
  const outer = emmet(`div.projectView`);

  outer.appendChild(projectManager(utilities.donezo, args));

  return outer;
}
