import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Bell,
  Send,
  LogOut,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  Filter,
  Check,
  X,
  CreditCard,
  Building,
  Shirt,
  FlaskConical,
  Award,
  Sparkles,
  School,
  Download,
  UserCog,
  KeyRound,
  GraduationCap,
  Briefcase,
  History,
  Printer,
  Clock,
  ArrowRight,
  Wallet,
  Percent,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserCheck,
  Building2,
  Layers,
  BookOpen,
  Trash2,
  Edit3,
  Tag,
  Save,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AuthUser,
  AdministrasiBill,
  NotificationItem,
  AdminLeaveRequest,
  StudentListItem,
  SchoolUser,
  SchoolRole,
  AuditLogItem,
  BillPaymentHistory,
  SchoolClass,
  SchoolMajor,
} from '../types';
import { initialSchoolClasses, initialSchoolMajors } from '../data/mockData';
import { UserManagementView } from './UserManagementView';
import { AuditLogView } from './AuditLogView';
import { exportStudentsToCsv } from '../utils/exportCsv';
import { playSound } from '../utils/sound';

interface AdminDashboardViewProps {
  adminUser: AuthUser;
  bills: AdministrasiBill[];
  onAddBill: (newBill: AdministrasiBill) => void;
  onUpdateBillStatus: (billId: string, status: 'lunas' | 'belum_bayar') => void;
  onBroadcastNotification: (title: string, message: string, type: 'academic' | 'finance' | 'system') => void;
  onSwitchToStudentView: () => void;
  onLogout: () => void;
  leaveRequests: AdminLeaveRequest[];
  onUpdateLeaveStatus: (leaveId: string, status: 'disetujui' | 'ditolak') => void;
  studentsDirectory: StudentListItem[];
  schoolUsers: SchoolUser[];
  auditLogs: AuditLogItem[];
  schoolClasses?: SchoolClass[];
  schoolMajors?: SchoolMajor[];
  onAddSchoolClass?: (newClass: SchoolClass) => void;
  onDeleteSchoolClass?: (classId: string) => void;
  onAddSchoolMajor?: (newMajor: SchoolMajor) => void;
  onDeleteSchoolMajor?: (majorId: string) => void;
  onAddSchoolUser: (user: SchoolUser, studentDetails?: Partial<StudentListItem>) => void;
  onDeleteSchoolUser: (userId: string) => void;
  onUpdateSchoolUser: (
    userId: string,
    role: SchoolRole,
    permissions: string[],
    status: 'aktif' | 'nonaktif',
    details?: Partial<SchoolUser>
  ) => void;
  onImpersonateUser?: (user: SchoolUser) => void;
  onUpdateStudent?: (studentId: string, updatedData: Partial<StudentListItem>) => void;
  onRecordPayment?: (billId: string, paymentMethod: string, amount: number, note?: string) => void;
  darkMode?: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  bills,
  onAddBill,
  onUpdateBillStatus,
  onBroadcastNotification,
  onSwitchToStudentView,
  onLogout,
  leaveRequests,
  onUpdateLeaveStatus,
  studentsDirectory,
  schoolUsers,
  auditLogs,
  schoolClasses = initialSchoolClasses,
  schoolMajors = initialSchoolMajors,
  onAddSchoolClass,
  onDeleteSchoolClass,
  onAddSchoolMajor,
  onDeleteSchoolMajor,
  onAddSchoolUser,
  onDeleteSchoolUser,
  onUpdateSchoolUser,
  onImpersonateUser,
  onUpdateStudent,
  onRecordPayment,
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pengguna' | 'audit' | 'administrasi' | 'presensi' | 'broadcast' | 'siswa'>('pengguna');

  // Search & Filter state for Bills
  const [billSearchQuery, setBillSearchQuery] = useState('');
  const [billFilterCategory, setBillFilterCategory] = useState<string>('all');

  // Modal Create Bill state
  const [isCreateBillModalOpen, setIsCreateBillModalOpen] = useState(false);
  const [billTargetType, setBillTargetType] = useState<'all' | 'student'>('all');
  const [selectedStudentForBill, setSelectedStudentForBill] = useState<StudentListItem | null>(null);
  const [studentSearchInModal, setStudentSearchInModal] = useState('');
  const [newBillTitle, setNewBillTitle] = useState('');
  const [newBillCategory, setNewBillCategory] = useState<'spp' | 'seragam' | 'gedung' | 'praktikum' | 'kegiatan' | 'lainnya'>('spp');
  const [newBillAmount, setNewBillAmount] = useState('150000');
  const [newBillDueDate, setNewBillDueDate] = useState('15 Nov 2026');
  const [newBillDesc, setNewBillDesc] = useState('');
  const [allowInstallment, setAllowInstallment] = useState(true);

  // Modal Record Payment by Admin / Kasir TU
  const [payingBillForAdmin, setPayingBillForAdmin] = useState<AdministrasiBill | null>(null);
  const [adminPayAmount, setAdminPayAmount] = useState<string>('');
  const [adminPaymentMethod, setAdminPaymentMethod] = useState<string>('Kasir Loket Tata Usaha (Tunai)');
  const [adminPaymentNote, setAdminPaymentNote] = useState<string>('');
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  // Modal View Payment History & Digital Receipt
  const [viewingHistoryBill, setViewingHistoryBill] = useState<AdministrasiBill | null>(null);
  const [activeReceiptPreview, setActiveReceiptPreview] = useState<{ bill: AdministrasiBill; payment: BillPaymentHistory } | null>(null);

