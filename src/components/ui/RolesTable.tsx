"use client";

import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiLock, FiSettings, FiX, FiEye, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { RoleService } from '@/src/services/roleService';
import { PermissionPicker } from '@/src/components/ui/users/PermissionPicker';
import toast, { Toaster } from 'react-hot-toast';

const RolesTable = ({ embedded = false }: { embedded?: boolean }) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals & Sidebars state
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleStatus, setNewRoleStatus] = useState('1');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleStatus, setEditRoleStatus] = useState('1');
  const [editRolePermissions, setEditRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await RoleService.getRoles(1, 100);
      setRoles(response?.data?.roles || response?.roles || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    const loadToast = toast.loading('Creating new security profile...');
    try {
      await RoleService.createRole({
        role_name: newRoleName,
        status: Number(newRoleStatus),
        permissions: newRolePermissions
      });
      toast.success('Role added successfully!', { id: loadToast });
      setIsModalOpen(false);
      setNewRoleName('');
      setNewRoleStatus('1');
      setNewRolePermissions([]);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || 'Creation failed', { id: loadToast });
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    const loadToast = toast.loading('Updating security policy...');
    try {
      await RoleService.updateRole(editingRole._id, {
        role_name: editRoleName,
        status: editRoleStatus,
        permissions: editRolePermissions
      });
      toast.success('Role updated successfully', { id: loadToast });
      setIsEditModalOpen(false);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || 'Update failed', { id: loadToast });
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      const loadToast = toast.loading('Removing role configuration...');
      try {
        await RoleService.deleteRole(id);
        toast.success('Role deleted successfully', { id: loadToast });
        fetchRoles();
      } catch (err: any) {
        toast.error(err.message || 'Could not delete role', { id: loadToast });
      }
    }
  };

  const openEditModal = (role: any) => {
    setEditingRole(role);
    setEditRoleName(role.role_name);
    setEditRoleStatus(role.status?.toString() || '1');
    setEditRolePermissions(role.permissions || []);
    setIsEditModalOpen(true);
  };

  const getStatusKey = (status: any) => {
    return status === 1 || status === "1" ? "Active" : "Disabled";
  };

  const getStatusStyle = (status: any) => {
    const key = getStatusKey(status);
    return key === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className={`w-full font-sans antialiased text-slate-900 ${embedded ? '' : 'bg-[#f8fafc] min-h-screen p-3 sm:p-6'}`}>
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className={`max-w-7xl mx-auto space-y-4 sm:space-y-6 ${embedded ? '' : ''}`}>
        
        {/* --- Header / Top Bar --- */}
        {!embedded && (
          <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Access Control & Roles</h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Configure platform security tiers, system policies, and module permissions.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <FiPlus size={14} /> Add Role
            </button>
          </div>
        )}

        {embedded && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Roles Registry ({roles.length} Active Profiles)
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <FiPlus size={14} /> Add Role
            </button>
          </div>
        )}

        {/* --- Error Display --- */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold text-xs">
            Error: {error}
          </div>
        )}

        {/* --- Roles Table Card --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-2.5 px-3 sm:px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider whitespace-nowrap">
                    Role Title
                  </th>
                  <th className="py-2.5 px-3 sm:px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider whitespace-nowrap">
                    Default Access Scopes
                  </th>
                  <th className="py-2.5 px-3 sm:px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-2.5 px-3 sm:px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <FiLoader className="animate-spin" size={14} />
                        <span>Syncing security roles...</span>
                      </div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      No security roles configured.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-3 sm:px-5">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 shrink-0">
                            <FiSettings size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{role.role_name}</p>
                            <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                              ID: {role._id?.substring?.(0, 8) || role._id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-5 max-w-xs sm:max-w-md">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.slice(0, 4).map((perm: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold tracking-wide whitespace-nowrap"
                              >
                                {perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">No scope assigned</span>
                          )}
                          {role.permissions && role.permissions.length > 4 && (
                            <span className="text-[10px] font-bold text-slate-400 self-center pl-1 whitespace-nowrap">
                              +{role.permissions.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-5">
                        <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md whitespace-nowrap ${getStatusStyle(role.status)}`}>
                          {getStatusKey(role.status)}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-5 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => setSelectedRole(role)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                            title="View Scope"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(role)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                            title="Edit Role"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                            title="Delete Role"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- View Role Specification Drawer --- */}
      {selectedRole && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedRole(null)} />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] md:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-xs font-medium animate-in slide-in-from-right duration-200">
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer shadow-3xs"
              >
                <FiArrowLeft size={14} className="text-slate-600" />
                <span>Back to User Management</span>
              </button>
              <button onClick={() => setSelectedRole(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer">
                <FiX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-3xs shrink-0">
                  <FiLock size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{selectedRole.role_name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    Full ID: {selectedRole._id}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                  <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${getStatusStyle(selectedRole.status)}`}>
                    {getStatusKey(selectedRole.status)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Granted System Scopes</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                      selectedRole.permissions.map((perm: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold">
                          {perm}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No explicit permissions attached.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition cursor-pointer"
              >
                <FiArrowLeft size={14} />
                <span>Back to User Management</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Create / Edit Role Drawer --- */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
          />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[460px] md:w-[500px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-xs font-medium animate-in slide-in-from-right duration-200">
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer shadow-3xs"
              >
                <FiArrowLeft size={14} className="text-slate-600" />
                <span>Back to User Management</span>
              </button>
              <h2 className="font-bold text-slate-900 text-xs tracking-wide hidden sm:block truncate">
                {isModalOpen ? 'Orchestrate Security Role' : 'Modify Policy'}
              </h2>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={isModalOpen ? handleCreateRole : handleUpdateRole} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Platform Administrator"
                    value={isModalOpen ? newRoleName : editRoleName}
                    onChange={(e) => isModalOpen ? setNewRoleName(e.target.value) : setEditRoleName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Policy Status
                  </label>
                  <select
                    value={isModalOpen ? newRoleStatus : editRoleStatus}
                    onChange={(e) => isModalOpen ? setNewRoleStatus(e.target.value) : setEditRoleStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs cursor-pointer"
                  >
                    <option value="1">Active</option>
                    <option value="0">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Default Scope Matrix
                  </label>
                  <PermissionPicker
                    selected={isModalOpen ? newRolePermissions : editRolePermissions}
                    onChange={(perms) => (isModalOpen ? setNewRolePermissions(perms) : setEditRolePermissions(perms))}
                  />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiArrowLeft size={13} />
                  <span>Back to User Management</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-2.5 rounded-xl transition-all shadow-3xs hover:bg-slate-800 cursor-pointer"
                >
                  {isModalOpen ? 'Save Role' : 'Commit Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTable;