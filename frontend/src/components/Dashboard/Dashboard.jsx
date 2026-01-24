import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Building2, UserPlus, Package, DollarSign, Calendar, Loader2 } from 'lucide-react';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import RecentOrders from './RecentOrders';
import CreditCard from './CreditCardWidget';
import EarningsChart from './EarningsChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
     <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
     </div>
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  // Safe mapping with defaults - handle nested objects from API
  const getSafeVal = (obj, key, fallback = 0) => {
      if (!obj) return fallback;
      if (typeof obj[key] === 'number') return obj[key];
      if (typeof obj === 'number') return obj;
      return fallback;
  };

  const stats = {
      properties: getSafeVal(data?.properties, 'total'),
      tenants: getSafeVal(data?.tenants, 'total'),
      leases: getSafeVal(data?.leases, 'active'),
      revenue: getSafeVal(data?.payments?.thisMonth, 'amount'),
      paymentCount: getSafeVal(data?.payments?.thisMonth, 'count'),
  };

  return (
    <div className="space-y-8">
       {/* Hybrid Header with Date Picker (Design 1) */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Overview</h2>
            <p className="text-gray-400 text-sm">Monitor your business performance</p>
         </div>
         <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 shadow-soft hover:shadow-md transition-shadow">
           <Calendar size={18} />
           <span>April 10, 2026 - May 11, 2026</span>
         </button>
       </div>

       {/* Row 1: Stats Cards (Real PMS Data) */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Properties" 
            value={stats.properties} 
            icon={Building2} 
            subLabel="Managed properties"
            type="default"
          />
          <StatsCard 
            title="Total Tenants" 
            value={stats.tenants} 
            icon={UserPlus} 
            subLabel="Registered tenants"
            type="default"
          />
          <StatsCard 
            title="Active Leases" 
            value={stats.leases} 
            icon={Package} 
            subLabel="Currently active"
            type="default"
          />
          <StatsCard 
            title="Monthly Revenue" 
            value={`$${stats.revenue.toLocaleString()}`} 
            icon={DollarSign} 
            subLabel={`${stats.paymentCount} payments this month`}
            type="dark"
          />
       </div>

       {/* Row 2: Analytics & Widgets (Hybrid) */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Revenue Bar Chart (Design 1 Data + Soft Style) */}
         <div className="lg:col-span-2">
            <RevenueChart /> 
            {/* Note: RevenueChart needs to accept props to be dynamic, but keeping mock for now as per minimal change request */}
         </div>
         
         {/* Right: Premium Widgets (Design 2) */}
         <div className="lg:col-span-1 flex flex-col gap-6">
            <CreditCard />
         </div>
       </div>

       {/* Row 3: Data & Profit (Hybrid) */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Recent Orders Table (Design 1 Content + Soft Style) */}
         <div className="lg:col-span-2">
            {/* Passing real data to RecentOrders if available, otherwise it falls back to mock */}
            <RecentOrders orders={data?.recentPayments} />
         </div>
         
         {/* Right: Profit/Earnings Donut (Design 2) */}
         <div className="lg:col-span-1">
             <EarningsChart />
         </div>
       </div>
    </div>
  );
};

export default Dashboard;