  // Modal Add Student state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNisn, setNewStudentNisn] = useState('');
  const [newStudentSelectedClass, setNewStudentSelectedClass] = useState<string>('X-A');
  const [newStudentCustomClass, setNewStudentCustomClass] = useState('');
  const [newStudentSelectedMajor, setNewStudentSelectedMajor] = useState<string>('IPA');
  const [newStudentCustomMajor, setNewStudentCustomMajor] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentSavings, setNewStudentSavings] = useState('100000');

  // Modal / Panel Edit Student Data State
  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentNisn, setEditStudentNisn] = useState('');
  const [editStudentGrade, setEditStudentGrade] = useState('');
  const [editStudentMajor, setEditStudentMajor] = useState('');
  const [editStudentSavings, setEditStudentSavings] = useState('');
  const [editStudentSppStatus, setEditStudentSppStatus] = useState<'lunas' | 'tertunggak'>('lunas');
  const [editStudentAttendance, setEditStudentAttendance] = useState('100');
  const [editStudentAvgScore, setEditStudentAvgScore] = useState('85');
  const [editStudentSuccessMessage, setEditStudentSuccessMessage] = useState(false);

  // Modal Manage Classes & Majors state
  const [isManageClassesModalOpen, setIsManageClassesModalOpen] = useState(false);
  const [manageClassTab, setManageClassTab] = useState<'kelas' | 'jurusan'>('kelas');

  // New Class Form state
  const [newClassName, setNewClassName] = useState('');
  const [newClassGradeLevel, setNewClassGradeLevel] = useState<'X' | 'XI' | 'XII'>('X');
  const [newClassMajor, setNewClassMajor] = useState('TBSM');
  const [newClassWali, setNewClassWali] = useState('');
  const [newClassRoom, setNewClassRoom] = useState('');

  // New Major Form state
  const [newMajorCode, setNewMajorCode] = useState('');
  const [newMajorName, setNewMajorName] = useState('');
  const [newMajorDesc, setNewMajorDesc] = useState('');

  // Student directory search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterClass, setStudentFilterClass] = useState('all');
  const [studentFilterMajor, setStudentFilterMajor] = useState('all');

  // Export CSV state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('all');
  const [exportCustomFilename, setExportCustomFilename] = useState('');
  const [exportToastMessage, setExportToastMessage] = useState<string | null>(null);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'academic' | 'finance' | 'system'>('academic');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Calculations
  const totalBillsAmount = bills.reduce((acc, curr) => acc + curr.amount, 0);
  const paidBills = bills.filter((b) => b.status === 'lunas');
  const partialBills = bills.filter((b) => b.status === 'sebagian');
  const unpaidBills = bills.filter((b) => b.status === 'belum_bayar');
  const totalPaidAmount = bills.reduce(
    (acc, curr) => acc + (curr.paidAmount ?? (curr.status === 'lunas' ? curr.amount : 0)),
    0
  );
  const totalUnpaidAmount = bills.reduce(
    (acc, curr) => acc + (curr.remainingAmount ?? (curr.status === 'lunas' ? 0 : curr.amount)),
    0
  );

  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'menunggu').length;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('IDR', 'Rp');
  };

  const handleCreateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillTitle.trim() || !newBillAmount) return;

    const amountNum = Number(newBillAmount.replace(/\D/g, '')) || 100000;
    const billCode = `ADM-${newBillCategory.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newBillItem: AdministrasiBill = {
      id: `adm-custom-${Date.now()}`,
      title: newBillTitle,
      category: newBillCategory,
      code: billCode,
      academicYear: 'Ganjil 2026/2027',
      amount: amountNum,
      paidAmount: 0,
      remainingAmount: amountNum,
      dueDate: newBillDueDate,
      status: 'belum_bayar',
      targetType: billTargetType,
      studentId: billTargetType === 'student' ? selectedStudentForBill?.id : undefined,
      studentName: billTargetType === 'student' ? selectedStudentForBill?.name : undefined,
      studentNisn: billTargetType === 'student' ? selectedStudentForBill?.nisn : undefined,
      studentGrade: billTargetType === 'student' ? selectedStudentForBill?.grade : undefined,
      description:
        newBillDesc ||
        (billTargetType === 'student' && selectedStudentForBill
          ? `Tagihan khusus perorangan untuk siswa ${selectedStudentForBill.name} (${selectedStudentForBill.grade} - NISN: ${selectedStudentForBill.nisn}).`
          : `Tagihan resmi sekolah diterbitkan untuk seluruh siswa.`),
      itemsBreakdown: [
        { name: `Biaya Pokok ${newBillTitle}`, amount: amountNum },
      ],
      paymentHistory: [],
    };

    onAddBill(newBillItem);
    setIsCreateBillModalOpen(false);
    setNewBillTitle('');
    setNewBillDesc('');
    setSelectedStudentForBill(null);
    setBillTargetType('all');
  };

  const handleCreateBillForStudent = (studentItem: StudentListItem) => {
    setSelectedStudentForBill(studentItem);
    setBillTargetType('student');
    setNewBillTitle(`Biaya Administrasi Khusus - ${studentItem.name}`);
    setNewBillDesc(`Tagihan perorangan untuk siswa ${studentItem.name} (${studentItem.grade} - NISN: ${studentItem.nisn})`);
    setIsCreateBillModalOpen(true);
  };

  const handleOpenRecordPayment = (bill: AdministrasiBill) => {
    setPayingBillForAdmin(bill);
    const remaining = bill.remainingAmount ?? (bill.status === 'lunas' ? 0 : bill.amount);
    setAdminPayAmount(remaining.toString());
    setAdminPaymentNote(bill.status === 'sebagian' ? 'Pembayaran Angsuran / Cicilan Lanjutan' : 'Setoran Kasir Loket TU');
  };

  const handleConfirmAdminPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBillForAdmin) return;

    const payNum = Number(adminPayAmount.replace(/\D/g, ''));
    if (!payNum || payNum <= 0) return;

    setIsRecordingPayment(true);
    setTimeout(() => {
      if (onRecordPayment) {
        onRecordPayment(payingBillForAdmin.id, adminPaymentMethod, payNum, adminPaymentNote);
      } else {
        onUpdateBillStatus(payingBillForAdmin.id, 'lunas');
      }
      setIsRecordingPayment(false);
      setPayingBillForAdmin(null);
    }, 400);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    onBroadcastNotification(broadcastTitle, broadcastMessage, broadcastCategory);
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: SchoolClass = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      gradeLevel: newClassGradeLevel,
      major: newClassMajor.trim(),
      waliKelas: newClassWali.trim() || undefined,
      room: newClassRoom.trim() || undefined,
    };

    if (onAddSchoolClass) {
      onAddSchoolClass(newClass);
    }
    setNewClassName('');
    setNewClassWali('');
    setNewClassRoom('');
  };

  const handleCreateMajorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMajorCode.trim() || !newMajorName.trim()) return;

    const newMajor: SchoolMajor = {
      id: `jur-${Date.now()}`,
      code: newMajorCode.trim().toUpperCase(),
      name: newMajorName.trim(),
      description: newMajorDesc.trim() || undefined,
    };

    if (onAddSchoolMajor) {
      onAddSchoolMajor(newMajor);
    }
    setNewMajorCode('');
    setNewMajorName('');
    setNewMajorDesc('');
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentNisn.trim()) return;

    const chosenClass = newStudentSelectedClass === 'custom'
      ? newStudentCustomClass.trim() || 'X-A'
      : newStudentSelectedClass;

    const chosenMajor = newStudentSelectedMajor === 'custom'
      ? newStudentCustomMajor.trim() || 'Umum'
      : newStudentSelectedMajor;

    const savingsNum = Number(newStudentSavings.replace(/\D/g, '')) || 100000;

    // If custom class entered and not yet in schoolClasses, register it!
    if (newStudentSelectedClass === 'custom' && newStudentCustomClass.trim()) {
      const exists = schoolClasses.some((c) => c.name.toLowerCase() === newStudentCustomClass.trim().toLowerCase());
      if (!exists && onAddSchoolClass) {
        onAddSchoolClass({
          id: `cls-custom-${Date.now()}`,
          name: newStudentCustomClass.trim(),
          gradeLevel: newStudentCustomClass.startsWith('XII') ? 'XII' : newStudentCustomClass.startsWith('XI') ? 'XI' : 'X',
          major: chosenMajor,
        });
      }
    }

    const newStudentUser: SchoolUser = {
      id: `std-${Date.now()}`,
      name: newStudentName.trim(),
      role: 'siswa',
      identifier: newStudentNisn.trim(),
      email: newStudentEmail.trim() || `${newStudentNisn.trim()}@siswa.sch.id`,
      phone: newStudentPhone.trim() || undefined,
      avatarInitial: newStudentName.trim().charAt(0).toUpperCase(),
      title: 'Siswa Aktif',
      departmentOrGrade: chosenClass,
      status: 'aktif',
      permissions: ['module_access', 'exam_cbt', 'library_read', 'pay_bills', 'view_grades'],
      createdAt: 'Hari ini',
    };

    onAddSchoolUser(newStudentUser, {
      grade: chosenClass,
      major: chosenMajor,
      savingsBalance: savingsNum,
    });

    // Reset & close
    setNewStudentName('');
    setNewStudentNisn('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentSavings('100000');
    setNewStudentCustomClass('');
    setNewStudentCustomMajor('');
    setIsAddStudentModalOpen(false);
  };

  // Handlers for Edit Student Modal / Detail Panel
  const handleOpenEditStudentModal = (student: StudentListItem) => {
    setEditingStudent(student);
    setEditStudentName(student.name);
    setEditStudentNisn(student.nisn);
    setEditStudentGrade(student.grade);
    setEditStudentMajor(student.major);
    setEditStudentSavings(student.savingsBalance.toString());
    setEditStudentSppStatus(student.sppStatus);
    setEditStudentAttendance(student.attendancePercent.toString());
    setEditStudentAvgScore(student.averageScore.toString());
    setEditStudentSuccessMessage(false);
  };

  const handleAdjustEditSavings = (amountToAdd: number) => {
    const current = Number(editStudentSavings.replace(/\D/g, '')) || 0;
    const nextVal = Math.max(0, current + amountToAdd);
    setEditStudentSavings(nextVal.toString());
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editStudentName.trim() || !editStudentNisn.trim()) return;

    const parsedSavings = Number(editStudentSavings.replace(/\D/g, '')) || 0;
    const parsedAttendance = Math.min(100, Math.max(0, Number(editStudentAttendance) || 0));
    const parsedAvgScore = Math.min(100, Math.max(0, Number(editStudentAvgScore) || 0));

    const updatedData: Partial<StudentListItem> = {
      name: editStudentName.trim(),
      nisn: editStudentNisn.trim(),
      grade: editStudentGrade.trim() || 'X-A',
      major: editStudentMajor.trim() || 'Umum',
      savingsBalance: parsedSavings,
      sppStatus: editStudentSppStatus,
      attendancePercent: parsedAttendance,
      averageScore: parsedAvgScore,
    };

    if (onUpdateStudent) {
      onUpdateStudent(editingStudent.id, updatedData);
    }

    setEditStudentSuccessMessage(true);
    setTimeout(() => {
      setEditStudentSuccessMessage(false);
      setEditingStudent(null);
    }, 900);
  };

  const handleExportCsv = (scope: 'all' | 'filtered' = exportScope, customFilename?: string) => {
    const dataToExport = scope === 'filtered' ? filteredStudents : studentsDirectory;
    if (!dataToExport || dataToExport.length === 0) return;

    const result = exportStudentsToCsv(dataToExport, {
      scope,
      customFilename: customFilename?.trim() || undefined,
      filterDescription:
        scope === 'filtered'
          ? `Kelas: ${studentFilterClass}, Jurusan: ${studentFilterMajor}`
          : undefined,
    });

    playSound('success');
    setIsExportModalOpen(false);
    setExportToastMessage(
      `Berhasil mengekspor ${result.count} data siswa ke file "${result.filename}"`
    );
    setTimeout(() => {
      setExportToastMessage(null);
    }, 5000);
  };

  // Filtered bills
  const filteredBills = bills.filter((b) => {
    if (billFilterCategory === 'unpaid' && b.status === 'lunas') return false;
    if (billFilterCategory === 'paid' && b.status !== 'lunas') return false;
    if (billFilterCategory === 'sebagian' && b.status !== 'sebagian') return false;
    if (billFilterCategory === 'persiswa' && b.targetType !== 'student') return false;
    if (billFilterCategory === 'massal' && b.targetType === 'student') return false;
    if (billFilterCategory === 'spp' && b.category !== 'spp') return false;
    if (billFilterCategory === 'seragam' && b.category !== 'seragam') return false;
    if (billFilterCategory === 'praktikum' && b.category !== 'praktikum') return false;

    if (billSearchQuery.trim()) {
      const q = billSearchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.studentName && b.studentName.toLowerCase().includes(q)) ||
        (b.studentNisn && b.studentNisn.includes(q))
      );
    }
    return true;
  });

  const filteredStudents = studentsDirectory.filter((s) => {
    if (studentFilterClass !== 'all' && s.grade !== studentFilterClass) return false;
    if (studentFilterMajor !== 'all' && s.major !== studentFilterMajor) return false;

    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.nisn.includes(q) ||
      s.grade.toLowerCase().includes(q) ||
      s.major.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Admin Navigation Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-3 sm:px-6 transition-colors ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base leading-tight">
                  Backoffice Tata Usaha & Administrator
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {adminUser.name} • {adminUser.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeTab === 'audit'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
              }`}
              title="Buka Audit Log Aktivitas Admin"
            >
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Audit Log</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold">
                {auditLogs.length}
              </span>
            </button>

            <button
              onClick={onSwitchToStudentView}
              className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Buka tampilan dashboard siswa"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mode Siswa</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* KPI Metrics Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Pengguna & Hak Akses */}
          <div
            onClick={() => setActiveTab('pengguna')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
              activeTab === 'pengguna' ? 'ring-2 ring-indigo-500' : ''
            } ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Pengguna & Role</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <UserCog className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-2 text-slate-900 dark:text-white">
              {schoolUsers.length} Akun
            </h3>
            <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-1 mt-1">
              <KeyRound className="w-3 h-3" /> Guru, Staf & Siswa Terdaftar
            </span>
          </div>

          {/* Card 2 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Kas Masuk</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-2 text-emerald-600 dark:text-emerald-400">
              {formatRupiah(totalPaidAmount)}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block truncate">
              Dari {paidBills.length} tagihan terlunasi
            </span>
          </div>

          {/* Card 3 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tunggakan SPP/Adm</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-2 text-rose-600 dark:text-rose-400">
              {formatRupiah(totalUnpaidAmount)}
            </h3>
            <span className="text-[11px] text-rose-500 font-bold mt-1 block">
              {unpaidBills.length} tagihan menunggu
            </span>
          </div>

          {/* Card 4 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Presensi Hari Ini</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-2 text-slate-900 dark:text-white">97.8%</h3>
            <span className="text-[11px] text-indigo-500 font-bold mt-1 block">
              {pendingLeavesCount > 0 ? `${pendingLeavesCount} izin butuh review` : 'Seluruh data terverifikasi'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab('pengguna')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'pengguna'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : darkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>Guru, Karyawan & Siswa (RBAC)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'pengguna' ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'
              }`}
            >
              {schoolUsers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : darkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Log Aktivitas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'audit' ? 'bg-white text-indigo-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {auditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('administrasi')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'administrasi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Manajemen E-Administrasi</span>
            {unpaidBills.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'administrasi' ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                }`}
              >
                {unpaidBills.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('presensi')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'presensi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Presensi & Permohonan Izin</span>
            {pendingLeavesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                {pendingLeavesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'broadcast'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Pengumuman</span>
          </button>

          <button
            onClick={() => setActiveTab('siswa')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'siswa'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Siswa</span>
          </button>
        </div>

        {/* TAB 0: MANAJEMEN PENGGUNA & HAK AKSES (GURU, KARYAWAN, SISWA, ADMIN) */}
        {activeTab === 'pengguna' && (
          <UserManagementView
            users={schoolUsers}
            onAddUser={onAddSchoolUser}
            onDeleteUser={onDeleteSchoolUser}
            onUpdateUser={onUpdateSchoolUser}
            onImpersonateUser={onImpersonateUser}
            onViewAuditLogs={() => setActiveTab('audit')}
            currentAdminId={adminUser.id}
            darkMode={darkMode}
          />
        )}

        {/* TAB 0.5: AUDIT LOG AKTIVITAS (SECURITY & RBAC TRAIL) */}
        {activeTab === 'audit' && (
          <AuditLogView logs={auditLogs} darkMode={darkMode} />
        )}

        {/* TAB 1: MANAJEMEN E-ADMINISTRASI */}
        {activeTab === 'administrasi' && (
          <div className="space-y-4">
            {/* Action Bar: Create Bill & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={billSearchQuery}
                    onChange={(e) => setBillSearchQuery(e.target.value)}
                    placeholder="Cari nama tagihan, kode SPP..."
                    className="w-full bg-transparent text-xs outline-none font-semibold placeholder:text-slate-400"
                  />
                  {billSearchQuery && (
                    <button onClick={() => setBillSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={billFilterCategory}
                  onChange={(e) => setBillFilterCategory(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="all">Semua Tagihan</option>
                  <option value="unpaid">Belum Lunas / Tertunggak</option>
                  <option value="sebagian">Sedang Dicicil (Sebagian)</option>
                  <option value="paid">Sudah Lunas</option>
                  <option value="persiswa">Khusus Per-Siswa</option>
                  <option value="massal">Massal (Semua Siswa)</option>
                  <option value="spp">SPP Bulanan</option>
                  <option value="seragam">Uang Seragam</option>
                  <option value="praktikum">Praktikum Lab</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedStudentForBill(null);
                  setBillTargetType('all');
                  setIsCreateBillModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan Tagihan Baru</span>
              </button>
            </div>

            {/* Table of Bills */}
            <div
              className={`rounded-2xl border overflow-hidden transition-all ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b font-extrabold uppercase text-[10px] tracking-wider ${
                        darkMode ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-150 text-slate-500 bg-slate-50'
                      }`}
                    >
                      <th className="p-3.5">Kode & Tagihan</th>
                      <th className="p-3.5">Target Penerima</th>
                      <th className="p-3.5">Kategori & Tempo</th>
                      <th className="p-3.5">Nominal & Pelunasan</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Aksi Kasir & TU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredBills.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Tidak ada tagihan yang sesuai dengan pencarian atau filter.
                        </td>
                      </tr>
                    ) : (
                      filteredBills.map((bill) => {
                        const isPaid = bill.status === 'lunas';
                        const isPartial = bill.status === 'sebagian';
                        const paidAmount = bill.paidAmount ?? (isPaid ? bill.amount : 0);
                        const remaining = bill.remainingAmount ?? (isPaid ? 0 : bill.amount - paidAmount);
                        const paidPercent = Math.min(100, Math.round((paidAmount / bill.amount) * 100));
                        const hasHistory = bill.paymentHistory && bill.paymentHistory.length > 0;

                        return (
                          <tr
                            key={bill.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                              isPaid ? 'opacity-85' : ''
                            }`}
                          >
                            {/* 1. Judul & Kode */}
                            <td className="p-3.5 max-w-[200px]">
                              <span className="font-extrabold text-slate-900 dark:text-white block leading-snug">
                                {bill.title}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{bill.code}</span>
                            </td>

                            {/* 2. Target Siswa */}
                            <td className="p-3.5">
                              {bill.targetType === 'student' ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60">
                                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-black text-[9px] flex items-center justify-center shrink-0">
                                    {(bill.studentName || 'S').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="text-[11px] leading-tight">
                                    <span className="font-extrabold text-purple-900 dark:text-purple-200 block truncate max-w-[130px]">
                                      {bill.studentName || 'Siswa'}
                                    </span>
                                    <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold block">
                                      {bill.studentGrade || ''} {bill.studentNisn ? `• ${bill.studentNisn}` : ''}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  <span>Semua Siswa</span>
                                </span>
                              )}
                            </td>

                            {/* 3. Kategori & Jatuh Tempo */}
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[9px] block w-fit">
                                {bill.category}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{bill.dueDate}</span>
                              </span>
                            </td>

                            {/* 4. Nominal, Terbayar & Sisa Tagihan */}
                            <td className="p-3.5 min-w-[160px]">
                              <div className="flex items-baseline justify-between text-xs">
                                <span className="font-black text-slate-900 dark:text-white">
                                  {formatRupiah(bill.amount)}
                                </span>
                                {isPaid ? (
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400">{paidPercent}%</span>
                                )}
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    isPaid
                                      ? 'bg-emerald-500'
                                      : isPartial
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${paidPercent}%` }}
                                />
                              </div>

                              {/* Remaining detail */}
                              <div className="flex items-center justify-between mt-1 text-[10px]">
                                {isPaid ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Lunas Terbayar</span>
                                ) : (
                                  <>
                                    <span className="text-slate-400">Sisa:</span>
                                    <span className="font-extrabold text-rose-600 dark:text-rose-400">
                                      {formatRupiah(remaining)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* 5. Status Badge */}
                            <td className="p-3.5">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                  <Check className="w-3 h-3" /> Lunas
                                </span>
                              ) : isPartial ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                  <Clock className="w-3 h-3" /> Dicicil
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                                  <AlertCircle className="w-3 h-3" /> Belum Bayar
                                </span>
                              )}
                            </td>

                            {/* 6. Aksi Kasir & Keuangan */}
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isPaid && (
                                  <button
                                    onClick={() => handleOpenRecordPayment(bill)}
                                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all"
                                    title="Catat pembayaran tunai/transfer (bisa cicilan bertahap, sisa otomatis berkurang)"
                                  >
                                    <CreditCard className="w-3 h-3" />
                                    <span>Catat Bayar</span>
                                  </button>
                                )}

                                {hasHistory && (
                                  <button
                                    onClick={() => setViewingHistoryBill(bill)}
                                    className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1"
                                    title="Lihat riwayat cicilan & cetak kuitansi resmi"
                                  >
                                    <History className="w-3 h-3 text-indigo-500" />
                                    <span>Riwayat ({bill.paymentHistory?.length})</span>
                                  </button>
                                )}

                                {isPaid ? (
                                  <button
                                    onClick={() => onUpdateBillStatus(bill.id, 'belum_bayar')}
                                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[10px] font-bold text-rose-600 transition-all"
                                    title="Ubah kembali status menjadi belum bayar"
                                  >
                                    Batalkan
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onUpdateBillStatus(bill.id, 'lunas')}
                                    className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px] transition-all"
                                    title="Tandai langsung lunas penuh"
                                  >
                                    Lunasi
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRESENSI & VERIFIKASI IZIN SISWA */}
        {activeTab === 'presensi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Hadir Hari Ini</span>
                <h4 className="text-xl font-black text-emerald-600 mt-1">812 Siswa (96.4%)</h4>
                <p className="text-xs text-slate-500 mt-1">Via QR Presensi & Tap RFID</p>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400">Izin & Sakit Terdaftar</span>
                <h4 className="text-xl font-black text-amber-600 mt-1">26 Siswa (3.1%)</h4>
                <p className="text-xs text-slate-500 mt-1">14 Sakit, 12 Izin Resmi</p>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400">Tanpa Keterangan (Alfa)</span>
                <h4 className="text-xl font-black text-rose-600 mt-1">4 Siswa (0.5%)</h4>
                <p className="text-xs text-slate-500 mt-1">Notifikasi SMS otomatis ke wali murid</p>
              </div>
            </div>

            {/* Leave Requests Table */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm">Permohonan Izin / Sakit Masuk</h3>
                  <p className="text-xs text-slate-500">Verifikasi pengajuan dispensasi dan surat dokter siswa</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {leaveRequests.length} Pengajuan
                </span>
              </div>

              <div className="space-y-2.5">
                {leaveRequests.map((leave) => {
                  const isPending = leave.status === 'menunggu';
                  const isApproved = leave.status === 'disetujui';

                  return (
                    <div
                      key={leave.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-150 bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {leave.studentName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {leave.grade}
                          </span>
                          <span className="text-[10px] uppercase font-extrabold text-slate-400">
                            • {leave.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{leave.reason}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span>{leave.date}</span>
                          {leave.attachmentName && (
                            <span className="text-blue-500 font-semibold flex items-center gap-1 cursor-pointer">
                              <FileText className="w-3 h-3" /> {leave.attachmentName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => onUpdateLeaveStatus(leave.id, 'disetujui')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => onUpdateLeaveStatus(leave.id, 'ditolak')}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </>
                        ) : isApproved ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Ditolak
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BROADCAST PENGUMUMAN */}
        {activeTab === 'broadcast' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div
              className={`p-6 rounded-[24px] border shadow-xs ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Kirim Broadcast Notifikasi Siswa</h3>
                  <p className="text-xs text-slate-500">
                    Pesan akan langsung terkirim ke panel notifikasi di seluruh akun siswa
                  </p>
                </div>
              </div>

              {broadcastSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pengumuman berhasil disiarkan ke seluruh portal siswa!</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Gladi Bersih Ujian CBT Semester Ganjil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Siaran
                  </label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                  >
                    <option value="academic">Akademik & Pembelajaran</option>
                    <option value="finance">Keuangan & Administrasi</option>
                    <option value="system">Pengumuman Resmi Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Isi Pesan Siaran
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Tuliskan isi pengumuman lengkap di sini..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Siarkan Pengumuman Sekarang</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: DIREKTORI SISWA */}
        {activeTab === 'siswa' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                {/* Search */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border max-w-xs flex-1 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Cari nama, NISN, kelas..."
                    className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Filter Kelas */}
                <select
                  value={studentFilterClass}
                  onChange={(e) => setStudentFilterClass(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="all">Semua Rombel Kelas</option>
                  {schoolClasses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.gradeLevel})
                    </option>
                  ))}
                </select>

                {/* Filter Jurusan */}
                <select
                  value={studentFilterMajor}
                  onChange={(e) => setStudentFilterMajor(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="all">Semua Jurusan</option>
                  {schoolMajors.map((m) => (
                    <option key={m.id} value={m.code}>
                      {m.code} - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setExportScope(filteredStudents.length < studentsDirectory.length ? 'filtered' : 'all');
                    setIsExportModalOpen(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-98 ${
                    darkMode
                      ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title="Ekspor dan backup data siswa ke format spreadsheet CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Ekspor CSV</span>
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    {filteredStudents.length < studentsDirectory.length
                      ? `${filteredStudents.length}/${studentsDirectory.length}`
                      : studentsDirectory.length}
                  </span>
                </button>

                <button
                  onClick={() => setIsManageClassesModalOpen(true)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                    darkMode
                      ? 'border-indigo-800 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60'
                      : 'border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100'
                  }`}
                  title="Kelola data rombel kelas dan jurusan sekolah"
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Kelola Kelas & Jurusan</span>
                </button>

                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 active:scale-98 transition-all shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Tambah Siswa Baru</span>
                </button>
              </div>
            </div>

            {/* Banner Notifikasi Sukses Ekspor CSV */}
            {exportToastMessage && (
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
                  <div>
                    <p className="text-xs font-bold">{exportToastMessage}</p>
                    <p className="text-[11px] text-emerald-100 mt-0.5">
                      File CSV telah diunduh ke komputer Anda dan siap dibuka di Microsoft Excel, Google Sheets, atau disimpan sebagai backup lokal.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExportToastMessage(null)}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div
              className={`rounded-2xl border overflow-hidden ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b font-extrabold uppercase text-[10px] tracking-wider ${
                        darkMode ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-150 text-slate-500 bg-slate-50'
                      }`}
                    >
                      <th className="p-3.5">Nama & NISN</th>
                      <th className="p-3.5">Kelas</th>
                      <th className="p-3.5">Kehadiran</th>
                      <th className="p-3.5">Nilai Rata-rata</th>
                      <th className="p-3.5">Status Administrasi</th>
                      <th className="p-3.5">Saldo Tabungan</th>
                      <th className="p-3.5 text-right">Aksi & Kasir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudentModal(std)}
                            className="text-left group/stdname focus:outline-hidden"
                            title="Klik untuk melihat detail & mengedit data siswa"
                          >
                            <span className="font-extrabold text-slate-900 dark:text-white block group-hover/stdname:text-blue-600 dark:group-hover/stdname:text-blue-400 transition-colors">
                              {std.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 group-hover/stdname:text-blue-500">
                              {std.nisn}
                            </span>
                          </button>
                        </td>
                        <td className="p-3.5 font-bold">{std.grade} {std.major}</td>
                        <td className="p-3.5 font-bold text-emerald-600">{std.attendancePercent}%</td>
                        <td className="p-3.5 font-extrabold text-blue-600">{std.averageScore}</td>
                        <td className="p-3.5">
                          {std.sppStatus === 'lunas' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                              Lunas
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                              Tertunggak
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {formatRupiah(std.savingsBalance)}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditStudentModal(std)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800 transition-all inline-flex items-center gap-1 active:scale-95 shadow-2xs"
                              title={`Edit data siswa ${std.name} (NISN, kelas, jurusan, saldo)`}
                            >
                              <Edit3 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span>Edit Siswa</span>
                            </button>
                            <button
                              onClick={() => handleCreateBillForStudent(std)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-extrabold text-[11px] border border-blue-200 dark:border-blue-800 transition-all inline-flex items-center gap-1 active:scale-95 shadow-2xs"
                              title={`Terbitkan tagihan baru khusus untuk ${std.name}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Buat Tagihan</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Summary & Direct CSV Backup Link */}
              <div
                className={`p-3.5 border-t text-xs flex flex-wrap items-center justify-between gap-2.5 ${
                  darkMode
                    ? 'border-slate-800 bg-slate-950/40 text-slate-400'
                    : 'border-slate-100 bg-slate-50/60 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    Menampilkan <strong className="text-slate-700 dark:text-slate-200">{filteredStudents.length}</strong> dari{' '}
                    <strong className="text-slate-700 dark:text-slate-200">{studentsDirectory.length}</strong> siswa terdaftar
                  </span>
                  {filteredStudents.length < studentsDirectory.length && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/30">
                      Filter Aktif
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {filteredStudents.length < studentsDirectory.length && (
                    <button
                      type="button"
                      onClick={() => handleExportCsv('filtered')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      title="Unduh hasil filter siswa saat ini"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ekspor Filter ({filteredStudents.length})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleExportCsv('all')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    title="Langsung unduh seluruh direktori siswa"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup Semua Siswa ({studentsDirectory.length})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 1. MODAL TERBITKAN TAGIHAN BARU (BISA MASSAL ATAU KHUSUS PER-SISWA) */}
      {isCreateBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] border shadow-2xl p-5 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Terbitkan Tagihan Administrasi</h3>
                  <span className="text-[10px] text-slate-400">Pilih target: Semua siswa atau perorangan per-siswa</span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateBillModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBillSubmit} className="space-y-4">
              {/* TARGET TYPE SELECTOR (SEMUA SISWA vs PER-SISWA) */}
              <div>
                <label className="text-xs font-bold block mb-1.5 text-slate-700 dark:text-slate-300">
                  Target Penerima Tagihan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBillTargetType('all');
                      setSelectedStudentForBill(null);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      billTargetType === 'all'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                    <div>
                      <span className="text-xs font-extrabold block">Semua Siswa</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Berlaku massal ke seluruh portal siswa
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBillTargetType('student');
                      if (!selectedStudentForBill && studentsDirectory.length > 0) {
                        setSelectedStudentForBill(studentsDirectory[0]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      billTargetType === 'student'
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
                    <div>
                      <span className="text-xs font-extrabold block">Siswa Tertentu</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-300 font-semibold block mt-0.5">
                        Tagihan khusus perorangan
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* JIKA MEMILIH SISWA TERTENTU: DROPDOWN & SEARCH SISWA */}
              {billTargetType === 'student' && (
                <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                      Pilih Siswa Penerima:
                    </span>
                    {selectedStudentForBill && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-200/70 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold">
                        Terpilih: {selectedStudentForBill.name}
                      </span>
                    )}
                  </div>

                  {/* Student Search in Modal */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={studentSearchInModal}
                      onChange={(e) => setStudentSearchInModal(e.target.value)}
                      placeholder="Ketik nama atau NISN siswa untuk mencari..."
                      className="w-full bg-transparent outline-none font-semibold"
                    />
                  </div>

                  {/* Student List Grid */}
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {studentsDirectory
                      .filter((s) => {
                        if (!studentSearchInModal.trim()) return true;
                        const q = studentSearchInModal.toLowerCase();
                        return s.name.toLowerCase().includes(q) || s.nisn.includes(q) || s.grade.toLowerCase().includes(q);
                      })
                      .map((std) => {
                        const isSelected = selectedStudentForBill?.id === std.id;
                        return (
                          <div
                            key={std.id}
                            onClick={() => setSelectedStudentForBill(std)}
                            className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                : darkMode
                                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {std.name.charAt(0)}
                              </div>
                              <div className="leading-tight">
                                <span className="font-extrabold text-xs block">{std.name}</span>
                                <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                                  {std.grade} {std.major} • NISN: {std.nisn}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* JUDUL TAGIHAN */}
              <div>
                <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Judul Tagihan
                </label>
                <input
                  type="text"
                  required
                  value={newBillTitle}
                  onChange={(e) => setNewBillTitle(e.target.value)}
                  placeholder="Contoh: SPP Bulan November 2026 atau Biaya Modul Praktikum"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-600"
                />
              </div>

              {/* KATEGORI & NOMINAL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                    Kategori Tagihan
                  </label>
                  <select
                    value={newBillCategory}
                    onChange={(e) => setNewBillCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                  >
                    <option value="spp">SPP Bulanan</option>
                    <option value="seragam">Seragam Sekolah</option>
                    <option value="praktikum">Praktikum Lab & Lisensi</option>
                    <option value="gedung">Uang Gedung / Sarana</option>
                    <option value="kegiatan">Kegiatan & Lomba</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                    Nominal Tagihan (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    step="5000"
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Quick Nominal Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold">Preset Cepat:</span>
                {[50000, 100000, 150000, 250000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNewBillAmount(amt.toString())}
                    className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>

              {/* JATUH TEMPO */}
              <div>
                <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Batas Jatuh Tempo
                </label>
                <input
                  type="text"
                  value={newBillDueDate}
                  onChange={(e) => setNewBillDueDate(e.target.value)}
                  placeholder="Contoh: 15 Nov 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                />
              </div>

              {/* FITUR CICILAN & PENGURANGAN OTOMATIS */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="chk_allow_installment"
                  checked={allowInstallment}
                  onChange={(e) => setAllowInstallment(e.target.checked)}
                  className="mt-0.5 accent-blue-600"
                />
                <label htmlFor="chk_allow_installment" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-blue-900 dark:text-blue-200 block">
                    Izinkan Pembayaran Bertahap / Dicicil
                  </span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-300/80 block mt-0.5">
                    Siswa dapat menyetor sebagian nominal. Sisa tagihan akan otomatis berkurang secara real-time dan tercatat di riwayat kuitansi.
                  </span>
                </label>
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Deskripsi / Keterangan Tagihan
                </label>
                <textarea
                  rows={2}
                  value={newBillDesc}
                  onChange={(e) => setNewBillDesc(e.target.value)}
                  placeholder="Penjelasan rincian peruntukan tagihan..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={billTargetType === 'student' && !selectedStudentForBill}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>
                  {billTargetType === 'student'
                    ? `Terbitkan Tagihan Khusus (${selectedStudentForBill?.name || 'Siswa'})`
                    : 'Publikasikan Tagihan ke Seluruh Siswa'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL CATAT PEMBAYARAN / CICILAN TAGIHAN (KASIR TU / BENDAHARA) */}
      {payingBillForAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-[28px] overflow-hidden border shadow-2xl p-5 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Catat Setoran Tagihan Siswa</h3>
                  <span className="text-[10px] text-slate-400">Kasir Loket Tata Usaha & Keuangan</span>
                </div>
              </div>
              <button
                onClick={() => setPayingBillForAdmin(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdminPayment} className="space-y-4">
              {/* Info Tagihan */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tagihan</span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {payingBillForAdmin.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">{payingBillForAdmin.code}</span>
                  </div>
                  {payingBillForAdmin.targetType === 'student' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      👤 {payingBillForAdmin.studentName}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {formatRupiah(payingBillForAdmin.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sudah Masuk</span>
                    <span className="font-black text-emerald-600">
                      {formatRupiah(payingBillForAdmin.paidAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sisa Tagihan</span>
                    <span className="font-black text-rose-600">
                      {formatRupiah(
                        payingBillForAdmin.remainingAmount ??
                          (payingBillForAdmin.status === 'lunas' ? 0 : payingBillForAdmin.amount)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Nominal Pembayaran */}
              <div>
                <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Nominal Pembayaran Diterima (Rp)
                </label>
                <input
                  type="number"
                  required
                  step="5000"
                  max={
                    payingBillForAdmin.remainingAmount ??
                    (payingBillForAdmin.status === 'lunas' ? 0 : payingBillForAdmin.amount)
                  }
                  value={adminPayAmount}
                  onChange={(e) => setAdminPayAmount(e.target.value)}
                  placeholder="Masukkan nominal setoran..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-black outline-none focus:border-emerald-600"
                />

                {/* Quick Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold">Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setAdminPayAmount('50000')}
                    className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold"
                  >
                    Rp 50.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const rem =
                        payingBillForAdmin.remainingAmount ??
                        (payingBillForAdmin.status === 'lunas' ? 0 : payingBillForAdmin.amount);
                      setAdminPayAmount(Math.round(rem / 2).toString());
                    }}
                    className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold"
                  >
                    50% Sisa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const rem =
                        payingBillForAdmin.remainingAmount ??
                        (payingBillForAdmin.status === 'lunas' ? 0 : payingBillForAdmin.amount);
                      setAdminPayAmount(rem.toString());
                    }}
                    className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[10px]"
                  >
                    Lunasi Seluruhnya
                  </button>
                </div>
              </div>

              {/* Sisa setelah pembayaran preview */}
              {adminPayAmount && Number(adminPayAmount) > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs flex items-center justify-between">
                  <span className="text-amber-800 dark:text-amber-300 font-bold">
                    Sisa Tagihan Otomatis Setelah Setoran:
                  </span>
                  <span className="font-black text-rose-600 dark:text-rose-400">
                    {formatRupiah(
                      Math.max(
                        0,
                        (payingBillForAdmin.remainingAmount ??
                          (payingBillForAdmin.status === 'lunas' ? 0 : payingBillForAdmin.amount)) -
                          Number(adminPayAmount)
                      )
                    )}
                  </span>
                </div>
              )}

              {/* Metode Pembayaran */}
              <div>
                <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Metode Penyetoran
                </label>
                <select
                  value={adminPaymentMethod}
                  onChange={(e) => setAdminPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                >
                  <option value="Kasir Loket Tata Usaha (Tunai)">Kasir Loket Tata Usaha (Tunai Fisik)</option>
                  <option value="Transfer Virtual Account BNI">Transfer Virtual Account BNI</option>
                  <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                  <option value="Saldo Tabungan Siswa">Potong Saldo Tabungan Siswa</option>
                </select>
              </div>

              {/* Catatan / Keterangan */}
              <div>
                <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Catatan Kuitansi (Opsional)
                </label>
                <input
                  type="text"
                  value={adminPaymentNote}
                  onChange={(e) => setAdminPaymentNote(e.target.value)}
                  placeholder="Contoh: Cicilan tahap 1 atau Pelunasan SPP"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isRecordingPayment || !adminPayAmount || Number(adminPayAmount) <= 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isRecordingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi & Kurangi Tagihan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL RIWAYAT CICILAN & KUITANSI ELEKTRONIK */}
      {viewingHistoryBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[28px] border shadow-2xl p-5 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Riwayat Pembayaran & Cicilan</h3>
                  <span className="text-[10px] text-slate-400">{viewingHistoryBill.title}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingHistoryBill(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bill Summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Tagihan</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {formatRupiah(viewingHistoryBill.amount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Masuk</span>
                <span className="font-black text-emerald-600">
                  {formatRupiah(viewingHistoryBill.paidAmount || (viewingHistoryBill.status === 'lunas' ? viewingHistoryBill.amount : 0))}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Sisa Belum Lunas</span>
                <span className="font-black text-rose-600">
                  {formatRupiah(viewingHistoryBill.remainingAmount ?? (viewingHistoryBill.status === 'lunas' ? 0 : viewingHistoryBill.amount))}
                </span>
              </div>
            </div>

            {/* List of payments */}
            <div className="space-y-2.5">
              {!viewingHistoryBill.paymentHistory || viewingHistoryBill.paymentHistory.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Belum ada riwayat transaksi pembayaran untuk tagihan ini.
                </div>
              ) : (
                viewingHistoryBill.paymentHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[10px] flex items-center justify-center">
                          #{viewingHistoryBill.paymentHistory!.length - idx}
                        </span>
                        <div>
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                            {item.receiptNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-emerald-600 text-sm block">
                          +{formatRupiah(item.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Sisa: {formatRupiah(item.remainingAfter)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Metode: {item.paymentMethod}</span>
                      {item.note && (
                        <span className="italic text-slate-400 max-w-[200px] truncate">{item.note}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH DATA SISWA BARU */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Tambah Data Siswa Baru</h3>
                  <p className="text-[11px] text-slate-400">
                    Daftarkan siswa baru ke direktori akademik & penagihan sekolah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Nama Lengkap */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-600"
                />
              </div>

              {/* NISN & Kelas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    NISN (Nomor Induk Siswa) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentNisn}
                    onChange={(e) => setNewStudentNisn(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 0078192345"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none focus:border-blue-600"
                  />
                </div>

                {/* Kelas & Jurusan Selection */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Pilihan Rombel Kelas */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Rombel Kelas <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newStudentSelectedClass}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewStudentSelectedClass(val);
                          const matched = schoolClasses.find((c) => c.name === val);
                          if (matched) {
                            setNewStudentSelectedMajor(matched.major);
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:border-blue-600"
                      >
                        {schoolClasses.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.gradeLevel} • {c.major})
                          </option>
                        ))}
                        <option value="custom">+ Ketik Rombel Kelas Baru...</option>
                      </select>
                    </div>

                    {/* Pilihan Jurusan */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Jurusan / Peminatan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newStudentSelectedMajor}
                        onChange={(e) => setNewStudentSelectedMajor(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:border-blue-600"
                      >
                        {schoolMajors.map((m) => (
                          <option key={m.id} value={m.code}>
                            {m.code} - {m.name}
                          </option>
                        ))}
                        <option value="custom">+ Ketik Jurusan Baru...</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom inputs if chosen custom */}
                  {(newStudentSelectedClass === 'custom' || newStudentSelectedMajor === 'custom') && (
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in">
                      {newStudentSelectedClass === 'custom' && (
                        <div>
                          <label className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                            Ketik Nama Rombel Baru:
                          </label>
                          <input
                            type="text"
                            required
                            value={newStudentCustomClass}
                            onChange={(e) => setNewStudentCustomClass(e.target.value)}
                            placeholder="Contoh: X TBSM 1 / XI TKRO"
                            className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
                          />
                        </div>
                      )}

                      {newStudentSelectedMajor === 'custom' && (
                        <div>
                          <label className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                            Ketik Kode Jurusan Baru:
                          </label>
                          <input
                            type="text"
                            required
                            value={newStudentCustomMajor}
                            onChange={(e) => setNewStudentCustomMajor(e.target.value.toUpperCase())}
                            placeholder="Contoh: TBSM / TKRO / AKL"
                            className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email & Kontak WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Siswa (Opsional)
                  </label>
                  <input
                    type="email"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="nama@siswa.sch.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp / HP Wali
                  </label>
                  <input
                    type="tel"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Saldo Tabungan Awal */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Saldo Awal Tabungan Siswa
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="text"
                    value={newStudentSavings}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, '');
                      setNewStudentSavings(num ? Number(num).toLocaleString('id-ID') : '');
                    }}
                    placeholder="100.000"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:border-blue-600"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Saldo ini dapat dipakai siswa untuk membayar administrasi atau jajan di kantin digital.
                </p>
              </div>

              {/* Preview Ringkasan Siswa */}
              {newStudentName.trim() && (
                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                    {newStudentName.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      {newStudentName}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-300 font-semibold">
                      Kelas: {newStudentSelectedClass === 'custom' ? newStudentCustomClass || 'Kelas Baru' : newStudentSelectedClass} • Jurusan: {newStudentSelectedMajor === 'custom' ? newStudentCustomMajor || 'Jurusan Baru' : newStudentSelectedMajor} • NISN: {newStudentNisn || '-'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newStudentName.trim() || !newStudentNisn.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Daftarkan Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KELOLA KELAS & JURUSAN SEKOLAH */}
      {isManageClassesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Kelola Data Rombel Kelas & Jurusan</h3>
                  <p className="text-[11px] text-slate-400">
                    Konfigurasi tingkatan kelas, rombongan belajar dan kompetensi keahlian / jurusan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManageClassesModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Switch Tabs */}
            <div className="px-5 pt-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setManageClassTab('kelas')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  manageClassTab === 'kelas'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Rombel Kelas ({schoolClasses.length})</span>
              </button>
              <button
                onClick={() => setManageClassTab('jurusan')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  manageClassTab === 'jurusan'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Jurusan / Kompetensi Keahlian ({schoolMajors.length})</span>
              </button>
            </div>

            <div className="p-5 max-h-[72vh] overflow-y-auto space-y-5">
              {/* TAB 1: KELOLA ROMBEL KELAS */}
              {manageClassTab === 'kelas' && (
                <div className="space-y-4">
                  {/* Form Tambah Kelas Baru */}
                  <form onSubmit={handleCreateClassSubmit} className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                    <span className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      Tambah Rombongan Belajar (Kelas Baru)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Nama Rombel Kelas <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="Misal: X TBSM 1, XI TKRO 2"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Tingkat Kelas
                        </label>
                        <select
                          value={newClassGradeLevel}
                          onChange={(e) => setNewClassGradeLevel(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
                        >
                          <option value="X">Kelas X (Sepuluh)</option>
                          <option value="XI">Kelas XI (Sebelas)</option>
                          <option value="XII">Kelas XII (Dua Belas)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Jurusan Terkait
                        </label>
                        <select
                          value={newClassMajor}
                          onChange={(e) => setNewClassMajor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
                        >
                          {schoolMajors.map((m) => (
                            <option key={m.id} value={m.code}>
                              {m.code} - {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Wali Kelas (Opsional)
                        </label>
                        <input
                          type="text"
                          value={newClassWali}
                          onChange={(e) => setNewClassWali(e.target.value)}
                          placeholder="Nama Guru Wali Kelas"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Ruang / Bengkel / Lab (Opsional)
                        </label>
                        <input
                          type="text"
                          value={newClassRoom}
                          onChange={(e) => setNewClassRoom(e.target.value)}
                          placeholder="Misal: Bengkel Otomotif 01 / Lab Komputer"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={!newClassName.trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-98 transition-all disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Simpan Rombel Kelas</span>
                      </button>
                    </div>
                  </form>

                  {/* Daftar Tabel Kelas yang Terdaftar */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
                      <span>Daftar Rombel Kelas Terdaftar ({schoolClasses.length})</span>
                      <span className="text-[11px] text-slate-400">Total rombel aktif</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {schoolClasses.map((cls) => {
                        const studentCount = studentsDirectory.filter((s) => s.grade === cls.name).length;
                        return (
                          <div
                            key={cls.id}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center shrink-0">
                                {cls.gradeLevel}
                              </span>
                              <div>
                                <span className="font-extrabold text-slate-900 dark:text-white block">
                                  {cls.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Jurusan: {cls.major} {cls.waliKelas ? `• Wali: ${cls.waliKelas}` : ''} {cls.room ? `• ${cls.room}` : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {studentCount} siswa
                              </span>
                              {onDeleteSchoolClass && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteSchoolClass(cls.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                  title="Hapus kelas ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KELOLA JURUSAN / KOMPETENSI KEAHLIAN */}
              {manageClassTab === 'jurusan' && (
                <div className="space-y-4">
                  {/* Form Tambah Jurusan Baru */}
                  <form onSubmit={handleCreateMajorSubmit} className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-3">
                    <span className="text-xs font-extrabold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-purple-600" />
                      Tambah Program / Jurusan Baru
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Kode Jurusan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newMajorCode}
                          onChange={(e) => setNewMajorCode(e.target.value.toUpperCase())}
                          placeholder="Misal: TBSM / TKRO / AKL"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none focus:border-purple-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Nama Lengkap Kompetensi Keahlian <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newMajorName}
                          onChange={(e) => setNewMajorName(e.target.value)}
                          placeholder="Contoh: Teknik Bisnis Sepeda Motor"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Deskripsi / Keterangan Keahlian (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newMajorDesc}
                        onChange={(e) => setNewMajorDesc(e.target.value)}
                        placeholder="Uraian singkat fokus pembelajaran atau sertifikasi kompetensi..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={!newMajorCode.trim() || !newMajorName.trim()}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 active:scale-98 transition-all disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Simpan Jurusan Baru</span>
                      </button>
                    </div>
                  </form>

                  {/* Grid Jurusan Terdaftar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {schoolMajors.map((mjr) => {
                      const studentCount = studentsDirectory.filter((s) => s.major === mjr.code).length;
                      return (
                        <div
                          key={mjr.id}
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 space-y-2 relative group hover:border-purple-300 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md font-mono text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                {mjr.code}
                              </span>
                              <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {mjr.name}
                              </span>
                            </div>
                            {onDeleteSchoolMajor && (
                              <button
                                type="button"
                                onClick={() => onDeleteSchoolMajor(mjr.id)}
                                className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Hapus jurusan ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {mjr.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                              {mjr.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                            <span>Siswa terdaftar:</span>
                            <span className="font-extrabold text-purple-600 dark:text-purple-400">
                              {studentCount} siswa
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL & EDIT DATA SISWA SPESIFIK */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div
            className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-transparent flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg">Edit Data Spesifik Siswa</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/30">
                      ID: {editingStudent.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Perbarui profil spesifik, NISN, kelas rombel, jurusan, serta saldo tabungan kas siswa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Profile Summary Badge Card */}
            <div className="px-6 pt-5 pb-1">
              <div
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
                  darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {editingStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {editingStudent.name}
                      {editingStudent.sppStatus === 'lunas' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Lunas
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700">
                          Tertunggak
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      NISN:{' '}
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {editingStudent.nisn}
                      </span>{' '}
                      • Rombel: <span className="font-bold text-blue-600">{editingStudent.grade}</span> (
                      {editingStudent.major})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Saldo Tabungan Terdaftar
                  </span>
                  <span className="font-black text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(editingStudent.savingsBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message Banner */}
            {editStudentSuccessMessage && (
              <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5 border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Perubahan data siswa berhasil disimpan ke direktori dan disinkronkan secara realtime!</span>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSaveEditStudent} className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
              {/* Row 1: Nama & NISN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Nama Lengkap Siswa *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editStudentName}
                    onChange={(e) => setEditStudentName(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky Ramadhan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    <span>NISN (Nomor Induk Siswa Nasional) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editStudentNisn}
                    onChange={(e) => setEditStudentNisn(e.target.value)}
                    placeholder="Contoh: 0081234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Row 2: Kelas & Jurusan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>Rombongan Belajar (Kelas) *</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Pilih / ketik</span>
                  </label>
                  <div className="space-y-2">
                    <select
                      value={schoolClasses.some((c) => c.name === editStudentGrade) ? editStudentGrade : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setEditStudentGrade(e.target.value);
                          const matchingClass = schoolClasses.find((c) => c.name === e.target.value);
                          if (matchingClass && matchingClass.major) {
                            setEditStudentMajor(matchingClass.major);
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-blue-500"
                    >
                      {schoolClasses.map((cls) => (
                        <option key={cls.id} value={cls.name}>
                          {cls.name} (Tingkat {cls.gradeLevel} - {cls.major})
                        </option>
                      ))}
                      <option value="custom">✏️ Masukkan Rombel Kustom...</option>
                    </select>

                    <input
                      type="text"
                      value={editStudentGrade}
                      onChange={(e) => setEditStudentGrade(e.target.value)}
                      placeholder="Atau ketik nama kelas langsung: misal XI TKJ 1, XII RPL 2"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      <span>Program / Jurusan Keahlian *</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Peminatan</span>
                  </label>
                  <div className="space-y-2">
                    <select
                      value={schoolMajors.some((m) => m.code === editStudentMajor) ? editStudentMajor : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setEditStudentMajor(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-purple-500"
                    >
                      {schoolMajors.map((mjr) => (
                        <option key={mjr.id} value={mjr.code}>
                          {mjr.code} - {mjr.name}
                        </option>
                      ))}
                      <option value="custom">✏️ Masukkan Jurusan Kustom...</option>
                    </select>

                    <input
                      type="text"
                      value={editStudentMajor}
                      onChange={(e) => setEditStudentMajor(e.target.value)}
                      placeholder="Atau ketik jurusan langsung: misal TKJ, TBSM, RPL, AKL, IPA"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Saldo Tabungan Siswa (Crucial Field requested!) */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-emerald-50/50 border-emerald-200/70'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Saldo Tabungan Siswa (Rp) *</span>
                  </label>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg">
                    {formatRupiah(Number(editStudentSavings.replace(/\D/g, '')) || 0)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-xs text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={editStudentSavings}
                    onChange={(e) => setEditStudentSavings(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quick Increment Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mr-1">
                    Penyesuaian cepat:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustEditSavings(20000)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all"
                  >
                    +20 rb
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustEditSavings(50000)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all"
                  >
                    +50 rb
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustEditSavings(100000)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all"
                  >
                    +100 rb
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustEditSavings(250000)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all"
                  >
                    +250 rb
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStudentSavings('0')}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
                  >
                    Reset (Rp 0)
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Saldo tabungan ini tersimpan di akun siswa untuk e-kantin, pelunasan administrasi instan, atau ditarik di kasir TU.
                </p>
              </div>

              {/* Row 4: Status SPP, Kehadiran, & Nilai Rata-rata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                    Status SPP
                  </label>
                  <select
                    value={editStudentSppStatus}
                    onChange={(e) => setEditStudentSppStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                      editStudentSppStatus === 'lunas'
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-rose-300 bg-rose-50/50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}
                  >
                    <option value="lunas">✅ Lunas</option>
                    <option value="tertunggak">⏳ Tertunggak</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                    Kehadiran (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editStudentAttendance}
                    onChange={(e) => setEditStudentAttendance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                    Nilai Rata-rata
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editStudentAvgScore}
                    onChange={(e) => setEditStudentAvgScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!editStudentName.trim() || !editStudentNisn.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5 active:scale-98 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Data Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EKSPOR & BACKUP DATA SISWA (CSV) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div
            className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg">Ekspor Direktori Siswa (.CSV)</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/30">
                      Format Excel & Sheets
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Backup seluruh data akademis, NISN, status SPP, dan saldo tabungan siswa untuk arsip lokal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Opsi Cakupan Ekspor */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-2">
                  Pilih Data yang Akan Diekspor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Opsi 1: Semua Siswa */}
                  <div
                    onClick={() => setExportScope('all')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      exportScope === 'all'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportScope"
                      checked={exportScope === 'all'}
                      onChange={() => setExportScope('all')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold">Semua Siswa Terdaftar</span>
                        <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-800">
                          {studentsDirectory.length} siswa
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Mencakup seluruh database direktori siswa di semua rombel dan jurusan
                      </p>
                    </div>
                  </div>

                  {/* Opsi 2: Siswa Terfilter */}
                  <div
                    onClick={() => setExportScope('filtered')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      exportScope === 'filtered'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportScope"
                      checked={exportScope === 'filtered'}
                      onChange={() => setExportScope('filtered')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold">Hasil Filter Saat Ini</span>
                        <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-800">
                          {filteredStudents.length} siswa
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Sesuai filter rombel ({studentFilterClass}), jurusan ({studentFilterMajor})
                        {studentSearch.trim() ? ` & kata kunci "${studentSearch}"` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Summary Preview */}
              {(() => {
                const targetList = exportScope === 'filtered' ? filteredStudents : studentsDirectory;
                const totalSavings = targetList.reduce((acc, curr) => acc + curr.savingsBalance, 0);
                const lunasCount = targetList.filter((s) => s.sppStatus === 'lunas').length;
                const tertunggakCount = targetList.length - lunasCount;
                const avgScore = targetList.length > 0
                  ? (targetList.reduce((acc, curr) => acc + curr.averageScore, 0) / targetList.length).toFixed(1)
                  : '0';

                return (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Ringkasan Data yang Akan Diekspor:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {targetList.length} Baris Siswa
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Siswa</span>
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{targetList.length}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Tabungan</span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(totalSavings)}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-semibold">SPP Lunas/Tunggak</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                          {lunasCount} / {tertunggakCount}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-semibold">Rata-rata Nilai</span>
                        <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">{avgScore}</span>
                      </div>
                    </div>

                    {/* Preview Kolom Header */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Kolom CSV: </span>
                      No, ID Siswa, Nama Lengkap, NISN, Kelas, Jurusan, Kehadiran (%), Nilai Rata-rata, Status SPP, Saldo Tabungan (Rp), Keterangan Akademis.
                    </div>
                  </div>
                );
              })()}

              {/* Custom Filename Input (Optional) */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Nama File Hasil Ekspor (Opsional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exportCustomFilename}
                    onChange={(e) => setExportCustomFilename(e.target.value)}
                    placeholder={`backup_direktori_siswa_${new Date().toISOString().slice(0, 10)}.csv`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                  {exportCustomFilename && (
                    <button
                      type="button"
                      onClick={() => setExportCustomFilename('')}
                      className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  File disimpan dengan pengkodean UTF-8 (BOM) sehingga format NISN dan teks Indonesia tidak corrupt saat dibuka di Microsoft Excel.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleExportCsv(exportScope, exportCustomFilename)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File CSV Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
