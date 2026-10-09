import { ApiResponse } from '../types';
import { bugDetector } from './bugDetector';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'; // Defaults to false to use full-stack Express API with terminal bug detection

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('oncall_auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('oncall_auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('oncall_auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const method = options.method || 'GET';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    let parsedBody: any = undefined;
    if (options.body && typeof options.body === 'string') {
      try {
        parsedBody = JSON.parse(options.body);
      } catch {
        parsedBody = options.body;
      }
    }

    // 1. Notify Bug Detector of API call initiation
    bugDetector.logApiCall(method, cleanEndpoint, parsedBody);

    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const durationMs = Math.round(
        (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime
      );

      let data: ApiResponse<T>;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : { success: response.ok, data: null as any };
      } catch (parseErr: any) {
        // Bug detected: Server did not return valid JSON
        bugDetector.reportApiBug(method, cleanEndpoint, {
          name: 'InvalidJsonError',
          message: `Endpoint returned invalid JSON: ${text.slice(0, 100)}`,
          status: response.status,
        }, { rawResponse: text.slice(0, 200) });

        throw new Error(`API response was not valid JSON (HTTP ${response.status})`);
      }

      if (!response.ok) {
        const errorMsg = data.message || `API request failed with status ${response.status}`;
        const errorObj = {
          name: 'HttpError',
          message: errorMsg,
          status: response.status,
          details: data.error,
        };

        // Bug detected: HTTP Error 4xx/5xx
        bugDetector.reportApiBug(method, cleanEndpoint, errorObj, {
          requestBody: parsedBody,
          responseBody: data,
        });

        return {
          success: false,
          data: null as any,
          message: errorMsg,
          error: {
            code: `HTTP_${response.status}`,
            message: errorMsg,
          },
        };
      }

      // Check for expected response envelope
      if (typeof data.success !== 'boolean') {
        bugDetector.reportSchemaMismatch(cleanEndpoint, 'success (boolean)', data);
      }

      // Log successful API call with metrics
      bugDetector.logApiResponse(method, cleanEndpoint, response.status, durationMs, data.data);
      return data;
    } catch (err: any) {
      const durationMs = Math.round(
        (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime
      );

      // Bug detected: Network failure or unhandled exception
      bugDetector.reportApiBug(method, cleanEndpoint, {
        name: err.name || 'NetworkError',
        message: err.message || 'Network connection failed',
        stack: err.stack,
        status: 0,
        durationMs,
      }, { url, requestBody: parsedBody });

      return {
        success: false,
        data: null as any,
        message: err.message || 'Network connection failed',
        error: {
          code: 'NETWORK_ERROR',
          message: err.message,
        },
      };
    }
  }

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
