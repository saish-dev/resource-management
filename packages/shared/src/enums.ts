import { z } from 'zod';

// Stored enums mirror apps/api/prisma/schema.prisma. personStatus is derived, never stored.
export const personStatusSchema = z.enum([
  'AVAILABLE',
  'ALLOCATED',
  'LOCKED_TENTATIVE',
  'LOCKED_CONFIRMED',
  'ON_LEAVE',
  'BENCH',
]);
export type PersonStatus = z.infer<typeof personStatusSchema>;

export const lockTypeSchema = z.enum(['TENTATIVE', 'CONFIRMED']);
export type LockType = z.infer<typeof lockTypeSchema>;

export const prioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);
export type Priority = z.infer<typeof prioritySchema>;

export const projectPhaseSchema = z.enum([
  'PIPELINE',
  'MOBILISING',
  'IN_FLIGHT',
  'CLOSING',
]);
export type ProjectPhase = z.infer<typeof projectPhaseSchema>;

export const leaveStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;

export const leaveTypeSchema = z.enum(['ANNUAL', 'SICK', 'PARENTAL', 'OTHER']);
export type LeaveType = z.infer<typeof leaveTypeSchema>;

export const skillClaimStatusSchema = z.enum([
  'PENDING',
  'VERIFIED',
  'DECLINED',
]);
export type SkillClaimStatus = z.infer<typeof skillClaimStatusSchema>;

export const releaseTypeSchema = z.enum(['IMMEDIATE', 'PLANNED']);
export type ReleaseType = z.infer<typeof releaseTypeSchema>;

export const authProviderSchema = z.enum(['MICROSOFT', 'GOOGLE']);
export type AuthProvider = z.infer<typeof authProviderSchema>;

export const notificationChannelSchema = z.enum(['IN_APP', 'EMAIL', 'BOTH']);
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;

export const notificationFrequencySchema = z.enum([
  'IMMEDIATE',
  'DAILY',
  'WEEKLY',
]);
export type NotificationFrequency = z.infer<typeof notificationFrequencySchema>;

export const skillMismatchRuleSchema = z.enum([
  'WARN_ACKNOWLEDGE',
  'HARD_BLOCK',
  'WARN_OVERRIDE',
]);
export type SkillMismatchRule = z.infer<typeof skillMismatchRuleSchema>;
