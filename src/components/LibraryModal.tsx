import React from 'react';
import { X, Library, BookOpen, Download, Search, Star } from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  const books = [
    { title: 'Matematika Peminatan Kelas X Kurikulum Merdeka', author: 'Kemendikbudristek', pages: 284, reads: 1200 },
    { title: 'Fisika Teori & Aplikasi Terpadu SMA/SMK', author: 'Prof. Dr. Supardi', pages: 340, reads: 850 },
    { title: 'Kamus Istilah Kimia Organik & Anorganik', author: 'Dra. Endang Kusuma', pages: 198, reads: 640 },
    { title: 'Biologi Umum: Evolusi & Genetika Sel', author: 'Dr. Ahmad Subagyo', pages: 412, reads: 980 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-md max-h-[88vh] rounded-[28px] overflow-hidden border shadow-2xl flex flex-col transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                E-Library Sekolah
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Koleksi Buku Paket Digital & Jurnal
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {books.map((b, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {b.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {b.author} • {b.pages} Hal
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert(`Membuka buku: ${b.title}`)}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shrink-0"
              >
                Baca
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
