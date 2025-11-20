// Formatting utility functions

export function formatFullName(firstName: string | null, lastName: string | null): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ') || 'Inconnu';
}

export function formatInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0).toUpperCase() || '';
  const last = lastName?.charAt(0).toUpperCase() || '';
  return `${first}${last}` || '??';
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phone;
}

export function formatMedicalRecordNumber(mrn: string): string {
  return mrn.toUpperCase();
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompletionRate(completed: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (completed / total) * 100;
  return formatPercentage(percentage, 1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatCenterCode(code: string): string {
  return code.toUpperCase();
}

export function formatRiskLevel(risk: 'none' | 'low' | 'moderate' | 'high'): {
  label: string;
  color: string;
} {
  const formats = {
    none: { label: 'Aucun', color: 'text-slate-500' },
    low: { label: 'Faible', color: 'text-green-600' },
    moderate: { label: 'Modéré', color: 'text-amber-600' },
    high: { label: 'Élevé', color: 'text-red-600' },
  };
  
  return formats[risk];
}

export function formatVisitStatus(status: string): {
  label: string;
  color: string;
} {
  const formats: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Planifiée', color: 'text-blue-600' },
    in_progress: { label: 'En cours', color: 'text-amber-600' },
    completed: { label: 'Terminée', color: 'text-green-600' },
    cancelled: { label: 'Annulée', color: 'text-slate-500' },
  };
  
  return formats[status] || { label: status, color: 'text-slate-600' };
}

