'use client';

import React, { useState } from 'react';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiUsers, 
  FiPieChart, 
  FiDollarSign, 
  FiAward, 
  FiCheckCircle, 
  FiArrowUpRight,
  FiFilter
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  mockMonthlyRevenue, 
  mockFunnelMetrics, 
  mockLeaderboard, 
  mockCohorts 
} from '@/src/services/rengrowcure/reportsCureService';
import { 
  MonthlyRevenueData, 
  FunnelMetric, 
  RepPerformanceLeaderboard, 
  ChannelAttributionCohort 
} from '@/src/types/rengrowcure/reportsCure';

type TabKey = 'executive' | 'leaderboard' | 'cohorts';

export default function ReportsCureModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('executive');
  const [revenueData] = useState<MonthlyRevenueData[]>(mockMonthlyRevenue);
  const [funnel] = useState<FunnelMetric[]>(mockFunnelMetrics);
  const [leaderboard] = useState<RepPerformanceLeaderboard[]>(mockLeaderboard);
  const [cohorts] = useState<ChannelAttributionCohort[]>(mockCohorts);

  const currentArr = revenueData[revenueData.length - 1]?.actualArr || 0;
  const currentPipeline = revenueData[revenueData.length - 1]?.pipelineValue || 0;
  const currentClosedWon = revenueData[revenueData.length - 1]?.closedWon || 0;

  return (
    <div className="w-full space-y-4">
      <RenGrowCureHeader currentModule="reportscure" />

      {/* Top High-Level Performance Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Annual Recurring Run-Rate
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            ${currentArr.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <FiArrowUpRight size={12} /> +12.4% vs last month
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Weighted Qualified Pipeline
          </span>
          <div className="text-xl font-bold font-mono text-cyan-600 mt-1">
            ${currentPipeline.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Current active deals
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Q4 Closed Won Revenue
          </span>
          <div className="text-xl font-bold font-mono text-indigo-600 mt-1">
            ${currentClosedWon.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            108% of target quota
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Average Sales Cycle
          </span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
            23.5 Days
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            -4.2 days faster than Q3
          </span>
        </div>
      </div>

      {/* Main Tab Controller */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'executive' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiBarChart2 size={14} className="text-cyan-600" />
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leaderboard' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiAward size={14} className="text-amber-500" />
            <span>Rep Performance Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('cohorts')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cohorts' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiPieChart size={14} className="text-indigo-600" />
            <span>Channel Attribution & Cohorts</span>
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Financial Year 2026 • Reporting Engine Synchronized
        </div>
      </div>

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'executive' && (
        <div className="space-y-4">
          {/* Revenue Velocity Bar Chart Mock */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Revenue Run-Rate Progression (May - Oct 2026)</h3>
                <p className="text-xs text-slate-500">Actual ARR vs Target Projected Trajectory</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-cyan-600"></span> Actual ARR
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-slate-300"></span> Projected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 pt-4 items-end h-48">
              {revenueData.map((m) => {
                const heightPercent = Math.round((m.actualArr / 900000) * 100);
                const projPercent = Math.round((m.projectedArr / 900000) * 100);

                return (
                  <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-36">
                      <div 
                        className="w-1/2 bg-slate-200 rounded-t-md transition-all hover:bg-slate-300"
                        style={{ height: `${projPercent}%` }}
                        title={`Projected: $${m.projectedArr.toLocaleString()}`}
                      />
                      <div 
                        className="w-1/2 bg-cyan-600 rounded-t-md transition-all hover:bg-cyan-700"
                        style={{ height: `${heightPercent}%` }}
                        title={`Actual: $${m.actualArr.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 text-center">{m.month.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400">${Math.round(m.actualArr / 1000)}k</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Funnel Conversion Velocity */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Commercial Conversion Funnel</h3>
            <div className="space-y-3">
              {funnel.map((step) => (
                <div key={step.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{step.stage}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-500">{step.count.toLocaleString()} leads</span>
                      <span className="font-bold text-slate-900">${step.value.toLocaleString()}</span>
                      <span className="text-cyan-700 font-bold w-12 text-right">{step.conversionRate}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full"
                      style={{ width: `${step.conversionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales Representative Quota Achievement</h3>
              <p className="text-xs text-slate-500">Live rankings based on contracted ARR and deal velocity</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Representative</th>
                  <th className="py-3 px-4">Quota Target</th>
                  <th className="py-3 px-4">Achievement ($)</th>
                  <th className="py-3 px-4">Quota Attainment</th>
                  <th className="py-3 px-4">Deals Won</th>
                  <th className="py-3 px-4">Avg Velocity</th>
                  <th className="py-3 px-4 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {leaderboard.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        rep.rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{rep.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {rep.avatar}
                        </div>
                        <span className="font-bold text-slate-900">{rep.repName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">${rep.quotaTarget.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">${rep.achievement.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${
                          rep.quotaPercent >= 100 ? 'text-emerald-600' : 'text-slate-800'
                        }`}>
                          {rep.quotaPercent}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              rep.quotaPercent >= 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${Math.min(rep.quotaPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{rep.dealsClosed} deals</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{rep.avgVelocityDays} days</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{rep.winRatePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COHORTS */}
      {activeTab === 'cohorts' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Channel Attribution & ROI Performance</h3>
              <p className="text-xs text-slate-500">Revenue generation, CAC, and payback multipliers across demand channels.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Demand Channel</th>
                  <th className="py-3 px-4">Leads Ingested</th>
                  <th className="py-3 px-4">SQLs Converted</th>
                  <th className="py-3 px-4">Deals Won</th>
                  <th className="py-3 px-4">Revenue Generated</th>
                  <th className="py-3 px-4">Customer Acquisition Cost</th>
                  <th className="py-3 px-4">Avg Days to Close</th>
                  <th className="py-3 px-4 text-right">ROI Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {cohorts.map((c) => (
                  <tr key={c.channel} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.channel}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{c.leadsGenerated.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-indigo-700 font-bold">{c.sqlsConverted}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.dealsWon}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">${c.revenueGenerated.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">${c.cac}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.avgDaysToClose} days</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.roiMultiplier}x ROI
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
