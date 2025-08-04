import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, title, message };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`
                p-4 rounded-2xl border backdrop-blur-lg shadow-2xl max-w-sm
                ${toast.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : toast.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {toast.type === 'success' && (
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  )}
                  {toast.type === 'error' && (
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  )}
                  {toast.type === 'info' && (
                    <CheckCircleIcon className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    toast.type === 'success' ? 'text-green-400' :
                    toast.type === 'error' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {toast.title}
                  </div>
                  <div className="text-white/80 text-sm mt-1">
                    {toast.message}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-white/60 hover:text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
