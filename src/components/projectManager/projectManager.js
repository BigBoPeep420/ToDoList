import { emmet } from "emmet-elem";
import { stringToElement } from "@/modules/utils/domParse.js";
import "./projectManager.css";
import iconEdit from "@/assets/icons/pencil-circle.svg";

function projectManager(donezo, args) {
  const workspace = donezo.getWorkspace(args.workspaceid);
  const project = donezo.getProject(args.workspaceid, args.projectid);

  const outer = emmet(`div.projectManager`);

  const title = emmet(`div.projectTitle>p{${project.getTitle()}}`);
  const btnEditTitle = emmet(`button.btnEditTitle[type="button"]`);
  btnEditTitle.appendChild(stringToElement(iconEdit, "svg"));
  title.appendChild(btnEditTitle);

  const desc = emmet(`div.projectDesc>p{${project.desc}}`);
  const btnEditDesc = emmet(`button.btnEditDesc[type="button"]`);
  btnEditDesc.appendChild(stringToElement(iconEdit, "svg"));
  desc.appendChild(btnEditDesc);

  outer.append(title, desc);

  return outer;
}

export { projectManager };
