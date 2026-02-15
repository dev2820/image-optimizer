# Image Optimizer Web App - Implementation Plan

## Context

This project is a fresh Vite + React 19 + TypeScript + Tailwind v4 + shadcn template. We need to build a client-side image optimizer that converts images to WebP/AVIF using Squoosh WASM codecs (via **jSquash** - browser-focused Squoosh WASM wrappers). All processing happens in the browser - no server required.

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│ Header: Image Optimizer                               │
├──────────────────────────────────┬───────────────────┤
│ Main (left ~70%)                 │ Settings (right)  │
│                                  │                   │
│ ┌──────────────────────────────┐ │ Format: WebP/AVIF │
│ │ Upload Area (DnD + Paste)    │ │ Quality: [slider] │
│ └──────────────────────────────┘ │   default: 80     │
│                                  │                   │
│ ┌──────────────────────────────┐ │                   │
│ │ Image Item (newest first)    │ │                   │
│ │  - name, size, format        │ │                   │
│ │  - loading / optimized size  │ │                   │
│ │  - preview / download / del  │ │                   │
│ ├──────────────────────────────┤ │                   │
│ │ Image Item ...               │ │                   │
│ └──────────────────────────────┘ │                   │
│                                  │                   │
├──────────────────────────────────┴───────────────────┤
│ [Download All as ZIP]                                 │
└──────────────────────────────────────────────────────┘
```

## Step 1: Install Dependencies

**npm packages:**
```bash
pnpm add @jsquash/webp @jsquash/avif @jsquash/png @jsquash/jpeg @jsquash/resize jszip file-saver
pnpm add -D @types/file-saver
```

**shadcn components:**
```bash
pnpm dlx shadcn@latest add button slider dialog card dropdown-menu separator label radio-group badge tabs tooltip
```

## Step 2: Vite Config Update

**File:** `vite.config.ts`

Add `optimizeDeps.exclude` for jSquash packages to prevent WASM loading failures:
```ts
optimizeDeps: {
  exclude: ['@jsquash/webp', '@jsquash/avif', '@jsquash/png', '@jsquash/jpeg', '@jsquash/resize']
}
```

## Step 3: Types

**New file:** `src/types/index.ts`

```ts
export type OutputFormat = 'webp' | 'avif'

export interface Settings {
  format: OutputFormat
  quality: number // 0-100, default 80
}

export interface ImageEntry {
  id: string
  file: File
  originalName: string
  originalSize: number
  originalFormat: string
  originalWidth: number
  originalHeight: number
  optimizedBuffer: ArrayBuffer | null
  optimizedSize: number | null
  optimizedFormat: OutputFormat
  optimizedQuality: number
  status: 'processing' | 'done' | 'error'
  error?: string
  createdAt: number
}

