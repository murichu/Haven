import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Plus, Search, Calendar, X, Loader2, Edit2, Trash2, Home, User } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';

const Leases = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLease, setEditingLease] = useState(null);
  const { showToast } = useToast();
  
  // Data for selections
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);

  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    unitId: '',
    startDate: '',
    endDate: '',
    rentAmount: '',
    paymentDayOfMonth: 1,
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchLeases();
    fetchSelectionData();
  }, []);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leases');
      const payload = response.data.data;
      const leasesArray = Array.isArray(payload) ? payload : (payload?.items || payload?.leases || []);
      setLeases(leasesArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load leases');
      showToast('Error loading leases', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectionData = async () => {
    try {
      const [tenantsRes, propertiesRes] = await Promise.all([
        api.get('/tenants'),
        api.get('/properties')
      ]);
      const tenantsPayload = tenantsRes.data.data;
      const propertiesPayload = propertiesRes.data.data;
      setTenants(Array.isArray(tenantsPayload) ? tenantsPayload : (tenantsPayload?.tenants || []));
      setProperties(Array.isArray(propertiesPayload) ? propertiesPayload : (propertiesPayload?.properties || []));
    } catch (err) {
      console.error("Failed to load selection data:", err);
    }
  };

  const handlePropertyChange = async (propertyId) => {
    setFormData({ ...formData, propertyId, unitId: '' });
    if (!propertyId) {
      setUnits([]);
      return;
    }
    try {
      const response = await api.get(`/properties/${propertyId}?includeUnits=true`);
      setUnits(response.data.data.units || []);
    } catch (err) {
      console.error("Failed to load units:", err);
    }
  };

  const handleOpenModal = (lease = null) => {
    if (lease) {
      setEditingLease(lease);
      setFormData({
        tenantId: lease.tenantId,
        propertyId: lease.propertyId || '',
        unitId: lease.unitId || '',
        startDate: lease.startDate ? lease.startDate.split('T')[0] : '',
        endDate: lease.endDate ? lease.endDate.split('T')[0] : '',
        rentAmount: lease.rentAmount || '',
        paymentDayOfMonth: lease.paymentDayOfMonth || 1,
        status: lease.status || 'ACTIVE'
      });
      if (lease.propertyId) handlePropertyChange(lease.propertyId);
    } else {
      setEditingLease(null);
      setFormData({
        tenantId: '',
        propertyId: '',
        unitId: '',
        startDate: '',
        endDate: '',
        rentAmount: '',
        paymentDayOfMonth: 1,
        status: 'ACTIVE'
      });
      setUnits([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        rentAmount: parseFloat(formData.rentAmount),
        paymentDayOfMonth: parseInt(formData.paymentDayOfMonth)
      };
      
      if (editingLease) {
        await api.put(`/leases/${editingLease.id}`, payload);
        showToast('Lease updated successfully', 'success');
      } else {
        await api.post('/leases', payload);
        showToast('Lease created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchLeases();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Failed to save lease', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to terminate/delete this lease?')) return;
    try {
      await api.delete(`/leases/${id}`);
      showToast('Lease removed successfully', 'success');
      fetchLeases();
    } catch (err) {
      showToast('Failed to delete lease', 'error');
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

  const getLeaseStatus = (lease) => {
    if (!lease.endDate) return 'Active';
    const endDate = new Date(lease.endDate);
    const today = new Date();
    if (endDate < today) return 'Expired';
    return 'Active';
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading leases...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Leases</h1>
          <p className="text-gray-500 font-medium mt-1">Manage active rental agreements and occupancy terms</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          New Lease
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Leases Grid */}
      {leases.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft">
          <EmptyState
            icon={FileText}
            title="No leases found"
            description="Create your first lease agreement to get started"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leases.map((lease) => (
            <div key={lease.id} className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 text-primary flex items-center justify-center font-black shadow-inner">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 leading-tight">{lease.tenant?.name || 'Unknown Tenant'}</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">{lease.property?.title || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(lease)}
                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(lease.id)}
                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unit:</span>
                  <span className="font-medium text-gray-900">{lease.unit?.unitNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rent Amount:</span>
                  <span className="font-bold text-gray-900">${lease.rentAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Start Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(lease.startDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">End Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(lease.endDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Day:</span>
                  <span className="font-medium text-gray-900">{lease.paymentDayOfMonth || 'N/A'} of month</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                  Generate Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  {editingLease ? 'Edit Lease' : 'New Lease Agreement'}
                </h2>
                <p className="text-gray-500 text-sm font-medium">Link residence to asset and define payment terms</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Tenant & Property Selection */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Tenant</label>
                  <select 
                    required
                    value={formData.tenantId}
                    onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Choose a resident...</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Property</label>
                  <select 
                    required
                    value={formData.propertyId}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Choose a property...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Unit (Optional)</label>
                  <select 
                    value={formData.unitId}
                    onChange={(e) => setFormData({...formData, unitId: e.target.value})}
                    disabled={!formData.propertyId}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 appearance-none disabled:opacity-50"
                  >
                    <option value="">Whole Property / None...</option>
                    {units.map(u => <option key={u.id} value={u.id}>Unit {u.unitNumber} ({u.type})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Monthly Rent ($)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Dates & Terms */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Payment Day</label>
                  <input 
                    type="number" 
                    min="1"
                    max="31"
                    required
                    value={formData.paymentDayOfMonth}
                    onChange={(e) => setFormData({...formData, paymentDayOfMonth: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
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
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingLease ? 'Update Contract' : 'Activate Lease')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leases;
