import React, { useEffect, useState } from "react";
import axios from "axios";

type Todo = {
  id: string;
  title: string;
  status: "TODO" | "DOING" | "DONE" | "EXPIRED";
  dueAt: string;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "TODO" | "DOING" | "DONE" | "EXPIRED"
  >("ALL");

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      const now = new Date();
      const expiredTodos = todos.filter(
        (todo) =>
          todo.status === "TODO" &&
          !isNaN(Date.parse(todo.dueAt)) &&
          new Date(todo.dueAt) < now
      );

      await Promise.all(
        expiredTodos.map((todo) =>
          axios.post(`http://localhost:3001/todos/${todo.id}/expire`)
        )
      );

      if (expiredTodos.length > 0) {
        fetchTodos();
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [todos]);

  const fetchTodos = async () => {
    const res = await axios.get<Todo[]>("http://localhost:3001/todos");
    setTodos(res.data);
  };

  const advanceStatus = async (id: string) => {
    await axios.post(`http://localhost:3001/todos/${id}/next`);
    fetchTodos();
  };

  const addTodo = async () => {
    if (newTitle.trim() === "" || dueAt === "") return;

    const isoString = new Date(dueAt).toISOString();

    await axios.post("http://localhost:3001/todos", {
      title: newTitle,
      dueAt: isoString,
    });

    setNewTitle("");
    setDueAt("");
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
    EXPIRED: { backgroundColor: "#d0d0d0", icon: "⚠️" },
  };

  const filteredTodos = todos
    .filter((todo) => filter === "ALL" || todo.status === filter)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()); // 日付順に並び替え

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      {/* 入力欄 */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しいタスクを入力"
          style={{ padding: "10px", fontSize: "16px", width: "100%" }}
        />
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", width: "100%" }}
        />
        <button onClick={addTodo} style={{ padding: "10px", fontSize: "16px" }}>
          追加
        </button>
      </div>

      {/* フィルター */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        {(["ALL", "TODO", "DOING", "DONE", "EXPIRED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: "8px 12px", fontSize: "14px" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TODO一覧 */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: statusStyles[todo.status].backgroundColor,
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "8px",
              width: "100%",
              wordBreak: "break-word",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                onClick={
                  todo.status !== "DONE"
                    ? () => advanceStatus(todo.id)
                    : undefined
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: todo.status !== "DONE" ? "pointer" : "default",
                  opacity: todo.status === "DONE" ? 0.6 : 1,
                }}
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
            </div>
            <div style={{ fontSize: "0.9em", marginTop: "6px", color: "#555" }}>
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
