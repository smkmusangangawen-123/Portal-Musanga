import React, { useState } from 'react';
import { X, Receipt, CheckCircle2, AlertCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';

interface SppModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onPayBill: (amount: number) => void;
  darkMode?: boolean;
}

interface BillItem {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: 'lunas' | 'belum_bayar';
}

export const SppModal: React.FC<SppModalProps> = ({
  isOpen,
  onClose,
  student,
  onPayBill,
  darkMode = false,
}) => {
  const [bills, setBills] = useState<BillItem[]>([
    { id: 'b-1', title: 'SPP Bulan Oktober 2026', dueDate: '10 Okt 2026', amount: 150000, status: 'belum_bayar' },
    { id: 'b-2', title: 'Iuran Ekstrakurikuler & OSIS', dueDate: '15 Okt 2026', amount: 50000, status: 'belum_bayar' },
    { id: 'b-3', title: 'Biaya Ujian PAS Komputer', dueDate: '20 Okt 2026', amount: 75000, status: 'belum_bayar' },
    { id: 'b-4', title: 'SPP Bulan September 2026', dueDate: '10 Sep 2026', amount: 150000, status: 'lunas' },
    { id: 'b-5', title: 'SPP Bulan Agustus 2026', dueDate: '10 Agu 2026', amount: 150000, status: 'lunas' },
    { id: 'b-6', title: 'SPP Bulan Juli 2026', dueDate: '10 Jul 2026', amount: 150000, status: 'lunas' },
  ]);

  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = (bill: BillItem) => {
    if (student.savingsBalance < bill.amount) {
      alert(`Saldo tabungan Anda (Rp ${student.savingsBalance.toLocaleString('id-ID')}) tidak mencukupi untuk membayar tagihan sebesar Rp ${bill.amount.toLocaleString('id-ID')}. Silakan isi saldo tabungan terlebih dahulu.`);
      return;
    }

    setPayingBillId(bill.id);
    setTimeout(() => {
      onPayBill(bill.amount);
      setBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, status: 'lunas' } : b))
      );
      setPayingBillId(null);
    }, 1000);
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
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Tagihan & SPP Sekolah
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Tahun Ajaran 2026/2027
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

        {/* List of bills */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bills.map((bill) => {
            const isLunas = bill.status === 'lunas';
            const isProcessing = payingBillId === bill.id;

            return (
              <div
                key={bill.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isLunas
                    ? 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {bill.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Jatuh Tempo: {bill.dueDate}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      isLunas
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {isLunas ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Rp {bill.amount.toLocaleString('id-ID')}
                  </span>

                  {!isLunas ? (
                    <button
                      disabled={isProcessing}
                      onClick={() => handlePay(bill)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 active:scale-95 transition-all"
                    >
                      {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terverifikasi</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
