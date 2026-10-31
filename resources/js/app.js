/**
 * Vite entry point (replaces the old webpack/laravel-mix entry).
 * CSS that used to be compiled separately by mix.sass() is now imported
 * here so Vite bundles and injects it.
 */
import "../sass/app.scss";
import "../sass/safe-area-global.css";

import "./bootstrap";
import "./Main";
