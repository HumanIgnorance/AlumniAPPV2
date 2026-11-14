<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'course_id',
        'last_active_at',
        'is_online',
        'notification_preferences',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_active_at' => 'datetime',
        'is_online' => 'boolean',
        'notification_preferences' => 'array',
    ];

    /**
     * Default preference values used whenever a user has never saved
     * their own (fresh accounts, or accounts created before this
     * column existed) — every channel defaults to ON so behavior for
     * existing users doesn't silently change until they actively opt out.
     */
    public const DEFAULT_NOTIFICATION_PREFERENCES = [
        'email_notifications' => true,
        'sound_enabled' => false,
        'push_notifications' => true,
    ];

    /**
     * Saved preferences merged over the defaults, so adding a new
     * preference key later doesn't require a data migration for every
     * existing user row — missing keys just fall back to their default.
     */
    public function getNotificationPreference(string $key): bool
    {
        $saved = $this->notification_preferences ?? [];
        return array_key_exists($key, $saved)
            ? (bool) $saved[$key]
            : (self::DEFAULT_NOTIFICATION_PREFERENCES[$key] ?? true);
    }

    public function wantsEmailNotifications(): bool
    {
        return $this->getNotificationPreference('email_notifications');
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['online_status'];

    public function alumni()
    {
        return $this->hasOne(Alumni::class, 'user_id');
    }

    /**
     * Email verification applies to self-registered alumni only.
     * Administrators and department heads are created by an administrator,
     * so they are treated as verified (and their rows are stamped verified
     * when created / by the backfill migration).
     */
    public function mustVerifyEmail(): bool
    {
        return $this->role === 'alumni';
    }

    /**
     * Override the framework default so the email carries our own template,
     * the signed link AND the 6-digit code (see EmailVerificationCodeService).
     * Called by EmailVerificationController::send().
     */
    public function sendEmailVerificationNotification()
    {
        $code = app(\App\Services\Auth\EmailVerificationCodeService::class)->issue($this);

        $url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(\App\Services\Auth\EmailVerificationCodeService::TTL_MINUTES),
            ['id' => $this->getKey(), 'hash' => sha1($this->getEmailForVerification())]
        );

        \Illuminate\Support\Facades\Mail::send(
            new \App\Mail\VerifyEmailMail($this->name ?: 'Alumnus', $url, $this->email, $code)
        );
    }

    public function alumniQuizzes()
    {
        return $this->hasMany(AlumniQuizzes::class, 'user_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Update user's last active timestamp
     */
    public function updateLastActive()
    {
        $this->update([
            'last_active_at' => Carbon::now(),
            'is_online' => true,
        ]);
    }

    /**
     * Set user as offline
     */
    public function setOffline()
    {
        $this->update([
            'is_online' => false,
        ]);
    }

    /**
     * Get online status accessor
     * User is considered online if active within last 5 minutes
     */
    public function getOnlineStatusAttribute()
    {
        if (!$this->last_active_at) {
            return false;
        }

        return $this->is_online && Carbon::parse($this->last_active_at)->diffInMinutes(Carbon::now()) < 1;
    }
}
