const { Log } = require("./index");

async function testLogger() {
  console.log("Testing Logging Middleware...\n");

  // Test 1: info log from controller
  await Log("backend", "info", "controller", "Notification service initialized successfully");

  // Test 2: debug log from db
  await Log("backend", "debug", "db", "Database connection established on port 5432");

  // Test 3: warn log from cache
  await Log("backend", "warn", "cache", "Cache miss for key: user_notifications_list");

  // Test 4: error log from domain
  await Log("backend", "error", "domain", "Notification delivery failed");

  // Test 5: fatal log from db
  await Log("backend", "fatal", "db", "Critical database connection failure");

  // Test 6: invalid stack (should fail gracefully)
  await Log("mobile", "info", "controller", "This should not be sent");

  console.log("\nAll tests complete.");
}

testLogger();