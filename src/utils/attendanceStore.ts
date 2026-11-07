'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  avatar?: string;
  status: 'checked_in' | 'on_break' | 'checked_out';
  checkInTime: string;
  checkOutTime: string | null;
  checkInTimestamp: number;
  checkOutTimestamp: number | null;
  baseElapsedSeconds: number;
}

export interface AttendanceLog {
  id: string;
  userName: string;
  userRole: string;
  action: 'CHECK_IN' | 'CHECK_OUT' | 'START_BREAK' | 'RESUME_WORK';
  timestamp: string;
  date: string;
  duration?: string;
  badgeColor: string;
}

export interface AttendanceState {
  adminRecord: AttendanceRecord;
  teamMembers: AttendanceRecord[];
  logs: AttendanceLog[];
}

const STORAGE_KEY = 'wholcure_crm_attendance_v1';
export const ATTENDANCE_EVENT = 'crm-attendance-updated';

const getInitialTimestamp = () => {
  // Initial shift: ~6 hours 24 mins ago
  return Date.now() - (6 * 3600 + 24 * 60) * 1000;
};

const formatTime12 = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateReadable = (date: Date) => {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDurationHMS = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${hh}h ${mm}m ${ss}s`;
};

export const formatDurationHM = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}h ${mm}m`;
};

const DEFAULT_STATE: AttendanceState = {
  adminRecord: {
    id: 'att-admin',
    userId: 'u-me',
    userName: 'You (Demo Admin)',
    userEmail: 'admin@wholcure.com',
    userRole: 'Super Admin',
    status: 'checked_in',
    checkInTime: formatTime12(new Date(getInitialTimestamp())),
    checkOutTime: null,
    checkInTimestamp: getInitialTimestamp(),
    checkOutTimestamp: null,
    baseElapsedSeconds: 6 * 3600 + 24 * 60,
  },
  teamMembers: [
    {
      id: 'att-1',
      userId: 'u-1',
      userName: 'Ali Raza',
      userEmail: 'ali.raza@wholcure.com',
      userRole: 'Sales Executive',
      status: 'checked_in',
      checkInTime: '09:00 AM',
      checkOutTime: null,
      checkInTimestamp: Date.now() - (5 * 3600 + 45 * 60) * 1000,
      checkOutTimestamp: null,
      baseElapsedSeconds: 5 * 3600 + 45 * 60,
    },
    {
      id: 'att-2',
      userId: 'u-2',
      userName: 'Sarah Khan',
      userEmail: 'sarah.k@wholcure.com',
      userRole: 'Marketing Head',
      status: 'checked_out',
      checkInTime: '09:30 AM',
      checkOutTime: '05:45 PM',
      checkInTimestamp: Date.now() - (10 * 3600) * 1000,
      checkOutTimestamp: Date.now() - (2 * 3600) * 1000,
      baseElapsedSeconds: 8 * 3600 + 15 * 60,
    },
    {
      id: 'att-3',
      userId: 'u-3',
      userName: 'Hamza Malik',
      userEmail: 'hamza.m@wholcure.com',
      userRole: 'Technical Lead',
      status: 'on_break',
      checkInTime: '10:00 AM',
      checkOutTime: null,
      checkInTimestamp: Date.now() - (4 * 3600 + 30 * 60) * 1000,
      checkOutTimestamp: null,
      baseElapsedSeconds: 4 * 3600 + 30 * 60,
    },
    {
      id: 'att-4',
      userId: 'u-4',
      userName: 'Zainab Tariq',
      userEmail: 'zainab.t@wholcure.com',
      userRole: 'Customer Success Specialist',
      status: 'checked_in',
      checkInTime: '08:45 AM',
      checkOutTime: null,
      checkInTimestamp: Date.now() - (6 * 3600 + 10 * 60) * 1000,
      checkOutTimestamp: null,
      baseElapsedSeconds: 6 * 3600 + 10 * 60,
    },
  ],
  logs: [
    {
      id: 'log-1',
      userName: 'Ali Raza',
      userRole: 'Sales Executive',
      action: 'CHECK_IN',
      timestamp: '09:00 AM',
      date: 'Today',
      badgeColor: 'emerald',
    },
    {
      id: 'log-2',
      userName: 'You (Demo Admin)',
      userRole: 'Super Admin',
      action: 'CHECK_IN',
      timestamp: '09:15 AM',
      date: 'Today',
      badgeColor: 'emerald',
    },
    {
      id: 'log-3',
      userName: 'Hamza Malik',
      userRole: 'Technical Lead',
      action: 'START_BREAK',
      timestamp: '01:30 PM',
      date: 'Today',
      duration: '15m Break Session',
      badgeColor: 'amber',
    },
    {
      id: 'log-4',
      userName: 'Sarah Khan',
      userRole: 'Marketing Head',
      action: 'CHECK_OUT',
      timestamp: '05:45 PM',
      date: 'Today',
      duration: '08h 15m Total Shift',
      badgeColor: 'rose',
    },
  ],
};

