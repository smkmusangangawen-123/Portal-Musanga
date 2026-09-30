import React from 'react';
import { X, Bell, Check, Clock, BookOpen, Wallet, Laptop, Info } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  darkMode?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'academic':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'cbt':
        return <Laptop className="w-4 h-4 text-purple-500" />;
      case 'finance':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-md max-h-[88vh] rounded-[28px] overflow-hidden border shadow-2xl flex flex-col transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Notifikasi Sekolah
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Pemberitahuan Akademik & Transaksi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              title="Tandai Semua Dibaca"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Baca Semua
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all flex gap-3 ${
                n.unread
                  ? darkMode
                    ? 'bg-slate-800/80 border-blue-900/60'
                    : 'bg-blue-50/60 border-blue-100'
                  : darkMode
                  ? 'bg-slate-900/50 border-slate-800'
                  : 'bg-white border-slate-150'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {renderIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-100">
                    {n.title}
                  </h4>
                  {n.unread && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {n.message}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
