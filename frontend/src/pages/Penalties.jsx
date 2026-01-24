import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertCircle, Plus, Search, Filter, Ban, CheckCircle2, Clock, DollarSign, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

const Penalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tenantId: '',
    amount: '',
    reason: '',
    status: 'PENDING'
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchPenalties();
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      const data = response.data;
      setTenants(Array.isArray(data) ? data : (data?.tenants || []));
    } catch (err) {
      console.error('Failed to load tenants for penalty attribution');
    }
  };

  const fetchPenalties = async () => {
    setLoading(true);
    try {
      const response = await api.get('/penalties');
      const data = response.data;
      const penaltiesArray = Array.isArray(data) ? data : (data?.penalties && Array.isArray(data.penalties) ? data.penalties : []);
      setPenalties(penaltiesArray);
    } catch (err) {
      console.error(err);
      showToast('Error loading penalty history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const response = await api.post('/penalties', {
         ...formData,
         amount: parseInt(formData.amount)
       });
       setPenalties([response.data.penalty || response.data, ...penalties]);
       showToast('Penalty issued successfully', 'success');
       setShowModal(false);
       setFormData({ tenantId: '', amount: '', reason: '', status: 'PENDING' });
    } catch (err) {
       showToast(err.response?.data?.error || 'Failed to issue penalty', 'error');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredPenalties = (Array.isArray(penalties) ? penalties : []).filter(p => {
    const matchesSearch = p.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: penalties.reduce((sum, p) => sum + (p.amount || 0), 0),
    active: penalties.filter(p => p.status === 'PENDING').length,
    collected: penalties.filter(p => p.status === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Penalties</h1>
          <p className="text-gray-500 mt-1">Track late payment fees and contract violations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Issue Penalty
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <Ban size={24} />
              </div>
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Uncollected Fees</p>
          <h3 className="text-3xl font-black text-gray-900">${(stats.total - stats.collected).toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Collected</p>
          <h3 className="text-3xl font-black text-green-600">${stats.collected.toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Incidents</p>
          <h3 className="text-3xl font-black text-gray-900">{penalties.length}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by tenant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PAID', 'WAIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                statusFilter === status
                  ? 'bg-gray-900 text-white shadow-xl'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Tenant</th>
              <th className="px-8 py-5">Date Issued</th>
              <th className="px-8 py-5">Reason</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredPenalties.length === 0 ? (
              <tr>
                <td colSpan="6">
                   <EmptyState
                    icon={AlertCircle}
                    title="No penalties issued"
                    description="Penalty history is currently empty for your managed properties."
                   />
                </td>
              </tr>
            ) : (
              filteredPenalties.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                        {p.tenant?.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.tenant?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">#{p.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-gray-700 font-medium line-clamp-1">{p.reason || 'Late Payment'}</p>
                  </td>
                  <td className="px-8 py-5">
                     <p className="text-sm font-black text-red-600">${p.amount?.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="px-4 py-1.5 bg-gray-50 text-[10px] font-black uppercase rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Penalty Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl p-10 relative text-[#1A1A1A]">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Issue Penalty</h2>
            <p className="text-gray-500 mb-8 font-medium">Fine a tenant for rule violations or late payments.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Tenant</label>
                <select 
                  required
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none"
                >
                  <option value="">Select a tenant...</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount ($)</label>
                <input 
                  required
                  type="number"
                  placeholder="e.g. 50"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason for Penalty</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Unauthorized property modification, late rent, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm uppercase tracking-widest"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all text-sm uppercase tracking-widest"
                >
                  Apply Penalty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Penalties;
