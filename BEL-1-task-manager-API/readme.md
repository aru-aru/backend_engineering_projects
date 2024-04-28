# Task Manager API - Readme

This document serves as a guide for the Task Manager API, a Node.js application that allows you to manage tasks using a RESTful API.

## Features

- **CRUD Operations:** Create, Read, Update, and Delete tasks.
- **Task Validation:** Ensures tasks have required properties (title, description) and validates data types.
- **JSON Data Storage:** Stores tasks in a `task.json` file.

## Prerequisites

- Node.js and npm (or yarn) installed on your system.

## Installation

1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies.

## Usage

Start the server:

```bash
node app.js
```

The server will listen on port 3000 by default.

## API Endpoints

| Method | URL        | Description               | Status Code                                                                                  |
| ------ | ---------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| GET    | /          | Get a welcome message     | 200 OK                                                                                       |
| GET    | /tasks     | Get all tasks             | 200 OK                                                                                       |
| GET    | /tasks/:id | Get a specific task by ID | 200 OK (if found), 404 Not Found (if not found)                                              |
| POST   | /tasks     | Create a new task         | 201 Created (if valid), 400 Bad Request (if invalid)                                         |
| PUT    | /tasks/:id | Update an existing task   | 201 Created (if valid and found), 400 Bad Request (if invalid), 404 Not Found (if not found) |
| DELETE | /tasks/:id | Delete a task by ID       | 200 OK (if found), 400 Bad Request (if not found)                                            |

### Request Body (for POST):

```json
{
  "title": "string", (required)
  "description": "string", (required)
  "completed": boolean (required)
}
```

### Request Body (for PUT):

```json
{
  "title": "string", (optional)
  "description": "string", (optional)
  "completed": boolean (optional)
}
```

### Dependencies

- Express: Web framework for building the server.
- fs: Node.js file system module for file operations.
- Validator: Custom class for validating task data.
