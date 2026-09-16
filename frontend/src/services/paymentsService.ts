import api from './api';

export const paymentsService = {
  async getMyPayments(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get('/payments/me', { params });
    return response.data;
  },

  async getPendingPayments() {
    const response = await api.get('/payments/me/pending');
    return response.data;
  }
};
