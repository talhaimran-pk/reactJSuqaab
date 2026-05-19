// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         gray: {
//           950: '#030712',
//           900: '#111827',
//           800: '#1f2937',
//           700: '#374151',
//         }
//       }
//     },
//   },
//   plugins: [],
// }

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           bg: '#faf9f6',        // warm off-white
//           dark: '#1c1c1c',      // deep charcoal
//           accent: '#c5a880',    // muted editorial tan/gold
//         },
//       },
//       fontFamily: {
//         serif: ['Playfair Display', 'Georgia', 'serif'],
//         sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:     '#faf9f6',
          dark:   '#1c1c1c',
          accent: '#c5a880',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};