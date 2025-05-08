import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let todos = [
  {
    id: "1",
    title: "洗濯する",
    status: "TODO",
    dueAt: "2025-05-07T22:00:00.000Z",
  },
  {
    id: "2",
    title: "勉強する",
    status: "TODO",
    dueAt: "2025-05-08T08:00:00.000Z",
  },
];

app.get("/todos", (_req, res) => {
  console.log("現在のTODOリスト:", todos);
  res.json(todos);
});

app.post("/todos/:id/next", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (todo) {
    if (todo.status === "TODO") todo.status = "DOING";
    else if (todo.status === "DOING") todo.status = "DONE";
    else if (todo.status === "DONE") todo.status = "TODO";
  }
  res.json({ success: true });
});

app.post("/todos", (req, res) => {
  console.log("POST /todos 受信データ:", req.body); // ここで確認

  const { title, dueAt } = req.body;

  const newTodo = {
    id: Date.now().toString(),
    title,
    status: "TODO",
    dueAt,
  };

  todos.push(newTodo);
  res.json(newTodo);
});

app.post("/todos/:id/expire", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (todo && todo.status === "TODO") {
    todo.status = "EXPIRED";
  }
  res.json({ success: true });
});

app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
