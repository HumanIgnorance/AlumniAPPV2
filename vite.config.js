import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.js"],
            refresh: ["resources/views/**"],
        }),
        react(),
    ],
    resolve: {
        alias: {
            // same "~" alias that webpack.mix.js provided
            "~": path.resolve(__dirname, "resources/js"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // bootstrap 5.1 / old @import syntax still emits deprecation noise on modern sass
                quietDeps: true,
                silenceDeprecations: ["import", "global-builtin", "color-functions", "legacy-js-api"],
            },
        },
    },
    // replaces the file-loader rule for audio in webpack.mix.js
    assetsInclude: ["**/*.mp3", "**/*.wav", "**/*.m4a", "**/*.ogg"],
    server: {
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
        hmr: { host: "127.0.0.1" },
    },
    build: {
        chunkSizeWarningLimit: 2500,
    },
});
