import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Served from https://<user>.github.io/react-learning-app/ in production,
  // but still from the root during local dev — keeps `npm run dev` URLs
  // unchanged while making the production build work under a subpath.
  base: command === 'build' ? '/react-learning-app/' : '/',
  plugins: [react()],
}))
