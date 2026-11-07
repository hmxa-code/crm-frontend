'use client'

import React, { useState, useEffect } from 'react'
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPlus,
  FiX,
  FiPhone,
  FiUser,
  FiLoader,
  FiShield,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi'
import { UserService } from '@/src/services/userService'
import { RoleService } from '@/src/services/roleService'
import { getAvatarUrl } from '@/src/utils/avatarHelper'
import { FeatureAccessPicker } from '@/src/components/ui/users/PermissionPicker'
import { useAttendance } from '@/src/utils/attendanceStore'
import toast, { Toaster } from 'react-hot-toast'

export const UserTable = () => {
  const { adminRecord, isCheckedIn, isOnBreak, elapsedFormattedHM } = useAttendance()
  const [userData, setUserData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roles, setRoles] = useState<any[]>([])

  // Modals / Sidebars state
  const [addingUser, setAddingUser] = useState<any | null>(null)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  // Custom Role Creation State
  const [isCreatingCustomRole, setIsCreatingCustomRole] = useState(false)
  const [newCustomRole, setNewCustomRole] = useState({
    role_name: '',
    description: '',
  })
  const [creatingRoleFor, setCreatingRoleFor] = useState<'add' | 'edit' | null>(null)
  const [formTab, setFormTab] = useState<'profile' | 'access'>('profile')

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await UserService.getUsers(1, 100)
      const usersArray = response?.data?.users || response?.users || []
      setUserData(usersArray)
      setError(null)
    } catch (err: any) {
      setError('Failed to fetch users')
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await RoleService.getRoles(1, 100)
      const rolesArray = response?.data?.roles || response?.roles || []
      setRoles(rolesArray)
    } catch (err: any) {
      console.error('Roles fetch error', err)
      toast.error(err?.message || 'Failed to fetch roles')
      setRoles([])
    }
  }

  const getRoleLabel = (user: any) => user.roleDetails?.role_name || 'No Role Assigned'

  const getUserPermissions = (user: any) => user?.metadata?.permissions || []

  const getSelectedRoleId = (user: any) =>
    user?.customRole?._id || user?.customRole || user?.role?._id || user?.role || ''

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addingUser.password || addingUser.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }

    const loadToast = toast.loading('Deploying new user...')
    try {
      const payload = {
        name: addingUser.name,
        email: addingUser.email,
        phone: addingUser.phone,
        password: addingUser.password,
        status: addingUser.status,
        role: addingUser.customRole || addingUser.role,
        customRole: addingUser.customRole || addingUser.role,
        permissions: addingUser.permissions || [],
      }
      await UserService.createUser(payload)

      toast.success('User deployed successfully!', { id: loadToast })
      setAddingUser(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add user', { id: loadToast })
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const loadToast = toast.loading('Updating profile...')
    try {
      const payload: any = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        status: editingUser.status,
        role: editingUser.customRole || editingUser.role,
        customRole: editingUser.customRole || editingUser.role,
        permissions: editingUser.permissions || [],
      }
      if (editingUser.password) payload.password = editingUser.password

      await UserService.updateUser(editingUser._id, payload)

      toast.success('Profile updated successfully!', { id: loadToast })
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || 'Update failed', { id: loadToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const loadToast = toast.loading('Removing user...')
      try {
        await UserService.deleteUser(id)
        toast.success('User removed from directory', { id: loadToast })
        fetchUsers()
      } catch (err: any) {
        toast.error(err.message || 'Could not delete user', { id: loadToast })
      }
    }
  }

  const handleCreateCustomRole = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCustomRole.role_name.trim()) {
      toast.error('Role name is required')
      return
    }

    const loadToast = toast.loading('Creating custom role...')
    try {
      const response = await RoleService.createRole({
        role_name: newCustomRole.role_name,
        description: newCustomRole.description,
        permissions: [],
        status: 1,
      })

      const createdRole = response?.data?.role

      toast.success('Custom role created!', { id: loadToast })

      if (creatingRoleFor === 'add' && addingUser) {
        setAddingUser({ ...addingUser, customRole: createdRole._id, role: createdRole._id })
      } else if (creatingRoleFor === 'edit' && editingUser) {
        setEditingUser({ ...editingUser, customRole: createdRole._id, role: createdRole._id })
      }

      fetchRoles()
      setIsCreatingCustomRole(false)
      setNewCustomRole({ role_name: '', description: '' })
      setCreatingRoleFor(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create custom role', { id: loadToast })
    }
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>, isAdding: boolean) => {
    const value = e.target.value

    if (value === 'CREATE_CUSTOM') {
      setIsCreatingCustomRole(true)
      setCreatingRoleFor(isAdding ? 'add' : 'edit')
    } else {
      const roleId = value
      if (isAdding) {
        setAddingUser({ ...addingUser, customRole: roleId, role: roleId })
      } else {
        setEditingUser({ ...editingUser, customRole: roleId, role: roleId })
      }
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'INACTIVE':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="w-full space-y-6 font-sans antialiased text-slate-900">
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Action Bar & Stats --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Directory Index ({userData.length} Members)
          </h2>
        </div>
        <button
          onClick={() => {
            setAddingUser({
              name: '',
              email: '',
              status: 'ACTIVE',
              customRole: '',
              role: '',
              phone: '',
              password: '',
              permissions: [],
            })
            setFormTab('profile')
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-2"
        >
          <FiPlus size={14} /> Add Sub-Account
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold text-xs">
          Error: {error}
        </div>
      )}

      {/* --- Ledger Table --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                  User Details
                </th>
                <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                  Email Address
                </th>
                <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                  Phone
                </th>
                <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
                  Work Shift (Check In/Out)
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
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="animate-spin" size={14} />
                      <span>Loading directory profiles...</span>
                    </div>
                  </td>
                </tr>
              ) : userData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No sub-accounts registered.
                  </td>
                </tr>
              ) : (
                userData.map((user) => {
                  const roleName = getRoleLabel(user).toLowerCase();
                  const isAdminUser = roleName.includes('admin') || user.email?.includes('admin');
                  return (
                    <tr key={user._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(user.avatar, user.name)}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-2xs"
                            alt="avatar"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                              {getRoleLabel(user)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <FiMail className="text-slate-400" size={12} />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-slate-500 font-medium">{user.phone || '—'}</td>
                      
                      {/* Work Shift / Check-In Column */}
                      <td className="py-3 px-5">
                        {isAdminUser ? (
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border w-fit ${
                              isCheckedIn
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isOnBreak
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isCheckedIn ? 'bg-emerald-500 animate-pulse' : isOnBreak ? 'bg-amber-500' : 'bg-slate-400'
                              }`} />
                              <span>{isCheckedIn ? `In: ${adminRecord.checkInTime}` : isOnBreak ? '15m Break' : 'Checked Out'}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Shift: <strong className="text-slate-800">{elapsedFormattedHM}</strong>
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border w-fit bg-emerald-50 text-emerald-700 border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>In: 09:00 AM</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Shift: <strong className="text-slate-800">05h 45m</strong>
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${getStatusStyle(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all"
                          title="View Specification"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser({
                              ...user,
                              customRole: getSelectedRoleId(user),
                              role: getSelectedRoleId(user),
                              permissions: getUserPermissions(user),
                            })
                            setFormTab('profile')
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-all"
                          title="Edit User"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-all"
                          title="Delete User"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- View User Specification Drawer --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={() => setSelectedUser(null)} />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col text-xs font-medium">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-xs tracking-wide">Account Specifications</h2>
              <button onClick={() => setSelectedUser(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <FiX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={getAvatarUrl(selectedUser.avatar, selectedUser.name)}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  alt="avatar"
                />
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {getRoleLabel(selectedUser)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedUser.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">State</span>
                  <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${getStatusStyle(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Granted Feature Access</span>
                  <div className="flex flex-wrap gap-1">
                    {getUserPermissions(selectedUser).length > 0 ? (
                      getUserPermissions(selectedUser).map((perm: string) => (
                        <span key={perm} className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold">
                          {perm}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">Default role permissions only.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Add / Edit Drawer --- */}
      {(addingUser || editingUser) && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={() => { setAddingUser(null); setEditingUser(null); }} />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-xl flex flex-col text-xs font-medium">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-xs tracking-wide">
                {addingUser ? 'Initialize Sub-Account' : 'Update Record Matrix'}
              </h2>
              <button onClick={() => { setAddingUser(null); setEditingUser(null); }} className="p-1 text-slate-400 hover:text-slate-700">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={addingUser ? handleAddUser : handleUpdateUser} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setFormTab('profile')}
                  className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider ${
                    formTab === 'profile' ? 'text-slate-900 border-b-2 border-slate-900 bg-white' : 'text-slate-400'
                  }`}
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab('access')}
                  className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider ${
                    formTab === 'access' ? 'text-slate-900 border-b-2 border-slate-900 bg-white' : 'text-slate-400'
                  }`}
                >
                  Feature Access
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {formTab === 'profile' ? (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addingUser?.name || editingUser?.name || ''}
                        onChange={(e) => {
                          if (addingUser) setAddingUser({ ...addingUser, name: e.target.value })
                          else setEditingUser({ ...editingUser, name: e.target.value })
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={addingUser?.email || editingUser?.email || ''}
                        onChange={(e) => {
                          if (addingUser) setAddingUser({ ...addingUser, email: e.target.value })
                          else setEditingUser({ ...editingUser, email: e.target.value })
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={addingUser?.phone || editingUser?.phone || ''}
                        onChange={(e) => {
                          if (addingUser) setAddingUser({ ...addingUser, phone: e.target.value })
                          else setEditingUser({ ...editingUser, phone: e.target.value })
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {addingUser ? 'Password *' : 'Password (Leave blank to preserve)'}
                      </label>
                      <input
                        type="password"
                        required={!!addingUser}
                        value={addingUser?.password || editingUser?.password || ''}
                        onChange={(e) => {
                          if (addingUser) setAddingUser({ ...addingUser, password: e.target.value })
                          else setEditingUser({ ...editingUser, password: e.target.value })
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role Anchor *</label>
                      <select
                        required
                        value={
                          addingUser
                            ? getSelectedRoleId(addingUser)
                            : getSelectedRoleId(editingUser)
                        }
                        onChange={(e) => handleRoleChange(e, !!addingUser)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs cursor-pointer"
                      >
                        <option value="">-- Select Role --</option>
                        {roles.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.role_name}
                          </option>
                        ))}
                        <option value="CREATE_CUSTOM">➕ Create Custom Role</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Account State</label>
                      <select
                        value={addingUser?.status || editingUser?.status || 'ACTIVE'}
                        onChange={(e) => {
                          if (addingUser) setAddingUser({ ...addingUser, status: e.target.value })
                          else setEditingUser({ ...editingUser, status: e.target.value })
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white focus:border-slate-400 text-xs cursor-pointer"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <FeatureAccessPicker
                      selected={addingUser?.permissions || editingUser?.permissions || []}
                      onChange={(perms) => {
                        if (addingUser) setAddingUser({ ...addingUser, permissions: perms })
                        else setEditingUser({ ...editingUser, permissions: perms })
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setAddingUser(null); setEditingUser(null); }}
                  className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-lg transition-all shadow-3xs hover:bg-slate-800"
                >
                  {addingUser ? 'Deploy Account' : 'Commit Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Custom Role Creation Modal --- */}
      {isCreatingCustomRole && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs"
            onClick={() => {
              setIsCreatingCustomRole(false)
              setNewCustomRole({ role_name: '', description: '' })
              setCreatingRoleFor(null)
            }}
          />
          <div className="relative w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-5 text-xs font-sans">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Orchestrate Custom Role</h3>
              <button
                onClick={() => {
                  setIsCreatingCustomRole(false)
                  setNewCustomRole({ role_name: '', description: '' })
                  setCreatingRoleFor(null)
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newCustomRole.role_name}
                  onChange={(e) => setNewCustomRole({ ...newCustomRole, role_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white text-xs"
                  placeholder="e.g. Content Evaluator"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  value={newCustomRole.description}
                  onChange={(e) => setNewCustomRole({ ...newCustomRole, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold focus:bg-white text-xs resize-none"
                  rows={3}
                  placeholder="Responsibilities & authority boundaries..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingCustomRole(false)
                    setNewCustomRole({ role_name: '', description: '' })
                    setCreatingRoleFor(null)
                  }}
                  className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-lg shadow-3xs hover:bg-slate-800"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTable