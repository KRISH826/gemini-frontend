import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      plugins: [typography],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: process.env.VITE_PORT || 5173,
    strictPort: false,
    allowedHosts: [
      'geminii.up.railway.app',
      '.railway.app',
    ],
  },
});