import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum MembershipStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}

export enum PlanType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

interface MembershipAttributes {
  id: number;
  user_id: number;
  plan_type: PlanType;
  status: MembershipStatus;
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface MembershipCreationAttributes extends Optional<MembershipAttributes, 'id' | 'status' | 'auto_renew' | 'created_at' | 'updated_at'> {}

class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  public id!: number;
  public user_id!: number;
  public plan_type!: PlanType;
  public status!: MembershipStatus;
  public start_date!: Date;
  public end_date!: Date;
  public auto_renew!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Método para verificar si la membresía está activa
  public isActive(): boolean {
    return this.status === MembershipStatus.ACTIVE && new Date() <= this.end_date;
  }

  // Método para calcular días restantes
  public daysRemaining(): number {
    const now = new Date();
    const diff = this.end_date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

Membership.init(
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
    plan_type: {
      type: DataTypes.ENUM(...Object.values(PlanType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MembershipStatus)),
      allowNull: false,
      defaultValue: MembershipStatus.ACTIVE
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'memberships',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['end_date']
      }
    ]
  }
);

export default Membership;
