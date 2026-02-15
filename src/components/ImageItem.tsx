import { Eye, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ImageEntry } from '@/types'
import { formatFileSize } from '@/utils/format'

import { DownloadButton } from './DownloadButton'

interface ImageItemProps {
  image: ImageEntry
  onPreview: (image: ImageEntry) => void
  onDelete: (id: string) => void
}

export function ImageItem({ image, onPreview, onDelete }: ImageItemProps) {
  const thumbnailUrl = useMemo(
    () => URL.createObjectURL(image.file),
    [image.file],
  )

  const savings =
    image.status === 'done' && image.optimizedSize !== null
      ? Math.round((1 - image.optimizedSize / image.originalSize) * 100)
      : null

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={thumbnailUrl}
          alt={image.originalName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{image.originalName}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {image.originalFormat.replace('image/', '').toUpperCase()}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {image.originalWidth} x {image.originalHeight}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-muted-foreground text-xs">
          {formatFileSize(image.originalSize)}
        </span>
        {image.status === 'done' && image.optimizedSize !== null && (
          <>
            <span className="text-muted-foreground text-xs">&rarr;</span>
            <span className="text-xs text-green-600">
              {formatFileSize(image.optimizedSize)}
            </span>
            {savings !== null && savings > 0 && (
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-xs text-green-700"
              >
                -{savings}%
              </Badge>
            )}
          </>
        )}
      </div>

      {image.status === 'error' && (
        <span className="shrink-0 text-xs text-red-500">{image.error}</span>
      )}

      <div className="flex shrink-0 items-center gap-1">
        {image.status === 'processing' && (
          <Spinner className="text-muted-foreground h-5 w-5" />
        )}

        {image.status === 'done' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPreview(image)}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
            <DownloadButton image={image} />
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(image.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
