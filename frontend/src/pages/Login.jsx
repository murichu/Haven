import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F1EF] flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-soft w-full max-w-md">
         {/* Logo */}
         <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-[#FF4D15] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/20 transform rotate-3">
                   F
               </div>
               <span className="font-plaster text-3xl font-bold text-gray-900">Finexy</span>
            </div>
         </div>

         <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to access your properties</p>
         </div>

         {error && (
           <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-600"></div>
              {error}
           </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-5">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email address</label>
               <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                  placeholder="name@company.com"
               />
            </div>
            
            <div>
               <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>
               </div>
               <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
               />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FF4D15] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                 <>
                   Sign In <ArrowRight size={18} />
                 </>
              )}
            </button>
         </form>

         <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? 
            <Link to="/register" className="text-primary font-bold hover:underline ml-1">Create Agency</Link>
         </div>
      </div>
    </div>
  );
};

export default Login;
