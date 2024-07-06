import { useState } from "react";
import "./App.css";
import { Bound } from "./react2way";

function App() {
  const state = useState("");

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <Bound bind={state}>
        <input />
        <input />
        <textarea />
      </Bound>
    </div>
  );
}

export default App;
