import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({
      presets: [
        {
          preset: () => ({
            plugins: [
              ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
            ],
          }),
          // Optimización: Solo ejecuta Babel si el archivo contiene '@'
          rolldown: { filter: { code: '@' } },
        },
      ],
    }),
  ],
})
