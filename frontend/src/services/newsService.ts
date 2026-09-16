import api from './api';

export const newsService = {
  async getNews(params?: { page?: number; limit?: number; category?: string }) {
    const response = await api.get('/news', { params });
    return response.data;
  },

  async getNewsById(id: number) {
    const response = await api.get(`/news/${id}`);
    return response.data;
  }
};
