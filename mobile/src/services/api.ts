// Centralized API Service for NirmayNet Mobile -> FastAPI Backend
// Configured to use native fetch and existing dependencies

// The API base URL from Expo environment variables (with a fallback for Vite/local dev if needed)
// @ts-ignore (to handle potential env type issues in mixed environments)
const BASE_URL = 
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) || 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 
  'http://127.0.0.1:8000/api/v1';

/**
 * Helper to retrieve the current JWT token from local storage.
 * The AppContext currently stores the user session in 'niramaynet_session'.
 */
const getAuthToken = (): string | null => {
  try {
    const sessionStr = localStorage.getItem('niramaynet_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      // Expected JWT from FastAPI login endpoint
      return session.access_token || null;
    }
  } catch (error) {
    console.error('Failed to parse session for token', error);
  }
  return null;
};

/**
 * Standardizes API responses
 */
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Core fetch wrapper with authentication and JSON handling
 */
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const headers = new Headers(options.headers || {});
    
    // Set default Content-Type to JSON if not explicitly provided
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Attach JWT Bearer token if available
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Ensure endpoint doesn't start with a slash if BASE_URL ends with one, or vice-versa
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data = null;
    let error = null;

    // Parse JSON response if available
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // Handle non-JSON responses gracefully
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      // Map FastAPI error details if present (usually {"detail": "..."})
      error = (data && data.detail) 
        ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail))
        : response.statusText;
      return { data: null, error, status: response.status };
    }

    return { data, error: null, status: response.status };

  } catch (err: any) {
    console.error(`API Request failed for ${endpoint}:`, err);
    return {
      data: null,
      error: err.message || 'Network error occurred',
      status: 0,
    };
  }
};

/**
 * Centralized API service object with specific HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, { 
      method: 'POST', 
      headers, 
      body: JSON.stringify(body) 
    }),

  put: <T>(endpoint: string, body: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, { 
      method: 'PUT', 
      headers, 
      body: JSON.stringify(body) 
    }),

  patch: <T>(endpoint: string, body: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, { 
      method: 'PATCH', 
      headers, 
      body: JSON.stringify(body) 
    }),

  delete: <T>(endpoint: string, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, { method: 'DELETE', headers }),
};
