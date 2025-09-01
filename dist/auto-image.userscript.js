// ==UserScript==
// @name         WPlace Auto-Image
// @namespace    https://github.com/Wplace-AutoBot/WPlace-AutoBOT
// @version      1.0.0
// @description  Automated image painting for WPlace
// @author       WPlace AutoBot Team
// @match        https://wplace.live/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Wplace-AutoBot/WPlace-AutoBOT
// @supportURL   https://github.com/Wplace-AutoBot/WPlace-AutoBOT/issues
// ==/UserScript==


(()=>{var Ka=`/* WPlace Auto-Image Bot - Unified CSS Styles (decoupled from JS)
   Why: bring external CSS in-sync with the UI that Auto-Image.js renders,
   fix layout (positions, widths, z-index), and ensure class names match JS
   (e.g., .wplace-dragging) so buttons and panels behave correctly. */

/* ========================= */
/* Theme tokens (CSS vars)   */
/* ========================= */

/* Theme files are now embedded at build time - no external imports needed */

/* Default :root CSS variables for 100% classic theme compliance */
/* These ensure the bot works perfectly even if theme files fail to load */
:root {
    /* Classic theme colors - exact upstream main values */
    --wplace-primary: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    --wplace-secondary: linear-gradient(135deg, #111111 0%, #2a2a2a 100%);
    --wplace-accent: #222222;
    --wplace-text: #ffffff;
    --wplace-highlight: #775ce3;
    --wplace-highlight-secondary: #d3a4ff;
    --wplace-success: #00ff00;
    --wplace-error: #ff0000;
    --wplace-warning: #ffaa00;

    /* UI properties */
    --wplace-radius: 12px;
    --wplace-border-style: solid;
    --wplace-border-width: 1px;
    --wplace-border-color: #222222;
    --wplace-shadow:
        0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
    --wplace-backdrop: blur(10px);
    --wplace-font: 'Segoe UI', Roboto, sans-serif;

    /* Z-index layers */
    --wplace-z-overlay: 10000;
    --wplace-z-alert: 10002;
    --wplace-z-settings: 10002;

    /* Feature toggles */
    --wplace-scanline: 0;
    --wplace-pixel-blink: 0;

    /* Icon colors */
    --wplace-icon-primary: #4facfe;
    --wplace-icon-secondary: #00f2fe;
    --wplace-icon-palette: #f093fb;

    /* Additional UI colors */
    --wplace-danger: #ff6a6a;
    --wplace-danger-dark: #ff4757;
    --wplace-muted-text: #ffffffbb;

    /* Text variants */
    --wplace-text-secondary: rgba(255, 255, 255, 0.9);
    --wplace-text-muted: rgba(255, 255, 255, 0.7);
    --wplace-text-dim: rgba(255, 255, 255, 0.6);
    --wplace-text-faded: rgba(255, 255, 255, 0.8);

    /* Background variants */
    --wplace-bg-input: rgba(255, 255, 255, 0.15);
    --wplace-bg-subtle: rgba(255, 255, 255, 0.1);
    --wplace-bg-faint: rgba(255, 255, 255, 0.08);
    --wplace-bg-ghost: rgba(255, 255, 255, 0.06);
    --wplace-bg-whisper: rgba(255, 255, 255, 0.05);

    /* Border variants */
    --wplace-border-subtle: rgba(255, 255, 255, 0.2);
    --wplace-border-faint: rgba(255, 255, 255, 0.15);
    --wplace-border-ghost: rgba(255, 255, 255, 0.1);
    --wplace-border-ultra-faint: rgba(255, 255, 255, 0.05);

    /* Shadow variants */
    --wplace-shadow-drag:
        0 12px 40px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.2);
    --wplace-shadow-notification: 0 4px 12px rgba(0, 0, 0, 0.3);
    --wplace-shadow-slider-thumb:
        0 3px 6px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--wplace-icon-primary);
    --wplace-shadow-slider-hover:
        0 4px 8px rgba(0, 0, 0, 0.4), 0 0 0 3px var(--wplace-icon-primary);

    /* Animation colors */
    --wplace-pulse-start: rgba(0, 255, 0, 0.7);
    --wplace-pulse-mid: rgba(0, 255, 0, 0);
    --wplace-pulse-end: rgba(0, 255, 0, 0);

    /* Slider colors - defaults for classic compatibility */
    --wplace-slider-thumb-bg: white;
    --wplace-slider-track-bg: linear-gradient(
        to right,
        var(--wplace-icon-primary) 0%,
        var(--wplace-icon-secondary) 100%
    );
}

/* Theme classes are now defined in separate files */
/* Classic theme: ./themes/classic.css */
/* Neon theme: ./themes/neon.css */

/* ========================= */
/* Core animations (shared)  */
/* ========================= */
@keyframes neonGlow {
    0%,
    100% {
        text-shadow:
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 15px currentColor;
    }
    50% {
        text-shadow:
            0 0 2px currentColor,
            0 0 5px currentColor,
            0 0 8px currentColor;
    }
}

@keyframes pixelBlink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0.7;
    }
}

@keyframes scanline {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(400px);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 var(--wplace-pulse-start);
    }
    70% {
        box-shadow: 0 0 0 10px var(--wplace-pulse-mid);
    }
    100% {
        box-shadow: 0 0 0 0 var(--wplace-pulse-end);
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideDown {
    from {
        transform: translateX(-50%) translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

/* ========================= */
/* Main containers (fixed)   */
/* Align with JS structure   */
/* ========================= */
#wplace-image-bot-container {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 280px;
    max-height: calc(100vh - 40px);
    padding: 0;
    z-index: 9998;
    animation: slideIn 0.4s ease-out;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.3s ease;
    user-select: none;
    /* Default classic theme styling for 100% compliance */
    background: var(--wplace-primary);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    box-shadow: var(--wplace-shadow);
    font-family: var(--wplace-font);
    backdrop-filter: var(--wplace-backdrop);
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

#wplace-image-bot-container.wplace-dragging {
    transition: none;
    box-shadow: var(--wplace-shadow-drag);
    transform: scale(1.02);
    z-index: 9999;
}

#wplace-image-bot-container.wplace-compact {
    width: 240px;
}

#wplace-image-bot-container.wplace-minimized {
    width: 200px;
    height: auto;
    overflow: hidden;
}

/* Stats container sits to the right of main (280 + 30 = 330) */
#wplace-stats-container {
    position: fixed;
    top: 20px;
    left: 330px;
    width: 280px;
    max-height: calc(100vh - 40px);
    padding: 0;
    z-index: 9997;
    animation: slideIn 0.4s ease-out;
    overflow-y: auto;
    transition: all 0.3s ease;
    user-select: none;
    display: none;
    /* Default classic theme styling for 100% compliance */
    background: var(--wplace-primary);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    box-shadow: var(--wplace-shadow);
    font-family: var(--wplace-font);
    backdrop-filter: var(--wplace-backdrop);
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

#wplace-stats-container.wplace-dragging {
    transition: none;
}

/* Back-compat for legacy class (some earlier CSS used this) */
.wplace-drag-active {
    transition: none !important;
    box-shadow: var(--wplace-shadow-drag) !important;
    transform: scale(1.02) !important;
    z-index: 9999 !important;
}

/* ========================= */
/* Header and content blocks */
/* ========================= */
.wplace-header {
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
    border-bottom: 1px solid var(--wplace-border-ghost);
    transition: background 0.2s ease;
    position: relative;
    z-index: 2;
    /* Default styling for 100% classic compliance */
    background: var(--wplace-secondary);
    color: var(--wplace-highlight);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.wplace-header-title {
    display: flex;
    align-items: center;
    gap: 6px;
}

.wplace-header-controls {
    display: flex;
    gap: 6px;
}

.wplace-header-btn {
    border: none;
    cursor: pointer;
    width: 18px;
    height: 18px;
    padding: 0;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    /* Default styling for 100% classic compliance */
    background: rgba(255, 255, 255, 0.1);
    color: var(--wplace-text);
    border-radius: 4px;
    font-family: var(--wplace-font);
}

.wplace-header-btn:hover {
    transform: scale(1.1);
    /* Default styling for 100% classic compliance */
    background: var(--wplace-accent);
    color: var(--wplace-text);
}

.wplace-content {
    display: block;
    position: relative;
    z-index: 2;
    padding: 12px;
}

.wplace-content.wplace-hidden {
    display: none;
}

/* Sections */
.wplace-status-section {
    margin-bottom: 12px;
    padding: 8px;
    /* Theme-specific styling applied via theme files */
}

.wplace-section {
    margin-bottom: 12px;
    padding: 12px;
    /* Theme-specific styling applied via theme files */
}

.wplace-section-title {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
    /* Theme-specific styling applied via theme files */
}

/* ========================= */
/* Controls and buttons      */
/* ========================= */
.wplace-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.wplace-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.wplace-row.single {
    grid-template-columns: 1fr;
}

.wplace-btn {
    padding: 8px 12px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    font-weight: 500;
    /* Theme-specific styling applied via theme files */
}

.wplace-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    transition: left 0.5s ease;
    /* Theme-specific styling applied via theme files */
}

.wplace-btn:hover:not(:disabled)::before {
    left: 100%;
}

.wplace-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    /* Theme-specific styling applied via theme files */
}

.wplace-btn:active:not(:disabled) {
    transform: translateY(0);
}

.wplace-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    /* Theme-specific styling applied via theme files */
}

.wplace-btn:disabled::before {
    display: none;
}

/* Button variants moved to theme files */

/* ========================= */
/* Stats and progress        */
/* ========================= */
.wplace-stats {
    margin-bottom: 8px;
    padding: 8px;
    /* Theme-specific styling applied via theme files */
}

.wplace-stat-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 11px;
    border-bottom: 1px solid var(--wplace-border-ultra-faint);
}

.wplace-stat-item:last-child {
    border-bottom: none;
}

.wplace-stat-label {
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0.9;
    font-size: 10px;
}

.wplace-stat-value {
    font-weight: 600;
    /* Theme-specific styling applied via theme files */
}

.wplace-colors-section {
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--wplace-border-ultra-faint);
}

.wplace-stat-colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16px, 1fr));
    gap: 4px;
    margin-top: 8px;
    padding: 4px;
    max-height: 80px;
    overflow-y: auto;
    /* Theme-specific styling applied via theme files */
}

.wplace-colors-placeholder {
    text-align: center;
    color: #888;
    padding: 20px;
    font-style: italic;
}

.wplace-cooldown-value {
    font-weight: bold;
    min-width: 20px;
    text-align: center;
    display: inline-block;
}

.wplace-stat-color-swatch {
    width: 16px;
    height: 16px;
    /* Theme-specific styling applied via theme files */
}

/* Progress */
.wplace-progress {
    width: 100%;
    margin: 8px 0;
    overflow: hidden;
    height: 6px;
    position: relative;
    /* Theme-specific styling applied via theme files */
}

.wplace-progress-bar {
    height: 6px;
    transition: width 0.5s ease;
    position: relative;
    /* Theme-specific styling applied via theme files */
}

.wplace-progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    animation: shimmer 2s infinite;
    /* Theme-specific styling applied via theme files */
}

/* ========================= */
/* Status blocks             */
/* ========================= */
.wplace-status {
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 6px;
    border: 1px solid;
    font-size: 11px;
    /* Theme-specific styling applied via theme files */
}

/* Status styling moved to theme files */

/* ========================= */
/* Resize dialog             */
/* ========================= */
.resize-container {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    z-index: 10000;
    width: 90%;
    max-width: 700px;
    max-height: 90%;
    overflow: auto;
    /* Theme-specific styling applied via theme files */
}

.resize-preview-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
    height: 300px;
    overflow: hidden;
    /* Theme-specific styling applied via theme files */
}

.resize-canvas-stack {
    position: relative;
    transform-origin: center center;
    display: inline-block;
}

.resize-base-canvas,
.resize-mask-canvas {
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

.resize-mask-canvas {
    pointer-events: auto;
}

.resize-tools {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    font-size: 12px;
}

.resize-tools button {
    padding: 6px 10px;
    cursor: pointer;
    /* Theme-specific styling applied via theme files */
}

/* Button active states moved to theme files */

.resize-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    align-items: center;
}

.resize-slider {
    width: 100%;
    height: 4px;
    border: none;
    outline: none;
    -webkit-appearance: none;
    /* Theme-specific styling applied via theme files */
}

.resize-zoom-controls {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
}

.resize-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.resize-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: none;
    /* Theme-specific styling applied via theme files */
}

/* ========================= */
/* Color grid                */
/* ========================= */
.wplace-color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 10px;
    padding-top: 8px;
    max-height: 300px;
    overflow-y: auto;
}

.wplace-color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.wplace-color-item-name {
    font-size: 9px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    /* Theme-specific styling applied via theme files */
}

.wplace-color-swatch {
    width: 22px;
    height: 22px;
    cursor: pointer;
    transition:
        transform 0.1s ease,
        box-shadow 0.2s ease;
    position: relative;
    margin: 0 auto;
    /* Theme-specific styling applied via theme files */
}

.wplace-color-swatch.unavailable {
    border-style: dashed;
    cursor: not-allowed;
    /* Theme-specific styling applied via theme files */
}

.wplace-color-swatch:hover {
    transform: scale(1.1);
    z-index: 1;
}

.wplace-color-swatch:not(.active) {
    opacity: 0.3;
    /* Theme-specific styling applied via theme files */
}

.wplace-color-swatch.unavailable:not(.active) {
    opacity: 0.2;
    /* Theme-specific styling applied via theme files */
}

.wplace-color-swatch.active::after {
    content: '\u2714';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--wplace-text);
    font-size: 12px;
    font-weight: bold;
    /* Theme-specific styling applied via theme files */
}

.wplace-color-divider {
    border: none;
    height: 1px;
    margin: 8px 0;
    /* Theme-specific styling applied via theme files */
}

/* ========================= */
/* Cooldown controls         */
/* ========================= */
.wplace-cooldown-control {
    margin-top: 8px;
}

.wplace-cooldown-control label {
    font-size: 11px;
    margin-bottom: 4px;
    display: block;
}

.wplace-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.wplace-slider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    outline: none;
    /* Theme-specific styling applied via theme files */
}

.wplace-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    cursor: pointer;
    /* Theme-specific styling applied via theme files */
}

/* ========================= */
/* Settings container (base) */
/* ========================= */
#wplace-settings-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0px;
    z-index: 10002;
    display: none;
    min-width: 420px;
    max-width: 480px;
    overflow: hidden;
    /* Default classic theme styling for 100% compliance */
    background: var(--wplace-primary);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    box-shadow: var(--wplace-shadow);
    font-family: var(--wplace-font);
    backdrop-filter: var(--wplace-backdrop);
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

#wplace-settings-container.show {
    display: block;
    animation: settingsSlideIn 0.4s ease-out;
}

@keyframes settingsSlideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes settingsFadeOut {
    from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
}

.wplace-settings {
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
}

.wplace-setting-section {
    margin-bottom: 20px;
    padding: 12px;
}

/* ========================= */
/* Form controls             */
/* ========================= */
.wplace-select {
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    margin-bottom: 10px;
}

.wplace-select:focus {
    outline: none;
}

.wplace-description {
    font-size: 12px;
    opacity: 0.8;
    line-height: 1.4;
}

/* Speed controls */
.wplace-speed-control {
    margin-top: 12px;
    padding: 12px;
}

.wplace-speed-label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
}

.wplace-speed-label i {
    margin-right: 6px;
}

.wplace-speed-slider-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.wplace-speed-slider {
    flex: 1;
    height: 6px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    background: var(--wplace-slider-track-bg);
    border-radius: 4px;
}

.wplace-speed-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    cursor: pointer;
    /* Theme-specific styling applied via theme files */
}

.wplace-speed-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    cursor: pointer;
    /* Theme-specific styling applied via theme files */
}

.wplace-speed-display {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 90px;
    justify-content: flex-end;
}

/* ========================= */
/* Turnstile overlay         */
/* ========================= */
/* Hidden invisible widget host (token generator) */
.wplace-turnstile-hidden {
    position: fixed !important;
    left: -99999px !important;
    top: -99999px !important;
    width: 1px !important;
    height: 1px !important;
    pointer-events: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    z-index: -99999 !important;
    overflow: hidden !important;
}

/* Visible overlay (interactive fallback) */
.wplace-turnstile-overlay {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 99999 !important;
    padding: 20px !important;
    min-width: 300px !important;
    max-width: 400px !important;
    /* Theme-specific styling applied via theme files */
}

.wplace-turnstile-title {
    font:
        600 12px/1.3 'Segoe UI',
        sans-serif !important;
    margin-bottom: 8px !important;
    opacity: 0.9 !important;
    /* Theme-specific styling applied via theme files */
}

.wplace-turnstile-host {
    width: 100% !important;
    min-height: 70px !important;
}

.wplace-turnstile-hide-btn {
    position: absolute !important;
    top: 6px !important;
    right: 6px !important;
    font-size: 11px !important;
    background: transparent !important;
    padding: 2px 6px !important;
    cursor: pointer !important;
    transition: background 0.2s ease !important;
    /* Theme-specific styling applied via theme files */
}

.wplace-turnstile-hide-btn:hover {
    /* Theme-specific styling applied via theme files */
}

/* ========================= */
/* Alert system (used by JS) */
/* ========================= */
.wplace-alert-base {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    color: var(--wplace-text);
    font-weight: 600;
    z-index: 10002;
    max-width: 400px;
    text-align: center;
    animation: slideDown 0.3s ease-out;
    box-shadow: var(--wplace-shadow-notification);
    /* Theme-specific styling applied via theme files */
}

/* Alert styling moved to theme files */

/* ========================= */
/* Modal overlay helpers     */
/* ========================= */
.wplace-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100002;
    display: none;
    /* Theme-specific styling applied via theme files */
}

.wplace-overlay.show {
    display: block;
}

/* Overlay visibility helpers */
.wplace-overlay-hidden {
    display: none !important;
}

.wplace-overlay-visible {
    display: block !important;
}

/* ========================= */
/* Responsive tweaks         */
/* ========================= */
@media (max-width: 768px) {
    #wplace-image-bot-container {
        left: 10px;
        width: calc(100vw - 20px);
        max-height: calc(100vh - 20px);
    }

    #wplace-stats-container {
        display: none !important; /* hide secondary panel on small screens */
    }

    .wplace-alert-base {
        max-width: 90vw;
        margin: 0 5vw;
    }

    .wplace-turnstile-overlay {
        bottom: 10px !important;
        right: 10px !important;
        left: 10px !important;
        min-width: auto !important;
    }
}

/* Auto light/dark support moved to theme files */

/* ===================================== */
/* Settings container variants (optional)*/
/* ===================================== */
.wplace-settings-container-base {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100001;
    display: none;
    min-width: 400px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideIn 0.3s ease-out;
    border: 1px solid var(--wplace-border-ghost);
    padding: 0;
    /* Theme-specific styling applied via theme files */
}

.wplace-settings-container-base.show {
    display: block;
}

/* ===================================== */
/* Utility styles                         */
/* ===================================== */
.wplace-paint-effect {
    animation: pulse 0.5s ease-out;
}

.wplace-settings-error {
    /* Theme-specific styling applied via theme files */
}

.wplace-stats-container.hidden {
    display: none;
}

/* Theme-specific effects are now in separate theme files */

/* ===================================== */
/* Settings Dialog Styles               */
/* ===================================== */

/* Settings content container */
.wplace-settings-content {
    padding: 25px;
    max-height: 70vh;
    overflow-y: auto;
}

/* Settings section containers */
.wplace-settings-section {
    margin-bottom: 25px;
}

/* Section labels */
.wplace-settings-section-label {
    margin-bottom: 12px;
    color: var(--wplace-text);
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Icon colors */
.wplace-icon-key {
    font-size: 16px;
}

.wplace-icon-robot {
    font-size: 16px;
}

.wplace-icon-speed {
    font-size: 16px;
}

.wplace-icon-bell {
    font-size: 16px;
}

.wplace-icon-palette {
    font-size: 16px;
}

.wplace-icon-globe {
    font-size: 16px;
}

.wplace-icon-paint {
    font-size: 16px;
}

/* Section wrapper styling */
.wplace-settings-section-wrapper {
    padding: 18px;
    /* Theme-specific styling applied via theme files */
}

/* Select dropdowns */
.wplace-settings-select {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    /* Theme-specific styling applied via theme files */
}

.wplace-settings-option {
    padding: 10px;
    /* Theme-specific styling applied via theme files */
}

/* Settings description text */
.wplace-settings-description {
    font-size: 12px;
    color: var(--wplace-text-muted);
    margin: 8px 0 0 0;
}

/* Batch Mode Controls */
.wplace-batch-mode-selection {
    margin-bottom: 15px;
}

.wplace-batch-mode-label {
    display: block;
    margin-bottom: 8px;
    color: var(--wplace-text-secondary);
    font-weight: 500;
    font-size: 14px;
}

.wplace-icon-dice {
    color: var(--wplace-icon-palette);
    margin-right: 6px;
}

.wplace-batch-mode-select {
    width: 100%;
    padding: 10px 12px;
    background: var(--wplace-bg-input);
    color: var(--wplace-text);
    border: 1px solid var(--wplace-border-subtle);
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
}

/* Batch Controls */
.wplace-batch-controls {
    padding: 18px;
    margin-bottom: 15px;
    /* Theme-specific styling applied via theme files */
}

.wplace-random-batch-controls {
    display: none;
}

/* Speed Slider Container */
.wplace-speed-slider-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.wplace-speed-slider {
    flex: 1;
    height: 8px;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
    background: var(--wplace-slider-track-bg);
    border-radius: 4px;
}

.wplace-speed-value {
    min-width: 100px;
    text-align: center;
    padding: 8px 12px;
    font-weight: bold;
    font-size: 13px;
    /* Theme-specific styling applied via theme files */
}

.wplace-speed-labels {
    display: flex;
    justify-content: space-between;
    color: var(--wplace-text-muted);
    font-size: 11px;
    margin-top: 8px;
}

/* Random Batch Controls */
.wplace-random-batch-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.wplace-random-batch-label {
    display: block;
    color: var(--wplace-text-faded);
    font-size: 12px;
    margin-bottom: 8px;
}

.wplace-icon-min {
    color: var(--wplace-icon-primary);
    margin-right: 4px;
}

.wplace-icon-max {
    color: var(--wplace-icon-secondary);
    margin-right: 4px;
}

.wplace-random-batch-input {
    width: 100%;
    padding: 10px 12px;
    background: var(--wplace-bg-subtle);
    color: var(--wplace-text);
    border: 1px solid var(--wplace-border-subtle);
    border-radius: 8px;
    font-size: 13px;
    outline: none;
}

.wplace-random-batch-description {
    font-size: 11px;
    color: var(--wplace-text-dim);
    margin: 8px 0 0 0;
    text-align: center;
}

/* Speed Control Toggle */
.wplace-speed-control-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--wplace-text);
}

.wplace-speed-checkbox {
    cursor: pointer;
}

/* Overlay Settings */
.wplace-overlay-opacity-control {
    margin-bottom: 15px;
}

.wplace-overlay-opacity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.wplace-overlay-opacity-label {
    font-weight: 500;
    font-size: 13px;
}

.wplace-overlay-opacity-value {
    min-width: 40px;
    text-align: center;
    padding: 4px 8px;
    font-size: 12px;
}

.wplace-overlay-opacity-slider {
    width: 100%;
    -webkit-appearance: none;
    height: 8px;
    outline: none;
    cursor: pointer;
}

.wplace-blue-marble-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.wplace-blue-marble-title {
    font-weight: 500;
}

.wplace-blue-marble-description {
    font-size: 12px;
    margin: 4px 0 0 0;
}

.wplace-blue-marble-checkbox {
    cursor: pointer;
    width: 20px;
    height: 20px;
}

/* Notifications */
.wplace-notifications-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.wplace-notification-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wplace-notification-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.wplace-notification-interval {
    display: flex;
    align-items: center;
    gap: 10px;
}

.wplace-notification-interval-input {
    width: 70px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid var(--wplace-border-subtle);
    background: var(--wplace-bg-faint);
    color: var(--wplace-text);
}

.wplace-notification-buttons {
    display: flex;
    gap: 10px;
}

.wplace-notification-perm-btn,
.wplace-notification-test-btn {
    flex: 1;
}

/* Settings Footer */
.wplace-settings-footer {
    border-top: 1px solid var(--wplace-border-ghost);
    padding-top: 20px;
    margin-top: 10px;
}

.wplace-settings-apply-btn {
    width: 100%;
}

/* ===================================== */
/* Resize Dialog Styles                 */
/* ===================================== */

/* Resize dialog title */
.resize-dialog-title {
    margin-top: 0;
}

/* Resize control labels */
.resize-control-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
}

.resize-checkbox-label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    gap: 8px;
}

/* Zoom controls */
.resize-zoom-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.resize-zoom-btn {
    padding: 4px 8px;
}

.resize-zoom-slider {
    max-width: 220px;
}

.resize-zoom-value {
    margin-left: 6px;
    min-width: 48px;
    text-align: right;
    opacity: 0.85;
    font-size: 12px;
}

.resize-camera-help {
    font-size: 11px;
    opacity: 0.75;
    margin-left: auto;
}

/* Canvas positioning */
.resize-pan-stage {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.resize-canvas-positioned {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
}

/* Resize tools */
.resize-tools-container {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.resize-brush-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.resize-brush-control {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: space-between;
}

.resize-tool-label {
    font-size: 12px;
    opacity: 0.85;
}

.resize-tool-input-group {
    display: flex;
    align-items: center;
    gap: 6px;
}

.resize-tool-slider {
    width: 120px;
}

.resize-tool-value {
    font-size: 12px;
    opacity: 0.85;
    min-width: 18px;
    text-align: center;
}

.resize-mode-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.resize-mode-group {
    display: flex;
    gap: 6px;
}

.resize-mode-btn,
.resize-clear-btn,
.resize-invert-btn {
    padding: 4px 8px;
    font-size: 12px;
}

.resize-shortcut-help {
    opacity: 0.8;
    font-size: 12px;
}

/* Color palette section */
.resize-color-palette-section {
    margin-top: 15px;
}

.resize-color-toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.resize-color-checkbox {
    cursor: pointer;
}

/* Advanced color section */
.resize-advanced-color-section {
    margin-top: 15px;
}

.resize-advanced-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.resize-advanced-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
}

.resize-advanced-label-text {
    font-weight: 600;
}

.resize-advanced-select {
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid var(--wplace-border-faint);
    background: var(--wplace-bg-whisper);
    color: var(--wplace-text);
}

.resize-advanced-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
}

.resize-advanced-toggle-content {
    flex: 1;
}

.resize-advanced-description {
    margin-top: 2px;
    opacity: 0.65;
}

.resize-advanced-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.resize-chroma-weight-control {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.resize-chroma-weight-header {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-bottom: 4px;
}

.resize-chroma-weight-value {
    background: var(--wplace-bg-faint);
    padding: 2px 6px;
    border-radius: 4px;
}

.resize-chroma-weight-slider {
    width: 100%;
}

.resize-threshold-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.resize-threshold-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
}

.resize-threshold-input {
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid var(--wplace-border-faint);
    background: var(--wplace-bg-whisper);
    color: var(--wplace-text);
}

.resize-reset-advanced-btn {
    background: linear-gradient(
        135deg,
        var(--wplace-danger),
        var(--wplace-danger-dark)
    );
    font-size: 11px;
}

/* ===================================== */
/* Additional styles for exact upstream match */
/* ===================================== */

/* Overlay styles exact match */
.resize-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: none;
    /* Theme-specific styling applied via theme files */
}

/* Settings animations - removed duplicate, handled above */

/* Settings Header Styling */
.wplace-settings-header {
    background: var(--wplace-accent);
    padding: 20px;
    border-bottom: 1px solid var(--wplace-border-color);
    cursor: move;
}

.wplace-settings-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.wplace-settings-title {
    margin: 0;
    color: var(--wplace-text);
    font-size: 20px;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 10px;
}

.wplace-settings-icon {
    font-size: 18px;
    color: var(--wplace-highlight);
    animation: spin 2s linear infinite;
}

.wplace-settings-close-btn {
    background: rgba(34, 34, 34, 0.4);
    color: var(--wplace-text);
    border: 1px solid var(--wplace-border-color);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: 300;
}

.wplace-settings-close-btn:hover {
    background: rgba(255, 0, 0, 0.4);
    transform: scale(1.1);
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* Font styling corrections */
.resize-controls label {
    font-size: 12px;
    color: var(--wplace-text);
}

.resize-dialog-title {
    margin-top: 0;
    color: var(--wplace-text);
}

/* Ensure proper z-indexing */
.resize-container {
    z-index: 10000;
}

/* Missing button hover styles */
.resize-tools button {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--wplace-border-subtle);
    background: var(--wplace-bg-ghost);
    color: var(--wplace-text);
    cursor: pointer;
}

/* Canvas styling */
.resize-canvas-stack {
    position: relative;
    transform-origin: center center;
    display: inline-block;
}

.resize-base-canvas,
.resize-mask-canvas {
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

.resize-mask-canvas {
    pointer-events: auto;
}

/* Additional precision fixes for exact upstream main matching */
/* Status default styling moved to theme files */

/* Duplicate settings section removed - all settings styling moved to theme files */

/* Settings header styling moved to theme files */
/* All remaining settings styling moved to theme files */

.wplace-settings-section-wrapper {
    padding: 18px;
    /* Theme-specific styling applied via theme files */
}

.wplace-settings-select {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    /* Theme-specific styling applied via theme files */
}

/* Settings select option styling moved to theme files */
/* Settings description styling moved to theme files */

.wplace-settings-footer {
    border-top: 1px solid var(--wplace-border-ghost);
    padding-top: 20px;
    margin-top: 10px;
}

.wplace-settings-apply-btn {
    width: 100%;
    border: none;
    padding: 10px 16px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    /* Theme-specific styling applied via theme files */
}

/* Icon styling moved to theme files */
.wplace-icon-key {
    font-size: 16px;
}
.wplace-icon-robot {
    font-size: 16px;
}
.wplace-icon-speed {
    font-size: 16px;
}
.wplace-icon-bell {
    font-size: 16px;
}
.wplace-icon-palette {
    font-size: 16px;
}
.wplace-icon-globe {
    font-size: 16px;
}
.wplace-icon-paint {
    font-size: 16px;
}
.wplace-icon-eye {
    font-size: 16px;
}

/* Overlay Settings Controls */
.wplace-overlay-opacity-control {
    margin-bottom: 15px;
}

.wplace-overlay-opacity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.wplace-overlay-opacity-label {
    font-weight: 500;
    font-size: 13px;
}

.wplace-overlay-opacity-value {
    min-width: 40px;
    text-align: center;
    background: var(--wplace-accent);
    color: var(--wplace-text);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

.wplace-overlay-opacity-slider {
    width: 100%;
    -webkit-appearance: none;
    height: 8px;
    /* Theme-specific styling applied via theme files */
    outline: none;
    cursor: pointer;
}

.wplace-overlay-opacity-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--wplace-slider-thumb-bg);
    box-shadow: var(--wplace-shadow-slider-thumb);
    cursor: pointer;
    transition: all 0.2s ease;
}

.wplace-overlay-opacity-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: var(--wplace-shadow-slider-hover);
}

.wplace-blue-marble-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.wplace-blue-marble-title {
    font-weight: 500;
}

.wplace-blue-marble-description {
    font-size: 12px;
    color: var(--wplace-muted-text);
    margin: 4px 0 0 0;
}

.wplace-blue-marble-checkbox {
    cursor: pointer;
    width: 20px;
    height: 20px;
    accent-color: var(--wplace-highlight);
}

/* Batch Mode Controls */
.wplace-batch-mode-selection {
    margin-bottom: 15px;
}

.wplace-batch-mode-label {
    display: block;
    margin-bottom: 8px;
    color: var(--wplace-text-secondary);
    font-weight: 500;
    font-size: 14px;
}

.wplace-icon-dice {
    color: var(--wplace-icon-palette);
    margin-right: 6px;
}

.wplace-batch-mode-select {
    width: 100%;
    padding: 10px 12px;
    background: var(--wplace-bg-input);
    color: var(--wplace-text);
    border: 1px solid var(--wplace-border-subtle);
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
}

.wplace-batch-controls {
    padding: 18px;
    margin-bottom: 15px;
    /* Theme-specific styling applied via theme files */
}

.wplace-speed-slider-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.wplace-speed-slider {
    flex: 1;
    height: 8px;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
    background: var(--wplace-slider-track-bg);
    border-radius: 4px;
}

.wplace-speed-value {
    min-width: 100px;
    text-align: center;
    padding: 8px 12px;
    font-weight: bold;
    font-size: 13px;
    /* Theme-specific styling applied via theme files */
}

.wplace-speed-labels {
    display: flex;
    justify-content: space-between;
    color: var(--wplace-text-muted);
    font-size: 11px;
    margin-top: 8px;
}
`,xt={"classic-light":`/* WPlace Auto-Image Bot - Classic Light Theme */
/* Clean, bright theme based on classic design with light backgrounds */

.wplace-theme--classic-light {
    /* === CORE COLORS === */
    --wplace-primary: #ffffff; /* Clean white */
    --wplace-secondary: #f8f9fa; /* Light gray */
    --wplace-accent: #e9ecef; /* Lighter gray */
    --wplace-text: #212529; /* Dark text */
    --wplace-highlight: #6f42c1; /* Purple highlight */
    --wplace-success: #28a745; /* Bootstrap green */
    --wplace-error: #dc3545; /* Bootstrap red */
    --wplace-warning: #ffc107; /* Bootstrap yellow */

    /* === UI PROPERTIES === */
    --wplace-radius: 8px;
    --wplace-border-style: solid;
    --wplace-border-width: 1px;
    --wplace-border-color: #415a77;
    --wplace-shadow:
        0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08);
    --wplace-backdrop: blur(10px);
    --wplace-font: 'Segoe UI', Roboto, sans-serif;

    /* === EXTENDED COLOR PALETTE === */
    /* Icon colors */
    --wplace-icon-primary: #4facfe; /* Light blue */
    --wplace-icon-secondary: #00f2fe; /* Cyan */
    --wplace-icon-palette: #f093fb; /* Pink */

    /* Additional UI colors */
    --wplace-danger: #dc3545; /* Bootstrap red */
    --wplace-danger-dark: #c82333; /* Darker red */
    --wplace-muted-text: rgba(33, 37, 41, 0.7);
    --wplace-highlight-secondary: #d3a4ff;

    /* Text variants */
    --wplace-text-secondary: rgba(33, 37, 41, 0.9);
    --wplace-text-muted: rgba(33, 37, 41, 0.7);
    --wplace-text-dim: rgba(33, 37, 41, 0.6);
    --wplace-text-faded: rgba(33, 37, 41, 0.8);

    /* Background variants */
    --wplace-bg-input: rgba(0, 0, 0, 0.08);
    --wplace-bg-subtle: rgba(0, 0, 0, 0.05);
    --wplace-bg-faint: rgba(0, 0, 0, 0.03);
    --wplace-bg-ghost: rgba(0, 0, 0, 0.02);
    --wplace-bg-whisper: rgba(0, 0, 0, 0.01);

    /* Border variants */
    --wplace-border-subtle: rgba(0, 0, 0, 0.2);
    --wplace-border-faint: rgba(0, 0, 0, 0.15);
    --wplace-border-ghost: rgba(0, 0, 0, 0.1);
    --wplace-border-ultra-faint: rgba(0, 0, 0, 0.05);

    /* Shadow variants */
    --wplace-shadow-drag:
        0 12px 40px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(111, 66, 193, 0.3);
    --wplace-shadow-notification: 0 4px 12px rgba(0, 0, 0, 0.15);
    --wplace-shadow-slider-thumb:
        0 3px 6px rgba(0, 0, 0, 0.2), 0 0 0 2px var(--wplace-icon-primary);
    --wplace-shadow-slider-hover:
        0 4px 8px rgba(0, 0, 0, 0.25), 0 0 0 3px var(--wplace-icon-primary);

    /* Animation colors */
    --wplace-pulse-start: rgba(40, 167, 69, 0.7);
    --wplace-pulse-mid: rgba(40, 167, 69, 0);
    --wplace-pulse-end: rgba(40, 167, 69, 0);

    /* Slider colors */
    --wplace-slider-thumb-bg: #6f42c1;
    --wplace-slider-track-bg: linear-gradient(
        to right,
        #4facfe 0%,
        #00f2fe 100%
    );
}

/* === COMPONENT STYLING === */

/* Main container with clean light styling */
.wplace-theme--classic-light #wplace-image-bot-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    color: var(--wplace-text) !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-radius: 12px !important;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(0, 0, 0, 0.08) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    backdrop-filter: blur(10px) !important;
}

/* Stats container with proper contrast */
.wplace-theme--classic-light #wplace-stats-container {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    color: var(--wplace-text) !important;
    position: fixed !important;
    overflow: hidden !important;
    z-index: 9998 !important;
}

/* Stats header styling */
.wplace-theme--classic-light #wplace-stats-container .wplace-header {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
    color: var(--wplace-text) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;
    text-shadow: none !important;
    font-weight: 600 !important;
}

/* Stats title specific styling */
.wplace-theme--classic-light
    #wplace-stats-container
    .wplace-header
    .wplace-stats-title {
    color: var(--wplace-text) !important;
    text-shadow: none !important;
}

/* Comprehensive text and element styling for light theme - scoped to bot containers only */

.wplace-theme--classic-light .wplace-status,
.wplace-theme--classic-light .wplace-stats,
.wplace-theme--classic-light .wplace-section,
.wplace-theme--classic-light .wplace-controls,
.wplace-theme--classic-light .wplace-data-management,
.wplace-theme--classic-light .wplace-cooldown-settings {
    color: var(--wplace-text) !important;
}

/* Data management section buttons */
.wplace-theme--classic-light .wplace-data-management .wplace-btn {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    color: #212529 !important;
    font-weight: 500 !important;
}

.wplace-theme--classic-light
    .wplace-data-management
    .wplace-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Settings dialog */
.wplace-theme--classic-light #wplace-settings-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-radius: 12px !important;
    box-shadow:
        0 16px 48px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(0, 0, 0, 0.08) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    backdrop-filter: blur(10px) !important;
    color: var(--wplace-text) !important;
}

/* Settings dialog text elements */
.wplace-theme--classic-light #wplace-settings-container * {
    color: var(--wplace-text) !important;
}

.wplace-theme--classic-light
    #wplace-settings-container
    .wplace-settings-section-wrapper
    * {
    color: var(--wplace-text) !important;
}

/* Color palette text labels */
.wplace-theme--classic-light .wplace-stat-colors-grid * {
    color: var(--wplace-text) !important;
    font-weight: 500 !important;
}

.wplace-theme--classic-light .wplace-color-label {
    color: var(--wplace-text) !important;
    font-weight: 500 !important;
    text-shadow: none !important;
}

.wplace-theme--classic-light .wplace-color-name {
    color: var(--wplace-text) !important;
    font-weight: 500 !important;
}

.wplace-theme--classic-light .wplace-color-item-name {
    color: #000000 !important;
    font-weight: 600 !important;
    text-shadow: none !important;
}

/* Resize dialog */
.wplace-theme--classic-light .resize-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-radius: 12px !important;
    box-shadow:
        0 16px 48px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(0, 0, 0, 0.08) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    backdrop-filter: blur(10px) !important;
}

/* Headers with light gradient */
.wplace-theme--classic-light .wplace-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    color: var(--wplace-highlight) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
    text-shadow: none !important;
}

/* Settings header */
.wplace-theme--classic-light .wplace-settings-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
}

.wplace-theme--classic-light .wplace-settings-title {
    color: var(--wplace-text) !important;
    text-shadow: none !important;
}

.wplace-theme--classic-light .wplace-settings-close-btn {
    background: rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 50% !important;
    color: var(--wplace-text) !important;
    transition: all 0.3s ease !important;
}

.wplace-theme--classic-light .wplace-settings-close-btn:hover {
    background: rgba(220, 53, 69, 0.1) !important;
    border-color: var(--wplace-error) !important;
    box-shadow: 0 0 12px rgba(220, 53, 69, 0.3) !important;
}

/* Section titles */
.wplace-theme--classic-light .wplace-section-title {
    color: var(--wplace-highlight) !important;
    text-shadow: none !important;
    font-weight: 600 !important;
}

/* Buttons with light styling */
.wplace-theme--classic-light .wplace-btn {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 12px !important;
    color: var(--wplace-text) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    font-weight: 500 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.wplace-theme--classic-light .wplace-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    transform: translateY(-1px) !important;
}

/* Button variants with classic light colors */
.wplace-theme--classic-light .wplace-btn-start {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
    color: white !important;
    font-weight: 600 !important;
}

.wplace-theme--classic-light .wplace-btn-start:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4) !important;
}

.wplace-theme--classic-light .wplace-btn-stop {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
    color: white !important;
    font-weight: 600 !important;
}

.wplace-theme--classic-light .wplace-btn-stop:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4) !important;
}

.wplace-theme--classic-light .wplace-btn-upload {
    background: rgba(111, 66, 193, 0.1) !important;
    border: 2px dashed var(--wplace-highlight) !important;
    color: var(--wplace-highlight) !important;
}

.wplace-theme--classic-light .wplace-btn-upload:hover:not(:disabled) {
    background: rgba(111, 66, 193, 0.15) !important;
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.2) !important;
}

/* Progress bars with clean light styling */
.wplace-theme--classic-light .wplace-progress {
    background: rgba(0, 0, 0, 0.1) !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-radius: 12px !important;
}

.wplace-theme--classic-light .wplace-progress-bar {
    background: linear-gradient(135deg, #6f42c1 0%, #9370db 100%) !important;
    box-shadow: none !important;
}

.wplace-theme--classic-light .wplace-progress-bar::after {
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    ) !important;
}

/* Status indicators with light colors */
.wplace-theme--classic-light .status-success {
    background: rgba(40, 167, 69, 0.1) !important;
    border-color: var(--wplace-success) !important;
    color: var(--wplace-success) !important;
    box-shadow: 0 0 15px rgba(40, 167, 69, 0.2) !important;
    text-shadow: none !important;
}

.wplace-theme--classic-light .status-error {
    background: rgba(220, 53, 69, 0.1) !important;
    border-color: var(--wplace-error) !important;
    color: var(--wplace-error) !important;
    box-shadow: 0 0 15px rgba(220, 53, 69, 0.2) !important;
    text-shadow: none !important;
}

.wplace-theme--classic-light .status-default {
    background: rgba(111, 66, 193, 0.1) !important;
    border-color: var(--wplace-highlight) !important;
    color: var(--wplace-highlight) !important;
    text-shadow: none !important;
}

.wplace-theme--classic-light .wplace-stat-label {
    color: var(--wplace-text) !important;
    text-shadow: none !important;
    font-weight: 500 !important;
}

.wplace-theme--classic-light .wplace-stat-value {
    color: var(--wplace-highlight) !important;
    text-shadow: none !important;
    font-weight: 600 !important;
}

/* Sections with light styling */
.wplace-theme--classic-light .wplace-section {
    background: rgba(0, 0, 0, 0.03) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 12px !important;
}

.wplace-theme--classic-light .wplace-status-section {
    background: rgba(0, 0, 0, 0.03) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 12px !important;
}

.wplace-theme--classic-light .wplace-settings-section-wrapper {
    background: rgba(0, 0, 0, 0.03) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 12px !important;
}

/* Form controls with light styling */
.wplace-theme--classic-light .wplace-settings-select {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 8px !important;
    color: var(--wplace-text) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.wplace-theme--classic-light .wplace-settings-select:focus {
    border-color: var(--wplace-highlight) !important;
    box-shadow: 0 0 0 2px rgba(111, 66, 193, 0.3) !important;
}

/* Dropdown menu options */
.wplace-theme--classic-light .wplace-settings-select option {
    background: #ffffff !important;
    color: var(--wplace-text) !important;
}

.wplace-theme--classic-light .wplace-settings-option {
    background: #ffffff !important;
    color: var(--wplace-text) !important;
}

/* Sliders with classic gradient */
.wplace-theme--classic-light .wplace-speed-slider {
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;
    border-radius: 4px !important;
}

.wplace-theme--classic-light .wplace-overlay-opacity-slider {
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;
    border-radius: 4px !important;
}

.wplace-theme--classic-light .wplace-slider {
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;
    border-radius: 4px !important;
}

.wplace-theme--classic-light .wplace-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--wplace-slider-thumb-bg);
    border: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.wplace-theme--classic-light .wplace-speed-value {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    box-shadow: 0 3px 10px rgba(79, 172, 254, 0.3) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

/* Settings labels */
.wplace-theme--classic-light .wplace-settings-section-label {
    color: var(--wplace-highlight) !important;
    text-shadow: none !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
    font-weight: 600 !important;
}

/* Icon colors for classic light theme */
.wplace-theme--classic-light .wplace-icon-key {
    color: #4facfe;
}
.wplace-theme--classic-light .wplace-icon-robot {
    color: #4facfe;
}
.wplace-theme--classic-light .wplace-icon-speed {
    color: #4facfe;
}
.wplace-theme--classic-light .wplace-icon-bell {
    color: #ffc107;
}
.wplace-theme--classic-light .wplace-icon-palette {
    color: #f093fb;
}
.wplace-theme--classic-light .wplace-icon-globe {
    color: #ffeaa7;
}
.wplace-theme--classic-light .wplace-icon-paint {
    color: #4facfe;
}
.wplace-theme--classic-light .wplace-icon-eye {
    color: #6f42c1;
}

/* Clean light theme animations */
@keyframes lightShimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(200%);
    }
}

/* Turnstile/CF checkbox overlay - CRITICAL FIX */
.wplace-theme--classic-light .wplace-turnstile-overlay {
    background: rgba(255, 255, 255, 0.98) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    color: var(--wplace-text) !important;
    font-family: 'Segoe UI', Roboto, sans-serif !important;
}

.wplace-theme--classic-light .wplace-turnstile-title {
    color: var(--wplace-text) !important;
}

.wplace-theme--classic-light .wplace-turnstile-hide-btn {
    color: var(--wplace-text) !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 6px !important;
    background: rgba(0, 0, 0, 0.05) !important;
}

.wplace-theme--classic-light .wplace-turnstile-hide-btn:hover {
    background: rgba(0, 0, 0, 0.1) !important;
}

/* Color swatches with light styling */
.wplace-theme--classic-light .wplace-color-swatch {
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.wplace-theme--classic-light .wplace-color-swatch:hover {
    box-shadow: 0 4px 16px rgba(111, 66, 193, 0.3) !important;
    transform: translateY(-1px);
}

.wplace-theme--classic-light .wplace-stat-colors-grid {
    background: rgba(0, 0, 0, 0.05) !important;
    border-radius: 8px !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
`,classic:`/* WPlace Auto-Image Bot - Classic Theme */
/* Clean, modern UI with gradients and subtle effects */

.wplace-theme--classic {
    --wplace-primary: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    --wplace-secondary: linear-gradient(135deg, #111111 0%, #2a2a2a 100%);
    --wplace-accent: #222222;
    --wplace-text: #ffffff;
    --wplace-highlight: #775ce3;
    --wplace-success: #00ff00;
    --wplace-error: #ff0000;
    --wplace-warning: #ffaa00;

    --wplace-radius: 12px;
    --wplace-shadow:
        0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
    --wplace-backdrop: blur(10px);
    --wplace-font: 'Segoe UI', Roboto, sans-serif;

    --wplace-scanline: 0;
    --wplace-pixel-blink: 0;

    /* Icon colors */
    --wplace-icon-primary: #4facfe;
    --wplace-icon-secondary: #00f2fe;
    --wplace-icon-palette: #f093fb;

    /* Additional UI colors */
    --wplace-danger: #ff6a6a;
    --wplace-danger-dark: #ff4757;
    --wplace-muted-text: #ffffffbb;
    --wplace-highlight-secondary: #d3a4ff;

    /* Text variants */
    --wplace-text-secondary: rgba(255, 255, 255, 0.9);
    --wplace-text-muted: rgba(255, 255, 255, 0.7);
    --wplace-text-dim: rgba(255, 255, 255, 0.6);
    --wplace-text-faded: rgba(255, 255, 255, 0.8);

    /* Background variants */
    --wplace-bg-input: rgba(255, 255, 255, 0.15);
    --wplace-bg-subtle: rgba(255, 255, 255, 0.1);
    --wplace-bg-faint: rgba(255, 255, 255, 0.08);
    --wplace-bg-ghost: rgba(255, 255, 255, 0.06);
    --wplace-bg-whisper: rgba(255, 255, 255, 0.05);

    /* Border variants */
    --wplace-border-subtle: rgba(255, 255, 255, 0.2);
    --wplace-border-faint: rgba(255, 255, 255, 0.15);
    --wplace-border-ghost: rgba(255, 255, 255, 0.1);
    --wplace-border-ultra-faint: rgba(255, 255, 255, 0.05);

    /* Shadow variants */
    --wplace-shadow-drag:
        0 12px 40px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.2);
    --wplace-shadow-notification: 0 4px 12px rgba(0, 0, 0, 0.3);
    --wplace-shadow-slider-thumb:
        0 3px 6px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--wplace-icon-primary);
    --wplace-shadow-slider-hover:
        0 4px 8px rgba(0, 0, 0, 0.4), 0 0 0 3px var(--wplace-icon-primary);

    /* Animation colors */
    --wplace-pulse-start: rgba(0, 255, 0, 0.7);
    --wplace-pulse-mid: rgba(0, 255, 0, 0);
    --wplace-pulse-end: rgba(0, 255, 0, 0);

    /* Slider colors */
    --wplace-slider-thumb-bg: white;
    --wplace-slider-track-bg: linear-gradient(
        to right,
        #4facfe 0%,
        #00f2fe 100%
    );
}

/* Classic theme container styling */
:root #wplace-image-bot-container,
.wplace-theme--classic #wplace-image-bot-container {
    background: var(--wplace-primary);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    box-shadow: var(--wplace-shadow);
    font-family: var(--wplace-font);
    backdrop-filter: var(--wplace-backdrop);
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

:root #wplace-stats-container,
.wplace-theme--classic #wplace-stats-container {
    background: var(--wplace-primary);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    box-shadow: var(--wplace-shadow);
    font-family: var(--wplace-font);
    backdrop-filter: var(--wplace-backdrop);
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

:root #wplace-settings-container,
.wplace-theme--classic #wplace-settings-container {
    background: var(--wplace-primary);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    box-shadow: var(--wplace-shadow);
    font-family: var(--wplace-font);
    backdrop-filter: var(--wplace-backdrop);
    border: var(--wplace-border-width) var(--wplace-border-style)
        var(--wplace-border-color);
}

:root .wplace-header,
.wplace-theme--classic .wplace-header {
    background: var(--wplace-secondary);
    color: var(--wplace-highlight);
}

:root .wplace-section-title,
.wplace-theme--classic .wplace-section-title {
    color: var(--wplace-highlight);
}

:root .wplace-stat-value,
.wplace-theme--classic .wplace-stat-value {
    color: var(--wplace-highlight);
}

:root .wplace-status-section,
.wplace-theme--classic .wplace-status-section {
    border-radius: var(--wplace-radius);
}

:root .wplace-section,
.wplace-theme--classic .wplace-section {
    border-radius: var(--wplace-radius);
}

:root .wplace-stats,
.wplace-theme--classic .wplace-stats {
    border-radius: var(--wplace-radius);
}

:root .wplace-status,
.wplace-theme--classic .wplace-status {
    border-radius: var(--wplace-radius);
}

:root .wplace-alert-base,
.wplace-theme--classic .wplace-alert-base {
    border-radius: var(--wplace-radius);
}

:root .wplace-settings-container-base,
.wplace-theme--classic .wplace-settings-container-base {
    font-family: var(--wplace-font);
    border-radius: var(--wplace-radius);
    background: var(--wplace-primary);
    color: var(--wplace-text);
    box-shadow: var(--wplace-shadow);
    backdrop-filter: var(--wplace-backdrop);
}

/* Button styling for classic theme */
:root .wplace-btn,
.wplace-theme--classic .wplace-btn {
    background: linear-gradient(135deg, #222222 0%, #4a4a4a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--wplace-text);
    border-radius: var(--wplace-radius);
    font-family: var(--wplace-font);
}

:root .wplace-btn::before,
.wplace-theme--classic .wplace-btn::before {
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
    );
}

:root .wplace-btn:hover:not(:disabled),
.wplace-theme--classic .wplace-btn:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

:root .wplace-btn:disabled,
.wplace-theme--classic .wplace-btn:disabled {
    box-shadow: none !important;
}

:root .wplace-btn-overlay.active,
.wplace-theme--classic .wplace-btn-overlay.active {
    background: linear-gradient(135deg, #29b6f6 0%, #8e2de2 100%);
    box-shadow: 0 0 15px #8e2de2;
}

/* Button variants - exact upstream main colors */
:root .wplace-btn-primary,
.wplace-theme--classic .wplace-btn-primary {
    background: linear-gradient(135deg, #222222 0%, #6a5acd 100%);
    color: var(--wplace-text);
}

:root .wplace-btn-upload,
.wplace-theme--classic .wplace-btn-upload {
    background: linear-gradient(135deg, #111111 0%, #4a4a4a 100%);
    color: var(--wplace-text);
    border: 1px dashed var(--wplace-highlight) !important;
}

:root .wplace-btn-start,
.wplace-theme--classic .wplace-btn-start {
    background: linear-gradient(135deg, var(--wplace-success) 0%, #228b22 100%);
    color: white;
}

:root .wplace-btn-stop,
.wplace-theme--classic .wplace-btn-stop {
    background: linear-gradient(135deg, var(--wplace-error) 0%, #dc143c 100%);
    color: white;
}

:root .wplace-btn-select,
.wplace-theme--classic .wplace-btn-select {
    background: linear-gradient(
        135deg,
        var(--wplace-highlight) 0%,
        #9370db 100%
    );
    color: white;
}

:root .wplace-btn-file,
.wplace-theme--classic .wplace-btn-file {
    background: linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%);
    color: white;
}

:root .wplace-btn.active,
:root .wplace-btn[aria-pressed='true'],
.wplace-theme--classic .wplace-btn.active,
.wplace-theme--classic .wplace-btn[aria-pressed='true'] {
    background: var(--wplace-highlight) !important;
    color: #000000 !important;
    border-color: var(--wplace-text) !important;
    box-shadow:
        0 0 8px rgba(0, 0, 0, 0.25) inset,
        0 0 6px rgba(0, 0, 0, 0.2) !important;
}

:root .wplace-btn.active i,
:root .wplace-btn[aria-pressed='true'] i,
.wplace-theme--classic .wplace-btn.active i,
.wplace-theme--classic .wplace-btn[aria-pressed='true'] i {
    filter: drop-shadow(0 0 3px #000000);
}

:root .mask-mode-group .wplace-btn.active,
:root .mask-mode-group .wplace-btn[aria-pressed='true'],
.wplace-theme--classic .mask-mode-group .wplace-btn.active,
.wplace-theme--classic .mask-mode-group .wplace-btn[aria-pressed='true'] {
    background: var(--wplace-highlight);
    color: #000000;
    border-color: var(--wplace-text);
    box-shadow:
        0 0 8px rgba(0, 0, 0, 0.25) inset,
        0 0 6px rgba(0, 0, 0, 0.2);
}

/* Status styling for classic theme */
:root .status-default,
.wplace-theme--classic .status-default {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--wplace-text);
    color: var(--wplace-text);
}

:root .status-success,
.wplace-theme--classic .status-success {
    background: rgba(0, 255, 0, 0.1);
    border-color: var(--wplace-success);
    color: var(--wplace-success);
    box-shadow: 0 0 15px var(--wplace-success);
}

:root .status-error,
.wplace-theme--classic .status-error {
    background: rgba(255, 0, 0, 0.1);
    border-color: var(--wplace-error);
    color: var(--wplace-error);
    box-shadow: 0 0 15px var(--wplace-error);
}

:root .status-warning,
.wplace-theme--classic .status-warning {
    background: rgba(255, 165, 0, 0.1);
    border-color: var(--wplace-warning);
    color: var(--wplace-warning);
    box-shadow: 0 0 15px var(--wplace-warning);
}

:root .wplace-status.status-default,
.wplace-theme--classic .wplace-status.status-default {
    color: var(--wplace-text);
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--wplace-text);
}

/* Alert styling for classic theme */
:root .wplace-alert-info,
.wplace-theme--classic .wplace-alert-info {
    background: linear-gradient(135deg, #3498db, #2980b9);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

:root .wplace-alert-success,
.wplace-theme--classic .wplace-alert-success {
    background: linear-gradient(135deg, #27ae60, #229954);
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

:root .wplace-alert-warning,
.wplace-theme--classic .wplace-alert-warning {
    background: linear-gradient(135deg, #f39c12, #e67e22);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

:root .wplace-alert-error,
.wplace-theme--classic .wplace-alert-error {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Progress bar styling for classic theme */
:root .wplace-progress,
.wplace-theme--classic .wplace-progress {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--wplace-radius);
}

:root .wplace-progress-bar,
.wplace-theme--classic .wplace-progress-bar {
    background: linear-gradient(
        135deg,
        var(--wplace-highlight) 0%,
        #9370db 100%
    );
}

:root .wplace-progress-bar::after,
.wplace-theme--classic .wplace-progress-bar::after {
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
}

/* Header and sections styling for classic theme */
:root .wplace-header-btn,
.wplace-theme--classic .wplace-header-btn {
    background: rgba(255, 255, 255, 0.1);
    color: var(--wplace-highlight);
    border-radius: 4px;
    font-family: var(--wplace-font);
}

:root .wplace-header-btn:hover,
.wplace-theme--classic .wplace-header-btn:hover {
    background: #222222;
    color: var(--wplace-text);
}

:root .wplace-status-section,
.wplace-theme--classic .wplace-status-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

:root .wplace-section,
.wplace-theme--classic .wplace-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

:root .wplace-stats,
.wplace-theme--classic .wplace-stats {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Font and typography for classic theme */
:root .wplace-turnstile-overlay,
.wplace-theme--classic .wplace-turnstile-overlay {
    background: rgba(0, 0, 0, 0.9) !important;
    border-radius: var(--wplace-radius) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
    backdrop-filter: var(--wplace-backdrop) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
}

:root .wplace-alert-base,
.wplace-theme--classic .wplace-alert-base {
    font-family: var(--wplace-font);
}

/* Auto light/dark support for classic theme */
@media (prefers-color-scheme: light) {
    :root .theme-auto,
    .wplace-theme--classic .theme-auto {
        --wplace-primary: #ffffff;
        --wplace-secondary: #f5f5f5;
        --wplace-accent: #007acc;
        --wplace-text: #333333;
    }
}

@media (prefers-color-scheme: dark) {
    :root .theme-auto,
    .wplace-theme--classic .theme-auto {
        --wplace-primary: #1e1e1e;
        --wplace-secondary: #2d2d30;
        --wplace-accent: var(--wplace-highlight);
        --wplace-text: #ffffff;
    }
}

/* Border and color styling for classic theme */
:root .wplace-color-item-name,
.wplace-theme--classic .wplace-color-item-name {
    color: #ccc;
}

:root .wplace-color-swatch,
.wplace-theme--classic .wplace-color-swatch {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

:root .wplace-stat-color-swatch,
.wplace-theme--classic .wplace-stat-color-swatch {
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
}

:root .resize-tools button,
.wplace-theme--classic .resize-tools button {
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
}

:root .resize-slider,
.wplace-theme--classic .resize-slider {
    background: #ccc;
    border-radius: var(--wplace-radius);
}

/* Text effects and filters for classic theme */
:root .wplace-header,
.wplace-theme--classic .wplace-header {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

:root .wplace-color-swatch:not(.active),
.wplace-theme--classic .wplace-color-swatch:not(.active) {
    filter: grayscale(80%);
}

:root .wplace-color-swatch.unavailable:not(.active),
.wplace-theme--classic .wplace-color-swatch.unavailable:not(.active) {
    filter: grayscale(90%);
}

:root .wplace-color-swatch.active::after,
.wplace-theme--classic .wplace-color-swatch.active::after {
    text-shadow: 0 0 3px black;
}

/* Icon colors for classic theme */
:root .wplace-icon-key,
.wplace-theme--classic .wplace-icon-key {
    color: #4facfe;
}

:root .wplace-icon-robot,
.wplace-theme--classic .wplace-icon-robot {
    color: #4facfe;
}

:root .wplace-icon-speed,
.wplace-theme--classic .wplace-icon-speed {
    color: #4facfe;
}

:root .wplace-icon-bell,
.wplace-theme--classic .wplace-icon-bell {
    color: #ffd166;
}

:root .wplace-icon-palette,
.wplace-theme--classic .wplace-icon-palette {
    color: #f093fb;
}

:root .wplace-icon-globe,
.wplace-theme--classic .wplace-icon-globe {
    color: #ffeaa7;
}

:root .wplace-icon-paint,
.wplace-theme--classic .wplace-icon-paint {
    color: #4facfe;
}

:root .wplace-icon-eye,
.wplace-theme--classic .wplace-icon-eye {
    color: var(--wplace-highlight);
}

/* Form controls and sliders for classic theme */
:root .wplace-slider,
.wplace-theme--classic .wplace-slider {
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    border-radius: 4px;
}

:root .wplace-slider::-webkit-slider-thumb,
.wplace-theme--classic .wplace-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--wplace-slider-thumb-bg);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

:root .wplace-speed-slider,
.wplace-theme--classic .wplace-speed-slider {
    border-radius: 3px;
}

:root .wplace-speed-slider::-webkit-slider-thumb,
.wplace-theme--classic .wplace-speed-slider::-webkit-slider-thumb {
    border-radius: 50%;
    border: 2px solid;
}

:root .wplace-speed-slider::-moz-range-thumb,
.wplace-theme--classic .wplace-speed-slider::-moz-range-thumb {
    border-radius: 50%;
    border: 2px solid;
}

:root .wplace-color-swatch.unavailable,
.wplace-theme--classic .wplace-color-swatch.unavailable {
    border-color: #666;
}

:root .wplace-turnstile-title,
.wplace-theme--classic .wplace-turnstile-title {
    color: var(--wplace-text) !important;
}

:root .wplace-turnstile-hide-btn,
.wplace-theme--classic .wplace-turnstile-hide-btn {
    color: var(--wplace-text) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 6px !important;
}

:root .wplace-turnstile-hide-btn:hover,
.wplace-theme--classic .wplace-turnstile-hide-btn:hover {
    background: rgba(255, 255, 255, 0.1) !important;
}

:root .wplace-settings-select,
.wplace-theme--classic .wplace-settings-select {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

:root .wplace-settings-option,
.wplace-theme--classic .wplace-settings-option {
    background: #2d3748;
    color: white;
}

:root .wplace-stat-colors-grid,
.wplace-theme--classic .wplace-stat-colors-grid {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

:root .resize-overlay,
.wplace-theme--classic .resize-overlay {
    background: rgba(0, 0, 0, 0.8);
}

:root .wplace-overlay,
.wplace-theme--classic .wplace-overlay {
    background: rgba(0, 0, 0, 0.8);
}

:root .wplace-settings-error,
.wplace-theme--classic .wplace-settings-error {
    background: rgba(255, 0, 0, 0.4) !important;
}

/* Settings sections and batch controls for classic theme */
:root .wplace-settings-section-wrapper,
.wplace-theme--classic .wplace-settings-section-wrapper {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--wplace-radius);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

:root .wplace-batch-controls,
.wplace-theme--classic .wplace-batch-controls {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--wplace-radius);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

:root .wplace-speed-slider,
.wplace-theme--classic .wplace-speed-slider {
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    border-radius: 4px;
}

:root .wplace-overlay-opacity-slider,
.wplace-theme--classic .wplace-overlay-opacity-slider {
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    border-radius: 4px;
}

:root .wplace-speed-value,
.wplace-theme--classic .wplace-speed-value {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 8px;
    color: white;
    box-shadow: 0 3px 10px rgba(79, 172, 254, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Additional elements for classic theme */
:root .wplace-color-divider,
.wplace-theme--classic .wplace-color-divider {
    background: rgba(255, 255, 255, 0.1);
}

:root .wplace-settings-select option,
.wplace-theme--classic .wplace-settings-select option {
    background: #2d3748;
    color: white;
}

:root .wplace-settings-description,
.wplace-theme--classic .wplace-settings-description {
    color: rgba(255, 255, 255, 0.7);
}

:root .wplace-settings-apply-btn,
.wplace-theme--classic .wplace-settings-apply-btn {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    border-radius: 8px;
}

/* Resize dialog styling for classic theme */
:root .resize-container,
.wplace-theme--classic .resize-container {
    background: #000000;
    border: 1px solid #ffffff;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
`,neon:`/* WPlace Auto-Image Bot - Neon Theme */
/* Retro cyberpunk aesthetic with green neon glow effects */

.wplace-theme--neon {
    /* Neon theme colors - matching upstream main neon theme */
    --wplace-primary: #1a1a2e;
    --wplace-secondary: #16213e;
    --wplace-accent: #0f3460;
    --wplace-text: #00ff41;
    --wplace-highlight: #ff6b35;
    --wplace-success: #39ff14;
    --wplace-error: #ff073a;
    --wplace-warning: #ffff00;

    /* Neon UI properties */
    --wplace-radius: 0;
    --wplace-border-style: solid;
    --wplace-border-width: 2px;
    --wplace-border-color: #00ff41;
    --wplace-shadow:
        0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1);
    --wplace-backdrop: none;
    --wplace-font: 'Press Start 2P', monospace, 'Courier New';

    /* Z-index layers */
    --wplace-z-overlay: 10000;
    --wplace-z-alert: 10002;
    --wplace-z-settings: 10002;

    /* Feature toggles */
    --wplace-scanline: 1;
    --wplace-pixel-blink: 1;

    /* Icon colors - neon variants */
    --wplace-icon-primary: #00ff41;
    --wplace-icon-secondary: #39ff14;
    --wplace-icon-palette: #ff6b35;

    /* Additional UI colors - neon variants */
    --wplace-danger: #ff073a;
    --wplace-danger-dark: #cc0531;
    --wplace-muted-text: #00ff4180;
    --wplace-highlight-secondary: #ffaa00;

    /* Text variants - neon style */
    --wplace-text-secondary: #00ff41dd;
    --wplace-text-muted: #00ff41bb;
    --wplace-text-dim: #00ff4199;
    --wplace-text-faded: #00ff41cc;

    /* Background variants - neon style */
    --wplace-bg-input: rgba(0, 255, 65, 0.15);
    --wplace-bg-subtle: rgba(0, 255, 65, 0.08);
    --wplace-bg-faint: rgba(0, 255, 65, 0.05);
    --wplace-bg-ghost: rgba(0, 255, 65, 0.03);
    --wplace-bg-whisper: rgba(0, 255, 65, 0.02);

    /* Border variants - neon style */
    --wplace-border-subtle: rgba(0, 255, 65, 0.4);
    --wplace-border-faint: rgba(0, 255, 65, 0.25);
    --wplace-border-ghost: rgba(0, 255, 65, 0.15);
    --wplace-border-ultra-faint: rgba(0, 255, 65, 0.08);

    /* Shadow variants - neon style */
    --wplace-shadow-drag:
        0 12px 40px rgba(0, 255, 65, 0.6), 0 0 0 2px rgba(0, 255, 65, 0.8),
        0 0 20px rgba(0, 255, 65, 0.3);
    --wplace-shadow-notification:
        0 4px 12px rgba(0, 255, 65, 0.4), 0 0 15px rgba(0, 255, 65, 0.2);
    --wplace-shadow-slider-thumb:
        0 3px 6px rgba(0, 255, 65, 0.5), 0 0 0 2px var(--wplace-icon-primary),
        0 0 10px rgba(0, 255, 65, 0.3);
    --wplace-shadow-slider-hover:
        0 4px 8px rgba(0, 255, 65, 0.6), 0 0 0 3px var(--wplace-icon-primary),
        0 0 15px rgba(0, 255, 65, 0.4);

    /* Animation colors - neon style */
    --wplace-pulse-start: rgba(0, 255, 65, 0.8);
    --wplace-pulse-mid: rgba(0, 255, 65, 0);
    --wplace-pulse-end: rgba(0, 255, 65, 0);

    /* Slider colors - neon style */
    --wplace-slider-thumb-bg: #00ff41;
}

/* Neon-specific styling overrides */
.wplace-theme--neon #wplace-image-bot-container {
    background: var(--wplace-primary) !important;
    border: 2px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    box-shadow:
        0 0 20px var(--wplace-text),
        inset 0 0 20px rgba(0, 255, 65, 0.1) !important;
    font-family: var(--wplace-font) !important;
}

.wplace-theme--neon #wplace-stats-container {
    background: var(--wplace-primary) !important;
    border: 2px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    box-shadow:
        0 0 20px var(--wplace-text),
        inset 0 0 20px rgba(0, 255, 65, 0.1) !important;
    font-family: var(--wplace-font) !important;
}

.wplace-theme--neon .wplace-header {
    background: var(--wplace-secondary) !important;
    border-bottom: 1px solid var(--wplace-text) !important;
    color: var(--wplace-text) !important;
    text-shadow: 0 0 10px var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
}

.wplace-theme--neon .wplace-section {
    background: rgba(22, 33, 62, 0.5) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
}

.wplace-theme--neon .wplace-status-section {
    background: rgba(22, 33, 62, 0.5) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
}

.wplace-theme--neon .wplace-section-title {
    color: var(--wplace-text) !important;
    text-shadow: 0 0 8px var(--wplace-text) !important;
    text-transform: uppercase !important;
    font-family: var(--wplace-font) !important;
    font-size: 10px !important;
}

.wplace-theme--neon .wplace-btn {
    background: var(--wplace-secondary) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    color: var(--wplace-text) !important;
    text-shadow: 0 0 5px var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
    font-size: 9px !important;
    text-transform: uppercase !important;
}

.wplace-theme--neon .wplace-btn:hover:not(:disabled) {
    box-shadow:
        0 0 15px var(--wplace-text),
        inset 0 0 15px rgba(0, 255, 65, 0.1) !important;
    animation: neonGlow 1s ease-in-out infinite alternate !important;
}

.wplace-theme--neon .wplace-btn-start {
    background: var(--wplace-secondary) !important;
    border-color: var(--wplace-success) !important;
    color: var(--wplace-success) !important;
    text-shadow: 0 0 8px var(--wplace-success) !important;
}

.wplace-theme--neon .wplace-btn-stop {
    background: var(--wplace-secondary) !important;
    border-color: var(--wplace-error) !important;
    color: var(--wplace-error) !important;
    text-shadow: 0 0 8px var(--wplace-error) !important;
}

.wplace-theme--neon .wplace-btn-upload {
    background: var(--wplace-secondary) !important;
    border: 1px dashed var(--wplace-highlight) !important;
    color: var(--wplace-highlight) !important;
    text-shadow: 0 0 8px var(--wplace-highlight) !important;
}

.wplace-theme--neon .wplace-btn-select {
    background: var(--wplace-secondary) !important;
    border-color: var(--wplace-highlight) !important;
    color: var(--wplace-highlight) !important;
    text-shadow: 0 0 8px var(--wplace-highlight) !important;
}

.wplace-theme--neon .wplace-btn-file {
    background: var(--wplace-secondary) !important;
    border-color: var(--wplace-warning) !important;
    color: var(--wplace-warning) !important;
    text-shadow: 0 0 8px var(--wplace-warning) !important;
}

.wplace-theme--neon .wplace-progress {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
}

.wplace-theme--neon .wplace-progress-bar {
    background: linear-gradient(
        90deg,
        var(--wplace-success) 0%,
        var(--wplace-text) 100%
    ) !important;
    box-shadow: 0 0 10px var(--wplace-success) !important;
}

.wplace-theme--neon .wplace-stat-value {
    color: var(--wplace-text) !important;
    text-shadow: 0 0 5px var(--wplace-text) !important;
}

.wplace-theme--neon .status-success {
    background: rgba(57, 255, 20, 0.1) !important;
    border-color: var(--wplace-success) !important;
    color: var(--wplace-success) !important;
    box-shadow: 0 0 15px var(--wplace-success) !important;
    text-shadow: 0 0 8px var(--wplace-success) !important;
}

.wplace-theme--neon .status-error {
    background: rgba(255, 7, 58, 0.1) !important;
    border-color: var(--wplace-error) !important;
    color: var(--wplace-error) !important;
    box-shadow: 0 0 15px var(--wplace-error) !important;
    text-shadow: 0 0 8px var(--wplace-error) !important;
}

.wplace-theme--neon .status-default {
    background: rgba(0, 255, 65, 0.1) !important;
    border-color: var(--wplace-text) !important;
    color: var(--wplace-text) !important;
    text-shadow: 0 0 5px var(--wplace-text) !important;
}

/* Settings dialog neon styling */
.wplace-theme--neon #wplace-settings-container {
    background: var(--wplace-primary) !important;
    border: 2px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    box-shadow:
        0 0 30px var(--wplace-text),
        inset 0 0 30px rgba(0, 255, 65, 0.1) !important;
    font-family: var(--wplace-font) !important;
}

.wplace-theme--neon .wplace-settings-header {
    background: var(--wplace-secondary) !important;
    border-bottom: 1px solid var(--wplace-text) !important;
}

.wplace-theme--neon .wplace-settings-header h3 {
    color: var(--wplace-text) !important;
    text-shadow: 0 0 10px var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
    font-size: 16px !important;
    text-transform: uppercase !important;
}

.wplace-theme--neon .wplace-settings-close-btn {
    background: var(--wplace-secondary) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    color: var(--wplace-text) !important;
}

.wplace-theme--neon .wplace-settings-close-btn:hover {
    background: var(--wplace-error) !important;
    box-shadow: 0 0 15px var(--wplace-error) !important;
}

.wplace-theme--neon .wplace-settings-section-wrapper {
    background: rgba(22, 33, 62, 0.3) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
}

.wplace-theme--neon .wplace-settings-select {
    background: var(--wplace-secondary) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    color: var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
    font-size: 11px !important;
}

.wplace-theme--neon .wplace-settings-section-label {
    color: var(--wplace-text) !important;
    text-shadow: 0 0 8px var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
    font-size: 12px !important;
    text-transform: uppercase !important;
}

.wplace-theme--neon .wplace-speed-value {
    background: var(--wplace-secondary) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    color: var(--wplace-text) !important;
    text-shadow: 0 0 8px var(--wplace-text) !important;
    font-family: var(--wplace-font) !important;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.3) !important;
}

.wplace-theme--neon .wplace-overlay-opacity-value {
    background: var(--wplace-secondary) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    color: var(--wplace-text) !important;
    text-shadow: 0 0 5px var(--wplace-text) !important;
}

/* Neon slider styling */
.wplace-theme--neon .wplace-slider,
.wplace-theme--neon .wplace-speed-slider,
.wplace-theme--neon .wplace-overlay-opacity-slider {
    background: var(--wplace-secondary) !important;
    border: 1px solid var(--wplace-text) !important;
    border-radius: 0 !important;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.3) !important;
}

.wplace-theme--neon .wplace-slider::-webkit-slider-thumb,
.wplace-theme--neon .wplace-speed-slider::-webkit-slider-thumb,
.wplace-theme--neon .wplace-overlay-opacity-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 0 !important;
    background: var(--wplace-slider-thumb-bg) !important;
    border: 2px solid var(--wplace-text) !important;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0 8px rgba(0, 255, 65, 0.5) !important;
}

.wplace-theme--neon .wplace-slider::-webkit-slider-thumb:hover,
.wplace-theme--neon .wplace-speed-slider::-webkit-slider-thumb:hover,
.wplace-theme--neon .wplace-overlay-opacity-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px var(--wplace-text) !important;
}

/* Scanline animation for neon theme */
.wplace-theme--neon #wplace-image-bot-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
        90deg,
        transparent,
        var(--wplace-text),
        transparent
    );
    z-index: 1;
    pointer-events: none;
    animation: scanline 3s linear infinite;
    opacity: 0.7;
}

.wplace-theme--neon #wplace-stats-container {
    position: fixed !important;
    overflow: hidden !important;
    z-index: 9998 !important;
}

.wplace-theme--neon #wplace-stats-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
        90deg,
        transparent,
        var(--wplace-text),
        transparent
    );
    z-index: 1;
    pointer-events: none;
    animation: scanlineStats 4s linear infinite;
    opacity: 0.7;
}

/* Pixel blinking animation for buttons */
.wplace-theme--neon .wplace-btn:hover:not(:disabled) {
    animation:
        pixelBlink 0.5s infinite,
        neonGlow 1s ease-in-out infinite alternate;
}

/* Text glow animations */
@keyframes neonGlow {
    0%,
    100% {
        text-shadow:
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 15px currentColor;
    }
    50% {
        text-shadow:
            0 0 2px currentColor,
            0 0 5px currentColor,
            0 0 8px currentColor;
    }
}

@keyframes pixelBlink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0.7;
    }
}

@keyframes scanline {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(400px);
    }
}

@keyframes scanlineStats {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(300px);
    }
}

/* Resize dialog styling for neon theme */
.wplace-theme--neon .resize-container {
    background: #1a1a2e !important;
    border: 3px solid #00ff41 !important;
    border-radius: 0 !important;
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.5) !important;
    font-family: 'Press Start 2P', monospace !important;
}
`},Ca={en:{title:"WPlace Auto-Image",toggleOverlay:"Toggle Overlay",scanColors:"Scan Colors",uploadImage:"Upload Image",resizeImage:"Resize Image",selectPosition:"Select Position",startPainting:"Start Painting",stopPainting:"Stop Painting",checkingColors:"\u{1F50D} Checking available colors...",noColorsFound:"\u274C Open the color palette on the site and try again!",colorsFound:"\u2705 {count} available colors found. Ready to upload.",loadingImage:"\u{1F5BC}\uFE0F Loading image...",imageLoaded:"\u2705 Image loaded with {count} valid pixels",imageError:"\u274C Error loading image",selectPositionAlert:"Paint the first pixel at the location where you want the art to start!",waitingPosition:"\u{1F446} Waiting for you to paint the reference pixel...",positionSet:"\u2705 Position set successfully!",positionTimeout:"\u274C Timeout for position selection",startPaintingMsg:"\u{1F3A8} Starting painting...",paintingProgress:"\u{1F9F1} Progress: {painted}/{total} pixels...",noCharges:"\u231B No charges. Waiting {time}...",paintingStopped:"\u23F9\uFE0F Painting stopped by user",paintingComplete:"\u2705 Painting complete! {count} pixels painted.",paintingError:"\u274C Error during painting",missingRequirements:"\u274C Load an image and select a position first",progress:"Progress",pixels:"Pixels",charges:"Charges",estimatedTime:"Estimated time",initMessage:"Click 'Upload Image' to begin",waitingInit:"Waiting for initialization...",initializingToken:"\u{1F527} Initializing Turnstile token generator...",tokenReady:"\u2705 Token generator ready - you can now start painting!",tokenRetryLater:"\u26A0\uFE0F Token generator will retry when needed",resizeSuccess:"\u2705 Image resized to {width}x{height}",paintingPaused:"\u23F8\uFE0F Painting paused at position X: {x}, Y: {y}",captchaNeeded:"\u2757 Token generation failed. Please try again in a moment.",saveData:"Save Progress",loadData:"Load Progress",saveToFile:"Save to File",loadFromFile:"Load from File",dataManager:"Data Manager",autoSaved:"\u2705 Progress saved automatically",dataLoaded:"\u2705 Progress loaded successfully",fileSaved:"\u2705 Progress saved to file successfully",fileLoaded:"\u2705 Progress loaded from file successfully",noSavedData:"\u274C No saved progress found",savedDataFound:"\u2705 Saved progress found! Load to continue?",savedDate:"Saved on: {date}",clickLoadToContinue:"Click 'Load Progress' to continue.",fileError:"\u274C Error processing file",invalidFileFormat:"\u274C Invalid file format",paintingSpeed:"Painting Speed",pixelsPerSecond:"pixels/second",speedSetting:"Speed: {speed} pixels/sec",settings:"Settings",botSettings:"Bot Settings",close:"Close",language:"Language",themeSettings:"Theme Settings",themeSettingsDesc:"Choose your preferred color theme for the interface.",languageSelectDesc:"Select your preferred language. Changes will take effect immediately.",autoCaptcha:"Auto-CAPTCHA Solver (Turnstile)",autoCaptchaDesc:"Automatically generates Turnstile tokens using integrated generator. Falls back to browser automation if needed.",applySettings:"Apply Settings",settingsSaved:"\u2705 Settings saved successfully!",speedOn:"On",speedOff:"Off",cooldownSettings:"Cooldown Settings",waitCharges:"Wait until charges reach",captchaSolving:"\u{1F511} Generating Turnstile token...",captchaFailed:"\u274C Turnstile token generation failed. Trying fallback method...",automation:"Automation",noChargesThreshold:"\u231B Waiting for charges to reach {threshold}. Currently {current}. Next in {time}...",tokenCapturedSuccess:"Token captured successfully! You can start the bot now.",notificationsNotSupported:"Notifications are not supported in this browser.",chargesReadyNotification:"WPlace \u2014 Charges Ready",chargesReadyMessage:"Charges ready: {current} / {max}. Threshold: {threshold}.",testNotificationTitle:"WPlace \u2014 Test",testNotificationMessage:"This is a test notification.",showStats:"Show Stats",compactMode:"Compact Mode",refreshCharges:"Refresh Charges",closeStats:"Close Stats",zoomOut:"Zoom Out",zoomIn:"Zoom In",fitToView:"Fit to view",actualSize:"Actual size (100%)",panMode:"Pan (drag to move view)",clearIgnoredPixels:"Clear all ignored pixels",invertMask:"Invert mask",waitingSetupComplete:"\u{1F504} Waiting for initial setup to complete...",waitingTokenGenerator:"\u{1F504} Waiting for token generator to initialize...",uploadImageFirst:"Upload an image first to capture available colors",pleaseWaitInitialSetup:"\u{1F504} Please wait for the initial setup to complete before loading progress.",pleaseWaitFileSetup:"\u{1F504} Please wait for the initial setup to complete before loading from file.",errorSavingProgress:"\u274C Error saving progress",errorLoadingProgress:"\u274C Error loading progress",fileOperationsAvailable:"\u{1F4C2} File operations (Load/Upload) are now available!",tokenGeneratorReady:"\u{1F511} Token generator ready!",paintingStats:"Painting Stats",enablePaintingSpeedLimit:"Enable painting speed limit (batch size control)",enableNotifications:"Enable notifications",notifyOnChargesThreshold:"Notify when charges reach threshold",onlyWhenNotFocused:"Only when tab is not focused",repeatEvery:"Repeat every",minutesPl:"minute(s)",grantPermission:"Grant Permission",test:"Test",showAllColorsIncluding:"Show All Colors (including unavailable)",chromaWeight:"Chroma Weight",downloadPreview:"Download Preview",apply:"Apply",cancel:"Cancel",fit:"Fit",hundred:"100%",clear:"Clear",invert:"Invert",reprocessingOverlay:"Re-processing overlay...",overlayUpdated:"Overlay updated!",notificationsEnabled:"Notifications enabled.",notificationsPermissionDenied:"Notifications permission denied.",overlayEnabled:"Overlay enabled.",overlayDisabled:"Overlay disabled.",tokenSourceSet:"Token source set to: {source}",batchModeSet:"Batch mode set to: {mode}",randomRange:"Random Range",normalFixedSize:"Normal Fixed Size",advancedColorSettingsReset:"Advanced color settings reset.",shiftRowAltColumn:"Shift = Row \u2022 Alt = Column",hideTurnstileBtn:"Hide",turnstileInstructions:"Cloudflare Turnstile \u2014 please complete the check if shown",uploadImageFirstColors:"Please upload an image first to capture available colors",availableColors:"Available Colors ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Expand Mode",minimize:"Minimize",restore:"Restore",hideStats:"Hide Stats",paintOptions:"Paint Options",paintWhitePixels:"Paint White Pixels",paintTransparentPixels:"Paint Transparent Pixels"},fr:{title:"WPlace Auto-Image",toggleOverlay:"Basculer l'overlay",scanColors:"Scanner les couleurs",uploadImage:"T\xE9l\xE9charger l'image",resizeImage:"Redimensionner l'image",selectPosition:"S\xE9lectionner la position",startPainting:"Commencer \xE0 peindre",stopPainting:"Arr\xEAter de peindre",checkingColors:"\u{1F50D} V\xE9rification des couleurs disponibles...",noColorsFound:"\u274C Ouvrez la palette de couleurs sur le site et r\xE9essayez!",colorsFound:"\u2705 {count} couleurs trouv\xE9es. Pr\xEAt \xE0 t\xE9l\xE9charger.",loadingImage:"\u{1F5BC}\uFE0F Chargement de l'image...",imageLoaded:"\u2705 Image charg\xE9e avec {count} pixels valides",imageError:"\u274C Erreur lors du chargement de l'image",selectPositionAlert:"Peignez le premier pixel \xE0 l'endroit o\xF9 vous voulez que l'art commence!",waitingPosition:"\u{1F446} En attente que vous peigniez le pixel de r\xE9f\xE9rence...",positionSet:"\u2705 Position d\xE9finie avec succ\xE8s!",positionTimeout:"\u274C D\xE9lai d'attente pour la s\xE9lection de position",startPaintingMsg:"\u{1F3A8} D\xE9but de la peinture...",paintingProgress:"\u{1F9F1} Progr\xE8s: {painted}/{total} pixels...",noCharges:"\u231B Aucune charge. En attente {time}...",paintingStopped:"\u23F9\uFE0F Peinture arr\xEAt\xE9e par l'utilisateur",paintingComplete:"\u2705 Peinture termin\xE9e! {count} pixels peints.",paintingError:"\u274C Erreur pendant la peinture",missingRequirements:"\u274C Veuillez charger une image et s\xE9lectionner une position d'abord",progress:"Progr\xE8s",pixels:"Pixels",charges:"Charges",estimatedTime:"Temps estim\xE9",initMessage:"Cliquez sur 'T\xE9l\xE9charger l'image' pour commencer",waitingInit:"En attente d'initialisation...",initializingToken:"\u{1F527} Initialisation du g\xE9n\xE9rateur de tokens Turnstile...",tokenReady:"\u2705 G\xE9n\xE9rateur de tokens pr\xEAt - vous pouvez commencer \xE0 peindre!",tokenRetryLater:"\u26A0\uFE0F Le g\xE9n\xE9rateur de tokens r\xE9essaiera si n\xE9cessaire",resizeSuccess:"\u2705 Image redimensionn\xE9e en {width}x{height}",paintingPaused:"\u23F8\uFE0F Peinture en pause \xE0 la position X: {x}, Y: {y}",captchaNeeded:"\u2757 \xC9chec de la g\xE9n\xE9ration de token. Veuillez r\xE9essayer dans un moment.",saveData:"Sauvegarder le progr\xE8s",loadData:"Charger le progr\xE8s",saveToFile:"Sauvegarder dans un fichier",loadFromFile:"Charger depuis un fichier",dataManager:"Donn\xE9es",autoSaved:"\u2705 Progr\xE8s sauvegard\xE9 automatiquement",dataLoaded:"\u2705 Progr\xE8s charg\xE9 avec succ\xE8s",fileSaved:"\u2705 Sauvegard\xE9 dans un fichier avec succ\xE8s",fileLoaded:"\u2705 Charg\xE9 depuis un fichier avec succ\xE8s",noSavedData:"\u274C Aucun progr\xE8s sauvegard\xE9 trouv\xE9",savedDataFound:"\u2705 Progr\xE8s sauvegard\xE9 trouv\xE9! Charger pour continuer?",savedDate:"Sauvegard\xE9 le: {date}",clickLoadToContinue:"Cliquez sur 'Charger le progr\xE8s' pour continuer.",fileError:"\u274C Erreur lors du traitement du fichier",invalidFileFormat:"\u274C Format de fichier invalide",paintingSpeed:"Vitesse de peinture",pixelsPerSecond:"pixels/seconde",speedSetting:"Vitesse: {speed} pixels/sec",settings:"Param\xE8tres",botSettings:"Param\xE8tres du Bot",close:"Fermer",language:"Langue",themeSettings:"Param\xE8tres de Th\xE8me",themeSettingsDesc:"Choisissez votre th\xE8me de couleurs pr\xE9f\xE9r\xE9 pour l'interface.",languageSelectDesc:"S\xE9lectionnez votre langue pr\xE9f\xE9r\xE9e. Les changements prendront effet imm\xE9diatement.",autoCaptcha:"R\xE9solveur de CAPTCHA automatique (Turnstile)",autoCaptchaDesc:"G\xE9n\xE8re automatiquement des jetons Turnstile en utilisant le g\xE9n\xE9rateur int\xE9gr\xE9. Se replie sur l'automatisation du navigateur si n\xE9cessaire.",applySettings:"Appliquer les param\xE8tres",settingsSaved:"\u2705 Param\xE8tres enregistr\xE9s avec succ\xE8s !",speedOn:"Activ\xE9",speedOff:"D\xE9sactiv\xE9",cooldownSettings:"Param\xE8tres de recharge",waitCharges:"Attendre que les charges atteignent",captchaSolving:"\u{1F511} G\xE9n\xE9ration du jeton Turnstile...",captchaFailed:"\u274C \xC9chec de g\xE9n\xE9ration du jeton Turnstile. Tentative de m\xE9thode alternative...",automation:"Automatisation",noChargesThreshold:"\u231B En attente que les charges atteignent {threshold}. Actuel: {current}. Prochaine dans {time}...",tokenCapturedSuccess:"Jeton captur\xE9 avec succ\xE8s ! Vous pouvez d\xE9marrer le bot maintenant.",notificationsNotSupported:"Les notifications ne sont pas support\xE9es dans ce navigateur.",chargesReadyNotification:"WPlace \u2014 Charges Pr\xEAtes",chargesReadyMessage:"Charges pr\xEAtes : {current} / {max}. Seuil : {threshold}.",testNotificationTitle:"WPlace \u2014 Test",testNotificationMessage:"Ceci est une notification de test.",showStats:"Afficher les Stats",compactMode:"Mode Compact",refreshCharges:"Actualiser les Charges",closeStats:"Fermer les Stats",zoomOut:"D\xE9zoomer",zoomIn:"Zoomer",fitToView:"Ajuster \xE0 la vue",actualSize:"Taille r\xE9elle (100%)",panMode:"Panoramique (glisser pour d\xE9placer la vue)",clearIgnoredPixels:"Effacer tous les pixels ignor\xE9s",invertMask:"Inverser le masque",waitingSetupComplete:"\u{1F504} En attente de la fin de l'installation initiale...",waitingTokenGenerator:"\u{1F504} En attente de l'initialisation du g\xE9n\xE9rateur de jetons...",uploadImageFirst:"T\xE9l\xE9chargez d'abord une image pour capturer les couleurs disponibles",pleaseWaitInitialSetup:"\u{1F504} Veuillez attendre la fin de l'installation initiale avant de charger les progr\xE8s.",pleaseWaitFileSetup:"\u{1F504} Veuillez attendre la fin de l'installation initiale avant de charger depuis un fichier.",errorSavingProgress:"\u274C Erreur lors de la sauvegarde des progr\xE8s",errorLoadingProgress:"\u274C Erreur lors du chargement des progr\xE8s",fileOperationsAvailable:"\u{1F4C2} Les op\xE9rations sur fichiers (Charger/T\xE9l\xE9charger) sont maintenant disponibles !",tokenGeneratorReady:"\u{1F511} G\xE9n\xE9rateur de jetons pr\xEAt !",paintingStats:"Statistiques de Peinture",enablePaintingSpeedLimit:"Activer la limite de vitesse de peinture (contr\xF4le de la taille de lot)",enableNotifications:"Activer les notifications",notifyOnChargesThreshold:"Notifier quand les charges atteignent le seuil",onlyWhenNotFocused:"Seulement quand l'onglet n'est pas au premier plan",repeatEvery:"R\xE9p\xE9ter toutes les",minutesPl:"minute(s)",grantPermission:"Accorder la Permission",test:"Test",showAllColorsIncluding:"Afficher toutes les couleurs (y compris indisponibles)",chromaWeight:"Poids de Chrominance",downloadPreview:"T\xE9l\xE9charger l'Aper\xE7u",apply:"Appliquer",cancel:"Annuler",fit:"Ajuster",hundred:"100%",clear:"Effacer",invert:"Inverser",reprocessingOverlay:"Retraitement de l'overlay...",overlayUpdated:"Overlay mis \xE0 jour !",notificationsEnabled:"Notifications activ\xE9es.",notificationsPermissionDenied:"Permission de notifications refus\xE9e.",overlayEnabled:"Overlay activ\xE9.",overlayDisabled:"Overlay d\xE9sactiv\xE9.",tokenSourceSet:"Source de jeton d\xE9finie \xE0 : {source}",batchModeSet:"Mode lot d\xE9fini \xE0 : {mode}",randomRange:"Plage Al\xE9atoire",normalFixedSize:"Taille Fixe Normale",advancedColorSettingsReset:"Param\xE8tres de couleur avanc\xE9s r\xE9initialis\xE9s.",shiftRowAltColumn:"Shift = Ligne \u2022 Alt = Colonne",hideTurnstileBtn:"Masquer",turnstileInstructions:"Cloudflare Turnstile \u2014 veuillez compl\xE9ter la v\xE9rification si affich\xE9e",uploadImageFirstColors:"Veuillez d'abord t\xE9l\xE9charger une image pour capturer les couleurs disponibles",availableColors:"Couleurs Disponibles ({count})",colorTooltip:`ID : {id}
RVB : {rgb}`,expandMode:"Mode \xC9tendu",minimize:"R\xE9duire",restore:"Restaurer",hideStats:"Masquer les Stats",paintOptions:"Options de peinture",paintWhitePixels:"Peindre les pixels blancs",paintTransparentPixels:"Peindre les pixels transparents"},id:{title:"WPlace Auto-Image",toggleOverlay:"Toggle Overlay",scanColors:"Pindai Warna",uploadImage:"Unggah Gambar",resizeImage:"Ubah Ukuran Gambar",selectPosition:"Pilih Posisi",startPainting:"Mulai Melukis",stopPainting:"Berhenti Melukis",checkingColors:"\u{1F50D} Memeriksa warna yang tersedia...",noColorsFound:"\u274C Buka palet warna di situs dan coba lagi!",colorsFound:"\u2705 {count} warna ditemukan. Siap untuk diunggah.",loadingImage:"\u{1F5BC}\uFE0F Memuat gambar...",imageLoaded:"\u2705 Gambar dimuat dengan {count} piksel valid",imageError:"\u274C Kesalahan saat memuat gambar",selectPositionAlert:"Lukis piksel pertama di lokasi tempat karya seni akan dimulai!",waitingPosition:"\u{1F446} Menunggu Anda melukis piksel referensi...",positionSet:"\u2705 Posisi berhasil diatur!",positionTimeout:"\u274C Waktu habis untuk memilih posisi",startPaintingMsg:"\u{1F3A8} Mulai melukis...",paintingProgress:"\u{1F9F1} Progres: {painted}/{total} piksel...",noCharges:"\u231B Tidak ada muatan. Menunggu {time}...",paintingStopped:"\u23F9\uFE0F Melukis dihentikan oleh pengguna",paintingComplete:"\u2705 Melukis selesai! {count} piksel telah dilukis.",paintingError:"\u274C Kesalahan selama melukis",missingRequirements:"\u274C Unggah gambar dan pilih posisi terlebih dahulu",progress:"Progres",pixels:"Piksel",charges:"Muatan",estimatedTime:"Perkiraan waktu",initMessage:"Klik 'Unggah Gambar' untuk memulai",waitingInit:"Menunggu inisialisasi...",initializingToken:"\u{1F527} Menginisialisasi generator token Turnstile...",tokenReady:"\u2705 Generator token siap - Anda bisa mulai melukis!",tokenRetryLater:"\u26A0\uFE0F Generator token akan mencoba lagi saat diperlukan",resizeSuccess:"\u2705 Gambar berhasil diubah ukurannya menjadi {width}x{height}",paintingPaused:"\u23F8\uFE0F Melukis dijeda di posisi X: {x}, Y: {y}",captchaNeeded:"\u2757 Pembuatan token gagal. Silakan coba lagi sebentar lagi.",saveData:"Simpan Progres",loadData:"Muat Progres",saveToFile:"Simpan ke File",loadFromFile:"Muat dari File",dataManager:"Data",autoSaved:"\u2705 Progres disimpan secara otomatis",dataLoaded:"\u2705 Progres berhasil dimuat",fileSaved:"\u2705 Berhasil disimpan ke file",fileLoaded:"\u2705 Berhasil dimuat dari file",noSavedData:"\u274C Tidak ditemukan progres yang disimpan",savedDataFound:"\u2705 Progres yang disimpan ditemukan! Muat untuk melanjutkan?",savedDate:"Disimpan pada: {date}",clickLoadToContinue:"Klik 'Muat Progres' untuk melanjutkan.",fileError:"\u274C Kesalahan saat memproses file",invalidFileFormat:"\u274C Format file tidak valid",paintingSpeed:"Kecepatan Melukis",pixelsPerSecond:"piksel/detik",speedSetting:"Kecepatan: {speed} piksel/detik",settings:"Pengaturan",botSettings:"Pengaturan Bot",close:"Tutup",language:"Bahasa",themeSettings:"Pengaturan Tema",themeSettingsDesc:"Pilih tema warna favorit Anda untuk antarmuka.",languageSelectDesc:"Pilih bahasa yang Anda inginkan. Perubahan akan berlaku segera.",autoCaptcha:"Penyelesai CAPTCHA Otomatis",autoCaptchaDesc:"Mencoba menyelesaikan CAPTCHA secara otomatis dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",applySettings:"Terapkan Pengaturan",settingsSaved:"\u2705 Pengaturan berhasil disimpan!",speedOn:"Nyala",speedOff:"Mati",cooldownSettings:"Pengaturan Cooldown",waitCharges:"Tunggu hingga muatan mencapai",captchaSolving:"\u{1F916} Mencoba menyelesaikan CAPTCHA...",captchaFailed:"\u274C Gagal menyelesaikan CAPTCHA. Lukis satu piksel secara manual.",automation:"Automasi",noChargesThreshold:"\u231B Menunggu muatan mencapai {threshold}. Saat ini: {current}. Berikutnya dalam {time}...",tokenCapturedSuccess:"Token berhasil ditangkap! Anda bisa memulai bot sekarang.",notificationsNotSupported:"Notifikasi tidak didukung di browser ini.",chargesReadyNotification:"WPlace \u2014 Muatan Siap",chargesReadyMessage:"Muatan siap: {current} / {max}. Batas: {threshold}.",testNotificationTitle:"WPlace \u2014 Tes",testNotificationMessage:"Ini adalah notifikasi tes.",showStats:"Tampilkan Statistik",compactMode:"Mode Kompak",refreshCharges:"Segarkan Muatan",closeStats:"Tutup Statistik",zoomOut:"Perkecil",zoomIn:"Perbesar",fitToView:"Sesuaikan tampilan",actualSize:"Ukuran sebenarnya (100%)",panMode:"Geser (seret untuk memindahkan tampilan)",clearIgnoredPixels:"Bersihkan semua piksel yang diabaikan",invertMask:"Balik masker",waitingSetupComplete:"\u{1F504} Menunggu pengaturan awal selesai...",waitingTokenGenerator:"\u{1F504} Menunggu generator token diinisialisasi...",uploadImageFirst:"Unggah gambar terlebih dahulu untuk menangkap warna yang tersedia",pleaseWaitInitialSetup:"\u{1F504} Harap tunggu pengaturan awal selesai sebelum memuat progres.",pleaseWaitFileSetup:"\u{1F504} Harap tunggu pengaturan awal selesai sebelum memuat dari file.",errorSavingProgress:"\u274C Kesalahan menyimpan progres",errorLoadingProgress:"\u274C Kesalahan memuat progres",fileOperationsAvailable:"\u{1F4C2} Operasi file (Muat/Unggah) sekarang tersedia!",tokenGeneratorReady:"\u{1F511} Generator token siap!",paintingStats:"Statistik Melukis",enablePaintingSpeedLimit:"Aktifkan batas kecepatan melukis (kontrol ukuran batch)",enableNotifications:"Aktifkan notifikasi",notifyOnChargesThreshold:"Beri tahu saat muatan mencapai batas",onlyWhenNotFocused:"Hanya saat tab tidak difokuskan",repeatEvery:"Ulangi setiap",minutesPl:"menit",grantPermission:"Berikan Izin",test:"Tes",showAllColorsIncluding:"Tampilkan Semua Warna (termasuk yang tidak tersedia)",chromaWeight:"Bobot Kroma",downloadPreview:"Unduh Pratinjau",apply:"Terapkan",cancel:"Batal",fit:"Sesuaikan",hundred:"100%",clear:"Bersihkan",invert:"Balik",reprocessingOverlay:"Memproses ulang overlay...",overlayUpdated:"Overlay diperbarui!",notificationsEnabled:"Notifikasi diaktifkan.",notificationsPermissionDenied:"Izin notifikasi ditolak.",overlayEnabled:"Overlay diaktifkan.",overlayDisabled:"Overlay dinonaktifkan.",tokenSourceSet:"Sumber token diatur ke: {source}",batchModeSet:"Mode batch diatur ke: {mode}",randomRange:"Rentang Acak",normalFixedSize:"Ukuran Tetap Normal",advancedColorSettingsReset:"Pengaturan warna lanjutan direset.",shiftRowAltColumn:"Shift = Baris \u2022 Alt = Kolom",hideTurnstileBtn:"Sembunyikan",turnstileInstructions:"Cloudflare Turnstile \u2014 harap selesaikan pemeriksaan jika ditampilkan",uploadImageFirstColors:"Harap unggah gambar terlebih dahulu untuk menangkap warna yang tersedia",availableColors:"Warna Tersedia ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Mode Perluas",minimize:"Minimalkan",restore:"Pulihkan",hideStats:"Sembunyikan Statistik",paintOptions:"Opsi Pewarnaan",paintWhitePixels:"Warnai piksel putih",paintTransparentPixels:"Warnai piksel transparan"},ja:{title:"WPlace \u81EA\u52D5\u753B\u50CF",toggleOverlay:"\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u5207\u66FF",scanColors:"\u8272\u3092\u30B9\u30AD\u30E3\u30F3",uploadImage:"\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",resizeImage:"\u753B\u50CF\u30B5\u30A4\u30BA\u5909\u66F4",selectPosition:"\u4F4D\u7F6E\u3092\u9078\u629E",startPainting:"\u63CF\u753B\u958B\u59CB",stopPainting:"\u63CF\u753B\u505C\u6B62",checkingColors:"\u{1F50D} \u5229\u7528\u53EF\u80FD\u306A\u8272\u3092\u78BA\u8A8D\u4E2D...",noColorsFound:"\u274C \u30B5\u30A4\u30C8\u3067\u30AB\u30E9\u30FC\u30D1\u30EC\u30C3\u30C8\u3092\u958B\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\uFF01",colorsFound:"\u2705 \u5229\u7528\u53EF\u80FD\u306A\u8272 {count} \u4EF6\u3092\u691C\u51FA\u3002\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u3002",loadingImage:"\u{1F5BC}\uFE0F \u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",imageLoaded:"\u2705 \u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\u3002\u6709\u52B9\u306A\u30D4\u30AF\u30BB\u30EB {count}",imageError:"\u274C \u753B\u50CF\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC",selectPositionAlert:"\u4F5C\u54C1\u3092\u958B\u59CB\u3057\u305F\u3044\u4F4D\u7F6E\u306B\u6700\u521D\u306E\u30D4\u30AF\u30BB\u30EB\u3092\u7F6E\u3044\u3066\u304F\u3060\u3055\u3044\uFF01",waitingPosition:"\u{1F446} \u53C2\u7167\u30D4\u30AF\u30BB\u30EB\u306E\u63CF\u753B\u3092\u5F85\u3063\u3066\u3044\u307E\u3059...",positionSet:"\u2705 \u4F4D\u7F6E\u3092\u8A2D\u5B9A\u3057\u307E\u3057\u305F\uFF01",positionTimeout:"\u274C \u4F4D\u7F6E\u9078\u629E\u306E\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8",startPaintingMsg:"\u{1F3A8} \u63CF\u753B\u3092\u958B\u59CB...",paintingProgress:"\u{1F9F1} \u9032\u6357: {painted}/{total} \u30D4\u30AF\u30BB\u30EB...",noCharges:"\u231B \u30C1\u30E3\u30FC\u30B8\u306A\u3057\u3002{time} \u5F85\u6A5F...",paintingStopped:"\u23F9\uFE0F \u30E6\u30FC\u30B6\u30FC\u306B\u3088\u308A\u505C\u6B62\u3055\u308C\u307E\u3057\u305F",paintingComplete:"\u2705 \u63CF\u753B\u5B8C\u4E86\uFF01 {count} \u30D4\u30AF\u30BB\u30EB\u63CF\u753B\u3002",paintingError:"\u274C \u63CF\u753B\u4E2D\u306B\u30A8\u30E9\u30FC",missingRequirements:"\u274C \u5148\u306B\u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u4F4D\u7F6E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",progress:"\u9032\u6357",pixels:"\u30D4\u30AF\u30BB\u30EB",charges:"\u30C1\u30E3\u30FC\u30B8",estimatedTime:"\u63A8\u5B9A\u6642\u9593",initMessage:"\u300C\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u300D\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u958B\u59CB",waitingInit:"\u521D\u671F\u5316\u5F85\u6A5F\u4E2D...",initializingToken:"\u{1F527} Turnstile \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u5668\u3092\u521D\u671F\u5316\u4E2D...",tokenReady:"\u2705 \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u5668\u6E96\u5099\u5B8C\u4E86 - \u63CF\u753B\u3067\u304D\u307E\u3059\uFF01",tokenRetryLater:"\u26A0\uFE0F \u5FC5\u8981\u306B\u5FDC\u3058\u3066\u518D\u8A66\u884C\u3057\u307E\u3059",resizeSuccess:"\u2705 \u753B\u50CF\u3092 {width}x{height} \u306B\u30EA\u30B5\u30A4\u30BA",paintingPaused:"\u23F8\uFE0F X: {x}, Y: {y} \u3067\u4E00\u6642\u505C\u6B62",captchaNeeded:"\u2757 \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u306B\u5931\u6557\u3002\u5C11\u3057\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",saveData:"\u9032\u6357\u3092\u4FDD\u5B58",loadData:"\u9032\u6357\u3092\u8AAD\u307F\u8FBC\u307F",saveToFile:"\u30D5\u30A1\u30A4\u30EB\u3078\u4FDD\u5B58",loadFromFile:"\u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u307F",dataManager:"\u30C7\u30FC\u30BF\u7BA1\u7406",autoSaved:"\u2705 \u81EA\u52D5\u4FDD\u5B58\u3057\u307E\u3057\u305F",dataLoaded:"\u2705 \u9032\u6357\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F",fileSaved:"\u2705 \u30D5\u30A1\u30A4\u30EB\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F",fileLoaded:"\u2705 \u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F",noSavedData:"\u274C \u4FDD\u5B58\u3055\u308C\u305F\u9032\u6357\u304C\u3042\u308A\u307E\u305B\u3093",savedDataFound:"\u2705 \u4FDD\u5B58\u3055\u308C\u305F\u9032\u6357\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\u7D9A\u884C\u3057\u307E\u3059\u304B\uFF1F",savedDate:"\u4FDD\u5B58\u65E5\u6642: {date}",clickLoadToContinue:"\u300C\u9032\u6357\u3092\u8AAD\u307F\u8FBC\u307F\u300D\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u7D9A\u884C\u3002",fileError:"\u274C \u30D5\u30A1\u30A4\u30EB\u51E6\u7406\u30A8\u30E9\u30FC",invalidFileFormat:"\u274C \u7121\u52B9\u306A\u30D5\u30A1\u30A4\u30EB\u5F62\u5F0F",paintingSpeed:"\u63CF\u753B\u901F\u5EA6",pixelsPerSecond:"\u30D4\u30AF\u30BB\u30EB/\u79D2",speedSetting:"\u901F\u5EA6: {speed} \u30D4\u30AF\u30BB\u30EB/\u79D2",settings:"\u8A2D\u5B9A",botSettings:"\u30DC\u30C3\u30C8\u8A2D\u5B9A",close:"\u9589\u3058\u308B",language:"\u8A00\u8A9E",themeSettings:"\u30C6\u30FC\u30DE\u8A2D\u5B9A",themeSettingsDesc:"\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u306E\u597D\u304D\u306A\u30AB\u30E9\u30FC\u30C6\u30FC\u30DE\u3092\u9078\u629E\u3002",languageSelectDesc:"\u5E0C\u671B\u8A00\u8A9E\u3092\u9078\u629E\u3002\u5909\u66F4\u306F\u5373\u6642\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",autoCaptcha:"\u81EA\u52D5 CAPTCHA \u30BD\u30EB\u30D0\u30FC",autoCaptchaDesc:"\u7D71\u5408\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u30FC\u3067 Turnstile \u30C8\u30FC\u30AF\u30F3\u3092\u81EA\u52D5\u751F\u6210\u3057\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30D6\u30E9\u30A6\u30B6\u81EA\u52D5\u5316\u306B\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u3002",applySettings:"\u8A2D\u5B9A\u3092\u9069\u7528",settingsSaved:"\u2705 \u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\uFF01",speedOn:"\u30AA\u30F3",speedOff:"\u30AA\u30D5",cooldownSettings:"\u30AF\u30FC\u30EB\u30C0\u30A6\u30F3\u8A2D\u5B9A",waitCharges:"\u30C1\u30E3\u30FC\u30B8\u6570\u304C\u6B21\u306B\u9054\u3059\u308B\u307E\u3067\u5F85\u6A5F",captchaSolving:"\u{1F511} Turnstile \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u4E2D...",captchaFailed:"\u274C \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u5931\u6557\u3002\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u3092\u8A66\u884C...",automation:"\u81EA\u52D5\u5316",noChargesThreshold:"\u231B \u30C1\u30E3\u30FC\u30B8 {threshold} \u3092\u5F85\u6A5F\u4E2D\u3002\u73FE\u5728 {current}\u3002\u6B21\u306F {time} \u5F8C...",tokenCapturedSuccess:"\u30C8\u30FC\u30AF\u30F3\u30AD\u30E3\u30D7\u30C1\u30E3\u6210\u529F\uFF01\u30DC\u30C3\u30C8\u3092\u958B\u59CB\u3067\u304D\u307E\u3059\u3002",notificationsNotSupported:"\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F\u901A\u77E5\u304C\u30B5\u30DD\u30FC\u30C8\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002",chargesReadyNotification:"WPlace \u2014 \u30C1\u30E3\u30FC\u30B8\u6E96\u5099\u5B8C\u4E86",chargesReadyMessage:"\u30C1\u30E3\u30FC\u30B8\u6E96\u5099\u5B8C\u4E86: {current} / {max}\u3002\u3057\u304D\u3044\u5024: {threshold}\u3002",testNotificationTitle:"WPlace \u2014 \u30C6\u30B9\u30C8",testNotificationMessage:"\u3053\u308C\u306F\u30C6\u30B9\u30C8\u901A\u77E5\u3067\u3059\u3002",showStats:"\u7D71\u8A08\u8868\u793A",compactMode:"\u30B3\u30F3\u30D1\u30AF\u30C8\u30E2\u30FC\u30C9",refreshCharges:"\u30C1\u30E3\u30FC\u30B8\u66F4\u65B0",closeStats:"\u7D71\u8A08\u3092\u9589\u3058\u308B",zoomOut:"\u7E2E\u5C0F",zoomIn:"\u62E1\u5927",fitToView:"\u753B\u9762\u306B\u5408\u308F\u305B\u308B",actualSize:"\u5B9F\u969B\u306E\u30B5\u30A4\u30BA (100%)",panMode:"\u30D1\u30F3\uFF08\u30C9\u30E9\u30C3\u30B0\u3067\u79FB\u52D5\uFF09",clearIgnoredPixels:"\u7121\u8996\u3055\u308C\u305F\u30D4\u30AF\u30BB\u30EB\u3092\u3059\u3079\u3066\u30AF\u30EA\u30A2",invertMask:"\u30DE\u30B9\u30AF\u3092\u53CD\u8EE2",waitingSetupComplete:"\u{1F504} \u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u306E\u5B8C\u4E86\u3092\u5F85\u6A5F\u4E2D...",waitingTokenGenerator:"\u{1F504} \u30C8\u30FC\u30AF\u30F3\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u306E\u521D\u671F\u5316\u3092\u5F85\u6A5F\u4E2D...",uploadImageFirst:"\u5229\u7528\u53EF\u80FD\u306A\u8272\u3092\u53D6\u5F97\u3059\u308B\u305F\u3081\u306B\u6700\u521D\u306B\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044",pleaseWaitInitialSetup:"\u{1F504} \u9032\u6357\u3092\u8AAD\u307F\u8FBC\u3080\u524D\u306B\u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u306E\u5B8C\u4E86\u3092\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",pleaseWaitFileSetup:"\u{1F504} \u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u3080\u524D\u306B\u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u306E\u5B8C\u4E86\u3092\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",errorSavingProgress:"\u274C \u9032\u6357\u306E\u4FDD\u5B58\u30A8\u30E9\u30FC",errorLoadingProgress:"\u274C \u9032\u6357\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC",fileOperationsAvailable:"\u{1F4C2} \u30D5\u30A1\u30A4\u30EB\u64CD\u4F5C\uFF08\u8AAD\u307F\u8FBC\u307F/\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\uFF09\u304C\u5229\u7528\u53EF\u80FD\u306B\u306A\u308A\u307E\u3057\u305F\uFF01",tokenGeneratorReady:"\u{1F511} \u30C8\u30FC\u30AF\u30F3\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u6E96\u5099\u5B8C\u4E86\uFF01",paintingStats:"\u63CF\u753B\u7D71\u8A08",enablePaintingSpeedLimit:"\u63CF\u753B\u901F\u5EA6\u5236\u9650\u3092\u6709\u52B9\u5316\uFF08\u30D0\u30C3\u30C1\u30B5\u30A4\u30BA\u5236\u5FA1\uFF09",enableNotifications:"\u901A\u77E5\u3092\u6709\u52B9\u5316",notifyOnChargesThreshold:"\u30C1\u30E3\u30FC\u30B8\u304C\u3057\u304D\u3044\u5024\u306B\u9054\u3057\u305F\u3089\u901A\u77E5",onlyWhenNotFocused:"\u30BF\u30D6\u304C\u975E\u30A2\u30AF\u30C6\u30A3\u30D6\u306E\u6642\u306E\u307F",repeatEvery:"\u7E70\u308A\u8FD4\u3057\u9593\u9694",minutesPl:"\u5206",grantPermission:"\u8A31\u53EF\u3092\u4E0E\u3048\u308B",test:"\u30C6\u30B9\u30C8",showAllColorsIncluding:"\u3059\u3079\u3066\u306E\u8272\u3092\u8868\u793A\uFF08\u5229\u7528\u4E0D\u53EF\u542B\u3080\uFF09",chromaWeight:"\u5F69\u5EA6\u91CD\u307F",downloadPreview:"\u30D7\u30EC\u30D3\u30E5\u30FC\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",apply:"\u9069\u7528",cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",fit:"\u30D5\u30A3\u30C3\u30C8",hundred:"100%",clear:"\u30AF\u30EA\u30A2",invert:"\u53CD\u8EE2",reprocessingOverlay:"\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u518D\u51E6\u7406\u4E2D...",overlayUpdated:"\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u66F4\u65B0\u5B8C\u4E86\uFF01",notificationsEnabled:"\u901A\u77E5\u304C\u6709\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002",notificationsPermissionDenied:"\u901A\u77E5\u306E\u8A31\u53EF\u304C\u62D2\u5426\u3055\u308C\u307E\u3057\u305F\u3002",overlayEnabled:"\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u304C\u6709\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002",overlayDisabled:"\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u304C\u7121\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002",tokenSourceSet:"\u30C8\u30FC\u30AF\u30F3\u30BD\u30FC\u30B9\u3092\u8A2D\u5B9A: {source}",batchModeSet:"\u30D0\u30C3\u30C1\u30E2\u30FC\u30C9\u3092\u8A2D\u5B9A: {mode}",randomRange:"\u30E9\u30F3\u30C0\u30E0\u7BC4\u56F2",normalFixedSize:"\u901A\u5E38\u56FA\u5B9A\u30B5\u30A4\u30BA",advancedColorSettingsReset:"\u9AD8\u5EA6\u306A\u8272\u8A2D\u5B9A\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u307E\u3057\u305F\u3002",shiftRowAltColumn:"Shift = \u884C \u2022 Alt = \u5217",hideTurnstileBtn:"\u96A0\u3059",turnstileInstructions:"Cloudflare Turnstile \u2014 \u8868\u793A\u3055\u308C\u305F\u5834\u5408\u306F\u78BA\u8A8D\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044",uploadImageFirstColors:"\u5229\u7528\u53EF\u80FD\u306A\u8272\u3092\u53D6\u5F97\u3059\u308B\u305F\u3081\u306B\u6700\u521D\u306B\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044",availableColors:"\u5229\u7528\u53EF\u80FD\u306A\u8272 ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"\u5C55\u958B\u30E2\u30FC\u30C9",minimize:"\u6700\u5C0F\u5316",restore:"\u5FA9\u5143",hideStats:"\u7D71\u8A08\u3092\u975E\u8868\u793A",paintOptions:"\u63CF\u753B\u30AA\u30D7\u30B7\u30E7\u30F3",paintWhitePixels:"\u767D\u3044\u30D4\u30AF\u30BB\u30EB\u3092\u63CF\u753B",paintTransparentPixels:"\u900F\u660E\u30D4\u30AF\u30BB\u30EB\u3092\u63CF\u753B"},ko:{title:"WPlace \uC790\uB3D9 \uC774\uBBF8\uC9C0",toggleOverlay:"\uC624\uBC84\uB808\uC774 \uC804\uD658",scanColors:"\uC0C9\uC0C1 \uC2A4\uCE94",uploadImage:"\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC",resizeImage:"\uD06C\uAE30 \uC870\uC815",selectPosition:"\uC704\uCE58 \uC120\uD0DD",startPainting:"\uADF8\uB9AC\uAE30 \uC2DC\uC791",stopPainting:"\uADF8\uB9AC\uAE30 \uC911\uC9C0",checkingColors:"\u{1F50D} \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1 \uD655\uC778 \uC911...",noColorsFound:"\u274C \uC0AC\uC774\uD2B8\uC5D0\uC11C \uC0C9\uC0C1 \uD314\uB808\uD2B8\uB97C \uC5F0 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694!",colorsFound:"\u2705 \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1 {count}\uAC1C \uBC1C\uACAC. \uC5C5\uB85C\uB4DC \uC900\uBE44 \uC644\uB8CC.",loadingImage:"\u{1F5BC}\uFE0F \uC774\uBBF8\uC9C0 \uBD88\uB7EC\uC624\uB294 \uC911...",imageLoaded:"\u2705 \uC774\uBBF8\uC9C0 \uB85C\uB4DC \uC644\uB8CC. \uC720\uD6A8 \uD53D\uC140 {count}\uAC1C",imageError:"\u274C \uC774\uBBF8\uC9C0 \uB85C\uB4DC \uC624\uB958",selectPositionAlert:"\uC791\uD488\uC744 \uC2DC\uC791\uD560 \uC704\uCE58\uC5D0 \uCCAB \uD53D\uC140\uC744 \uCE60\uD558\uC138\uC694!",waitingPosition:"\u{1F446} \uAE30\uC900 \uD53D\uC140\uC744 \uCE60\uD560 \uB54C\uAE4C\uC9C0 \uB300\uAE30 \uC911...",positionSet:"\u2705 \uC704\uCE58 \uC124\uC815 \uC644\uB8CC!",positionTimeout:"\u274C \uC704\uCE58 \uC120\uD0DD \uC2DC\uAC04 \uCD08\uACFC",startPaintingMsg:"\u{1F3A8} \uADF8\uB9AC\uAE30 \uC2DC\uC791...",paintingProgress:"\u{1F9F1} \uC9C4\uD589: {painted}/{total} \uD53D\uC140...",noCharges:"\u231B \uC0AC\uC6A9 \uAC00\uB2A5 \uD69F\uC218 \uC5C6\uC74C. {time} \uB300\uAE30...",paintingStopped:"\u23F9\uFE0F \uC0AC\uC6A9\uC790\uC5D0 \uC758\uD574 \uC911\uC9C0\uB428",paintingComplete:"\u2705 \uADF8\uB9AC\uAE30 \uC644\uB8CC! {count} \uD53D\uC140 \uADF8\uB838\uC2B5\uB2C8\uB2E4.",paintingError:"\u274C \uADF8\uB9AC\uB294 \uC911 \uC624\uB958",missingRequirements:"\u274C \uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uACE0 \uC704\uCE58\uB97C \uC120\uD0DD\uD558\uC138\uC694",progress:"\uC9C4\uD589",pixels:"\uD53D\uC140",charges:"\uD69F\uC218",estimatedTime:"\uC608\uC0C1 \uC2DC\uAC04",initMessage:"'\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC'\uB97C \uD074\uB9AD\uD558\uC5EC \uC2DC\uC791",waitingInit:"\uCD08\uAE30\uD654 \uB300\uAE30 \uC911...",initializingToken:"\u{1F527} Turnstile \uD1A0\uD070 \uC0DD\uC131\uAE30 \uCD08\uAE30\uD654 \uC911...",tokenReady:"\u2705 \uD1A0\uD070 \uC0DD\uC131 \uC900\uBE44 \uC644\uB8CC - \uADF8\uB9AC\uAE30\uB97C \uC2DC\uC791\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4!",tokenRetryLater:"\u26A0\uFE0F \uD544\uC694 \uC2DC \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4",resizeSuccess:"\u2705 \uC774\uBBF8\uC9C0\uAC00 {width}x{height} \uD06C\uAE30\uB85C \uC870\uC815\uB428",paintingPaused:"\u23F8\uFE0F \uC704\uCE58 X: {x}, Y: {y} \uC5D0\uC11C \uC77C\uC2DC \uC911\uC9C0",captchaNeeded:"\u2757 \uD1A0\uD070 \uC0DD\uC131 \uC2E4\uD328. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.",saveData:"\uC9C4\uD589 \uC800\uC7A5",loadData:"\uC9C4\uD589 \uBD88\uB7EC\uC624\uAE30",saveToFile:"\uD30C\uC77C\uB85C \uC800\uC7A5",loadFromFile:"\uD30C\uC77C\uC5D0\uC11C \uBD88\uB7EC\uC624\uAE30",dataManager:"\uB370\uC774\uD130",autoSaved:"\u2705 \uC9C4\uD589 \uC790\uB3D9 \uC800\uC7A5\uB428",dataLoaded:"\u2705 \uC9C4\uD589 \uBD88\uB7EC\uC624\uAE30 \uC131\uACF5",fileSaved:"\u2705 \uD30C\uC77C \uC800\uC7A5 \uC131\uACF5",fileLoaded:"\u2705 \uD30C\uC77C \uBD88\uB7EC\uC624\uAE30 \uC131\uACF5",noSavedData:"\u274C \uC800\uC7A5\uB41C \uC9C4\uD589 \uC5C6\uC74C",savedDataFound:"\u2705 \uC800\uC7A5\uB41C \uC9C4\uD589 \uBC1C\uACAC! \uACC4\uC18D\uD558\uB824\uBA74 \uBD88\uB7EC\uC624\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?",savedDate:"\uC800\uC7A5 \uC2DC\uAC01: {date}",clickLoadToContinue:"'\uC9C4\uD589 \uBD88\uB7EC\uC624\uAE30'\uB97C \uD074\uB9AD\uD558\uC5EC \uACC4\uC18D.",fileError:"\u274C \uD30C\uC77C \uCC98\uB9AC \uC624\uB958",invalidFileFormat:"\u274C \uC798\uBABB\uB41C \uD30C\uC77C \uD615\uC2DD",paintingSpeed:"\uADF8\uB9AC\uAE30 \uC18D\uB3C4",pixelsPerSecond:"\uD53D\uC140/\uCD08",speedSetting:"\uC18D\uB3C4: {speed} \uD53D\uC140/\uCD08",settings:"\uC124\uC815",botSettings:"\uBD07 \uC124\uC815",close:"\uB2EB\uAE30",language:"\uC5B8\uC5B4",themeSettings:"\uD14C\uB9C8 \uC124\uC815",themeSettingsDesc:"\uC778\uD130\uD398\uC774\uC2A4\uC6A9 \uC120\uD638 \uC0C9\uC0C1 \uD14C\uB9C8\uB97C \uC120\uD0DD\uD558\uC138\uC694.",languageSelectDesc:"\uC120\uD638 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD558\uC138\uC694. \uBCC0\uACBD \uC0AC\uD56D\uC740 \uC989\uC2DC \uC801\uC6A9\uB429\uB2C8\uB2E4.",autoCaptcha:"\uC790\uB3D9 CAPTCHA \uD574\uACB0",autoCaptchaDesc:"\uD1B5\uD569 \uC0DD\uC131\uAE30\uB97C \uC0AC\uC6A9\uD574 Turnstile \uD1A0\uD070\uC744 \uC790\uB3D9 \uC0DD\uC131\uD558\uACE0 \uD544\uC694 \uC2DC \uBE0C\uB77C\uC6B0\uC800 \uC790\uB3D9\uD654\uB85C \uD3F4\uBC31.",applySettings:"\uC124\uC815 \uC801\uC6A9",settingsSaved:"\u2705 \uC124\uC815 \uC800\uC7A5 \uC644\uB8CC!",speedOn:"\uCF1C\uC9D0",speedOff:"\uAEBC\uC9D0",cooldownSettings:"\uCFE8\uB2E4\uC6B4 \uC124\uC815",waitCharges:"\uD69F\uC218\uAC00 \uB2E4\uC74C \uAC12\uC5D0 \uB3C4\uB2EC\uD560 \uB54C\uAE4C\uC9C0 \uB300\uAE30",captchaSolving:"\u{1F511} Turnstile \uD1A0\uD070 \uC0DD\uC131 \uC911...",captchaFailed:"\u274C \uD1A0\uD070 \uC0DD\uC131 \uC2E4\uD328. \uD3F4\uBC31 \uC2DC\uB3C4...",automation:"\uC790\uB3D9\uD654",noChargesThreshold:"\u231B \uD69F\uC218\uAC00 {threshold} \uC5D0 \uB3C4\uB2EC\uD560 \uB54C\uAE4C\uC9C0 \uB300\uAE30 \uC911. \uD604\uC7AC {current}. \uB2E4\uC74C {time} \uD6C4...",tokenCapturedSuccess:"\uD1A0\uD070 \uC0DD\uC131 \uC131\uACF5! \uC774\uC81C \uBD07\uC744 \uC2DC\uC791\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",notificationsNotSupported:"\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 \uC54C\uB9BC\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",chargesReadyNotification:"WPlace \u2014 \uD69F\uC218 \uC900\uBE44 \uC644\uB8CC",chargesReadyMessage:"\uD69F\uC218 \uC900\uBE44 \uC644\uB8CC: {current} / {max}. \uC784\uACC4\uAC12: {threshold}.",testNotificationTitle:"WPlace \u2014 \uD14C\uC2A4\uD2B8",testNotificationMessage:"\uC774\uAC83\uC740 \uD14C\uC2A4\uD2B8 \uC54C\uB9BC\uC785\uB2C8\uB2E4.",showStats:"\uD1B5\uACC4 \uBCF4\uAE30",compactMode:"\uCEF4\uD329\uD2B8 \uBAA8\uB4DC",refreshCharges:"\uD69F\uC218 \uC0C8\uB85C\uACE0\uCE68",closeStats:"\uD1B5\uACC4 \uB2EB\uAE30",zoomOut:"\uCD95\uC18C",zoomIn:"\uD655\uB300",fitToView:"\uD654\uBA74\uC5D0 \uB9DE\uCDA4",actualSize:"\uC2E4\uC81C \uD06C\uAE30 (100%)",panMode:"\uC774\uB3D9 (\uB04C\uC5B4\uC11C \uBCF4\uAE30 \uC774\uB3D9)",clearIgnoredPixels:"\uBB34\uC2DC\uB41C \uBAA8\uB4E0 \uD53D\uC140 \uC9C0\uC6B0\uAE30",invertMask:"\uB9C8\uC2A4\uD06C \uBC18\uC804",waitingSetupComplete:"\u{1F504} \uCD08\uAE30 \uC124\uC815 \uC644\uB8CC \uB300\uAE30 \uC911...",waitingTokenGenerator:"\u{1F504} \uD1A0\uD070 \uC0DD\uC131\uAE30 \uCD08\uAE30\uD654 \uB300\uAE30 \uC911...",uploadImageFirst:"\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1\uC744 \uC5BB\uAE30 \uC704\uD574 \uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD558\uC138\uC694",pleaseWaitInitialSetup:"\u{1F504} \uC9C4\uD589\uB3C4\uB97C \uB85C\uB4DC\uD558\uAE30 \uC804\uC5D0 \uCD08\uAE30 \uC124\uC815 \uC644\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uC138\uC694.",pleaseWaitFileSetup:"\u{1F504} \uD30C\uC77C\uC5D0\uC11C \uB85C\uB4DC\uD558\uAE30 \uC804\uC5D0 \uCD08\uAE30 \uC124\uC815 \uC644\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uC138\uC694.",errorSavingProgress:"\u274C \uC9C4\uD589 \uC800\uC7A5 \uC624\uB958",errorLoadingProgress:"\u274C \uC9C4\uD589 \uB85C\uB4DC \uC624\uB958",fileOperationsAvailable:"\u{1F4C2} \uD30C\uC77C \uC791\uC5C5(\uB85C\uB4DC/\uC5C5\uB85C\uB4DC)\uC774 \uC774\uC81C \uC0AC\uC6A9 \uAC00\uB2A5\uD569\uB2C8\uB2E4!",tokenGeneratorReady:"\u{1F511} \uD1A0\uD070 \uC0DD\uC131\uAE30 \uC900\uBE44 \uC644\uB8CC!",paintingStats:"\uADF8\uB9AC\uAE30 \uD1B5\uACC4",enablePaintingSpeedLimit:"\uADF8\uB9AC\uAE30 \uC18D\uB3C4 \uC81C\uD55C \uD65C\uC131\uD654 (\uBC30\uCE58 \uD06C\uAE30 \uC81C\uC5B4)",enableNotifications:"\uC54C\uB9BC \uD65C\uC131\uD654",notifyOnChargesThreshold:"\uD69F\uC218\uAC00 \uC784\uACC4\uAC12\uC5D0 \uB3C4\uB2EC\uD558\uBA74 \uC54C\uB9BC",onlyWhenNotFocused:"\uD0ED\uC774 \uD3EC\uCEE4\uC2A4\uB418\uC9C0 \uC54A\uC558\uC744 \uB54C\uB9CC",repeatEvery:"\uBC18\uBCF5 \uAC04\uACA9",minutesPl:"\uBD84",grantPermission:"\uAD8C\uD55C \uBD80\uC5EC",test:"\uD14C\uC2A4\uD2B8",showAllColorsIncluding:"\uBAA8\uB4E0 \uC0C9\uC0C1 \uBCF4\uAE30 (\uC0AC\uC6A9 \uBD88\uAC00 \uD3EC\uD568)",chromaWeight:"\uC0C9\uB3C4 \uAC00\uC911\uCE58",downloadPreview:"\uBBF8\uB9AC\uBCF4\uAE30 \uB2E4\uC6B4\uB85C\uB4DC",apply:"\uC801\uC6A9",cancel:"\uCDE8\uC18C",fit:"\uB9DE\uCDA4",hundred:"100%",clear:"\uC9C0\uC6B0\uAE30",invert:"\uBC18\uC804",reprocessingOverlay:"\uC624\uBC84\uB808\uC774 \uC7AC\uCC98\uB9AC \uC911...",overlayUpdated:"\uC624\uBC84\uB808\uC774 \uC5C5\uB370\uC774\uD2B8 \uC644\uB8CC!",notificationsEnabled:"\uC54C\uB9BC\uC774 \uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",notificationsPermissionDenied:"\uC54C\uB9BC \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",overlayEnabled:"\uC624\uBC84\uB808\uC774\uAC00 \uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",overlayDisabled:"\uC624\uBC84\uB808\uC774\uAC00 \uBE44\uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",tokenSourceSet:"\uD1A0\uD070 \uC18C\uC2A4 \uC124\uC815: {source}",batchModeSet:"\uBC30\uCE58 \uBAA8\uB4DC \uC124\uC815: {mode}",randomRange:"\uB79C\uB364 \uBC94\uC704",normalFixedSize:"\uC77C\uBC18 \uACE0\uC815 \uD06C\uAE30",advancedColorSettingsReset:"\uACE0\uAE09 \uC0C9\uC0C1 \uC124\uC815\uC774 \uCD08\uAE30\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",shiftRowAltColumn:"Shift = \uD589 \u2022 Alt = \uC5F4",hideTurnstileBtn:"\uC228\uAE30\uAE30",turnstileInstructions:"Cloudflare Turnstile \u2014 \uD45C\uC2DC\uB418\uBA74 \uAC80\uC0AC\uB97C \uC644\uB8CC\uD558\uC138\uC694",uploadImageFirstColors:"\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1\uC744 \uC5BB\uAE30 \uC704\uD574 \uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD558\uC138\uC694",availableColors:"\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1 ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"\uD655\uC7A5 \uBAA8\uB4DC",minimize:"\uCD5C\uC18C\uD654",restore:"\uBCF5\uC6D0",hideStats:"\uD1B5\uACC4 \uC228\uAE40",paintOptions:"\uD398\uC778\uD2B8 \uC635\uC158",paintWhitePixels:"\uD770\uC0C9 \uD53D\uC140 \uCE60\uD558\uAE30",paintTransparentPixels:"\uD22C\uBA85 \uD53D\uC140 \uCE60\uD558\uAE30"},pt:{title:"WPlace Auto-Image",toggleOverlay:"Toggle Overlay",scanColors:"Escanear Cores",uploadImage:"Upload da Imagem",resizeImage:"Redimensionar Imagem",selectPosition:"Selecionar Posi\xE7\xE3o",startPainting:"Iniciar Pintura",stopPainting:"Parar Pintura",checkingColors:"\u{1F50D} Verificando cores dispon\xEDveis...",noColorsFound:"\u274C Abra a paleta de cores no site e tente novamente!",colorsFound:"\u2705 {count} cores encontradas. Pronto para upload.",loadingImage:"\u{1F5BC}\uFE0F Carregando imagem...",imageLoaded:"\u2705 Imagem carregada com {count} pixels v\xE1lidos",imageError:"\u274C Erro ao carregar imagem",selectPositionAlert:"Pinte o primeiro pixel \u043D\u0430 localiza\xE7\xE3o onde deseja que a arte comece!",waitingPosition:"\u{1F446} Aguardando voc\xEA pintar o pixel de refer\xEAncia...",positionSet:"\u2705 Posi\xE7\xE3o definida com sucesso!",positionTimeout:"\u274C Tempo esgotado para selecionar posi\xE7\xE3o",startPaintingMsg:"\u{1F3A8} Iniciando pintura...",paintingProgress:"\u{1F9F1} Progresso: {painted}/{total} pixels...",noCharges:"\u231B Sem cargas. Aguardando {time}...",paintingStopped:"\u23F9\uFE0F Pintura interrom\u043F\u0438\u0434\u0430 pelo usu\xE1rio",paintingComplete:"\u2705 Pintura conclu\xEDda! {count} pixels pintados.",paintingError:"\u274C Erro durante a pintura",missingRequirements:"\u274C Carregue uma imagem e selecione uma posi\xE7\xE3o primeiro",progress:"Progresso",pixels:"Pixels",charges:"Cargas",estimatedTime:"Tempo estimado",initMessage:"Clique em 'Upload da Imagem' para come\xE7ar",waitingInit:"Aguardando inicializa\xE7\xE3o...",initializingToken:"\u{1F527} Inicializando gerador de tokens Turnstile...",tokenReady:"\u2705 Gerador de tokens pronto - voc\xEA pode come\xE7ar a pintar!",tokenRetryLater:"\u26A0\uFE0F Gerador de tokens tentar\xE1 novamente quando necess\xE1rio",resizeSuccess:"\u2705 Imagem redimensionada \u0434\u043B\u044F {width}x{height}",paintingPaused:"\u23F8\uFE0F Pintura pausada na posi\xE7\xE3o X: {x}, Y: {y}",captchaNeeded:"\u2757 Falha na gera\xE7\xE3o de token. Tente novamente em alguns instantes.",saveData:"Salvar Progresso",loadData:"Carregar Progresso",saveToFile:"Salvar em Arquivo",loadFromFile:"Carregar de Arquivo",dataManager:"Dados",autoSaved:"\u2705 Progresso salvo automaticamente",dataLoaded:"\u2705 Progresso carregado com sucesso",fileSaved:"\u2705 Salvo em arquivo com sucesso",fileLoaded:"\u2705 Carregado de arquivo com sucesso",noSavedData:"\u274C Nenhum progresso salvo encontrado",savedDataFound:"\u2705 Progresso salvo encontrado! Carregar para continuar?",savedDate:"Salvo em: {date}",clickLoadToContinue:"Clique em 'Carregar Progresso' para continuar.",fileError:"\u274C Erro ao processar arquivo",invalidFileFormat:"\u274C Formato de arquivo inv\xE1lido",paintingSpeed:"Velocidade de Pintura",pixelsPerSecond:"pixels/segundo",speedSetting:"Velocidade: {speed} pixels/seg",settings:"Configura\xE7\xF5es",botSettings:"Configura\xE7\xF5es do Bot",close:"Fechar",language:"Idioma",themeSettings:"Configura\xE7\xF5es de Tema",themeSettingsDesc:"Escolha seu tema de cores preferido para a interface.",languageSelectDesc:"Selecione seu idioma preferido. As altera\xE7\xF5es ter\xE3o efeito imediatamente.",autoCaptcha:"Resolvedor de CAPTCHA Autom\xE1tico",autoCaptchaDesc:"Tenta resolver o CAPTCHA automaticamente simulando a coloca\xE7\xE3o manual de um pixel quando o token expira.",applySettings:"Aplicar Configura\xE7\xF5es",settingsSaved:"\u2705 Configura\xE7\xF5es salvas com sucesso!",speedOn:"Ligado",speedOff:"Desligado",cooldownSettings:"Configura\xE7\xF5es de Cooldown",waitCharges:"Aguardar at\xE9 as cargas atingirem",captchaSolving:"\u{1F916} Tentando resolver o CAPTCHA...",captchaFailed:"\u274C Falha ao resolver CAPTCHA. Pinte um pixel manualmente.",automation:"Automa\xE7\xE3o",noChargesThreshold:"\u231B Aguardando cargas atingirem {threshold}. Atual: {current}. Pr\xF3xima em {time}...",tokenCapturedSuccess:"Token capturado com sucesso! Voc\xEA pode iniciar o bot agora.",notificationsNotSupported:"Notifica\xE7\xF5es n\xE3o s\xE3o suportadas neste navegador.",chargesReadyNotification:"WPlace \u2014 Cargas Prontas",chargesReadyMessage:"Cargas prontas: {current} / {max}. Limite: {threshold}.",testNotificationTitle:"WPlace \u2014 Teste",testNotificationMessage:"Esta \xE9 uma notifica\xE7\xE3o de teste.",showStats:"Mostrar Estat\xEDsticas",compactMode:"Modo Compacto",refreshCharges:"Atualizar Cargas",closeStats:"Fechar Estat\xEDsticas",zoomOut:"Diminuir Zoom",zoomIn:"Aumentar Zoom",fitToView:"Ajustar \xE0 visualiza\xE7\xE3o",actualSize:"Tamanho real (100%)",panMode:"Arrastar (arrastar para mover visualiza\xE7\xE3o)",clearIgnoredPixels:"Limpar pixels ignorados",invertMask:"Inverter m\xE1scara",waitingSetupComplete:"\u{1F504} Aguardando conclus\xE3o da configura\xE7\xE3o inicial...",waitingTokenGenerator:"\u{1F504} Aguardando inicializa\xE7\xE3o do gerador de tokens...",uploadImageFirst:"Fa\xE7a upload de uma imagem primeiro para capturar cores dispon\xEDveis",pleaseWaitInitialSetup:"\u{1F504} Aguarde a conclus\xE3o da configura\xE7\xE3o inicial antes de carregar o progresso.",pleaseWaitFileSetup:"\u{1F504} Aguarde a conclus\xE3o da configura\xE7\xE3o inicial antes de carregar do arquivo.",errorSavingProgress:"\u274C Erro ao salvar progresso",errorLoadingProgress:"\u274C Erro ao carregar progresso",fileOperationsAvailable:"\u{1F4C2} Opera\xE7\xF5es de arquivo (Carregar/Upload) agora dispon\xEDveis!",tokenGeneratorReady:"\u{1F511} Gerador de tokens pronto!",paintingStats:"Estat\xEDsticas de Pintura",enablePaintingSpeedLimit:"Ativar limite de velocidade de pintura (controle de tamanho de lote)",enableNotifications:"Ativar notifica\xE7\xF5es",notifyOnChargesThreshold:"Notificar quando as cargas atingirem o limite",onlyWhenNotFocused:"Apenas quando a aba n\xE3o est\xE1 em foco",repeatEvery:"Repetir a cada",minutesPl:"minuto(s)",grantPermission:"Conceder Permiss\xE3o",test:"Teste",showAllColorsIncluding:"Mostrar Todas as Cores (incluindo indispon\xEDveis)",chromaWeight:"Peso da Satura\xE7\xE3o",downloadPreview:"Baixar Pr\xE9-visualiza\xE7\xE3o",apply:"Aplicar",cancel:"Cancelar",fit:"Ajustar",hundred:"100%",clear:"Limpar",invert:"Inverter",reprocessingOverlay:"Reprocessando sobreposi\xE7\xE3o...",overlayUpdated:"Sobreposi\xE7\xE3o atualizada!",notificationsEnabled:"Notifica\xE7\xF5es ativadas.",notificationsPermissionDenied:"Permiss\xE3o de notifica\xE7\xF5es negada.",overlayEnabled:"Sobreposi\xE7\xE3o ativada.",overlayDisabled:"Sobreposi\xE7\xE3o desativada.",tokenSourceSet:"Fonte de token definida para: {source}",batchModeSet:"Modo de lote definido para: {mode}",randomRange:"Intervalo Aleat\xF3rio",normalFixedSize:"Tamanho Fixo Normal",advancedColorSettingsReset:"Configura\xE7\xF5es avan\xE7adas de cor redefinidas.",shiftRowAltColumn:"Shift = Linha \u2022 Alt = Coluna",hideTurnstileBtn:"Ocultar",turnstileInstructions:"Cloudflare Turnstile \u2014 complete a verifica\xE7\xE3o se mostrada",uploadImageFirstColors:"Fa\xE7a upload de uma imagem primeiro para capturar cores dispon\xEDveis",availableColors:"Cores Dispon\xEDveis ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Modo Expandir",minimize:"Minimizar",restore:"Restaurar",hideStats:"Ocultar Estat\xEDsticas",paintOptions:"Op\xE7\xF5es de pintura",paintWhitePixels:"Pintar pixels brancos",paintTransparentPixels:"Pintar pixels transparentes"},ru:{title:"WPlace \u0410\u0432\u0442\u043E-\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",toggleOverlay:"Toggle Overlay",scanColors:"\u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0446\u0432\u0435\u0442\u0430",uploadImage:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",resizeImage:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",selectPosition:"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u043E\u0437\u0438\u0446\u0438\u044E",startPainting:"\u041D\u0430\u0447\u0430\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435",stopPainting:"\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435",checkingColors:"\u{1F50D} \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432...",noColorsFound:"\u274C \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u0430\u043B\u0438\u0442\u0440\u0443 \u0446\u0432\u0435\u0442\u043E\u0432 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430!",colorsFound:"\u2705 \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432: {count}. \u0413\u043E\u0442\u043E\u0432\u043E \u043A \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435.",loadingImage:"\u{1F5BC}\uFE0F \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F...",imageLoaded:"\u2705 \u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E, \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0445 \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439: {count}",imageError:"\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",selectPositionAlert:"\u041D\u0430\u0440\u0438\u0441\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u0439 \u043F\u0438\u043A\u0441\u0435\u043B\u044C \u0432 \u043C\u0435\u0441\u0442\u0435, \u043E\u0442\u043A\u0443\u0434\u0430 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u0440\u0438\u0441\u0443\u043D\u043E\u043A!",waitingPosition:"\u{1F446} \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435, \u043F\u043E\u043A\u0430 \u0432\u044B \u043D\u0430\u0440\u0438\u0441\u0443\u0435\u0442\u0435 \u043E\u043F\u043E\u0440\u043D\u044B\u0439 \u043F\u0438\u043A\u0441\u0435\u043B\u044C...",positionSet:"\u2705 \u041F\u043E\u0437\u0438\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430!",positionTimeout:"\u274C \u0412\u0440\u0435\u043C\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0438\u0441\u0442\u0435\u043A\u043B\u043E",startPaintingMsg:"\u{1F3A8} \u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435...",paintingProgress:"\u{1F9F1} \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: {painted}/{total} \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439...",noCharges:"\u231B \u041D\u0435\u0442 \u0437\u0430\u0440\u044F\u0434\u043E\u0432. \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 {time}...",paintingStopped:"\u23F9\uFE0F \u0420\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u043C",paintingComplete:"\u2705 \u0420\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E! \u041D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D\u043E \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439: {count}.",paintingError:"\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",missingRequirements:"\u274C \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u0437\u0438\u0446\u0438\u044E",progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",pixels:"\u041F\u0438\u043A\u0441\u0435\u043B\u0438",charges:"\u0417\u0430\u0440\u044F\u0434\u044B",estimatedTime:"\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F",initMessage:"\u041D\u0430\u0436\u043C\u0438\u0442\u0435 '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435', \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C",waitingInit:"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438...",initializingToken:"\u{1F527} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 Turnstile \u0442\u043E\u043A\u0435\u043D\u043E\u0432...",tokenReady:"\u2705 \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0433\u043E\u0442\u043E\u0432 - \u043C\u043E\u0436\u0435\u0442\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435!",tokenRetryLater:"\u26A0\uFE0F \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438",resizeSuccess:"\u2705 \u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0434\u043E {width}x{height}",paintingPaused:"\u23F8\uFE0F \u0420\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 X: {x}, Y: {y}",captchaNeeded:"\u2757 \u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u0442\u043E\u043A\u0435\u043D\u0430 \u043D\u0435 \u0443\u0434\u0430\u043B\u0430\u0441\u044C. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0432\u0440\u0435\u043C\u044F.",saveData:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",loadData:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",saveToFile:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 \u0444\u0430\u0439\u043B",loadFromFile:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437 \u0444\u0430\u0439\u043B\u0430",dataManager:"\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0434\u0430\u043D\u043D\u044B\u0445",autoSaved:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438",dataLoaded:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D",fileSaved:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u0444\u0430\u0439\u043B",fileLoaded:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \u0438\u0437 \u0444\u0430\u0439\u043B\u0430",noSavedData:"\u274C \u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D",savedDataFound:"\u2705 \u041D\u0430\u0439\u0434\u0435\u043D \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441! \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C?",savedDate:"\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E: {date}",clickLoadToContinue:"\u041D\u0430\u0436\u043C\u0438\u0442\u0435 '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441', \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C.",fileError:"\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u0444\u0430\u0439\u043B\u0430",invalidFileFormat:"\u274C \u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0430",paintingSpeed:"\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",pixelsPerSecond:"\u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439/\u0441\u0435\u043A",speedSetting:"\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C: {speed} \u043F\u0438\u043A\u0441./\u0441\u0435\u043A",settings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",botSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u043E\u0442\u0430",close:"\u0417\u0430\u043A\u0440\u044B\u0442\u044C",language:"\u042F\u0437\u044B\u043A",themeSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0442\u0435\u043C\u044B",themeSettingsDesc:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u0446\u0432\u0435\u0442\u043E\u0432\u0443\u044E \u0442\u0435\u043C\u0443 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430.",languageSelectDesc:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u044F\u0437\u044B\u043A. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432\u0441\u0442\u0443\u043F\u044F\u0442 \u0432 \u0441\u0438\u043B\u0443 \u043D\u0435\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E.",autoCaptcha:"\u0410\u0432\u0442\u043E-\u0440\u0435\u0448\u0435\u043D\u0438\u0435 CAPTCHA (Turnstile)",autoCaptchaDesc:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u0442 Turnstile \u0442\u043E\u043A\u0435\u043D\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440. \u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u043A \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u0438 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438.",applySettings:"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",settingsSaved:"\u2705 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B!",speedOn:"\u0412\u043A\u043B",speedOff:"\u0412\u044B\u043A\u043B",cooldownSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0438",waitCharges:"\u0416\u0434\u0430\u0442\u044C \u0434\u043E \u043D\u0430\u043A\u043E\u043F\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u0440\u044F\u0434\u043E\u0432",captchaSolving:"\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E Turnstile \u0442\u043E\u043A\u0435\u043D...",captchaFailed:"\u274C \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C Turnstile \u0442\u043E\u043A\u0435\u043D. \u041F\u0440\u043E\u0431\u0443\u044E \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u043C\u0435\u0442\u043E\u0434...",automation:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044F",noChargesThreshold:"\u231B \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0437\u0430\u0440\u044F\u0434\u043E\u0432 \u0434\u043E {threshold}. \u0421\u0435\u0439\u0447\u0430\u0441 {current}. \u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0447\u0435\u0440\u0435\u0437 {time}...",tokenCapturedSuccess:"\u0422\u043E\u043A\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0445\u0432\u0430\u0447\u0435\u043D! \u0422\u0435\u043F\u0435\u0440\u044C \u043C\u043E\u0436\u043D\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0431\u043E\u0442\u0430.",notificationsNotSupported:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0432 \u044D\u0442\u043E\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.",chargesReadyNotification:"WPlace \u2014 \u0417\u0430\u0440\u044F\u0434\u044B \u0433\u043E\u0442\u043E\u0432\u044B",chargesReadyMessage:"\u0417\u0430\u0440\u044F\u0434\u044B \u0433\u043E\u0442\u043E\u0432\u044B: {current} / {max}. \u041F\u043E\u0440\u043E\u0433: {threshold}.",testNotificationTitle:"WPlace \u2014 \u0422\u0435\u0441\u0442",testNotificationMessage:"\u042D\u0442\u043E \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.",showStats:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",compactMode:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",refreshCharges:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0437\u0430\u0440\u044F\u0434\u044B",closeStats:"\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",zoomOut:"\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C",zoomIn:"\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C",fitToView:"\u041F\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0443 \u044D\u043A\u0440\u0430\u043D\u0430",actualSize:"\u0420\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 (100%)",panMode:"\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 (\u043F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F)",clearIgnoredPixels:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0435\u043C\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438",invertMask:"\u0418\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u0441\u043A\u0443",waitingSetupComplete:"\u{1F504} \u0416\u0434\u0451\u043C \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438...",waitingTokenGenerator:"\u{1F504} \u0416\u0434\u0451\u043C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0442\u043E\u043A\u0435\u043D\u043E\u0432...",uploadImageFirst:"\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0437\u0430\u0445\u0432\u0430\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432",pleaseWaitInitialSetup:"\u{1F504} \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430.",pleaseWaitFileSetup:"\u{1F504} \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439 \u0438\u0437 \u0444\u0430\u0439\u043B\u0430.",errorSavingProgress:"\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430",errorLoadingProgress:"\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430",fileOperationsAvailable:"\u{1F4C2} \u0424\u0430\u0439\u043B\u043E\u0432\u044B\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 (\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430/\u0412\u044B\u0433\u0440\u0443\u0437\u043A\u0430) \u0442\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B!",tokenGeneratorReady:"\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0433\u043E\u0442\u043E\u0432!",paintingStats:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",enablePaintingSpeedLimit:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F (\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u043F\u0430\u043A\u0435\u0442\u0430)",enableNotifications:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",notifyOnChargesThreshold:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0438 \u043F\u043E\u0440\u043E\u0433\u0430 \u0437\u0430\u0440\u044F\u0434\u043E\u0432",onlyWhenNotFocused:"\u0422\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u043D\u0435 \u0432 \u0444\u043E\u043A\u0443\u0441\u0435",repeatEvery:"\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u0442\u044C \u043A\u0430\u0436\u0434\u044B\u0435",minutesPl:"\u043C\u0438\u043D\u0443\u0442(\u0430/\u044B)",grantPermission:"\u0414\u0430\u0442\u044C \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435",test:"\u0422\u0435\u0441\u0442",showAllColorsIncluding:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0446\u0432\u0435\u0442\u0430 (\u0432\u043A\u043B\u044E\u0447\u0430\u044F \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435)",chromaWeight:"\u0412\u0435\u0441 \u0446\u0432\u0435\u0442\u043D\u043E\u0441\u0442\u0438",downloadPreview:"\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043F\u0440\u0435\u0432\u044C\u044E",apply:"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",cancel:"\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C",fit:"\u041F\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0443",hundred:"100%",clear:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C",invert:"\u0418\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",reprocessingOverlay:"\u041F\u0435\u0440\u0435\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043E\u0432\u0435\u0440\u043B\u0435\u044F...",overlayUpdated:"\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D!",notificationsEnabled:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",notificationsPermissionDenied:"\u0412 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0438 \u043D\u0430 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0442\u043A\u0430\u0437\u0430\u043D\u043E.",overlayEnabled:"\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0432\u043A\u043B\u044E\u0447\u0451\u043D.",overlayDisabled:"\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u0442\u043A\u043B\u044E\u0447\u0451\u043D.",tokenSourceSet:"\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D: {source}",batchModeSet:"\u0420\u0435\u0436\u0438\u043C \u043F\u0430\u043A\u0435\u0442\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D: {mode}",randomRange:"\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",normalFixedSize:"\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440",advancedColorSettingsReset:"\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0446\u0432\u0435\u0442\u0430 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u044B.",shiftRowAltColumn:"Shift = \u0421\u0442\u0440\u043E\u043A\u0430 \u2022 Alt = \u0421\u0442\u043E\u043B\u0431\u0435\u0446",hideTurnstileBtn:"\u0421\u043A\u0440\u044B\u0442\u044C",turnstileInstructions:"Cloudflare Turnstile \u2014 \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443, \u0435\u0441\u043B\u0438 \u043E\u043D\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430",uploadImageFirstColors:"\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0437\u0430\u0445\u0432\u0430\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432",availableColors:"\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0446\u0432\u0435\u0442\u0430 ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"\u0420\u0435\u0436\u0438\u043C \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F",minimize:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",restore:"\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C",hideStats:"\u0421\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",paintOptions:"\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",paintWhitePixels:"\u0420\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0431\u0435\u043B\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438",paintTransparentPixels:"\u0420\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438"},tr:{title:"WPlace Otomatik-Resim",toggleOverlay:"Katman\u0131 A\xE7/Kapat",scanColors:"Renkleri Tara",uploadImage:"Resim Y\xFCkle",resizeImage:"Resmi Yeniden Boyutland\u0131r",selectPosition:"Konum Se\xE7",startPainting:"Boyamay\u0131 Ba\u015Flat",stopPainting:"Boyamay\u0131 Durdur",checkingColors:"\u{1F50D} Uygun renkler kontrol ediliyor...",noColorsFound:"\u274C Sitede renk paletini a\xE7\u0131n ve tekrar deneyin!",colorsFound:"\u2705 {count} uygun renk bulundu. Y\xFCklemeye haz\u0131r.",loadingImage:"\u{1F5BC}\uFE0F Resim y\xFCkleniyor...",imageLoaded:"\u2705 Resim {count} ge\xE7erli piksel ile y\xFCklendi",imageError:"\u274C Resim y\xFCklenirken hata olu\u015Ftu",selectPositionAlert:"Sanat\u0131 ba\u015Flatmak istedi\u011Finiz ilk pikseli boyay\u0131n!",waitingPosition:"\u{1F446} Referans pikseli boyaman\u0131z bekleniyor...",positionSet:"\u2705 Konum ba\u015Far\u0131yla ayarland\u0131!",positionTimeout:"\u274C Konum se\xE7me s\xFCresi doldu",startPaintingMsg:"\u{1F3A8} Boyama ba\u015Flat\u0131l\u0131yor...",paintingProgress:"\u{1F9F1} \u0130lerleme: {painted}/{total} piksel...",noCharges:"\u231B Yeterli hak yok. Bekleniyor {time}...",paintingStopped:"\u23F9\uFE0F Boyama kullan\u0131c\u0131 taraf\u0131ndan durduruldu",paintingComplete:"\u2705 Boyama tamamland\u0131! {count} piksel boyand\u0131.",paintingError:"\u274C Boyama s\u0131ras\u0131nda hata olu\u015Ftu",missingRequirements:"\u274C \xD6nce resim y\xFCkleyip konum se\xE7melisiniz",progress:"\u0130lerleme",pixels:"Pikseller",charges:"Haklar",estimatedTime:"Tahmini s\xFCre",initMessage:"Ba\u015Flamak i\xE7in 'Resim Y\xFCkle'ye t\u0131klay\u0131n",waitingInit:"Ba\u015Flatma bekleniyor...",initializingToken:"\u{1F527} Turnstile token \xFCreticisi ba\u015Flat\u0131l\u0131yor...",tokenReady:"\u2705 Token \xFCreteci haz\u0131r - art\u0131k boyamaya ba\u015Flayabilirsiniz!",tokenRetryLater:"\u26A0\uFE0F Token \xFCreteci gerekti\u011Finde yeniden deneyecek",resizeSuccess:"\u2705 Resim {width}x{height} boyutuna yeniden boyutland\u0131r\u0131ld\u0131",paintingPaused:"\u23F8\uFE0F Boyama duraklat\u0131ld\u0131, Konum X: {x}, Y: {y}",captchaNeeded:"\u2757 CAPTCHA gerekli. Devam etmek i\xE7in bir pikseli manuel olarak boyay\u0131n.",saveData:"\u0130lerlemeyi Kaydet",loadData:"\u0130lerlemeyi Y\xFCkle",saveToFile:"Dosyaya Kaydet",loadFromFile:"Dosyadan Y\xFCkle",dataManager:"Veri Y\xF6neticisi",autoSaved:"\u2705 \u0130lerleme otomatik olarak kaydedildi",dataLoaded:"\u2705 \u0130lerleme ba\u015Far\u0131yla y\xFCklendi",fileSaved:"\u2705 \u0130lerleme dosyaya ba\u015Far\u0131yla kaydedildi",fileLoaded:"\u2705 \u0130lerleme dosyadan ba\u015Far\u0131yla y\xFCklendi",noSavedData:"\u274C Kay\u0131tl\u0131 ilerleme bulunamad\u0131",savedDataFound:"\u2705 Kay\u0131tl\u0131 ilerleme bulundu! Devam etmek i\xE7in y\xFCkleyin.",savedDate:"Kaydedilme tarihi: {date}",clickLoadToContinue:"Devam etmek i\xE7in '\u0130lerlemeyi Y\xFCkle'ye t\u0131klay\u0131n.",fileError:"\u274C Dosya i\u015Flenirken hata olu\u015Ftu",invalidFileFormat:"\u274C Ge\xE7ersiz dosya format\u0131",paintingSpeed:"Boyama H\u0131z\u0131",pixelsPerSecond:"piksel/saniye",speedSetting:"H\u0131z: {speed} piksel/sn",settings:"Ayarlar",botSettings:"Bot Ayarlar\u0131",close:"Kapat",language:"Dil",themeSettings:"Tema Ayarlar\u0131",themeSettingsDesc:"Aray\xFCz i\xE7in tercih etti\u011Finiz renk temas\u0131n\u0131 se\xE7in.",languageSelectDesc:"Tercih etti\u011Finiz dili se\xE7in. De\u011Fi\u015Fiklikler hemen uygulanacakt\u0131r.",autoCaptcha:"Oto-CAPTCHA \xC7\xF6z\xFCc\xFC",autoCaptchaDesc:"CAPTCHA s\xFCresi doldu\u011Funda manuel piksel yerle\u015Ftirmeyi taklit ederek otomatik \xE7\xF6zmeyi dener.",applySettings:"Ayarlar\u0131 Uygula",settingsSaved:"\u2705 Ayarlar ba\u015Far\u0131yla kaydedildi!",speedOn:"A\xE7\u0131k",speedOff:"Kapal\u0131",cooldownSettings:"Bekleme S\xFCresi Ayarlar\u0131",waitCharges:"Haklar \u015Fu seviyeye ula\u015Fana kadar bekle",captchaSolving:"\u{1F916} CAPTCHA \xE7\xF6z\xFClmeye \xE7al\u0131\u015F\u0131l\u0131yor...",captchaFailed:"\u274C Oto-CAPTCHA ba\u015Far\u0131s\u0131z oldu. Bir pikseli manuel boyay\u0131n.",automation:"Otomasyon",noChargesThreshold:"\u231B Haklar\u0131n {threshold} seviyesine ula\u015Fmas\u0131 bekleniyor. \u015Eu anda {current}. Sonraki {time} i\xE7inde...",tokenCapturedSuccess:"Token ba\u015Far\u0131yla yakaland\u0131! \u015Eimdi botu ba\u015Flatabilirsiniz.",notificationsNotSupported:"Bu taray\u0131c\u0131da bildirimler desteklenmiyor.",chargesReadyNotification:"WPlace \u2014 Haklar Haz\u0131r",chargesReadyMessage:"Haklar haz\u0131r: {current} / {max}. E\u015Fik: {threshold}.",testNotificationTitle:"WPlace \u2014 Test",testNotificationMessage:"Bu bir test bildirimidir.",showStats:"\u0130statistikleri G\xF6ster",compactMode:"Kompakt Mod",refreshCharges:"Haklar\u0131 Yenile",closeStats:"\u0130statistikleri Kapat",zoomOut:"Uzakla\u015Ft\u0131r",zoomIn:"Yak\u0131nla\u015Ft\u0131r",fitToView:"G\xF6r\xFCn\xFCme s\u0131\u011Fd\u0131r",actualSize:"Ger\xE7ek boyut (100%)",panMode:"Kayd\u0131r (g\xF6r\xFCn\xFCm\xFC hareket ettirmek i\xE7in s\xFCr\xFCkle)",clearIgnoredPixels:"G\xF6rmezden gelinen t\xFCm pikselleri temizle",invertMask:"Maskeyi ters \xE7evir",waitingSetupComplete:"\u{1F504} \u0130lk kurulumun tamamlanmas\u0131 bekleniyor...",waitingTokenGenerator:"\u{1F504} Token \xFCretecinin ba\u015Flat\u0131lmas\u0131 bekleniyor...",uploadImageFirst:"Uygun renkleri yakalamak i\xE7in \xF6nce bir resim y\xFCkleyin",pleaseWaitInitialSetup:"\u{1F504} \u0130lerlemeyi y\xFCklemeden \xF6nce l\xFCtfen ilk kurulumun tamamlanmas\u0131n\u0131 bekleyin.",pleaseWaitFileSetup:"\u{1F504} Dosyadan y\xFCklemeden \xF6nce l\xFCtfen ilk kurulumun tamamlanmas\u0131n\u0131 bekleyin.",errorSavingProgress:"\u274C \u0130lerlemeyi kaydetme hatas\u0131",errorLoadingProgress:"\u274C \u0130lerlemeyi y\xFCkleme hatas\u0131",fileOperationsAvailable:"\u{1F4C2} Dosya i\u015Flemleri (Y\xFCkle/Kar\u015F\u0131ya Y\xFCkle) art\u0131k mevcut!",tokenGeneratorReady:"\u{1F511} Token \xFCreteci haz\u0131r!",paintingStats:"Boyama \u0130statistikleri",enablePaintingSpeedLimit:"Boyama h\u0131z limitini etkinle\u015Ftir (batch boyut kontrol\xFC)",enableNotifications:"Bildirimleri etkinle\u015Ftir",notifyOnChargesThreshold:"Haklar e\u015Fi\u011Fe ula\u015Ft\u0131\u011F\u0131nda bildir",onlyWhenNotFocused:"Sadece sekme odaklanmad\u0131\u011F\u0131nda",repeatEvery:"Her tekrarla",minutesPl:"dakika",grantPermission:"\u0130zin Ver",test:"Test",showAllColorsIncluding:"T\xFCm Renkleri G\xF6ster (kullan\u0131lamayanlar dahil)",chromaWeight:"Renk Doygunlu\u011Fu A\u011F\u0131rl\u0131\u011F\u0131",downloadPreview:"\xD6nizlemeyi \u0130ndir",apply:"Uygula",cancel:"\u0130ptal",fit:"S\u0131\u011Fd\u0131r",hundred:"100%",clear:"Temizle",invert:"Ters \xE7evir",reprocessingOverlay:"Katman yeniden i\u015Fleniyor...",overlayUpdated:"Katman g\xFCncellendi!",notificationsEnabled:"Bildirimler etkinle\u015Ftirildi.",notificationsPermissionDenied:"Bildirim izni reddedildi.",overlayEnabled:"Katman etkinle\u015Ftirildi.",overlayDisabled:"Katman devre d\u0131\u015F\u0131 b\u0131rak\u0131ld\u0131.",tokenSourceSet:"Token kayna\u011F\u0131 \u015Funa ayarland\u0131: {source}",batchModeSet:"Batch modu \u015Funa ayarland\u0131: {mode}",randomRange:"Rastgele Aral\u0131k",normalFixedSize:"Normal Sabit Boyut",advancedColorSettingsReset:"Geli\u015Fmi\u015F renk ayarlar\u0131 s\u0131f\u0131rland\u0131.",shiftRowAltColumn:"Shift = Sat\u0131r \u2022 Alt = S\xFCtun",hideTurnstileBtn:"Gizle",turnstileInstructions:"Cloudflare Turnstile \u2014 g\xF6sterilirse l\xFCtfen kontrol\xFC tamamlay\u0131n",uploadImageFirstColors:"Uygun renkleri yakalamak i\xE7in l\xFCtfen \xF6nce bir resim y\xFCkleyin",availableColors:"Uygun Renkler ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Geni\u015Fletme Modu",minimize:"K\xFC\xE7\xFClt",restore:"Geri Y\xFCkle",hideStats:"\u0130statistikleri Gizle",paintOptions:"Boya Se\xE7enekleri",paintWhitePixels:"Beyaz pikselleri boya",paintTransparentPixels:"\u015Eeffaf pikselleri boya"},uk:{title:"WPlace \u0410\u0432\u0442\u043E-\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",toggleOverlay:"\u041F\u0435\u0440\u0435\u043C\u043A\u043D\u0443\u0442\u0438 \u043E\u0432\u0435\u0440\u043B\u0435\u0439",scanColors:"\u0421\u043A\u0430\u043D\u0443\u0432\u0430\u0442\u0438 \u043A\u043E\u043B\u044C\u043E\u0440\u0438",uploadImage:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",resizeImage:"\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0440\u043E\u0437\u043C\u0456\u0440 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",selectPosition:"\u0412\u0438\u0431\u0440\u0430\u0442\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E",startPainting:"\u041F\u043E\u0447\u0430\u0442\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",stopPainting:"\u0417\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",checkingColors:"\u{1F50D} \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432...",noColorsFound:"\u274C \u0412\u0456\u0434\u043A\u0440\u0438\u0439 \u043F\u0430\u043B\u0456\u0442\u0440\u0443 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432 \u043D\u0430 \u0441\u0430\u0439\u0442\u0456 \u0442\u0430 \u0441\u043F\u0440\u043E\u0431\u0443\u0439 \u0449\u0435 \u0440\u0430\u0437!",colorsFound:"\u2705 \u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E {count} \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432. \u0413\u043E\u0442\u043E\u0432\u043E \u0434\u043E \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F.",loadingImage:"\u{1F5BC}\uFE0F \u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F...",imageLoaded:"\u2705 \u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E. \u0412\u0430\u043B\u0456\u0434\u043D\u0438\u0445 \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432: {count}",imageError:"\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",selectPositionAlert:"\u041D\u0430\u043C\u0430\u043B\u044E\u0439 \u043F\u0435\u0440\u0448\u0438\u0439 \u043F\u0456\u043A\u0441\u0435\u043B\u044C \u0443 \u043C\u0456\u0441\u0446\u0456, \u0434\u0435 \u043C\u0430\u0454 \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0430\u0440\u0442!",waitingPosition:"\u{1F446} \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u043D\u0430 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u043D\u043E\u0433\u043E \u043F\u0456\u043A\u0441\u0435\u043B\u044F...",positionSet:"\u2705 \u041F\u043E\u0437\u0438\u0446\u0456\u044E \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E!",positionTimeout:"\u274C \u0427\u0430\u0441 \u0432\u0438\u0431\u043E\u0440\u0443 \u043F\u043E\u0437\u0438\u0446\u0456\u0457 \u0432\u0438\u0447\u0435\u0440\u043F\u0430\u043D\u043E",startPaintingMsg:"\u{1F3A8} \u041F\u043E\u0447\u0430\u0442\u043E\u043A \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F...",paintingProgress:"\u{1F9F1} \u041F\u0440\u043E\u0433\u0440\u0435\u0441: {painted}/{total} \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432...",noCharges:"\u231B \u041D\u0435\u043C\u0430\u0454 \u0437\u0430\u0440\u044F\u0434\u0456\u0432. \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F {time}...",paintingStopped:"\u23F9\uFE0F \u041C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0435\u043C",paintingComplete:"\u2705 \u041C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E! \u041D\u0430\u043C\u0430\u043B\u044C\u043E\u0432\u0430\u043D\u043E {count} \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432.",paintingError:"\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0456\u0434 \u0447\u0430\u0441 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",missingRequirements:"\u274C \u0421\u043F\u0435\u0440\u0448\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0442\u0430 \u0432\u0438\u0431\u0435\u0440\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E",progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441",pixels:"\u041F\u0456\u043A\u0441\u0435\u043B\u0456",charges:"\u0417\u0430\u0440\u044F\u0434\u0438",estimatedTime:"\u041E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u0438\u0439 \u0447\u0430\u0441",initMessage:"\u041D\u0430\u0442\u0438\u0441\u043D\u0438 '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F', \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438",waitingInit:"\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0456\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u0430\u0446\u0456\u0457...",initializingToken:"\u{1F527} \u0406\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u0430\u0446\u0456\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 Turnstile...",tokenReady:"\u2705 \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u0433\u043E\u0442\u043E\u0432\u0438\u0439 \u2013 \u043C\u043E\u0436\u043D\u0430 \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F!",tokenRetryLater:"\u26A0\uFE0F \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0441\u043F\u0440\u043E\u0431\u0443 \u0437\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0438",resizeSuccess:"\u2705 \u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u043C\u0456\u043D\u0435\u043D\u043E \u0434\u043E {width}x{height}",paintingPaused:"\u23F8\uFE0F \u041C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u043F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0456\u0457 X: {x}, Y: {y}",captchaNeeded:"\u2757 \u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 \u0442\u043E\u043A\u0435\u043D. \u0421\u043F\u0440\u043E\u0431\u0443\u0439 \u0442\u0440\u043E\u0445\u0438 \u043F\u0456\u0437\u043D\u0456\u0448\u0435.",saveData:"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441",loadData:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441",saveToFile:"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0443 \u0444\u0430\u0439\u043B",loadFromFile:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437 \u0444\u0430\u0439\u043B\u0443",dataManager:"\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0434\u0430\u043D\u0438\u0445",autoSaved:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",dataLoaded:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E",fileSaved:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0443 \u0444\u0430\u0439\u043B",fileLoaded:"\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E \u0437 \u0444\u0430\u0439\u043B\u0443",noSavedData:"\u274C \u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443",savedDataFound:"\u2705 \u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441! \u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438, \u0449\u043E\u0431 \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438?",savedDate:"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E: {date}",clickLoadToContinue:"\u041D\u0430\u0442\u0438\u0441\u043D\u0438 '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441', \u0449\u043E\u0431 \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438.",fileError:"\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043E\u0431\u0440\u043E\u0431\u043A\u0438 \u0444\u0430\u0439\u043B\u0443",invalidFileFormat:"\u274C \u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0443",paintingSpeed:"\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",pixelsPerSecond:"\u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432/\u0441\u0435\u043A\u0443\u043D\u0434\u0430",speedSetting:"\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C: {speed} \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432/\u0441\u0435\u043A",settings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",botSettings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0431\u043E\u0442\u0430",close:"\u0417\u0430\u043A\u0440\u0438\u0442\u0438",language:"\u041C\u043E\u0432\u0430",themeSettings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0435\u043C\u0438",themeSettingsDesc:"\u0412\u0438\u0431\u0435\u0440\u0438 \u0431\u0430\u0436\u0430\u043D\u0443 \u043A\u043E\u043B\u0456\u0440\u043D\u0443 \u0442\u0435\u043C\u0443 \u0434\u043B\u044F \u0456\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443.",languageSelectDesc:"\u0412\u0438\u0431\u0435\u0440\u0438 \u0431\u0430\u0436\u0430\u043D\u0443 \u043C\u043E\u0432\u0443. \u0417\u043C\u0456\u043D\u0438 \u043D\u0430\u0431\u0443\u0434\u0443\u0442\u044C \u0447\u0438\u043D\u043D\u043E\u0441\u0442\u0456 \u043E\u0434\u0440\u0430\u0437\u0443.",autoCaptcha:"\u0410\u0432\u0442\u043E-CAPTCHA (Turnstile)",autoCaptchaDesc:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u0442\u043E\u043A\u0435\u043D\u0438 Turnstile \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E \u0432\u0431\u0443\u0434\u043E\u0432\u0430\u043D\u043E\u0433\u043E \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430. \u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0454 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0456\u044E \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0443 \u0440\u0430\u0437\u0456 \u043F\u043E\u0442\u0440\u0435\u0431\u0438.",applySettings:"\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",settingsSaved:"\u2705 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E!",speedOn:"\u0423\u0432\u0456\u043C\u043A",speedOff:"\u0412\u0438\u043C\u043A",cooldownSettings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F",waitCharges:"\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u0442\u0438, \u0434\u043E\u043A\u0438 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u0430\u0440\u044F\u0434\u0456\u0432 \u0434\u043E\u0441\u044F\u0433\u043D\u0435",captchaSolving:"\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u044F \u0442\u043E\u043A\u0435\u043D\u0430 Turnstile...",captchaFailed:"\u274C \u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 \u0442\u043E\u043A\u0435\u043D Turnstile. \u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u044E \u0437\u0430\u043F\u0430\u0441\u043D\u0438\u0439 \u043C\u0435\u0442\u043E\u0434...",automation:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0456\u044F",noChargesThreshold:"\u231B \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F, \u0434\u043E\u043A\u0438 \u0437\u0430\u0440\u044F\u0434\u0438 \u0434\u043E\u0441\u044F\u0433\u043D\u0443\u0442\u044C {threshold}. \u0417\u0430\u0440\u0430\u0437 {current}. \u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0435 \u0447\u0435\u0440\u0435\u0437 {time}...",tokenCapturedSuccess:"\u0422\u043E\u043A\u0435\u043D \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u043E! \u041C\u043E\u0436\u0435\u0448 \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u0438 \u0431\u043E\u0442\u0430.",notificationsNotSupported:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043D\u0435 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u044E\u0442\u044C\u0441\u044F \u0432 \u0446\u044C\u043E\u043C\u0443 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456.",chargesReadyNotification:"WPlace \u2014 \u0417\u0430\u0440\u044F\u0434\u0438 \u0433\u043E\u0442\u043E\u0432\u0456",chargesReadyMessage:"\u0417\u0430\u0440\u044F\u0434\u0438 \u0433\u043E\u0442\u043E\u0432\u0456: {current} / {max}. \u041F\u043E\u0440\u0456\u0433: {threshold}.",testNotificationTitle:"WPlace \u2014 \u0422\u0435\u0441\u0442",testNotificationMessage:"\u0426\u0435 \u0442\u0435\u0441\u0442\u043E\u0432\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F.",showStats:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",compactMode:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",refreshCharges:"\u041E\u043D\u043E\u0432\u0438\u0442\u0438 \u0437\u0430\u0440\u044F\u0434\u0438",closeStats:"\u0417\u0430\u043A\u0440\u0438\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",zoomOut:"\u0417\u043C\u0435\u043D\u0448\u0438\u0442\u0438",zoomIn:"\u0417\u0431\u0456\u043B\u044C\u0448\u0438\u0442\u0438",fitToView:"\u041F\u0456\u0434\u0456\u0433\u043D\u0430\u0442\u0438 \u043F\u0456\u0434 \u0432\u0456\u043A\u043D\u043E",actualSize:"\u0420\u0435\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440 (100%)",panMode:"\u041F\u0435\u0440\u0435\u043C\u0456\u0449\u0435\u043D\u043D\u044F (\u043F\u0435\u0440\u0435\u0442\u044F\u0433\u043D\u0456 \u0434\u043B\u044F \u0440\u0443\u0445\u0443)",clearIgnoredPixels:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0456 \u0456\u0433\u043D\u043E\u0440\u043E\u0432\u0430\u043D\u0456 \u043F\u0456\u043A\u0441\u0435\u043B\u0456",invertMask:"\u0406\u043D\u0432\u0435\u0440\u0442\u0443\u0432\u0430\u0442\u0438 \u043C\u0430\u0441\u043A\u0443",waitingSetupComplete:"\u{1F504} \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F...",waitingTokenGenerator:"\u{1F504} \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0456\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u0430\u0446\u0456\u0457 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0442\u043E\u043A\u0435\u043D\u0456\u0432...",uploadImageFirst:"\u0421\u043F\u0435\u0440\u0448\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u043B\u044F \u0437\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u043D\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432",pleaseWaitInitialSetup:"\u{1F504} \u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u043F\u043E\u0447\u0435\u043A\u0430\u0439 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u043C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443.",pleaseWaitFileSetup:"\u{1F504} \u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u043F\u043E\u0447\u0435\u043A\u0430\u0439 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u043C \u0437 \u0444\u0430\u0439\u043B\u0443.",errorSavingProgress:"\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443",errorLoadingProgress:"\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443",fileOperationsAvailable:"\u{1F4C2} \u0424\u0430\u0439\u043B\u043E\u0432\u0456 \u043E\u043F\u0435\u0440\u0430\u0446\u0456\u0457 (\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F/\u0412\u0438\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F) \u0442\u0435\u043F\u0435\u0440 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456!",tokenGeneratorReady:"\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u0433\u043E\u0442\u043E\u0432\u0438\u0439!",paintingStats:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",enablePaintingSpeedLimit:"\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u043D\u044F \u0448\u0432\u0438\u0434\u043A\u043E\u0441\u0442\u0456 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F (\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0440\u043E\u0437\u043C\u0456\u0440\u0443 \u043F\u0430\u043A\u0435\u0442\u0430)",enableNotifications:"\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F",notifyOnChargesThreshold:"\u0421\u043F\u043E\u0432\u0456\u0441\u0447\u0430\u0442\u0438 \u043F\u0440\u0438 \u0434\u043E\u0441\u044F\u0433\u043D\u0435\u043D\u043D\u0456 \u043F\u043E\u0440\u043E\u0433\u0443 \u0437\u0430\u0440\u044F\u0434\u0456\u0432",onlyWhenNotFocused:"\u041B\u0438\u0448\u0435 \u043A\u043E\u043B\u0438 \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u043D\u0435 \u0432 \u0444\u043E\u043A\u0443\u0441\u0456",repeatEvery:"\u041F\u043E\u0432\u0442\u043E\u0440\u044E\u0432\u0430\u0442\u0438 \u043A\u043E\u0436\u043D\u0456",minutesPl:"\u0445\u0432\u0438\u043B\u0438\u043D",grantPermission:"\u041D\u0430\u0434\u0430\u0442\u0438 \u0434\u043E\u0437\u0432\u0456\u043B",test:"\u0422\u0435\u0441\u0442",showAllColorsIncluding:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u043A\u043E\u043B\u044C\u043E\u0440\u0438 (\u0432\u043A\u043B\u044E\u0447\u0430\u044E\u0447\u0438 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456)",chromaWeight:"\u0412\u0430\u0433\u0430 \u043D\u0430\u0441\u0438\u0447\u0435\u043D\u043E\u0441\u0442\u0456",downloadPreview:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434",apply:"\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438",cancel:"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",fit:"\u041F\u0456\u0434\u0456\u0433\u043D\u0430\u0442\u0438",hundred:"100%",clear:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438",invert:"\u0406\u043D\u0432\u0435\u0440\u0442\u0443\u0432\u0430\u0442\u0438",reprocessingOverlay:"\u041F\u0435\u0440\u0435\u043E\u0431\u0440\u043E\u0431\u043A\u0430 \u043E\u0432\u0435\u0440\u043B\u0435\u044F...",overlayUpdated:"\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043E!",notificationsEnabled:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E.",notificationsPermissionDenied:"\u0414\u043E\u0437\u0432\u0456\u043B \u043D\u0430 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043E.",overlayEnabled:"\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E.",overlayDisabled:"\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E.",tokenSourceSet:"\u0414\u0436\u0435\u0440\u0435\u043B\u043E \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E: {source}",batchModeSet:"\u041F\u0430\u043A\u0435\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E: {mode}",randomRange:"\u0412\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0438\u0439 \u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D",normalFixedSize:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439 \u0444\u0456\u043A\u0441\u043E\u0432\u0430\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440",advancedColorSettingsReset:"\u041F\u0440\u043E\u0441\u0443\u043D\u0443\u0442\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432 \u0441\u043A\u0438\u043D\u0443\u0442\u043E.",shiftRowAltColumn:"Shift = \u0420\u044F\u0434\u043E\u043A \u2022 Alt = \u0421\u0442\u043E\u0432\u043F\u0435\u0446\u044C",hideTurnstileBtn:"\u0421\u0445\u043E\u0432\u0430\u0442\u0438",turnstileInstructions:"Cloudflare Turnstile \u2014 \u0431\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0437\u0430\u0432\u0435\u0440\u0448\u0438 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0443, \u044F\u043A\u0449\u043E \u0432\u043E\u043D\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430",uploadImageFirstColors:"\u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0441\u043F\u0435\u0440\u0448\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u043B\u044F \u0437\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u043D\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432",availableColors:"\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043A\u043E\u043B\u044C\u043E\u0440\u0438 ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"\u0420\u0435\u0436\u0438\u043C \u0440\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u043D\u044F",minimize:"\u041C\u0456\u043D\u0456\u043C\u0456\u0437\u0443\u0432\u0430\u0442\u0438",restore:"\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438",hideStats:"\u041F\u0440\u0438\u0445\u043E\u0432\u0430\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",paintOptions:"\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",paintWhitePixels:"\u041C\u0430\u043B\u044E\u0432\u0430\u0442\u0438 \u0431\u0456\u043B\u0456 \u043F\u0456\u043A\u0441\u0435\u043B\u0456",paintTransparentPixels:"\u041C\u0430\u043B\u044E\u0432\u0430\u0442\u0438 \u043F\u0440\u043E\u0437\u043E\u0440\u0456 \u043F\u0456\u043A\u0441\u0435\u043B\u0456"},vi:{title:"WPlace Auto-Image",toggleOverlay:"B\u1EADt/t\u1EAFt l\u1EDBp ph\u1EE7",scanColors:"Qu\xE9t m\xE0u",uploadImage:"T\u1EA3i l\xEAn h\xECnh \u1EA3nh",resizeImage:"Thay \u0111\u1ED5i k\xEDch th\u01B0\u1EDBc",selectPosition:"Ch\u1ECDn v\u1ECB tr\xED",startPainting:"B\u1EAFt \u0111\u1EA7u v\u1EBD",stopPainting:"D\u1EEBng v\u1EBD",checkingColors:"\u{1F50D} \u0110ang ki\u1EC3m tra m\xE0u s\u1EAFc c\xF3 s\u1EB5n...",noColorsFound:"\u274C H\xE3y m\u1EDF b\u1EA3ng m\xE0u tr\xEAn trang web v\xE0 th\u1EED l\u1EA1i!",colorsFound:"\u2705 T\xECm th\u1EA5y {count} m\xE0u. S\u1EB5n s\xE0ng \u0111\u1EC3 t\u1EA3i l\xEAn.",loadingImage:"\u{1F5BC}\uFE0F \u0110ang t\u1EA3i h\xECnh \u1EA3nh...",imageLoaded:"\u2705 \u0110\xE3 t\u1EA3i h\xECnh \u1EA3nh v\u1EDBi {count} pixel h\u1EE3p l\u1EC7",imageError:"\u274C L\u1ED7i khi t\u1EA3i h\xECnh \u1EA3nh",selectPositionAlert:"V\u1EBD pixel \u0111\u1EA7u ti\xEAn t\u1EA1i v\u1ECB tr\xED b\u1EA1n mu\u1ED1n t\xE1c ph\u1EA9m ngh\u1EC7 thu\u1EADt b\u1EAFt \u0111\u1EA7u!",waitingPosition:"\u{1F446} \u0110ang ch\u1EDD b\u1EA1n v\u1EBD pixel tham chi\u1EBFu...",positionSet:"\u2705 \u0110\xE3 \u0111\u1EB7t v\u1ECB tr\xED th\xE0nh c\xF4ng!",positionTimeout:"\u274C H\u1EBFt th\u1EDDi gian ch\u1ECDn v\u1ECB tr\xED",startPaintingMsg:"\u{1F3A8} B\u1EAFt \u0111\u1EA7u v\u1EBD...",paintingProgress:"\u{1F9F1} Ti\u1EBFn tr\xECnh: {painted}/{total} pixel...",noCharges:"\u231B Kh\xF4ng c\xF3 \u0111i\u1EC7n t\xEDch. \u0110ang ch\u1EDD {time}...",paintingStopped:"\u23F9\uFE0F Ng\u01B0\u1EDDi d\xF9ng \u0111\xE3 d\u1EEBng v\u1EBD",paintingComplete:"\u2705 Ho\xE0n th\xE0nh v\u1EBD! \u0110\xE3 v\u1EBD {count} pixel.",paintingError:"\u274C L\u1ED7i trong qu\xE1 tr\xECnh v\u1EBD",missingRequirements:"\u274C H\xE3y t\u1EA3i l\xEAn h\xECnh \u1EA3nh v\xE0 ch\u1ECDn v\u1ECB tr\xED tr\u01B0\u1EDBc",progress:"Ti\u1EBFn tr\xECnh",pixels:"Pixel",charges:"\u0110i\u1EC7n t\xEDch",estimatedTime:"Th\u1EDDi gian \u01B0\u1EDBc t\xEDnh",initMessage:"Nh\u1EA5p 'T\u1EA3i l\xEAn h\xECnh \u1EA3nh' \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u",waitingInit:"\u0110ang ch\u1EDD kh\u1EDFi t\u1EA1o...",initializingToken:"\u{1F527} \u0110ang kh\u1EDFi t\u1EA1o b\u1ED9 t\u1EA1o token Turnstile...",tokenReady:"\u2705 B\u1ED9 t\u1EA1o token \u0111\xE3 s\u1EB5n s\xE0ng - b\u1EA1n c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u v\u1EBD!",tokenRetryLater:"\u26A0\uFE0F B\u1ED9 t\u1EA1o token s\u1EBD th\u1EED l\u1EA1i khi c\u1EA7n thi\u1EBFt",resizeSuccess:"\u2705 \u0110\xE3 thay \u0111\u1ED5i k\xEDch th\u01B0\u1EDBc h\xECnh \u1EA3nh th\xE0nh {width}x{height}",paintingPaused:"\u23F8\uFE0F T\u1EA1m d\u1EEBng v\u1EBD t\u1EA1i v\u1ECB tr\xED X: {x}, Y: {y}",captchaNeeded:"\u2757 T\u1EA1o token th\u1EA5t b\u1EA1i. Vui l\xF2ng th\u1EED l\u1EA1i sau.",saveData:"L\u01B0u ti\u1EBFn tr\xECnh",loadData:"T\u1EA3i ti\u1EBFn tr\xECnh",saveToFile:"L\u01B0u v\xE0o t\u1EC7p",loadFromFile:"T\u1EA3i t\u1EEB t\u1EC7p",dataManager:"D\u1EEF li\u1EC7u",autoSaved:"\u2705 \u0110\xE3 t\u1EF1 \u0111\u1ED9ng l\u01B0u ti\u1EBFn tr\xECnh",dataLoaded:"\u2705 \u0110\xE3 t\u1EA3i ti\u1EBFn tr\xECnh th\xE0nh c\xF4ng",fileSaved:"\u2705 \u0110\xE3 l\u01B0u v\xE0o t\u1EC7p th\xE0nh c\xF4ng",fileLoaded:"\u2705 \u0110\xE3 t\u1EA3i t\u1EEB t\u1EC7p th\xE0nh c\xF4ng",noSavedData:"\u274C Kh\xF4ng t\xECm th\u1EA5y ti\u1EBFn tr\xECnh \u0111\xE3 l\u01B0u",savedDataFound:"\u2705 T\xECm th\u1EA5y ti\u1EBFn tr\xECnh \u0111\xE3 l\u01B0u! T\u1EA3i \u0111\u1EC3 ti\u1EBFp t\u1EE5c?",savedDate:"\u0110\xE3 l\u01B0u v\xE0o: {date}",clickLoadToContinue:"Nh\u1EA5p 'T\u1EA3i ti\u1EBFn tr\xECnh' \u0111\u1EC3 ti\u1EBFp t\u1EE5c.",fileError:"\u274C L\u1ED7i khi x\u1EED l\xFD t\u1EC7p",invalidFileFormat:"\u274C \u0110\u1ECBnh d\u1EA1ng t\u1EC7p kh\xF4ng h\u1EE3p l\u1EC7",paintingSpeed:"T\u1ED1c \u0111\u1ED9 v\u1EBD",pixelsPerSecond:"pixel/gi\xE2y",speedSetting:"T\u1ED1c \u0111\u1ED9: {speed} pixel/gi\xE2y",settings:"C\xE0i \u0111\u1EB7t",botSettings:"C\xE0i \u0111\u1EB7t Bot",close:"\u0110\xF3ng",language:"Ng\xF4n ng\u1EEF",themeSettings:"C\xE0i \u0111\u1EB7t Giao di\u1EC7n",themeSettingsDesc:"Ch\u1ECDn ch\u1EE7 \u0111\u1EC1 m\xE0u s\u1EAFc y\xEAu th\xEDch cho giao di\u1EC7n.",languageSelectDesc:"Ch\u1ECDn ng\xF4n ng\u1EEF \u01B0a th\xEDch. Thay \u0111\u1ED5i s\u1EBD c\xF3 hi\u1EC7u l\u1EF1c ngay l\u1EADp t\u1EE9c.",autoCaptcha:"T\u1EF1 \u0111\u1ED9ng gi\u1EA3i CAPTCHA",autoCaptchaDesc:"T\u1EF1 \u0111\u1ED9ng c\u1ED1 g\u1EAFng gi\u1EA3i CAPTCHA b\u1EB1ng c\xE1ch m\xF4 ph\u1ECFng vi\u1EC7c \u0111\u1EB7t pixel th\u1EE7 c\xF4ng khi token h\u1EBFt h\u1EA1n.",applySettings:"\xC1p d\u1EE5ng c\xE0i \u0111\u1EB7t",settingsSaved:"\u2705 \u0110\xE3 l\u01B0u c\xE0i \u0111\u1EB7t th\xE0nh c\xF4ng!",speedOn:"B\u1EADt",speedOff:"T\u1EAFt",cooldownSettings:"C\xE0i \u0111\u1EB7t th\u1EDDi gian ch\u1EDD",waitCharges:"Ch\u1EDD cho \u0111\u1EBFn khi s\u1ED1 l\u1EA7n s\u1EA1c \u0111\u1EA1t",captchaSolving:"\u{1F916} \u0110ang c\u1ED1 g\u1EAFng gi\u1EA3i CAPTCHA...",captchaFailed:"\u274C Gi\u1EA3i CAPTCHA t\u1EF1 \u0111\u1ED9ng th\u1EA5t b\u1EA1i. Vui l\xF2ng v\u1EBD m\u1ED9t pixel th\u1EE7 c\xF4ng.",automation:"T\u1EF1 \u0111\u1ED9ng h\xF3a",noChargesThreshold:"\u231B \u0110ang ch\u1EDD s\u1ED1 l\u1EA7n s\u1EA1c \u0111\u1EA1t {threshold}. Hi\u1EC7n t\u1EA1i {current}. L\u1EA7n ti\u1EBFp theo trong {time}...",tokenCapturedSuccess:"\u0110\xE3 b\u1EAFt token th\xE0nh c\xF4ng! B\u1EA1n c\xF3 th\u1EC3 kh\u1EDFi \u0111\u1ED9ng bot ngay.",notificationsNotSupported:"Th\xF4ng b\xE1o kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 trong tr\xECnh duy\u1EC7t n\xE0y.",chargesReadyNotification:"WPlace \u2014 \u0110i\u1EC7n t\xEDch s\u1EB5n s\xE0ng",chargesReadyMessage:"\u0110i\u1EC7n t\xEDch s\u1EB5n s\xE0ng: {current} / {max}. Ng\u01B0\u1EE1ng: {threshold}.",testNotificationTitle:"WPlace \u2014 Th\u1EED nghi\u1EC7m",testNotificationMessage:"\u0110\xE2y l\xE0 th\xF4ng b\xE1o th\u1EED nghi\u1EC7m.",showStats:"Hi\u1EC3n th\u1ECB th\u1ED1ng k\xEA",compactMode:"Ch\u1EBF \u0111\u1ED9 g\u1ECDn",refreshCharges:"L\xE0m m\u1EDBi \u0111i\u1EC7n t\xEDch",closeStats:"\u0110\xF3ng th\u1ED1ng k\xEA",zoomOut:"Thu nh\u1ECF",zoomIn:"Ph\xF3ng to",fitToView:"V\u1EEBa m\xE0n h\xECnh",actualSize:"K\xEDch th\u01B0\u1EDBc th\u1EF1c (100%)",panMode:"Di chuy\u1EC3n (k\xE9o \u0111\u1EC3 di chuy\u1EC3n)",clearIgnoredPixels:"X\xF3a t\u1EA5t c\u1EA3 pixel b\u1ECB b\u1ECF qua",invertMask:"\u0110\u1EA3o ng\u01B0\u1EE3c m\u1EB7t n\u1EA1",waitingSetupComplete:"\u{1F504} \u0110ang ch\u1EDD thi\u1EBFt l\u1EADp ban \u0111\u1EA7u ho\xE0n t\u1EA5t...",waitingTokenGenerator:"\u{1F504} \u0110ang ch\u1EDD b\u1ED9 t\u1EA1o token kh\u1EDFi t\u1EA1o...",uploadImageFirst:"T\u1EA3i l\xEAn h\xECnh \u1EA3nh tr\u01B0\u1EDBc \u0111\u1EC3 b\u1EAFt m\xE0u c\xF3 s\u1EB5n",pleaseWaitInitialSetup:"\u{1F504} Vui l\xF2ng \u0111\u1EE3i thi\u1EBFt l\u1EADp ban \u0111\u1EA7u ho\xE0n t\u1EA5t tr\u01B0\u1EDBc khi t\u1EA3i ti\u1EBFn tr\xECnh.",pleaseWaitFileSetup:"\u{1F504} Vui l\xF2ng \u0111\u1EE3i thi\u1EBFt l\u1EADp ban \u0111\u1EA7u ho\xE0n t\u1EA5t tr\u01B0\u1EDBc khi t\u1EA3i t\u1EEB t\u1EC7p.",errorSavingProgress:"\u274C L\u1ED7i khi l\u01B0u ti\u1EBFn tr\xECnh",errorLoadingProgress:"\u274C L\u1ED7i khi t\u1EA3i ti\u1EBFn tr\xECnh",fileOperationsAvailable:"\u{1F4C2} C\xE1c thao t\xE1c t\u1EC7p (T\u1EA3i/Upload) \u0111\xE3 c\xF3 s\u1EB5n!",tokenGeneratorReady:"\u{1F511} B\u1ED9 t\u1EA1o token \u0111\xE3 s\u1EB5n s\xE0ng!",paintingStats:"Th\u1ED1ng k\xEA v\u1EBD",enablePaintingSpeedLimit:"B\u1EADt gi\u1EDBi h\u1EA1n t\u1ED1c \u0111\u1ED9 v\u1EBD (ki\u1EC3m so\xE1t k\xEDch th\u01B0\u1EDBc l\xF4)",enableNotifications:"B\u1EADt th\xF4ng b\xE1o",notifyOnChargesThreshold:"Th\xF4ng b\xE1o khi \u0111i\u1EC7n t\xEDch \u0111\u1EA1t ng\u01B0\u1EE1ng",onlyWhenNotFocused:"Ch\u1EC9 khi tab kh\xF4ng \u0111\u01B0\u1EE3c ch\u1ECDn",repeatEvery:"L\u1EB7p l\u1EA1i m\u1ED7i",minutesPl:"ph\xFAt",grantPermission:"C\u1EA5p quy\u1EC1n",test:"Th\u1EED nghi\u1EC7m",showAllColorsIncluding:"Hi\u1EC3n th\u1ECB t\u1EA5t c\u1EA3 m\xE0u (bao g\u1ED3m kh\xF4ng c\xF3 s\u1EB5n)",chromaWeight:"Tr\u1ECDng s\u1ED1 \u0111\u1ED9 b\xE3o h\xF2a",downloadPreview:"T\u1EA3i xu\u1ED1ng xem tr\u01B0\u1EDBc",apply:"\xC1p d\u1EE5ng",cancel:"H\u1EE7y",fit:"V\u1EEBa khung",hundred:"100%",clear:"X\xF3a",invert:"\u0110\u1EA3o ng\u01B0\u1EE3c",reprocessingOverlay:"\u0110ang x\u1EED l\xFD l\u1EA1i l\u1EDBp ph\u1EE7...",overlayUpdated:"L\u1EDBp ph\u1EE7 \u0111\xE3 c\u1EADp nh\u1EADt!",notificationsEnabled:"\u0110\xE3 b\u1EADt th\xF4ng b\xE1o.",notificationsPermissionDenied:"Quy\u1EC1n th\xF4ng b\xE1o b\u1ECB t\u1EEB ch\u1ED1i.",overlayEnabled:"\u0110\xE3 b\u1EADt l\u1EDBp ph\u1EE7.",overlayDisabled:"\u0110\xE3 t\u1EAFt l\u1EDBp ph\u1EE7.",tokenSourceSet:"Ngu\u1ED3n token \u0111\u01B0\u1EE3c \u0111\u1EB7t th\xE0nh: {source}",batchModeSet:"Ch\u1EBF \u0111\u1ED9 l\xF4 \u0111\u01B0\u1EE3c \u0111\u1EB7t th\xE0nh: {mode}",randomRange:"Ph\u1EA1m vi ng\u1EABu nhi\xEAn",normalFixedSize:"K\xEDch th\u01B0\u1EDBc c\u1ED1 \u0111\u1ECBnh b\xECnh th\u01B0\u1EDDng",advancedColorSettingsReset:"\u0110\xE3 \u0111\u1EB7t l\u1EA1i c\xE0i \u0111\u1EB7t m\xE0u n\xE2ng cao.",shiftRowAltColumn:"Shift = H\xE0ng \u2022 Alt = C\u1ED9t",hideTurnstileBtn:"\u1EA8n",turnstileInstructions:"Cloudflare Turnstile \u2014 vui l\xF2ng ho\xE0n th\xE0nh ki\u1EC3m tra n\u1EBFu \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB",uploadImageFirstColors:"Vui l\xF2ng t\u1EA3i l\xEAn h\xECnh \u1EA3nh tr\u01B0\u1EDBc \u0111\u1EC3 b\u1EAFt m\xE0u c\xF3 s\u1EB5n",availableColors:"M\xE0u c\xF3 s\u1EB5n ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Ch\u1EBF \u0111\u1ED9 m\u1EDF r\u1ED9ng",minimize:"Thu nh\u1ECF",restore:"Kh\xF4i ph\u1EE5c",hideStats:"\u1EA8n th\u1ED1ng k\xEA",paintOptions:"T\xF9y ch\u1ECDn v\u1EBD",paintWhitePixels:"V\u1EBD \u0111i\u1EC3m \u1EA3nh tr\u1EAFng",paintTransparentPixels:"V\u1EBD \u0111i\u1EC3m \u1EA3nh trong su\u1ED1t"},"zh-CN":{title:"WPlace \u81EA\u52A8\u56FE\u50CF",toggleOverlay:"\u5207\u6362\u8986\u76D6\u5C42",scanColors:"\u626B\u63CF\u989C\u8272",uploadImage:"\u4E0A\u4F20\u56FE\u50CF",resizeImage:"\u8C03\u6574\u5927\u5C0F",selectPosition:"\u9009\u62E9\u4F4D\u7F6E",startPainting:"\u5F00\u59CB\u7ED8\u5236",stopPainting:"\u505C\u6B62\u7ED8\u5236",checkingColors:"\u{1F50D} \u6B63\u5728\u68C0\u67E5\u53EF\u7528\u989C\u8272...",noColorsFound:"\u274C \u8BF7\u5728\u7F51\u7AD9\u4E0A\u6253\u5F00\u8C03\u8272\u677F\u540E\u518D\u8BD5\uFF01",colorsFound:"\u2705 \u627E\u5230 {count} \u4E2A\u53EF\u7528\u989C\u8272\uFF0C\u51C6\u5907\u4E0A\u4F20\u3002",loadingImage:"\u{1F5BC}\uFE0F \u6B63\u5728\u52A0\u8F7D\u56FE\u50CF...",imageLoaded:"\u2705 \u56FE\u50CF\u5DF2\u52A0\u8F7D\uFF0C\u5305\u542B {count} \u4E2A\u6709\u6548\u50CF\u7D20",imageError:"\u274C \u52A0\u8F7D\u56FE\u50CF\u65F6\u51FA\u9519",selectPositionAlert:"\u8BF7\u5728\u4F60\u60F3\u8BA9\u4F5C\u54C1\u5F00\u59CB\u7684\u4F4D\u7F6E\u7ED8\u5236\u7B2C\u4E00\u4E2A\u50CF\u7D20\uFF01",waitingPosition:"\u{1F446} \u6B63\u5728\u7B49\u5F85\u4F60\u7ED8\u5236\u53C2\u8003\u50CF\u7D20...",positionSet:"\u2705 \u4F4D\u7F6E\u8BBE\u7F6E\u6210\u529F\uFF01",positionTimeout:"\u274C \u9009\u62E9\u4F4D\u7F6E\u8D85\u65F6",startPaintingMsg:"\u{1F3A8} \u5F00\u59CB\u7ED8\u5236...",paintingProgress:"\u{1F9F1} \u8FDB\u5EA6: {painted}/{total} \u50CF\u7D20...",noCharges:"\u231B \u65E0\u53EF\u7528\u6B21\u6570\uFF0C\u7B49\u5F85 {time}...",paintingStopped:"\u23F9\uFE0F \u5DF2\u88AB\u7528\u6237\u505C\u6B62",paintingComplete:"\u2705 \u7ED8\u5236\u5B8C\u6210\uFF01\u5171\u7ED8\u5236 {count} \u4E2A\u50CF\u7D20\u3002",paintingError:"\u274C \u7ED8\u5236\u8FC7\u7A0B\u4E2D\u51FA\u9519",missingRequirements:"\u274C \u8BF7\u5148\u52A0\u8F7D\u56FE\u50CF\u5E76\u9009\u62E9\u4F4D\u7F6E",progress:"\u8FDB\u5EA6",pixels:"\u50CF\u7D20",charges:"\u6B21\u6570",estimatedTime:"\u9884\u8BA1\u65F6\u95F4",initMessage:'\u70B9\u51FB"\u4E0A\u4F20\u56FE\u50CF"\u5F00\u59CB',waitingInit:"\u6B63\u5728\u7B49\u5F85\u521D\u59CB\u5316...",initializingToken:"\u{1F527} \u6B63\u5728\u521D\u59CB\u5316 Turnstile \u4EE4\u724C\u751F\u6210\u5668...",tokenReady:"\u2705 \u4EE4\u724C\u751F\u6210\u5668\u5DF2\u5C31\u7EEA - \u53EF\u4EE5\u5F00\u59CB\u7ED8\u5236\uFF01",tokenRetryLater:"\u26A0\uFE0F \u4EE4\u724C\u751F\u6210\u5668\u7A0D\u540E\u5C06\u91CD\u8BD5",resizeSuccess:"\u2705 \u56FE\u50CF\u5DF2\u8C03\u6574\u4E3A {width}x{height}",paintingPaused:"\u23F8\uFE0F \u5728\u4F4D\u7F6E X: {x}, Y: {y} \u6682\u505C",captchaNeeded:"\u2757 \u4EE4\u724C\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002",saveData:"\u4FDD\u5B58\u8FDB\u5EA6",loadData:"\u52A0\u8F7D\u8FDB\u5EA6",saveToFile:"\u4FDD\u5B58\u5230\u6587\u4EF6",loadFromFile:"\u4ECE\u6587\u4EF6\u52A0\u8F7D",dataManager:"\u6570\u636E\u7BA1\u7406",autoSaved:"\u2705 \u8FDB\u5EA6\u5DF2\u81EA\u52A8\u4FDD\u5B58",dataLoaded:"\u2705 \u8FDB\u5EA6\u52A0\u8F7D\u6210\u529F",fileSaved:"\u2705 \u5DF2\u6210\u529F\u4FDD\u5B58\u5230\u6587\u4EF6",fileLoaded:"\u2705 \u5DF2\u6210\u529F\u4ECE\u6587\u4EF6\u52A0\u8F7D",noSavedData:"\u274C \u672A\u627E\u5230\u5DF2\u4FDD\u5B58\u8FDB\u5EA6",savedDataFound:"\u2705 \u627E\u5230\u5DF2\u4FDD\u5B58\u8FDB\u5EA6\uFF01\u662F\u5426\u52A0\u8F7D\u7EE7\u7EED\uFF1F",savedDate:"\u4FDD\u5B58\u65F6\u95F4: {date}",clickLoadToContinue:'\u70B9\u51FB"\u52A0\u8F7D\u8FDB\u5EA6"\u7EE7\u7EED\u3002',fileError:"\u274C \u5904\u7406\u6587\u4EF6\u65F6\u51FA\u9519",invalidFileFormat:"\u274C \u6587\u4EF6\u683C\u5F0F\u65E0\u6548",paintingSpeed:"\u7ED8\u5236\u901F\u5EA6",pixelsPerSecond:"\u50CF\u7D20/\u79D2",speedSetting:"\u901F\u5EA6: {speed} \u50CF\u7D20/\u79D2",settings:"\u8BBE\u7F6E",botSettings:"\u673A\u5668\u4EBA\u8BBE\u7F6E",close:"\u5173\u95ED",language:"\u8BED\u8A00",themeSettings:"\u4E3B\u9898\u8BBE\u7F6E",themeSettingsDesc:"\u4E3A\u754C\u9762\u9009\u62E9\u4F60\u559C\u6B22\u7684\u914D\u8272\u4E3B\u9898\u3002",languageSelectDesc:"\u9009\u62E9\u4F60\u504F\u597D\u7684\u8BED\u8A00\uFF0C\u53D8\u66F4\u7ACB\u5373\u751F\u6548\u3002",autoCaptcha:"\u81EA\u52A8 CAPTCHA \u89E3\u51B3",autoCaptchaDesc:"\u4F7F\u7528\u96C6\u6210\u7684\u751F\u6210\u5668\u81EA\u52A8\u751F\u6210 Turnstile \u4EE4\u724C\uFF0C\u5FC5\u8981\u65F6\u56DE\u9000\u5230\u6D4F\u89C8\u5668\u81EA\u52A8\u5316\u3002",applySettings:"\u5E94\u7528\u8BBE\u7F6E",settingsSaved:"\u2705 \u8BBE\u7F6E\u4FDD\u5B58\u6210\u529F\uFF01",speedOn:"\u5F00\u542F",speedOff:"\u5173\u95ED",cooldownSettings:"\u51B7\u5374\u8BBE\u7F6E",waitCharges:"\u7B49\u5F85\u6B21\u6570\u8FBE\u5230",captchaSolving:"\u{1F511} \u6B63\u5728\u751F\u6210 Turnstile \u4EE4\u724C...",captchaFailed:"\u274C \u4EE4\u724C\u751F\u6210\u5931\u8D25\u3002\u5C1D\u8BD5\u56DE\u9000\u65B9\u6CD5...",automation:"\u81EA\u52A8\u5316",noChargesThreshold:"\u231B \u7B49\u5F85\u6B21\u6570\u8FBE\u5230 {threshold}\u3002\u5F53\u524D {current}\u3002\u4E0B\u6B21\u5728 {time}...",tokenCapturedSuccess:"\u4EE4\u724C\u6355\u83B7\u6210\u529F\uFF01\u73B0\u5728\u53EF\u4EE5\u542F\u52A8\u673A\u5668\u4EBA\u3002",notificationsNotSupported:"\u6B64\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u901A\u77E5\u3002",chargesReadyNotification:"WPlace \u2014 \u6B21\u6570\u5C31\u7EEA",chargesReadyMessage:"\u6B21\u6570\u5C31\u7EEA\uFF1A{current} / {max}\u3002\u9608\u503C\uFF1A{threshold}\u3002",testNotificationTitle:"WPlace \u2014 \u6D4B\u8BD5",testNotificationMessage:"\u8FD9\u662F\u4E00\u4E2A\u6D4B\u8BD5\u901A\u77E5\u3002",showStats:"\u663E\u793A\u7EDF\u8BA1",compactMode:"\u7D27\u51D1\u6A21\u5F0F",refreshCharges:"\u5237\u65B0\u6B21\u6570",closeStats:"\u5173\u95ED\u7EDF\u8BA1",zoomOut:"\u7F29\u5C0F",zoomIn:"\u653E\u5927",fitToView:"\u9002\u5408\u7A97\u53E3",actualSize:"\u5B9E\u9645\u5927\u5C0F (100%)",panMode:"\u5E73\u79FB\uFF08\u62D6\u52A8\u79FB\u52A8\u89C6\u56FE\uFF09",clearIgnoredPixels:"\u6E05\u9664\u6240\u6709\u5FFD\u7565\u7684\u50CF\u7D20",invertMask:"\u53CD\u8F6C\u8499\u7248",waitingSetupComplete:"\u{1F504} \u7B49\u5F85\u521D\u59CB\u8BBE\u7F6E\u5B8C\u6210...",waitingTokenGenerator:"\u{1F504} \u7B49\u5F85\u4EE4\u724C\u751F\u6210\u5668\u521D\u59CB\u5316...",uploadImageFirst:"\u8BF7\u5148\u4E0A\u4F20\u56FE\u50CF\u4EE5\u83B7\u53D6\u53EF\u7528\u989C\u8272",pleaseWaitInitialSetup:"\u{1F504} \u8BF7\u7B49\u5F85\u521D\u59CB\u8BBE\u7F6E\u5B8C\u6210\u540E\u518D\u52A0\u8F7D\u8FDB\u5EA6\u3002",pleaseWaitFileSetup:"\u{1F504} \u8BF7\u7B49\u5F85\u521D\u59CB\u8BBE\u7F6E\u5B8C\u6210\u540E\u518D\u4ECE\u6587\u4EF6\u52A0\u8F7D\u3002",errorSavingProgress:"\u274C \u4FDD\u5B58\u8FDB\u5EA6\u65F6\u51FA\u9519",errorLoadingProgress:"\u274C \u52A0\u8F7D\u8FDB\u5EA6\u65F6\u51FA\u9519",fileOperationsAvailable:"\u{1F4C2} \u6587\u4EF6\u64CD\u4F5C\uFF08\u52A0\u8F7D/\u4E0A\u4F20\uFF09\u73B0\u5DF2\u53EF\u7528\uFF01",tokenGeneratorReady:"\u{1F511} \u4EE4\u724C\u751F\u6210\u5668\u51C6\u5907\u5C31\u7EEA\uFF01",paintingStats:"\u7ED8\u5236\u7EDF\u8BA1",enablePaintingSpeedLimit:"\u542F\u7528\u7ED8\u5236\u901F\u5EA6\u9650\u5236\uFF08\u6279\u6B21\u5927\u5C0F\u63A7\u5236\uFF09",enableNotifications:"\u542F\u7528\u901A\u77E5",notifyOnChargesThreshold:"\u6B21\u6570\u8FBE\u5230\u9608\u503C\u65F6\u901A\u77E5",onlyWhenNotFocused:"\u4EC5\u5728\u6807\u7B7E\u9875\u672A\u805A\u7126\u65F6",repeatEvery:"\u91CD\u590D\u95F4\u9694",minutesPl:"\u5206\u949F",grantPermission:"\u6388\u4E88\u6743\u9650",test:"\u6D4B\u8BD5",showAllColorsIncluding:"\u663E\u793A\u6240\u6709\u989C\u8272\uFF08\u5305\u62EC\u4E0D\u53EF\u7528\uFF09",chromaWeight:"\u8272\u5EA6\u6743\u91CD",downloadPreview:"\u4E0B\u8F7D\u9884\u89C8",apply:"\u5E94\u7528",cancel:"\u53D6\u6D88",fit:"\u9002\u5408",hundred:"100%",clear:"\u6E05\u9664",invert:"\u53CD\u8F6C",reprocessingOverlay:"\u91CD\u65B0\u5904\u7406\u8986\u76D6\u5C42...",overlayUpdated:"\u8986\u76D6\u5C42\u5DF2\u66F4\u65B0\uFF01",notificationsEnabled:"\u5DF2\u542F\u7528\u901A\u77E5\u3002",notificationsPermissionDenied:"\u901A\u77E5\u6743\u9650\u88AB\u62D2\u7EDD\u3002",overlayEnabled:"\u5DF2\u542F\u7528\u8986\u76D6\u5C42\u3002",overlayDisabled:"\u5DF2\u7981\u7528\u8986\u76D6\u5C42\u3002",tokenSourceSet:"\u4EE4\u724C\u6E90\u8BBE\u7F6E\u4E3A\uFF1A{source}",batchModeSet:"\u6279\u6B21\u6A21\u5F0F\u8BBE\u7F6E\u4E3A\uFF1A{mode}",randomRange:"\u968F\u673A\u8303\u56F4",normalFixedSize:"\u6B63\u5E38\u56FA\u5B9A\u5927\u5C0F",advancedColorSettingsReset:"\u5DF2\u91CD\u7F6E\u9AD8\u7EA7\u989C\u8272\u8BBE\u7F6E\u3002",shiftRowAltColumn:"Shift = \u884C \u2022 Alt = \u5217",hideTurnstileBtn:"\u9690\u85CF",turnstileInstructions:"Cloudflare Turnstile \u2014 \u5982\u6709\u663E\u793A\u8BF7\u5B8C\u6210\u9A8C\u8BC1",uploadImageFirstColors:"\u8BF7\u5148\u4E0A\u4F20\u56FE\u50CF\u4EE5\u83B7\u53D6\u53EF\u7528\u989C\u8272",availableColors:"\u53EF\u7528\u989C\u8272 ({count})",colorTooltip:`ID\uFF1A{id}
RGB\uFF1A{rgb}`,expandMode:"\u5C55\u5F00\u6A21\u5F0F",minimize:"\u6700\u5C0F\u5316",restore:"\u6062\u590D",hideStats:"\u9690\u85CF\u7EDF\u8BA1",paintOptions:"\u7ED8\u56FE\u9009\u9879",paintWhitePixels:"\u7ED8\u5236\u767D\u8272\u50CF\u7D20",paintTransparentPixels:"\u7ED8\u5236\u900F\u660E\u50CF\u7D20"},"zh-TW":{title:"WPlace \u81EA\u52D5\u5716\u50CF",toggleOverlay:"\u5207\u63DB\u8986\u84CB\u5C64",scanColors:"\u6383\u63CF\u984F\u8272",uploadImage:"\u4E0A\u50B3\u5716\u50CF",resizeImage:"\u8ABF\u6574\u5927\u5C0F",selectPosition:"\u9078\u64C7\u4F4D\u7F6E",startPainting:"\u958B\u59CB\u7E6A\u88FD",stopPainting:"\u505C\u6B62\u7E6A\u88FD",checkingColors:"\u{1F50D} \u6B63\u5728\u6AA2\u67E5\u53EF\u7528\u984F\u8272...",noColorsFound:"\u274C \u8ACB\u5728\u7DB2\u7AD9\u4E0A\u6253\u958B\u8ABF\u8272\u677F\u5F8C\u518D\u8A66\uFF01",colorsFound:"\u2705 \u627E\u5230 {count} \u500B\u53EF\u7528\u984F\u8272\uFF0C\u6E96\u5099\u4E0A\u50B3\u3002",loadingImage:"\u{1F5BC}\uFE0F \u6B63\u5728\u8F09\u5165\u5716\u50CF...",imageLoaded:"\u2705 \u5716\u50CF\u5DF2\u8F09\u5165\uFF0C\u5305\u542B {count} \u500B\u6709\u6548\u50CF\u7D20",imageError:"\u274C \u8F09\u5165\u5716\u50CF\u6642\u51FA\u932F",selectPositionAlert:"\u8ACB\u5728\u4F60\u60F3\u8B93\u4F5C\u54C1\u958B\u59CB\u7684\u4F4D\u7F6E\u7E6A\u88FD\u7B2C\u4E00\u500B\u50CF\u7D20\uFF01",waitingPosition:"\u{1F446} \u6B63\u5728\u7B49\u5F85\u4F60\u7E6A\u88FD\u53C3\u8003\u50CF\u7D20...",positionSet:"\u2705 \u4F4D\u7F6E\u8A2D\u5B9A\u6210\u529F\uFF01",positionTimeout:"\u274C \u9078\u64C7\u4F4D\u7F6E\u903E\u6642",startPaintingMsg:"\u{1F3A8} \u958B\u59CB\u7E6A\u88FD...",paintingProgress:"\u{1F9F1} \u9032\u5EA6: {painted}/{total} \u50CF\u7D20...",noCharges:"\u231B \u7121\u53EF\u7528\u6B21\u6578\uFF0C\u7B49\u5F85 {time}...",paintingStopped:"\u23F9\uFE0F \u5DF2\u88AB\u4F7F\u7528\u8005\u505C\u6B62",paintingComplete:"\u2705 \u7E6A\u88FD\u5B8C\u6210\uFF01\u5171\u7E6A\u88FD {count} \u500B\u50CF\u7D20\u3002",paintingError:"\u274C \u7E6A\u88FD\u904E\u7A0B\u4E2D\u51FA\u932F",missingRequirements:"\u274C \u8ACB\u5148\u8F09\u5165\u5716\u50CF\u4E26\u9078\u64C7\u4F4D\u7F6E",progress:"\u9032\u5EA6",pixels:"\u50CF\u7D20",charges:"\u6B21\u6578",estimatedTime:"\u9810\u8A08\u6642\u9593",initMessage:"\u9EDE\u64CA\u300C\u4E0A\u50B3\u5716\u50CF\u300D\u958B\u59CB",waitingInit:"\u6B63\u5728\u7B49\u5F85\u521D\u59CB\u5316...",initializingToken:"\u{1F527} \u6B63\u5728\u521D\u59CB\u5316 Turnstile \u4EE4\u724C\u7522\u751F\u5668...",tokenReady:"\u2705 \u4EE4\u724C\u7522\u751F\u5668\u5DF2\u5C31\u7DD2 - \u53EF\u4EE5\u958B\u59CB\u7E6A\u88FD\uFF01",tokenRetryLater:"\u26A0\uFE0F \u4EE4\u724C\u7522\u751F\u5668\u7A0D\u5F8C\u5C07\u91CD\u8A66",resizeSuccess:"\u2705 \u5716\u50CF\u5DF2\u8ABF\u6574\u70BA {width}x{height}",paintingPaused:"\u23F8\uFE0F \u5728\u4F4D\u7F6E X: {x}, Y: {y} \u66AB\u505C",captchaNeeded:"\u2757 \u4EE4\u724C\u7522\u751F\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66\u3002",saveData:"\u5132\u5B58\u9032\u5EA6",loadData:"\u8F09\u5165\u9032\u5EA6",saveToFile:"\u5132\u5B58\u81F3\u6A94\u6848",loadFromFile:"\u5F9E\u6A94\u6848\u8F09\u5165",dataManager:"\u8CC7\u6599\u7BA1\u7406",autoSaved:"\u2705 \u9032\u5EA6\u5DF2\u81EA\u52D5\u5132\u5B58",dataLoaded:"\u2705 \u9032\u5EA6\u8F09\u5165\u6210\u529F",fileSaved:"\u2705 \u5DF2\u6210\u529F\u5132\u5B58\u81F3\u6A94\u6848",fileLoaded:"\u2705 \u5DF2\u6210\u529F\u5F9E\u6A94\u6848\u8F09\u5165",noSavedData:"\u274C \u672A\u627E\u5230\u5DF2\u5132\u5B58\u9032\u5EA6",savedDataFound:"\u2705 \u627E\u5230\u5DF2\u5132\u5B58\u9032\u5EA6\uFF01\u662F\u5426\u8F09\u5165\u4EE5\u7E7C\u7E8C\uFF1F",savedDate:"\u5132\u5B58\u6642\u9593: {date}",clickLoadToContinue:"\u9EDE\u64CA\u300C\u8F09\u5165\u9032\u5EA6\u300D\u7E7C\u7E8C\u3002",fileError:"\u274C \u8655\u7406\u6A94\u6848\u6642\u51FA\u932F",invalidFileFormat:"\u274C \u6A94\u6848\u683C\u5F0F\u7121\u6548",paintingSpeed:"\u7E6A\u88FD\u901F\u5EA6",pixelsPerSecond:"\u50CF\u7D20/\u79D2",speedSetting:"\u901F\u5EA6: {speed} \u50CF\u7D20/\u79D2",settings:"\u8A2D\u5B9A",botSettings:"\u6A5F\u5668\u4EBA\u8A2D\u5B9A",close:"\u95DC\u9589",language:"\u8A9E\u8A00",themeSettings:"\u4E3B\u984C\u8A2D\u5B9A",themeSettingsDesc:"\u70BA\u4ECB\u9762\u9078\u64C7\u4F60\u559C\u6B61\u7684\u914D\u8272\u4E3B\u984C\u3002",languageSelectDesc:"\u9078\u64C7\u4F60\u504F\u597D\u7684\u8A9E\u8A00\uFF0C\u8B8A\u66F4\u7ACB\u5373\u751F\u6548\u3002",autoCaptcha:"\u81EA\u52D5 CAPTCHA \u89E3\u6C7A",autoCaptchaDesc:"\u4F7F\u7528\u6574\u5408\u7684\u7522\u751F\u5668\u81EA\u52D5\u7522\u751F Turnstile \u4EE4\u724C\uFF0C\u5FC5\u8981\u6642\u56DE\u9000\u5230\u700F\u89BD\u5668\u81EA\u52D5\u5316\u3002",applySettings:"\u5957\u7528\u8A2D\u5B9A",settingsSaved:"\u2705 \u8A2D\u5B9A\u5132\u5B58\u6210\u529F\uFF01",speedOn:"\u958B\u555F",speedOff:"\u95DC\u9589",cooldownSettings:"\u51B7\u537B\u8A2D\u5B9A",waitCharges:"\u7B49\u5F85\u6B21\u6578\u9054\u5230",captchaSolving:"\u{1F511} \u6B63\u5728\u7522\u751F Turnstile \u4EE4\u724C...",captchaFailed:"\u274C \u4EE4\u724C\u7522\u751F\u5931\u6557\u3002\u5617\u8A66\u56DE\u9000\u65B9\u6CD5...",automation:"\u81EA\u52D5\u5316",noChargesThreshold:"\u231B \u7B49\u5F85\u6B21\u6578\u9054\u5230 {threshold}\u3002\u76EE\u524D {current}\u3002\u4E0B\u6B21\u5728 {time}...",tokenCapturedSuccess:"\u4EE4\u724C\u6355\u7372\u6210\u529F\uFF01\u73FE\u5728\u53EF\u4EE5\u555F\u52D5\u6A5F\u5668\u4EBA\u3002",notificationsNotSupported:"\u6B64\u700F\u89BD\u5668\u4E0D\u652F\u6301\u901A\u77E5\u3002",chargesReadyNotification:"WPlace \u2014 \u6B21\u6578\u5C31\u7DD2",chargesReadyMessage:"\u6B21\u6578\u5C31\u7DD2\uFF1A{current} / {max}\u3002\u95BE\u503C\uFF1A{threshold}\u3002",testNotificationTitle:"WPlace \u2014 \u6E2C\u8A66",testNotificationMessage:"\u9019\u662F\u4E00\u500B\u6E2C\u8A66\u901A\u77E5\u3002",showStats:"\u986F\u793A\u7D71\u8A08",compactMode:"\u7DCA\u51D1\u6A21\u5F0F",refreshCharges:"\u5237\u65B0\u6B21\u6578",closeStats:"\u95DC\u9589\u7D71\u8A08",zoomOut:"\u7E2E\u5C0F",zoomIn:"\u653E\u5927",fitToView:"\u9069\u5408\u8996\u7A97",actualSize:"\u5BE6\u969B\u5927\u5C0F (100%)",panMode:"\u5E73\u79FB\uFF08\u62D6\u62C9\u79FB\u52D5\u8996\u5716\uFF09",clearIgnoredPixels:"\u6E05\u9664\u6240\u6709\u5FFD\u7565\u7684\u50CF\u7D20",invertMask:"\u53CD\u8F49\u906E\u7F69",waitingSetupComplete:"\u{1F504} \u7B49\u5F85\u521D\u59CB\u8A2D\u5B9A\u5B8C\u6210...",waitingTokenGenerator:"\u{1F504} \u7B49\u5F85\u4EE4\u724C\u7522\u751F\u5668\u521D\u59CB\u5316...",uploadImageFirst:"\u8ACB\u5148\u4E0A\u50B3\u5716\u50CF\u4EE5\u7372\u53D6\u53EF\u7528\u984F\u8272",pleaseWaitInitialSetup:"\u{1F504} \u8ACB\u7B49\u5F85\u521D\u59CB\u8A2D\u5B9A\u5B8C\u6210\u5F8C\u518D\u8F09\u5165\u9032\u5EA6\u3002",pleaseWaitFileSetup:"\u{1F504} \u8ACB\u7B49\u5F85\u521D\u59CB\u8A2D\u5B9A\u5B8C\u6210\u5F8C\u518D\u5F9E\u6A94\u6848\u8F09\u5165\u3002",errorSavingProgress:"\u274C \u5132\u5B58\u9032\u5EA6\u6642\u51FA\u932F",errorLoadingProgress:"\u274C \u8F09\u5165\u9032\u5EA6\u6642\u51FA\u932F",fileOperationsAvailable:"\u{1F4C2} \u6A94\u6848\u64CD\u4F5C\uFF08\u8F09\u5165/\u4E0A\u50B3\uFF09\u73FE\u5DF2\u53EF\u7528\uFF01",tokenGeneratorReady:"\u{1F511} \u4EE4\u724C\u7522\u751F\u5668\u6E96\u5099\u5C31\u7DD2\uFF01",paintingStats:"\u7E6A\u5236\u7D71\u8A08",enablePaintingSpeedLimit:"\u555F\u7528\u7E6A\u5236\u901F\u5EA6\u9650\u5236\uFF08\u6279\u6B21\u5927\u5C0F\u63A7\u5236\uFF09",enableNotifications:"\u555F\u7528\u901A\u77E5",notifyOnChargesThreshold:"\u6B21\u6578\u9054\u5230\u95FE\u503C\u6642\u901A\u77E5",onlyWhenNotFocused:"\u50C5\u5728\u6A19\u7C64\u9801\u672A\u805A\u7126\u6642",repeatEvery:"\u91CD\u8907\u9593\u9694",minutesPl:"\u5206\u9418",grantPermission:"\u6388\u4E88\u6B0A\u9650",test:"\u6E2C\u8A66",showAllColorsIncluding:"\u986F\u793A\u6240\u6709\u984F\u8272\uFF08\u5305\u62EC\u4E0D\u53EF\u7528\uFF09",chromaWeight:"\u8272\u5EA6\u6B0A\u91CD",downloadPreview:"\u4E0B\u8F09\u9810\u89BD",apply:"\u5957\u7528",cancel:"\u53D6\u6D88",fit:"\u9069\u5408",hundred:"100%",clear:"\u6E05\u9664",invert:"\u53CD\u8F49",reprocessingOverlay:"\u91CD\u65B0\u8655\u7406\u8986\u84CB\u5C64...",overlayUpdated:"\u8986\u84CB\u5C64\u5DF2\u66F4\u65B0\uFF01",notificationsEnabled:"\u5DF2\u555F\u7528\u901A\u77E5\u3002",notificationsPermissionDenied:"\u901A\u77E5\u6B0A\u9650\u88AB\u62D2\u7D55\u3002",overlayEnabled:"\u5DF2\u555F\u7528\u8986\u84CB\u5C64\u3002",overlayDisabled:"\u5DF2\u7981\u7528\u8986\u84CB\u5C64\u3002",tokenSourceSet:"\u4EE4\u724C\u4F86\u6E90\u8A2D\u5B9A\u70BA\uFF1A{source}",batchModeSet:"\u6279\u6B21\u6A21\u5F0F\u8A2D\u5B9A\u70BA\uFF1A{mode}",randomRange:"\u96A8\u6A5F\u7BC4\u570D",normalFixedSize:"\u6B63\u5E38\u56FA\u5B9A\u5927\u5C0F",advancedColorSettingsReset:"\u5DF2\u91CD\u7F6E\u9032\u968E\u984F\u8272\u8A2D\u5B9A\u3002",shiftRowAltColumn:"Shift = \u5217 \u2022 Alt = \u884C",hideTurnstileBtn:"\u96B1\u85CF",turnstileInstructions:"Cloudflare Turnstile \u2014 \u5982\u6709\u986F\u793A\u8ACB\u5B8C\u6210\u9A57\u8B49",uploadImageFirstColors:"\u8ACB\u5148\u4E0A\u50B3\u5716\u50CF\u4EE5\u7372\u53D6\u53EF\u7528\u984F\u8272",availableColors:"\u53EF\u7528\u984F\u8272 ({count})",colorTooltip:`ID\uFF1A{id}
RGB\uFF1A{rgb}`,expandMode:"\u5C55\u958B\u6A21\u5F0F",minimize:"\u6700\u5C0F\u5316",restore:"\u6062\u5FA9",hideStats:"\u96B1\u85CF\u7D71\u8A08",paintOptions:"\u7E6A\u5716\u9078\u9805",paintWhitePixels:"\u7E6A\u88FD\u767D\u8272\u50CF\u7D20",paintTransparentPixels:"\u7E6A\u88FD\u900F\u660E\u50CF\u7D20"}};function Ja(g,X,ke){let he=J=>(J/=255,J<=.04045?J/12.92:Math.pow((J+.055)/1.055,2.4)),te=he(g),ve=he(X),pt=he(ke),gt=te*.4124+ve*.3576+pt*.1805,De=te*.2126+ve*.7152+pt*.0722,ht=te*.0193+ve*.1192+pt*.9505;gt/=.95047,De/=1,ht/=1.08883;let nt=J=>J>.008856?Math.cbrt(J):7.787*J+16/116,ia=nt(gt),ut=nt(De),oa=nt(ht),kt=116*ut-16,Ea=500*(ia-ut),e=200*(ut-oa);return[kt,Ea,e]}function Za(g,X){return Math.sqrt(Math.pow(g[0]-X[0],2)+Math.pow(g[1]-X[1],2)+Math.pow(g[2]-X[2],2))}function Qa(g,X){let ke=Math.floor(g/1e3),he=Math.floor(X/1e3),te=g%1e3,ve=X%1e3;return te<0&&(te+=1e3),ve<0&&(ve+=1e3),{regionX:ke,regionY:he,pixelX:te,pixelY:ve}}function Pa(g,X){return`${g},${X}`}function en(g,X,ke,he){let te=ke-g,ve=he-X;return Math.sqrt(te*te+ve*ve)}function dt(g,X,ke){if(!g||X<0||ke<0||X>=g.width||ke>=g.height)return null;let he=(ke*g.width+X)*4,te=g.data;return[te[he],te[he+1],te[he+2],te[he+3]]}function Ve(g,X,ke,he){if(!g||X<0||ke<0||X>=g.width||ke>=g.height)return!1;let te=(ke*g.width+X)*4,ve=g.data;return ve[te]=he[0],ve[te+1]=he[1],ve[te+2]=he[2],ve[te+3]=he[3],!0}function Bt(g,X=100){return!g||!Array.isArray(g)||g.length<4?!1:g[3]<X}function Xe(g,X=250){return!g||!Array.isArray(g)||g.length<3?!1:g[0]>=X&&g[1]>=X&&g[2]>=X}var tn={COOLDOWN_DEFAULT:31e3,TRANSPARENCY_THRESHOLD:100,WHITE_THRESHOLD:250,LOG_INTERVAL:10,PAINTING_SPEED:{MIN:1,MAX:1e3,DEFAULT:5},PAINTING_SPEED_ENABLED:!1,AUTO_CAPTCHA_ENABLED:!0,TOKEN_SOURCE:"generator",COOLDOWN_CHARGE_THRESHOLD:1,NOTIFICATIONS:{ENABLED:!0,ON_CHARGES_REACHED:!0,ONLY_WHEN_UNFOCUSED:!0,REPEAT_MINUTES:5},OVERLAY:{OPACITY_DEFAULT:.6,BLUE_MARBLE_DEFAULT:!1,ditheringEnabled:!1}};(async()=>{let g={...tn,BATCH_MODE:"normal",RANDOM_BATCH_RANGE:{MIN:3,MAX:20},COLOR_MAP:{0:{id:1,name:"Black",rgb:{r:0,g:0,b:0}},1:{id:2,name:"Dark Gray",rgb:{r:60,g:60,b:60}},2:{id:3,name:"Gray",rgb:{r:120,g:120,b:120}},3:{id:4,name:"Light Gray",rgb:{r:210,g:210,b:210}},4:{id:5,name:"White",rgb:{r:255,g:255,b:255}},5:{id:6,name:"Deep Red",rgb:{r:96,g:0,b:24}},6:{id:7,name:"Red",rgb:{r:237,g:28,b:36}},7:{id:8,name:"Orange",rgb:{r:255,g:127,b:39}},8:{id:9,name:"Gold",rgb:{r:246,g:170,b:9}},9:{id:10,name:"Yellow",rgb:{r:249,g:221,b:59}},10:{id:11,name:"Light Yellow",rgb:{r:255,g:250,b:188}},11:{id:12,name:"Dark Green",rgb:{r:14,g:185,b:104}},12:{id:13,name:"Green",rgb:{r:19,g:230,b:123}},13:{id:14,name:"Light Green",rgb:{r:135,g:255,b:94}},14:{id:15,name:"Dark Teal",rgb:{r:12,g:129,b:110}},15:{id:16,name:"Teal",rgb:{r:16,g:174,b:166}},16:{id:17,name:"Light Teal",rgb:{r:19,g:225,b:190}},17:{id:20,name:"Cyan",rgb:{r:96,g:247,b:242}},18:{id:44,name:"Light Cyan",rgb:{r:187,g:250,b:242}},19:{id:18,name:"Dark Blue",rgb:{r:40,g:80,b:158}},20:{id:19,name:"Blue",rgb:{r:64,g:147,b:228}},21:{id:21,name:"Indigo",rgb:{r:107,g:80,b:246}},22:{id:22,name:"Light Indigo",rgb:{r:153,g:177,b:251}},23:{id:23,name:"Dark Purple",rgb:{r:120,g:12,b:153}},24:{id:24,name:"Purple",rgb:{r:170,g:56,b:185}},25:{id:25,name:"Light Purple",rgb:{r:224,g:159,b:249}},26:{id:26,name:"Dark Pink",rgb:{r:203,g:0,b:122}},27:{id:27,name:"Pink",rgb:{r:236,g:31,b:128}},28:{id:28,name:"Light Pink",rgb:{r:243,g:141,b:169}},29:{id:29,name:"Dark Brown",rgb:{r:104,g:70,b:52}},30:{id:30,name:"Brown",rgb:{r:149,g:104,b:42}},31:{id:31,name:"Beige",rgb:{r:248,g:178,b:119}},32:{id:52,name:"Light Beige",rgb:{r:255,g:197,b:165}},33:{id:32,name:"Medium Gray",rgb:{r:170,g:170,b:170}},34:{id:33,name:"Dark Red",rgb:{r:165,g:14,b:30}},35:{id:34,name:"Light Red",rgb:{r:250,g:128,b:114}},36:{id:35,name:"Dark Orange",rgb:{r:228,g:92,b:26}},37:{id:37,name:"Dark Goldenrod",rgb:{r:156,g:132,b:49}},38:{id:38,name:"Goldenrod",rgb:{r:197,g:173,b:49}},39:{id:39,name:"Light Goldenrod",rgb:{r:232,g:212,b:95}},40:{id:40,name:"Dark Olive",rgb:{r:74,g:107,b:58}},41:{id:41,name:"Olive",rgb:{r:90,g:148,b:74}},42:{id:42,name:"Light Olive",rgb:{r:132,g:197,b:115}},43:{id:43,name:"Dark Cyan",rgb:{r:15,g:121,b:159}},44:{id:45,name:"Light Blue",rgb:{r:125,g:199,b:255}},45:{id:46,name:"Dark Indigo",rgb:{r:77,g:49,b:184}},46:{id:47,name:"Dark Slate Blue",rgb:{r:74,g:66,b:132}},47:{id:48,name:"Slate Blue",rgb:{r:122,g:113,b:196}},48:{id:49,name:"Light Slate Blue",rgb:{r:181,g:174,b:241}},49:{id:53,name:"Dark Peach",rgb:{r:155,g:82,b:73}},50:{id:54,name:"Peach",rgb:{r:209,g:128,b:120}},51:{id:55,name:"Light Peach",rgb:{r:250,g:182,b:164}},52:{id:50,name:"Light Brown",rgb:{r:219,g:164,b:99}},53:{id:56,name:"Dark Tan",rgb:{r:123,g:99,b:82}},54:{id:57,name:"Tan",rgb:{r:156,g:132,b:107}},55:{id:36,name:"Light Tan",rgb:{r:214,g:181,b:148}},56:{id:51,name:"Dark Beige",rgb:{r:209,g:128,b:81}},57:{id:61,name:"Dark Stone",rgb:{r:109,g:100,b:63}},58:{id:62,name:"Stone",rgb:{r:148,g:140,b:107}},59:{id:63,name:"Light Stone",rgb:{r:205,g:197,b:158}},60:{id:58,name:"Dark Slate",rgb:{r:51,g:57,b:65}},61:{id:59,name:"Slate",rgb:{r:109,g:117,b:141}},62:{id:60,name:"Light Slate",rgb:{r:179,g:185,b:209}},63:{id:0,name:"Transparent",rgb:null}},CSS_CLASSES:{BUTTON_PRIMARY:`
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white; border: none; border-radius: 8px; padding: 10px 16px;
        cursor: pointer; font-weight: 500; transition: all 0.3s ease;
        display: flex; align-items: center; gap: 8px;
      `,BUTTON_SECONDARY:`
        background: rgba(255,255,255,0.1); color: white;
        border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
        padding: 8px 12px; cursor: pointer; transition: all 0.3s ease;
      `,MODERN_CARD:`
        background: rgba(255,255,255,0.1); border-radius: 12px;
        padding: 18px; border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(5px);
      `,GRADIENT_TEXT:`
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; font-weight: bold;
      `},currentTheme:"classic"},X=()=>Object.keys(xt),ke=()=>g.currentTheme,he=t=>{xt[t]&&(g.currentTheme=t,ve(),te(),ga())};function te(){let t=document.getElementById("wplace-theme-css");t&&t.remove();let a=ke();if(xt[a]){let n=document.createElement("style");n.id="wplace-theme-css",n.textContent=xt[a],document.head.appendChild(n)}}let ve=()=>{try{localStorage.setItem("wplace-theme",g.currentTheme)}catch(t){console.warn("Could not save theme preference:",t)}},pt=()=>{try{let t=localStorage.getItem("wplace-theme");t&&g.THEMES[t]&&(g.currentTheme=t)}catch(t){console.warn("Could not load theme preference:",t)}},gt=new Map,De={},ht=["en","ru","pt","vi","fr","id","tr","zh-CN","zh-TW","ja","ko","uk"],nt=async t=>{if(De[t])return De[t];if(Ca[t]){let a=Ca[t];if(typeof a=="object"&&a!==null&&Object.keys(a).length>0)return De[t]=a,console.log(`\u{1F4DA} Loaded ${t} translations successfully from embedded assets (${Object.keys(a).length} keys)`),a;console.warn(`\u274C Invalid embedded translation format for ${t}`)}else console.warn(`\u274C No embedded translations found for ${t}`);return null},ia=async()=>{let t=localStorage.getItem("wplace_language"),a=navigator.language,n=a.split("-")[0],o="en";try{t&&ht.includes(t)?(o=t,console.log(`\u{1F504} Using saved language preference: ${o}`)):ht.includes(a)?(o=a,localStorage.setItem("wplace_language",a),console.log(`\u{1F504} Using browser locale: ${o}`)):ht.includes(n)?(o=n,localStorage.setItem("wplace_language",n),console.log(`\u{1F504} Using browser language: ${o}`)):console.log("\u{1F504} No matching language found, using English fallback"),e.language=o,o!=="en"&&!De[o]&&(await nt(o)||(console.warn(`\u26A0\uFE0F Failed to load ${o} translations, falling back to English`),e.language="en",localStorage.setItem("wplace_language","en")))}catch(r){console.error("\u274C Error in loadLanguagePreference:",r),e.language="en"}},ut=t=>{try{let a=document.createElement("div");a.style.cssText=`
        position: fixed; top: 10px; right: 10px; z-index: 10001;
        background: rgba(255, 193, 7, 0.95); color: #212529; padding: 12px 16px;
        border-radius: 8px; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255, 193, 7, 0.8);
        max-width: 300px; word-wrap: break-word;
      `,a.textContent=t,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.remove()},8e3)}catch(a){console.warn("Failed to show translation warning UI:",a)}},oa=async()=>{try{console.log("\u{1F310} Initializing translation system..."),De.en||await nt("en")||(console.warn("\u26A0\uFE0F Failed to load English translations from CDN, using fallback"),ut("\u26A0\uFE0F Translation loading failed, using basic fallbacks")),await ia(),console.log(`\u2705 Translation system initialized. Active language: ${e.language}`)}catch(t){console.error("\u274C Translation initialization failed:",t),e.language||(e.language="en"),console.warn("\u26A0\uFE0F Using fallback translations due to initialization failure"),ut("\u26A0\uFE0F Translation system error, using basic English")}},kt={en:{title:"WPlace Auto-Image",settings:"Settings",close:"Close",language:"Language",loadingError:"Loading translations failed, using fallback",scanColors:"Scan Colors",uploadImage:"Upload Image",startPainting:"Start Painting",stopPainting:"Stop Painting",progress:"Progress",pixels:"Pixels",charges:"Charges",initMessage:"Click 'Upload Image' to begin"}},Ea=(t,a={})=>{var o,r,l;let n=(o=De[e.language])==null?void 0:o[t];return!n&&e.language!=="en"&&(n=(r=De.en)==null?void 0:r[t]),n||(n=(l=kt.en)==null?void 0:l[t]),n?Object.entries(a).reduce((s,[d,m])=>s.replace(new RegExp(`\\{${d}\\}`,"g"),m),n):(console.warn(`\u26A0\uFE0F Missing translation for key: ${t}`),t)},e={running:!1,imageLoaded:!1,processing:!1,totalPixels:0,paintedPixels:0,availableColors:[],activeColorPalette:[],paintWhitePixels:!0,paintTransparentPixels:!1,currentCharges:0,maxCharges:1,cooldown:g.COOLDOWN_DEFAULT,imageData:null,stopFlag:!1,colorsChecked:!1,startPosition:null,selectingPosition:!1,region:null,minimized:!1,lastPosition:{x:0,y:0},estimatedTime:0,language:"en",paintingSpeed:g.PAINTING_SPEED.DEFAULT,batchMode:g.BATCH_MODE,randomBatchMin:g.RANDOM_BATCH_RANGE.MIN,randomBatchMax:g.RANDOM_BATCH_RANGE.MAX,cooldownChargeThreshold:g.COOLDOWN_CHARGE_THRESHOLD,tokenSource:g.TOKEN_SOURCE,initialSetupComplete:!1,overlayOpacity:g.OVERLAY.OPACITY_DEFAULT,blueMarbleEnabled:g.OVERLAY.BLUE_MARBLE_DEFAULT,ditheringEnabled:!0,colorMatchingAlgorithm:"lab",enableChromaPenalty:!0,chromaPenaltyWeight:.15,customTransparencyThreshold:g.TRANSPARENCY_THRESHOLD,customWhiteThreshold:g.WHITE_THRESHOLD,resizeSettings:null,originalImage:null,resizeIgnoreMask:null,notificationsEnabled:g.NOTIFICATIONS.ENABLED,notifyOnChargesReached:g.NOTIFICATIONS.ON_CHARGES_REACHED,notifyOnlyWhenUnfocused:g.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED,notificationIntervalMinutes:g.NOTIFICATIONS.REPEAT_MINUTES,_lastChargesNotifyAt:0,_lastChargesBelow:!0,_lastSavePixelCount:0,_lastSaveTime:0,_saveInProgress:!1,paintedMap:null},J=()=>{},Ot=null;class an{constructor(){this.isEnabled=!1,this.startCoords=null,this.imageBitmap=null,this.chunkedTiles=new Map,this.originalTiles=new Map,this.originalTilesData=new Map,this.tileSize=1e3,this.processPromise=null,this.lastProcessedHash=null,this.workerPool=null}toggle(){return this.isEnabled=!this.isEnabled,console.log(`Overlay ${this.isEnabled?"enabled":"disabled"}.`),this.isEnabled}enable(){this.isEnabled=!0}disable(){this.isEnabled=!1}clear(){this.disable(),this.imageBitmap=null,this.chunkedTiles.clear(),this.originalTiles.clear(),this.originalTilesData.clear(),this.lastProcessedHash=null,this.processPromise&&(this.processPromise=null)}async setImage(a){this.imageBitmap=a,this.lastProcessedHash=null,this.imageBitmap&&this.startCoords&&await this.processImageIntoChunks()}async setPosition(a,n){if(!a||!n){this.startCoords=null,this.chunkedTiles.clear(),this.lastProcessedHash=null;return}this.startCoords={region:n,pixel:a},this.lastProcessedHash=null,this.imageBitmap&&await this.processImageIntoChunks()}_generateProcessHash(){if(!this.imageBitmap||!this.startCoords)return null;let{width:a,height:n}=this.imageBitmap,{x:o,y:r}=this.startCoords.pixel,{x:l,y:s}=this.startCoords.region;return`${a}x${n}_${o},${r}_${l},${s}_${e.blueMarbleEnabled}_${e.overlayOpacity}`}async processImageIntoChunks(){if(!this.imageBitmap||!this.startCoords)return;if(this.processPromise)return this.processPromise;let a=this._generateProcessHash();if(this.lastProcessedHash===a&&this.chunkedTiles.size>0){console.log(`\u{1F4E6} Using cached overlay chunks (${this.chunkedTiles.size} tiles)`);return}this.processPromise=this._doProcessImageIntoChunks();try{await this.processPromise,this.lastProcessedHash=a}finally{this.processPromise=null}}async _doProcessImageIntoChunks(){let a=performance.now();this.chunkedTiles.clear();let{width:n,height:o}=this.imageBitmap,{x:r,y:l}=this.startCoords.pixel,{x:s,y:d}=this.startCoords.region,m=r+n,p=l+o,w=s+Math.floor(r/this.tileSize),h=d+Math.floor(l/this.tileSize),S=s+Math.floor(m/this.tileSize),v=d+Math.floor(p/this.tileSize),u=(S-w+1)*(v-h+1);console.log(`\u{1F504} Processing ${u} overlay tiles...`);let E=4,k=[];for(let T=h;T<=v;T++)for(let A=w;A<=S;A++)k.push({tx:A,ty:T});for(let T=0;T<k.length;T+=E){let A=k.slice(T,T+E);await Promise.all(A.map(async({tx:N,ty:ee})=>{let de=`${N},${ee}`,ye=await this._processTile(N,ee,n,o,r,l,s,d);ye&&this.chunkedTiles.set(de,ye)})),T+E<k.length&&await new Promise(N=>setTimeout(N,0))}let P=performance.now()-a;console.log(`\u2705 Overlay processed ${this.chunkedTiles.size} tiles in ${Math.round(P)}ms`)}async _processTile(a,n,o,r,l,s,d,m){let p=`${a},${n}`,w=(a-d)*this.tileSize-l,h=(n-m)*this.tileSize-s,S=Math.max(0,w),v=Math.max(0,h),u=Math.min(o-S,this.tileSize-(S-w)),E=Math.min(r-v,this.tileSize-(v-h));if(u<=0||E<=0)return null;let k=Math.max(0,-w),P=Math.max(0,-h),T=new OffscreenCanvas(this.tileSize,this.tileSize),A=T.getContext("2d");if(A.imageSmoothingEnabled=!1,A.drawImage(this.imageBitmap,S,v,u,E,k,P,u,E),e.blueMarbleEnabled){let N=A.getImageData(k,P,u,E),ee=N.data;for(let de=0;de<ee.length;de+=4){let ye=de/4,pe=Math.floor(ye/u);(ye%u+pe)%2===0&&ee[de+3]>0&&(ee[de+3]=0)}A.putImageData(N,k,P)}return await T.transferToImageBitmap()}async processAndRespondToTileRequest(a){let{endpoint:n,blobID:o,blobData:r}=a,l=r;if(this.isEnabled&&this.chunkedTiles.size>0){let s=n.match(/(\d+)\/(\d+)\.png/);if(s){let d=parseInt(s[1],10),m=parseInt(s[2],10),p=Pa(d,m),w=this.chunkedTiles.get(p);try{let h=await createImageBitmap(r);this.originalTiles.set(p,h);try{let S,v;typeof OffscreenCanvas<"u"?(S=new OffscreenCanvas(h.width,h.height),v=S.getContext("2d")):(S=document.createElement("canvas"),S.width=h.width,S.height=h.height,v=S.getContext("2d")),v.imageSmoothingEnabled=!1,v.drawImage(h,0,0);let u=v.getImageData(0,0,h.width,h.height);this.originalTilesData.set(p,{w:h.width,h:h.height,data:new Uint8ClampedArray(u.data)})}catch(S){console.warn("OverlayManager: could not cache ImageData for",p,S)}}catch(h){console.warn("OverlayManager: could not create original bitmap for",p,h)}if(w)try{l=await this._compositeTileOptimized(r,w)}catch(h){console.error("Error compositing overlay:",h),l=r}}}window.postMessage({source:"auto-image-overlay",blobID:o,blobData:l},"*")}async getTilePixelColor(a,n,o,r){let l=Pa(a,n),s=this.originalTilesData.get(l);if(s&&s.data&&s.w>0&&s.h>0){let m=Math.max(0,Math.min(s.w-1,o)),p=Math.max(0,Math.min(s.h-1,r)),w={data:s.data,width:s.w,height:s.h},h=dt(w,m,p);if(!h)return null;let S=e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD;return!e.paintTransparentPixels&&Bt(h,S)?(window._overlayDebug&&console.debug("getTilePixelColor: transparent pixel, skipping",l,m,p,h[3]),null):h}let d=this.originalTiles.get(l);if(!d)return null;try{let m,p;typeof OffscreenCanvas<"u"?(m=new OffscreenCanvas(d.width,d.height),p=m.getContext("2d")):(m=document.createElement("canvas"),m.width=d.width,m.height=d.height,p=m.getContext("2d")),p.imageSmoothingEnabled=!1,p.drawImage(d,0,0);let w=Math.max(0,Math.min(d.width-1,o)),h=Math.max(0,Math.min(d.height-1,r)),S=p.getImageData(w,h,1,1).data,v=S[3],u=e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD;return!e.paintTransparentPixels&&v<u?(window._overlayDebug&&console.debug("getTilePixelColor: transparent pixel (fallback), skipping",l,w,h,v),null):[S[0],S[1],S[2],v]}catch(m){return console.warn("OverlayManager.getTilePixelColor failed for",l,o,r,m),null}}async _compositeTileOptimized(a,n){let o=await createImageBitmap(a),r=new OffscreenCanvas(o.width,o.height),l=r.getContext("2d");return l.imageSmoothingEnabled=!1,l.drawImage(o,0,0),l.globalAlpha=e.overlayOpacity,l.globalCompositeOperation="source-over",l.drawImage(n,0,0),await r.convertToBlob({type:"image/png",quality:.95})}}let Le=new an,Me=null,ra=0,sa=!1,qe=null,mt=new Promise(t=>{qe=t}),Mn=0,zn=10,Ia=10,nn=24e4;function Nt(t){qe&&(qe(t),qe=null),Me=t,ra=Date.now()+nn,console.log("\u2705 Turnstile token set successfully")}function la(){return Me&&Date.now()<ra}function on(){Me=null,ra=0,console.log("\u{1F5D1}\uFE0F Token invalidated, will force fresh generation")}async function Aa(t=!1){if(la()&&!t)return Me;if(t&&on(),sa)return console.log("\u{1F504} Token generation already in progress, waiting..."),await i.sleep(2e3),la()?Me:null;sa=!0;try{console.log("\u{1F504} Token expired or missing, generating new one...");let a=await Ma();if(a&&a.length>20)return Nt(a),console.log("\u2705 Token captured and cached successfully"),a;console.log("\u26A0\uFE0F Invisible Turnstile failed, forcing browser automation...");let n=await _t();return n&&n.length>20?(Nt(n),console.log("\u2705 Fallback token captured successfully"),n):(console.log("\u274C All token generation methods failed"),null)}finally{sa=!1}}async function Ma(){let t=Date.now();try{let a=i.detectSitekey();console.log("\u{1F511} Generating Turnstile token for sitekey:",a),typeof window<"u"&&window.navigator&&console.log("\u{1F9ED} UA:",window.navigator.userAgent,"Platform:",window.navigator.platform);let n=await i.generatePaintToken(a);if(n&&n.length>20){let o=Math.round(Date.now()-t);return console.log(`\u2705 Turnstile token generated successfully in ${o}ms`),n}else throw new Error("Invalid or empty token received")}catch(a){let n=Math.round(Date.now()-t);throw console.log(`\u274C Turnstile token generation failed after ${n}ms:`,a),a}}function rn(t){var n;let a=document.createElement("script");a.textContent=`(${t})();`,(n=document.documentElement)==null||n.appendChild(a),a.remove()}rn(()=>{let t=new Map;window.addEventListener("message",n=>{let{source:o,blobID:r,blobData:l}=n.data;if(o==="auto-image-overlay"&&r&&l){let s=t.get(r);typeof s=="function"&&s(l),t.delete(r)}});let a=window.fetch;window.fetch=async function(...n){let o=await a.apply(this,n),r=n[0]instanceof Request?n[0].url:n[0];if(typeof r=="string"){if(r.includes("https://backend.wplace.live/s0/pixel/"))try{let s=JSON.parse(n[1].body);s.t&&(console.log("\u2705 Turnstile Token Captured:",s.t),window.postMessage({source:"turnstile-capture",token:s.t},"*"))}catch{}if((o.headers.get("content-type")||"").includes("image/png")&&r.includes(".png")){let s=o.clone();return new Promise(async d=>{let m=crypto.randomUUID(),p=await s.blob();t.set(m,w=>{d(new Response(w,{headers:s.headers,status:s.status,statusText:s.statusText}))}),window.postMessage({source:"auto-image-tile",endpoint:r,blobID:m,blobData:p},"*")})}}return o}}),window.addEventListener("message",t=>{var s;let{source:a,endpoint:n,blobID:o,blobData:r,token:l}=t.data;a==="auto-image-tile"&&n&&o&&r&&Le.processAndRespondToTileRequest(t.data),a==="turnstile-capture"&&l&&(Nt(l),(s=document.querySelector("#statusText"))!=null&&s.textContent.includes("CAPTCHA")&&(i.showAlert(i.t("tokenCapturedSuccess"),"success"),_("colorsFound","success",{count:e.availableColors.length})))});async function sn(){try{let a=await(await fetch("https://backend.wplace.live/me",{credentials:"include"})).json();e.language=a.language==="pt"?"pt":"en"}catch{e.language=navigator.language.startsWith("pt")?"pt":"en"}}let i={sleep:t=>new Promise(a=>setTimeout(a,t)),waitForSelector:async(t,a=200,n=5e3)=>{let o=Date.now();for(;Date.now()-o<n;){let r=document.querySelector(t);if(r)return r;await i.sleep(a)}return null},turnstileLoaded:!1,_turnstileContainer:null,_turnstileOverlay:null,_turnstileWidgetId:null,_lastSitekey:null,async loadTurnstile(){return window.turnstile?(this.turnstileLoaded=!0,Promise.resolve()):new Promise((t,a)=>{if(document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')){let o=()=>{window.turnstile?(this.turnstileLoaded=!0,t()):setTimeout(o,100)};return o()}let n=document.createElement("script");n.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",n.async=!0,n.defer=!0,n.onload=()=>{this.turnstileLoaded=!0,console.log("\u2705 Turnstile script loaded successfully"),t()},n.onerror=()=>{console.error("\u274C Failed to load Turnstile script"),a(new Error("Failed to load Turnstile"))},document.head.appendChild(n)})},ensureTurnstileContainer(){return(!this._turnstileContainer||!document.body.contains(this._turnstileContainer))&&(this._turnstileContainer&&this._turnstileContainer.remove(),this._turnstileContainer=document.createElement("div"),this._turnstileContainer.className="wplace-turnstile-hidden",this._turnstileContainer.setAttribute("aria-hidden","true"),this._turnstileContainer.id="turnstile-widget-container",document.body.appendChild(this._turnstileContainer)),this._turnstileContainer},ensureTurnstileOverlayContainer(){if(this._turnstileOverlay&&document.body.contains(this._turnstileOverlay))return this._turnstileOverlay;let t=document.createElement("div");t.id="turnstile-overlay-container",t.className="wplace-turnstile-overlay wplace-overlay-hidden";let a=document.createElement("div");a.textContent=i.t("turnstileInstructions"),a.style.cssText='font: 600 12px/1.3 "Segoe UI",sans-serif; margin-bottom: 8px; opacity: 0.9;';let n=document.createElement("div");n.id="turnstile-overlay-host",n.className="wplace-turnstile-host";let o=document.createElement("button");return o.textContent=i.t("hideTurnstileBtn"),o.className="wplace-turnstile-hide-btn",o.addEventListener("click",()=>t.remove()),t.appendChild(a),t.appendChild(n),t.appendChild(o),document.body.appendChild(t),this._turnstileOverlay=t,t},async executeTurnstile(t,a="paint"){var o;if(await this.loadTurnstile(),this._turnstileWidgetId&&this._lastSitekey===t&&((o=window.turnstile)!=null&&o.execute))try{console.log("\u{1F504} Reusing existing Turnstile widget...");let r=await Promise.race([window.turnstile.execute(this._turnstileWidgetId,{action:a}),new Promise((l,s)=>setTimeout(()=>s(new Error("Execute timeout")),15e3))]);if(r&&r.length>20)return console.log("\u2705 Token generated via widget reuse"),r}catch(r){console.log("\uFFFD Widget reuse failed, will create a fresh widget:",r.message)}let n=await this.createTurnstileWidget(t,a);return n&&n.length>20?n:(console.log("\uFFFD Falling back to interactive Turnstile (visible)."),await this.createTurnstileWidgetInteractive(t,a))},async createTurnstileWidget(t,a){return new Promise(n=>{var o,r;try{if(this._turnstileWidgetId&&((o=window.turnstile)!=null&&o.remove))try{window.turnstile.remove(this._turnstileWidgetId),console.log("\u{1F9F9} Cleaned up existing Turnstile widget")}catch(d){console.warn("\u26A0\uFE0F Widget cleanup warning:",d.message)}let l=this.ensureTurnstileContainer();if(l.innerHTML="",!((r=window.turnstile)!=null&&r.render)){console.error("\u274C Turnstile not available for rendering"),n(null);return}console.log("\u{1F527} Creating invisible Turnstile widget...");let s=window.turnstile.render(l,{sitekey:t,action:a,size:"invisible",retry:"auto","retry-interval":8e3,callback:d=>{console.log("\u2705 Invisible Turnstile callback"),n(d)},"error-callback":()=>n(null),"timeout-callback":()=>n(null)});if(this._turnstileWidgetId=s,this._lastSitekey=t,!s)return n(null);Promise.race([window.turnstile.execute(s,{action:a}),new Promise((d,m)=>setTimeout(()=>m(new Error("Invisible execute timeout")),12e3))]).then(n).catch(()=>n(null))}catch(l){console.error("\u274C Invisible Turnstile creation failed:",l),n(null)}})},async createTurnstileWidgetInteractive(t,a){return console.log("\u{1F504} Creating interactive Turnstile widget (visible)"),new Promise(n=>{var o;try{if(this._turnstileWidgetId&&((o=window.turnstile)!=null&&o.remove))try{window.turnstile.remove(this._turnstileWidgetId)}catch(m){console.warn("\u26A0\uFE0F Widget cleanup warning:",m.message)}let r=this.ensureTurnstileOverlayContainer();r.classList.remove("wplace-overlay-hidden"),r.style.display="block";let l=r.querySelector("#turnstile-overlay-host");l.innerHTML="";let s=setTimeout(()=>{console.warn("\u23F0 Interactive Turnstile widget timeout"),r.classList.add("wplace-overlay-hidden"),r.style.display="none",n(null)},6e4),d=window.turnstile.render(l,{sitekey:t,action:a,size:"normal",theme:"light",callback:m=>{clearTimeout(s),r.classList.add("wplace-overlay-hidden"),r.style.display="none",console.log("\u2705 Interactive Turnstile completed successfully"),typeof m=="string"&&m.length>20?n(m):(console.warn("\u274C Invalid token from interactive widget"),n(null))},"error-callback":m=>{clearTimeout(s),r.classList.add("wplace-overlay-hidden"),r.style.display="none",console.warn("\u274C Interactive Turnstile error:",m),n(null)}});this._turnstileWidgetId=d,this._lastSitekey=t,d?console.log("\u2705 Interactive Turnstile widget created, waiting for user interaction..."):(clearTimeout(s),r.classList.add("wplace-overlay-hidden"),r.style.display="none",console.warn("\u274C Failed to create interactive Turnstile widget"),n(null))}catch(r){console.error("\u274C Interactive Turnstile creation failed:",r),n(null)}})},async generatePaintToken(t){return this.executeTurnstile(t,"paint")},cleanupTurnstile(){var t;if(this._turnstileWidgetId&&((t=window.turnstile)!=null&&t.remove))try{window.turnstile.remove(this._turnstileWidgetId)}catch(a){console.warn("Failed to cleanup Turnstile widget:",a)}this._turnstileContainer&&document.body.contains(this._turnstileContainer)&&this._turnstileContainer.remove(),this._turnstileOverlay&&document.body.contains(this._turnstileOverlay)&&this._turnstileOverlay.remove(),this._turnstileWidgetId=null,this._turnstileContainer=null,this._turnstileOverlay=null,this._lastSitekey=null},detectSitekey(t="0x4AAAAAABpqJe8FO0N84q0F"){var n;if(this._cachedSitekey)return console.log("\u{1F50D} Using cached sitekey:",this._cachedSitekey),this._cachedSitekey;let a=["0x4AAAAAABpqJe8FO0N84q0F","0x4AAAAAAAJ7xjKAp6Mt_7zw","0x4AAAAAADm5QWx6Ov2LNF2g"];try{let o=document.querySelector("[data-sitekey]");if(o){let d=o.getAttribute("data-sitekey");if(d&&d.length>10)return this._cachedSitekey=d,console.log("\u{1F50D} Sitekey detected from data attribute:",d),d}let r=document.querySelector(".cf-turnstile");if((n=r==null?void 0:r.dataset)!=null&&n.sitekey&&r.dataset.sitekey.length>10)return this._cachedSitekey=r.dataset.sitekey,console.log("\u{1F50D} Sitekey detected from turnstile element:",this._cachedSitekey),this._cachedSitekey;let l=document.querySelectorAll('meta[name*="turnstile"], meta[property*="turnstile"]');for(let d of l){let m=d.getAttribute("content");if(m&&m.length>10)return this._cachedSitekey=m,console.log("\u{1F50D} Sitekey detected from meta tag:",this._cachedSitekey),this._cachedSitekey}if(typeof window<"u"&&window.__TURNSTILE_SITEKEY&&window.__TURNSTILE_SITEKEY.length>10)return this._cachedSitekey=window.__TURNSTILE_SITEKEY,console.log("\u{1F50D} Sitekey detected from global variable:",this._cachedSitekey),this._cachedSitekey;let s=document.querySelectorAll("script");for(let d of s){let p=(d.textContent||d.innerHTML).match(/sitekey['":\s]+(['"0-9a-zA-X_-]{20,})/i);if(p&&p[1]&&p[1].length>10)return this._cachedSitekey=p[1].replace(/['"]/g,""),console.log("\u{1F50D} Sitekey detected from script content:",this._cachedSitekey),this._cachedSitekey}console.log("\u{1F50D} No sitekey detected, trying known working sitekeys...");for(let d of a)return console.log("\u{1F50D} Trying sitekey:",d),this._cachedSitekey=d,d}catch(o){console.warn("Error detecting sitekey:",o)}return console.log("\u{1F50D} Using fallback sitekey:",t),this._cachedSitekey=t,t},createElement:(t,a={},n=[])=>{let o=document.createElement(t);return Object.entries(a).forEach(([r,l])=>{r==="style"&&typeof l=="object"?Object.assign(o.style,l):r==="className"?o.className=l:r==="innerHTML"?o.innerHTML=l:o.setAttribute(r,l)}),typeof n=="string"?o.textContent=n:Array.isArray(n)&&n.forEach(r=>{typeof r=="string"?o.appendChild(document.createTextNode(r)):o.appendChild(r)}),o},createButton:(t,a,n,o,r=g.CSS_CLASSES.BUTTON_PRIMARY)=>{let l=i.createElement("button",{id:t,style:r,innerHTML:`${n?`<i class="${n}"></i>`:""}<span>${a}</span>`});return o&&l.addEventListener("click",o),l},t:(t,a={})=>{var r,l,s,d;let n=`${e.language}_${t}`;if(gt.has(n)){let m=gt.get(n);return Object.keys(a).forEach(p=>{m=m.replace(`{${p}}`,a[p])}),m}if((r=De[e.language])!=null&&r[t]){let m=De[e.language][t];return gt.set(n,m),Object.keys(a).forEach(p=>{m=m.replace(`{${p}}`,a[p])}),m}if(e.language!=="en"&&((l=De.en)!=null&&l[t])){let m=De.en[t];return Object.keys(a).forEach(p=>{m=m.replace(`{${p}}`,a[p])}),m}let o=((s=kt[e.language])==null?void 0:s[t])||((d=kt.en)==null?void 0:d[t])||t;return Object.keys(a).forEach(m=>{o=o.replace(new RegExp(`\\{${m}\\}`,"g"),a[m])}),o===t&&t!=="undefined"&&console.warn(`\u26A0\uFE0F Missing translation for key: ${t} (language: ${e.language})`),o},showAlert:(t,a="info")=>{let n=document.createElement("div");n.className=`wplace-alert-base wplace-alert-${a}`,n.textContent=t,document.body.appendChild(n),setTimeout(()=>{n.style.animation="slideDown 0.3s ease-out reverse",setTimeout(()=>{document.body.removeChild(n)},300)},4e3)},colorDistance:(t,a)=>Math.sqrt(Math.pow(t[0]-a[0],2)+Math.pow(t[1]-a[1],2)+Math.pow(t[2]-a[2],2)),_labCache:new Map,_rgbToLab:(t,a,n)=>Ja(t,a,n),_lab:(t,a,n)=>{let o=t<<16|a<<8|n,r=i._labCache.get(o);return r||(r=i._rgbToLab(t,a,n),i._labCache.set(o,r)),r},findClosestPaletteColor:(t,a,n,o)=>{if((!o||o.length===0)&&(o=Object.values(g.COLOR_MAP).filter(w=>w.rgb).map(w=>[w.rgb.r,w.rgb.g,w.rgb.b])),e.colorMatchingAlgorithm==="legacy"){let w=1/0,h=[0,0,0];for(let S=0;S<o.length;S++){let[v,u,E]=o[S],k=(v+t)/2,P=v-t,T=u-a,A=E-n,N=Math.sqrt(((512+k)*P*P>>8)+4*T*T+((767-k)*A*A>>8));N<w&&(w=N,h=[v,u,E])}return h}let[r,l,s]=i._lab(t,a,n),d=Math.sqrt(l*l+s*s),m=null,p=1/0;for(let w=0;w<o.length;w++){let[h,S,v]=o[w],[u,E,k]=i._lab(h,S,v),P=r-u,T=l-E,A=s-k,N=P*P+T*T+A*A;if(e.enableChromaPenalty&&d>20){let ee=Math.sqrt(E*E+k*k);if(ee<d){let de=d-ee;N+=de*de*e.chromaPenaltyWeight}}if(N<p&&(p=N,m=o[w],p===0))break}return m||[0,0,0]},isWhitePixel:(t,a,n)=>{let o=e.customWhiteThreshold||g.WHITE_THRESHOLD;return t>=o&&a>=o&&n>=o},createImageUploader:()=>new Promise(t=>{let a=document.createElement("input");a.type="file",a.accept="image/png,image/jpeg",a.onchange=()=>{let n=new FileReader;n.onload=()=>t(n.result),n.readAsDataURL(a.files[0])},a.click()}),createFileDownloader:(t,a)=>{let n=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=a,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(o)},createFileUploader:()=>new Promise((t,a)=>{let n=document.createElement("input");n.type="file",n.accept=".json",n.onchange=o=>{let r=o.target.files[0];if(r){let l=new FileReader;l.onload=()=>{try{let s=JSON.parse(l.result);t(s)}catch{a(new Error("Invalid JSON file"))}},l.onerror=()=>a(new Error("File reading error")),l.readAsText(r)}else a(new Error("No file selected"))},n.click()}),extractAvailableColors:()=>{let t=document.querySelectorAll('[id^="color-"]'),a=[],n=[];return Array.from(t).forEach(o=>{let r=Number.parseInt(o.id.replace("color-",""));if(r===0)return;let l=o.style.backgroundColor.match(/\d+/g),s=l?l.map(Number):[0,0,0],d=Object.values(g.COLOR_MAP).find(w=>w.id===r),m=d?d.name:`Unknown Color ${r}`,p={id:r,name:m,rgb:s};o.querySelector("svg")?n.push(p):a.push(p)}),console.log("=== CAPTURED COLORS STATUS ==="),console.log(`Total available colors: ${a.length}`),console.log(`Total unavailable colors: ${n.length}`),console.log(`Total colors scanned: ${a.length+n.length}`),a.length>0&&(console.log(`
--- AVAILABLE COLORS ---`),a.forEach((o,r)=>{console.log(`${r+1}. ID: ${o.id}, Name: "${o.name}", RGB: (${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]})`)})),n.length>0&&(console.log(`
--- UNAVAILABLE COLORS ---`),n.forEach((o,r)=>{console.log(`${r+1}. ID: ${o.id}, Name: "${o.name}", RGB: (${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]}) [LOCKED]`)})),console.log("=== END COLOR STATUS ==="),a},formatTime:t=>{let a=Math.floor(t/1e3%60),n=Math.floor(t/(1e3*60)%60),o=Math.floor(t/(1e3*60*60)%24),r=Math.floor(t/(1e3*60*60*24)),l="";return r>0&&(l+=`${r}d `),(o>0||r>0)&&(l+=`${o}h `),(n>0||o>0||r>0)&&(l+=`${n}m `),l+=`${a}s`,l},calculateEstimatedTime:(t,a,n)=>{if(t<=0)return 0;let o=e.paintingSpeed>0?1e3/e.paintingSpeed:1e3,r=t*o,s=Math.ceil(t/Math.max(a,1))*n;return r+s},initializePaintedMap:(t,a)=>{(!e.paintedMap||e.paintedMap.length!==a)&&(e.paintedMap=Array(a).fill().map(()=>Array(t).fill(!1)),console.log(`\u{1F4CB} Initialized painted map: ${t}x${a}`))},markPixelPainted:(t,a,n=0,o=0)=>{let r=t+n,l=a+o;e.paintedMap&&e.paintedMap[l]&&r>=0&&r<e.paintedMap[l].length&&(e.paintedMap[l][r]=!0)},isPixelPainted:(t,a,n=0,o=0)=>{let r=t+n,l=a+o;return e.paintedMap&&e.paintedMap[l]&&r>=0&&r<e.paintedMap[l].length?e.paintedMap[l][r]:!1},shouldAutoSave:()=>{let t=Date.now(),a=e.paintedPixels-e._lastSavePixelCount,n=t-e._lastSaveTime;return!e._saveInProgress&&a>=25&&n>=3e4},performSmartSave:()=>{if(!i.shouldAutoSave())return!1;e._saveInProgress=!0;let t=i.saveProgress();return t&&(e._lastSavePixelCount=e.paintedPixels,e._lastSaveTime=Date.now(),console.log(`\u{1F4BE} Auto-saved at ${e.paintedPixels} pixels`)),e._saveInProgress=!1,t},packPaintedMapToBase64:(t,a,n)=>{if(!t||!a||!n)return null;let o=a*n,r=Math.ceil(o/8),l=new Uint8Array(r),s=0;for(let p=0;p<n;p++){let w=t[p];for(let h=0;h<a;h++){let S=w&&w[h]?1:0,v=s>>3,u=s&7;S&&(l[v]|=1<<u),s++}}let d="",m=32768;for(let p=0;p<l.length;p+=m)d+=String.fromCharCode.apply(null,l.subarray(p,Math.min(p+m,l.length)));return btoa(d)},unpackPaintedMapFromBase64:(t,a,n)=>{if(!t||!a||!n)return null;let o=atob(t),r=new Uint8Array(o.length);for(let d=0;d<o.length;d++)r[d]=o.charCodeAt(d);let l=Array(n).fill().map(()=>Array(a).fill(!1)),s=0;for(let d=0;d<n;d++)for(let m=0;m<a;m++){let p=s>>3,w=s&7;l[d][m]=(r[p]>>w&1)===1,s++}return l},migrateProgressToV2:t=>{var n,o;if(!t||!(!t.version||t.version==="1"||t.version==="1.0"||t.version==="1.1"))return t;try{let r={...t},l=(n=r.imageData)==null?void 0:n.width,s=(o=r.imageData)==null?void 0:o.height;if(r.paintedMap&&l&&s){let d=i.packPaintedMapToBase64(r.paintedMap,l,s);r.paintedMapPacked={width:l,height:s,data:d}}return delete r.paintedMap,r.version="2",r}catch(r){return console.warn("Migration to v2 failed, using original data:",r),t}},migrateProgressToV21:t=>{var o,r;if(!t||t.version==="2.1")return t;let a=t.version==="2"||t.version==="2.0",n=!t.version||t.version==="1"||t.version==="1.0"||t.version==="1.1";if(!a&&!n)return t;try{let l={...t};if(n){let s=(o=l.imageData)==null?void 0:o.width,d=(r=l.imageData)==null?void 0:r.height;if(l.paintedMap&&s&&d){let m=i.packPaintedMapToBase64(l.paintedMap,s,d);l.paintedMapPacked={width:s,height:d,data:m}}delete l.paintedMap}return l.version="2.1",l}catch(l){return console.warn("Migration to v2.1 failed, using original data:",l),t}},saveProgress:()=>{try{let t=null;if(e.paintedMap&&e.imageData){let n=i.packPaintedMapToBase64(e.paintedMap,e.imageData.width,e.imageData.height);n&&(t={width:e.imageData.width,height:e.imageData.height,data:n})}let a={timestamp:Date.now(),version:"2.1",state:{totalPixels:e.totalPixels,paintedPixels:e.paintedPixels,lastPosition:e.lastPosition,startPosition:e.startPosition,region:e.region,imageLoaded:e.imageLoaded,colorsChecked:e.colorsChecked,availableColors:e.availableColors},imageData:e.imageData?{width:e.imageData.width,height:e.imageData.height,pixels:Array.from(e.imageData.pixels),totalPixels:e.imageData.totalPixels}:null,paintedMapPacked:t};return localStorage.setItem("wplace-bot-progress",JSON.stringify(a)),!0}catch(t){return console.error("Error saving progress:",t),!1}},loadProgress:()=>{try{let t=localStorage.getItem("wplace-bot-progress");if(!t)return null;let a=JSON.parse(t),n=a.version,o=a;if(n==="2.1"||(o=i.migrateProgressToV21(a)),o&&o!==a){try{localStorage.setItem("wplace-bot-progress",JSON.stringify(o))}catch{}a=o}return a}catch(t){return console.error("Error loading progress:",t),null}},clearProgress:()=>{try{return localStorage.removeItem("wplace-bot-progress"),e.paintedMap=null,e._lastSavePixelCount=0,e._lastSaveTime=0,console.log("\u{1F4CB} Progress and painted map cleared"),!0}catch(t){return console.error("Error clearing progress:",t),!1}},restoreProgress:t=>{try{if(Object.assign(e,t.state),t.imageData){e.imageData={...t.imageData,pixels:new Uint8ClampedArray(t.imageData.pixels)};try{let a=document.createElement("canvas");a.width=e.imageData.width,a.height=e.imageData.height;let n=a.getContext("2d"),o=new ImageData(e.imageData.pixels,e.imageData.width,e.imageData.height);n.putImageData(o,0,0);let r=new ca("");r.img=a,r.canvas=a,r.ctx=n,e.imageData.processor=r}catch(a){console.warn("Could not rebuild processor from saved image data:",a)}}if(t.paintedMapPacked&&t.paintedMapPacked.data){let{width:a,height:n,data:o}=t.paintedMapPacked;e.paintedMap=i.unpackPaintedMapFromBase64(o,a,n)}else t.paintedMap&&(e.paintedMap=t.paintedMap.map(a=>Array.from(a)));return!0}catch(a){return console.error("Error restoring progress:",a),!1}},saveProgressToFile:()=>{try{let t=null;if(e.paintedMap&&e.imageData){let o=i.packPaintedMapToBase64(e.paintedMap,e.imageData.width,e.imageData.height);o&&(t={width:e.imageData.width,height:e.imageData.height,data:o})}let a={timestamp:Date.now(),version:"2.1",state:{totalPixels:e.totalPixels,paintedPixels:e.paintedPixels,lastPosition:e.lastPosition,startPosition:e.startPosition,region:e.region,imageLoaded:e.imageLoaded,colorsChecked:e.colorsChecked,availableColors:e.availableColors},imageData:e.imageData?{width:e.imageData.width,height:e.imageData.height,pixels:Array.from(e.imageData.pixels),totalPixels:e.imageData.totalPixels}:null,paintedMapPacked:t},n=`wplace-bot-progress-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`;return i.createFileDownloader(JSON.stringify(a,null,2),n),!0}catch(t){return console.error("Error saving to file:",t),!1}},loadProgressFromFile:async()=>{try{let t=await i.createFileUploader();if(!t||!t.state)throw new Error("Invalid file format");let a=t.version,n=t;return a==="2.1"||(n=i.migrateProgressToV21(t)||t),i.restoreProgress(n)}catch(t){throw console.error("Error loading from file:",t),t}},restoreOverlayFromData:async()=>{if(!e.imageLoaded||!e.imageData||!e.startPosition||!e.region)return!1;try{let t=new ImageData(e.imageData.pixels,e.imageData.width,e.imageData.height),a=new OffscreenCanvas(e.imageData.width,e.imageData.height);a.getContext("2d").putImageData(t,0,0);let o=await a.transferToImageBitmap();await Le.setImage(o),await Le.setPosition(e.startPosition,e.region),Le.enable();let r=document.getElementById("toggleOverlayBtn");return r&&(r.disabled=!1,r.classList.add("active")),console.log("Overlay restored from data"),!0}catch(t){return console.error("Failed to restore overlay from data:",t),!1}}};class ca{constructor(a){this.imageSrc=a,this.img=null,this.canvas=null,this.ctx=null}async load(){return new Promise((a,n)=>{this.img=new Image,this.img.crossOrigin="anonymous",this.img.onload=()=>{this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.img.width,this.canvas.height=this.img.height,this.ctx.drawImage(this.img,0,0),a()},this.img.onerror=n,this.img.src=this.imageSrc})}getDimensions(){return{width:this.canvas.width,height:this.canvas.height}}getPixelData(){return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data}resize(a,n){let o=document.createElement("canvas"),r=o.getContext("2d");return o.width=a,o.height=n,r.imageSmoothingEnabled=!1,r.drawImage(this.canvas,0,0,a,n),this.canvas.width=a,this.canvas.height=n,this.ctx.imageSmoothingEnabled=!1,this.ctx.drawImage(o,0,0),this.ctx.getImageData(0,0,a,n).data}generatePreview(a,n){let o=document.createElement("canvas"),r=o.getContext("2d");return o.width=a,o.height=n,r.imageSmoothingEnabled=!1,r.drawImage(this.img,0,0,a,n),o.toDataURL()}}let da={async paintPixelInRegion(t,a,n,o,r){try{if(await Aa(),!Me)return"token_error";let l={coords:[n,o],colors:[r],t:Me},s=await fetch(`https://backend.wplace.live/s0/pixel/${t}/${a}`,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},credentials:"include",body:JSON.stringify(l)});if(s.status===403)return console.error("\u274C 403 Forbidden. Turnstile token might be invalid or expired."),Me=null,mt=new Promise(m=>{qe=m}),"token_error";let d=await s.json();return(d==null?void 0:d.painted)===1}catch(l){return console.error("Paint request failed:",l),!1}},async getCharges(){var t,a,n;try{let r=await(await fetch("https://backend.wplace.live/me",{credentials:"include"})).json();return{charges:((t=r.charges)==null?void 0:t.count)||0,max:((a=r.charges)==null?void 0:a.max)||1,cooldown:((n=r.charges)==null?void 0:n.next)||g.COOLDOWN_DEFAULT}}catch(o){return console.error("Failed to get charges:",o),{charges:0,max:1,cooldown:g.COOLDOWN_DEFAULT}}}},je={pollTimer:null,pollIntervalMs:6e4,icon(){let t=document.querySelector("link[rel~='icon']");return(t==null?void 0:t.href)||location.origin+"/favicon.ico"},async requestPermission(){if(!("Notification"in window))return i.showAlert(i.t("notificationsNotSupported"),"warning"),"denied";if(Notification.permission==="granted")return"granted";try{return await Notification.requestPermission()}catch{return Notification.permission}},canNotify(){return e.notificationsEnabled&&typeof Notification<"u"&&Notification.permission==="granted"},notify(t,a,n="wplace-charges",o=!1){if(!this.canNotify()||!o&&e.notifyOnlyWhenUnfocused&&document.hasFocus())return!1;try{return new Notification(t,{body:a,tag:n,renotify:!0,icon:this.icon(),badge:this.icon(),silent:!1}),!0}catch{return i.showAlert(a,"info"),!1}},resetEdgeTracking(){e._lastChargesBelow=e.currentCharges<e.cooldownChargeThreshold,e._lastChargesNotifyAt=0},maybeNotifyChargesReached(t=!1){if(!e.notificationsEnabled||!e.notifyOnChargesReached)return;let a=e.currentCharges>=e.cooldownChargeThreshold,n=Date.now(),o=Math.max(1,Number(e.notificationIntervalMinutes||5))*6e4;if(a){let r=e._lastChargesBelow||t,l=n-(e._lastChargesNotifyAt||0)>=o;if(r||l){let s=i.t("chargesReadyMessage",{current:Math.floor(e.currentCharges),max:e.maxCharges,threshold:e.cooldownChargeThreshold});this.notify(i.t("chargesReadyNotification"),s,"wplace-notify-charges"),e._lastChargesNotifyAt=n}e._lastChargesBelow=!1}else e._lastChargesBelow=!0},startPolling(){this.stopPolling(),!(!e.notificationsEnabled||!e.notifyOnChargesReached)&&(this.pollTimer=setInterval(async()=>{try{let{charges:t,cooldown:a,max:n}=await da.getCharges();e.currentCharges=Math.floor(t),e.cooldown=a,e.maxCharges=Math.max(1,Math.floor(n)),this.maybeNotifyChargesReached()}catch{}},this.pollIntervalMs))},stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)},syncFromState(){this.resetEdgeTracking(),e.notificationsEnabled&&e.notifyOnChargesReached?this.startPolling():this.stopPolling()}},it=new Map;function Rt(t,a){if(!a||a.length===0)return 1;let n=`${t[0]},${t[1]},${t[2]}|${e.colorMatchingAlgorithm}|${e.enableChromaPenalty?"c":"nc"}|${e.chromaPenaltyWeight}`;if(it.has(n))return it.get(n);let o=e.customWhiteThreshold||g.WHITE_THRESHOLD;if(t[0]>=o&&t[1]>=o&&t[2]>=o){let s=a.find(d=>d.rgb[0]>=o&&d.rgb[1]>=o&&d.rgb[2]>=o);if(s)return it.set(n,s.id),s.id}let r=a[0].id,l=1/0;if(e.colorMatchingAlgorithm==="legacy")for(let s=0;s<a.length;s++){let d=a[s],[m,p,w]=d.rgb,h=(m+t[0])/2,S=m-t[0],v=p-t[1],u=w-t[2],E=Math.sqrt(((512+h)*S*S>>8)+4*v*v+((767-h)*u*u>>8));if(E<l&&(l=E,r=d.id,E===0))break}else{let[s,d,m]=i._lab(t[0],t[1],t[2]),p=Math.sqrt(d*d+m*m),w=e.enableChromaPenalty?e.chromaPenaltyWeight||.15:0;for(let h=0;h<a.length;h++){let S=a[h],[v,u,E]=S.rgb,[k,P,T]=i._lab(v,u,E),A=Za([s,d,m],[k,P,T]);if(w>0&&p>20){let N=Math.sqrt(P*P+T*T);if(N<p){let ee=p-N;A+=ee*ee*w}}if(A<l&&(l=A,r=S.id,A===0))break}}if(it.set(n,r),it.size>15e3){let s=it.keys().next().value;it.delete(s)}return r}let _=()=>{},Oe=()=>{},St=()=>{};function Ft(){var a;e.activeColorPalette=[];let t=document.querySelectorAll(".wplace-color-swatch.active");t&&t.forEach(n=>{let o=n.getAttribute("data-rgb");if(o){let r=o.split(",").map(Number);e.activeColorPalette.push(r)}}),((a=document.querySelector(".resize-container"))==null?void 0:a.style.display)==="block"&&J()}function za(t,a=!1){let n=document.querySelectorAll(".wplace-color-swatch");n&&n.forEach(o=>{let r=o.classList.contains("unavailable");(!r||a)&&(r||o.classList.toggle("active",t))}),Ft()}function ln(){let t=document.querySelectorAll(".wplace-color-swatch");t&&t.forEach(a=>{let n=parseInt(a.getAttribute("data-color-id"),10);!isNaN(n)&&n>=32&&a.classList.toggle("active",!1)}),Ft()}function cn(t){var r,l,s;let a=t.querySelector("#colors-container"),n=t.querySelector("#showAllColorsToggle");if(!a)return;if(!e.availableColors||e.availableColors.length===0){a.innerHTML=`<div class="wplace-colors-placeholder">${i.t("uploadImageFirst")}</div>`;return}function o(d=!1){a.innerHTML="";let m=0,p=0;Object.values(g.COLOR_MAP).filter(h=>h.rgb!==null).forEach(h=>{let{id:S,name:v,rgb:u}=h,E=`${u.r},${u.g},${u.b}`;p++;let k=e.availableColors.some(N=>N.rgb[0]===u.r&&N.rgb[1]===u.g&&N.rgb[2]===u.b);if(!d&&!k)return;k&&m++;let P=i.createElement("div",{className:"wplace-color-item"}),T=i.createElement("button",{className:`wplace-color-swatch ${k?"":"unavailable"}`,title:`${v} (ID: ${S})${k?"":" (Unavailable)"}`,"data-rgb":E,"data-color-id":S});T.style.backgroundColor=`rgb(${u.r}, ${u.g}, ${u.b})`,k?T.classList.add("active"):(T.style.opacity="0.4",T.style.filter="grayscale(50%)",T.disabled=!0);let A=i.createElement("span",{className:"wplace-color-item-name",style:k?"":"color: #888; font-style: italic;"},v+(k?"":" (N/A)"));k&&T.addEventListener("click",()=>{T.classList.toggle("active"),Ft()}),P.appendChild(T),P.appendChild(A),a.appendChild(P)}),Ft()}o(!1),n&&n.addEventListener("change",d=>{o(d.target.checked)}),(r=t.querySelector("#selectAllBtn"))==null||r.addEventListener("click",()=>za(!0,n==null?void 0:n.checked)),(l=t.querySelector("#unselectAllBtn"))==null||l.addEventListener("click",()=>za(!1,n==null?void 0:n.checked)),(s=t.querySelector("#unselectPaidBtn"))==null||s.addEventListener("click",()=>ln())}async function pa(){let t=performance.now();if(e.tokenSource==="manual")return console.log("\u{1F3AF} Manual token source selected - using pixel placement automation"),await _t();try{let a=i.detectSitekey();console.log("\u{1F511} Generating Turnstile token for sitekey:",a),console.log("\u{1F9ED} UA:",navigator.userAgent.substring(0,50)+"...","Platform:",navigator.platform),window.turnstile||await i.loadTurnstile();let n=await i.generatePaintToken(a);if(console.log(`\u{1F50D} Token received - Type: ${typeof n}, Value: ${n?typeof n=="string"?n.length>50?n.substring(0,50)+"...":n:JSON.stringify(n):"null/undefined"}, Length: ${(n==null?void 0:n.length)||0}`),typeof n=="string"&&n.length>20){let o=Math.round(performance.now()-t);return console.log(`\u2705 Turnstile token generated successfully in ${o}ms`),n}else throw new Error(`Invalid or empty token received - Type: ${typeof n}, Value: ${JSON.stringify(n)}, Length: ${(n==null?void 0:n.length)||0}`)}catch(a){let n=Math.round(performance.now()-t);if(console.error(`\u274C Turnstile token generation failed after ${n}ms:`,a),e.tokenSource==="hybrid")return console.log("\u{1F504} Hybrid mode: Generator failed, automatically switching to manual pixel placement..."),await _t();throw a}}async function _t(){return new Promise(async(t,a)=>{try{qe||(mt=new Promise(r=>{qe=r}));let n=i.sleep(2e4).then(()=>a(new Error("Auto-CAPTCHA timed out."))),o=(async()=>{let r=await i.waitForSelector("button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl",200,1e4);if(!r)throw new Error("Could not find the main paint button.");r.click(),await i.sleep(500);let l=await i.waitForSelector("button#color-0",200,5e3);if(!l)throw new Error("Could not find the transparent color button.");l.click(),await i.sleep(500);let s=await i.waitForSelector("canvas",200,5e3);if(!s)throw new Error("Could not find the canvas element.");s.setAttribute("tabindex","0"),s.focus();let d=s.getBoundingClientRect(),m=Math.round(d.left+d.width/2),p=Math.round(d.top+d.height/2);s.dispatchEvent(new MouseEvent("mousemove",{clientX:m,clientY:p,bubbles:!0})),s.dispatchEvent(new KeyboardEvent("keydown",{key:" ",code:"Space",bubbles:!0})),await i.sleep(50),s.dispatchEvent(new KeyboardEvent("keyup",{key:" ",code:"Space",bubbles:!0})),await i.sleep(500),await i.sleep(800),(async()=>{for(;!Me;){let S=await i.waitForSelector("button.btn.btn-primary.btn-lg, button.btn.btn-primary.sm\\:btn-xl");if(!S){let v=Array.from(document.querySelectorAll("button.btn-primary"));S=v.length?v[v.length-1]:null}S&&S.click(),await i.sleep(500)}})();let h=await mt;await i.sleep(300),t(h)})();await Promise.race([o,n])}catch(n){console.error("Auto-CAPTCHA process failed:",n),a(n)}})}async function ga(){var $a,Wa;await sn();let t=document.getElementById("wplace-image-bot-container"),a=document.getElementById("wplace-stats-container"),n=document.getElementById("wplace-settings-container"),o=document.querySelector(".resize-container"),r=document.querySelector(".resize-overlay");t&&t.remove(),a&&a.remove(),n&&n.remove(),o&&o.remove(),r&&r.remove(),pt(),await oa();let l=ke(),s=xt[l]||{};te();let d=document.createElement("link");if(d.rel="stylesheet",d.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",document.head.appendChild(d),s.fontFamily&&s.fontFamily.includes("Press Start 2P")){let x=document.createElement("link");x.rel="stylesheet",x.href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",document.head.appendChild(x)}let m=document.createElement("style");m.textContent=Ka,m.setAttribute("data-wplace-theme","true"),document.head.appendChild(m);let p=document.createElement("div");p.id="wplace-image-bot-container",p.innerHTML=`
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${i.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${i.t("settings")}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="${i.t("showStats")}">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="${i.t("compactMode")}">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${i.t("minimize")}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${i.t("initMessage")}
          </div>
          <div class="wplace-progress">
            <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">\u{1F5BC}\uFE0F Image Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled title="${i.t("waitingSetupComplete")}">
                <i class="fas fa-upload"></i>
                <span>${i.t("uploadImage")}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${i.t("resizeImage")}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${i.t("selectPosition")}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Control Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">\u{1F3AE} Painting Control</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="startBtn" class="wplace-btn wplace-btn-start" disabled>
                <i class="fas fa-play"></i>
                <span>${i.t("startPainting")}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${i.t("stopPainting")}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${i.t("toggleOverlay")}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">\u23F1\uFE0F ${i.t("cooldownSettings")}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${i.t("waitCharges")}:</label>
                <div class="wplace-slider-container">
                    <input type="range" id="cooldownSlider" class="wplace-slider" min="1" max="1" value="${e.cooldownChargeThreshold}">
                    <span id="cooldownValue" class="wplace-cooldown-value">${e.cooldownChargeThreshold}</span>
                </div>
            </div>
        </div>

        <!-- Data Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">\u{1F4BE} Data Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="saveBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-save"></i>
                <span>${i.t("saveData")}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary" disabled title="${i.t("waitingTokenGenerator")}">
                <i class="fas fa-folder-open"></i>
                <span>${i.t("loadData")}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${i.t("saveToFile")}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file" disabled title="${i.t("waitingTokenGenerator")}">
                <i class="fas fa-upload"></i>
                <span>${i.t("loadFromFile")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;let w=document.createElement("div");w.id="wplace-stats-container",w.style.display="none",w.innerHTML=`
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>${i.t("paintingStats")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="${i.t("refreshCharges")}">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="${i.t("closeStats")}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${i.t("initMessage")}</div>
            </div>
          </div>
        </div>
      </div>
    `;let h=document.createElement("div");h.id="wplace-settings-container";let S=s.primary?`linear-gradient(135deg, ${s.primary} 0%, ${s.secondary||s.primary} 100%)`:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)";h.className="wplace-settings-container-base",h.style.background=S,h.style.cssText+=`
      min-width: 420px;
      max-width: 480px;
      z-index: 99999;
      color: ${s.text||"white"};
      font-family: ${s.fontFamily||"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"};
      box-shadow: ${s.boxShadow||"0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"};
      backdrop-filter: ${s.backdropFilter||"blur(10px)"};
      overflow: hidden;
      animation: settingsSlideIn 0.4s ease-out;
      ${($a=s.animations)!=null&&$a.glow?`
        box-shadow: ${s.boxShadow||"0 20px 40px rgba(0,0,0,0.3)"}, 
                   0 0 30px ${s.highlight||s.neon||"#00ffff"};
      `:""}
    `,h.innerHTML=`
      <div class="wplace-settings-header">
        <div class="wplace-settings-title-wrapper">
          <h3 class="wplace-settings-title">
            <i class="fas fa-cog wplace-settings-icon"></i>
            ${i.t("settings")}
          </h3>
          <button id="closeSettingsBtn" class="wplace-settings-close-btn">\u2715</button>
        </div>
      </div>

      <div class="wplace-settings-content">
        
        <!-- Token Source Selection -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-key wplace-icon-key"></i>
            Token Source
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="tokenSourceSelect" class="wplace-settings-select">
              <option value="generator" ${e.tokenSource==="generator"?"selected":""} class="wplace-settings-option">\u{1F916} Automatic Token Generator (Recommended)</option>
              <option value="hybrid" ${e.tokenSource==="hybrid"?"selected":""} class="wplace-settings-option">\u{1F504} Generator + Auto Fallback</option>
              <option value="manual" ${e.tokenSource==="manual"?"selected":""} class="wplace-settings-option">\u{1F3AF} Manual Pixel Placement</option>
            </select>
            <p class="wplace-settings-description">
              Generator mode creates tokens automatically. Hybrid mode falls back to manual when generator fails. Manual mode only uses pixel placement.
            </p>
          </div>
        </div>

        <!-- Automation Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-robot wplace-icon-robot"></i>
            ${i.t("automation")}
          </label>
          <!-- Token generator is always enabled - settings moved to Token Source above -->
        </div>

        <!-- Overlay Settings Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label" style="color: ${s.text||"white"};">
            <i class="fas fa-eye wplace-icon-eye" style="color: ${s.highlight||"#48dbfb"};"></i>
            Overlay Settings
          </label>
          <div class="wplace-settings-section-wrapper wplace-overlay-wrapper" style="
            background: ${s.accent?`${s.accent}20`:"rgba(255,255,255,0.1)"}; 
            border-radius: ${s.borderRadius||"12px"}; 
            border: 1px solid ${s.accent||"rgba(255,255,255,0.1)"};
            ${(Wa=s.animations)!=null&&Wa.glow?`
              box-shadow: 0 0 15px ${s.accent||"rgba(255,255,255,0.1)"}33;
            `:""}
          ">
              <!-- Opacity Slider -->
              <div class="wplace-overlay-opacity-control">
                <div class="wplace-overlay-opacity-header">
                   <span class="wplace-overlay-opacity-label" style="color: ${s.text||"white"};">Overlay Opacity</span>
                   <div id="overlayOpacityValue" class="wplace-overlay-opacity-value" style="
                     background: ${s.secondary||"rgba(0,0,0,0.2)"}; 
                     color: ${s.text||"white"};
                     border-radius: ${s.borderRadius==="0"?"0":"6px"}; 
                     border: 1px solid ${s.accent||"transparent"};
                   ">${Math.round(e.overlayOpacity*100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${e.overlayOpacity}" class="wplace-overlay-opacity-slider" style="
                  background: linear-gradient(to right, ${s.highlight||"#48dbfb"} 0%, ${s.purple||s.neon||"#d3a4ff"} 100%); 
                  border-radius: ${s.borderRadius==="0"?"0":"4px"}; 
                ">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" class="wplace-blue-marble-toggle">
                  <div>
                      <span class="wplace-blue-marble-title" style="color: ${s.text||"white"};">Blue Marble Effect</span>
                      <p class="wplace-blue-marble-description" style="color: ${s.text?`${s.text}BB`:"rgba(255,255,255,0.7)"};">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${e.blueMarbleEnabled?"checked":""} class="wplace-blue-marble-checkbox" style="
                    accent-color: ${s.highlight||"#48dbfb"};
                  "/>
              </label>
          </div>
        </div>

        <!-- Paint Options Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-paint-brush wplace-icon-paint"></i>
            ${i.t("paintOptions")}
          </label>
          <div class="wplace-settings-section-wrapper wplace-notifications-wrapper">
            <!-- Paint White Pixels Toggle -->
            <label class="wplace-notification-toggle">
              <span>${i.t("paintWhitePixels")}</span>
              <input type="checkbox" id="settingsPaintWhiteToggle" ${e.paintWhitePixels?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <!-- Paint Transparent Pixels Toggle -->
            <label class="wplace-notification-toggle">
              <span>${i.t("paintTransparentPixels")}</span>
              <input type="checkbox" id="settingsPaintTransparentToggle" ${e.paintTransparentPixels?"checked":""} class="wplace-notification-checkbox" />
            </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-tachometer-alt wplace-icon-speed"></i>
            ${i.t("paintingSpeed")}
          </label>
          
          <!-- Batch Mode Selection -->
          <div class="wplace-batch-mode-selection">
            <label class="wplace-batch-mode-label">
              <i class="fas fa-dice wplace-icon-dice"></i>
              Batch Mode
            </label>
            <select id="batchModeSelect" class="wplace-batch-mode-select">
              <option value="normal" class="wplace-settings-option">\u{1F4E6} Normal (Fixed Size)</option>
              <option value="random" class="wplace-settings-option">\u{1F3B2} Random (Range)</option>
            </select>
          </div>
          
          <!-- Normal Mode: Fixed Size Slider -->
          <div id="normalBatchControls" class="wplace-batch-controls wplace-normal-batch-controls">
            <div class="wplace-speed-slider-container">
              <input type="range" id="speedSlider" min="${g.PAINTING_SPEED.MIN}" max="${g.PAINTING_SPEED.MAX}" value="${g.PAINTING_SPEED.DEFAULT}" class="wplace-speed-slider">
              <div id="speedValue" class="wplace-speed-value">${g.PAINTING_SPEED.DEFAULT} (batch size)</div>
            </div>
            <div class="wplace-speed-labels">
              <span class="wplace-speed-min"><i class="fas fa-turtle"></i> ${g.PAINTING_SPEED.MIN}</span>
              <span class="wplace-speed-max"><i class="fas fa-rabbit"></i> ${g.PAINTING_SPEED.MAX}</span>
            </div>
          </div>
          
          <!-- Random Mode: Range Controls -->
          <div id="randomBatchControls" class="wplace-batch-controls wplace-random-batch-controls">
            <div class="wplace-random-batch-grid">
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-down wplace-icon-min"></i>
                  Minimum Batch Size
                </label>
                <input type="number" id="randomBatchMin" min="1" max="1000" value="${g.RANDOM_BATCH_RANGE.MIN}" class="wplace-random-batch-input">
              </div>
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-up wplace-icon-max"></i>
                  Maximum Batch Size
                </label>
                <input type="number" id="randomBatchMax" min="1" max="1000" value="${g.RANDOM_BATCH_RANGE.MAX}" class="wplace-random-batch-input">
              </div>
            </div>
            <p class="wplace-random-batch-description">
              \u{1F3B2} Random batch size between min and max values
            </p>
          </div>
          
          <!-- Speed Control Toggle -->
          <label class="wplace-speed-control-toggle">
            <input type="checkbox" id="enableSpeedToggle" ${g.PAINTING_SPEED_ENABLED?"checked":""} class="wplace-speed-checkbox"/>
            <span>${i.t("enablePaintingSpeedLimit")}</span>
          </label>
        </div>

        <!-- Notifications Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-bell wplace-icon-bell"></i>
            Desktop Notifications
          </label>
          <div class="wplace-settings-section-wrapper wplace-notifications-wrapper">
            <label class="wplace-notification-toggle">
              <span>${i.t("enableNotifications")}</span>
              <input type="checkbox" id="notifEnabledToggle" ${e.notificationsEnabled?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${i.t("notifyOnChargesThreshold")}</span>
              <input type="checkbox" id="notifOnChargesToggle" ${e.notifyOnChargesReached?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${i.t("onlyWhenNotFocused")}</span>
              <input type="checkbox" id="notifOnlyUnfocusedToggle" ${e.notifyOnlyWhenUnfocused?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <div class="wplace-notification-interval">
              <span>${i.t("repeatEvery")}</span>
              <input type="number" id="notifIntervalInput" min="1" max="60" value="${e.notificationIntervalMinutes}" class="wplace-notification-interval-input" />
              <span>${i.t("minutesPl")}</span>
            </div>
            <div class="wplace-notification-buttons">
              <button id="notifRequestPermBtn" class="wplace-btn wplace-btn-secondary wplace-notification-perm-btn"><i class="fas fa-unlock"></i><span>${i.t("grantPermission")}</span></button>
              <button id="notifTestBtn" class="wplace-btn wplace-notification-test-btn"><i class="fas fa-bell"></i><span>${i.t("test")}</span></button>
            </div>
          </div>
        </div>

        <!-- Theme Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-palette wplace-icon-palette"></i>
            ${i.t("themeSettings")}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="themeSelect" class="wplace-settings-select">
              ${X().map(x=>`<option value="${x}" ${g.currentTheme===x?"selected":""} class="wplace-settings-option">${x}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-globe wplace-icon-globe"></i>
            ${i.t("language")}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="languageSelect" class="wplace-settings-select">
              <option value="vi" ${e.language==="vi"?"selected":""} class="wplace-settings-option">\u{1F1FB}\u{1F1F3} Ti\u1EBFng Vi\u1EC7t</option>
              <option value="id" ${e.language==="id"?"selected":""} class="wplace-settings-option">\u{1F1EE}\u{1F1E9} Bahasa Indonesia</option>
              <option value="ru" ${e.language==="ru"?"selected":""} class="wplace-settings-option">\u{1F1F7}\u{1F1FA} \u0420\u0443\u0441\u0441\u043A\u0438\u0439</option>
              <option value="uk" ${e.language==="uk"?"selected":""} class="wplace-settings-option">\u{1F1FA}\u{1F1E6} \u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430</option>
              <option value="en" ${e.language==="en"?"selected":""} class="wplace-settings-option">\u{1F1FA}\u{1F1F8} English</option>
              <option value="pt" ${e.language==="pt"?"selected":""} class="wplace-settings-option">\u{1F1E7}\u{1F1F7} Portugu\xEAs</option>
              <option value="fr" ${e.language==="fr"?"selected":""} class="wplace-settings-option">\u{1F1EB}\u{1F1F7} Fran\xE7ais</option>
              <option value="tr" ${e.language==="tr"?"selected":""} class="wplace-settings-option">\u{1F1F9}\u{1F1F7} T\xFCrk\xE7e</option>
              <option value="zh" ${e.language==="zh"?"selected":""} class="wplace-settings-option">\u{1F1E8}\u{1F1F3} \u7B80\u4F53\u4E2D\u6587</option>
              <option value="zh-tw" ${e.language==="zh-tw"?"selected":""} class="wplace-settings-option">\u{1F1F9}\u{1F1FC} \u7E41\u9AD4\u4E2D\u6587</option>
              <option value="ja" ${e.language==="ja"?"selected":""} class="wplace-settings-option">\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E</option>
              <option value="ko" ${e.language==="ko"?"selected":""} class="wplace-settings-option">\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4</option>
              </select>
          </div>
        </div>

        <div class="wplace-settings-footer">
             <button id="applySettingsBtn" class="wplace-settings-apply-btn" style="
                width: 100%;
                ${g.CSS_CLASSES.BUTTON_PRIMARY}
             ">
                 <i class="fas fa-check"></i> ${i.t("applySettings")}
             </button>
        </div>

      </div>

      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes settingsSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes settingsFadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        #speedSlider::-webkit-slider-thumb, #overlayOpacitySlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #speedSlider::-webkit-slider-thumb:hover, #overlayOpacitySlider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
        }

        #speedSlider::-moz-range-thumb, #overlayOpacitySlider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        #themeSelect:hover, #languageSelect:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }

        #themeSelect:focus, #languageSelect:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
        }

        #themeSelect option, #languageSelect option {
          background: #2d3748;
          color: white;
          padding: 10px;
          border-radius: 6px;
        }

        #themeSelect option:hover, #languageSelect option:hover {
          background: #4a5568;
        }

        .wplace-dragging {
          opacity: 0.9;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2);
          transition: none;
        }

        .wplace-settings-header:hover {
          background: rgba(255,255,255,0.15) !important;
        }

        .wplace-settings-header:active {
          background: rgba(255,255,255,0.2) !important;
        }
      </style>
    `;let v=document.createElement("div");v.className="resize-container",v.innerHTML=`
      <h3 class="resize-dialog-title" style="color: ${s.text}">${i.t("resizeImage")}</h3>
      <div class="resize-controls">
        <label class="resize-control-label">
          Width: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label class="resize-control-label">
          Height: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label class="resize-checkbox-label">
          <input type="checkbox" id="keepAspect" checked>
          ${i.t("keepAspectRatio")}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintWhiteToggle" checked>
            ${i.t("paintWhitePixels")}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintTransparentToggle" checked>
            ${i.t("paintTransparentPixels")}
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn resize-zoom-btn" title="${i.t("zoomOut")}"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider resize-zoom-slider" min="0.1" max="20" value="1" step="0.05">
          <button id="zoomInBtn" class="wplace-btn resize-zoom-btn" title="${i.t("zoomIn")}"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn resize-zoom-btn" title="${i.t("fitToView")}">${i.t("fit")}</button>
          <button id="zoomActualBtn" class="wplace-btn resize-zoom-btn" title="${i.t("actualSize")}">${i.t("hundred")}</button>
          <button id="panModeBtn" class="wplace-btn resize-zoom-btn" title="${i.t("panMode")}">
            <i class="fas fa-hand-paper"></i>
          </button>
          <span id="zoomValue" class="resize-zoom-value">100%</span>
          <div id="cameraHelp" class="resize-camera-help">
            Drag to pan \u2022 Pinch to zoom \u2022 Double\u2011tap to zoom
          </div>
        </div>
      </div>

      <div class="resize-preview-wrapper">
          <div id="resizePanStage" class="resize-pan-stage">
            <div id="resizeCanvasStack" class="resize-canvas-stack resize-canvas-positioned">
              <canvas id="resizeCanvas" class="resize-base-canvas"></canvas>
              <canvas id="maskCanvas" class="resize-mask-canvas"></canvas>
            </div>
          </div>
      </div>
      <div class="resize-tools">
        <div class="resize-tools-container">
          <div class="resize-brush-controls">
              <div class="resize-brush-control">
                <label class="resize-tool-label">Brush</label>
                <div class="resize-tool-input-group">
                  <input id="maskBrushSize" type="range" min="1" max="7" step="1" value="1" class="resize-tool-slider">
                  <span id="maskBrushSizeValue" class="resize-tool-value">1</span>
                </div>
              </div>
            <div class="resize-brush-control">
              <label class="resize-tool-label">Row/col size</label>
              <div class="resize-tool-input-group">
                <input id="rowColSize" type="range" min="1" max="7" step="1" value="1" class="resize-tool-slider">
                <span id="rowColSizeValue" class="resize-tool-value">1</span>
              </div>
            </div>
          </div>
          <div class="resize-mode-controls">
            <label class="resize-tool-label">Mode</label>
            <div class="mask-mode-group resize-mode-group">
              <button id="maskModeIgnore" class="wplace-btn resize-mode-btn">Ignore</button>
              <button id="maskModeUnignore" class="wplace-btn resize-mode-btn">Unignore</button>
              <button id="maskModeToggle" class="wplace-btn wplace-btn-primary resize-mode-btn">Toggle</button>
            </div>
          </div>
        </div>
      </div>

      <div class="wplace-section resize-color-palette-section" id="color-palette-section">
          <div class="wplace-section-title">
              <i class="fas fa-palette"></i>&nbsp;Color Palette
          </div>
          <div class="wplace-controls">
              <div class="wplace-row single">
                  <label class="resize-color-toggle-label">
                      <input type="checkbox" id="showAllColorsToggle" class="resize-color-checkbox">
                      <span>${i.t("showAllColorsIncluding")}</span>
                  </label>
              </div>
              <div class="wplace-row" style="display: flex;">
                  <button id="selectAllBtn" class="wplace-btn" style="flex: 1;">Select All</button>
                  <button id="unselectAllBtn" class="wplace-btn" style="flex: 1;">Unselect All</button>
                  <button id="unselectPaidBtn" class="wplace-btn">Unselect Paid</button>
              </div>
              <div id="colors-container" class="wplace-color-grid"></div>
          </div>
      </div>

      <div class="wplace-section resize-advanced-color-section" id="advanced-color-section">
        <div class="wplace-section-title">
          <i class="fas fa-flask"></i>&nbsp;Advanced Color Matching
        </div>
        <div class="resize-advanced-controls">
          <label class="resize-advanced-label">
            <span class="resize-advanced-label-text">Algorithm</span>
            <select id="colorAlgorithmSelect" class="resize-advanced-select">
              <option value="lab" ${e.colorMatchingAlgorithm==="lab"?"selected":""}>Perceptual (Lab)</option>
            <option value="legacy" ${e.colorMatchingAlgorithm==="legacy"?"selected":""}>Legacy (RGB)</option>
            </select>
          </label>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Chroma Penalty</span>
              <div class="resize-advanced-description">Preserve vivid colors (Lab only)</div>
            </div>
            <input type="checkbox" id="enableChromaPenaltyToggle" ${e.enableChromaPenalty?"checked":""} class="resize-advanced-checkbox" />
          </label>
          <div class="resize-chroma-weight-control">
            <div class="resize-chroma-weight-header">
              <span>${i.t("chromaWeight")}</span>
              <span id="chromaWeightValue" class="resize-chroma-weight-value">${e.chromaPenaltyWeight}</span>
            </div>
            <input type="range" id="chromaPenaltyWeightSlider" min="0" max="0.5" step="0.01" value="${e.chromaPenaltyWeight}" class="resize-chroma-weight-slider" />
          </div>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Enable Dithering</span>
              <div class="resize-advanced-description">Floyd\u2013Steinberg error diffusion in preview and applied output</div>
            </div>
            <input type="checkbox" id="enableDitheringToggle" ${e.ditheringEnabled?"checked":""} class="resize-advanced-checkbox" />
          </label>
          <div class="resize-threshold-controls">
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">Transparency</span>
              <input type="number" id="transparencyThresholdInput" min="0" max="255" value="${e.customTransparencyThreshold}" class="resize-threshold-input" />
            </label>
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">White Thresh</span>
              <input type="number" id="whiteThresholdInput" min="200" max="255" value="${e.customWhiteThreshold}" class="resize-threshold-input" />
            </label>
          </div>
          <button id="resetAdvancedColorBtn" class="wplace-btn resize-reset-advanced-btn">Reset Advanced</button>
        </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>${i.t("downloadPreview")}</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>${i.t("apply")}</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>${i.t("cancel")}</span>
        </button>
      </div>
    `;let u=document.createElement("div");u.className="resize-overlay",document.body.appendChild(p),document.body.appendChild(u),document.body.appendChild(v),document.body.appendChild(w),document.body.appendChild(h),p.style.display="block";let E=p.querySelector("#uploadBtn"),k=p.querySelector("#resizeBtn"),P=p.querySelector("#selectPosBtn"),T=p.querySelector("#startBtn"),A=p.querySelector("#stopBtn"),N=p.querySelector("#saveBtn"),ee=p.querySelector("#loadBtn"),de=p.querySelector("#saveToFileBtn"),ye=p.querySelector("#loadFromFileBtn");ee&&(ee.disabled=!e.initialSetupComplete,ee.title=e.initialSetupComplete?"":"\u{1F504} Waiting for initial setup to complete..."),ye&&(ye.disabled=!e.initialSetupComplete,ye.title=e.initialSetupComplete?"":"\u{1F504} Waiting for initial setup to complete..."),E&&(E.disabled=!e.initialSetupComplete,E.title=e.initialSetupComplete?"":"\u{1F504} Waiting for initial setup to complete...");let pe=p.querySelector("#minimizeBtn"),Ne=p.querySelector("#compactBtn"),xe=p.querySelector("#statsBtn"),Se=p.querySelector("#toggleOverlayBtn"),Te=p.querySelector("#statusText"),ot=p.querySelector("#progressBar"),ft=w.querySelector("#statsArea"),Ke=p.querySelector(".wplace-content"),wt=w.querySelector("#closeStatsBtn"),Be=w.querySelector("#refreshChargesBtn"),Re=p.querySelector("#cooldownSlider"),$e=p.querySelector("#cooldownValue");(!E||!P||!T||!A)&&console.error("Some UI elements not found:",{uploadBtn:!!E,selectPosBtn:!!P,startBtn:!!T,stopBtn:!!A});let bt=p.querySelector(".wplace-header");vt(p);function vt(x){let z=0,R=0,$=0,se=0,q=!1,ge=x.querySelector(".wplace-header")||x.querySelector(".wplace-settings-header");if(!ge){console.warn("No draggable header found for element:",x);return}ge.onmousedown=Ce;function Ce(le){if(le.target.closest(".wplace-header-btn")||le.target.closest("button"))return;le.preventDefault(),q=!0;let re=x.getBoundingClientRect();x.style.transform="none",x.style.top=re.top+"px",x.style.left=re.left+"px",$=le.clientX,se=le.clientY,x.classList.add("wplace-dragging"),document.onmouseup=Pe,document.onmousemove=oe,document.body.style.userSelect="none"}function oe(le){if(!q)return;le.preventDefault(),z=$-le.clientX,R=se-le.clientY,$=le.clientX,se=le.clientY;let re=x.offsetTop-R,He=x.offsetLeft-z,Ye=x.getBoundingClientRect(),st=window.innerHeight-Ye.height,Ee=window.innerWidth-Ye.width;re=Math.max(0,Math.min(re,st)),He=Math.max(0,Math.min(He,Ee)),x.style.top=re+"px",x.style.left=He+"px"}function Pe(){q=!1,x.classList.remove("wplace-dragging"),document.onmouseup=null,document.onmousemove=null,document.body.style.userSelect=""}}vt(w),vt(p),xe&&wt&&(xe.addEventListener("click",()=>{w.style.display!=="none"?(w.style.display="none",xe.innerHTML='<i class="fas fa-chart-bar"></i>',xe.title=i.t("showStats")):(w.style.display="block",xe.innerHTML='<i class="fas fa-chart-line"></i>',xe.title=i.t("hideStats"))}),wt.addEventListener("click",()=>{w.style.display="none",xe.innerHTML='<i class="fas fa-chart-bar"></i>',xe.title=i.t("showStats")}),Be&&Be.addEventListener("click",async()=>{Be.innerHTML='<i class="fas fa-spinner fa-spin"></i>',Be.disabled=!0;try{await Oe()}catch(x){console.error("Error refreshing charges:",x)}finally{Be.innerHTML='<i class="fas fa-sync"></i>',Be.disabled=!1}})),w&&xe&&(xe.innerHTML='<i class="fas fa-chart-bar"></i>',xe.title=i.t("showStats"));let Ht=p.querySelector("#settingsBtn"),Tt=h.querySelector("#closeSettingsBtn"),ha=h.querySelector("#applySettingsBtn");if(Ht&&Tt&&ha){Ht.addEventListener("click",()=>{h.classList.contains("show")?(h.style.animation="settingsFadeOut 0.3s ease-out forwards",h.classList.remove("show"),setTimeout(()=>{h.style.animation=""},300)):(h.style.top="50%",h.style.left="50%",h.style.transform="translate(-50%, -50%)",h.classList.add("show"),h.style.animation="settingsSlideIn 0.4s ease-out")}),Tt.addEventListener("click",()=>{h.style.animation="settingsFadeOut 0.3s ease-out forwards",h.classList.remove("show"),setTimeout(()=>{h.style.animation="",h.style.top="50%",h.style.left="50%",h.style.transform="translate(-50%, -50%)"},300)}),ha.addEventListener("click",()=>{let M=document.getElementById("colorAlgorithmSelect");M&&(e.colorMatchingAlgorithm=M.value);let H=document.getElementById("enableChromaPenaltyToggle");H&&(e.enableChromaPenalty=H.checked);let Ze=document.getElementById("chromaPenaltyWeightSlider");Ze&&(e.chromaPenaltyWeight=parseFloat(Ze.value)||.15);let qt=document.getElementById("transparencyThresholdInput");if(qt){let V=parseInt(qt.value,10);!isNaN(V)&&V>=0&&V<=255&&(e.customTransparencyThreshold=V)}let yt=document.getElementById("whiteThresholdInput");if(yt){let V=parseInt(yt.value,10);!isNaN(V)&&V>=200&&V<=255&&(e.customWhiteThreshold=V)}g.TRANSPARENCY_THRESHOLD=e.customTransparencyThreshold,g.WHITE_THRESHOLD=e.customWhiteThreshold;let Yt=document.getElementById("notifEnabledToggle"),Gt=document.getElementById("notifOnChargesToggle"),Vt=document.getElementById("notifOnlyUnfocusedToggle"),we=document.getElementById("notifIntervalInput");if(Yt&&(e.notificationsEnabled=!!Yt.checked),Gt&&(e.notifyOnChargesReached=!!Gt.checked),Vt&&(e.notifyOnlyWhenUnfocused=!!Vt.checked),we){let V=parseInt(we.value,10);!isNaN(V)&&V>=1&&V<=60&&(e.notificationIntervalMinutes=V)}Q(),i.showAlert(i.t("settingsSaved"),"success"),Tt.click(),je.syncFromState()}),vt(h);let x=h.querySelector("#tokenSourceSelect");x&&x.addEventListener("change",M=>{e.tokenSource=M.target.value,Q(),console.log(`\u{1F511} Token source changed to: ${e.tokenSource}`);let H={generator:"Automatic Generator",hybrid:"Generator + Auto Fallback",manual:"Manual Pixel Placement"};i.showAlert(i.t("tokenSourceSet",{source:H[e.tokenSource]}),"success")});let z=h.querySelector("#batchModeSelect"),R=h.querySelector("#normalBatchControls"),$=h.querySelector("#randomBatchControls"),se=h.querySelector("#randomBatchMin"),q=h.querySelector("#randomBatchMax");z&&z.addEventListener("change",M=>{e.batchMode=M.target.value,R&&$&&(M.target.value==="random"?(R.style.display="none",$.style.display="block"):(R.style.display="block",$.style.display="none")),Q(),console.log(`\u{1F4E6} Batch mode changed to: ${e.batchMode}`),i.showAlert(i.t("batchModeSet",{mode:e.batchMode==="random"?i.t("randomRange"):i.t("normalFixedSize")}),"success")}),se&&se.addEventListener("input",M=>{let H=parseInt(M.target.value);H>=1&&H<=1e3&&(e.randomBatchMin=H,q&&H>e.randomBatchMax&&(e.randomBatchMax=H,q.value=H),Q())}),q&&q.addEventListener("input",M=>{let H=parseInt(M.target.value);H>=1&&H<=1e3&&(e.randomBatchMax=H,se&&H<e.randomBatchMin&&(e.randomBatchMin=H,se.value=H),Q())});let ge=h.querySelector("#languageSelect");ge&&ge.addEventListener("change",async M=>{let H=M.target.value;e.language=H,localStorage.setItem("wplace_language",H),await nt(H),setTimeout(()=>{h.style.display="none",ga()},100)});let Ce=h.querySelector("#themeSelect");Ce&&Ce.addEventListener("change",M=>{let H=M.target.value;he(H)});let oe=h.querySelector("#overlayOpacitySlider"),Pe=h.querySelector("#overlayOpacityValue"),le=h.querySelector("#enableBlueMarbleToggle"),re=h.querySelector("#settingsPaintWhiteToggle"),He=h.querySelector("#settingsPaintTransparentToggle");oe&&Pe&&oe.addEventListener("input",M=>{let H=parseFloat(M.target.value);e.overlayOpacity=H,Pe.textContent=`${Math.round(H*100)}%`}),re&&re.addEventListener("change",M=>{e.paintWhitePixels=M.target.checked,Q()}),He&&He.addEventListener("change",M=>{e.paintTransparentPixels=M.target.checked,Q()});let Ye=h.querySelector("#speedSlider"),st=h.querySelector("#speedValue");Ye&&st&&Ye.addEventListener("input",M=>{let H=parseInt(M.target.value,10);e.paintingSpeed=H,st.textContent=`${H} (batch size)`,Q()}),le&&le.addEventListener("click",async()=>{e.blueMarbleEnabled=le.checked,e.imageLoaded&&Le.imageBitmap&&(i.showAlert(i.t("reprocessingOverlay"),"info"),await Le.processImageIntoChunks(),i.showAlert(i.t("overlayUpdated"),"success"))});let Ee=h.querySelector("#notifRequestPermBtn"),W=h.querySelector("#notifTestBtn");Ee&&Ee.addEventListener("click",async()=>{await je.requestPermission()==="granted"?i.showAlert(i.t("notificationsEnabled"),"success"):i.showAlert(i.t("notificationsPermissionDenied"),"warning")}),W&&W.addEventListener("click",()=>{je.notify(i.t("testNotificationTitle"),i.t("testNotificationMessage"),"wplace-notify-test",!0)})}let Fe=v.querySelector("#widthSlider"),_e=v.querySelector("#heightSlider"),Da=v.querySelector("#widthValue"),La=v.querySelector("#heightValue"),Ba=v.querySelector("#keepAspect"),Oa=v.querySelector("#paintWhiteToggle"),Na=v.querySelector("#paintTransparentToggle"),Ge=v.querySelector("#zoomSlider"),Ut=v.querySelector("#zoomValue"),Ct=v.querySelector("#zoomInBtn"),Pt=v.querySelector("#zoomOutBtn"),Ra=v.querySelector("#zoomFitBtn"),Fa=v.querySelector("#zoomActualBtn"),Et=v.querySelector("#panModeBtn"),ue=v.querySelector("#resizePanStage"),It=v.querySelector("#resizeCanvasStack"),G=v.querySelector("#resizeCanvas"),fe=v.querySelector("#maskCanvas"),rt=G.getContext("2d"),Je=fe.getContext("2d"),mn=v.querySelector("#confirmResize"),fn=v.querySelector("#cancelResize"),wn=v.querySelector("#downloadPreviewBtn"),Dn=v.querySelector("#clearIgnoredBtn");Ne&&Ne.addEventListener("click",()=>{p.classList.toggle("wplace-compact"),p.classList.contains("wplace-compact")?(Ne.innerHTML='<i class="fas fa-expand"></i>',Ne.title=i.t("expandMode")):(Ne.innerHTML='<i class="fas fa-compress"></i>',Ne.title=i.t("compactMode"))}),pe&&pe.addEventListener("click",()=>{e.minimized=!e.minimized,e.minimized?(p.classList.add("wplace-minimized"),Ke.classList.add("wplace-hidden"),pe.innerHTML='<i class="fas fa-expand"></i>',pe.title=i.t("restore")):(p.classList.remove("wplace-minimized"),Ke.classList.remove("wplace-hidden"),pe.innerHTML='<i class="fas fa-minus"></i>',pe.title=i.t("minimize")),Q()}),Se&&Se.addEventListener("click",()=>{let x=Le.toggle();Se.classList.toggle("active",x),Se.setAttribute("aria-pressed",x?"true":"false"),i.showAlert(x?i.t("overlayEnabled"):i.t("overlayDisabled"),"info")}),e.minimized?(p.classList.add("wplace-minimized"),Ke.classList.add("wplace-hidden"),pe&&(pe.innerHTML='<i class="fas fa-expand"></i>',pe.title=i.t("restore"))):(p.classList.remove("wplace-minimized"),Ke.classList.remove("wplace-hidden"),pe&&(pe.innerHTML='<i class="fas fa-minus"></i>',pe.title=i.t("minimize"))),N&&N.addEventListener("click",()=>{if(!e.imageLoaded){i.showAlert(i.t("missingRequirements"),"error");return}i.saveProgress()?(_("autoSaved","success"),i.showAlert(i.t("autoSaved"),"success")):i.showAlert(i.t("errorSavingProgress"),"error")}),ee&&ee.addEventListener("click",()=>{if(!e.initialSetupComplete){i.showAlert(i.t("pleaseWaitInitialSetup"),"warning");return}let x=i.loadProgress();if(!x){_("noSavedData","warning"),i.showAlert(i.t("noSavedData"),"warning");return}confirm(`${i.t("savedDataFound")}

Saved: ${new Date(x.timestamp).toLocaleString()}
Progress: ${x.state.paintedPixels}/${x.state.totalPixels} pixels`)&&(i.restoreProgress(x)?(_("dataLoaded","success"),i.showAlert(i.t("dataLoaded"),"success"),St(),Oe(),i.restoreOverlayFromData().catch($=>{console.error("Failed to restore overlay from localStorage:",$)}),e.colorsChecked?(E.disabled=!1,P.disabled=!1):E.disabled=!1,e.imageLoaded&&e.startPosition&&e.region&&e.colorsChecked&&(T.disabled=!1)):i.showAlert(i.t("errorLoadingProgress"),"error"))}),de&&de.addEventListener("click",()=>{i.saveProgressToFile()?(_("fileSaved","success"),i.showAlert(i.t("fileSaved"),"success")):i.showAlert(i.t("fileError"),"error")}),ye&&ye.addEventListener("click",async()=>{if(!e.initialSetupComplete){i.showAlert(i.t("pleaseWaitFileSetup"),"warning");return}try{await i.loadProgressFromFile()&&(_("fileLoaded","success"),i.showAlert(i.t("fileLoaded"),"success"),St(),await Oe(),await i.restoreOverlayFromData().catch(z=>{console.error("Failed to restore overlay from file:",z)}),e.colorsChecked?(E.disabled=!1,P.disabled=!1,k.disabled=!1):E.disabled=!1,e.imageLoaded&&e.startPosition&&e.region&&e.colorsChecked&&(T.disabled=!1))}catch(x){x.message==="Invalid JSON file"?i.showAlert(i.t("invalidFileFormat"),"error"):i.showAlert(i.t("fileError"),"error")}}),_=(x,z="default",R={})=>{let $=i.t(x,R);Te.textContent=$,Te.className=`wplace-status status-${z}`,Te.style.animation="none",Te.offsetWidth,Te.style.animation="slideIn 0.3s ease-out"},Oe=async()=>{let{charges:x,cooldown:z,max:R}=await da.getCharges();e.currentCharges=Math.floor(x),e.cooldown=z,e.maxCharges=Math.floor(R)>1?Math.floor(R):e.maxCharges,je.maybeNotifyChargesReached(),Re.max!=e.maxCharges&&(Re.max=e.maxCharges);let $="";if(e.imageLoaded){let q=e.totalPixels>0?Math.round(e.paintedPixels/e.totalPixels*100):0,ge=e.totalPixels-e.paintedPixels;e.estimatedTime=i.calculateEstimatedTime(ge,e.currentCharges,e.cooldown),ot.style.width=`${q}%`,$=`
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-image"></i> ${i.t("progress")}</div>
                <div class="wplace-stat-value">${q}%</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${i.t("pixels")}</div>
                <div class="wplace-stat-value">${e.paintedPixels}/${e.totalPixels}</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${i.t("estimatedTime")}</div>
                <div class="wplace-stat-value">${i.formatTime(e.estimatedTime)}</div>
                </div>
            `}let se="";e.colorsChecked&&(se=e.availableColors.map(q=>`<div class="wplace-stat-color-swatch" style="background-color: ${`rgb(${q.rgb.join(",")})`};" title="${i.t("colorTooltip",{id:q.id,rgb:q.rgb.join(", ")})}"></div>`).join("")),ft.innerHTML=`
            ${$}
            <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${i.t("charges")}</div>
            <div class="wplace-stat-value">${Math.floor(e.currentCharges)} / ${e.maxCharges}</div>
            </div>
            ${e.colorsChecked?`
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${i.t("availableColors",{count:e.availableColors.length})}</div>
                <div class="wplace-stat-colors-grid">
                    ${se}
                </div>
            </div>
            `:""}
        `},St=()=>{let x=e.imageLoaded&&e.imageData;N.disabled=!x,de.disabled=!x},St();function bn(x){var ja;let z=x,R,$;if((ja=e.originalImage)!=null&&ja.dataUrl)z=new ca(e.originalImage.dataUrl),R=e.originalImage.width,$=e.originalImage.height;else{let c=x.getDimensions();R=c.width,$=c.height}let se=R/$,q=e.resizeSettings;Fe.max=R*2,_e.max=$*2;let ge=R,Ce=$;q&&Number.isFinite(q.width)&&Number.isFinite(q.height)&&q.width>0&&q.height>0&&(ge=q.width,Ce=q.height),ge=Math.max(parseInt(Fe.min,10)||10,Math.min(ge,parseInt(Fe.max,10))),Ce=Math.max(parseInt(_e.min,10)||10,Math.min(Ce,parseInt(_e.max,10))),Fe.value=ge,_e.value=Ce,Da.textContent=ge,La.textContent=Ce,Ge.value=1,Ut&&(Ut.textContent="100%"),Oa.checked=e.paintWhitePixels,Na.checked=e.paintTransparentPixels;let oe=null,Pe=0,le=!1,re=1,He=null,Ye=null,st=c=>((!He||He.length!==c*3)&&(He=new Float32Array(c*3)),(!Ye||Ye.length!==c)&&(Ye=new Uint8Array(c)),{work:He,eligible:Ye}),Ee=null,W=null,M=null,H=()=>{M={minX:1/0,minY:1/0,maxX:-1,maxY:-1}},Ze=(c,f)=>{M||H(),c<M.minX&&(M.minX=c),f<M.minY&&(M.minY=f),c>M.maxX&&(M.maxX=c),f>M.maxY&&(M.maxY=f)},qt=()=>{if(!M||M.maxX<M.minX||M.maxY<M.minY)return;let c=Math.max(0,M.minX),f=Math.max(0,M.minY),b=Math.min(fe.width-c,M.maxX-c+1),y=Math.min(fe.height-f,M.maxY-f+1);b>0&&y>0&&Je.putImageData(Ee,0,0,c,f,b,y),H()},yt=(c,f,b=!1)=>{if((!Ee||Ee.width!==c||Ee.height!==f)&&(Ee=Je.createImageData(c,f),W=Ee.data,b=!0),b){let y=e.resizeIgnoreMask,C=W;if(C.fill(0),y){for(let D=0;D<y.length;D++)if(y[D]){let Z=D*4;C[Z]=255,C[Z+1]=0,C[Z+2]=0,C[Z+3]=150}}Je.putImageData(Ee,0,0),H()}},Yt=(c,f)=>{(!e.resizeIgnoreMask||e.resizeIgnoreMask.length!==c*f)&&(e.resizeIgnoreMask=new Uint8Array(c*f)),G.width=c,G.height=f,fe.width=c,fe.height=f,Je.clearRect(0,0,fe.width,fe.height),yt(c,f,!0)};J=async()=>{let c=++Pe,f=parseInt(Fe.value,10),b=parseInt(_e.value,10);if(re=parseFloat(Ge.value),Da.textContent=f,La.textContent=b,Yt(f,b),It.style.width=f+"px",It.style.height=b+"px",rt.imageSmoothingEnabled=!1,!e.availableColors||e.availableColors.length===0){z!==x&&(!z.img||!z.canvas)&&await z.load(),rt.clearRect(0,0,f,b),rt.drawImage(z.img,0,0,f,b),Je.clearRect(0,0,fe.width,fe.height),Ee&&Je.putImageData(Ee,0,0),ma();return}z!==x&&(!z.img||!z.canvas)&&await z.load(),rt.clearRect(0,0,f,b),rt.drawImage(z.img,0,0,f,b);let y=rt.getImageData(0,0,f,b),C=y.data,D=e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD,Z=()=>{let I=f,B=b,ae=I*B,{work:L,eligible:F}=st(ae);for(let U=0;U<B;U++)for(let ne=0;ne<I;ne++){let j=U*I+ne,ce=dt({data:C,width:I,height:B},ne,U);if(!ce)continue;let[Ie,Y,K,ie]=ce,me=(e.paintTransparentPixels||ie>=D)&&(e.paintWhitePixels||!Xe([Ie,Y,K]));F[j]=me?1:0,L[j*3]=Ie,L[j*3+1]=Y,L[j*3+2]=K,me||Ve({data:C,width:I,height:B},ne,U,[ce[0],ce[1],ce[2],0])}let O=(U,ne,j,ce,Ie,Y)=>{if(U<0||U>=I||ne<0||ne>=B)return;let K=ne*I+U;if(!F[K])return;let ie=K*3;L[ie]=Math.min(255,Math.max(0,L[ie]+j*Y)),L[ie+1]=Math.min(255,Math.max(0,L[ie+1]+ce*Y)),L[ie+2]=Math.min(255,Math.max(0,L[ie+2]+Ie*Y))};for(let U=0;U<B;U++)for(let ne=0;ne<I;ne++){let j=U*I+ne;if(!F[j])continue;let ce=j*3,Ie=L[ce],Y=L[ce+1],K=L[ce+2],[ie,me,We]=i.findClosestPaletteColor(Ie,Y,K,e.activeColorPalette);Ve({data:C,width:I,height:B},ne,U,[ie,me,We,255]);let Ae=Ie-ie,ze=Y-me,be=K-We;O(ne+1,U,Ae,ze,be,7/16),O(ne-1,U+1,Ae,ze,be,3/16),O(ne,U+1,Ae,ze,be,5/16),O(ne+1,U+1,Ae,ze,be,1/16)}};if(e.ditheringEnabled&&!le)Z();else for(let I=0;I<b;I++)for(let B=0;B<f;B++){let ae=dt({data:C,width:f,height:b},B,I);if(!ae)continue;let[L,F,O,U]=ae;if(!e.paintTransparentPixels&&Bt(ae,D)||!e.paintWhitePixels&&Xe([L,F,O])){Ve({data:C,width:f,height:b},B,I,[L,F,O,0]);continue}let[ne,j,ce]=Rt([L,F,O],e.activeColorPalette);Ve({data:C,width:f,height:b},B,I,[ne,j,ce,255])}c===Pe&&(rt.putImageData(y,0,0),Je.clearRect(0,0,fe.width,fe.height),Ee&&Je.putImageData(Ee,0,0),ma())};let Gt=()=>{Ba.checked&&(_e.value=Math.round(parseInt(Fe.value,10)/se)),J();let c=parseInt(Fe.value,10),f=parseInt(_e.value,10);e.resizeSettings={baseWidth:R,baseHeight:$,width:c,height:f},Q();let b=typeof Qe=="function"?Qe():1;!isNaN(b)&&isFinite(b)&&Ue(b)},Vt=()=>{Ba.checked&&(Fe.value=Math.round(parseInt(_e.value,10)*se)),J();let c=parseInt(Fe.value,10),f=parseInt(_e.value,10);e.resizeSettings={baseWidth:R,baseHeight:$,width:c,height:f},Q();let b=typeof Qe=="function"?Qe():1;!isNaN(b)&&isFinite(b)&&Ue(b)};Oa.onchange=c=>{e.paintWhitePixels=c.target.checked,J(),Q()},Na.onchange=c=>{e.paintTransparentPixels=c.target.checked,J(),Q()};let we=0,V=0,yn=()=>{let c=(ue==null?void 0:ue.getBoundingClientRect())||{width:0,height:0},f=(G.width||1)*re,b=(G.height||1)*re;if(f<=c.width)we=Math.floor((c.width-f)/2);else{let y=c.width-f;we=Math.min(0,Math.max(y,we))}if(b<=c.height)V=Math.floor((c.height-b)/2);else{let y=c.height-b;V=Math.min(0,Math.max(y,V))}},ua=0,Xt=()=>{ua||(ua=requestAnimationFrame(()=>{yn(),It.style.transform=`translate3d(${Math.round(we)}px, ${Math.round(V)}px, 0) scale(${re})`,ua=0}))},ma=()=>{let c=G.width||1,f=G.height||1;G.style.width=c+"px",G.style.height=f+"px",fe.style.width=c+"px",fe.style.height=f+"px",It.style.width=c+"px",It.style.height=f+"px",Xt()},Ue=c=>{re=Math.max(.05,Math.min(20,c||1)),Ge.value=re,ma(),Ut&&(Ut.textContent=`${Math.round(re*100)}%`)};Ge.addEventListener("input",()=>{Ue(parseFloat(Ge.value))}),Ct&&Ct.addEventListener("click",()=>Ue(parseFloat(Ge.value)+.1)),Pt&&Pt.addEventListener("click",()=>Ue(parseFloat(Ge.value)-.1));let Qe=()=>{let c=ue==null?void 0:ue.getBoundingClientRect();if(!c)return 1;let f=G.width||1,b=G.height||1,y=10,C=(c.width-y)/f,D=(c.height-y)/b;return Math.max(.05,Math.min(20,Math.min(C,D)))};Ra&&Ra.addEventListener("click",()=>{Ue(Qe()),At()}),Fa&&Fa.addEventListener("click",()=>{Ue(1),At()});let At=()=>{if(!ue)return;let c=ue.getBoundingClientRect(),f=(G.width||1)*re,b=(G.height||1)*re;we=Math.floor((c.width-f)/2),V=Math.floor((c.height-b)/2),Xt()},et=!1,jt=0,Kt=0,Jt=0,Zt=0,tt=!1,lt=!1,xn=c=>c.button===1||c.button===2,ct=c=>{ue&&(ue.style.cursor=c)},kn=c=>lt||tt||xn(c),Ha=()=>{Et&&(Et.classList.toggle("active",lt),Et.setAttribute("aria-pressed",lt?"true":"false"))};if(Et&&(Ha(),Et.addEventListener("click",()=>{lt=!lt,Ha(),ct(lt?"grab":"")})),ue){ue.addEventListener("contextmenu",y=>{tt&&y.preventDefault()}),window.addEventListener("keydown",y=>{y.code==="Space"&&(tt=!0,ct("grab"))}),window.addEventListener("keyup",y=>{y.code==="Space"&&(tt=!1,et||ct(""))}),ue.addEventListener("mousedown",y=>{kn(y)&&(y.preventDefault(),et=!0,jt=y.clientX,Kt=y.clientY,Jt=we,Zt=V,ct("grabbing"))}),window.addEventListener("mousemove",y=>{if(!et)return;let C=y.clientX-jt,D=y.clientY-Kt;we=Jt+C,V=Zt+D,Xt()}),window.addEventListener("mouseup",()=>{et&&(et=!1,ct(tt?"grab":""))}),ue.addEventListener("wheel",y=>{if(!y.ctrlKey&&!y.metaKey)return;y.preventDefault();let C=ue.getBoundingClientRect(),D=y.clientX-C.left-we,Z=y.clientY-C.top-V,I=re,B=Math.max(.05,Math.min(.5,Math.abs(y.deltaY)>20?.2:.1)),ae=Math.max(.05,Math.min(20,I+(y.deltaY>0?-B:B)));if(ae===I)return;let L=ae/I;we=we-D*(L-1),V=V-Z*(L-1),Ue(ae)},{passive:!1});let c=null,f=0,b=null;ue.addEventListener("touchstart",y=>{if(y.touches.length===1){let C=y.touches[0];et=!0,jt=C.clientX,Kt=C.clientY,Jt=we,Zt=V,ct("grabbing");let D=Date.now();if(D-f<300){let Z=Math.abs(re-1)<.01?Qe():1;Ue(Z),At(),b&&clearTimeout(b)}else f=D,b=setTimeout(()=>{b=null},320)}else if(y.touches.length===2){let[C,D]=y.touches;c=Math.hypot(D.clientX-C.clientX,D.clientY-C.clientY)}},{passive:!0}),ue.addEventListener("touchmove",y=>{if(y.touches.length===1&&et){let C=y.touches[0],D=C.clientX-jt,Z=C.clientY-Kt;we=Jt+D,V=Zt+Z,Xt()}else if(y.touches.length===2&&c!=null){y.preventDefault();let[C,D]=y.touches,Z=Math.hypot(D.clientX-C.clientX,D.clientY-C.clientY),I=ue.getBoundingClientRect(),B=(C.clientX+D.clientX)/2-I.left-we,ae=(C.clientY+D.clientY)/2-I.top-V,L=re,F=Z/(c||Z),O=Math.max(.05,Math.min(20,L*F));O!==L&&(we=we-B*(O/L-1),V=V-ae*(O/L-1),Ue(O)),c=Z}},{passive:!1}),ue.addEventListener("touchend",()=>{et=!1,c=null,ct(lt||tt?"grab":"")})}let fa=()=>{oe&&clearTimeout(oe);let c=()=>{oe=null,J()};window.requestIdleCallback?oe=setTimeout(()=>requestIdleCallback(c,{timeout:150}),50):oe=setTimeout(()=>requestAnimationFrame(c),50)},Ua=()=>{le=!0},qa=()=>{le=!1,fa()};Fe.addEventListener("pointerdown",Ua),_e.addEventListener("pointerdown",Ua),Fe.addEventListener("pointerup",qa),_e.addEventListener("pointerup",qa),Fe.addEventListener("input",()=>{Gt(),fa()}),_e.addEventListener("input",()=>{Vt(),fa()});let Qt=!1,Sn=-1,Tn=-1,ea=1,Mt=1,at="ignore",zt=v.querySelector("#maskBrushSize"),wa=v.querySelector("#maskBrushSizeValue"),ba=v.querySelector("#maskModeIgnore"),va=v.querySelector("#maskModeUnignore"),ya=v.querySelector("#maskModeToggle"),Ya=v.querySelector("#clearIgnoredBtn"),Ga=v.querySelector("#invertMaskBtn"),Dt=v.querySelector("#rowColSize"),xa=v.querySelector("#rowColSizeValue"),Va=()=>{let c=[[ba,"ignore"],[va,"unignore"],[ya,"toggle"]];for(let[f,b]of c){if(!f)continue;let y=at===b;f.classList.toggle("active",y),f.setAttribute("aria-pressed",y?"true":"false")}},ka=c=>{at=c,Va()};zt&&wa&&(zt.addEventListener("input",()=>{ea=parseInt(zt.value,10)||1,wa.textContent=ea}),wa.textContent=zt.value,ea=parseInt(zt.value,10)||1),Dt&&xa&&(Dt.addEventListener("input",()=>{Mt=parseInt(Dt.value,10)||1,xa.textContent=Mt}),xa.textContent=Dt.value,Mt=parseInt(Dt.value,10)||1),ba&&ba.addEventListener("click",()=>ka("ignore")),va&&va.addEventListener("click",()=>ka("unignore")),ya&&ya.addEventListener("click",()=>ka("toggle")),Va();let Cn=(c,f)=>{let b=G.getBoundingClientRect(),y=b.width/G.width,C=b.height/G.height,D=(c-b.left)/y,Z=(f-b.top)/C,I=Math.floor(D),B=Math.floor(Z);return{x:I,y:B}},Sa=(c,f)=>{(!e.resizeIgnoreMask||e.resizeIgnoreMask.length!==c*f)&&(e.resizeIgnoreMask=new Uint8Array(c*f))},Pn=(c,f,b,y)=>{let C=G.width,D=G.height;Sa(C,D);let Z=b*b;for(let I=f-b;I<=f+b;I++)if(!(I<0||I>=D))for(let B=c-b;B<=c+b;B++){if(B<0||B>=C)continue;let ae=en(B,I,c,f);if(ae*ae<=Z){let L=I*C+B,F=e.resizeIgnoreMask[L];if(at==="toggle"?F=F?0:1:at==="ignore"?F=1:F=0,e.resizeIgnoreMask[L]=F,W){let O=L*4;F?(W[O]=255,W[O+1]=0,W[O+2]=0,W[O+3]=150):(W[O]=0,W[O+1]=0,W[O+2]=0,W[O+3]=0),Ze(B,I)}}}},En=(c,f)=>{let b=G.width,y=G.height;if(Sa(b,y),c<0||c>=y)return;let C=Math.floor(Mt/2),D=Math.max(0,c-C),Z=Math.min(y-1,c+C);for(let I=D;I<=Z;I++){for(let B=0;B<b;B++){let ae=I*b+B,L=e.resizeIgnoreMask[ae];if(at==="toggle"?L=L?0:1:at==="ignore"?L=1:L=0,e.resizeIgnoreMask[ae]=L,W){let F=ae*4;L?(W[F]=255,W[F+1]=0,W[F+2]=0,W[F+3]=150):(W[F]=0,W[F+1]=0,W[F+2]=0,W[F+3]=0)}}W&&(Ze(0,I),Ze(b-1,I))}},In=(c,f)=>{let b=G.width,y=G.height;if(Sa(b,y),c<0||c>=b)return;let C=Math.floor(Mt/2),D=Math.max(0,c-C),Z=Math.min(b-1,c+C);for(let I=D;I<=Z;I++){for(let B=0;B<y;B++){let ae=B*b+I,L=e.resizeIgnoreMask[ae];if(at==="toggle"?L=L?0:1:at==="ignore"?L=1:L=0,e.resizeIgnoreMask[ae]=L,W){let F=ae*4;L?(W[F]=255,W[F+1]=0,W[F+2]=0,W[F+3]=150):(W[F]=0,W[F+1]=0,W[F+2]=0,W[F+3]=0)}}W&&(Ze(I,0),Ze(I,y-1))}},An=()=>{qt()},Xa=c=>{if((c.buttons&4)===4||(c.buttons&2)===2||tt)return;let{x:f,y:b}=Cn(c.clientX,c.clientY),y=G.width,C=G.height;if(f<0||b<0||f>=y||b>=C)return;let D=Math.max(1,Math.floor(ea/2));c.shiftKey?En(b):c.altKey?In(f):Pn(f,b,D),Sn=f,Tn=b,An()};fe.addEventListener("mousedown",c=>{c.button===1||c.button===2||tt||(Qt=!0,Xa(c))}),fe.addEventListener("touchstart",c=>{},{passive:!0}),fe.addEventListener("touchmove",c=>{},{passive:!0}),fe.addEventListener("touchend",c=>{},{passive:!0}),window.addEventListener("mousemove",c=>{Qt&&Xa(c)}),window.addEventListener("mouseup",()=>{Qt&&(Qt=!1,Q())}),Ya&&Ya.addEventListener("click",()=>{let c=G.width,f=G.height;e.resizeIgnoreMask&&e.resizeIgnoreMask.fill(0),yt(c,f,!0),J(),Q()}),Ga&&Ga.addEventListener("click",()=>{if(!e.resizeIgnoreMask)return;for(let b=0;b<e.resizeIgnoreMask.length;b++)e.resizeIgnoreMask[b]=e.resizeIgnoreMask[b]?0:1;let c=G.width,f=G.height;yt(c,f,!0),J(),Q()}),mn.onclick=async()=>{let c=parseInt(Fe.value,10),f=parseInt(_e.value,10),b=document.createElement("canvas"),y=b.getContext("2d");b.width=c,b.height=f,y.imageSmoothingEnabled=!1,z!==x&&(!z.img||!z.canvas)&&await z.load(),y.drawImage(z.img,0,0,c,f);let C=y.getImageData(0,0,c,f),D=C.data,Z=e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD,I=0,B=e.resizeIgnoreMask&&e.resizeIgnoreMask.length===c*f?e.resizeIgnoreMask:null,ae=async()=>{let O=c,U=f,ne=O*U,{work:j,eligible:ce}=st(ne);for(let Y=0;Y<U;Y++){for(let K=0;K<O;K++){let ie=Y*O+K,me=dt({data:D,width:O,height:U},K,Y);if(!me)continue;let[We,Ae,ze,be]=me,Lt=!(B&&B[ie])&&(e.paintTransparentPixels||be>=Z)&&(e.paintWhitePixels||!Xe([We,Ae,ze]));ce[ie]=Lt?1:0,j[ie*3]=We,j[ie*3+1]=Ae,j[ie*3+2]=ze,Lt||Ve({data:D,width:O,height:U},K,Y,[me[0],me[1],me[2],0])}Y&15||await Promise.resolve()}let Ie=(Y,K,ie,me,We,Ae)=>{if(Y<0||Y>=O||K<0||K>=U)return;let ze=K*O+Y;if(!ce[ze])return;let be=ze*3;j[be]=Math.min(255,Math.max(0,j[be]+ie*Ae)),j[be+1]=Math.min(255,Math.max(0,j[be+1]+me*Ae)),j[be+2]=Math.min(255,Math.max(0,j[be+2]+We*Ae))};for(let Y=0;Y<U;Y++){for(let K=0;K<O;K++){let ie=Y*O+K;if(!ce[ie])continue;let me=ie*3,We=j[me],Ae=j[me+1],ze=j[me+2],[be,Ta,Lt]=i.findClosestPaletteColor(We,Ae,ze,e.activeColorPalette);Ve({data:D,width:O,height:U},K,Y,[be,Ta,Lt,255]),I++;let ta=We-be,aa=Ae-Ta,na=ze-Lt;Ie(K+1,Y,ta,aa,na,7/16),Ie(K-1,Y+1,ta,aa,na,3/16),Ie(K,Y+1,ta,aa,na,5/16),Ie(K+1,Y+1,ta,aa,na,1/16)}await Promise.resolve()}};if(e.ditheringEnabled)await ae();else for(let O=0;O<f;O++)for(let U=0;U<c;U++){let ne=(O*c+U)*4,j=dt({data:D,width:c,height:f},U,O);if(!j)continue;let[ce,Ie,Y,K]=j,ie=B&&B[ne>>2],me=!e.paintTransparentPixels&&Bt(j,Z)||ie,We=!e.paintWhitePixels&&Xe([ce,Ie,Y]);if(me||We){Ve({data:D,width:c,height:f},U,O,[ce,Ie,Y,0]);continue}I++;let[Ae,ze,be]=Rt([ce,Ie,Y],e.activeColorPalette);Ve({data:D,width:c,height:f},U,O,[Ae,ze,be,255])}y.putImageData(C,0,0);let L=new Uint8ClampedArray(C.data);e.imageData.pixels=L,e.imageData.width=c,e.imageData.height=f,e.imageData.totalPixels=I,e.totalPixels=I,e.paintedPixels=0,e.resizeSettings={baseWidth:R,baseHeight:$,width:c,height:f},Q();let F=await createImageBitmap(b);await Le.setImage(F),Le.enable(),Se.classList.add("active"),Se.setAttribute("aria-pressed","true"),Oe(),_("resizeSuccess","success",{width:c,height:f}),_a()},wn.onclick=()=>{try{let c=G.width,f=G.height,b=document.createElement("canvas");b.width=c,b.height=f;let y=b.getContext("2d");y.imageSmoothingEnabled=!1,y.drawImage(G,0,0),y.drawImage(fe,0,0);let C=document.createElement("a");C.download="wplace-preview.png",C.href=b.toDataURL(),C.click()}catch(c){console.warn("Failed to download preview:",c)}},fn.onclick=_a,u.style.display="block",v.style.display="block",cn(v),J(),Ot=()=>{try{Ge.replaceWith(Ge.cloneNode(!0))}catch{}try{Ct&&Ct.replaceWith(Ct.cloneNode(!0))}catch{}try{Pt&&Pt.replaceWith(Pt.cloneNode(!0))}catch{}},setTimeout(()=>{if(typeof Qe=="function"){let c=Qe();!isNaN(c)&&isFinite(c)&&(Ue(c),At())}else At()},0)}function _a(){try{typeof Ot=="function"&&Ot()}catch{}u.style.display="none",v.style.display="none",J=()=>{};try{typeof cancelAnimationFrame=="function"&&_panRaf&&cancelAnimationFrame(_panRaf)}catch{}try{_previewTimer&&(clearTimeout(_previewTimer),_previewTimer=null)}catch{}_maskImageData=null,_maskData=null,_dirty=null,_ditherWorkBuf=null,_ditherEligibleBuf=null,Ot=null}E&&E.addEventListener("click",async()=>{let x=i.extractAvailableColors();if(x.length<10){_("noColorsFound","error"),i.showAlert(i.t("noColorsFound"),"error");return}e.colorsChecked||(e.availableColors=x,e.colorsChecked=!0,_("colorsFound","success",{count:x.length}),Oe(),P.disabled=!1,e.imageLoaded&&(k.disabled=!1));try{_("loadingImage","default");let z=await i.createImageUploader();if(!z){_("colorsFound","success",{count:e.availableColors.length});return}let R=new ca(z);await R.load();let{width:$,height:se}=R.getDimensions(),q=R.getPixelData(),ge=0;for(let oe=0;oe<q.length;oe+=4){let Pe=!e.paintTransparentPixels&&q[oe+3]<(e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD),le=!e.paintWhitePixels&&Xe([q[oe],q[oe+1],q[oe+2]]);!Pe&&!le&&ge++}e.imageData={width:$,height:se,pixels:q,totalPixels:ge,processor:R},e.totalPixels=ge,e.paintedPixels=0,e.imageLoaded=!0,e.lastPosition={x:0,y:0},i.initializePaintedMap($,se),e.resizeSettings=null,e.resizeIgnoreMask=null,e.originalImage={dataUrl:z,width:$,height:se},Q();let Ce=await createImageBitmap(R.img);await Le.setImage(Ce),Le.enable(),Se.disabled=!1,Se.classList.add("active"),Se.setAttribute("aria-pressed","true"),e.colorsChecked&&(k.disabled=!1),N.disabled=!1,e.startPosition&&(T.disabled=!1),Oe(),St(),_("imageLoaded","success",{count:ge})}catch{_("imageError","error")}}),k&&k.addEventListener("click",()=>{e.imageLoaded&&e.imageData.processor&&e.colorsChecked?bn(e.imageData.processor):e.colorsChecked||i.showAlert(i.t("uploadImageFirstColors"),"warning")}),P&&P.addEventListener("click",async()=>{if(e.selectingPosition)return;e.selectingPosition=!0,e.startPosition=null,e.region=null,T.disabled=!0,i.showAlert(i.t("selectPositionAlert"),"info"),_("waitingPosition","default");let x=async(R,$)=>{var se;if(typeof R=="string"&&R.includes("https://backend.wplace.live/s0/pixel/")&&((se=$==null?void 0:$.method)==null?void 0:se.toUpperCase())==="POST")try{let q=await z(R,$),Ce=await q.clone().json();if((Ce==null?void 0:Ce.painted)===1){let oe=R.match(/\/pixel\/(\d+)\/(\d+)/);oe&&oe.length>=3&&(e.region={x:Number.parseInt(oe[1]),y:Number.parseInt(oe[2])});let Pe=JSON.parse($.body);Pe!=null&&Pe.coords&&Array.isArray(Pe.coords)&&(e.startPosition={x:Pe.coords[0],y:Pe.coords[1]},e.lastPosition={x:0,y:0},await Le.setPosition(e.startPosition,e.region),e.imageLoaded&&(T.disabled=!1),window.fetch=z,e.selectingPosition=!1,_("positionSet","success"))}return q}catch{return z(R,$)}return z(R,$)},z=window.fetch;window.fetch=x,setTimeout(()=>{e.selectingPosition&&(window.fetch=z,e.selectingPosition=!1,_("positionTimeout","error"),i.showAlert(i.t("positionTimeout"),"error"))},12e4)});async function vn(){if(!e.imageLoaded||!e.startPosition||!e.region)return _("missingRequirements","error"),!1;if(await Aa(),!Me)return!1;e.running=!0,e.stopFlag=!1,T.disabled=!0,A.disabled=!1,E.disabled=!0,P.disabled=!0,k.disabled=!0,N.disabled=!0,Se.disabled=!0,_("startPaintingMsg","success");try{return await dn(),!0}catch{return _("paintingError","error"),!1}finally{e.running=!1,A.disabled=!0,N.disabled=!1,e.stopFlag?T.disabled=!1:(T.disabled=!0,E.disabled=!1,P.disabled=!1,k.disabled=!1),Se.disabled=!1}}T&&T.addEventListener("click",vn),A&&A.addEventListener("click",()=>{e.stopFlag=!0,e.running=!1,A.disabled=!0,_("paintingStopped","warning"),e.imageLoaded&&e.paintedPixels>0&&(i.saveProgress(),i.showAlert(i.t("autoSaved"),"success"))}),setTimeout(()=>{let x=i.loadProgress();if(x&&x.state.paintedPixels>0){let z=new Date(x.timestamp).toLocaleString(),R=Math.round(x.state.paintedPixels/x.state.totalPixels*100);i.showAlert(`${i.t("savedDataFound")}

Saved: ${z}
Progress: ${x.state.paintedPixels}/${x.state.totalPixels} pixels (${R}%)
${i.t("clickLoadToContinue")}`,"info")}},1e3),Re&&$e&&Re.addEventListener("input",x=>{let z=parseInt(x.target.value);e.cooldownChargeThreshold=z,$e.textContent=z,Q(),je.resetEdgeTracking()}),hn(),je.syncFromState()}async function dn(){let{width:t,height:a,pixels:n}=e.imageData,{x:o,y:r}=e.startPosition,{x:l,y:s}=e.region,d=e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD,m=(k,P)=>{let A=dt({data:n,width:t,height:a},k,P);return!(!A||!e.paintTransparentPixels&&Bt(A,d)||!e.paintWhitePixels&&Xe([A[0],A[1],A[2]]))},p=0,w=0,h=!1,S=0,v=Math.max(0,Math.min(e.paintedPixels||0,t*a));for(let k=0;k<a&&!h;k++)for(let P=0;P<t;P++)if(m(P,k)){if(S===v){p=k,w=P,h=!0;break}S++}h||(p=a,w=0);let u=null,E={transparent:0,white:0,alreadyPainted:0};try{e:for(let k=p;k<a;k++)for(let P=k===p?w:0;P<t;P++){if(e.stopFlag){u&&u.pixels.length>0&&(console.log(`\u{1F3AF} Sending final batch before stop with ${u.pixels.length} pixels`),await $t(u.pixels,u.regionX,u.regionY)&&(u.pixels.forEach(()=>{e.paintedPixels++}),e.currentCharges-=u.pixels.length,Oe())),e.lastPosition={x:P,y:k},_("paintingPaused","warning",{x:P,y:k});break e}let T=(k*t+P)*4,A=n[T],N=n[T+1],ee=n[T+2],de=n[T+3],ye=e.customTransparencyThreshold||g.TRANSPARENCY_THRESHOLD;if(!e.paintTransparentPixels&&de<ye||!e.paintWhitePixels&&Xe([A,N,ee])){!e.paintTransparentPixels&&de<ye?E.transparent++:E.white++;continue}let pe;Xe([A,N,ee])?pe=[255,255,255]:pe=i.findClosestPaletteColor(A,N,ee,e.activeColorPalette);let Ne=Rt([A,N,ee],e.availableColors),xe=o+P,Se=r+k,{regionX:Te,regionY:ot,pixelX:ft,pixelY:Ke}=Qa(xe,Se);if(!u||u.regionX!==l+Te||u.regionY!==s+ot){if(u&&u.pixels.length>0)if(console.log(`\u{1F30D} Sending region-change batch with ${u.pixels.length} pixels (switching to region ${l+Te},${s+ot})`),await $t(u.pixels,u.regionX,u.regionY)){if(u.pixels.forEach(Re=>{e.paintedPixels++,i.markPixelPainted(Re.x,Re.y,u.regionX,u.regionY)}),e.currentCharges-=u.pixels.length,_("paintingProgress","default",{painted:e.paintedPixels,total:e.totalPixels}),i.performSmartSave(),g.PAINTING_SPEED_ENABLED&&e.paintingSpeed>0&&u.pixels.length>0){let Re=Math.max(1,100/e.paintingSpeed),$e=Math.max(100,Re*u.pixels.length);await i.sleep($e)}Oe()}else{console.error("\u274C Batch failed permanently after retries. Stopping painting."),e.stopFlag=!0;break e}u={regionX:l+Te,regionY:s+ot,pixels:[]}}try{let Be=u?u.regionX:l+Te,Re=u?u.regionY:s+ot,$e=[l+Te,s+ot],bt=await Le.getTilePixelColor($e[0],$e[1],ft,Ke).catch(()=>null);if(bt&&Array.isArray(bt)){let[vt,Ht,Tt]=bt;if(Rt([vt,Ht,Tt],e.availableColors)===Ne){E.alreadyPainted++,console.log(`Skipped already painted pixel at (${ft}, ${Ke})`);continue}}}catch{}u.pixels.push({x:ft,y:Ke,color:Ne,localX:P,localY:k});let wt=pn();if(u.pixels.length>=wt){let Be=e.batchMode==="random"?`random (${e.randomBatchMin}-${e.randomBatchMax})`:"normal";if(console.log(`\u{1F4E6} Sending batch with ${u.pixels.length} pixels (mode: ${Be}, target: ${wt})`),await $t(u.pixels,u.regionX,u.regionY)){if(u.pixels.forEach($e=>{e.paintedPixels++,i.markPixelPainted($e.x,$e.y,u.regionX,u.regionY)}),e.currentCharges-=u.pixels.length,Oe(),_("paintingProgress","default",{painted:e.paintedPixels,total:e.totalPixels}),i.performSmartSave(),g.PAINTING_SPEED_ENABLED&&e.paintingSpeed>0&&u.pixels.length>0){let $e=1e3/e.paintingSpeed,bt=Math.max(100,$e*u.pixels.length);await i.sleep(bt)}}else{console.error("\u274C Batch failed permanently after retries. Stopping painting."),e.stopFlag=!0;break e}u.pixels=[]}for(;e.currentCharges<e.cooldownChargeThreshold&&!e.stopFlag;){let{charges:Be,cooldown:Re}=await da.getCharges();if(e.currentCharges=Math.floor(Be),e.cooldown=Re,e.currentCharges>=e.cooldownChargeThreshold){je.maybeNotifyChargesReached(!0),Oe();break}saveBtn.disabled=!1,_("noChargesThreshold","warning",{time:i.formatTime(e.cooldown),threshold:e.cooldownChargeThreshold,current:e.currentCharges}),await Oe(),i.performSmartSave(),await i.sleep(e.cooldown)}if(e.stopFlag||(saveBtn.disabled=!0),e.stopFlag)break e}if(u&&u.pixels.length>0&&!e.stopFlag)if(console.log(`\u{1F3C1} Sending final batch with ${u.pixels.length} pixels`),await $t(u.pixels,u.regionX,u.regionY)){if(u.pixels.forEach(P=>{e.paintedPixels++,i.markPixelPainted(P.x,P.y,u.regionX,u.regionY)}),e.currentCharges-=u.pixels.length,i.saveProgress(),g.PAINTING_SPEED_ENABLED&&e.paintingSpeed>0&&u.pixels.length>0){let P=1e3/e.paintingSpeed,T=Math.max(100,P*u.pixels.length);await i.sleep(T)}}else console.warn(`\u26A0\uFE0F Final batch failed with ${u.pixels.length} pixels after all retries.`)}finally{window._chargesInterval&&clearInterval(window._chargesInterval),window._chargesInterval=null}if(e.stopFlag)_("paintingStopped","warning"),i.saveProgress();else{_("paintingComplete","success",{count:e.paintedPixels}),e.lastPosition={x:0,y:0},i.saveProgress(),Le.clear();let k=document.getElementById("toggleOverlayBtn");k&&(k.classList.remove("active"),k.disabled=!0)}console.log("\u{1F4CA} Pixel Statistics:"),console.log(`   Painted: ${e.paintedPixels}`),console.log(`   Skipped - Transparent: ${E.transparent}`),console.log(`   Skipped - White (disabled): ${E.white}`),console.log(`   Skipped - Already painted: ${E.alreadyPainted}`),console.log(`   Total processed: ${e.paintedPixels+E.transparent+E.white+E.alreadyPainted}`),Oe()}function pn(){let t;if(e.batchMode==="random"){let o=Math.max(1,e.randomBatchMin),r=Math.max(o,e.randomBatchMax);t=Math.floor(Math.random()*(r-o+1))+o,console.log(`\u{1F3B2} Random batch size generated: ${t} (range: ${o}-${r})`)}else t=e.paintingSpeed;let a=Math.floor(e.currentCharges);return Math.min(t,a)}async function $t(t,a,n,o=Ia){let r=0;for(;r<o&&!e.stopFlag;){r++,console.log(`\u{1F504} Attempting to send batch (attempt ${r}/${o}) for region ${a},${n} with ${t.length} pixels`);let l=await gn(t,a,n);if(l===!0)return console.log(`\u2705 Batch succeeded on attempt ${r}`),!0;if(l==="token_error"){console.log(`\u{1F511} Token error on attempt ${r}, regenerating...`),_("captchaSolving","warning");try{await pa(),r--;continue}catch(s){console.error(`\u274C Token regeneration failed on attempt ${r}:`,s),_("captchaFailed","error"),await i.sleep(5e3)}}else{console.warn(`\u26A0\uFE0F Batch failed on attempt ${r}, retrying...`);let s=Math.min(1e3*Math.pow(2,r-1),3e4),d=Math.random()*1e3;await i.sleep(s+d)}}return r>=o&&(console.error(`\u274C Batch failed after ${o} attempts (MAX_BATCH_RETRIES=${Ia}). This will stop painting to prevent infinite loops.`),_("paintingError","error")),!1}async function gn(t,a,n){let o=Me;if(!o)try{console.log("\u{1F511} Generating Turnstile token for pixel batch..."),o=await pa(),Me=o}catch(s){return console.error("\u274C Failed to generate Turnstile token:",s),mt=new Promise(d=>{qe=d}),"token_error"}let r=new Array(t.length*2),l=new Array(t.length);for(let s=0;s<t.length;s++){let d=t[s];r[s*2]=d.x,r[s*2+1]=d.y,l[s]=d.color}try{let s={coords:r,colors:l,t:o},d=await fetch(`https://backend.wplace.live/s0/pixel/${a}/${n}`,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},credentials:"include",body:JSON.stringify(s)});if(d.status===403){let p=null;try{p=await d.json()}catch{}console.error("\u274C 403 Forbidden. Turnstile token might be invalid or expired.");try{console.log("\u{1F504} Regenerating Turnstile token after 403..."),o=await pa(),Me=o;let w={coords:r,colors:l,t:o},h=await fetch(`https://backend.wplace.live/s0/pixel/${a}/${n}`,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},credentials:"include",body:JSON.stringify(w)});if(h.status===403)return Me=null,mt=new Promise(v=>{qe=v}),"token_error";let S=await h.json();return(S==null?void 0:S.painted)===t.length}catch(w){return console.error("\u274C Token regeneration failed:",w),Me=null,mt=new Promise(h=>{qe=h}),"token_error"}}let m=await d.json();return(m==null?void 0:m.painted)===t.length}catch(s){return console.error("Batch paint request failed:",s),!1}}function Q(){var t,a;try{let n={paintingSpeed:e.paintingSpeed,paintingSpeedEnabled:(t=document.getElementById("enableSpeedToggle"))==null?void 0:t.checked,batchMode:e.batchMode,randomBatchMin:e.randomBatchMin,randomBatchMax:e.randomBatchMax,cooldownChargeThreshold:e.cooldownChargeThreshold,tokenSource:e.tokenSource,minimized:e.minimized,overlayOpacity:e.overlayOpacity,blueMarbleEnabled:(a=document.getElementById("enableBlueMarbleToggle"))==null?void 0:a.checked,ditheringEnabled:e.ditheringEnabled,colorMatchingAlgorithm:e.colorMatchingAlgorithm,enableChromaPenalty:e.enableChromaPenalty,chromaPenaltyWeight:e.chromaPenaltyWeight,customTransparencyThreshold:e.customTransparencyThreshold,customWhiteThreshold:e.customWhiteThreshold,paintWhitePixels:e.paintWhitePixels,paintTransparentPixels:e.paintTransparentPixels,resizeSettings:e.resizeSettings,originalImage:e.originalImage,resizeIgnoreMask:e.resizeIgnoreMask&&e.resizeSettings&&e.resizeSettings.width*e.resizeSettings.height===e.resizeIgnoreMask.length?{w:e.resizeSettings.width,h:e.resizeSettings.height,data:btoa(String.fromCharCode(...e.resizeIgnoreMask))}:null,notificationsEnabled:e.notificationsEnabled,notifyOnChargesReached:e.notifyOnChargesReached,notifyOnlyWhenUnfocused:e.notifyOnlyWhenUnfocused,notificationIntervalMinutes:e.notificationIntervalMinutes};g.PAINTING_SPEED_ENABLED=n.paintingSpeedEnabled,localStorage.setItem("wplace-bot-settings",JSON.stringify(n))}catch(n){console.warn("Could not save bot settings:",n)}}function hn(){try{let t=localStorage.getItem("wplace-bot-settings");if(!t)return;let a=JSON.parse(t);if(e.paintingSpeed=a.paintingSpeed||g.PAINTING_SPEED.DEFAULT,e.batchMode=a.batchMode||g.BATCH_MODE,e.randomBatchMin=a.randomBatchMin||g.RANDOM_BATCH_RANGE.MIN,e.randomBatchMax=a.randomBatchMax||g.RANDOM_BATCH_RANGE.MAX,e.cooldownChargeThreshold=a.cooldownChargeThreshold||g.COOLDOWN_CHARGE_THRESHOLD,e.tokenSource=a.tokenSource||g.TOKEN_SOURCE,e.minimized=a.minimized??!1,g.PAINTING_SPEED_ENABLED=a.paintingSpeedEnabled??!1,g.AUTO_CAPTCHA_ENABLED=a.autoCaptchaEnabled??!1,e.overlayOpacity=a.overlayOpacity??g.OVERLAY.OPACITY_DEFAULT,e.blueMarbleEnabled=a.blueMarbleEnabled??g.OVERLAY.BLUE_MARBLE_DEFAULT,e.ditheringEnabled=a.ditheringEnabled??!1,e.colorMatchingAlgorithm=a.colorMatchingAlgorithm||"lab",e.enableChromaPenalty=a.enableChromaPenalty??!0,e.chromaPenaltyWeight=a.chromaPenaltyWeight??.15,e.customTransparencyThreshold=a.customTransparencyThreshold??g.TRANSPARENCY_THRESHOLD,e.customWhiteThreshold=a.customWhiteThreshold??g.WHITE_THRESHOLD,e.paintWhitePixels=a.paintWhitePixels??!0,e.paintTransparentPixels=a.paintTransparentPixels??!1,e.resizeSettings=a.resizeSettings??null,e.originalImage=a.originalImage??null,e.notificationsEnabled=a.notificationsEnabled??g.NOTIFICATIONS.ENABLED,e.notifyOnChargesReached=a.notifyOnChargesReached??g.NOTIFICATIONS.ON_CHARGES_REACHED,e.notifyOnlyWhenUnfocused=a.notifyOnlyWhenUnfocused??g.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED,e.notificationIntervalMinutes=a.notificationIntervalMinutes??g.NOTIFICATIONS.REPEAT_MINUTES,a.resizeIgnoreMask&&a.resizeIgnoreMask.data&&e.resizeSettings&&a.resizeIgnoreMask.w===e.resizeSettings.width&&a.resizeIgnoreMask.h===e.resizeSettings.height)try{let xe=atob(a.resizeIgnoreMask.data),Se=new Uint8Array(xe.length);for(let Te=0;Te<xe.length;Te++)Se[Te]=xe.charCodeAt(Te);e.resizeIgnoreMask=Se}catch{e.resizeIgnoreMask=null}else e.resizeIgnoreMask=null;let n=document.getElementById("speedSlider");n&&(n.value=e.paintingSpeed);let o=document.getElementById("speedValue");o&&(o.textContent=`${e.paintingSpeed} (batch size)`);let r=document.getElementById("enableSpeedToggle");r&&(r.checked=g.PAINTING_SPEED_ENABLED);let l=document.getElementById("batchModeSelect");l&&(l.value=e.batchMode);let s=document.getElementById("normalBatchControls"),d=document.getElementById("randomBatchControls");s&&d&&(e.batchMode==="random"?(s.style.display="none",d.style.display="block"):(s.style.display="block",d.style.display="none"));let m=document.getElementById("randomBatchMin");m&&(m.value=e.randomBatchMin);let p=document.getElementById("randomBatchMax");p&&(p.value=e.randomBatchMax);let w=document.getElementById("cooldownSlider");w&&(w.value=e.cooldownChargeThreshold);let h=document.getElementById("cooldownValue");h&&(h.textContent=e.cooldownChargeThreshold);let S=document.getElementById("overlayOpacitySlider");S&&(S.value=e.overlayOpacity);let v=document.getElementById("overlayOpacityValue");v&&(v.textContent=`${Math.round(e.overlayOpacity*100)}%`);let u=document.getElementById("enableBlueMarbleToggle");u&&(u.checked=e.blueMarbleEnabled);let E=document.getElementById("tokenSourceSelect");E&&(E.value=e.tokenSource);let k=document.getElementById("colorAlgorithmSelect");k&&(k.value=e.colorMatchingAlgorithm);let P=document.getElementById("enableChromaPenaltyToggle");P&&(P.checked=e.enableChromaPenalty);let T=document.getElementById("chromaPenaltyWeightSlider");T&&(T.value=e.chromaPenaltyWeight);let A=document.getElementById("chromaWeightValue");A&&(A.textContent=e.chromaPenaltyWeight);let N=document.getElementById("transparencyThresholdInput");N&&(N.value=e.customTransparencyThreshold);let ee=document.getElementById("whiteThresholdInput");ee&&(ee.value=e.customWhiteThreshold);let de=document.getElementById("notifEnabledToggle");de&&(de.checked=e.notificationsEnabled);let ye=document.getElementById("notifOnChargesToggle");ye&&(ye.checked=e.notifyOnChargesReached);let pe=document.getElementById("notifOnlyUnfocusedToggle");pe&&(pe.checked=e.notifyOnlyWhenUnfocused);let Ne=document.getElementById("notifIntervalInput");Ne&&(Ne.value=e.notificationIntervalMinutes),je.resetEdgeTracking()}catch(t){console.warn("Could not load bot settings:",t)}}console.log("\u{1F680} WPlace Auto-Image with Turnstile Token Generator loaded"),console.log("\u{1F511} Turnstile token generator: ALWAYS ENABLED (Background mode)"),console.log("\u{1F3AF} Manual pixel captcha solving: Available as fallback/alternative"),console.log("\u{1F4F1} Turnstile widgets: DISABLED - pure background token generation only!");function Wt(){e.initialSetupComplete=!0;let t=document.querySelector("#loadBtn"),a=document.querySelector("#loadFromFileBtn"),n=document.querySelector("#uploadBtn");t&&(t.disabled=!1,t.title="",t.style.animation="pulse 0.6s ease-in-out",setTimeout(()=>{t&&(t.style.animation="")},600),console.log("\u2705 Load Progress button enabled after initial setup")),a&&(a.disabled=!1,a.title="",a.style.animation="pulse 0.6s ease-in-out",setTimeout(()=>{a&&(a.style.animation="")},600),console.log("\u2705 Load from File button enabled after initial setup")),n&&(n.disabled=!1,n.title="",n.style.animation="pulse 0.6s ease-in-out",setTimeout(()=>{n&&(n.style.animation="")},600),console.log("\u2705 Upload Image button enabled after initial setup")),i.showAlert(i.t("fileOperationsAvailable"),"success")}async function un(){if(la()){console.log("\u2705 Valid token already available, skipping initialization"),_("tokenReady","success"),Wt();return}try{console.log("\u{1F527} Initializing Turnstile token generator..."),_("initializingToken","default"),console.log("Attempting to load Turnstile script..."),await i.loadTurnstile(),console.log("Turnstile script loaded. Attempting to generate token...");let t=await Ma();t?(Nt(t),console.log("\u2705 Startup token generated successfully"),_("tokenReady","success"),i.showAlert(i.t("tokenGeneratorReady"),"success"),Wt()):(console.warn("\u26A0\uFE0F Startup token generation failed (no token received), will retry when needed"),_("tokenRetryLater","warning"),Wt())}catch(t){console.error("\u274C Critical error during Turnstile initialization:",t),_("tokenRetryLater","warning"),Wt()}}pt(),te(),ga().then(()=>{setTimeout(un,1e3),setTimeout(()=>{let a=document.getElementById("chromaPenaltyWeightSlider"),n=document.getElementById("chromaWeightValue"),o=document.getElementById("resetAdvancedColorBtn"),r=document.getElementById("colorAlgorithmSelect"),l=document.getElementById("enableChromaPenaltyToggle"),s=document.getElementById("transparencyThresholdInput"),d=document.getElementById("whiteThresholdInput"),m=document.getElementById("enableDitheringToggle");r&&r.addEventListener("change",p=>{e.colorMatchingAlgorithm=p.target.value,Q(),J()}),l&&l.addEventListener("change",p=>{e.enableChromaPenalty=p.target.checked,Q(),J()}),a&&n&&a.addEventListener("input",p=>{e.chromaPenaltyWeight=parseFloat(p.target.value)||.15,n.textContent=e.chromaPenaltyWeight.toFixed(2),Q(),J()}),s&&s.addEventListener("change",p=>{let w=parseInt(p.target.value,10);!isNaN(w)&&w>=0&&w<=255&&(e.customTransparencyThreshold=w,g.TRANSPARENCY_THRESHOLD=w,Q(),J())}),d&&d.addEventListener("change",p=>{let w=parseInt(p.target.value,10);!isNaN(w)&&w>=200&&w<=255&&(e.customWhiteThreshold=w,g.WHITE_THRESHOLD=w,Q(),J())}),m&&m.addEventListener("change",p=>{e.ditheringEnabled=p.target.checked,Q(),J()}),o&&o.addEventListener("click",()=>{e.colorMatchingAlgorithm="lab",e.enableChromaPenalty=!0,e.chromaPenaltyWeight=.15,e.customTransparencyThreshold=g.TRANSPARENCY_THRESHOLD=100,e.customWhiteThreshold=g.WHITE_THRESHOLD=250,Q();let p=document.getElementById("colorAlgorithmSelect");p&&(p.value="lab");let w=document.getElementById("enableChromaPenaltyToggle");w&&(w.checked=!0),a&&(a.value=.15),n&&(n.textContent="0.15"),s&&(s.value=100),d&&(d.value=250),J(),i.showAlert(i.t("advancedColorSettingsReset"),"success")})},500),window.addEventListener("beforeunload",()=>{i.cleanupTurnstile()})})})();})();
