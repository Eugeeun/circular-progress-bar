import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/CircularProgressBar.ts",
      name: "CircularProgressBar",
      fileName: "CircularProgressBar",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    minify: "terser",
  },
});
