// // src/theme/index.js
// // ─────────────────────────────────────────────
// // PREMIUM SMART HOME DESIGN SYSTEM
// // Warm cream + Pure white + Deep charcoal + Muted gold
// // Heavy rounding, soft shadows, geometric sans-serif
// // ─────────────────────────────────────────────

// export const theme = {

//   // ── COLORS ──────────────────────────────────
//   colors: {
//     bg: '#faf9f6',           // Warm creamy off-white (app base)
//     surface: '#ffffff',       // Pure white (cards, sidebar)
//     dark: '#1c1c1c',         // Deep charcoal (text, dark cards)
//     accent: '#c5a880',       // Muted gold (buttons, highlights)
//     border: '#e6e3db',       // Light grayish-tan (borders)
//     mutedText: '#6b7280',    // Gray 500
//     mutedLight: '#9ca3af',   // Gray 400
//   },

//   // ── PAGE ────────────────────────────────────
//   page: {
//     wrapper: 'min-h-screen bg-[#faf9f6] text-[#1c1c1c] font-sans',
//     centered: 'min-h-screen bg-[#faf9f6] text-[#1c1c1c] font-sans flex items-center justify-center',
//     canvas: 'min-h-screen bg-[#faf9f6] p-8',
//     inner: 'max-w-7xl mx-auto',
//   },

//   // ── TYPOGRAPHY ──────────────────────────────
//   type: {
//     display: 'font-sans text-5xl font-black tracking-tight text-[#1c1c1c]',
//     h1:      'font-sans text-4xl font-black tracking-tight text-[#1c1c1c]',
//     h2:      'font-sans text-3xl font-extrabold tracking-tight text-[#1c1c1c]',
//     h3:      'font-sans text-xl font-bold tracking-tight text-[#1c1c1c]',
//     h4:      'font-sans text-lg font-bold text-[#1c1c1c]',
//     label:   'font-sans text-[10px] font-bold uppercase tracking-widest text-gray-500',
//     labelSm: 'font-sans text-xs font-bold uppercase tracking-widest text-gray-400',
//     body:    'font-sans text-base font-medium text-gray-500',
//     bodySm:  'font-sans text-sm font-medium text-gray-500',
//     stat:    'font-sans text-5xl font-black tracking-tight text-[#1c1c1c]',
//     error:   'font-sans text-sm font-semibold text-red-500',
//     link:    'font-sans text-[#c5a880] hover:text-[#1c1c1c] underline-offset-2 transition-colors font-semibold',
//     white:   'font-sans text-base font-medium text-white',
//   },

//   // ── BUTTONS ─────────────────────────────────
//   button: {
//     // Gold accent — primary CTA
//     primary:
//       'bg-[#c5a880] text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'hover:bg-[#b8976e] active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-[0_4px_14px_rgba(197,168,128,0.35)] ' +
//       'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     // Dark charcoal — strong action
//     dark:
//       'bg-[#1c1c1c] text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'hover:bg-[#333333] active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-[0_4px_14px_rgba(28,28,28,0.20)] ' +
//       'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     // White outlined — secondary
//     secondary:
//       'bg-white text-[#1c1c1c] px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'border border-[#e6e3db] hover:border-[#1c1c1c] active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     // Ghost gold border
//     ghost:
//       'bg-transparent text-[#c5a880] px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'border border-[#c5a880] hover:bg-[#c5a880] hover:text-white active:scale-[0.98] transition-all duration-200 ' +
//       'flex items-center justify-center gap-2',

//     // Danger
//     danger:
//       'bg-red-500 text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'hover:bg-red-600 active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-[0_4px_14px_rgba(239,68,68,0.25)] ' +
//       'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     // Full width modifier
//     full: 'w-full',

//     // Icon button
//     icon:
//       'p-2.5 rounded-full hover:bg-[#e6e3db] active:scale-95 transition-all duration-200 text-[#1c1c1c]',

//     // Small variant
//     sm: 'px-4 py-2 text-xs',
//   },

//   // ── INPUTS ──────────────────────────────────
//   input: {
//     base:
//       'w-full bg-white border border-[#e6e3db] rounded-full py-3.5 px-6 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm',

//     withIcon:
//       'w-full bg-white border border-[#e6e3db] rounded-full py-3.5 pl-12 pr-6 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm',

//     withIconRight:
//       'w-full bg-white border border-[#e6e3db] rounded-full py-3.5 pl-12 pr-12 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm',

//     // Textarea / multi-line (uses rounded-[1.5rem] instead of full)
//     textarea:
//       'w-full bg-white border border-[#e6e3db] rounded-[1.5rem] py-4 px-6 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm resize-none',

//     iconLeft:  'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400',
//     iconRight: 'absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-[#1c1c1c] transition-colors',
//     wrapper:   'relative',

//     error:
//       'w-full bg-white border border-red-400 rounded-full py-3.5 px-6 ' +
//       'text-[#1c1c1c] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ' +
//       'font-sans text-sm shadow-sm',

//     label: 'block font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 pl-1',
//   },

//   // ── CARDS ───────────────────────────────────
//   card: {
//     // Standard white surface card
//     base:   'bg-white border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm',
//     sm:     'bg-white border border-[#e6e3db] rounded-[1.5rem] p-4 shadow-sm',
//     lg:     'bg-white border border-[#e6e3db] rounded-[2.5rem] p-8 shadow-sm',

