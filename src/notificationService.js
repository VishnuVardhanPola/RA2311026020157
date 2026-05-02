const isBrowser = typeof window !== "undefined";

// Browser → use proxy
// Node → use full URL
const BASE_URL = isBrowser
  ? "/api"
  : "http://20.207.122.201";

const log = async (token, stack, level, pkg, message) => {
  try {
    await fetch(`${BASE_URL}/evaluation-service/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
};

const fetchNotifications = async (token) => {
  await log(token, "frontend", "info", "api", "Fetching notifications");

  try {
    const res = await fetch(
      `${BASE_URL}/evaluation-service/notifications`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    console.log("API RESPONSE:", data);

    await log(token, "frontend", "info", "api", "Notifications fetched");

    return data.notifications || [];
  } catch (error) {
    await log(token, "frontend", "error", "api", "Fetch failed");
    return [];
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

  if (diff < 3600) score += 5;
  else if (diff < 86400) score += 3;
  else score += 1;

  return score;
};

export const getTopNotifications = async (token) => {
  try {
    const notifications = await fetchNotifications(token);

    await log(token, "frontend", "info", "api", "Calculating priority");

    const scored = notifications.map((n) => ({
      ...n,
      priority: getPriority(n),
    }));

    scored.sort((a, b) => b.priority - a.priority);

    const top10 = scored.slice(0, 10);

    await log(token, "frontend", "info", "api", "Top notifications ready");

    return top10;
  } catch (error) {
    await log(token, "frontend", "fatal", "api", "Processing failed");
    return [];
  }
};