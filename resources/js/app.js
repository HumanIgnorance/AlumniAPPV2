/**
 * Vite entry point (replaces the old webpack/laravel-mix entry).
 * CSS that used to be compiled separately by mix.sass() is now imported
 * here so Vite bundles and injects it.
 */
import "./utils/devtoolsGuard"; // hide the UI while DevTools is open (runs before React mounts)
import "../css/tokens.css"; // design tokens (color palette) — load first
import "../css/page-header.css";
import "../css/auth-mobile-app.css"; // portrait-phone app look for Login / Forgot / Reset / Register
import "../css/auth-appbar.css"; // ONE shared top bar (explicit height) for every signed-out phone screen
import "../css/mobile-app-responsive.css"; // signed-in screens: all iPhones + Android sizes
import "../css/page-theme-toggle.css"; // shared floating theme toggle // compact page headers (all pages inside the login)
import "../sass/app.scss";
import "../sass/safe-area-global.css";

import "./bootstrap";
import "./Main";
