import React, { useEffect, useState } from "react";
import axios from "axios";

type Todo = { id: string; title: string; status: "TODO" | "DOING" | "DONE" };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");

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

  const statusColors = {
    TODO: "gray",
    DOING: "orange",
    DONE: "green",
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しいタスク"
          style={{ padding: "4px", marginRight: "8px" }}
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <button
              onClick={() => advanceStatus(todo.id)}
              style={{
                color: "white",
                backgroundColor: statusColors[todo.status],
                marginRight: "8px",
                padding: "4px 8px",
              }}
            >
              {todo.status}
            </button>
            {todo.title}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: "12px", color: "red" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
