import React, { useEffect, useState } from "react";
import axios from "axios";

type Todo = {
  id: string;
  title: string;
  status: "TODO" | "DOING" | "DONE" | "EXPIRED";
  dueAt: string;
};

const API = import.meta.env.VITE_API_BASE_URL;

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "TODO" | "DOING" | "DONE" | "EXPIRED"
  >("ALL");

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(fetchTodos, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get<Todo[]>(`${API}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error("取得失敗:", err);
    }
  };

  const addTodo = async () => {
    if (!newTitle || !dueAt) return;
    const isoDueAt = new Date(dueAt).toISOString();

    try {
      await axios.post<Todo>(`${API}/todos`, {
        title: newTitle,
        dueAt: isoDueAt,
      });
      setNewTitle("");
      setDueAt("");
      fetchTodos();
    } catch (err) {
      console.error("追加失敗:", err);
    }
  };

  const advanceStatus = async (id: string) => {
    try {
      await axios.post<{ success: boolean }>(`${API}/todos/${id}/next`);
      fetchTodos();
    } catch (err) {
      console.error("ステータス更新失敗:", err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete<{ success: boolean }>(`${API}/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("削除失敗:", err);
    }
  };

  const statusStyles = {
    TODO: { backgroundColor: "#f5a9a9", icon: "😈" },
    DOING: { backgroundColor: "#ffe599", icon: "⏳" },
    DONE: { backgroundColor: "#b6d7a8", icon: "😇" },
    EXPIRED: { backgroundColor: "#d0d0d0", icon: "⚠️" },
  };

  const filteredTodos = todos
    .filter((todo) => filter === "ALL" || todo.status === filter)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しいタスク"
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button onClick={addTodo} style={{ padding: "10px", fontSize: "16px" }}>
          追加
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {(["ALL", "TODO", "DOING", "DONE", "EXPIRED"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              backgroundColor: statusStyles[todo.status].backgroundColor,
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "8px",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div
                onClick={
                  todo.status !== "DONE"
                    ? () => advanceStatus(todo.id)
                    : undefined
                }
                style={{
                  cursor: todo.status !== "DONE" ? "pointer" : "default",
                  flex: "1 1 auto",
                }}
              >
                {statusStyles[todo.status].icon} <strong>{todo.title}</strong> (
                {todo.status})
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a00",
                  cursor: "pointer",
                  paddingLeft: "8px",
                }}
              >
                削除
              </button>
            </div>
            <div style={{ fontSize: "0.8em", color: "#555", marginTop: "6px" }}>
              期限:{" "}
              {isNaN(Date.parse(todo.dueAt))
                ? "不明"
                : new Date(todo.dueAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
