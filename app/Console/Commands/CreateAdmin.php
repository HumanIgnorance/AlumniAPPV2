<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Creates an administrator account without ever putting a password in
 * source control. The password is typed at a hidden prompt.
 *
 *   php artisan admin:create you@example.com --name="Guidance Counselor"
 */
class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email : Login email for the new admin} {--name=Administrator : Display name}';
    protected $description = 'Create an administrator account (password is asked interactively).';

    public function handle(): int
    {
        $email = strtolower(trim((string) $this->argument('email')));

        $emailCheck = Validator::make(['email' => $email], [
            'email' => 'required|email|max:100|unique:users,email',
        ]);

        if ($emailCheck->fails()) {
            $this->error($emailCheck->errors()->first('email'));
            return self::FAILURE;
        }

        $password = (string) $this->secret('Password (min 12 chars, upper + lower + number)');
        $confirm = (string) $this->secret('Confirm password');

        if ($password !== $confirm) {
            $this->error('Passwords do not match.');
            return self::FAILURE;
        }

        $passwordCheck = Validator::make(['password' => $password], [
            'password' => ['required', 'string', 'min:12', 'max:255', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
        ]);

        if ($passwordCheck->fails()) {
            $this->error($passwordCheck->errors()->first('password'));
            return self::FAILURE;
        }

        // role / status / email_verified_at are not mass-assignable on every
        // setup, so set them explicitly instead of relying on $fillable.
        $user = new User();
        $user->name = mb_substr((string) $this->option('name'), 0, 100);
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->role = 'admin';
        $user->email_verified_at = now();
        $user->save();

        $this->info("Admin created: {$email} (id {$user->id}).");

        return self::SUCCESS;
    }
}
