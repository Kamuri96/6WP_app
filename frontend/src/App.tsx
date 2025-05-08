import React from "react";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#444" }}>
        天使と悪魔のTODOリスト
      </h1>
      <TodoList />
    </div>
  );
}

export default App;
