import React from 'react';
import { Search, Bell, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Hello, Carlic!</h1>
        <p className="text-gray-500 text-sm">Explore information and activity about your property</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-6 pr-12 py-3 bg-white rounded-full w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm transition-all text-gray-600 placeholder-gray-400 font-medium"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 rounded-full text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
            <Search size={14} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow-md transition-all shadow-sm relative group">
            <MessageCircle size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow-md transition-all shadow-sm">
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
