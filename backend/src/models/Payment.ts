import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

interface PaymentAttributes {
  id: number;
  membership_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id?: string;
  status: PaymentStatus;
  paid_at?: Date;
  created_at?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'transaction_id' | 'status' | 'paid_at' | 'created_at'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public membership_id!: number;
  public amount!: number;
  public currency!: string;
  public payment_method!: string;
  public transaction_id?: string;
  public status!: PaymentStatus;
  public paid_at?: Date;

  public readonly created_at!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    membership_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'memberships',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING
    },
    paid_at: {
      type: DataTypes.DATE,
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
    tableName: 'payments',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['membership_id']
      },
      {
        fields: ['status']
      },
      {
        unique: true,
        fields: ['transaction_id']
      }
    ]
  }
);

export default Payment;
