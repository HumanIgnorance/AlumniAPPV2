<?php

namespace App\Support\Storage;

use Illuminate\Support\Facades\DB;
use League\Flysystem\Adapter\AbstractAdapter;
use League\Flysystem\Config;
use League\Flysystem\Util\MimeType;

/**
 * Flysystem 1.x adapter that keeps file contents in the `stored_files`
 * MySQL table so uploads survive container redeploys.
 *
 * One table serves several Laravel disks; the `disk` column separates them
 * ("public" vs "private"), so the two never see each other's files.
 */
class DatabaseFlysystemAdapter extends AbstractAdapter
{
    protected string $disk;
    protected ?string $baseUrl;
    protected string $table = 'stored_files';

    public function __construct(string $disk, ?string $baseUrl = null)
    {
        $this->disk = $disk;
        $this->baseUrl = $baseUrl;
    }

    protected function q()
    {
        return DB::table($this->table)->where('disk', $this->disk);
    }

    protected function norm(string $path): string
    {
        return trim(str_replace('\\', '/', $path), '/');
    }

    protected function row(string $path, array $columns = ['path', 'size', 'mimetype', 'visibility', 'updated_ts'])
    {
        $path = $this->norm($path);

        return $this->q()->where('path_hash', sha1($path))->first($columns);
    }

    protected function toMeta(object $r): array
    {
        return [
            'type'       => 'file',
            'path'       => $r->path,
            'size'       => (int) $r->size,
            'mimetype'   => $r->mimetype,
            'timestamp'  => (int) $r->updated_ts,
            'visibility' => $r->visibility,
        ];
    }

    protected function put(string $path, string $contents, Config $config): array
    {
        $path = $this->norm($path);
        $now = time();
        $mime = MimeType::detectByContent($contents);
        if (!$mime || $mime === 'text/plain') {
            $mime = MimeType::detectByFileExtension(pathinfo($path, PATHINFO_EXTENSION)) ?: ($mime ?: 'application/octet-stream');
        }
        $visibility = $config->get('visibility') ?: ($this->disk === 'public' ? 'public' : 'private');

        $data = [
            'contents'   => $contents,
            'size'       => strlen($contents),
            'mimetype'   => $mime,
            'visibility' => $visibility,
            'updated_ts' => $now,
            'updated_at' => date('Y-m-d H:i:s', $now),
        ];

        $hash = sha1($path);
        $exists = $this->q()->where('path_hash', $hash)->exists();

        if ($exists) {
            $this->q()->where('path_hash', $hash)->update($data);
        } else {
            DB::table($this->table)->insert($data + [
                'disk'       => $this->disk,
                'path'       => $path,
                'path_hash'  => $hash,
                'created_at' => date('Y-m-d H:i:s', $now),
            ]);
        }

        return [
            'type' => 'file', 'path' => $path, 'size' => $data['size'],
            'mimetype' => $mime, 'timestamp' => $now, 'visibility' => $visibility,
        ];
    }

    public function write($path, $contents, Config $config)
    {
        return $this->put($path, (string) $contents, $config);
    }

    public function writeStream($path, $resource, Config $config)
    {
        return $this->put($path, (string) stream_get_contents($resource), $config);
    }

    public function update($path, $contents, Config $config)
    {
        return $this->put($path, (string) $contents, $config);
    }

    public function updateStream($path, $resource, Config $config)
    {
        return $this->put($path, (string) stream_get_contents($resource), $config);
    }

    public function rename($path, $newpath)
    {
        $r = $this->q()->where('path_hash', sha1($this->norm($path)))->first();
        if (!$r) {
            return false;
        }
        $this->put($newpath, (string) $r->contents, new Config(['visibility' => $r->visibility]));
        $this->delete($path);

        return true;
    }

    public function copy($path, $newpath)
    {
        $r = $this->q()->where('path_hash', sha1($this->norm($path)))->first();
        if (!$r) {
            return false;
        }
        $config = new Config(['visibility' => $r->visibility]);
        $this->put($newpath, (string) $r->contents, $config);

        return true;
    }

    public function delete($path)
    {
        return $this->q()->where('path_hash', sha1($this->norm($path)))->delete() > 0;
    }

    public function deleteDir($dirname)
    {
        $dirname = $this->norm($dirname);
        $like = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $dirname) . '/%';
        $this->q()->where('path', 'like', $like)->delete();

        return true;
    }

    public function createDir($dirname, Config $config)
    {
        // Directories are implicit (derived from file paths).
        return ['type' => 'dir', 'path' => $this->norm($dirname)];
    }

    public function setVisibility($path, $visibility)
    {
        $this->q()->where('path_hash', sha1($this->norm($path)))->update(['visibility' => $visibility]);

        return ['path' => $this->norm($path), 'visibility' => $visibility];
    }

    public function has($path)
    {
        $path = $this->norm($path);
        if ($path === '') {
            return true;
        }
        if ($this->q()->where('path_hash', sha1($path))->exists()) {
            return true;
        }
        // A "directory" exists if any file lives under it.
        $like = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $path) . '/%';

        return $this->q()->where('path', 'like', $like)->exists();
    }

    public function read($path)
    {
        $r = $this->row($path, ['path', 'contents', 'size', 'mimetype', 'visibility', 'updated_ts']);
        if (!$r) {
            return false;
        }

        return $this->toMeta($r) + ['contents' => (string) $r->contents];
    }

    public function readStream($path)
    {
        $result = $this->read($path);
        if ($result === false) {
            return false;
        }
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $result['contents']);
        rewind($stream);
        unset($result['contents']);

        return $result + ['stream' => $stream];
    }

    public function listContents($directory = '', $recursive = false)
    {
        $directory = $this->norm($directory);
        $query = $this->q();
        if ($directory !== '') {
            $like = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $directory) . '/%';
            $query->where('path', 'like', $like);
        }

        $out = [];
        $dirs = [];
        foreach ($query->get(['path', 'size', 'mimetype', 'visibility', 'updated_ts']) as $r) {
            $relative = $directory === '' ? $r->path : substr($r->path, strlen($directory) + 1);
            $parts = explode('/', $relative);

            if (!$recursive && count($parts) > 1) {
                $dir = ltrim($directory . '/' . $parts[0], '/');
                $dirs[$dir] = ['type' => 'dir', 'path' => $dir];
                continue;
            }
            if ($recursive) {
                for ($i = 1; $i < count($parts); $i++) {
                    $dir = ltrim($directory . '/' . implode('/', array_slice($parts, 0, $i)), '/');
                    $dirs[$dir] = ['type' => 'dir', 'path' => $dir];
                }
            }
            $out[] = $this->toMeta($r);
        }

        return array_merge(array_values($dirs), $out);
    }

    public function getMetadata($path)
    {
        $r = $this->row($path);
        if ($r) {
            return $this->toMeta($r);
        }

        return $this->has($path) ? ['type' => 'dir', 'path' => $this->norm($path)] : false;
    }

    public function getSize($path)
    {
        return $this->getMetadata($path);
    }

    public function getMimetype($path)
    {
        return $this->getMetadata($path);
    }

    public function getTimestamp($path)
    {
        return $this->getMetadata($path);
    }

    public function getVisibility($path)
    {
        $r = $this->row($path);

        return $r ? ['path' => $r->path, 'visibility' => $r->visibility] : false;
    }

    /** Used by Storage::url() (Laravel 8 only allows url() when the adapter exposes this). */
    public function getUrl(string $path): string
    {
        $base = $this->baseUrl ?: '/storage';

        return rtrim($base, '/') . '/' . ltrim($this->norm($path), '/');
    }
}
