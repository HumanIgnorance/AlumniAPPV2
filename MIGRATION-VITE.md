# Mix -> Vite migration (alumniAPP)

1. Delete: webpack.mix.js, package-lock.json, node_modules, public/js/app.js, public/css/app.css, public/mix-manifest.json
2. FIRST run `bash rename-to-jsx.sh` in your project root (renames 69 JSX files .js -> .jsx).
3. THEN unzip this bundle over your project (same paths). It overwrites the renamed files with the converted ones.
4. `npm install`  (.npmrc sets legacy-peer-deps because react-split-pane@0.1 declares React 16 peer)
5. Dev:   `npm run dev`  (Vite on 127.0.0.1:5173) + `php artisan serve`
   Prod:  `npm run build` -> deploys public/build (commit/ship that folder or build on the server)
6. .env: rename any MIX_* to VITE_*; API base is VITE_API_URL (was REACT_APP_API_URL).

Laravel is still 8.x, which has no native @vite, so app/Support/Vite.php + a Blade
directive in AppServiceProvider provide `@vite(...)`. After upgrading Laravel to 9.19+,
delete both and use the built-in directive plus @viteReactRefresh.
