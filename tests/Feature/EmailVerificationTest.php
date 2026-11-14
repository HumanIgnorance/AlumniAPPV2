<?php

namespace Tests\Feature;

use App\Mail\VerifyEmailMail;
use App\Models\Alumni;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Email verification for self-registered alumni (ported from SCLF).
 * Administrators and department heads are never blocked by it.
 */
class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        (new \Laravel\Passport\ClientRepository())->createPersonalAccessClient(
            null,
            'Test Personal Access Client',
            'http://localhost'
        );
    }

    private function unverifiedAlumnus(string $status = 'pending'): array
    {
        $user = User::factory()->alumni()->create([
            'email_verified_at' => null,
            'password' => bcrypt('correct-password'),
        ]);
        $alumni = Alumni::factory()->create(['user_id' => $user->id, 'email' => $user->email, 'status' => $status]);

        return [$user, $alumni];
    }

    /** Ask for a fresh email and return the plain 6-digit code from it. */
    private function issueCode(User $user): string
    {
        Mail::fake();
        $this->postJson('/api/email/resend', ['email' => $user->email])->assertOk();

        $code = null;
        Mail::assertSent(VerifyEmailMail::class, function ($m) use (&$code) {
            $code = $m->code;
            return true;
        });

        return $code;
    }

    public function test_unverified_alumnus_cannot_sign_in_and_gets_no_cookie(): void
    {
        [$user] = $this->unverifiedAlumnus('approved');

        $res = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'correct-password']);

        $res->assertStatus(403)->assertJson(['code' => 'email_unverified']);
        $this->assertNull($res->getCookie('auth_token'));
    }

    public function test_wrong_password_does_not_reveal_verification_state(): void
    {
        [$user] = $this->unverifiedAlumnus();

        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'nope'])
            ->assertStatus(403)
            ->assertJsonMissing(['code' => 'email_unverified']);
    }

    public function test_pending_alumnus_gets_no_auth_cookie_even_when_verified(): void
    {
        $user = User::factory()->alumni()->create(['password' => bcrypt('correct-password')]);
        Alumni::factory()->create(['user_id' => $user->id, 'email' => $user->email, 'status' => 'pending']);

        $res = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'correct-password']);

        $res->assertStatus(403);
        $this->assertStringContainsString('pending approval', $res->json('message'));
        $this->assertNull($res->getCookie('auth_token'));
    }

    public function test_admin_and_department_head_are_not_blocked_by_verification(): void
    {
        $admin = User::factory()->admin()->create(['email_verified_at' => null, 'password' => bcrypt('correct-password')]);
        $this->postJson('/api/login', ['email' => $admin->email, 'password' => 'correct-password'])->assertOk();

        $head = User::factory()->departmentHead()->create(['email_verified_at' => null, 'password' => bcrypt('correct-password')]);
        $this->postJson('/api/login', ['email' => $head->email, 'password' => 'correct-password'])->assertOk();
    }

    public function test_correct_code_verifies_the_email(): void
    {
        [$user] = $this->unverifiedAlumnus();
        $code = $this->issueCode($user);

        $this->postJson('/api/email/verify-code', ['email' => $user->email, 'code' => $code])
            ->assertOk()->assertJson(['email_verified' => true]);

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_wrong_code_is_rejected_and_unknown_email_looks_identical(): void
    {
        [$user] = $this->unverifiedAlumnus();
        $this->issueCode($user);

        $wrong = $this->postJson('/api/email/verify-code', ['email' => $user->email, 'code' => '000000']);
        $unknown = $this->postJson('/api/email/verify-code', ['email' => 'nobody@example.com', 'code' => '000000']);

        $wrong->assertStatus(422);
        $unknown->assertStatus(422);
        $this->assertSame($wrong->json('message'), $unknown->json('message'));
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_code_locks_after_five_wrong_tries(): void
    {
        [$user] = $this->unverifiedAlumnus();
        $code = $this->issueCode($user);
        $bad = $code === '000000' ? '111111' : '000000';

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/email/verify-code', ['email' => $user->email, 'code' => $bad])->assertStatus(422);
        }

        // The right code no longer works until a new email is requested.
        $this->postJson('/api/email/verify-code', ['email' => $user->email, 'code' => $code])->assertStatus(422);
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_resend_is_enumeration_safe_and_has_a_cooldown(): void
    {
        [$user] = $this->unverifiedAlumnus();
        Mail::fake();

        $known = $this->postJson('/api/email/resend', ['email' => $user->email]);
        $unknown = $this->postJson('/api/email/resend', ['email' => 'nobody@example.com']);
        $again = $this->postJson('/api/email/resend', ['email' => $user->email]);

        $known->assertOk();
        $this->assertSame($known->json(), $unknown->json());
        $again->assertOk();
        Mail::assertSent(VerifyEmailMail::class, 1); // cooldown swallowed the 2nd one
    }

    public function test_signed_link_verifies_and_a_tampered_link_does_not(): void
    {
        [$user] = $this->unverifiedAlumnus();
        $hash = sha1($user->email);

        $url = URL::temporarySignedRoute('verification.verify', now()->addMinutes(60), ['id' => $user->id, 'hash' => $hash]);

        $this->get($url . 'x')->assertRedirect('/login?verify=invalid');
        $this->assertNull($user->fresh()->email_verified_at);

        $this->get($url)->assertRedirect('/login?verify=ok');
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_admin_cannot_approve_an_alumnus_who_has_not_verified_email(): void
    {
        [$user, $alumni] = $this->unverifiedAlumnus();
        Passport::actingAs(User::factory()->admin()->create(), [], 'api');

        $this->postJson('/api/alumni/update-stastus', ['id' => $alumni->id, 'status' => 'approved'])->assertStatus(422);
        $this->assertSame('pending', $alumni->fresh()->status);

        $user->markEmailAsVerified();

        $this->postJson('/api/alumni/update-stastus', ['id' => $alumni->id, 'status' => 'approved'])->assertOk();
        $this->assertSame('approved', $alumni->fresh()->status);
    }

    public function test_existing_users_are_backfilled_as_verified_by_the_migration(): void
    {
        $user = User::factory()->admin()->create(['email_verified_at' => null]);
        $migration = require_once base_path('database/migrations/2026_11_14_000001_backfill_email_verified_at_for_existing_users.php');
        $class = is_object($migration) ? $migration : new \BackfillEmailVerifiedAtForExistingUsers();
        $class->up();

        $this->assertNotNull($user->fresh()->email_verified_at);
    }
}
