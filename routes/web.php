<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PwaManifestController;
use App\Http\Controllers\SpaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::view('/{path?}', 'app');

// Route::any('*', function(){
// 	return view('app');
// });


// Dynamic PWA manifest — must come before the catch-all route below,
// since Route::get('/{path?}', ...) would otherwise swallow
// /manifest.json and return the app.blade.php view instead of JSON.
Route::get('/manifest.json', PwaManifestController::class)->name('pwa.manifest');

// ---------------------------------------------------------------------
// Public file fallback: GET /storage/{path}
//
// Gallery, announcement, event, job-banner and profile images are all
// referenced as /storage/<path> (see Gallery/Announcement models). That URL
// normally works only if `php artisan storage:link` created the
// public/storage symlink. On Windows/XAMPP that link is often missing (it
// needs admin rights, and zip/copy operations drop it), which makes EVERY
// uploaded image 404.
//
// When the symlink exists the web server serves the file itself and this
// route is never hit. When it does not, this route streams the same file
// straight out of storage/app/public so images still display.
// Only the `public` disk is exposed; the `private` disk is untouched.
// ---------------------------------------------------------------------
Route::get('/storage/{path}', function (string $path) {
    $root = realpath(storage_path('app/public'));
    $file = $root ? realpath($root . DIRECTORY_SEPARATOR . $path) : false;

    // Block traversal (../), missing files and anything outside the public disk.
    if (!$file || strpos($file, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($file)) {
        abort(404);
    }

    // Never serve executable/script files, even if one ever lands in storage.
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (in_array($ext, ['php', 'phtml', 'phar', 'html', 'htm', 'js', 'svg'], true)) {
        abort(404);
    }

    return response()->file($file, [
        'Cache-Control' => 'public, max-age=86400',
        'X-Content-Type-Options' => 'nosniff',
    ]);
})->where('path', '.+')->name('storage.fallback');

// Catch-all SPA route — now passes through SpaController so the server
// can inject per-route SEO tags (title/description/canonical) into
// app.blade.php before React takes over on the client.
//
// IMPORTANT: the `path` constraint below EXCLUDES common static-asset
// extensions (images, icons, fonts, css/js, txt/xml/json, etc.).
//
// Why this matters: normally a physical file in /public (e.g.
// public/images/site-logo.png) is served directly by the web server
// and never reaches this route at all. But if that file is EVER
// missing — wrong build path, asset not deployed, typo — the old
// `->where('path', '.*')` constraint matched literally everything,
// so the request fell through to this catch-all and SpaController
// happily returned a 200 OK with the full HTML app page instead of a
// 404. Browsers and crawlers (including Googlebot fetching your
// favicon/OG image) would receive text/html where they expected an
// image, and silently fail — which is exactly what caused the missing
// logo/favicon in Google search results and social link previews.
//
// With this constraint, a request for a missing static file now
// correctly 404s instead of being masked as a successful HTML page,
// so broken asset paths fail loudly (in server logs / dev tools)
// instead of silently breaking favicons, OG previews, and SEO.
Route::get('/{path?}', [SpaController::class, 'index'])
    ->where('path', '^(?!.*\.(?:ico|png|jpe?g|gif|webp|svg|css|js|map|txt|xml|json|webmanifest|woff2?|ttf|eot|pdf)$).*$');