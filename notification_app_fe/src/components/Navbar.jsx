import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1a237e", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 2, fontSize: "1rem", textTransform: "uppercase" }}>
          Notification Centre
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<NotificationsIcon />}
            onClick={() => navigate("/notifications")}
            sx={{
              color: "white",
              bgcolor: location.pathname === "/notifications" ? "rgba(255,255,255,0.15)" : "transparent",
              borderRadius: 1, fontWeight: 600, textTransform: "none", fontSize: "0.85rem"
            }}
          >
            All Notifications
          </Button>
          <Button
            startIcon={<StarIcon />}
            onClick={() => navigate("/priority")}
            sx={{
              color: "white",
              bgcolor: location.pathname === "/priority" ? "rgba(255,255,255,0.15)" : "transparent",
              borderRadius: 1, fontWeight: 600, textTransform: "none", fontSize: "0.85rem"
            }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}