import { useEffect, useState } from "react";
import { getTopNotifications } from "./notificationService";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2cDA3NjZAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTcwOCwiaWF0IjoxNzc3NzA0ODA4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjZhOGE1YmMtNDdkYS00ZTBlLTgxNDYtOTllNmQ4ZWE0ZTk0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaG51dmFyZGhhbiBwb2xhIiwic3ViIjoiMWZiMDdkYTQtYzRkMC00NGJlLWIwMjYtNmNhYTg3YmZmMDMxIn0sImVtYWlsIjoidnAwNzY2QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidmlzaG51dmFyZGhhbiBwb2xhIiwicm9sbE5vIjoicmEyMzExMDI2MDIwMTU3IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMWZiMDdkYTQtYzRkMC00NGJlLWIwMjYtNmNhYTg3YmZmMDMxIiwiY2xpZW50U2VjcmV0IjoiekJocGZKaGR1bk11dlpwRCJ9.dotW3NHENnv1v7zKyRHri6ee7CNgpA-E1tUOwDdFRHI";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState([]);

  // Load notifications using Stage 1 logic
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTopNotifications(TOKEN);
        console.log("FINAL DATA:", data);
        setNotifications(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    loadData();
  }, []);

  // Filter logic
  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === filter);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notifications</h1>

      {/* Filter buttons */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Event")}>Event</button>
        <button onClick={() => setFilter("Result")}>Result</button>
        <button onClick={() => setFilter("Placement")}>
          Placement
        </button>
      </div>

      {/* Notifications List */}
      <ul>
        {filtered.length === 0 ? (
          <p>No notifications available</p>
        ) : (
          filtered.map((n, index) => (
            <li
              key={index}
              onClick={() => setViewed([...viewed, n.ID])}
              style={{
                cursor: "pointer",
                fontWeight: viewed.includes(n.ID) ? "normal" : "bold",
                marginBottom: "5px",
              }}
            >
              {n.Type} - {n.Message}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;