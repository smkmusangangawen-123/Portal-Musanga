import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  UserPlus,
  Trash2,
  KeyRound,
  FileText,
  Receipt,
  Bell,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  UserCheck,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { AuditLogItem, AuditActionType } from '../types';

interface AuditLogViewProps {
  logs: AuditLogItem[];
  onClearLogs?: () => void;
  darkMode?: boolean;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  onClearLogs,
  darkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionCategory, setActionCategory] = useState<'all' | 'users' | 'permissions' | 'finance' | 'system'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'danger'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    // Category filter
    if (actionCategory === 'users') {
      if (!['create_user', 'delete_user'].includes(log.action)) return false;
    } else if (actionCategory === 'permissions') {
      if (!['update_permissions', 'update_role'].includes(log.action)) return false;
    } else if (actionCategory === 'finance') {
      if (!['create_bill', 'update_bill_status'].includes(log.action)) return false;
    } else if (actionCategory === 'system') {
      if (!['broadcast_sent', 'approve_leave', 'reject_leave'].includes(log.action)) return false;
    }

    // Severity filter
    if (severityFilter !== 'all' && log.severity !== severityFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.title.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        (log.target && log.target.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Action Icon & Color Helper
  const getActionVisuals = (action: AuditActionType, severity: string) => {
    switch (action) {
      case 'create_user':
        return {
          icon: <UserPlus className="w-4 h-4" />,
          color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          badgeText: 'REGISTRASI USER',
          badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        };
      case 'delete_user':
        return {
          icon: <Trash2 className="w-4 h-4" />,
          color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          badgeText: 'HAPUS PENGGUNA',
          badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400 border-rose-200 dark:border-rose-800',
        };
      case 'update_permissions':
        return {
          icon: <KeyRound className="w-4 h-4" />,
          color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
          badgeText: 'HAK AKSES / PERMISSION',
          badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
        };
      case 'update_role':
        return {
          icon: <ShieldCheck className="w-4 h-4" />,
          color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          badgeText: 'PERUBAHAN ROLE',
          badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        };
      case 'create_bill':
        return {
          icon: <Receipt className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          badgeText: 'TERBIT TAGIHAN',
          badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        };
      case 'update_bill_status':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800',
          badgeText: 'PELUNASAN KASIR',
          badgeColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-400 border-teal-200 dark:border-teal-800',
        };
      case 'broadcast_sent':
        return {
          icon: <Bell className="w-4 h-4" />,
          color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          badgeText: 'BROADCAST SIARAN',
          badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        };
      case 'approve_leave':
      case 'reject_leave':
        return {
          icon: <FileText className="w-4 h-4" />,
          color: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-800',
          badgeText: action === 'approve_leave' ? 'IZIN DISETUJUI' : 'IZIN DITOLAK',
          badgeColor: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-400 border-sky-200 dark:border-sky-800',
        };
      default:
        return {
          icon: <History className="w-4 h-4" />,
          color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          badgeText: 'AKTIVITAS',
          badgeColor: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const handleCopyLog = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const userActionLogsCount = logs.filter((l) => ['create_user', 'delete_user'].includes(l.action)).length;
  const permissionLogsCount = logs.filter((l) => ['update_permissions', 'update_role'].includes(l.action)).length;
  const financeLogsCount = logs.filter((l) => ['create_bill', 'update_bill_status'].includes(l.action)).length;

  return (
    <div className="space-y-4">
      {/* Top Banner / Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => setActionCategory('all')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            actionCategory === 'all'
              ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Aktivitas</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <History className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {logs.length} Log
          </h3>
          <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 block">
            Jejak Audit Terverifikasi
          </span>
        </div>

        <div
          onClick={() => setActionCategory('users')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            actionCategory === 'users'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Kelola Pengguna</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {userActionLogsCount}
          </h3>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            Registrasi & Penghapusan
          </span>
        </div>

        <div
          onClick={() => setActionCategory('permissions')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            actionCategory === 'permissions'
              ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-950/40 border-purple-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Hak Akses & Role</span>
            <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <KeyRound className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {permissionLogsCount}
          </h3>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">
            Perubahan Otorisasi Modul
          </span>
        </div>

        <div
          onClick={() => setActionCategory('finance')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            actionCategory === 'finance'
              ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/40 border-blue-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Keuangan & Tagihan</span>
            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {financeLogsCount}
          </h3>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
            E-Administrasi & Kasir TU
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div
        className={`rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {/* Header & Filter Bar */}
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Audit Log Aktivitas Admin (Audit Trail)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pencatatan real-time aksi pembuatan, penghapusan, dan pengaturan hak akses pengguna di backoffice.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {filteredLogs.length} Entri Ditampilkan
              </span>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari aksi, pengguna target, aktor pengubah, atau kata kunci log..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:border-indigo-600 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'users', label: 'Pengguna' },
                { id: 'permissions', label: 'Hak Akses' },
                { id: 'finance', label: 'Keuangan' },
                { id: 'system', label: 'Sistem' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActionCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs ${
                    actionCategory === c.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : darkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Audit Log List */}
        <div className="p-3 sm:p-4 max-h-[560px] overflow-y-auto space-y-2.5 divide-y-0">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-500">Tidak ada catatan aktivitas audit yang sesuai.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActionCategory('all');
                  setSeverityFilter('all');
                }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const visuals = getActionVisuals(log.action, log.severity);

              return (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-2xl border transition-all hover:shadow-xs ${
                    darkMode
                      ? 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800/80'
                      : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Action Icon Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${visuals.color}`}
                    >
                      {visuals.icon}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                            {log.title}
                          </h4>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${visuals.badgeColor}`}
                          >
                            {visuals.badgeText}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {log.description}
                      </p>

                      {/* Footer Metadata: Target & Actor */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                        {log.target && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Target:</span>
                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-medium">
                              {log.target}
                            </span>
                          </div>
                        )}

                        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-500 dark:text-slate-400">Oleh:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {log.actor}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({log.actorRole})
                          </span>
                        </div>

                        {/* Copy log text button */}
                        <button
                          onClick={() => handleCopyLog(log.id, `${log.title} - ${log.description} [Oleh: ${log.actor}, ${log.timestamp}]`)}
                          className="ml-auto text-[10px] text-indigo-500 hover:text-indigo-600 font-bold hover:underline"
                        >
                          {copiedId === log.id ? 'Tersalin ✓' : 'Salin Log'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-150 dark:border-slate-800 rounded-b-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Audit trail diamankan dan disimpan otomatis setiap kali ada perubahan data.</span>
          </div>

          <span className="font-mono text-[10px]">Log Sinkron: Otomatis</span>
        </div>
      </div>
    </div>
  );
};
