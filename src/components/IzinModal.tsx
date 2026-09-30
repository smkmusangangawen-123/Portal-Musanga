import React, { useState } from 'react';
import { X, FileText, Send, CheckCircle2, Upload } from 'lucide-react';
import { StudentProfile } from '../types';

interface IzinModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  darkMode?: boolean;
}

export const IzinModal: React.FC<IzinModalProps> = ({
  isOpen,
  onClose,
  student,
  darkMode = false,
}) => {
  const [tipe, setTipe] = useState<'sakit' | 'izin' | 'dispensasi'>('sakit');
  const [alasan, setAlasan] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-md rounded-[28px] overflow-hidden border shadow-2xl p-5 ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Pengajuan Izin & Sakit</h3>
              <span className="text-[10px] text-slate-400">Verifikasi Guru BK & Wali Kelas</span>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-sm font-extrabold text-emerald-600">
              Pengajuan Izin Telah Dikirim!
            </h4>
            <p className="text-xs text-slate-500">
              Wali kelas Dra. Sri Wahyuni, M.Pd akan segera memverifikasi permohonan izin Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Jenis Keterangan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['sakit', 'izin', 'dispensasi'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipe(t)}
                    className={`py-2 rounded-xl font-bold capitalize transition-all border ${
                      tipe === t
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Alasan / Penjelasan Singkat
              </label>
              <textarea
                required
                rows={3}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Tuliskan keterangan sakit atau keperluan izin keluarga..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
              <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium block">
                Unggah Surat Dokter / Surat Izin (Opsional)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Permohonan Izin</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
