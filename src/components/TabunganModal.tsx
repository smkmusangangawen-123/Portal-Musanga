import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../types';

interface TabunganModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onTopUp: (amount: number) => void;
  darkMode?: boolean;
}

export const TabunganModal: React.FC<TabunganModalProps> = ({
  isOpen,
  onClose,
  student,
  onTopUp,
  darkMode = false,
}) => {
  const [topUpDone, setTopUpDone] = useState(false);

  if (!isOpen) return null;

  const handleSimulateTopUp = (amount: number) => {
    onTopUp(amount);
    setTopUpDone(true);
    setTimeout(() => {
      setTopUpDone(false);
    }, 2000);
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
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Tabungan Siswa Digital
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Rekening Virtual No: 8820-123456789
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Balance card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-100 block">
              TOTAL SALDO TABUNGAN
            </span>
            <h4 className="text-2xl font-extrabold mt-1">
              Rp {student.savingsBalance.toLocaleString('id-ID')}
            </h4>
            <div className="flex items-center justify-between text-[11px] text-teal-100 mt-3 pt-3 border-t border-white/20">
              <span>Pemilik: {student.name}</span>
              <span>Status: Rekening Aktif</span>
            </div>
          </div>

          {topUpDone && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Top-Up simulasi berhasil ditambahkan ke saldo tabungan!</span>
            </div>
          )}

          {/* Quick Topup simulation */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Simulasi Isi Saldo / Top Up Cepat:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[25000, 50000, 100000].map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => handleSimulateTopUp(nominal)}
                  className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-extrabold text-xs transition-all active:scale-95"
                >
                  +Rp {(nominal / 1000).toLocaleString('id-ID')}k
                </button>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Riwayat Transaksi Terakhir
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Setoran Dari Orang Tua</span>
                    <span className="text-[10px] text-slate-400">Hari ini, 08:30 WIB</span>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-600">+Rp 100.000</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Pembayaran Kantin Bu Joko</span>
                    <span className="text-[10px] text-slate-400">Kemarin, 12:15 WIB</span>
                  </div>
                </div>
                <span className="font-extrabold text-rose-600">-Rp 15.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
