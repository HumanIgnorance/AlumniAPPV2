<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Email verification is now enforced for self-registered alumni.
 *
 * Every account that exists today must keep working exactly as before:
 *  - the seeded administrator (its row was inserted without email_verified_at),
 *  - department heads (created by the admin), and
 *  - alumni who registered before verification existed (they were stamped
 *    verified at registration, but any NULL is filled here for safety).
 *
 * Only accounts created AFTER this migration start out unverified.
 */
class BackfillEmailVerifiedAtForExistingUsers extends Migration
{
    public function up()
    {
        DB::table('users')
            ->whereNull('email_verified_at')
            ->update(['email_verified_at' => DB::raw('COALESCE(created_at, CURRENT_TIMESTAMP)')]);
    }

    public function down()
    {
        // Intentionally empty: we cannot know which rows were NULL before.
    }
}
