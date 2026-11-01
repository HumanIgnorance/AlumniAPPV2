# ATMS fixes — change log

Not built or run in the environment where these edits were made (no node_modules / network).
After copying over your project: `npm run build` (or `npm run dev`), then hard-refresh.

## 1. Dark-mode / white loading screen
- `app/Http/Middleware/EncryptCookies.php`: `atms-theme` exempted. It is written as plain text by JS;
  Laravel dropped it, so the server rendered LIGHT on every full page load (e.g. after logout).
- `resources/views/app.blade.php`: themed inline first-paint background + boot spinner (CSP-safe: no inline script).
- `resources/css/tokens.css`: ONE semantic token layer (light + `html[data-theme="black"]`), loaded eagerly,
  plus themed `.app-page-fallback` / `.app-boot`.
- `resources/js/Main.jsx`: themed Suspense fallback; antd `ConfigProvider` follows the theme
  (new `config/antdTheme.js`, `SEMANTIC` in `config/theme.js`).
- `assets/scss/_global.scss`: forced light colors (`#535353 !important` text, `#f4f7fe` body, white sider/header) now use tokens.

## 2. Shared theme tokens
- 11 files re-declared the same ~30 variables (with drift). Removed; they inherit from `tokens.css`.
- Unified: --radius-xl 26px; FAQ accent sky -> indigo; About/Gallery bg/text/dark palette -> canonical; antd primary -> `--accent`.
- `css/page-theme-toggle.css`: shared theme-toggle styles (registration copy removed).
- Fixed dead selectors `[data-theme="dark"]` -> `black` (JobPost modals).

## 3. Department head dashboard image
- `components/shared/AlumniAvatar.jsx`, `utils/assetUrl.js` (same-origin rewrite + initials fallback).
- `AlumniPolicy`: `(int)` course comparison. Dashboard modal filter: `Number()` comparison.

## 4. Registration
- Names allow accents/hyphens/apostrophes/periods; email-slug strips accents.
- Upload progress no longer flickers / destroys other toasts; no stacked duplicate error toasts.
- "Step all1 of 5" / NaN progress in preview fixed. Inline `#595959`, `red` replaced with tokens.
- "View full details" (AlumniDetails): light-only grays/blues -> tokens.

## 5. Quizzes
- `pages/auth/quiz-shared/quiz-shared.css` + `QuizQuestionMeta.jsx`: one header design, alignment, fonts and
  question-header labels for both quizzes; timer tag colors restored.

## 6. Login / forgot / reset password
- Email trimmed; 429/422 give readable messages; no crash on non-JSON replies.
- Reset token/email removed from address bar; no double URL-decoding; Enter submits; keyboard-accessible toggles/links.
- Backend: password rules match UI (upper/lower/number); tokens revoked after reset.
- Rate limits: login 5/hour (counted successes) -> 5/min + 30/hr; password-reset 5/hr/IP -> 10/hr per email+IP, 60/hr per IP.

## Known, NOT changed (need your decision)
- "Remember me" stores the plaintext password in browser storage.
- `/password/find-account` returns the full name for any email (information leak).
- `/department-head/dashboard` returns full alumni records; frontend depends on those fields.
- beed-logo.png and educ-logo.png are the same file. bsba-logo.png is 3 MB.
- Nunito is downloaded but never used (body font is forced to Helvetica/Arial stack).