//     // Dark charcoal card
//     dark:   'bg-[#1c1c1c] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(28,28,28,0.15)]',

//     // Gold accent card
//     accent: 'bg-[#c5a880] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(197,168,128,0.30)]',

//     // Flat warm background (no border)
//     flat:   'bg-[#faf9f6] rounded-[2rem] p-6',

//     // Flat on surface (slightly tinted)
//     muted:  'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4',

//     // Interactive / clickable card
//     interactive:
//       'bg-white border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm ' +
//       'hover:shadow-md hover:border-[#c5a880]/40 cursor-pointer transition-all duration-200 active:scale-[0.99]',
//   },

//   // ── SIDEBAR ─────────────────────────────────
//   sidebar: {
//     wrapper: 'w-64 h-screen bg-white border-r border-[#e6e3db] flex flex-col shadow-sm',
//     item:
//       'flex items-center gap-3 px-4 py-3 rounded-full font-sans text-sm font-semibold ' +
//       'text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c] transition-all duration-200',
//     itemActive:
//       'flex items-center gap-3 px-4 py-3 rounded-full font-sans text-sm font-semibold ' +
//       'text-white bg-[#1c1c1c] shadow-[0_4px_14px_rgba(28,28,28,0.20)]',
//     icon:   'w-5 h-5',
//     badge:
//       'ml-auto bg-[#c5a880] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
//     section: 'px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400',
//   },

//   // ── HEADER ──────────────────────────────────
//   header: {
//     wrapper:
//       'h-16 border-b border-[#e6e3db] bg-white flex items-center justify-between px-6 shadow-sm',
//     title: 'font-sans text-xl font-black tracking-tight text-[#1c1c1c]',
//     search:
//       'w-80 bg-[#faf9f6] border border-[#e6e3db] rounded-full py-2.5 px-5 pl-10 ' +
//       'font-sans text-sm text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 focus:border-[#c5a880] transition-all',
//     avatar:
//       'w-9 h-9 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center ' +
//       'font-sans text-sm font-black shadow-[0_2px_8px_rgba(28,28,28,0.20)]',
//   },

//   // ── BADGES ──────────────────────────────────
//   badge: {
//     accent:
//       'inline-flex items-center gap-1 px-3 py-1 bg-[#c5a880] text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     dark:
//       'inline-flex items-center gap-1 px-3 py-1 bg-[#1c1c1c] text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     outline:
//       'inline-flex items-center gap-1 px-3 py-1 border border-[#e6e3db] text-[#1c1c1c] ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     success:
//       'inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     danger:
//       'inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     live:
//       'inline-flex items-center gap-1.5 px-3 py-1 bg-[#c5a880] text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest ' +
//       'shadow-[0_2px_8px_rgba(197,168,128,0.40)]',
//   },

//   // ── ALERTS ──────────────────────────────────
//   alert: {
//     error:
//       'p-4 border border-red-200 bg-red-50 text-red-600 text-sm font-semibold rounded-[1.5rem] font-sans flex items-center gap-3',
//     success:
//       'p-4 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-[1.5rem] font-sans flex items-center gap-3',
//     info:
//       'p-4 border border-[#e6e3db] bg-[#faf9f6] text-[#1c1c1c] text-sm font-semibold rounded-[1.5rem] font-sans flex items-center gap-3',
//     warning:
//       'p-4 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold rounded-[1.5rem] font-sans flex items-center gap-3',
//   },

//   // ── DIVIDERS ────────────────────────────────
//   divider: {
//     gold: 'h-px w-12 bg-[#c5a880]',
//     full: 'h-px w-full bg-[#e6e3db]',
//     dark: 'h-px w-full bg-[#1c1c1c]/10',
//     vertical: 'w-px h-full bg-[#e6e3db]',
//   },

//   // ── OVERLAYS ────────────────────────────────
//   overlay: {
//     dark:   'absolute inset-0 bg-[#1c1c1c]/70 flex items-center justify-center rounded-[2.5rem]',
//     light:  'absolute inset-0 bg-white/70 backdrop-blur flex items-center justify-center rounded-[2.5rem]',
//     accent: 'absolute inset-0 bg-[#c5a880]/30 flex items-center justify-center rounded-[2.5rem]',
//   },

//   // ── STAT CARDS (Dashboard) ──────────────────
//   stat: {
//     wrapper: 'bg-white border border-[#e6e3db] rounded-[1.5rem] p-5 shadow-sm',
//     label:   'font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1',
//     value:   'font-sans text-3xl font-black tracking-tight text-[#1c1c1c]',
//     sub:     'font-sans text-xs font-medium text-gray-400 mt-1',
//     icon:    'w-10 h-10 rounded-[0.875rem] flex items-center justify-center flex-shrink-0',
//   },

//   // ── MEDIA / CAMERA FEEDS ────────────────────
//   media: {
//     feed:
//       'relative overflow-hidden rounded-[2rem] bg-[#1c1c1c] border border-[#e6e3db] ' +
//       'shadow-sm grayscale opacity-75 hover:opacity-90 hover:grayscale-0 transition-all duration-300',
//     feedLarge:
//       'relative overflow-hidden rounded-[2.5rem] bg-[#1c1c1c] border border-[#e6e3db] shadow-sm',
//     placeholder:
//       'w-full h-full flex flex-col items-center justify-center bg-[#faf9f6] ' +
//       'text-gray-400 rounded-[2rem]',
//   },

