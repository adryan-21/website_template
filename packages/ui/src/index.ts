export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export const shellClass = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
export const sectionShellClass = `${shellClass} py-12 md:py-16 lg:py-20`;

export const surfaceClass =
  'rounded-3xl border border-zinc-900/10 bg-white/70 shadow-sm backdrop-blur-sm';
export const softSurfaceClass =
  'rounded-2xl border border-dashed border-zinc-900/15 bg-white/55 backdrop-blur-sm';
export const eyebrowClass =
  'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500';
export const textLinkClass =
  'text-sm leading-7 text-zinc-600 transition hover:text-zinc-950 focus-visible:text-zinc-950 focus-visible:outline-none';
export const navLinkClass =
  'rounded-xl border border-transparent px-3 py-2 text-sm text-zinc-600 transition hover:border-zinc-900/20 hover:bg-white/80 hover:text-zinc-950 focus-visible:border-zinc-900/30 focus-visible:bg-white focus-visible:text-zinc-950 focus-visible:outline-none';
export const navLinkActiveClass = 'border-zinc-900/20 bg-white/80 text-zinc-950';
export const localeLinkClass =
  'rounded-xl border border-transparent px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 transition hover:border-zinc-900/20 hover:bg-white/80 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10';
export const localeLinkActiveClass = 'border-zinc-900/20 bg-white/80 text-zinc-950';
export const buttonBaseClass =
  'inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10';

export const resolveButtonClass = (variant: ButtonVariant = 'primary'): string => {
  if (variant === 'secondary') {
    return `${buttonBaseClass} border-zinc-900/20 bg-white/70 text-zinc-950 hover:border-zinc-900/30 hover:bg-white`;
  }

  if (variant === 'ghost') {
    return `${buttonBaseClass} border-transparent bg-transparent text-zinc-700 hover:border-zinc-900/15 hover:bg-white/60 hover:text-zinc-950`;
  }

  return `${buttonBaseClass} border-zinc-950 bg-zinc-950 text-stone-50 hover:bg-zinc-800`;
};