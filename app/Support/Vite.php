<?php

namespace App\Support;

use Illuminate\Support\HtmlString;
use RuntimeException;

/**
 * Minimal @vite implementation for Laravel 8 (the built-in @vite directive
 * only exists from Laravel 9.19+). Works with laravel-vite-plugin's
 * public/hot file (dev) and public/build/manifest.json (production).
 *
 * Remove this class (and the directive in AppServiceProvider) once you
 * upgrade to Laravel 9.19+ / 10 / 11 and use the native @vite.
 */
class Vite
{
    public function __invoke(string|array $entrypoints, string $buildDirectory = 'build'): HtmlString
    {
        $entrypoints = (array) $entrypoints;
        $hot = public_path('hot');

        // ---- dev server running (npm run dev) ----
        if (is_file($hot)) {
            $url = rtrim(trim(file_get_contents($hot)), '/');
            // React Fast Refresh preamble (what @viteReactRefresh does in Laravel 9.19+)
            $tags = [
                '<script type="module">'
                . "import RefreshRuntime from '" . $url . "/@react-refresh';"
                . 'RefreshRuntime.injectIntoGlobalHook(window);'
                . 'window.$RefreshReg$ = () => {};'
                . 'window.$RefreshSig$ = () => (type) => type;'
                . 'window.__vite_plugin_react_preamble_installed__ = true;'
                . '</script>',
                '<script type="module" src="' . e($url . '/@vite/client') . '"></script>',
            ];
            foreach ($entrypoints as $entry) {
                $tags[] = $this->scriptTag($url . '/' . ltrim($entry, '/'));
            }
            return new HtmlString(implode("\n", $tags));
        }

        // ---- production build ----
        $manifestPath = public_path($buildDirectory . '/manifest.json');
        if (!is_file($manifestPath)) {
            $manifestPath = public_path($buildDirectory . '/.vite/manifest.json');
        }
        if (!is_file($manifestPath)) {
            throw new RuntimeException("Vite manifest not found. Run `npm run build` (looked in public/{$buildDirectory}).");
        }
        $manifest = json_decode(file_get_contents($manifestPath), true);

        $tags = [];
        $seenCss = [];
        foreach ($entrypoints as $entry) {
            if (!isset($manifest[$entry])) {
                throw new RuntimeException("Unable to locate file in Vite manifest: {$entry}.");
            }
            $chunk = $manifest[$entry];

            foreach ($this->collectCss($manifest, $entry) as $css) {
                if (isset($seenCss[$css])) {
                    continue;
                }
                $seenCss[$css] = true;
                $tags[] = '<link rel="stylesheet" href="' . e(asset($buildDirectory . '/' . $css)) . '">';
            }
            $tags[] = $this->scriptTag(asset($buildDirectory . '/' . $chunk['file']));
        }

        return new HtmlString(implode("\n", $tags));
    }

    protected function scriptTag(string $src): string
    {
        return '<script type="module" src="' . e($src) . '"></script>';
    }

    /** CSS of the entry plus CSS of all statically imported chunks. */
    protected function collectCss(array $manifest, string $key, array &$visited = []): array
    {
        if (isset($visited[$key]) || !isset($manifest[$key])) {
            return [];
        }
        $visited[$key] = true;
        $css = $manifest[$key]['css'] ?? [];
        foreach ($manifest[$key]['imports'] ?? [] as $import) {
            $css = array_merge($css, $this->collectCss($manifest, $import, $visited));
        }
        return array_values(array_unique($css));
    }
}
