import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/infra/http/server.ts"], // your main entry point
    outDir: 'dist',
    format: ["esm"],
    publicDir: 'src/infra/db/migrations',
    dts: true, // Generate TypeScript declaration files
    splitting: false,
    clean: true,
    sourcemap: true,
    minify: true
});