import {
  createTODO,
  createProject,
  createWorkspace,
} from "./modules/toDo/toDo.js";

const space = createWorkspace({
  title: "Default Space",
  desc: "The default space for projects",
});
console.log(space);

space.addProject(
  createProject({
    title: "My First Project",
    desc: `The first project I'm creating in my new app.`,
  }),
);
console.log(space.projects);
