<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Written in plain text by the browser (useAppTheme.js) and read by
        // resources/views/app.blade.php so the very first paint already uses
        // the visitor's theme. If Laravel tries to decrypt it, decryption
        // fails and the cookie is silently dropped, which made the server
        // render the light theme on every full page load (e.g. after logout).
        'atms-theme',
    ];
}
