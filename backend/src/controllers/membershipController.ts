import { Response, NextFunction } from 'express';
import { Membership, Payment, MembershipStatus, PlanType, PaymentStatus } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Obtener membresía del usuario
export const getMyMembership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const membership = await Membership.findOne({
      where: { user_id: userId }
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active membership found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        membershipId: membership.id,
        userId: membership.user_id,
        planType: membership.plan_type,
        status: membership.status,
        startDate: membership.start_date,
        endDate: membership.end_date,
        autoRenew: membership.auto_renew,
        daysRemaining: membership.daysRemaining()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Crear o renovar membresía
export const createMembership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { planType, autoRenew } = req.body;

    // Verificar si ya tiene membresía
    let membership = await Membership.findOne({
      where: { user_id: userId }
    });

    const startDate = new Date();
    const endDate = new Date();

    // Calcular fecha de fin según el plan
    if (planType === PlanType.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === PlanType.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    if (membership) {
      // Actualizar membresía existente
      membership.plan_type = planType;
      membership.status = MembershipStatus.ACTIVE;
      membership.start_date = startDate;
      membership.end_date = endDate;
      membership.auto_renew = autoRenew !== undefined ? autoRenew : membership.auto_renew;
      await membership.save();
    } else {
      // Crear nueva membresía
      membership = await Membership.create({
        user_id: userId,
        plan_type: planType,
        status: MembershipStatus.ACTIVE,
        start_date: startDate,
        end_date: endDate,
        auto_renew: autoRenew !== undefined ? autoRenew : true
      });
    }

    // Crear registro de pago (simulado - integrar con Stripe en producción)
    const amount = planType === PlanType.MONTHLY ? 29.99 : 299.99;
    
    const payment = await Payment.create({
      membership_id: membership.id,
      amount,
      currency: 'USD',
      payment_method: 'credit_card',
      status: PaymentStatus.COMPLETED,
      paid_at: new Date(),
      transaction_id: `txn_${Date.now()}`
    });

    res.status(201).json({
      success: true,
      data: {
        membershipId: membership.id,
        status: membership.status,
        startDate: membership.start_date,
        endDate: membership.end_date,
        payment: {
          paymentId: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status
        }
      },
      message: 'Membresía activada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
