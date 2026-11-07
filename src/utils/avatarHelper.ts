/**
 * Generates local SVG avatar with user initials
 */
import { Avatar, Style } from '@dicebear/core';
import loreleiStyleDef from '@dicebear/styles/lorelei.json';

const loreleiStyle = new Style(loreleiStyleDef as any);

/**
 * Generates DiceBear anime-style (lorelei) avatar data URI based on name/seed
 */
export const getDiceBearAvatar = (seed: string = 'User'): string => {
  try {
    const avatar = new Avatar(loreleiStyle, {
      seed: seed.trim() || 'User',
    });
    return avatar.toDataUri();
  } catch (error) {
    return getInitialsSvg(seed);
  }
};

const getInitialsSvg = (name: string, size: number = 100): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';
  
  const colors = ['#21a9ff', '#6dc6fe', '#3b82f6', '#1d4ed8', '#60a5fa'];
  const nameHash = Array.from(name || 'User')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = colors[nameHash % colors.length];
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" 
            font-size="${size/2.2}" font-weight="bold" fill="white" 
            text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Helper function to get avatar URL or SVG fallback
 */
export const getAvatarUrl = (avatarPath: string | null | undefined, userName: string = 'User'): string => {
  if (avatarPath) {
    // 1. Base64 preview during upload should be returned directly
    if (avatarPath.startsWith('data:image')) return avatarPath;

    // 2. Path Cleanup
    let cleanPath = avatarPath;
    if (cleanPath.includes('/api/uploads')) {
      cleanPath = cleanPath.replace('/api/uploads', '/uploads');
    }

    // 3. If the avatar is already a full URL, use it directly
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }

    const normalizeApiUrl = (rawUrl: string | undefined, fallback: string) => {
      if (!rawUrl) return fallback;
      const trimmed = rawUrl.trim();
      if (!trimmed) return fallback;
      if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, '');
      if (/^\/\//.test(trimmed)) return `http:${trimmed}`.replace(/\/$/, '');
      if (/^:\d+(\/.*)?$/.test(trimmed)) return `http://localhost${trimmed}`.replace(/\/$/, '');
      if (/^[^:/]+(:\d+)?(\/.*)?$/.test(trimmed)) return `http://${trimmed}`.replace(/\/$/, '');
      return fallback;
    };

    const API_BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:5000/api');
    const BASE_URL = API_BASE_URL.replace(/\/api$/, '').replace(/\/$/, '');
    const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    return `${BASE_URL}${finalPath}`;
  }
  
  return getInitialsSvg(userName);
};

export const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';
};