//   // ── FORMS ───────────────────────────────────
//   form: {
//     group:  'space-y-1.5',
//     row:    'grid grid-cols-2 gap-4',
//     section: 'space-y-5',
//   },

//   // ── NAVIGATION (mobile bottom bar) ──────────
//   nav: {
//     wrapper:
//       'fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#e6e3db] ' +
//       'flex items-center justify-around px-4 shadow-[0_-2px_12px_rgba(28,28,28,0.06)]',
//     item:       'flex flex-col items-center gap-0.5 text-gray-400 hover:text-[#1c1c1c] transition-colors',
//     itemActive: 'flex flex-col items-center gap-0.5 text-[#c5a880]',
//     label:      'text-[9px] font-bold uppercase tracking-wider',
//   },
// };
// src/theme/index.js
// ─────────────────────────────────────────────
// PREMIUM SMART HOME DESIGN SYSTEM
// Single source of truth — all values here
// ─────────────────────────────────────────────

// export const colors = {
//   bg:         '#faf9f6',
//   surface:    '#ffffff',
//   dark:       '#1c1c1c',
//   accent:     '#c5a880',
//   border:     '#e6e3db',
//   mutedText:  '#6b7280',
//   mutedLight: '#9ca3af',
// };

// // ── Tailwind-safe class maps (use these everywhere) ──
// export const theme = {

//   // ── COLORS ──────────────────────────────────
//   colors,

//   // ── PAGE ────────────────────────────────────
//   page: {
//     wrapper:  'min-h-screen bg-[#faf9f6] text-[#1c1c1c] font-sans',
//     centered: 'min-h-screen bg-[#faf9f6] text-[#1c1c1c] font-sans flex items-center justify-center',
//     canvas:   'min-h-screen bg-[#faf9f6] p-8',
//     inner:    'max-w-7xl mx-auto',
//     dark:     'min-h-screen bg-[#1c1c1c] text-white font-sans',
//   },

//   // ── TYPOGRAPHY ──────────────────────────────
//   type: {
//     display: 'font-sans text-5xl font-black tracking-tight text-[#1c1c1c]',
//     h1:      'font-sans text-4xl font-black tracking-tight text-[#1c1c1c]',
//     h2:      'font-sans text-3xl font-extrabold tracking-tight text-[#1c1c1c]',
//     h3:      'font-sans text-xl font-bold tracking-tight text-[#1c1c1c]',
//     h4:      'font-sans text-lg font-bold text-[#1c1c1c]',
//     label:   'font-sans text-[10px] font-bold uppercase tracking-widest text-gray-500',
//     labelSm: 'font-sans text-xs font-bold uppercase tracking-widest text-gray-400',
//     body:    'font-sans text-base font-medium text-gray-500',
//     bodySm:  'font-sans text-sm font-medium text-gray-500',
//     stat:    'font-sans text-5xl font-black tracking-tight text-[#1c1c1c]',
//     error:   'font-sans text-sm font-semibold text-red-500',
//     link:    'font-sans text-[#c5a880] hover:text-[#1c1c1c] underline-offset-2 transition-colors font-semibold',
//     white:   'font-sans text-base font-medium text-white',
//     // Dark page variants
//     whiteH1:    'font-sans text-4xl font-black tracking-tight text-white',
//     whiteMuted: 'font-sans text-sm font-medium text-gray-400',
//   },

//   // ── BUTTONS ─────────────────────────────────
//   button: {
//     primary:
//       'bg-[#c5a880] text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'hover:bg-[#b8976e] active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-[0_4px_14px_rgba(197,168,128,0.35)] ' +
//       'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     dark:
//       'bg-[#1c1c1c] text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'hover:bg-[#333333] active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-[0_4px_14px_rgba(28,28,28,0.20)] ' +
//       'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     secondary:
//       'bg-white text-[#1c1c1c] px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'border border-[#e6e3db] hover:border-[#1c1c1c] active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     ghost:
//       'bg-transparent text-[#c5a880] px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'border border-[#c5a880] hover:bg-[#c5a880] hover:text-white active:scale-[0.98] transition-all duration-200 ' +
//       'flex items-center justify-center gap-2',

//     danger:
//       'bg-red-500 text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
//       'hover:bg-red-600 active:scale-[0.98] transition-all duration-200 ' +
//       'shadow-[0_4px_14px_rgba(239,68,68,0.25)] ' +
//       'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

//     full: 'w-full',
//     sm:   'px-4 py-2 text-xs',

//     icon:
//       'p-2.5 rounded-full hover:bg-[#e6e3db] active:scale-95 transition-all duration-200 text-[#1c1c1c]',

//     iconDark:
//       'p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-200 text-gray-300',

//     // Shared disabled modifier
//     disabled: 'disabled:opacity-40 disabled:cursor-not-allowed',
//   },

//   // ── INPUTS ──────────────────────────────────
//   input: {
//     base:
//       'w-full bg-white border border-[#e6e3db] rounded-full py-3.5 px-6 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm',

//     withIcon:
//       'w-full bg-white border border-[#e6e3db] rounded-full py-3.5 pl-12 pr-6 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm',

//     withIconRight:
//       'w-full bg-white border border-[#e6e3db] rounded-full py-3.5 pl-12 pr-12 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm',

