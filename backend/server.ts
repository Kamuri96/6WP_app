import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;
const HOST = "0.0.0.0";

app.use(cors());
app.use(express.json());

type Todo = {
  id: string;
  title: string;
  status: "TODO" | "DOING" | "DONE" | "EXPIRED";
  dueAt: string;
};

let todos: Todo[] = [
  {
    id: "1",
    title: "洗濯する",
    status: "TODO",
    dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "勉強する",
    status: "TODO",
    dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
];

setInterval(() => {
  const now = new Date();
  todos.forEach((todo) => {
    const due = new Date(todo.dueAt);
    if (
      todo.status === "TODO" &&
      !isNaN(due.getTime()) &&
      due.getTime() < now.getTime()
    ) {
      todo.status = "EXPIRED";
    }
  });
}, 1000);

app.get("/todos", (_req, res) => {
  res.json(todos);
});

app.post("/todos/:id/next", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (todo) {
    if (todo.status === "EXPIRED") {
      todo.status = "DOING";
    } else if (todo.status === "TODO") {
      todo.status = "DOING";
    } else if (todo.status === "DOING") {
      todo.status = "DONE";
    }
    // DONE は何もしない
  }
  res.json({ success: true });
});

app.post("/todos", (req, res) => {
  const { title, dueAt } = req.body;
  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    dueAt,
    status: "TODO",
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== req.params.id);
  res.json({ success: true });
});

app.listen(PORT, HOST, () => {
  console.log(` API Server running at http://${HOST}:${PORT}`);
});
