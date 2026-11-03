// ============================================================
// config/inspect.js
// ATMS - ONE switch for every DevTools / right-click / zoom guard.
//
//   .env:  VITE_ENABLE_INSPECT_PROTECTION=false   -> all guards OFF (debugging)
//          VITE_ENABLE_INSPECT_PROTECTION=true    -> all guards ON  (production)
//
// Unset, or anything other than "false", means ON (safe default).
// Vite inlines env at build / dev-server start, so restart `npm run dev`
// (or re-run `npm run build`) after changing it.
//
// Every guard in the app imports INSPECT_PROTECTION_ENABLED from here:
//   - utils/devtoolsGuard.js   (hides the app while DevTools is open)
//   - hooks/usePreventInspect  (right-click, F12/Ctrl+Shift+I, zoom lock)
//   - the per-page copies (MainPage, 404, quizzes, registration, About, FAQ)
// So there is nothing to comment out or un-comment anywhere.
// ============================================================
export const INSPECT_PROTECTION_ENABLED =
    String(import.meta.env?.VITE_ENABLE_INSPECT_PROTECTION ?? "true")
        .trim()
        .toLowerCase() !== "false";
