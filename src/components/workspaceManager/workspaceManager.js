import "./workspaceManager.css";
import { emmet } from "emmet-elem";
import { stringToElement } from "@/modules/utils/domParse.js";
import iconEdit from "@/assets/icons/pencil-circle.svg";
import iconDelete from "@/assets/icons/close-circle.svg";

function workspaceManager(utilities) {
  utilities.donezo.registerCallback("onupdateworkspaces", renderWSElements);

  const outer = emmet(`div.workspaceManager`);

  renderWSElements();

  outer.addEventListener("click", (e) => {
    let targ = e.target.closest(".projectItem");
    if (targ) {
      e.preventDefault();
      const wsid = targ.closest(".workspaceRow").dataset.workspaceid;
      utilities.navigate("projectView", {
        workspaceid: wsid,
        projectid: targ.dataset.projectid,
      });
    }

    targ = e.target.closest(".workspaceEdit");
    if (targ) {
      e.preventDefault();
      // <--------------------- Logic for Edit Workspace
    }

    targ = e.target.closest(".workspaceDelete");
    if (targ) {
      e.preventDefault();
      const workspaceID = targ.closest(".workspaceRow").dataset.workspaceid;
      utilities.donezo.removeWorkspace(workspaceID);
    }
  });

  return outer;

  function renderWSElements(workspaces) {
    const wses = workspaces || utilities.donezo.getAllWorkspaces();
    outer.replaceChildren();
    for (let key in wses) {
      outer.appendChild(createWSElement(wses[key]));
    }
  }

  function createWSElement(workspace) {
    const outer = emmet("details.workspaceRow");
    outer.dataset.workspaceid = workspace.id;

    const header = emmet(`summary.workspaceHeader>p{${workspace.getTitle()}}`);
    const wsDelete = emmet(`button.workspaceDelete[type="button"]`);
    wsDelete.appendChild(stringToElement(iconDelete, "svg"));
    const wsEdit = emmet(`button.workspaceEdit[type="button"]`);
    wsEdit.appendChild(stringToElement(iconEdit, "svg"));
    header.append(wsEdit, wsDelete);

    const list = emmet("ul.projectList");
    const projects = workspace.projects.map((proj) => {
      const li = emmet(`li.projectItem{${proj.getTitle()}}`);
      li.dataset.projectid = proj.id;
      return li;
    });

    list.append(...projects);
    outer.append(header, list);

    return outer;
  }
}

export { workspaceManager };
