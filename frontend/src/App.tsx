import React from "react";
import TodoList from "./components/TodoList";
import logo from "./assets/6WPapp仮logo.png";

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
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={logo}
          alt="天使と悪魔のTODOリスト ロゴ"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <TodoList />
    </div>
  );
}

export default App;
