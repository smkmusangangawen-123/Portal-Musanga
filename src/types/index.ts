export interface StudentProfile {
  id?: string;
  name: string;
  avatarInitial: string;
  nisn: string;
  grade: string;
  major: string;
  attendancePercent: number;
  savingsBalance: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  averageScore: number;
  totalGradesCount: number;
  pendingTasksCount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  badge?: number | string;
  badgeColor?: string;
  action?: string;
}

export interface ChapterModule {
  id: string;
  title: string;
  subject: string;
  chapterNumber: number;
  status: 'sedang_dipelajari' | 'belum_dimulai' | 'selesai';
  progress: number; // 0 to 100
  totalVideos: number;
  completedVideos: number;
  totalQuizzes: number;
  completedQuizzes: number;
  estimatedMinutes: number;
  xpReward: number;
  description: string;
  icon: string;
  color: string;
}

export interface LiveClass {
  id: string;
  title: string;
  teacher: string;
  teacherAvatar: string;
  subject: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming' | 'finished';
  participantsCount: number;
  description: string;
}

export interface KantinItem {
  id: string;
  name: string;
  category: 'makanan' | 'minuman' | 'snack';
  price: number;
  standName: string;
  image: string;
  rating: number;
  soldCount: number;
  description: string;
}

export interface CartItem {
  item: KantinItem;
  quantity: number;
}

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

export interface BillPaymentHistory {
  id: string;
  date: string;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  note?: string;
  remainingAfter: number;
}

export interface AdministrasiBill {
  id: string;
  title: string;
  category: 'spp' | 'seragam' | 'gedung' | 'praktikum' | 'kegiatan' | 'lainnya';
  code: string;
  academicYear: string;
  amount: number;
  dueDate: string;
  status: 'belum_bayar' | 'sebagian' | 'lunas';
  description: string;
  paidDate?: string;
  receiptNumber?: string;
  paymentMethod?: string;
  itemsBreakdown?: { name: string; amount: number }[];

  // Student specific targeting
  targetType?: 'all' | 'student';
  studentId?: string;
  studentNisn?: string;
  studentName?: string;
  studentGrade?: string;

  // Installment / Partial Payment tracking (sisa tagihan otomatis berkurang)
  paidAmount?: number;
  remainingAmount?: number;
  paymentHistory?: BillPaymentHistory[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'academic' | 'finance' | 'system' | 'cbt';
  unread: boolean;
}

export type UserRole = 'student' | 'admin' | 'guru' | 'karyawan';
export type SchoolRole = 'guru' | 'karyawan' | 'siswa' | 'admin';

export interface SystemPermission {
  id: string;
  key: string;
  label: string;
  description: string;
  category: 'akademik' | 'keuangan' | 'kesiswaan' | 'sistem';
}

export interface SchoolUser {
  id: string;
  name: string;
  role: SchoolRole;
  identifier: string; // NIP, NUPTK, or NISN
  email: string;
  phone?: string;
  avatarInitial: string;
  title: string;
  departmentOrGrade: string;
  status: 'aktif' | 'nonaktif';
  permissions: string[];
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // NISN or NIP/Username
  email: string;
  avatarInitial: string;
  title: string;
  grade?: string;
  major?: string;
  department?: string;
  permissions?: string[];
}

export interface AdminLeaveRequest {
  id: string;
  studentName: string;
  grade: string;
  nisn: string;
  type: 'sakit' | 'izin' | 'dispensasi';
  date: string;
  reason: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  attachmentName?: string;
}

export interface StudentListItem {
  id: string;
  name: string;
  nisn: string;
  grade: string;
  major: string;
  attendancePercent: number;
  averageScore: number;
  sppStatus: 'lunas' | 'tertunggak';
  savingsBalance: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  grade: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export type AuditActionType =
  | 'create_user'
  | 'delete_user'
  | 'update_permissions'
  | 'update_role'
  | 'create_bill'
  | 'update_bill_status'
  | 'broadcast_sent'
  | 'approve_leave'
  | 'reject_leave';

export interface AuditLogItem {
  id: string;
  action: AuditActionType;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  target?: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "X-A", "X TBSM 1", "XI TKJ 2"
  gradeLevel: 'X' | 'XI' | 'XII';
  major: string; // e.g. "TBSM", "TKJ", "IPA", "RPL"
  waliKelas?: string;
  room?: string;
}

export interface SchoolMajor {
  id: string;
  code: string; // e.g. "TBSM", "TKJ", "RPL", "AKL"
  name: string; // e.g. "Teknik & Bisnis Sepeda Motor"
  description?: string;
}
