import api from './api';

export const membershipService = {
  async getMyMembership() {
    const response = await api.get('/memberships/me');
    return response.data;
  },

  async createMembership(data: { planType: string; autoRenew?: boolean }) {
    const response = await api.post('/memberships', data);
    return response.data;
  }
};
