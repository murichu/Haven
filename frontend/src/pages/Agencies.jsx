import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Building2, Plus, Search, Globe, Mail, Phone, ExternalLink, ShieldCheck, Zap, Users, Layout, X, Loader2, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agencies');
      const payload = response.data.data;
      const agenciesArray = Array.isArray(payload) ? payload : (payload?.agencies || []);
      setAgencies(agenciesArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load agencies');
      showToast('Error loading agencies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (agency = null) => {
    if (agency) {
      setEditingAgency(agency);
      setFormData({
        name: agency.name,
        email: agency.email || '',
        phone: agency.phone || '',
        address: agency.address || '',
        status: agency.status || 'ACTIVE'
      });
    } else {
      setEditingAgency(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAgency) {
        await api.put(`/agencies/${editingAgency.id}`, formData);
        showToast('Agency updated successfully', 'success');
      } else {
        await api.post('/agencies', formData);
        showToast('Agency registered successfully', 'success');
      }
      setIsModalOpen(false);
      fetchAgencies();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Failed to save agency', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agency? This action is irreversible.')) return;
    try {
      await api.delete(`/agencies/${id}`);
      showToast('Agency deleted successfully', 'success');
      fetchAgencies();
    } catch (err) {
      showToast('Failed to delete agency', 'error');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agencies</h1>
          <p className="text-gray-500 mt-1">Manage multiple real estate agencies and partners</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Register Agency
        </button>
      </div>

      {/* Featured Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Total Partners</p>
            <h3 className="text-5xl font-black mb-2">{agencies.length}</h3>
            <p className="text-gray-400 text-sm">Active network across 4 states</p>
          </div>
          <Building2 className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-white/10 transition-colors" size={160} />
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
               <Zap size={24} />
             </div>
             <div>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Premium Tier</p>
               <h4 className="text-xl font-black text-gray-900">Enterprise</h4>
             </div>
          </div>
          <p className="text-gray-500 text-sm">Full access to advanced analytics and unlimited property listings enabled.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
               <Users size={24} />
             </div>
             <div>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Collaboration</p>
               <h4 className="text-xl font-black text-gray-900">84 Staff</h4>
             </div>
          </div>
          <p className="text-gray-500 text-sm">Total staff members across all managed agencies with unique RBAC roles.</p>
        </div>
      </div>

      {/* Grid Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : agencies.length === 0 ? (
        <EmptyState
          icon={Layout}
          title="No agencies registered"
          description="Start by adding your first agency to manage properties and staff in a multi-tenant environment."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <div key={agency.id} className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-gray-100 hover:shadow-xl transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                  <Building2 size={32} />
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleOpenModal(agency); }}
                     className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-xl"
                   >
                    <Edit2 size={18} />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleDelete(agency.id); }}
                     className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                   >
                    <Trash2 size={18} />
                   </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-1">{agency.name}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Partner Since {new Date(agency.createdAt).getFullYear()}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Globe size={16} className="text-gray-300" />
                  <span>HQ: Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-300" />
                  <span>contact@{agency.name.toLowerCase().replace(/\s/g, '')}.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck size={16} className="text-green-500/50" />
                  <span className="font-bold text-green-600">Verified Partner</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Status</p>
                  <StatusBadge status="ACTIVE" />
                </div>
                <button className="px-5 py-2 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-primary transition-colors uppercase tracking-widest leading-none">
                  Switch
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
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  {editingAgency ? 'Edit Agency' : 'Register Agency'}
                </h2>
                <p className="text-gray-500 text-sm font-medium">Configure ecosystem partner credentials</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Agency Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Haven Real Estate"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Business Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+254..."
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Physical Headquarters</label>
                <input 
                  type="text" 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
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
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingAgency ? 'Update Agency' : 'Register Agency')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agencies;
