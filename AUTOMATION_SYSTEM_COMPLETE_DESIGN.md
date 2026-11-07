# CRM Automation System — Complete Architecture & Design Document

> **Version**: 1.0  
> **Last Updated**: April 2026  
> **Status**: Reference Architecture Document  
> **Scope**: Full-stack automation (Backend Engine + Frontend Workflow Builder + Integration Layer)

---

## 📑 Table of Contents

1. [System Overview](#1-system-overview)
2. [High-Level Automation Flow (Backend ↔ Frontend)](#2-high-level-automation-flow)
3. [Automation Engine Core Architecture](#3-automation-engine-core-architecture)
4. [Supported Automation Modules](#4-supported-automation-modules)
5. [Detailed Backend Architecture](#5-detailed-backend-architecture)
6. [Detailed Frontend Architecture](#6-detailed-frontend-architecture)
7. [Workflow Engine — Event → Condition → Action Pipeline](#7-workflow-engine-pipeline)
8. [Lead Scoring Engine](#8-lead-scoring-engine)
9. [Routing Rules Engine](#9-routing-rules-engine)
10. [Follow-up Sequences Engine](#10-follow-up-sequences-engine)
11. [Drip Campaigns Engine](#11-drip-campaigns-engine)
12. [Task Automation Engine](#12-task-automation-engine)
13. [Complete Folder Structure](#13-complete-folder-structure)
14. [API Endpoints Matrix](#14-api-endpoints-matrix)
15. [Database Schema — All Collections](#15-database-schema)
16. [Event Bus & Webhook System](#16-event-bus--webhook-system)
17. [Execution Flow Diagrams](#17-execution-flow-diagrams)
18. [Security & RBAC Integration](#18-security--rbac-integration)
19. [Implementation Roadmap](#19-implementation-roadmap)
20. [Testing Strategy](#20-testing-strategy)

---

## 1. System Overview

### What is this Automation System?

The CRM Automation System is a **rule-based event-driven automation engine** that allows businesses to automate repetitive sales, marketing, and operational tasks. It follows the **IF-THEN-ELSE** paradigm:

```
WHEN (Event/Trigger happens)  
IF (Conditions match)  
THEN (Execute Actions)  
ELSE (Optional fallback actions)
```

### Key Capabilities

| Capability | Description |
|---|---|
| **Workflow Automation** | Multi-step workflows with triggers, conditions, and actions |
| **Lead Scoring** | Automatic lead qualification based on behavior, demographics, engagement |
| **Routing Rules** | Auto-assign leads/opportunities to users/teams (round-robin, least-busy) |
| **Follow-up Sequences** | Timed multi-channel outreach sequences (email → SMS → call → task) |
| **Drip Campaigns** | Scheduled email/SMS sequences for lead nurturing |
| **Task Automation** | Auto-create tasks with due dates, priority, and assignment |
| **Activity Logging** | Auto-log all automated actions for audit and analytics |

### Tech Stack

| Layer | Technology |
|---|---|
| **Backend Runtime** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Frontend** | Next.js (App Router) + TypeScript |
| **Styling** | Tailwind CSS |
| **API Client** | Custom `apiRequest` wrapper (fetch-based) |
| **Auth** | JWT + RBAC (Role-Based Access Control) |

---

## 2. High-Level Automation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                                  │
│                                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ Workflow    │  │ Lead Scoring │  │ Routing    │  │ Follow-up        │   │
│  │ Builder UI  │  │ Config UI    │  │ Rules UI   │  │ Sequences UI     │   │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  └────────┬─────────┘   │
│         │                │                 │                  │             │
│  ┌──────┴────────────────┴─────────────────┴──────────────────┴─────────┐  │
│  │                    Service Layer (TypeScript)                         │  │
│  │  WorkflowsService  │  LeadScoringService  │  RoutingRulesService     │  │
│  │  SequencesService  │  CampaignsService     │  AutomatedTasksService  │  │
│  └──────────────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────────┘
                                  │  HTTP REST (JSON)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Express.js)                                │
│                                                                             │
│  ┌──────────────┐    ┌────────────────────┐    ┌────────────────────────┐   │
│  │  Routes       │───▶│  Controllers       │───▶│  Services             │   │
│  │  (REST API)   │    │  (Request/Response)│    │  (Business Logic)     │   │
│  └──────────────┘    └────────────────────┘    └───────────┬────────────┘   │
│                                                            │                │
│  ┌─────────────────────────────────────────────────────────┴───────────┐   │
│  │                    AUTOMATION ENGINE (Core)                          │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌────────────────┐  ┌────────────────────────┐   │   │
│  │  │ Event Bus    │──▶│ Condition      │──▶│ Action Executor       │   │   │
│  │  │ (Triggers)   │  │ Evaluator      │  │ (Email/SMS/Task/... )  │   │   │
│  │  └──────────────┘  └────────────────┘  └────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    MongoDB Database                                    │   │
│  │  workflows  │  leadScores  │  routingRules  │  sequences  │  tasks   │   │
│  │  campaigns  │  activityLogs│  dripCampaigns │  ...                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Automation Engine Core Architecture

### 3.1 Core Engine Components

```
src/core/automation-engine/
├── engine.js                         # Main engine orchestrator
├── event-bus.js                      # Event emitter/listener system
├── scheduler.js                      # Cron-based & time-based scheduler
├── webhook-handler.js                # External webhook receiver
├── evaluators/
│   ├── condition.evaluator.js        # IF/THEN/ELSE condition matcher
│   ├── scoring.evaluator.js          # Lead score calculator
│   └── time.evaluator.js             # Time-based condition checker
├── executors/
│   ├── email.executor.js             # Send email via provider
│   ├── sms.executor.js               # Send SMS via provider
│   ├── task.executor.js              # Create/update tasks
│   ├── tag.executor.js               # Add/remove tags
│   ├── scoring.executor.js           # Update lead scores
│   ├── routing.executor.js           # Assign leads to users/teams
│   ├── webhook.executor.js           # Call external webhooks
│   └── notification.executor.js      # In-app notifications
└── helpers/
    ├── logger.js                     # Execution audit logger
    ├── retry.js                      # Retry logic for failed actions
    └── rate-limiter.js               # Rate limiting for actions
```

### 3.2 Engine Execution Pipeline

```
┌──────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌──────────┐
│  TRIGGER  │───▶│  EVENT BUS │───▶│  CONDITION │───▶│   ACTION   │───▶│   LOG    │
│  Detected │    │  Dispatched│    │  Evaluator │    │  Executor  │    │  Result  │
└──────────┘    └────────────┘    └────────────┘    └────────────┘    └──────────┘
     │                │                 │                 │                │
     ▼                ▼                 ▼                 ▼                ▼
  Lead Created    Find Active       Check IF         Execute THEN      Log success/
  Email Opened    Workflows        Conditions        Action            failure
  Score Changed   Matching Event   Match?            (Send email,      Update stats
                                    Yes/No            Create task...)
```

---

## 4. Supported Automation Modules

The system supports **6 major automation modules**, each with its own engine and UI:

| # | Module | Backend Engine | Frontend UI | Purpose |
|---|---|---|---|---|
| 1 | **Workflows** | `marketing/workflows` | `WorkflowBuilder.tsx` | Multi-step IF-THEN automation |
| 2 | **Lead Scoring** | `marketing/lead-scoring` + `sales/lead-scoring` | `LeadScoringConfig.tsx` | Auto-qualify leads |
| 3 | **Routing Rules** | `sales/routing-rules` | `RoutingRulesBuilder.tsx` | Auto-assign leads |
| 4 | **Follow-up Sequences** | `sales/sequences` | `SequenceBuilder.tsx` | Timed multi-channel outreach |
| 5 | **Drip Campaigns** | `marketing/drip-campaigns` | `DripSequenceBuilder.tsx` | Email/SMS nurturing sequences |
| 6 | **Automated Tasks** | `sales/tasks` | `AutomatedTasksView.tsx` | Auto-create & manage tasks |

---

## 5. Detailed Backend Architecture

### 5.1 Current Backend Structure (Nodes)

```
backend/
├── app.js                                    # Express app setup, route mounting
├── server.js                                 # MongoDB connect + server start
├── package.json
│
├── src/
│   ├── core/
│   │   ├── automation-engine/                # *** CORE ENGINE (To be built) ***
│   │   │   ├── engine.js                     # Orchestrator
│   │   │   ├── evaluators/                   # Condition evaluators
│   │   │   └── executors/                    # Action executors
│   │   ├── database/                         # DB connection config
│   │   └── rbac/                             # Role-based access control
│   │       ├── constants/
│   │       ├── helpers/
│   │       └── middlewares/
│   │
│   └── modules/
│       ├── auth/                             # Authentication module
│       ├── users/                            # Users & Roles
│       ├── companies/                        # Companies module
│       ├── opportunities/                    # Sales opportunities
│       │
│       ├── marketing/                        # Marketing Automation
│       │   ├── controllers/
│       │   │   ├── campaigns.controller.js
│       │   │   ├── drip-campaigns.controller.js
│       │   │   ├── lead-scoring.controller.js
│       │   │   ├── workflows.controller.js
│       │   │   └── ...
│       │   ├── models/
│       │   │   ├── campaign.model.js
│       │   │   ├── workflow.model.js
│       │   │   ├── leads.model.js
│       │   │   ├── lead-scoring.model.js
│       │   │   └── drip-campaign.model.js
│       │   ├── services/
│       │   │   ├── campaigns.service.js
│       │   │   ├── workflows.service.js
│       │   │   ├── lead-scoring.service.js
│       │   │   └── drip-campaigns.service.js
│       │   └── routes/
│       │
│       ├── sales/                            # Sales Automation
│       │   ├── controllers/
│       │   │   ├── routing-rules.controller.js
│       │   │   ├── follow-up-sequence.controller.js
│       │   │   ├── automated-tasks.controller.js
│       │   │   ├── lead-scoring-sales.controller.js
│       │   │   └── activity-log.controller.js
│       │   ├── models/
│       │   │   ├── routing-rules.model.js
│       │   │   ├── follow-up-sequence.model.js
│       │   │   ├── automated-tasks.model.js
│       │   │   ├── lead-scoring-sales.model.js
│       │   │   └── activity-log.model.js
│       │   ├── services/
│       │   │   ├── routing-rules.service.js
│       │   │   ├── follow-up-sequence.service.js
│       │   │   ├── automated-tasks.service.js
│       │   │   └── lead-scoring-sales.service.js
│       │   └── routes/
│       │
│       ├── automation/                       # *** DEDICATED AUTOMATION MODULE ***
│       │   ├── workflows/                    # Centralized workflow engine API
│       │   ├── sequences/                    # Sequence management
│       │   └── routing-rules/                # Routing rules engine
│       │
│       └── real-estate/                      # Real Estate (existing)
│
├── shared/
│   ├── mail/                                 # Email service (SendGrid/Mailgun)
│   ├── sms/                                  # SMS service (Twilio)
│   └── storage/                              # File storage
```

### 5.2 Backend Service Pattern (Consistent)

Every module follows this exact pattern:

```javascript
// Model
const Schema = new mongoose.Schema({...}, { timestamps: true });
export const Model = mongoose.model('Name', Schema);

// Service
export const Service = {
    async getAll() { return await Model.find().sort({ createdAt: -1 }); },
    async getById(id) { return await Model.findById(id); },
    async create(data) { const doc = new Model(data); return await doc.save(); },
    async update(id, data) { return await Model.findByIdAndUpdate(id, data, { new: true }); },
    async delete(id) { await Model.findByIdAndDelete(id); return { success: true }; }
};

// Controller
export const Controller = {
    async getAll(req, res) { try { ... } catch(error) { ... } },
    async create(req, res) { try { ... } catch(error) { ... } },
    // ... same pattern for all CRUD
};

// Routes
const router = Router();
router.get('/', Controller.getAll);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);
```

---

## 6. Detailed Frontend Architecture

### 6.1 Current Frontend Structure

```
frontned/
├── app/(dashboard)/
│   └── marketing/                           # Marketing UI pages
│       ├── workflows/                       # Workflow builder pages
│       ├── campaigns/                       # Campaign management
│       ├── drip-campaigns/                  # Drip campaign pages
│       ├── lead-scoring/                    # Lead scoring pages
│       └── analytics/                       # Analytics dashboards
│
├── src/
│   ├── api/
│   │   └── client.ts                        # Centralized API client (fetch wrapper)
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── marketing/                   # Marketing UI components
│   │       │   ├── CampaignBuilder.tsx
│   │       │   ├── WorkflowBuilder.tsx
│   │       │   ├── LeadScoringConfig.tsx
│   │       │   ├── DripSequenceBuilder.tsx
│   │       │   ├── SocialMediaConnector.tsx
│   │       │   └── AnalyticsDashboard.tsx
│   │       └── sales/                       # Sales UI components
│   │           ├── RoutingRulesBuilder.tsx
│   │           ├── SequenceBuilder.tsx
│   │           ├── AutomatedTasksView.tsx
│   │           └── ActivityLogView.tsx
│   │
│   ├── services/                            # Frontend service layer
│   │   ├── marketing/
│   │   │   ├── CampaignsService.ts
│   │   │   ├── WorkflowsService.ts
│   │   │   ├── LeadScoringService.ts
│   │   │   ├── DripCampaignsService.ts
│   │   │   ├── SocialPostsService.ts
│   │   │   └── SocialIntegrationService.ts
│   │   └── sales/
│   │       ├── RoutingRulesService.ts
│   │       ├── SequenceService.ts
│   │       ├── SalesLeadScoringService.ts
│   │       ├── tasksService.ts
│   │       └── ActivityLogService.ts
│   │
│   ├── types/
│   │   └── index.ts                        # Shared TypeScript types
│   └── constants/
│       ├── permissions.ts                   # Permission constants
│       └── roles.ts                         # Role constants
```

### 6.2 Frontend Service Pattern (Consistent)

```typescript
// Every service follows this exact pattern:
export const SomeService = {
  getAll: async (): Promise<Type[]> => {
    const res = await apiRequest('/api/path', { method: 'GET' });
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    return [];
  },

  getById: async (id: string): Promise<Type | null> => {
    const res = await apiRequest(`/api/path/${id}`, { method: 'GET' });
    return res?.data ? res.data : res;
  },

  create: async (data: Partial<Type>): Promise<Type> => {
    return apiRequest('/api/path', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, updates: Partial<Type>): Promise<Type | null> => {
    return apiRequest(`/api/path/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest(`/api/path/${id}`, { method: 'DELETE' });
    return true;
  }
};
```

---

## 7. Workflow Engine Pipeline

### 7.1 Workflow Data Model (Backend)

```javascript
// backend/src/modules/marketing/models/workflow.model.js
{
  workflow_name: String,           // "Lead Nurture Workflow"
  description: String,             // "Nurtures leads through..."
  status: 'Active' | 'Paused' | 'Draft' | 'Completed',
  
  // TRIGGER
  trigger_type: 'Lead-Creation' | 'Form-Submission' | 'Tag-Added' 
              | 'Time-Based' | 'Custom' | 'Opportunity-Stage-Changed',
  
  // ACTION
  action_type: 'Email' | 'SMS' | 'Task' | 'Tag' | 'Multi-Step',
  
  // STATS (auto-updated)
  total_contacts: Number,
  processed_contacts: Number,
  successful_actions: Number,
  failed_actions: Number,
  automation_efficiency: Number,     // successful / total * 100
}
```

### 7.2 Enhanced Workflow Model (Recommended)

For a true IF-THEN engine, the workflow model should be enhanced:

```javascript
// RECOMMENDED: Enhanced Workflow Model
{
  workflow_name: String,
  description: String,
  status: 'Active' | 'Paused' | 'Draft' | 'Archived',
  
  // TRIGGER
  trigger: {
    type: 'lead_created' | 'lead_scored' | 'email_opened' | 'email_clicked'
        | 'form_submitted' | 'meeting_booked' | 'opportunity_stage_changed'
        | 'time_scheduled' | 'webhook_received' | 'tag_added',
    config: {                     // Trigger-specific config
      delayMinutes: Number,       // Optional delay before triggering
      schedule: String,           // Cron expression for time-based
      field: String,              // Field to watch for changes
      value: Mixed                // Expected value
    }
  },
  
  // CONDITIONS (IF)
  conditions: {
    matchType: 'ALL' | 'ANY',    // AND/OR logic
    rules: [{
      field: String,              // e.g., 'lead.score', 'lead.source'
      operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' 
              | 'contains' | 'not_contains' | 'in' | 'not_in' | 'is_set',
      value: Mixed                // Comparison value
    }]
  },
  
  // ACTIONS (THEN)
  actions: [{
    type: 'send_email' | 'send_sms' | 'create_task' | 'add_tag' 
        | 'update_lead_score' | 'change_lead_status' | 'assign_to_user'
        | 'assign_to_team' | 'start_sequence' | 'stop_sequence'
        | 'create_opportunity' | 'call_webhook' | 'send_notification',
    config: {                     // Action-specific config
      templateId: String,
      subject: String,
      body: String,
      userId: String,
      teamId: String,
      taskTitle: String,
      priority: String,
      dueDate: Number,
      webhookUrl: String,
      delayMinutes: Number        // Delay before this action
    },
    order: Number                 // Execution order
  }],
  
  // ELSE ACTIONS (optional fallback)
  elseActions: [{ ...same structure as actions... }],
  
  // STOP CONDITIONS
  stopConditions: ['lead_converted', 'meeting_booked', 'unsubscribed'],
  
  // EXECUTION STATS
  stats: {
    totalTriggered: Number,
    totalProcessed: Number,
    totalSucceeded: Number,
    totalFailed: Number,
    lastExecutedAt: Date
  }
}
```

### 7.3 Workflow Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WORKFLOW ENGINE EXECUTION                        │
│                                                                      │
│  STEP 1: TRIGGER DETECTION                                           │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Event occurs: Lead Created / Email Opened / Form Submitted     │ │
│  │ System publishes event to Event Bus                             │ │
│  │ Event Bus finds ALL ACTIVE workflows matching this trigger      │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                   │                                  │
│                                   ▼                                  │
│  STEP 2: CONDITION EVALUATION                                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ For each matched workflow:                                      │ │
│  │   IF conditions.matchType === 'ALL':  ALL rules must pass       │ │
│  │   IF conditions.matchType === 'ANY':  ANY rule can pass         │ │
│  │   For each rule:                                                │ │
│  │     Extract field value from context (lead, opportunity, etc.)  │ │
│  │     Compare using operator (eq, gt, lt, contains, etc.)         │ │
│  │     Return true/false                                           │ │
│  │   Overall: true → execute THEN actions                          │ │
│  │            false → execute ELSE actions (if defined)            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                   │                                  │
│                                   ▼                                  │
│  STEP 3: ACTION EXECUTION                                            │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Sort actions by order                                           │ │
│  │ For each action:                                                │ │
│  │   IF action has delayMinutes: schedule for later                │ │
│  │   ELSE: execute immediately                                     │ │
│  │   Dispatch to appropriate executor:                             │ │
│  │     • EmailExecutor → Send email via SendGrid/Mailgun           │ │
│  │     • SMSExecutor   → Send SMS via Twilio                       │ │
│  │     • TaskExecutor  → Create task in database                   │ │
│  │     • TagExecutor   → Add/remove tag on lead                    │ │
│  │     • ScoreExecutor → Update lead score                         │ │
│  │     • RouteExecutor → Assign lead to user/team                  │ │
│  │     • WebhookExecutor → Call external URL                       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                   │                                  │
│                                   ▼                                  │
│  STEP 4: LOGGING & STATS UPDATE                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Log execution to Activity Log (lead_id, workflow_id, action,    │ │
│  │   status, timestamp, error_message)                             │ │
│  │ Update workflow stats: total_contacts++,                        │ │
│  │   successful_actions++ or failed_actions++                      │ │
│  │ Recalculate automation_efficiency                                │ │
│  │ IF all steps complete: update last_executed                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Lead Scoring Engine

### 8.1 How it Works

```
┌──────────────┐    ┌───────────────────┐    ┌──────────────────┐
│  Lead Event   │───▶│  Scoring Engine    │───▶│  Score & Grade   │
│  (Created/    │    │                    │    │  Calculated      │
│   Updated/    │    │  ┌─────────────┐   │    │                  │
│   Activity)   │    │  │ Source      │   │    │  Total Score =   │
└──────────────┘    │  │ Weights     │   │    │  Engagement +    │
                    │  │ (10-20 pts) │   │    │  Behavioral +    │
                    │  └─────────────┘   │    │  Demographic     │
                    │  ┌─────────────┐   │    │                  │
                    │  │ Engagement   │   │    │  Grade:          │
                    │  │ Weights      │   │    │  A: 80-100      │
                    │  │ (5-15 pts)  │   │    │  B: 60-79       │
                    │  └─────────────┘   │    │  C: 40-59       │
                    │  ┌─────────────┐   │    │  D: 20-39       │
                    │  │ Behavioral   │   │    │  F: 0-19        │
                    │  │ Weights      │   │    │                  │
                    │  │ (2-20 pts)  │   │    │  Status:         │
                    │  └─────────────┘   │    │  Hot: ≥70        │
                    │  ┌─────────────┐   │    │  Warm: 40-69     │
                    │  │ Demographic  │   │    │  Cold: 20-39     │
                    │  │ Weights      │   │    │  Inactive: <20   │
                    │  │ (3-10 pts)  │   │    │                  │
                    │  └─────────────┘   │    └──────────────────┘
                    └───────────────────┘
```

### 8.2 Scoring Configuration Model

```javascript
{
  model_name: String,
  status: 'Active' | 'Inactive',
  
  // Weight Categories
  lead_source_weights: {
    facebook: 10, instagram: 8, linkedin: 12,
    google_ads: 15, referral: 20, organic: 5,
    webinar: 18, event: 15, cold_call: 3
  },
  
  engagement_weights: {
    email_open: 5, email_click: 10, sms_response: 8,
    form_submission: 15, demo_request: 20,
    meeting_booked: 25, webinar_attended: 15
  },
  
  behavioral_weights: {
    page_view: 2, time_on_site: 3, content_download: 8,
    pricing_page_view: 10, feature_page_view: 8,
    case_study_view: 6, testimonial_view: 4,
    support_ticket: -5  // Negative score for support tickets
  },
  
  demographic_weights: {
    company_size_large: 10, company_size_medium: 5,
    industry_tech: 8, industry_finance: 10,
    job_title_cxo: 15, job_title_manager: 8,
    location_target: 5
  },
  
  total_possible_score: Number,           // Sum of max possible
  sales_ready_threshold: 60              // Score needed for SQL
}
```

### 8.3 Scoring Execution

```
Lead Activity Occurs
       │
       ▼
Fetch Active Scoring Model
       │
       ▼
Calculate Score:
  ┌─────────────────────────────────────────────────────┐
  │ score = 0                                           │
  │                                                     │
  │ // 1. Source Score                                  │
  │ score += lead_source_weights[lead.source] || 0      │
  │                                                     │
  │ // 2. Engagement Score                              │
  │ score += email_opens * engagement_weights.email_open │
  │ score += link_clicks * engagement_weights.email_click│
  │ score += form_submissions * engagement_weights.form  │
  │ score += demo_requests * engagement_weights.demo     │
  │                                                     │
  │ // 3. Behavioral Score                              │
  │ score += page_views * behavioral_weights.page_view   │
  │ score += downloads * behavioral_weights.download     │
  │                                                     │
  │ // 4. Demographic Score                             │
  │ if (lead.company_size === 'enterprise')             │
  │   score += demographic_weights.company_size_large   │
  │ if (lead.industry === 'technology')                 │
  │   score += demographic_weights.industry_tech        │
  └─────────────────────────────────────────────────────┘
       │
       ▼
Update Lead:
  - total_score = calculated score
  - grade = A/B/C/D/F based on percentage
  - status = Hot/Warm/Cold/Inactive based on score
       │
       ▼
Emit Event: 'lead_scored' with { lead_id, score, grade }
       │
       ▼
This triggers Workflow Engine → Routing Rules → Sequences
```

---

## 9. Routing Rules Engine

### 9.1 How it Works

```
Lead reaches SQL status OR matches routing condition
       │
       ▼
Fetch ACTIVE Routing Rules sorted by priority
       │
       ▼
For each rule, evaluate conditions:
  ┌────────────────────────────────────────────┐
  │ Rule Example:                              │
  │ IF lead.score > 70                         │
  │ AND lead.industry === 'technology'         │
  │ THEN assign_to_team 'Enterprise Sales'     │
  │ USING round_robin distribution             │
  └────────────────────────────────────────────┘
       │
       ▼
Assign to target:

  round_robin:  Distribute evenly among team members
  least_busy:   Assign to member with fewest active leads
       │
       ▼
Update lead.assigned_to = userId
Create notification for assignee
Log activity: "Lead assigned via routing rule X"
```

### 9.2 Routing Rule Model

```javascript
{
  ruleName: String,
  status: 'Active' | 'Inactive',
  
  conditions: [{
    field: String,         // 'current_score', 'industry', 'lead_source'
    operator: 'gt' | 'lt' | 'eq' | 'contains',
    value: Mixed
  }],
  
  action: 'assign_to_user' | 'assign_to_team',
  targetUserId: String,         // If direct assignment
  targetTeamId: String,         // If team assignment
  assignmentMode: 'round_robin' | 'least_busy',
  
  priority: Number              // Higher priority evaluated first
}
```

---

## 10. Follow-up Sequences Engine

### 10.1 How it Works

```
Lead reaches SQL / SAL status
       │
       ▼
Enroll in matching ACTIVE sequence
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│ SEQUENCE TIMELINE                                                     │
│                                                                       │
│ Day 0 ─── Email: "Welcome, let's schedule a demo"                    │
│            └─ IF clicked → Move to Step 2 (skip delay)               │
│                                                                       │
│ Day 1 ─── SMS: "Did you see our demo invitation?"                    │
│            └─ IF replied → Stop sequence, notify sales rep           │
│                                                                       │
│ Day 3 ─── Call Task: "Follow up call - demo interest"                │
│            └─ IF completed → Continue to next step                   │
│                                                                       │
│ Day 5 ─── Email: "Case study - how X achieved 200% growth"           │
│            └─ IF meeting booked → Stop entire sequence               │
│                                                                       │
│ Day 7 ─── Final Email: "Last chance to connect"                      │
│            └─ IF no response → Mark lead as 'Cold'                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Sequence Model

```javascript
{
  sequence_name: String,
  description: String,
  status: 'Active' | 'Paused',
  
  trigger_event: String,           // 'Lead_SQL_Entered', 'Lead_SAL'
  trigger_condition: {             // Optional additional conditions
    score: { gt: 70 },
    industry: { in: ['tech', 'finance'] }
  },
  
  steps: [{
    order: 1,
    channel: 'email' | 'sms' | 'call' | 'task',
    delayDays: 0,                  // Delay from previous step
    delayHours: 0,                 // Additional hour delay
    contentTemplateId: String,     // Email/SMS template
    stepTitle: String,             // "Welcome email"
    conditions: {                  // Optional: skip if condition met
      if_clicked: 'skip_delay',
      if_replied: 'stop_sequence'
    }
  }],
  
  stop_conditions: [
    'Meeting_Booked',
    'Lead_Converted',
    'Unsubscribed',
    'Manual_Stop'
  ]
}
```

---

## 11. Drip Campaigns Engine

### 11.1 How it Works

```
Lead added to Drip Campaign
       │
       ▼
Campaign has sequence of N emails/SMS
       │
       ▼
Email 1: Day 0 → Send Welcome Email
  └─ Track: opened? clicked? bounced?
       │
       ▼
Email 2: Day 3 → Send Product Overview
  └─ IF clicked → Skip to Email 4 (case study)
  └─ IF bounced → Remove from campaign
       │
       ▼
Email 3: Day 7 → Send Case Study
  └─ IF opened → Send follow-up with CTA
       │
       ▼
Email 4: Day 14 → Send Special Offer
  └─ IF converted → Mark campaign complete for lead
       │
       ▼
Email 5: Day 21 → Final Follow-up
  └─ IF no action → Mark lead as 'Cold'
```

### 11.2 Drip Campaign Model

```javascript
{
  campaign_name: String,
  status: 'Active' | 'Paused' | 'Completed' | 'Draft',
  
  trigger_type: 'Time-Based' | 'Event-Based' | 'Behavior-Based',
  frequency: '1 day' | '3 days' | '1 week' | '2 weeks' | 'Custom',
  
  // Stats (auto-updated)
  total_sequences: Number,          // Total emails in sequence
  active_contacts: Number,          // Currently in campaign
  completed_contacts: Number,       // Completed all steps
  opened_emails: Number,
  clicked_links: Number,
  converted_contacts: Number,
  
  start_date: Number,
  last_sent: Number
}
```

---

## 12. Task Automation Engine

### 12.1 How it Works

```
Automated Task Creation Triggers:
  • Lead reaches SQL → Create "Initial outreach" task for assigned AE
  • No response after 48h → Create "Follow-up call" task
  • Meeting booked → Create "Send proposal" task
  • Opportunity stage changes → Create stage-specific task
  • Lead goes cold → Create "Re-engagement" task

Task Lifecycle:
  Created (Open) → Assigned → In Progress → Done / Cancelled
                                              │
                                              ▼
                                        IF Done → Check next automated step
                                        IF Cancelled → Log reason, notify manager
```

### 12.2 Automated Task Model

```javascript
{
  task_id: String,                   // Auto-generated unique ID
  opportunity_id: String,            // Related opportunity (optional)
  lead_id: String,                   // Related lead (optional)
  assigned_to: String,               // User ID
  task_title: String,                // "Follow-up call with John"
  due_date: Date,                    // Calculated based on trigger
  status: 'Open' | 'Done' | 'Cancelled' | 'Paused',
  priority: 'Low' | 'Med' | 'High',
  source: 'automation_rule' | 'manual' | 'sequence',
  source_rule_id: String,            // Which workflow/rule created it
  completed_at: Date,
  notes: String
}
```

---

## 13. Complete Folder Structure

```
CRM-WORK/
│
├── AUTOMATION_SYSTEM_COMPLETE_DESIGN.md        ← YOU ARE HERE
│
├── backend/
│   ├── app.js                                     # Express app entry
│   ├── server.js                                  # Server bootstrap
│   ├── package.json
│   │
│   └── src/
│       ├── core/
│       │   ├── automation-engine/                  *** CORE ENGINE ***
│       │   │   ├── engine.js                       # Main orchestrator
│       │   │   ├── event-bus.js                    # Event emitter/listener
│       │   │   ├── scheduler.js                    # Cron & time-based
│       │   │   ├── webhook-handler.js              # External triggers
│       │   │   │
│       │   │   ├── evaluators/                     *** CONDITION EVALUATORS ***
│       │   │   │   ├── condition.evaluator.js      # IF/THEN condition matcher
│       │   │   │   ├── scoring.evaluator.js        # Lead score calculator
│       │   │   │   └── time.evaluator.js           # Time-based checks
│       │   │   │
│       │   │   ├── executors/                      *** ACTION EXECUTORS ***
│       │   │   │   ├── email.executor.js           # SendGrid/Mailgun
│       │   │   │   ├── sms.executor.js             # Twilio
│       │   │   │   ├── task.executor.js            # Create/update tasks
│       │   │   │   ├── tag.executor.js             # Add/remove tags
│       │   │   │   ├── scoring.executor.js         # Update scores
│       │   │   │   ├── routing.executor.js         # Assign to user/team
│       │   │   │   ├── webhook.executor.js         # External API calls
│       │   │   │   └── notification.executor.js    # In-app notifications
│       │   │   │
│       │   │   └── helpers/
│       │   │       ├── logger.js                   # Audit logging
│       │   │       ├── retry.js                    # Retry logic
│       │   │       └── rate-limiter.js             # Rate limiting
│       │   │
│       │   ├── database/
│       │   │   └── connection.js                   # MongoDB connection
│       │   │
│       │   └── rbac/
│       │       ├── constants/
│       │       │   ├── permissions.constants.js
│       │       │   └── roles.constants.js
│       │       ├── helpers/
│       │       │   └── access.helpers.js
│       │       └── middlewares/
│       │           ├── auth.middleware.js
│       │           └── roles.middleware.js
│       │
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.controller.js
│       │   │   ├── auth.routes.js
│       │   │   └── user.model.js
│       │   │
│       │   ├── automation/                         *** AUTOMATION MODULE ***
│       │   │   ├── workflows/                      # Workflow engine API
│       │   │   │   ├── workflow.controller.js
│       │   │   │   ├── workflow.model.js
│       │   │   │   ├── workflow.service.js
│       │   │   │   └── workflow.routes.js
│       │   │   ├── sequences/                      # Follow-up sequences
│       │   │   │   ├── sequence.controller.js
│       │   │   │   ├── sequence.model.js
│       │   │   │   ├── sequence.service.js
│       │   │   │   └── sequence.routes.js
│       │   │   └── routing-rules/                  # Routing rules
│       │   │       ├── routing.controller.js
│       │   │       ├── routing.model.js
│       │   │       ├── routing.service.js
│       │   │       └── routing.routes.js
│       │   │
│       │   ├── marketing/                          *** MARKETING AUTOMATION ***
│       │   │   ├── index.js
│       │   │   ├── controllers/
│       │   │   │   ├── campaigns.controller.js
│       │   │   │   ├── drip-campaigns.controller.js
│       │   │   │   ├── lead-scoring.controller.js
│       │   │   │   ├── leads.controller.js
│       │   │   │   ├── social-integration.controller.js
│       │   │   │   ├── social-posts.controller.js
│       │   │   │   ├── socialPublish.controller.js
│       │   │   │   └── workflows.controller.js
│       │   │   ├── models/
│       │   │   │   ├── campaign.model.js
│       │   │   │   ├── drip-campaign.model.js
│       │   │   │   ├── lead-scoring.model.js
│       │   │   │   ├── leads.model.js
│       │   │   │   ├── social-integration.model.js
│       │   │   │   ├── social-post.model.js
│       │   │   │   └── workflow.model.js
│       │   │   ├── services/
│       │   │   │   ├── campaigns.service.js
│       │   │   │   ├── drip-campaigns.service.js
│       │   │   │   ├── lead-scoring.service.js
│       │   │   │   ├── leads.service.js
│       │   │   │   ├── social-integration.service.js
│       │   │   │   ├── social-posts.service.js
│       │   │   │   └── workflows.service.js
│       │   │   └── routes/
│       │   │       ├── campaigns.route.js
│       │   │       ├── drip-campaigns.route.js
│       │   │       ├── lead-scoring.route.js
│       │   │       ├── leads.routes.js
│       │   │       ├── social-integration.route.js
│       │   │       ├── social-posts.route.js
│       │   │       └── workflows.route.js
│       │   │
│       │   ├── sales/                              *** SALES AUTOMATION ***
│       │   │   ├── index.js
│       │   │   ├── controllers/
│       │   │   │   ├── activity-log.controller.js
│       │   │   │   ├── automated-tasks.controller.js
│       │   │   │   ├── follow-up-sequence.controller.js
│       │   │   │   ├── lead-scoring-sales.controller.js
│       │   │   │   ├── medical-sales.controller.js
│       │   │   │   └── routing-rules.controller.js
│       │   │   ├── models/
│       │   │   │   ├── activity-log.model.js
│       │   │   │   ├── automated-tasks.model.js
│       │   │   │   ├── follow-up-sequence.model.js
│       │   │   │   ├── lead-scoring-sales.model.js
│       │   │   │   ├── medical-sales.model.js
│       │   │   │   └── routing-rules.model.js
│       │   │   ├── services/
│       │   │   │   ├── activity-log.service.js
│       │   │   │   ├── automated-tasks.service.js
│       │   │   │   ├── follow-up-sequence.service.js
│       │   │   │   ├── lead-scoring-sales.service.js
│       │   │   │   ├── medical-sales.service.js
│       │   │   │   └── routing-rules.service.js
│       │   │   └── routes/
│       │   │       ├── activity-log.route.js
│       │   │       ├── automated-tasks.route.js
│       │   │       ├── follow-up-sequence.route.js
│       │   │       ├── lead-scoring-sales.route.js
│       │   │       ├── medical-sales.route.js
│       │   │       └── routing-rules.route.js
│       │   │
│       │   ├── companies/
│       │   │   ├── controllers/
│       │   │   ├── models/
│       │   │   ├── services/
│       │   │   └── routes/
│       │   │
│       │   ├── opportunities/
│       │   │   ├── controllers/
│       │   │   ├── models/
│       │   │   ├── services/
│       │   │   └── routes/
│       │   │
│       │   ├── real-estate/
│       │   │   └── ... (existing)
│       │   │
│       │   └── users/
│       │       └── ... (existing)
│       │
│       └── shared/
│           ├── mail/
│           ├── sms/
│           └── storage/
│
├── frontned/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── marketing/                        *** MARKETING PAGES ***
│   │   │   │   ├── page.tsx                      # Marketing dashboard
│   │   │   │   ├── campaigns/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── drip-campaigns/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── lead-scoring/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── models/page.tsx
│   │   │   │   │   └── models/[id]/page.tsx
│   │   │   │   ├── workflows/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── analytics/
│   │   │   │       ├── page.tsx
│   │   │   │       └── campaigns/[id]/page.tsx
│   │   │   │
│   │   │   ├── sales/                            *** SALES PAGES ***
│   │   │   │   ├── page.tsx                      # Sales dashboard
│   │   │   │   ├── routing-rules/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── sequences/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── tasks/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── activity-log/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── automation/                       *** CENTRAL AUTOMATION ***
│   │   │       ├── page.tsx                      # Automation overview
│   │   │       └── analytics/
│   │   │           └── page.tsx
│   │   │
│   │   └── layout.tsx
│   │
│   └── src/
│       ├── api/
│       │   └── client.ts                          # API client wrapper
│       │
│       ├── components/
│       │   └── ui/
│       │       ├── marketing/                     *** MARKETING COMPONENTS ***
│       │       │   ├── CampaignBuilder.tsx
│       │       │   ├── CampaignsList.tsx
│       │       │   ├── CampaignAnalytics.tsx
│       │       │   ├── DripSequenceBuilder.tsx
│       │       │   ├── DripSequenceList.tsx
│       │       │   ├── LeadScoringConfig.tsx
│       │       │   ├── LeadScoreView.tsx
│       │       │   ├── ScoringModelBuilder.tsx
│       │       │   ├── ScoringAnalytics.tsx
│       │       │   ├── WorkflowBuilder.tsx
│       │       │   ├── WorkflowTriggerConfig.tsx
│       │       │   ├── WorkflowActionBuilder.tsx
│       │       │   ├── SocialMediaConnector.tsx
│       │       │   ├── SocialLeadImport.tsx
│       │       │   └── AnalyticsDashboard.tsx
│       │       │
│       │       ├── sales/                         *** SALES COMPONENTS ***
│       │       │   ├── RoutingRulesBuilder.tsx
│       │       │   ├── RoutingRulesList.tsx
│       │       │   ├── SequenceBuilder.tsx
│       │       │   ├── SequenceList.tsx
│       │       │   ├── LeadScoringSalesConfig.tsx
│       │       │   ├── AutomatedTasksView.tsx
│       │       │   ├── ActivityLogView.tsx
│       │       │   └── SalesAnalytics.tsx
│       │       │
│       │       └── automation/                    *** SHARED AUTOMATION ***
│       │           ├── AutomationDashboard.tsx
│       │           ├── ConditionBuilder.tsx
│       │           ├── ActionSelector.tsx
│       │           ├── TriggerSelector.tsx
│       │           ├── DelayConfig.tsx
│       │           ├── TemplateSelector.tsx
│       │           └── ExecutionLog.tsx
│       │
│       ├── services/
│       │   ├── marketing/
│       │   │   ├── CampaignsService.ts
│       │   │   ├── DripCampaignsService.ts
│       │   │   ├── LeadScoringService.ts
│       │   │   ├── WorkflowsService.ts
│       │   │   ├── SocialPostsService.ts
│       │   │   └── SocialIntegrationService.ts
│       │   │
│       │   └── sales/
│       │       ├── RoutingRulesService.ts
│       │       ├── SequenceService.ts
│       │       ├── SalesLeadScoringService.ts
│       │       ├── tasksService.ts
│       │       └── ActivityLogService.ts
│       │
│       ├── hooks/
│       │   ├── use-sidebar.ts
│       │   └── useRole.tsx
│       │
│       ├── types/
│       │   └── index.ts                          # Shared TypeScript types
│       │
│       └── utils/
│           ├── date-helper.ts
│           └── errorHandler.ts
│
└── md files/
    ├── SALES_AUTOMATION_SINGLE_DOCUMENT.md
    ├── MARKETING_BACKEND_POSTMAN_TESTING_GUIDE.md
    └── ... (other docs)
```

---

## 14. API Endpoints Matrix

### 14.1 Marketing Automation Endpoints

| Method | Endpoint | Description | Module |
|---|---|---|---|
| `GET` | `/api/marketing/campaigns` | List all campaigns | Campaigns |
| `POST` | `/api/marketing/campaigns` | Create campaign | Campaigns |
| `GET` | `/api/marketing/campaigns/:id` | Get campaign by ID | Campaigns |
| `PUT` | `/api/marketing/campaigns/:id` | Update campaign | Campaigns |
| `DELETE` | `/api/marketing/campaigns/:id` | Delete campaign | Campaigns |
| `POST` | `/api/marketing/campaigns/:id/send` | Send campaign | Campaigns |
| `GET` | `/api/marketing/campaigns/:id/stats` | Campaign stats | Campaigns |
| | | | |
| `GET` | `/api/marketing/drip-campaigns` | List all drip campaigns | Drip |
| `POST` | `/api/marketing/drip-campaigns` | Create drip campaign | Drip |
| `PUT` | `/api/marketing/drip-campaigns/:id` | Update drip campaign | Drip |
| `DELETE` | `/api/marketing/drip-campaigns/:id` | Delete drip campaign | Drip |
| `POST` | `/api/marketing/drip-campaigns/:id/enroll` | Enroll lead | Drip |
| `GET` | `/api/marketing/drip-campaigns/:id/stats` | Drip stats | Drip |
| | | | |
| `GET` | `/api/marketing/lead-scoring` | List all lead scores | Scoring |
| `POST` | `/api/marketing/lead-scoring` | Create lead score | Scoring |
| `GET` | `/api/marketing/lead-scoring/:id` | Get score by ID | Scoring |
| `PUT` | `/api/marketing/lead-scoring/:id` | Update score | Scoring |
| `DELETE` | `/api/marketing/lead-scoring/:id` | Delete score | Scoring |
| `GET` | `/api/marketing/lead-scoring/models` | List scoring models | Scoring |
| `POST` | `/api/marketing/lead-scoring/models` | Create scoring model | Scoring |
| `PUT` | `/api/marketing/lead-scoring/models/:id` | Update scoring model | Scoring |
| `POST` | `/api/marketing/lead-scoring/calculate` | Calculate lead scores | Scoring |
| | | | |
| `GET` | `/api/marketing/workflows` | List all workflows | Workflows |
| `POST` | `/api/marketing/workflows` | Create workflow | Workflows |
| `GET` | `/api/marketing/workflows/:id` | Get workflow by ID | Workflows |
| `PUT` | `/api/marketing/workflows/:id` | Update workflow | Workflows |
| `DELETE` | `/api/marketing/workflows/:id` | Delete workflow | Workflows |
| `POST` | `/api/marketing/workflows/:id/activate` | Activate workflow | Workflows |
| `POST` | `/api/marketing/workflows/:id/deactivate` | Deactivate workflow | Workflows |

### 14.2 Sales Automation Endpoints

| Method | Endpoint | Description | Module |
|---|---|---|---|
| `GET` | `/api/sales/routing-rules` | List all routing rules | Routing |
| `GET` | `/api/sales/routing-rules/active` | List active rules | Routing |
| `POST` | `/api/sales/routing-rules` | Create routing rule | Routing |
| `GET` | `/api/sales/routing-rules/:id` | Get rule by ID | Routing |
| `PUT` | `/api/sales/routing-rules/:id` | Update rule | Routing |
| `DELETE` | `/api/sales/routing-rules/:id` | Delete rule | Routing |
| `POST` | `/api/sales/routing-rules/test` | Test routing rule | Routing |
| | | | |
| `GET` | `/api/sales/sequences` | List all sequences | Sequences |
| `POST` | `/api/sales/sequences` | Create sequence | Sequences |
| `GET` | `/api/sales/sequences/:id` | Get sequence by ID | Sequences |
| `PUT` | `/api/sales/sequences/:id` | Update sequence | Sequences |
| `DELETE` | `/api/sales/sequences/:id` | Delete sequence | Sequences |
| `POST` | `/api/sales/sequences/:id/enroll/:leadId` | Enroll lead in sequence | Sequences |
| `POST` | `/api/sales/sequences/stop/:leadId` | Stop sequence for lead | Sequences |
| | | | |
| `GET` | `/api/sales/tasks` | List automated tasks | Tasks |
| `POST` | `/api/sales/tasks` | Create task | Tasks |
| `GET` | `/api/sales/tasks/:id` | Get task by ID | Tasks |
| `PUT` | `/api/sales/tasks/:id` | Update task | Tasks |
| `DELETE` | `/api/sales/tasks/:id` | Delete task | Tasks |
| `POST` | `/api/sales/tasks/:id/complete` | Mark task complete | Tasks |
| | | | |
| `GET` | `/api/sales/lead-scoring` | List sales scoring models | Scoring |
| `POST` | `/api/sales/lead-scoring` | Create scoring model | Scoring |
| `GET` | `/api/sales/lead-scoring/:id` | Get model by ID | Scoring |
| `PUT` | `/api/sales/lead-scoring/:id` | Update model | Scoring |
| `DELETE` | `/api/sales/lead-scoring/:id` | Delete model | Scoring |
| `POST` | `/api/sales/lead-scoring/calculate` | Calculate lead score | Scoring |
| `GET` | `/api/sales/lead-scoring/lead/:leadId` | Get lead score | Scoring |
| | | | |
| `GET` | `/api/sales/activity-logs` | List activity logs | Activity |
| `GET` | `/api/sales/activity-logs?leadId=&channel=&from=&to=` | Filtered logs | Activity |

### 14.3 Analytics Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sales/analytics/funnel` | Sales funnel metrics |
| `GET` | `/api/sales/analytics/sla` | SLA compliance metrics |
| `GET` | `/api/sales/analytics/conversion-by-score` | Conversion by score range |
| `GET` | `/api/marketing/analytics/dashboard` | Marketing dashboard data |
| `GET` | `/api/marketing/analytics/campaigns/:id` | Campaign analytics |
| `GET` | `/api/marketing/analytics/roi` | ROI analysis |

---

## 15. Database Schema — All Collections

### 15.1 Automation Core Collections

#### `workflows` Collection

```javascript
{
  _id: ObjectId,
  workflow_name: String,                          // Required
  description: String,
  status: { type: String, enum: ['Active', 'Paused', 'Draft', 'Completed', 'Archived'], default: 'Draft' },
  
  // Trigger Configuration
  trigger_type: { 
    type: String, 
    enum: [
      'Lead-Creation', 'Form-Submission', 'Tag-Added', 'Time-Based', 
      'Custom', 'Opportunity-Stage-Changed', 'Lead-Score-Updated',
      'Email-Opened', 'Email-Clicked', 'Meeting-Booked', 'Webhook-Received'
    ] 
  },
  trigger_config: {
    field: String,          // For field-change triggers
    value: Mixed,           // Expected value
    schedule: String,       // Cron for time-based
    delayMinutes: Number    // Delay before trigger
  },
  
  // Conditions (IF block)
  conditions: {
    matchType: { type: String, enum: ['ALL', 'ANY'], default: 'ALL' },
    rules: [{
      field: String,                            // e.g., 'lead.score', 'lead.source'
      operator: { type: String, enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'not_contains', 'in', 'not_in'] },
      value: Schema.Types.Mixed
    }]
  },
  
  // Actions (THEN block)
  actions: [{
    type: { type: String, enum: ['send_email', 'send_sms', 'create_task', 'add_tag', 'remove_tag', 'update_score', 'change_status', 'assign_to_user', 'assign_to_team', 'start_sequence', 'stop_sequence', 'create_opportunity', 'call_webhook', 'send_notification'] },
    config: Schema.Types.Mixed,   // Action-specific config
    order: Number,
    delayMinutes: Number
  }],
  
  // Else Actions (optional)
  elseActions: [{ type: Schema.Types.Mixed }],    // Same structure as actions
  
  // Stop conditions
  stopConditions: [{ type: String }],
  
  // Execution Stats
  totalTriggered: { type: Number, default: 0 },
  totalProcessed: { type: Number, default: 0 },
  totalSucceeded: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  lastExecutedAt: Date,
  
  created_by: { type: String, default: 'Current User' },
  created_date: { type: Number },
  notes: String
}, { timestamps: true })
```

#### `routing_rules` Collection

```javascript
{
  _id: ObjectId,
  ruleName: String,                               // Required
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  priority: { type: Number, default: 0 },
  
  conditions: [{
    field: String,                                // 'current_score', 'industry', 'lead_source', 'company_size'
    operator: { type: String, enum: ['gt', 'lt', 'eq', 'contains', 'gte', 'lte', 'in'] },
    value: Schema.Types.Mixed
  }],
  
  action: { type: String, enum: ['assign_to_user', 'assign_to_team'] },
  targetUserId: String,
  targetTeamId: String,
  assignmentMode: { type: String, enum: ['round_robin', 'least_busy'], default: 'round_robin' },
  
  // Round-robin tracking
  lastAssignedIndex: { type: Number, default: -1 }
}, { timestamps: true })
```

#### `sequences` Collection (Follow-up Sequences)

```javascript
{
  _id: ObjectId,
  sequence_name: String,                          // Required
  description: String,
  status: { type: String, enum: ['Active', 'Paused', 'Archived'], default: 'Active' },
  
  trigger_event: String,                          // 'Lead_SQL_Entered', 'Lead_Created', 'Lead_Scored'
  trigger_condition: Schema.Types.Mixed,
  
  steps: [{
    order: Number,
    channel: { type: String, enum: ['email', 'sms', 'call', 'task'] },
    delayDays: { type: Number, default: 0 },
    delayHours: { type: Number, default: 0 },
    contentTemplateId: String,
    stepTitle: String,
    conditions: Schema.Types.Mixed                // Skip/stop conditions per step
  }],
  
  stop_conditions: [{ type: String }],             // 'Meeting_Booked', 'Lead_Converted', 'Unsubscribed'
  
  // Enrolled leads tracking
  enrolledLeads: [{
    leadId: String,
    enrolledAt: Date,
    currentStep: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Completed', 'Stopped'], default: 'Active' },
    lastProcessedAt: Date
  }]
}, { timestamps: true })
```

#### `activity_logs` Collection

```javascript
{
  _id: ObjectId,
  lead_id: String,                                // Related lead (optional)
  opportunity_id: String,                         // Related opportunity (optional)
  workflow_id: String,                            // Which workflow triggered this
  sequence_id: String,                            // Which sequence triggered this
  
  channel: { type: String, enum: ['email', 'sms', 'call', 'task', 'system', 'webhook'] },
  action_type: String,                            // 'send', 'open', 'click', 'create', 'assign', 'score'
  
  status: { type: String, enum: ['queued', 'success', 'failed', 'skipped'] },
  message: String,                                // Human-readable description
  error_message: String,                          // Error details if failed
  
  performed_by: String,                           // 'system' or userId
  metadata: Schema.Types.Mixed                    // Additional context
}, { timestamps: true })
```

#### `automated_tasks` Collection

```javascript
{
  _id: ObjectId,
  task_id: { type: String, required: true, unique: true },
  opportunity_id: String,
  lead_id: String,
  
  assigned_to: { type: String, required: true },
  task_title: { type: String, required: true },
  description: String,
  due_date: { type: Date, required: true },
  
  status: { type: String, enum: ['Open', 'In_Progress', 'Done', 'Cancelled', 'Paused'], default: 'Open' },
  priority: { type: String, enum: ['Low', 'Med', 'High', 'Urgent'], default: 'Med' },
  
  source: { type: String, enum: ['automation_rule', 'sequence', 'manual', 'workflow'] },
  source_rule_id: String,                         // Which rule/workflow created it
  
  completed_at: Date,
  notes: String
}, { timestamps: true })
```

### 15.2 Existing Collections (Reference)

**Already implemented:**
- `campaigns` — Marketing email/SMS campaigns
- `dripCampaigns` — Drip campaign sequences
- `leadScores` — Lead score tracking
- `workflows` — Basic workflows (existing in marketing)
- `routingrules` — Routing rules (existing in sales)
- `followupsequences` — Follow-up sequences (existing in sales)
- `salesautomatedtasks` — Automated tasks (existing in sales)
- `leadscoringsales` — Sales lead scoring models (existing in sales)

---

## 16. Event Bus & Webhook System

### 16.1 Internal Event Bus

```javascript
// backend/src/core/automation-engine/event-bus.js

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  // Subscribe to events
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  // Publish events
  async emit(eventType, payload) {
    const handlers = this.listeners.get(eventType) || [];
    
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`[EventBus] Error in handler for ${eventType}:`, error);
      }
    }
  }

  // Remove listener
  off(eventType, callback) {
    const handlers = this.listeners.get(eventType) || [];
    this.listeners.set(eventType, handlers.filter(h => h !== callback));
  }
}

export const eventBus = new EventBus();
```

### 16.2 Events Registry

```javascript
// All events that the automation engine listens to

const EVENTS = {
  // Lead Events
  LEAD_CREATED: 'lead:created',
  LEAD_UPDATED: 'lead:updated',
  LEAD_SCORED: 'lead:scored',
  LEAD_STATUS_CHANGED: 'lead:status_changed',
  LEAD_ASSIGNED: 'lead:assigned',
  
  // Email Events
  EMAIL_SENT: 'email:sent',
  EMAIL_OPENED: 'email:opened',
  EMAIL_CLICKED: 'email:clicked',
  EMAIL_BOUNCED: 'email:bounced',
  EMAIL_UNSUBSCRIBED: 'email:unsubscribed',
  
  // SMS Events
  SMS_SENT: 'sms:sent',
  SMS_DELIVERED: 'sms:delivered',
  SMS_FAILED: 'sms:failed',
  SMS_REPLIED: 'sms:replied',
  
  // Task Events
  TASK_CREATED: 'task:created',
  TASK_COMPLETED: 'task:completed',
  TASK_OVERDUE: 'task:overdue',
  
  // Opportunity Events
  OPPORTUNITY_CREATED: 'opportunity:created',
  OPPORTUNITY_STAGE_CHANGED: 'opportunity:stage_changed',
  OPPORTUNITY_WON: 'opportunity:won',
  OPPORTUNITY_LOST: 'opportunity:lost',
  
  // Meeting Events
  MEETING_BOOKED: 'meeting:booked',
  MEETING_COMPLETED: 'meeting:completed',
  MEETING_CANCELLED: 'meeting:cancelled',
  
  // Time Events
  TIME_SCHEDULED: 'time:scheduled',     // Cron-based
  TIME_DELAY_EXPIRED: 'time:delay_expired',  // After delay
  
  // System Events
  WORKFLOW_ACTIVATED: 'workflow:activated',
  WORKFLOW_DEACTIVATED: 'workflow:deactivated',
  SEQUENCE_STEP_DUE: 'sequence:step_due',
  SEQUENCE_ENROLLED: 'sequence:enrolled',
  SEQUENCE_STOPPED: 'sequence:stopped'
};
```

### 16.3 Event Flow Example

```
Lead Created Event
       │
       ▼
Event Bus publishes 'lead:created'
       │
       ├──▶ Workflow Engine: Check all ACTIVE workflows with trigger='Lead-Creation'
       │       │
       │       ├──▶ Workflow 1: IF lead.source === 'facebook' THEN send welcome email
       │       ├──▶ Workflow 2: IF lead.company_size === 'enterprise' THEN assign to enterprise team
       │       └──▶ Workflow 3: Lead score > 0 → Calculate score
       │
       ├──▶ Scoring Engine: Calculate initial score for new lead
       │       │
       │       └──▶ Emit 'lead:scored' event
       │               │
       │               ├──▶ Routing Engine: IF score > 60 THEN assign to AE
       │               └──▶ Sequence Engine: IF score > 70 THEN enroll in SQL sequence
       │
       └──▶ Task Engine: IF lead is from high-priority source THEN create immediate task
```

### 16.4 Webhook System (External Triggers)

```javascript
// POST /api/webhooks/workflow-trigger
// Accepts external events to trigger workflows

{
  "event": "custom.form_submitted",
  "payload": {
    "form_id": "FORM-123",
    "lead_email": "john@example.com",
    "lead_name": "John Doe",
    "company": "Acme Corp",
    "form_data": { ... }
  }
}
```

The webhook handler:
1. Validates webhook signature
2. Maps external event to internal event
3. Publishes to Event Bus
4. Automation Engine processes as usual

---

## 17. Execution Flow Diagrams

### 17.1 Complete Lead Lifecycle Automation

```
                         LEAD CREATED
                              │
                              ▼
                    ┌─────────────────────┐
                    │  DUPLICATE CHECK     │
                    │  (Auto-detect dup)   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  ENRICH LEAD DATA    │
                    │  (Company info,      │
                    │   social profiles)   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  CALCULATE SCORE     │◄──────────────────────┐
                    │  (Source + Demo-     │                        │
                    │   graphic + Behavior)│                        │
                    └─────────┬───────────┘                        │
                              │                                    │
                    ┌─────────▼───────────┐                        │
                    │  UPDATE STATUS       │                        │
                    │  (Hot/Warm/Cold)     │                        │
                    └─────────┬───────────┘                        │
                              │                                    │
                    ┌─────────▼───────────┐                        │
                    │  SCORE ≥ THRESHOLD?  │─── No ──► (Monitor)──┘
                    └─────────┬───────────┘
                              │ Yes
                              ▼
                    ┌─────────────────────┐
                    │  ROUTE TO SALES      │
                    │  (Round-robin /      │
                    │   Least-busy)        │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  ENROLL IN SEQUENCE  │
                    │  (Follow-up steps:   │
                    │   Email→SMS→Call)    │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  CREATE TASKS        │
                    │  (Outreach, Follow   │
                    │   up, Demo booking)  │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  NOTIFY SALES REP    │
                    │  (In-app notification│
                    │   + Email alert)     │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  LEAD ENGAGEMENT     │
                    │  (Email opens,       │
                    │   clicks, replies)   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  RECALCULATE SCORE   │◄────── (Each interaction)
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  SCORE UPDATED       │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
      ┌────────────┐  ┌────────────┐  ┌────────────┐
      │ MEETING    │  │ CONVERTED  │  │ NO RESPONSE│
      │ BOOKED     │  │ (Won)      │  │ (Lost)     │
      └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
             │               │               │
             ▼               ▼               ▼
      Stop Sequence    Create          Mark as Cold
      Create Opp       Opportunity     Stop Sequence
      Notify AE        Close Won       Schedule Re-engagement
```

### 17.2 Multi-Workflow Execution

```
Single Event can trigger MULTIPLE workflows in parallel:

Event: Lead Created (lead.source = "Facebook Ads")
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Workflow:       │  │ Workflow:       │  │ Workflow:       │
│ Welcome Email   │  │ Score Lead      │  │ Assign to Team  │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ TRIGGER:        │  │ TRIGGER:        │  │ TRIGGER:        │
│ Lead Created    │  │ Lead Created    │  │ Lead Created    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ CONDITIONS:     │  │ CONDITIONS:     │  │ CONDITIONS:     │
│ source=facebook │  │ (No conditions) │  │ industry=tech   │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ THEN:           │  │ THEN:           │  │ THEN:           │
│ Send Email      │  │ Calculate Score │  │ Assign to       │
│ (Template:      │  │ Update Status   │  │ Tech Team       │
│  Welcome-001)   │  │                 │  │ (Round Robin)   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Activity Log:   │
                  │ 3 workflows     │
                  │ executed for    │
                  │ lead LD-123     │
                  └─────────────────┘
```

---

## 18. Security & RBAC Integration

### 18.1 Permission Constants

```javascript
// backend/src/core/rbac/constants/permissions.constants.js

const PERMISSIONS = {
  // Workflow Permissions
  WORKFLOW_VIEW: 'workflow:view',
  WORKFLOW_CREATE: 'workflow:create',
  WORKFLOW_EDIT: 'workflow:edit',
  WORKFLOW_DELETE: 'workflow:delete',
  WORKFLOW_ACTIVATE: 'workflow:activate',
  WORKFLOW_DEACTIVATE: 'workflow:deactivate',
  
  // Lead Scoring Permissions
  SCORING_VIEW: 'scoring:view',
  SCORING_CREATE: 'scoring:create',
  SCORING_EDIT: 'scoring:edit',
  SCORING_DELETE: 'scoring:delete',
  
  // Routing Rules Permissions
  ROUTING_VIEW: 'routing:view',
  ROUTING_CREATE: 'routing:create',
  ROUTING_EDIT: 'routing:edit',
  ROUTING_DELETE: 'routing:delete',
  
  // Sequences Permissions
  SEQUENCE_VIEW: 'sequence:view',
  SEQUENCE_CREATE: 'sequence:create',
  SEQUENCE_EDIT: 'sequence:edit',
  SEQUENCE_DELETE: 'sequence:delete',
  SEQUENCE_ENROLL: 'sequence:enroll',
  SEQUENCE_STOP: 'sequence:stop',
  
  // Tasks Permissions
  TASK_VIEW: 'task:view',
  TASK_CREATE: 'task:create',
  TASK_EDIT: 'task:edit',
  TASK_COMPLETE: 'task:complete',
  
  // Activity Log Permissions
  ACTIVITY_VIEW: 'activity:view',
  ACTIVITY_EXPORT: 'activity:export',
  
  // Automation Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export'
};
```

### 18.2 Role-Based Access Matrix

| Feature | Admin | Manager | Team Lead | SDR/AE | Viewer |
|---|---|---|---|---|---|
| View Workflows | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create/Edit Workflows | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete Workflows | ✅ | ✅ | ❌ | ❌ | ❌ |
| Activate/Deactivate | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Scoring Models | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create/Edit Scoring | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Routing Rules | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create/Edit Routing | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Sequences | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create/Edit Sequences | ✅ | ✅ | ✅ | ❌ | ❌ |
| Enroll/Stop Sequences | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Complete Tasks | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Activity Logs | ✅ | ✅ | ✅ | Only Own | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Export Reports | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 19. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] **Backend**: Build Automation Engine Core
  - [ ] Implement Event Bus (`event-bus.js`)
  - [ ] Implement Condition Evaluator (`condition.evaluator.js`)
  - [ ] Implement base Action Executors (task, notification, scoring)
  - [ ] Create `automation` module structure
  - [ ] Implement Scheduler for time-based triggers
- [ ] **Frontend**: Build shared automation components
  - [ ] `ConditionBuilder.tsx` — Reusable condition builder UI
  - [ ] `ActionSelector.tsx` — Action type selector
  - [ ] `TriggerSelector.tsx` — Trigger type selector
  - [ ] `DelayConfig.tsx` — Delay configuration UI
  - [ ] `ExecutionLog.tsx` — Execution log viewer

### Phase 2: Workflow Engine (Weeks 3-4)
- [ ] **Backend**: Complete Workflow Engine
  - [ ] Enhanced Workflow Model with conditions & actions
  - [ ] Workflow execution pipeline (trigger → evaluate → execute)
  - [ ] Workflow CRUD APIs
  - [ ] Workflow activation/deactivation
  - [ ] Workflow execution stats tracking
- [ ] **Frontend**: Workflow Builder UI
  - [ ] `WorkflowBuilder.tsx` — Visual drag-and-drop builder
  - [ ] `WorkflowTriggerConfig.tsx` — Trigger configuration
  - [ ] `WorkflowActionBuilder.tsx` — Multi-action builder
  - [ ] Workflow list and detail pages
  - [ ] Workflow testing/simulation mode

### Phase 3: Lead Scoring Engine Upgrade (Week 5)
- [ ] **Backend**: Upgrade Scoring Engine
  - [ ] Real-time score calculation on lead events
  - [ ] Score history tracking
  - [ ] Multiple scoring model support
  - [ ] Score-based lead status auto-update
- [ ] **Frontend**: Scoring UI
  - [ ] `ScoringModelBuilder.tsx` — Visual model builder
  - [ ] `LeadScoreView.tsx` — Score breakdown visualization
  - [ ] `ScoringAnalytics.tsx` — Score distribution & trends

### Phase 4: Routing & Sequences (Week 6-7)
- [ ] **Backend**: Routing & Sequence Engine
  - [ ] Round-robin assignment implementation
  - [ ] Least-busy assignment implementation
  - [ ] Sequence step scheduler (day/hour delays)
  - [ ] Sequence stop conditions
  - [ ] Lead enrollment tracking
- [ ] **Frontend**: Routing & Sequence UI
  - [ ] `RoutingRulesBuilder.tsx` — Condition-based rule builder
  - [ ] `SequenceBuilder.tsx` — Step-by-step sequence builder
  - [ ] `AutomatedTasksView.tsx` — Task list & completion
  - [ ] `ActivityLogView.tsx` — Filterable activity log

### Phase 5: Drip Campaigns (Week 8)
- [ ] **Backend**: Drip Campaign Engine
  - [ ] Email/SMS sequence scheduling
  - [ ] Lead enrollment & progress tracking
  - [ ] Engagement-based branching
  - [ ] Conversion tracking
- [ ] **Frontend**: Drip Campaign UI
  - [ ] `DripSequenceBuilder.tsx` — Visual sequence builder
  - [ ] `DripSequenceList.tsx` — Campaign management
  - [ ] Campaign enrollment UI

### Phase 6: Analytics & Reporting (Week 9)
- [ ] **Backend**: Analytics APIs
  - [ ] Funnel metrics endpoint
  - [ ] SLA compliance metrics
  - [ ] Conversion by score range
  - [ ] Workflow performance stats
  - [ ] Activity summary endpoints
- [ ] **Frontend**: Analytics Dashboards
  - [ ] `AnalyticsDashboard.tsx` — Main automation analytics
  - [ ] `SalesAnalytics.tsx` — Sales automation KPIs
  - [ ] Export reports functionality

### Phase 7: Email/SMS Integration (Week 10)
- [ ] Email provider integration (SendGrid/Mailgun)
  - [ ] Template management
  - [ ] Send with tracking (open/click)
  - [ ] Webhook receiver for events
  - [ ] Bounce & unsubscribe handling
- [ ] SMS provider integration (Twilio)
  - [ ] Send SMS
  - [ ] Delivery callbacks
  - [ ] Reply handling

### Phase 8: Testing & Deployment (Week 11-12)
- [ ] Unit tests for all evaluators and executors
- [ ] Integration tests for workflow execution
- [ ] End-to-end tests for complete lead journey
- [ ] Load testing for concurrent workflow execution
- [ ] Documentation
- [ ] Production deployment

---

## 20. Testing Strategy

### 20.1 Backend Unit Tests

```
tests/
├── core/
│   ├── automation-engine/
│   │   ├── event-bus.test.js
│   │   ├── condition.evaluator.test.js
│   │   ├── scoring.evaluator.test.js
│   │   ├── time.evaluator.test.js
│   │   ├── email.executor.test.js
│   │   ├── task.executor.test.js
│   │   ├── routing.executor.test.js
│   │   └── engine.test.js
│   └── ...
├── modules/
│   ├── workflows/
│   │   ├── workflow.service.test.js
│   │   └── workflow.controller.test.js
│   ├── lead-scoring/
│   │   ├── scoring.service.test.js
│   │   └── scoring.evaluator.test.js
│   ├── routing-rules/
│   │   ├── routing.service.test.js
│   │   └── routing.executor.test.js
│   └── sequences/
│       ├── sequence.service.test.js
│       └── sequence.scheduler.test.js
└── integration/
    ├── lead-lifecycle.test.js          # Complete lead automation flow
    ├── workflow-execution.test.js      # Multi-workflow parallel execution
    ├── scoring-to-routing.test.js       # Score → Route → Sequence flow
    ├── sequence-timing.test.js          # Delays, scheduling, stop conditions
    └── webhook-trigger.test.js          # External event → workflow execution
```

### 20.2 Key Test Scenarios

```javascript
// 1. Lead Created → Score → Route → Sequence → Task
describe('Complete Lead Automation Journey', () => {
  it('should score lead on creation', async () => { ... });
  it('should route lead to correct team based on score', async () => { ... });
  it('should enroll SQL lead in follow-up sequence', async () => { ... });
  it('should create task for assigned rep', async () => { ... });
  it('should stop sequence when meeting booked', async () => { ... });
});

// 2. Multi-Workflow Parallel Execution
describe('Parallel Workflow Execution', () => {
  it('should execute multiple workflows for single event', async () => { ... });
  it('should respect workflow priority order', async () => { ... });
  it('should handle workflow execution failures gracefully', async () => { ... });
});

// 3. Condition Evaluation
describe('Condition Evaluation', () => {
  it('should evaluate ALL match type correctly', async () => { ... });
  it('should evaluate ANY match type correctly', async () => { ... });
  it('should execute ELSE actions when conditions fail', async () => { ... });
  it('should handle nested conditions', async () => { ... });
});

// 4. Round-Robin Routing
describe('Round-Robin Assignment', () => {
  it('should distribute leads evenly among team', async () => { ... });
  it('should skip users with max capacity', async () => { ... });
  it('should reset index when all users assigned', async () => { ... });
});
```

---

## Appendix A: Quick Setup Commands

```bash
# Backend Setup
cd backend
npm install
npm run dev          # Starts on localhost:5000

# Frontend Setup
cd frontned
npm install
npm run dev          # Starts on localhost:3000

# Environment Variables (backend/.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_backend
JWT_SECRET=your_jwt_secret
EMAIL_API_KEY=your_sendgrid_key
SMS_API_KEY=your_twilio_key
```

## Appendix B: Key Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| **Backend Files** | `kebab-case` | `workflow.service.js`, `routing-rules.model.js` |
| **Frontend Files** | `PascalCase` for components | `WorkflowBuilder.tsx`, `SequenceService.ts` |
| **API Base Path** | `plural` | `/api/marketing/workflows`, `/api/sales/routing-rules` |
| **Database Collections** | `lowercase plural` | `workflows`, `routingrules`, `activitylogs` |
| **Model Names** | `PascalCase` | `WorkflowModel`, `RoutingRuleModel` |
| **Service Names** | `PascalCase` | `WorkflowsService`, `RoutingRulesService` |

## Appendix C: Common Automation Patterns

| Pattern | Description | Example |
|---|---|---|
| **Fire-and-Forget** | Trigger action, no follow-up | Send welcome email on signup |
| **Timed Sequence** | Multi-step with delays | Email → Wait 3 days → SMS → Wait 1 day → Call |
| **Conditional Branching** | Different paths based on lead behavior | IF clicked → Send offer, ELSE → Send reminder |
| **Score Threshold** | Action triggers when score crosses threshold | Score > 70 → Assign to senior AE |
| **Stop Condition** | Auto-stop when goal achieved | Meeting booked → Stop sequence |
| **Escalation** | Auto-escalate if no response | No response 7 days → Notify manager |
| **Re-engagement** | Re-activate cold leads | No activity 30 days → Send re-engagement campaign |

---

> **Document Version**: 1.0  
> **Author**: CRM Automation Architecture Team  
> **Last Updated**: April 2026  
> **Status**: ✅ Complete Reference Document

