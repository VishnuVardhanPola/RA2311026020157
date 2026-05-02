import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // 🔥 Simulate fetching data (like API)
  useEffect(() => {
  log("frontend", "info", "component", "app started");
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

  const log = async (stack, level, pkg, message) => {
  try {
    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2cDA3NjZAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDE2OCwiaWF0IjoxNzc3Njk5MjY4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjI0M2I3NmMtMzA4MS00ZTc5LWFhOGYtYmRjYzVhY2M2NWM2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaG51dmFyZGhhbiBwb2xhIiwic3ViIjoiMWZiMDdkYTQtYzRkMC00NGJlLWIwMjYtNmNhYTg3YmZmMDMxIn0sImVtYWlsIjoidnAwNzY2QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidmlzaG51dmFyZGhhbiBwb2xhIiwicm9sbE5vIjoicmEyMzExMDI2MDIwMTU3IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMWZiMDdkYTQtYzRkMC00NGJlLWIwMjYtNmNhYTg3YmZmMDMxIiwiY2xpZW50U2VjcmV0IjoiekJocGZKaGR1bk11dlpwRCJ9.a3ee0f8dshKKamhsPwDLrUChiJE-d9n9Donu8lwjbkA"
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: pkg,
        message: message
      })
    });

    const data = await response.json();
    console.log("Log success:", data);

  } catch (error) {
    console.error("Log failed:", error);
  }
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