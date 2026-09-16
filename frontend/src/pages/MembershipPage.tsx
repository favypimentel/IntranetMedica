import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Download,
  Check,
} from 'lucide-react';
import { membershipService, MembershipInfo } from '../services/membershipService';
import { paymentsService, PaymentItem } from '../services/paymentsService';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const MembershipPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  // Checkout modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(`Dr. ${user?.firstName || 'Juan'} ${user?.lastName || 'Pérez'}`);
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  const loadMembershipAndPayments = async () => {
    try {
            const [memRes, payRes] = await Promise.all([
        membershipService.getMyMembership(),
        paymentsService.getMyPayments(),
        paymentsService.getPendingPayments()
      ]);

      setMembership(memRes.data);
      setPayments(payRes.data.payments || []);
          } catch (err) {
      console.error('Error loading membership data', err);
    } finally {
          }
  };

  useEffect(() => {
    loadMembershipAndPayments();
  }, []);

  const handleOpenCheckout = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      await membershipService.createMembership({
        planType: selectedPlan,
        autoRenew: true
      });

      addToast({
        type: 'success',
        title: '¡Membresía Activada con Éxito!',
        message: `Tu suscripción (${selectedPlan === 'monthly' ? 'Plan Mensual $29.99' : 'Plan Anual $299.99'}) se ha procesado correctamente.`
      });

      setIsModalOpen(false);
      await loadMembershipAndPayments();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error en el Pago',
        message: err.message || 'No fue posible procesar la transacción.'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <Badge variant="primary" className="mb-2">
          Gestión de Suscripción
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Membresía Médica y Facturación
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Administra tu plan de acceso continuo a cursos acreditados y revisa tu historial de pagos.
        </p>
      </div>

      {/* Current Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Membresía Activa (PRO)
              </span>
              <span className="text-xs text-slate-400">
                Plan {membership?.planType === 'monthly' ? 'Mensual Recurrente' : 'Anual Especialista'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {membership?.daysRemaining || 19} días de vigencia restante
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              Vigente desde el <strong className="text-white">{membership?.startDate || '01/09/2026'}</strong> hasta el{' '}
              <strong className="text-white">{membership?.endDate || '01/10/2026'}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              className="font-bold shadow-md shadow-secondary-900/30"
              onClick={() => handleOpenCheckout('yearly')}
            >
              Mejorar a Plan Anual (-20%)
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold"
              onClick={() => handleOpenCheckout('monthly')}
            >
              Renovar Plan Mensual
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Comparison Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Planes Disponibles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Mensual */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-white border-2 transition-all flex flex-col justify-between space-y-6 ${
            membership?.planType === 'monthly' ? 'border-primary-500 shadow-md ring-4 ring-primary-50' : 'border-gray-200'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Plan Mensual</h3>
                <Badge variant="primary">Flexible</Badge>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">$29.99</span>
                <span className="text-gray-500 text-sm font-medium">/ mes</span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Facturación mensual automática con cancelación en cualquier momento.
              </p>

              <ul className="space-y-2.5 pt-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Acceso ilimitado a más de 20 cursos clínicos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Noticias científicas y análisis de protocolos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Temarios interactivos y seguimiento de avance</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full font-bold"
              onClick={() => handleOpenCheckout('monthly')}
            >
              Seleccionar Plan Mensual ($29.99)
            </Button>
          </div>

          {/* Plan Anual */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary-950 via-slate-900 to-slate-900 text-white border-2 border-primary-500 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden`}>
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Ahorra 2 Meses
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Plan Anual Especialista</h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$299.99</span>
                <span className="text-slate-400 text-sm font-medium">/ año</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Acceso garantizado durante 365 días para profesionales dedicados a la excelencia.
              </p>

              <ul className="space-y-2.5 pt-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Todo lo incluido en el Plan Mensual</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Emisión ilimitada de Diplomas y Certificados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Acceso prioritario a masterclasses en vivo</span>
                </li>
              </ul>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full font-bold shadow-lg shadow-secondary-900/30"
              onClick={() => handleOpenCheckout('yearly')}
            >
              Seleccionar Plan Anual ($299.99)
            </Button>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Historial de Pagos y Facturación</h3>
          </div>
        </div>

        {payments.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">No hay registros de pago anteriores.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Transacción</th>
                  <th className="pb-3 font-semibold">Descripción</th>
                  <th className="pb-3 font-semibold">Fecha</th>
                  <th className="pb-3 font-semibold">Método</th>
                  <th className="pb-3 font-semibold">Monto</th>
                  <th className="pb-3 font-semibold">Estado</th>
                  <th className="pb-3 font-semibold text-right">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-mono text-gray-600 font-medium">{p.transactionId}</td>
                    <td className="py-3.5 font-medium text-gray-900">{p.planDescription || 'Membresía Médica Mensual'}</td>
                    <td className="py-3.5 text-gray-500">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString('es-ES') : 'Pendiente'}
                    </td>
                    <td className="py-3.5 text-gray-600">{p.paymentMethod}</td>
                    <td className="py-3.5 font-bold text-gray-900">${p.amount} ${p.currency}</td>
                    <td className="py-3.5">
                      <Badge variant="success" size="sm">
                        {p.status === 'completed' ? 'Pagado' : p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: 'Factura Descargada',
                            message: `Factura para la transacción ${p.transactionId} descargada en PDF.`
                          });
                        }}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-semibold p-1 hover:bg-primary-50 rounded-md transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <span>Pasarela de Pago Segura — {selectedPlan === 'monthly' ? 'Plan Mensual ($29.99)' : 'Plan Anual ($299.99)'}</span>
          </div>
        }
        description="Transacción encriptada de 256 bits conforme a estándares PCI-DSS."
      >
        <form onSubmit={handleProcessPayment} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nombre en la Tarjeta
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Número de Tarjeta
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Expiración (MM/AA)
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                CVV / CVC
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Garantía de Satisfacción Médica</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Total a debitar: <strong>${selectedPlan === 'monthly' ? '29.99' : '299.99'} USD</strong>.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={processing}
              className="font-bold"
            >
              Confirmar y Pagar ${selectedPlan === 'monthly' ? '29.99' : '299.99'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembershipPage;
