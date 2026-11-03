/**
 * Vite entry point (replaces the old webpack/laravel-mix entry).
 * CSS that used to be compiled separately by mix.sass() is now imported
 * here so Vite bundles and injects it.
 */
import "../css/tokens.css"; // design tokens (color palette) — load first
import "../css/page-header.css";
import "../css/auth-mobile-app.css"; // portrait-phone app look for Login / Forgot / Reset / Register
import "../css/page-theme-toggle.css"; // shared floating theme toggle // compact page headers (all pages inside the login)
import "../sass/app.scss";
import "../sass/safe-area-global.css";

import "./bootstrap";
import "./Main";
