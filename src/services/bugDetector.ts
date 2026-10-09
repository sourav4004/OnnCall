/**
 * OnnCall Bug Detection & Terminal Telemetry System
 * 
 * Provides automated bug detection, API request/response logging,
 * payload validation, latency monitoring, and terminal forwarding.
 */

export interface BugReport {
  category: 'API_ERROR' | 'NETWORK_FAILURE' | 'SCHEMA_MISMATCH' | 'RUNTIME_EXCEPTION' | 'SLOW_API';
  message: string;
  endpoint?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  payload?: any;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
  context?: Record<string, any>;
  suggestedFix?: string;
}

class BugDetector {
  private isInitialized = false;
  private pendingLogs: Array<() => Promise<void>> = [];
  private isFlushing = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Listen for uncaught JavaScript runtime exceptions
    window.addEventListener('error', (event) => {
      this.reportRuntimeBug({
        message: event.message || 'Unknown runtime error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // 2. Listen for unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;

      this.reportBug({
        category: 'RUNTIME_EXCEPTION',
        message: `Unhandled Promise Rejection: ${message}`,
        error: {
          name: reason instanceof Error ? reason.name : 'UnhandledRejection',
          message,
          stack,
        },
        suggestedFix: 'Wrap async promise calls with try/catch or attach a .catch() handler.',
      });
    });

    console.log(
      '%c[BUG DETECTOR INITIALIZED] %cMonitoring API requests, responses, latencies, and uncaught exceptions.',
      'background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: #3b82f6;'
    );
  }

  /**
   * Log an outgoing API call to both terminal and browser console
   */
  logApiCall(method: string, endpoint: string, body?: any) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `%c[API CALL] 🚀 %c${method.toUpperCase()} %c${endpoint} %c@ ${timestamp}`,
      'color: #06b6d4; font-weight: bold;',
      'color: #3b82f6; font-weight: bold;',
      'color: #e2e8f0;',
      'color: #94a3b8;'
    );
    if (body) {
      console.log('   📦 Request Payload:', body);
    }

