<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\Auth\EmailVerificationCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

/**
 * Email verification for self-registered alumni (ported from the SCLF app).
 *
 * Unlike SCLF, a freshly registered alumnus CANNOT sign in until the
 * administrator approves the account, so every endpoint here is public and
 * identifies the account by email address. Two rules keep that safe:
 *   - responses never reveal whether an email address is registered, and
 *   - every endpoint is throttled (see RouteServiceProvider 'email-verification').
 */
class EmailVerificationController extends Controller
{
    /** Seconds before another email may be sent to the same address. */
    private const RESEND_COOLDOWN_SECONDS = 60;

    public function __construct(protected EmailVerificationCodeService $codes)
    {
    }

    /**
     * Link in the email: GET /email/verify/{id}/{hash} (signed, expiring).
     * Works without being signed in (people open email on their phone but
     * registered on a laptop). Always ends in a redirect to the login page
     * with a status flag, so a stale or tampered link shows a friendly note.
     */
    public function verify(Request $request, int $id, string $hash)
    {
        if (! URL::hasValidSignature($request)) {
            return redirect('/login?verify=invalid');
        }

        $user = User::find($id);

        if (! $user || ! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return redirect('/login?verify=invalid');
        }

        $this->markVerified($user, 'link');

        return redirect('/login?verify=ok');
    }

    /** Verify with the 6-digit code typed inside the app (no browser hop). */
    public function verifyCode(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'code' => ['required', 'digits:6'],
        ]);

        $user = User::where('email', $data['email'])->first();

        // Unknown address, or an account that never needs verification:
        // answer exactly like a wrong code.
        if (! $user || ! $user->mustVerifyEmail()) {
            return $this->failure(EmailVerificationCodeService::INVALID);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['success' => true, 'message' => 'Your email is already verified.', 'email_verified' => true]);
        }

        $result = $this->codes->check($user, (string) $data['code']);

        if ($result !== EmailVerificationCodeService::OK) {
            return $this->failure($result);
        }

        $this->markVerified($user, 'code');

        return response()->json(['success' => true, 'message' => 'Your email is verified.', 'email_verified' => true]);
    }

    /**
     * Send (or re-send) the verification email. Always answers the same way,
     * so it cannot be used to discover which addresses are registered.
     */
    public function resend(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email', 'max:255']]);

        $user = User::where('email', $data['email'])->first();

        if ($user && $user->mustVerifyEmail() && ! $user->hasVerifiedEmail()) {
            // Per-address cooldown on top of the IP throttle: stops anyone
            // from mail-bombing a victim's inbox from many IPs.
            $cooldownKey = 'email-verify-resend:' . $user->id;
            if (Cache::add($cooldownKey, 1, self::RESEND_COOLDOWN_SECONDS)) {
                self::send($user);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'If that address is waiting to be verified, a new email is on its way. The code and link expire in 60 minutes.',
        ]);
    }

    /**
     * Send the email without ever failing the caller: if the mail server is
     * down registration must still succeed and the person can press "Resend".
     */
    public static function send(User $user): bool
    {
        try {
            $user->sendEmailVerificationNotification();

            return true;
        } catch (\Throwable $e) {
            Log::warning('Could not send verification email', ['user_id' => $user->id, 'error' => $e->getMessage()]);

            return false;
        }
    }

    private function markVerified(User $user, string $via): void
    {
        if ($user->hasVerifiedEmail()) {
            return;
        }

        $user->markEmailAsVerified();

        try {
            AuditLog::record([
                'user_id' => $user->id,
                'alumni_id' => optional($user->alumni)->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'course_code' => null,
                'action' => 'email_verified',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'occurred_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Could not write email-verified audit entry (' . $via . '): ' . $e->getMessage());
        }
    }

    private function failure(string $result)
    {
        $messages = [
            EmailVerificationCodeService::INVALID => 'That code is not correct. Please check it and try again.',
            EmailVerificationCodeService::EXPIRED => 'That code has expired. Press "Resend email" to get a new one.',
            EmailVerificationCodeService::LOCKED => 'Too many wrong attempts. Press "Resend email" to get a new code.',
        ];

        return response()->json([
            'success' => false,
            'message' => $messages[$result] ?? $messages[EmailVerificationCodeService::INVALID],
            'email_verified' => false,
        ], 422);
    }
}
