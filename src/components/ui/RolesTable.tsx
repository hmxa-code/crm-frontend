// "use client";

// import React, { useState, useEffect } from 'react';
// import { FiEdit2, FiTrash2, FiPlus, FiLock, FiSettings, FiX, FiEye, FiLoader } from 'react-icons/fi';
// import { RoleService } from '@/src/services/roleService';
// import { PermissionPicker } from '@/src/components/ui/users/PermissionPicker';
// import toast, { Toaster } from 'react-hot-toast';

// // LeadsTable jaisi exact dynamic master config status colors ke liye
// const STATUS_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
//   Active: { bg: "rgba(136, 187, 64, 0.07)", text: "#88bb40", border: "rgba(136, 187, 64, 0.3)" },    // Green
//   Disabled: { bg: "rgba(255, 0, 0, 0.05)", text: "#ff0000", border: "rgba(255, 0, 0, 0.2)" },       // Red
// };

// const RolesTable = ({ embedded = false }: { embedded?: boolean }) => {
//   const [roles, setRoles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Modals & Sidebars state
//   const [selectedRole, setSelectedRole] = useState<any | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newRoleName, setNewRoleName] = useState('');
//   const [newRoleStatus, setNewRoleStatus] = useState('1');
//   const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingRole, setEditingRole] = useState<any>(null);
//   const [editRoleName, setEditRoleName] = useState('');
//   const [editRoleStatus, setEditRoleStatus] = useState('1');
//   const [editRolePermissions, setEditRolePermissions] = useState<string[]>([]);

//   // Focus border state styling ke liye
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       setLoading(true);
//       const response = await RoleService.getRoles(1, 100);
//       setRoles(response?.data?.roles || response?.roles || []);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch roles');
//       toast.error('Failed to fetch roles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateRole = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newRoleName.trim()) {
//       toast.error('Role name is required');
//       return;
//     }
//     const loadToast = toast.loading('Creating new security profile...');
//     try {
//       await RoleService.createRole({
//         role_name: newRoleName,
//         status: newRoleStatus,
//         permissions: newRolePermissions
//       });
//       toast.success('Role added successfully! 🎯', { id: loadToast });
//       setIsModalOpen(false);
//       setNewRoleName('');
//       setNewRoleStatus('1');
//       setNewRolePermissions([]);
//       fetchRoles();
//     } catch (err: any) {
//       toast.error(err.message || 'Creation failed', { id: loadToast });
//     }
//   };

//   const handleUpdateRole = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editRoleName.trim()) {
//       toast.error('Role name is required');
//       return;
//     }
//     const loadToast = toast.loading('Updating security policy...');
//     try {
//       await RoleService.updateRole(editingRole._id, {
//         role_name: editRoleName,
//         status: editRoleStatus,
//         permissions: editRolePermissions
//       });
//       toast.success('Role updated successfully', { id: loadToast });
//       setIsEditModalOpen(false);
//       fetchRoles();
//     } catch (err: any) {
//       toast.error(err.message || 'Update failed', { id: loadToast });
//     }
//   };

//   const handleDeleteRole = async (id: string) => {
//     if (confirm('Are you sure you want to delete this role?')) {
//       const loadToast = toast.loading('Removing role configuration...');
//       try {
//         await RoleService.deleteRole(id);
//         toast.success('Role deleted successfully', { id: loadToast });
//         fetchRoles();
//       } catch (err: any) {
//         toast.error(err.message || 'Could not delete role', { id: loadToast });
//       }
//     }
//   };

//   const openEditModal = (role: any) => {
//     setEditingRole(role);
//     setEditRoleName(role.role_name);
//     setEditRoleStatus(role.status?.toString() || '1');
//     setEditRolePermissions(role.permissions || []);
//     setIsEditModalOpen(true);
//   };

//   const getStatusKey = (status: any) => {
//     return status === 1 || status === "1" ? "Active" : "Disabled";
//   };

