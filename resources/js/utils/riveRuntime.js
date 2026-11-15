// Self-host the Rive WebAssembly runtime.
//
// By default @rive-app/canvas downloads rive.wasm from unpkg.com at runtime
// (and falls back to jsdelivr). That breaks under a strict Content-Security-
// Policy (connect-src 'self' ...), needs a third-party CDN to be up, and
// means the login animations can't start offline. Vite's `?url` import
// copies the wasm files into /build/assets (hashed, long-cached, and picked
// up by the service worker's /build/assets cache-first rule), and we point
// the runtime at those copies.
//
// This module must be imported BEFORE the first useRive() call runs.
import { RuntimeLoader, Rive } from "@rive-app/canvas";
import riveWasmUrl from "@rive-app/canvas/rive.wasm?url";
import riveFallbackWasmUrl from "@rive-app/canvas/rive_fallback.wasm?url";

RuntimeLoader.setWasmUrl(riveWasmUrl);
// Local fallback instead of the default jsdelivr CDN one.
RuntimeLoader.setWasmFallbackUrl(riveFallbackWasmUrl);

// The login animations already call play(stateMachineNames[0]) (or the first
// animation) once loaded, so the "default-state-machine" notice is just noise.
Rive.suppressDeprecationWarnings = ["default-state-machine"];
