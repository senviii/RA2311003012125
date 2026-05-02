import { useState, useEffect } from "react";
import axios from "axios";

const TYPE_STYLES = {
  Result:    { bg: "#f0fdf4", color: "#14532d", dot: "#22c55e" },
  Placement: { bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  Event:     { bg: "#fef9c3", color: "#713f12", dot: "#eab308" },
};

const FILTERS = ["All", "Result", "Placement", "Event"];

function NotificationCard({ n }) {
  const style = TYPE_STYLES[n.Type] || { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" };
  return (
    <div style={{
      background: "white", borderRadius: "12px", padding: "1rem 1.2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: "0.75rem",
      borderLeft: `4px solid ${style.dot}`, animation: "fadeUp 0.3s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <span style={{
          background: style.bg, color: style.color, fontSize: "0.72rem",
          fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "50px"
        }}>{n.Type}</span>
        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{n.Timestamp}</span>
      </div>
      <div style={{ fontSize: "0.92rem", fontWeight: 500, color: "#1a1a2e" }}>{n.Message}</div>
      <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "0.3rem" }}>ID: {n.ID}</div>
    </div>
  );
}

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/notifications")
      .then(res => {
        setNotifications(res.data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notifications. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const filtered = filter === "All" ? notifications : notifications.filter(n => n.Type === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "white", padding: "1.2rem 1.5rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "1.5rem"
      }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          🔔 Notifications
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: "0.2rem 0 0" }}>
          {notifications.length} total notifications
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", overflowX: "auto" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "0.4rem 1rem", borderRadius: "50px", border: "none", cursor: "pointer",
              background: filter === f ? "#2980b9" : "white",
              color: filter === f ? "white" : "#374151",
              fontSize: "0.8rem", fontWeight: 500, fontFamily: "inherit",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)", whiteSpace: "nowrap"
            }}>{f}</button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
            <div style={{
              width: 28, height: 28, border: "3px solid #e5e7eb",
              borderTopColor: "#2980b9", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem"
            }} />
            Loading notifications...
          </div>
        )}

        {error && (
          <div style={{
            background: "#fee2e2", color: "#b91c1c", padding: "1rem",
            borderRadius: "10px", fontSize: "0.85rem"
          }}>{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
            No notifications found.
          </div>
        )}

        {!loading && !error && filtered.map(n => <NotificationCard key={n.ID} n={n} />)}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}