import { useMemo } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ImageEntry } from '@/types'
import { formatFileSize } from '@/utils/format'

import { BeforeAfterSlider } from './BeforeAfterSlider'
import { DevicePreview } from './DevicePreview'

interface PreviewModalProps {
  image: ImageEntry | null
  open: boolean
  onClose: () => void
}

export function PreviewModal({ image, open, onClose }: PreviewModalProps) {
  const originalUrl = useMemo(() => {
    if (!image) return ''
    return URL.createObjectURL(image.file)
  }, [image])

  const optimizedUrl = useMemo(() => {
    if (!image?.optimizedBuffer) return ''
    const mimeType =
      image.optimizedFormat === 'webp' ? 'image/webp' : 'image/avif'
    const blob = new Blob([image.optimizedBuffer], { type: mimeType })
    return URL.createObjectURL(blob)
  }, [image])

  if (!image) return null

  const savings =
    image.optimizedSize !== null
      ? Math.round((1 - image.optimizedSize / image.originalSize) * 100)
      : 0

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{image.originalName}</DialogTitle>
          <div className="text-muted-foreground flex gap-4 text-sm">
            <span>
              Original: {formatFileSize(image.originalSize)} (
              {image.originalWidth}x{image.originalHeight})
            </span>
            {image.optimizedSize !== null && (
              <>
                <span>
                  Optimized: {formatFileSize(image.optimizedSize)} (
                  {image.optimizedFormat.toUpperCase()})
                </span>
                <span className="text-green-600">-{savings}%</span>
              </>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="compare" className="mt-4">
          <TabsList>
            <TabsTrigger value="compare">Before / After</TabsTrigger>
            <TabsTrigger value="device">Device Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="compare" className="mt-4">
            <BeforeAfterSlider
              originalUrl={originalUrl}
              optimizedUrl={optimizedUrl}
            />
          </TabsContent>
          <TabsContent value="device" className="mt-4">
            <DevicePreview image={image} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
