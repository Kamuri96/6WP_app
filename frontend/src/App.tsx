// App.tsx
import React from "react";
import TodoList from "./components/TodoList"; // 👈 あなたのコンポーネントを読み込み

function App() {
  return (
    <div>
      <h1>📝 TODO リスト</h1>
      <TodoList />
    </div>
  );
}

export default App;
