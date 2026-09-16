import { Response, NextFunction } from 'express';
import { Payment, Membership, PaymentStatus } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Obtener historial de pagos del usuario
export const getMyPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(
      parseInt(req.query.limit as string) || 20,
      parseInt(process.env.MAX_PAGE_SIZE || '100')
    );
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    // Obtener membresía del usuario
    const membership = await Membership.findOne({
      where: { user_id: userId }
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        data: {
          payments: [],
          summary: {
            totalPaid: 0,
            pendingPayments: 0,
            nextPaymentDue: null
          },
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0
          }
        }
      });
    }

    // Construir condiciones
    const where: any = { membership_id: membership.id };
    if (status) {
      where.status = status;
    }

    // Obtener pagos
    const { count, rows: payments } = await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    // Calcular resumen
    const completedPayments = await Payment.findAll({
      where: {
        membership_id: membership.id,
        status: PaymentStatus.COMPLETED
      }
    });

    const totalPaid = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

    const pendingPaymentsCount = await Payment.count({
      where: {
        membership_id: membership.id,
        status: PaymentStatus.PENDING
      }
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        payments: payments.map(payment => ({
          id: payment.id,
          membershipId: payment.membership_id,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.payment_method,
          transactionId: payment.transaction_id,
          status: payment.status,
          paidAt: payment.paid_at,
          createdAt: payment.created_at
        })),
        summary: {
          totalPaid: totalPaid.toFixed(2),
          pendingPayments: pendingPaymentsCount,
          nextPaymentDue: membership.end_date
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener pagos pendientes
export const getPendingPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    // Obtener membresía del usuario
    const membership = await Membership.findOne({
      where: { user_id: userId }
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        data: {
          pendingPayments: [],
          totalPending: 0
        }
      });
    }

    // Obtener pagos pendientes
    const pendingPayments = await Payment.findAll({
      where: {
        membership_id: membership.id,
        status: PaymentStatus.PENDING
      }
    });

    const totalPending = pendingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

    res.status(200).json({
      success: true,
      data: {
        pendingPayments: pendingPayments.map(payment => ({
          id: payment.id,
          membershipId: payment.membership_id,
          amount: payment.amount,
          currency: payment.currency,
          dueDate: membership.end_date,
          daysOverdue: membership.daysRemaining() < 0 ? Math.abs(membership.daysRemaining()) : 0,
          status: payment.status
        })),
        totalPending: totalPending.toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
};
