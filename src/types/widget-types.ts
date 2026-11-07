export type WidgetType = 'kanban' | 'pipeline_selector' | 'value_counter' | 'search_bar' | 'module_hub' | 'crm_module_card';

export interface WidgetItem {
  id: string;
  type: WidgetType;
  title: string;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  moduleKey?: string;
  href?: string;
  description?: string;
  badge?: string;
}

// Default Elementor-style widgets registry
export const AVAILABLE_WIDGETS: Omit<WidgetItem, 'id'>[] = [
  {
    type: 'pipeline_selector',
    title: 'Pipeline Switcher Card',
    w: 3,
    h: 2,
    minW: 2,
    minH: 2
  },
  {
    type: 'search_bar',
    title: 'Instant Opportunity Filter',
    w: 5,
    h: 2,
    minW: 3,
    minH: 2
  },
  {
    type: 'value_counter',
    title: 'Total Pipeline Value ($)',
    w: 4,
    h: 2,
    minW: 2,
    minH: 2
  },
  {
    type: 'module_hub',
    title: 'Connected CRM Module Hub',
    w: 12,
    h: 5,
    minW: 6,
    minH: 4
  },
  {
    type: 'crm_module_card',
    title: 'Leads Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'leads',
    href: '/leads',
    description: 'Lead funnel and follow-up queue',
    badge: 'Leads'
  },
  {
    type: 'crm_module_card',
    title: 'Companies Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'companies',
    href: '/companies',
    description: 'Business account coverage',
    badge: 'Companies'
  },
  {
    type: 'crm_module_card',
    title: 'Marketing Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'marketing',
    href: '/marketing',
    description: 'Campaigns and automation',
    badge: 'Marketing'
  },
  {
    type: 'crm_module_card',
    title: 'Calendar Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'calendar',
    href: '/calendar',
    description: 'Scheduled follow-ups',
    badge: 'Calendar'
  },
  {
    type: 'crm_module_card',
    title: 'Real Estate Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'real-estate',
    href: '/real-estate',
    description: 'Property and task activity',
    badge: 'Real Estate'
  },
  {
    type: 'crm_module_card',
    title: 'Users Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'users',
    href: '/user/manage',
    description: 'Team members and access',
    badge: 'Users'
  },
  {
    type: 'crm_module_card',
    title: 'Sales Module Card',
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    moduleKey: 'sales',
    href: '/sales',
    description: 'Sales automation and reporting',
    badge: 'Sales'
  },
  {
    type: 'kanban',
    title: 'Kanban Sales Pipeline Grid',
    w: 12,
    h: 8,
    minW: 8,
    minH: 5
  }
];