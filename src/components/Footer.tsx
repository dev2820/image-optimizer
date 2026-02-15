import {
  FileDown,
  Globe,
  Images,
  Lock,
  MonitorSmartphone,
  SlidersHorizontal,
} from 'lucide-react'

import { Button } from './ui/button'
import { Separator } from './ui/separator'

export function Footer() {
  return (
    <footer className="border-t px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <AppDescription />
        <FeatureHighlights />
        <Separator />
        <TargetAudience />
        <Separator />
        <Copyright />
      </div>
    </footer>
  )
}

const AppDescription = () => {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h2 className="mt-16 text-5xl font-semibold text-foreground">
        Image Optimizer
      </h2>
      <p className="text-xl mt-8 text-foreground/80">
        Free browser-based image compression and conversion tool for bloggers,
        content creators, and web SEO practitioners. Optimize unlimited images
        to WebP, AVIF, JPEG, and PNG formats instantly — no upload limits, no
        servers, no sign-up required. Reduce image file sizes for faster page
        loads, better search rankings, and improved Core Web Vitals.
      </p>
    </div>
  )
}

const FEATURES = [
  {
    icon: Images,
    title: 'Batch Processing',
    description: 'Convert multiple images at once',
  },
  {
    icon: SlidersHorizontal,
    title: 'Quality Control',
    description: 'Adjust compression to your needs',
  },
  {
    icon: MonitorSmartphone,
    title: 'Before/After Preview',
    description: 'Compare results side by side',
  },
  {
    icon: FileDown,
    title: 'ZIP Download',
    description: 'Download all images in one click',
  },
  {
    icon: Lock,
    title: 'Fully Private',
    description: 'Files never leave your browser',
  },
  {
    icon: Globe,
    title: 'WebAssembly Powered',
    description: 'Fast processing with no installation',
  },
] as const

const FeatureHighlights = () => {
  return (
    <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex items-start gap-2">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60" />
          <div>
            <span className="text-xs font-medium text-foreground/80">
              {title}
            </span>
            <p className="text-xs">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

const TargetAudience = () => {
  return (
    <p className="max-w-2xl text-center text-xs">
      Built for web developers, designers, bloggers, and anyone who needs
      optimized images. Improve your website's Core Web Vitals, reduce bandwidth
      costs, and deliver faster page loads with properly compressed images.
    </p>
  )
}

const Copyright = () => {
  const year = new Date().getFullYear()

  return (
    <p className="text-xs text-center text-muted-foreground">
      &copy; {year}{' '}
      <Button asChild variant="link" className="px-0">
        <a href="https://github.com/dev2820">dev2820</a>
      </Button>{' '}
      Made with ❤️ <br />
      Powered by{' '}
      <Button asChild variant="link" className="px-0">
        <a
          href="https://github.com/nicolo-ribaudo/jSquash"
          target="_blank"
          rel="noopener noreferrer"
        >
          jSquash
        </a>
      </Button>{' '}
    </p>
  )
}
