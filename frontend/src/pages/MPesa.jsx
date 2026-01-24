import React from 'react';
import { Smartphone, Sparkles } from 'lucide-react';

const Mpesa = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner ring-1 ring-green-100">
                <Smartphone size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">M-Pesa Integration</h1>
            <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
                C2B and B2C STK Push automation settings for automated rent collection via Daraja API.
            </p>
            <div className="mt-8 px-6 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                <Sparkles size={14} />
                Integrations Pending
            </div>
        </div>
    );
};

export default Mpesa;
