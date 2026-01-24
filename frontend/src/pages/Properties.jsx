import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Building2, MapPin, Bed, Bath, Square, Plus, X, Loader2, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import StatusBadge from '../components/shared/StatusBadge';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        city: '',
        state: '',
        rentAmount: '',
        type: 'APARTMENT',
        status: 'AVAILABLE'
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await api.get('/properties');
            const payload = response.data.data;
            const propertiesArray = Array.isArray(payload) ? payload : (payload?.properties || []);
            setProperties(propertiesArray);
        } catch (err) {
            console.error(err);
            setError('Failed to load properties');
            showToast('Error loading properties', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (property = null) => {
        if (property) {
            setEditingProperty(property);
            setFormData({
                title: property.title,
                address: property.address,
                city: property.city || '',
                state: property.state || '',
                rentAmount: property.rentAmount || '',
                type: property.type,
                status: property.status
            });
        } else {
            setEditingProperty(null);
            setFormData({
                title: '',
                address: '',
                city: '',
                state: '',
                rentAmount: '',
                type: 'APARTMENT',
                status: 'AVAILABLE'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingProperty) {
                await api.put(`/properties/${editingProperty.id}`, formData);
                showToast('Property updated successfully', 'success');
            } else {
                await api.post('/properties', formData);
                showToast('Property added successfully', 'success');
            }
            setIsModalOpen(false);
            fetchProperties();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.error || 'Failed to save property', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await api.delete(`/properties/${id}`);
            showToast('Property deleted successfully', 'success');
            fetchProperties();
        } catch (err) {
            showToast('Failed to delete property', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading properties...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Properties</h1>
                    <p className="text-gray-500 font-medium">Manage your real estate assets and multi-unit complexes</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={3} />
                    Add Property
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-[2.5rem] p-6 shadow-soft hover:shadow-2xl transition-all group flex flex-col">
                        <div className="h-48 bg-gray-50 rounded-[2rem] mb-6 relative overflow-hidden shadow-inner">
                            {property.images?.[0] ? (
                                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Building2 size={48} />
                                </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-lg uppercase tracking-widest">
                                    {property.type?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleOpenModal(property); }}
                                  className="p-3 bg-white/90 backdrop-blur rounded-2xl text-gray-400 hover:text-primary shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(property.id); }}
                                  className="p-3 bg-white/90 backdrop-blur rounded-2xl text-gray-400 hover:text-red-500 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-black text-xl text-gray-900 mb-1 tracking-tight">{property.title}</h3>
                        <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                            <MapPin size={16} className="mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{property.address || 'No address provided'}</span>
                        </div>

                        <div className="flex items-center gap-4 border-t border-gray-50 pt-6 mt-auto text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600 font-bold">
                                <Square size={16} />
                                <span>{property.units?.length || 0} Units</span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-auto">
                                <StatusBadge status={property.status || 'AVAILABLE'} />
                            </div>
                        </div>
                    </div>
                ))}

                {properties.length === 0 && (
                     <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                           <Building2 size={32} />
                        </div>
                        <h3 className="text-gray-900 font-bold mb-1">No properties yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Get started by adding your first property</p>
                     </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {editingProperty ? 'Edit Property' : 'Add Property'}
                                </h2>
                                <p className="text-gray-500 text-sm font-medium">Configure primary asset details</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Property Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g. Haven Heights Complex"
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Physical Address</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        placeholder="Enter street name and location"
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                    <input 
                                        type="text" 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">State / Province</label>
                                    <input 
                                        type="text" 
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Monthly Rent Est. ($)</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.rentAmount}
                                        onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Property Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="APARTMENT">Apartment</option>
                                        <option value="SINGLE_ROOM">Single Room</option>
                                        <option value="BUNGALOW">Bungalow</option>
                                        <option value="MAISONETTE">Maisonette</option>
                                        <option value="VILLA">Villa</option>
                                        <option value="OFFICE">Office Space</option>
                                    </select>
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
                                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingProperty ? 'Update Property' : 'Register Property')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Properties;
