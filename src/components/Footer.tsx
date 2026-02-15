import { Button } from './ui/button'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 px-6 py-6 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
        <p>
          Image Optimizer is a free, client-side image compression tool. Convert
          and optimize your images to WebP, AVIF, JPEG, and PNG formats directly
          in your browser — no uploads, no servers, fully private.
        </p>
        <Copyright />
      </div>
    </footer>
  )
}

const Copyright = () => {
  const year = new Date().getFullYear()

  return (
    <p className="text-xs">
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
