import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { News, User } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Obtener lista de noticias publicadas
export const getNews = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(
      parseInt(req.query.limit as string) || 20,
      parseInt(process.env.MAX_PAGE_SIZE || '100')
    );
    const offset = (page - 1) * limit;
    const category = req.query.category as string;

    const where: any = { is_published: true };
    if (category) {
      where.category = category;
    }

    const { count, rows: news } = await News.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      limit,
      offset,
      order: [['published_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        news: news.map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          category: item.category,
          author: {
            id: (item as any).author.id,
            name: `${(item as any).author.first_name} ${(item as any).author.last_name}`
          },
          publishedAt: item.published_at,
          viewsCount: item.views_count
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalles de una noticia
export const getNewsById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newsId } = req.params;

    const news = await News.findOne({
      where: {
        id: newsId,
        is_published: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!news) {
      throw new AppError('News not found', 404);
    }

    // Incrementar contador de vistas
    await news.incrementViews();

    res.status(200).json({
      success: true,
      data: {
        id: news.id,
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        category: news.category,
        author: {
          id: (news as any).author.id,
          name: `${(news as any).author.first_name} ${(news as any).author.last_name}`
        },
        publishedAt: news.published_at,
        viewsCount: news.views_count
      }
    });
  } catch (error) {
    next(error);
  }
};
