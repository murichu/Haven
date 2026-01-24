import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  ArrowRight,
  CheckCircle2,
  Globe,
  Smartphone,
  Users
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-inter selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
               <Building2 className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">Haven</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">Features</a>
            <a href="#pricing" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">Pricing</a>
            <Link to="/public-properties" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">Listings</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest px-4">Sign In</Link>
            <Link to="/register" className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-8">
              <Zap size={14} />
              Reimagining Property Management
            </div>
            <h1 className="text-7xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-8">
              The Enterprise <br />
              <span className="text-primary italic">Engine</span> for <br />
              Modern Real Estate.
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg mb-10">
              Automate rent collection, manage multi-state portfolios, and scale your agency with Haven's premium management infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-gray-900 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
                Launch Dashboard
                <ArrowRight size={20} strokeWidth={3} />
              </Link>
              <Link to="/public-properties" className="bg-white text-gray-900 border border-gray-100 px-8 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-soft flex items-center justify-center hover:bg-gray-50 transition-all">
                Browse Listings
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100/50 rounded-full blur-[100px]" />
            <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-gray-100 relative group overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
                 alt="Dashboard Preview" 
                 className="rounded-[2.5rem] w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute top-10 right-10 bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl border border-white/50 animate-bounce">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Collection Rate</p>
                  <p className="text-3xl font-black text-gray-900">98.4%</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-20 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10">
          {[
            { label: 'Units under management', value: '15,000+' },
            { label: 'Active Agencies', value: '450+' },
            { label: 'Collection Volume', value: '$85.2M' },
            { label: 'Client Retention', value: '99.9%' }
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[200px]">
              <p className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Enterprise Architecture.</h2>
            <p className="text-gray-500 font-medium">Everything you need to run a high-performing real estate business in one unified vertical cloud.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: 'Compliance First', 
                desc: 'Full audit trails, data isolation, and RBAC security built into every transaction.' 
              },
              { 
                icon: Zap, 
                title: 'Smart Automation', 
                desc: 'Automated late fee calculation and recurring invoicing triggers every single day.' 
              },
              { 
                icon: BarChart3, 
                title: 'Vertical Analytics', 
                desc: 'Deep insights into occupancy trends, revenue health, and agency performance.' 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-soft border border-gray-50 hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                   <Building2 className="text-gray-900" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">Haven</span>
              </div>
              <h4 className="text-4xl font-black tracking-tight max-w-md mb-8">Ready to transform your property operations?</h4>
              <Link to="/register" className="inline-flex bg-primary text-white px-8 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 transition-all">
                Start Free Trial
              </Link>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Navigation</p>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Connect</p>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Twitter (X)</a></li>
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-bold text-white/30 tracking-widest uppercase">© 2026 Haven Soft UI Engine. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</a>
              <a href="#" className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Service Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
