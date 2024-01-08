import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title) {
        return response
          .writeHead(400)
          .end(JSON.stringify({ message: "Title is required" }));
      }

      if (!description) {
        return response
          .writeHead(400)
          .end(JSON.stringify({ message: "Description is required" }));
      }

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return response.writeHead(201).end();
    },
  },

  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              id: search,
            }
          : null
      );

      return response.end(JSON.stringify(tasks));
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      if (!title && !description) {
        return response
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title or description are required" })
          );
      }

      database.update("tasks", id, {
        title: title,
        description: description,
        updated_at: new Date(),
      });

      return response.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;

      database.delete("tasks", id);
      return response.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;

      database.update("tasks", id, {
        completed_at: new Date(),
      });

      return response.writeHead(204).end();
    },
  },
];
