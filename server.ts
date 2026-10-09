import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CATEGORIES,
  INITIAL_PROFESSIONALS,
  INITIAL_ADDRESSES,
  INITIAL_BOOKINGS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
} from './src/mockData';
import { Booking, Address, ChatThread, AppNotification } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI Escape Codes for Rich Terminal Output
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

// In-Memory Database Store
let categories = [...INITIAL_CATEGORIES];
let professionals = [...INITIAL_PROFESSIONALS];
let addresses: Address[] = [...INITIAL_ADDRESSES];
let bookings: Booking[] = [...INITIAL_BOOKINGS];
let chats: ChatThread[] = [...INITIAL_CHATS];
let notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];
let isPartnerOnline = true;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // 1. API REQUEST & RESPONSE BUG DETECTION TERMINAL MIDDLEWARE
  app.use('/api', (req, res, next) => {
    // Skip noisy polling if any
    const startTime = process.hrtime.bigint();
    const timestamp = new Date().toLocaleTimeString();
    const method = req.method;
    const url = req.originalUrl;

    // Terminal Output: API Request Call
    console.log(
      `${ANSI.cyan}${ANSI.bold}📡 [API CALL INITIATED]${ANSI.reset} ` +
      `${ANSI.magenta}${ANSI.bold}${method}${ANSI.reset} ` +
      `${ANSI.white}${url}${ANSI.reset} ` +
      `${ANSI.dim}@ ${timestamp}${ANSI.reset}`
    );

    if (Object.keys(req.query).length > 0) {
      console.log(`   ${ANSI.yellow}↳ Query Params:${ANSI.reset}`, JSON.stringify(req.query));
    }
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      // Hide large passwords if any
      if (sanitizedBody.password) sanitizedBody.password = '***';
      console.log(`   ${ANSI.dim}↳ Request Body:${ANSI.reset}`, JSON.stringify(sanitizedBody));
    }

    // Capture response end for latency, status, and bug detection
    const originalEnd = res.end;
    let responseBody = '';

    const originalWrite = res.write;
    res.write = function (chunk: any, ...args: any[]) {
      if (chunk) {
        responseBody += chunk.toString();
      }
      return (originalWrite as any).apply(res, [chunk, ...args]);
    };

    res.end = function (chunk: any, ...args: any[]) {
      if (chunk) {
        responseBody += chunk.toString();
      }
      const endTime = process.hrtime.bigint();
      const latencyMs = Number(endTime - startTime) / 1_000_000;
      const formattedLatency = latencyMs < 1 ? latencyMs.toFixed(2) : Math.round(latencyMs).toString();
      const status = res.statusCode;

      if (status >= 200 && status < 300) {
        // Success terminal log
        console.log(
          `${ANSI.green}${ANSI.bold}✅ [API RESPONSE OK]${ANSI.reset} ` +
          `${ANSI.green}${status} ${method}${ANSI.reset} ` +
          `${ANSI.white}${url}${ANSI.reset} ` +
          `${ANSI.dim}(${formattedLatency}ms)${ANSI.reset}`
        );
      } else if (status >= 300 && status < 400) {
        console.log(
          `${ANSI.cyan}↪️  [API REDIRECT]${ANSI.reset} ` +
          `${status} ${method} ${url} (${formattedLatency}ms)`
        );
      } else {
        // BUG DETECTED: Status is 4xx or 5xx
        console.log(
          `\n${ANSI.bgRed}${ANSI.white}${ANSI.bold} 🚨 [BUG DETECTED IN API CALL] 🚨 ${ANSI.reset}\n` +
          `   ${ANSI.red}${ANSI.bold}Endpoint:${ANSI.reset} ${method} ${url}\n` +
          `   ${ANSI.yellow}${ANSI.bold}HTTP Status:${ANSI.reset} ${status}\n` +
          `   ${ANSI.dim}Duration:${ANSI.reset} ${formattedLatency}ms\n` +
          `   ${ANSI.yellow}Response Error:${ANSI.reset} ${responseBody.slice(0, 300)}\n` +
          `   ${ANSI.cyan}Diagnostic Hint:${ANSI.reset} Check request parameters or server route validation logic.\n` +
          `${ANSI.red}─────────────────────────────────────────────────────────────${ANSI.reset}`
        );
      }

      return (originalEnd as any).apply(res, [chunk, ...args]);
    };

    next();
  });

  // 2. CLIENT-FORWARDED TERMINAL LOGS & BUG REPORTS
  app.post('/api/dev/terminal-log', (req, res) => {
    const { type, method, endpoint, status, durationMs, timestamp, itemCount, body } = req.body;
    if (type === 'api_call') {
      console.log(
        `${ANSI.blue}[CLIENT -> TERMINAL]${ANSI.reset} ` +
        `🚀 Dispatching ${ANSI.bold}${method}${ANSI.reset} ${endpoint} ` +
        `${body ? `| Data: ${JSON.stringify(body).slice(0, 80)}` : ''}`
      );
    } else if (type === 'api_response') {
      console.log(
        `${ANSI.green}[CLIENT -> TERMINAL]${ANSI.reset} ` +
        `✨ Received response for ${method} ${endpoint} (status ${status}, took ${durationMs}ms, ${itemCount} items)`
      );
    }
    res.json({ success: true });
  });

  app.post('/api/dev/bug-report', (req, res) => {
    const { category, message, endpoint, method, status, error, context, suggestedFix, timestamp } = req.body;
    console.log(
      `\n${ANSI.bgRed}${ANSI.white}${ANSI.bold} 🐞 [CLIENT BUG DETECTED & REPORTED] 🐞 ${ANSI.reset}\n` +
      `   ${ANSI.red}${ANSI.bold}Category:${ANSI.reset} ${category}\n` +
      `   ${ANSI.red}${ANSI.bold}Message:${ANSI.reset}  ${message}\n` +
      (endpoint ? `   ${ANSI.cyan}${ANSI.bold}Route:${ANSI.reset}    ${method || 'GET'} ${endpoint} (Status: ${status || 'N/A'})\n` : '') +
      (context ? `   ${ANSI.yellow}${ANSI.bold}Context:${ANSI.reset}  ${JSON.stringify(context)}\n` : '') +
      (suggestedFix ? `   ${ANSI.green}${ANSI.bold}Suggested Fix:${ANSI.reset} ${suggestedFix}\n` : '') +
      (error?.stack ? `   ${ANSI.dim}${ANSI.bold}Stack Trace:\n${error.stack}${ANSI.reset}\n` : '') +
      `${ANSI.red}===================================================================${ANSI.reset}\n`
    );
    res.json({ success: true, acknowledged: true });
  });

  // TEST BUG DETECTION ENDPOINT: Simulates an API bug to demonstrate terminal reporting
  app.get('/api/v1/dev/simulate-bug', (req, res) => {
    console.log(`${ANSI.yellow}⚠️  Simulating a test API error to verify bug detection...${ANSI.reset}`);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Simulated server fault: Database connection timeout in order processing unit.',
      error: {
        code: 'SIMULATED_TEST_FAULT',
        details: 'This is a deliberate error used to verify automated terminal bug detection.',
      },
    });
  });

  // 3. REST API ENDPOINTS

  // Categories
  app.get('/api/v1/categories', (req, res) => {
    res.json({
      success: true,
      data: categories,
      message: 'Loaded categories successfully',
    });
  });

  // Professionals
  app.get('/api/v1/professionals', (req, res) => {
    const { category, search } = req.query;
    let list = [...professionals];

    if (category && category !== 'all') {
      list = list.filter((p) => p.catId === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: list,
      message: `Found ${list.length} verified professionals`,
    });
  });

  // Addresses
  app.get('/api/v1/addresses', (req, res) => {
    res.json({
      success: true,
      data: addresses,
    });
  });

  app.post('/api/v1/addresses', (req, res) => {
    const { label, type, line1, city, pincode } = req.body;
    if (!line1 || !city) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Validation failed: Address line1 and city are required.',
        error: { code: 'VALIDATION_ERROR', missingFields: ['line1', 'city'].filter((f) => !req.body[f]) },
      });
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: label || 'Home',
      type: type || 'home',
      line1,
      city,
      pincode: pincode || '110001',
    };
    addresses.unshift(newAddr);

    res.status(201).json({
      success: true,
      data: newAddr,
      message: 'Address saved successfully',
    });
  });

  // Bookings
  app.get('/api/v1/bookings', (req, res) => {
    res.json({
      success: true,
      data: bookings,
      message: `Loaded ${bookings.length} bookings`,
    });
  });

  app.post('/api/v1/bookings', (req, res) => {
    const payload = req.body;

    // Validate required fields
    const missing: string[] = [];
    if (!payload.catId) missing.push('catId');
    if (!payload.serviceId) missing.push('serviceId');
    if (!payload.proId) missing.push('proId');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Validation failed: missing required booking properties [${missing.join(', ')}]`,
        error: { code: 'INVALID_PAYLOAD', missingFields: missing },
      });
    }

    const bookingId = `OC-${Math.floor(10000 + Math.random() * 89999)}`;
    const newBooking: Booking = {
      ...payload,
      id: bookingId,
      status: 'confirmed',
      createdAt: 'Just now',
      timelineStep: 1,
    };

    bookings.unshift(newBooking);

    // Create confirmation notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Booking Confirmed!',
      description: `${newBooking.serviceName} with ${newBooking.proName} confirmed for ${newBooking.date}.`,
      timestamp: 'Just now',
      read: false,
      type: 'booking',
    };
    notifications.unshift(notif);

    res.status(201).json({
      success: true,
      data: newBooking,
      message: 'Booking confirmed successfully',
    });
  });

  app.patch('/api/v1/bookings/:id/cancel', (req, res) => {
    const { id } = req.params;
    const booking = bookings.find((b) => b.id === id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Booking with ID '${id}' was not found.`,
        error: { code: 'NOT_FOUND' },
      });
    }

    booking.status = 'cancelled';
    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully',
    });
  });

  app.post('/api/v1/bookings/:id/reviews', (req, res) => {
    const { id } = req.params;
    const { rating, note } = req.body;
    const booking = bookings.find((b) => b.id === id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Booking '${id}' not found.`,
      });
    }

    booking.ratingGiven = rating;
    booking.reviewNote = note;
    res.json({
      success: true,
      data: booking,
      message: 'Review recorded successfully',
    });
  });

  // Chats
  app.get('/api/v1/chats', (req, res) => {
    res.json({
      success: true,
      data: chats,
    });
  });

  app.get('/api/v1/chats/:proId/messages', (req, res) => {
    const { proId } = req.params;
    const thread = chats.find((c) => c.proId === proId);
    res.json({
      success: true,
      data: thread ? thread.messages : [],
    });
  });

  app.post('/api/v1/chats/:proId/messages', (req, res) => {
    const { proId } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Message text is required.',
      });
    }

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Just now',
    };

    let thread = chats.find((c) => c.proId === proId);
    if (thread) {
      thread.lastMessage = text;
      thread.lastTime = 'Just now';
      thread.messages.push(newMsg);
    } else {
      const pro = professionals.find((p) => p.id === proId);
      thread = {
        proId,
        proName: pro ? pro.name : 'Professional',
        proRole: pro ? pro.role : 'Technician',
        lastMessage: text,
        lastTime: 'Just now',
        unreadCount: 0,
        messages: [newMsg],
      };
      chats.unshift(thread);
    }

    res.status(201).json({
      success: true,
      data: thread,
      message: 'Message delivered',
    });
  });

  // Notifications
  app.get('/api/v1/notifications', (req, res) => {
    res.json({
      success: true,
      data: notifications,
    });
  });

  // Partner Operations
  app.patch('/api/v1/partners/status', (req, res) => {
    const { isOnline } = req.body;
    isPartnerOnline = Boolean(isOnline);
    res.json({
      success: true,
      data: { isOnline: isPartnerOnline },
      message: `Partner status updated to ${isPartnerOnline ? 'Online' : 'Offline'}`,
    });
  });

  app.post('/api/v1/partners/leads/:leadId/accept', (req, res) => {
    const { leadId } = req.params;
    res.json({
      success: true,
      data: { leadId, status: 'accepted' },
      message: `Lead ${leadId} accepted! Navigation dispatched.`,
    });
  });

  app.post('/api/v1/partners/leads/:leadId/decline', (req, res) => {
    const { leadId } = req.params;
    res.json({
      success: true,
      data: { leadId, status: 'declined' },
      message: `Lead ${leadId} declined.`,
    });
  });

  // 4. VITE MIDDLEWARES / STATIC ASSETS
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // 5. GLOBAL ERROR HANDLING CATCH-ALL (detects any unhandled server crash)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(
      `\n${ANSI.bgRed}${ANSI.white}${ANSI.bold} 💥 [UNHANDLED SERVER EXCEPTION DETECTED] 💥 ${ANSI.reset}\n` +
      `   ${ANSI.red}${ANSI.bold}Route:${ANSI.reset}   ${req.method} ${req.originalUrl}\n` +
      `   ${ANSI.red}${ANSI.bold}Error:${ANSI.reset}   ${err.message || String(err)}\n` +
      `   ${ANSI.yellow}${ANSI.bold}Stack:${ANSI.reset}   ${err.stack || 'No stack trace available'}\n` +
      `${ANSI.red}===================================================================${ANSI.reset}\n`
    );

    res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error: ' + (err.message || 'unknown error'),
      error: { code: 'INTERNAL_ERROR', details: err.message },
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `\n${ANSI.cyan}╔════════════════════════════════════════════════════════════════════════╗\n` +
      `║ ${ANSI.bold}🚀 OnnCall Full-Stack Server & Bug Detection Monitor Active${ANSI.cyan}            ║\n` +
      `║ ${ANSI.white}🌐 Port: ${PORT} (http://localhost:${PORT})${ANSI.cyan}                                       ║\n` +
      `║ ${ANSI.green}🔍 API Bug Detection & Terminal Telemetry: ENABLED${ANSI.cyan}                     ║\n` +
      `║ ${ANSI.yellow}📋 Real-time Terminal Logging for all API Calls & Responses active${ANSI.cyan}     ║\n` +
      `╚════════════════════════════════════════════════════════════════════════╝${ANSI.reset}\n`
    );
  });
}

startServer().catch((err) => {
  console.error(`${ANSI.bgRed}${ANSI.white} FATAL ERROR STARTING SERVER: ${ANSI.reset}`, err);
});
