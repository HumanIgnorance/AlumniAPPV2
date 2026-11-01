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
        // Pages are lazy-loaded (resources/js/routes/lazyPages.js) and the big
        // libraries below are split into their own long-cached files, so no
        // single file is anywhere near the old 4.4 MB bundle. Only the rive
        // wasm (a binary asset, not JS) is still large; the limit sits just
        // above the biggest JS library chunk (antd, ~1.4 MB) so the warning stays
        // meaningful for everything else.
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Vite's internal helpers (CommonJS interop, dynamic-import preload) are
                    // used by every chunk; park them in the base chunk, otherwise they land
                    // in an arbitrary vendor file and make that file load on every page.
                    if (id.includes("commonjsHelpers") || id.includes("preload-helper") || id.includes("\0vite/")) return "vendor-react";
                    if (!id.includes("node_modules")) return undefined;
                    const pkg = (re) => re.test(id);
                    if (pkg(/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|history|react-is|prop-types|hoist-non-react-statics|object-assign|tiny-invariant|tiny-warning|mini-create-react-context|resolve-pathname|value-equal|path-to-regexp|isarray|@babel[\\/]runtime)[\\/]/)) return "vendor-react";
                    if (pkg(/node_modules[\\/](antd|@ant-design|@ctrl|@rc-component|rc-[^\\/]+|dayjs|classnames|scroll-into-view-if-needed|compute-scroll-into-view|throttle-debounce|lodash|lodash-es)[\\/]/)) return "vendor-antd";
                    if (pkg(/node_modules[\\/](recharts|recharts-scale|victory-vendor|d3-[^\\/]+|internmap|decimal\.js-light|fast-equals|eventemitter3|react-smooth)[\\/]/)) return "vendor-charts";
                    if (pkg(/node_modules[\\/](jspdf|html2canvas|canvg|fflate|svg-pathdata|rgbcolor|stackblur-canvas|text-segmentation|utrie|css-line-break|dompurify)[\\/]/)) return "vendor-pdf";
                    if (pkg(/node_modules[\\/]@rive-app[\\/]/)) return "vendor-rive";
                    if (pkg(/node_modules[\\/]moment[\\/]/)) return "vendor-moment";
                    if (pkg(/node_modules[\\/](react-query|axios|zustand|react-secure-storage|react-beautiful-dnd|@popperjs|bootstrap)[\\/]/)) return "vendor-app";
                    return undefined;
                },
            },
        },
    },
});
