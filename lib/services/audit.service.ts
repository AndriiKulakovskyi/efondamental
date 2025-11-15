// eFondaMental Platform - Audit Service

import { createClient } from '../supabase/server';
import { AuditLog } from '../types/database.types';

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export async function logAuditEvent(params: {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  centerId?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.from('audit_logs').insert({
      user_id: params.userId || null,
      action: params.action,
      entity_type: params.entityType || null,
      entity_id: params.entityId || null,
      center_id: params.centerId || null,
      changes: params.changes || null,
      metadata: params.metadata || {},
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
    });
  } catch (error) {
    // Silent fail - don't interrupt operations for audit log failures
    console.error('Failed to log audit event:', error);
  }
}

// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

export async function getAuditLogs(params: {
  centerId?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}): Promise<AuditLog[]> {
  const supabase = await createClient();

  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (params.centerId) {
    query = query.eq('center_id', params.centerId);
  }

  if (params.userId) {
    query = query.eq('user_id', params.userId);
  }

  if (params.action) {
    query = query.eq('action', params.action);
  }

  if (params.entityType) {
    query = query.eq('entity_type', params.entityType);
  }

  if (params.fromDate) {
    query = query.gte('created_at', params.fromDate);
  }

  if (params.toDate) {
    query = query.lte('created_at', params.toDate);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return data || [];
}

export async function getRecentActivity(
  centerId: string,
  limit: number = 50
): Promise<AuditLog[]> {
  return getAuditLogs({ centerId, limit });
}

export async function getUserActivity(
  userId: string,
  limit: number = 100
): Promise<AuditLog[]> {
  return getAuditLogs({ userId, limit });
}

// ============================================================================
// SPECIFIC AUDIT EVENTS
// ============================================================================

export async function logPatientCreation(
  userId: string,
  patientId: string,
  centerId: string,
  patientData: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'create_patient',
    entityType: 'patients',
    entityId: patientId,
    centerId,
    metadata: { patientData },
  });
}

export async function logPatientUpdate(
  userId: string,
  patientId: string,
  centerId: string,
  changes: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'update_patient',
    entityType: 'patients',
    entityId: patientId,
    centerId,
    changes,
  });
}

export async function logPatientView(
  userId: string,
  patientId: string,
  centerId: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'view_patient',
    entityType: 'patients',
    entityId: patientId,
    centerId,
  });
}

export async function logVisitCreation(
  userId: string,
  visitId: string,
  centerId: string,
  visitData: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'create_visit',
    entityType: 'visits',
    entityId: visitId,
    centerId,
    metadata: { visitData },
  });
}

export async function logVisitCompletion(
  userId: string,
  visitId: string,
  centerId: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'complete_visit',
    entityType: 'visits',
    entityId: visitId,
    centerId,
  });
}

export async function logDataExport(
  userId: string,
  centerId: string,
  exportType: string,
  metadata: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'export_data',
    entityType: exportType,
    centerId,
    metadata,
  });
}

export async function logPermissionChange(
  userId: string,
  targetUserId: string,
  centerId: string,
  changes: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'modify_permissions',
    entityType: 'user_permissions',
    entityId: targetUserId,
    centerId,
    changes,
  });
}

// ============================================================================
// AUDIT STATISTICS
// ============================================================================

export async function getAuditStatistics(centerId: string, days: number = 30) {
  const supabase = await createClient();

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('action, created_at')
    .eq('center_id', centerId)
    .gte('created_at', fromDate.toISOString());

  const actionCounts: Record<string, number> = {};
  const dailyActivity: Record<string, number> = {};

  logs?.forEach((log) => {
    // Count actions
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;

    // Count daily activity
    const date = new Date(log.created_at).toISOString().split('T')[0];
    dailyActivity[date] = (dailyActivity[date] || 0) + 1;
  });

  return {
    totalEvents: logs?.length || 0,
    actionCounts,
    dailyActivity,
  };
}

