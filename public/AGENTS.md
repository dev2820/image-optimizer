# AGENTS.md

## Project Overview

Image Optimizer is a free, browser-based image compression tool built with React 19 and TypeScript. All image processing runs entirely client-side using WebAssembly (jSquash) in a Web Worker — no server uploads, no sign-up required.

Supported output formats: WebP, AVIF, JPEG, PNG.

Live site: https://dev2820.github.io/image-optimizer/

## Tech Stack

- **Framework**: React 19, TypeScript 5.9
- **Build Tool**: Vite 8 (with SWC)
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI
- **Image Processing**: jSquash (WebAssembly) — `@jsquash/webp`, `@jsquash/avif`, `@jsquash/jpeg`, `@jsquash/png`, `@jsquash/resize`
- **Package Manager**: pnpm

## Build & Dev Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Type-check (tsc -b) + build (vite build)
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm preview          # Preview production build
```

## Project Structure

```
src/
├── App.tsx                        # Root component, state management
├── main.tsx                       # Entry point
├── index.css                      # Global styles (Tailwind)
├── components/
│   ├── Header.tsx                 # App header
│   ├── Footer.tsx                 # SEO footer
│   ├── ImageUploader.tsx          # Drag & drop / paste upload
│   ├── ImageList.tsx              # Image list container
│   ├── ImageItem.tsx              # Individual image card
│   ├── SettingsPanel.tsx          # Format & quality controls
│   ├── PreviewModal.tsx           # Full-size preview dialog
│   ├── BeforeAfterSlider.tsx      # Before/after comparison slider
│   ├── DownloadButton.tsx         # Download button
│   └── ui/                        # shadcn/ui primitives
├── hooks/
│   └── useImageQueue.ts           # Image processing queue hook
├── lib/
│   ├── image-processor.ts         # Decode/encode/resize using jSquash
│   ├── image-processor.worker.ts  # Web Worker for off-thread processing
│   └── utils.ts                   # Utility (cn)
├── utils/
│   ├── download.ts                # ZIP download (JSZip + file-saver)
│   └── format.ts                  # File size formatting
├── types/
│   └── index.ts                   # TypeScript types (OutputFormat, Settings, ImageEntry)
├── constants/
│   └── index.ts                   # Default settings, device sizes, MIME types
└── assets/                        # Static assets
```

## Code Conventions

- **Path alias**: Use `@/` to import from `src/` (e.g., `import { Button } from '@/components/ui/button'`)
- **Import sorting**: Enforced by `eslint-plugin-simple-import-sort`
- **Formatting**: Prettier for all `.ts`, `.tsx`, `.css` files
- **Components**: Functional components only, no class components
- **State management**: React hooks (`useState`, `useRef`, `useCallback`), no external state library
- **Ref updates**: Never update refs during render; always use `useEffect`

## Architecture Notes

- Image processing runs in a **Web Worker** (`image-processor.worker.ts`) to avoid blocking the main thread
- jSquash WASM modules are excluded from Vite's `optimizeDeps` to ensure proper WASM loading
- The app uses a **queue system** (`useImageQueue`) for batch processing
- When settings change, all processed images are re-queued with new settings
- Vite `base` is set to `/image-optimizer/` for GitHub Pages deployment

## Deployment

Deployed to GitHub Pages via GitHub Actions. Pushing to `main` triggers automatic build and deploy.
