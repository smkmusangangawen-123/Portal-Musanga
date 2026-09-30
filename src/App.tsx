import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { PortalDashboard } from './components/PortalDashboard';
import { LmsDashboard } from './components/LmsDashboard';
import { AdministrasiView } from './components/AdministrasiView';
import { JadwalView } from './components/JadwalView';
import { ProfilView } from './components/ProfilView';
import { QrModal } from './components/QrModal';
import { LiveClassModal } from './components/LiveClassModal';
import { AnalisisNilaiModal } from './components/AnalisisNilaiModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { CbtExamModal } from './components/CbtExamModal';
import { ChapterDetailModal } from './components/ChapterDetailModal';
import { NotificationModal } from './components/NotificationModal';
import { TabunganModal } from './components/TabunganModal';
import { SppModal } from './components/SppModal';
import { AllMenuModal } from './components/AllMenuModal';
import { IzinModal } from './components/IzinModal';
import { LibraryModal } from './components/LibraryModal';
import { LoginView } from './components/LoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { Toast } from './components/Toast';
import { playSound } from './utils/sound';

import {
  initialStudent,
  portalMenuItems,
  liveTeachingSession,
  chapterModulesList,
  notificationsList,
  initialAdministrasiBills,
  defaultAdminUser,
  defaultStudentUser,
  initialLeaveRequests,
  initialStudentDirectory,
  initialSchoolUsers,
  initialAuditLogs,
  initialSchoolClasses,
  initialSchoolMajors,
} from './data/mockData';
import {
  StudentProfile,
  ChapterModule,
  AdministrasiBill,
  BillPaymentHistory,
  AuthUser,
  AdminLeaveRequest,
  StudentListItem,
  SchoolUser,
  SchoolRole,
  AuditLogItem,
  AuditActionType,
  SchoolClass,
  SchoolMajor,
} from './types';
import { Smartphone, Monitor, ArrowLeft, ShieldCheck, UserCheck, LogOut } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Presentation frame mode for desktop reviewers (true = phone mockup frame, false = full width)
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');

  // Student state
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('eduportal_student');
    return saved ? JSON.parse(saved) : initialStudent;
  });

  // Modules state
  const [modules, setModules] = useState<ChapterModule[]>(() => {
    const saved = localStorage.getItem('eduportal_modules');
    return saved ? JSON.parse(saved) : chapterModulesList;
  });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('eduportal_notifications');
    return saved ? JSON.parse(saved) : notificationsList;
  });

  // E-Administrasi Bills state (SPP, seragam, praktikum, dll.)
  const [bills, setBills] = useState<AdministrasiBill[]>(() => {
    const saved = localStorage.getItem('eduportal_bills');
    return saved ? JSON.parse(saved) : initialAdministrasiBills;
  });

  // Authentication State: Current logged in user (Siswa or Admin)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('eduportal_current_user');
    return saved ? JSON.parse(saved) : defaultStudentUser;
  });

  // Admin Leave requests
  const [leaveRequests, setLeaveRequests] = useState<AdminLeaveRequest[]>(() => {
    const saved = localStorage.getItem('eduportal_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  // Student directory for Admin
  const [studentsDirectory, setStudentsDirectory] = useState<StudentListItem[]>(() => {
    const saved = localStorage.getItem('eduportal_students_directory');
    return saved ? JSON.parse(saved) : initialStudentDirectory;
  });

  // School Users Directory & RBAC (Guru, Karyawan, Siswa, Admin)
  const [schoolUsers, setSchoolUsers] = useState<SchoolUser[]>(() => {
    const saved = localStorage.getItem('eduportal_school_users');
    return saved ? JSON.parse(saved) : initialSchoolUsers;
  });

  // Audit Logs State (Audit trail for user creation, deletion, permission changes, bills, etc.)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('eduportal_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // School Classes & Majors state (Rombongan Belajar & Jurusan / Kompetensi Keahlian)
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('eduportal_school_classes');
    return saved ? JSON.parse(saved) : initialSchoolClasses;
  });

  const [schoolMajors, setSchoolMajors] = useState<SchoolMajor[]>(() => {
    const saved = localStorage.getItem('eduportal_school_majors');
    return saved ? JSON.parse(saved) : initialSchoolMajors;
  });

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'xp' | 'success' | 'info'>('xp');

  // Modals state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalInitialTab, setQrModalInitialTab] = useState<'absen' | 'pay'>('absen');
  const [liveClassOpen, setLiveClassOpen] = useState(false);
  const [analisisNilaiOpen, setAnalisisNilaiOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [cbtExamOpen, setCbtExamOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ChapterModule | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [tabunganModalOpen, setTabunganModalOpen] = useState(false);
  const [sppModalOpen, setSppModalOpen] = useState(false);
  const [allMenuModalOpen, setAllMenuModalOpen] = useState(false);
  const [izinModalOpen, setIzinModalOpen] = useState(false);
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('eduportal_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('eduportal_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('eduportal_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('eduportal_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eduportal_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eduportal_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('eduportal_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('eduportal_students_directory', JSON.stringify(studentsDirectory));
  }, [studentsDirectory]);

  useEffect(() => {
    localStorage.setItem('eduportal_school_users', JSON.stringify(schoolUsers));
  }, [schoolUsers]);

  useEffect(() => {
    localStorage.setItem('eduportal_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('eduportal_school_classes', JSON.stringify(schoolClasses));
  }, [schoolClasses]);

  useEffect(() => {
    localStorage.setItem('eduportal_school_majors', JSON.stringify(schoolMajors));
  }, [schoolMajors]);

  // Helper to record audit trail actions
  const recordAuditLog = (
    action: AuditActionType,
    title: string,
    description: string,
    target?: string,
    severity: 'info' | 'success' | 'warning' | 'danger' = 'info'
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      action,
      title,
      description,
      actor: currentUser?.name || 'Administrator',
      actorRole:
        currentUser?.role === 'admin'
          ? 'Super Admin'
          : currentUser?.role === 'guru'
          ? 'Guru'
          : currentUser?.role === 'karyawan'
          ? 'Staf TU'
          : 'Siswa',
      target,
      timestamp: `Hari ini, ${timeStr}`,
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handle Login & Logout
  const handleLogin = (user: AuthUser) => {
    playSound('success');
    setCurrentUser(user);
    triggerToast(`Selamat datang di portal, ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    playSound('click');
    setCurrentUser(null);
    triggerToast('Anda telah keluar dari akun.', 'info');
  };

  // Admin Handler: Create new administrative bill
  const handleAddBill = (newBill: AdministrasiBill) => {
    playSound('success');
    setBills((prev) => [newBill, ...prev]);

    // Push notification to all students
    const notif: typeof notificationsList[0] = {
      id: `n-${Date.now()}`,
      title: `Tagihan Baru Diterbitkan: ${newBill.title}`,
      message: `Sekolah telah menerbitkan tagihan sebesar Rp ${newBill.amount.toLocaleString('id-ID')} dengan jatuh tempo ${newBill.dueDate}.`,
      time: 'Baru saja',
      type: 'finance',
      unread: true,
    };
    setNotifications((prev: typeof notificationsList) => [notif, ...prev]);
    recordAuditLog(
      'create_bill',
      `Penerbitan Tagihan: ${newBill.title}`,
      `Menerbitkan tagihan baru sebesar Rp ${newBill.amount.toLocaleString('id-ID')} (${newBill.category.toUpperCase()}) dengan jatuh tempo ${newBill.dueDate}.`,
      newBill.title,
      'info'
    );
    triggerToast(`Tagihan "${newBill.title}" berhasil diterbitkan!`, 'success');
  };

  // Admin Handler: Update bill status (mark paid / revert)
  const handleUpdateBillStatus = (billId: string, status: 'lunas' | 'belum_bayar') => {
    playSound('click');
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status,
              paidDate:
                status === 'lunas'
                  ? 'Hari ini (Loket Tata Usaha)'
                  : undefined,
              receiptNumber:
                status === 'lunas'
                  ? `KWT-KASIR/TU-${Math.floor(1000 + Math.random() * 9000)}`
                  : undefined,
              paymentMethod: status === 'lunas' ? 'Kasir Loket Tata Usaha (Tunai)' : undefined,
            }
          : b
      )
    );
    const targetBill = bills.find((b) => b.id === billId);
    recordAuditLog(
      'update_bill_status',
      status === 'lunas' ? 'Validasi Pembayaran Kasir TU' : 'Pembatalan Status Pelunasan Tagihan',
      status === 'lunas'
        ? `Tagihan "${targetBill?.title || billId}" ditandai LUNAS di kasir loket Tata Usaha.`
        : `Tagihan "${targetBill?.title || billId}" dikembalikan ke status belum bayar.`,
      targetBill?.title || billId,
      status === 'lunas' ? 'success' : 'warning'
    );
    triggerToast(
      status === 'lunas'
        ? 'Tagihan berhasil ditandai LUNAS di kasir.'
        : 'Status tagihan dikembalikan ke belum bayar.',
      'info'
    );
  };

  // Admin Handler: Broadcast notification to all students
  const handleBroadcastNotification = (
    title: string,
    message: string,
    type: 'academic' | 'finance' | 'system'
  ) => {
    playSound('success');
    const newNotif = {
      id: `notif-broad-${Date.now()}`,
      title,
      message,
      time: 'Baru saja',
      type,
      unread: true,
    };
    setNotifications((prev: typeof notificationsList) => [newNotif, ...prev]);
    recordAuditLog(
      'broadcast_sent',
      `Siaran Pengumuman Massal: ${title}`,
      `Mengirimkan pengumuman prioritas (${type}): "${message.slice(0, 80)}..." ke portal warga sekolah.`,
      'Warga Sekolah',
      'info'
    );
    triggerToast('Pengumuman berhasil disiarkan ke semua portal siswa!', 'success');
  };

  // Admin Handler: Update leave request
  const handleUpdateLeaveStatus = (leaveId: string, status: 'disetujui' | 'ditolak') => {
    playSound('click');
    const req = leaveRequests.find((l) => l.id === leaveId);
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status } : l))
    );
    recordAuditLog(
      status === 'disetujui' ? 'approve_leave' : 'reject_leave',
      status === 'disetujui' ? 'Persetujuan Surat Izin Siswa' : 'Penolakan Surat Izin Siswa',
      `Pengajuan izin ${req?.type || 'kehadiran'} atas nama ${req?.studentName || 'Siswa'} (${req?.grade || ''}) telah ${status}.`,
      req?.studentName,
      status === 'disetujui' ? 'success' : 'warning'
    );
    triggerToast(`Permohonan izin siswa telah ${status}!`, 'info');
  };

  // User Management Handlers (Guru, Karyawan, Siswa, Admin)
  const handleAddSchoolUser = (newUser: SchoolUser, studentDetails?: Partial<StudentListItem>) => {
    playSound('success');
    setSchoolUsers((prev) => [newUser, ...prev]);

    // If role is student, also sync to studentsDirectory
    if (newUser.role === 'siswa') {
      const parts = (newUser.departmentOrGrade || '').split('-');
      const fallbackMajor = parts.length > 1 ? parts.slice(1).join('-').trim() : (newUser.departmentOrGrade.includes('IPS') ? 'IPS' : 'IPA');

      const newStd: StudentListItem = {
        id: newUser.id,
        name: newUser.name,
        nisn: newUser.identifier,
        grade: studentDetails?.grade || newUser.departmentOrGrade || 'X-A',
        major: studentDetails?.major || fallbackMajor,
        attendancePercent: studentDetails?.attendancePercent ?? 100,
        averageScore: studentDetails?.averageScore ?? 85.0,
        sppStatus: studentDetails?.sppStatus ?? 'lunas',
        savingsBalance: studentDetails?.savingsBalance ?? 100000,
      };
      setStudentsDirectory((prev) => [newStd, ...prev]);
    }

    recordAuditLog(
      'create_user',
      `Registrasi Pengguna: ${newUser.name}`,
      `Mendaftarkan akun baru ${newUser.name} sebagai ${newUser.role.toUpperCase()} (${newUser.identifier}) dengan ${newUser.permissions.length} hak akses aktif.`,
      `${newUser.name} (${newUser.role.toUpperCase()})`,
      'success'
    );

    triggerToast(`Pengguna baru "${newUser.name}" (${newUser.role.toUpperCase()}) berhasil ditambahkan!`, 'success');
  };

  // Class & Major Management Handlers
  const handleAddSchoolClass = (newClass: SchoolClass) => {
    playSound('success');
    setSchoolClasses((prev) => [newClass, ...prev]);
    recordAuditLog(
      'create_user',
      `Penambahan Rombongan Belajar: ${newClass.name}`,
      `Menambahkan kelas baru ${newClass.name} (Tingkat ${newClass.gradeLevel}) dengan peminatan ${newClass.major}.`,
      newClass.name,
      'info'
    );
    triggerToast(`Rombel Kelas "${newClass.name}" berhasil ditambahkan!`, 'success');
  };

  const handleDeleteSchoolClass = (classId: string) => {
    playSound('click');
    const target = schoolClasses.find((c) => c.id === classId);
    setSchoolClasses((prev) => prev.filter((c) => c.id !== classId));
    triggerToast(`Kelas "${target?.name || classId}" telah dihapus.`, 'info');
  };

  const handleAddSchoolMajor = (newMajor: SchoolMajor) => {
    playSound('success');
    setSchoolMajors((prev) => [newMajor, ...prev]);
    recordAuditLog(
      'create_user',
      `Penambahan Kompetensi Keahlian / Jurusan: ${newMajor.name}`,
      `Menambahkan program keahlian baru (${newMajor.code}) - ${newMajor.name}.`,
      newMajor.name,
      'info'
    );
    triggerToast(`Jurusan "${newMajor.name} (${newMajor.code})" berhasil ditambahkan!`, 'success');
  };

  const handleDeleteSchoolMajor = (majorId: string) => {
    playSound('click');
    const target = schoolMajors.find((m) => m.id === majorId);
    setSchoolMajors((prev) => prev.filter((m) => m.id !== majorId));
    triggerToast(`Jurusan "${target?.name || majorId}" telah dihapus.`, 'info');
  };

  const handleDeleteSchoolUser = (userId: string) => {
    playSound('click');
    const target = schoolUsers.find((u) => u.id === userId);
    if (!target) return;

    if (currentUser?.id === userId) {
      triggerToast('Gagal: Anda tidak dapat menghapus akun yang sedang aktif digunakan.', 'info');
      return;
    }

    setSchoolUsers((prev) => prev.filter((u) => u.id !== userId));
    if (target.role === 'siswa') {
      setStudentsDirectory((prev) => prev.filter((s) => s.id !== userId && s.nisn !== target.identifier));
    }

    recordAuditLog(
      'delete_user',
      `Penghapusan Akun ${target.role.toUpperCase()}: ${target.name}`,
      `Menghapus data pengguna ${target.name} (${target.identifier}, ${target.title}) dari basis data portal sekolah.`,
      `${target.name} (${target.role.toUpperCase()})`,
      'danger'
    );

    triggerToast(`Pengguna "${target.name}" (${target.role.toUpperCase()}) berhasil dihapus.`, 'info');
  };

  const handleUpdateSchoolUser = (
    userId: string,
    role: SchoolRole,
    permissions: string[],
    status: 'aktif' | 'nonaktif',
    details?: Partial<SchoolUser>
  ) => {
    playSound('success');
    const target = schoolUsers.find((u) => u.id === userId);
    const targetName = target?.name || 'Pengguna';

    setSchoolUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              role,
              permissions,
              status,
              ...(details || {}),
            }
          : u
      )
    );

    // If currently logged-in user is being modified, reflect in currentUser
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              role: role === 'siswa' ? 'student' : (role as any),
              permissions,
              title: details?.title || prev.title,
            }
          : prev
      );
    }

    recordAuditLog(
      'update_permissions',
      `Pembaruan Role & Hak Akses: ${targetName}`,
      `Mengubah peran menjadi ${role.toUpperCase()} dengan ${permissions.length} hak akses modul. Status: ${status.toUpperCase()}.`,
      `${targetName} (${role.toUpperCase()})`,
      'info'
    );

    triggerToast(`Peran dan hak akses untuk pengguna berhasil diperbarui!`, 'success');
  };

  const handleUpdateStudent = (studentId: string, updatedData: Partial<StudentListItem>) => {
    playSound('success');
    let studentName = '';
    setStudentsDirectory((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          studentName = updatedData.name || s.name;
          return { ...s, ...updatedData };
        }
        return s;
      })
    );

    // Also synchronize corresponding schoolUsers if student user exists
    setSchoolUsers((prev) =>
      prev.map((u) => {
        if (u.id === studentId || (updatedData.nisn && u.identifier === updatedData.nisn)) {
          return {
            ...u,
            ...(updatedData.name ? { name: updatedData.name, avatarInitial: updatedData.name.charAt(0).toUpperCase() } : {}),
            ...(updatedData.nisn ? { identifier: updatedData.nisn } : {}),
            ...(updatedData.grade ? { departmentOrGrade: `${updatedData.grade}${updatedData.major ? ' - ' + updatedData.major : ''}` } : {}),
          };
        }
        return u;
      })
    );

    recordAuditLog(
      'update_permissions',
      `Pembaruan Data Siswa: ${studentName || studentId}`,
      `Mengedit data spesifik siswa (nama: ${updatedData.name || '-'}, NISN: ${updatedData.nisn || '-'}, kelas: ${updatedData.grade || '-'}, jurusan: ${updatedData.major || '-'}, saldo tabungan: Rp ${updatedData.savingsBalance?.toLocaleString('id-ID') || '-'}).`,
      studentName,
      'info'
    );

    triggerToast(`Data siswa "${studentName || 'Siswa'}" berhasil disimpan ke direktori!`, 'success');
  };

  const handleImpersonateUser = (targetUser: SchoolUser) => {
    playSound('click');
    if (targetUser.role === 'siswa') {
      setCurrentUser({
        id: targetUser.id,
        name: targetUser.name,
        role: 'student',
        identifier: targetUser.identifier,
        email: targetUser.email,
        avatarInitial: targetUser.avatarInitial,
        title: targetUser.title,
        grade: targetUser.departmentOrGrade,
        major: targetUser.departmentOrGrade.includes('IPS') ? 'IPS' : 'IPA',
        permissions: targetUser.permissions,
      });
      setActiveTab('beranda');
      triggerToast(`Beralih ke mode akun Siswa: ${targetUser.name}`, 'info');
    } else {
      setCurrentUser({
        id: targetUser.id,
        name: targetUser.name,
        role: targetUser.role === 'guru' ? 'guru' : targetUser.role === 'karyawan' ? 'karyawan' : 'admin',
        identifier: targetUser.identifier,
        email: targetUser.email,
        avatarInitial: targetUser.avatarInitial,
        title: targetUser.title,
        department: targetUser.departmentOrGrade,
        permissions: targetUser.permissions,
      });
      triggerToast(`Beralih ke mode ${targetUser.role.toUpperCase()}: ${targetUser.name}`, 'info');
    }
  };

  // Handle paying school administrative bill (full or installment)
  const handlePayBill = (billId: string, paymentMethod: string, payAmount: number, note?: string) => {
    playSound('success');
    const billToPay = bills.find((b) => b.id === billId);
    if (!billToPay) return;

    const currentPaid = billToPay.paidAmount ?? (billToPay.status === 'lunas' ? billToPay.amount : 0);
    const totalAmount = billToPay.amount;
    const newPaidAmount = Math.min(totalAmount, currentPaid + payAmount);
    const newRemainingAmount = Math.max(0, totalAmount - newPaidAmount);
    const newStatus: 'belum_bayar' | 'sebagian' | 'lunas' =
      newRemainingAmount === 0 ? 'lunas' : 'sebagian';

    const newReceiptNo = `KWT-${new Date().getFullYear()}/ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeStr =
      'Hari ini, ' +
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
      ' WIB';

    const newPaymentRecord: BillPaymentHistory = {
      id: `pay-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      date: timeStr,
      amount: payAmount,
      paymentMethod,
      receiptNumber: newReceiptNo,
      note: note || (newRemainingAmount === 0 ? 'Pelunasan Penuh' : `Cicilan (Sisa Rp ${newRemainingAmount.toLocaleString('id-ID')})`),
      remainingAfter: newRemainingAmount,
    };

    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              paidAmount: newPaidAmount,
              remainingAmount: newRemainingAmount,
              status: newStatus,
              paidDate: newStatus === 'lunas' ? timeStr : b.paidDate,
              receiptNumber: newReceiptNo,
              paymentMethod,
              paymentHistory: [newPaymentRecord, ...(b.paymentHistory || [])],
            }
          : b
      )
    );

    // If paid via student savings, deduct balance
    if (paymentMethod.toLowerCase().includes('tabungan')) {
      setStudent((prev) => ({
        ...prev,
        savingsBalance: Math.max(0, prev.savingsBalance - payAmount),
      }));
    }

    // Add audit log
    recordAuditLog(
      'update_bill_status',
      newStatus === 'lunas' ? `Pelunasan Penuh: ${billToPay.title}` : `Pembayaran Cicilan: ${billToPay.title}`,
      `Pembayaran sebesar Rp ${payAmount.toLocaleString('id-ID')} via ${paymentMethod} berhasil. Sisa tagihan otomatis berkurang menjadi Rp ${newRemainingAmount.toLocaleString('id-ID')}.`,
      billToPay.studentName || billToPay.title,
      newStatus === 'lunas' ? 'success' : 'info'
    );

    // Add finance notification
    const newNotif = {
      id: `n-${Date.now()}`,
      title: newStatus === 'lunas' ? `Tagihan ${billToPay.title} LUNAS` : `Pembayaran ${billToPay.title} Berhasil`,
      message: `Pembayaran Rp ${payAmount.toLocaleString('id-ID')} via ${paymentMethod} berhasil. Sisa tagihan saat ini: Rp ${newRemainingAmount.toLocaleString('id-ID')}. Kuitansi: ${newReceiptNo}.`,
      time: 'Baru saja',
      type: 'finance' as const,
      unread: true,
    };
    setNotifications((prev: typeof notificationsList) => [newNotif, ...prev]);

    triggerToast(
      newStatus === 'lunas'
        ? `Tagihan ${billToPay.title} telah LUNAS!`
        : `Pembayaran Rp ${payAmount.toLocaleString('id-ID')} sukses! Sisa tagihan otomatis berkurang menjadi Rp ${newRemainingAmount.toLocaleString('id-ID')}`,
      'success'
    );
  };

  // Toast trigger helper
  const triggerToast = (msg: string, type: 'xp' | 'success' | 'info' = 'xp') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add XP to student
  const handleEarnXp = (amount: number, reason?: string) => {
    playSound('coin');
    setStudent((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
    triggerToast(`+${amount} XP Berhasil Diraih! ${reason || ''}`, 'xp');
  };

  // QR Attendance success
  const handleAbsenSuccess = () => {
    playSound('success');
    setStudent((prev) => ({
      ...prev,
      attendancePercent: 100,
    }));
    handleEarnXp(50, 'Kehadiran Tepat Waktu Tercatat');
  };

  // Canteen / SPP Payment deduction
  const handleDeductBalance = (amount: number, merchant: string) => {
    playSound('coin');
    setStudent((prev) => ({
      ...prev,
      savingsBalance: Math.max(0, prev.savingsBalance - amount),
    }));
    triggerToast(
      `Pembayaran Rp ${amount.toLocaleString('id-ID')} di ${merchant} Berhasil!`,
      'success'
    );
  };

  // Top Up balance
  const handleTopUpBalance = (amount: number) => {
    playSound('coin');
    setStudent((prev) => ({
      ...prev,
      savingsBalance: prev.savingsBalance + amount,
    }));
    triggerToast(`Top-Up Tabungan +Rp ${amount.toLocaleString('id-ID')} Berhasil!`, 'success');
  };

  // CBT Exam finish
  const handleFinishCbt = (score: number, xpEarned: number) => {
    handleEarnXp(xpEarned, `Skor Ujian: ${score}/100`);
    setStudent((prev) => ({
      ...prev,
      totalGradesCount: prev.totalGradesCount + 1,
      averageScore: Number(((prev.averageScore * prev.totalGradesCount + score) / (prev.totalGradesCount + 1)).toFixed(1)),
      pendingTasksCount: Math.max(0, prev.pendingTasksCount - 1),
    }));
  };

  // Complete module quiz
  const handleCompleteModuleQuiz = (xpGained: number) => {
    handleEarnXp(xpGained, 'Kuis Bab Selesai');
    if (selectedModule) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === selectedModule.id
            ? { ...m, progress: 100, status: 'selesai', completedQuizzes: m.totalQuizzes }
            : m
        )
      );
    }
  };

  // Reset Demo data
  const handleResetData = () => {
    localStorage.clear();
    setStudent(initialStudent);
    setModules(chapterModulesList);
    setNotifications(notificationsList);
    setBills(initialAdministrasiBills);
    setSchoolUsers(initialSchoolUsers);
    setAuditLogs(initialAuditLogs);
    triggerToast('Data demo berhasil direset ke nilai awal!', 'info');
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev: typeof notificationsList) => prev.map((n) => ({ ...n, unread: false })));
    triggerToast('Semua notifikasi telah ditandai sudah dibaca', 'info');
  };

  // Menu action handler
  const handleSelectMenu = (menuId: string) => {
    playSound('click');
    switch (menuId) {
      case 'lms':
        setActiveTab('lms');
        break;
      case 'tabungan':
        setTabunganModalOpen(true);
        break;
      case 'materi':
        setActiveTab('lms');
        break;
      case 'cbt':
        setCbtExamOpen(true);
        break;
      case 'raport':
      case 'analisis_nilai':
        setAnalisisNilaiOpen(true);
        break;
      case 'pengumuman':
        setNotificationModalOpen(true);
        break;
      case 'spp':
      case 'administrasi':
        setActiveTab('administrasi');
        break;
      case 'izin':
        setIzinModalOpen(true);
        break;
      case 'library':
        setLibraryModalOpen(true);
        break;
      case 'leaderboard':
        setLeaderboardOpen(true);
        break;
      case 'semua':
        setAllMenuModalOpen(true);
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter((n: { unread: boolean }) => n.unread).length;

  // Header Title based on Active View
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return 'Dashboard';
      case 'lms':
        return 'Ruang Belajar LMS';
      case 'administrasi':
        return 'E-Administrasi';
      case 'jadwal':
        return 'Jadwal Kelas';
      case 'profil':
        return 'Profil Siswa';
      default:
        return 'Dashboard';
    }
  };

  // If user is not logged in, display the Login Screen
  if (!currentUser) {
    return (
      <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <Toast message={toastMessage} type={toastType} />
        <LoginView onLogin={handleLogin} darkMode={darkMode} />
      </div>
    );
  }

  // If user is logged in as Admin / Guru / Karyawan (Backoffice Staff)
  if (currentUser.role === 'admin' || currentUser.role === 'guru' || currentUser.role === 'karyawan') {
    const roleInitials = currentUser.role === 'admin' ? 'AD' : currentUser.role === 'guru' ? 'GU' : 'TU';
    const roleBadgeLabel =
      currentUser.role === 'admin'
        ? 'SUPER ADMIN'
        : currentUser.role === 'guru'
        ? 'DEWAN GURU'
        : 'STAF TATA USAHA';

    return (
      <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <Toast message={toastMessage} type={toastType} />

        {/* Top Desktop Helper Toolbar */}
        <aside aria-label="Kontrol Tampilan" className="hidden md:flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-white text-xs select-none">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              {roleInitials}
            </div>
            <span className="font-extrabold tracking-tight">
              EduPortal • Backoffice {roleBadgeLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Akun: {currentUser.name} ({roleBadgeLabel})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentUser(defaultStudentUser);
                triggerToast('Beralih ke akun Siswa (Ahmad Fauzi)', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all active:scale-95 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Ganti ke Akun Siswa</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        <AdminDashboardView
          adminUser={currentUser}
          bills={bills}
          onAddBill={handleAddBill}
          onUpdateBillStatus={handleUpdateBillStatus}
          onBroadcastNotification={handleBroadcastNotification}
          onSwitchToStudentView={() => {
            setCurrentUser(defaultStudentUser);
            triggerToast('Beralih ke tampilan Siswa.', 'info');
          }}
          onLogout={handleLogout}
          leaveRequests={leaveRequests}
          onUpdateLeaveStatus={handleUpdateLeaveStatus}
          studentsDirectory={studentsDirectory}
          schoolUsers={schoolUsers}
          auditLogs={auditLogs}
          schoolClasses={schoolClasses}
          schoolMajors={schoolMajors}
          onAddSchoolClass={handleAddSchoolClass}
          onDeleteSchoolClass={handleDeleteSchoolClass}
          onAddSchoolMajor={handleAddSchoolMajor}
          onDeleteSchoolMajor={handleDeleteSchoolMajor}
          onAddSchoolUser={handleAddSchoolUser}
          onDeleteSchoolUser={handleDeleteSchoolUser}
          onUpdateSchoolUser={handleUpdateSchoolUser}
          onUpdateStudent={handleUpdateStudent}
          onImpersonateUser={handleImpersonateUser}
          onRecordPayment={handlePayBill}
          darkMode={darkMode}
        />
      </div>
    );
  }

  // If user is logged in as Student
  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      {/* Toast Notification */}
      <Toast message={toastMessage} type={toastType} />

      {/* Top Desktop Bar (Control frame mode for responsive vs smartphone preview) */}
      <aside aria-label="Kontrol Tampilan" className="hidden md:flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-white text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            EP
          </div>
          <span className="font-extrabold tracking-tight">
            EduPortal • Portal Sekolah & Ruang Belajar Digital LMS
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] border border-blue-500/30">
            Siswa: {currentUser.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick tab switcher on desktop bar */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold mr-2">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'beranda' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tampilan 1 (Portal Siswa)
            </button>
            <button
              onClick={() => setActiveTab('lms')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'lms' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tampilan 2 (LMS Belajar)
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentUser(defaultAdminUser);
              triggerToast('Beralih ke Akun Admin (Drs. H. Bambang)', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all active:scale-95 shadow-xs"
            title="Masuk ke dashboard Admin Tata Usaha"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Login Admin TU</span>
          </button>

          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all active:scale-95"
          >
            {phoneFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Mode Layar Penuh</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mode Frame HP</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-semibold transition-all active:scale-95 ml-1"
            title="Keluar / Ganti Akun"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Container: either Phone Mockup frame or Full width */}
      <div className={`mx-auto transition-all ${phoneFrameMode ? 'py-4 md:py-8' : 'w-full max-w-xl'}`}>
        <main
          className={`relative mx-auto transition-all overflow-hidden ${
            phoneFrameMode
              ? 'max-w-[430px] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[8px] border-slate-800 bg-[#0b193d]'
              : 'w-full bg-white dark:bg-slate-900 min-h-screen'
          }`}
        >
          {/* Smartphone Punch Hole Camera (on frame mode) */}
          {phoneFrameMode && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border border-slate-800 z-50 flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
            </div>
          )}

          {/* App Header (Top status bar & app bar) */}
          <Header
            title={getHeaderTitle()}
            student={student}
            darkMode={darkMode}
            onToggleTheme={() => {
              playSound('click');
              setDarkMode(!darkMode);
            }}
            unreadNotifications={unreadCount}
            onNotificationClick={() => {
              playSound('click');
              setNotificationModalOpen(true);
            }}
            onLogout={handleLogout}
          />

          {/* Sub Navigation Bar when on LMS view to easily go back to Portal */}
          {activeTab === 'lms' && (
            <div className="px-4 py-2.5 bg-[#0b193d] border-b border-blue-900/40 flex items-center justify-between text-xs text-white">
              <button
                onClick={() => {
                  playSound('click');
                  setActiveTab('beranda');
                }}
                className="flex items-center gap-1.5 text-blue-200 hover:text-white font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Portal Siswa</span>
              </button>

              <span className="text-[11px] font-semibold text-purple-200 bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-700/50">
                Mode LMS Belajar
              </span>
            </div>
          )}

          {/* Body Content Area */}
          <div className={`p-4 min-h-[680px] transition-colors ${darkMode ? 'bg-slate-950' : 'bg-[#f4f7fc]'}`}>
            {activeTab === 'beranda' && (
              <PortalDashboard
                student={student}
                menuItems={portalMenuItems}
                onSelectMenu={handleSelectMenu}
                onOpenQrAbsen={() => {
                  playSound('click');
                  setQrModalInitialTab('absen');
                  setQrModalOpen(true);
                }}
                onOpenAverageScore={() => {
                  playSound('click');
                  setAnalisisNilaiOpen(true);
                }}
                onOpenPendingTasks={() => {
                  playSound('click');
                  setCbtExamOpen(true);
                }}
                onOpenAllMenu={() => {
                  playSound('click');
                  setAllMenuModalOpen(true);
                }}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'lms' && (
              <LmsDashboard
                student={student}
                liveSession={liveTeachingSession}
                modules={modules}
                onOpenLiveClass={() => {
                  playSound('click');
                  setLiveClassOpen(true);
                }}
                onOpenLeaderboard={() => {
                  playSound('click');
                  setLeaderboardOpen(true);
                }}
                onOpenAnalisisNilai={() => {
                  playSound('click');
                  setAnalisisNilaiOpen(true);
                }}
                onSelectModule={(mod) => {
                  playSound('click');
                  setSelectedModule(mod);
                }}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'administrasi' && (
              <AdministrasiView
                bills={bills}
                student={student}
                onPayBill={handlePayBill}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'jadwal' && (
              <JadwalView darkMode={darkMode} />
            )}

            {activeTab === 'profil' && (
              <ProfilView
                student={student}
                darkMode={darkMode}
                onToggleTheme={() => {
                  playSound('click');
                  setDarkMode(!darkMode);
                }}
                onOpenQr={() => {
                  playSound('click');
                  setQrModalInitialTab('absen');
                  setQrModalOpen(true);
                }}
                onResetData={handleResetData}
                onLogout={handleLogout}
              />
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onChangeTab={(tab) => {
              playSound('click');
              setActiveTab(tab);
            }}
            onOpenQrPay={() => {
              playSound('click');
              setQrModalInitialTab('pay');
              setQrModalOpen(true);
            }}
            unpaidBillsCount={bills.filter((b) => b.status === 'belum_bayar').length}
            darkMode={darkMode}
          />
        </main>
      </div>

      {/* Interactive Modals */}
      <QrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        student={student}
        initialTab={qrModalInitialTab}
        onAbsenSuccess={handleAbsenSuccess}
        onPayCanteen={(amt, merchant) => handleDeductBalance(amt, merchant)}
        darkMode={darkMode}
      />

      <LiveClassModal
        isOpen={liveClassOpen}
        onClose={() => setLiveClassOpen(false)}
        liveSession={liveTeachingSession}
        student={student}
        onEarnXp={(xp) => handleEarnXp(xp, 'Kuis Live Class Terjawab Benar!')}
        darkMode={darkMode}
      />

      <AnalisisNilaiModal
        isOpen={analisisNilaiOpen}
        onClose={() => setAnalisisNilaiOpen(false)}
        student={student}
        darkMode={darkMode}
      />

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        student={student}
        darkMode={darkMode}
      />

      <CbtExamModal
        isOpen={cbtExamOpen}
        onClose={() => setCbtExamOpen(false)}
        student={student}
        onFinishExam={handleFinishCbt}
        darkMode={darkMode}
      />

      <ChapterDetailModal
        module={selectedModule}
        isOpen={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
        student={student}
        onCompleteQuiz={handleCompleteModuleQuiz}
        darkMode={darkMode}
      />

      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        darkMode={darkMode}
      />

      <TabunganModal
        isOpen={tabunganModalOpen}
        onClose={() => setTabunganModalOpen(false)}
        student={student}
        onTopUp={handleTopUpBalance}
        darkMode={darkMode}
      />

      <SppModal
        isOpen={sppModalOpen}
        onClose={() => setSppModalOpen(false)}
        student={student}
        onPayBill={(amt) => handleDeductBalance(amt, 'Tagihan SPP Sekolah')}
        darkMode={darkMode}
      />

      <AllMenuModal
        isOpen={allMenuModalOpen}
        onClose={() => setAllMenuModalOpen(false)}
        onSelectMenu={handleSelectMenu}
        darkMode={darkMode}
      />

      <IzinModal
        isOpen={izinModalOpen}
        onClose={() => setIzinModalOpen(false)}
        student={student}
        darkMode={darkMode}
      />

      <LibraryModal
        isOpen={libraryModalOpen}
        onClose={() => setLibraryModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
