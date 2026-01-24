import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusStyles = () => {
    // Invoice/Payment statuses
    if (status === 'PAID' || status === 'Completed' || status === 'Active') {
      return 'bg-green-100 text-green-700';
    }
    if (status === 'PENDING' || status === 'Processing') {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (status === 'OVERDUE' || status === 'Failed' || status === 'Expired') {
      return 'bg-red-100 text-red-600';
    }
    if (status === 'PARTIAL') {
      return 'bg-blue-100 text-blue-700';
    }
    
    // Unit statuses
    if (status === 'VACANT' || status === 'Available') {
      return 'bg-green-100 text-green-700';
    }
    if (status === 'OCCUPIED') {
      return 'bg-blue-100 text-blue-700';
    }
    if (status === 'MAINTENANCE') {
      return 'bg-orange-100 text-orange-700';
    }
    if (status === 'RESERVED') {
      return 'bg-purple-100 text-purple-700';
    }
    
    // Default
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
