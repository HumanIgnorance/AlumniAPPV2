<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\EmploymentStatus;
use App\Models\Event;
use App\Models\Gallery;
use App\Observers\AnnouncementObserver;
use App\Observers\CourseObserver;
use App\Observers\EmploymentStatusObserver;
use App\Observers\EventObserver;
use App\Observers\GalleryObserver;
use App\Support\Storage\DatabaseFlysystemAdapter;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\Filesystem;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Don't expose Passport's /oauth/* endpoints; tokens are issued
        // only through AuthController::login().
        Passport::ignoreRoutes();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Guard against a mis-set APP_URL / FRONTEND_URL on the host, e.g. the
        // literal text "${APP_URL}" (host dashboards do not expand variables).
        // Without this, every email link would be built from that broken text.
        // In an HTTP request we fall back to the real domain being visited.
        foreach (['app.url', 'app.frontend_url'] as $key) {
            $value = trim((string) config($key));
            $valid = $value !== '' && ! str_contains($value, '${') && preg_match('#^https?://[^\s]+$#i', $value);

            if (! $valid && ! $this->app->runningInConsole()) {
                config([$key => request()->getSchemeAndHttpHost()]);
            } elseif ($valid) {
                config([$key => rtrim($value, '/')]);
            }
        }

        // 'database' filesystem driver: stores uploads in the stored_files
        // table so they survive redeploys (see config/filesystems.php).
        Storage::extend('database', function ($app, array $config) {
            $adapter = new DatabaseFlysystemAdapter($config['name'] ?? 'default', $config['url'] ?? null);

            return new FilesystemAdapter(new Filesystem($adapter, $config), $adapter, $config);
        });

        // Generated asset()/route() URLs must match the https page that is
        // actually open, otherwise iOS/Android block image downloads as
        // mixed content. Works even if the proxy headers are missing.
        if (
            str_starts_with((string) config('app.url'), 'https://')
            || filter_var(env('FORCE_HTTPS', false), FILTER_VALIDATE_BOOLEAN)
        ) {
            URL::forceScheme('https');
        }

        // Phase 2 caching (audit §3): keeps the public read-endpoint
        // caches (AnnouncementController/EventController/GalleryController/
        // GlobalAluminiController) from serving stale data after an
        // admin creates/edits/deletes the underlying record. See each
        // Observer class for exactly which keys/tags it clears.
        Announcement::observe(AnnouncementObserver::class);
        Event::observe(EventObserver::class);
        Gallery::observe(GalleryObserver::class);
        Course::observe(CourseObserver::class);
        EmploymentStatus::observe(EmploymentStatusObserver::class);
    }
}
