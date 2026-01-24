import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserCog, Plus, Shield, Mail, Phone, MoreVertical, ShieldCheck, Lock, Unlock, UserPlus, Fingerprint, Settings2, Trash2 } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      const data = response.data;
      const usersArray = Array.isArray(data) ? data : (data?.users && Array.isArray(data.users) ? data.users : []);
      setUsers(usersArray);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      showToast('Error fetching user list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      setUsers(users.filter(u => u.id !== deleteId));
      showToast('User deactivated successfully', 'success');
      setDeleteId(null);
    } catch (err) {
      showToast('Failed to revoke access', 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '' // Keep empty for edits
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await api.put(`/users/${editingUser.id}`, formData);
        setUsers(users.map(u => u.id === editingUser.id ? response.data.user || response.data : u));
        showToast('User updated successfully', 'success');
      } else {
        const response = await api.post('/users', formData);
        setUsers([...users, response.data.user || response.data]);
        showToast('Staff member invited successfully', 'success');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      showToast(err.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'USER' });
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-[#1A1A1A]">User Management</h1>
          <p className="text-gray-500 mt-1">Configure agency staff roles and granular system permissions</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-bold shadow-soft border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Lock size={20} className="text-gray-400" />
            Audit Logs
          </button>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <UserPlus size={20} strokeWidth={3} />
            Invite Staff
          </button>
        </div>
      </div>

      {/* RBAC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-[#1A1A1A]">
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Administrators</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black">{users.filter(u => u.role === 'ADMIN').length}</h3>
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Regular Staff</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black">{users.filter(u => u.role === 'USER').length}</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Fingerprint size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 opacity-50">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">API Keys</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black">12</h3>
            <Settings2 size={20} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Security Score</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-green-600">94%</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/20" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Identity</th>
              <th className="px-8 py-5">Auth Method</th>
              <th className="px-8 py-5">System Role</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState
                    icon={UserCog}
                    title="No users found"
                    description="Invite your first staff member to help manage your properties."
                    action={
                      <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm">Add Staff</button>
                    }
                  />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform shadow-inner overflow-hidden border-2 border-white">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-xs text-gray-400 font-medium lowercase italic">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">JWT / OAuth</p>
                      <p className="text-[10px] text-gray-400 font-medium">Valid until Feb 2026</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <Shield size={14} className={user.role === 'ADMIN' ? 'text-primary' : 'text-gray-300'} />
                       <span className={`text-xs font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'text-primary' : 'text-gray-600'}`}>{user.role || 'USER'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={user.isActive !== false ? 'Active' : 'Inactive'} />
                  </td>
                  <td className="px-8 py-5 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-primary transition-all" 
                        title="Edit Permissions"
                      >
                        <Settings2 size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(user.id)}
                        className="p-2.5 bg-white text-gray-600 rounded-xl shadow-soft hover:text-red-600 transition-all font-bold"
                        title="Revoke Access"
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

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Revoke User Access"
        message="Are you sure you want to deactivate this user? They will immediately lose access to all agency data and tools."
        confirmText="Revoke Access"
      />

      {/* Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl p-10 relative">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {editingUser ? 'Update Permissions' : 'Invite New Staff'}
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              {editingUser ? 'Modify credentials and system access level.' : 'Send an invitation to join your management team.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="jane@agency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>

              {!editingUser && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporary Password</label>
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none"
                >
                  <option value="USER">Staff Member</option>
                  <option value="ADMIN">Full Administrator</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm uppercase tracking-widest"
                >
                  {editingUser ? 'Update Staff' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

