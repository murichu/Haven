import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Tag, 
  Info,
  Clock,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    entityType: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters.action, filters.entityType]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await api.get('/audit-logs', { params });
      setLogs(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (err) {
      console.error(err);
      showToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'text-green-600 bg-green-50';
      case 'UPDATE': return 'text-blue-600 bg-blue-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      case 'LOGIN': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Audit Trail</h1>
          <p className="text-gray-500 font-medium mt-1">Complete system activity logs for compliance and security monitoring</p>
        </div>
        <button className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-bold shadow-soft border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
          <Download size={20} className="text-gray-400" />
          Export CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users, entities, or descriptions..." 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
            />
          </div>
          
          <select 
            value={filters.action}
            onChange={(e) => setFilters({...filters, action: e.target.value})}
            className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none text-gray-600"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>

          <select 
            value={filters.entityType}
            onChange={(e) => setFilters({...filters, entityType: e.target.value})}
            className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none text-gray-600"
          >
            <option value="">All Entities</option>
            <option value="Property">Property</option>
            <option value="Tenant">Tenant</option>
            <option value="Lease">Lease</option>
            <option value="User">User</option>
            <option value="Invoice">Invoice</option>
          </select>

          <button type="submit" className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg hover:shadow-primary/20">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">Timestamp & User</th>
              <th className="px-8 py-6">Activity</th>
              <th className="px-8 py-6">Entity Context</th>
              <th className="px-8 py-6">Origin Data</th>
              <th className="px-8 py-6 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(8)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState 
                    icon={Activity}
                    title="No logs found"
                    description="No system activity matches your current filter criteria."
                  />
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex flex-col items-center justify-center shrink-0">
                         <Clock size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 mb-0.5">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <User size={10} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase truncate max-w-[120px]">{log.userName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${getActionColor(log.action)}`}>
                      {log.action}
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-snug max-w-xs">{log.description}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-primary" />
                        <span className="text-xs font-black text-gray-900">{log.entityType}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate max-w-[150px]">
                        {log.entityName || `#${log.entityId?.slice(-8) || 'SYSTEM'}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Globe size={12} />
                        <span className="text-[10px] font-bold">{log.ipAddress || 'Internal'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Smartphone size={12} />
                        <span className="text-[10px] font-bold truncate max-w-[120px]">{log.userAgent || 'Server Process'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-white shadow-soft rounded-xl text-gray-400 hover:text-primary transition-all">
                      <Info size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="flex justify-between items-center px-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{logs.length}</span> of <span className="text-gray-900">{pagination.total}</span> events
          </p>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
              className="px-6 py-3 bg-white rounded-xl font-bold text-xs uppercase tracking-widest text-gray-500 disabled:opacity-30 shadow-soft border border-gray-100"
            >
              Previous
            </button>
            <button 
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              className="px-6 py-3 bg-white rounded-xl font-bold text-xs uppercase tracking-widest text-gray-500 disabled:opacity-30 shadow-soft border border-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
