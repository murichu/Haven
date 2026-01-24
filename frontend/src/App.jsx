import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Units from './pages/Units';
import Leases from './pages/Leases';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Messaging from './pages/Messaging';
import Users from './pages/Users';
import Agencies from './pages/Agencies';
import Penalties from './pages/Penalties';
import Notices from './pages/Notices';
import AuditLogs from './pages/AuditLogs';
import LandingPage from './pages/LandingPage';
import PublicProperties from './pages/PublicProperties';
import Agents from './pages/Agents';
import Caretakers from './pages/Caretakers';
import Maintenance from './pages/Maintenance';
import Mpesa from './pages/Mpesa';
import Pesapal from './pages/Pesapal';
import KCB from './pages/KCB';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-[#F2F1EF]">...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout for authenticated pages
const AppLayout = () => {
    return (
        <div className="flex bg-[#F2F1EF] min-h-screen font-inter">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/units" element={<Units />} />
                    <Route path="/tenants" element={<Tenants />} />
                    <Route path="/leases" element={<Leases />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/messaging" element={<Messaging />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/agencies" element={<Agencies />} />
                    <Route path="/penalties" element={<Penalties />} />
                    <Route path="/notices" element={<Notices />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/caretakers" element={<Caretakers />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/mpesa" element={<Mpesa />} />
                    <Route path="/pesapal" element={<Pesapal />} />
                    <Route path="/kcb" element={<KCB />} />
                </Routes>
            </main>
        </div>
    );
};

// Component to hold the routes, to be used inside Router
const AppContent = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/public-properties" element={<PublicProperties />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
