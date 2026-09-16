import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RoleAttributes {
  id: number;
  name: string;
  description?: string;
  created_at?: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'description' | 'created_at'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  public readonly created_at!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    underscored: true
  }
);

export default Role;
