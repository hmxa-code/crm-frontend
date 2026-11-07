import { apiRequest } from '../api/client';

export interface Company {
  _id?: string;
  name: string;
  industry: string;
  website?: string;
  address?: string;
  owner_id?: any;
  createdAt?: string;
  updatedAt?: string;
}

export const CompanyService = {
  async getCompanies(page = 1, limit = 10, search = '') {
    const response = await apiRequest(`/companies?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
    return response;
  },

  async getCompanyById(id: string) {
    const response = await apiRequest(`/companies/${id}`);
    return response;
  },

  async createCompany(companyData: Partial<Company>) {
    return await apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  async updateCompany(id: string, companyData: Partial<Company>) {
    return await apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  async deleteCompany(id: string) {
    return await apiRequest(`/companies/${id}`, {
      method: 'DELETE',
    });
  },
};