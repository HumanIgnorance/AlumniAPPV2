<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Value for an `error` field in a JSON failure response. The real
     * exception text (SQL, file paths...) is logged server-side and only
     * returned to the client when APP_DEBUG is true.
     */
    protected function safeError(\Throwable $e): ?string
    {
        Log::error(static::class . ': ' . $e->getMessage(), [
            'file' => $e->getFile() . ':' . $e->getLine(),
        ]);

        return config('app.debug') ? $e->getMessage() : null;
    }

    /**
     * Suffix for "Failed to X" style messages: ": <details>" in debug,
     * nothing in production (details are logged instead).
     */
    protected function debugDetail(\Throwable $e): string
    {
        $detail = $this->safeError($e);

        return $detail === null ? '' : ': ' . $detail;
    }
}
