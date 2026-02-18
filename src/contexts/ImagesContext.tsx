import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useImageQueue } from '@/hooks/useImageQueue'
import type { ImageEntry, Settings } from '@/types'
import { downloadAllAsZip } from '@/utils/download'

import { useSettings } from './SettingsContext'

interface ImagesContextValue {
  images: ImageEntry[]
  doneCount: number
  upload: (files: File[]) => void
  deleteImage: (id: string) => void
  downloadAll: () => void
}

const ImagesContext = createContext<ImagesContextValue | null>(null)

export function ImagesProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<ImageEntry[]>([])
  const { settings } = useSettings()

  const prevSettingsRef = useRef(settings)

  const { enqueue, clearQueue, removeFromQueue } = useImageQueue(setImages)

  // Reprocess images when settings change
  useEffect(() => {
    if (prevSettingsRef.current === settings) return
    prevSettingsRef.current = settings

    clearQueue()

    const toEnqueue: { id: string; file: File; settings: Settings }[] = []

    setImages((prev) => {
      const toReprocess = prev.filter(
        (img) =>
          img.status === 'done' ||
          img.status === 'queued' ||
          img.status === 'processing',
      )

      if (toReprocess.length === 0) return prev

      toEnqueue.push(
        ...toReprocess.map((img) => ({
          id: img.id,
          file: img.file,
          settings,
        })),
      )

      return prev.map((img) =>
        toReprocess.some((r) => r.id === img.id)
          ? { ...img, status: 'queued' as const }
          : img,
      )
    })

    if (toEnqueue.length > 0) {
      enqueue(toEnqueue)
    }
  }, [settings, clearQueue, enqueue])

  const upload = useCallback(
    (files: File[]) => {
      const entries: ImageEntry[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        originalName: file.name,
        originalSize: file.size,
        originalFormat: file.type,
        originalWidth: 0,
        originalHeight: 0,
        optimizedBuffer: null,
        optimizedSize: null,
        optimizedFormat: settings.format,
        optimizedQuality: settings.quality,
        status: 'queued' as const,
        createdAt: Date.now(),
      }))

      setImages((prev) => [...entries.reverse(), ...prev])
      enqueue(entries.map((e) => ({ id: e.id, file: e.file, settings })))
    },
    [enqueue, settings],
  )

  const deleteImage = useCallback(
    (id: string) => {
      removeFromQueue(id)
      setImages((prev) => prev.filter((img) => img.id !== id))
    },
    [removeFromQueue],
  )

  const downloadAll = useCallback(() => {
    downloadAllAsZip(images)
  }, [images])

  const doneCount = images.filter((img) => img.status === 'done').length

  return (
    <ImagesContext.Provider
      value={{ images, doneCount, upload, deleteImage, downloadAll }}
    >
      {children}
    </ImagesContext.Provider>
  )
}

export function useImages() {
  const context = useContext(ImagesContext)
  if (!context) {
    throw new Error('useImages must be used within ImagesProvider')
  }
  return context
}
