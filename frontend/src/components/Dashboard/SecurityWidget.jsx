import React from 'react';
import { Fingerprint } from 'lucide-react';

const securityWidget = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft text-center flex flex-col items-center justify-center">
       <div className="w-16 h-16 rounded-full bg-green-50 mb-4 flex items-center justify-center text-primary border border-primary/20">
          <Fingerprint size={32} />
       </div>
       
       <h3 className="font-bold text-lg text-gray-900 mb-1">Keep you safe!</h3>
       <p className="text-gray-400 text-sm mb-6">Update your security password</p>
       
       <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors w-full shadow-lg shadow-primary/30">
          Update Your Security
       </button>
    </div>
  );
};

export default securityWidget;
