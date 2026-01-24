import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EarningsChart = () => {
  const data = [
    { name: 'Profit', value: 80 },
    { name: 'Remaining', value: 20 },
  ];
  const COLORS = ['#4B5E43', '#E5E7EB'];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft flex flex-col justify-between">
       <div>
         <h3 className="font-bold text-lg text-gray-900">Earnings</h3>
         <p className="text-gray-400 text-xs mb-3">Total Expense</p>
         <h2 className="text-3xl font-bold text-green-700 mb-2">$6078.76</h2>
         <p className="text-gray-400 text-xs w-2/3">Profit is 34% More than last Month</p>
       </div>

       <div className="h-32 w-full relative mt-4">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="100%"
                 startAngle={180}
                 endAngle={0}
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={0}
                 dataKey="value"
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                 ))}
               </Pie>
            </PieChart>
         </ResponsiveContainer>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
            <span className="text-2xl font-bold text-gray-900">80%</span>
         </div>
       </div>
    </div>
  );
};

export default EarningsChart;
