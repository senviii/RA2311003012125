import { Routes, Route, Navigate } from "react-router-dom";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/notifications" />} />
        <Route path="/notifications" element={<AllNotifications />} />
        <Route path="/priority" element={<PriorityNotifications />} />
      </Routes>
    </Box>
  );
}