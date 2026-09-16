import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface NewsAttributes {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author_id: number;
  category: string;
  published_at?: Date;
  is_published: boolean;
  views_count: number;
  created_at?: Date;
  updated_at?: Date;
}

interface NewsCreationAttributes extends Optional<NewsAttributes, 'id' | 'published_at' | 'is_published' | 'views_count' | 'created_at' | 'updated_at'> {}

class News extends Model<NewsAttributes, NewsCreationAttributes> implements NewsAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public excerpt!: string;
  public author_id!: number;
  public category!: string;
  public published_at?: Date;
  public is_published!: boolean;
  public views_count!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Método para incrementar el contador de vistas
  public async incrementViews(): Promise<void> {
    this.views_count += 1;
    await this.save();
  }
}

News.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    views_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'news',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['is_published']
      },
      {
        fields: ['published_at']
      }
    ]
  }
);

export default News;
