import React, { useState } from 'react';
import {
  X,
  Video,
  Mic,
  MicOff,
  Hand,
  Send,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { LiveClass, StudentProfile } from '../types';

interface LiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveSession: LiveClass;
  student: StudentProfile;
  onEarnXp?: (xp: number) => void;
  darkMode?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  isMe?: boolean;
}

export const LiveClassModal: React.FC<LiveClassModalProps> = ({
  isOpen,
  onClose,
  liveSession,
  student,
  onEarnXp,
  darkMode = false,
}) => {
  const [micActive, setMicActive] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [pollAnswered, setPollAnswered] = useState<number | null>(null);
  const [showPoll, setShowPoll] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Dra. Sri Wahyuni, M.Pd (Guru)',
      avatar: 'SW',
      text: 'Selamat siang anak-anak kelas X-A IPA! Mari kita bahas soal nomor 14 tentang persamaan kuadrat trigonometri.',
    },
    {
      id: '2',
      sender: 'Budi Kurniawan',
      avatar: 'BK',
      text: 'Siap Bu, rumus sudut rangkapnya apakah dimasukkan?',
    },
    {
      id: '3',
      sender: 'Siti Rahmawati',
      avatar: 'SR',
      text: 'Faktorkan dulu jadi (2 sin x - 1)(sin x - 1) = 0 kan bu?',
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: student.name,
      avatar: student.avatarInitial,
      text: chatInput.trim(),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleAnswerPoll = (index: number) => {
    setPollAnswered(index);
    if (index === 0) {
      // Correct answer!
      if (onEarnXp) onEarnXp(30);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div
        className={`w-full max-w-lg h-[92vh] max-h-[780px] rounded-[28px] overflow-hidden border shadow-2xl flex flex-col transition-all ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0b193d] text-white border-b border-blue-900/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                LIVE INTERACTIVE CLASS
              </span>
              <h3 className="text-xs sm:text-sm font-bold truncate max-w-[240px] text-white">
                {liveSession.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[11px] font-medium text-white/90">
              <Users className="w-3.5 h-3.5" />
              <span>{liveSession.participantsCount} Siswa</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video / Whiteboard Presentation Area */}
        <div className="relative bg-slate-950 aspect-video w-full flex flex-col justify-between p-3 select-none overflow-hidden">
          {/* Simulated Presentation Canvas */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-3.5 max-w-sm w-full text-left shadow-xl">
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                <span>Papan Tulis Guru • Matematika PAS</span>
                <span className="text-emerald-400">● Merekam</span>
              </div>
              <p className="text-xs text-white font-mono font-semibold">
                Soal 14: Selesaikan persamaan trigonometri berikut:
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono text-xs text-amber-300 font-bold my-1 text-center">
                2 sin²(x) - 3 sin(x) + 1 = 0
              </div>
              <p className="text-[10px] text-slate-300">
                Faktorisasi: (2 sin x - 1)(sin x - 1) = 0<br />
                sin x = 1/2 ➔ x = 30°, 150°<br />
                sin x = 1 ➔ x = 90°
              </p>
            </div>
          </div>

          {/* Teacher Picture-in-Picture Avatar */}
          <div className="relative z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 max-w-fit">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
              {liveSession.teacherAvatar}
            </div>
            <div>
              <span className="text-[10px] font-bold text-white block leading-tight">
                {liveSession.teacher}
              </span>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-medium">
                <Volume2 className="w-2.5 h-2.5" /> Sedang Berbicara...
              </span>
            </div>
          </div>

          {/* Video bottom controls */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  micActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{micActive ? 'Mic Nyala' : 'Mic Bisu'}</span>
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  handRaised
                    ? 'bg-amber-500 text-white animate-bounce'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{handRaised ? 'Tangan Terangkat' : 'Angkat Tangan'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowPoll(!showPoll)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Kuis Cepat</span>
            </button>
          </div>
        </div>

        {/* Live Quick Poll Card (If active) */}
        {showPoll && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-800/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                KUIS INTERAKTIF LIVE (+30 XP)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Batas Waktu: 00:45</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Himpunan penyelesaian untuk 2 sin²(x) - 3 sin(x) + 1 = 0 pada interval [0°, 360°] adalah?
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'A. {30°, 90°, 150°}', isCorrect: true },
                { label: 'B. {60°, 90°, 120°}', isCorrect: false },
                { label: 'C. {30°, 60°, 90°}', isCorrect: false },
                { label: 'D. {45°, 90°, 135°}', isCorrect: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  disabled={pollAnswered !== null}
                  onClick={() => handleAnswerPoll(i)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    pollAnswered === i
                      ? opt.isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : pollAnswered !== null && opt.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {pollAnswered !== null && (
              <div className="mt-2 text-[11px] font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {pollAnswered === 0
                    ? 'Jawaban Benar! +30 XP ditambahkan ke profil kamu.'
                    : 'Jawaban tepat adalah opsi A: {30°, 90°, 150°}'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Live Chat Stream */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Obrolan Siswa & Diskusi Langsung</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
                    msg.isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {msg.avatar}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                    msg.isMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : darkMode
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold block mb-0.5 ${
                      msg.isMe ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {msg.sender}
                  </span>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ketik pertanyaan atau tanggapan..."
              className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none border transition-colors ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
