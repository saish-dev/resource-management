import { z } from 'zod';

export const appRoles = [
  'ADMIN',
  'RESOURCE_MANAGER',
  'DELIVERY_MANAGER',
  'PRACTICE_LEAD',
  'EMPLOYEE',
] as const;

export const appRoleSchema = z.enum(appRoles);
export type AppRole = z.infer<typeof appRoleSchema>;
