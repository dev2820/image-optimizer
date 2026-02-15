import { saveAs } from 'file-saver'
import JSZip from 'jszip'

import { decodeImage, encodeImage, resizeImage } from '@/lib/image-processor'
import type { ImageEntry, OutputFormat } from '@/types'
import { getBaseName } from '@/utils/format'

export function downloadBuffer(
  buffer: ArrayBuffer,
  filename: string,
  format: OutputFormat,
) {
  const mimeType = format === 'webp' ? 'image/webp' : 'image/avif'
  const blob = new Blob([buffer], { type: mimeType })
  saveAs(blob, filename)
}

export function getOptimizedFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const baseName = getBaseName(originalName)
  return `${baseName}-opt.${format}`
}

export function getResizedFileName(
  originalName: string,
  format: OutputFormat,
  deviceKey: string,
): string {
  const baseName = getBaseName(originalName)
  return `${baseName}-opt-${deviceKey}.${format}`
}

export async function downloadResized(
  file: File,
  targetWidth: number,
  format: OutputFormat,
  quality: number,
  filename: string,
) {
  const arrayBuffer = await file.arrayBuffer()
  const imageData = await decodeImage(arrayBuffer, file.type)
  const resized = await resizeImage(imageData, targetWidth)
  const encoded = await encodeImage(resized, format, quality)
  downloadBuffer(encoded, filename, format)
}

export async function downloadAllAsZip(images: ImageEntry[]) {
  const doneImages = images.filter(
    (img) => img.status === 'done' && img.optimizedBuffer,
  )
  if (doneImages.length === 0) return

  const zip = new JSZip()

  for (const img of doneImages) {
    const filename = getOptimizedFileName(img.originalName, img.optimizedFormat)
    zip.file(filename, img.optimizedBuffer!)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'optimized-images.zip')
}
