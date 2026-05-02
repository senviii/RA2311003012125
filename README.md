# Notification System – AffordMed Campus Hiring Evaluation

This repo contains my submission for the AffordMed Full Stack hiring assessment.

## What's inside

**logging_middleware** – A reusable Node.js logging package that sends structured logs to the evaluation server. Supports stack, level, package and message fields with built-in validation. Handles auth token fetching automatically.

**notification_app_be** – Express.js backend that fetches notifications from the evaluation API and serves them to the frontend. Supports filtering by type and pagination. Uses the logging middleware throughout.

**notification_app_fe** – React frontend built with Material UI. Has two pages — All Notifications and Priority Notifications. Tracks viewed vs unread notifications using localStorage. Fully responsive for both desktop and mobile.

## How to run

### Backend
```bash
cd notification_app_be
npm install
node index.js
```
Runs on http://localhost:3001

### Frontend
```bash
cd notification_app_fe
npm install
npm run dev
```
Runs on http://localhost:3000

### Logging Middleware
```bash
cd logging_middleware
npm install
node test.js
```

## Tech Stack

- Node.js + Express
- React 18 + Vite
- Material UI
- Axios
