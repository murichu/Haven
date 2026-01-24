import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Home, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Building2 } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    unitNumber: '',
    type: 'TWO_BEDROOM',
    bedrooms: '',
    bathrooms: '',
    sizeSqFt: '',
    rentAmount: ''
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchUnits();
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      const payload = response.data.data;
      setProperties(Array.isArray(payload) ? payload : (payload?.properties || []));
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await api.get('/units');
      const payload = response.data.data;
      const unitsArray = Array.isArray(payload) ? payload : (payload?.items || payload?.units || []);
      setUnits(unitsArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load units');
      showToast('Error loading units', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/units/${deleteId}`);
      setUnits(units.filter(u => u.id !== deleteId));
      showToast('Unit deleted successfully', 'success');
      setDeleteId(null);
    } catch (err) {
      showToast('Failed to delete unit', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseFloat(formData.bathrooms) || 0,
        sizeSqFt: parseInt(formData.sizeSqFt) || 0,
        rentAmount: parseInt(formData.rentAmount) || 0,
      };
      const response = await api.post('/units', payload);
      await fetchUnits();
      showToast('Unit created successfully', 'success');
      setIsModalOpen(false);
      setFormData({
        propertyId: '',
        unitNumber: '',
        type: 'TWO_BEDROOM',
        bedrooms: '',
        bathrooms: '',
        sizeSqFt: '',
        rentAmount: ''
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to create unit', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUnits = (Array.isArray(units) ? units : []).filter(unit => {
    const matchesSearch = unit.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        unit.property?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Housing Units</h1>
          <p className="text-gray-500 font-medium italic">Manage and track individual rental units across your portfolio</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2.5 bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Unit</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Units</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-gray-900">{units.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-green-600/70 text-sm font-bold uppercase tracking-wider mb-1">Available</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-green-600">{units.filter(u => u.status === 'VACANT').length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-blue-600/70 text-sm font-bold uppercase tracking-wider mb-1">Occupied</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-blue-600">{units.filter(u => u.status === 'OCCUPIED').length}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by unit number or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'VACANT', 'OCCUPIED', 'MAINTENANCE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                statusFilter === status
                  ? 'bg-gray-900 text-white shadow-xl'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
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
              <th className="px-8 py-5">Unit Detail</th>
              <th className="px-8 py-5">Property</th>
              <th className="px-8 py-5">Specs</th>
              <th className="px-8 py-5">Monthly Rent</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredUnits.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    icon={Home}
                    title="No units match your search"
                    description="Try adjusting your filters or search terms to find what you're looking for."
                    action={
                      <button onClick={() => {setSearchTerm(''); setStatusFilter('ALL')}} className="text-primary font-bold text-sm">Clear all filters</button>
                    }
                  />
                </td>
              </tr>
            ) : (
              filteredUnits.map((unit) => (
                <tr key={unit.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                        {unit.unitNumber}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{unit.unitNumber}</p>
                        <p className="text-xs text-gray-400 font-medium">Floor {unit.floor || 'G'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Building2 size={16} className="text-gray-400" />
                      {unit.property?.name || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase">{unit.bedrooms || 0} BR</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase">{unit.bathrooms || 0} BA</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-base font-black text-gray-900">${unit.rentAmount?.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Per Month</p>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={unit.status || 'VACANT'} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-primary transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(unit.id)}
                        className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Add New Unit</h3>
                  <p className="text-sm text-gray-500 font-medium">Specify unit details and property</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Parent Property</label>
                  <select
                    required
                    value={formData.propertyId}
                    onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-700"
                  >
                    <option value="">Select Property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Unit Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. A101"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Unit Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-700"
                  >
                    <option value="ONE_BEDROOM">One Bedroom</option>
                    <option value="TWO_BEDROOM">Two Bedroom</option>
                    <option value="THREE_BEDROOM">Three Bedroom</option>
                    <option value="BEDSITTER">Bedsitter</option>
                    <option value="MAISONETTE">Maisonette</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Rent Amount</label>
                  <input
                    required
                    type="number"
                    placeholder="Monthly rent"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Bedrooms</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-700"
                  />
                </div>

                <div className="col-span-2 pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-gray-900 text-white rounded-[1.25rem] py-4 font-black text-lg hover:bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                    {isSubmitting ? 'Creating Unit...' : 'Create Unit'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Units;

