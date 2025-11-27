import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    copy({
      targets: [
        { src: "models", dest: "dist" }, // Copy 'models' to 'dist/models'
      ],
      hook: "writeBundle",
    }),
  ],
  server: {
    host: true,
    port: 5174, // This is the port which we will use in docker
    watch: {
      usePolling: true,
    },
  },
  build: {
    minify: false,
    sourcemap: true, // Enable source maps for debugging
  },
});
