"use client";

import React, { useEffect, useState } from 'react';
import { UserService } from '@/src/services/userService';
import { FiLoader, FiUsers } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const UserSubAccountsPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubAccounts = async () => {
      try {
        setLoading(true);
        const response = await UserService.getUsers(1, 100);
        const usersArray = response?.data?.users || response?.users || [];
        setUsers(usersArray);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load sub-accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchSubAccounts();
  }, []);

  const getRoleLabel = (user: any) => user.roleDetails?.role_name || 'No Role';

  const getFeatureCount = (user: any) =>
    (user.effectivePermissions || user.metadata?.permissions || []).length;

  return (
    <div className="w-full">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sub-Accounts</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Custom roles wale team members jo aap ne create kiye hain.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FiLoader className="animate-spin mb-3" size={28} />
              <p className="text-sm font-semibold">Loading sub-accounts...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500 m-4">
              <FiUsers className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="text-base font-semibold">No sub-accounts yet</p>
              <p className="mt-2 text-sm text-slate-400">
                User Management se sub-account create karein aur custom role assign karein.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Custom Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Features</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-[#00aaff]">{getRoleLabel(user)}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">{getFeatureCount(user)} enabled</td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-slate-500">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSubAccountsPage;
