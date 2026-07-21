/**
 * Bistro Site palette — the warm editorial dining look, in ONE place.
 *
 * @hanzo/gui props take raw color strings (ColorTokens | string & {}), so views
 * paint these directly (backgroundColor / color / borderColor / LinearGradient
 * colors) rather than leaning on theme tokens — that keeps the restaurant's
 * ember-and-cream identity independent of the gui base theme.
 */
export const palette = {
  paper: '#FBF6EC',      // warm paper — the page
  panel: '#F4EADB',      // deeper cream — raised cards / bands
  ink: '#2A160E',        // espresso — display type
  inkSoft: '#6E5A48',    // muted brown — body / captions
  ember: '#B23A1B',      // terracotta — primary accent
  emberDeep: '#7E2612',  // deep ember — pressed / borders
  amber: '#C98A2E',      // ochre — secondary accent
  gold: '#E0A73C',       // warm gold — glow / highlights
  olive: '#6E7A52',      // herb — tertiary accent
  line: '#E4D6BE',       // hairline rule
  night: '#241009',      // charred ember — dark hero field
  nightMid: '#4A2213',   // mid ember — gradient stop
  cream: '#F6E9D2',      // cream ink on dark
  creamSoft: '#D9C3A3',  // muted cream on dark
} as const

export type Palette = typeof palette
