import { useCallback, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  originalUrl: string
  optimizedUrl: string
}

export function BeforeAfterSlider({
  originalUrl,
  optimizedUrl,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(percentage)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true
      updatePosition(e.clientX)
    },
    [updatePosition],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition],
  )

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true
      updatePosition(e.touches[0].clientX)
    },
    [updatePosition],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return
      updatePosition(e.touches[0].clientX)
    },
    [updatePosition],
  )

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative cursor-col-resize select-none overflow-hidden rounded-lg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={optimizedUrl}
        alt="Optimized"
        className="block w-full"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="block w-full"
          style={{ minWidth: containerRef.current?.offsetWidth ?? '100%' }}
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/50 text-xs text-white">
          &harr;
        </div>
      </div>

      <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
        Original
      </div>
      <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
        Optimized
      </div>
    </div>
  )
}
