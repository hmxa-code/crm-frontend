"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiUser, FiX, FiCamera, FiPhone, FiMapPin, FiMail, FiShield, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';
import { UploadService } from '@/src/services/uploadService';
import { getAvatarUrl } from '@/src/utils/avatarHelper';
import { ACCOUNT_TYPE_LABELS, resolveAccountType } from '@/src/constants/roles';
import Image from 'next/image';

export const ProfileTable = () => {
    const [userData, setUserData] = useState<any>(null);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Focus tracking states like LeadsTable for high-end feel
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userProfile = (await AuthService.getCurrentUser()) as any;
            const finalData = userProfile?.user || userProfile?.data || userProfile;
            
            if (finalData?.avatar && typeof finalData.avatar === 'string') {
                finalData.avatar = `${finalData.avatar.split('?')[0]}?t=${Date.now()}`;
            }
            
            setUserData(finalData);
            window.dispatchEvent(new Event('userUpdated'));
        } catch (err: any) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingUser({ ...editingUser, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUploading(true);
            let avatarPath = userData?.avatar;

            if (avatarFile) {
                avatarPath = await UploadService.uploadAvatar(avatarFile);
            }
            
            const userId = userData?._id || userData?.id;
            const updatedData = { 
                ...editingUser, 
                avatar: avatarPath 
            };

            if (userId) {
                const response = await UserService.updateUser(userId, updatedData);
                let savedData = response?.user || response?.data || updatedData;
                
                if (savedData.avatar && typeof savedData.avatar === 'string' && !savedData.avatar.startsWith('data:')) {
                    savedData.avatar = `${savedData.avatar.split('?')[0]}?t=${Date.now()}`;
                }

                setUserData(savedData);
                window.dispatchEvent(new Event('userUpdated'));
                setEditingUser(null);
                setAvatarFile(null);
                
                // Show clean toast feedback instead of default windows alert popup
                setSuccessMessage('Profile details synchronized successfully');
                setTimeout(() => setSuccessMessage(null), 3500);
            }
        } catch (err: any) {
            console.error('Update failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const getRoleName = (user: any) => {
        if (!user) return 'Member';
        if (user.roleDetails?.role_name) return user.roleDetails.role_name;
        const accountType = resolveAccountType(user);
        if (accountType && ACCOUNT_TYPE_LABELS[accountType]) return ACCOUNT_TYPE_LABELS[accountType];
        if (typeof user.role === 'object') return user.role.role_name;
        return user.role || 'Member';
    };

    if (loading) {
        return (
            <div className="w-full bg-white min-h-[calc(100vh-65px)] flex flex-col items-center justify-center">
                <FiLoader style={{ color: "#00aaff" }} className="animate-spin w-6 h-6 mb-2.5" />
                <p className="text-slate-400 text-xs font-semibold tracking-tight">Synchronizing records...</p>
            </div>
        );
    }

    const profileImageUrl = userData?.avatar ? getAvatarUrl(userData.avatar, userData.name) : undefined;

    return (
        <div className="w-full bg-white min-h-[calc(100vh-65px)] p-6 md:p-8 text-slate-900 relative overflow-x-hidden">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* --- Action Notification Toast --- */}
                {successMessage && (
                    <div className="fixed bottom-5 right-5 z-[10000] bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <FiCheckCircle className="text-emerald-400 text-sm flex-shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* --- Header Profile Control Panel --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 shadow-3xs">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl border border-slate-200/80 shadow-3xs bg-white overflow-hidden flex items-center justify-center shrink-0">
                            {userData?.avatar ? (
                                <Image
                                    key={userData?.avatar}
                                    src={profileImageUrl!}
                                    alt="Profile"
                                    width={64}
                                    height={64}
                                    unoptimized={true}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${userData?.name}&background=00aaff&color=fff`;
                                    }}
                                />
                            ) : (
                                <div 
                                    style={{ color: "#00aaff", backgroundColor: "rgba(0, 170, 255, 0.06)" }}
                                    className="w-full h-full flex items-center justify-center font-bold text-base uppercase tracking-tight"
                                >
                                    {userData?.name?.substring(0, 2) || 'JD'}
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-800 capitalize leading-tight">{userData?.name || 'User Name'}</h1>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-400">
                                <span 
                                    style={{ color: "#00aaff", backgroundColor: "rgba(0, 170, 255, 0.06)", borderColor: "rgba(0, 170, 255, 0.15)" }}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                                >
                                    {getRoleName(userData)}
                                </span>
                                <span className="text-slate-200">|</span>
                                <span className="flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                                    <FiMapPin size={12} className="text-slate-400" /> {userData?.location || 'Location Not Set'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setEditingUser({...userData})}
                        style={{ backgroundColor: "#00aaff" }}
                        className="flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:opacity-90 active:scale-[0.98] text-xs cursor-pointer"
                    >
                        <FiEdit2 size={13} /> Update Profile
                    </button>
                </div>

                {/* --- Clean Minimalist Information Container --- */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
                        <FiUser style={{ color: "#00aaff" }} size={13} />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Account Metadata</h3>
                    </div>
                    
                    <div className="p-2 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                        <InfoField label="Full Name" value={userData?.name} />
                        <InfoField label="Email Address" value={userData?.email} icon={<FiMail size={12} className="text-slate-400" />} />
                        <InfoField 
                            label="Role / Designation" 
                            value={getRoleName(userData)} 
                            isHighlight 
                            icon={<FiShield size={12} />}
                        />
                        <InfoField label="Current Location" value={userData?.location} icon={<FiMapPin size={12} className="text-slate-400" />} />
                        <InfoField label="Contact Number" value={userData?.phone || userData?.number} icon={<FiPhone size={12} className="text-slate-400" />} />
                    </div>
                </div>

            </div>

            {/* --- Edit Profile Sidebar Sheet Form --- */}
            {editingUser && (
                <div className="fixed inset-0 z-[9999] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" onClick={() => !uploading && setEditingUser(null)} />
                    <div className="absolute top-0 right-0 h-full w-full sm:w-[380px] bg-white border-l border-slate-200 shadow-xl flex flex-col text-xs font-semibold animate-in slide-in-from-right duration-200">
                        
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-sm font-bold text-slate-800">Modify Identity Settings</h2>
                            <button type="button" onClick={() => !uploading && setEditingUser(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                <FiX size={16} />
                            </button>
                        </div>

                        <form onSubmit={updateUser} className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                
                                {/* Photo Uploader Section */}
                                <div className="flex flex-col items-center py-4 bg-slate-50/40 rounded-xl border border-slate-200/50 mb-1">
                                    <div className="relative group w-16 h-16 rounded-xl border border-slate-200 shadow-3xs bg-white overflow-hidden flex items-center justify-center">
                                        {editingUser.avatar ? (
                                            <img 
                                                key={editingUser.avatar}
                                                src={editingUser.avatar?.startsWith('data:') ? editingUser.avatar : getAvatarUrl(editingUser.avatar, editingUser.name)} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <span style={{ color: "#00aaff" }} className="font-bold uppercase text-xs">
                                                {editingUser.name?.substring(0, 2)}
                                            </span>
                                        )}
                                        <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiCamera className="text-white" size={16} />
                                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Replace Profile Image</span>
                                </div>

                                {/* Dynamic Form Fields */}
                                <EditInput 
                                    label="Full Name" 
                                    value={editingUser.name} 
                                    focusedInput={focusedInput}
                                    setFocusedInput={setFocusedInput}
                                    id="name"
                                    onChange={(val: string) => setEditingUser({...editingUser, name: val})} 
                                />
                                
                                <EditInput 
                                    label="Email Address" 
                                    value={editingUser.email} 
                                    focusedInput={focusedInput}
                                    setFocusedInput={setFocusedInput}
                                    id="email"
                                    onChange={(val: string) => setEditingUser({...editingUser, email: val})} 
                                />
                                
                                <EditInput 
                                    label="Location" 
                                    value={editingUser.location} 
                                    focusedInput={focusedInput}
                                    setFocusedInput={setFocusedInput}
                                    id="location"
                                    placeholder="e.g. Karachi, Pakistan" 
                                    onChange={(val: string) => setEditingUser({...editingUser, location: val})} 
                                />
                                
                                <EditInput 
                                    label="Contact Number" 
                                    value={editingUser.phone || editingUser.number} 
                                    focusedInput={focusedInput}
                                    setFocusedInput={setFocusedInput}
                                    id="phone"
                                    placeholder="e.g. +92 300 1234567" 
                                    onChange={(val: string) => setEditingUser({...editingUser, phone: val})} 
                                />

                            </div>

                            {/* Sticky Sheet Bottom Segment */}
                            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    style={{ backgroundColor: "#00aaff" }}
                                    className="flex-1 text-white font-bold py-2 rounded-lg transition-all shadow-3xs hover:opacity-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {uploading && <FiLoader className="animate-spin text-xs" />}
                                    <span>{uploading ? 'Synchronizing...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

// UI Field Viewer Component
const InfoField = ({ label, value, isHighlight = false, icon = null }: { label: string, value: string, isHighlight?: boolean, icon?: React.ReactNode }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] block">{label}</label>
        {isHighlight ? (
            <div className="pt-0.5">
                <span 
                    style={{ color: "#00aaff", backgroundColor: "rgba(0, 170, 255, 0.05)", borderColor: "rgba(0, 170, 255, 0.15)" }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                >
                    {icon} {value || 'Member'}
                </span>
            </div>
        ) : (
            <p className="text-xs font-bold text-slate-700 flex items-center gap-2 h-6">
                {icon} <span className="truncate">{value || '—'}</span>
            </p>
        )}
    </div>
);

// Form Input Component matching CRM Theme standards
const EditInput = ({ label, value, onChange, placeholder = "", focusedInput, setFocusedInput, id }: any) => (
    <div>
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1 ml-0.5">{label}</label>
        <input 
            type="text"
            className="w-full px-3 py-2 bg-slate-50/40 border border-slate-200/80 rounded-lg outline-none font-semibold transition-all focus:bg-white text-xs text-slate-800" 
            value={value || ''} 
            placeholder={placeholder}
            onFocus={() => setFocusedInput(id)}
            onBlur={() => setFocusedInput(null)}
            style={{ borderColor: focusedInput === id ? "#00aaff" : undefined }}
            onChange={(e) => onChange(e.target.value)} 
        />
    </div>
);