# Wholcure CRM - Multi-Mode Architecture

## Executive Summary

This document outlines the comprehensive architecture for Wholcure CRM's multi-mode system, enabling seamless expansion across business verticals (ERP, BDT, Real Estate, Medical, Beauty) while maintaining a unified core infrastructure. The architecture follows a **module-based, mode-agnostic design pattern** that allows for plug-and-play vertical additions without breaking existing functionality.

---

## System Overview

### Multi-Mode Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Wholcure CRM Platform                          │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   ERP Mode   │  │   BDT Mode   │  │  New Modes   │  ...          │
│  │ /erp/*       │  │ /bdt/*       │  │  (Medical,   │               │
│  │ (Real Estate,│  │ (Business    │  │  Beauty, etc)│               │
│  │ Finance,     │  │ Development, │  │               │               │
│  │ Operations)  │  │ Marketing)   │  │               │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Shared Core Services                         │ │
│  │  • User Management • Calendar • Roles • CRM Settings           │ │
│  │                    • Auth • Analytics • Notifications          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Module Orchestration Layer                   │ │
│  │  • Mode Router • Feature Registry • Permission Manager         │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

### Backend Architecture (`/backend`)

```
backend/
├── src/
│   ├── comketra/                  # Core CRM modules
│   │   ├── modules/
│   │   │   ├── common/            # Shared utilities (auth, users, roles)
│   │   │   │   ├── auth/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── routes/
│   │   │   │   │   └── services/
│   │   │   │   │   └── index.js
│   │   │   │   ├── users/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── routes/
│   │   │   │   │   └── services/
│   │   │   │   │   └── index.js
│   │   │   │   ├── roles/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── routes/
│   │   │   │   │   └── services/
│   │   │   │   │   └── index.js
│   │   │   │   └── settings/
│   │   │   │       ├── controllers/
│   │   │   │       ├── models/
│   │   │   │       ├── routes/
│   │   │   │       └── services/
│   │   │   │       └── index.js
│   │   │   │
│   │   │   ├── marketing/         # Marketing automation
│   │   │   ├── sales/             # RenGrowCure (Sales)
│   │   │   ├── tasks/             # Task management
│   │   │   └── calendar/          # Shared calendar service
│   │   │
│   │   └── modes/                 # Mode-specific modules
│   │       ├── erp/               # ERP mode
│   │       │   ├── modules/
│   │       │   │   ├── real-estate/
│   │       │   │   │   ├── controllers/
│   │       │   │   │   ├── models/
│   │       │   │   │   ├── routes/
│   │       │   │   │   └── services/
│   │       │   │   │   └── index.js
│   │       │   │   ├── finance/
│   │       │   │   ├── operations/
│   │       │   │   └── inventory/
│   │       │   └── index.js
│   │       │
│   │       ├── bdt/               # Business Development
│   │       │   ├── modules/
│   │       │   │   ├── marketing/
│   │       │   │   │   ├── controllers/
│   │       │   │   │   ├── models/
│   │       │   │   │   ├── routes/
│   │       │   │   │   └── services/
│   │       │   │   │   └── index.js
│   │       │   │   ├── sales/
│   │       │   │   │   ├── controllers/
│   │       │   │   │   ├── models/
│   │       │   │   │   ├── routes/
│   │       │   │   │   └── services/
│   │       │   │   │   └── index.js
│   │       │   │   ├── lead-gen/
│   │       │   │   └── campaigns/
│   │       │   └── index.js
│   │       │
│   │       ├── medical/           # Future: Medical mode
│   │       ├── beauty/            # Future: Beauty mode
│   │       └── logistics/         # Future: Logistics mode
│   │
│   └── middleware/
│       ├── mode-guard.js          # Mode-based access control
│       ├── feature-flags.js       # Feature toggles
│       └── error-handler.js
│
├── app.js                         # Mode router entry point
├── server.js                      # Server configuration
└── config/
    ├── database.js
    └── modes.js                   # Mode configuration registry
```

### Frontend Architecture (`/frontend`)

```
frontend/
├── app/
│   ├── (dashboard)/               # Core dashboard layout
│   │   ├── page.tsx               # Unified dashboard
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   │
│   ├── erp/                       # ERP mode routes
│   │   ├── page.tsx               # ERP dashboard
│   │   ├── layout.tsx
│   │   ├── real-estate/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   └── properties/
│   │   │       └── page.tsx
│   │   ├── finance/
│   │   │   ├── page.tsx
│   │   │   └── reports/
│   │   │       └── page.tsx
│   │   └── operations/
│   │       └── page.tsx
│   │
│   ├── bdt/                       # Business Development mode
│   │   ├── page.tsx               # BDT dashboard
│   │   ├── layout.tsx
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── campaigns/
│   │   │   ├── page.tsx
│   │   │   └── drip-campaigns/
│   │   │       └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   │
│   ├── medical/                   # Future: Medical mode
│   ├── beauty/                    # Future: Beauty mode
│   └── logistics/                 # Future: Logistics mode
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── ModeSwitcher.tsx   # Mode selection dropdown
│   │   │   ├── ModeHeader.tsx     # Mode-specific header
│   │   │   └── ModeSidebar.tsx    # Mode-aware sidebar
│   │   │
│   │   ├── erp/                   # ERP-specific components
│   │   ├── bdt/                   # BDT-specific components
│   │   └── ui/                    # Shared UI components
│   │
│   ├── constants/
│   │   ├── modes.ts               # Mode definitions
│   │   ├── permissions.ts         # Feature permissions
│   │   └── roles.ts               # Role definitions
│   │
│   ├── contexts/
│   │   ├── ModeContext.tsx        # Mode state management
│   │   └── FeatureFlagsContext.tsx
│   │
│   ├── hooks/
│   │   ├── useMode.ts             # Mode hook
│   │   ├── useFeature.ts          # Feature flag hook
│   │   └── usePermissions.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── erp.ts             # ERP API service
│   │   │   ├── bdt.ts             # BDT API service
│   │   │   └── core.ts            # Core API service
│   │   │
│   │   └── modes/
│   │       ├── erp.ts             # ERP service
│   │       ├── bdt.ts             # BDT service
│   │       └── index.ts           # Mode registry
│   │
│   └── types/
│       ├── modes.d.ts             # Mode type definitions
│       └── erp.d.ts               # ERP types
│
├── public/
│   └── modes/                     # Mode-specific assets
│       ├── erp/
│       └── bdt/
│
└── middleware.ts                  # Route middleware
```

---

## Mode Configuration System

### Backend Mode Registry (`config/modes.js`)

```javascript
/**
 * Mode Configuration Registry
 * Defines all available CRM modes and their modules
 */

