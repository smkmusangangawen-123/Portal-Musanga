import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface CbtExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onFinishExam: (score: number, xpEarned: number) => void;
  darkMode?: boolean;
}

interface Question {
  id: number;
  text: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: 'Nilai dari sin 105° + sin 15° adalah...',
    options: [
      { key: 'A', text: '½ √6' },
      { key: 'B', text: '½ √2' },
      { key: 'C', text: '¼ √6' },
      { key: 'D', text: '√3' },
      { key: 'E', text: '½ √3' },
    ],
    correctAnswer: 'A',
    explanation: 'Rumus: sin A + sin B = 2 sin ½(A+B) cos ½(A-B) = 2 sin 60° cos 45° = 2 (½√3)(½√2) = ½√6.',
  },
  {
    id: 2,
    text: 'Sebuah balok bermassa 5 kg ditarik dengan gaya 20 N pada lantai licin. Percepatan gerak balok tersebut adalah...',
    options: [
      { key: 'A', text: '2 m/s²' },
      { key: 'B', text: '4 m/s²' },
      { key: 'C', text: '5 m/s²' },
      { key: 'D', text: '10 m/s²' },
      { key: 'E', text: '100 m/s²' },
    ],
    correctAnswer: 'B',
    explanation: 'Hukum II Newton: a = F / m = 20 N / 5 kg = 4 m/s².',
  },
  {
    id: 3,
    text: 'Organel sel yang berfungsi sebagai tempat sintesis protein dan terdapat ribosom yang melekat pada permukaannya adalah...',
    options: [
      { key: 'A', text: 'Mitokondria' },
      { key: 'B', text: 'Retikulum Endoplasma Kasar' },
      { key: 'C', text: 'Badan Golgi' },
      { key: 'D', text: 'Lisosom' },
      { key: 'E', text: 'Vakuola' },
    ],
    correctAnswer: 'B',
    explanation: 'Retikulum Endoplasma Kasar (REK) memiliki ribosom pada membrannya untuk sintesis protein.',
  },
  {
    id: 4,
    text: 'Molekul CH₄ (Metana) memiliki bentuk geometri molekul...',
    options: [
      { key: 'A', text: 'Linear' },
      { key: 'B', text: 'Segitiga planar' },
      { key: 'C', text: 'Tetrahedral' },
      { key: 'D', text: 'Trigonal piramida' },
      { key: 'E', text: 'Oktahedral' },
    ],
    correctAnswer: 'C',
    explanation: 'CH₄ memiliki 4 pasangan elektron ikatan tanpa elektron bebas (AX₄), sehingga bentuk geometrinya tetrahedral dengan sudut 109.5°.',
  },
  {
    id: 5,
    text: 'Dalam struktur teks negosiasi ilmiah, bagian yang berisi kesepakatan final kedua belah pihak disebut...',
    options: [
      { key: 'A', text: 'Orientasi' },
      { key: 'B', text: 'Pengajuan' },
      { key: 'C', text: 'Penawaran' },
      { key: 'D', text: 'Persetujuan' },
      { key: 'E', text: 'Penutup' },
    ],
    correctAnswer: 'D',
    explanation: 'Persetujuan adalah tahap tercapainya mufakat atau jalan tengah antara kedua pihak yang bernegosiasi.',
  },
];

export const CbtExamModal: React.FC<CbtExamModalProps> = ({
  isOpen,
  onClose,
  student,
  onFinishExam,
  darkMode = false,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isOpen || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const currentQ = mockQuestions[currentIdx];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (key: string) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    mockQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / mockQuestions.length) * 100);
    const xpReward = 150;
    setScore(calculatedScore);
    setIsFinished(true);
    onFinishExam(calculatedScore, xpReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div
        className={`w-full max-w-lg max-h-[92vh] rounded-[28px] overflow-hidden border shadow-2xl flex flex-col transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0b193d] text-white border-b border-blue-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                CBT EXAM PORTAL
              </span>
              <h3 className="text-xs sm:text-sm font-bold truncate max-w-[200px] text-white">
                Simulasi PAS Semester Ganjil
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished && (
              <div className="flex items-center gap-1.5 bg-blue-900/80 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-amber-300 border border-blue-700">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isFinished ? (
          /* Result View */
          <div className="p-6 text-center overflow-y-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Hasil Ujian CBT Anda
              </span>
              <h4 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {score} / 100
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Status: <span className="font-bold text-emerald-600">LULUS DENGAN PREDIKAT SANGAT BAIK</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center gap-2 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Selamat! Kamu mendapatkan bonus +150 XP!</span>
            </div>

            {/* Questions review breakdown */}
            <div className="text-left space-y-2 mt-4">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pembahasan Soal & Kunci Jawaban:
              </h5>
              {mockQuestions.map((q, idx) => {
                const userAns = answers[idx];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                        : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>Soal #{idx + 1}</span>
                      <span className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                        {isCorrect ? '✓ Benar' : `✗ Salah (Kunci: ${q.correctAnswer})`}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-1">{q.text}</p>
                    <p className="text-[10px] text-slate-500 italic">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md mt-4"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          /* Active Exam View */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Number Navigation Palette */}
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/60 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Navigasi:
              </span>
              {mockQuestions.map((_, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = currentIdx === idx;
                const isFlag = flagged[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all shrink-0 ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-1 bg-blue-600 text-white'
                        : isFlag
                        ? 'bg-amber-400 text-amber-950'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Soal Nomor {currentIdx + 1} dari {mockQuestions.length}</span>
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                    flagged[currentIdx]
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{flagged[currentIdx] ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
                </button>
              </div>

              <h4 className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                {currentQ.text}
              </h4>

              {/* Multiple Choice Options */}
              <div className="space-y-2 mt-4">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentIdx] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-3 rounded-2xl text-xs font-semibold text-left transition-all border flex items-center gap-3 active:scale-98 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((p) => p - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIdx < mockQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((p) => p + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-sm"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai Ujian</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
