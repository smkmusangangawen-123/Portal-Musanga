import React from 'react';
import {
  X,
  BookOpen,
  Wallet,
  BookMarked,
  MonitorPlay,
  Award,
  BarChart3,
  Bell,
  Receipt,
  FileText,
  Library,
  Trophy,
  LayoutGrid,
  Calendar,
  Clock,
  Send,
} from 'lucide-react';
import { portalMenuItems } from '../data/mockData';

interface AllMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu: (id: string) => void;
  darkMode?: boolean;
}

export const AllMenuModal: React.FC<AllMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectMenu,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string, color: string) => {
    const props = { className: 'w-5 h-5', style: { color } };
    switch (iconName) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Wallet': return <Wallet {...props} />;
      case 'BookMarked': return <BookMarked {...props} />;
      case 'MonitorPlay': return <MonitorPlay {...props} />;
      case 'Award': return <Award {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'Bell': return <Bell {...props} />;
      case 'Receipt': return <Receipt {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Library': return <Library {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      default: return <LayoutGrid {...props} />;
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
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Direktori Portal Sekolah
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Semua Menu & Layanan Digital Siswa
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-3 gap-3">
            {portalMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectMenu(item.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700/80 hover:border-blue-500'
                    : 'bg-slate-50 border-slate-100 hover:border-blue-300'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-xs"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {renderIcon(item.icon, item.color)}
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1">
                  {item.name}
                </span>
                {item.badge !== undefined && (
                  <span className="mt-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
