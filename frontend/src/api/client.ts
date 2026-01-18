import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const { accessToken } = useAuthStore.getState();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (accessToken && !endpoint.includes('/public/')) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/')) {
      useAuthStore.getState().logout();
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  auth = {
    login: (email: string, password: string) =>
      this.post('/auth/login', { email, password }),
    refresh: (refreshToken: string) =>
      this.post('/auth/refresh', { refreshToken }),
    logout: () => this.post('/auth/logout'),
    me: () => this.get('/auth/me'),
  };

  collections = {
    list: () => this.get('/collections'),
    get: (id: string) => this.get(`/collections/${id}`),
    create: (data: any) => this.post('/collections', data),
    toggle: (id: string) => this.patch(`/collections/${id}/toggle`),
  };

  submissions = {
    list: (params?: { status?: string; collectionId?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return this.get(`/submissions${query ? `?${query}` : ''}`);
    },
    get: (id: string) => this.get(`/submissions/${id}`),
    approve: (id: string) => this.patch(`/submissions/${id}/approve`),
    reject: (id: string) => this.patch(`/submissions/${id}/reject`),
    stats: () => this.get('/submissions/stats/summary'),
  };

  public = {
    submit: (publicToken: string, formData: FormData) =>
      this.post(`/public/submit/${publicToken}`, formData),
    wall: (slug: string) => this.get(`/public/wall/${slug}`),
  };

  settings = {
    get: () => this.get('/settings'),
    update: (data: any) => this.put('/settings', data),
  };
}

export const apiClient = new ApiClient();
