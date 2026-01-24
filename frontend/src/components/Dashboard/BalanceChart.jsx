import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BalanceChart = () => {
  const data = [
    { name: '1', val: 4000 },
    { name: '2', val: 3000 },
    { name: '3', val: 2000 },
    { name: '4', val: 2780 },
    { name: '5', val: 1890 },
    { name: '6', val: 2390 },
    { name: '7', val: 3490 },
    { name: '8', val: 4200 },
    { name: '9', val: 3800 },
    { name: '10', val: 5000 },
    { name: '11', val: 4800 },
    { name: '12', val: 5200 },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft h-[320px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
         <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
           Balance <span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-sm font-normal text-gray-400">On track</span>
         </h3>
         <select className="bg-transparent text-sm text-gray-400 border-none focus:ring-0 cursor-pointer hover:text-gray-600">
           <option>Monthly</option>
         </select>
      </div>

      <div className="flex gap-12 mb-8">
         <div>
            <p className="text-xs text-gray-400 mb-1">Saves</p>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-bold text-gray-900">43.50%</span>
               <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-lg">+2.45%</span>
            </div>
         </div>
         <div>
            <p className="text-xs text-gray-400 mb-1">Balance</p>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-bold text-gray-900">$52,422</span>
               <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-lg">-4.75%</span>
            </div>
         </div>
      </div>
      
      {/* Chart */}
      <div className="h-48 w-full absolute bottom-0 left-0 right-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B5E43" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4B5E43" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke="#4B5E43" 
              strokeWidth={2}
              fill="url(#colorVal)" 
              tension={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
