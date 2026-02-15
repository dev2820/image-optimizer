import { Download } from 'lucide-react'
import { useCallback, useState } from 'react'

import { ImageList } from '@/components/ImageList'
import { ImageUploader } from '@/components/ImageUploader'
import { PreviewModal } from '@/components/PreviewModal'
import { SettingsPanel } from '@/components/SettingsPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DEFAULT_SETTINGS } from '@/constants'
import { processImage } from '@/lib/image-processor'
import type { ImageEntry, Settings } from '@/types'
import { downloadAllAsZip } from '@/utils/download'

function App() {
  const [images, setImages] = useState<ImageEntry[]>([])
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [previewImage, setPreviewImage] = useState<ImageEntry | null>(null)

  const processAndAddImage = useCallback(
    async (file: File, format: Settings['format'], quality: number) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

      const entry: ImageEntry = {
        id,
        file,
        originalName: file.name,
        originalSize: file.size,
        originalFormat: file.type,
        originalWidth: 0,
        originalHeight: 0,
        optimizedBuffer: null,
        optimizedSize: null,
        optimizedFormat: format,
        optimizedQuality: quality,
        status: 'processing',
        createdAt: Date.now(),
      }

      setImages((prev) => [entry, ...prev])

      try {
        const result = await processImage(file, format, quality)
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  originalWidth: result.width,
                  originalHeight: result.height,
                  optimizedBuffer: result.buffer,
                  optimizedSize: result.buffer.byteLength,
                  status: 'done' as const,
                }
              : img,
          ),
        )
      } catch (err) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'error' as const,
                  error:
                    err instanceof Error ? err.message : 'Processing failed',
                }
              : img,
          ),
        )
      }
    },
    [],
  )

  const handleUpload = useCallback(
    (files: File[]) => {
      for (const file of files) {
        processAndAddImage(file, settings.format, settings.quality)
      }
    },
    [processAndAddImage, settings],
  )

  const handleSettingsChange = useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings)

      const doneImages = images.filter((img) => img.status === 'done')
      for (const img of doneImages) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id ? { ...i, status: 'processing' as const } : i,
          ),
        )
        processImage(img.file, newSettings.format, newSettings.quality)
          .then((result) => {
            setImages((prev) =>
              prev.map((i) =>
                i.id === img.id
                  ? {
                      ...i,
                      optimizedBuffer: result.buffer,
                      optimizedSize: result.buffer.byteLength,
                      optimizedFormat: newSettings.format,
                      optimizedQuality: newSettings.quality,
                      status: 'done' as const,
                    }
                  : i,
              ),
            )
          })
          .catch((err) => {
            setImages((prev) =>
              prev.map((i) =>
                i.id === img.id
                  ? {
                      ...i,
                      status: 'error' as const,
                      error:
                        err instanceof Error
                          ? err.message
                          : 'Re-processing failed',
                    }
                  : i,
              ),
            )
          })
      }
    },
    [images],
  )

  const handleDelete = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  const handlePreview = useCallback((image: ImageEntry) => {
    setPreviewImage(image)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])

  const handleDownloadAll = useCallback(() => {
    downloadAllAsZip(images)
  }, [images])

  const doneCount = images.filter((img) => img.status === 'done').length

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <header className="border-b px-6 py-4">
          <h1 className="text-xl font-bold">Image Optimizer</h1>
          <p className="text-muted-foreground text-sm">
            Client-side image optimization powered by Squoosh WASM
          </p>
        </header>

        <div className="flex flex-1">
          <main className="flex-1 space-y-4 p-6">
            <ImageUploader onUpload={handleUpload} />
            <ImageList
              images={images}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          </main>

          <aside className="w-72 border-l p-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </aside>
        </div>

        {images.length > 0 && (
          <>
            <Separator />
            <footer className="flex items-center justify-center px-6 py-4">
              <Button
                onClick={handleDownloadAll}
                disabled={doneCount === 0}
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Download All as ZIP ({doneCount} images)
              </Button>
            </footer>
          </>
        )}

        <PreviewModal
          image={previewImage}
          open={previewImage !== null}
          onClose={handleClosePreview}
        />
      </div>
    </TooltipProvider>
  )
}

export default App
