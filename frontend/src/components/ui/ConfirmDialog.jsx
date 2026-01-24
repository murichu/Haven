import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl scale-in-center animate-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
          }`}>
            <AlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 text-white rounded-xl font-medium shadow-lg transition-all ${
              type === 'danger' 
                ? 'bg-red-600 shadow-red-500/20 hover:bg-red-700' 
                : 'bg-primary shadow-primary/20 hover:bg-primary/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
