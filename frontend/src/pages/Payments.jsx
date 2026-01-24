import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { DollarSign, Download, Search, Calendar, Plus, X, Loader2, Home, User, CreditCard, Hash } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import EmptyState from '../components/shared/EmptyState';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  // Data for selection
  const [leases, setLeases] = useState([]);

  const [formData, setFormData] = useState({
    leaseId: '',
    amount: '',
    paidAt: new Date().toISOString().split('T')[0],
    method: 'MPESA',
    referenceNumber: '',
    description: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchLeases();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments');
      const payload = response.data.data;
      const paymentsArray = Array.isArray(payload) ? payload : (payload?.items || payload?.payments || []);
      setPayments(paymentsArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load payments');
      showToast('Error loading payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeases = async () => {
    try {
      const response = await api.get('/leases');
      const payload = response.data.data;
      const leasesArray = Array.isArray(payload) ? payload : (payload?.leases || []);
      setLeases(leasesArray);
    } catch (err) {
      console.error("Failed to load leases:", err);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      leaseId: '',
      amount: '',
      paidAt: new Date().toISOString().split('T')[0],
      method: 'MPESA',
      referenceNumber: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        paidAt: new Date(formData.paidAt).toISOString()
      };
      
      await api.post('/payments', payload);
      showToast('Payment recorded successfully', 'success');
      setIsModalOpen(false);
      fetchPayments();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Failed to record payment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading payments...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Payments</h1>
          <p className="text-gray-500 font-medium mt-1">Audit trail of financial transactions and revenue collection</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleOpenModal}
            className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={3} />
            Record Payment
          </button>
          <button className="bg-white text-gray-700 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-soft border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download size={20} className="text-gray-400" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-primary to-orange-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
        <p className="text-white/80 text-sm mb-2">Total Payments Received</p>
        <p className="text-4xl font-bold mb-4">${totalAmount.toLocaleString()}</p>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-white/80">Total Transactions</p>
            <p className="font-bold text-lg">{payments.length}</p>
          </div>
          <div>
            <p className="text-white/80">This Month</p>
            <p className="font-bold text-lg">
              {payments.filter(p => {
                const paidDate = new Date(p.paidAt);
                const now = new Date();
                return paidDate.getMonth() === now.getMonth() && 
                       paidDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft">
          <EmptyState
            icon={DollarSign}
            title="No payments recorded"
            description="Payment history will appear here once tenants start making payments"
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payment.paidAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-sm text-gray-900">
                        {payment.lease?.tenant?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {payment.lease?.unit?.unitNumber || ''}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.lease?.property?.title || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">
                      +${payment.amount?.toLocaleString() || '0'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                      {payment.method || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500">
                      {payment.mpesaReceiptNumber || payment.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Record Payment</h2>
                <p className="text-gray-500 text-sm font-medium">Manually log a transaction into the ledger</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Active Lease</label>
                <select 
                  required
                  value={formData.leaseId}
                  onChange={(e) => setFormData({...formData, leaseId: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">Search by tenant or property...</option>
                  {leases.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.tenant?.name} - {l.property?.title || 'Direct Unit'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Payment Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="number" 
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Transaction Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.paidAt}
                    onChange={(e) => setFormData({...formData, paidAt: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Payment Method</label>
                  <select 
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="MPESA">M-Pesa</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CARD">Credit/Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Reference Number</label>
                  <div className="relative">
                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                      placeholder="e.g. QXJ928HS"
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
