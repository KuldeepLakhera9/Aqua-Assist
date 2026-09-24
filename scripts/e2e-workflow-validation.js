/**
 * Aqua-Assist NDMS — End-to-End System Testing & Live Workflow Validation
 * 
 * Executes full-stack validation across:
 * 1. System Health & Diagnostics
 * 2. Citizen Identity & Authentication
 * 3. Incident Reporting & Geolocation
 * 4. AI Multi-Source Verification Pipeline
 * 5. Municipality Moderation & Resource Dispatch
 * 6. National Admin Governance & Telemetry Analytics
 * 7. Early Warning Alert & SOS Broadcast
 * 8. Real-Time Socket.IO Telemetry
 * 9. Frontend Flagship & Client Availability
 */

const http = require("http");
const path = require("path");

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
};

const BASE_URL = process.env.API_URL || "http://localhost:5003";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Helper for HTTP requests
function request(urlStr, options = {}, payload = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      timeout: options.timeout || 12000,
    };

    if (payload && !reqOptions.headers["Content-Length"]) {
      reqOptions.headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = null;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json,
        });
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Request to ${urlStr} timed out`));
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

// Test runner state
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: [],
  startTime: Date.now(),
};

function startSuite(name) {
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} ▶ SUITE: ${name}${colors.reset}`);
  console.log(`${colors.cyan}──────────────────────────────────────────────────────────────────${colors.reset}`);
  stats.suites.push({ name, tests: [] });
}

