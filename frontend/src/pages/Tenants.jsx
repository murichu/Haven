import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Phone, Mail, Search, MoreHorizontal, Plus, X, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tenants');
            const payload = response.data.data;
            const tenantsArray = Array.isArray(payload) ? payload : (payload?.tenants || []);
            setTenants(tenantsArray);
        } catch (err) {
            console.error(err);
            setError('Failed to load tenants');
            showToast('Error loading tenants', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (tenant = null) => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                name: tenant.name,
                email: tenant.email || '',
                phone: tenant.phone || ''
            });
        } else {
            setEditingTenant(null);
            setFormData({
                name: '',
                email: '',
                phone: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingTenant) {
                await api.put(`/tenants/${editingTenant.id}`, formData);
                showToast('Tenant updated successfully', 'success');
            } else {
                await api.post('/tenants', formData);
                showToast('Tenant added successfully', 'success');
            }
            setIsModalOpen(false);
            fetchTenants();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.error || 'Failed to save tenant', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tenant?')) return;
        try {
            await api.delete(`/tenants/${id}`);
            showToast('Tenant deleted successfully', 'success');
            fetchTenants();
        } catch (err) {
            showToast('Failed to delete tenant', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading tenants...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tenants</h1>
                    <p className="text-gray-500 font-medium">Manage and monitor verified resident profiles</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search tenants..." className="pl-12 pr-6 py-3 bg-white rounded-2xl text-sm w-72 shadow-soft border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                    </div>
                    <button 
                      onClick={() => handleOpenModal()}
                      className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Register Tenant
                    </button>
                </div>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Lease</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-primary flex items-center justify-center font-black shadow-inner">
                                            {tenant.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-gray-900">{tenant.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {tenant.id.slice(-8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} />
                                            {tenant.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={14} />
                                            {tenant.user?.phoneNumber || 'N/A'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {/* Placeholder for lease info */}
                                    No active lease
                                </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => handleOpenModal(tenant)}
                                          className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                          onClick={() => handleDelete(tenant.id)}
                                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {tenants.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                    No tenants found.
                                </td>
                            </tr>
                         )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {editingTenant ? 'Edit Tenant' : 'Register Tenant'}
                                </h2>
                                <p className="text-gray-500 text-sm font-medium">Verify resident credentials and contact info</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter tenant's full name"
                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
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
                                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingTenant ? 'Update Registry' : 'Register Profile')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tenants;
