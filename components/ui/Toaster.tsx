import React, { useState, useEffect } from 'react';
import { eventService, EVENTS } from '../../lib/events';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = eventService.subscribe(EVENTS.NOTIFICATION, (notification: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { ...notification, id };
      setToasts(prev => [...prev, newToast]);

      // Auto dismiss
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="bg-white p-4 rounded-lg shadow-lg border border-slate-100 flex items-start gap-3 w-80 pointer-events-auto animate-slide-up"
        >
          <div className="mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">{toast.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};