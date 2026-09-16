import api from './api';
import { MockNews, getStoredNews } from './mockData';

export interface NewsArticle extends MockNews {}

export interface NewsListResponse {
  success: boolean;
  data: {
    news: NewsArticle[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const newsService = {
  async getNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<NewsListResponse> {
    try {
      const response = await api.get('/news', { params });
      return response.data;
    } catch {
      let news = getStoredNews();

      if (params?.category && params.category !== 'all' && params.category !== 'Todos') {
        news = news.filter(
          (n) => n.category.toLowerCase() === params.category?.toLowerCase()
        );
      }

      if (params?.search) {
        const query = params.search.toLowerCase();
        news = news.filter(
          (n) =>
            n.title.toLowerCase().includes(query) ||
            n.excerpt.toLowerCase().includes(query) ||
            n.tags.some((t) => t.toLowerCase().includes(query))
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const totalItems = news.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const offset = (page - 1) * limit;

      return {
        success: true,
        data: {
          news: news.slice(offset, offset + limit),
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
          }
        }
      };
    }
  },

  async getNewsById(id: number): Promise<{ success: boolean; data: NewsArticle }> {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch {
      const news = getStoredNews();
      const article = news.find((n) => n.id === Number(id));
      if (!article) {
        throw new Error('Noticia no encontrada');
      }
      article.viewsCount += 1;
      return {
        success: true,
        data: article
      };
    }
  }
};