export interface DeviceSize {
  label: string
  key: string
  width: number
}
```

## Step 4: Constants

**New file:** `src/lib/constants.ts`

Device breakpoints for resize downloads:
- Mobile: 640px
- Tablet: 768px
- Laptop: 1280px
- Desktop: 1920px

## Step 5: Image Processing Module

**New file:** `src/lib/image-processor.ts`

Core functions using jSquash:
- `decodeImage(buffer: ArrayBuffer, mimeType: string): Promise<ImageData>` - uses @jsquash/jpeg, @jsquash/png, or @jsquash/webp decode based on mime type
- `encodeImage(imageData: ImageData, format: OutputFormat, quality: number): Promise<ArrayBuffer>` - uses @jsquash/webp or @jsquash/avif encode
- `resizeImage(imageData: ImageData, targetWidth: number): Promise<ImageData>` - uses @jsquash/resize maintaining aspect ratio
- `processImage(file: File, format: OutputFormat, quality: number): Promise<{buffer, width, height}>` - full pipeline: decode → encode

**jSquash encode options:**
- WebP: `{ quality: number }` (0-100)
- AVIF: `{ quality: number, speed: 6 }` (0-100, speed for performance)

## Step 6: Download Utilities

**New file:** `src/lib/download.ts`

- `downloadSingle(buffer, filename, format)` - download one optimized image
- `downloadResized(file, targetWidth, format, quality, filename)` - decode → resize → encode → download
- `downloadAllAsZip(images: ImageEntry[])` - uses JSZip to bundle all optimized images

Naming convention: `{basename}-opt.{format}` (e.g., `photo-opt.webp`)

## Step 7: Components

### 7.1 `src/components/ImageUploader.tsx`
- Drag & drop zone with visual feedback (dashed border, hover state)
- Paste support via `document.addEventListener('paste', ...)`
- Click to browse files (hidden file input)
- Accepts: image/jpeg, image/png, image/webp
- Calls `onUpload(files: File[])` callback

### 7.2 `src/components/SettingsPanel.tsx`
- **Format selector:** RadioGroup with WebP (default) and AVIF options
- **Quality slider:** shadcn Slider, range 1-100, default 80, shows current value
- Fixed position on the right side of the layout
- Calls `onSettingsChange(settings)` when values change

### 7.3 `src/components/ImageList.tsx`
- Maps over images array (sorted by `createdAt` desc - newest first)
- Renders `ImageItem` for each entry

### 7.4 `src/components/ImageItem.tsx`
- Card-based layout showing:
  - Image thumbnail (small preview from original file URL)
  - Original: filename, size (KB/MB), dimensions, format
  - Optimized: size, compression ratio (% saved)
  - Status: spinner during processing, info when done, error message
- Action buttons (visible when status === 'done'):
  - **Preview** button → opens PreviewModal
  - **Download** button group: main button (original size) + dropdown (device sizes)
    - Dropdown items filtered: only show sizes smaller than original width
  - **Delete** button (icon)

### 7.5 `src/components/DownloadButton.tsx`
- Button + DropdownMenu combo (split button pattern)
- Main click: download at original size
- Dropdown: Mobile (640px), Tablet (768px), Laptop (1280px), Desktop (1920px)
- Each option disabled/hidden if original image is smaller than that size

### 7.6 `src/components/PreviewModal.tsx`
- shadcn Dialog (large/fullscreen)
- **Before/After comparison** - `BeforeAfterSlider` component
- Shows image info (original size vs optimized size, savings %)

### 7.7 `src/components/BeforeAfterSlider.tsx`
- Two images stacked (original and optimized)
- Draggable vertical divider controlled by range input or mouse drag
- Left side: original image (clipped by divider position)
- Right side: optimized image
- Labels: "Original" / "Optimized"

## Step 8: App.tsx Rewrite

**File:** `src/App.tsx`

State management in App component:
- `images: ImageEntry[]` - all uploaded images
- `settings: Settings` - current format + quality
- `previewImage: ImageEntry | null` - image for preview modal

Key logic:
- `handleUpload(files)` - process each file with current settings, add to images array
- `handleSettingsChange(newSettings)` - update settings, re-process all existing done images
- `handleDelete(id)` - remove image from array, revoke object URLs
- `handlePreview(image)` - open preview modal
- Layout: flex row with main content (uploader + list) and settings panel

## Step 9: CSS / Styling Cleanup

- Remove `App.css` (unused)
- Clean up `index.css` - remove default Vite styles (link colors, button styles, body centering)
- Ensure `body` allows full-width layout

## Verification

1. `pnpm dev` - app starts without errors
2. Upload test images (JPEG, PNG, WebP) via drag & drop and paste
3. Verify auto-conversion to WebP with loading indicator
4. Switch format to AVIF, verify re-processing
5. Adjust quality slider, verify size changes
6. Download individual image (original size) - check filename is `*-opt.webp`
7. Download resized image via dropdown
8. Preview modal: verify before/after slider
9. Upload multiple images, click "Download All" - verify ZIP download
10. Delete an image, verify removal
11. `pnpm build` - builds without errors
12. `pnpm lint` - no lint errors
