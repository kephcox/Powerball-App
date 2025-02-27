import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Powerball-App/'  // Add this line to match your GitHub repo name
});
