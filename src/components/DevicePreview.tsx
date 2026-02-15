import { useMemo, useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEVICE_SIZES } from '@/constants'
import type { ImageEntry } from '@/types'

interface DevicePreviewProps {
  image: ImageEntry
}

export function DevicePreview({ image }: DevicePreviewProps) {
  const availableSizes = DEVICE_SIZES.filter(
    (size) => size.width <= image.originalWidth,
  )
  const [activeDevice, setActiveDevice] = useState(
    availableSizes[0]?.key ?? 'mobile',
  )

  const optimizedUrl = useMemo(() => {
    if (!image.optimizedBuffer) return ''
    const mimeType =
      image.optimizedFormat === 'webp' ? 'image/webp' : 'image/avif'
    const blob = new Blob([image.optimizedBuffer], { type: mimeType })
    return URL.createObjectURL(blob)
  }, [image.optimizedBuffer, image.optimizedFormat])

  const activeSize = DEVICE_SIZES.find((s) => s.key === activeDevice)
  const displayWidth = activeSize
    ? Math.min(activeSize.width, image.originalWidth)
    : image.originalWidth

  if (!optimizedUrl) return null

  return (
    <div className="space-y-4">
      <Tabs value={activeDevice} onValueChange={setActiveDevice}>
        <TabsList>
          {availableSizes.map((size) => (
            <TabsTrigger key={size.key} value={size.key}>
              {size.label} ({size.width}px)
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-auto rounded-lg border bg-muted/30 p-4">
        <div
          className="mx-auto overflow-hidden rounded border bg-white shadow-sm"
          style={{ width: `${displayWidth}px` }}
        >
          <img
            src={optimizedUrl}
            alt={`${activeDevice} preview`}
            className="block w-full"
          />
        </div>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        Showing at {displayWidth}px width
      </p>
    </div>
  )
}
