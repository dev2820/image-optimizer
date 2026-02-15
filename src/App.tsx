import { Download, Settings as SettingsIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ImageList } from '@/components/ImageList'
import { ImageUploader } from '@/components/ImageUploader'
import { PreviewModal } from '@/components/PreviewModal'
import { SettingsPanel } from '@/components/SettingsPanel'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DEFAULT_SETTINGS } from '@/constants'
import { useImageQueue } from '@/hooks/useImageQueue'
import type { ImageEntry, Settings } from '@/types'
import { downloadAllAsZip } from '@/utils/download'

import { Footer } from './components/Footer'
import { Header } from './components/Header'

function App() {
  const [images, setImages] = useState<ImageEntry[]>([])
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [previewImage, setPreviewImage] = useState<ImageEntry | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const settingsRef = useRef<Settings>(settings)
  const imagesRef = useRef<ImageEntry[]>(images)

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  const { enqueue, clearQueue, removeFromQueue } = useImageQueue(
    setImages,
    settingsRef,
  )

  const handleUpload = useCallback(
    (files: File[]) => {
      const entries: ImageEntry[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        originalName: file.name,
        originalSize: file.size,
        originalFormat: file.type,
        originalWidth: 0,
        originalHeight: 0,
        optimizedBuffer: null,
        optimizedSize: null,
        optimizedFormat: settingsRef.current.format,
        optimizedQuality: settingsRef.current.quality,
        status: 'queued' as const,
        createdAt: Date.now(),
      }))

      setImages((prev) => [...entries.reverse(), ...prev])
      enqueue(entries.map((e) => ({ id: e.id, file: e.file })))
    },
    [enqueue],
  )

  const handleSettingsChange = useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings)
      settingsRef.current = newSettings

      clearQueue()

      const toReprocess = imagesRef.current.filter(
        (img) =>
          img.status === 'done' ||
          img.status === 'queued' ||
          img.status === 'processing',
      )

      if (toReprocess.length === 0) return

      setImages((prev) =>
        prev.map((img) =>
          toReprocess.some((r) => r.id === img.id)
            ? { ...img, status: 'queued' as const }
            : img,
        ),
      )

      enqueue(toReprocess.map((img) => ({ id: img.id, file: img.file })))
    },
    [clearQueue, enqueue],
  )

  const handleDelete = useCallback(
    (id: string) => {
      removeFromQueue(id)
      setImages((prev) => prev.filter((img) => img.id !== id))
    },
    [removeFromQueue],
  )

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
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 p-6">
            <ImageUploader onUpload={handleUpload} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ImageList
                images={images}
                onPreview={handlePreview}
                onDelete={handleDelete}
              />
            </div>
          </main>
          <aside className="hidden md:block flex-none w-72 border-l p-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </aside>
        </div>
        <div className="flex-none flex items-center justify-center gap-3 px-6 py-4 border-t">
          <Button
            onClick={handleDownloadAll}
            disabled={doneCount === 0}
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All ({doneCount} images)
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="md:hidden"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      <PreviewModal
        image={previewImage}
        open={previewImage !== null}
        onClose={handleClosePreview}
      />
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={(newSettings) => {
                handleSettingsChange(newSettings)
                setSettingsOpen(false)
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
      <Footer />
    </TooltipProvider>
  )
}

export default App
