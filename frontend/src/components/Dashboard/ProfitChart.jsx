import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const ProfitChart = () => {
  const data = [
    { name: 'Jan', profit: 32, loss: 22 },
    { name: 'Feb', profit: 41, loss: 14 },
    { name: 'Mar', profit: 45, loss: 16 },
    { name: 'Apr', profit: 38, loss: 20 },
    { name: 'May', profit: 42, loss: 16 },
    { name: 'Jun', profit: 48, loss: 28 },
    { name: 'Jul', profit: 38, loss: 20 },
    { name: 'Aug', profit: 32, loss: 14 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="mb-8">
        <h3 className="font-bold text-lg text-gray-900">Profit and Loss</h3>
        <p className="text-sm text-gray-400">View your income in a certain period of time</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={12}>
             <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
             <XAxis 
               dataKey="name" 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#9CA3AF', fontSize: 12 }} 
               dy={10}
             />
             <YAxis hide={true} />
             <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             />
             <Legend iconType="circle" />
             <Bar dataKey="profit" fill="#FF4D15" radius={[4, 4, 4, 4]} name="Profit" />
             <Bar dataKey="loss" fill="#1F2937" radius={[4, 4, 4, 4]} name="Loss" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitChart;
