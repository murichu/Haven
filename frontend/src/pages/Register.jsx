import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        agencyName: '',
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(
            formData.agencyName,
            formData.name,
            formData.email,
            formData.password
        );

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
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF4D15] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20 transform rotate-3">
                            F
                        </div>
                        <span className="font-plaster text-2xl font-bold text-gray-900">Finexy</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Start your journey</h1>
                    <p className="text-gray-500">Create your agency account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-600"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Agency Name</label>
                        <input
                            type="text"
                            name="agencyName"
                            value={formData.agencyName}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                            placeholder="My Real Estate Co."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                            placeholder="Min 6 characters"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF4D15] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Create Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?
                    <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
