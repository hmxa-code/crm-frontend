import {
  Workflow,
  WorkflowGraph,
  WorkflowNode,
  WorkflowEdge,
} from '@/src/types/workflows/workflow'
import { MOCK_FALLBACK_CAMPAIGNS } from './marketing/CampaignsService'
import { MOCK_DRIP_CAMPAIGNS } from './marketing/DripCampaignsService'
import { ContentEngineService } from './marketing/ContentEngineService'
import { SocialAccountsService } from './marketing/SocialAccountsService'

// System telemetry calculation logic
export function computeWorkflowTelemetry(graph: WorkflowGraph): {
  processed: number
  success: number
  failed: number
  efficiency: number
} {
  let processed = 0
  let success = 0
  let failed = 0

  for (const node of graph.nodes) {
    if (node.data?.telemetry) {
      processed += node.data.telemetry.processedCount || 0
      success += node.data.telemetry.successCount || 0
      failed += node.data.telemetry.failureCount || 0
    }
  }

  const efficiency = processed > 0 ? Math.min(100, Math.round((success / processed) * 100)) : 100

  return { processed, success, failed, efficiency }
}

// Enterprise n8n-style Omni-CRM Orchestration Graph
export function createDefaultCRMGraph(): WorkflowGraph {
  const nodes: WorkflowNode[] = [
    {
      id: 'node-trigger-lead',
      type: 'trigger',
      position: { x: 80, y: 140 },
      data: {
        label: 'Inbound Lead Capturing',
        nodeType: 'trigger',
        subType: 'Trigger-Lead-Captured',
        domain: 'leads-capture',
        description: 'New high-intent lead lands via Marketing Form or Ad Campaign',
        config: {
          globalEventName: 'crm.lead.inbound_captured',
          targetPersona: 'Clinic Nutrition Buyers',
        },
        telemetry: {
          processedCount: 1840,
          successCount: 1840,
          failureCount: 0,
          efficiency: 100,
          lastExecutedAt: Date.now() - 1000 * 60 * 5,
        },
      },
    },
    {
      id: 'node-condition-score',
      type: 'condition',
      position: { x: 420, y: 140 },
      data: {
        label: 'LeadIntel Score & Persona Filter',
        nodeType: 'condition',
        subType: 'Logic-Filter-Condition',
        domain: 'rengrowcure',
        description: 'Checks if LeadIntel score > 50 and persona matches buyer tier',
        config: {
          rules: [
            { field: 'lead_score', operator: 'greater_than', value: '50' },
            { field: 'persona', operator: 'contains', value: 'Buyer' },
          ],
        },
        telemetry: {
          processedCount: 1840,
          successCount: 1420,
          failureCount: 420,
          efficiency: 77,
          lastExecutedAt: Date.now() - 1000 * 60 * 4,
        },
      },
    },
    {
      id: 'node-action-rengrowcure',
      type: 'action',
      position: { x: 780, y: 80 },
      data: {
        label: 'RenGrowCure Distro Engine',
        nodeType: 'action',
        subType: 'Action-RenGrowCure-Assign-Distro',
        domain: 'rengrowcure',
        description: 'Auto-route qualified lead into RenGrowCure Venture Matrix & Distro',
        config: {
          dealPipeline: 'Primary Medical Sales',
          dealStage: 'Qualified Lead',
          assignedRep: 'Dr. Sarah Patel',
        },
        telemetry: {
          processedCount: 1420,
          successCount: 1420,
          failureCount: 0,
          efficiency: 100,
          lastExecutedAt: Date.now() - 1000 * 60 * 3,
        },
      },
    },
    {
      id: 'node-action-task',
      type: 'action',
      position: { x: 1140, y: 80 },
      data: {
        label: 'Auto Task Management Generator',
        nodeType: 'action',
        subType: 'Action-Create-Task',
        domain: 'tasks',
        description: 'Auto-create high priority task in Task Workstation for account executive',
        config: {
          taskTitle: 'Urgent Initial Outreach & Assessment Consultation',
          taskPriority: 'High',
          taskDueDateOffsetDays: 1,
        },
        telemetry: {
          processedCount: 1420,
          successCount: 1410,
          failureCount: 10,
          efficiency: 99,
          lastExecutedAt: Date.now() - 1000 * 60 * 2,
        },
      },
    },
    {
      id: 'node-action-calendar',
      type: 'action',
      position: { x: 1500, y: 80 },
      data: {
        label: 'Calendar Demo Scheduler',
        nodeType: 'action',
        subType: 'Action-Schedule-Calendar-Meeting',
        domain: 'calendar',
        description: 'Reserve calendar invite slot & send meeting confirmation link',
        config: {
          meetingTitle: 'Personalized Wholcure CRM Discovery Call',
          meetingDurationMinutes: 30,
          meetingType: 'Sales Demo',
        },
        telemetry: {
          processedCount: 1410,
          successCount: 1395,
          failureCount: 15,
          efficiency: 99,
          lastExecutedAt: Date.now() - 1000 * 60 * 1,
        },
      },
    },
    {
      id: 'node-action-drip',
      type: 'action',
      position: { x: 780, y: 260 },
      data: {
        label: 'Marketing Nurture Drip Campaign',
        nodeType: 'action',
        subType: 'Action-Enroll-Drip-Campaign',
        domain: 'marketing',
        description: 'Nurture low-intent leads with 5-day educational sequences',
        config: {
          dripCampaignId: 'drip-1',
          targetPersona: 'All Inbound Leads',
        },
        telemetry: {
          processedCount: 420,
          successCount: 418,
          failureCount: 2,
          efficiency: 99,
          lastExecutedAt: Date.now() - 1000 * 60 * 4,
        },
      },
    },
  ]

  const edges: WorkflowEdge[] = [
    {
      id: 'edge-lead-condition',
      source: 'node-trigger-lead',
      target: 'node-condition-score',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2.5 },
    },
    {
      id: 'edge-cond-qualified',
      source: 'node-condition-score',
      target: 'node-action-rengrowcure',
      type: 'smoothstep',
      animated: true,
      label: 'Score > 50 (Qualified)',
      style: { stroke: '#10b981', strokeWidth: 2.5 },
    },
    {
      id: 'edge-rengrow-task',
      source: 'node-action-rengrowcure',
      target: 'node-action-task',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 2.5 },
    },
    {
      id: 'edge-task-calendar',
      source: 'node-action-task',
      target: 'node-action-calendar',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#f59e0b', strokeWidth: 2.5 },
    },
    {
      id: 'edge-cond-nurture',
      source: 'node-condition-score',
      target: 'node-action-drip',
      type: 'smoothstep',
      animated: true,
      label: 'Score ≤ 50 (Nurture)',
      style: { stroke: '#64748b', strokeWidth: 2 },
    },
  ]

  return { nodes, edges }
}

