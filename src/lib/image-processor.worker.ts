import type { OutputFormat } from '@/types'

import { decodeImage, encodeImage } from './image-processor'

export interface WorkerRequest {
  id: string
  arrayBuffer: ArrayBuffer
  mimeType: string
  format: OutputFormat
  quality: number
}

export interface WorkerSuccessResponse {
  id: string
  buffer: ArrayBuffer
  width: number
  height: number
}

export interface WorkerErrorResponse {
  id: string
  error: string
}

export type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, arrayBuffer, mimeType, format, quality } = e.data

  try {
    const imageData = await decodeImage(arrayBuffer, mimeType)
    const buffer = await encodeImage(imageData, format, quality)

    self.postMessage(
      { id, buffer, width: imageData.width, height: imageData.height } satisfies WorkerSuccessResponse,
      { transfer: [buffer] },
    )
  } catch (err) {
    self.postMessage({
      id,
      error: err instanceof Error ? err.message : 'Processing failed',
    } satisfies WorkerErrorResponse)
  }
}
