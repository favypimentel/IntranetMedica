import api from './api';
import {
  MockMembership,
  getStoredMembership,
  saveStoredMembership,
  getStoredPayments,
  saveStoredPayments,
  MockPayment
} from './mockData';
import { useAuthStore } from '../stores/authStore';

export interface MembershipInfo extends MockMembership {}

export const membershipService = {
  async getMyMembership(): Promise<{ success: boolean; data: MembershipInfo | null }> {
    try {
      const response = await api.get('/memberships/me');
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      const membership = getStoredMembership(userId);
      return {
        success: true,
        data: membership
      };
    }
  },

  async createMembership(data: {
    planType: 'monthly' | 'yearly';
    autoRenew?: boolean;
    paymentMethodId?: string;
  }): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post('/memberships', data);
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;

      const startDate = new Date();
      const endDate = new Date();
      if (data.planType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const updatedMembership: MockMembership = {
        membershipId: 789,
        userId,
        planType: data.planType,
        status: 'active',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        autoRenew: data.autoRenew ?? true,
        daysRemaining: data.planType === 'monthly' ? 30 : 365
      };

      saveStoredMembership(userId, updatedMembership);

      // Also create a payment record
      const payments = getStoredPayments(userId);
      const amount = data.planType === 'monthly' ? 29.99 : 299.99;
      const newPayment: MockPayment = {
        id: Math.floor(1000 + Math.random() * 9000),
        membershipId: 789,
        amount,
        currency: 'USD',
        paymentMethod: 'Tarjeta de Crédito (•••• 4242)',
        transactionId: `txn_med_${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'completed',
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        planDescription: `Membresía Médica (${data.planType === 'monthly' ? 'Plan Mensual' : 'Plan Anual Pro'})`
      };

      payments.unshift(newPayment);
      saveStoredPayments(userId, payments);

      return {
        success: true,
        data: {
          membership: updatedMembership,
          payment: newPayment
        },
        message: 'Membresía activada y procesada exitosamente'
      };
    }
  }
};
