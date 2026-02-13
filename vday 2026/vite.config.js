import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // so the app works when opened from a subfolder (e.g. 155hours/vday 2026/)
})
