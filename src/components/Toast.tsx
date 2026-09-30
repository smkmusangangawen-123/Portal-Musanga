import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'xp' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'xp' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 text-white shadow-2xl border border-white/20 backdrop-blur-md">
        {type === 'xp' ? (
          <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        )}
        <span className="text-xs font-bold tracking-tight">{message}</span>
      </div>
    </div>
  );
};
