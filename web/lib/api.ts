// Centralized API Service for NirmayNet Web -> FastAPI Backend
// Configured for Next.js browser-safe REST integration

const BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:8000/api/v1';

/**
 * Standardizes API responses across the web application
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Safely retrieves JWT access token from browser localStorage.
 * Checks niramaynet_session first (used by NirmayNet authentication).
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const sessionKeys = ['niramaynet_session', 'session', 'token', 'access_token'];
    for (const key of sessionKeys) {
      const item = localStorage.getItem(key);
      if (!item) continue;

      if (item.startsWith('{')) {
        const parsed = JSON.parse(item);
        if (parsed.access_token) return parsed.access_token;
        if (parsed.token) return parsed.token;
      } else if (item.length > 10) {
        return item;
      }
    }
  } catch (error) {
    console.error('Failed to parse auth token from localStorage:', error);
  }
  return null;
};

/**
 * Core fetch wrapper with JWT authentication and JSON handling
 */
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const headers = new Headers(options.headers || {});

    // Set default Content-Type to JSON for requests with a body (unless FormData)
    if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Attach JWT Bearer token if available and not explicitly provided
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Ensure clean endpoint URL joining
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data: any = null;
    let error: string | null = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      if (data && typeof data === 'object') {
        if (typeof data.detail === 'string') {
          error = data.detail;
        } else if (Array.isArray(data.detail)) {
          error = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        } else if (typeof data.message === 'string') {
          error = data.message;
        } else {
          error = response.statusText || `Request failed with status ${response.status}`;
        }
      } else {
        error = response.statusText || `Request failed with status ${response.status}`;
      }
      return { data: null, error, status: response.status };
    }

    return { data, error: null, status: response.status };
  } catch (err: any) {
    console.error(`API Request failed for ${endpoint}:`, err);
    return {
      data: null,
      error: err?.message || 'Network error occurred',
      status: 0,
    };
  }
};

/**
 * Centralized API service object with real REST API methods.
 * Accepts optional _mockFallback parameter for backwards compatibility with legacy calls.
 */
export const api = {
  get: async <T>(endpoint: string, _mockFallback?: any, headers?: HeadersInit): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, { method: 'GET', headers });
  },

  post: async <T>(endpoint: string, body?: any, _mockFallback?: any, headers?: HeadersInit): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put: async <T>(endpoint: string, body?: any, _mockFallback?: any, headers?: HeadersInit): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'PUT',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch: async <T>(endpoint: string, body?: any, _mockFallback?: any, headers?: HeadersInit): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete: async <T>(endpoint: string, _mockFallback?: any, headers?: HeadersInit): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, { method: 'DELETE', headers });
  },
};
