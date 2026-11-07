import { Node, Edge } from '@xyflow/react'

export type WorkflowStatus = 'Draft' | 'Active' | 'Paused' | 'Completed'

// CRM-wide Integration Modules
export type CRMWorkflowDomain =
  | 'marketing'
  | 'rengrowcure'
  | 'tasks'
  | 'calendar'
  | 'leads-capture'
  | 'global-crm'
  // Backward compatibility aliases
  | 'campaigns'
  | 'drip-campaigns'
  | 'content-engine'
  | 'social-accounts'

// High-level node types in modern n8n visual flow style
export type WorkflowNodeType = 'trigger' | 'action' | 'condition' | 'router'

// Concrete Subtypes spanning Marketing, RenGrowCure, Task Management, Calendar & Global CRM
export type CRMWorkflowNodeSubType =
  // --- MARKETING TRIGGERS & ACTIONS ---
  | 'Trigger-Campaign-Event'
  | 'Trigger-Drip-Step'
  | 'Trigger-Social-Engagement'
  | 'Trigger-Lead-Captured'
  | 'Trigger-Form-Submitted'
  | 'Trigger-Inbound-Webhook'
  | 'Action-Enroll-Drip-Campaign'
  | 'Action-Pause-Drip-Campaign'
  | 'Action-Trigger-Campaign-Blast'
  | 'Action-Send-Email'
  | 'Action-Send-SMS'
  | 'Action-Schedule-Social-Post'
  | 'Action-Publish-Content-Engine'
  | 'Action-Refresh-Social-Token'

  // --- RENGROWCURE (SALES & PIPELINE) ---
  | 'Trigger-RenGrowCure-Deal-Stage'
  | 'Trigger-LeadIntel-Score-Updated'
  | 'Trigger-Outreach-Reply-Received'
  | 'Action-RenGrowCure-Move-Stage'
  | 'Action-RenGrowCure-Enroll-Sequence'
  | 'Action-RenGrowCure-Assign-Distro'
  | 'Action-RenGrowCure-Update-Score'
  | 'Action-RenGrowCure-Create-Deal'

  // --- TASK MANAGEMENT ---
  | 'Trigger-Task-Completed'
  | 'Trigger-Task-Status-Changed'
  | 'Trigger-Task-Due-Date-Approaching'
  | 'Action-Create-Task'
  | 'Action-Assign-Task'
  | 'Action-Update-Task-Status'
  | 'Action-Log-Task-Activity'

  // --- CALENDAR ---
  | 'Trigger-Calendar-Event-Scheduled'
  | 'Trigger-Calendar-Event-Cancelled'
  | 'Trigger-Calendar-Reminder'
  | 'Action-Schedule-Calendar-Meeting'
  | 'Action-Update-Calendar-Event'
  | 'Action-Send-Meeting-Invite'

  // --- GLOBAL CRM & DATA ---
  | 'Trigger-Global-CRM'
  | 'Action-Sync-Global-CRM'
  | 'Action-Update-Lead-Status'
  | 'Action-Add-Tag'
  | 'Action-Webhook-POST'
  | 'Action-Notify-Team-Member'

  // --- LOGIC & FLOW CONTROL ---
  | 'Logic-Filter-Condition'
  | 'Logic-Delay-Wait'
  | 'Logic-AB-Split'

// Backward compatibility type alias
export type MarketingNodeSubType = CRMWorkflowNodeSubType
export type MarketingIntegrationDomain = CRMWorkflowDomain

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'is_set'

export interface ConditionRule {
  field: string
  operator: ConditionOperator
  value: string
}

// Node parameter data structure
export interface CRMNodeData extends Record<string, unknown> {
  label: string
  nodeType: WorkflowNodeType
  subType: CRMWorkflowNodeSubType | string
  domain: CRMWorkflowDomain
  description?: string
  icon?: string
  // Domain-specific configuration across CRM modules
  config: {
    // RenGrowCure (Pipeline & Leads)
    dealStage?: string
    dealPipeline?: string
    sequenceId?: string
    leadIntelScoreMin?: number
    assignedRep?: string
    dealValue?: number

    // Task Management
    taskTitle?: string
    taskPriority?: 'Low' | 'Medium' | 'High' | 'Urgent'
    taskDueDateOffsetDays?: number
    taskAssigneeId?: string
    taskStatus?: string

    // Calendar
    meetingTitle?: string
    meetingDurationMinutes?: number
    meetingType?: 'Consultation' | 'Sales Demo' | 'Follow-up' | 'Review'
    attendeeEmail?: string

    // Marketing Campaign Sync
    campaignId?: string
    campaignName?: string
    campaignChannel?: 'Email' | 'SMS' | 'Social' | 'Push' | 'Multi-Channel'
    // Drip Campaign Sync
    dripCampaignId?: string
    dripStepId?: string
    targetPersona?: string
    // Content Engine Sync
    contentId?: string
    caption?: string
    mediaType?: 'image' | 'video' | 'carousel'
    mediaUrl?: string
    // Social Accounts Sync
    socialAccountId?: string
    socialPlatform?: 'Facebook' | 'Instagram' | 'LinkedIn' | 'Google' | 'TikTok' | 'Twitter'
    publishImmediately?: boolean
    // Messaging & Webhook
    subject?: string
    templateId?: string
    sender?: string
    targetUrl?: string
    httpMethod?: 'GET' | 'POST' | 'PUT'
    // Logic & Routing
    delayMinutes?: number
    delayHours?: number
    rules?: ConditionRule[]
    // Global CRM Automation Bridge
    globalEventName?: string
    leadStatusToSet?: string
    customPayload?: string
  }
  // System Telemetry (computed automatically, cannot be spoofed)
  telemetry: {
    processedCount: number
    successCount: number
    failureCount: number
    efficiency: number // percentage 0 - 100
    lastExecutedAt?: number
    activeRunners?: number
  }
}

export type MarketingNodeData = CRMNodeData
export type WorkflowNode = Node<CRMNodeData, WorkflowNodeType>
export type WorkflowEdge = Edge

// Graph Definition
export interface WorkflowGraph {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  viewport?: { x: number; y: number; zoom: number }
}

// Complete Workflow Record
export interface Workflow {
  _id?: string
  workflow_name: string
  description?: string
  status: WorkflowStatus
  trigger_type: string
  action_type: string
  domain?: CRMWorkflowDomain
  // Real-time system calculated stats
  total_contacts: number
  processed_contacts: number
  successful_actions: number
  failed_actions: number
  automation_efficiency: number
  created_by: string
  created_date: number
  updated_date?: number
  notes?: string
  graph?: WorkflowGraph
}
