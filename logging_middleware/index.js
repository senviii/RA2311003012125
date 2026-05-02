const axios = require("axios");

const BASE_URL = "http://20.207.122.201/evaluation-service";

const CLIENT_ID = "e94f6b4d-2921-47dd-8234-d56c787705f4";
const CLIENT_SECRET = "BqsQahdvNkjdtbHr";
const EMAIL = "sm9511@srmist.edu.in";
const NAME = "Saanvi Mahika";
const ROLL_NO = "RA2311003012125";
const ACCESS_CODE = "QkbpxH";

const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = ["cache", "controller", "cron_job", "db", "domain"];

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

async function Log(stack, level, packageName, message) {
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[Logger] Invalid stack: "${stack}"`); return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[Logger] Invalid level: "${level}"`); return;
  }
  if (!VALID_PACKAGES.includes(packageName)) {
    console.error(`[Logger] Invalid package: "${packageName}"`); return;
  }
  if (!message || typeof message !== "string") {
    console.error(`[Logger] Message must be a non-empty string.`); return;
  }

  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/logs`, {
      stack, level, package: packageName, message
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(`[Logger] ✓ [${stack}/${level}/${packageName}]: ${message}`);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data || error.message;
    console.error(`[Logger] ✗ Failed (${status}): ${JSON.stringify(msg)}`);
  }
}

module.exports = { Log };