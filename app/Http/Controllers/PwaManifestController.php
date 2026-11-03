<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PwaManifestController extends Controller
{
    /**
     * Serve the web app manifest dynamically so its theme_color and
     * background_color match the visitor's current black/white theme
     * (read from the same "atms-theme" cookie useAppTheme.js writes).
     *
     * Same structure as the SCLF app's manifest, so both apps install,
     * look and behave the same way on Android, iOS, desktop and ChromeOS.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $theme = $request->cookie('atms-theme', 'white');
        $theme = in_array($theme, ['black', 'white']) ? $theme : 'white';

        $isBlack = $theme === 'black';

        $manifest = [
            'name' => 'ATMS - Opol Community College',
            'short_name' => 'ATMS',
            'description' => 'Opol Community College Alumni Tracing Management System',
            // Scope is the whole site ('/') so login, register and forgot-password
            // stay full-screen inside the installed app (no browser address bar).
            'id' => '/',
            'start_url' => '/',
            'scope' => '/',
            'display' => 'standalone',
            'display_override' => ['standalone', 'minimal-ui'],
            'orientation' => 'any',
            'background_color' => $isBlack ? '#0a0c12' : '#ffffff',
            'theme_color' => $isBlack ? '#0a0c12' : '#ffffff',
            'lang' => 'en-PH',
            'dir' => 'ltr',
            'categories' => ['education', 'productivity'],
            // Lets the browser answer "is this app already installed on this
            // device?" (navigator.getInstalledRelatedApps) so the install banner
            // stays hidden even when the site is opened from a normal tab.
            'related_applications' => [
                ['platform' => 'webapp', 'url' => route('pwa.manifest')],
            ],
            'prefer_related_applications' => false,
            'icons' => [
                // "any": the shield on a transparent background (tabs, taskbar, install dialogs).
                ['src' => asset('images/icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png', 'purpose' => 'any'],
                ['src' => asset('images/icon-512.png'), 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'any'],
                // "maskable": full-bleed navy with the logo inside the safe zone, so Android
                // can crop it to a circle / squircle without clipping the shield.
                ['src' => asset('images/icon-maskable-512.png'), 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'maskable'],
            ],
            // Long-press the home-screen icon (Android) or right-click the taskbar /
            // dock icon (desktop) for these. All inside the scope.
            'shortcuts' => [
                [
                    'name' => 'Sign in',
                    'short_name' => 'Sign in',
                    'description' => 'Sign in to your ATMS account',
                    'url' => '/login',
                    'icons' => [['src' => asset('images/icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png']],
                ],
                [
                    'name' => 'Alumni registration',
                    'short_name' => 'Register',
                    'description' => 'Register as an OCC alumnus',
                    'url' => '/register',
                    'icons' => [['src' => asset('images/icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png']],
                ],
                [
                    'name' => 'Events',
                    'short_name' => 'Events',
                    'description' => 'See upcoming alumni events',
                    'url' => '/events',
                    'icons' => [['src' => asset('images/icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png']],
                ],
                [
                    'name' => 'Announcements',
                    'short_name' => 'News',
                    'description' => 'Read the latest announcements',
                    'url' => '/announcements',
                    'icons' => [['src' => asset('images/icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png']],
                ],
            ],
            // Desktop: opening the app (or a shortcut) while it is already running
            // focuses that window and navigates it, instead of opening a second one.
            'launch_handler' => ['client_mode' => ['navigate-existing', 'auto']],
        ];

        return response()
            ->json($manifest)
            ->header('Content-Type', 'application/manifest+json')
            // The body depends on the "atms-theme" cookie.
            ->header('Vary', 'Cookie')
            ->header('Cache-Control', 'private, max-age=300');
    }
}
