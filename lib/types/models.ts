// eFondaMental Platform - Business Domain Models
// High-level models for application logic

import {
  UserRole,
  PathologyType,
  VisitType,
  VisitStatus,
} from './enums';

// ============================================================================
// USER & AUTHENTICATION MODELS
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  centerId: string | null;
  centerName: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  pathologies: PathologyType[];
  permissions: string[];
}

export interface CreateUserRequest {
  email: string;
  role: UserRole;
  centerId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  username?: string;
  permissions?: string[];
}

export interface InviteUserRequest {
  email: string;
  role: UserRole;
  centerId: string;
  firstName: string;
  lastName: string;
}

// ============================================================================
// CENTER MODELS
// ============================================================================

export interface CenterWithPathologies {
  id: string;
  name: string;
  code: string;
  city: string | null;
  pathologies: PathologyInfo[];
  active: boolean;
  userCount?: number;
  patientCount?: number;
}

export interface PathologyInfo {
  id: string;
  type: PathologyType;
  name: string;
  color: string | null;
}

export interface CenterStatistics {
  centerId: string;
  centerName: string;
  totalPatients: number;
  activePatients: number;
  totalVisits: number;
  completedVisits: number;
  scheduledVisits: number;
  professionalCount: number;
  pathologyBreakdown: {
    pathology: PathologyType;
    patientCount: number;
  }[];
}

// ============================================================================
// PATIENT MODELS
// ============================================================================

export interface PatientSummary {
  id: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'M' | 'F' | null;
  placeOfBirth: string | null;
  pathology: PathologyInfo;
  lastVisitDate: string | null;
  nextVisitDate: string | null;
  riskLevel: 'none' | 'low' | 'moderate' | 'high';
  active: boolean;
}

export interface PatientDetail extends PatientSummary {
  email: string | null;
  phone: string | null;
  address: string | null;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  } | null;
  centerName: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  totalVisits: number;
  completedVisits: number;
  upcomingVisits: number;
}

export interface CreatePatientRequest {
  centerId: string;
  pathologyId: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: 'M' | 'F';
  placeOfBirth?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// ============================================================================
// VISIT MODELS
// ============================================================================

export interface VisitSummary {
  id: string;
  visitType: VisitType;
  visitTypeName: string;
  visitNumber: number | null;  // Sequential number for visits of same type (e.g., Annual #1, #2)
  scheduledDate: string | null;
  completedDate: string | null;
  status: VisitStatus;
  patientName: string;
  conductedBy: string | null;
  conductedByName: string | null;
  modulesTotal: number;
  modulesCompleted: number;
}

export interface VisitDetail extends VisitSummary {
  patient: PatientSummary;
  template: {
    id: string;
    name: string;
    description: string | null;
  };
  modules: ModuleSummary[];
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

export interface CreateVisitRequest {
  patientId: string;
  visitTemplateId: string;
  visitType: VisitType;
  scheduledDate?: string;
  notes?: string;
}

// ============================================================================
// MODULE & QUESTIONNAIRE MODELS
// ============================================================================

export interface ModuleSummary {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  questionnaires: QuestionnaireSummary[];
  completed: boolean;
}

export interface QuestionnaireSummary {
  id: string;
  code: string;
  title: string;
  targetRole: UserRole | null;
  responseId: string | null;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

export interface QuestionnaireDetail {
  id: string;
  code: string;
  title: string;
  description: string | null;
  targetRole: UserRole | null;
  questions: QuestionDefinition[];
  conditionalLogic: any | null;
}

export interface QuestionDefinition {
  id: string;
  type: string;
  text: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface QuestionnaireResponseDetail {
  id: string;
  questionnaireId: string;
  visitId: string;
  patientId: string;
  responses: Record<string, any>;
  status: string;
  startedAt: string;
  completedAt: string | null;
  completedBy: string | null;
}

export interface SaveQuestionnaireResponseRequest {
  visitId: string;
  questionnaireId: string;
  patientId: string;
  responses: Record<string, any>;
  completed?: boolean;
}

// ============================================================================
// ANALYTICS MODELS
// ============================================================================

export interface PatientAnalytics {
  patientId: string;
  timeline: VisitTimelineEntry[];
  moodTrend: MoodDataPoint[];
  riskHistory: RiskDataPoint[];
  adherenceRate: number;
}

export interface VisitTimelineEntry {
  date: string;
  visitType: VisitType;
  visitTypeName: string;
  visitNumber: number | null;  // Sequential number for visits of same type
  status: VisitStatus;
  keyFindings: string;
}

export interface MoodDataPoint {
  date: string;
  value: number;
  source: 'self_report' | 'clinical_assessment';
}

export interface RiskDataPoint {
  date: string;
  suicideRisk: 'none' | 'low' | 'moderate' | 'high';
  relapseRisk: 'none' | 'low' | 'moderate' | 'high';
}

export interface GlobalStatistics {
  totalCenters: number;
  activeCenters: number;
  totalPatients: number;
  activePatients: number;
  totalVisitsThisMonth: number;
  completedVisitsThisMonth: number;
  totalProfessionals: number;
  activeProfessionals: number;
  centerStats: CenterStatistics[];
}

// ============================================================================
// PERMISSION MODELS
// ============================================================================

export interface PermissionGroup {
  category: string;
  categoryName: string;
  permissions: PermissionInfo[];
}

export interface PermissionInfo {
  id: string;
  code: string;
  name: string;
  description: string | null;
  granted: boolean;
}

export interface UserPermissions {
  userId: string;
  userName: string;
  role: UserRole;
  permissions: PermissionInfo[];
}

// ============================================================================
// MESSAGE MODELS
// ============================================================================

export interface MessageThread {
  id: string;
  patientId: string;
  patientName: string;
  subject: string | null;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  messages: MessageDetail[];
}

export interface MessageDetail {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  patientId: string;
  recipientId?: string;
  subject?: string;
  content: string;
  parentMessageId?: string;
}

// ============================================================================
// DASHBOARD MODELS
// ============================================================================

export interface ProfessionalDashboardData {
  pathology: PathologyType;
  recentPatients: PatientSummary[];
  upcomingVisits: VisitSummary[];
  pendingQuestionnaires: number;
  patientsRequiringFollowup: PatientSummary[];
  statistics?: {
    totalPatients: number;
    visitsThisMonth: number;
    completionRate: number;
  };
}

export interface ManagerDashboardData {
  centerName: string;
  pathologies: PathologyType[];
  statistics: CenterStatistics;
  professionals: ProfessionalInfo[];
  recentActivity: ActivityEntry[];
}

export interface ProfessionalInfo {
  id: string;
  name: string;
  email: string;
  active: boolean;
  patientCount: number;
  visitsThisMonth: number;
  lastActive: string | null;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  timestamp: string;
  details: string;
}

export interface PatientDashboardData {
  upcomingVisits: VisitSummary[];
  pendingQuestionnaires: QuestionnaireSummary[];
  recentMessages: MessageDetail[];
  nextAppointment: {
    date: string;
    visitType: VisitType;
    location: string;
  } | null;
}

// ============================================================================
// FILTER & SEARCH MODELS
// ============================================================================

export interface PatientSearchFilters {
  searchTerm?: string;
  pathology?: PathologyType;
  active?: boolean;
  riskLevel?: 'none' | 'low' | 'moderate' | 'high';
  ageMin?: number;
  ageMax?: number;
  hasUpcomingVisit?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

