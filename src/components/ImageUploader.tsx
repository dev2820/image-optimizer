import { Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ACCEPTED_MIME_TYPES } from '@/constants'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onUpload: (files: File[]) => void
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCountRef = useRef(0)

  const filterImageFiles = useCallback((files: FileList | File[]): File[] => {
    return Array.from(files).filter((file) =>
      (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type),
    )
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current++
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current--
    if (dragCountRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCountRef.current = 0
      setIsDragging(false)

      const imageFiles = filterImageFiles(e.dataTransfer.files)
      if (imageFiles.length > 0) {
        onUpload(imageFiles)
      }
    },
    [filterImageFiles, onUpload],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const imageFiles = filterImageFiles(e.target.files)
        if (imageFiles.length > 0) {
          onUpload(imageFiles)
        }
        e.target.value = ''
      }
    },
    [filterImageFiles, onUpload],
  )

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const files: File[] = []
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }

      if (files.length > 0) {
        const imageFiles = filterImageFiles(files)
        if (imageFiles.length > 0) {
          onUpload(imageFiles)
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [filterImageFiles, onUpload])

  return (
    <div
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="text-muted-foreground mb-3 h-10 w-10" />
      <p className="text-sm font-medium">
        Drop images here, paste, or click to browse
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Supports JPEG, PNG, WebP
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
