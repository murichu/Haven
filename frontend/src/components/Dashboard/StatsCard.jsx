import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const StatsCard = ({ title, value, icon: Icon, trend, subLabel, chartData, type = 'default' }) => {
  const isDark = type === 'dark';
  const bgColor = isDark ? 'bg-primary text-white' : 'bg-white text-gray-900';
  const subTextColor = isDark ? 'text-white/70' : 'text-gray-500';
  const valueColor = isDark ? 'text-white' : 'text-gray-900';
  
  const isPositive = trend > 0;

  return (
    <div className={`${bgColor} p-6 rounded-3xl shadow-soft h-[180px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all`}>
      <div className="flex justify-between items-start z-10">
        <div>
          <p className={`${subTextColor} text-xs font-bold uppercase tracking-wider mb-2`}>{title}</p>
          <h3 className={`${valueColor} text-3xl font-bold mb-1`}>{value}</h3>
          
          {/* Trend Indicator (Design 1 style but soft) */}
          {trend && (
             <div className="flex items-center gap-2 mt-2">
               <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                 isPositive 
                   ? (isDark ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700') 
                   : 'bg-red-100 text-red-600'
               }`}>
                 {isPositive ? '+' : ''}{trend}%
               </span>
               <span className={`${subTextColor} text-xs hidden sm:inline-block`}>
                  {subLabel || 'from last month'}
               </span>
             </div>
          )}
        </div>
        
        {/* Icon Circle (Design 1 style) */}
        {Icon && (
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'
           }`}>
              <Icon size={24} />
           </div>
        )}
      </div>

      <div className="flex items-end justify-between z-10 w-full">
         {/* Mini Sparkline Chart from Design 2 */}
         {chartData && (
           <div className="h-16 w-full absolute bottom-0 left-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={isDark ? '#fff' : '#4B5E43'} stopOpacity={0.5}/>
                     <stop offset="95%" stopColor={isDark ? '#fff' : '#4B5E43'} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Area 
                   type="monotone" 
                   dataKey="val" 
                   stroke={isDark ? '#fff' : '#4B5E43'} 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill={`url(#gradient-${type})`} 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         )}
      </div>
    </div>
  );
};

export default StatsCard;
