import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, ToggleButton, ToggleButtonGroup,
  Pagination, CircularProgress, Alert, Badge, Chip
} from "@mui/material";
import NotificationCard from "../components/NotificationCard";

const TYPES = ["All", "Result", "Placement", "Event"];
const PAGE_SIZE = 10;

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewed, setViewed] = useState(() => {
    const saved = localStorage.getItem("viewed_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = { limit: PAGE_SIZE, page };
    if (filter !== "All") params.notification_type = filter;

    axios.get("http://localhost:3001/notifications", { params })
      .then(res => {
        setNotifications(res.data.notifications || []);
        setTotal(res.data.total || res.data.notifications?.length || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notifications. Make sure the backend is running.");
        setLoading(false);
      });
  }, [filter, page]);

  const markViewed = (id) => {
    if (!viewed.includes(id)) {
      const updated = [...viewed, id];
      setViewed(updated);
      localStorage.setItem("viewed_notifications", JSON.stringify(updated));
    }
  };

  const unreadCount = notifications.filter(n => !viewed.includes(n.ID)).length;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
            <Typography variant="h5" fontWeight={700} color="#1a237e">
                All Notifications
            </Typography>
          <Typography variant="caption" color="text.secondary">
            {total} total • click to mark as read
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Chip
            label={`${unreadCount} new`}
            color="error"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        )}
      </Box>

      {/* Filter */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, val) => { if (val) { setFilter(val); setPage(1); } }}
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

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(total / PAGE_SIZE)}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}