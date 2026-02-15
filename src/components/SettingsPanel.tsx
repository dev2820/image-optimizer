import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import type { OutputFormat, Settings } from '@/types'

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function SettingsPanel({
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings)

  const hasChanges =
    localSettings.format !== settings.format ||
    localSettings.quality !== settings.quality

  const handleFormatChange = (value: string) => {
    setLocalSettings((prev) => ({ ...prev, format: value as OutputFormat }))
  }

  const handleQualityChange = (value: number[]) => {
    setLocalSettings((prev) => ({ ...prev, quality: value[0] }))
  }

  const handleApply = () => {
    onSettingsChange(localSettings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Settings</h2>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Output Format</Label>
        <RadioGroup
          value={localSettings.format}
          onValueChange={handleFormatChange}
          className="flex gap-4 flex-wrap"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="webp" id="webp" />
            <Label htmlFor="webp" className="cursor-pointer">
              WebP
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="avif" id="avif" />
            <Label htmlFor="avif" className="cursor-pointer">
              AVIF
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="png" id="png" />
            <Label htmlFor="png" className="cursor-pointer">
              PNG
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="jpeg" id="jpeg" />
            <Label htmlFor="jpeg" className="cursor-pointer">
              JPEG
            </Label>
          </div>
        </RadioGroup>
      </div>

      {localSettings.format !== 'png' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Quality</Label>
            <span className="text-muted-foreground text-sm">
              {localSettings.quality}%
            </span>
          </div>
          <Slider
            value={[localSettings.quality]}
            onValueChange={handleQualityChange}
            min={1}
            max={100}
            step={1}
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}

      <Button onClick={handleApply} disabled={!hasChanges} className="w-full">
        Apply
      </Button>
    </div>
  )
}
