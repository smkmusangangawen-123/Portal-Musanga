import React from 'react';
import { X, Award, TrendingUp, CheckCircle, Download, BookOpen } from 'lucide-react';
import { radarSubjectScores } from '../data/mockData';
import { StudentProfile } from '../types';

interface AnalisisNilaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  darkMode?: boolean;
}

export const AnalisisNilaiModal: React.FC<AnalisisNilaiModalProps> = ({
  isOpen,
  onClose,
  student,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  // Radar chart mathematical coordinates computation
  const totalPoints = radarSubjectScores.length;
  const radius = 100;
  const centerX = 150;
  const centerY = 140;

  // Generate polygon points for student score
  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 / totalPoints) * index - Math.PI / 2;
    const r = (score / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const studentPolygonPoints = radarSubjectScores
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.score);
      return `${x},${y}`;
    })
    .join(' ');

  const kkmPolygonPoints = radarSubjectScores
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.kkm);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-md max-h-[90vh] rounded-[28px] overflow-hidden border shadow-2xl flex flex-col transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Analisis Nilai & Grafik Radar
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Semester Ganjil TA 2026/2027
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Top Stat Overview */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                Rata-rata
              </span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {student.averageScore}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
                Predikat
              </span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                A (Amat Baik)
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                Peringkat Kelas
              </span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                #2 / 36
              </span>
            </div>
          </div>

          {/* SVG Radar Chart */}
          <div className="rounded-2xl p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Grafik Radar Kompetensi Mata Pelajaran
            </span>

            <svg viewBox="0 0 300 280" className="w-full max-w-[280px] h-auto">
              {/* Concentric spiderweb background grid */}
              {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                <circle
                  key={i}
                  cx={centerX}
                  cy={centerY}
                  r={radius * level}
                  fill="none"
                  stroke={darkMode ? '#334155' : '#e2e8f0'}
                  strokeDasharray={level === 1 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
              ))}

              {/* Axis lines to each vertex */}
              {radarSubjectScores.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke={darkMode ? '#334155' : '#e2e8f0'}
                    strokeWidth="1"
                  />
                );
              })}

              {/* KKM Polygon (Standard line in red/orange) */}
              <polygon
                points={kkmPolygonPoints}
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />

              {/* Student Polygon (Filled Indigo) */}
              <polygon
                points={studentPolygonPoints}
                fill="#4f46e5"
                fillOpacity="0.25"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {radarSubjectScores.map((s, i) => {
                const { x, y } = getCoordinates(i, s.score);
                const labelCoord = getCoordinates(i, 122);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3.5" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    <text
                      x={labelCoord.x}
                      y={labelCoord.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px] font-bold"
                      fill={darkMode ? '#cbd5e1' : '#475569'}
                    >
                      {s.subject} ({s.score})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                <span>Nilai Siswa (Ahmad)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-orange-500 inline-block border-t border-orange-500 border-dashed" />
                <span>Standar KKM (75)</span>
              </div>
            </div>
          </div>

          {/* Subject Breakdown List */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Rincian Capaian Mata Pelajaran
            </h4>

            {radarSubjectScores.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {item.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      KKM: {item.kkm} • Terlampaui +{item.score - item.kkm} poin
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                    {item.score}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" /> Tuntas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              alert('Mengunduh Laporan Rapor & Analisis Nilai PDF...');
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan Nilai Resmi (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
