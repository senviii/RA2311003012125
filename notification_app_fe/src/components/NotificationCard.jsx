import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import FiberNewIcon from "@mui/icons-material/FiberNew";

const TYPE_COLORS = {
  Result:    { bg: "#f0fdf4", border: "#22c55e", chip: "success" },
  Placement: { bg: "#eff6ff", border: "#3b82f6", chip: "primary" },
  Event:     { bg: "#fefce8", border: "#eab308", chip: "warning" },
};

export default function NotificationCard({ notification, viewed, onView }) {
  const style = TYPE_COLORS[notification.Type] || { bg: "#f3f4f6", border: "#9ca3af", chip: "default" };

  return (
    <Card
      onClick={onView}
      sx={{
        mb: 1.5,
        borderLeft: `4px solid ${style.border}`,
        bgcolor: viewed ? "white" : style.bg,
        cursor: "pointer",
        transition: "all 0.2s",
        opacity: viewed ? 0.75 : 1,
        "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: "12px 16px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={notification.Type}
              color={style.chip}
              size="small"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
            {!viewed && (
              <FiberNewIcon sx={{ color: "#ef4444", fontSize: "1.1rem" }} />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {notification.Timestamp}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: viewed ? 400 : 600, color: "#1a1a2e", mt: 0.5 }}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.68rem" }}>
          ID: {notification.ID}
        </Typography>
      </CardContent>
    </Card>
  );
}