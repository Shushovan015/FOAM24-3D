import { defineConfig } from "vite";

export default defineConfig({
  // plugins: [react()],
  server: {
    host: true,
    port: 5173, // This is the port which we will use in docker
    // Thanks @sergiomoura for the window fix
    // add the next lines if you're using windows and hot reload doesn't work
    watch: {
      usePolling: true,
    },
  },
  build: {
    minify: false,
    sourcemap: true, // Enable source maps for debugging
    rollupOptions: {
      treeshake: {
        moduleSideEffects: ["earcut"], // Preserve earcut during tree-shaking
      },
    },
  },
});
