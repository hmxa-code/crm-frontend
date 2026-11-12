import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { SocialAccount } from '@/src/types/marketing/social-account';
import { ChannelPlatformBadge } from '../shared/ChannelPlatformBadge';

interface ChannelPickerProps {
  accounts: SocialAccount[];
  selectedAccountIds: string[];
  onChange: (ids: string[]) => void;
}

export const ChannelPicker: React.FC<ChannelPickerProps> = ({
  accounts = [],
  selectedAccountIds = [],
  onChange,
}) => {
  const toggleAccount = (id: string) => {
    const list = selectedAccountIds || [];
    if (list.includes(id)) {
      onChange(list.filter((item) => item !== id));
    } else {
      onChange([...list, id]);
    }
  };

  const safeAccounts = Array.isArray(accounts) ? accounts : [];

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
        Target Social Accounts <span className="text-rose-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {safeAccounts.map((acc) => {
          const isSelected = (selectedAccountIds || []).includes(acc._id);
          return (
            <button
              type="button"
              key={acc._id}
              onClick={() => toggleAccount(acc._id)}
              className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/15'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ChannelPlatformBadge platform={acc.platform} showName={false} />
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {acc.account_name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {acc.followers_count?.toLocaleString() || 0} followers
                  </span>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center text-white shrink-0 ${
                  isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                }`}
              >
                {isSelected && <FiCheck size={11} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
