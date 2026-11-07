import { apiRequest } from '../api/client';
import { USER_ROLES, isAccountOwner, resolveAccountType } from '../constants/roles';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Save auth data to localStorage & cookie for reliable persistence
 */
const saveAuthData = (token: string, user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    // 30 days session persistence so the user never gets logged out accidentally
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('tokenExpiry', expiryDate.toISOString());
    // Also save in cookie for SSR and middleware checks
    document.cookie = `authToken=${encodeURIComponent(token)}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `isLoggedIn=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
  }
};

/**
 * Clear auth data from localStorage and cookies
 */
const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('last_visited_crm_route');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
};

export const AuthService = {
  /**
   * User Signup
   */
  async signup(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    accountType?: string;
    role?: string;
    avatar?: string | null;
  }) {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const result = await response.json();

      if (result.success) {
        saveAuthData(result.data.token, result.data.user);
      }

      return result.data;
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  /**
   * User Login
   */
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();

      if (result.success) {
        saveAuthData(result.data.token, result.data.user);
      }

      return result.data;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Get Current User
   */
  async getCurrentUser(): Promise<any> {
    try {
      const token = this.getToken();

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE}/auth/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Do not aggressively clear auth data on network timeout or background server errors
        if (response.status === 401) {
          clearAuthData();
        }
        return null;
      }

      const result = await response.json();

      if (result.success) {
        // Update user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        return result.data.user;
      }

      return null;
    } catch (error) {
      // Don't wipe session on temporary offline/fetch errors
      return this.getUser();
    }
  },

  /**
   * Get Available Roles (both system and custom)
   */
  async getAvailableRoles(): Promise<any[]> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/roles?page=1&limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const result = await response.json();
      return result?.data?.roles || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  /**
   * Logout
   */
  async logout() {
    try {
      const token = this.getToken();

      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuthData();
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const expiry = localStorage.getItem('tokenExpiry');

      if (!token) return false;

      if (expiry) {
        const expiryDate = new Date(expiry);
        if (new Date() > expiryDate) {
          clearAuthData();
          return false;
        }
      }

      return true;
    }
    return false;
  },

  /**
   * Get Auth Token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  /**
   * Get Current User from localStorage
   */
  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  /**
   * Set Auth Data Manually
   */
  setAuthData(token: string, user: any) {
    saveAuthData(token, user);
  },

  /**
   * Refresh Token
   */
  async refreshToken() {
    try {
      const token = this.getToken();

      if (!token) {
        throw new Error('No token available');
      }

      const response = await fetch(`${API_BASE}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        clearAuthData();
        throw new Error('Token refresh failed');
      }

      const result = await response.json();

      if (result.success) {
        saveAuthData(result.data.token, this.getUser());
        return result.data.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      clearAuthData();
      throw error;
    }
  },

  /**
   * Check if user has specific role
   */
  hasRole(role: string | string[]): boolean {
    const user = this.getUser();
    const accountType = resolveAccountType(user);
    if (!user || !accountType) return false;

    if (isAccountOwner(accountType)) return true;

    if (typeof role === 'string') {
      return accountType === role;
    }

    return role.includes(accountType);
  },

  /**
   * Helper: Format role name
   */
  _formatRoleName(roleConstant: string): string {
    return roleConstant
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
};

