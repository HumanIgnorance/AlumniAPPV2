<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Adds browser-enforced hardening headers to every response.
 *
 * HTTP -> HTTPS redirection is NOT handled here; see ForceHttps (opt-in via
 * FORCE_HTTPS) because TLS termination varies too much between deployments.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // HSTS is only meaningful (and only safe) over a real HTTPS connection.
        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=15768000; includeSubDomains');
        }

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
        );
        // Older browsers only understand X-Frame-Options; frame-ancestors in the CSP is the modern equivalent.
        $response->headers->set('X-Frame-Options', 'DENY');

        $headerName = filter_var(env('CSP_REPORT_ONLY', true), FILTER_VALIDATE_BOOLEAN)
            ? 'Content-Security-Policy-Report-Only'
            : 'Content-Security-Policy';
        $response->headers->set($headerName, $this->contentSecurityPolicy());

        return $response;
    }

    private function contentSecurityPolicy(): string
    {
        $script = ["'self'", "'wasm-unsafe-eval'"]; // wasm-unsafe-eval: Rive animations load a WebAssembly runtime
        // 'unsafe-inline' on style-src: Ant Design injects <style> tags / style="" attributes at runtime.
        $style = ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'];
        $font = ["'self'", 'https://fonts.gstatic.com'];
        $img = ["'self'", 'data:', 'blob:'];
        // Weather widget (open-meteo) and Cloudflare analytics beacon injected by the host.
        $connect = ["'self'", 'https://api.open-meteo.com', 'https://cloudflareinsights.com'];
        $script[] = 'https://static.cloudflareinsights.com';

        // Local dev only: the Vite dev server serves modules/assets from its own origin,
        // pushes HMR over a websocket, and the React Refresh preamble is an inline script.
        if ($vite = $this->viteDevOrigin()) {
            $ws = preg_replace('#^http#', 'ws', $vite);
            $script[] = $vite;
            $script[] = "'unsafe-inline'";
            $style[] = $vite;
            $font[] = $vite;
            $img[] = $vite;
            $connect[] = $vite;
            $connect[] = $ws;
        }

        return implode('; ', [
            "default-src 'self'",
            'script-src ' . implode(' ', $script),
            'style-src ' . implode(' ', $style),
            'font-src ' . implode(' ', $font),
            'img-src ' . implode(' ', $img),
            'connect-src ' . implode(' ', $connect),
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
        ]);
    }

    /** Origin of the running Vite dev server (from public/hot), or null outside local development. */
    private function viteDevOrigin(): ?string
    {
        if (app()->isProduction() || !is_file($hot = public_path('hot'))) {
            return null;
        }

        $parts = parse_url(trim((string) file_get_contents($hot)));
        if (empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        return $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
    }
}
