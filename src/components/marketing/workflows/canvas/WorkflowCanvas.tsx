'use client'

import React, { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { CustomNodeCard } from './CustomNodeCard'
import { ControlsToolbar } from './ControlsToolbar'
import { NodeInspectorSidebar } from '../modals/NodeInspectorSidebar'
import { WorkflowSettingsModal } from '../modals/WorkflowSettingsModal'
import {
  Workflow,
  WorkflowGraph,
  WorkflowNode,
  WorkflowNodeType,
  MarketingIntegrationDomain,
} from '@/src/types/marketing/workflow'
import { FiPlus, FiLayers, FiZap, FiSend } from 'react-icons/fi'

const nodeTypes = {
  trigger: CustomNodeCard,
  action: CustomNodeCard,
  condition: CustomNodeCard,
  router: CustomNodeCard,
}

interface WorkflowCanvasProps {
  workflow: Workflow
  onSaveWorkflow: (updated: Partial<Workflow>) => Promise<void>
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ workflow, onSaveWorkflow }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const initialNodes = useMemo(() => {
    return (workflow.graph?.nodes || []) as WorkflowNode[]
  }, [workflow.graph])

  const initialEdges = useMemo(() => {
    return (workflow.graph?.edges || []) as Edge[]
  }, [workflow.graph])

  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(workflow)

  // Connection handler
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2.5 },
          },
          eds
        )
      )
      setHasUnsavedChanges(true)
    },
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as unknown as WorkflowNode)
    setIsInspectorOpen(true)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setIsInspectorOpen(false)
  }, [])

  const handleUpdateNode = useCallback(
    (nodeId: string, updatedData: Partial<WorkflowNode['data']>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const currentData = node.data
            const mergedData = {
              ...currentData,
              ...updatedData,
              config: {
                ...currentData.config,
                ...(updatedData.config || {}),
              },
            }
            return {
              ...node,
              data: mergedData,
            }
          }
          return node
        })
      )
      setSelectedNode((prev) => {
        if (!prev || prev.id !== nodeId) return prev
        return {
          ...prev,
          data: {
            ...prev.data,
            ...updatedData,
            config: {
              ...prev.data.config,
              ...(updatedData.config || {}),
            },
          },
        }
      })
      setHasUnsavedChanges(true)
    },
    [setNodes]
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null)
        setIsInspectorOpen(false)
      }
      setHasUnsavedChanges(true)
    },
    [setNodes, setEdges, selectedNode]
  )

  const handleAddNode = useCallback(
    (type: WorkflowNodeType, subType: string, domain: MarketingIntegrationDomain) => {
      const newNodeId = `node-${domain}-${Date.now().toString(36)}`
      const posX = 120 + (nodes.length % 5) * 80
      const posY = 120 + (nodes.length % 3) * 120

      const defaultData: WorkflowNode['data'] = {
        label: subType.replace(/^(Trigger-|Action-|Logic-)/, '').replace(/-/g, ' '),
        nodeType: type,
        subType,
        domain,
        description: `Connected step for ${domain.replace('-', ' ')}`,
        config: {
          dripCampaignId: domain === 'drip-campaigns' ? 'drip_nutrition_food' : undefined,
          campaignId: domain === 'campaigns' ? 'cmp_101' : undefined,
          socialPlatform: domain === 'content-engine' ? 'LinkedIn' : undefined,
          globalEventName: domain === 'global-crm' ? 'crm.automation.sync' : undefined,
        },
        telemetry: {
          processedCount: 0,
          successCount: 0,
          failureCount: 0,
          efficiency: 100,
        },
      }

      const newNode: WorkflowNode = {
        id: newNodeId,
        type,
        position: { x: posX, y: posY },
        data: defaultData,
      }

      setNodes((nds) => [...nds, newNode])
      setSelectedNode(newNode)
      setIsInspectorOpen(true)
      setHasUnsavedChanges(true)
    },
    [nodes.length, setNodes]
  )

  const handleToggleStatus = useCallback(async () => {
    const nextStatus = currentWorkflow.status === 'Active' ? 'Paused' : 'Active'
    setCurrentWorkflow((prev) => ({ ...prev, status: nextStatus }))
    await onSaveWorkflow({ status: nextStatus })
  }, [currentWorkflow.status, onSaveWorkflow])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const graph: WorkflowGraph = {
        nodes: nodes,
        edges: edges,
      }
      await onSaveWorkflow({
        graph,
        status: currentWorkflow.status,
      })
      setHasUnsavedChanges(false)
    } finally {
      setIsSaving(false)
    }
  }, [nodes, edges, currentWorkflow.status, onSaveWorkflow])

  const handleSaveSettings = useCallback(
    async (updates: Partial<Workflow>) => {
      setCurrentWorkflow((prev) => ({ ...prev, ...updates }))
      await onSaveWorkflow(updates)
      setHasUnsavedChanges(false)
    },
    [onSaveWorkflow]
  )

  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden select-none">
      <ControlsToolbar
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ duration: 400, padding: 0.25 })}
        onSave={handleSave}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddNode={handleAddNode}
        onToggleStatus={handleToggleStatus}
        status={currentWorkflow.status}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Blank Canvas Empty State Overlay with Quick Action Buttons */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-slate-200/90 shadow-2xl text-center pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <FiZap className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Blank Automation Canvas</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Start building your visual workflow by adding an entry trigger node or selecting a marketing action below.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                onClick={() => handleAddNode('trigger', 'Trigger-Lead-Captured', 'leads-capture')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Trigger</span>
              </button>
              <button
                onClick={() => handleAddNode('action', 'Action-Enroll-Drip-Campaign', 'drip-campaigns')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <FiLayers className="w-4 h-4" />
                <span>Add Drip Step</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => {
          onNodesChange(changes)
          setHasUnsavedChanges(true)
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes)
          setHasUnsavedChanges(true)
        }}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        snapToGrid={true}
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2.5 },
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-[#f8fafc]"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.4} color="#cbd5e1" />
        <Controls
          showInteractive={false}
          className="!left-5 !bottom-5 !bg-white !shadow-xl !border !border-slate-200 !rounded-2xl overflow-hidden"
        />

        {/* Clean Modern Glassy Minimap */}
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger':
                return '#4f46e5'
              case 'condition':
                return '#f59e0b'
              case 'action':
              default:
                return '#2563eb'
            }
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bottom-5 !right-5 !bg-white/95 !backdrop-blur-md !rounded-2xl !border !border-slate-200/90 !shadow-xl overflow-hidden !w-48 !h-32"
          maskColor="rgba(241, 245, 249, 0.85)"
        />
      </ReactFlow>

      {/* Slide-over Node Inspector */}
      <NodeInspectorSidebar
        node={selectedNode}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />

      {/* Global Workflow Settings Modal */}
      <WorkflowSettingsModal
        workflow={currentWorkflow}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  )
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
