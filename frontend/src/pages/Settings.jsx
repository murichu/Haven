import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Building2, Globe, Palette, LogOut, ChevronRight, Save, Camera, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { showToast } = useToast();

  const handleSave = () => {
    showToast('Changes saved successfully', 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'agency', label: 'Agency Info', icon: Building2 },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 font-medium">Customize your experience and manage system preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-[2.5rem] p-4 shadow-soft border border-gray-100 flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between p-4 rounded-3xl transition-all duration-300 group ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-xl translate-x-1' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                     activeTab === tab.id ? 'bg-white/10' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-gray-900'
                  }`}>
                    <tab.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-black uppercase text-[10px] tracking-widest">{tab.label}</span>
                </div>
                <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </button>
            ))}
            
            <div className="my-2 border-t border-gray-50" />
            
            <button className="flex items-center gap-4 p-4 rounded-3xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest group">
               <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-white transition-colors">
                  <LogOut size={20} strokeWidth={2.5} />
               </div>
               Logout Session
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-gray-100 min-h-[600px] relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
             
             {activeTab === 'profile' && (
               <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-8 mb-12">
                     <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                           <User size={64} className="text-gray-300" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:scale-110 transition-all group-active:scale-95">
                           <Camera size={18} strokeWidth={3} />
                        </button>
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-1">Your Profile</h2>
                        <p className="text-gray-400 text-sm font-medium">Update your personal details and avatar</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-transparent focus-within:bg-white focus-within:border-gray-100 transition-all">
                           <User size={18} className="text-gray-300" />
                           <input type="text" placeholder="John Doe" className="bg-transparent border-none focus:outline-none text-sm font-bold text-gray-900 w-full" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-transparent focus-within:bg-white focus-within:border-gray-100 transition-all">
                           <Mail size={18} className="text-gray-300" />
                           <input type="email" placeholder="john@haven.com" className="bg-transparent border-none focus:outline-none text-sm font-bold text-gray-900 w-full" />
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    Save Profile Changes
                    <Save size={16} strokeWidth={3} />
                  </button>
               </div>
             )}

             {activeTab === 'security' && (
               <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black text-gray-900 mb-8">Security & Access</h2>
                  <div className="space-y-6 max-w-lg mb-10">
                     <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft">
                                 <Lock size={18} className="text-primary" />
                              </div>
                              <span className="font-bold text-gray-900 text-sm">Two-Factor Auth</span>
                           </div>
                           <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer group">
                              <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-all group-hover:scale-110" />
                           </div>
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">Add an extra layer of protection to your account using 2FA tokens.</p>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Change Password</p>
                        <div className="space-y-3">
                           <input type="password" placeholder="Current Password" className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold" />
                           <input type="password" placeholder="New Password" className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold" />
                        </div>
                     </div>
                  </div>
                  
                  <button 
                  onClick={handleSave}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all flex items-center gap-3"
                  >
                  Update Security Settings
                  <Save size={16} strokeWidth={3} />
                  </button>
               </div>
             )}

             {activeTab !== 'profile' && activeTab !== 'security' && (
               <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                    {(() => {
                      const TabIcon = tabs.find(t => t.id === activeTab)?.icon;
                      return TabIcon ? <TabIcon size={32} className="text-gray-300" /> : null;
                    })()}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">{activeTab} section</h3>
                  <p className="text-sm text-gray-400 font-medium">Advanced configuration coming soon</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
