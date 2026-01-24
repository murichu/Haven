import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const RevenueChart = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  
  const data = [
    { name: 'Fri', val: 15000 },
    { name: 'Sat', val: 12000 },
    { name: 'Sun', val: 22430 }, // High point
    { name: 'Mon', val: 13000 },
    { name: 'Thu', val: 16000 },
    { name: 'Wed', val: 22000 },
    { name: 'Thus', val: 16000 },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-soft h-[360px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="font-bold text-xl text-gray-900">Revenue analytics</h3>
           <p className="text-gray-400 text-sm mt-1">Weekly performance</p>
        </div>
        <select className="bg-gray-50 border-none text-sm px-4 py-2 rounded-xl text-gray-600 font-medium focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            barSize={40}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setHoverIndex(state.activeTooltipIndex);
              } else {
                setHoverIndex(null);
              }
            }}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 13 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
               cursor={{ fill: 'transparent' }}
               contentStyle={{ 
                 borderRadius: '16px', 
                 border: 'none', 
                 boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                 padding: '12px 20px',
                 backgroundColor: '#1F2937',
                 color: '#fff'
               }}
               itemStyle={{ color: '#fff' }}
               formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="val" radius={[12, 12, 12, 12]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={hoverIndex === index || entry.val > 20000 ? '#FF4D15' : '#F3F4F6'} 
                  className="transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