//   return (
//     <div className={`w-full bg-[#fcfdfe] text-slate-900 font-sans relative overflow-x-hidden ${embedded ? '' : 'min-h-screen p-4 md:p-10'}`}>
//       <Toaster position="top-right" reverseOrder={false} />
      
//       <div className={`max-w-7xl mx-auto ${embedded ? 'px-4 md:px-10 pb-10' : ''}`}>
//         {/* --- Header Section --- */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
//           <div>
//             {!embedded && (
//               <>
//                 <h1 className="text-3xl font-bold tracking-tight text-slate-900">Access Control & Roles</h1>
//                 <p className="text-slate-500 font-medium mt-1 text-sm">
//                   Configure security credentials and platform permissions.
//                 </p>
//               </>
//             )}
//             {embedded && (
//               <p className="text-slate-500 font-medium text-sm">
//                 Create custom roles and define module-level permissions for your team.
//               </p>
//             )}
//             <span 
//               style={{ color: "#00aaff", backgroundColor: "rgba(0, 170, 255, 0.08)" }}
//               className={`${embedded ? 'mt-2 ' : 'ml-0 '}inline-block px-2 py-0.5 rounded text-xs font-bold`}
//             >
//               {roles.length} Profiles
//             </span>
//           </div>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             style={{ backgroundColor: "#00aaff" }}
//             className="flex items-center gap-2 text-white px-5 py-3 rounded font-bold transition-all shadow-lg hover:opacity-90 active:scale-95 text-sm"
//           >
//             <FiPlus size={18} /> Add Role
//           </button>
//         </div>

//         {/* --- Error Info --- */}
//         {error && (
//           <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded text-red-700 font-medium text-xs">
//             Error: {error}
//           </div>
//         )}

//         {/* --- Clean Minimalist Table Container --- */}
//         <div className="bg-white rounded border border-slate-200 shadow-xl shadow-slate-100/40 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Role Name</th>
//                   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Default Features</th>
//                   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
//                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={4} className="px-8 py-24 text-center">
//                       <div className="flex flex-col items-center">
//                         <FiLoader style={{ color: "#00aaff" }} className="animate-spin w-8 h-8 mb-3" />
//                         <p className="text-slate-400 text-xs font-bold tracking-tight">Syncing Security Levels...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : roles.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="px-8 py-24 text-center">
//                       <div className="flex flex-col items-center opacity-40">
//                         <FiLock size={48} className="text-slate-300 mb-3" />
//                         <p className="text-base font-bold text-slate-900">No custom roles yet</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   roles.map((role) => {
//                     const statusKey = getStatusKey(role.status);
//                     const styles = STATUS_COLORS[statusKey];
//                     return (
//                       <tr key={role._id} className="hover:bg-slate-50/60 transition-colors group">
//                         <td className="px-8 py-4.5">
//                           <div className="flex items-center gap-3.5">
//                             {/* Avatar Badge with Custom Blue subtle background */}
//                             <div 
//                               style={{ color: "#00aaff", backgroundColor: "rgba(0, 170, 255, 0.08)" }}
//                               className="w-10 h-10 rounded flex items-center justify-center border border-slate-100 shadow-sm"
//                             >
//                               <FiSettings size={16} />
//                             </div>
//                             <div>
//                               <p className="font-bold text-slate-900 text-sm">{role.role_name}</p>
//                               <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide">
//                                 ID: {role._id?.substring?.(0, 8) || role._id}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4.5 max-w-md">
//                           <div className="flex flex-wrap gap-1.5">
//                             {role.permissions && role.permissions.length > 0 ? (
//                               role.permissions.slice(0, 4).map((perm: string, index: number) => (
//                                 <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold tracking-wide uppercase border border-slate-200/40">
//                                   {perm}
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="text-xs font-medium text-slate-400 italic">No direct scope</span>
//                             )}
//                             {role.permissions && role.permissions.length > 4 && (
//                               <span className="text-[10px] font-bold text-slate-400 self-center pl-1">
//                                 +{role.permissions.length - 4} more
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4.5">
//                           <span 
//                             style={{ backgroundColor: styles.bg, color: styles.text, borderColor: styles.border }}
//                             className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border"
//                           >
//                             {statusKey}
//                           </span>
//                         </td>
//                         <td className="px-8 py-4.5 text-right">
//                           <div className="flex justify-end items-center gap-1.5">
//                             <button
//                               onClick={() => setSelectedRole(role)}
//                               className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-all"
//                               title="View Details"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openEditModal(role)}
//                               style={{ "--hover-color": "#fdb614" } as React.CSSProperties}
//                               className="p-2 text-slate-400 hover:text-[var(--hover-color)] hover:bg-slate-100 rounded transition-all"
//                               title="Edit Role"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteRole(role._id)}
//                               style={{ "--hover-color": "#ff0000" } as React.CSSProperties}
//                               className="p-2 text-slate-400 hover:text-[var(--hover-color)] hover:bg-slate-100 rounded transition-all"
//                               title="Delete Role"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* --- View Role Sidebar Card --- */}
//       {selectedRole && (
//         <div className="fixed inset-0 z-[9999] overflow-hidden">
//           <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity" onClick={() => setSelectedRole(null)} />
//           <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-xs font-medium">
            