//     textarea:
//       'w-full bg-white border border-[#e6e3db] rounded-[1.5rem] py-4 px-6 ' +
//       'text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
//       'transition-all font-sans text-sm shadow-sm resize-none',

//     error:
//       'w-full bg-white border border-red-400 rounded-full py-3.5 px-6 ' +
//       'text-[#1c1c1c] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ' +
//       'font-sans text-sm shadow-sm',

//     iconLeft:  'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400',
//     iconRight:
//       'absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ' +
//       'cursor-pointer hover:text-[#1c1c1c] transition-colors',
//     wrapper: 'relative',
//     label:   'block font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 pl-1',
//   },

//   // // ── CARDS ───────────────────────────────────
//   // card: {
//   //   base:   'bg-white border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm',
//   //   sm:     'bg-white border border-[#e6e3db] rounded-[1.5rem] p-4 shadow-sm',
//   //   lg:     'bg-white border border-[#e6e3db] rounded-[2.5rem] p-8 shadow-sm',
//   //   dark:   'bg-[#1c1c1c] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(28,28,28,0.15)]',
//   //   accent: 'bg-[#c5a880] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(197,168,128,0.30)]',
//   //   flat:   'bg-[#faf9f6] rounded-[2rem] p-6',
//   //   muted:  'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4',
//   //   interactive:
//   //     'bg-white border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm ' +
//   //     'hover:shadow-md hover:border-[#c5a880]/40 cursor-pointer transition-all duration-200 active:scale-[0.99]',
//   // },
//    // ── CARDS ───────────────────────────────────
//   card: {
//     // Base and variants updated to beige (#faf9f6) to match image_3c8c6d.png
//     base:   'bg-[#faf9f6] border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm',
//     sm:     'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4 shadow-sm',
//     lg:     'bg-[#faf9f6] border border-[#e6e3db] rounded-[2.5rem] p-8 shadow-sm',
    
//     // Interactive card now uses the beige background by default
//     interactive:
//       'bg-[#faf9f6] border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm ' +
//       'hover:shadow-md hover:border-[#c5a880]/40 cursor-pointer transition-all duration-200 active:scale-[0.99]',

//     dark:   'bg-[#1c1c1c] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(28,28,28,0.15)]',
//     accent: 'bg-[#c5a880] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(197,168,128,0.30)]',
//     flat:   'bg-[#faf9f6] rounded-[2rem] p-6',
//     muted:  'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4',
//   },

//   // ── HEADER ──────────────────────────────────
//   header: {
//     // Changed bg-white to bg-[#faf9f6] (beige/light brown)
//     wrapper:
//       'h-16 border-b border-[#e6e3db] bg-[#faf9f6] flex items-center justify-between px-6 shadow-sm',
//     title:  'font-sans text-xl font-black tracking-tight text-[#1c1c1c]',
//     search:
//       'w-80 bg-white border border-[#e6e3db] rounded-full py-2.5 px-5 pl-10 ' +
//       'font-sans text-sm text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 focus:border-[#c5a880] transition-all',
//     avatar:
//       'w-9 h-9 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center ' +
//       'font-sans text-sm font-black shadow-[0_2px_8px_rgba(28,28,28,0.20)]',
//   },

//   // ── STAT CARDS (Dashboard) ──────────────────
//   stat: {
//     // Updated to match the beige aesthetic
//     wrapper: 'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-5 shadow-sm',
//     label:   'font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1',
//     value:   'font-sans text-3xl font-black tracking-tight text-[#1c1c1c]',
//     sub:     'font-sans text-xs font-medium text-gray-400 mt-1',
//     icon:    'w-10 h-10 rounded-[0.875rem] flex items-center justify-center flex-shrink-0',
//     interactive:
//       'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4 text-center ' +
//       'cursor-pointer hover:shadow-md hover:border-[#c5a880]/40 transition-all duration-200',
//   },

//   // ── SIDEBAR ─────────────────────────────────
//   sidebar: {
//     wrapper:    'w-64 h-screen bg-white border-r border-[#e6e3db] flex flex-col shadow-sm',
//     item:
//       'flex items-center gap-3 px-4 py-3 rounded-full font-sans text-sm font-semibold ' +
//       'text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c] transition-all duration-200',
//     itemActive:
//       'flex items-center gap-3 px-4 py-3 rounded-full font-sans text-sm font-semibold ' +
//       'text-white bg-[#1c1c1c] shadow-[0_4px_14px_rgba(28,28,28,0.20)]',
//     icon:    'w-5 h-5',
//     badge:
//       'ml-auto bg-[#c5a880] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
//     section: 'px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400',
//   },

//   // ── HEADER ──────────────────────────────────
//   header: {
//     wrapper:
//       'h-16 border-b border-[#e6e3db] bg-white flex items-center justify-between px-6 shadow-sm',
//     title:  'font-sans text-xl font-black tracking-tight text-[#1c1c1c]',
//     search:
//       'w-80 bg-[#faf9f6] border border-[#e6e3db] rounded-full py-2.5 px-5 pl-10 ' +
//       'font-sans text-sm text-[#1c1c1c] placeholder:text-gray-400 ' +
//       'focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 focus:border-[#c5a880] transition-all',
//     avatar:
//       'w-9 h-9 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center ' +
//       'font-sans text-sm font-black shadow-[0_2px_8px_rgba(28,28,28,0.20)]',
//   },

