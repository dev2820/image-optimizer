import { useCallback, useEffect, useRef } from 'react'

import type {
  WorkerRequest,
  WorkerResponse,
} from '@/lib/image-processor.worker'
import type { ImageEntry, OutputFormat, Settings } from '@/types'

interface QueueItem {
  id: string
  file: File
}

export function useImageQueue(
  setImages: React.Dispatch<React.SetStateAction<ImageEntry[]>>,
  settingsRef: React.RefObject<Settings>,
) {
  const queueRef = useRef<QueueItem[]>([])
  const isProcessingRef = useRef(false)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../lib/image-processor.worker.ts', import.meta.url),
      { type: 'module' },
    )
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  const processInWorker = useCallback(
    (arrayBuffer: ArrayBuffer, mimeType: string, format: OutputFormat, quality: number, id: string) => {
      return new Promise<{ buffer: ArrayBuffer; width: number; height: number }>(
        (resolve, reject) => {
          const worker = workerRef.current
          if (!worker) {
            reject(new Error('Worker not initialized'))
            return
          }

          const handler = (e: MessageEvent<WorkerResponse>) => {
            if (e.data.id !== id) return
            worker.removeEventListener('message', handler)

            if ('error' in e.data) {
              reject(new Error(e.data.error))
            } else {
              resolve({
                buffer: e.data.buffer,
                width: e.data.width,
                height: e.data.height,
              })
            }
          }

          worker.addEventListener('message', handler)
          worker.postMessage(
            { id, arrayBuffer, mimeType, format, quality } satisfies WorkerRequest,
            { transfer: [arrayBuffer] },
          )
        },
      )
    },
    [],
  )

  const processNext = useCallback(async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    while (queueRef.current.length > 0) {
      const item = queueRef.current.shift()!

      // Check if image still exists in state (may have been deleted)
      const exists = await new Promise<boolean>((resolve) => {
        setImages((prev) => {
          resolve(prev.some((img) => img.id === item.id))
          return prev
        })
      })

      if (!exists) continue

      // Mark as processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === item.id
            ? { ...img, status: 'processing' as const }
            : img,
        ),
      )

      const { format, quality } = settingsRef.current

      try {
        const arrayBuffer = await item.file.arrayBuffer()
        const result = await processInWorker(
          arrayBuffer,
          item.file.type,
          format,
          quality,
          item.id,
        )
        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id
              ? {
                  ...img,
                  originalWidth: result.width,
                  originalHeight: result.height,
                  optimizedBuffer: result.buffer,
                  optimizedSize: result.buffer.byteLength,
                  optimizedFormat: format,
                  optimizedQuality: quality,
                  status: 'done' as const,
                }
              : img,
          ),
        )
      } catch (err) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id
              ? {
                  ...img,
                  status: 'error' as const,
                  error:
                    err instanceof Error ? err.message : 'Processing failed',
                }
              : img,
          ),
        )
      }
    }

    isProcessingRef.current = false
  }, [setImages, settingsRef, processInWorker])

  const enqueue = useCallback(
    (items: QueueItem[]) => {
      queueRef.current.push(...items)
      processNext()
    },
    [processNext],
  )

  const clearQueue = useCallback(() => {
    queueRef.current = []
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    queueRef.current = queueRef.current.filter((item) => item.id !== id)
  }, [])

  return { enqueue, clearQueue, removeFromQueue }
}
