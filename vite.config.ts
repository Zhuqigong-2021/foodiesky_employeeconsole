/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",

    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
  server: {
    // Configure Vite to serve the tests directory
    // This allows the tests to import the setupTests.js file
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    fs: {
      strict: false,
      allow: [".", "../*", "../test/*"],
    },
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    // port: 8080, // you can replace this port with any port
  },
});
