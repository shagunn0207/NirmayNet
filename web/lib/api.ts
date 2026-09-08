// Frontend API Service Mock Abstraction Layer
// Designed for seamless transition to backend REST / GraphQL endpoints later

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export const api = {
  get: async <T>(endpoint: string, mockFallback: T): Promise<ApiResponse<T>> => {
    return {
      data: mockFallback,
      error: null,
      status: 200,
    };
  },

  post: async <T>(endpoint: string, body: any, mockFallback: T): Promise<ApiResponse<T>> => {
    return {
      data: mockFallback,
      error: null,
      status: 201,
    };
  },

  put: async <T>(endpoint: string, body: any, mockFallback: T): Promise<ApiResponse<T>> => {
    return {
      data: mockFallback,
      error: null,
      status: 200,
    };
  },
};