//   // ── BADGES ──────────────────────────────────
//   badge: {
//     accent:
//       'inline-flex items-center gap-1 px-3 py-1 bg-[#c5a880] text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     dark:
//       'inline-flex items-center gap-1 px-3 py-1 bg-[#1c1c1c] text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     outline:
//       'inline-flex items-center gap-1 px-3 py-1 border border-[#e6e3db] text-[#1c1c1c] ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     success:
//       'inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     danger:
//       'inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest',
//     live:
//       'inline-flex items-center gap-1.5 px-3 py-1 bg-[#c5a880] text-white ' +
//       'text-[10px] font-bold rounded-full uppercase tracking-widest ' +
//       'shadow-[0_2px_8px_rgba(197,168,128,0.40)]',
//   },

//   // ── ALERTS ──────────────────────────────────
//   alert: {
//     error:
//       'p-4 border border-red-200 bg-red-50 text-red-600 text-sm font-semibold ' +
//       'rounded-[1.5rem] font-sans flex items-center gap-3',
//     success:
//       'p-4 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold ' +
//       'rounded-[1.5rem] font-sans flex items-center gap-3',
//     info:
//       'p-4 border border-[#e6e3db] bg-[#faf9f6] text-[#1c1c1c] text-sm font-semibold ' +
//       'rounded-[1.5rem] font-sans flex items-center gap-3',
//     warning:
//       'p-4 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold ' +
//       'rounded-[1.5rem] font-sans flex items-center gap-3',
//     // Inline banner (used on dashboard)
//     banner:
//       'flex items-center gap-3 px-5 py-3 rounded-full font-sans text-sm font-bold ' +
//       'cursor-pointer transition-all',
//     bannerDanger:
//       'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.30)] hover:bg-red-600',
//   },

//   // ── DIVIDERS ────────────────────────────────
//   divider: {
//     gold:     'h-px w-12 bg-[#c5a880]',
//     goldSm:   'h-px w-8 bg-[#c5a880]',
//     full:     'h-px w-full bg-[#e6e3db]',
//     dark:     'h-px w-full bg-[#1c1c1c]/10',
//     vertical: 'w-px h-full bg-[#e6e3db]',
//   },

//   // ── OVERLAYS ────────────────────────────────
//   overlay: {
//     dark:   'absolute inset-0 bg-[#1c1c1c]/70 flex items-center justify-center rounded-[2.5rem]',
//     light:  'absolute inset-0 bg-white/70 backdrop-blur flex items-center justify-center rounded-[2.5rem]',
//     accent: 'absolute inset-0 bg-[#c5a880]/30 flex items-center justify-center rounded-[2.5rem]',
//   },

//   // ── MEDIA / CAMERA FEEDS ────────────────────
//   media: {
//     feed:
//       'relative overflow-hidden rounded-[2rem] bg-[#1c1c1c] border border-[#e6e3db] ' +
//       'shadow-sm grayscale opacity-75 hover:opacity-90 hover:grayscale-0 transition-all duration-300',
//     feedLarge:
//       'relative overflow-hidden rounded-[2.5rem] bg-[#1c1c1c] border border-[#e6e3db] shadow-sm',
//     placeholder:
//       'w-full h-full flex flex-col items-center justify-center bg-[#faf9f6] ' +
//       'text-gray-400 rounded-[2rem]',
//     videoWrap:  'relative w-full aspect-video bg-[#0a0a0a]',
//     overlay:    'absolute inset-0 flex flex-col items-center justify-center text-gray-500',
//   },

//   // ── FORMS ───────────────────────────────────
//   form: {
//     group:   'space-y-1.5',
//     row:     'grid grid-cols-2 gap-4',
//     section: 'space-y-5',
//   },

//   // ── NAVIGATION (mobile bottom bar) ──────────
//   nav: {
//     wrapper:
//       'fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#e6e3db] ' +
//       'flex items-center justify-around px-4 shadow-[0_-2px_12px_rgba(28,28,28,0.06)]',
//     item:       'flex flex-col items-center gap-0.5 text-gray-400 hover:text-[#1c1c1c] transition-colors',
//     itemActive: 'flex flex-col items-center gap-0.5 text-[#c5a880]',
//     label:      'text-[9px] font-bold uppercase tracking-wider',
//   },

//   // ── SHARED UI ATOMS ─────────────────────────
//   ui: {
//     // Back button (light page)
//     backBtn:
//       'p-2 rounded-full hover:bg-[#faf9f6] border border-[#e6e3db] ' +
//       'text-gray-400 hover:text-[#1c1c1c] transition-all',
//     // Back button (dark page)
//     backBtnDark:
//       'text-gray-300 p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors',
//     // Refresh / icon action button
//     refreshBtn:
//       'p-2 rounded-full bg-[#faf9f6] border border-[#e6e3db] hover:border-[#c5a880] ' +
//       'text-gray-400 hover:text-[#1c1c1c] transition-all',
//     // FAB
//     fab:
//       'fixed bottom-6 right-6 w-14 h-14 bg-[#1c1c1c] hover:bg-[#c5a880] text-white ' +
//       'rounded-full flex items-center justify-center ' +
//       'shadow-[0_4px_20px_rgba(28,28,28,0.25)] hover:shadow-[0_4px_20px_rgba(197,168,128,0.35)] ' +
//       'transition-all duration-200 active:scale-95',
//     // Alert dot badge
//     alertDot:
//       'w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black ' +
//       'flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(239,68,68,0.4)]',
//     // Icon box (menu item prefix)
//     iconBox:
//       'w-10 h-10 rounded-[0.875rem] bg-[#faf9f6] border border-[#e6e3db] flex items-center justify-center',
//     iconBoxDanger:
//       'w-10 h-10 rounded-[0.875rem] bg-red-100 flex items-center justify-center',
//     // Gold divider line (brand / splash)
//     goldLine:   'h-px w-10 bg-[#c5a880]',
//     goldLineSm: 'h-px w-8 bg-[#c5a880]',
//     // Spinner
//     spinner:    'w-10 h-10 rounded-full border-4 border-[#e6e3db] border-t-[#c5a880] animate-spin',
//   },
// };

