import { ImgComparisonSlider } from '@img-comparison-slider/react'

interface BeforeAfterSliderProps {
  originalUrl: string
  optimizedUrl: string
}

export function BeforeAfterSlider({
  originalUrl,
  optimizedUrl,
}: BeforeAfterSliderProps) {
  return (
    <div className="flex flex-col justify-center overflow-hidden rounded-lg place-items-center">
      <ImgComparisonSlider style={{ outline: 'none', width: 'auto' }}>
        <img
          slot="first"
          src={originalUrl}
          alt="Original"
          className="block max-h-[60vh] max-w-full object-contain"
        />
        <img
          slot="second"
          src={optimizedUrl}
          alt="Optimized"
          className="block max-h-[60vh] max-w-full object-contain"
        />
      </ImgComparisonSlider>
      <div className="w-full text-muted-foreground mt-2 flex justify-between text-xs">
        <span>Original</span>
        <span>Optimized</span>
      </div>
    </div>
  )
}
