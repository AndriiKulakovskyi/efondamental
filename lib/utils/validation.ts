// Validation schemas using Zod

import { z } from 'zod';
import { UserRole, PathologyType, VisitType } from '../types/enums';

// ============================================================================
// USER VALIDATION
// ============================================================================

export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  username: z.string().min(3).max(50).optional(),
});

export const createUserSchema = userProfileSchema.extend({
  role: z.nativeEnum(UserRole),
  center_id: z.string().uuid(),
});

// ============================================================================
// PATIENT VALIDATION
// ============================================================================

export const patientSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date',
  }),
  medical_record_number: z.string().min(1, 'MRN is required').max(50),
  center_id: z.string().uuid(),
  pathology_id: z.string().uuid(),
  gender: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// ============================================================================
// CENTER VALIDATION
// ============================================================================

export const centerSchema = z.object({
  name: z.string().min(1, 'Center name is required').max(255),
  code: z.string().min(1, 'Center code is required').max(50),
  city: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

// ============================================================================
// VISIT VALIDATION
// ============================================================================

export const visitSchema = z.object({
  patient_id: z.string().uuid(),
  visit_template_id: z.string().uuid(),
  visit_type: z.nativeEnum(VisitType),
  scheduled_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date',
  }).optional(),
  notes: z.string().optional(),
});

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

