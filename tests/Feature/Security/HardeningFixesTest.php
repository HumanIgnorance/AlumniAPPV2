<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Tests for the pre-launch security fixes:
 *  - generic login / reset answers (no account enumeration)
 *  - per-IP login limit
 *  - Passport token lifetime and no /oauth routes
 *  - stronger registration password rule
 *
 * Run: php artisan test --filter=HardeningFixesTest
 */
class HardeningFixesTest extends TestCase
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

    public function test_login_gives_same_answer_for_unknown_email_and_wrong_password(): void
    {
        $user = User::factory()->admin()->create(['password' => bcrypt('correct-password')]);

        $unknown = $this->postJson('/api/login', ['email' => 'nobody@example.test', 'password' => 'whatever1A']);
        $wrong = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong-password']);

        $this->assertSame($unknown->status(), $wrong->status());
        $this->assertSame($unknown->json('message'), $wrong->json('message'));
    }

    public function test_login_rejects_array_input_without_a_server_error(): void
    {
        $response = $this->postJson('/api/login', ['email' => ['a'], 'password' => ['b']]);

        $response->assertStatus(422);
    }

    public function test_find_account_does_not_reveal_names_or_existence(): void
    {
        $real = User::factory()->alumni()->create(['name' => 'Maria Santos']);

        $a = $this->postJson('/api/password/find-account', ['email' => $real->email]);
        $b = $this->postJson('/api/password/find-account', ['email' => 'nobody@example.test']);

        $a->assertOk();
        $b->assertOk();
        $this->assertSame($a->json('success'), $b->json('success'));
        $this->assertStringNotContainsString('Maria', $a->getContent());
        $this->assertNull($a->json('data.full_name'));
    }

    public function test_send_reset_link_is_the_same_for_unknown_email(): void
    {
        $response = $this->postJson('/api/password/send-reset-link', ['email' => 'nobody@example.test']);

        $response->assertOk();
        $this->assertTrue($response->json('success'));
    }

    public function test_one_ip_cannot_spray_many_different_accounts(): void
    {
        $last = null;

        // Different email each time, so only the per-IP limiter (30/min) can stop this.
        for ($i = 0; $i < 31; $i++) {
            $last = $this->postJson('/api/login', [
                'email' => "spray{$i}@example.test",
                'password' => 'Wrong-password1',
            ]);
        }

        $last->assertStatus(429);
    }

    public function test_oauth_routes_are_not_exposed(): void
    {
        $this->post('/oauth/token')->assertStatus(404);
        $this->get('/oauth/authorize')->assertStatus(404);
        $this->get('/oauth/clients')->assertStatus(404);
    }

    public function test_access_tokens_expire_in_about_two_weeks(): void
    {
        $user = User::factory()->admin()->create(['password' => bcrypt('correct-password')]);

        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'correct-password'])->assertOk();

        $expires = DB::table('oauth_access_tokens')->where('user_id', $user->id)->value('expires_at');

        $this->assertNotNull($expires);
        $this->assertTrue(now()->addDays(13)->lt($expires));
        $this->assertTrue(now()->addDays(15)->gt($expires));
    }

    public function test_registration_rejects_a_password_without_upper_case_and_number(): void
    {
        $response = $this->postJson('/api/alumni/register', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'weak@example.test',
            'password' => 'alllowercase',
        ]);

        $response->assertStatus(422);
        $this->assertArrayHasKey('password', $response->json('errors'));
    }
}
