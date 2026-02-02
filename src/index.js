import {
  createTODO,
  createProject,
  createWorkspace,
  webStorageInterfaceL,
} from "./modules/toDo/toDo.js";
import "./styles/main.css";
import "./styles/layout.css";
import { appTitle } from "./components/appTitle/appTitle.js";
import { navBar } from "@/components/navBar/navBar.js";

const elems = {
  header: document.getElementById("header"),
  content: document.getElementById("content"),
  footer: document.getElementById("footer"),
};

elems.header.append(appTitle("Donezo"));
document.body.appendChild(navBar());
