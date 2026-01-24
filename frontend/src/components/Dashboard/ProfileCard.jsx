import React from 'react';

const ProfileCard = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft flex flex-col items-center justify-center text-center">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-md">
           <span role="img" aria-label="user">🧔</span>
        </div>
      </div>
      
      <h3 className="font-bold text-lg text-gray-900">Carlic Bolomboy</h3>
      <p className="text-gray-400 text-sm mb-6">carlic@gmail.com</p>
      
      <div className="flex justify-between w-full px-4">
         <div>
            <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Projects</p>
            <p className="font-bold text-xl text-gray-800">26</p>
         </div>
         <div className="w-[1px] bg-gray-100 h-8 self-center"></div>
         <div>
            <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Followers</p>
            <p className="font-bold text-xl text-gray-800">356</p>
         </div>
         <div className="w-[1px] bg-gray-100 h-8 self-center"></div>
         <div>
            <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Following</p>
            <p className="font-bold text-xl text-gray-800">68</p>
         </div>
      </div>
    </div>
  );
};

export default ProfileCard;
