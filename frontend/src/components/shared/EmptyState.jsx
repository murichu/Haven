import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-md">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
