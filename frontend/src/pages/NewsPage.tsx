import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  Eye,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { newsService, NewsArticle } from '../services/newsService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const NEWS_CATEGORIES = [
  'Todos',
  'Salud Pública',
  'Innovación Médica',
  'Infectología',
  'Farmacología'
];

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async () => {
    try {
      const res = await newsService.getNews({
        category: selectedCategory === 'Todos' ? undefined : selectedCategory,
        search: searchQuery || undefined
      });
      setNews(res.data.news || []);
    } catch (err) {
      console.error('Error fetching news', err);
    } finally {
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const topNews = news[0];
  const otherNews = news.slice(1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="primary" className="mb-2">
          Actualidad y Evidencia
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Noticias y Avances Científicos Médicos
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Información verificada, actualizaciones de guías clínicas y novedades del sector salud.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por titular, temática o autor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Buscar Noticias
          </Button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Categoría:
          </span>
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured News Hero Card */}
      {topNews && (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-64 lg:h-auto overflow-hidden relative">
              <img
                src={topNews.thumbnailUrl}
                alt={topNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="specialty" size="md" className="bg-white/95 shadow-xs">
                  {topNews.category}
                </Badge>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(topNews.publishedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {topNews.readTimeMinutes || 5} min de lectura
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {topNews.viewsCount} vistas
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {topNews.title}
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {topNews.excerpt}
                </p>

                <div className="pt-2 text-xs text-gray-500">
                  <span>Por: <strong className="text-gray-800">{topNews.author?.name}</strong></span>
                  {topNews.author?.specialty && (
                    <span className="text-primary-700 font-medium"> — {topNews.author.specialty}</span>
                  )}
                </div>
              </div>

              <div>
                <Link to={`/news/${topNews.id}`}>
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Leer Artículo Completo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining News */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {otherNews.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="specialty" size="sm">
                    {article.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.viewsCount}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">
                {article.readTimeMinutes || 4} min
              </span>
              <Link to={`/news/${article.id}`}>
                <Button size="sm" variant="ghost" className="text-xs text-primary-700">
                  Leer más →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
