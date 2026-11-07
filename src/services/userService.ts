import { apiRequest } from '@/src/api/client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const UserService = {
  /**
   * Get all users with pagination and filters
   */
  async getUsers(page = 1, limit = 50, filters?: { role?: string; status?: string }) {
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());

      if (filters?.role) query.append('role', filters.role);
      if (filters?.status) query.append('status', filters.status);

      const token = this._getToken();
      const response = await fetch(`${API_BASE}/users?${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    try {
      const token = this._getToken();
      const response = await fetch(`${API_BASE}/users/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  },

  /**
   * Create user
   */
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    status?: string;
    avatar?: string | null;
  }) {
    try {
      const token = this._getToken();
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create user');
    }
  },

  /**
   * Update user
   */
  async updateUser(id: string, userData: any) {
    try {
      const token = this._getToken();
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    }
  },

  /**
   * Delete user
   */
  async deleteUser(id: string) {
    try {
      const token = this._getToken();
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete user');
    }
  },

  /**
   * Helper: Get token from localStorage
   */
  _getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },
};