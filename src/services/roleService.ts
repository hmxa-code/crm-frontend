import { apiRequest } from '../api/client';

export const RoleService = {
  /**
   * Get all roles (system + custom)
   */
  async getRoles(page = 1, limit = 50) {
    return await apiRequest(`/roles?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  },

  /**
   * Get only custom roles
   */
  async getSystemRoles() {
    return await apiRequest('/roles?page=1&limit=100', { method: 'GET' });
  },

  /**
   * Get role by ID
   */
  async getRoleById(id: string) {
    return await apiRequest(`/roles/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create custom role
   */
  async createRole(roleData: {
    role_name: string;
    description?: string;
    permissions?: string[];
    status?: number;
  }) {
    return await apiRequest('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  },

  /**
   * Update custom role
   */
  async updateRole(id: string, roleData: any) {
    return await apiRequest(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  },

  /**
   * Delete custom role
   */
  async deleteRole(id: string) {
    return await apiRequest(`/roles/${id}`, {
      method: 'DELETE',
    });
  },
};


