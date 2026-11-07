const normalizeApiUrl = (rawUrl: string | undefined, fallback: string) => {
  if (!rawUrl) return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, '');
  if (/^\/\//.test(trimmed)) return `http:${trimmed}`.replace(/\/$/, '');
  if (/^:\d+(\/.*)?$/.test(trimmed)) return `http://localhost${trimmed}`.replace(/\/$/, '');
  if (/^[^:/]+(:\d+)?(\/.*)?$/.test(trimmed)) return `http://${trimmed}`.replace(/\/$/, '');
  return fallback;
};

const API_BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:5000/api');

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'API request failed';
    let errorData: any = null;

    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
      errorMessage = (typeof errorData === 'string' ? errorData : errorData?.message) || errorMessage;

      if (response.status === 403) {
        console.error('❌ Access Denied (403):', errorMessage);
        console.error('📋 Full error response:', errorData);
      } else if (response.status === 401) {
        console.error('❌ Unauthorized (401):', errorMessage);
      }
    } catch (parseError) {
      console.error('Could not parse error response:', parseError);
      errorMessage = `API Error (${response.status}): ${response.statusText}`;
    }

    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null as T;
}

const apiRequest = Object.assign(
  (endpoint: string, options: RequestInit = {}) => request(endpoint, options),
  {
    get<T = any>(endpoint: string, options: RequestInit = {}) {
      return request<T>(endpoint, { ...options, method: 'GET' });
    },
    post<T = any>(endpoint: string, body?: any, options: RequestInit = {}) {
      return request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    put<T = any>(endpoint: string, body?: any, options: RequestInit = {}) {
      return request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    patch<T = any>(endpoint: string, body?: any, options: RequestInit = {}) {
      return request<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    delete<T = any>(endpoint: string, options: RequestInit = {}) {
      return request<T>(endpoint, { ...options, method: 'DELETE' });
    },
  }
);

export { apiRequest };
export default apiRequest;
