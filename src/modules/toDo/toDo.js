import { addMinutes } from "date-fns";

function hasBasicInfo(initialTitle, initialDesc) {
  let title;
  let desc = initialDesc;

  if (setTitle(initialTitle) == false) title = "Default Title";

  function setTitle(newTitle) {
    if (typeof newTitle == "string" && newTitle.length > 2) {
      title = newTitle;
      return title;
    } else return false;
  }

  return { getTitle: () => title, setTitle, desc };
}

function isCompletable(isCompleted = false) {
  let completed = isCompleted;

  function getCompleted() {
    return completed;
  }
  function toggle() {
    completed = !completed;
  }
  return { getCompleted, toggle };
}

function hasPriority(initialPriority) {
  let priority;

  setPriority(initialPriority);

  function setPriority(newPriority) {
    const int = parseInt(newPriority);
    if (int >= 0 && int <= 3) {
      priority = int;
    } else priority = 0;
  }

  return { getPriority: () => priority, setPriority };
}

function hasNotes(initialNotes) {
  let notes;

  setNotes(initialNotes);

  function setNotes(newNotes) {
    if (typeof newNotes === "string") notes = newNotes;
    else notes = "";
  }

  return { getNotes: () => notes, setNotes };
}

function createTODO(data = {}) {
  const todo = Object.assign(
    {
      type: "todo",
      id: data.id ?? Date.now(),
      created: data.created ?? new Date(),
      deadline: data.deadline ?? addMinutes(Date.now(), 15),
    },
    hasBasicInfo(data.title, data.desc),
    isCompletable(data.completed ?? false),
    hasPriority(data.priority),
    hasNotes(data.notes),
  );

  todo.toJSON = function () {
    return {
      type: this.type,
      id: this.id,
      created: this.created,
      title: this.getTitle(),
      desc: this.desc,
      deadline: this.deadline,
      completed: this.getCompleted(),
      priority: this.getPriority(),
      notes: this.getNotes(),
    };
  };

  return todo;
}

function createProject(data = {}) {
  const project = Object.assign(
    {
      type: "project",
      id: data.id ?? Date.now(),
      todos: data.todos ?? [],
      created: data.created ?? new Date(),
    },
    hasBasicInfo(data.title, data.desc),
    hasNotes(data.notes),
  );

  project.addTODO = function (todo) {
    if (todo.type === "todo") {
      this.todos.push(todo);
      return true;
    } else {
      console.error(`Couldn't add ToDo. Type isn't 'todo'.`);
      return false;
    }
  };

  project.removeTODO = function (todoID) {
    let index = null;
    this.todos.forEach((v, i) => {
      if (v.id == todoID) {
        index = i;
        return;
      }
    });
    if (index != null) {
      this.todos.splice(index, 1);
      return true;
    } else {
      console.error(
        `Couldn't remove ToDo. No ToDo found with [ID: ${todoID}:${typeof todoID}]`,
      );
      return false;
    }
  };

  project.findTODOByID = function (todoID) {
    const index = null;
    this.todos.forEach((v, i) => {
      if (v.id == todoID) {
        index = i;
        return;
      }
    });
    if (index != null) return { todo: this.todos[index], index: index };
    else
      console.error(`Couldn't find ToDo with [ID: ${todoID}:${typeof todoID}]`);
  };

  project.toJSON = function () {};

  return project;
}

function createWorkspace(data = {}) {
  const workspace = Object.assign(
    {
      type: "workspace",
      id: data.id ?? Date.now(),
      projects: data.projects ?? [],
    },
    hasBasicInfo(data.title, data.desc),
  );

  workspace.addProject = function (project) {
    if (project.type === "project") this.projects.push(project);
    else console.error(`Couldn't add project. Object type isn't 'project'`);
  };

  workspace.removeProject = function (projectID) {
    const index = null;
    this.projects.forEach((v, i) => {
      if (v.id == projectID) {
        index = i;
        return;
      }
    });
    if (index != null) {
      this.projects.splice(index, 1);
      return true;
    } else {
      console.error(
        `Couldn't find project with [ID: ${projectID}:${typeof projectID}]`,
      );
      return false;
    }
  };

  workspace.toJSON = function () {
    return {
      id: this.id,
      title: this.title,
      desc: this.desc,
      projects: this.projects,
    };
  };

  return workspace;
}

export { createTODO, createProject, createWorkspace };