    // Forward to backend terminal logger
    this.sendTerminalLog({
      type: 'api_call',
      method: method.toUpperCase(),
      endpoint,
      timestamp,
      body,
    });
  }

  /**
   * Log a successful API response with latency metrics
   */
  logApiResponse(method: string, endpoint: string, status: number, durationMs: number, data?: any) {
    const isSlow = durationMs > 1200;
    const badgeColor = isSlow ? 'color: #f59e0b;' : 'color: #10b981;';
    const timestamp = new Date().toLocaleTimeString();

    console.log(
      `%c[API RESPONSE] ${isSlow ? '⚠️' : '✅'} %c${status} ${method.toUpperCase()} %c${endpoint} %c(${durationMs}ms) @ ${timestamp}`,
      badgeColor + ' font-weight: bold;',
      'color: #10b981; font-weight: bold;',
      'color: #e2e8f0;',
      'color: #94a3b8;'
    );

    if (isSlow) {
      this.reportBug({
        category: 'SLOW_API',
        method: method.toUpperCase(),
        endpoint,
        status,
        durationMs,
        message: `API response took ${durationMs}ms which exceeds the 1200ms latency budget.`,
        suggestedFix: 'Optimize server query or check database indexes / payload size.',
      });
    }

    // Forward to backend terminal logger
    this.sendTerminalLog({
      type: 'api_response',
      method: method.toUpperCase(),
      endpoint,
      status,
      durationMs,
      timestamp,
      itemCount: Array.isArray(data) ? data.length : data ? 1 : 0,
    });
  }

  /**
   * Detect and report an API bug or failure
   */
  reportApiBug(method: string, endpoint: string, error: any, context?: any) {
    const status = error.status || (error.response && error.response.status) || 500;
    const errorMessage = error.message || String(error);
    const category = status === 0 ? 'NETWORK_FAILURE' : 'API_ERROR';

    let suggestedFix = 'Check backend terminal logs for detailed stack trace.';
    if (status === 404) {
      suggestedFix = `Verify route '${endpoint}' is declared in server.ts and matches expected path.`;
    } else if (status === 400) {
      suggestedFix = 'Inspect request body parameters for missing required fields or type mismatches.';
    } else if (status === 401 || status === 403) {
      suggestedFix = 'Verify auth bearer token in request headers or refresh user session.';
    } else if (status >= 500) {
      suggestedFix = 'Server-side exception caught. Inspect server.ts route handler.';
    }

    const report: BugReport = {
      category,
      method: method.toUpperCase(),
      endpoint,
      status,
      message: errorMessage,
      error: {
        name: error.name || 'ApiError',
        message: errorMessage,
        stack: error.stack,
      },
      context,
      suggestedFix,
    };

    this.reportBug(report);
  }

  /**
   * Report schema mismatch bugs (e.g. unexpected null or missing expected fields)
   */
  reportSchemaMismatch(endpoint: string, expectedField: string, actualValue: any) {
    this.reportBug({
      category: 'SCHEMA_MISMATCH',
      endpoint,
      message: `API response schema mismatch: missing expected field '${expectedField}' (received: ${JSON.stringify(actualValue)})`,
      suggestedFix: `Update endpoint ${endpoint} to ensure '${expectedField}' is always present in response envelope.`,
    });
  }

  /**
   * Report an uncaught client runtime bug
   */
  private reportRuntimeBug(info: { message: string; filename?: string; lineno?: number; colno?: number; error?: Error }) {
    this.reportBug({
      category: 'RUNTIME_EXCEPTION',
      message: info.message,
      context: {
        file: info.filename,
        line: info.lineno,
        column: info.colno,
      },
      error: {
        name: info.error?.name || 'RuntimeError',
        message: info.message,
        stack: info.error?.stack,
      },
      suggestedFix: info.filename
        ? `Check ${info.filename}:${info.lineno} for null reference, undefined access, or unhandled prop.`
        : 'Inspect stack trace to pinpoint the offending component or hook.',
    });
  }

  /**
   * Core bug reporter: logs prominently to console and transmits to server terminal
   */
  reportBug(report: BugReport) {
    // 1. Prominent Browser Console Alert
    console.group(
      `%c🚨 [BUG DETECTED] ${report.category}: ${report.message}`,
      'background: #ef4444; color: #fff; font-weight: bold; padding: 3px 8px; border-radius: 4px;'
    );
    if (report.endpoint) console.log(`📍 Endpoint:`, `${report.method || 'GET'} ${report.endpoint}`);
    if (report.status) console.log(`⚡ Status Code:`, report.status);
    if (report.suggestedFix) console.log(`🛠️ Suggested Fix:`, report.suggestedFix);
    if (report.error?.stack) console.log(`📋 Stack Trace:\n`, report.error.stack);
    if (report.context) console.log(`🔍 Context:`, report.context);
    console.groupEnd();

    // 2. Dispatch to Server Terminal
    this.sendBugReportToServer(report);
  }

  private sendTerminalLog(logData: any) {
    this.queueLog(async () => {
      try {
        await fetch('/api/dev/terminal-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        });
      } catch {
        // Silently ignore terminal forwarding failure to avoid recursion
      }
    });
  }

  private sendBugReportToServer(report: BugReport) {
    this.queueLog(async () => {
      try {
        await fetch('/api/dev/bug-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...report,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          }),
        });
      } catch {
        // Silently ignore to avoid recursion
      }
    });
  }

  private queueLog(fn: () => Promise<void>) {
    this.pendingLogs.push(fn);
    if (!this.isFlushing) {
      this.flushLogs();
    }
  }

  private async flushLogs() {
    this.isFlushing = true;
    while (this.pendingLogs.length > 0) {
      const task = this.pendingLogs.shift();
      if (task) {
        try {
          await task();
        } catch {}
      }
    }
    this.isFlushing = false;
  }
}

export const bugDetector = new BugDetector();
