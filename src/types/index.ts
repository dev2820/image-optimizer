import { type OutputFormat } from './format'
export * from './format'
export * from './setting'

export interface ImageEntry {
  id: string
  file: File
  originalName: string
  originalSize: number
  originalFormat: string
  originalWidth: number
  originalHeight: number
  optimizedBuffer: ArrayBuffer | null
  optimizedSize: number | null
  optimizedFormat: OutputFormat
  optimizedQuality: number
  status: 'queued' | 'processing' | 'done' | 'error'
  error?: string
  createdAt: number
}

export interface DeviceSize {
  label: string
  key: string
  width: number
}