export const MODES = {
  ERP: {
    id: 'erp',
    name: 'ERP',
    label: 'Enterprise Resource Planning',
    path: '/erp',
    description: 'Comprehensive ERP solution for business operations',
    icon: 'Enterprise',
    color: '#10b981', // Emerald green
    enabled: true,
    modules: [
      'real-estate',
      'finance',
      'operations',
      'inventory',
      'hr'
    ],
    sharedModules: [
      'auth',
      'users',
      'roles',
      'calendar',
      'settings'
    ]
  },
  
  BDT: {
    id: 'bdt',
    name: 'BDT',
    label: 'Business Development',
    path: '/bdt',
    description: 'Lead generation and business development platform',
    icon: 'Business',
    color: '#3b82f6', // Blue
    enabled: true,
    modules: [
      'marketing',
      'sales',
      'lead-gen',
      'campaigns',
      'analytics'
    ],
    sharedModules: [
      'auth',
      'users',
      'roles',
      'calendar',
      'settings'
    ]
  },
  
  MEDICAL: {
    id: 'medical',
    name: 'Medical',
    label: 'Medical Practice Management',
    path: '/medical',
    description: 'Practice management and patient records',
    icon: 'Medical',
    color: '#ef4444', // Red
    enabled: false, // Disabled by default
    modules: [
      'patients',
      'appointments',
      'treatments',
      'records',
      'billing'
    ],
    sharedModules: [
      'auth',
      'users',
      'roles',
      'calendar',
      'settings'
    ]
  },
  
  BEAUTY: {
    id: 'beauty',
    name: 'Beauty',
    label: 'Beauty & Wellness',
    path: '/beauty',
    description: 'Salon and spa management system',
    icon: 'Beauty',
    color: '#ec4899', // Pink
    enabled: false,
    modules: [
      'clients',
      'appointments',
      'services',
      'products',
      'inventory'
    ],
    sharedModules: [
      'auth',
      'users',
      'roles',
      'calendar',
      'settings'
    ]
  }
};

