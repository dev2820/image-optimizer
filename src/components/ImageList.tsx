import { useCallback, useMemo, useState } from 'react'

import type { ImageEntry } from '@/types'

import { ImageItem } from './ImageItem'
import { PreviewModal } from './PreviewModal'

interface ImageListProps {
  images: ImageEntry[]
  onDelete: (id: string) => void
}

export function ImageList({ images, onDelete }: ImageListProps) {
  const [previewImage, setPreviewImage] = useState<ImageEntry | null>(null)

  const handlePreview = useCallback((image: ImageEntry) => {
    setPreviewImage(image)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])

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
          onPreview={handlePreview}
          onDelete={onDelete}
        />
      ))}
      <PreviewModal
        image={previewImage}
        open={previewImage !== null}
        onClose={handleClosePreview}
      />
    </div>
  )
}
