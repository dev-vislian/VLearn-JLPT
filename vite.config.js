import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'offline' ? './' : '/VLearn-JLPT/',
  build: mode === 'offline' ? { outDir: 'dist-offline' } : {},
  plugins: [react(), tailwindcss()],
}))
