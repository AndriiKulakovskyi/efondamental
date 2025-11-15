// Date utility functions

import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'PPP p');
}

export function formatShortDate(date: string | Date): string {
  return formatDate(date, 'PP');
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(dateObj, new Date());
}

export function calculateAge(birthDate: string | Date): number {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function isOverdue(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
}

export function isUpcoming(date: string | Date, days: number = 7): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return dateObj <= futureDate && dateObj >= new Date();
}

