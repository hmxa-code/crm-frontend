import { ScoringProfile, QualificationRule, ScoringTelemetryEvent } from '@/src/types/rengrowcure/leadIntel';

const API_BASE_URL = 'http://localhost:5000/api/rengrowcure/lead-intel';

// API Service Functions
const api = {
  async getProfiles(page = 1, limit = 50, status?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch profiles');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error (getProfiles):', error);
      throw error;
    }
  },

  async getProfileById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error (getProfileById):', error);
      throw error;
    }
  },

  async getRules() {
    try {
      const response = await fetch(`${API_BASE_URL}/rules`);
      if (!response.ok) throw new Error('Failed to fetch rules');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error (getRules):', error);
      return { data: [] };
    }
  },

  async getTelemetry() {
    try {
      const response = await fetch(`${API_BASE_URL}/telemetry`);
      if (!response.ok) throw new Error('Failed to fetch telemetry');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error (getTelemetry):', error);
      return { data: [] };
    }
  },

  async createRule(data: Partial<QualificationRule>) {
    try {
      const response = await fetch(`${API_BASE_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create rule');
      return await response.json();
    } catch (error) {
      console.error('API Error (createRule):', error);
      throw error;
    }
  },

  async updateRule(id: string, data: Partial<QualificationRule>) {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update rule');
      return await response.json();
    } catch (error) {
      console.error('API Error (updateRule):', error);
      throw error;
    }
  },

  async deleteRule(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete rule');
      return await response.json();
    } catch (error) {
      console.error('API Error (deleteRule):', error);
      throw error;
    }
  },

  async createProfile(data: Partial<ScoringProfile>) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return await response.json();
  },

  async updateProfile(id: string, data: Partial<ScoringProfile>) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  },

  async deleteProfile(id: string) {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete profile');
    return await response.json();
  },

  async bulkDeleteProfiles(ids: string[]) {
    const response = await fetch(`${API_BASE_URL}/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error('Failed to bulk delete profiles');
    return await response.json();
  },

  async bulkDeleteRules(ids: string[]) {
    const response = await fetch(`${API_BASE_URL}/rules/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error('Failed to bulk delete rules');
    return await response.json();
  },

  async bulkDeleteTelemetry(ids: string[]) {
    const response = await fetch(`${API_BASE_URL}/telemetry/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error('Failed to bulk delete telemetry');
    return await response.json();
  },

  async seedDynamicData() {
    const response = await fetch(`${API_BASE_URL}/seed-dynamic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to seed dynamic testing data');
    return await response.json();
  }
};

export const leadIntelService = {
  // API-based methods
  getProfiles: (page?: number, limit?: number, status?: string) => api.getProfiles(page, limit, status),
  getProfileById: (id: string) => api.getProfileById(id),
  getRules: () => api.getRules(),
  getTelemetry: () => api.getTelemetry(),
  createRule: (rule: Partial<QualificationRule>) => api.createRule(rule),
  updateRule: (id: string, rule: Partial<QualificationRule>) => api.updateRule(id, rule),
  deleteRule: (id: string) => api.deleteRule(id),
  getRulesCount: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rengrowcure/lead-intel/rules-count');
      if (!response.ok) throw new Error('Failed to fetch rules count');
      return await response.json();
    } catch (error) {
      console.error('API Error (getRulesCount):', error);
      return 0;
    }
  },
  createProfile: (profile: Partial<ScoringProfile>) => api.createProfile(profile),
  updateProfile: (id: string, profile: Partial<ScoringProfile>) => api.updateProfile(id, profile),
  deleteProfile: (id: string) => api.deleteProfile(id),
  bulkDeleteProfiles: (ids: string[]) => api.bulkDeleteProfiles(ids),
  bulkDeleteRules: (ids: string[]) => api.bulkDeleteRules(ids),
  bulkDeleteTelemetry: (ids: string[]) => api.bulkDeleteTelemetry(ids),
  seedDynamicData: () => api.seedDynamicData(),
};
