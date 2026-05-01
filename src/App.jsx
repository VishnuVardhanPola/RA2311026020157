import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // 🔥 Simulate fetching data (like API)
  useEffect(() => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
      const names = data.map(user => user.name);
      setItems(names);
    });
  }, []);

  const addItem = () => {
    if (!input) return;
    setItems([...items, input]);
    setInput("");
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Frontend Test App (API Ready)</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter item"
      />
      <button onClick={addItem}>Add</button>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}{" "}
            <button onClick={() => deleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;