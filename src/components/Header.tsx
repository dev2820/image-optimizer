import { Button } from './ui/button'

export function Header() {
  return (
    <header className="flex-none border-b px-6 py-4">
      <h1 className="text-xl font-bold">Image Optimizer</h1>
      <p className="text-muted-foreground text-sm">
        Client-side image optimization powered by{' '}
        <Button asChild variant="link" className="px-0">
          <a href="https://squoosh.app/" target="_blank">
            Squoosh
          </a>
        </Button>{' '}
        WASM
      </p>
    </header>
  )
}
