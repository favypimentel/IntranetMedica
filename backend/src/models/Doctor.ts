import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface DoctorAttributes {
  id: number;
  user_id: number;
  license_number: string;
  specialty: string;
  institution?: string;
  verified: boolean;
  created_at?: Date;
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, 'id' | 'institution' | 'verified' | 'created_at'> {}

class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
  public id!: number;
  public user_id!: number;
  public license_number!: string;
  public specialty!: string;
  public institution?: string;
  public verified!: boolean;

  public readonly created_at!: Date;
}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    license_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    specialty: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    institution: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'doctors',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        unique: true,
        fields: ['license_number']
      }
    ]
  }
);

export default Doctor;
