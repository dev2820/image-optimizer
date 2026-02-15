import { FileDown, Lock, SlidersHorizontal } from 'lucide-react'

import Logo from '@/assets/logo.png'

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
    <div className="flex flex-col gap-2 text-center mb-10">
      <h2 className="mt-16 text-5xl font-semibold text-foreground">
        Image Optimizer
      </h2>
      <img
        src={Logo}
        alt="image optimizer"
        width="200"
        height="200"
        className="self-center mt-4"
      />
      <p className="text-xl mt-4 text-foreground/80">
        Free browser-based image compression tool for bloggers, content
        creators, and web SEO practitioners. Optimize unlimited images to WebP,
        AVIF, JPEG, and PNG — no upload limits, no servers, no sign-up required.
      </p>
    </div>
  )
}

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: 'Quality Control',
    description: 'Adjust compression to your needs',
  },
  {
    icon: FileDown,
    title: 'Download',
    description: 'Download all images in one click',
  },
  {
    icon: Lock,
    title: 'Fully Private',
    description: 'Files never leave your browser',
  },
] as const

const FeatureHighlights = () => {
  return (
    <ul className="my-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <li
          key={title}
          className="flex flex-col items-center gap-3 rounded-xl border bg-muted/40 px-4 py-6 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10">
            <Icon className="h-7 w-7 text-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold text-foreground">
              {title}
            </span>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

const TargetAudience = () => {
  return (
    <p className="max-w-2xl text-center text-base text-muted-foreground">
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
