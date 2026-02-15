import { ArrowRightIcon } from 'lucide-react'
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
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-6xl *:min-w-0">
        <DialogHeader className="flex-none">
          <DialogTitle>{image.originalName}</DialogTitle>
          <div className="text-muted-foreground flex flex-col gap-4 text-sm">
            <span>
              Size: {image.originalWidth} x {image.originalHeight}
            </span>
            <div className="space-x-2 flex flex-row place-items-center">
              <span>Original: {formatFileSize(image.originalSize)}</span>
              {image.optimizedSize !== null && (
                <>
                  <ArrowRightIcon size={16} />
                  <span>Optimized: {formatFileSize(image.optimizedSize)}</span>
                  <span className="font-bold text-green-600">
                    ({-savings}%)
                  </span>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="compare" className="mt-4 flex min-h-0 flex-1 flex-col">
          <TabsList className="flex-none">
            <TabsTrigger value="compare">Before / After</TabsTrigger>
            <TabsTrigger value="device">Device Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="compare" className="mt-4 min-h-0 flex-1 overflow-auto">
            <BeforeAfterSlider
              originalUrl={originalUrl}
              optimizedUrl={optimizedUrl}
            />
          </TabsContent>
          <TabsContent value="device" className="mt-4 min-h-0 flex-1 overflow-auto">
            <DevicePreview image={image} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
