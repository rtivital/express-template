import { logger } from '@/logger';

export enum AuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
}

export interface AuditLogEntry {
  action: AuditAction;
  userId?: number;
  actorId?: number;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details?: Record<string, any>;
}

export function auditLog(entry: AuditLogEntry) {
  logger.info(
    {
      audit: true,
      action: entry.action,
      userId: entry.userId,
      actorId: entry.actorId,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      requestId: entry.requestId,
      details: entry.details,
      timestamp: new Date().toISOString(),
    },
    `Audit: ${entry.action}`
  );
}
