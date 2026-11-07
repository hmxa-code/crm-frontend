export interface CrmFeature {
  key: string;
  label: string;
  module: string;
}

export const CRM_FEATURES: CrmFeature[] = [
  { key: 'dashboard', label: 'Dashboard', module: 'Core' },
  { key: 'financial', label: 'Finance', module: 'Core' },
  { key: 'marketing', label: 'Marketing', module: 'Core' },
  { key: 'leads', label: 'Leads Management', module: 'Core' },
  { key: 'sales', label: 'Sales Management', module: 'Core' },
  { key: 'tasks', label: 'Task Management', module: 'Core' },
  { key: 'chat', label: 'Chat Workspace', module: 'Core' },
  { key: 'real-estate', label: 'Real Estate', module: 'Core' },
  { key: 'companies', label: 'Companies', module: 'Core' },
  { key: 'opportunities', label: 'Opportunities', module: 'Core' },
  { key: 'users', label: 'User Management', module: 'Admin' },
  { key: 'roles', label: 'Roles Management', module: 'Admin' },
];

export const FEATURES_BY_MODULE = CRM_FEATURES.reduce<Record<string, CrmFeature[]>>((acc, feature) => {
  if (!acc[feature.module]) acc[feature.module] = [];
  acc[feature.module].push(feature);
  return acc;
}, {});

// Map sidebar menu keys to CRM feature keys
export const MENU_FEATURE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/financial': 'financial',
  '/marketing': 'marketing',
  '/leads': 'leads',
  '/sales': 'sales',
  '/tasks': 'tasks',
  '/tasks/workspace': 'tasks',
  '/tasks/my-tasks': 'tasks',
  '/tasks/automation': 'tasks',
  '/tasks/activity-log': 'tasks',
  '/tasks/analytics': 'tasks',
  '/chat': 'chat',
  '/real-estate': 'real-estate',
  '/companies': 'companies',
  '/opportunities': 'opportunities',
  '/user': 'users',
  '/roles': 'roles',
};

export const AVAILABLE_PERMISSIONS = CRM_FEATURES;
export const PERMISSIONS_BY_MODULE = FEATURES_BY_MODULE;