//             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <h2 className="text-base font-bold text-slate-900">Role Specification</h2>
//               <button onClick={() => setSelectedRole(null)} className="p-1.5 hover:bg-slate-200/60 rounded text-slate-400 transition-colors">
//                 <FiX size={18} />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-700">
//               <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
//                 <div 
//                   style={{ color: "#00aaff", backgroundColor: "rgba(0, 170, 255, 0.08)" }}
//                   className="w-12 h-12 rounded flex items-center justify-center border border-slate-100 shadow-sm"
//                 >
//                   <FiLock size={20} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-900 text-base">{selectedRole.role_name}</p>
//                   <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide">Full ID: {selectedRole._id}</p>
//                 </div>
//               </div>

//               <div>
//                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Policy Status</span>
//                 <div>
//                   <span 
//                     style={{ 
//                       backgroundColor: STATUS_COLORS[getStatusKey(selectedRole.status)].bg, 
//                       color: STATUS_COLORS[getStatusKey(selectedRole.status)].text, 
//                       borderColor: STATUS_COLORS[getStatusKey(selectedRole.status)].border 
//                     }}
//                     className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border inline-block"
//                   >
//                     {getStatusKey(selectedRole.status)}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Assigned Scope & Permissions</span>
//                 <div className="flex flex-wrap gap-1.5">
//                   {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
//                     selectedRole.permissions.map((perm: string, index: number) => (
//                       <span key={index} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-bold border border-slate-200/60 uppercase tracking-wide">
//                         {perm}
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-sm font-medium text-slate-400 italic">No custom scopes defined for this configuration.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//           </div>
//         </div>
//       )}

//       {/* --- Add & Edit Sidebar Sheet Form --- */}
//       {(isModalOpen || isEditModalOpen) && (
//         <div className="fixed inset-0 z-[9999] overflow-hidden">
//           <div 
//             className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity" 
//             onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} 
//           />
//           <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-xs font-medium">
            
//             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <h2 className="text-base font-bold text-slate-900">
//                 {isModalOpen ? "Initialize Role" : "Modify Record Data"}
//               </h2>
//               <button 
//                 onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} 
//                 className="p-1.5 hover:bg-slate-200/60 rounded text-slate-400 transition-colors"
//               >
//                 <FiX size={18} />
//               </button>
//             </div>