export const createDefaultMarketingGraph = createDefaultCRMGraph

// Initial Seed Workflows covering CRM-wide automation
export const INITIAL_MOCK_WORKFLOWS: Workflow[] = [
  {
    _id: 'wf-crm-omnichannel-1',
    workflow_name: 'Omni-CRM Lead-to-Sale Autopilot',
    description:
      'Unified CRM workflow: Captures marketing leads, checks RenGrowCure LeadIntel, creates task management work items, and books calendar consultations.',
    status: 'Active',
    trigger_type: 'Trigger-Lead-Captured',
    action_type: 'Action-Sync-Global-CRM',
    domain: 'global-crm',
    total_contacts: 1840,
    processed_contacts: 1840,
    successful_actions: 1812,
    failed_actions: 28,
    automation_efficiency: 98,
    created_by: 'Super Admin',
    created_date: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updated_date: Date.now() - 1000 * 60 * 45,
    graph: createDefaultCRMGraph(),
  },
  {
    _id: 'wf-rengrowcure-pipeline',
    workflow_name: 'RenGrowCure Deal Stage Sync & Task Dispatch',
    description:
      'Triggers when a RenGrowCure deal enters Venture Matrix, dispatches high-priority tasks to the team, and books review slots on Calendar.',
    status: 'Active',
    trigger_type: 'Trigger-RenGrowCure-Deal-Stage',
    action_type: 'Action-Create-Task',
    domain: 'rengrowcure',
    total_contacts: 620,
    processed_contacts: 620,
    successful_actions: 615,
    failed_actions: 5,
    automation_efficiency: 99,
    created_by: 'Super Admin',
    created_date: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updated_date: Date.now() - 1000 * 60 * 120,
  },
  {
    _id: 'wf-task-calendar-reminder',
    workflow_name: 'Task Management & Calendar Auto-Scheduler',
    description:
      'Monitors approaching task due dates, reschedules team meeting blocks in Calendar, and notifies stakeholders automatically.',
    status: 'Active',
    trigger_type: 'Trigger-Task-Due-Date-Approaching',
    action_type: 'Action-Schedule-Calendar-Meeting',
    domain: 'tasks',
    total_contacts: 410,
    processed_contacts: 410,
    successful_actions: 405,
    failed_actions: 5,
    automation_efficiency: 98,
    created_by: 'Alex Morgan',
    created_date: Date.now() - 1000 * 60 * 60 * 24 * 4,
    updated_date: Date.now() - 1000 * 60 * 15,
  },
  {
    _id: 'wf-marketing-omnichannel',
    workflow_name: 'Cross-Network Marketing Syndication',
    description:
      'Automated marketing distribution: Schedules social posts, activates drip campaigns, and synchronizes telemetry into Global CRM.',
    status: 'Draft',
    trigger_type: 'Trigger-Campaign-Event',
    action_type: 'Action-Publish-Content-Engine',
    domain: 'marketing',
    total_contacts: 890,
    processed_contacts: 890,
    successful_actions: 864,
    failed_actions: 26,
    automation_efficiency: 97,
    created_by: 'Sarah Jenkins',
    created_date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updated_date: Date.now() - 1000 * 60 * 180,
  },
]

const STORAGE_KEY = 'wholcure_crm_workflows_v2'

function getPersistedWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_WORKFLOWS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_WORKFLOWS))
      return INITIAL_MOCK_WORKFLOWS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse persisted workflows', err)
    return INITIAL_MOCK_WORKFLOWS
  }
}

function persistWorkflows(workflows: Workflow[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
    window.dispatchEvent(new Event('wholcure_workflows_updated'))
  } catch (err) {
    console.error('Failed to save workflows to localStorage', err)
  }
}

export const WorkflowsService = {
  async getAllWorkflows(): Promise<Workflow[]> {
    return Promise.resolve(getPersistedWorkflows())
  },

  async getWorkflowById(id: string): Promise<Workflow | null> {
    const list = getPersistedWorkflows()
    const found = list.find((w) => w._id === id)
    if (!found) return Promise.resolve(null)

    if (!found.graph) {
      found.graph = createDefaultCRMGraph()
    }
    return Promise.resolve({ ...found })
  },

  // Helpers to fetch linked CRM domain records to populate dropdowns in the visual builder
  async getMarketingDomainRecords() {
    const [campaigns, dripCampaigns, contentItems, socialAccounts] = await Promise.all([
      Promise.resolve(MOCK_FALLBACK_CAMPAIGNS),
      Promise.resolve(MOCK_DRIP_CAMPAIGNS),
      ContentEngineService.getAllContent().catch(() => []),
      SocialAccountsService.getConnectedAccounts().catch(() => []),
    ])

    return {
      campaigns,
      dripCampaigns,
      contentItems,
      socialAccounts,
      dealPipelines: [
        { id: 'primary', name: 'Primary Medical Sales Pipeline' },
        { id: 'enterprise', name: 'Enterprise Healthcare Deal Matrix' },
        { id: 'partners', name: 'Strategic Health Partners' },
      ],
      dealStages: [
        { id: 'lead_intel', name: 'LeadIntel Scored' },
        { id: 'distro_assigned', name: 'Distro Assigned' },
        { id: 'venture_matrix', name: 'Venture Matrix Active' },
        { id: 'outreach', name: 'Outreach Sequence' },
        { id: 'chronos_followup', name: 'Chronos Scheduled' },
        { id: 'won', name: 'Closed Won' },
      ],
      taskPriorities: ['Low', 'Medium', 'High', 'Urgent'],
      calendarMeetingTypes: ['Consultation', 'Sales Demo', 'Follow-up', 'Clinical Review'],
    }
  },

  async createWorkflow(payload: {
    workflow_name: string
    description?: string
    trigger_type?: string
    action_type?: string
    domain?: any
    graph?: WorkflowGraph
  }): Promise<Workflow> {
    const list = getPersistedWorkflows()
    const graph = payload.graph || createDefaultCRMGraph()
    const telemetry = computeWorkflowTelemetry(graph)

    const newWorkflow: Workflow = {
      _id: 'wf_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      workflow_name: payload.workflow_name || 'Untitled Automation Flow',
      description: payload.description || 'Omni-CRM visual orchestration workflow',
      status: 'Draft',
      trigger_type: payload.trigger_type || 'Trigger-Lead-Captured',
      action_type: payload.action_type || 'Action-Sync-Global-CRM',
      domain: payload.domain || 'global-crm',
      total_contacts: 0,
      processed_contacts: telemetry.processed,
      successful_actions: telemetry.success,
      failed_actions: telemetry.failed,
      automation_efficiency: telemetry.efficiency,
      created_by: 'Current User',
      created_date: Date.now(),
      updated_date: Date.now(),
      graph,
    }

    const updatedList = [newWorkflow, ...list]
    persistWorkflows(updatedList)
    return Promise.resolve(newWorkflow)
  },

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const list = getPersistedWorkflows()
    const found = list.find((item) => item._id === id)
    if (!found) throw new Error('Workflow not found')

    let computedMetrics = {}
    if (updates.graph) {
      const { processed, success, failed, efficiency } = computeWorkflowTelemetry(updates.graph)
      computedMetrics = {
        processed_contacts: processed,
        successful_actions: success,
        failed_actions: failed,
        automation_efficiency: efficiency,
      }
    }

    const updatedWorkflow: Workflow = {
      ...found,
      ...updates,
      ...computedMetrics,
      updated_date: Date.now(),
    }

    const updatedList = list.map((item) => (item._id === id ? updatedWorkflow : item))
    persistWorkflows(updatedList)
    return Promise.resolve(updatedWorkflow)
  },

  async deleteWorkflow(id: string): Promise<boolean> {
    const list = getPersistedWorkflows()
    const filtered = list.filter((item) => item._id !== id)
    persistWorkflows(filtered)
    return Promise.resolve(true)
  },

  async duplicateWorkflow(id: string): Promise<Workflow> {
    const source = await this.getWorkflowById(id)
    if (!source) throw new Error('Source workflow not found')

    return this.createWorkflow({
      workflow_name: `${source.workflow_name} (Copy)`,
      description: source.description,
      trigger_type: source.trigger_type,
      action_type: source.action_type,
      domain: source.domain,
      graph: source.graph ? JSON.parse(JSON.stringify(source.graph)) : createDefaultCRMGraph(),
    })
  },
}
