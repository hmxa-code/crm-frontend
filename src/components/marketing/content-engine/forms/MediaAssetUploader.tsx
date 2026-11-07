import React from 'react'
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi'
import { MediaAsset } from '@/src/types/marketing/content-engine'

interface MediaAssetUploaderProps {
  assets: MediaAsset[]
  onChange: (assets: MediaAsset[]) => void
}

export const MediaAssetUploader: React.FC<MediaAssetUploaderProps> = ({ assets, onChange }) => {
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAssets: MediaAsset[] = Array.from(files).map((file, idx) => ({
      id: 'media_' + Date.now() + '_' + idx,
      url: URL.createObjectURL(file),
      type: file.type.includes('video') ? 'video' : 'image',
      filename: file.name,
      size_bytes: file.size,
    }))

    onChange([...assets, ...newAssets])
  }

  const removeAsset = (id: string) => {
    onChange(assets.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
        Media Assets & Creative (Images/Videos)
      </label>

      {/* Upload Zone */}
      <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/40 hover:bg-blue-50/20 transition-all">
        <FiUploadCloud className="text-slate-400 text-2xl mb-1" />
        <span className="text-xs font-bold text-slate-700">Click or Drag & Drop Media</span>
        <span className="text-[10px] text-slate-400">Supports PNG, JPG, MP4 (Up to 50MB)</span>
        <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleSimulatedUpload} />
      </label>

      {/* Thumbnails */}
      {assets.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          {assets.map((item) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-900">
              <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:opacity-75" />
              <button
                type="button"
                onClick={() => removeAsset(item.id)}
                className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}