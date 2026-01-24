import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileSpreadsheet, Plus, TrendingDown, X, Loader2, Home, Tags, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import EmptyState from '../components/shared/EmptyState';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  // Data for selection
  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'MAINTENANCE',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    propertyId: '',
    status: 'PAID'
  });

  useEffect(() => {
    fetchExpenses();
    fetchProperties();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/expenses');
      const payload = response.data.data;
      const expensesArray = Array.isArray(payload) ? payload : (payload?.items || payload?.expenses || []);
      setExpenses(expensesArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses');
      showToast('Error loading expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      const payload = response.data.data;
      const propertiesArray = Array.isArray(payload) ? payload : (payload?.properties || []);
      setProperties(propertiesArray);
    } catch (err) {
      console.error("Failed to load properties:", err);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      category: 'MAINTENANCE',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      propertyId: '',
      status: 'PAID'
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
        date: new Date(formData.date).toISOString()
      };
      
      await api.post('/expenses', payload);
      showToast('Expense recorded successfully', 'success');
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Failed to record expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const thisMonth = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && 
           expDate.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = thisMonth.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading expenses...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Expenses</h1>
          <p className="text-gray-500 font-medium">Outflow tracking and property maintenance expenditure</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <p className="text-gray-500 text-sm">Total Expenses</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <p className="text-gray-500 text-sm mb-2">This Month</p>
          <p className="text-3xl font-bold text-red-600">${monthlyTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{thisMonth.length} transactions</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <p className="text-gray-500 text-sm mb-2">Average</p>
          <p className="text-3xl font-bold text-gray-900">
            ${expenses.length > 0 ? Math.round(totalExpenses / expenses.length).toLocaleString() : '0'}
          </p>
          <p className="text-xs text-gray-400 mt-1">per expense</p>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft">
          <EmptyState
            icon={FileSpreadsheet}
            title="No expenses recorded"
            description="Start tracking your property expenses to manage costs better"
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
                      {expense.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {expense.property?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-red-600">
                      -${expense.amount?.toLocaleString() || '0'}
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
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add Expense</h2>
                <p className="text-gray-500 text-sm font-medium">Record property maintenance or utility costs</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Expense Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Roof Repair Section B"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="TAXES">Taxes</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="LANDSCAPING">Landscaping</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Target Property</label>
                  <select 
                    required
                    value={formData.propertyId}
                    onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Select property...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Amount ($)</label>
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
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Expense Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Detailed Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="Describe the nature of this expense..."
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 resize-none"
                />
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
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
