import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DealStage, Opportunity } from '@/src/types/dealflow/opportunity';

interface OpportunityState {
  opportunities: Opportunity[];
  pipelineStages: DealStage[];
  selectedDealId: string | null;
  isCreateModalOpen: boolean;
  isOverviewDrawerOpen: boolean;
  searchQuery: string;
  
  // Actions
  setOpportunities: (opportunities: Opportunity[]) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  moveStage: (id: string, direction: 'prev' | 'next') => void;
  moveOpportunityToStage: (id: string, newStage: string) => void;
  
  setSelectedDealId: (id: string | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openOverviewDrawer: () => void;
  closeOverviewDrawer: () => void;
  setSearchQuery: (query: string) => void;
}

const INITIAL_STAGES: DealStage[] = [
  'Discovery',
  'Value Prop',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'op-1',
    dealCode: 'OPP-001',
    accountName: 'Acme Corp',
    dealTitle: 'Enterprise License',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'MV',
    stage: 'Proposal',
    amount: 120000,
    mrr: 10000,
    arr: 120000,
    closeProbability: 65,
    expectedCloseDate: '2026-12-15',
    stagnationDays: 3,
    slaBreachRisk: 'Low',
    healthScore: 85,
    lastTouchpoint: 'Follow-up call scheduled',
    primaryContact: 'John Smith',
    industry: 'Technology',
    notes: 'Multiple stakeholders involved. Decision expected next week.'
  },
  {
    id: 'op-2',
    dealCode: 'OPP-002',
    accountName: 'HealthPlus',
    dealTitle: 'Implementation Services',
    ownerName: 'Sarah Chen',
    ownerAvatar: 'SC',
    stage: 'Discovery',
    amount: 85000,
    mrr: 7000,
    arr: 85000,
    closeProbability: 45,
    expectedCloseDate: '2027-01-20',
    stagnationDays: 5,
    slaBreachRisk: 'Medium',
    healthScore: 72,
    lastTouchpoint: 'Initial discovery call',
    primaryContact: 'Dr. Emily Wilson',
    industry: 'Healthcare'
  },
  {
    id: 'op-3',
    dealCode: 'OPP-003',
    accountName: 'FinTrust',
    dealTitle: 'CRM Migration',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'AR',
    stage: 'Negotiation',
    amount: 250000,
    mrr: 20833,
    arr: 250000,
    closeProbability: 80,
    expectedCloseDate: '2026-12-01',
    stagnationDays: 1,
    slaBreachRisk: 'Low',
    healthScore: 92,
    lastTouchpoint: 'Contract review in progress',
    primaryContact: 'Michael Chen',
    industry: 'Finance',
    notes: 'Budget approved. Legal review pending.'
  }
];

export const useOpportunityStore = create<OpportunityState>()(
  persist(
    (set) => ({
      opportunities: INITIAL_OPPORTUNITIES,
      pipelineStages: INITIAL_STAGES,
      selectedDealId: null,
      isCreateModalOpen: false,
      isOverviewDrawerOpen: false,
      searchQuery: '',
      
      setOpportunities: (opportunities) => set({ opportunities }),
      addOpportunity: (opportunity) => set((state) => ({ opportunities: [opportunity, ...state.opportunities] })),
      updateOpportunity: (id, updates) => set((state) => ({
        opportunities: state.opportunities.map(op => op.id === id ? { ...op, ...updates } : op)
      })),
      deleteOpportunity: (id) => set((state) => ({
        opportunities: state.opportunities.filter(op => op.id !== id),
        selectedDealId: state.selectedDealId === id ? null : state.selectedDealId
      })),
      moveStage: (id, direction) => set((state) => {
        const opportunity = state.opportunities.find(op => op.id === id);
        if (!opportunity) return state;
        
        const currentIndex = state.pipelineStages.indexOf(opportunity.stage);
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= state.pipelineStages.length) newIndex = state.pipelineStages.length - 1;
        
        return {
          opportunities: state.opportunities.map(op => 
            op.id === id ? { ...op, stage: state.pipelineStages[newIndex] } : op
          )
        };
      }),
      moveOpportunityToStage: (id, newStage) => set((state) => ({
        opportunities: state.opportunities.map(op => 
          op.id === id ? { ...op, stage: newStage as any } : op
        )
      })),
      
      setSelectedDealId: (id) => set({ selectedDealId: id }),
      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),
      openOverviewDrawer: () => set({ isOverviewDrawerOpen: true }),
      closeOverviewDrawer: () => set({ isOverviewDrawerOpen: false }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'opportunity-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        opportunities: state.opportunities,
        pipelineStages: state.pipelineStages
      })
    }
  )
);
