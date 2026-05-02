import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, ToggleButton, ToggleButtonGroup,
  CircularProgress, Alert, Slider, Chip
} from "@mui/material";
import NotificationCard from "../components/NotificationCard";

const TYPES = ["All", "Result", "Placement", "Event"];

export default function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewed, setViewed] = useState(() => {
    const saved = localStorage.getItem("viewed_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = { limit, page: 1 };
    if (filter !== "All") params.notification_type = filter;

    axios.get("http://localhost:3001/notifications", { params })
      .then(res => {
        setNotifications(res.data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notifications. Make sure the backend is running.");
        setLoading(false);
      });
  }, [filter, limit]);

  const markViewed = (id) => {
    if (!viewed.includes(id)) {
      const updated = [...viewed, id];
      setViewed(updated);
      localStorage.setItem("viewed_notifications", JSON.stringify(updated));
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="#1a237e">
  Priority Notifications
</Typography>
        <Typography variant="caption" color="text.secondary">
          Top {limit} notifications • click to mark as read
        </Typography>
      </Box>

      {/* Limit slider */}
      <Box sx={{ mb: 2, bgcolor: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Show top <Chip label={limit} size="small" color="primary" sx={{ fontWeight: 700 }} /> notifications
        </Typography>
        <Slider
          value={limit}
          onChange={(_, val) => setLimit(val)}
          min={1}
          max={20}
          step={1}
          marks={[{ value: 1, label: "1" }, { value: 10, label: "10" }, { value: 20, label: "20" }]}
          sx={{ color: "#1a237e" }}
        />
      </Box>

      {/* Filter */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, val) => { if (val) setFilter(val); }}
        sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
        size="small"
      >
        {TYPES.map(t => (
          <ToggleButton key={t} value={t} sx={{ borderRadius: "50px !important", fontWeight: 600, textTransform: "none", px: 2 }}>
            {t}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Content */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}
      {!loading && !error && notifications.map(n => (
        <NotificationCard
          key={n.ID}
          notification={n}
          viewed={viewed.includes(n.ID)}
          onView={() => markViewed(n.ID)}
        />
      ))}
    </Box>
  );
}