async function runTest(testName, fn) {
  stats.total++;
  const t0 = Date.now();
  process.stdout.write(`  ${colors.gray}•${colors.reset} ${testName} ... `);
  try {
    const result = await fn();
    const duration = Date.now() - t0;
    stats.passed++;
    console.log(`${colors.green}✔ PASS${colors.reset} ${colors.gray}(${duration}ms)${colors.reset}`);
    stats.suites[stats.suites.length - 1].tests.push({
      name: testName,
      status: "PASS",
      duration,
      info: result,
    });
  } catch (err) {
    const duration = Date.now() - t0;
    stats.failed++;
    console.log(`${colors.red}✖ FAIL${colors.reset} ${colors.gray}(${duration}ms)${colors.reset}`);
    console.log(`    ${colors.red}Error: ${err.message}${colors.reset}`);
    stats.suites[stats.suites.length - 1].tests.push({
      name: testName,
      status: "FAIL",
      duration,
      error: err.message,
    });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

async function main() {
  console.log(`${colors.bold}${colors.magenta}╔══════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║      AQUA-ASSIST NATIONAL DISASTER MANAGEMENT SYSTEM (NDMS)      ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║       Phase 9: End-to-End System & Live Workflow Verification     ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}╚══════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`Target Backend  : ${colors.bold}${BASE_URL}${colors.reset}`);
  console.log(`Target Frontend : ${colors.bold}${FRONTEND_URL}${colors.reset}`);
  console.log(`Target Client   : ${colors.bold}${CLIENT_URL}${colors.reset}`);
  console.log(`Timestamp       : ${new Date().toISOString()}`);

  let citizenToken = "";
  let citizenUser = null;
  let adminToken = "";
  let adminUser = null;
  let municipalityToken = "";
  let municipalityUser = null;
  let createdReportId = "";
  let createdAlertId = "";

  // -------------------------------------------------------------
  // SUITE 1: System Health & Diagnostics
  // -------------------------------------------------------------
  startSuite("1. System Health & Infrastructure Diagnostics");

  await runTest("Express Backend /api/health responds with 200 OK", async () => {
    const res = await request(`${BASE_URL}/api/health`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.json && res.json.status === "OK", "Expected status 'OK'");
    assert(res.json.version, "Missing version field in health response");
    return `Status: ${res.json.status}, Version: ${res.json.version}`;
  });

  await runTest("CORS headers correctly allow Next.js frontend origin", async () => {
    const res = await request(`${BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const allowOrigin = res.headers["access-control-allow-origin"];
    assert(
      allowOrigin === "http://localhost:3000" || allowOrigin === "*",
      `Expected CORS allow origin for localhost:3000, got ${allowOrigin}`
    );
    return `Access-Control-Allow-Origin: ${allowOrigin}`;
  });

  // -------------------------------------------------------------
  // SUITE 2: Citizen Lifecycle & Identity Management
  // -------------------------------------------------------------
  startSuite("2. Citizen Identity, Registration & Token Lifecycle");

  const testCitizenEmail = `e2e.citizen.${Date.now()}@floodmanagement.gov.in`;
  const testCitizenPassword = "Password@123";

  await runTest("Register new citizen with location coordinates & phone", async () => {
    const payload = JSON.stringify({
      name: "Inspector Vikram Malhotra",
      email: testCitizenEmail,
      phone: "9" + String(Date.now()).slice(-9),
      password: testCitizenPassword,
      location: {
        coordinates: [77.2167, 28.6448],
        district: "Central Delhi",
        state: "Delhi",
        address: "Barakhamba Road, New Delhi",
      },
    });

    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, payload);
    assert(res.status === 201, `Registration failed with status ${res.status}: ${res.data}`);
    assert(res.json && res.json.token, "Token missing in register response");
    assert(res.json.user && res.json.user.role === "citizen", "User role should be citizen");
    citizenToken = res.json.token;
    citizenUser = res.json.user;
    return `User: ${citizenUser.name} (${citizenUser.id})`;
  });

  await runTest("Citizen login with valid credentials yields valid JWT", async () => {
    const payload = JSON.stringify({
      email: testCitizenEmail,
      password: testCitizenPassword,
    });

    const res = await request(`${BASE_URL}/api/auth/login`, { method: "POST" }, payload);
    assert(res.status === 200, `Login failed with status ${res.status}: ${res.data}`);
    assert(res.json && res.json.token, "Token missing in login response");
    citizenToken = res.json.token;
    return `Token length: ${citizenToken.length} chars`;
  });

  await runTest("GET /api/auth/me authenticates Bearer token", async () => {
    const res = await request(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert(res.status === 200, `Auth check failed with status ${res.status}`);
    const u = res.json.user || res.json;
    assert(u.email === testCitizenEmail.toLowerCase(), `Email mismatch: ${u.email}`);
    return `Authenticated: ${u.name}, Role: ${u.role}`;
  });

  // -------------------------------------------------------------
  // SUITE 3: Citizen Incident Reporting & Telemetry
  // -------------------------------------------------------------
  startSuite("3. Incident Reporting, Telemetry & Public Feed");

  await runTest("Citizen creates verified geospatial flood report", async () => {
    const payload = JSON.stringify({
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        district: "New Delhi",
        state: "Delhi",
        address: "Yamuna Floodplain Sector 12, Ring Road",
      },
      severity: "high",
      waterLevel: "rising",
      depth: 1.85,
      description: "Severe urban flood surge observed along Yamuna embankment. Water levels rising rapidly past arterial drainage culverts.",
    });

    const res = await request(
      `${BASE_URL}/api/flood-reports`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${citizenToken}` },
      },
      payload
    );

    assert(res.status === 201, `Create report failed with ${res.status}: ${res.data}`);
    assert(res.json && res.json._id, "Missing report _id");
    assert(res.json.severity === "high", "Severity mismatch");
    assert(res.json.verificationStatus === "pending", "Initial status must be pending");
    createdReportId = res.json._id;
    return `Report ID: ${createdReportId}, Severity: ${res.json.severity}`;
  });

  await runTest("Public flood report endpoint retrieves report by ID", async () => {
    const res = await request(`${BASE_URL}/api/flood-reports/public/${createdReportId}`);
    assert(res.status === 200, `Public report fetch failed with ${res.status}`);
    assert(res.json && res.json._id === createdReportId, "Fetched report ID mismatch");
    return `Retrieved: ${res.json.location.address}`;
  });

  // -------------------------------------------------------------
  // SUITE 4: AI Multi-Source Verification Pipeline
  // -------------------------------------------------------------
  startSuite("4. AI Multi-Source Automated Verification Pipeline");

  // First authenticate national admin
  await runTest("Authenticate National Admin (admin@floodmanagement.com)", async () => {
    const payload = JSON.stringify({
      email: "admin@floodmanagement.com",
      password: "admin123",
    });

    const res = await request(`${BASE_URL}/api/auth/login`, { method: "POST" }, payload);
    assert(res.status === 200, `Admin login failed: ${res.data}`);
    assert(res.json && res.json.token, "Admin token missing");
    adminToken = res.json.token;
    adminUser = res.json.user;
    return `Admin authenticated: ${adminUser.name || "Administrator"}`;
  });

  await runTest("Trigger automated AI verification on flood report", async () => {
    const res = await request(
      `${BASE_URL}/api/verification/verify/${createdReportId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    assert(res.status === 200, `AI verification failed with status ${res.status}: ${res.data}`);
    assert(res.json && res.json.details, "Verification details missing in response");
    const { weather, news, social } = res.json.details;
    assert(weather && weather.status, "Weather verification status missing");
    assert(news && news.status, "News verification status missing");
    assert(social && social.status, "Social verification status missing");

    return `AI Overall: ${res.json.status}, Weather: ${weather.status}, News: ${news.status}, Social: ${social.status}`;
  });

  // -------------------------------------------------------------
  // SUITE 5: Authority Moderation & Resolution
  // -------------------------------------------------------------
  startSuite("5. Municipal Authority Governance & Moderation");

  await runTest("Authenticate Municipality (mumbai.municipality@floodmanagement.com)", async () => {
    const payload = JSON.stringify({
      email: "mumbai.municipality@floodmanagement.com",
      password: "mumbai123",
    });

    const res = await request(`${BASE_URL}/api/auth/login`, { method: "POST" }, payload);
    assert(res.status === 200, `Municipality login failed: ${res.data}`);
    assert(res.json && res.json.token, "Municipality token missing");
    municipalityToken = res.json.token;
    municipalityUser = res.json.user;
    return `Municipality: ${municipalityUser.name || "Mumbai Cell"}`;
  });

  await runTest("Authority moderates report to 'verified' with official audit notes", async () => {
    const payload = JSON.stringify({
      status: "verified",
      reason: "Field inspection crew Bravo-4 dispatched. Verified water level 1.85m at culvert.",
    });

    const res = await request(
      `${BASE_URL}/api/flood-reports/${createdReportId}/status`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      payload
    );

    assert(res.status === 200, `Status update failed with ${res.status}: ${res.data}`);
    return `Report ${createdReportId} verified by Authority`;
  });

  await runTest("Fetch National Administrative Statistics (/api/admin/stats)", async () => {
    const res = await request(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(res.status === 200, `Admin stats failed: ${res.status}`);
    const sys = res.json?.data?.system || res.json?.systemHealth;
    assert(sys, "Missing system in stats response");
    return `Uptime: ${Math.round(sys.uptime)}s, DB Connected: ${sys.dbConnected}`;
  });

  // -------------------------------------------------------------
  // SUITE 6: Early Warning Alert & SOS Broadcast
  // -------------------------------------------------------------
  startSuite("6. Early Warning Alert Broadcast & Disaster Feeds");

  await runTest("Authority broadcasts High-Severity Flood Warning Alert", async () => {
    const payload = JSON.stringify({
      title: "🚨 URGENT: Yamuna River Overflow Alert",
      message: "River discharge exceeded 2.5 lakh cusecs. Immediate evacuation recommended for low-lying sectors.",
      alertType: "warning",
      severity: "critical",
      priority: 9,
      targetArea: {
        type: "Polygon",
        coordinates: [
          [
            [77.10, 28.50],
            [77.30, 28.50],
            [77.30, 28.70],
            [77.10, 28.70],
            [77.10, 28.50],
          ],
        ],
        districts: ["New Delhi"],
        states: ["Delhi"],
      },
      validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    });

    const res = await request(
      `${BASE_URL}/api/alerts`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      payload
    );

    assert(res.status === 201, `Alert creation failed with ${res.status}: ${res.data}`);
    assert(res.json && res.json.alert, "Missing alert object in response");
    createdAlertId = res.json.alert._id;
    return `Alert ID: ${createdAlertId}, Severity: ${res.json.alert.severity}`;
  });

  await runTest("Active alerts feed reflects broadcasted warning", async () => {
    const res = await request(`${BASE_URL}/api/alerts/active`);
    assert(res.status === 200, `Active alerts failed with ${res.status}`);
    assert(Array.isArray(res.json.alerts), "Alerts must be an array");
    const found = res.json.alerts.some((a) => a._id === createdAlertId);
    assert(found, `Broadcasted alert ${createdAlertId} not found in active list`);
    return `Active Alerts Count: ${res.json.count}, Target Alert confirmed`;
  });

  // -------------------------------------------------------------
  // SUITE 7: Real-Time Socket.IO Telemetry
  // -------------------------------------------------------------
  startSuite("7. Real-Time Socket.IO Telemetry & Emergency SOS");

  await runTest("Connect Socket.IO client, join location room, and transmit telemetry", async () => {
    let ioClient;
    try {
      ioClient = require("../client/node_modules/socket.io-client");
    } catch {
      try {
        ioClient = require("../frontend/node_modules/socket.io-client");
      } catch (e) {
        throw new Error("socket.io-client module not found in client or frontend node_modules");
      }
    }

    const socket = ioClient(BASE_URL, {
      transports: ["websocket", "polling"],
      timeout: 5000,
      reconnection: false,
    });

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.disconnect();
        reject(new Error("Socket.IO connection timeout after 5000ms"));
      }, 5000);

      socket.on("connect", () => {
        clearTimeout(timer);
        // Join room
        socket.emit("join-location", { state: "Delhi", district: "New Delhi" });

        // Emit simulated SOS
        socket.emit("emergency-sos", {
          state: "Delhi",
          district: "New Delhi",
          location: { address: "Yamuna Embankment Pier 4", latitude: 28.6139, longitude: 77.2090 },
          userId: citizenUser ? citizenUser.id : "simulated-citizen",
        });

        // Small delay to allow server processing
        setTimeout(() => {
          socket.disconnect();
          resolve();
        }, 500);
      });

      socket.on("connect_error", (err) => {
        clearTimeout(timer);
        socket.disconnect();
        reject(new Error(`Socket connection error: ${err.message}`));
      });
    });

    return "Socket.IO connected, room joined, telemetry emitted, disconnected cleanly";
  });

  // -------------------------------------------------------------
  // SUITE 8: Frontend Portals Availability
  // -------------------------------------------------------------
  startSuite("8. Frontend Portals Live HTTP Availability");

  await runTest("Flagship Next.js Portal (http://localhost:3000) returns 200 OK", async () => {
    const res = await request(`${FRONTEND_URL}/`, { timeout: 8000 });
    assert(res.status === 200, `Next.js root returned ${res.status}`);
    assert(res.data.includes("<!DOCTYPE html>"), "Next.js did not return HTML doctype");
    return `HTTP ${res.status}, Payload: ${res.data.length} bytes`;
  });

  await runTest("Flagship Next.js Auth Route (http://localhost:3000/login) returns 200 OK", async () => {
    const res = await request(`${FRONTEND_URL}/login`, { timeout: 8000 });
    assert(res.status === 200, `Next.js /login returned ${res.status}`);
    return `HTTP ${res.status}, Next.js App Router login ready`;
  });

  await runTest("React Vite Client (http://localhost:5173) returns 200 OK", async () => {
    const res = await request(`${CLIENT_URL}/`, { timeout: 8000 });
    assert(res.status === 200, `Vite client returned ${res.status}`);
    return `HTTP ${res.status}, Vite SPA client ready`;
  });

  // -------------------------------------------------------------
  // EXECUTIVE SUMMARY REPORT
  // -------------------------------------------------------------
  const totalDuration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.green}           PHASE 9: END-TO-END VALIDATION EXECUTIVE REPORT         ${colors.reset}`);
  console.log(`${colors.cyan}══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  Total Test Scenarios  : ${colors.bold}${stats.total}${colors.reset}`);
  console.log(`  Passed Scenarios      : ${colors.bold}${colors.green}${stats.passed} ✔${colors.reset}`);
  console.log(`  Failed Scenarios      : ${colors.bold}${stats.failed > 0 ? colors.red : colors.green}${stats.failed} ✖${colors.reset}`);
  console.log(`  Total Execution Time  : ${colors.bold}${totalDuration}s${colors.reset}`);
  console.log(`${colors.cyan}──────────────────────────────────────────────────────────────────${colors.reset}`);

  if (stats.failed === 0) {
    console.log(`${colors.bold}${colors.green}  STATUS: ALL END-TO-END INTEGRATION FLOWS VERIFIED SUCCESSFULLY.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.bold}${colors.red}  STATUS: INTEGRATION FAILURES DETECTED. INSPECT LOGS ABOVE.${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  process.exit(1);
});
