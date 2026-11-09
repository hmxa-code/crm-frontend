'use client';

import React, { useState } from 'react';
import {
  FiClock,
  FiUserCheck,
  FiCoffee,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
  FiArrowUpRight,
  FiCalendar,
  FiActivity,
  FiUsers,
} from 'react-icons/fi';
import { useAttendance, formatDurationHM } from '@/src/utils/attendanceStore';
import { getAvatarUrl } from '@/src/utils/avatarHelper';

export default function UserAttendanceLedger() {
  const {
    adminRecord,
    teamMembers,
    allStaffAttendance,
    logs,
    elapsedFormattedHMS,
    elapsedFormattedHM,
    isCheckedIn,
    isOnBreak,
    checkIn,
    checkOut,
    toggleBreak,
    toggleMemberStatus,
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CHECKED_IN' | 'ON_BREAK' | 'CHECKED_OUT'>('ALL');

  const activeCount = allStaffAttendance.filter((m) => m.status === 'checked_in').length;
  const breakCount = allStaffAttendance.filter((m) => m.status === 'on_break').length;
  const outCount = allStaffAttendance.filter((m) => m.status === 'checked_out').length;

  const filteredStaff = allStaffAttendance.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = m.userName.toLowerCase().includes(q) || m.userRole.toLowerCase().includes(q);
    if (!matchesQuery) return false;

    if (filterStatus === 'CHECKED_IN') return m.status === 'checked_in';
    if (filterStatus === 'ON_BREAK') return m.status === 'on_break';
    if (filterStatus === 'CHECKED_OUT') return m.status === 'checked_out';
    return true;
  });

  return (
    <div className="space-y-6">

      {/* 1. Metric Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Directory Staff</span>
            <strong className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 block">{allStaffAttendance.length} <span className="text-xs sm:text-sm">Members</span></strong>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">Access control active</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FiUsers size={18} />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200/80 shadow-3xs flex items-center justify-between bg-emerald-50/10">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Currently Checked In</span>
            <strong className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-0.5 block">{activeCount} <span className="text-xs sm:text-sm">At Work</span></strong>
            <span className="text-[9px] sm:text-[10px] font-medium text-emerald-600">Active working shift</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100/70 flex items-center justify-center text-emerald-700">
            <FiCheckCircle size={18} />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/80 shadow-3xs flex items-center justify-between bg-amber-50/10">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 uppercase tracking-wider block">On Rest Break</span>
            <strong className="text-lg sm:text-xl font-extrabold text-amber-700 mt-0.5 block">{breakCount} <span className="text-xs sm:text-sm">Members</span></strong>
            <span className="text-[9px] sm:text-[10px] font-medium text-amber-600">Temporary break pause</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-700">
            <FiCoffee size={18} />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shift Completed</span>
            <strong className="text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5 block">{outCount} <span className="text-xs sm:text-sm">Checked Out</span></strong>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">Off-duty / Logged out</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FiXCircle size={18} />
          </div>
        </div>
      </div>

      {/* 2. Interactive Admin Shift Control Center (Synced with Chat Workspace) */}
      <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/40 via-emerald-50/20 to-transparent pointer-events-none rounded-bl-full" />
        
        <div className="space-y-3 relative">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white uppercase tracking-wider">
              Your Active Session
            </span>
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold ${
              isCheckedIn
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isOnBreak
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isCheckedIn ? 'bg-emerald-500 animate-pulse' : isOnBreak ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
              <span>
                {isCheckedIn ? 'Remote Work Active' : isOnBreak ? 'On Rest Break' : 'Checked Out'}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{adminRecord.userName}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Synchronized live with Chat Workspace Hub • Checked in at <strong>{adminRecord.checkInTime}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 font-semibold">
              <FiCalendar size={13} className="text-slate-400" />
              <span>Date: <strong>Today</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 font-semibold">
              <FiClock size={13} className="text-slate-400" />
              <span>Check-In: <strong>{adminRecord.checkInTime}</strong></span>
            </div>
            {adminRecord.checkOutTime && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 font-semibold">
                <FiXCircle size={13} className="text-rose-500" />
                <span>Check-Out: <strong>{adminRecord.checkOutTime}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Stopwatch & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-md border border-slate-800 text-center min-w-[170px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shift Elapsed</span>
            <div className="text-2xl font-black font-mono tracking-tight text-emerald-400 mt-0.5">
              {elapsedFormattedHMS}
            </div>
            <span className="text-[9px] text-slate-400 font-medium">
              {isCheckedIn ? '● Timer Active' : isOnBreak ? '☕ Paused on Break' : '○ Shift Saved'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {isCheckedIn || isOnBreak ? (
              <>
                <button
                  type="button"
                  onClick={toggleBreak}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-2xs border ${
                    isOnBreak
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                      : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <FiCoffee size={14} />
                  <span>{isOnBreak ? 'Resume Work' : '15m Break'}</span>
                </button>

                <button
                  type="button"
                  onClick={checkOut}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <FiUserCheck size={14} />
                  <span>Check Out Now</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={checkIn}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <FiCheckCircle size={15} />
                <span>Check In for Shift</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Team Timesheet & Shift Ledger */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Staff Shift Ledger
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredStaff.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 focus-within:border-slate-300">
              <FiSearch size={13} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-48"
              />
            </div>

            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 gap-0.5">
              {(['ALL', 'CHECKED_IN', 'ON_BREAK', 'CHECKED_OUT'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                    filterStatus === st
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timesheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-5 font-semibold">Staff Member</th>
                <th className="py-2.5 px-5 font-semibold">Attendance Status</th>
                <th className="py-2.5 px-5 font-semibold">Check-In</th>
                <th className="py-2.5 px-5 font-semibold">Check-Out</th>
                <th className="py-2.5 px-5 font-semibold">Worked Duration</th>
                <th className="py-2.5 px-5 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member) => {
                const isAdmin = member.userId === 'u-me';
                const currentDuration = isAdmin
                  ? elapsedFormattedHM
                  : formatDurationHM(member.baseElapsedSeconds);

                return (
                  <tr key={member.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* User Details */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatarUrl(member.avatar, member.userName)}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-2xs shrink-0"
                          alt={member.userName}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {member.userName}
                            {isAdmin && (
                              <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold">
                                Current User
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate">
                            {member.userRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        member.status === 'checked_in'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : member.status === 'on_break'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'checked_in'
                            ? 'bg-emerald-500 animate-pulse'
                            : member.status === 'on_break'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`} />
                        <span>
                          {member.status === 'checked_in'
                            ? 'Checked In'
                            : member.status === 'on_break'
                            ? '15m Break'
                            : 'Checked Out'}
                        </span>
                      </span>
                    </td>

                    {/* Check In */}
                    <td className="py-3 px-5 font-semibold text-slate-700">
                      <div className="flex items-center gap-1">
                        <FiClock size={12} className="text-slate-400" />
                        <span>{member.checkInTime}</span>
                      </div>
                    </td>

                    {/* Check Out */}
                    <td className="py-3 px-5 font-semibold text-slate-700">
                      {member.checkOutTime ? (
                        <span>{member.checkOutTime}</span>
                      ) : (
                        <span className="text-slate-400 italic font-normal">— Shift Active</span>
                      )}
                    </td>

                    {/* Worked Duration */}
                    <td className="py-3 px-5 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px]">
                          {currentDuration}
                        </span>
                      </div>
                    </td>

                    {/* Quick Action */}
                    <td className="py-3 px-5 text-right">
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={isCheckedIn ? checkOut : checkIn}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition shadow-2xs border ${
                            isCheckedIn
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          {isCheckedIn ? 'Check Out' : 'Check In'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleMemberStatus(member.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition shadow-2xs border ${
                            member.status === 'checked_in'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          {member.status === 'checked_in' ? 'Check Out' : 'Check In'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Activity Logs / Shift Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FiActivity size={15} className="text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Shift Activity & Attendance Logs
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            Real-time audit log
          </span>
        </div>

        <div className="space-y-2">
          {logs.slice(0, 8).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  log.action === 'CHECK_IN'
                    ? 'bg-emerald-500'
                    : log.action === 'CHECK_OUT'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`} />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {log.userName}{' '}
                    <span className="font-normal text-slate-500">
                      {log.action === 'CHECK_IN'
                        ? 'checked in for daily shift'
                        : log.action === 'CHECK_OUT'
                        ? 'checked out from shift'
                        : log.action === 'START_BREAK'
                        ? 'started 15m rest break'
                        : 'resumed active remote work'}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {log.userRole} • {log.date}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold font-mono text-slate-700 block">
                  {log.timestamp}
                </span>
                {log.duration && (
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {log.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
