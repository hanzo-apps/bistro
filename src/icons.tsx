import { palette as c } from './theme'

/**
 * The wood-fire mark — the restaurant's one glyph, drawn inline so there is no
 * asset fetch (and it recolors to the palette). Used in the masthead and section
 * eyebrows. Inline SVG renders as DOM on the web target.
 */
export function Flame({ size = 22, color = c.ember }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3c2.6 3 5 5.1 5 8.6a5 5 0 1 1-10 0c0-1.8.9-3.1 2-4 .3 1.3 1.2 1.9 2 1.9-1-2.5 0-5.1 1-6.5z"
        fill={color}
      />
    </svg>
  )
}
