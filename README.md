# Image Optimizer

<img src="./public/logo.png" width="256" height="256"/>

Free browser-based image compression tool. Optimize unlimited images to WebP, AVIF, JPEG, and PNG — no upload limits, no servers, no sign-up required.

All image processing happens entirely in your browser using WebAssembly. Your files never leave your device.

**https://dev2820.github.io/image-optimizer/**

## Features

- **Multiple Output Formats** — Convert to WebP, AVIF, JPEG, PNG
- **Quality Control** — Adjust compression quality (1-100%)
- **Batch Processing** — Upload and optimize multiple images at once
- **Before/After Comparison** — Interactive slider to compare original vs optimized
- **One-Click Download** — Download individual images or all as a ZIP
- **Drag & Drop / Paste** — Upload via drag-and-drop or clipboard paste
- **Fully Private** — No server uploads, all processing runs client-side
- **Responsive** — Works on desktop and mobile devices

## How It Works

1. **Upload** — Drag & drop, click to browse, or paste images (JPEG, PNG, WebP)
2. **Process** — Images are decoded and re-encoded in a Web Worker using jSquash (WebAssembly)
3. **Download** — Save optimized images individually or as a ZIP archive

The entire pipeline runs in your browser. No data is sent to any server.

## License

MIT

## Author

[dev2820](https://github.com/dev2820)
