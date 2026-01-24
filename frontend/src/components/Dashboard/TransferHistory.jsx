import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransferHistory = () => {
  const transfers = [
    { name: 'Anna Jones', time: 'Today, 14:34', amount: '+2.45%', type: 'inc' },
    { name: 'Carlos Brown III', time: 'Today, 15:23', amount: '-4.75%', type: 'exp' },
    { name: 'Joel Cannan', time: 'Today, 17:54', amount: '+2.45%', type: 'inc' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft h-full">
      <h3 className="font-bold text-lg text-gray-900 mb-6">Your Transfers</h3>
      
      <div className="space-y-6">
        {transfers.map((item, i) => (
           <div key={i} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-12 bg-gray-200 rounded-full"></div> {/* Decorative line */}
                 <div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">From {item.name}</p>
                    <p className="text-gray-400 text-xs">{item.time}</p>
                 </div>
              </div>
              
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                item.type === 'inc' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-600'
              }`}>
                 {item.amount}
              </span>
           </div>
        ))}
      </div>
    </div>
  );
};

export default TransferHistory;
