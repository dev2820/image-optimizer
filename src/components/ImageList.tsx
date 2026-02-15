import { useMemo } from 'react'

import type { ImageEntry } from '@/types'

import { ImageItem } from './ImageItem'

interface ImageListProps {
  images: ImageEntry[]
  onPreview: (image: ImageEntry) => void
  onDelete: (id: string) => void
}

export function ImageList({ images, onPreview, onDelete }: ImageListProps) {
  const sorted = useMemo(
    () => [...images].sort((a, b) => b.createdAt - a.createdAt),
    [images],
  )

  if (images.length === 0) return null

  return (
    <div className="space-y-2">
      {sorted.map((image) => (
        <ImageItem
          key={image.id}
          image={image}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
