import { Download, Settings as SettingsIcon } from 'lucide-react'
import { useState } from 'react'

import { ImageList } from '@/components/ImageList'
import { ImageUploader } from '@/components/ImageUploader'
import { SettingsPanel } from '@/components/SettingsPanel'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ImagesProvider, useImages } from '@/contexts/ImagesContext'
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext'

import { Footer } from './components/Footer'
import { Header } from './components/Header'

export default function App() {
  return (
    <SettingsProvider>
      <ImagesProvider>
        <AppContent />
      </ImagesProvider>
    </SettingsProvider>
  )
}

function AppContent() {
  const { settings, updateSettings } = useSettings()

  const { images, upload, deleteImage } = useImages()

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 p-6">
            <ImageUploader onUpload={upload} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ImageList images={images} onDelete={deleteImage} />
            </div>
          </main>
          <aside className="hidden md:block flex-none w-72 border-l p-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={updateSettings}
            />
          </aside>
        </div>
        <div className="flex-none flex items-center justify-center gap-3 px-6 py-4 border-t">
          <DownloadAllButton />
          <MobileSettingButton />
        </div>
      </div>
      <Footer />
    </TooltipProvider>
  )
}

function DownloadAllButton() {
  const { doneCount, downloadAll } = useImages()

  return (
    <Button onClick={downloadAll} disabled={doneCount === 0} size="lg">
      <Download className="mr-2 h-4 w-4" />
      Download All ({doneCount} images)
    </Button>
  )
}

function MobileSettingButton() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings, updateSettings } = useSettings()

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="md:hidden"
        onClick={() => setSettingsOpen(true)}
      >
        <SettingsIcon className="mr-2 h-4 w-4" />
        Settings
      </Button>
      {/* 모바일 Setting 패널 */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={(newSettings) => {
                updateSettings(newSettings)
                setSettingsOpen(false)
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
