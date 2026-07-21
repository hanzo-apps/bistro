import type { ComponentProps, ReactNode } from 'react'
import { Button, SizableText } from '@hanzo/gui'

/**
 * One button, one way. @hanzo/gui's Button is a Stack — it takes background /
 * border / hover style props but NOT text `color`/`fontWeight` (those live on
 * text). So Btn renders the label as a SizableText child carrying the ink color,
 * and forwards every frame prop (size, backgroundColor, hoverStyle, onPress, …)
 * to Button. Every call site in the app goes through this.
 */
type BtnProps = Omit<ComponentProps<typeof Button>, 'children'> & {
  children: ReactNode
  /** Text color (ink). */
  fg: string
  weight?: '400' | '500' | '600' | '700' | '800' | '900'
  textSize?: ComponentProps<typeof SizableText>['size']
}

export function Btn({ children, fg, weight = '700', textSize, ...frame }: BtnProps) {
  return (
    <Button {...frame}>
      <SizableText color={fg} fontWeight={weight} size={textSize} numberOfLines={1}>
        {children}
      </SizableText>
    </Button>
  )
}
