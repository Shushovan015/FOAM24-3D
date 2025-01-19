import { defineConfig } from "vite";

export default defineConfig({
  // plugins: [react()],
  server: {
    host: true,
    port: 5173, // This is the port which we will use in docker
    watch: {
      usePolling: true,
    },
  },
  build: {
    minify: false,
    sourcemap: true, // Enable source maps for debugging
  },
});
