import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

interface EnrollmentAttributes {
  id: number;
  user_id: number;
  course_id: number;
  enrollment_date?: Date;
  status: EnrollmentStatus;
  progress: number;
  completed_at?: Date;
}

interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, 'id' | 'enrollment_date' | 'status' | 'progress' | 'completed_at'> {}

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  public id!: number;
  public user_id!: number;
  public course_id!: number;
  public enrollment_date!: Date;
  public status!: EnrollmentStatus;
  public progress!: number;
  public completed_at?: Date;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EnrollmentStatus)),
      allowNull: false,
      defaultValue: EnrollmentStatus.ENROLLED
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'enrollments',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'course_id']
      },
      {
        fields: ['status']
      }
    ]
  }
);

export default Enrollment;
