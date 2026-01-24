import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart3, Download, TrendingUp, DollarSign, Home, Users } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;

  const stats = {
    properties: dashboardData?.properties?.total ?? (typeof dashboardData?.properties === 'number' ? dashboardData.properties : 0),
    tenants: dashboardData?.tenants?.total ?? (typeof dashboardData?.tenants === 'number' ? dashboardData.tenants : 0),
    leases: dashboardData?.leases?.active ?? (typeof dashboardData?.leases === 'number' ? dashboardData.leases : 0),
    revenue: dashboardData?.payments?.thisMonth?.amount || 0,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Business insights and performance metrics</p>
        </div>
        <button className="bg-white text-gray-700 px-4 py-2.5 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all flex items-center gap-2">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Home className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Properties</p>
          <p className="text-3xl font-bold text-gray-900">{stats.properties}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Tenants</p>
          <p className="text-3xl font-bold text-gray-900">{stats.tenants}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Leases</p>
          <p className="text-3xl font-bold text-gray-900">{stats.leases}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-500 text-sm mb-1">Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Report */}
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Occupancy Rate</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">
                {stats.leases > 0 && stats.properties > 0 
                  ? Math.round((stats.leases / stats.properties) * 100) 
                  : 0}%
              </p>
              <p className="text-gray-500">Current Occupancy</p>
            </div>
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Collection Rate</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">95%</p>
              <p className="text-gray-500">Payment Collection</p>
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-3xl p-6 shadow-soft lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="text-center py-12 text-gray-400">
            <BarChart3 size={48} className="mx-auto mb-4" />
            <p>Revenue chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
