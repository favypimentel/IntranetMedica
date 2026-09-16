import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Eye,
  Share2,
} from 'lucide-react';
import { newsService, NewsArticle } from '../services/newsService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToastStore } from '../stores/toastStore';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await newsService.getNewsById(Number(id));
        setArticle(res.data);

        const allRes = await newsService.getNews({ limit: 4 });
        setRelatedNews((allRes.data.news || []).filter((n) => n.id !== Number(id)));
      } catch (err) {
        console.error('Error loading news article', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Cargando artículo científico...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Noticia no encontrada</h2>
        <Link to="/news">
          <Button variant="primary">Volver a Noticias</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Portal de Noticias</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="specialty" size="md">
            {article.category}
          </Badge>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTimeMinutes || 5} min de lectura
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.viewsCount} lecturas
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Author Bio Bar */}
        <div className="flex items-center justify-between py-4 border-y border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
              {article.author?.name?.charAt(4) || 'D'}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{article.author?.name}</p>
              <p className="text-[11px] text-gray-500">{article.author?.specialty || 'Especialista en Salud'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast({
                  type: 'success',
                  title: 'Enlace Copiado',
                  message: 'El enlace del artículo ha sido copiado al portapapeles.'
                });
              }}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Compartir"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Cover Image */}
      <div className="rounded-3xl overflow-hidden shadow-md max-h-96">
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-6">
        <div
          className="prose prose-slate max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Etiquetas:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-gray-900">Artículos Relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedNews.slice(0, 2).map((rel) => (
              <Link
                key={rel.id}
                to={`/news/${rel.id}`}
                className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-primary-300 transition-all flex items-start gap-3 group"
              >
                <img
                  src={rel.thumbnailUrl}
                  alt={rel.title}
                  className="h-16 w-16 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <Badge variant="specialty" size="sm">
                    {rel.category}
                  </Badge>
                  <h4 className="font-bold text-xs text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
