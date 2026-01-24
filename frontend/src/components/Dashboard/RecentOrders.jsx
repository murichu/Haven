import React from 'react';
import { Search, SlidersHorizontal, MoreHorizontal } from 'lucide-react';

const RecentOrders = () => {
  const orders = [
    { id: '#878909', date: '2 Dec 2026', customer: 'Oliver John Brown', category: 'Shoes, Shirt', status: 'Pending', items: 2, total: 789.00 },
    { id: '#878910', date: '1 Dec 2026', customer: 'Noah James Smith', category: 'Sneakers, T-shirt', status: 'Completed', items: 3, total: 967.00 },
    { id: '#878911', date: '30 Nov 2026', customer: 'Emma Wilson', category: 'Accessories', status: 'Pending', items: 1, total: 450.00 },
    { id: '#878912', date: '29 Nov 2026', customer: 'Sophia Anderson', category: 'Jackets', status: 'Completed', items: 4, total: 1200.50 },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-xl text-gray-900">Recent orders</h3>
        
        <div className="flex gap-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
             <SlidersHorizontal size={18} />
             Filter
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="text-gray-400 font-medium text-sm">
            <tr>
              <th className="py-4 pl-4 font-medium"><input type="checkbox" className="rounded-md border-gray-300 text-primary focus:ring-primary w-4 h-4" /></th>
              <th className="py-4 font-medium">Order ID</th>
              <th className="py-4 font-medium">Date</th>
              <th className="py-4 font-medium">Customer</th>
              <th className="py-4 font-medium">Category</th>
              <th className="py-4 font-medium">Status</th>
              <th className="py-4 font-medium text-right pr-4">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-none">
                <td className="py-5 pl-4"><input type="checkbox" className="rounded-md border-gray-300 text-primary focus:ring-primary w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" /></td>
                <td className="py-5 font-semibold text-gray-900">{order.id}</td>
                <td className="py-5 text-gray-500">{order.date}</td>
                <td className="py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                         {order.customer.charAt(0)}
                      </div>
                      <span className="text-gray-900 font-medium">{order.customer}</span>
                   </div>
                </td>
                <td className="py-5 text-gray-500">{order.category}</td>
                <td className="py-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                    order.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                    {order.status}
                  </span>
                </td>
                <td className="py-5 font-bold text-gray-900 text-right pr-4">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
