import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  BookOpen,
  Video,
  Sparkles,
  HelpCircle,
  Clock,
  Download,
} from 'lucide-react';
import { ChapterModule, StudentProfile } from '../types';

interface ChapterDetailModalProps {
  module: ChapterModule | null;
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onCompleteQuiz: (xpGained: number) => void;
  darkMode?: boolean;
}

export const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({
  module,
  isOpen,
  onClose,
  student,
  onCompleteQuiz,
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'ringkasan' | 'kuis'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(1);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen || !module) return null;

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === 1) {
      onCompleteQuiz(module.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div
        className={`w-full max-w-lg max-h-[92vh] rounded-[28px] overflow-hidden border shadow-2xl flex flex-col transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white inline-block mb-0.5"
              style={{ backgroundColor: module.color }}
            >
              {module.subject}
            </span>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight truncate max-w-[280px]">
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-2 bg-slate-100 dark:bg-slate-800/80 mx-4 mt-3 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Pembelajaran</span>
          </button>
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ringkasan'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rangkuman Materi</span>
          </button>
          <button
            onClick={() => setActiveTab('kuis')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'kuis'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kuis Bab</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'video' && (
            <div className="space-y-3">
              {/* Simulated Video Player */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden flex flex-col justify-between p-4 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span className="font-semibold text-[11px] bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    Video #{selectedVideo} dari {module.totalVideos}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">1080p Full HD</span>
                </div>

                {/* Center Play Button */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-white" />}
                  </button>
                </div>

                {/* Scrubber simulation */}
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: isPlaying ? '64%' : '35%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/70 font-mono">
                    <span>{isPlaying ? '08:42' : '04:15'}</span>
                    <span>15:30</span>
                  </div>
                </div>
              </div>

              {/* Video playlist selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daftar Sub-Video Materi Ini:
                </span>
                {[1, 2, 3].map((v) => (
                  <div
                    key={v}
                    onClick={() => setSelectedVideo(v)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedVideo === v
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {v}
                      </div>
                      <div>
                        <span className="text-xs block text-slate-800 dark:text-slate-200">
                          Part {v}: Konsep Esensial & Contoh Kasus {v}
                        </span>
                        <span className="text-[10px] text-slate-400">Durasi: 12 menit</span>
                      </div>
                    </div>
                    {v <= module.completedVideos ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ringkasan' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                  Rangkuman Inti Materi Pembelajaran
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                  {module.description}
                </p>
                <div className="space-y-1.5 list-disc pl-4 text-slate-700 dark:text-slate-300">
                  <li>Pahami definisi dan penurunan rumus dasar sebelum melangkah ke soal penerapan.</li>
                  <li>Perhatikan batasan interval sudut dan tanda kuadran positif/negatif.</li>
                  <li>Gunakan metode substitusi atau faktorisasi aljabar sederhana untuk menyederhanakan perhitungan.</li>
                </div>
              </div>

              <button
                onClick={() => alert('Mengunduh Modul Ringkasan PDF...')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Handout Materi PDF (2.4 MB)</span>
              </button>
            </div>
          )}

          {activeTab === 'kuis' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                    KUIS PEMAHAMAN CEPAT
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Selesaikan untuk klaim reward XP
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-600 text-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                  <span>+{module.xpReward} XP</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Pertanyaan: Berdasarkan materi yang telah dipelajari, manakah pernyataan yang paling tepat?
                </h5>

                {[
                  'Setiap penyelesaian persamaan trigonometri selalu bernilai tunggal di semua kuadran.',
                  'Identitas sin²(x) + cos²(x) = 1 berlaku untuk semua sudut real x.',
                  'Nilai tangen selalu terdefinisi pada sudut 90° dan 270°.',
                ].map((choice, i) => (
                  <button
                    key={i}
                    disabled={quizSubmitted}
                    onClick={() => setQuizAnswer(i)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      quizAnswer === i
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {choice}
                  </button>
                ))}
              </div>

              {quizSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Jawaban Anda Benar! +{module.xpReward} XP berhasil ditambahkan ke akun Anda!
                  </span>
                </div>
              ) : (
                <button
                  disabled={quizAnswer === null}
                  onClick={handleQuizSubmit}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md disabled:opacity-40"
                >
                  Kirim Jawaban Kuis
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
