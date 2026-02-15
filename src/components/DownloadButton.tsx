import { ChevronDown, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEVICE_SIZES } from '@/constants'
import type { ImageEntry } from '@/types'
import {
  downloadBuffer,
  downloadResized,
  getOptimizedFileName,
  getResizedFileName,
} from '@/utils/download'

interface DownloadButtonProps {
  image: ImageEntry
}

export function DownloadButton({ image }: DownloadButtonProps) {
  const availableSizes = DEVICE_SIZES.filter(
    (size) => size.width < image.originalWidth,
  )

  const handleDownloadOriginalSize = () => {
    if (!image.optimizedBuffer) return
    const filename = getOptimizedFileName(
      image.originalName,
      image.optimizedFormat,
    )
    downloadBuffer(image.optimizedBuffer, filename, image.optimizedFormat)
  }

  const handleDownloadResized = async (
    targetWidth: number,
    deviceKey: string,
  ) => {
    const filename = getResizedFileName(
      image.originalName,
      image.optimizedFormat,
      deviceKey,
    )
    await downloadResized(
      image.file,
      targetWidth,
      image.optimizedFormat,
      image.optimizedQuality,
      filename,
    )
  }

  return (
    <div className="flex">
      <Button
        size="sm"
        variant="outline"
        className="rounded-r-none"
        onClick={handleDownloadOriginalSize}
      >
        <Download className="mr-1 h-3.5 w-3.5" />
        Download
      </Button>
      {availableSizes.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="rounded-l-none border-l-0 px-2">
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableSizes.map((size) => (
              <DropdownMenuItem
                key={size.key}
                onClick={() => handleDownloadResized(size.width, size.key)}
              >
                {size.label} ({size.width}px)
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