export const getAttendanceState = (): AttendanceState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
};

export const saveAttendanceState = (state: AttendanceState): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(ATTENDANCE_EVENT));
  } catch (err) {
    console.error('Failed to save attendance state', err);
  }
};

export const checkInAdmin = (): AttendanceState => {
  const current = getAttendanceState();
  const now = Date.now();
  const timeStr = formatTime12(new Date(now));
  const dateStr = formatDateReadable(new Date(now));

  const updatedAdmin: AttendanceRecord = {
    ...current.adminRecord,
    status: 'checked_in',
    checkInTime: timeStr,
    checkInTimestamp: now,
    checkOutTime: null,
    checkOutTimestamp: null,
    baseElapsedSeconds: 0,
  };

  const newLog: AttendanceLog = {
    id: `log-${Date.now()}`,
    userName: updatedAdmin.userName,
    userRole: updatedAdmin.userRole,
    action: 'CHECK_IN',
    timestamp: timeStr,
    date: dateStr,
    badgeColor: 'emerald',
  };

  const nextState: AttendanceState = {
    ...current,
    adminRecord: updatedAdmin,
    logs: [newLog, ...current.logs],
  };

  saveAttendanceState(nextState);
  return nextState;
};

export const checkOutAdmin = (): AttendanceState => {
  const current = getAttendanceState();
  const now = Date.now();
  const timeStr = formatTime12(new Date(now));
  const dateStr = formatDateReadable(new Date(now));

  let workedSeconds = current.adminRecord.baseElapsedSeconds;
  if (current.adminRecord.checkInTimestamp) {
    workedSeconds += Math.floor((now - current.adminRecord.checkInTimestamp) / 1000);
  }

  const durationStr = formatDurationHM(workedSeconds);

  const updatedAdmin: AttendanceRecord = {
    ...current.adminRecord,
    status: 'checked_out',
    checkOutTime: timeStr,
    checkOutTimestamp: now,
    baseElapsedSeconds: workedSeconds,
  };

  const newLog: AttendanceLog = {
    id: `log-${Date.now()}`,
    userName: updatedAdmin.userName,
    userRole: updatedAdmin.userRole,
    action: 'CHECK_OUT',
    timestamp: timeStr,
    date: dateStr,
    duration: `${durationStr} Total Shift`,
    badgeColor: 'rose',
  };

  const nextState: AttendanceState = {
    ...current,
    adminRecord: updatedAdmin,
    logs: [newLog, ...current.logs],
  };

  saveAttendanceState(nextState);
  return nextState;
};

export const toggleBreakAdmin = (): AttendanceState => {
  const current = getAttendanceState();
  const now = Date.now();
  const timeStr = formatTime12(new Date(now));
  const dateStr = formatDateReadable(new Date(now));

  const isCurrentlyBreak = current.adminRecord.status === 'on_break';
  const newStatus: AttendanceRecord['status'] = isCurrentlyBreak ? 'checked_in' : 'on_break';

  const newLog: AttendanceLog = {
    id: `log-${Date.now()}`,
    userName: current.adminRecord.userName,
    userRole: current.adminRecord.userRole,
    action: isCurrentlyBreak ? 'RESUME_WORK' : 'START_BREAK',
    timestamp: timeStr,
    date: dateStr,
    duration: isCurrentlyBreak ? 'Resumed Remote Work' : '15m Rest Break',
    badgeColor: isCurrentlyBreak ? 'emerald' : 'amber',
  };

  const updatedAdmin: AttendanceRecord = {
    ...current.adminRecord,
    status: newStatus,
  };

  const nextState: AttendanceState = {
    ...current,
    adminRecord: updatedAdmin,
    logs: [newLog, ...current.logs],
  };

  saveAttendanceState(nextState);
  return nextState;
};

