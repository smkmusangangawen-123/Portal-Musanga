import { StudentListItem } from '../types';

export interface ExportCSVOptions {
  scope?: 'all' | 'filtered';
  includeTimestamp?: boolean;
  filterDescription?: string;
  customFilename?: string;
}

/**
 * Escapes a single CSV field value according to RFC 4180
 */
export const escapeCsvField = (value: unknown): string => {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
};

/**
 * Exports student directory list to a downloadable CSV file.
 * Adds UTF-8 BOM (\uFEFF) for full Microsoft Excel / Google Sheets compatibility.
 */
export const exportStudentsToCsv = (
  students: StudentListItem[],
  options?: ExportCSVOptions
): { filename: string; count: number } => {
  const dateStr = new Date().toISOString().slice(0, 10);
  const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '-');
  const defaultFilename = options?.scope === 'filtered'
    ? `backup_siswa_terfilter_${dateStr}_${timeStr}.csv`
    : `backup_direktori_siswa_${dateStr}.csv`;
    
  const filename = options?.customFilename || defaultFilename;

  // CSV Headers in Indonesian
  const headers = [
    'No',
    'ID Siswa',
    'Nama Lengkap',
    'NISN',
    'Kelas / Rombel',
    'Jurusan / Keahlian',
    'Kehadiran (%)',
    'Nilai Rata-rata',
    'Status SPP',
    'Saldo Tabungan (Rp)',
    'Keterangan Akademis',
  ];

  const rows = students.map((std, index) => {
    // Prefix NISN with tab or clean text so spreadsheet applications preserve leading zeros
    const formattedNisn = `\t${std.nisn}`;
    const sppLabel = std.sppStatus === 'lunas' ? 'Lunas' : 'Tertunggak';
    const academicNote =
      std.averageScore >= 85
        ? 'Sangat Baik'
        : std.averageScore >= 75
        ? 'Baik'
        : 'Perlu Bimbingan';

    return [
      escapeCsvField(index + 1),
      escapeCsvField(std.id),
      escapeCsvField(std.name),
      escapeCsvField(formattedNisn),
      escapeCsvField(std.grade),
      escapeCsvField(std.major),
      escapeCsvField(std.attendancePercent),
      escapeCsvField(std.averageScore),
      escapeCsvField(sppLabel),
      escapeCsvField(std.savingsBalance),
      escapeCsvField(academicNote),
    ].join(',');
  });

  const headerRow = headers.map(escapeCsvField).join(',');
  const csvContent = [headerRow, ...rows].join('\r\n');

  // \uFEFF Byte Order Mark ensures Excel / Sheets recognizes UTF-8 without garbled characters
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { filename, count: students.length };
};
