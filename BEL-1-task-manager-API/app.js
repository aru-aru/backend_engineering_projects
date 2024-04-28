const express = require("express"); // Import Express framework for building the server
const fs = require("fs"); // Import file system module for file operations
const app = express(); // Initialize Express application
const port = 3000; // Define port number for server to listen on

app.use(express.json()); // Parse incoming JSON request bodies (middleware)
app.use(express.urlencoded({ extended: true }));

const allTasks = require("./task.json"); // Import tasks data from JSON file
const tasks = require("./task.json").tasks;
const Validator = require("./helper/validator.js"); // Import Validator class from helper directory

app.get("/", (req, res) => {
  res.send("Welcome to task manager!");
});

app.get("/tasks", (req, res) => {
  res.status(200).send(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const task = tasks.find((task) => task.id === parseInt(id));
  if (!task) {
    res.status(404).send("Task ID doesn't exist");
  }
  res.status(200).send(task);
});

app.post("/tasks", (req, res) => {
  const userProvidedTask = req.body;
  if (Validator.validateTaskInfo(userProvidedTask).status == true) {
    userProvidedTask.id = tasks.length + 1;
    tasksModified = allTasks;
    tasksModified.tasks.push(userProvidedTask);

    fs.writeFile(
      "./task.json",
      JSON.stringify(tasksModified),
      { encoding: "utf-8", flag: "w" },
      (err, data) => {
        if (err) {
          return res.status(500).send("Something went wrong while adding task");
        } else {
          return res.status(201).send("Task added!");
        }
      }
    );
  } else {
    res.status(400).send(Validator.validateTaskInfo(userProvidedTask).message);
  }
});

app.put("/tasks/:id", (req, res) => {
  const userProvidedId = req.params.id;
  const userProvidedTask = req.body;
  const modifiedTasksList = tasks;
  if (Validator.validateStatus(req.body).status == false) {
    return res
      .status(400)
      .send(Validator.validateStatus(userProvidedTask).message);
  }
  if (Validator.validateDescription(req.body).status == false) {
    return res
      .status(400)
      .send(Validator.validateDescription(userProvidedTask).message);
  }
  if (Validator.validateTitle(req.body).status == false) {
    return res
      .status(400)
      .send(Validator.validateTitle(userProvidedTask).message);
  }
  if (!Validator.validateTaskInfo(userProvidedTask).status) {
    return res
      .status(400)
      .send(Validator.validateTaskInfo(userProvidedTask).message);
  }
  const task = tasks.find((task) => task.id === parseInt(userProvidedId));
  const index = tasks.indexOf(task);
  if (userProvidedTask.title) {
    modifiedTasksList[index].title = userProvidedTask.title;
  }
  if (userProvidedTask.description) {
    modifiedTasksList[index].description = userProvidedTask.description;
  }
  if (userProvidedTask.completed) {
    modifiedTasksList[index].completed = userProvidedTask.completed;
  }
  tasksModified = allTasks;

  tasksModified.tasks = modifiedTasksList;

  fs.writeFile(
    "./task.json",
    JSON.stringify(tasksModified),
    { encoding: "utf-8", flag: "w" },
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .send("Something went wrong while modifying task");
      } else {
        return res.status(201).send("Task modified!");
      }
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const userProvidedId = req.params.id;
  if (Validator.validateId(userProvidedId, tasks).status == true) {
    const task = tasks.find((task) => task.id === parseInt(userProvidedId));
    const index = tasks.indexOf(task);
    console.log(task);
    tasks.splice(index, 1);
    tasksModified = allTasks;
    tasksModified.tasks = tasks;

    fs.writeFile(
      "./task.json",
      JSON.stringify(tasksModified),
      { encoding: "utf-8", flag: "w" },
      (err, data) => {
        if (err) {
          return res
            .status(500)
            .send("Something went wrong while deleting task");
        } else {
          return res.status(200).send("Task deleted!");
        }
      }
    );
  } else {
    res.status(400).send(Validator.validateId(userProvidedId, tasks).message);
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
