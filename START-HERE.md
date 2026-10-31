# alumniAPP — Vite version (full project, without public/ and vendor/)

Put this folder's contents NEXT TO your existing `public/` folder (it was too big to upload, so it is not included).
If you unzip into your project, nothing in public/ is overwritten.

Delete these old Mix outputs from public/: js/app.js, css/app.css, mix-manifest.json

1. cp .env.example .env   (or keep your existing .env, and rename MIX_* to VITE_*)
2. composer install
3. php artisan key:generate        (only if new .env)
4. php artisan migrate
5. php artisan passport:keys        (only if storage/oauth-*.key are missing) ; php artisan storage:link
6. npm install
7. Dev:  php artisan serve   +   npm run dev
   Prod: npm run build   (creates public/build)
8. php artisan view:clear
