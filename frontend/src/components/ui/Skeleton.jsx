import React from 'react';

const Skeleton = ({ className, variant = 'text' }) => {
  const baseClasses = "animate-pulse bg-gray-200";
  
  const variants = {
    text: "h-4 w-full rounded",
    title: "h-8 w-3/4 rounded-lg",
    circle: "rounded-full",
    rect: "rounded-xl",
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || variants.rect} ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
    <Skeleton variant="rect" className="h-40 w-full mb-4" />
    <Skeleton variant="title" className="mb-3" />
    <Skeleton variant="text" className="w-1/2 mb-4" />
    <div className="pt-4 border-t border-gray-50 flex justify-between">
      <Skeleton variant="rect" className="h-5 w-20" />
      <Skeleton variant="rect" className="h-5 w-24" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><Skeleton variant="rect" className="h-10 w-10" /></td>
    <td className="px-6 py-4"><Skeleton variant="text" className="w-32" /></td>
    <td className="px-6 py-4"><Skeleton variant="text" className="w-24" /></td>
    <td className="px-6 py-4"><Skeleton variant="text" className="w-20" /></td>
    <td className="px-6 py-4"><Skeleton variant="rect" className="h-6 w-16 rounded-full" /></td>
    <td className="px-6 py-4 text-right"><Skeleton variant="rect" className="h-8 w-8 ml-auto" /></td>
  </tr>
);

export default Skeleton;
