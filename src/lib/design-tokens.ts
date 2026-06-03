/**
 * Design tokens for the Yika dashboard.
 *
 * Single source of truth for brand colors, fonts, and radii.
 * Values mirror the CSS custom properties declared in `src/app/globals.css`
 * (under `:root`) and the Tailwind theme bindings in the `@theme inline` block.
 *
 * Prefer the Tailwind utility classes (e.g. `bg-brand-magenta`, `text-text-muted`)
 * in JSX. Import from this module when you need a raw value in TypeScript
 * (e.g. inline styles, third-party libraries that accept hex strings).
 */

export const colors = {
  brand: {
    magenta: '#8C2D8B',   // deep brand — primary CTAs, @handles
    lavender: '#B361A6',  // light accent — the "Tatiana" italic color
    footer: '#672862',    // existing footer background
  },
  page: '#FFFDF7',        // warm-white body background
  surface: '#FFFFFF',     // card / sheet background
  border: {
    default: '#E5E7EB',
    subtle: '#F3F4F6',
  },
  text: {
    primary: '#111827',
    muted: '#6B7280',
    faint: '#9CA3AF',
  },
  status: {
    green:   { dot: '#15803D', border: '#15803D', bg: '#F0FDF4', text: '#15803D' },
    olive:   { dot: '#414E32', border: '#414E32', bg: '#F8FAE8', text: '#414E32' },
    magenta: { dot: '#8C2D8B', border: '#8C2D8B', bg: '#F5DBEA', text: '#8C2D8B' },
    yellow:  { dot: '#B45309', border: '#D97706', bg: '#FFFBEB', text: '#B45309' },
    orange:  { dot: '#EA580C', border: '#EA580C', bg: '#FFF7ED', text: '#EA580C' },
    gray:    { dot: '#9CA3AF', border: '#E5E7EB', bg: '#F9FAFB', text: '#6B7280' },
  },
} as const;

export const fonts = {
  body: 'var(--font-satoshi, "Satoshi"), sans-serif',
  accent: 'var(--font-newsreader), serif', // "Tatiana" italic accent
} as const;

export const radii = {
  pill: '9999px',
  card: '16px',   // rounded-2xl
  thumb: '12px',  // rounded-xl
  field: '8px',
} as const;

export type Colors = typeof colors;
export type Fonts = typeof fonts;
export type Radii = typeof radii;
