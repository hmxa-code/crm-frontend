export interface CrmFeature {
  key: string;
  label: string;
  module: string;
}

export const CRM_FEATURES: CrmFeature[] = [
  { key: 'dashboard', label: 'Dashboard', module: 'Core' },
  { key: 'rengrowcure', label: 'Rengrowcure', module: 'Core' },
  { key: 'marketing', label: 'Marketing', module: 'Core' },
  { key: 'automation-workflow', label: 'Automation Workflow', module: 'Core' },
  { key: 'tasks', label: 'Task Management', module: 'Core' },
  { key: 'roles', label: 'Roles Management', module: 'Admin' },
  { key: 'chat', label: 'Chat Workspace', module: 'Core' },
  { key: 'crm-settings', label: 'CRM Settings', module: 'Admin' },
  { key: 'workspace', label: 'Unified Workspace', module: 'Core' },
];

export const FEATURES_BY_MODULE = CRM_FEATURES.reduce<Record<string, CrmFeature[]>>((acc, feature) => {
  if (!acc[feature.module]) acc[feature.module] = [];
  acc[feature.module].push(feature);
  return acc;
}, {});

// Map sidebar menu keys to CRM feature keys
export const MENU_FEATURE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/rengrowcure': 'rengrowcure',
  '/rengrowcure/*': 'rengrowcure',
  '/marketing': 'marketing',
  '/marketing/*': 'marketing',
  '/workflows': 'automation-workflow',
  '/workflows/*': 'automation-workflow',
  '/tasks': 'tasks',
  '/tasks/*': 'tasks',
  '/user': 'users',
  '/user/*': 'users',
  '/roles': 'roles',
  '/roles/*': 'roles',
  '/chat': 'chat',
  '/crm-settings': 'crm-settings',
  '/workspace': 'workspace',
};

export const AVAILABLE_PERMISSIONS = CRM_FEATURES;
export const PERMISSIONS_BY_MODULE = FEATURES_BY_MODULE;
