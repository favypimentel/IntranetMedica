import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CourseAttributes {
  id: number;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  instructor?: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'instructor' | 'thumbnail_url' | 'is_active' | 'created_at' | 'updated_at'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public duration_hours!: number;
  public instructor?: string;
  public thumbnail_url?: string;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Course.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duration_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    instructor: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['is_active']
      }
    ]
  }
);

export default Course;