export const getDefaultMode = () => MODES.ERP;
export const getModeById = (modeId) => MODES[modeId.toUpperCase()] || MODES.ERP;
export const getAllEnabledModes = () => Object.values(MODES).filter(mode => mode.enabled);
```

---

## Mode Router Implementation

### Backend Mode Router (`app.js`)

```javascript
import express from 'express';
import cors from 'cors';
import { getModeById, getAllEnabledModes } from './config/modes.js';
import modeGuard from './src/middleware/mode-guard.js';

// Import shared core modules
import authRoutes from './src/comketra/modules/common/auth/routes.js';
import usersRoutes from './src/comketra/modules/common/users/routes.js';
import rolesRoutes from './src/comketra/modules/common/roles/routes.js';
import settingsRoutes from './src/comketra/modules/common/settings/routes.js';
import calendarRoutes from './src/comketra/modules/common/calendar/routes.js';

// Import mode-specific module routers
import erpRouter from './src/comketra/modes/erp/index.js';
import bdtRouter from './src/comketra/modes/bdt/index.js';

const app = express();

// --- Global Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Wholcure CRM Platform is running',
    timestamp: new Date().toISOString()
  });
});

// --- Core API Routes (Shared Across All Modes) ---
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/calendar', calendarRoutes);

// --- Mode-Aware Routes ---
app.use('/api', modeGuard, (req, res, next) => {
  const mode = getModeById(req.headers['x-crm-mode'] || 'erp');
  
  // Route to mode-specific endpoints
  switch (mode.id) {
    case 'erp':
      erpRouter(req, res, next);
      break;
    case 'bdt':
      bdtRouter(req, res, next);
      break;
    default:
      res.status(400).json({ 
        success: false, 
        message: `Mode "${mode.id}" is not enabled` 
      });
  }
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
```

### Frontend Mode Router

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract mode from path
  const pathParts = pathname.split('/').filter(Boolean);
  const mode = pathParts[0] || 'erp';
  
  // Validate mode
  const validModes = ['erp', 'bdt', 'medical', 'beauty'];
  if (!validModes.includes(mode)) {
    // Redirect to ERP by default
    return NextResponse.redirect(new URL('/erp', request.url));
  }
  
  // Continue with mode-aware request
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)']
};
```

---

## Mode-Specific Module Structure

### ERP Module Example (`src/comketra/modes/erp/modules/real-estate/`)

```
real-estate/
├── controllers/
│   ├── properties.controller.js
│   ├── leads.controller.js
│   └── transactions.controller.js
├── models/
│   ├── property.model.js
│   ├── lead.model.js
│   └── transaction.model.js
├── routes/
│   ├── properties.route.js
│   ├── leads.route.js
│   └── transactions.route.js
├── services/
│   ├── properties.service.js
│   ├── leads.service.js
│   └── transactions.service.js
└── index.js
```

**index.js:**
```javascript
import PropertiesRouter from './routes/properties.route.js';
import LeadsRouter from './routes/leads.route.js';
import TransactionsRouter from './routes/transactions.route.js';

export {
  PropertiesRouter,
  LeadsRouter,
  TransactionsRouter
};
```

### BDT Module Example (`src/comketra/modes/bdt/modules/marketing/`)

```
marketing/
├── controllers/
│   ├── campaigns.controller.js
│   ├── drip-campaigns.controller.js
│   └── leads.controller.js
├── models/
│   ├── campaign.model.js
│   ├── drip-campaign.model.js
│   └── lead.model.js
├── routes/
│   ├── campaigns.route.js
│   ├── drip-campaigns.route.js
│   └── leads.route.js
├── services/
│   ├── campaigns.service.js
│   ├── drip-campaigns.service.js
│   └── leads.service.js
└── index.js
```

---

## Frontend Component Architecture

### ModeSwitcher Component

```typescript
// src/components/layout/ModeSwitcher.tsx
'use client';

import React, { useState } from 'react';
import { ModeContext } from '@/src/contexts/ModeContext';
import { MODES, getModeById } from '@/src/constants/modes';

export const ModeSwitcher = () => {
  const { currentMode, setMode } = React.useContext(ModeContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleModeChange = (modeId: string) => {
    setMode(modeId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getModeById(currentMode).color }}
        />
        <span className="text-sm font-medium">{getModeById(currentMode).label}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-50">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Mode
            </p>
          </div>
          <div className="py-1">
            {Object.values(MODES).filter(m => m.enabled).map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                  currentMode === mode.id
                    ? 'bg-slate-50 dark:bg-slate-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: mode.color }} />
                <div>
                  <p className={`text-sm font-medium ${currentMode === mode.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {mode.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {mode.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### Mode-Aware Sidebar

```typescript
// src/components/layout/ModeSidebar.tsx
import React from 'react';
import { ModeContext } from '@/src/contexts/ModeContext';
import { MODES } from '@/src/constants/modes';

export const ModeSidebar = () => {
  const { currentMode } = React.useContext(ModeContext);
  const modeConfig = MODES[currentMode];

  const navItems = modeConfig.modules.map(module => ({
    label: module.replace('-', ' ').toUpperCase(),
    href: `/${currentMode}/${module}`,
    icon: getIconForModule(module)
  }));

  return (
    <aside className="w-64 h-screen border-r bg-white dark:bg-slate-900">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">{modeConfig.label} Navigation</h2>
      </div>
      <nav className="p-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};
```

---

## Shared Core Services

### Shared Modules (Available to All Modes)

1. **User Management**
   - User CRUD operations
   - Profile management
   - Avatar uploads
   - Session management

2. **Calendar**
   - Event management
   - Scheduling
   - Availability tracking
   - Calendar integrations

3. **Roles Management**
   - Role definitions
   - Permission assignments
   - Role-based access control
   - Audit logging

4. **CRM Settings**
   - Company settings
   - Theme customization
   - Feature toggles
   - Notifications

5. **Authentication**
   - User login/logout
   - Token management
   - Password reset
   - Two-factor authentication

### Shared API Endpoints

```
# Auth
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

# Users
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

# Roles
GET    /api/roles
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id

# Settings
GET    /api/settings
PUT    /api/settings
GET    /api/settings/:key

# Calendar
GET    /api/calendar/events
POST   /api/calendar/events
PUT    /api/calendar/events/:id
DELETE /api/calendar/events/:id
```

---

## Database Schema

### Shared Collections

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  avatar: String,
  role: String,
  mode: String, // Active mode
  permissions: [String],
  settings: Schema.Types.Mixed,
  createdAt: Date,
  updatedAt: Date
}

// Roles Collection
{
  _id: ObjectId,
  name: String,
  code: String,
  permissions: [String],
  mode: String,
  createdAt: Date,
  updatedAt: Date
}

// Settings Collection
{
  _id: ObjectId,
  key: String,
  value: Schema.Types.Mixed,
  mode: String,
  updatedAt: Date
}

// Calendar Events Collection
{
  _id: ObjectId,
  title: String,
  description: String,
  start: Date,
  end: Date,
  type: String,
  relatedTo: {
    type: String,
    ref: 'ModelName',
    id: ObjectId
  },
  assignees: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Mode-Specific Collections

```javascript
// ERP Mode Collections
{
  name: 'properties',
  schema: {
    title: String,
    description: String,
    price: Number,
    location: String,
    type: String,
    status: String,
    images: [String],
    amenities: [String],
    agentId: ObjectId,
    createdAt: Date
  }
},

{
  name: 'transactions',
  schema: {
    propertyId: ObjectId,
    buyerId: ObjectId,
    sellerId: ObjectId,
    amount: Number,
    status: String,
    documents: [String],
    createdAt: Date
  }
},

// BDT Mode Collections
{
  name: 'marketing_leads',
  schema: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    source: String,
    campaignId: ObjectId,
    status: String,
    score: Number,
    createdAt: Date
  }
},

{
  name: 'marketing_campaigns',
  schema: {
    name: String,
    description: String,
    type: String,
    status: String,
    startDate: Date,
    endDate: Date,
    budget: Number,
    createdAt: Date
  }
}
```

---

## Permission System

### Permission Configuration

```typescript
// src/constants/modes.ts
export const MODE_PERMISSIONS = {
  ERP: {
    // ERP-specific permissions
    'real-estate:read': 'View properties',
    'real-estate:write': 'Create/edit properties',
    'finance:read': 'View financial data',
    'finance:write': 'Create/edit financial records',
    'operations:read': 'View operations',
    'operations:write': 'Manage operations',
    'inventory:read': 'View inventory',
    'inventory:write': 'Manage inventory'
  },
  
  BDT: {
    // BDT-specific permissions
    'marketing:read': 'View marketing data',
    'marketing:write': 'Create/edit marketing campaigns',
    'sales:read': 'View sales data',
    'sales:write': 'Manage sales leads',
    'lead-gen:read': 'View lead generation data',
    'lead-gen:write': 'Manage lead generation',
    'analytics:read': 'View analytics',
    'analytics:write': 'Create analytics reports'
  },
  
  MEDICAL: {
    // Medical-specific permissions
    'patients:read': 'View patient records',
    'patients:write': 'Create/edit patient records',
    'appointments:read': 'View appointments',
    'appointments:write': 'Manage appointments',
    'treatments:read': 'View treatments',
    'treatments:write': 'Manage treatments',
    'billing:read': 'View billing',
    'billing:write': 'Manage billing'
  },
  
  BEAUTY: {
    // Beauty-specific permissions
    'clients:read': 'View client profiles',
    'clients:write': 'Create/edit client profiles',
    'appointments:read': 'View appointments',
    'appointments:write': 'Manage appointments',
    'services:read': 'View services',
    'services:write': 'Manage services',
    'products:read': 'View products',
    'products:write': 'Manage products'
  }
};

export const DEFAULT_PERMISSIONS = {
  super_admin: ['*'], // All permissions
  admin: ['*'], // All permissions in active mode
  user: ['read'] // Read-only access
};
```

### Permission Middleware

```javascript
// middleware/feature-flags.js
import { MODE_PERMISSIONS, DEFAULT_PERMISSIONS } from '../config/modes.js';

export const checkPermission = (user, permission, mode) => {
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === 'super_admin') return true;
  
  // Get user's permissions for the active mode
  const userPermissions = user.permissions[mode] || [];
  
  // Check if permission exists
  return userPermissions.includes(permission) || 
         userPermissions.includes('*') ||
         (permission.startsWith('read') && userPermissions.includes('read'));
};

export const modeFeatureGuard = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    const mode = req.headers['x-crm-mode'] || 'erp';
    
    if (!checkPermission(user, permission, mode)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${permission} in mode ${mode}`
      });
    }
    
    next();
  };
};
```

---

## Onboarding Flow

### First-Time Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    First-Time User Onboarding                    │
├─────────────────────────────────────────────────────────────────┤
│  1. User Registers/Logs In                                       │
│     ↓                                                            │
│  2. System Detects New User                                      │
│     ↓                                                            │
│  3. Onboarding Modal Opens (HubSpot-style)                      │
│     ↓                                                            │
│  4. User Selects CRM Mode                                       │
│     ├─ ERP (Enterprise Resource Planning)                       │
│     ├─ BDT (Business Development)                               │
│     ├─ Medical (Practice Management)                            │
│     └─ Beauty (Salon Management)                                │
│     ↓                                                            │
│  5. Mode-Specific Setup Wizard                                  │
│     ├─ Company Information                                      │
│     ├─ Team Members                                             │
│     ├─ Module Selection                                         │
│     └─ Data Import (Optional)                                   │
│     ↓                                                            │
│  6. Mode Configuration Saved                                    │
│     ↓                                                            │
│  7. User Redirected to Mode Dashboard                           │
│     ↓                                                            │
│  8. Ongoing Onboarding (Contextual Tips)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Onboarding Components

```typescript
// app/onboarding/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);

  const modes = [
    {
      id: 'erp',
      name: 'Enterprise Resource Planning',
      description: 'Comprehensive ERP for business operations',
      features: ['Real Estate', 'Finance', 'Operations', 'Inventory']
    },
    {
      id: 'bdt',
      name: 'Business Development',
      description: 'Lead generation and marketing platform',
      features: ['Marketing', 'Sales', 'Lead Gen', 'Analytics']
    },
    {
      id: 'medical',
      name: 'Medical Practice',
      description: 'Practice management and patient records',
      features: ['Patients', 'Appointments', 'Treatments', 'Billing']
    },
    {
      id: 'beauty',
      name: 'Beauty & Wellness',
      description: 'Salon and spa management system',
      features: ['Clients', 'Appointments', 'Services', 'Products']
    }
  ];

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
    setStep(1);
    // Save mode preference to backend
  };

  const handleComplete = () => {
    // Complete onboarding
    router.push(`/${selectedMode}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to Wholcure CRM
          </h1>
          <p className="text-lg text-slate-600">
            Select your CRM mode to get started
          </p>
        </div>

        {/* Step 1: Mode Selection */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className="cursor-pointer p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <h3 className="text-xl font-bold text-blue-600">
                      {mode.name}
                    </h3>
                  </div>
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-slate-600 mb-4">{mode.description}</p>
                <div className="flex flex-wrap gap-2">
                  {mode.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Setup */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Setup {modes.find(m => m.id === selectedMode)?.name}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Modules
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Module checkboxes */}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Using {modes.find(m => m.id === selectedMode)?.name}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Adding New Modes

### Step-by-Step Process to Add a New Mode

#### 1. Backend Setup

**Step 1.1:** Create mode directory structure
```
src/comketra/modes/newmode/
├── modules/
│   ├── module1/
│   ├── module2/
│   └── index.js
└── index.js
```

**Step 1.2:** Register mode in `config/modes.js`
```javascript
export const MODES = {
  // ... existing modes ...
  NEWMODE: {
    id: 'newmode',
    name: 'NewMode',
    label: 'New Mode',
    path: '/newmode',
    description: 'New mode description',
    icon: 'NewMode',
    color: '#color',
    enabled: true,
    modules: ['module1', 'module2'],
    sharedModules: ['auth', 'users', 'roles', 'calendar', 'settings']
  }
};
```

**Step 1.3:** Create mode router
```javascript
// src/comketra/modes/newmode/index.js
import Module1Router from './modules/module1/index.js';
import Module2Router from './modules/module2/index.js';

export default function newModeRouter(req, res, next) {
  // Route to module-specific routers
  // Implementation depends on routes
}
```

#### 2. Frontend Setup

**Step 2.1:** Create mode routes
```
app/newmode/
├── page.tsx
├── layout.tsx
├── module1/
│   └── page.tsx
└── module2/
    └── page.tsx
```

**Step 2.2:** Create mode components
```typescript
// src/components/layout/ModeSwitcher.tsx
// Add mode to navigation

// src/constants/modes.ts
// Add mode configuration
```

**Step 2.3:** Update mode registry
```typescript
// src/services/modes/index.ts
export const MODES = {
  // ... existing modes ...
  NEWMODE: {
    id: 'newmode',
    apiService: newModeService,
    components: {
      dashboard: NewModeDashboard,
      sidebar: NewModeSidebar
    }
  }
};
```

#### 3. Testing

1. **Backend Testing:**
   - Test API endpoints
   - Test permission checks
   - Test mode switching
   - Test data isolation

2. **Frontend Testing:**
   - Test navigation
   - Test mode switching
   - Test component rendering
   - Test API integration

3. **Integration Testing:**
   - Test shared features
   - Test cross-mode data
   - Test permission inheritance

---

## Database Migration Strategy

### Mode-Specific Data Isolation

```javascript
// Helper function for data isolation
const getModeFilter = (mode) => ({
  mode: mode,
  isDeleted: false
});

// Example: Get leads for specific mode
const getModeLeads = async (mode, filters = {}) => {
  const filter = {
    ...getModeFilter(mode),
    ...filters
  };
  
  return await Lead.find(filter)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .lean();
};
```

### Data Migration Script

```javascript
// scripts/migrate-to-modes.js
/**
 * Migrate existing data to mode-based structure
 * Run this script when adding mode support to existing data
 */

const mongoose = require('mongoose');
const { MODES } = require('../config/modes');

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Migration logic
    // 1. Add mode field to existing collections
    // 2. Set default mode for existing users
    // 3. Update permissions based on mode
    
    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
```

---

## Deployment Strategy

### Multi-Mode Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wholcure-crm
spec:
  replicas: 3
  selector:
    matchLabels:
      app: wholcure-crm
  template:
    metadata:
      labels:
        app: wholcure-crm
    spec:
      containers:
      - name: crm
        image: wholcure/crm:latest
        ports:
        - containerPort: 5000
        env:
        - name: MODES_ENABLED
          value: "erp,bdt,medical,beauty"
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

---

## Future Expansion

### Adding New Verticals

**Template for New Verticals:**

1. Create mode directory structure
2. Define mode configuration
3. Implement module structure
4. Create API endpoints
5. Build frontend components
6. Add permissions
7. Test thoroughly
8. Document features

**Examples:**

- **Logistics Mode:** Tracking, shipments, routes, fleet management
- **Education Mode:** Students, courses, assessments, scheduling
- **Healthcare Mode:** Patients, doctors, appointments, records
- **Nonprofit Mode:** Donors, campaigns, volunteers, events

---

## Conclusion

### Key Benefits of Multi-Mode Architecture

1. **Scalability:** Add new verticals without breaking existing code
2. **Isolation:** Mode-specific data remains isolated
3. **Shared Core:** Common features (auth, users, roles) are shared
4. **Flexibility:** Easy to enable/disable modes
5. **Extensibility:** Simple template for new verticals
6. **Maintainability:** Clear separation of concerns

### Architecture Principles

1. **Modular Design:** Each mode is self-contained
2. **Shared Services:** Common functionality is reusable
3. **Permission-Based Access:** Fine-grained access control
4. **Mode-Aware Routing:** Clean URL structure
5. **Extensible Framework:** Easy to add new modes

### Next Steps

1. Implement ERP mode in `src/comketra/modes/erp/`
2. Implement BDT mode in `src/comketra/modes/bdt/`
3. Create mode switching UI
4. Implement onboarding flow
5. Test cross-mode functionality
6. Document new architecture

---

**Document Version**: 1.0  
**Last Updated**: October 27, 2026  
**Created By**: Kiro AI Assistant  
**Status**: Complete Architecture Plan
