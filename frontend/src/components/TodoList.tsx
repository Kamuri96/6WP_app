import React, { useEffect, useState } from "react";
import axios from "axios";

type Todo = { id: string; title: string; status: "TODO" | "DOING" | "DONE" };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<"ALL" | "TODO" | "DOING" | "DONE">(
    "ALL"
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get<Todo[]>("http://localhost:3001/todos");
    setTodos(res.data);
  };

  const advanceStatus = async (id: string) => {
    await axios.post(`http://localhost:3001/todos/${id}/next`);
    fetchTodos();
  };

  const addTodo = async () => {
    if (newTitle.trim() === "") return;
    await axios.post("http://localhost:3001/todos", { title: newTitle });
    setNewTitle("");
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await axios.delete(`http://localhost:3001/todos/${id}`);
    fetchTodos();
  };

  const statusStyles = {
    TODO: { backgroundColor: "#f5a9a9", icon: "😈" },
    DOING: { backgroundColor: "#ffe599", icon: "⏳" },
    DONE: { backgroundColor: "#b6d7a8", icon: "😇" },
  };

  const filteredTodos = todos.filter(
    (todo) => filter === "ALL" || todo.status === filter
  );

  return (
    <div>
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しいタスクを入力"
          style={{ padding: "8px", flex: 1 }}
        />
        <button onClick={addTodo} style={{ padding: "8px 16px" }}>
          追加
        </button>
      </div>

      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {(["ALL", "TODO", "DOING", "DONE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: "6px 12px" }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: statusStyles[todo.status].backgroundColor,
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => advanceStatus(todo.id)}
            >
              <span style={{ marginRight: "8px" }}>
                {statusStyles[todo.status].icon}
              </span>
              <span>
                <strong>{todo.status}</strong> - {todo.title}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                color: "#a00",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
