export const BACKEND_URL = 'http://127.0.0.1:8000';

export interface BackendUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: 'ASHA' | 'HOSPITAL' | 'DHO' | 'ADMIN' | string;
  village?: string | null;
  facility_name?: string | null;
}

export interface BackendLoginResponse {
  access_token: string;
  token_type: string;
  user: BackendUser;
}

export const mapBackendRole = (backendRole: string): 'asha' | 'phc_doctor' | 'district' => {
  switch (backendRole?.toUpperCase()) {
    case 'ASHA':
      return 'asha';
    case 'HOSPITAL':
      return 'phc_doctor';
    case 'DHO':
    case 'ADMIN':
      return 'district';
    default:
      return 'asha';
  }
};

export async function loginWithBackend(
  username: string,
  password: string
): Promise<BackendLoginResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password.trim(),
    }),
  });

  if (!response.ok) {
    let errorDetail = 'Login failed';
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  const data: BackendLoginResponse = await response.json();
  return data;
}

export interface BackendRegisterRequest {
  username: string;
  password: string;
  fullName?: string;
  phone?: string;
  role?: 'ASHA' | 'HOSPITAL';
  village?: string;
  facility_name?: string;
}

export async function registerWithBackend(
  payload: BackendRegisterRequest
): Promise<BackendUser> {
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = 'Registration failed';
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  const data: BackendUser = await response.json();
  return data;
}
