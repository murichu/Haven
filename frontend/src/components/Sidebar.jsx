import React from 'react';
import { 
  Home, 
  Building2,
  Users, 
  FileText,
  DollarSign,
  Receipt,
  BarChart3,
  Settings, 
  LogOut,
  UserCog,
  MessageCircle,
  AlertTriangle,
  Bell,
  Activity,
  DoorOpen,
  Building,
  CreditCard,
  Shield,
  Wrench,
  Smartphone,
  Landmark,
  LayoutDashboard
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, icon: Icon, label, badge }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-[#FF4D15] text-white shadow-lg shadow-orange-500/30' 
          : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'
      }`
    }
  >
    <Icon size={18} />
    <span className="font-medium text-xs flex-1">{label}</span>
    {badge && (
      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
        {badge}
      </span>
    )}
  </NavLink>
);

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#F2F1EF] border-r border-gray-200/50 fixed left-0 top-0 flex flex-col p-6 overflow-y-auto no-scrollbar z-40">
      <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
        <div className="w-10 h-10 bg-[#FF4D15] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
          H
        </div>
        <span className="font-plaster text-2xl font-bold text-gray-900">Haven</span>
      </div>

      <div className="flex-1 space-y-10 pb-10">
        {/* Core Management */}
        <div>
          <h3 className="text-gray-400 text-[10px] font-black mb-4 px-4 uppercase tracking-[0.2em]">Core Management</h3>
          <div className="space-y-1">
            <MenuItem to="/" icon={Home} label="Dashboard" />
            <MenuItem to="/properties" icon={Building2} label="Properties" />
            <MenuItem to="/units" icon={DoorOpen} label="Units" />
            <MenuItem to="/tenants" icon={Users} label="Tenants" />
            <MenuItem to="/leases" icon={FileText} label="Leases" />
          </div>
        </div>

        {/* Financials */}
        <div>
          <h3 className="text-gray-400 text-[10px] font-black mb-4 px-4 uppercase tracking-[0.2em]">Financial Suite</h3>
          <div className="space-y-1">
            <MenuItem to="/invoices" icon={Receipt} label="Invoices" />
            <MenuItem to="/payments" icon={CreditCard} label="Payments" />
            <MenuItem to="/expenses" icon={DollarSign} label="Expenses" />
            <MenuItem to="/penalties" icon={AlertTriangle} label="Penalties" />
            <MenuItem to="/reports" icon={BarChart3} label="Reports" />
          </div>
        </div>

        {/* Staff & Operations */}
        <div>
          <h3 className="text-gray-400 text-[10px] font-black mb-4 px-4 uppercase tracking-[0.2em]">Staff & Operations</h3>
          <div className="space-y-1">
            <MenuItem to="/agents" icon={UserCog} label="Agents" />
            <MenuItem to="/caretakers" icon={Shield} label="Caretakers" />
            <MenuItem to="/maintenance" icon={Wrench} label="Maintenance" />
            <MenuItem to="/notices" icon={Bell} label="Notices" />
          </div>
        </div>

        {/* Payment Integrations */}
        <div>
          <h3 className="text-gray-400 text-[10px] font-black mb-4 px-4 uppercase tracking-[0.2em]">Gateways</h3>
          <div className="space-y-1">
            <MenuItem to="/mpesa" icon={Smartphone} label="M-Pesa" />
            <MenuItem to="/pesapal" icon={CreditCard} label="PesaPal" />
            <MenuItem to="/kcb" icon={Landmark} label="KCB Buni" />
          </div>
        </div>

        {/* Admin & Communication */}
        <div>
          <h3 className="text-gray-400 text-[10px] font-black mb-4 px-4 uppercase tracking-[0.2em]">System Admin</h3>
          <div className="space-y-1">
            <MenuItem to="/messaging" icon={MessageCircle} label="Messages" />
            <MenuItem to="/users" icon={Users} label="Portal Users" />
            <MenuItem to="/agencies" icon={Building} label="Agencies" />
            <MenuItem to="/audit-logs" icon={Activity} label="Audit Logs" />
            <MenuItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-200 shrink-0">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-black text-[10px] uppercase tracking-widest">
          <LogOut size={18} />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