//             <form onSubmit={isModalOpen ? handleCreateRole : handleUpdateRole} className="flex-1 flex flex-col overflow-hidden">
//               <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
//                 <div>
//                   <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5 ml-0.5">Role Designation Name *</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. System Administrator"
//                     value={isModalOpen ? newRoleName : editRoleName}
//                     onChange={(e) => isModalOpen ? setNewRoleName(e.target.value) : setEditRoleName(e.target.value)}
//                     onFocus={() => setFocusedInput("roleName")}
//                     onBlur={() => setFocusedInput(null)}
//                     style={{ borderColor: focusedInput === "roleName" ? "#00aaff" : "#e2e8f0" }}
//                     className="w-full px-3.5 py-2.5 bg-slate-50/50 border rounded outline-none font-semibold transition-all focus:bg-white text-sm text-slate-800"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5 ml-0.5">Security Policy Status</label>
//                   <select
//                     value={isModalOpen ? newRoleStatus : editRoleStatus}
//                     onChange={(e) => isModalOpen ? setNewRoleStatus(e.target.value) : setEditRoleStatus(e.target.value)}
//                     onFocus={() => setFocusedInput("status")}
//                     onBlur={() => setFocusedInput(null)}
//                     style={{ borderColor: focusedInput === "status" ? "#00aaff" : "#e2e8f0" }}
//                     className="w-full px-3.5 py-2.5 bg-slate-50/50 border rounded outline-none font-semibold transition-all focus:bg-white text-sm cursor-pointer text-slate-700"
//                   >
//                     <option value="1">Active</option>
//                     <option value="0">Disabled</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5 ml-0.5">Default CRM Features</label>
//                   <PermissionPicker
//                     selected={isModalOpen ? newRolePermissions : editRolePermissions}
//                     onChange={(perms) => (isModalOpen ? setNewRolePermissions(perms) : setEditRolePermissions(perms))}
//                   />
//                 </div>

//               </div>

//               <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
//                   className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded font-bold transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   style={{ backgroundColor: "#00aaff" }}
//                   className="flex-1 text-white font-bold py-2.5 rounded transition-all shadow-md hover:opacity-95"
//                 >
//                   {isModalOpen ? "Add Role" : "Apply Changes"}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RolesTable;

"use client";

import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiLock, FiSettings, FiX, FiEye, FiLoader } from 'react-icons/fi';
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
    <div className={`w-full font-sans antialiased text-slate-900 ${embedded ? '' : 'bg-[#f8fafc] min-h-screen p-6'}`}>
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className={`max-w-7xl mx-auto space-y-6 ${embedded ? '' : ''}`}>
        
        {/* --- Header / Top Bar --- */}
        {!embedded && (
          <div className="bg-white border border-slate-200/80 rounded-xl px-5 py-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Access Control & Roles</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Configure platform security tiers, system policies, and module permissions.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-2 shrink-0"
            >
              <FiPlus size={14} /> Add Role
            </button>
          </div>
        )}

        {embedded && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Roles Registry ({roles.length} Active Profiles)
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-2"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                    Role Title
                  </th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                    Default Access Scopes
                  </th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider text-right">
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
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 shrink-0">
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
                      <td className="py-3 px-5 max-w-md">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.slice(0, 4).map((perm: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold tracking-wide"
                              >
                                {perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">No scope assigned</span>
                          )}
                          {role.permissions && role.permissions.length > 4 && (
                            <span className="text-[10px] font-bold text-slate-400 self-center pl-1">
                              +{role.permissions.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${getStatusStyle(role.status)}`}>
                          {getStatusKey(role.status)}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => setSelectedRole(role)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all"
                            title="View Scope"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(role)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-all"
                            title="Edit Role"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-all"
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
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={() => setSelectedRole(null)} />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col text-xs font-medium">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-xs tracking-wide">Role Specifications</h2>
              <button onClick={() => setSelectedRole(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <FiX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-3xs">
                  <FiLock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedRole.role_name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
          </div>
        </div>
      )}

      {/* --- Create / Edit Role Drawer --- */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs"
            onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
          />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-xl flex flex-col text-xs font-medium">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-xs tracking-wide">
                {isModalOpen ? 'Orchestrate Security Role' : 'Modify Policy Configuration'}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={isModalOpen ? handleCreateRole : handleUpdateRole} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
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

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                  className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-lg transition-all shadow-3xs hover:bg-slate-800"
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