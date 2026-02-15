import type { DeviceSize, Settings } from '@/types'

export const DEVICE_SIZES: DeviceSize[] = [
  { label: 'Mobile', key: 'mobile', width: 640 },
  { label: 'Tablet', key: 'tablet', width: 768 },
  { label: 'Laptop', key: 'laptop', width: 1280 },
  { label: 'Desktop', key: 'desktop', width: 1920 },
]

export const DEFAULT_SETTINGS: Settings = {
  format: 'webp',
  quality: 80,
}

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const
