import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`p-4 rounded-2xl shadow-xl flex items-center justify-between border animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
              toast.type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
              {toast.type === 'error' && <AlertCircle size={20} className="text-red-600" />}
              {toast.type === 'warning' && <AlertTriangle size={20} className="text-yellow-600" />}
              {toast.type === 'info' && <Info size={20} className="text-blue-600" />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
