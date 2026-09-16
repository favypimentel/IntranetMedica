import api from './api';
import {
  MockPayment,
  getStoredPayments,
  saveStoredPayments,
  getStoredMembership
} from './mockData';
import { useAuthStore } from '../stores/authStore';

export interface PaymentItem extends MockPayment {}

export interface PaymentListResponse {
  success: boolean;
  data: {
    payments: PaymentItem[];
    summary: {
      totalPaid: string;
      pendingPayments: number;
      nextPaymentDue: string | null;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export interface PendingPaymentItem {
  id: number;
  membershipId: number;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  status: 'pending';
}

export const paymentsService = {
  async getMyPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaymentListResponse> {
    try {
      const response = await api.get('/payments/me', { params });
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      let payments = getStoredPayments(userId);
      const membership = getStoredMembership(userId);

      if (params?.status) {
        payments = payments.filter((p) => p.status === params.status);
      }

      const totalPaid = payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)
        .toFixed(2);

      const pendingCount = payments.filter((p) => p.status === 'pending').length;

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const totalItems = payments.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const offset = (page - 1) * limit;

      return {
        success: true,
        data: {
          payments: payments.slice(offset, offset + limit),
          summary: {
            totalPaid,
            pendingPayments: pendingCount,
            nextPaymentDue: membership.endDate
          },
          pagination: {
            currentPage: page,
            totalPages,
            totalItems
          }
        }
      };
    }
  },

  async getPendingPayments(): Promise<{
    success: boolean;
    data: { pendingPayments: PendingPaymentItem[]; totalPending: string };
  }> {
    try {
      const response = await api.get('/payments/me/pending');
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      const membership = getStoredMembership(userId);
      const payments = getStoredPayments(userId);
      const pending = payments.filter((p) => p.status === 'pending');

      const items: PendingPaymentItem[] = pending.map((p) => ({
        id: p.id,
        membershipId: p.membershipId,
        amount: p.amount,
        currency: p.currency,
        dueDate: membership.endDate,
        daysOverdue: membership.daysRemaining < 0 ? Math.abs(membership.daysRemaining) : 0,
        status: 'pending'
      }));

      const totalPending = pending.reduce((sum, p) => sum + p.amount, 0).toFixed(2);

      return {
        success: true,
        data: {
          pendingPayments: items,
          totalPending
        }
      };
    }
  },

  async processPayment(
    paymentId: number,
    data: { paymentMethodId?: string; cardNumber?: string }
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/payments/${paymentId}/process`, data);
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      const payments = getStoredPayments(userId);
      const index = payments.findIndex((p) => p.id === Number(paymentId));

      if (index !== -1) {
        payments[index].status = 'completed';
        payments[index].paidAt = new Date().toISOString();
        saveStoredPayments(userId, payments);
      }

      return {
        success: true,
        data: {
          paymentId,
          status: 'completed',
          transactionId: `txn_med_${Math.floor(10000000 + Math.random() * 90000000)}`,
          paidAt: new Date().toISOString()
        },
        message: 'Pago procesado exitosamente'
      };
    }
  }
};
