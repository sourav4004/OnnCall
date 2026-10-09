import { ApiResponse } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // defaults to true unless explicitly disabled

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('oncall_auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('oncall_auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('oncall_auth_token');
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
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err);
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
