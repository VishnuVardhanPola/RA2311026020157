
const log = async (stack, level, pkg, message) => {
  try {
    await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2cDA3NjZAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTY5NywiaWF0IjoxNzc3NzAwNzk3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiY2FkZDIxMTctZTEwZi00Y2Y5LWFlNzgtMDZmN2M3NDgwOGRkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaG51dmFyZGhhbiBwb2xhIiwic3ViIjoiMWZiMDdkYTQtYzRkMC00NGJlLWIwMjYtNmNhYTg3YmZmMDMxIn0sImVtYWlsIjoidnAwNzY2QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidmlzaG51dmFyZGhhbiBwb2xhIiwicm9sbE5vIjoicmEyMzExMDI2MDIwMTU3IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMWZiMDdkYTQtYzRkMC00NGJlLWIwMjYtNmNhYTg3YmZmMDMxIiwiY2xpZW50U2VjcmV0IjoiekJocGZKaGR1bk11dlpwRCJ9.zPk17WtLsRwjvuWNBMTuT-v0qJLdbINI4DcG1A9IoBI"
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: pkg,
        message: message
      })
    });
  } catch (error) {
    console.error("Logging failed:", error);
  }
};


const fetchNotifications = async (token) => {
  await log("frontend", "info", "api", "Fetching notifications");

  try {
    const res = await fetch(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    console.log("API RESPONSE:", data);

    await log("frontend", "info", "api", "Notifications fetched successfully");

    return data.notifications;

  } catch (error) {
    await log("frontend", "error", "api", "Failed to fetch notifications");
    throw error;
  }
};


const getPriority = (notification) => {
  let score = 0;

  if (notification.Type === "Placement") score += 5;
  else if (notification.Type === "Result") score += 4;
  else if (notification.Type === "Event") score += 3;
  else score += 1;

  const now = new Date();
  const time = new Date(notification.Timestamp);
  const diff = (now - time) / 1000;

  if (diff < 3600) score += 5;       // last 1 hour
  else if (diff < 86400) score += 3; // last 24 hours
  else score += 1;

  return score;
};


export const getTopNotifications = async (token) => {
  try {
    const notifications = await fetchNotifications(token);

    await log("frontend", "info", "utils", "Calculating priorities");

    const scored = notifications.map((n) => ({
      ...n,
      priority: getPriority(n)
    }));

    scored.sort((a, b) => b.priority - a.priority);

    const top10 = scored.slice(0, 10);

    await log("frontend", "info", "utils", "Top 10 notifications selected");

    return top10;

  } catch (error) {
    await log("frontend", "fatal", "utils", "System failed to process notifications");
    throw error;
  }
};