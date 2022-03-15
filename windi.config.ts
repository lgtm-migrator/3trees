import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  attributify: true,
  extract: {
    include: ['**/*.{tsx,css}'],
    exclude: ['node_modules', '.git', '.next'],
  },
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#2F3437',
        },
      },
    },
  },
})
