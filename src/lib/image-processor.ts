import { decode as decodeAvif } from '@jsquash/avif'
import { decode as decodeJpeg } from '@jsquash/jpeg'
import { decode as decodePng } from '@jsquash/png'
import resize from '@jsquash/resize'
import { decode as decodeWebp } from '@jsquash/webp'

import type { OutputFormat } from '@/types'

export async function decodeImage(
  buffer: ArrayBuffer,
  mimeType: string,
): Promise<ImageData> {
  switch (mimeType) {
    case 'image/jpeg':
      return decodeJpeg(buffer)
    case 'image/png':
      return decodePng(buffer)
    case 'image/webp':
      return decodeWebp(buffer)
    case 'image/avif': {
      const result = await decodeAvif(buffer)
      if (!result) throw new Error('Failed to decode AVIF image')
      return result
    }
    default:
      throw new Error(`Unsupported image format: ${mimeType}`)
  }
}

export async function encodeImage(
  imageData: ImageData,
  format: OutputFormat,
  quality: number,
): Promise<ArrayBuffer> {
  switch (format) {
    case 'webp': {
      const { encode } = await import('@jsquash/webp')
      return encode(imageData, { quality })
    }
    case 'avif': {
      const { encode } = await import('@jsquash/avif')
      return encode(imageData, { quality, speed: 6 })
    }
    case 'png': {
      const { encode } = await import('@jsquash/png')
      return encode(imageData)
    }
    case 'jpeg': {
      const { encode } = await import('@jsquash/jpeg')
      return encode(imageData, { quality })
    }
  }
}

export async function resizeImage(
  imageData: ImageData,
  targetWidth: number,
): Promise<ImageData> {
  const aspectRatio = imageData.height / imageData.width
  const targetHeight = Math.round(targetWidth * aspectRatio)
  return resize(imageData, {
    width: targetWidth,
    height: targetHeight,
    method: 'lanczos3',
    fitMethod: 'stretch',
  })
}

export async function processImage(
  file: File,
  format: OutputFormat,
  quality: number,
): Promise<{ buffer: ArrayBuffer; width: number; height: number }> {
  const arrayBuffer = await file.arrayBuffer()
  const imageData = await decodeImage(arrayBuffer, file.type)
  const buffer = await encodeImage(imageData, format, quality)
  return {
    buffer,
    width: imageData.width,
    height: imageData.height,
  }
}