export const toggleMemberStatus = (memberId: string): AttendanceState => {
  const current = getAttendanceState();
  const now = Date.now();
  const timeStr = formatTime12(new Date(now));
  const dateStr = formatDateReadable(new Date(now));

  const updatedTeam = current.teamMembers.map((m) => {
    if (m.id !== memberId) return m;

    const nextStatus: AttendanceRecord['status'] =
      m.status === 'checked_in' ? 'checked_out' : m.status === 'checked_out' ? 'checked_in' : 'checked_in';

    return {
      ...m,
      status: nextStatus,
      checkInTime: nextStatus === 'checked_in' ? timeStr : m.checkInTime,
      checkOutTime: nextStatus === 'checked_out' ? timeStr : m.checkOutTime,
      checkInTimestamp: nextStatus === 'checked_in' ? now : m.checkInTimestamp,
      checkOutTimestamp: nextStatus === 'checked_out' ? now : m.checkOutTimestamp,
    };
  });

  const target = current.teamMembers.find((m) => m.id === memberId);
  const willBeCheckedIn = target ? target.status !== 'checked_in' : false;

  const newLog: AttendanceLog = {
    id: `log-${Date.now()}`,
    userName: target?.userName || 'Team Member',
    userRole: target?.userRole || 'Member',
    action: willBeCheckedIn ? 'CHECK_IN' : 'CHECK_OUT',
    timestamp: timeStr,
    date: dateStr,
    badgeColor: willBeCheckedIn ? 'emerald' : 'rose',
  };

  const nextState: AttendanceState = {
    ...current,
    teamMembers: updatedTeam,
    logs: [newLog, ...current.logs],
  };

  saveAttendanceState(nextState);
  return nextState;
};

export const useAttendance = () => {
  const [state, setState] = useState<AttendanceState>(DEFAULT_STATE);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(6 * 3600 + 24 * 60);

  // Sync state from storage
  const sync = useCallback(() => {
    const s = getAttendanceState();
    setState(s);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(ATTENDANCE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ATTENDANCE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [sync]);

  // Real-time ticking stopwatch
  useEffect(() => {
    const updateElapsed = () => {
      const admin = state.adminRecord;
      if (admin.status === 'checked_in') {
        if (admin.checkInTimestamp) {
          const diff = Math.floor((Date.now() - admin.checkInTimestamp) / 1000);
          setElapsedSeconds(Math.max(0, diff));
        } else {
          setElapsedSeconds(admin.baseElapsedSeconds);
        }
      } else if (admin.status === 'on_break') {
        // Keeps timer paused or frozen during break
        if (admin.checkInTimestamp) {
          const diff = Math.floor((Date.now() - admin.checkInTimestamp) / 1000);
          setElapsedSeconds(Math.max(0, diff));
        }
      } else {
        // Checked out
        setElapsedSeconds(admin.baseElapsedSeconds);
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [state.adminRecord]);

  return {
    state,
    adminRecord: state.adminRecord,
    teamMembers: state.teamMembers,
    allStaffAttendance: [state.adminRecord, ...state.teamMembers],
    logs: state.logs,
    elapsedSeconds,
    elapsedFormattedHMS: formatDurationHMS(elapsedSeconds),
    elapsedFormattedHM: formatDurationHM(elapsedSeconds),
    isCheckedIn: state.adminRecord.status === 'checked_in',
    isOnBreak: state.adminRecord.status === 'on_break',
    isShiftDone: state.adminRecord.status === 'checked_out',
    checkIn: checkInAdmin,
    checkOut: checkOutAdmin,
    toggleBreak: toggleBreakAdmin,
    toggleMemberStatus,
  };
};
