const express = require("express");
const axios = require("axios");
const { Log } = require("../logging_middleware/index");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "http://20.207.122.201/evaluation-service";
const CLIENT_ID = "e94f6b4d-2921-47dd-8234-d56c787705f4";
const CLIENT_SECRET = "BqsQahdvNkjdtbHr";
const EMAIL = "sm9511@srmist.edu.in";
const NAME = "Saanvi Mahika";
const ROLL_NO = "RA2311003012125";
const ACCESS_CODE = "QkbpxH";

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await axios.post(`${BASE_URL}/auth`, {
    email: EMAIL,
    name: NAME,
    rollNo: ROLL_NO,
    accessCode: ACCESS_CODE,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });
  cachedToken = res.data.access_token;
  return cachedToken;
}

// GET /notifications - fetch all notifications from evaluation server
app.get("/notifications", async (req, res) => {
  await Log("backend", "info", "controller", "GET /notifications called");
  try {
    const token = await getToken();
    await Log("backend", "debug", "controller", "Token fetched successfully");

    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    await Log("backend", "info", "controller", "Notifications fetched successfully");
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const msg = error.response?.data?.message || error.message;
    await Log("backend", "error", "controller", `Failed to fetch notifications`);
    return res.status(status).json({ error: msg });
  }
});

// GET /notifications/:type - filter by type (Result, Placement, Event)
app.get("/notifications/:type", async (req, res) => {
  const { type } = req.params;
  await Log("backend", "info", "controller", `GET /notifications/${type} called`);
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const filtered = response.data.notifications.filter(
      n => n.Type.toLowerCase() === type.toLowerCase()
    );

    await Log("backend", "info", "controller", `Filtered notifications by type`);
    return res.status(200).json({ notifications: filtered });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    await Log("backend", "error", "controller", `Filter notifications failed`);
    return res.status(500).json({ error: msg });
  }
});

// Health check
app.get("/health", async (req, res) => {
  await Log("backend", "debug", "controller", "Health check passed");
  return res.status(200).json({ status: "ok", service: "notification_app_be" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await Log("backend", "info", "controller", `Server started on port ${PORT}`);
  console.log(`Notification backend running on http://localhost:${PORT}`);
});