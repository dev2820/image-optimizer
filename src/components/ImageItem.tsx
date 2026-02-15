import { Download, EllipsisVertical, Eye, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ImageEntry } from '@/types'
import { downloadBuffer, getOptimizedFileName } from '@/utils/download'
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
    <div className="@container relative flex flex-row gap-2 rounded-lg border p-3 @lg:flex-row place-items-center @lg:gap-4">
      {/* Top row (mobile) / Left section (desktop): thumbnail + name */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted @lg:h-16 @lg:w-16">
        <img
          src={thumbnailUrl}
          alt={image.originalName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium mb-1">
          {image.originalName}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          {/* Size info */}
          <div className="flex flex-row shrink-0 place-items-center gap-1.5">
            {image.status === 'done' && image.optimizedSize !== null && (
              <>
                <div className="flex flex-row place-items-center gap-1">
                  <span className="text-muted-foreground text-xs">
                    {formatFileSize(image.originalSize)}
                  </span>
                  <span className="text-muted-foreground text-xs">&rarr;</span>
                  <span className="text-xs text-green-600">
                    {formatFileSize(image.optimizedSize)}
                  </span>
                </div>
                {savings !== null && savings > 0 && (
                  <Badge
                    variant="outline"
                    className="flex-none border-green-200 bg-green-50 text-xs text-green-700"
                  >
                    -{savings}%
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {image.status === 'error' && (
        <span className="shrink-0 text-xs text-red-500">{image.error}</span>
      )}

      {/* Action buttons - desktop */}
      <div className="hidden shrink-0 items-center gap-1 @lg:flex">
        {image.status === 'queued' && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Queued
          </Badge>
        )}

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

      {/* Action menu - compact */}
      <div className="absolute top-2 right-2 @lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {image.status === 'queued' && (
              <DropdownMenuItem disabled>Queued</DropdownMenuItem>
            )}
            {image.status === 'done' && (
              <>
                <DropdownMenuItem onClick={() => onPreview(image)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (!image.optimizedBuffer) return
                    const filename = getOptimizedFileName(
                      image.originalName,
                      image.optimizedFormat,
                    )
                    downloadBuffer(
                      image.optimizedBuffer,
                      filename,
                      image.optimizedFormat,
                    )
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(image.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
