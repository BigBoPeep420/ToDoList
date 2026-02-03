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
      todos: (data.todos || []).map((todoData) => createTODO(todoData)),
      created: data.created ?? new Date(),
    },
    hasBasicInfo(data.title, data.desc || ""),
    hasNotes(data.notes || ""),
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
    let index = this.todos.findIndex((todo) => todo.id == todoID);
    if (index >= 0) {
      this.todos.splice(index, 1);
      return true;
    } else {
      console.error(
        `project.removeTODO: Couldn't find TODO with [todoID: ${todoID}]`,
      );
      return false;
    }
  };

  project.findTODOByID = function (todoID) {
    const index = this.todos.findIndex((todo) => todo.id == todoID);
    if (index >= 0) {
      this.todos.splice(index, 1);
      return true;
    } else {
      console.error(
        `project.findTODOByID: Couldn't find ToDo with [todoID: ${todoID}]`,
      );
      return false;
    }
  };

  project.toJSON = function () {
    return {
      type: this.type,
      id: this.id,
      created: this.created,
      title: this.getTitle(),
      desc: this.desc,
      note: this.getNotes(),
      todos: this.todos,
    };
  };

  return project;
}

function createWorkspace(data = {}) {
  const workspace = Object.assign(
    {
      type: "workspace",
      id: data.id ?? Date.now(),
      projects: (data.projects || []).map((projData) =>
        createProject(projData),
      ),
    },
    hasBasicInfo(data.title, data.desc),
  );

  workspace.addProject = function (project) {
    if (project.type === "project") this.projects.push(project);
    else console.error(`Couldn't add project. Object type isn't 'project'`);
  };

  workspace.removeProject = function (projectID) {
    const index = this.projects.findIndex((proj) => proj.id == projectID);
    if (index >= 0) {
      this.projects.splice(index, 1);
      return true;
    } else {
      console.error(
        `workspace.removeProject: No project found with [ProjectID: ${projectID}]`,
      );
      return false;
    }
  };

  workspace.toJSON = function () {
    return {
      type: this.type,
      id: this.id,
      title: this.getTitle(),
      desc: this.desc,
      projects: this.projects,
    };
  };

  return workspace;
}

function webStorageInterfaceL() {
  const store = window.localStorage;

  function storeWorkspace(workspaceID, workspace) {
    store.setItem(workspaceID, JSON.stringify(workspace));
  }

  function getWorkspace(workspaceID) {
    const rawWS = store.getItem(workspaceID);
    if (!rawWS) return null;

    const ws = JSON.parse(rawWS);

    return createWorkspace(ws);
  }

  function getAllWorkspaces() {
    const allItems = getAllItems();

    return allItems.reduce((acc, item) => {
      if (item.value.type == "workspace") {
        acc[item.key] = createWorkspace(item.value);
        return acc;
      }
    }, {});
  }

  function removeWorkspace(workspaceID) {
    store.removeItem(workspaceID);
  }

  function clear() {
    store.clear();
  }

  function getAllItems() {
    const items = [];
    for (let i = 0; i < store.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(store.getItem(key));
      items.push({ key, value });
    }
    return items;
  }

  return {
    storeWorkspace,
    getWorkspace,
    getAllWorkspaces,
    removeWorkspace,
    clear,
    getAllItems,
  };
}

function Donezo(initialCallbacks = {}) {
  const callbacks = {
    onupdateworkspaces: [],
    onupdatews: [],
  };
  for (let event in initialCallbacks) {
    if (event in callbacks) {
      callbacks[event].push(...initialCallbacks[event]);
    }
  }

  const storageInterface = webStorageInterfaceL();
  const cache = storageInterface.getAllWorkspaces();
  callCallbacks("onupdateworkspaces");

  function registerCallback(eventName, callbackFn) {
    if (eventName in callbacks) callbacks[eventName].push(callbackFn);
  }
  function removeCallback(eventName, callbackFn) {
    if (eventName in callbacks) {
      callbacks[eventName] = callbacks[eventName].filter(
        (fn) => fn !== callbackFn,
      );
    }
  }
  function callCallbacks(eventName, ...args) {
    if (eventName in callbacks) {
      callbacks[eventName].forEach((callback) => callback(...args));
    }
  }

  function addWorkspace(workspaceData) {
    if ("title" in workspaceData) {
      const newSpace = createWorkspace(workspaceData);
      if (newSpace) {
        cache[newSpace.id] = newSpace;
        callCallbacks("onupdateworkspaces", { ...cache });
        storageInterface.storeWorkspace(newSpace.id, newSpace);
      } else console.error(`Couldn't create new Workspace`);
    } else console.error(`No title property in workspaceData argument`);
  }
  function removeWorkspace(workspaceID) {
    if (workspaceID in cache) {
      delete cache[workspaceID];
      callCallbacks("onupdateworkspaces", { ...cache });
      storageInterface.removeWorkspace(workspaceID);
    }
  }
  function getWorkspace(workspaceID) {
    if (workspaceID in cache) return cache[workspaceID];
    else {
      const result = storageInterface.getWorkspace(workspaceID);
      if (result != null) {
        cache[result.id] = result;
        callCallbacks("onupdateworkspaces", { ...cache });
        return cache[result.id];
      } else {
        console.error(
          `[WorkspaceID: ${workspaceID}] not found in cache or storage`,
        );
        return null;
      }
    }
  }
  function getAllWorkspaces() {
    return { ...cache };
  }

  function addProject(workspaceID, projData) {
    if (projData.title.length < 3) {
      console.error("Donezo.addProject: Title must be at least 3 chars");
      return null;
    }
    const ws = getWorkspace(workspaceID);
    if (ws) {
      const newProj = createProject(projData);
      ws.addProject(newProj);
      callCallbacks("onupdatews", ws);
      storageInterface.storeWorkspace(ws.id, ws);
      return true;
    } else {
      console.error(
        `Donezo.addProject: Couldn't find [WorkspaceID: ${workspaceID}]`,
      );
      return null;
    }
  }
  function removeProject(workspaceID, projectID) {
    const ws = getWorkspace(workspaceID);
    if (ws) {
      ws.removeProject(projectID);
      callCallbacks("onupdatews", ws);
      return true;
    } else {
      console.error(
        `Donezo.removeProject: Couldn't find Workspace with [workspaceID: ${workspaceID}]`,
      );
      return false;
    }
  }
  function getProject(workspaceID, projectID) {
    const ws = getWorkspace(workspaceID);
    const index = ws.projects.findIndex((proj) => proj.id == projectID);
    if (index >= 0) {
      return ws.projects[index];
    } else {
      console.error(`Couldn't find project with [ProjectID: ${projectID}]`);
      return false;
    }
  }

  return {
    registerCallback,
    removeCallback,
    addWorkspace,
    removeWorkspace,
    getWorkspace,
    getAllWorkspaces,
    addProject,
    removeProject,
    getProject,
  };
}

export { Donezo };
