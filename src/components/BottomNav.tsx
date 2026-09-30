import React from 'react';
import { Home, Receipt, QrCode, Calendar, User } from 'lucide-react';

export type NavTab = 'beranda' | 'lms' | 'administrasi' | 'jadwal' | 'profil';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenQrPay: () => void;
  unpaidBillsCount?: number;
  darkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenQrPay,
  unpaidBillsCount = 0,
  darkMode = false,
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto border-t transition-colors ${
        darkMode
          ? 'bg-slate-900/95 border-slate-800 text-slate-300'
          : 'bg-white/95 border-slate-200 text-slate-600'
      } backdrop-blur-md shadow-lg shadow-black/10`}
    >
      <div className="relative flex items-center justify-between px-3 py-2">
        {/* Beranda */}
        <button
          onClick={() => onChangeTab('beranda')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'beranda'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:text-blue-500 opacity-75 hover:opacity-100'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'beranda' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight">Beranda</span>
        </button>

        {/* E-Administrasi */}
        <button
          onClick={() => onChangeTab('administrasi')}
          className={`relative flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'administrasi'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:text-blue-500 opacity-75 hover:opacity-100'
          }`}
        >
          <div className="relative">
            <Receipt className={`w-5 h-5 ${activeTab === 'administrasi' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            {unpaidBillsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                {unpaidBillsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Administrasi</span>
        </button>

        {/* Center Floating QR PAY Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenQrPay}
            aria-label="QR PAY"
            className="group relative flex flex-col items-center focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-white dark:border-slate-900 group-hover:scale-105 group-active:scale-95 transition-all">
              <QrCode className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-blue-600 dark:text-blue-400 mt-1 uppercase">
              QR PAY
            </span>
          </button>
        </div>

        {/* Jadwal */}
        <button
          onClick={() => onChangeTab('jadwal')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'jadwal'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:text-blue-500 opacity-75 hover:opacity-100'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'jadwal' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight">Jadwal</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => onChangeTab('profil')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'profil'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:text-blue-500 opacity-75 hover:opacity-100'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profil' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight">Profil</span>
        </button>
      </div>
    </nav>
  );
};
