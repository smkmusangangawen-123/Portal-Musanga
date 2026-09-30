import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  KeyRound,
  Check,
  X,
  Lock,
  Unlock,
  Sparkles,
  Phone,
  Mail,
  Edit2,
  ChevronRight,
  ShieldAlert,
  Info,
  Layers,
  BookOpen,
  DollarSign,
  UserCheck,
  ArrowRight,
  History,
} from 'lucide-react';
import { SchoolUser, SchoolRole, SystemPermission } from '../types';
import { SYSTEM_PERMISSIONS, ROLE_DEFAULT_PERMISSIONS } from '../data/mockData';

interface UserManagementViewProps {
  users: SchoolUser[];
  onAddUser: (user: SchoolUser) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUser: (
    userId: string,
    role: SchoolRole,
    permissions: string[],
    status: 'aktif' | 'nonaktif',
    details?: Partial<SchoolUser>
  ) => void;
  onImpersonateUser?: (user: SchoolUser) => void;
  onViewAuditLogs?: () => void;
  currentAdminId?: string;
  darkMode?: boolean;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onDeleteUser,
  onUpdateUser,
  onImpersonateUser,
  onViewAuditLogs,
  currentAdminId,
  darkMode = false,
}) => {
  // Filter state
  const [roleFilter, setRoleFilter] = useState<'all' | SchoolRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'nonaktif'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal: Add User
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<SchoolRole>('guru');
  const [newName, setNewName] = useState('');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDeptOrGrade, setNewDeptOrGrade] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState<'aktif' | 'nonaktif'>('aktif');
  const [newPermissions, setNewPermissions] = useState<string[]>(ROLE_DEFAULT_PERMISSIONS.guru);

  // Modal: Edit Role & Permissions
  const [editingUser, setEditingUser] = useState<SchoolUser | null>(null);
  const [editRole, setEditRole] = useState<SchoolRole>('guru');
  const [editStatus, setEditStatus] = useState<'aktif' | 'nonaktif'>('aktif');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editDeptOrGrade, setEditDeptOrGrade] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Modal: Delete Confirmation
  const [deletingUser, setDeletingUser] = useState<SchoolUser | null>(null);

  // Modal: Matrix Guide
  const [isMatrixGuideOpen, setIsMatrixGuideOpen] = useState(false);

  // Counts
  const totalGuru = users.filter((u) => u.role === 'guru').length;
  const totalKaryawan = users.filter((u) => u.role === 'karyawan').length;
  const totalSiswa = users.filter((u) => u.role === 'siswa').length;
  const totalAdmin = users.filter((u) => u.role === 'admin').length;

  // Filtered Users
  const filteredUsers = users.filter((user) => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.identifier.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.departmentOrGrade.toLowerCase().includes(q) ||
        user.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Role Badge Styling Helper
  const getRoleBadge = (role: SchoolRole) => {
    switch (role) {
      case 'guru':
        return {
          label: 'GURU / PENGAJAR',
          icon: <GraduationCap className="w-3 h-3" />,
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          avatarBg: 'from-emerald-500 to-teal-600',
        };
      case 'karyawan':
        return {
          label: 'KARYAWAN / STAF TU',
          icon: <Briefcase className="w-3 h-3" />,
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          avatarBg: 'from-amber-500 to-orange-600',
        };
      case 'siswa':
        return {
          label: 'SISWA',
          icon: <Users className="w-3 h-3" />,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          avatarBg: 'from-blue-500 to-indigo-600',
        };
      case 'admin':
        return {
          label: 'ADMINISTRATOR',
          icon: <ShieldCheck className="w-3 h-3" />,
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          avatarBg: 'from-purple-600 to-indigo-700',
        };
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: SchoolUser) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditPermissions([...user.permissions]);
    setEditDeptOrGrade(user.departmentOrGrade);
    setEditTitle(user.title);
  };

  // Toggle permission in edit modal
  const handleToggleEditPermission = (permId: string) => {
    setEditPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  // Toggle permission in add modal
  const handleToggleNewPermission = (permId: string) => {
    setNewPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  // Reset to default role preset in edit modal
  const handleApplyEditRolePreset = (role: SchoolRole) => {
    setEditRole(role);
    setEditPermissions(ROLE_DEFAULT_PERMISSIONS[role] || []);
  };

  // Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser.id, editRole, editPermissions, editStatus, {
      departmentOrGrade: editDeptOrGrade || editingUser.departmentOrGrade,
      title: editTitle || editingUser.title,
    });
    setEditingUser(null);
  };

  // Handle Add User Submit
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newIdentifier.trim()) return;

    const initials = newName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'US';

    const fallbackEmail =
      newEmail.trim() ||
      `${newIdentifier.toLowerCase()}@smkdigital.sch.id`;

    const defaultTitleByRole = {
      guru: newTitle.trim() || `Guru ${newDeptOrGrade.trim() || 'Mata Pelajaran'}`,
      karyawan: newTitle.trim() || `Staf ${newDeptOrGrade.trim() || 'Tata Usaha'}`,
      siswa: newTitle.trim() || `Siswa ${newDeptOrGrade.trim() || 'Kelas X'}`,
      admin: newTitle.trim() || 'Administrator Sistem & TU',
    }[newRole];

    const newUser: SchoolUser = {
      id: `usr-${newRole}-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      identifier: newIdentifier.trim(),
      email: fallbackEmail,
      phone: newPhone.trim() || '0812-0000-0000',
      avatarInitial: initials,
      title: defaultTitleByRole,
      departmentOrGrade:
        newDeptOrGrade.trim() ||
        (newRole === 'siswa' ? 'Kelas X-A' : 'Bagian Tata Usaha'),
      status: newStatus,
      permissions: newPermissions.length > 0 ? newPermissions : ROLE_DEFAULT_PERMISSIONS[newRole],
      createdAt: 'Hari ini',
    };

    onAddUser(newUser);
    setIsAddModalOpen(false);

    // Reset Form
    setNewName('');
    setNewIdentifier('');
    setNewEmail('');
    setNewPhone('');
    setNewDeptOrGrade('');
    setNewTitle('');
    setNewStatus('aktif');
    setNewPermissions(ROLE_DEFAULT_PERMISSIONS.guru);
  };

  // Grouped Permissions Helper
  const permissionCategories: { key: 'akademik' | 'keuangan' | 'kesiswaan' | 'sistem'; label: string; icon: React.ReactNode }[] = [
    { key: 'akademik', label: 'Modul Akademik & Pembelajaran', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: 'keuangan', label: 'Keuangan & E-Administrasi', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { key: 'kesiswaan', label: 'Kesiswaan & Komunikasi', icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'sistem', label: 'Sistem & Otorisasi', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Guru */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'guru' ? 'all' : 'guru')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            roleFilter === 'guru'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Guru & Pengajar</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-2 text-slate-900 dark:text-white">
            {totalGuru}
          </h3>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Tenaga Pengajar Aktif
          </span>
        </div>

        {/* Karyawan */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'karyawan' ? 'all' : 'karyawan')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            roleFilter === 'karyawan'
              ? 'ring-2 ring-amber-500 bg-amber-50/50 dark:bg-amber-950/40 border-amber-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Karyawan / Staf</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-2 text-slate-900 dark:text-white">
            {totalKaryawan}
          </h3>
          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Staf TU, Kasir & Sarpras
          </span>
        </div>

        {/* Siswa */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'siswa' ? 'all' : 'siswa')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            roleFilter === 'siswa'
              ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/40 border-blue-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Siswa Terdaftar</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-2 text-slate-900 dark:text-white">
            {totalSiswa}
          </h3>
          <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Akun Siswa Terverifikasi
          </span>
        </div>

        {/* Admin */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'admin' ? 'all' : 'admin')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            roleFilter === 'admin'
              ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-950/40 border-purple-400'
              : darkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Super Admin</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-2 text-slate-900 dark:text-white">
            {totalAdmin}
          </h3>
          <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3" /> Akses Otoritas Penuh
          </span>
        </div>
      </div>

      {/* Action Bar: Search, Category Tabs, Add Button, Guide Button */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, NIP/NISN, divisi, atau email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs font-medium outline-none focus:border-indigo-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {onViewAuditLogs && (
              <button
                onClick={onViewAuditLogs}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-2xs"
                title="Buka Audit Log Aktivitas RBAC"
              >
                <History className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Audit Log</span>
              </button>
            )}

            <button
              onClick={() => setIsMatrixGuideOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
              title="Lihat matriks hak akses"
            >
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Panduan Hak Akses</span>
            </button>

            <button
              onClick={() => {
                setNewRole('guru');
                setNewPermissions(ROLE_DEFAULT_PERMISSIONS.guru);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filter Peran:</span>
            {[
              { id: 'all', label: 'Semua', count: users.length },
              { id: 'guru', label: 'Guru', count: totalGuru },
              { id: 'karyawan', label: 'Karyawan', count: totalKaryawan },
              { id: 'siswa', label: 'Siswa', count: totalSiswa },
              { id: 'admin', label: 'Admin', count: totalAdmin },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRoleFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
                  roleFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    roleFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">🟢 Aktif</option>
              <option value="nonaktif">🔴 Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List & Table Card */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Daftar Pengguna Sekolah ({filteredUsers.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Kelola Guru, Karyawan, Siswa & Hak Akses Modul
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-500">Tidak ada pengguna yang cocok dengan filter atau kata kunci.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleBadge(user.role);
              const isSuperAdmin = user.id === currentAdminId || (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1);

              return (
                <div
                  key={user.id}
                  className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: User Identity */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-[280px]">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${roleInfo.avatarBg} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md`}
                    >
                      {user.avatarInitial}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {user.name}
                        </h4>

                        {/* Role Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${roleInfo.color}`}
                        >
                          {roleInfo.icon}
                          <span>{roleInfo.label}</span>
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'aktif'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}
                        >
                          {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {user.title} • <span className="font-semibold">{user.departmentOrGrade}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                          {user.role === 'siswa' ? 'NISN: ' : 'NIP/NUPTK: '}
                          {user.identifier}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {user.email}
                        </span>
                        {user.phone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Hak Akses Pills Preview */}
                  <div className="flex-1 lg:px-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-indigo-500" /> Otorisasi Hak Akses ({user.permissions.length} Aktif)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {user.permissions.slice(0, 4).map((pId) => {
                        const perm = SYSTEM_PERMISSIONS.find((p) => p.id === pId);
                        if (!perm) return null;
                        return (
                          <span
                            key={pId}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {perm.label}
                          </span>
                        );
                      })}
                      {user.permissions.length > 4 && (
                        <span
                          onClick={() => handleOpenEditModal(user)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 cursor-pointer hover:underline"
                        >
                          +{user.permissions.length - 4} lainnya...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Impersonate / Test Login */}
                    {onImpersonateUser && (
                      <button
                        onClick={() => onImpersonateUser(user)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                        title={`Uji login sebagai ${user.name}`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span className="hidden sm:inline">Uji Akses</span>
                      </button>
                    )}

                    {/* Edit Role & Permissions Button */}
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      title="Atur peran dan hak akses"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Atur Role & Akses</span>
                    </button>

                    {/* Delete User Button */}
                    <button
                      onClick={() => setDeletingUser(user)}
                      disabled={isSuperAdmin}
                      className={`p-2 rounded-xl border transition-all ${
                        isSuperAdmin
                          ? 'opacity-30 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                          : 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400'
                      }`}
                      title={isSuperAdmin ? 'Akun Super Admin utama tidak dapat dihapus' : `Hapus ${user.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH PENGGUNA BARU */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-[28px] overflow-hidden border shadow-2xl my-8 transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-150 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Tambah Pengguna Baru</h3>
                  <span className="text-xs text-slate-400">
                    Daftarkan Guru, Karyawan, atau Siswa dengan otorisasi hak akses terstandarisasi
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Step 1: Pilih Peran / Role */}
              <div>
                <label className="text-xs font-bold block mb-2 text-slate-700 dark:text-slate-300">
                  1. Pilih Kategori & Peran Akun <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'guru', label: 'Guru / Pengajar', icon: <GraduationCap className="w-4 h-4" />, desc: 'Materi, CBT & Nilai' },
                    { id: 'karyawan', label: 'Karyawan / Staf', icon: <Briefcase className="w-4 h-4" />, desc: 'TU, Kasir & Sarpras' },
                    { id: 'siswa', label: 'Siswa', icon: <Users className="w-4 h-4" />, desc: 'LMS & Belajar Mandiri' },
                    { id: 'admin', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Otoritas Sistem Penuh' },
                  ].map((r) => {
                    const isSelected = newRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          const role = r.id as SchoolRole;
                          setNewRole(role);
                          setNewPermissions(ROLE_DEFAULT_PERMISSIONS[role] || []);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {r.icon}
                        </div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                          {r.label}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Data Identitas Pengguna */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">
                  2. Informasi Profil & Identitas
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold block mb-1 text-slate-500">
                      Nama Lengkap (dengan gelar jika ada) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={
                        newRole === 'guru'
                          ? 'Contoh: Dra. Tri Wahyuni, M.Pd'
                          : newRole === 'karyawan'
                          ? 'Contoh: Bagas Pratama, S.E'
                          : 'Contoh: Muhammad Farhan Alamsyah'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1 text-slate-500">
                      {newRole === 'siswa' ? 'Nomor Induk Siswa Nasional (NISN)' : 'NIP / NUPTK / ID Staf'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newIdentifier}
                      onChange={(e) => setNewIdentifier(e.target.value)}
                      placeholder={newRole === 'siswa' ? 'Contoh: 123456799' : 'Contoh: 198804152012011003'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold block mb-1 text-slate-500">
                      Email Sekolah / Pribadi
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="pengguna@smkdigital.sch.id"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1 text-slate-500">
                      No. Handphone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="0812-3456-7890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold block mb-1 text-slate-500">
                      {newRole === 'siswa' ? 'Kelas & Jurusan' : 'Divisi / Mata Pelajaran'}
                    </label>
                    <input
                      type="text"
                      value={newDeptOrGrade}
                      onChange={(e) => setNewDeptOrGrade(e.target.value)}
                      placeholder={
                        newRole === 'siswa'
                          ? 'Contoh: Kelas X-A (Rekayasa Perangkat Lunak)'
                          : newRole === 'guru'
                          ? 'Contoh: Bahasa Indonesia & Wali Kelas XI'
                          : 'Contoh: Bagian Keuangan & Kasir TU'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1 text-slate-500">
                      Status Akun
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                    >
                      <option value="aktif">🟢 Aktif (Dapat Login & Akses Fitur)</option>
                      <option value="nonaktif">🔴 Nonaktif (Akses Ditangguhkan)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Pengaturan Hak Akses / Otorisasi */}
              <div className="pt-2 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                      3. Otorisasi Hak Akses Modul ({newPermissions.length} Terpilih)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Preset otomatis aktif sesuai role, namun Anda bebas menyesuaikan checklist di bawah ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setNewPermissions(ROLE_DEFAULT_PERMISSIONS[newRole] || [])}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5"
                    >
                      Preset Role
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setNewPermissions(SYSTEM_PERMISSIONS.map((p) => p.id))}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:underline px-1.5 py-0.5"
                    >
                      Pilih Semua
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setNewPermissions([])}
                      className="text-[11px] font-bold text-rose-500 hover:underline px-1.5 py-0.5"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                {/* Categorized Permissions Grid */}
                <div className="space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  {permissionCategories.map((cat) => {
                    const categoryPerms = SYSTEM_PERMISSIONS.filter((p) => p.category === cat.key);
                    return (
                      <div key={cat.key} className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          {cat.icon}
                          <span>{cat.label}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryPerms.map((perm) => {
                            const isChecked = newPermissions.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleNewPermission(perm.id)}
                                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                />
                                <div className="space-y-0.5">
                                  <div className="font-bold text-xs leading-tight text-slate-900 dark:text-white">
                                    {perm.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 leading-snug">
                                    {perm.description}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Pengguna Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ATUR PERAN & HAK AKSES (EDIT ROLE & PERMISSIONS) */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-[28px] overflow-hidden border shadow-2xl my-8 transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-150 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Atur Peran & Hak Akses
                  </h3>
                  <span className="text-xs text-slate-400">
                    Konfigurasi otorisasi untuk <strong className="text-slate-700 dark:text-slate-200">{editingUser.name}</strong> ({editingUser.identifier})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Role Switcher */}
              <div>
                <label className="text-xs font-bold block mb-2 text-slate-700 dark:text-slate-300">
                  Ubah Peran / Role Akun
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['guru', 'karyawan', 'siswa', 'admin'] as SchoolRole[]).map((r) => {
                    const isSelected = editRole === r;
                    const rBadge = getRoleBadge(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleApplyEditRolePreset(r)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500 font-black'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="text-xs capitalize text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                          {rBadge.icon}
                          <span>{r}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {isSelected ? 'Role Aktif' : 'Terapkan Preset'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status & Department Update */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold block mb-1 text-slate-500">
                    Divisi / Kelas / Bidang
                  </label>
                  <input
                    type="text"
                    value={editDeptOrGrade}
                    onChange={(e) => setEditDeptOrGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold block mb-1 text-slate-500">
                    Status Akun Pengguna
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                  >
                    <option value="aktif">🟢 Akun Aktif (Dapat Mengakses Sistem)</option>
                    <option value="nonaktif">🔴 Akun Nonaktif (Kunci Akses Masuk)</option>
                  </select>
                </div>
              </div>

              {/* Granular Hak Akses Checkboxes */}
              <div className="pt-2 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      Detail Hak Akses Modul ({editPermissions.length} Diizinkan)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Beri izin atau cabut hak akses modul secara individual.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditPermissions(ROLE_DEFAULT_PERMISSIONS[editRole] || [])}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5"
                    >
                      Reset ke Preset {editRole.toUpperCase()}
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setEditPermissions(SYSTEM_PERMISSIONS.map((p) => p.id))}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:underline px-1.5 py-0.5"
                    >
                      Pilih Semua
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  {permissionCategories.map((cat) => {
                    const categoryPerms = SYSTEM_PERMISSIONS.filter((p) => p.category === cat.key);
                    return (
                      <div key={cat.key} className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          {cat.icon}
                          <span>{cat.label}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryPerms.map((perm) => {
                            const isChecked = editPermissions.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleEditPermission(perm.id)}
                                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                />
                                <div className="space-y-0.5">
                                  <div className="font-bold text-xs leading-tight text-slate-900 dark:text-white">
                                    {perm.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 leading-snug">
                                    {perm.description}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Perbarui Peran & Hak Akses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS PENGGUNA */}
      {/* ========================================================================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-[28px] overflow-hidden border shadow-2xl p-5 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-base mb-1">Konfirmasi Hapus Pengguna</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun pengguna berikut dari basis data sekolah?
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 mb-5 space-y-1">
              <div className="font-extrabold text-sm text-rose-950 dark:text-rose-200">
                {deletingUser.name}
              </div>
              <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                {deletingUser.title} ({deletingUser.identifier})
              </div>
              <div className="text-[11px] text-rose-600/80 dark:text-rose-400">
                Peran: <span className="uppercase font-bold">{deletingUser.role}</span> • {deletingUser.email}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteUser(deletingUser.id);
                  setDeletingUser(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PANDUAN MATRIKS HAK AKSES & REFERENSI ROLE */}
      {/* ========================================================================= */}
      {isMatrixGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className={`w-full max-w-3xl rounded-[28px] overflow-hidden border shadow-2xl my-8 transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-150 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Matriks Hak Akses & Referensi Peran (RBAC)
                  </h3>
                  <span className="text-xs text-slate-400">
                    Standar otoritas Role-Based Access Control pada platform EduPortal
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMatrixGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 block mb-1">
                    GURU / PENGAJAR
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-snug">
                    Fokus pada KBM: Pembuatan materi bab LMS, bank soal CBT, pengisian nilai raport, dan verifikasi absensi kelas.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 block mb-1">
                    KARYAWAN / TU
                  </span>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">
                    Fokus pada administrasi: Penerbitan tagihan SPP & seragam, kasir pembayaran loket TU, validasi izin, dan sarpras.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-black text-blue-800 dark:text-blue-300 block mb-1">
                    SISWA
                  </span>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-snug">
                    Fokus pada belajar mandiri: Menonton modul materi, pengerjaan kuis/ujian CBT, bayar tagihan mandiri, dan e-library.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <span className="text-xs font-black text-purple-800 dark:text-purple-300 block mb-1">
                    SUPER ADMIN
                  </span>
                  <p className="text-[11px] text-purple-700 dark:text-purple-400 leading-snug">
                    Otoritas sistem penuh: Menambah/menghapus akun seluruh staf & siswa, mengatur hak akses, dan siaran darurat.
                  </p>
                </div>
              </div>

              {/* Table Matrix */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 font-black text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-3">Nama Modul & Hak Akses</th>
                      <th className="p-3 text-center">Guru</th>
                      <th className="p-3 text-center">Karyawan</th>
                      <th className="p-3 text-center">Siswa</th>
                      <th className="p-3 text-center">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                    {SYSTEM_PERMISSIONS.map((p) => {
                      const inGuru = ROLE_DEFAULT_PERMISSIONS.guru.includes(p.id);
                      const inKaryawan = ROLE_DEFAULT_PERMISSIONS.karyawan.includes(p.id);
                      const inSiswa = ROLE_DEFAULT_PERMISSIONS.siswa.includes(p.id);
                      const inAdmin = ROLE_DEFAULT_PERMISSIONS.admin.includes(p.id);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white">{p.label}</div>
                            <div className="text-[10px] text-slate-400">{p.description}</div>
                          </td>
                          <td className="p-3 text-center">
                            {inGuru ? (
                              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 items-center justify-center font-black text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {inKaryawan ? (
                              <span className="inline-flex w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 items-center justify-center font-black text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {inSiswa ? (
                              <span className="inline-flex w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 items-center justify-center font-black text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {inAdmin ? (
                              <span className="inline-flex w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 items-center justify-center font-black text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 border-t border-slate-150 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMatrixGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
