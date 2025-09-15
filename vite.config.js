import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ta linijka jest kluczem do sukcesu!
  base: '/alchemical-forge/', 
})