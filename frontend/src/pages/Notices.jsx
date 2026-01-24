import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Megaphone, Plus, Search, Calendar, MapPin, Users, Trash2, Edit2, Volume2, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
    category: 'GENERAL',
    propertyId: '',
    expiresAt: ''
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotices();
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      const data = response.data;
      setProperties(Array.isArray(data) ? data : (data?.properties || []));
    } catch (err) {
      console.error('Failed to load properties for notice scope');
    }
  };

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notices');
      const data = response.data;
      const noticesArray = Array.isArray(data) ? data : (data?.notices && Array.isArray(data.notices) ? data.notices : []);
      setNotices(noticesArray);
    } catch (err) {
      console.error(err);
      showToast('Error loading active notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/notices', {
        ...formData,
        propertyId: formData.propertyId === 'ALL' ? undefined : formData.propertyId,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      });
      setNotices([response.data.notice || response.data, ...notices]);
      showToast('Notice broadcast successfully', 'success');
      setShowModal(false);
      resetForm();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to send notice', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'NORMAL',
      category: 'GENERAL',
      propertyId: 'ALL',
      expiresAt: ''
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notices/${deleteId}`);
      setNotices(notices.filter(n => n.id !== deleteId));
      showToast('Notice withdrawn successfully', 'success');
    } catch (err) {
       showToast('Failed to withdraw notice', 'error');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotices = (Array.isArray(notices) ? notices : []).filter(n =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Digital Notices</h1>
          <p className="text-gray-500 mt-1">Broadcast announcements and important alerts to your residents</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Megaphone size={20} strokeWidth={3} />
          Create Notice
        </button>
      </div>

      {/* Notice Grid Filter */}
      <div className="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search active broadcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-gray-50 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-gray-50 rounded-2xl" />
             </div>
          ))}
        </div>
      ) : filteredNotices.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No live notices"
          description="Your broadcast history is currently empty. Start by creating an announcement for your properties."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-100 group relative hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      notice.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'
                    }`}>
                      <Volume2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">{notice.title}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} />
                        Expires {formatDate(notice.expiresAt)}
                      </p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setDeleteId(notice.id)}
                      className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-3xl mb-6">
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{notice.content}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                 <div className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase text-gray-500">
                    <MapPin size={12} strokeWidth={3} />
                    {notice.property?.name || 'All Properties'}
                 </div>
                 <div className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase text-gray-500">
                    <Users size={12} strokeWidth={3} />
                    Residents Only
                 </div>
                 <div className="ml-auto">
                    <StatusBadge status={notice.status || 'ACTIVE'} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Withdraw Notice"
        message="Are you sure you want to take down this announcement? It will no longer be visible on tenant portals."
        confirmText="Withdraw"
      />

      {/* Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl p-10 relative">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Create Broadcast</h2>
            <p className="text-gray-500 mb-8 font-medium">Send a digital notice to all residents or a specific property.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notice Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Scheduled Water Maintenance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Announcement Message</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Provide detailed instructions or information..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Scope</label>
                  <select 
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none"
                  >
                    <option value="ALL">All Properties</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name || p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date (Optional)</label>
                <input 
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
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
                  className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm uppercase tracking-widest"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
