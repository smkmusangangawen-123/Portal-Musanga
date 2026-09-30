import React from 'react';
import { X, Trophy, Flame, Sparkles, Medal, Crown, Zap } from 'lucide-react';
import { initialLeaderboard } from '../data/mockData';
import { StudentProfile } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  darkMode?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  student,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  const topThree = [initialLeaderboard[1], initialLeaderboard[0], initialLeaderboard[2]]; // 2nd, 1st, 3rd order for podium

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
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-500">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Leaderboard Mingguan
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Liga Berlian • Berakhir dalam 2 hari
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Top 3 Podium Visual */}
          <div className="pt-6 pb-2 px-2 flex items-end justify-center gap-2">
            {/* 2nd Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-13 h-13 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-extrabold flex items-center justify-center text-base border-2 border-slate-300">
                  {topThree[0].avatar}
                </div>
                <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-slate-400 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                  2
                </span>
              </div>
              <span className="text-xs font-bold truncate max-w-[80px] block">
                {topThree[0].name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold">
                {topThree[0].xp} XP
              </span>
              <div className="w-full h-16 mt-2 rounded-t-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                2nd
              </div>
            </div>

            {/* 1st Place (Center & Tallest) */}
            <div className="flex-1 flex flex-col items-center -mt-4">
              <Crown className="w-6 h-6 text-amber-400 fill-amber-400 mb-1 animate-bounce" />
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 font-extrabold flex items-center justify-center text-lg border-2 border-amber-300 shadow-md shadow-amber-400/30">
                  {topThree[1].avatar}
                </div>
                <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  1
                </span>
              </div>
              <span className="text-xs font-extrabold truncate max-w-[90px] block">
                {topThree[1].name.split(' ')[0]}
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-extrabold">
                {topThree[1].xp} XP
              </span>
              <div className="w-full h-24 mt-2 rounded-t-xl bg-gradient-to-t from-amber-500 to-amber-400 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                1st
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-13 h-13 rounded-2xl bg-amber-700/20 text-amber-800 dark:text-amber-200 font-extrabold flex items-center justify-center text-base border-2 border-amber-700/40">
                  {topThree[2].avatar}
                </div>
                <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                  3
                </span>
              </div>
              <span className="text-xs font-bold truncate max-w-[80px] block">
                {topThree[2].name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold">
                {topThree[2].xp} XP
              </span>
              <div className="w-full h-12 mt-2 rounded-t-xl bg-amber-700/20 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-xs">
                3rd
              </div>
            </div>
          </div>

          {/* Ahmad's Current Rank Status Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-sm">
                #4
              </span>
              <div>
                <span className="text-xs font-bold block">{student.name} (Kamu)</span>
                <span className="text-[10px] text-blue-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Butuh 262 XP lagi untuk naik ke podium #3!
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-teal-300 block">
                {student.xp} XP
              </span>
              <span className="text-[10px] text-orange-200 font-semibold flex items-center justify-end gap-0.5">
                <Flame className="w-3 h-3 text-orange-300 fill-orange-300" />
                {student.streakDays}d Streak
              </span>
            </div>
          </div>

          {/* Full List */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Peringkat Keseluruhan Kelas X-A & X-B
            </h4>

            {initialLeaderboard.map((user) => {
              const isMe = user.isCurrentUser;
              return (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isMe
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 font-bold ring-2 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center text-xs font-extrabold ${
                        user.rank === 1
                          ? 'text-amber-500 font-black'
                          : user.rank === 2
                          ? 'text-slate-400'
                          : user.rank === 3
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {user.rank}
                    </span>

                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-extrabold text-xs">
                      {user.avatar}
                    </div>

                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {user.grade}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 block">
                      {user.xp} XP
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1 font-medium">
                      <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                      {user.streak}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
