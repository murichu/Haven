import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Receipt, Plus, Search, Filter, MoreVertical, Download, Send, Calendar, DollarSign, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/invoices');
      const payload = response.data.data;
      const invoicesArray = Array.isArray(payload) ? payload : (payload?.items || payload?.invoices || []);
      setInvoices(invoicesArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load invoices');
      showToast('Error loading invoices', 'error');
    } finally {
      setLoading(false);
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

  const filteredInvoices = (Array.isArray(invoices) ? invoices : []).filter(invoice => {
    const matchesSearch = invoice.lease?.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
    paid: invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + (inv.amount || 0), 0),
    pending: invoices.filter(i => i.status === 'PENDING').reduce((sum, inv) => sum + (inv.amount || 0), 0),
    overdue: invoices.filter(i => i.status === 'OVERDUE').reduce((sum, inv) => sum + (inv.amount || 0), 0),
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage billing, payments, and financial history</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white text-gray-700 px-5 py-3 rounded-2xl font-bold shadow-soft border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download size={20} strokeWidth={2.5} />
            Export CSV
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center gap-2">
            <Plus size={20} strokeWidth={3} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Issued</p>
          </div>
          <h3 className="text-2xl font-black text-gray-900">${stats.total.toLocaleString()}</h3>
          <div className="mt-2 flex items-center gap-1 text-blue-600 text-xs font-bold">
            <Clock size={12} />
            <span>Cumulative</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 group hover:border-green-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Paid</p>
          </div>
          <h3 className="text-2xl font-black text-green-600">${stats.paid.toLocaleString()}</h3>
          <div className="mt-2 text-gray-400 text-xs font-bold">
            {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}% Collection Rate
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 group hover:border-yellow-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Pending</p>
          </div>
          <h3 className="text-2xl font-black text-yellow-600">${stats.pending.toLocaleString()}</h3>
          <div className="mt-2 text-gray-400 text-xs font-bold">
            Awaiting Confirmation
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 group hover:border-red-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Overdue</p>
          </div>
          <h3 className="text-2xl font-black text-red-600">${stats.overdue.toLocaleString()}</h3>
          <div className="mt-2 text-red-600/70 text-xs font-black uppercase">Action Required</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by invoice number or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PAID', 'PENDING', 'OVERDUE', 'PARTIAL'].map((status) => (
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

      {/* Table Area */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Invoice #</th>
              <th className="px-8 py-5">Tenant</th>
              <th className="px-8 py-5">Due Date</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    icon={Receipt}
                    title="No invoices found"
                    description="It looks like there are no invoices matching your current filter."
                    action={
                      <button onClick={() => {setSearchTerm(''); setStatusFilter('ALL')}} className="text-primary font-bold text-sm underline decoration-primary/30 underline-offset-4">Reset Dashboard</button>
                    }
                  />
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-8 py-5">
                    <span className="font-mono text-sm font-black text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                      #{invoice.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-xs">
                          {invoice.lease?.tenant?.name?.charAt(0) || 'T'}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{invoice.lease?.tenant?.name || 'Unknown'}</p>
                           <p className="text-[10px] text-gray-400 font-medium">{invoice.lease?.property?.name || 'N/A'}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDate(invoice.dueAt)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-base font-black text-gray-900">${invoice.amount?.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-primary transition-all" title="Send Invoice">
                        <Send size={16} />
                      </button>
                      <button className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-primary transition-all" title="Download PDF">
                        <Download size={16} />
                      </button>
                      <button className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-primary transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;

