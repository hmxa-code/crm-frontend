import { apiRequest } from '@/src/api/client';

export interface LeadQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  ownerId?: string;
  companyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeadPayload {
  _id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  company_id?: string;
  owner_id?: string;
  source?: string;
  status?: string;
  score?: number;
}

const buildQueryString = (params: LeadQueryParams): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
};

export const LeadService = {
  // Enterprise Query for Server-side Search, Pagination, Filtering
  async getLeads(params: LeadQueryParams = { page: 1, limit: 10 }) {
    const queryString = buildQueryString(params);
    const response = await apiRequest(`/leads${queryString}`, { method: 'GET' });
    return response; 
  },

  async getLeadById(id: string) {
    return await apiRequest(`/leads/${id}`, { method: 'GET' });
  },

  async createLead(leadData: LeadPayload) {
    return await apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  async updateLead(id: string, leadData: Partial<LeadPayload>) {
    return await apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  async deleteLead(id: string) {
    return await apiRequest(`/leads/${id}`, { method: 'DELETE' });
  },

  // Enterprise Bulk Actions
  async bulkUpdateStatus(ids: string[], status: string) {
    return await apiRequest('/leads/bulk/status', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    });
  },

  async bulkDelete(ids: string[]) {
    return await apiRequest('/leads/bulk/delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },
};