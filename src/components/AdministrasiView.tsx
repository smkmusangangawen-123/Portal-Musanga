import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Wallet,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Building,
  Shirt,
  BookOpen,
  FlaskConical,
  Trophy,
  Copy,
  Check,
  Printer,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AdministrasiBill, StudentProfile } from '../types';

interface AdministrasiViewProps {
  bills: AdministrasiBill[];
  student: StudentProfile;
  onPayBill: (billId: string, paymentMethod: string, amount: number, note?: string) => void;
  darkMode?: boolean;
}

export const AdministrasiView: React.FC<AdministrasiViewProps> = ({
  bills,
  student,
  onPayBill,
  darkMode = false,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

  // Modals
  const [payingBill, setPayingBill] = useState<AdministrasiBill | null>(null);
  const [payMode, setPayMode] = useState<'full' | 'partial'>('full');
  const [partialPayAmount, setPartialPayAmount] = useState<string>('50000');
  const [selectedMethod, setSelectedMethod] = useState<'tabungan' | 'qris' | 'va_bni' | 'va_mandiri'>('tabungan');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const [viewingReceipt, setViewingReceipt] = useState<AdministrasiBill | null>(null);
  const [receiptMeta, setReceiptMeta] = useState<{
    amountPaid: number;
    remainingAfter: number;
    isInstallment: boolean;
  }>({ amountPaid: 0, remainingAfter: 0, isInstallment: false });

  const [copiedVa, setCopiedVa] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  // Filter bills targeted to this student OR mass bills
  const myBills = bills.filter((b) => {
    if (b.targetType === 'student') {
      const matchNisn = b.studentNisn && b.studentNisn === student.nisn;
      const matchName = b.studentName && b.studentName.toLowerCase().includes(student.name.toLowerCase().split(' ')[0]);
      const matchId = b.studentId && b.studentId === student.id;
      return matchNisn || matchName || matchId;
    }
    return true; // mass bills
  });

  // Calculations
  const unpaidBills = myBills.filter((b) => b.status === 'belum_bayar' || b.status === 'sebagian');
  const paidBills = myBills.filter((b) => b.status === 'lunas');
  const totalUnpaidAmount = unpaidBills.reduce(
    (acc, curr) => acc + (curr.remainingAmount ?? (curr.status === 'lunas' ? 0 : curr.amount)),
    0
  );
  const totalPaidAmount = myBills.reduce(
    (acc, curr) => acc + (curr.paidAmount ?? (curr.status === 'lunas' ? curr.amount : 0)),
    0
  );

  // Filtered bills
  const filteredBills = myBills.filter((bill) => {
    // Category filter
    if (filterCategory === 'unpaid' && bill.status === 'lunas') return false;
    if (filterCategory === 'sebagian' && bill.status !== 'sebagian') return false;
    if (filterCategory === 'paid' && bill.status !== 'lunas') return false;
    if (filterCategory === 'spp' && bill.category !== 'spp') return false;
    if (filterCategory === 'seragam' && bill.category !== 'seragam') return false;
    if (filterCategory === 'praktikum' && bill.category !== 'praktikum') return false;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = bill.title.toLowerCase().includes(q);
      const matchCode = bill.code.toLowerCase().includes(q);
      const matchDesc = bill.description.toLowerCase().includes(q);
      return matchTitle || matchCode || matchDesc;
    }
    return true;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('IDR', 'Rp');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spp':
        return <Receipt className="w-4 h-4 text-blue-500" />;
      case 'seragam':
        return <Shirt className="w-4 h-4 text-emerald-500" />;
      case 'praktikum':
        return <FlaskConical className="w-4 h-4 text-purple-500" />;
      case 'gedung':
        return <Building className="w-4 h-4 text-amber-500" />;
      case 'kegiatan':
        return <Trophy className="w-4 h-4 text-rose-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'spp':
        return 'SPP Bulanan';
      case 'seragam':
        return 'Uang Seragam';
      case 'praktikum':
        return 'Lab & Praktikum';
      case 'gedung':
        return 'Uang Gedung';
      case 'kegiatan':
        return 'Kegiatan & OSIS';
      default:
        return 'Administrasi';
    }
  };

  const handleCopyVA = () => {
    navigator.clipboard?.writeText('9882 1234 5678 9012');
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleOpenPayModal = (bill: AdministrasiBill) => {
    setPayingBill(bill);
    setPayMode('full');
    const remaining = bill.remainingAmount ?? (bill.status === 'lunas' ? 0 : bill.amount);
    setPartialPayAmount(Math.min(remaining, 50000).toString());
  };

  const handleConfirmPayment = () => {
    if (!payingBill) return;
    setIsProcessingPay(true);

    let methodName = 'Saldo Tabungan Siswa';
    if (selectedMethod === 'qris') methodName = 'QRIS Digital Pay';
    if (selectedMethod === 'va_bni') methodName = 'Virtual Account BNI';
    if (selectedMethod === 'va_mandiri') methodName = 'Virtual Account Mandiri';

    const currentRemaining = payingBill.remainingAmount ?? (payingBill.status === 'lunas' ? 0 : payingBill.amount);
    const parsedPartial = Number(partialPayAmount.replace(/\D/g, '')) || 0;
    const actualPayAmount =
      payMode === 'full' ? currentRemaining : Math.min(currentRemaining, Math.max(5000, parsedPartial));

    const newRemaining = Math.max(0, currentRemaining - actualPayAmount);
    const isLunas = newRemaining === 0;

    const receiptNo = `KWT-${Date.now().toString().slice(-6)}`;
    const timeStr =
      'Hari ini, ' +
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
      ' WIB';

    setTimeout(() => {
      setIsProcessingPay(false);
      onPayBill(
        payingBill.id,
        methodName,
        actualPayAmount,
        isLunas ? 'Pelunasan Penuh' : `Pembayaran Cicilan (Sisa ${formatRupiah(newRemaining)})`
      );

      const updatedBillData: AdministrasiBill = {
        ...payingBill,
        paidAmount: (payingBill.paidAmount || 0) + actualPayAmount,
        remainingAmount: newRemaining,
        status: isLunas ? ('lunas' as const) : ('sebagian' as const),
        paidDate: timeStr,
        receiptNumber: receiptNo,
        paymentMethod: methodName,
      };

      setReceiptMeta({
        amountPaid: actualPayAmount,
        remainingAfter: newRemaining,
        isInstallment: !isLunas,
      });

      setPayingBill(null);
      setViewingReceipt(updatedBillData);
    }, 1200);
  };

  const handleSimulateDownload = () => {
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Gradient Master Finance Card */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-indigo-900 via-blue-800 to-slate-900 p-5 text-white shadow-xl shadow-indigo-950/30 border border-indigo-500/30">
        {/* Glow effects */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-200">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-300 block">
                  E-Administrasi Sekolah
                </span>
                <span className="text-xs font-semibold text-white/90">
                  Tahun Ajaran 2026/2027
                </span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-bold text-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{student.grade} {student.major}</span>
            </div>
          </div>

          {/* Unpaid Total Highlight */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-xs text-blue-200/90 font-medium block">
              Total Sisa Tagihan Perlu Dibayar:
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-2xl font-black tracking-tight text-white">
                {formatRupiah(totalUnpaidAmount)}
              </h2>
              {unpaidBills.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/90 text-white text-[11px] font-bold animate-pulse">
                  {unpaidBills.length} Tagihan Menunggu
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Semua Lunas
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics & Savings Connection */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/30 flex items-center justify-center text-teal-300">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-blue-200 block font-medium">Saldo Tabungan</span>
                <span className="font-extrabold text-white text-xs truncate block">
                  {formatRupiah(student.savingsBalance)}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-blue-200 block font-medium">Telah Disetor</span>
                <span className="font-extrabold text-emerald-300 text-xs truncate block">
                  {formatRupiah(totalPaidAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Virtual Account Copy Shortcut */}
          <div className="mt-3 p-2.5 rounded-xl bg-blue-950/60 border border-blue-400/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-blue-300" />
              <div className="text-[11px]">
                <span className="text-blue-300 font-medium">VA BNI Siswa: </span>
                <span className="font-mono font-bold text-white tracking-wider">9882 1234 5678 9012</span>
              </div>
            </div>
            <button
              onClick={handleCopyVA}
              className="px-2 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-[10px] font-bold text-white flex items-center gap-1 transition-all"
            >
              {copiedVa ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-2.5">
        {/* Search Input */}
        <div
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 text-white focus-within:border-blue-500'
              : 'bg-white border-slate-200 text-slate-900 focus-within:border-blue-500 shadow-sm'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari SPP, seragam, uang praktikum, kode..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Semua Tagihan', count: myBills.length },
            { id: 'unpaid', label: 'Belum Lunas', count: unpaidBills.length, isWarning: unpaidBills.length > 0 },
            { id: 'sebagian', label: 'Sedang Dicicil' },
            { id: 'spp', label: 'SPP Bulanan' },
            { id: 'seragam', label: 'Uang Seragam' },
            { id: 'praktikum', label: 'Praktikum & Lab' },
            { id: 'paid', label: 'Riwayat Lunas', count: paidBills.length },
          ].map((chip) => {
            const isActive = filterCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilterCategory(chip.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : darkMode
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                }`}
              >
                <span>{chip.label}</span>
                {chip.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : chip.isWarning
                        ? 'bg-rose-500 text-white'
                        : darkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bills List */}
      <div className="space-y-3">
        {filteredBills.length === 0 ? (
          <div
            className={`p-8 text-center rounded-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
            <h4 className="font-bold text-sm">Tidak ada tagihan yang ditemukan</h4>
            <p className="text-xs mt-1 text-slate-400">
              Coba sesuaikan kata kunci pencarian atau filter kategori di atas.
            </p>
          </div>
        ) : (
          filteredBills.map((bill) => {
            const isPaid = bill.status === 'lunas';
            const isPartial = bill.status === 'sebagian';
            const isUnpaid = !isPaid;
            const isExpanded = expandedBillId === bill.id;
            const paidAmount = bill.paidAmount ?? (isPaid ? bill.amount : 0);
            const remaining = bill.remainingAmount ?? (isPaid ? 0 : bill.amount - paidAmount);
            const paidPercent = Math.min(100, Math.round((paidAmount / bill.amount) * 100));

            return (
              <div
                key={bill.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  darkMode
                    ? isUnpaid
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/60 border-slate-800/80 opacity-90'
                    : isUnpaid
                    ? 'bg-white border-slate-200 hover:border-blue-200 shadow-sm'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                <div className="p-4">
                  {/* Top Badges & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                        {getCategoryIcon(bill.category)}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {getCategoryLabel(bill.category)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
                        {bill.code}
                      </span>
                      {bill.targetType === 'student' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Khusus Anda
                        </span>
                      )}
                    </div>

                    {isPaid ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Lunas
                      </span>
                    ) : isPartial ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Dicicil (Sisa {formatRupiah(remaining)})
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Belum Bayar
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`font-extrabold text-sm leading-snug ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {bill.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {bill.description}
                  </p>

                  {/* Partial Progress Bar if has been paid partially */}
                  {paidAmount > 0 && !isPaid && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-amber-800 dark:text-amber-300">
                          Sudah Masuk: {formatRupiah(paidAmount)} ({paidPercent}%)
                        </span>
                        <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                          Sisa: {formatRupiah(remaining)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-amber-200/50 dark:bg-amber-900/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${paidPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Due date or Payment Info */}
                  <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {isUnpaid ? `Jatuh Tempo: ${bill.dueDate}` : `Dibayar: ${bill.paidDate || bill.dueDate}`}
                      </span>
                    </div>
                    {bill.paymentMethod && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate">
                        Via {bill.paymentMethod}
                      </span>
                    )}
                  </div>

                  {/* Amount & Main Action Row */}
                  <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {isPartial ? 'Sisa Tagihan' : 'Jumlah Tagihan'}
                      </span>
                      <span
                        className={`text-base font-black tracking-tight ${
                          isUnpaid
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {formatRupiah(remaining)}
                      </span>
                      {isPartial && (
                        <span className="text-[10px] text-slate-400 block">
                          Total tagihan {formatRupiah(bill.amount)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Breakdown Toggle */}
                      {((bill.itemsBreakdown && bill.itemsBreakdown.length > 0) ||
                        (bill.paymentHistory && bill.paymentHistory.length > 0)) && (
                        <button
                          onClick={() => setExpandedBillId(isExpanded ? null : bill.id)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-all"
                        >
                          <span>Rincian</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {/* Pay or View Receipt Button */}
                      {isUnpaid ? (
                        <button
                          onClick={() => handleOpenPayModal(bill)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{isPartial ? 'Bayar / Cicil' : 'Bayar'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setReceiptMeta({
                              amountPaid: bill.amount,
                              remainingAfter: 0,
                              isInstallment: false,
                            });
                            setViewingReceipt(bill);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Kuitansi</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Breakdown Drawer */}
                {isExpanded && (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 text-xs space-y-3 animate-in fade-in">
                    {bill.itemsBreakdown && bill.itemsBreakdown.length > 0 && (
                      <div>
                        <span className="font-extrabold text-[11px] text-slate-600 dark:text-slate-300 block mb-1">
                          Komponen Rincian Biaya:
                        </span>
                        {bill.itemsBreakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-slate-600 dark:text-slate-300 py-1 border-b border-dashed border-slate-200 dark:border-slate-700/60 last:border-none"
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>{item.name}</span>
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {formatRupiah(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timeline of past installments */}
                    {bill.paymentHistory && bill.paymentHistory.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-extrabold text-[11px] text-indigo-600 dark:text-indigo-400 block mb-1.5">
                          Riwayat Setoran & Angsuran Anda:
                        </span>
                        <div className="space-y-1.5">
                          {bill.paymentHistory.map((h, i) => (
                            <div
                              key={h.id || i}
                              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]"
                            >
                              <div>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                                  {h.receiptNumber}
                                </span>
                                <span className="text-[10px] text-slate-400">{h.date} • {h.paymentMethod}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-emerald-600 block">
                                  +{formatRupiah(h.amount)}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  Sisa: {formatRupiah(h.remainingAfter)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Payment Modal with Full / Installment Mode */}
      {payingBill && (() => {
        const currentRemaining =
          payingBill.remainingAmount ?? (payingBill.status === 'lunas' ? 0 : payingBill.amount);
        const parsedPartial = Number(partialPayAmount.replace(/\D/g, '')) || 0;
        const actualPayAmount =
          payMode === 'full' ? currentRemaining : Math.min(currentRemaining, Math.max(5000, parsedPartial));
        const previewRemainingAfter = Math.max(0, currentRemaining - actualPayAmount);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
            <div
              className={`w-full max-w-sm rounded-[28px] overflow-hidden border shadow-2xl transition-all ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight leading-tight">
                      Pembayaran E-Administrasi
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{payingBill.code}</span>
                  </div>
                </div>
                <button
                  disabled={isProcessingPay}
                  onClick={() => setPayingBill(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bill Info Card */}
              <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Tagihan Yang Dibayarkan
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                    {payingBill.title}
                  </h4>
                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                    <span className="text-xs text-slate-500 font-medium">Sisa Tagihan Saat Ini</span>
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                      {formatRupiah(currentRemaining)}
                    </span>
                  </div>
                </div>

                {/* Pilih Mode Pembayaran (Lunasi Penuh vs Cicil Bertahap) */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Opsi Nominal Setoran:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayMode('full')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        payMode === 'full'
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black block">Lunasi Penuh</span>
                      <span className="text-[10px] text-slate-400 block">{formatRupiah(currentRemaining)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMode('partial')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        payMode === 'partial'
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black block">Cicil / Angsur</span>
                      <span className="text-[10px] text-amber-600 font-bold block">Nominal Bebas</span>
                    </button>
                  </div>

                  {/* Input nominal jika memilih cicil */}
                  {payMode === 'partial' && (
                    <div className="mt-2.5 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2 animate-in fade-in">
                      <label className="text-[11px] font-bold text-blue-900 dark:text-blue-200 block">
                        Ketik Jumlah Yang Ingin Dicicil (Rp):
                      </label>
                      <input
                        type="number"
                        min="5000"
                        max={currentRemaining}
                        step="5000"
                        value={partialPayAmount}
                        onChange={(e) => setPartialPayAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 text-sm font-black text-slate-900 dark:text-white outline-none"
                      />

                      {/* Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setPartialPayAmount('50000')}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                        >
                          Rp 50.000
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartialPayAmount('100000')}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                        >
                          Rp 100.000
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartialPayAmount(Math.round(currentRemaining / 2).toString())}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                        >
                          50% Sisa
                        </button>
                      </div>

                      {/* Dynamic reduction notice */}
                      <div className="pt-1.5 border-t border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-[11px]">
                        <span className="text-blue-800 dark:text-blue-300 font-medium">Sisa tagihan otomatis berkurang:</span>
                        <span className="font-black text-rose-600 dark:text-rose-400">
                          {formatRupiah(previewRemainingAfter)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-2">
                    Pilih Saluran Pembayaran:
                  </label>
                  <div className="space-y-2">
                    {/* Option 1: Saldo Tabungan Siswa */}
                    <label
                      onClick={() => setSelectedMethod('tabungan')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMethod === 'tabungan'
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">Saldo Tabungan Siswa</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Tersedia: {formatRupiah(student.savingsBalance)}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedMethod === 'tabungan'}
                        onChange={() => setSelectedMethod('tabungan')}
                        className="accent-blue-600"
                      />
                    </label>

                    {/* Option 2: QRIS Digital */}
                    <label
                      onClick={() => setSelectedMethod('qris')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMethod === 'qris'
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 font-black text-xs">
                          QR
                        </div>
                        <div>
                          <span className="text-xs font-bold block">QRIS Bank Indonesia</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Scan via GoPay, OVO, Dana, BCA Mobile
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedMethod === 'qris'}
                        onChange={() => setSelectedMethod('qris')}
                        className="accent-blue-600"
                      />
                    </label>

                    {/* Option 3: Virtual Account BNI */}
                    <label
                      onClick={() => setSelectedMethod('va_bni')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMethod === 'va_bni'
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 font-black text-xs">
                          BNI
                        </div>
                        <div>
                          <span className="text-xs font-bold block">Virtual Account BNI</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            9882 1234 5678 9012
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedMethod === 'va_bni'}
                        onChange={() => setSelectedMethod('va_bni')}
                        className="accent-blue-600"
                      />
                    </label>
                  </div>
                </div>

                {/* Insufficient balance warning if Tabungan selected & not enough */}
                {selectedMethod === 'tabungan' && student.savingsBalance < actualPayAmount && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      Saldo tabungan ({formatRupiah(student.savingsBalance)}) kurang dari jumlah bayar ({formatRupiah(actualPayAmount)}). Silakan pilih QRIS atau Virtual Account.
                    </span>
                  </div>
                )}

                {/* Action button */}
                <button
                  disabled={
                    isProcessingPay ||
                    actualPayAmount <= 0 ||
                    (selectedMethod === 'tabungan' && student.savingsBalance < actualPayAmount)
                  }
                  onClick={handleConfirmPayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPay ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bayar Sekarang ({formatRupiah(actualPayAmount)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. Official School Digital Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-sm rounded-[28px] overflow-hidden border shadow-2xl transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm tracking-tight">Kuitansi Pembayaran Elektronik</h3>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Document Paper */}
            <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 font-sans relative">
                {/* Official Stamp Watermark */}
                <div
                  className={`absolute right-4 bottom-14 border-4 font-black text-xs px-3 py-1.5 rounded-lg -rotate-12 pointer-events-none uppercase tracking-widest text-center shadow-xs ${
                    receiptMeta.isInstallment
                      ? 'border-amber-600/70 text-amber-600/70'
                      : 'border-emerald-600/70 text-emerald-600/70'
                  }`}
                >
                  <div>{receiptMeta.isInstallment ? 'SETORAN CICILAN' : 'LUNAS'}</div>
                  <div className="text-[8px] font-bold">BENDAHARA SEKOLAH</div>
                </div>

                {/* Header Kop Surat */}
                <div className="text-center pb-3 border-b border-slate-300 dark:border-slate-700">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                    SMK MUHAMMADIYAH 1 / SMA DIGITAL
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Sistem Layanan Keuangan Digital & Administrasi Siswa Terpadu
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                    KUITANSI RESMI SEKOLAH
                  </span>
                </div>

                {/* Receipt Details Meta */}
                <div className="mt-3 text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">No. Kuitansi:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {viewingReceipt.receiptNumber || 'KWT-2026/09/SPP-0842'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tgl Pembayaran:</span>
                    <span className="font-semibold">{viewingReceipt.paidDate || 'Hari ini'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode Bayar:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {viewingReceipt.paymentMethod || 'Saldo Tabungan Siswa'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Siswa:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NISN / Kelas:</span>
                    <span className="font-medium">
                      {student.nisn} • {student.grade} {student.major}
                    </span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">
                    Rincian Pembayaran:
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                      <span>{viewingReceipt.title}</span>
                      <span>Total Tagihan: {formatRupiah(viewingReceipt.amount)}</span>
                    </div>

                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-black pl-2">
                      <span>Nominal Yang Disetorkan Sekarang:</span>
                      <span>{formatRupiah(receiptMeta.amountPaid || viewingReceipt.amount)}</span>
                    </div>

                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-black pl-2">
                      <span>Sisa Tagihan Berjalan:</span>
                      <span>{formatRupiah(receiptMeta.remainingAfter)}</span>
                    </div>
                  </div>

                  {/* Status Box */}
                  <div className="mt-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Tagihan:</span>
                    <span
                      className={`text-xs font-black uppercase ${
                        receiptMeta.isInstallment ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {receiptMeta.isInstallment ? 'SEDANG DICICIL (SEBAGIAN)' : 'LUNAS PENUH'}
                    </span>
                  </div>
                </div>

                {/* Digital Verification Info */}
                <div className="mt-4 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-[9px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verifikasi Kriptografi Sah</span>
                  </div>
                  <span>Dicetak Secara Digital</span>
                </div>
              </div>

              {/* Toast confirmation */}
              {downloadSuccessToast && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kuitansi PDF berhasil diunduh ke perangkat!</span>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSimulateDownload}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-md shadow-blue-600/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  onClick={() => {
                    handleSimulateDownload();
                    window.print?.();
                  }}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
