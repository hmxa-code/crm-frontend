import React, { useState } from 'react'
import { FiX, FiCheck, FiLoader } from 'react-icons/fi'
import { CreateContentPayload, MediaAsset } from '@/src/types/marketing/content-engine'
import { SocialAccount } from '@/src/types/marketing/social-account'
import { ChannelPicker } from '../forms/ChannelPicker'
import { ContentEditor } from '../forms/ContentEditor'
import { MediaAssetUploader } from '../forms/MediaAssetUploader'
import { ScheduleSettings } from '../forms/ScheduleSettings'
import { FacebookFeedPreview } from '../previews/FacebookFeedPreview'
import { InstagramFeedPreview } from '../previews/InstagramFeedPreview'
import { LinkedInFeedPreview } from '../previews/LinkedInFeedPreview'
import toast from 'react-hot-toast'

interface CreateContentDrawerProps {
  isOpen: boolean
  accounts: SocialAccount[]
  onClose: () => void
  onSubmit: (payload: CreateContentPayload) => Promise<void>
}

export const CreateContentDrawer: React.FC<CreateContentDrawerProps> = ({
  isOpen,
  accounts,
  onClose,
  onSubmit,
}) => {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [persona, setPersona] = useState('')
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [publishImmediately, setPublishImmediately] = useState(true)
  const [scheduledAt, setScheduledAt] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAccountIds.length === 0) {
      toast.error('Please select at least one social account.')
      return
    }
    if (!caption.trim()) {
      toast.error('Caption cannot be empty.')
      return
    }

    const selectedPlatforms = accounts
      .filter((a) => selectedAccountIds.includes(a._id))
      .map((a) => a.platform)

    const payload: CreateContentPayload = {
      target_account_ids: selectedAccountIds,
      target_platforms: Array.from(new Set(selectedPlatforms)),
      caption,
      media_assets: mediaAssets,
      status: publishImmediately ? 'Publishing' : 'Scheduled',
      publish_immediately: publishImmediately,
      scheduled_at: publishImmediately ? undefined : scheduledAt,
      target_persona: persona,
      created_by: 'Current User',
    }

    setSubmitting(true)
    try {
      await onSubmit(payload)
      toast.success('Content dispatched to queue successfully!')
      onClose()
    } catch {
      toast.error('Failed to create content post.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden bg-slate-950/60 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-4xl bg-white border-l border-slate-200 h-full flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Configure Content Engine Dispatch</h2>
            <p className="text-[11px] text-slate-400">Author multi-channel posts with instant live feed previews.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        {/* Body Split View */}
        <form id="content-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Side */}
          <div className="space-y-5">
            <ChannelPicker accounts={accounts} selectedAccountIds={selectedAccountIds} onChange={setSelectedAccountIds} />
            <ContentEditor caption={caption} persona={persona} onCaptionChange={setCaption} onPersonaChange={setPersona} />
            <MediaAssetUploader assets={mediaAssets} onChange={setMediaAssets} />
            <ScheduleSettings
              publishImmediately={publishImmediately}
              scheduledAt={scheduledAt}
              onPublishImmediatelyChange={setPublishImmediately}
              onScheduledAtChange={setScheduledAt}
            />
          </div>

          {/* Real-time Feed Preview Canvas */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center gap-4 overflow-y-auto max-h-[600px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 self-start">
              Live Feed Device Preview
            </span>
            <FacebookFeedPreview caption={caption} mediaAssets={mediaAssets} />
            <InstagramFeedPreview caption={caption} mediaAssets={mediaAssets} />
            <LinkedInFeedPreview caption={caption} mediaAssets={mediaAssets} />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
            Cancel
          </button>
          <button
            type="submit"
            form="content-form"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? <FiLoader className="animate-spin" /> : <FiCheck />}
            <span>{publishImmediately ? 'Publish Now' : 'Schedule Item'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}