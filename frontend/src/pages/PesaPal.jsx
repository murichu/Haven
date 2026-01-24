import React from 'react';
import { CreditCard, Sparkles } from 'lucide-react';

const Pesapal = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner ring-1 ring-blue-100">
                <CreditCard size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">PesaPal Payments</h1>
            <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
                Accept Visa, Mastercard, and Mobile Money through the PesaPal unified gateway.
            </p>
            <div className="mt-8 px-6 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                <Sparkles size={14} />
                Integrations Pending
            </div>
        </div>
    );
};

export default Pesapal;
