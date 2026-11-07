export const ACCOUNT_TYPES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUB_ACCOUNT: 'sub_account',
} as const;

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  [ACCOUNT_TYPES.SUPER_ADMIN]: 'Super Admin',
  [ACCOUNT_TYPES.ADMIN]: 'Admin',
  [ACCOUNT_TYPES.SUB_ACCOUNT]: 'Sub Account',
};

/** Resolve account type from user object (handles legacy role values) */
export const resolveAccountType = (user?: {
  accountType?: string;
  role?: string | { value?: string };
} | null): string | undefined => {
  if (!user) return undefined;

  if (user.accountType) return user.accountType;

  const rawRole =
    typeof user.role === 'string'
      ? user.role
      : user.role?.value;

  if (!rawRole) return undefined;

  if (rawRole === ACCOUNT_TYPES.SUPER_ADMIN || rawRole === 'practice_admin') {
    return ACCOUNT_TYPES.SUPER_ADMIN;
  }
  if (rawRole === ACCOUNT_TYPES.ADMIN || rawRole === 'project_manager') {
    return ACCOUNT_TYPES.ADMIN;
  }
  if (rawRole === ACCOUNT_TYPES.SUB_ACCOUNT) {
    return ACCOUNT_TYPES.SUB_ACCOUNT;
  }

  // MongoDB ObjectId or unknown string → sub-account
  if (/^[a-f\d]{24}$/i.test(rawRole)) {
    return ACCOUNT_TYPES.SUB_ACCOUNT;
  }

  return rawRole;
};

export const isAccountOwner = (accountType?: string) =>
  accountType === ACCOUNT_TYPES.SUPER_ADMIN || accountType === ACCOUNT_TYPES.ADMIN;

export const hasFullCrmAccess = (accountType?: string) => isAccountOwner(accountType);

export const hasFeatureAccess = (
  user: {
    accountType?: string;
    role?: string | { value?: string };
    effectivePermissions?: string[];
    metadata?: { permissions?: string[] };
  } | null,
  featureKey: string
) => {
  if (!user) return true;
  const accountType = resolveAccountType(user);
  if (hasFullCrmAccess(accountType)) return true;

  const perms = user.effectivePermissions ?? user.metadata?.permissions;
  if (!Array.isArray(perms) || perms.length === 0) return true;

  return perms.includes(featureKey);
};

// Legacy exports for existing imports
export const USER_ROLES = ACCOUNT_TYPES;
export const ROLE_LABELS = ACCOUNT_TYPE_LABELS;

export const hasRole = (userRole: string | undefined, requiredRole: string | string[]): boolean => {
  if (!userRole) return false;
  if (isAccountOwner(userRole)) return true;
  if (typeof requiredRole === 'string') return userRole === requiredRole;
  return requiredRole.includes(userRole);
};

export const hasHigherRole = (userRole: string | undefined, _minRole: string): boolean =>
  isAccountOwner(userRole);