export const colors = {
  bg:         '#faf9f6',
  surface:    '#faf9f6',
  dark:       '#1c1c1c',
  accent:     '#c5a880',
  border:     '#e6e3db',
  mutedText:  '#6b7280',
  mutedLight: '#9ca3af',
};

// ── Tailwind-safe class maps (use these everywhere) ──
export const theme = {

  // ── COLORS ──────────────────────────────────
  colors,

  // ── PAGE ────────────────────────────────────
  page: {
    wrapper:  'min-h-screen bg-[#E8E3D9] text-[#1c1c1c] font-sans',
    centered: 'min-h-screen bg-[#E8E3D9] text-[#1c1c1c] font-sans flex items-center justify-center',
    canvas:   'min-h-screen bg-[#E8E3D9] p-8',
    inner:    'max-w-7xl mx-auto',
    dark:     'min-h-screen bg-[#1c1c1c] text-white font-sans',
  },

  // ── TYPOGRAPHY ──────────────────────────────
  type: {
    display: 'font-sans text-5xl font-black tracking-tight text-[#1c1c1c]',
    h1:      'font-sans text-4xl font-black tracking-tight text-[#1c1c1c]',
    h2:      'font-sans text-3xl font-extrabold tracking-tight text-[#1c1c1c]',
    h3:      'font-sans text-xl font-bold tracking-tight text-[#1c1c1c]',
    h4:      'font-sans text-lg font-bold text-[#1c1c1c]',
    label:   'font-sans text-[10px] font-bold uppercase tracking-widest text-gray-500',
    labelSm: 'font-sans text-xs font-bold uppercase tracking-widest text-gray-400',
    body:    'font-sans text-base font-medium text-gray-500',
    bodySm:  'font-sans text-sm font-medium text-gray-500',
    stat:    'font-sans text-5xl font-black tracking-tight text-[#1c1c1c]',
    error:   'font-sans text-sm font-semibold text-red-500',
    link:    'font-sans text-[#c5a880] hover:text-[#1c1c1c] underline-offset-2 transition-colors font-semibold',
    white:   'font-sans text-base font-medium text-white',
    whiteH1:    'font-sans text-4xl font-black tracking-tight text-white',
    whiteMuted: 'font-sans text-sm font-medium text-gray-400',
  },

  // ── BUTTONS ─────────────────────────────────
  button: {
    primary:
      'bg-[#c5a880] text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
      'hover:bg-[#b8976e] active:scale-[0.98] transition-all duration-200 ' +
      'shadow-[0_4px_14px_rgba(197,168,128,0.35)] ' +
      'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

    dark:
      'bg-[#1c1c1c] text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
      'hover:bg-[#333333] active:scale-[0.98] transition-all duration-200 ' +
      'shadow-[0_4px_14px_rgba(28,28,28,0.20)] ' +
      'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

    secondary:
      'bg-[#faf9f6] text-[#1c1c1c] px-7 py-3 font-sans font-bold text-sm rounded-full ' +
      'border border-[#e6e3db] hover:border-[#1c1c1c] active:scale-[0.98] transition-all duration-200 ' +
      'shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

    ghost:
      'bg-transparent text-[#c5a880] px-7 py-3 font-sans font-bold text-sm rounded-full ' +
      'border border-[#c5a880] hover:bg-[#c5a880] hover:text-white active:scale-[0.98] transition-all duration-200 ' +
      'flex items-center justify-center gap-2',

    danger:
      'bg-red-500 text-white px-7 py-3 font-sans font-bold text-sm rounded-full ' +
      'hover:bg-red-600 active:scale-[0.98] transition-all duration-200 ' +
      'shadow-[0_4px_14px_rgba(239,68,68,0.25)] ' +
      'disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2',

    full: 'w-full',
    sm:   'px-4 py-2 text-xs',

    icon:
      'p-2.5 rounded-full hover:bg-[#e6e3db] active:scale-95 transition-all duration-200 text-[#1c1c1c]',

    iconDark:
      'p-2 rounded-full hover:bg-[#faf9f6]/10 active:scale-95 transition-all duration-200 text-gray-300',

    disabled: 'disabled:opacity-40 disabled:cursor-not-allowed',
  },

  // ── INPUTS ──────────────────────────────────
  input: {
    base:
      'w-full bg-[#faf9f6] border border-[#e6e3db] rounded-full py-3.5 px-6 ' +
      'text-[#1c1c1c] placeholder:text-gray-400 ' +
      'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
      'transition-all font-sans text-sm shadow-sm',

    withIcon:
      'w-full bg-[#faf9f6] border border-[#e6e3db] rounded-full py-3.5 pl-12 pr-6 ' +
      'text-[#1c1c1c] placeholder:text-gray-400 ' +
      'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
      'transition-all font-sans text-sm shadow-sm',

    withIconRight:
      'w-full bg-[#faf9f6] border border-[#e6e3db] rounded-full py-3.5 pl-12 pr-12 ' +
      'text-[#1c1c1c] placeholder:text-gray-400 ' +
      'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
      'transition-all font-sans text-sm shadow-sm',

    textarea:
      'w-full bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] py-4 px-6 ' +
      'text-[#1c1c1c] placeholder:text-gray-400 ' +
      'focus:outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20 ' +
      'transition-all font-sans text-sm shadow-sm resize-none',

    error:
      'w-full bg-[#faf9f6] border border-red-400 rounded-full py-3.5 px-6 ' +
      'text-[#1c1c1c] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ' +
      'font-sans text-sm shadow-sm',

    iconLeft:  'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400',
    iconRight:
      'absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ' +
      'cursor-pointer hover:text-[#1c1c1c] transition-colors',
    wrapper: 'relative',
    label:   'block font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 pl-1',
  },

  // ── CARDS ───────────────────────────────────
  card: {
    base:   'bg-[#faf9f6] border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm',
    sm:     'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4 shadow-sm',
    lg:     'bg-[#faf9f6] border border-[#e6e3db] rounded-[2.5rem] p-8 shadow-sm',
    interactive:
      'bg-[#faf9f6] border border-[#e6e3db] rounded-[2rem] p-6 shadow-sm ' +
      'hover:shadow-md hover:border-[#c5a880]/40 cursor-pointer transition-all duration-200 active:scale-[0.99]',
    dark:   'bg-[#1c1c1c] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(28,28,28,0.15)]',
    accent: 'bg-[#c5a880] text-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(197,168,128,0.30)]',
    flat:   'bg-[#faf9f6] rounded-[2rem] p-6',
    muted:  'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4',
  },

  // ── HEADER ──────────────────────────────────
  // Single definition — bg-[#faf9f6] (brown/beige), no white
  header: {
    wrapper:
      'h-16 border-b border-[#e6e3db] bg-[#faf9f6] flex items-center justify-between px-6 shadow-sm',
    title:  'font-sans text-xl font-black tracking-tight text-[#1c1c1c]',
    search:
      'w-80 bg-[#f0ede8] border border-[#e6e3db] rounded-full py-2.5 px-5 pl-10 ' +
      'font-sans text-sm text-[#1c1c1c] placeholder:text-gray-400 ' +
      'focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 focus:border-[#c5a880] transition-all',
    avatar:
      'w-9 h-9 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center ' +
      'font-sans text-sm font-black shadow-[0_2px_8px_rgba(28,28,28,0.20)]',
  },

  // ── STAT CARDS (Dashboard) ──────────────────
  stat: {
    wrapper: 'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-5 shadow-sm',
    label:   'font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1',
    value:   'font-sans text-3xl font-black tracking-tight text-[#1c1c1c]',
    sub:     'font-sans text-xs font-medium text-gray-400 mt-1',
    icon:    'w-10 h-10 rounded-[0.875rem] flex items-center justify-center flex-shrink-0',
    interactive:
      'bg-[#faf9f6] border border-[#e6e3db] rounded-[1.5rem] p-4 text-center ' +
      'cursor-pointer hover:shadow-md hover:border-[#c5a880]/40 transition-all duration-200',
  },

  // ── SIDEBAR ─────────────────────────────────
  sidebar: {
    wrapper:    'w-64 h-screen bg-[#faf9f6] border-r border-[#e6e3db] flex flex-col shadow-sm',
    item:
      'flex items-center gap-3 px-4 py-3 rounded-full font-sans text-sm font-semibold ' +
      'text-gray-500 hover:bg-[#f0ede8] hover:text-[#1c1c1c] transition-all duration-200',
    itemActive:
      'flex items-center gap-3 px-4 py-3 rounded-full font-sans text-sm font-semibold ' +
      'text-white bg-[#1c1c1c] shadow-[0_4px_14px_rgba(28,28,28,0.20)]',
    icon:    'w-5 h-5',
    badge:
      'ml-auto bg-[#c5a880] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
    section: 'px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400',
  },

  // ── BADGES ──────────────────────────────────
  badge: {
    accent:
      'inline-flex items-center gap-1 px-3 py-1 bg-[#c5a880] text-white ' +
      'text-[10px] font-bold rounded-full uppercase tracking-widest',
    dark:
      'inline-flex items-center gap-1 px-3 py-1 bg-[#1c1c1c] text-white ' +
      'text-[10px] font-bold rounded-full uppercase tracking-widest',
    outline:
      'inline-flex items-center gap-1 px-3 py-1 border border-[#e6e3db] text-[#1c1c1c] ' +
      'text-[10px] font-bold rounded-full uppercase tracking-widest',
    success:
      'inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white ' +
      'text-[10px] font-bold rounded-full uppercase tracking-widest',
    danger:
      'inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white ' +
      'text-[10px] font-bold rounded-full uppercase tracking-widest',
    live:
      'inline-flex items-center gap-1.5 px-3 py-1 bg-[#c5a880] text-white ' +
      'text-[10px] font-bold rounded-full uppercase tracking-widest ' +
      'shadow-[0_2px_8px_rgba(197,168,128,0.40)]',
  },

  // ── ALERTS ──────────────────────────────────
  alert: {
    error:
      'p-4 border border-red-200 bg-red-50 text-red-600 text-sm font-semibold ' +
      'rounded-[1.5rem] font-sans flex items-center gap-3',
    success:
      'p-4 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold ' +
      'rounded-[1.5rem] font-sans flex items-center gap-3',
    info:
      'p-4 border border-[#e6e3db] bg-[#faf9f6] text-[#1c1c1c] text-sm font-semibold ' +
      'rounded-[1.5rem] font-sans flex items-center gap-3',
    warning:
      'p-4 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold ' +
      'rounded-[1.5rem] font-sans flex items-center gap-3',
    banner:
      'flex items-center gap-3 px-5 py-3 rounded-full font-sans text-sm font-bold ' +
      'cursor-pointer transition-all',
    bannerDanger:
      'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.30)] hover:bg-red-600',
  },

  // ── DIVIDERS ────────────────────────────────
  divider: {
    gold:     'h-px w-12 bg-[#c5a880]',
    goldSm:   'h-px w-8 bg-[#c5a880]',
    full:     'h-px w-full bg-[#e6e3db]',
    dark:     'h-px w-full bg-[#1c1c1c]/10',
    vertical: 'w-px h-full bg-[#e6e3db]',
  },

  // ── OVERLAYS ────────────────────────────────
  overlay: {
    dark:   'absolute inset-0 bg-[#1c1c1c]/70 flex items-center justify-center rounded-[2.5rem]',
    light:  'absolute inset-0 bg-[#faf9f6]/70 backdrop-blur flex items-center justify-center rounded-[2.5rem]',
    accent: 'absolute inset-0 bg-[#c5a880]/30 flex items-center justify-center rounded-[2.5rem]',
  },

  // ── MEDIA / CAMERA FEEDS ────────────────────
  media: {
    feed:
      'relative overflow-hidden rounded-[2rem] bg-[#1c1c1c] border border-[#e6e3db] ' +
      'shadow-sm grayscale opacity-75 hover:opacity-90 hover:grayscale-0 transition-all duration-300',
    feedLarge:
      'relative overflow-hidden rounded-[2.5rem] bg-[#1c1c1c] border border-[#e6e3db] shadow-sm',
    placeholder:
      'w-full h-full flex flex-col items-center justify-center bg-[#faf9f6] ' +
      'text-gray-400 rounded-[2rem]',
    videoWrap:  'relative w-full aspect-video bg-[#0a0a0a]',
    overlay:    'absolute inset-0 flex flex-col items-center justify-center text-gray-500',
  },

  // ── FORMS ───────────────────────────────────
  form: {
    group:   'space-y-1.5',
    row:     'grid grid-cols-2 gap-4',
    section: 'space-y-5',
  },

  // ── NAVIGATION (mobile bottom bar) ──────────
  nav: {
    wrapper:
      'fixed bottom-0 left-0 right-0 h-16 bg-[#faf9f6] border-t border-[#e6e3db] ' +
      'flex items-center justify-around px-4 shadow-[0_-2px_12px_rgba(28,28,28,0.06)]',
    item:       'flex flex-col items-center gap-0.5 text-gray-400 hover:text-[#1c1c1c] transition-colors',
    itemActive: 'flex flex-col items-center gap-0.5 text-[#c5a880]',
    label:      'text-[9px] font-bold uppercase tracking-wider',
  },

  // ── SHARED UI ATOMS ─────────────────────────
  ui: {
    backBtn:
      'p-2 rounded-full hover:bg-[#e6e3db] border border-[#e6e3db] ' +
      'text-gray-400 hover:text-[#1c1c1c] transition-all',
    backBtnDark:
      'text-gray-300 p-2 -ml-2 rounded-full hover:bg-[#faf9f6]/10 transition-colors',
    refreshBtn:
      'p-2 rounded-full bg-[#faf9f6] border border-[#e6e3db] hover:border-[#c5a880] ' +
      'text-gray-400 hover:text-[#1c1c1c] transition-all',
    fab:
      'fixed bottom-6 right-6 w-14 h-14 bg-[#1c1c1c] hover:bg-[#c5a880] text-white ' +
      'rounded-full flex items-center justify-center ' +
      'shadow-[0_4px_20px_rgba(28,28,28,0.25)] hover:shadow-[0_4px_20px_rgba(197,168,128,0.35)] ' +
      'transition-all duration-200 active:scale-95',
    alertDot:
      'w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black ' +
      'flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(239,68,68,0.4)]',
    iconBox:
      'w-10 h-10 rounded-[0.875rem] bg-[#faf9f6] border border-[#e6e3db] flex items-center justify-center',
    iconBoxDanger:
      'w-10 h-10 rounded-[0.875rem] bg-red-100 flex items-center justify-center',
    goldLine:   'h-px w-10 bg-[#c5a880]',
    goldLineSm: 'h-px w-8 bg-[#c5a880]',
    spinner:    'w-10 h-10 rounded-full border-4 border-[#e6e3db] border-t-[#c5a880] animate-spin',
  },
};