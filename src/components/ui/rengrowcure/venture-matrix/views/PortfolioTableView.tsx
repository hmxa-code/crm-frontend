import React from 'react';
import { FiTrash2, FiExternalLink } from 'react-icons/fi';
import { VentureDeal } from '@/src/types/rengrowcure/ventureMatrix';
import { StageBadge } from '../shared/StageBadge';
import { SlaRiskBadge } from '../shared/SlaRiskBadge';

interface PortfolioTableViewProps {
  deals: VentureDeal[];
  onDeleteDeal: (dealId: string) => void;
  onSelectDeal?: (deal: VentureDeal) => void;
}

export const PortfolioTableView: React.FC<PortfolioTableViewProps> = ({
  deals,
  onDeleteDeal,
  onSelectDeal
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Deal Identifier</th>
              <th className="py-3 px-4">Account & Solution Title</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">ARR / MRR Value</th>
              <th className="py-3 px-4">Close Probability</th>
              <th className="py-3 px-4">Expected Close</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Health</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {deals.map((d) => (
              <tr 
                key={d.id} 
                onClick={() => onSelectDeal?.(d)}
                className="hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    {d.dealCode}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{d.accountName}</div>
                  <div className="text-[11px] text-slate-500">{d.dealTitle}</div>
                </td>
                <td className="py-3 px-4">
                  <StageBadge stage={d.stage} />
                </td>
                <td className="py-3 px-4">
                  <SlaRiskBadge risk={d.slaBreachRisk} />
                </td>
                <td className="py-3 px-4">
                  <div className="font-mono font-bold text-slate-900">${d.amount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-mono">${d.mrr.toLocaleString()}/mo</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-mono text-slate-800">{d.closeProbability}%</span>
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 rounded-full" 
                        style={{ width: `${d.closeProbability}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">{d.expectedCloseDate}</td>
                <td className="py-3 px-4 font-medium text-slate-800">{d.ownerName}</td>
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-emerald-600">{d.healthScore}/100</span>
                </td>
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onDeleteDeal(d.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Deal"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  No deals matched your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
