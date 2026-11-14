<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateStoredFilesTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('stored_files')) {
            return;
        }

        Schema::create('stored_files', function (Blueprint $table) {
            $table->id();
            $table->string('disk', 30);
            $table->text('path');
            $table->char('path_hash', 40);
            $table->binary('contents');
            $table->unsignedBigInteger('size')->default(0);
            $table->string('mimetype', 120)->nullable();
            $table->string('visibility', 10)->default('private');
            $table->unsignedInteger('updated_ts')->default(0);
            $table->timestamps();

            $table->unique(['disk', 'path_hash']);
        });

        // Plain BLOB tops out at 64 KB; photos need LONGBLOB (4 GB).
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE stored_files MODIFY contents LONGBLOB NOT NULL');
        }
    }

    public function down()
    {
        Schema::dropIfExists('stored_files');
    }
}
