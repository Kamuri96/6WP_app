import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let todos = [
  { id: "1", title: "洗濯する", status: "TODO" },
  { id: "2", title: "勉強する", status: "TODO" },
];

app.get("/todos", (_req, res) => {
  res.json(todos);
});

app.post("/todos/:id/next", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (todo) {
    if (todo.status === "TODO") todo.status = "DOING";
    else if (todo.status === "DOING") todo.status = "DONE";
    else todo.status = "TODO";
  }
  res.json({ success: true });
});

app.post("/todos", (req, res) => {
  const { title } = req.body;
  const newTodo = {
    id: Date.now().toString(),
    title,
    status: "TODO",
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
