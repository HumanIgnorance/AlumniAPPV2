<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Server-side backstop for email verification: an alumni account whose email
 * is not verified cannot use the authenticated API, even with a valid token.
 * (Login already refuses unverified alumni; this keeps the rule true if a token
 * ever exists by another route.)
 *
 * Only self-registered alumni are affected — administrators and department
 * heads are created by an administrator and are never blocked here.
 */
class EnsureEmailVerified
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->mustVerifyEmail() && ! $user->hasVerifiedEmail() && ! $request->is('api/logout')) {
            return response()->json([
                'success' => false,
                'code' => 'email_unverified',
                'message' => 'Please verify your email address to continue.',
            ], 403);
        }

        return $next($request);
    }
}
