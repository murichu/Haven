import React from 'react';
import { Wifi, Plus } from 'lucide-react';

const CreditCard = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft">
       <h3 className="font-bold text-lg text-gray-900 mb-6">Available Credit<br/>Card in Wallet</h3>
       
       <div className="relative h-48 mb-6 perspective">
          {/* Card Back (Decorative Stack) */}
          <div className="absolute top-4 right-0 w-64 h-40 bg-gray-800 rounded-2xl transform rotate-6 opacity-30"></div>
          
          {/* Main Card */}
          <div className="absolute top-0 right-4 w-72 h-44 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl transform transition-transform hover:-translate-y-1">
             <div className="flex justify-between items-start">
               <span className="text-xs font-mono text-gray-400">Master Card</span>
               <Wifi className="rotate-90" size={20} />
             </div>
             
             <div className="font-mono text-lg tracking-widest mt-4">
                1234 1234 1234 1234
             </div>
             
             <div className="flex justify-between items-end mt-2">
                <div>
                   <p className="text-[10px] text-gray-400 uppercase">Card Holder</p>
                   <p className="text-sm font-medium">Lana Steiner</p>
                </div>
                <div className="flex flex-col items-center">
                   <div className="w-8 h-5 flex relative">
                      <div className="w-5 h-5 bg-red-500/80 rounded-full absolute left-0"></div>
                      <div className="w-5 h-5 bg-yellow-500/80 rounded-full absolute right-0"></div>
                   </div>
                </div>
             </div>
          </div>
       </div>
       
       <p className="text-gray-400 text-sm mb-6 leading-relaxed">
         Lorem ipsum dolor sit amet consectetur. Facilisis tincidunt purus id hendrerit cras massa.
       </p>
       
       <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
          <Plus size={16} />
          Add New Card
       </button>
    </div>
  );
};

export default CreditCard;
