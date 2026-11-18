<?php

namespace App\Support\Storage;

use Illuminate\Support\Facades\DB;
use League\Flysystem\Config;
use League\Flysystem\DirectoryAttributes;
use League\Flysystem\FileAttributes;
use League\Flysystem\FilesystemAdapter;
use League\Flysystem\UnableToCopyFile;
use League\Flysystem\UnableToMoveFile;
use League\Flysystem\UnableToReadFile;
use League\Flysystem\UnableToRetrieveMetadata;
use League\Flysystem\Visibility;
use League\MimeTypeDetection\FinfoMimeTypeDetector;

/**
 * Flysystem 3.x adapter that keeps file contents in the `stored_files`
 * MySQL table so uploads survive container redeploys.
 *
 * One table serves several Laravel disks; the `disk` column separates them
 * ("public" vs "private"), so the two never see each other's files.
 *
 * Table layout is unchanged from the Flysystem 1.x version, so existing
 * rows keep working after the Laravel upgrade.
 */
class DatabaseFlysystemAdapter implements FilesystemAdapter
{
    protected string $disk;
    protected ?string $baseUrl;
    protected string $table = 'stored_files';
    protected FinfoMimeTypeDetector $mimes;

    public function __construct(string $disk, ?string $baseUrl = null)
    {
        $this->disk = $disk;
        $this->baseUrl = $baseUrl;
        $this->mimes = new FinfoMimeTypeDetector();
    }

    protected function q()
    {
        return DB::table($this->table)->where('disk', $this->disk);
    }

    protected function norm(string $path): string
    {
        return trim(str_replace('\\', '/', $path), '/');
    }

    protected function like(string $dir): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $dir) . '/%';
    }

    protected function row(string $path, array $columns = ['path', 'size', 'mimetype', 'visibility', 'updated_ts'])
    {
        return $this->q()->where('path_hash', sha1($this->norm($path)))->first($columns);
    }

    protected function toAttributes(object $r): FileAttributes
    {
        return new FileAttributes(
            $r->path,
            (int) $r->size,
            $r->visibility,
            (int) $r->updated_ts,
            $r->mimetype
        );
    }

    protected function put(string $path, string $contents, Config $config): void
    {
        $path = $this->norm($path);
        $now = time();
        $mime = $this->mimes->detectMimeType($path, $contents) ?: 'application/octet-stream';
        $visibility = $config->get('visibility') ?: ($this->disk === 'public' ? Visibility::PUBLIC : Visibility::PRIVATE);

        $data = [
            'contents'   => $contents,
            'size'       => strlen($contents),
            'mimetype'   => $mime,
            'visibility' => $visibility,
            'updated_ts' => $now,
            'updated_at' => date('Y-m-d H:i:s', $now),
        ];

        $hash = sha1($path);

        if ($this->q()->where('path_hash', $hash)->exists()) {
            $this->q()->where('path_hash', $hash)->update($data);
        } else {
            DB::table($this->table)->insert($data + [
                'disk'       => $this->disk,
                'path'       => $path,
                'path_hash'  => $hash,
                'created_at' => date('Y-m-d H:i:s', $now),
            ]);
        }
    }

    public function fileExists(string $path): bool
    {
        return $this->q()->where('path_hash', sha1($this->norm($path)))->exists();
    }

    public function directoryExists(string $path): bool
    {
        $path = $this->norm($path);
        if ($path === '') {
            return true;
        }

        return $this->q()->where('path', 'like', $this->like($path))->exists();
    }

    public function write(string $path, string $contents, Config $config): void
    {
        $this->put($path, $contents, $config);
    }

    public function writeStream(string $path, $contents, Config $config): void
    {
        $this->put($path, (string) stream_get_contents($contents), $config);
    }

    public function read(string $path): string
    {
        $r = $this->row($path, ['contents']);
        if (!$r) {
            throw UnableToReadFile::fromLocation($path, 'File not found.');
        }

        return (string) $r->contents;
    }

    public function readStream(string $path)
    {
        $contents = $this->read($path);
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $contents);
        rewind($stream);

        return $stream;
    }

    public function delete(string $path): void
    {
        $this->q()->where('path_hash', sha1($this->norm($path)))->delete();
    }

    public function deleteDirectory(string $path): void
    {
        $path = $this->norm($path);
        if ($path === '') {
            return;
        }
        $this->q()->where('path', 'like', $this->like($path))->delete();
    }

    public function createDirectory(string $path, Config $config): void
    {
        // Directories are implicit (derived from file paths).
    }

    public function setVisibility(string $path, string $visibility): void
    {
        $this->q()->where('path_hash', sha1($this->norm($path)))->update(['visibility' => $visibility]);
    }

    public function visibility(string $path): FileAttributes
    {
        $r = $this->row($path);
        if (!$r) {
            throw UnableToRetrieveMetadata::visibility($path, 'File not found.');
        }

        return $this->toAttributes($r);
    }

    public function mimeType(string $path): FileAttributes
    {
        $r = $this->row($path);
        if (!$r) {
            throw UnableToRetrieveMetadata::mimeType($path, 'File not found.');
        }

        return $this->toAttributes($r);
    }

    public function lastModified(string $path): FileAttributes
    {
        $r = $this->row($path);
        if (!$r) {
            throw UnableToRetrieveMetadata::lastModified($path, 'File not found.');
        }

        return $this->toAttributes($r);
    }

    public function fileSize(string $path): FileAttributes
    {
        $r = $this->row($path);
        if (!$r) {
            throw UnableToRetrieveMetadata::fileSize($path, 'File not found.');
        }

        return $this->toAttributes($r);
    }

    public function listContents(string $path, bool $deep): iterable
    {
        $directory = $this->norm($path);
        $query = $this->q();
        if ($directory !== '') {
            $query->where('path', 'like', $this->like($directory));
        }

        $dirs = [];
        $files = [];
        foreach ($query->get(['path', 'size', 'mimetype', 'visibility', 'updated_ts']) as $r) {
            $relative = $directory === '' ? $r->path : substr($r->path, strlen($directory) + 1);
            $parts = explode('/', $relative);

            if (!$deep && count($parts) > 1) {
                $dir = ltrim($directory . '/' . $parts[0], '/');
                $dirs[$dir] = new DirectoryAttributes($dir);
                continue;
            }
            if ($deep) {
                for ($i = 1; $i < count($parts); $i++) {
                    $dir = ltrim($directory . '/' . implode('/', array_slice($parts, 0, $i)), '/');
                    $dirs[$dir] = new DirectoryAttributes($dir);
                }
            }
            $files[] = $this->toAttributes($r);
        }

        yield from array_values($dirs);
        yield from $files;
    }

    public function move(string $source, string $destination, Config $config): void
    {
        $r = $this->q()->where('path_hash', sha1($this->norm($source)))->first();
        if (!$r) {
            throw UnableToMoveFile::fromLocationTo($source, $destination);
        }
        $this->put($destination, (string) $r->contents, new Config(['visibility' => $r->visibility]));
        $this->delete($source);
    }

    public function copy(string $source, string $destination, Config $config): void
    {
        $r = $this->q()->where('path_hash', sha1($this->norm($source)))->first();
        if (!$r) {
            throw UnableToCopyFile::fromLocationTo($source, $destination);
        }
        $this->put($destination, (string) $r->contents, new Config(['visibility' => $r->visibility]));
    }

    /** Used by Storage::url(). */
    public function getUrl(string $path): string
    {
        $base = $this->baseUrl ?: '/storage';

        return rtrim($base, '/') . '/' . ltrim($this->norm($path), '/');
    }
}
