import React, { useState } from 'react';
import { X, QrCode, Scan, CheckCircle2, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../types';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  initialTab?: 'absen' | 'pay';
  onAbsenSuccess?: () => void;
  onPayCanteen?: (amount: number, merchant: string) => void;
  darkMode?: boolean;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  student,
  initialTab = 'absen',
  onAbsenSuccess,
  onPayCanteen,
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'absen' | 'pay'>(initialTab);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const [scannerSimulating, setScannerSimulating] = useState(false);
  const [payAmount, setPayAmount] = useState('15000');
  const [payMerchant, setPayMerchant] = useState('Kantin Bu Joko (Stand 03)');

  if (!isOpen) return null;

  const handleSimulateAbsen = () => {
    setScannerSimulating(true);
    setTimeout(() => {
      setScannerSimulating(false);
      setScannedSuccess(true);
      if (onAbsenSuccess) onAbsenSuccess();
    }, 1200);
  };

  const handleSimulatePay = () => {
    setScannerSimulating(true);
    setTimeout(() => {
      setScannerSimulating(false);
      setScannedSuccess(true);
      if (onPayCanteen) {
        onPayCanteen(Number(payAmount) || 15000, payMerchant);
      }
    }, 1200);
  };

  const resetState = () => {
    setScannedSuccess(false);
    setScannerSimulating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-sm rounded-[28px] overflow-hidden border shadow-2xl transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-150 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base tracking-tight">
              {activeTab === 'absen' ? 'QR Absensi Siswa' : 'QR PAY Transaksi'}
            </h3>
          </div>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-slate-100 dark:bg-slate-800 mx-5 mt-4 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              resetState();
              setActiveTab('absen');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'absen'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Kartu Pelajar & Absen
          </button>
          <button
            onClick={() => {
              resetState();
              setActiveTab('pay');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'pay'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Scan Bayar Administrasi
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5">
          {scannedSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {activeTab === 'absen' ? 'Absensi Berhasil Tercatat!' : 'Pembayaran QR Sukses!'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeTab === 'absen'
                  ? `Kehadiran Ahmad Siswa (${student.grade} ${student.major}) telah diverifikasi ke server sekolah.`
                  : `Transaksi sebesar Rp ${Number(payAmount).toLocaleString('id-ID')} di ${payMerchant} berhasil diproses.`}
              </p>
              <button
                onClick={() => {
                  resetState();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md mt-4 hover:bg-blue-700"
              >
                Selesai
              </button>
            </div>
          ) : activeTab === 'absen' ? (
            <div className="space-y-4 text-center">
              {/* Virtual ID Card Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-md text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">
                      SMK MUHAMMADIYAH 1 / SMA DIGITAL
                    </span>
                    <span className="text-xs font-bold text-white">KARTU PELAJAR DIGITAL</span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-blue-600 font-extrabold flex items-center justify-center text-lg">
                    {student.avatarInitial}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm leading-tight">{student.name}</h5>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      NISN: {student.nisn} • {student.grade} {student.major}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="p-5 rounded-2xl bg-white dark:bg-white inline-block shadow-inner border border-slate-200 mx-auto">
                {/* SVG QR Code Simulation */}
                <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                  {/* Corner Position Detection Patterns */}
                  <rect x="5" y="5" width="26" height="26" fill="#0b193d" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#0b193d" rx="1.5" />

                  <rect x="69" y="5" width="26" height="26" fill="#0b193d" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#0b193d" rx="1.5" />

                  <rect x="5" y="69" width="26" height="26" fill="#0b193d" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#0b193d" rx="1.5" />

                  {/* QR Data Grid Pixels */}
                  <rect x="36" y="8" width="6" height="6" fill="#0b193d" />
                  <rect x="46" y="8" width="6" height="6" fill="#0b193d" />
                  <rect x="56" y="8" width="6" height="6" fill="#0b193d" />
                  <rect x="36" y="18" width="6" height="6" fill="#0b193d" />
                  <rect x="46" y="24" width="6" height="6" fill="#0b193d" />
                  <rect x="56" y="18" width="6" height="6" fill="#0b193d" />
                  <rect x="8" y="36" width="6" height="6" fill="#0b193d" />
                  <rect x="18" y="46" width="6" height="6" fill="#0b193d" />
                  <rect x="8" y="56" width="6" height="6" fill="#0b193d" />

                  {/* Center Matrix */}
                  <rect x="36" y="36" width="26" height="26" fill="#2563eb" rx="3" />
                  <circle cx="49" cy="49" r="6" fill="white" />

                  <rect x="68" y="36" width="6" height="6" fill="#0b193d" />
                  <rect x="78" y="44" width="6" height="6" fill="#0b193d" />
                  <rect x="88" y="36" width="6" height="6" fill="#0b193d" />
                  <rect x="68" y="54" width="6" height="6" fill="#0b193d" />
                  <rect x="78" y="64" width="6" height="6" fill="#0b193d" />
                  <rect x="88" y="54" width="6" height="6" fill="#0b193d" />

                  <rect x="36" y="68" width="6" height="6" fill="#0b193d" />
                  <rect x="46" y="76" width="6" height="6" fill="#0b193d" />
                  <rect x="56" y="68" width="6" height="6" fill="#0b193d" />
                  <rect x="42" y="86" width="6" height="6" fill="#0b193d" />
                  <rect x="52" y="86" width="6" height="6" fill="#0b193d" />
                  <rect x="68" y="78" width="6" height="6" fill="#0b193d" />
                  <rect x="78" y="86" width="6" height="6" fill="#0b193d" />
                  <rect x="88" y="78" width="6" height="6" fill="#0b193d" />
                </svg>
              </div>

              <p className="text-[11px] text-slate-500">
                Arahkan kode QR ini ke kamera scanner absensi di gerbang sekolah atau ruang kelas.
              </p>

              {/* Action simulate button */}
              <button
                disabled={scannerSimulating}
                onClick={handleSimulateAbsen}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                <Scan className={`w-4 h-4 ${scannerSimulating ? 'animate-spin' : ''}`} />
                <span>{scannerSimulating ? 'Sedang Memindai...' : 'Simulasi Scan Absen Sekarang'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Student Balance Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Saldo Tabungan Anda
                    </span>
                    <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                      Rp {student.savingsBalance.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Administration & Cashier Payment Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Pilih Loket / Unit Pembayaran
                  </label>
                  <select
                    value={payMerchant}
                    onChange={(e) => setPayMerchant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Loket Kasir Administrasi & SPP">Loket Kasir Administrasi & SPP Sekolah</option>
                    <option value="Koperasi Siswa (Seragam & Atribut)">Koperasi Siswa (Seragam & Atribut)</option>
                    <option value="Laboratorium Komputer & CBT">Laboratorium Komputer & CBT</option>
                    <option value="Bagian Kesiswaan & Ekstrakurikuler">Bagian Kesiswaan & Ekstrakurikuler</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nominal Transaksi (Rp)
                  </label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Action simulate button */}
              <button
                disabled={scannerSimulating}
                onClick={handleSimulatePay}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                <Scan className={`w-4 h-4 ${scannerSimulating ? 'animate-spin' : ''}`} />
                <span>{scannerSimulating ? 'Memproses Bayar...' : 'Konfirmasi & Bayar via QR'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
