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


(()=>{var Ya=`/* WPlace Auto-Image Bot - Unified CSS Styles (decoupled from JS)
   Why: bring external CSS in-sync with the UI that Auto-Image.js renders,
   fix layout (positions, widths, z-index), and ensure class names match JS
   (e.g., .wplace-dragging) so buttons and panels behave correctly. */

/* ========================= */
/* Theme tokens (CSS vars)   */
/* ========================= */

/* Import theme files - classic is default */
@import url('https://wplace-autobot.github.io/WPlace-AutoBOT/main/themes/classic.css');
@import url('https://wplace-autobot.github.io/WPlace-AutoBOT/main/themes/classic-light.css');
@import url('https://wplace-autobot.github.io/WPlace-AutoBOT/main/themes/neon.css');

/* Default :root CSS variables for 100% classic theme compliance */
/* These ensure the bot works perfectly even if theme files fail to load */
:root {
  /* Classic theme colors - exact upstream main values */
  --wplace-primary: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  --wplace-secondary: linear-gradient(135deg, #111 0%, #2a2a2a 100%);
  --wplace-accent: #222;
  --wplace-text: #fff;
  --wplace-highlight: #775ce3;
  --wplace-highlight-secondary: #d3a4ff;
  --wplace-success: #0f0;
  --wplace-error: #f00;
  --wplace-warning: #fa0;

  /* UI properties */
  --wplace-radius: 12px;
  --wplace-btn-radius: 16px;
  --wplace-border-style: solid;
  --wplace-border-width: 1px;
  --wplace-border-color: #222;
  --wplace-shadow: 0 8px 32px rgb(0 0 0 / 60%), 0 0 0 1px rgb(255 255 255 / 10%);
  --wplace-backdrop: blur(10px);
  --wplace-font: 'Segoe UI', roboto, sans-serif;

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
  --wplace-muted-text: #fffb;

  /* Text variants */
  --wplace-text-secondary: rgb(255 255 255 / 90%);
  --wplace-text-muted: rgb(255 255 255 / 70%);
  --wplace-text-dim: rgb(255 255 255 / 60%);
  --wplace-text-faded: rgb(255 255 255 / 80%);

  /* Background variants */
  --wplace-bg-input: rgb(255 255 255 / 15%);
  --wplace-bg-subtle: rgb(255 255 255 / 10%);
  --wplace-bg-faint: rgb(255 255 255 / 8%);
  --wplace-bg-ghost: rgb(255 255 255 / 6%);
  --wplace-bg-whisper: rgb(255 255 255 / 5%);

  /* Border variants */
  --wplace-border-subtle: rgb(255 255 255 / 20%);
  --wplace-border-faint: rgb(255 255 255 / 15%);
  --wplace-border-ghost: rgb(255 255 255 / 10%);
  --wplace-border-ultra-faint: rgb(255 255 255 / 5%);

  /* Shadow variants */
  --wplace-shadow-drag: 0 12px 40px rgb(0 0 0 / 80%), 0 0 0 2px rgb(255 255 255 / 20%);
  --wplace-shadow-notification: 0 4px 12px rgb(0 0 0 / 30%);
  --wplace-shadow-slider-thumb: 0 3px 6px rgb(0 0 0 / 30%), 0 0 0 2px var(--wplace-icon-primary);
  --wplace-shadow-slider-hover: 0 4px 8px rgb(0 0 0 / 40%), 0 0 0 3px var(--wplace-icon-primary);

  /* Animation colors */
  --wplace-pulse-start: rgb(0 255 0 / 70%);
  --wplace-pulse-mid: rgb(0 255 0 / 0%);
  --wplace-pulse-end: rgb(0 255 0 / 0%);

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
@keyframes neon-glow {
  0%,
  100% {
    text-shadow:
      0 0 5px currentcolor,
      0 0 10px currentcolor,
      0 0 15px currentcolor;
  }

  50% {
    text-shadow:
      0 0 2px currentcolor,
      0 0 5px currentcolor,
      0 0 8px currentcolor;
  }
}

@keyframes pixel-blink {
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

@keyframes slide-in {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
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
  animation: slide-in 0.4s ease-out;
  overflow: hidden auto;
  transition: all 0.3s ease;
  user-select: none;

  /* Default classic theme styling for 100% compliance */
  background: var(--wplace-primary);
  color: var(--wplace-text);
  border-radius: var(--wplace-radius);
  box-shadow: var(--wplace-shadow);
  font-family: var(--wplace-font);
  backdrop-filter: var(--wplace-backdrop);
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
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
  left: 310px;
  width: 230px;
  max-height: calc(100vh - 40px);
  padding: 0;
  z-index: 9997;
  animation: slide-in 0.4s ease-out;
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
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
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
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
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
  background: rgb(255 255 255 / 10%);
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
  margin-bottom: 6px;
  padding: 8px;

  /* Theme-specific styling applied via theme files */
}

.wplace-section {
  margin-bottom: 6px;
  padding: 8px;

  /* Theme-specific styling applied via theme files */
}

.wplace-section-title {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;

  /* Theme-specific styling applied via theme files */
}

.wplace-section-title i.arrow {
  transition: transform 0.3s ease;
}

.wplace-section.collapsed .wplace-section-title i.arrow {
  transform: rotate(-90deg);
}

/* ========================= */
/* Controls and buttons      */
/* ========================= */
.wplace-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wplace-cooldown-control {
  margin-top: 8px;
}

.wplace-section.collapsed .wplace-controls,
.wplace-section.collapsed .wplace-cooldown-control {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
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

.wplace-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;

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

.wplace-btn:disabled::before {
  display: none;
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
  inset: 0;
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
  image-rendering: -moz-crisp-edges;
  image-rendering: pixelated;
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

/* Missing button hover styles */
.resize-tools button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--wplace-border-subtle);
  background: var(--wplace-bg-ghost);
  color: var(--wplace-text);
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
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.resize-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
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
  padding: 0;
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
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
}

#wplace-settings-container.show {
  display: block;
  animation: settings-slide-in 0.4s ease-out;
}

@keyframes settings-slide-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes settings-fade-out {
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


.wplace-speed-slider {
  flex: 1;
  height: 8px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
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
  animation: slide-down 0.3s ease-out;
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
@media (width <= 768px) {
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
/* Settings container variants (optional) */
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
  max-height: 100vh;
  overflow-y: auto;
  animation: slide-in 0.3s ease-out;
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
  padding: 25px 25px 0;
  max-height: 67vh;
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
  margin: 8px 0 0;
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

.wplace-settings-number-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--wplace-bg-input);
  color: var(--wplace-text);
  border: 1px solid var(--wplace-border-subtle);
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}

.wplace-random-batch-description {
  font-size: 11px;
  color: var(--wplace-text-dim);
  margin: 8px 0 0;
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
  background: var(--wplace-accent);
  color: var(--wplace-text);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
}

.wplace-overlay-opacity-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  outline: none;
  cursor: pointer;
}

.wplace-settings-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.wplace-settings-toggle-title {
  font-weight: 500;
}

.wplace-settings-toggle-description {
  font-size: 12px;
  margin: 4px 0 0;
  color: var(--wplace-muted-text);
}

.wplace-settings-checkbox {
  cursor: pointer;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  accent-color: var(--wplace-highlight);
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
  padding: 20px;
  position: sticky;
  bottom: 0;
  background: var(--wplace-secondary);
}

/* Settings select option styling moved to theme files */
/* Settings description styling moved to theme files */

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

/* ===================================== */
/* Resize Dialog Styles                 */
/* ===================================== */

/* Resize dialog title */
.resize-dialog-title {
  margin-top: 0;
  color: var(--wplace-text);
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
  background: linear-gradient(135deg, var(--wplace-danger), var(--wplace-danger-dark));
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
  background: rgb(34 34 34 / 40%);
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
  background: rgb(255 0 0 / 40%);
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


/* Additional precision fixes for exact upstream main matching */
/* Status default styling moved to theme files */

/* Duplicate settings section removed - all settings styling moved to theme files */

/* Settings header styling moved to theme files */
/* All remaining settings styling moved to theme files */


/* Icon styling moved to theme files */
.wplace-icon-eye {
  font-size: 16px;
}

/* Overlay Settings Controls */
.wplace-overlay-opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
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

/* Coordinate Generation Controls */
.wplace-icon-route {
  color: var(--wplace-icon-primary);
  font-size: 16px;
}

.wplace-icon-table {
  color: var(--wplace-icon-palette);
  margin-right: 6px;
}

.wplace-icon-compass {
  color: var(--wplace-icon-secondary);
  margin-right: 6px;
}

/* Pixel Filter Controls */
.wplace-pixel-filter-controls {
  padding: 18px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Theme-specific styling applied via theme files */
}

/* Snake Pattern Controls */
.wplace-snake-pattern-controls {
  padding: 18px;
  margin-bottom: 15px;

  /* Theme-specific styling applied via theme files */
}

/* Block Size Controls */
.wplace-block-size-controls {
  padding: 18px;
  margin-bottom: 15px;

  /* Theme-specific styling applied via theme files */
}

.wplace-block-size-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.wplace-block-size-label {
  display: block;
  color: var(--wplace-text-faded);
  font-size: 12px;
  margin-bottom: 8px;
}

.wplace-icon-width {
  color: var(--wplace-icon-primary);
  margin-right: 4px;
}

.wplace-icon-height {
  color: var(--wplace-icon-secondary);
  margin-right: 4px;
}

.wplace-block-size-description {
  font-size: 11px;
  color: var(--wplace-text-dim);
  margin: 8px 0 0;
  text-align: center;
}

/* Random Block Controls */
.wplace-shuffle-block-size-controls {
  display: none;
}

/* Batch Mode Controls */
.wplace-mode-selection {
  margin-bottom: 15px;
}

.wplace-mode-label {
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
`,Ut={"classic-light":`/* WPlace Auto-Image Bot - Classic Light Theme */

/* Clean, bright theme based on classic design with light backgrounds */

.wplace-theme-classic-light {
  /* === CORE COLORS === */
  --wplace-primary: #fff;           /* Clean white */
  --wplace-secondary: #f8f9fa;         /* Light gray */
  --wplace-accent: #e9ecef;            /* Lighter gray */
  --wplace-text: #212529;              /* Dark text */
  --wplace-highlight: #6f42c1;         /* Purple highlight */
  --wplace-success: #28a745;           /* Bootstrap green */
  --wplace-error: #dc3545;             /* Bootstrap red */
  --wplace-warning: #ffc107;           /* Bootstrap yellow */

  /* === UI PROPERTIES === */
  --wplace-radius: 8px;
  --wplace-btn-radius: 12px;
  --wplace-border-style: solid;
  --wplace-border-width: 1px;
  --wplace-border-color: #415a77;
  --wplace-shadow: 0 8px 32px rgb(0 0 0 / 15%), 0 0 0 1px rgb(0 0 0 / 8%);
  --wplace-backdrop: blur(10px);
  --wplace-font: 'Segoe UI', roboto, sans-serif;

  /* === EXTENDED COLOR PALETTE === */

  /* Icon colors */
  --wplace-icon-primary: #4facfe;      /* Light blue */
  --wplace-icon-secondary: #00f2fe;    /* Cyan */
  --wplace-icon-palette: #f093fb;      /* Pink */
  
  /* Additional UI colors */
  --wplace-danger: #dc3545;            /* Bootstrap red */
  --wplace-danger-dark: #c82333;       /* Darker red */
  --wplace-muted-text: rgb(33 37 41 / 70%);
  --wplace-highlight-secondary: #d3a4ff;
  
  /* Text variants */
  --wplace-text-secondary: rgb(33 37 41 / 90%);
  --wplace-text-muted: rgb(33 37 41 / 70%);
  --wplace-text-dim: rgb(33 37 41 / 60%);
  --wplace-text-faded: rgb(33 37 41 / 80%);

  /* Background variants */
  --wplace-bg-input:     #f3f3f3; /* neutral-100 */
  --wplace-bg-subtle:    #f3f3f3; /* neutral-100 \u2014 hover */
  --wplace-bg-faint:     #e0e0e0; /* neutral-200 */
  --wplace-bg-ghost:     #d1d1d1; /* neutral-300 */
  --wplace-bg-whisper:   #e0e0e0; /* can be used as whisper on hover */

  /* Border variants */
  --wplace-border-subtle:      #d1d1d1; /* neutral-300 */
  --wplace-border-faint:       #e0e0e0; /* neutral-200 */
  --wplace-border-ghost:       #e0e0e0; /* neutral-200 */
  --wplace-border-ultra-faint: #e0e0e0; /* neutral-200 \u2014 very faint */
  
  /* Shadow variants */
  --wplace-shadow-drag: 0 12px 40px rgb(0 0 0 / 20%), 0 0 0 2px rgb(111 66 193 / 30%);
  --wplace-shadow-notification: 0 4px 12px rgb(0 0 0 / 15%);
  --wplace-shadow-slider-thumb: 0 3px 6px rgb(0 0 0 / 20%), 0 0 0 2px var(--wplace-icon-primary);
  --wplace-shadow-slider-hover: 0 4px 8px rgb(0 0 0 / 25%), 0 0 0 3px var(--wplace-icon-primary);
  
  /* Animation colors */
  --wplace-pulse-start: rgb(40 167 69 / 70%);
  --wplace-pulse-mid: rgb(40 167 69 / 0%);
  --wplace-pulse-end: rgb(40 167 69 / 0%);
  
  /* Slider colors */
  --wplace-slider-thumb-bg: #6f42c1;
  --wplace-slider-track-bg: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
}

/* === COMPONENT STYLING === */

/* Main container with clean light styling */
.wplace-theme-classic-light #wplace-image-bot-container {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%) !important;
  color: var(--wplace-text) !important;
  border: 1px solid rgb(0 0 0 / 15%) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgb(0 0 0 / 15%), 0 0 0 1px rgb(0 0 0 / 8%) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  backdrop-filter: blur(10px) !important;
}


/* Stats container with proper contrast */
.wplace-theme-classic-light #wplace-stats-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgb(0 0 0 / 15%) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  color: var(--wplace-text) !important;
  position: fixed !important;
  overflow: hidden !important;
  z-index: 9998 !important;
}

/* Headers with light gradient */
.wplace-theme-classic-light .wplace-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: var(--wplace-highlight) !important;
  border-bottom: 1px solid rgb(0 0 0 / 15%) !important;
  text-shadow: none !important;
}

/* Stats header styling */
.wplace-theme-classic-light #wplace-stats-container .wplace-header {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
  color: var(--wplace-text) !important;
  border-bottom: 1px solid rgb(0 0 0 / 20%) !important;
  text-shadow: none !important;
  font-weight: 600 !important;
}

/* Stats title specific styling */
.wplace-theme-classic-light #wplace-stats-container .wplace-header .wplace-stats-title {
  color: var(--wplace-text) !important;
  text-shadow: none !important;
}

/* Comprehensive text and element styling for light theme - scoped to bot containers only */

.wplace-theme-classic-light .wplace-status,
.wplace-theme-classic-light .wplace-stats,
.wplace-theme-classic-light .wplace-section,
.wplace-theme-classic-light .wplace-controls,
.wplace-theme-classic-light .wplace-data-management,
.wplace-theme-classic-light .wplace-cooldown-settings {
  color: var(--wplace-text) !important;
}

/* Buttons with light styling */
.wplace-theme-classic-light .wplace-btn {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  border-radius: 12px !important;
  color: var(--wplace-text) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  font-weight: 500 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Data management section buttons */
.wplace-theme-classic-light .wplace-data-management .wplace-btn {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  color: #212529 !important;
  font-weight: 500 !important;
}

.wplace-theme-classic-light .wplace-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%) !important;
  transform: translateY(-1px) !important;
}

.wplace-theme-classic-light .wplace-data-management .wplace-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%) !important;
}

/* Settings dialog */
.wplace-theme-classic-light #wplace-settings-container {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%) !important;
  border: 1px solid rgb(0 0 0 / 15%) !important;
  border-radius: 12px !important;
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%), 0 0 0 1px rgb(0 0 0 / 8%) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  backdrop-filter: blur(10px) !important;
  color: var(--wplace-text) !important;
}

/* Settings dialog text elements */
.wplace-theme-classic-light .wplace-stat-colors-grid * {
  color: var(--wplace-text) !important;
  font-weight: 500 !important;
}

.wplace-theme-classic-light #wplace-settings-container * {
  color: var(--wplace-text) !important;
}

.wplace-theme-classic-light #wplace-settings-container .wplace-settings-section-wrapper * {
  color: var(--wplace-text) !important;
}

/* Color palette text labels */
.wplace-theme-classic-light .wplace-color-label {
  color: var(--wplace-text) !important;
  font-weight: 500 !important;
  text-shadow: none !important;
}

.wplace-theme-classic-light .wplace-color-name {
  color: var(--wplace-text) !important;
  font-weight: 500 !important;
}

.wplace-theme-classic-light .wplace-color-item-name {
  color: #000 !important;
  font-weight: 600 !important;
  text-shadow: none !important;
}

/* Resize dialog */
.wplace-theme-classic-light .resize-container {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%) !important;
  border: 1px solid rgb(0 0 0 / 15%) !important;
  border-radius: 12px !important;
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%), 0 0 0 1px rgb(0 0 0 / 8%) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  backdrop-filter: blur(10px) !important;
}

/* Settings header */
.wplace-theme-classic-light .wplace-settings-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  border-bottom: 1px solid rgb(0 0 0 / 15%) !important;
}

.wplace-theme-classic-light .wplace-settings-title {
  color: var(--wplace-text) !important;
  text-shadow: none !important;
}

.wplace-theme-classic-light .wplace-settings-close-btn {
  background: rgb(0 0 0 / 5%) !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  border-radius: 50% !important;
  color: var(--wplace-text) !important;
  transition: all 0.3s ease !important;
}

.wplace-theme-classic-light .wplace-settings-close-btn:hover {
  background: rgb(220 53 69 / 10%) !important;
  border-color: var(--wplace-error) !important;
  box-shadow: 0 0 12px rgb(220 53 69 / 30%) !important;
}

/* Section titles */
.wplace-theme-classic-light .wplace-section-title {
  color: var(--wplace-highlight) !important;
  text-shadow: none !important;
  font-weight: 600 !important;
}

/* Button variants with classic light colors */
.wplace-theme-classic-light .wplace-btn-start {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  color: white !important;
  font-weight: 600 !important;
}

.wplace-theme-classic-light .wplace-btn-start:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgb(40 167 69 / 40%) !important;
}

.wplace-theme-classic-light .wplace-btn-stop {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  color: white !important;
  font-weight: 600 !important;
}

.wplace-theme-classic-light .wplace-btn-stop:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgb(220 53 69 / 40%) !important;
}

.wplace-theme-classic-light .wplace-btn-upload {
  background: rgb(111 66 193 / 10%) !important;
  border: 2px dashed var(--wplace-highlight) !important;
  color: var(--wplace-highlight) !important;
}

.wplace-theme-classic-light .wplace-btn-upload:hover:not(:disabled) {
  background: rgb(111 66 193 / 15%) !important;
  box-shadow: 0 4px 12px rgb(111 66 193 / 20%) !important;
}

/* Progress bars with clean light styling */
.wplace-theme-classic-light .wplace-progress {
  background: rgb(0 0 0 / 10%) !important;
  border: 1px solid rgb(0 0 0 / 15%) !important;
  border-radius: 12px !important;
}

.wplace-theme-classic-light .wplace-progress-bar {
  background: linear-gradient(135deg, #6f42c1 0%, #9370db 100%) !important;
  box-shadow: none !important;
}

.wplace-theme-classic-light .wplace-progress-bar::after {
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 30%), transparent) !important;
}

/* Status indicators with light colors */
.wplace-theme-classic-light .status-success {
  background: rgb(40 167 69 / 10%) !important;
  border-color: var(--wplace-success) !important;
  color: var(--wplace-success) !important;
  box-shadow: 0 0 15px rgb(40 167 69 / 20%) !important;
  text-shadow: none !important;
}

.wplace-theme-classic-light .status-error {
  background: rgb(220 53 69 / 10%) !important;
  border-color: var(--wplace-error) !important;
  color: var(--wplace-error) !important;
  box-shadow: 0 0 15px rgb(220 53 69 / 20%) !important;
  text-shadow: none !important;
}

.wplace-theme-classic-light .status-default {
  background: rgb(111 66 193 / 10%) !important;
  border-color: var(--wplace-highlight) !important;
  color: var(--wplace-highlight) !important;
  text-shadow: none !important;
}

.wplace-theme-classic-light .wplace-stat-label {
  color: var(--wplace-text) !important;
  text-shadow: none !important;
  font-weight: 500 !important;
}

.wplace-theme-classic-light .wplace-stat-value {
  color: var(--wplace-highlight) !important;
  text-shadow: none !important;
  font-weight: 600 !important;
}

/* Sections with light styling */
.wplace-theme-classic-light .wplace-section {
  background: rgb(0 0 0 / 3%) !important;
  border: 1px solid rgb(0 0 0 / 10%) !important;
  border-radius: 12px !important;
}

.wplace-theme-classic-light .wplace-status-section {
  background: rgb(0 0 0 / 3%) !important;
  border: 1px solid rgb(0 0 0 / 10%) !important;
  border-radius: 12px !important;
}

.wplace-theme-classic-light .wplace-settings-section-wrapper {
  background: rgb(0 0 0 / 3%) !important;
  border: 1px solid rgb(0 0 0 / 10%) !important;
  border-radius: 12px !important;
}

/* Form controls with light styling */
.wplace-theme-classic-light .wplace-settings-select {
  background: #fff !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  border-radius: 8px !important;
  color: var(--wplace-text) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%) !important;
}

.wplace-theme-classic-light .wplace-settings-select:focus {
  border-color: var(--wplace-highlight) !important;
  box-shadow: 0 0 0 2px rgb(111 66 193 / 30%) !important;
}

/* Dropdown menu options */
.wplace-theme-classic-light .wplace-settings-select option {
  background: #fff !important;
  color: var(--wplace-text) !important;
}

.wplace-theme-classic-light .wplace-settings-option {
  background: #fff !important;
  color: var(--wplace-text) !important;
}

/* Sliders with classic gradient */
.wplace-theme-classic-light .wplace-speed-slider {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;
  border-radius: 4px !important;
}

.wplace-theme-classic-light .wplace-overlay-opacity-slider {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;
  border-radius: 4px !important;
}

.wplace-theme-classic-light .wplace-slider {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;
  border-radius: 4px !important;
}

.wplace-theme-classic-light .wplace-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--wplace-slider-thumb-bg);
  border: 1px solid rgb(0 0 0 / 20%);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
}

.wplace-theme-classic-light .wplace-speed-value {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  border-radius: 8px !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 3px 10px rgb(79 172 254 / 30%) !important;
  border: 1px solid rgb(0 0 0 / 10%) !important;
}

/* Settings labels */
.wplace-theme-classic-light .wplace-settings-section-label {
  color: var(--wplace-highlight) !important;
  text-shadow: none !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
  font-weight: 600 !important;
}

/* Icon colors for classic light theme */
.wplace-theme-classic-light .wplace-icon-key { color: #4facfe; }
.wplace-theme-classic-light .wplace-icon-robot { color: #4facfe; }
.wplace-theme-classic-light .wplace-icon-speed { color: #4facfe; }
.wplace-theme-classic-light .wplace-icon-bell { color: #ffc107; }
.wplace-theme-classic-light .wplace-icon-palette { color: #f093fb; }
.wplace-theme-classic-light .wplace-icon-globe { color: #ffeaa7; }
.wplace-theme-classic-light .wplace-icon-paint { color: #4facfe; }
.wplace-theme-classic-light .wplace-icon-eye { color: #6f42c1; }

/* Clean light theme animations */
@keyframes light-shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(200%);
  }
}

/* Turnstile/CF checkbox overlay - CRITICAL FIX */
.wplace-theme-classic-light .wplace-turnstile-overlay {
  background: rgb(255 255 255 / 98%) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgb(0 0 0 / 30%) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  color: var(--wplace-text) !important;
  font-family: 'Segoe UI', Roboto, sans-serif !important;
}

.wplace-theme-classic-light .wplace-turnstile-title {
  color: var(--wplace-text) !important;
}

.wplace-theme-classic-light .wplace-turnstile-hide-btn {
  color: var(--wplace-text) !important;
  border: 1px solid rgb(0 0 0 / 20%) !important;
  border-radius: 6px !important;
  background: rgb(0 0 0 / 5%) !important;
}

.wplace-theme-classic-light .wplace-turnstile-hide-btn:hover {
  background: rgb(0 0 0 / 10%) !important;
}

/* Color swatches with light styling */
.wplace-theme-classic-light .wplace-color-swatch {
  border: 1px solid rgb(0 0 0 / 20%) !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%) !important;
}

.wplace-theme-classic-light .wplace-color-swatch:hover {
  box-shadow: 0 4px 16px rgb(111 66 193 / 30%) !important;
  transform: translateY(-1px);
}

.wplace-theme-classic-light .wplace-stat-colors-grid {
  background: rgb(0 0 0 / 5%) !important;
  border-radius: 8px !important;
  border: 1px solid rgb(0 0 0 / 10%) !important;
}
`,classic:`/* WPlace Auto-Image Bot - Classic Theme */
/* Clean, modern UI with gradients and subtle effects */

.wplace-theme-classic {
  --wplace-primary: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  --wplace-secondary: linear-gradient(135deg, #111 0%, #2a2a2a 100%);
  --wplace-accent: #222;
  --wplace-text: #fff;
  --wplace-highlight: #775ce3;
  --wplace-success: #0f0;
  --wplace-error: #f00;
  --wplace-warning: #fa0;
  --wplace-radius: 12px;
  --wplace-btn-radius: 16px;
  --wplace-shadow: 0 8px 32px rgb(0 0 0 / 60%), 0 0 0 1px rgb(255 255 255 / 10%);
  --wplace-backdrop: blur(10px);
  --wplace-font: 'Segoe UI', roboto, sans-serif;
  --wplace-scanline: 0;
  --wplace-pixel-blink: 0;

  /* Icon colors */
  --wplace-icon-primary: #4facfe;
  --wplace-icon-secondary: #00f2fe;
  --wplace-icon-palette: #f093fb;
  
  /* Additional UI colors */
  --wplace-danger: #ff6a6a;
  --wplace-danger-dark: #ff4757;
  --wplace-muted-text: #fffB;
  --wplace-highlight-secondary: #d3a4ff;
  
  /* Slider colors */
  --wplace-slider-track-bg: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
}

/* Classic theme container styling */
:root #wplace-image-bot-container,
.wplace-theme-classic #wplace-image-bot-container {
  background: var(--wplace-primary);
  color: var(--wplace-text);
  border-radius: var(--wplace-radius);
  box-shadow: var(--wplace-shadow);
  font-family: var(--wplace-font);
  backdrop-filter: var(--wplace-backdrop);
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
}

:root #wplace-stats-container,
.wplace-theme-classic #wplace-stats-container {
  background: var(--wplace-primary);
  color: var(--wplace-text);
  border-radius: var(--wplace-radius);
  box-shadow: var(--wplace-shadow);
  font-family: var(--wplace-font);
  backdrop-filter: var(--wplace-backdrop);
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
}

:root #wplace-settings-container,
.wplace-theme-classic #wplace-settings-container {
  background: var(--wplace-primary);
  color: var(--wplace-text);
  border-radius: var(--wplace-radius);
  box-shadow: var(--wplace-shadow);
  font-family: var(--wplace-font);
  backdrop-filter: var(--wplace-backdrop);
  border: var(--wplace-border-width) var(--wplace-border-style) var(--wplace-border-color);
}

:root .wplace-header,
.wplace-theme-classic .wplace-header {
  background: var(--wplace-secondary);
  color: var(--wplace-highlight);
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
}

:root .wplace-section-title,
.wplace-theme-classic .wplace-section-title {
  color: var(--wplace-highlight);
}

:root .wplace-stat-value,
.wplace-theme-classic .wplace-stat-value {
  color: var(--wplace-highlight);
}

:root .wplace-status-section,
.wplace-theme-classic .wplace-status-section {
  border-radius: var(--wplace-radius);
  background: rgb(255 255 255 / 3%);
  border: 1px solid rgb(255 255 255 / 10%);
}

:root .wplace-section,
.wplace-theme-classic .wplace-section {
  border-radius: var(--wplace-radius);
  background: rgb(255 255 255 / 3%);
}

:root .wplace-stats,
.wplace-theme-classic .wplace-stats {
  border-radius: var(--wplace-radius);
  background: rgb(255 255 255 / 3%);
  border: 1px solid rgb(255 255 255 / 10%);
}

:root .wplace-status,
.wplace-theme-classic .wplace-status {
  border-radius: var(--wplace-radius);
}

:root .wplace-alert-base,
.wplace-theme-classic .wplace-alert-base {
  border-radius: var(--wplace-radius);
  font-family: var(--wplace-font);
}

:root .wplace-settings-container-base,
.wplace-theme-classic .wplace-settings-container-base {
  font-family: var(--wplace-font);
  border-radius: var(--wplace-radius);
  background: var(--wplace-primary);
  color: var(--wplace-text);
  box-shadow: var(--wplace-shadow);
  backdrop-filter: var(--wplace-backdrop);
}

/* Button styling for classic theme */
:root .wplace-btn,
.wplace-theme-classic .wplace-btn {
  background: linear-gradient(135deg, #222 0%, #4a4a4a 100%);
  border: 1px solid rgb(255 255 255 / 10%);
  color: var(--wplace-text);
  border-radius: var(--wplace-btn-radius);
  font-family: var(--wplace-font);
}

:root .wplace-btn::before,
.wplace-theme-classic .wplace-btn::before {
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 10%), transparent);
}

:root .wplace-btn:disabled,
.wplace-theme-classic .wplace-btn:disabled {
  box-shadow: none !important;
}

:root .wplace-btn:hover:not(:disabled),
.wplace-theme-classic .wplace-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgb(0 0 0 / 40%);
}

:root .wplace-btn-overlay.active,
.wplace-theme-classic .wplace-btn-overlay.active {
  background: linear-gradient(135deg, #29b6f6 0%, #8e2de2 100%);
  box-shadow: 0 0 15px #8e2de2;
}

/* Button variants - exact upstream main colors */
:root .wplace-btn-primary,
.wplace-theme-classic .wplace-btn-primary {
  background: linear-gradient(135deg, #222 0%, #6a5acd 100%);
  color: var(--wplace-text);
}

:root .wplace-btn-upload,
.wplace-theme-classic .wplace-btn-upload {
  background: linear-gradient(135deg, #111 0%, #4a4a4a 100%);
  color: var(--wplace-text);
  border: 1px dashed var(--wplace-highlight) !important;
}

:root .wplace-btn-start,
.wplace-theme-classic .wplace-btn-start {
  background: linear-gradient(135deg, var(--wplace-success) 0%, #228b22 100%);
  color: white;
}

:root .wplace-btn-stop,
.wplace-theme-classic .wplace-btn-stop {
  background: linear-gradient(135deg, var(--wplace-error) 0%, #dc143c 100%);
  color: white;
}

:root .wplace-btn-select,
.wplace-theme-classic .wplace-btn-select {
  background: linear-gradient(135deg, var(--wplace-highlight) 0%, #9370db 100%);
  color: white;
}

:root .wplace-btn-file,
.wplace-theme-classic .wplace-btn-file {
  background: linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%);
  color: white;
}

:root .wplace-btn.active,
:root .wplace-btn[aria-pressed="true"],
.wplace-theme-classic .wplace-btn.active,
.wplace-theme-classic .wplace-btn[aria-pressed="true"] {
  background: var(--wplace-highlight) !important;
  color: #000 !important;
  border-color: var(--wplace-text) !important;
  box-shadow: 0 0 8px rgb(0 0 0 / 25%) inset, 0 0 6px rgb(0 0 0 / 20%) !important;
}

:root .wplace-btn.active i,
:root .wplace-btn[aria-pressed="true"] i,
.wplace-theme-classic .wplace-btn.active i,
.wplace-theme-classic .wplace-btn[aria-pressed="true"] i {
  filter: drop-shadow(0 0 3px #000); 
}

:root .mask-mode-group .wplace-btn.active,
:root .mask-mode-group .wplace-btn[aria-pressed="true"],
.wplace-theme-classic .mask-mode-group .wplace-btn.active,
.wplace-theme-classic .mask-mode-group .wplace-btn[aria-pressed="true"] {
  background: var(--wplace-highlight);
  color: #000;
  border-color: var(--wplace-text);
  box-shadow: 0 0 8px rgb(0 0 0 / 25%) inset, 0 0 6px rgb(0 0 0 / 20%);
}

/* Status styling for classic theme */
:root .status-default,
.wplace-theme-classic .status-default {
  background: rgb(255 255 255 / 10%);
  border-color: var(--wplace-text);
  color: var(--wplace-text);
}

:root .status-success,
.wplace-theme-classic .status-success {
  background: rgb(0 255 0 / 10%);
  border-color: var(--wplace-success);
  color: var(--wplace-success);
  box-shadow: 0 0 15px var(--wplace-success);
}

:root .status-error,
.wplace-theme-classic .status-error {
  background: rgb(255 0 0 / 10%);
  border-color: var(--wplace-error);
  color: var(--wplace-error);
  box-shadow: 0 0 15px var(--wplace-error);
}

:root .status-warning,
.wplace-theme-classic .status-warning {
  background: rgb(255 165 0 / 10%);
  border-color: var(--wplace-warning);
  color: var(--wplace-warning);
  box-shadow: 0 0 15px var(--wplace-warning);
}

:root .wplace-status.status-default,
.wplace-theme-classic .wplace-status.status-default {
  color: var(--wplace-text);
  background: rgb(255 255 255 / 10%);
  border-color: var(--wplace-text);
}

/* Alert styling for classic theme */
:root .wplace-alert-info,
.wplace-theme-classic .wplace-alert-info {
  background: linear-gradient(135deg, #3498db, #2980b9);
  box-shadow: 0 4px 12px rgb(52 152 219 / 30%);
}

:root .wplace-alert-success,
.wplace-theme-classic .wplace-alert-success {
  background: linear-gradient(135deg, #27ae60, #229954);
  box-shadow: 0 4px 12px rgb(39 174 96 / 30%);
}

:root .wplace-alert-warning,
.wplace-theme-classic .wplace-alert-warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  box-shadow: 0 4px 12px rgb(243 156 18 / 30%);
}

:root .wplace-alert-error,
.wplace-theme-classic .wplace-alert-error {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  box-shadow: 0 4px 12px rgb(231 76 60 / 30%);
}

/* Progress bar styling for classic theme */
:root .wplace-progress,
.wplace-theme-classic .wplace-progress {
  background: rgb(0 0 0 / 30%);
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: var(--wplace-radius);
}

:root .wplace-progress-bar,
.wplace-theme-classic .wplace-progress-bar {
  background: linear-gradient(135deg, var(--wplace-highlight) 0%, #9370db 100%);
}

:root .wplace-progress-bar::after,
.wplace-theme-classic .wplace-progress-bar::after {
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 30%), transparent);
}

/* Header and sections styling for classic theme */
:root .wplace-header-btn,
.wplace-theme-classic .wplace-header-btn {
  background: rgb(255 255 255 / 10%);
  color: var(--wplace-highlight);
  border-radius: 4px;
  font-family: var(--wplace-font);
}

:root .wplace-header-btn:hover,
.wplace-theme-classic .wplace-header-btn:hover {
  background: #222;
  color: var(--wplace-text);
}

/* Font and typography for classic theme */
:root .wplace-turnstile-overlay,
.wplace-theme-classic .wplace-turnstile-overlay {
  background: rgb(0 0 0 / 90%) !important;
  border-radius: var(--wplace-radius) !important;
  box-shadow: 0 8px 32px rgb(0 0 0 / 40%) !important;
  backdrop-filter: var(--wplace-backdrop) !important;
  border: 1px solid rgb(255 255 255 / 20%) !important;
  color: var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
}

/* Auto light/dark support for classic theme */
@media (prefers-color-scheme: light) {
  :root .theme-auto,
  .wplace-theme-classic .theme-auto {
    --wplace-primary: #fff;
    --wplace-secondary: #f5f5f5;
    --wplace-accent: #007acc;
    --wplace-text: #333;
  }
}

@media (prefers-color-scheme: dark) {
  :root .theme-auto,
  .wplace-theme-classic .theme-auto {
    --wplace-primary: #1e1e1e;
    --wplace-secondary: #2d2d30;
    --wplace-accent: var(--wplace-highlight);
    --wplace-text: #fff;
  }
}

/* Border and color styling for classic theme */
:root .wplace-color-item-name,
.wplace-theme-classic .wplace-color-item-name {
  color: #ccc;
}

:root .wplace-color-swatch,
.wplace-theme-classic .wplace-color-swatch {
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 4px;
}

:root .wplace-stat-color-swatch,
.wplace-theme-classic .wplace-stat-color-swatch {
  border-radius: 3px;
  border: 1px solid rgb(255 255 255 / 10%);
  box-shadow: inset 0 0 2px rgb(0 0 0 / 50%);
}

:root .resize-tools button,
.wplace-theme-classic .resize-tools button {
  border-radius: 6px;
  border: 1px solid rgb(255 255 255 / 20%);
  background: rgb(255 255 255 / 6%);
  color: #fff;
}

:root .resize-slider,
.wplace-theme-classic .resize-slider {
  background: #ccc;
  border-radius: var(--wplace-radius);
}

/* Text effects and filters for classic theme */
:root .wplace-color-swatch:not(.active),
.wplace-theme-classic .wplace-color-swatch:not(.active) {
  filter: grayscale(80%);
}

:root .wplace-color-swatch.unavailable,
.wplace-theme-classic .wplace-color-swatch.unavailable {
  border-color: #666;
}

:root .wplace-color-swatch.unavailable:not(.active),
.wplace-theme-classic .wplace-color-swatch.unavailable:not(.active) {
  filter: grayscale(90%);
}

:root .wplace-color-swatch.active::after,
.wplace-theme-classic .wplace-color-swatch.active::after {
  text-shadow: 0 0 3px black;
}

/* Icon colors for classic theme */
:root .wplace-icon-key,
.wplace-theme-classic .wplace-icon-key {
  color: #4facfe; 
}

:root .wplace-icon-robot,
.wplace-theme-classic .wplace-icon-robot {
  color: #4facfe; 
}

:root .wplace-icon-speed,
.wplace-theme-classic .wplace-icon-speed {
  color: #4facfe; 
}

:root .wplace-icon-bell,
.wplace-theme-classic .wplace-icon-bell {
  color: #ffd166; 
}

:root .wplace-icon-palette,
.wplace-theme-classic .wplace-icon-palette {
  color: #f093fb; 
}

:root .wplace-icon-globe,
.wplace-theme-classic .wplace-icon-globe {
  color: #ffeaa7;
}

:root .wplace-icon-paint,
.wplace-theme-classic .wplace-icon-paint {
  color: #4facfe;
}

:root .wplace-icon-eye,
.wplace-theme-classic .wplace-icon-eye {
  color: var(--wplace-highlight);
}

/* Form controls and sliders for classic theme */
:root .wplace-slider,
.wplace-theme-classic .wplace-slider {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  border-radius: 4px;
}

:root .wplace-slider::-webkit-slider-thumb,
.wplace-theme-classic .wplace-slider::-webkit-slider-thumb {
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
.wplace-theme-classic .wplace-speed-slider {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  border-radius: 4px;
}

:root .wplace-speed-slider::-webkit-slider-thumb,
.wplace-theme-classic .wplace-speed-slider::-webkit-slider-thumb {
  border-radius: 50%;
  border: 2px solid;
}

:root .wplace-speed-slider::-moz-range-thumb,
.wplace-theme-classic .wplace-speed-slider::-moz-range-thumb {
  border-radius: 50%;
  border: 2px solid;
}

:root .wplace-turnstile-title,
.wplace-theme-classic .wplace-turnstile-title {
  color: var(--wplace-text) !important;
}

:root .wplace-turnstile-hide-btn,
.wplace-theme-classic .wplace-turnstile-hide-btn {
  color: var(--wplace-text) !important;
  border: 1px solid rgb(255 255 255 / 20%) !important;
  border-radius: 6px !important;
}

:root .wplace-turnstile-hide-btn:hover,
.wplace-theme-classic .wplace-turnstile-hide-btn:hover {
  background: rgb(255 255 255 / 10%) !important;
}

:root .wplace-settings-select,
.wplace-theme-classic .wplace-settings-select {
  background: rgb(255 255 255 / 15%);
  color: white;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 8px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 10%);
}

:root .wplace-settings-option,
.wplace-theme-classic .wplace-settings-option {
  background: #2d3748;
  color: white;
}

:root .wplace-stat-colors-grid,
.wplace-theme-classic .wplace-stat-colors-grid {
  background: rgb(0 0 0 / 20%);
  border-radius: 4px;
}

:root .resize-overlay,
.wplace-theme-classic .resize-overlay {
  background: rgb(0 0 0 / 80%);
}

:root .wplace-overlay,
.wplace-theme-classic .wplace-overlay {
  background: rgb(0 0 0 / 80%);
}

:root .wplace-settings-error,
.wplace-theme-classic .wplace-settings-error {
  background: rgb(255 0 0 / 40%) !important;
}

/* Settings sections and batch controls for classic theme */
:root .wplace-settings-section-wrapper,
.wplace-theme-classic .wplace-settings-section-wrapper {
  background: rgb(255 255 255 / 10%);
  border-radius: var(--wplace-radius);
  border: 1px solid rgb(255 255 255 / 10%);
}

:root .wplace-batch-controls,
.wplace-theme-classic .wplace-batch-controls {
  background: rgb(255 255 255 / 10%);
  border-radius: var(--wplace-radius);
  border: 1px solid rgb(255 255 255 / 10%);
}

:root .wplace-overlay-opacity-slider,
.wplace-theme-classic .wplace-overlay-opacity-slider {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  border-radius: 4px;
}

:root .wplace-speed-value,
.wplace-theme-classic .wplace-speed-value {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 8px;
  color: white;
  box-shadow: 0 3px 10px rgb(79 172 254 / 30%);
  border: 1px solid rgb(255 255 255 / 20%);
}

/* Additional elements for classic theme */
:root .wplace-color-divider,
.wplace-theme-classic .wplace-color-divider {
  background: rgb(255 255 255 / 10%);
}

:root .wplace-settings-select option,
.wplace-theme-classic .wplace-settings-select option {
  background: #2d3748;
  color: white;
}

:root .wplace-settings-description,
.wplace-theme-classic .wplace-settings-description {
  color: rgb(255 255 255 / 70%);
}

:root .wplace-settings-apply-btn,
.wplace-theme-classic .wplace-settings-apply-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 8px;
}

/* Resize dialog styling for classic theme */
:root .resize-container,
.wplace-theme-classic .resize-container {
  background: #000;
  border: 1px solid #fff;
  border-radius: 12px;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
}
`,neon:`/* WPlace Auto-Image Bot - Neon Theme */
/* Retro cyberpunk aesthetic with green neon glow effects */

.wplace-theme-neon {
  /* Neon theme colors - matching upstream main neon theme */
  --wplace-primary: #1a1a2e;
  --wplace-secondary: #16213e;
  --wplace-accent: #0f3460;
  --wplace-text: #00ff41;
  --wplace-highlight: #ff6b35;
  --wplace-success: #39ff14;
  --wplace-error: #ff073a;
  --wplace-warning: #ff0;

  /* Neon UI properties */
  --wplace-radius: 0;
  --wplace-border-style: solid;
  --wplace-border-width: 2px;
  --wplace-border-color: #00ff41;
  --wplace-shadow: 0 0 20px rgb(0 255 65 / 30%), inset 0 0 20px rgb(0 255 65 / 10%);
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
  --wplace-highlight-secondary: #fa0;
  
  /* Text variants - neon style */
  --wplace-text-secondary: #00ff41dd;
  --wplace-text-muted: #00ff41bb;
  --wplace-text-dim: #00ff4199;
  --wplace-text-faded: #00ff41cc;
  
  /* Background variants - neon style */
  --wplace-bg-input: rgb(0 255 65 / 15%);
  --wplace-bg-subtle: rgb(0 255 65 / 8%);
  --wplace-bg-faint: rgb(0 255 65 / 5%);
  --wplace-bg-ghost: rgb(0 255 65 / 3%);
  --wplace-bg-whisper: rgb(0 255 65 / 2%);
  
  /* Border variants - neon style */
  --wplace-border-subtle: rgb(0 255 65 / 40%);
  --wplace-border-faint: rgb(0 255 65 / 25%);
  --wplace-border-ghost: rgb(0 255 65 / 15%);
  --wplace-border-ultra-faint: rgb(0 255 65 / 8%);
  
  /* Shadow variants - neon style */
  --wplace-shadow-drag: 0 12px 40px rgb(0 255 65 / 60%), 0 0 0 2px rgb(0 255 65 / 80%), 0 0 20px rgb(0 255 65 / 30%);
  --wplace-shadow-notification: 0 4px 12px rgb(0 255 65 / 40%), 0 0 15px rgb(0 255 65 / 20%);
  --wplace-shadow-slider-thumb: 0 3px 6px rgb(0 255 65 / 50%), 0 0 0 2px var(--wplace-icon-primary), 0 0 10px rgb(0 255 65 / 30%);
  --wplace-shadow-slider-hover: 0 4px 8px rgb(0 255 65 / 60%), 0 0 0 3px var(--wplace-icon-primary), 0 0 15px rgb(0 255 65 / 40%);
  
  /* Animation colors - neon style */
  --wplace-pulse-start: rgb(0 255 65 / 80%);
  --wplace-pulse-mid: rgb(0 255 65 / 0%);
  --wplace-pulse-end: rgb(0 255 65 / 0%);
  
  /* Slider colors - neon style */
  --wplace-slider-thumb-bg: #00ff41;
}

/* Neon-specific styling overrides */
.wplace-theme-neon #wplace-image-bot-container {
  background: var(--wplace-primary) !important;
  border: 2px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 20px rgb(0 255 65 / 10%) !important;
  font-family: var(--wplace-font) !important;
}

.wplace-theme-neon #wplace-stats-container {
  background: var(--wplace-primary) !important;
  border: 2px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 20px rgb(0 255 65 / 10%) !important;
  font-family: var(--wplace-font) !important;
  position: fixed !important;
  overflow: hidden !important;
  z-index: 9998 !important;
}

.wplace-theme-neon .wplace-header {
  background: var(--wplace-secondary) !important;
  border-bottom: 1px solid var(--wplace-text) !important;
  color: var(--wplace-text) !important;
  text-shadow: 0 0 10px var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
}

.wplace-theme-neon .wplace-section {
  background: rgb(22 33 62 / 50%) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
}

.wplace-theme-neon .wplace-status-section {
  background: rgb(22 33 62 / 50%) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
}

.wplace-theme-neon .wplace-section-title {
  color: var(--wplace-text) !important;
  text-shadow: 0 0 8px var(--wplace-text) !important;
  text-transform: uppercase !important;
  font-family: var(--wplace-font) !important;
  font-size: 10px !important;
}

.wplace-theme-neon .wplace-btn {
  background: var(--wplace-secondary) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  color: var(--wplace-text) !important;
  text-shadow: 0 0 5px var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
  font-size: 9px !important;
  text-transform: uppercase !important;
}

/* Pixel blinking and neon glow animation for buttons */
.wplace-theme-neon .wplace-btn:hover:not(:disabled) {
  box-shadow: 0 0 15px var(--wplace-text), inset 0 0 15px rgb(0 255 65 / 10%) !important;
  animation: pixel-blink 0.5s infinite, neon-glow 1s ease-in-out infinite alternate !important;
}

.wplace-theme-neon .wplace-btn-start {
  background: var(--wplace-secondary) !important;
  border-color: var(--wplace-success) !important;
  color: var(--wplace-success) !important;
  text-shadow: 0 0 8px var(--wplace-success) !important;
}

.wplace-theme-neon .wplace-btn-stop {
  background: var(--wplace-secondary) !important;
  border-color: var(--wplace-error) !important;
  color: var(--wplace-error) !important;
  text-shadow: 0 0 8px var(--wplace-error) !important;
}

.wplace-theme-neon .wplace-btn-upload {
  background: var(--wplace-secondary) !important;
  border: 1px dashed var(--wplace-highlight) !important;
  color: var(--wplace-highlight) !important;
  text-shadow: 0 0 8px var(--wplace-highlight) !important;
}

.wplace-theme-neon .wplace-btn-select {
  background: var(--wplace-secondary) !important;
  border-color: var(--wplace-highlight) !important;
  color: var(--wplace-highlight) !important;
  text-shadow: 0 0 8px var(--wplace-highlight) !important;
}

.wplace-theme-neon .wplace-btn-file {
  background: var(--wplace-secondary) !important;
  border-color: var(--wplace-warning) !important;
  color: var(--wplace-warning) !important;
  text-shadow: 0 0 8px var(--wplace-warning) !important;
}

.wplace-theme-neon .wplace-progress {
  background: rgb(0 0 0 / 80%) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
}

.wplace-theme-neon .wplace-progress-bar {
  background: linear-gradient(90deg, var(--wplace-success) 0%, var(--wplace-text) 100%) !important;
  box-shadow: 0 0 10px var(--wplace-success) !important;
}

.wplace-theme-neon .wplace-stat-value {
  color: var(--wplace-text) !important;
  text-shadow: 0 0 5px var(--wplace-text) !important;
}

.wplace-theme-neon .status-success {
  background: rgb(57 255 20 / 10%) !important;
  border-color: var(--wplace-success) !important;
  color: var(--wplace-success) !important;
  box-shadow: 0 0 15px var(--wplace-success) !important;
  text-shadow: 0 0 8px var(--wplace-success) !important;
}

.wplace-theme-neon .status-error {
  background: rgb(255 7 58 / 10%) !important;
  border-color: var(--wplace-error) !important;
  color: var(--wplace-error) !important;
  box-shadow: 0 0 15px var(--wplace-error) !important;
  text-shadow: 0 0 8px var(--wplace-error) !important;
}

.wplace-theme-neon .status-default {
  background: rgb(0 255 65 / 10%) !important;
  border-color: var(--wplace-text) !important;
  color: var(--wplace-text) !important;
  text-shadow: 0 0 5px var(--wplace-text) !important;
}

/* Settings dialog neon styling */
.wplace-theme-neon #wplace-settings-container {
  background: var(--wplace-primary) !important;
  border: 2px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 30px var(--wplace-text), inset 0 0 30px rgb(0 255 65 / 10%) !important;
  font-family: var(--wplace-font) !important;
}

.wplace-theme-neon .wplace-settings-header {
  background: var(--wplace-secondary) !important;
  border-bottom: 1px solid var(--wplace-text) !important;
}

.wplace-theme-neon .wplace-settings-header h3 {
  color: var(--wplace-text) !important;
  text-shadow: 0 0 10px var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
  font-size: 16px !important;
  text-transform: uppercase !important;
}

.wplace-theme-neon .wplace-settings-close-btn {
  background: var(--wplace-secondary) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  color: var(--wplace-text) !important;
}

.wplace-theme-neon .wplace-settings-close-btn:hover {
  background: var(--wplace-error) !important;
  box-shadow: 0 0 15px var(--wplace-error) !important;
}

.wplace-theme-neon .wplace-settings-section-wrapper {
  background: rgb(22 33 62 / 30%) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
}

.wplace-theme-neon .wplace-settings-select {
  background: var(--wplace-secondary) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  color: var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
  font-size: 11px !important;
}

.wplace-theme-neon .wplace-settings-section-label {
  color: var(--wplace-text) !important;
  text-shadow: 0 0 8px var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
  font-size: 12px !important;
  text-transform: uppercase !important;
}

.wplace-theme-neon .wplace-speed-value {
  background: var(--wplace-secondary) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  color: var(--wplace-text) !important;
  text-shadow: 0 0 8px var(--wplace-text) !important;
  font-family: var(--wplace-font) !important;
  box-shadow: 0 0 10px rgb(0 255 65 / 30%) !important;
}

.wplace-theme-neon .wplace-overlay-opacity-value {
  background: var(--wplace-secondary) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  color: var(--wplace-text) !important;
  text-shadow: 0 0 5px var(--wplace-text) !important;
}

/* Neon slider styling */
.wplace-theme-neon .wplace-slider,
.wplace-theme-neon .wplace-speed-slider,
.wplace-theme-neon .wplace-overlay-opacity-slider {
  background: var(--wplace-secondary) !important;
  border: 1px solid var(--wplace-text) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 10px rgb(0 255 65 / 30%) !important;
}

.wplace-theme-neon .wplace-slider::-webkit-slider-thumb,
.wplace-theme-neon .wplace-speed-slider::-webkit-slider-thumb,
.wplace-theme-neon .wplace-overlay-opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 0 !important;
  background: var(--wplace-slider-thumb-bg) !important;
  border: 2px solid var(--wplace-text) !important;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 8px rgb(0 255 65 / 50%) !important;
}

.wplace-theme-neon .wplace-slider::-webkit-slider-thumb:hover,
.wplace-theme-neon .wplace-speed-slider::-webkit-slider-thumb:hover,
.wplace-theme-neon .wplace-overlay-opacity-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px var(--wplace-text) !important;
}

/* Scanline animation for neon theme */
.wplace-theme-neon #wplace-image-bot-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--wplace-text), transparent);
  z-index: 1;
  pointer-events: none;
  animation: scanline 3s linear infinite;
  opacity: 0.7;
}


.wplace-theme-neon #wplace-stats-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--wplace-text), transparent);
  z-index: 1;
  pointer-events: none;
  animation: scanline-stats 4s linear infinite;
  opacity: 0.7;
}


/* Text glow animations */
@keyframes neon-glow {
  0%, 100% {
    text-shadow: 0 0 5px currentcolor, 0 0 10px currentcolor, 0 0 15px currentcolor;
  }

  50% {
    text-shadow: 0 0 2px currentcolor, 0 0 5px currentcolor, 0 0 8px currentcolor;
  }
}

@keyframes pixel-blink {
  0%, 50% {
    opacity: 1;
  }

  51%, 100% {
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

@keyframes scanline-stats {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(300px);
  }
}

/* Resize dialog styling for neon theme */
.wplace-theme-neon .resize-container {
  background: #1a1a2e !important;
  border: 3px solid #00ff41 !important;
  border-radius: 0 !important;
  box-shadow: 0 0 30px rgb(0 255 65 / 50%) !important;
  font-family: 'Press Start 2P', monospace !important;
}
`},wa={en:{title:"Auto-Image",toggleOverlay:"Toggle Overlay",scanColors:"Scan Colors",uploadImage:"Upload",resizeImage:"Resize",selectPosition:"Select Position",startPainting:"Start",stopPainting:"Stop",checkingColors:"\u{1F50D} Checking available colors...",noColorsFound:"\u274C To update the color swatch, open the color palette on the site and try again!",colorsUpdated:"\u2705 Available colors increased {oldCount} -> {newCount}, {diffCount} new colors found",colorsFound:"\u2705 {count} available colors found. Ready to upload.",loadingImage:"\u{1F5BC}\uFE0F Loading image...",imageLoaded:"\u2705 Image loaded with {count} valid pixels",imageError:"\u274C Error loading image",selectPositionAlert:"Paint the first pixel at the location where you want the art to start!",waitingPosition:"\u{1F446} Waiting for you to paint the reference pixel...",positionSet:"\u2705 Position set successfully!",positionTimeout:"\u274C Timeout for position selection",startPaintingMsg:"\u{1F3A8} Starting painting...",paintingProgress:"\u{1F9F1} Progress: {painted}/{total} pixels...",noCharges:"\u231B No charges. Waiting {time}...",overlayTilesNotLoaded:"\u274C Required map tiles not loaded. Check connection or retry.",paintingStoppedByUser:"\u23F9\uFE0F Painting stopped by user",paintingBatchFailed:"\u274C Failed to send pixel batch after retries. Painting stopped.",paintingPixelCheckFailed:"\u274C Failed to read pixel at ({x}, {y}). Painting stopped.",paintingFinalBatchFailed:"\u26A0\uFE0F Final batch of {count} pixels failed after retries.",paintingComplete:"\u2705 Painting complete! {count} pixels painted.",paintingError:"\u274C Unexpected error during painting",missingRequirements:"\u274C Load an image and select a position first",progress:"Progress",pixels:"Pixels",charges:"Charges",fullChargeIn:"Full Charge In",estimatedTime:"Estimated time",initMessage:"Click 'Upload Image' to begin",waitingInit:"Waiting for initialization...",initializingToken:"\u{1F527} Initializing Turnstile token generator...",tokenReady:"\u2705 Token generator ready - you can now start painting!",tokenRetryLater:"\u26A0\uFE0F Token generator will retry when needed",resizeSuccess:"\u2705 Image resized to {width}x{height}",paintingPaused:"\u23F8\uFE0F Painting paused at position X: {x}, Y: {y}",captchaNeeded:"\u2757 Token generation failed. Please try again in a moment.",saveData:"Save Progress",loadData:"Load Progress",saveToFile:"Save to File",loadFromFile:"Load from File",dataManager:"Data Manager",autoSaved:"\u2705 Progress saved automatically",dataLoaded:"\u2705 Progress loaded successfully",fileSaved:"\u2705 Progress saved to file successfully",fileLoaded:"\u2705 Progress loaded from file successfully",noSavedData:"\u274C No saved progress found",savedDataFound:"\u2705 Saved progress found! Load to continue?",savedDate:"Saved on: {date}",clickLoadToContinue:"Click 'Load Progress' to continue.",fileError:"\u274C Error processing file",invalidFileFormat:"\u274C Invalid file format",paintingSpeed:"Painting Speed",pixelsPerSecond:"pixels/second",speedSetting:"Speed: {speed} pixels/sec",settings:"Settings",botSettings:"Bot Settings",close:"Close",language:"Language",themeSettings:"Theme Settings",themeSettingsDesc:"Choose your preferred color theme for the interface.",languageSelectDesc:"Select your preferred language. Changes will take effect immediately.",autoCaptcha:"Auto-CAPTCHA Solver (Turnstile)",autoCaptchaDesc:"Automatically generates Turnstile tokens using integrated generator. Falls back to browser automation if needed.",applySettings:"Apply Settings",settingsSaved:"\u2705 Settings saved successfully!",speedOn:"On",speedOff:"Off",cooldownSettings:"Cooldown Settings",waitCharges:"Wait until charges reach",captchaSolving:"\u{1F511} Generating Turnstile token...",captchaFailed:"\u274C Turnstile token generation failed. Trying fallback method...",automation:"Automation",noChargesThreshold:"\u231B Waiting to reach {threshold} charges. Currently {current}. Estimated time: {time}.",tokenCapturedSuccess:"Token captured successfully! You can start the bot now.",notificationsNotSupported:"Notifications are not supported in this browser.",chargesReadyNotification:"WPlace \u2014 Charges Ready",chargesReadyMessage:"Charges ready: {current} / {max}. Threshold: {threshold}.",testNotificationTitle:"WPlace \u2014 Test",testNotificationMessage:"This is a test notification.",showStats:"Show Stats",compactMode:"Compact Mode",refreshCharges:"Refresh Charges",closeStats:"Close Stats",zoomOut:"Zoom Out",zoomIn:"Zoom In",fitToView:"Fit to view",actualSize:"Actual size (100%)",panMode:"Pan (drag to move view)",clearIgnoredPixels:"Clear all ignored pixels",invertMask:"Invert mask",waitingSetupComplete:"\u{1F504} Waiting for initial setup to complete...",waitingTokenGenerator:"\u{1F504} Waiting for token generator to initialize...",uploadImageFirst:"Upload an image first to capture available colors",pleaseWaitInitialSetup:"\u{1F504} Please wait for the initial setup to complete before loading progress.",pleaseWaitFileSetup:"\u{1F504} Please wait for the initial setup to complete before loading from file.",errorSavingProgress:"\u274C Error saving progress",errorLoadingProgress:"\u274C Error loading progress",fileOperationsAvailable:"\u{1F4C2} File operations (Load/Upload) are now available!",tokenGeneratorReady:"\u{1F511} Token generator ready!",paintingStats:"Painting Stats",enablePaintingSpeedLimit:"Enable painting speed limit (batch size control)",enableNotifications:"Enable notifications",notifyOnChargesThreshold:"Notify when charges reach threshold",onlyWhenNotFocused:"Only when tab is not focused",repeatEvery:"Repeat every",minutesPl:"minute(s)",grantPermission:"Grant Permission",test:"Test",showAllColorsIncluding:"Show All Colors (including unavailable)",chromaWeight:"Chroma Weight",downloadPreview:"Download Preview",apply:"Apply",cancel:"Cancel",fit:"Fit",hundred:"100%",clear:"Clear",invert:"Invert",reprocessingOverlay:"Re-processing overlay...",overlayUpdated:"Overlay updated!",notificationsEnabled:"Notifications enabled.",notificationsPermissionDenied:"Notifications permission denied.",overlayEnabled:"Overlay enabled.",overlayDisabled:"Overlay disabled.",tokenSourceSet:"Token source set to: {source}",batchModeSet:"Batch mode set to: {mode}",randomRange:"Random Range",normalFixedSize:"Normal Fixed Size",advancedColorSettingsReset:"Advanced color settings reset.",shiftRowAltColumn:"Shift = Row \u2022 Alt = Column",hideTurnstileBtn:"Hide",turnstileInstructions:"Cloudflare Turnstile \u2014 please complete the check if shown",uploadImageFirstColors:"Please upload an image first to capture available colors",availableColors:"Available Colors ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Expand Mode",minimize:"Minimize",restore:"Restore",hideStats:"Hide Stats",paintOptions:"Paint Options",paintWhitePixels:"Paint White",paintWhitePixelsDescription:"If enabled, template white pixels will be painted.",paintTransparentPixels:"Paint Transparent",paintTransparentPixelsDescription:"If enabled, template transparent pixels will be painted",paintUnavailablePixels:"Paint Unavailable",paintUnavailablePixelsDescription:"If enabled, template colors that are unavailable will be painted using the closest available color"},"es-MX":{title:"WPlace Auto-Imagen",toggleOverlay:"Alternar superposici\xF3n",scanColors:"Escanear colores",uploadImage:"Subir imagen",resizeImage:"Cambiar tama\xF1o de imagen",selectPosition:"Seleccionar posici\xF3n",startPainting:"Iniciar pintado",stopPainting:"Detener pintado",checkingColors:"\u{1F50D} Verificando colores disponibles...",noColorsFound:"\u274C \xA1Abre la paleta de colores en el sitio e int\xE9ntalo de nuevo!",colorsFound:"\u2705 Se encontraron {count} colores disponibles. Listo para subir.",loadingImage:"\u{1F5BC}\uFE0F Cargando imagen...",imageLoaded:"\u2705 Imagen cargada con {count} p\xEDxeles v\xE1lidos",imageError:"\u274C Error al cargar la imagen",selectPositionAlert:"\xA1Pinta el primer p\xEDxel en la ubicaci\xF3n donde quieres que comience el arte!",waitingPosition:"\u{1F446} Esperando que pintes el p\xEDxel de referencia...",positionSet:"\u2705 \xA1Posici\xF3n establecida con \xE9xito!",positionTimeout:"\u274C Tiempo de espera para seleccionar la posici\xF3n agotado",startPaintingMsg:"\u{1F3A8} Iniciando pintado...",paintingProgress:"\u{1F9F1} Progreso: {painted}/{total} p\xEDxeles...",noCharges:"\u231B Sin cargas. Esperando {time}...",paintingStopped:"\u23F9\uFE0F Pintado detenido por el usuario",paintingComplete:"\u2705 \xA1Pintado completo! Se pintaron {count} p\xEDxeles.",paintingError:"\u274C Error durante el pintado",missingRequirements:"\u274C Primero carga una imagen y selecciona una posici\xF3n",progress:"Progreso",pixels:"P\xEDxeles",charges:"Cargas",estimatedTime:"Tiempo estimado",initMessage:"Haz clic en 'Subir imagen' para comenzar",waitingInit:"Esperando inicializaci\xF3n...",initializingToken:"\u{1F527} Inicializando generador de token Turnstile...",tokenReady:"\u2705 \xA1Generador de token listo! Ya puedes empezar a pintar.",tokenRetryLater:"\u26A0\uFE0F El generador de token volver\xE1 a intentarlo cuando sea necesario",resizeSuccess:"\u2705 Imagen redimensionada a {width}x{height}",paintingPaused:"\u23F8\uFE0F Pintado pausado en la posici\xF3n X: {x}, Y: {y}",captchaNeeded:"\u2757 Fall\xF3 la generaci\xF3n de token. Por favor, int\xE9ntalo de nuevo en un momento.",saveData:"Guardar progreso",loadData:"Cargar progreso",saveToFile:"Guardar en archivo",loadFromFile:"Cargar desde archivo",dataManager:"Gestor de datos",autoSaved:"\u2705 Progreso guardado autom\xE1ticamente",dataLoaded:"\u2705 Progreso cargado con \xE9xito",fileSaved:"\u2705 Progreso guardado en archivo con \xE9xito",fileLoaded:"\u2705 Progreso cargado desde archivo con \xE9xito",noSavedData:"\u274C No se encontr\xF3 progreso guardado",savedDataFound:"\u2705 \xA1Se encontr\xF3 progreso guardado! \xBFCargar para continuar?",savedDate:"Guardado el: {date}",clickLoadToContinue:"Haz clic en 'Cargar progreso' para continuar.",fileError:"\u274C Error al procesar el archivo",invalidFileFormat:"\u274C Formato de archivo inv\xE1lido",paintingSpeed:"Velocidad de pintado",pixelsPerSecond:"p\xEDxeles/segundo",speedSetting:"Velocidad: {speed} p\xEDxeles/seg",settings:"Ajustes",botSettings:"Ajustes del bot",close:"Cerrar",language:"Idioma",themeSettings:"Ajustes de tema",themeSettingsDesc:"Elige tu tema de color preferido para la interfaz.",languageSelectDesc:"Selecciona tu idioma preferido. Los cambios se aplicar\xE1n inmediatamente.",autoCaptcha:"Solucionador autom\xE1tico de CAPTCHA (Turnstile)",autoCaptchaDesc:"Genera autom\xE1ticamente tokens de Turnstile usando el generador integrado. Utiliza la automatizaci\xF3n del navegador como alternativa si es necesario.",applySettings:"Aplicar ajustes",settingsSaved:"\u2705 \xA1Ajustes guardados con \xE9xito!",speedOn:"Activado",speedOff:"Desactivado",cooldownSettings:"Ajustes de tiempo de espera",waitCharges:"Esperar hasta que las cargas lleguen a",captchaSolving:"\u{1F511} Generando token de Turnstile...",captchaFailed:"\u274C Fall\xF3 la generaci\xF3n de token de Turnstile. Probando m\xE9todo alternativo...",automation:"Automatizaci\xF3n",noChargesThreshold:"\u231B Esperando que las cargas lleguen a {threshold}. Actual: {current}. Siguiente en {time}...",tokenCapturedSuccess:"\xA1Token capturado con \xE9xito! Ya puedes iniciar el bot.",notificationsNotSupported:"Las notificaciones no son compatibles con este navegador.",chargesReadyNotification:"WPlace \u2014 Cargas listas",chargesReadyMessage:"Cargas listas: {current} / {max}. Umbral: {threshold}.",testNotificationTitle:"WPlace \u2014 Prueba",testNotificationMessage:"Esta es una notificaci\xF3n de prueba.",showStats:"Mostrar estad\xEDsticas",compactMode:"Modo compacto",refreshCharges:"Actualizar cargas",closeStats:"Cerrar estad\xEDsticas",zoomOut:"Alejar",zoomIn:"Acercar",fitToView:"Ajustar a la vista",actualSize:"Tama\xF1o real (100%)",panMode:"Desplazamiento (arrastra para mover la vista)",clearIgnoredPixels:"Limpiar todos los p\xEDxeles ignorados",invertMask:"Invertir m\xE1scara",waitingSetupComplete:"\u{1F504} Esperando que se complete la configuraci\xF3n inicial...",waitingTokenGenerator:"\u{1F504} Esperando que se inicialice el generador de tokens...",uploadImageFirst:"Sube una imagen primero para capturar los colores disponibles",pleaseWaitInitialSetup:"\u{1F504} Por favor, espera a que se complete la configuraci\xF3n inicial antes de cargar el progreso.",pleaseWaitFileSetup:"\u{1F504} Por favor, espera a que se complete la configuraci\xF3n inicial antes de cargar desde un archivo.",errorSavingProgress:"\u274C Error al guardar el progreso",errorLoadingProgress:"\u274C Error al cargar el progreso",fileOperationsAvailable:"\u{1F4C2} \xA1Las operaciones de archivo (Cargar/Subir) ya est\xE1n disponibles!",tokenGeneratorReady:"\u{1F511} \xA1Generador de tokens listo!",paintingStats:"Estad\xEDsticas de pintado",enablePaintingSpeedLimit:"Activar l\xEDmite de velocidad de pintado (control de lotes)",enableNotifications:"Activar notificaciones",notifyOnChargesThreshold:"Notificar cuando las cargas alcancen el umbral",onlyWhenNotFocused:"Solo cuando la pesta\xF1a no est\xE9 en foco",repeatEvery:"Repetir cada",minutesPl:"minuto(s)",grantPermission:"Otorgar permiso",test:"Probar",showAllColorsIncluding:"Mostrar todos los colores (incluidos los no disponibles)",chromaWeight:"Peso de croma",downloadPreview:"Descargar vista previa",apply:"Aplicar",cancel:"Cancelar",fit:"Ajustar",hundred:"100%",clear:"Limpiar",invert:"Invertir",reprocessingOverlay:"Reprocesando superposici\xF3n...",overlayUpdated:"\xA1Superposici\xF3n actualizada!",notificationsEnabled:"Notificaciones activadas.",notificationsPermissionDenied:"Permiso de notificaciones denegado.",overlayEnabled:"Superposici\xF3n activada.",overlayDisabled:"Superposici\xF3n desactivada.",tokenSourceSet:"Fuente de token establecida en: {source}",batchModeSet:"Modo por lotes establecido en: {mode}",randomRange:"Rango aleatorio",normalFixedSize:"Tama\xF1o fijo normal",advancedColorSettingsReset:"Ajustes de color avanzados restablecidos.",shiftRowAltColumn:"Shift = Fila \u2022 Alt = Columna",hideTurnstileBtn:"Ocultar",turnstileInstructions:"Cloudflare Turnstile \u2014 por favor, completa la verificaci\xF3n si se muestra",uploadImageFirstColors:"Por favor, sube una imagen primero para capturar los colores disponibles",availableColors:"Colores disponibles ({count})",colorTooltip:`ID: {id}
RGB: {rgb}`,expandMode:"Modo expandido",minimize:"Minimizar",restore:"Restaurar",hideStats:"Ocultar estad\xEDsticas",paintOptions:"Opciones de pintado",paintWhitePixels:"Pintar p\xEDxeles blancos",paintTransparentPixels:"Pintar p\xEDxeles transparentes"},fr:{title:"WPlace Auto-Image",toggleOverlay:"Basculer l'overlay",scanColors:"Scanner les couleurs",uploadImage:"T\xE9l\xE9charger l'image",resizeImage:"Redimensionner l'image",selectPosition:"S\xE9lectionner la position",startPainting:"Commencer \xE0 peindre",stopPainting:"Arr\xEAter de peindre",checkingColors:"\u{1F50D} V\xE9rification des couleurs disponibles...",noColorsFound:"\u274C Ouvrez la palette de couleurs sur le site et r\xE9essayez!",colorsFound:"\u2705 {count} couleurs trouv\xE9es. Pr\xEAt \xE0 t\xE9l\xE9charger.",loadingImage:"\u{1F5BC}\uFE0F Chargement de l'image...",imageLoaded:"\u2705 Image charg\xE9e avec {count} pixels valides",imageError:"\u274C Erreur lors du chargement de l'image",selectPositionAlert:"Peignez le premier pixel \xE0 l'endroit o\xF9 vous voulez que l'art commence!",waitingPosition:"\u{1F446} En attente que vous peigniez le pixel de r\xE9f\xE9rence...",positionSet:"\u2705 Position d\xE9finie avec succ\xE8s!",positionTimeout:"\u274C D\xE9lai d'attente pour la s\xE9lection de position",startPaintingMsg:"\u{1F3A8} D\xE9but de la peinture...",paintingProgress:"\u{1F9F1} Progr\xE8s: {painted}/{total} pixels...",noCharges:"\u231B Aucune charge. En attente {time}...",paintingStopped:"\u23F9\uFE0F Peinture arr\xEAt\xE9e par l'utilisateur",paintingComplete:"\u2705 Peinture termin\xE9e! {count} pixels peints.",paintingError:"\u274C Erreur pendant la peinture",missingRequirements:"\u274C Veuillez charger une image et s\xE9lectionner une position d'abord",progress:"Progr\xE8s",pixels:"Pixels",charges:"Charges",estimatedTime:"Temps estim\xE9",initMessage:"Cliquez sur 'T\xE9l\xE9charger l'image' pour commencer",waitingInit:"En attente d'initialisation...",initializingToken:"\u{1F527} Initialisation du g\xE9n\xE9rateur de tokens Turnstile...",tokenReady:"\u2705 G\xE9n\xE9rateur de tokens pr\xEAt - vous pouvez commencer \xE0 peindre!",tokenRetryLater:"\u26A0\uFE0F Le g\xE9n\xE9rateur de tokens r\xE9essaiera si n\xE9cessaire",resizeSuccess:"\u2705 Image redimensionn\xE9e en {width}x{height}",paintingPaused:"\u23F8\uFE0F Peinture en pause \xE0 la position X: {x}, Y: {y}",captchaNeeded:"\u2757 \xC9chec de la g\xE9n\xE9ration de token. Veuillez r\xE9essayer dans un moment.",saveData:"Sauvegarder le progr\xE8s",loadData:"Charger le progr\xE8s",saveToFile:"Sauvegarder dans un fichier",loadFromFile:"Charger depuis un fichier",dataManager:"Donn\xE9es",autoSaved:"\u2705 Progr\xE8s sauvegard\xE9 automatiquement",dataLoaded:"\u2705 Progr\xE8s charg\xE9 avec succ\xE8s",fileSaved:"\u2705 Sauvegard\xE9 dans un fichier avec succ\xE8s",fileLoaded:"\u2705 Charg\xE9 depuis un fichier avec succ\xE8s",noSavedData:"\u274C Aucun progr\xE8s sauvegard\xE9 trouv\xE9",savedDataFound:"\u2705 Progr\xE8s sauvegard\xE9 trouv\xE9! Charger pour continuer?",savedDate:"Sauvegard\xE9 le: {date}",clickLoadToContinue:"Cliquez sur 'Charger le progr\xE8s' pour continuer.",fileError:"\u274C Erreur lors du traitement du fichier",invalidFileFormat:"\u274C Format de fichier invalide",paintingSpeed:"Vitesse de peinture",pixelsPerSecond:"pixels/seconde",speedSetting:"Vitesse: {speed} pixels/sec",settings:"Param\xE8tres",botSettings:"Param\xE8tres du Bot",close:"Fermer",language:"Langue",themeSettings:"Param\xE8tres de Th\xE8me",themeSettingsDesc:"Choisissez votre th\xE8me de couleurs pr\xE9f\xE9r\xE9 pour l'interface.",languageSelectDesc:"S\xE9lectionnez votre langue pr\xE9f\xE9r\xE9e. Les changements prendront effet imm\xE9diatement.",autoCaptcha:"R\xE9solveur de CAPTCHA automatique (Turnstile)",autoCaptchaDesc:"G\xE9n\xE8re automatiquement des jetons Turnstile en utilisant le g\xE9n\xE9rateur int\xE9gr\xE9. Se replie sur l'automatisation du navigateur si n\xE9cessaire.",applySettings:"Appliquer les param\xE8tres",settingsSaved:"\u2705 Param\xE8tres enregistr\xE9s avec succ\xE8s !",speedOn:"Activ\xE9",speedOff:"D\xE9sactiv\xE9",cooldownSettings:"Param\xE8tres de recharge",waitCharges:"Attendre que les charges atteignent",captchaSolving:"\u{1F511} G\xE9n\xE9ration du jeton Turnstile...",captchaFailed:"\u274C \xC9chec de g\xE9n\xE9ration du jeton Turnstile. Tentative de m\xE9thode alternative...",automation:"Automatisation",noChargesThreshold:"\u231B En attente que les charges atteignent {threshold}. Actuel: {current}. Prochaine dans {time}...",tokenCapturedSuccess:"Jeton captur\xE9 avec succ\xE8s ! Vous pouvez d\xE9marrer le bot maintenant.",notificationsNotSupported:"Les notifications ne sont pas support\xE9es dans ce navigateur.",chargesReadyNotification:"WPlace \u2014 Charges Pr\xEAtes",chargesReadyMessage:"Charges pr\xEAtes : {current} / {max}. Seuil : {threshold}.",testNotificationTitle:"WPlace \u2014 Test",testNotificationMessage:"Ceci est une notification de test.",showStats:"Afficher les Stats",compactMode:"Mode Compact",refreshCharges:"Actualiser les Charges",closeStats:"Fermer les Stats",zoomOut:"D\xE9zoomer",zoomIn:"Zoomer",fitToView:"Ajuster \xE0 la vue",actualSize:"Taille r\xE9elle (100%)",panMode:"Panoramique (glisser pour d\xE9placer la vue)",clearIgnoredPixels:"Effacer tous les pixels ignor\xE9s",invertMask:"Inverser le masque",waitingSetupComplete:"\u{1F504} En attente de la fin de l'installation initiale...",waitingTokenGenerator:"\u{1F504} En attente de l'initialisation du g\xE9n\xE9rateur de jetons...",uploadImageFirst:"T\xE9l\xE9chargez d'abord une image pour capturer les couleurs disponibles",pleaseWaitInitialSetup:"\u{1F504} Veuillez attendre la fin de l'installation initiale avant de charger les progr\xE8s.",pleaseWaitFileSetup:"\u{1F504} Veuillez attendre la fin de l'installation initiale avant de charger depuis un fichier.",errorSavingProgress:"\u274C Erreur lors de la sauvegarde des progr\xE8s",errorLoadingProgress:"\u274C Erreur lors du chargement des progr\xE8s",fileOperationsAvailable:"\u{1F4C2} Les op\xE9rations sur fichiers (Charger/T\xE9l\xE9charger) sont maintenant disponibles !",tokenGeneratorReady:"\u{1F511} G\xE9n\xE9rateur de jetons pr\xEAt !",paintingStats:"Statistiques de Peinture",enablePaintingSpeedLimit:"Activer la limite de vitesse de peinture (contr\xF4le de la taille de lot)",enableNotifications:"Activer les notifications",notifyOnChargesThreshold:"Notifier quand les charges atteignent le seuil",onlyWhenNotFocused:"Seulement quand l'onglet n'est pas au premier plan",repeatEvery:"R\xE9p\xE9ter toutes les",minutesPl:"minute(s)",grantPermission:"Accorder la Permission",test:"Test",showAllColorsIncluding:"Afficher toutes les couleurs (y compris indisponibles)",chromaWeight:"Poids de Chrominance",downloadPreview:"T\xE9l\xE9charger l'Aper\xE7u",apply:"Appliquer",cancel:"Annuler",fit:"Ajuster",hundred:"100%",clear:"Effacer",invert:"Inverser",reprocessingOverlay:"Retraitement de l'overlay...",overlayUpdated:"Overlay mis \xE0 jour !",notificationsEnabled:"Notifications activ\xE9es.",notificationsPermissionDenied:"Permission de notifications refus\xE9e.",overlayEnabled:"Overlay activ\xE9.",overlayDisabled:"Overlay d\xE9sactiv\xE9.",tokenSourceSet:"Source de jeton d\xE9finie \xE0 : {source}",batchModeSet:"Mode lot d\xE9fini \xE0 : {mode}",randomRange:"Plage Al\xE9atoire",normalFixedSize:"Taille Fixe Normale",advancedColorSettingsReset:"Param\xE8tres de couleur avanc\xE9s r\xE9initialis\xE9s.",shiftRowAltColumn:"Shift = Ligne \u2022 Alt = Colonne",hideTurnstileBtn:"Masquer",turnstileInstructions:"Cloudflare Turnstile \u2014 veuillez compl\xE9ter la v\xE9rification si affich\xE9e",uploadImageFirstColors:"Veuillez d'abord t\xE9l\xE9charger une image pour capturer les couleurs disponibles",availableColors:"Couleurs Disponibles ({count})",colorTooltip:`ID : {id}
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
RGB\uFF1A{rgb}`,expandMode:"\u5C55\u958B\u6A21\u5F0F",minimize:"\u6700\u5C0F\u5316",restore:"\u6062\u5FA9",hideStats:"\u96B1\u85CF\u7D71\u8A08",paintOptions:"\u7E6A\u5716\u9078\u9805",paintWhitePixels:"\u7E6A\u88FD\u767D\u8272\u50CF\u7D20",paintTransparentPixels:"\u7E6A\u88FD\u900F\u660E\u50CF\u7D20"}};(async()=>{let w={COOLDOWN_DEFAULT:31e3,TRANSPARENCY_THRESHOLD:100,WHITE_THRESHOLD:250,LOG_INTERVAL:10,PAINTING_SPEED:{MIN:1,MAX:1e3,DEFAULT:5},BATCH_MODE:"normal",RANDOM_BATCH_RANGE:{MIN:3,MAX:20},PAINTING_SPEED_ENABLED:!0,AUTO_CAPTCHA_ENABLED:!0,TOKEN_SOURCE:"generator",COOLDOWN_CHARGE_THRESHOLD:1,NOTIFICATIONS:{ENABLED:!1,ON_CHARGES_REACHED:!0,ONLY_WHEN_UNFOCUSED:!0,REPEAT_MINUTES:5},OVERLAY:{OPACITY_DEFAULT:.2,BLUE_MARBLE_DEFAULT:!1,ditheringEnabled:!1},COLOR_MAP:{0:{id:1,name:"Black",rgb:{r:0,g:0,b:0}},1:{id:2,name:"Dark Gray",rgb:{r:60,g:60,b:60}},2:{id:3,name:"Gray",rgb:{r:120,g:120,b:120}},3:{id:4,name:"Light Gray",rgb:{r:210,g:210,b:210}},4:{id:5,name:"White",rgb:{r:255,g:255,b:255}},5:{id:6,name:"Deep Red",rgb:{r:96,g:0,b:24}},6:{id:7,name:"Red",rgb:{r:237,g:28,b:36}},7:{id:8,name:"Orange",rgb:{r:255,g:127,b:39}},8:{id:9,name:"Gold",rgb:{r:246,g:170,b:9}},9:{id:10,name:"Yellow",rgb:{r:249,g:221,b:59}},10:{id:11,name:"Light Yellow",rgb:{r:255,g:250,b:188}},11:{id:12,name:"Dark Green",rgb:{r:14,g:185,b:104}},12:{id:13,name:"Green",rgb:{r:19,g:230,b:123}},13:{id:14,name:"Light Green",rgb:{r:135,g:255,b:94}},14:{id:15,name:"Dark Teal",rgb:{r:12,g:129,b:110}},15:{id:16,name:"Teal",rgb:{r:16,g:174,b:166}},16:{id:17,name:"Light Teal",rgb:{r:19,g:225,b:190}},17:{id:20,name:"Cyan",rgb:{r:96,g:247,b:242}},18:{id:44,name:"Light Cyan",rgb:{r:187,g:250,b:242}},19:{id:18,name:"Dark Blue",rgb:{r:40,g:80,b:158}},20:{id:19,name:"Blue",rgb:{r:64,g:147,b:228}},21:{id:21,name:"Indigo",rgb:{r:107,g:80,b:246}},22:{id:22,name:"Light Indigo",rgb:{r:153,g:177,b:251}},23:{id:23,name:"Dark Purple",rgb:{r:120,g:12,b:153}},24:{id:24,name:"Purple",rgb:{r:170,g:56,b:185}},25:{id:25,name:"Light Purple",rgb:{r:224,g:159,b:249}},26:{id:26,name:"Dark Pink",rgb:{r:203,g:0,b:122}},27:{id:27,name:"Pink",rgb:{r:236,g:31,b:128}},28:{id:28,name:"Light Pink",rgb:{r:243,g:141,b:169}},29:{id:29,name:"Dark Brown",rgb:{r:104,g:70,b:52}},30:{id:30,name:"Brown",rgb:{r:149,g:104,b:42}},31:{id:31,name:"Beige",rgb:{r:248,g:178,b:119}},32:{id:52,name:"Light Beige",rgb:{r:255,g:197,b:165}},33:{id:32,name:"Medium Gray",rgb:{r:170,g:170,b:170}},34:{id:33,name:"Dark Red",rgb:{r:165,g:14,b:30}},35:{id:34,name:"Light Red",rgb:{r:250,g:128,b:114}},36:{id:35,name:"Dark Orange",rgb:{r:228,g:92,b:26}},37:{id:37,name:"Dark Goldenrod",rgb:{r:156,g:132,b:49}},38:{id:38,name:"Goldenrod",rgb:{r:197,g:173,b:49}},39:{id:39,name:"Light Goldenrod",rgb:{r:232,g:212,b:95}},40:{id:40,name:"Dark Olive",rgb:{r:74,g:107,b:58}},41:{id:41,name:"Olive",rgb:{r:90,g:148,b:74}},42:{id:42,name:"Light Olive",rgb:{r:132,g:197,b:115}},43:{id:43,name:"Dark Cyan",rgb:{r:15,g:121,b:159}},44:{id:45,name:"Light Blue",rgb:{r:125,g:199,b:255}},45:{id:46,name:"Dark Indigo",rgb:{r:77,g:49,b:184}},46:{id:47,name:"Dark Slate Blue",rgb:{r:74,g:66,b:132}},47:{id:48,name:"Slate Blue",rgb:{r:122,g:113,b:196}},48:{id:49,name:"Light Slate Blue",rgb:{r:181,g:174,b:241}},49:{id:53,name:"Dark Peach",rgb:{r:155,g:82,b:73}},50:{id:54,name:"Peach",rgb:{r:209,g:128,b:120}},51:{id:55,name:"Light Peach",rgb:{r:250,g:182,b:164}},52:{id:50,name:"Light Brown",rgb:{r:219,g:164,b:99}},53:{id:56,name:"Dark Tan",rgb:{r:123,g:99,b:82}},54:{id:57,name:"Tan",rgb:{r:156,g:132,b:107}},55:{id:36,name:"Light Tan",rgb:{r:214,g:181,b:148}},56:{id:51,name:"Dark Beige",rgb:{r:209,g:128,b:81}},57:{id:61,name:"Dark Stone",rgb:{r:109,g:100,b:63}},58:{id:62,name:"Stone",rgb:{r:148,g:140,b:107}},59:{id:63,name:"Light Stone",rgb:{r:205,g:197,b:158}},60:{id:58,name:"Dark Slate",rgb:{r:51,g:57,b:65}},61:{id:59,name:"Slate",rgb:{r:109,g:117,b:141}},62:{id:60,name:"Light Slate",rgb:{r:179,g:185,b:209}},63:{id:0,name:"Transparent",rgb:null}},CSS_CLASSES:{BUTTON_PRIMARY:`
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
      `},THEMES:{"Classic Autobot":{primary:"#000000",secondary:"#111111",accent:"#222222",text:"#ffffff",highlight:"#775ce3",success:"#00ff00",error:"#ff0000",warning:"#ffaa00",fontFamily:"'Segoe UI', Roboto, sans-serif",borderRadius:"12px",borderStyle:"solid",borderWidth:"1px",boxShadow:"0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",backdropFilter:"blur(10px)",animations:{glow:!1,scanline:!1,"pixel-blink":!1}},"Classic Light":{primary:"#ffffff",secondary:"#f8f9fa",accent:"#e9ecef",text:"#212529",highlight:"#6f42c1",success:"#28a745",error:"#dc3545",warning:"#ffc107",fontFamily:"'Segoe UI', Roboto, sans-serif",borderRadius:"12px",borderStyle:"solid",borderWidth:"1px",boxShadow:"0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",backdropFilter:"blur(10px)",animations:{glow:!1,scanline:!1,"pixel-blink":!1}},"Neon Retro":{primary:"#1a1a2e",secondary:"#16213e",accent:"#0f3460",text:"#00ff41",highlight:"#ff6b35",success:"#39ff14",error:"#ff073a",warning:"#ffff00",neon:"#00ffff",purple:"#bf00ff",pink:"#ff1493",fontFamily:"'Press Start 2P', monospace",borderRadius:"0",borderStyle:"solid",borderWidth:"3px",boxShadow:"0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)",backdropFilter:"none",animations:{glow:!0,scanline:!0,"pixel-blink":!0}}},currentTheme:"Classic Autobot",PAINT_UNAVAILABLE:!0,COORDINATE_MODE:"rows",COORDINATE_DIRECTION:"bottom-left",COORDINATE_SNAKE:!0,COORDINATE_BLOCK_WIDTH:6,COORDINATE_BLOCK_HEIGHT:2},ba=()=>w.THEMES[w.currentTheme],Dn=()=>Object.keys(Ut),Va=()=>w.currentTheme,Xa=t=>{w.THEMES[t]&&(w.currentTheme=t,ja(),Ht(),Zt())};function Ht(){let t=ba();document.documentElement.classList.remove("wplace-theme-classic","wplace-theme-classic-light","wplace-theme-neon");let a="wplace-theme-classic";w.currentTheme==="Neon Retro"?a="wplace-theme-neon":w.currentTheme==="Classic Light"&&(a="wplace-theme-classic-light"),document.documentElement.classList.add(a);let n=document.getElementById("wplace-theme-css");n&&n.remove();let i=Va();if(Ut[i]){let d=document.createElement("style");d.id="wplace-theme-css",d.textContent=Ut[i],document.head.appendChild(d)}let s=document.documentElement,r=(d,g)=>{try{s.style.setProperty(d,g)}catch{}};r("--wplace-primary",t.primary),r("--wplace-secondary",t.secondary),r("--wplace-accent",t.accent),r("--wplace-text",t.text),r("--wplace-highlight",t.highlight),r("--wplace-success",t.success),r("--wplace-error",t.error),r("--wplace-warning",t.warning),r("--wplace-font",t.fontFamily||"'Segoe UI', Roboto, sans-serif"),r("--wplace-radius",""+(t.borderRadius||"12px")),r("--wplace-border-style",""+(t.borderStyle||"solid")),r("--wplace-border-width",""+(t.borderWidth||"1px")),r("--wplace-backdrop",""+(t.backdropFilter||"blur(10px)")),r("--wplace-border-color","rgba(255,255,255,0.1)")}let ja=()=>{try{localStorage.setItem("wplace-theme",w.currentTheme)}catch(t){console.warn("Could not save theme preference:",t)}},va=()=>{try{let t=localStorage.getItem("wplace-theme");t&&w.THEMES[t]&&(w.currentTheme=t)}catch(t){console.warn("Could not load theme preference:",t)}},qt=new Map,Be={},Gt=["en","ru","pt","vi","fr","id","tr","zh-CN","zh-TW","ja","ko","uk"],Yt=async(t,a=0)=>{if(Be[t])return Be[t];if(wa[t]){let n=wa[t];if(typeof n=="object"&&n!==null&&Object.keys(n).length>0)return Be[t]=n,console.log(`\u{1F4DA} Loaded ${t} translations successfully from embedded assets (${Object.keys(n).length} keys)`),n;console.warn(`\u274C Invalid translation format for ${t}`)}else console.warn(`\u274C Language ${t} not found in embedded assets`);return null},Ka=async()=>{let t=localStorage.getItem("wplace_language"),a=navigator.language,n=a.split("-")[0],i="en";try{t&&Gt.includes(t)?(i=t,console.log(`\u{1F504} Using saved language preference: ${i}`)):Gt.includes(a)?(i=a,localStorage.setItem("wplace_language",a),console.log(`\u{1F504} Using browser locale: ${i}`)):Gt.includes(n)?(i=n,localStorage.setItem("wplace_language",n),console.log(`\u{1F504} Using browser language: ${i}`)):console.log("\u{1F504} No matching language found, using English fallback"),e.language=i,i!=="en"&&!Be[i]&&(await Yt(i)||(console.warn(`\u26A0\uFE0F Failed to load ${i} translations, falling back to English`),e.language="en",localStorage.setItem("wplace_language","en")))}catch(s){console.error("\u274C Error in loadLanguagePreference:",s),e.language="en"}},ya=t=>{try{let a=document.createElement("div");a.style.cssText=`
        position: fixed; top: 10px; right: 10px; z-index: 10001;
        background: rgba(255, 193, 7, 0.95); color: #212529; padding: 12px 16px;
        border-radius: 8px; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255, 193, 7, 0.8);
        max-width: 300px; word-wrap: break-word;
      `,a.textContent=t,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.remove()},8e3)}catch(a){console.warn("Failed to show translation warning UI:",a)}},Ja=async()=>{try{console.log("\u{1F310} Initializing translation system..."),Be.en||await Yt("en")||(console.warn("\u26A0\uFE0F Failed to load English translations from CDN, using fallback"),ya("\u26A0\uFE0F Translation loading failed, using basic fallbacks")),await Ka(),console.log(`\u2705 Translation system initialized. Active language: ${e.language}`)}catch(t){console.error("\u274C Translation initialization failed:",t),e.language||(e.language="en"),console.warn("\u26A0\uFE0F Using fallback translations due to initialization failure"),ya("\u26A0\uFE0F Translation system error, using basic English")}},Vt={en:{title:"WPlace Auto-Image",toggleOverlay:"Toggle Overlay",scanColors:"Scan Colors",uploadImage:"Upload Image",resizeImage:"Resize Image",selectPosition:"Select Position",startPainting:"Start Painting",stopPainting:"Stop Painting",progress:"Progress",pixels:"Pixels",charges:"Charges",initMessage:"Click 'Upload Image' to begin"}},Ln=(t,a={})=>{var i,s,r;let n=(i=Be[e.language])==null?void 0:i[t];return!n&&e.language!=="en"&&(n=(s=Be.en)==null?void 0:s[t]),n||(n=(r=Vt.en)==null?void 0:r[t]),n?Object.entries(a).reduce((d,[g,c])=>d.replace(new RegExp(`\\{${g}\\}`,"g"),c),n):(console.warn(`\u26A0\uFE0F Missing translation for key: ${t}`),t)},e={running:!1,imageLoaded:!1,processing:!1,totalPixels:0,paintedPixels:0,availableColors:[],activeColorPalette:[],paintWhitePixels:!0,fullChargeData:null,fullChargeInterval:null,paintTransparentPixels:!1,displayCharges:0,preciseCurrentCharges:0,maxCharges:1,cooldown:w.COOLDOWN_DEFAULT,imageData:null,stopFlag:!1,colorsChecked:!1,startPosition:null,selectingPosition:!1,region:null,minimized:!1,lastPosition:{x:0,y:0},estimatedTime:0,language:"en",paintingSpeed:w.PAINTING_SPEED.DEFAULT,batchMode:w.BATCH_MODE,randomBatchMin:w.RANDOM_BATCH_RANGE.MIN,randomBatchMax:w.RANDOM_BATCH_RANGE.MAX,cooldownChargeThreshold:w.COOLDOWN_CHARGE_THRESHOLD,chargesThresholdInterval:null,tokenSource:w.TOKEN_SOURCE,initialSetupComplete:!1,overlayOpacity:w.OVERLAY.OPACITY_DEFAULT,blueMarbleEnabled:w.OVERLAY.BLUE_MARBLE_DEFAULT,ditheringEnabled:!0,colorMatchingAlgorithm:"lab",enableChromaPenalty:!0,chromaPenaltyWeight:.15,customTransparencyThreshold:w.TRANSPARENCY_THRESHOLD,customWhiteThreshold:w.WHITE_THRESHOLD,resizeSettings:null,originalImage:null,resizeIgnoreMask:null,paintUnavailablePixels:w.PAINT_UNAVAILABLE,coordinateMode:w.COORDINATE_MODE,coordinateDirection:w.COORDINATE_DIRECTION,coordinateSnake:w.COORDINATE_SNAKE,blockWidth:w.COORDINATE_BLOCK_WIDTH,blockHeight:w.COORDINATE_BLOCK_HEIGHT,notificationsEnabled:w.NOTIFICATIONS.ENABLED,notifyOnChargesReached:w.NOTIFICATIONS.ON_CHARGES_REACHED,notifyOnlyWhenUnfocused:w.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED,notificationIntervalMinutes:w.NOTIFICATIONS.REPEAT_MINUTES,_lastChargesNotifyAt:0,_lastChargesBelow:!0,_lastSavePixelCount:0,_lastSaveTime:0,_saveInProgress:!1,paintedMap:null},we=()=>{},xt=null;class Za{constructor(){this.isEnabled=!1,this.startCoords=null,this.imageBitmap=null,this.chunkedTiles=new Map,this.originalTiles=new Map,this.originalTilesData=new Map,this.tileSize=1e3,this.processPromise=null,this.lastProcessedHash=null,this.workerPool=null}toggle(){return this.isEnabled=!this.isEnabled,console.log(`Overlay ${this.isEnabled?"enabled":"disabled"}.`),this.isEnabled}enable(){this.isEnabled=!0}disable(){this.isEnabled=!1}clear(){this.disable(),this.imageBitmap=null,this.chunkedTiles.clear(),this.originalTiles.clear(),this.originalTilesData.clear(),this.lastProcessedHash=null,this.processPromise&&(this.processPromise=null)}async setImage(a){this.imageBitmap=a,this.lastProcessedHash=null,this.imageBitmap&&this.startCoords&&await this.processImageIntoChunks()}async setPosition(a,n){if(!a||!n){this.startCoords=null,this.chunkedTiles.clear(),this.lastProcessedHash=null;return}this.startCoords={region:n,pixel:a},this.lastProcessedHash=null,this.imageBitmap&&await this.processImageIntoChunks()}_generateProcessHash(){if(!this.imageBitmap||!this.startCoords)return null;let{width:a,height:n}=this.imageBitmap,{x:i,y:s}=this.startCoords.pixel,{x:r,y:d}=this.startCoords.region;return`${a}x${n}_${i},${s}_${r},${d}_${e.blueMarbleEnabled}_${e.overlayOpacity}`}async processImageIntoChunks(){if(!this.imageBitmap||!this.startCoords)return;if(this.processPromise)return this.processPromise;let a=this._generateProcessHash();if(this.lastProcessedHash===a&&this.chunkedTiles.size>0){console.log(`\u{1F4E6} Using cached overlay chunks (${this.chunkedTiles.size} tiles)`);return}this.processPromise=this._doProcessImageIntoChunks();try{await this.processPromise,this.lastProcessedHash=a}finally{this.processPromise=null}}async _doProcessImageIntoChunks(){let a=performance.now();this.chunkedTiles.clear();let{width:n,height:i}=this.imageBitmap,{x:s,y:r}=this.startCoords.pixel,{x:d,y:g}=this.startCoords.region,{startTileX:c,startTileY:p,endTileX:l,endTileY:v}=o.calculateTileRange(d,g,s,r,n,i,this.tileSize),u=(l-c+1)*(v-p+1);console.log(`\u{1F504} Processing ${u} overlay tiles...`);let T=4,m=[];for(let y=p;y<=v;y++)for(let S=c;S<=l;S++)m.push({tx:S,ty:y});for(let y=0;y<m.length;y+=T){let S=m.slice(y,y+T);await Promise.all(S.map(async({tx:I,ty:A})=>{let W=`${I},${A}`,G=await this._processTile(I,A,n,i,s,r,d,g);G&&this.chunkedTiles.set(W,G)})),y+T<m.length&&await new Promise(I=>setTimeout(I,0))}let f=performance.now()-a;console.log(`\u2705 Overlay processed ${this.chunkedTiles.size} tiles in ${Math.round(f)}ms`)}async _processTile(a,n,i,s,r,d,g,c){let p=`${a},${n}`,l=(a-g)*this.tileSize-r,v=(n-c)*this.tileSize-d,u=Math.max(0,l),T=Math.max(0,v),m=Math.min(i-u,this.tileSize-(u-l)),f=Math.min(s-T,this.tileSize-(T-v));if(m<=0||f<=0)return null;let y=Math.max(0,-l),S=Math.max(0,-v),I=new OffscreenCanvas(this.tileSize,this.tileSize),A=I.getContext("2d");if(A.imageSmoothingEnabled=!1,A.drawImage(this.imageBitmap,u,T,m,f,y,S,m,f),e.blueMarbleEnabled){let W=A.getImageData(y,S,m,f),G=W.data;for(let J=0;J<G.length;J+=4){let ee=J/4,xe=Math.floor(ee/m);(ee%m+xe)%2===0&&G[J+3]>0&&(G[J+3]=0)}A.putImageData(W,y,S)}return await I.transferToImageBitmap()}async processAndRespondToTileRequest(a){let{endpoint:n,blobID:i,blobData:s}=a,r=s;if(this.isEnabled&&this.chunkedTiles.size>0){let d=n.match(/(\d+)\/(\d+)\.png/);if(d){let g=parseInt(d[1],10),c=parseInt(d[2],10),p=`${g},${c}`,l=this.chunkedTiles.get(p);try{let v=await createImageBitmap(s);this.originalTiles.set(p,v);try{let u,T;typeof OffscreenCanvas<"u"?(u=new OffscreenCanvas(v.width,v.height),T=u.getContext("2d")):(u=document.createElement("canvas"),u.width=v.width,u.height=v.height,T=u.getContext("2d")),T.imageSmoothingEnabled=!1,T.drawImage(v,0,0);let m=T.getImageData(0,0,v.width,v.height);this.originalTilesData.set(p,{w:v.width,h:v.height,data:new Uint8ClampedArray(m.data)})}catch(u){console.warn("OverlayManager: could not cache ImageData for",p,u)}}catch(v){console.warn("OverlayManager: could not create original bitmap for",p,v)}if(l)try{r=await this._compositeTileOptimized(s,l)}catch(v){console.error("Error compositing overlay:",v),r=s}}}window.postMessage({source:"auto-image-overlay",blobID:i,blobData:r},"*")}async getTilePixelColor(a,n,i,s){let r=`${a},${n}`,d=e.customTransparencyThreshold||w.TRANSPARENCY_THRESHOLD,g=this.originalTilesData.get(r);if(g&&g.data&&g.w>0&&g.h>0){let p=Math.max(0,Math.min(g.w-1,i)),l=Math.max(0,Math.min(g.h-1,s)),v=(l*g.w+p)*4,u=g.data,T=u[v+3];return!e.paintTransparentPixels&&T<d?(window._overlayDebug&&console.debug("OverlayManager: pixel transparent (cached), skipping",r,p,l,T),null):[u[v],u[v+1],u[v+2],T]}let c=3;for(let p=1;p<=c;p++){let l=this.originalTiles.get(r);if(!l){p===c?console.warn("OverlayManager: no bitmap for",r,"after",c,"attempts"):await o.sleep(50*p);continue}try{let v,u;typeof OffscreenCanvas<"u"?(v=new OffscreenCanvas(l.width,l.height),u=v.getContext("2d")):(v=document.createElement("canvas"),v.width=l.width,v.height=l.height,u=v.getContext("2d")),u.imageSmoothingEnabled=!1,u.drawImage(l,0,0);let T=Math.max(0,Math.min(l.width-1,i)),m=Math.max(0,Math.min(l.height-1,s)),f=u.getImageData(T,m,1,1).data,y=f[3];return!e.paintTransparentPixels&&y<d?(window._overlayDebug&&console.debug("OverlayManager: pixel transparent (fallback)",r,T,m,y),null):[f[0],f[1],f[2],y]}catch(v){console.warn("OverlayManager: failed to read pixel (attempt",p,")",r,v),p<c?await o.sleep(50*p):console.error("OverlayManager: failed to read pixel after",c,"attempts",r)}}return null}async _compositeTileOptimized(a,n){let i=await createImageBitmap(a),s=new OffscreenCanvas(i.width,i.height),r=s.getContext("2d");return r.imageSmoothingEnabled=!1,r.drawImage(i,0,0),r.globalAlpha=e.overlayOpacity,r.globalCompositeOperation="source-over",r.drawImage(n,0,0),await s.convertToBlob({type:"image/png",quality:.95})}async waitForTiles(a,n,i,s,r=0,d=0,g=1e4){let{startTileX:c,startTileY:p,endTileX:l,endTileY:v}=o.calculateTileRange(a,n,r,d,i,s,this.tileSize),u=[];for(let m=p;m<=v;m++)for(let f=c;f<=l;f++)u.push(`${f},${m}`);if(u.length===0)return!0;let T=Date.now();for(;Date.now()-T<g;){if(e.stopFlag)return console.log("waitForTiles: stopped by user"),!1;if(u.filter(f=>!this.originalTiles.has(f)).length===0)return console.log(`\u2705 All ${u.length} required tiles are loaded`),!0;await o.sleep(100)}return console.warn(`\u274C Timeout waiting for tiles: ${u.length} required, 
        ${u.filter(m=>this.originalTiles.has(m)).length} loaded`),!1}}let Pe=new Za,be=null,Xt=0,jt=!1,Re=null,it=new Promise(t=>{Re=t}),Bn=0,On=10,xa=10,Qa=24e4;function Je(t){Re&&(Re(t),Re=null),be=t,Xt=Date.now()+Qa,console.log("\u2705 Turnstile token set successfully")}function ot(){return be&&Date.now()<Xt}function en(){be=null,Xt=0,console.log("\u{1F5D1}\uFE0F Token invalidated, will force fresh generation")}async function ka(t=!1){if(ot()&&!t)return be;if(t&&en(),jt)return console.log("\u{1F504} Token generation already in progress, waiting..."),await o.sleep(2e3),ot()?be:null;jt=!0;try{console.log("\u{1F504} Token expired or missing, generating new one...");let a=await Sa();if(a&&a.length>20)return Je(a),console.log("\u2705 Token captured and cached successfully"),a;console.log("\u26A0\uFE0F Invisible Turnstile failed, forcing browser automation...");let n=await St();return n&&n.length>20?(Je(n),console.log("\u2705 Fallback token captured successfully"),n):(console.log("\u274C All token generation methods failed"),null)}finally{jt=!1}}async function Sa(){let t=performance.now();try{let{sitekey:a,token:n}=await o.obtainSitekeyAndToken();if(!a)throw new Error("No valid sitekey found");console.log("\u{1F511} Using sitekey:",a),typeof window<"u"&&window.navigator&&console.log("\u{1F9ED} UA:",window.navigator.userAgent.substring(0,50)+"...","Platform:",window.navigator.platform);let i=null;if(n&&typeof n=="string"&&n.length>20?(console.log("\u267B\uFE0F Reusing pre-generated Turnstile token"),i=n):ot()?(console.log("\u267B\uFE0F Using existing cached token (from previous session)"),i=be):(console.log("\u{1F510} Generating new token with executeTurnstile..."),i=await o.executeTurnstile(a,"paint"),i&&Je(i)),i&&typeof i=="string"&&i.length>20){let s=Math.round(performance.now()-t);return console.log(`\u2705 Turnstile token generated successfully in ${s}ms`),i}else throw new Error(`Invalid or empty token received - Length: ${(i==null?void 0:i.length)||0}`)}catch(a){let n=Math.round(performance.now()-t);throw console.error(`\u274C Turnstile token generation failed after ${n}ms:`,a),a}}function tn(t){var n;let a=document.createElement("script");a.textContent=`(${t})();`,(n=document.documentElement)==null||n.appendChild(a),a.remove()}tn(()=>{let t=new Map;window.addEventListener("message",n=>{let{source:i,blobID:s,blobData:r}=n.data;if(i==="auto-image-overlay"&&s&&r){let d=t.get(s);typeof d=="function"&&d(r),t.delete(s)}});let a=window.fetch;window.fetch=async function(...n){var r;let i=await a.apply(this,n),s=n[0]instanceof Request?n[0].url:n[0];if(typeof s=="string"){if(s.includes("https://backend.wplace.live/s0/pixel/"))try{let g=JSON.parse(n[1].body);g.t&&(console.log(`\u{1F50D}\u2705 Turnstile Token Captured - Type: ${typeof g.t}, Value: ${g.t?typeof g.t=="string"?g.t.length>50?g.t.substring(0,50)+"...":g.t:JSON.stringify(g.t):"null/undefined"}, Length: ${((r=g.t)==null?void 0:r.length)||0}`),window.postMessage({source:"turnstile-capture",token:g.t},"*"))}catch{}if((i.headers.get("content-type")||"").includes("image/png")&&s.includes(".png")){let g=i.clone();return new Promise(async c=>{let p=crypto.randomUUID(),l=await g.blob();t.set(p,v=>{c(new Response(v,{headers:g.headers,status:g.status,statusText:g.statusText}))}),window.postMessage({source:"auto-image-tile",endpoint:s,blobID:p,blobData:l},"*")})}}return i}}),window.addEventListener("message",t=>{var d;let{source:a,endpoint:n,blobID:i,blobData:s,token:r}=t.data;a==="auto-image-tile"&&n&&i&&s&&Pe.processAndRespondToTileRequest(t.data),a==="turnstile-capture"&&r&&(Je(r),(d=document.querySelector("#statusText"))!=null&&d.textContent.includes("CAPTCHA")&&(o.showAlert(o.t("tokenCapturedSuccess"),"success"),$("colorsFound","success",{count:e.availableColors.length})))});async function an(){try{let a=await(await fetch("https://backend.wplace.live/me",{credentials:"include"})).json();e.language=a.language==="pt"?"pt":"en"}catch{e.language=navigator.language.startsWith("pt")?"pt":"en"}}let o={sleep:t=>new Promise(a=>setTimeout(a,t)),dynamicSleep:async function(t){let a=Math.max(0,await t());for(;a>0;){let n=a>5e3?2e3:a>1e3?500:100;await this.sleep(Math.min(n,a)),a=Math.max(0,await t())}},waitForSelector:async(t,a=200,n=5e3)=>{let i=Date.now();for(;Date.now()-i<n;){let s=document.querySelector(t);if(s)return s;await o.sleep(a)}return null},msToTimeText(t){let a=Math.ceil(t/1e3),n=Math.floor(a/3600),i=Math.floor(a%3600/60),s=a%60;return n>0?`${n}h ${i}m ${s}s`:i>0?`${i}m ${s}s`:`${s}s`},calculateTileRange(t,a,n,i,s,r,d=1e3){let g=n+s,c=i+r;return{startTileX:t+Math.floor(n/d),startTileY:a+Math.floor(i/d),endTileX:t+Math.floor((g-1)/d),endTileY:a+Math.floor((c-1)/d)}},turnstileLoaded:!1,_turnstileContainer:null,_turnstileOverlay:null,_turnstileWidgetId:null,_lastSitekey:null,async loadTurnstile(){return window.turnstile?(this.turnstileLoaded=!0,Promise.resolve()):new Promise((t,a)=>{if(document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')){let i=()=>{window.turnstile?(this.turnstileLoaded=!0,t()):setTimeout(i,100)};return i()}let n=document.createElement("script");n.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",n.async=!0,n.defer=!0,n.onload=()=>{this.turnstileLoaded=!0,console.log("\u2705 Turnstile script loaded successfully"),t()},n.onerror=()=>{console.error("\u274C Failed to load Turnstile script"),a(new Error("Failed to load Turnstile"))},document.head.appendChild(n)})},ensureTurnstileContainer(){return(!this._turnstileContainer||!document.body.contains(this._turnstileContainer))&&(this._turnstileContainer&&this._turnstileContainer.remove(),this._turnstileContainer=document.createElement("div"),this._turnstileContainer.className="wplace-turnstile-hidden",this._turnstileContainer.setAttribute("aria-hidden","true"),this._turnstileContainer.id="turnstile-widget-container",document.body.appendChild(this._turnstileContainer)),this._turnstileContainer},ensureTurnstileOverlayContainer(){if(this._turnstileOverlay&&document.body.contains(this._turnstileOverlay))return this._turnstileOverlay;let t=document.createElement("div");t.id="turnstile-overlay-container",t.className="wplace-turnstile-overlay wplace-overlay-hidden";let a=document.createElement("div");a.textContent=o.t("turnstileInstructions"),a.className="wplace-turnstile-title";let n=document.createElement("div");n.id="turnstile-overlay-host",n.className="wplace-turnstile-host";let i=document.createElement("button");return i.textContent=o.t("hideTurnstileBtn"),i.className="wplace-turnstile-hide-btn",i.addEventListener("click",()=>t.remove()),t.appendChild(a),t.appendChild(n),t.appendChild(i),document.body.appendChild(t),this._turnstileOverlay=t,t},async executeTurnstile(t,a="paint"){var i;if(await this.loadTurnstile(),this._turnstileWidgetId&&this._lastSitekey===t&&((i=window.turnstile)!=null&&i.execute))try{console.log("\u{1F504} Reusing existing Turnstile widget...");let s=await Promise.race([window.turnstile.execute(this._turnstileWidgetId,{action:a}),new Promise((r,d)=>setTimeout(()=>d(new Error("Execute timeout")),15e3))]);if(s&&s.length>20)return console.log("\u2705 Token generated via widget reuse"),s}catch(s){console.log("\uFFFD Widget reuse failed, will create a fresh widget:",s.message)}let n=await this.createTurnstileWidget(t,a);return n&&n.length>20?n:(console.log("\uFFFD Falling back to interactive Turnstile (visible)."),await this.createTurnstileWidgetInteractive(t,a))},async createTurnstileWidget(t,a){return new Promise(n=>{var i,s;try{if(this._turnstileWidgetId&&((i=window.turnstile)!=null&&i.remove))try{window.turnstile.remove(this._turnstileWidgetId),console.log("\u{1F9F9} Cleaned up existing Turnstile widget")}catch(g){console.warn("\u26A0\uFE0F Widget cleanup warning:",g.message)}let r=this.ensureTurnstileContainer();if(r.innerHTML="",!((s=window.turnstile)!=null&&s.render)){console.error("\u274C Turnstile not available for rendering"),n(null);return}console.log("\u{1F527} Creating invisible Turnstile widget...");let d=window.turnstile.render(r,{sitekey:t,action:a,size:"invisible",retry:"auto","retry-interval":8e3,callback:g=>{console.log("\u2705 Invisible Turnstile callback"),n(g)},"error-callback":()=>n(null),"timeout-callback":()=>n(null)});if(this._turnstileWidgetId=d,this._lastSitekey=t,!d)return n(null);Promise.race([window.turnstile.execute(d,{action:a}),new Promise((g,c)=>setTimeout(()=>c(new Error("Invisible execute timeout")),12e3))]).then(n).catch(()=>n(null))}catch(r){console.error("\u274C Invisible Turnstile creation failed:",r),n(null)}})},async createTurnstileWidgetInteractive(t,a){return console.log("\u{1F504} Creating interactive Turnstile widget (visible)"),new Promise(n=>{var i;try{if(this._turnstileWidgetId&&((i=window.turnstile)!=null&&i.remove))try{window.turnstile.remove(this._turnstileWidgetId)}catch(c){console.warn("\u26A0\uFE0F Widget cleanup warning:",c.message)}let s=this.ensureTurnstileOverlayContainer();s.classList.remove("wplace-overlay-hidden"),s.style.display="block";let r=s.querySelector("#turnstile-overlay-host");r.innerHTML="";let d=setTimeout(()=>{console.warn("\u23F0 Interactive Turnstile widget timeout"),s.classList.add("wplace-overlay-hidden"),s.style.display="none",n(null)},6e4),g=window.turnstile.render(r,{sitekey:t,action:a,size:"normal",theme:"light",callback:c=>{clearTimeout(d),s.classList.add("wplace-overlay-hidden"),s.style.display="none",console.log("\u2705 Interactive Turnstile completed successfully"),typeof c=="string"&&c.length>20?n(c):(console.warn("\u274C Invalid token from interactive widget"),n(null))},"error-callback":c=>{clearTimeout(d),s.classList.add("wplace-overlay-hidden"),s.style.display="none",console.warn("\u274C Interactive Turnstile error:",c),n(null)}});this._turnstileWidgetId=g,this._lastSitekey=t,g?console.log("\u2705 Interactive Turnstile widget created, waiting for user interaction..."):(clearTimeout(d),s.classList.add("wplace-overlay-hidden"),s.style.display="none",console.warn("\u274C Failed to create interactive Turnstile widget"),n(null))}catch(s){console.error("\u274C Interactive Turnstile creation failed:",s),n(null)}})},cleanupTurnstile(){var t;if(this._turnstileWidgetId&&((t=window.turnstile)!=null&&t.remove))try{window.turnstile.remove(this._turnstileWidgetId)}catch(a){console.warn("Failed to cleanup Turnstile widget:",a)}this._turnstileContainer&&document.body.contains(this._turnstileContainer)&&this._turnstileContainer.remove(),this._turnstileOverlay&&document.body.contains(this._turnstileOverlay)&&this._turnstileOverlay.remove(),this._turnstileWidgetId=null,this._turnstileContainer=null,this._turnstileOverlay=null,this._lastSitekey=null},async obtainSitekeyAndToken(t="0x4AAAAAABpqJe8FO0N84q0F"){var s;if(this._cachedSitekey)return console.log("\u{1F50D} Using cached sitekey:",this._cachedSitekey),ot()?{sitekey:this._cachedSitekey,token:be}:{sitekey:this._cachedSitekey,token:null};let a=["0x4AAAAAABpqJe8FO0N84q0F","0x4AAAAAAAJ7xjKAp6Mt_7zw","0x4AAAAAADm5QWx6Ov2LNF2g"],n=async(r,d)=>{if(!r||r.length<10)return null;console.log(`\u{1F50D} Testing sitekey from ${d}:`,r);let g=await this.executeTurnstile(r);return g&&g.length>=20?(console.log(`\u2705 Valid token generated from ${d} sitekey`),Je(g),this._cachedSitekey=r,{sitekey:r,token:g}):(console.log(`\u274C Failed to get token from ${d} sitekey`),null)};try{let r=document.querySelector("[data-sitekey]");if(r){let p=r.getAttribute("data-sitekey"),l=await n(p,"data attribute");if(l)return l}let d=document.querySelector(".cf-turnstile");if((s=d==null?void 0:d.dataset)!=null&&s.sitekey){let p=d.dataset.sitekey,l=await n(p,"turnstile element");if(l)return l}let g=document.querySelectorAll('meta[name*="turnstile"], meta[property*="turnstile"]');for(let p of g){let l=p.getAttribute("content"),v=await n(l,"meta tag");if(v)return v}if(window.__TURNSTILE_SITEKEY){let p=await n(window.__TURNSTILE_SITEKEY,"global variable");if(p)return p}let c=document.querySelectorAll("script");for(let p of c){let v=(p.textContent||p.innerHTML).match(/(?:sitekey|data-sitekey)['"\s\[\]:\=\(]*['"]?([0-9a-zA-Z_-]{20,})['"]?/i);if(v&&v[1]){let u=v[1].replace(/['"]/g,""),T=await n(u,"script content");if(T)return T}}console.log("\u{1F50D} Testing known potential sitekeys...");for(let p of a){let l=await n(p,"known list");if(l)return l}}catch(r){console.warn("\u26A0\uFE0F Error during sitekey detection:",r)}console.log("\u{1F527} Trying fallback sitekey:",t);let i=await n(t,"fallback");return i||(console.error("\u274C No working sitekey or token found."),{sitekey:null,token:null})},createElement:(t,a={},n=[])=>{let i=document.createElement(t);return Object.entries(a).forEach(([s,r])=>{s==="style"&&typeof r=="object"?Object.assign(i.style,r):s==="className"?i.className=r:s==="innerHTML"?i.innerHTML=r:i.setAttribute(s,r)}),typeof n=="string"?i.textContent=n:Array.isArray(n)&&n.forEach(s=>{typeof s=="string"?i.appendChild(document.createTextNode(s)):i.appendChild(s)}),i},createButton:(t,a,n,i,s=w.CSS_CLASSES.BUTTON_PRIMARY)=>{let r=o.createElement("button",{id:t,style:s,innerHTML:`${n?`<i class="${n}"></i>`:""}<span>${a}</span>`});return i&&r.addEventListener("click",i),r},t:(t,a={})=>{var s,r,d,g;let n=`${e.language}_${t}`;if(qt.has(n)){let c=qt.get(n);return Object.keys(a).forEach(p=>{c=c.replace(`{${p}}`,a[p])}),c}if((s=Be[e.language])!=null&&s[t]){let c=Be[e.language][t];return qt.set(n,c),Object.keys(a).forEach(p=>{c=c.replace(`{${p}}`,a[p])}),c}if(e.language!=="en"&&((r=Be.en)!=null&&r[t])){let c=Be.en[t];return Object.keys(a).forEach(p=>{c=c.replace(`{${p}}`,a[p])}),c}let i=((d=Vt[e.language])==null?void 0:d[t])||((g=Vt.en)==null?void 0:g[t])||t;return Object.keys(a).forEach(c=>{i=i.replace(new RegExp(`\\{${c}\\}`,"g"),a[c])}),i===t&&t!=="undefined"&&console.warn(`\u26A0\uFE0F Missing translation for key: ${t} (language: ${e.language})`),i},showAlert:(t,a="info")=>{let n=document.createElement("div");n.className=`wplace-alert-base wplace-alert-${a}`,n.textContent=t,document.body.appendChild(n),setTimeout(()=>{n.style.animation="slide-down 0.3s ease-out reverse",setTimeout(()=>{document.body.removeChild(n)},300)},4e3)},colorDistance:(t,a)=>Math.sqrt(Math.pow(t[0]-a[0],2)+Math.pow(t[1]-a[1],2)+Math.pow(t[2]-a[2],2)),_labCache:new Map,_rgbToLab:(t,a,n)=>{let i=S=>(S/=255,S<=.04045?S/12.92:Math.pow((S+.055)/1.055,2.4)),s=i(t),r=i(a),d=i(n),g=s*.4124+r*.3576+d*.1805,c=s*.2126+r*.7152+d*.0722,p=s*.0193+r*.1192+d*.9505;g/=.95047,c/=1,p/=1.08883;let l=S=>S>.008856?Math.cbrt(S):7.787*S+16/116,v=l(g),u=l(c),T=l(p),m=116*u-16,f=500*(v-u),y=200*(u-T);return[m,f,y]},_lab:(t,a,n)=>{let i=t<<16|a<<8|n,s=o._labCache.get(i);return s||(s=o._rgbToLab(t,a,n),o._labCache.set(i,s)),s},findClosestPaletteColor:(t,a,n,i)=>{if((!i||i.length===0)&&(i=Object.values(w.COLOR_MAP).filter(l=>l.rgb).map(l=>[l.rgb.r,l.rgb.g,l.rgb.b])),e.colorMatchingAlgorithm==="legacy"){let l=1/0,v=[0,0,0];for(let u=0;u<i.length;u++){let[T,m,f]=i[u],y=(T+t)/2,S=T-t,I=m-a,A=f-n,W=Math.sqrt(((512+y)*S*S>>8)+4*I*I+((767-y)*A*A>>8));W<l&&(l=W,v=[T,m,f])}return v}let[s,r,d]=o._lab(t,a,n),g=Math.sqrt(r*r+d*d),c=null,p=1/0;for(let l=0;l<i.length;l++){let[v,u,T]=i[l],[m,f,y]=o._lab(v,u,T),S=s-m,I=r-f,A=d-y,W=S*S+I*I+A*A;if(e.enableChromaPenalty&&g>20){let G=Math.sqrt(f*f+y*y);if(G<g){let J=g-G;W+=J*J*e.chromaPenaltyWeight}}if(W<p&&(p=W,c=i[l],p===0))break}return c||[0,0,0]},isWhitePixel:(t,a,n)=>{let i=e.customWhiteThreshold||w.WHITE_THRESHOLD;return t>=i&&a>=i&&n>=i},resolveColor(t,a,n=!1){if(!a||a.length===0)return{id:null,rgb:t};let i=`${t[0]},${t[1]},${t[2]}|${e.colorMatchingAlgorithm}|${e.enableChromaPenalty?"c":"nc"}|${e.chromaPenaltyWeight}|${n?"exact":"closest"}`;if(_e.has(i))return _e.get(i);if(n){let p=a.find(v=>v.rgb[0]===t[0]&&v.rgb[1]===t[1]&&v.rgb[2]===t[2]),l=p?{id:p.id,rgb:[...p.rgb]}:{id:null,rgb:t};return _e.set(i,l),l}let s=e.customWhiteThreshold||w.WHITE_THRESHOLD;if(t[0]>=s&&t[1]>=s&&t[2]>=s){let p=a.find(l=>l.rgb[0]>=s&&l.rgb[1]>=s&&l.rgb[2]>=s);if(p){let l={id:p.id,rgb:[...p.rgb]};return _e.set(i,l),l}}let r=a[0].id,d=[...a[0].rgb],g=1/0;if(e.colorMatchingAlgorithm==="legacy")for(let p=0;p<a.length;p++){let l=a[p],[v,u,T]=l.rgb,m=(v+t[0])/2,f=v-t[0],y=u-t[1],S=T-t[2],I=Math.sqrt(((512+m)*f*f>>8)+4*y*y+((767-m)*S*S>>8));if(I<g&&(g=I,r=l.id,d=[...l.rgb],I===0))break}else{let[p,l,v]=o._lab(t[0],t[1],t[2]),u=Math.sqrt(l*l+v*v),T=e.enableChromaPenalty?e.chromaPenaltyWeight||.15:0;for(let m=0;m<a.length;m++){let f=a[m],[y,S,I]=f.rgb,[A,W,G]=o._lab(y,S,I),J=p-A,ee=l-W,xe=v-G,Z=J*J+ee*ee+xe*xe;if(T>0&&u>20){let re=Math.sqrt(W*W+G*G);if(re<u){let Te=u-re;Z+=Te*Te*T}}if(Z<g&&(g=Z,r=f.id,d=[...f.rgb],Z===0))break}}let c={id:r,rgb:d};if(_e.set(i,c),_e.size>15e3){let p=_e.keys().next().value;_e.delete(p)}return c},createImageUploader:()=>new Promise(t=>{let a=document.createElement("input");a.type="file",a.accept="image/png,image/jpeg",a.onchange=()=>{let n=new FileReader;n.onload=()=>t(n.result),n.readAsDataURL(a.files[0])},a.click()}),createFileDownloader:(t,a)=>{let n=new Blob([t],{type:"application/json"}),i=URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i)},createFileUploader:()=>new Promise((t,a)=>{let n=document.createElement("input");n.type="file",n.accept=".json",n.onchange=i=>{let s=i.target.files[0];if(s){let r=new FileReader;r.onload=()=>{try{let d=JSON.parse(r.result);t(d)}catch{a(new Error("Invalid JSON file"))}},r.onerror=()=>a(new Error("File reading error")),r.readAsText(s)}else a(new Error("No file selected"))},n.click()}),extractAvailableColors:()=>{let t=document.querySelectorAll('.tooltip button[id^="color-"]');if(t.length===0)return console.log("\u274C No color elements found on page"),null;let a=[],n=[];return Array.from(t).forEach(i=>{let s=Number.parseInt(i.id.replace("color-",""));if(s===0)return;let r=i.style.backgroundColor.match(/\d+/g);if(!r||r.length<3){console.warn(`Skipping color element ${i.id} \u2014 cannot parse RGB`);return}let d=r.map(Number),g=Object.values(w.COLOR_MAP).find(l=>l.id===s),c=g?g.name:`Unknown Color ${s}`,p={id:s,name:c,rgb:d};i.querySelector("svg")?n.push(p):a.push(p)}),console.log("=== CAPTURED COLORS STATUS ==="),console.log(`Total available colors: ${a.length}`),console.log(`Total unavailable colors: ${n.length}`),console.log(`Total colors scanned: ${a.length+n.length}`),a.length>0&&(console.log(`
--- AVAILABLE COLORS ---`),a.forEach((i,s)=>{console.log(`${s+1}. ID: ${i.id}, Name: "${i.name}", RGB: (${i.rgb[0]}, ${i.rgb[1]}, ${i.rgb[2]})`)})),n.length>0&&(console.log(`
--- UNAVAILABLE COLORS ---`),n.forEach((i,s)=>{console.log(`${s+1}. ID: ${i.id}, Name: "${i.name}", RGB: (${i.rgb[0]}, ${i.rgb[1]}, ${i.rgb[2]}) [LOCKED]`)})),console.log("=== END COLOR STATUS ==="),a},formatTime:t=>{let a=Math.floor(t/1e3%60),n=Math.floor(t/(1e3*60)%60),i=Math.floor(t/(1e3*60*60)%24),s=Math.floor(t/(1e3*60*60*24)),r="";return s>0&&(r+=`${s}d `),(i>0||s>0)&&(r+=`${i}h `),(n>0||i>0||s>0)&&(r+=`${n}m `),r+=`${a}s`,r},calculateEstimatedTime:(t,a,n)=>{if(t<=0)return 0;let i=e.paintingSpeed>0?1e3/e.paintingSpeed:1e3,s=t*i,d=Math.ceil(t/Math.max(a,1))*n;return s+d},initializePaintedMap:(t,a)=>{(!e.paintedMap||e.paintedMap.length!==a)&&(e.paintedMap=Array(a).fill().map(()=>Array(t).fill(!1)),console.log(`\u{1F4CB} Initialized painted map: ${t}x${a}`))},markPixelPainted:(t,a,n=0,i=0)=>{let s=t+n,r=a+i;e.paintedMap&&e.paintedMap[r]&&s>=0&&s<e.paintedMap[r].length&&(e.paintedMap[r][s]=!0)},isPixelPainted:(t,a,n=0,i=0)=>{let s=t+n,r=a+i;return e.paintedMap&&e.paintedMap[r]&&s>=0&&s<e.paintedMap[r].length?e.paintedMap[r][s]:!1},shouldAutoSave:()=>{let t=Date.now(),a=e.paintedPixels-e._lastSavePixelCount,n=t-e._lastSaveTime;return!e._saveInProgress&&a>=25&&n>=3e4},performSmartSave:()=>{if(!o.shouldAutoSave())return!1;e._saveInProgress=!0;let t=o.saveProgress();return t&&(e._lastSavePixelCount=e.paintedPixels,e._lastSaveTime=Date.now(),console.log(`\u{1F4BE} Auto-saved at ${e.paintedPixels} pixels`)),e._saveInProgress=!1,t},packPaintedMapToBase64:(t,a,n)=>{if(!t||!a||!n)return null;let i=a*n,s=Math.ceil(i/8),r=new Uint8Array(s),d=0;for(let p=0;p<n;p++){let l=t[p];for(let v=0;v<a;v++){let u=l&&l[v]?1:0,T=d>>3,m=d&7;u&&(r[T]|=1<<m),d++}}let g="",c=32768;for(let p=0;p<r.length;p+=c)g+=String.fromCharCode.apply(null,r.subarray(p,Math.min(p+c,r.length)));return btoa(g)},unpackPaintedMapFromBase64:(t,a,n)=>{if(!t||!a||!n)return null;let i=atob(t),s=new Uint8Array(i.length);for(let g=0;g<i.length;g++)s[g]=i.charCodeAt(g);let r=Array(n).fill().map(()=>Array(a).fill(!1)),d=0;for(let g=0;g<n;g++)for(let c=0;c<a;c++){let p=d>>3,l=d&7;r[g][c]=(s[p]>>l&1)===1,d++}return r},migrateProgressToV2:t=>{var n,i;if(!t||!(!t.version||t.version==="1"||t.version==="1.0"||t.version==="1.1"))return t;try{let s={...t},r=(n=s.imageData)==null?void 0:n.width,d=(i=s.imageData)==null?void 0:i.height;if(s.paintedMap&&r&&d){let g=o.packPaintedMapToBase64(s.paintedMap,r,d);s.paintedMapPacked={width:r,height:d,data:g}}return delete s.paintedMap,s.version="2",s}catch(s){return console.warn("Migration to v2 failed, using original data:",s),t}},migrateProgressToV21:t=>{var i,s;if(!t||t.version==="2.1")return t;let a=t.version==="2"||t.version==="2.0",n=!t.version||t.version==="1"||t.version==="1.0"||t.version==="1.1";if(!a&&!n)return t;try{let r={...t};if(n){let d=(i=r.imageData)==null?void 0:i.width,g=(s=r.imageData)==null?void 0:s.height;if(r.paintedMap&&d&&g){let c=o.packPaintedMapToBase64(r.paintedMap,d,g);r.paintedMapPacked={width:d,height:g,data:c}}delete r.paintedMap}return r.version="2.1",r}catch(r){return console.warn("Migration to v2.1 failed, using original data:",r),t}},migrateProgressToV22:t=>{try{let a={...t};return a.version="2.2",a.state.coordinateMode||(a.state.coordinateMode=w.COORDINATE_MODE),a.state.coordinateDirection||(a.state.coordinateDirection=w.COORDINATE_DIRECTION),a.state.coordinateSnake||(a.state.coordinateSnake=w.COORDINATE_SNAKE),a.state.blockWidth||(a.state.blockWidth=w.COORDINATE_BLOCK_WIDTH),a.state.blockHeight||(a.state.blockHeight=w.COORDINATE_BLOCK_HEIGHT),a}catch(a){return console.warn("Migration to v2.2 failed, using original data:",a),t}},buildPaintedMapPacked(){if(e.paintedMap&&e.imageData){let t=o.packPaintedMapToBase64(e.paintedMap,e.imageData.width,e.imageData.height);if(t)return{width:e.imageData.width,height:e.imageData.height,data:t}}return null},buildProgressData(){return{timestamp:Date.now(),version:"2.2",state:{totalPixels:e.totalPixels,paintedPixels:e.paintedPixels,lastPosition:e.lastPosition,startPosition:e.startPosition,region:e.region,imageLoaded:e.imageLoaded,colorsChecked:e.colorsChecked,coordinateMode:e.coordinateMode,coordinateDirection:e.coordinateDirection,coordinateSnake:e.coordinateSnake,blockWidth:e.blockWidth,blockHeight:e.blockHeight,availableColors:e.availableColors},imageData:e.imageData?{width:e.imageData.width,height:e.imageData.height,pixels:Array.from(e.imageData.pixels),totalPixels:e.imageData.totalPixels}:null,paintedMapPacked:o.buildPaintedMapPacked()}},migrateProgress(t){if(!t)return null;let a=t,n=a.version;return(!n||n==="1"||n==="1.0"||n==="1.1")&&(a=o.migrateProgressToV2(a)),(a.version==="2"||a.version==="2.0")&&(a=o.migrateProgressToV21(a)),a.version==="2.1"&&(a=o.migrateProgressToV22(a)),a},saveProgress:()=>{try{let t=o.buildProgressData(e);return localStorage.setItem("wplace-bot-progress",JSON.stringify(t)),!0}catch(t){return console.error("Error saving progress:",t),!1}},loadProgress:()=>{try{let t=localStorage.getItem("wplace-bot-progress");if(!t)return null;let a=JSON.parse(t),n=o.migrateProgress(a);if(n&&n!==a)try{localStorage.setItem("wplace-bot-progress",JSON.stringify(n))}catch{}return n}catch(t){return console.error("Error loading progress:",t),null}},clearProgress:()=>{try{return localStorage.removeItem("wplace-bot-progress"),e.paintedMap=null,e._lastSavePixelCount=0,e._lastSaveTime=0,e.coordinateMode=w.COORDINATE_MODE,e.coordinateDirection=w.COORDINATE_DIRECTION,e.coordinateSnake=w.COORDINATE_SNAKE,e.blockWidth=w.COORDINATE_BLOCK_WIDTH,e.blockHeight=w.COORDINATE_BLOCK_HEIGHT,console.log("\u{1F4CB} Progress and painted map cleared"),!0}catch(t){return console.error("Error clearing progress:",t),!1}},restoreProgress:t=>{try{if(Object.assign(e,t.state),t.state.coordinateMode&&(e.coordinateMode=t.state.coordinateMode),t.state.coordinateDirection&&(e.coordinateDirection=t.state.coordinateDirection),t.state.coordinateSnake!==void 0&&(e.coordinateSnake=t.state.coordinateSnake),t.state.blockWidth&&(e.blockWidth=t.state.blockWidth),t.state.blockHeight&&(e.blockHeight=t.state.blockHeight),t.imageData){e.imageData={...t.imageData,pixels:new Uint8ClampedArray(t.imageData.pixels)};try{let a=document.createElement("canvas");a.width=e.imageData.width,a.height=e.imageData.height;let n=a.getContext("2d"),i=new ImageData(e.imageData.pixels,e.imageData.width,e.imageData.height);n.putImageData(i,0,0);let s=new Kt("");s.img=a,s.canvas=a,s.ctx=n,e.imageData.processor=s}catch(a){console.warn("Could not rebuild processor from saved image data:",a)}}if(t.paintedMapPacked&&t.paintedMapPacked.data){let{width:a,height:n,data:i}=t.paintedMapPacked;e.paintedMap=o.unpackPaintedMapFromBase64(i,a,n)}else t.paintedMap&&(e.paintedMap=t.paintedMap.map(a=>Array.from(a)));return!0}catch(a){return console.error("Error restoring progress:",a),!1}},saveProgressToFile:()=>{try{let t=o.buildProgressData(),a=`wplace-bot-progress-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`;return o.createFileDownloader(JSON.stringify(t,null,2),a),!0}catch(t){return console.error("Error saving to file:",t),!1}},loadProgressFromFile:async()=>{try{let t=await o.createFileUploader();if(!t||!t.state)throw new Error("Invalid file format");let a=o.migrateProgress(t);return o.restoreProgress(a)}catch(t){throw console.error("Error loading from file:",t),t}},restoreOverlayFromData:async()=>{if(!e.imageLoaded||!e.imageData||!e.startPosition||!e.region)return!1;try{let t=new ImageData(e.imageData.pixels,e.imageData.width,e.imageData.height),a=new OffscreenCanvas(e.imageData.width,e.imageData.height);a.getContext("2d").putImageData(t,0,0);let i=await a.transferToImageBitmap();await Pe.setImage(i),await Pe.setPosition(e.startPosition,e.region),Pe.enable();let s=document.getElementById("toggleOverlayBtn");return s&&(s.disabled=!1,s.classList.add("active")),console.log("Overlay restored from data"),!0}catch(t){return console.error("Failed to restore overlay from data:",t),!1}},updateCoordinateUI({mode:t,directionControls:a,snakeControls:n,blockControls:i}){let s=t==="rows"||t==="columns",r=t==="blocks"||t==="shuffle-blocks";a&&(a.style.display=s?"block":"none"),n&&(n.style.display=s?"block":"none"),i&&(i.style.display=r?"block":"none")}};class Kt{constructor(a){this.imageSrc=a,this.img=null,this.canvas=null,this.ctx=null}async load(){return new Promise((a,n)=>{this.img=new Image,this.img.crossOrigin="anonymous",this.img.onload=()=>{this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.img.width,this.canvas.height=this.img.height,this.ctx.drawImage(this.img,0,0),a()},this.img.onerror=n,this.img.src=this.imageSrc})}getDimensions(){return{width:this.canvas.width,height:this.canvas.height}}getPixelData(){return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data}resize(a,n){let i=document.createElement("canvas"),s=i.getContext("2d");return i.width=a,i.height=n,s.imageSmoothingEnabled=!1,s.drawImage(this.canvas,0,0,a,n),this.canvas.width=a,this.canvas.height=n,this.ctx.imageSmoothingEnabled=!1,this.ctx.drawImage(i,0,0),this.ctx.getImageData(0,0,a,n).data}generatePreview(a,n){let i=document.createElement("canvas"),s=i.getContext("2d");return i.width=a,i.height=n,s.imageSmoothingEnabled=!1,s.drawImage(this.img,0,0,a,n),i.toDataURL()}}let Ta={async paintPixelInRegion(t,a,n,i,s){try{if(await ka(),!be)return"token_error";let r={coords:[n,i],colors:[s],t:be},d=await fetch(`https://backend.wplace.live/s0/pixel/${t}/${a}`,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},credentials:"include",body:JSON.stringify(r)});if(d.status===403)return console.error("\u274C 403 Forbidden. Turnstile token might be invalid or expired."),be=null,it=new Promise(c=>{Re=c}),"token_error";let g=await d.json();return(g==null?void 0:g.painted)===1}catch(r){return console.error("Paint request failed:",r),!1}},async getCharges(){var a,n,i;let t={charges:0,max:1,cooldown:w.COOLDOWN_DEFAULT};try{let s=await fetch("https://backend.wplace.live/me",{credentials:"include"});if(!s.ok)return console.error(`Failed to get charges: HTTP ${s.status}`),t;let r=await s.json();return{charges:((a=r.charges)==null?void 0:a.count)??0,max:((n=r.charges)==null?void 0:n.max)??1,cooldown:((i=r.charges)==null?void 0:i.cooldownMs)??w.COOLDOWN_DEFAULT}}catch(s){return console.error("Failed to get charges:",s),t}}},We={pollTimer:null,pollIntervalMs:6e4,icon(){let t=document.querySelector("link[rel~='icon']");return(t==null?void 0:t.href)||location.origin+"/favicon.ico"},async requestPermission(){if(!("Notification"in window))return o.showAlert(o.t("notificationsNotSupported"),"warning"),"denied";if(Notification.permission==="granted")return"granted";try{return await Notification.requestPermission()}catch{return Notification.permission}},canNotify(){return e.notificationsEnabled&&typeof Notification<"u"&&Notification.permission==="granted"},notify(t,a,n="wplace-charges",i=!1){if(!this.canNotify()||!i&&e.notifyOnlyWhenUnfocused&&document.hasFocus())return!1;try{return new Notification(t,{body:a,tag:n,renotify:!0,icon:this.icon(),badge:this.icon(),silent:!1}),!0}catch{return o.showAlert(a,"info"),!1}},resetEdgeTracking(){e._lastChargesBelow=e.displayCharges<e.cooldownChargeThreshold,e._lastChargesNotifyAt=0},maybeNotifyChargesReached(t=!1){if(!e.notificationsEnabled||!e.notifyOnChargesReached)return;let a=e.displayCharges>=e.cooldownChargeThreshold,n=Date.now(),i=Math.max(1,Number(e.notificationIntervalMinutes||5))*6e4;if(a){let s=e._lastChargesBelow||t,r=n-(e._lastChargesNotifyAt||0)>=i;if(s||r){let d=o.t("chargesReadyMessage",{current:e.displayCharges,max:e.maxCharges,threshold:e.cooldownChargeThreshold});this.notify(o.t("chargesReadyNotification"),d,"wplace-notify-charges"),e._lastChargesNotifyAt=n}e._lastChargesBelow=!1}else e._lastChargesBelow=!0},startPolling(){this.stopPolling(),!(!e.notificationsEnabled||!e.notifyOnChargesReached)&&(this.pollTimer=setInterval(async()=>{try{let{charges:t,cooldown:a,max:n}=await Ta.getCharges();e.displayCharges=Math.floor(t),e.cooldown=a,e.maxCharges=Math.max(1,Math.floor(n)),this.maybeNotifyChargesReached()}catch{}},this.pollIntervalMs))},stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)},syncFromState(){this.resetEdgeTracking(),e.notificationsEnabled&&e.notifyOnChargesReached?this.startPolling():this.stopPolling()}},_e=new Map,$=()=>{},Ne=t=>{},lt=()=>{};function kt(){var a;e.activeColorPalette=[];let t=document.querySelectorAll(".wplace-color-swatch.active");t&&t.forEach(n=>{let i=n.getAttribute("data-rgb");if(i){let s=i.split(",").map(Number);e.activeColorPalette.push(s)}}),((a=document.querySelector(".resize-container"))==null?void 0:a.style.display)==="block"&&we()}function Ca(t,a=!1){let n=document.querySelectorAll(".wplace-color-swatch");n&&n.forEach(i=>{let s=i.classList.contains("unavailable");(!s||a)&&(s||i.classList.toggle("active",t))}),kt()}function nn(){let t=document.querySelectorAll(".wplace-color-swatch");t&&t.forEach(a=>{let n=parseInt(a.getAttribute("data-color-id"),10);!isNaN(n)&&n>=32&&a.classList.toggle("active",!1)}),kt()}function on(t){var s,r,d;let a=t.querySelector("#colors-container"),n=t.querySelector("#showAllColorsToggle");if(!a)return;if(!e.availableColors||e.availableColors.length===0){a.innerHTML=`<div class="wplace-colors-placeholder">${o.t("uploadImageFirst")}</div>`;return}function i(g=!1){a.innerHTML="";let c=0,p=0;Object.values(w.COLOR_MAP).filter(v=>v.rgb!==null).forEach(v=>{let{id:u,name:T,rgb:m}=v,f=`${m.r},${m.g},${m.b}`;p++;let y=e.availableColors.some(W=>W.rgb[0]===m.r&&W.rgb[1]===m.g&&W.rgb[2]===m.b);if(!g&&!y)return;y&&c++;let S=o.createElement("div",{className:"wplace-color-item"}),I=o.createElement("button",{className:`wplace-color-swatch ${y?"":"unavailable"}`,title:`${T} (ID: ${u})${y?"":" (Unavailable)"}`,"data-rgb":f,"data-color-id":u});I.style.backgroundColor=`rgb(${m.r}, ${m.g}, ${m.b})`,y?I.classList.add("active"):(I.style.opacity="0.4",I.style.filter="grayscale(50%)",I.disabled=!0);let A=o.createElement("span",{className:"wplace-color-item-name",style:y?"":"color: #888; font-style: italic;"},T+(y?"":" (N/A)"));y&&I.addEventListener("click",()=>{I.classList.toggle("active"),kt()}),S.appendChild(I),S.appendChild(A),a.appendChild(S)}),kt()}i(!1),n&&n.addEventListener("change",g=>{i(g.target.checked)}),(s=t.querySelector("#selectAllBtn"))==null||s.addEventListener("click",()=>Ca(!0,n==null?void 0:n.checked)),(r=t.querySelector("#unselectAllBtn"))==null||r.addEventListener("click",()=>Ca(!1,n==null?void 0:n.checked)),(d=t.querySelector("#unselectPaidBtn"))==null||d.addEventListener("click",()=>nn())}async function Jt(){let t=performance.now();if(e.tokenSource==="manual")return console.log("\u{1F3AF} Manual token source selected - using pixel placement automation"),await St();try{let{sitekey:a,token:n}=await o.obtainSitekeyAndToken();if(!a)throw new Error("No valid sitekey found");console.log("\u{1F511} Generating Turnstile token for sitekey:",a),console.log("\u{1F9ED} UA:",navigator.userAgent.substring(0,50)+"...","Platform:",navigator.platform),window.turnstile||await o.loadTurnstile();let i=null;if(n&&typeof n=="string"&&n.length>20?(console.log("\u267B\uFE0F Reusing pre-generated token from sitekey detection phase"),i=n):ot()?(console.log("\u267B\uFE0F Using existing cached token (from previous operation)"),i=be):(console.log("\u{1F510} No valid pre-generated or cached token, creating new one..."),i=await o.executeTurnstile(a,"paint"),i&&Je(i)),console.log(`\u{1F50D} Token received - Type: ${typeof i}, Value: ${i?typeof i=="string"?i.length>50?i.substring(0,50)+"...":i:JSON.stringify(i):"null/undefined"}, Length: ${(i==null?void 0:i.length)||0}`),typeof i=="string"&&i.length>20){let s=Math.round(performance.now()-t);return console.log(`\u2705 Turnstile token generated successfully in ${s}ms`),i}else throw new Error(`Invalid or empty token received - Type: ${typeof i}, Value: ${JSON.stringify(i)}, Length: ${(i==null?void 0:i.length)||0}`)}catch(a){let n=Math.round(performance.now()-t);if(console.error(`\u274C Turnstile token generation failed after ${n}ms:`,a),e.tokenSource==="hybrid")return console.log("\u{1F504} Hybrid mode: Generator failed, automatically switching to manual pixel placement..."),await St();throw a}}async function St(){return new Promise(async(t,a)=>{try{Re||(it=new Promise(s=>{Re=s}));let n=o.sleep(2e4).then(()=>a(new Error("Auto-CAPTCHA timed out."))),i=(async()=>{let s=await o.waitForSelector("button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl",200,1e4);if(!s)throw new Error("Could not find the main paint button.");s.click(),await o.sleep(500);let r=await o.waitForSelector("button#color-0",200,5e3);if(!r)throw new Error("Could not find the transparent color button.");r.click(),await o.sleep(500);let d=await o.waitForSelector("canvas",200,5e3);if(!d)throw new Error("Could not find the canvas element.");d.setAttribute("tabindex","0"),d.focus();let g=d.getBoundingClientRect(),c=Math.round(g.left+g.width/2),p=Math.round(g.top+g.height/2);d.dispatchEvent(new MouseEvent("mousemove",{clientX:c,clientY:p,bubbles:!0})),d.dispatchEvent(new KeyboardEvent("keydown",{key:" ",code:"Space",bubbles:!0})),await o.sleep(50),d.dispatchEvent(new KeyboardEvent("keyup",{key:" ",code:"Space",bubbles:!0})),await o.sleep(500),await o.sleep(800),(async()=>{for(;!be;){let u=await o.waitForSelector("button.btn.btn-primary.btn-lg, button.btn.btn-primary.sm\\:btn-xl");if(!u){let T=Array.from(document.querySelectorAll("button.btn-primary"));u=T.length?T[T.length-1]:null}u&&u.click(),await o.sleep(500)}})();let v=await it;await o.sleep(300),t(v)})();await Promise.race([i,n])}catch(n){console.error("Auto-CAPTCHA process failed:",n),a(n)}})}async function Zt(){var Ra,Na;await an();let t=document.getElementById("wplace-image-bot-container"),a=document.getElementById("wplace-stats-container"),n=document.getElementById("wplace-settings-container"),i=document.querySelector(".resize-container"),s=document.querySelector(".resize-overlay");t&&t.remove(),a&&a.remove(),n&&n.remove(),i&&i.remove(),s&&s.remove(),va(),await Ja();let r=ba();Ht();function d(b,E={}){if(Array.from(document.head.querySelectorAll("link")).some(K=>K.href===b))return;let O=document.createElement("link");O.rel="stylesheet",O.href=b;for(let[K,Y]of Object.entries(E))O.setAttribute(K,Y);document.head.appendChild(O)}d("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"),r.fontFamily.includes("Press Start 2P")&&d("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");let g=document.createElement("style");g.textContent=Ya,g.setAttribute("data-wplace-theme","true"),document.head.appendChild(g);let c=document.createElement("div");c.id="wplace-image-bot-container",c.innerHTML=`
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${o.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${o.t("settings")}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="${o.t("showStats")}">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="${o.t("compactMode")}">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${o.t("minimize")}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${o.t("initMessage")}
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
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled title="${o.t("waitingSetupComplete")}">
                <i class="fas fa-upload"></i>
                <span>${o.t("uploadImage")}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${o.t("resizeImage")}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${o.t("selectPosition")}</span>
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
                <span>${o.t("startPainting")}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${o.t("stopPainting")}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${o.t("toggleOverlay")}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">\u23F1\uFE0F ${o.t("cooldownSettings")}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${o.t("waitCharges")}:</label>
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
                <span>${o.t("saveData")}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary" disabled title="${o.t("waitingTokenGenerator")}">
                <i class="fas fa-folder-open"></i>
                <span>${o.t("loadData")}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${o.t("saveToFile")}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file" disabled title="${o.t("waitingTokenGenerator")}">
                <i class="fas fa-upload"></i>
                <span>${o.t("loadFromFile")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;let p=document.createElement("div");p.id="wplace-stats-container",p.style.display="none",p.innerHTML=`
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>${o.t("paintingStats")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="${o.t("refreshCharges")}">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="${o.t("closeStats")}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${o.t("initMessage")}</div>
            </div>
          </div>
        </div>
      </div>
    `;let l=document.createElement("div");l.id="wplace-settings-container";let v=r.primary?`linear-gradient(135deg, ${r.primary} 0%, ${r.secondary||r.primary} 100%)`:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)";l.className="wplace-settings-container-base",l.style.background=v,l.style.cssText+=`
      min-width: 420px;
      max-width: 480px;
      z-index: 99999;
      color: ${r.text||"white"};
      font-family: ${r.fontFamily||"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"};
      box-shadow: ${r.boxShadow||"0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"};
      backdrop-filter: ${r.backdropFilter||"blur(10px)"};
      overflow: hidden;
      animation: settings-slide-in 0.4s ease-out;
      ${(Ra=r.animations)!=null&&Ra.glow?`
        box-shadow: ${r.boxShadow||"0 20px 40px rgba(0,0,0,0.3)"}, 
                   0 0 30px ${r.highlight||r.neon||"#00ffff"};
      `:""}
    `,l.innerHTML=`
      <div class="wplace-settings-header">
        <div class="wplace-settings-title-wrapper">
          <h3 class="wplace-settings-title">
            <i class="fas fa-cog wplace-settings-icon"></i>
            ${o.t("settings")}
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
            ${o.t("automation")}
          </label>
          <!-- Token generator is always enabled - settings moved to Token Source above -->
        </div>

        <!-- Overlay Settings Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label" style="color: ${r.text||"white"};">
            <i class="fas fa-eye wplace-icon-eye" style="color: ${r.highlight||"#48dbfb"};"></i>
            Overlay Settings
          </label>
          <div class="wplace-settings-section-wrapper wplace-overlay-wrapper" style="
            background: ${r.accent?`${r.accent}20`:"rgba(255,255,255,0.1)"}; 
            border-radius: ${r.borderRadius||"12px"}; 
            padding: 18px; 
            border: 1px solid ${r.accent||"rgba(255,255,255,0.1)"};
            ${(Na=r.animations)!=null&&Na.glow?`
              box-shadow: 0 0 15px ${r.accent||"rgba(255,255,255,0.1)"}33;
            `:""}
          ">
              <!-- Opacity Slider -->
              <div class="wplace-overlay-opacity-control">
                <div class="wplace-overlay-opacity-header">
                   <span class="wplace-overlay-opacity-label" style="color: ${r.text||"white"};">Overlay Opacity</span>
                   <div id="overlayOpacityValue" class="wplace-overlay-opacity-value" style="
                     background: ${r.secondary||"rgba(0,0,0,0.2)"}; 
                     color: ${r.text||"white"};
                     padding: 4px 8px; 
                     border-radius: ${r.borderRadius==="0"?"0":"6px"}; 
                     font-size: 12px;
                     border: 1px solid ${r.accent||"transparent"};
                   ">${Math.round(e.overlayOpacity*100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${e.overlayOpacity}" class="wplace-overlay-opacity-slider" style="
                  background: linear-gradient(to right, ${r.highlight||"#48dbfb"} 0%, ${r.purple||r.neon||"#d3a4ff"} 100%); 
                  border-radius: ${r.borderRadius==="0"?"0":"4px"}; 
                ">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" class="wplace-settings-toggle">
                  <div>
                      <span class="wplace-settings-toggle-title" style="color: ${r.text||"white"};">Blue Marble Effect</span>
                      <p class="wplace-settings-toggle-description" style="color: ${r.text?`${r.text}BB`:"rgba(255,255,255,0.7)"};">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${e.blueMarbleEnabled?"checked":""} class="wplace-settings-checkbox" style="
                    accent-color: ${r.highlight||"#48dbfb"};
                  "/>
              </label>
          </div>
        </div>

        <!-- Paint Options Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-paint-brush wplace-icon-paint"></i>
            ${o.t("paintOptions")}
          </label>
          <!-- Pixel Filter Toggles -->
          <div id="pixelFilterControls" class="wplace-settings-section-wrapper wplace-pixel-filter-controls">
            <!-- Paint White Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${r.text||"white"};">
                  ${o.t("paintWhitePixels")}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${r.text?`${r.text}BB`:"rgba(255,255,255,0.7)"};">
                  ${o.t("paintWhitePixelsDescription")}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintWhiteToggle" ${e.paintWhitePixels?"checked":""} 
                class="wplace-settings-checkbox"
                style="accent-color: ${r.highlight||"#48dbfb"};"/>
            </label>
            
            <!-- Paint Transparent Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${r.text||"white"};">
                  ${o.t("paintTransparentPixels")}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${r.text?`${r.text}BB`:"rgba(255,255,255,0.7)"};">
                  ${o.t("paintTransparentPixelsDescription")}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintTransparentToggle" ${e.paintTransparentPixels?"checked":""} 
                class="wplace-settings-checkbox"
                style="accent-color: ${r.highlight||"#48dbfb"};"/>
            </label>
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${r.text||"white"};">${o.t("paintUnavailablePixels")}</span>
                <p class="wplace-settings-toggle-description" style="color: ${r.text?`${r.text}BB`:"rgba(255,255,255,0.7)"};">${o.t("paintUnavailablePixelsDescription")}</p>
              </div>
              <input type="checkbox" id="paintUnavailablePixelsToggle" ${e.paintUnavailablePixels?"checked":""} class="wplace-settings-checkbox" style="
                    accent-color: ${r.highlight||"#48dbfb"};
                  "/>
            </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-tachometer-alt wplace-icon-speed"></i>
            ${o.t("paintingSpeed")}
          </label>
          
          <!-- Batch Mode Selection -->
          <div class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-dice wplace-icon-dice"></i>
              Batch Mode
            </label>
            <select id="batchModeSelect" class="wplace-settings-select">
              <option value="normal" class="wplace-settings-option">\u{1F4E6} Normal (Fixed Size)</option>
              <option value="random" class="wplace-settings-option">\u{1F3B2} Random (Range)</option>
            </select>
          </div>
          
          <!-- Normal Mode: Fixed Size Slider -->
          <div id="normalBatchControls" class="wplace-batch-controls wplace-normal-batch-controls">
            <div class="wplace-speed-slider-container">
              <input type="range" id="speedSlider" min="${w.PAINTING_SPEED.MIN}" max="${w.PAINTING_SPEED.MAX}" value="${w.PAINTING_SPEED.DEFAULT}" class="wplace-speed-slider">
              <div id="speedValue" class="wplace-speed-value">${w.PAINTING_SPEED.DEFAULT} (batch size)</div>
            </div>
            <div class="wplace-speed-labels">
              <span class="wplace-speed-min"><i class="fas fa-turtle"></i> ${w.PAINTING_SPEED.MIN}</span>
              <span class="wplace-speed-max"><i class="fas fa-rabbit"></i> ${w.PAINTING_SPEED.MAX}</span>
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
                <input type="number" id="randomBatchMin" min="1" max="1000" value="${w.RANDOM_BATCH_RANGE.MIN}" class="wplace-settings-number-input">
              </div>
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-up wplace-icon-max"></i>
                  Maximum Batch Size
                </label>
                <input type="number" id="randomBatchMax" min="1" max="1000" value="${w.RANDOM_BATCH_RANGE.MAX}" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-random-batch-description">
              \u{1F3B2} Random batch size between min and max values
            </p>
          </div>
          
          <!-- Speed Control Toggle -->
          <label class="wplace-speed-control-toggle">
            <input type="checkbox" id="enableSpeedToggle" ${w.PAINTING_SPEED_ENABLED?"checked":""} class="wplace-speed-checkbox"/>
            <span>${o.t("enablePaintingSpeedLimit")}</span>
          </label>
        </div>
        
        <!-- Coordinate Generation Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-route wplace-icon-route"></i>
            Coordinate Generation
          </label>
          
          <!-- Mode Selection -->
          <div class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-th wplace-icon-table"></i>
              Generation Mode
            </label>
            <select id="coordinateModeSelect" class="wplace-settings-select">
              <option value="rows" class="wplace-settings-option">\u{1F4CF} Rows (Horizontal Lines)</option>
              <option value="columns" class="wplace-settings-option">\u{1F4D0} Columns (Vertical Lines)</option>
              <option value="circle-out" class="wplace-settings-option">\u2B55 Circle Out (Center \u2192 Edges)</option>
              <option value="circle-in" class="wplace-settings-option">\u2B55 Circle In (Edges \u2192 Center)</option>
              <option value="blocks" class="wplace-settings-option">\u{1F7EB} Blocks (Ordered)</option>
              <option value="shuffle-blocks" class="wplace-settings-option">\u{1F3B2} Shuffle Blocks (Random)</option>
            </select>
          </div>
          
          <!-- Direction Selection (only for rows/columns) -->
          <div id="directionControls" class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-compass wplace-icon-compass"></i>
              Starting Direction
            </label>
            <select id="coordinateDirectionSelect" class="wplace-settings-select">
              <option value="top-left" class="wplace-settings-option">\u2196\uFE0F Top-Left</option>
              <option value="top-right" class="wplace-settings-option">\u2197\uFE0F Top-Right</option>
              <option value="bottom-left" class="wplace-settings-option">\u2199\uFE0F Bottom-Left</option>
              <option value="bottom-right" class="wplace-settings-option">\u2198\uFE0F Bottom-Right</option>
            </select>
          </div>
          
          <!-- Snake Pattern Toggle (only for rows/columns) -->
          <div id="snakeControls" class="wplace-snake-pattern-controls wplace-settings-section-wrapper">
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${r.text||"white"};">Snake Pattern</span>
                <p class="wplace-settings-toggle-description" style="color: ${r.text?`${r.text}BB`:"rgba(255,255,255,0.7)"};">Alternate direction for each row/column (zigzag pattern)</p>
              </div>
              <input type="checkbox" id="coordinateSnakeToggle" ${e.coordinateSnake?"checked":""} class="wplace-settings-checkbox" style="
                    accent-color: ${r.highlight||"#48dbfb"};
                  "/>
            </label>
          </div>
          
          <!-- Block Size Controls (only for blocks/shuffle-blocks) -->
          <div id="blockControls" class="wplace-block-size-controls wplace-settings-section-wrapper wplace-shuffle-block-size-controls">
            <div class="wplace-block-size-grid">
              <div>
                <label class="wplace-block-size-label">
                  <i class="fas fa-arrows-alt-h wplace-icon-width"></i>
                  Block Width
                </label>
                <input type="number" id="blockWidthInput" min="1" max="50" value="6" class="wplace-settings-number-input">
              </div>
              <div>
                <label style="display: block; color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 8px;">
                  <i class="fas fa-arrows-alt-v wplace-icon-height"></i>
                  Block Height
                </label>
                <input type="number" id="blockHeightInput" min="1" max="50" value="2" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-block-size-description">
              \u{1F9F1} Block dimensions for block-based generation modes
            </p>
          </div>
        </div>
        
        <!-- Notifications Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-bell wplace-icon-bell"></i>
            Desktop Notifications
          </label>
          <div class="wplace-settings-section-wrapper wplace-notifications-wrapper">
            <label class="wplace-notification-toggle">
              <span>${o.t("enableNotifications")}</span>
              <input type="checkbox" id="notifEnabledToggle" ${e.notificationsEnabled?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${o.t("notifyOnChargesThreshold")}</span>
              <input type="checkbox" id="notifOnChargesToggle" ${e.notifyOnChargesReached?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${o.t("onlyWhenNotFocused")}</span>
              <input type="checkbox" id="notifOnlyUnfocusedToggle" ${e.notifyOnlyWhenUnfocused?"checked":""} class="wplace-notification-checkbox" />
            </label>
            <div class="wplace-notification-interval">
              <span>${o.t("repeatEvery")}</span>
              <input type="number" id="notifIntervalInput" min="1" max="60" value="${e.notificationIntervalMinutes}" class="wplace-notification-interval-input" />
              <span>${o.t("minutesPl")}</span>
            </div>
            <div class="wplace-notification-buttons">
              <button id="notifRequestPermBtn" class="wplace-btn wplace-btn-secondary wplace-notification-perm-btn"><i class="fas fa-unlock"></i><span>${o.t("grantPermission")}</span></button>
              <button id="notifTestBtn" class="wplace-btn wplace-notification-test-btn"><i class="fas fa-bell"></i><span>${o.t("test")}</span></button>
            </div>
          </div>
        </div>

        <!-- Theme Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-palette wplace-icon-palette"></i>
            ${o.t("themeSettings")}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="themeSelect" class="wplace-settings-select">
              ${Object.keys(w.THEMES).map(b=>`<option value="${b}" ${w.currentTheme===b?"selected":""} class="wplace-settings-option">${b}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-globe wplace-icon-globe"></i>
            ${o.t("language")}
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
              <option value="zh-CN" ${e.language==="zh-CN"?"selected":""} class="wplace-settings-option">\u{1F1E8}\u{1F1F3} \u7B80\u4F53\u4E2D\u6587</option>
              <option value="zh-TW" ${e.language==="zh-TW"?"selected":""} class="wplace-settings-option">\u{1F1F9}\u{1F1FC} \u7E41\u9AD4\u4E2D\u6587</option>
              <option value="ja" ${e.language==="ja"?"selected":""} class="wplace-settings-option">\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E</option>
              <option value="ko" ${e.language==="ko"?"selected":""} class="wplace-settings-option">\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4</option>
              </select>
          </div>
        </div>
      </div>

        <div class="wplace-settings-footer">
             <button id="applySettingsBtn" class="wplace-settings-apply-btn">
                 <i class="fas fa-check"></i> ${o.t("applySettings")}
          </button>
        </div>

      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes settings-slide-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes settings-fade-out {
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
    `;let u=document.createElement("div");u.className="resize-container",u.innerHTML=`
      <h3 class="resize-dialog-title" style="color: ${r.text}">${o.t("resizeImage")}</h3>
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
          ${o.t("keepAspectRatio")}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintWhiteToggle" checked>
            ${o.t("paintWhitePixels")}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintTransparentToggle" checked>
            ${o.t("paintTransparentPixels")}
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn resize-zoom-btn" title="${o.t("zoomOut")}"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider resize-zoom-slider" min="0.1" max="20" value="1" step="0.05">
          <button id="zoomInBtn" class="wplace-btn resize-zoom-btn" title="${o.t("zoomIn")}"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn resize-zoom-btn" title="${o.t("fitToView")}">${o.t("fit")}</button>
          <button id="zoomActualBtn" class="wplace-btn resize-zoom-btn" title="${o.t("actualSize")}">${o.t("hundred")}</button>
          <button id="panModeBtn" class="wplace-btn resize-zoom-btn" title="${o.t("panMode")}">
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
          <button id="clearIgnoredBtn" class="wplace-btn resize-clear-btn" title="Clear all ignored pixels">Clear</button>
          <button id="invertMaskBtn" class="wplace-btn resize-invert-btn" title="Invert mask">Invert</button>
          <span class="resize-shortcut-help">Shift = Row \u2022 Alt = Column</span>
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
                      <span>${o.t("showAllColorsIncluding")}</span>
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
              <span>${o.t("chromaWeight")}</span>
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
          <span>${o.t("downloadPreview")}</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>${o.t("apply")}</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>${o.t("cancel")}</span>
        </button>
      </div>
    `;let T=document.createElement("div");T.className="resize-overlay",document.body.appendChild(c),document.body.appendChild(T),document.body.appendChild(u),document.body.appendChild(p),document.body.appendChild(l),c.style.display="block";let m=c.querySelector("#uploadBtn"),f=c.querySelector("#resizeBtn"),y=c.querySelector("#selectPosBtn"),S=c.querySelector("#startBtn"),I=c.querySelector("#stopBtn"),A=c.querySelector("#saveBtn"),W=c.querySelector("#loadBtn"),G=c.querySelector("#saveToFileBtn"),J=c.querySelector("#loadFromFileBtn");c.querySelectorAll(".wplace-section-title").forEach(b=>{if(!b.querySelector("i.arrow")){let E=document.createElement("i");E.className="fas fa-chevron-down arrow",b.appendChild(E)}b.addEventListener("click",()=>{b.parentElement.classList.toggle("collapsed")})}),W&&(W.disabled=!e.initialSetupComplete,W.title=e.initialSetupComplete?"":"\u{1F504} Waiting for initial setup to complete..."),J&&(J.disabled=!e.initialSetupComplete,J.title=e.initialSetupComplete?"":"\u{1F504} Waiting for initial setup to complete..."),m&&(m.disabled=!e.initialSetupComplete,m.title=e.initialSetupComplete?"":"\u{1F504} Waiting for initial setup to complete...");let ee=c.querySelector("#minimizeBtn"),xe=c.querySelector("#compactBtn"),Z=c.querySelector("#statsBtn"),re=c.querySelector("#toggleOverlayBtn"),Te=c.querySelector("#statusText"),Ze=c.querySelector("#progressBar"),ct=p.querySelector("#statsArea"),Qe=c.querySelector(".wplace-content"),rt=p.querySelector("#closeStatsBtn"),Fe=p.querySelector("#refreshChargesBtn"),et=c.querySelector("#cooldownSlider"),dt=c.querySelector("#cooldownValue");(!m||!y||!S||!I)&&console.error("Some UI elements not found:",{uploadBtn:!!m,selectPosBtn:!!y,startBtn:!!S,stopBtn:!!I});let ea=c.querySelector(".wplace-header");Ue(c);function Ue(b){let E=0,B=0,O=0,K=0,Y=!1,ge=b.querySelector(".wplace-header")||b.querySelector(".wplace-settings-header");if(!ge){console.warn("No draggable header found for element:",b);return}ge.onmousedown=he;function he(ne){if(ne.target.closest(".wplace-header-btn")||ne.target.closest("button"))return;ne.preventDefault(),Y=!0;let H=b.getBoundingClientRect();b.style.transform="none",b.style.top=H.top+"px",b.style.left=H.left+"px",O=ne.clientX,K=ne.clientY,b.classList.add("wplace-dragging"),document.onmouseup=ce,document.onmousemove=se,document.body.style.userSelect="none"}function se(ne){if(!Y)return;ne.preventDefault(),E=O-ne.clientX,B=K-ne.clientY,O=ne.clientX,K=ne.clientY;let H=b.offsetTop-B,ue=b.offsetLeft-E,ke=b.getBoundingClientRect(),De=window.innerHeight-ke.height,pe=window.innerWidth-ke.width;H=Math.max(0,Math.min(H,De)),ue=Math.max(0,Math.min(ue,pe)),b.style.top=H+"px",b.style.left=ue+"px"}function ce(){Y=!1,b.classList.remove("wplace-dragging"),document.onmouseup=null,document.onmousemove=null,document.body.style.userSelect=""}}Ue(p),Ue(c),Z&&rt&&(Z.addEventListener("click",()=>{p.style.display!=="none"?(p.style.display="none",Z.innerHTML='<i class="fas fa-chart-bar"></i>',Z.title=o.t("showStats")):(p.style.display="block",Z.innerHTML='<i class="fas fa-chart-line"></i>',Z.title=o.t("hideStats"))}),rt.addEventListener("click",()=>{p.style.display="none",Z.innerHTML='<i class="fas fa-chart-bar"></i>',Z.title=o.t("showStats")}),Fe&&Fe.addEventListener("click",async()=>{Fe.innerHTML='<i class="fas fa-spinner fa-spin"></i>',Fe.disabled=!0;try{await Ne(!0)}catch(b){console.error("Error refreshing charges:",b)}finally{Fe.innerHTML='<i class="fas fa-sync"></i>',Fe.disabled=!1}})),p&&Z&&(Z.innerHTML='<i class="fas fa-chart-bar"></i>',Z.title=o.t("showStats"));let pt=c.querySelector("#settingsBtn"),He=l.querySelector("#closeSettingsBtn"),Pa=l.querySelector("#applySettingsBtn");if(pt&&He&&Pa){pt.addEventListener("click",()=>{l.classList.contains("show")?(l.style.animation="settings-fade-out 0.3s ease-out forwards",l.classList.remove("show"),setTimeout(()=>{l.style.animation=""},300)):(l.style.top="50%",l.style.left="50%",l.style.transform="translate(-50%, -50%)",l.classList.add("show"),l.style.animation="settings-slide-in 0.4s ease-out")}),He.addEventListener("click",()=>{l.style.animation="settings-fade-out 0.3s ease-out forwards",l.classList.remove("show"),setTimeout(()=>{l.style.animation="",l.style.top="50%",l.style.left="50%",l.style.transform="translate(-50%, -50%)"},300)}),Pa.addEventListener("click",()=>{let D=document.getElementById("colorAlgorithmSelect");D&&(e.colorMatchingAlgorithm=D.value);let N=document.getElementById("enableChromaPenaltyToggle");N&&(e.enableChromaPenalty=N.checked);let Ge=document.getElementById("chromaPenaltyWeightSlider");Ge&&(e.chromaPenaltyWeight=parseFloat(Ge.value)||.15);let It=document.getElementById("transparencyThresholdInput");if(It){let j=parseInt(It.value,10);!isNaN(j)&&j>=0&&j<=255&&(e.customTransparencyThreshold=j)}let st=document.getElementById("whiteThresholdInput");if(st){let j=parseInt(st.value,10);!isNaN(j)&&j>=200&&j<=255&&(e.customWhiteThreshold=j)}w.TRANSPARENCY_THRESHOLD=e.customTransparencyThreshold,w.WHITE_THRESHOLD=e.customWhiteThreshold;let Et=document.getElementById("notifEnabledToggle"),Mt=document.getElementById("notifOnChargesToggle"),At=document.getElementById("notifOnlyUnfocusedToggle"),ye=document.getElementById("notifIntervalInput");if(Et&&(e.notificationsEnabled=!!Et.checked),Mt&&(e.notifyOnChargesReached=!!Mt.checked),At&&(e.notifyOnlyWhenUnfocused=!!At.checked),ye){let j=parseInt(ye.value,10);!isNaN(j)&&j>=1&&j<=60&&(e.notificationIntervalMinutes=j)}q(),o.showAlert(o.t("settingsSaved"),"success"),He.click(),We.syncFromState()}),Ue(l);let b=l.querySelector("#tokenSourceSelect");b&&b.addEventListener("change",D=>{e.tokenSource=D.target.value,q(),console.log(`\u{1F511} Token source changed to: ${e.tokenSource}`);let N={generator:"Automatic Generator",hybrid:"Generator + Auto Fallback",manual:"Manual Pixel Placement"};o.showAlert(o.t("tokenSourceSet",{source:N[e.tokenSource]}),"success")});let E=l.querySelector("#batchModeSelect"),B=l.querySelector("#normalBatchControls"),O=l.querySelector("#randomBatchControls"),K=l.querySelector("#randomBatchMin"),Y=l.querySelector("#randomBatchMax");E&&E.addEventListener("change",D=>{e.batchMode=D.target.value,B&&O&&(D.target.value==="random"?(B.style.display="none",O.style.display="block"):(B.style.display="block",O.style.display="none")),q(),console.log(`\u{1F4E6} Batch mode changed to: ${e.batchMode}`),o.showAlert(o.t("batchModeSet",{mode:e.batchMode==="random"?o.t("randomRange"):o.t("normalFixedSize")}),"success")}),K&&K.addEventListener("input",D=>{let N=parseInt(D.target.value);N>=1&&N<=1e3&&(e.randomBatchMin=N,Y&&N>e.randomBatchMax&&(e.randomBatchMax=N,Y.value=N),q())}),Y&&Y.addEventListener("input",D=>{let N=parseInt(D.target.value);N>=1&&N<=1e3&&(e.randomBatchMax=N,K&&N<e.randomBatchMin&&(e.randomBatchMin=N,K.value=N),q())});let ge=l.querySelector("#languageSelect");ge&&ge.addEventListener("change",async D=>{let N=D.target.value;e.language=N,localStorage.setItem("wplace_language",N),await Yt(N),setTimeout(()=>{l.style.display="none",Zt()},100)});let he=l.querySelector("#themeSelect");he&&he.addEventListener("change",D=>{let N=D.target.value;Xa(N)});let se=l.querySelector("#overlayOpacitySlider"),ce=l.querySelector("#overlayOpacityValue"),ne=l.querySelector("#enableBlueMarbleToggle"),H=l.querySelector("#settingsPaintWhiteToggle"),ue=l.querySelector("#settingsPaintTransparentToggle");se&&ce&&se.addEventListener("input",D=>{let N=parseFloat(D.target.value);e.overlayOpacity=N,ce.textContent=`${Math.round(N*100)}%`}),H&&(H.checked=e.paintWhitePixels,H.addEventListener("change",D=>{e.paintWhitePixels=D.target.checked,q(),console.log(`\u{1F3A8} Paint white pixels: ${e.paintWhitePixels?"ON":"OFF"}`);let N=e.paintWhitePixels?"White pixels in the template will be painted":"White pixels will be skipped";o.showAlert(N,"success")})),ue&&(ue.checked=e.paintTransparentPixels,ue.addEventListener("change",D=>{e.paintTransparentPixels=D.target.checked,q(),console.log(`\u{1F3A8} Paint transparent pixels: ${e.paintTransparentPixels?"ON":"OFF"}`);let N=e.paintTransparentPixels?"Transparent pixels in the template will be painted with the closest available color":"Transparent pixels will be skipped";o.showAlert(N,"success")}));let ke=l.querySelector("#speedSlider"),De=l.querySelector("#speedValue");ke&&De&&ke.addEventListener("input",D=>{let N=parseInt(D.target.value,10);e.paintingSpeed=N,De.textContent=`${N} (batch size)`,q()}),ne&&ne.addEventListener("click",async()=>{e.blueMarbleEnabled=ne.checked,e.imageLoaded&&Pe.imageBitmap&&(o.showAlert(o.t("reprocessingOverlay"),"info"),await Pe.processImageIntoChunks(),o.showAlert(o.t("overlayUpdated"),"success"))});let pe=l.querySelector("#notifRequestPermBtn"),L=l.querySelector("#notifTestBtn");pe&&pe.addEventListener("click",async()=>{await We.requestPermission()==="granted"?o.showAlert(o.t("notificationsEnabled"),"success"):o.showAlert(o.t("notificationsPermissionDenied"),"warning")}),L&&L.addEventListener("click",()=>{We.notify(o.t("testNotificationTitle"),o.t("testNotificationMessage"),"wplace-notify-test",!0)})}let Me=u.querySelector("#widthSlider"),Ae=u.querySelector("#heightSlider"),Ia=u.querySelector("#widthValue"),Ea=u.querySelector("#heightValue"),Ma=u.querySelector("#keepAspect"),Aa=u.querySelector("#paintWhiteToggle"),za=u.querySelector("#paintTransparentToggle"),$e=u.querySelector("#zoomSlider"),Pt=u.querySelector("#zoomValue"),gt=u.querySelector("#zoomInBtn"),ht=u.querySelector("#zoomOutBtn"),Da=u.querySelector("#zoomFitBtn"),La=u.querySelector("#zoomActualBtn"),ut=u.querySelector("#panModeBtn"),me=u.querySelector("#resizePanStage"),mt=u.querySelector("#resizeCanvasStack"),V=u.querySelector("#resizeCanvas"),ve=u.querySelector("#maskCanvas"),tt=V.getContext("2d"),qe=ve.getContext("2d"),un=u.querySelector("#confirmResize"),mn=u.querySelector("#cancelResize"),fn=u.querySelector("#downloadPreviewBtn"),Rn=u.querySelector("#clearIgnoredBtn"),ta=l.querySelector("#coordinateModeSelect"),aa=l.querySelector("#coordinateDirectionSelect"),na=l.querySelector("#coordinateSnakeToggle"),wn=l.querySelector("#directionControls"),bn=l.querySelector("#snakeControls"),vn=l.querySelector("#blockControls"),ia=l.querySelector("#blockWidthInput"),oa=l.querySelector("#blockHeightInput"),ra=l.querySelector("#paintUnavailablePixelsToggle");ra&&(ra.checked=e.paintUnavailablePixels,ra.addEventListener("change",b=>{e.paintUnavailablePixels=b.target.checked,q(),console.log(`\u{1F3A8} Paint unavailable colors: ${e.paintUnavailablePixels?"ON":"OFF"}`);let E=e.paintUnavailablePixels?"Unavailable template colors will be painted with the closest available color":"Unavailable template colors will be skipped";o.showAlert(E,"success")})),ta&&(ta.value=e.coordinateMode,ta.addEventListener("change",b=>{e.coordinateMode=b.target.value,o.updateCoordinateUI({mode:e.coordinateMode,directionControls:wn,snakeControls:bn,blockControls:vn}),q(),console.log(`\u{1F504} Coordinate mode changed to: ${e.coordinateMode}`),o.showAlert(`Coordinate mode set to: ${e.coordinateMode}`,"success")})),aa&&(aa.value=e.coordinateDirection,aa.addEventListener("change",b=>{e.coordinateDirection=b.target.value,q(),console.log(`\u{1F9ED} Coordinate direction changed to: ${e.coordinateDirection}`),o.showAlert(`Coordinate direction set to: ${e.coordinateDirection}`,"success")})),na&&(na.checked=e.coordinateSnake,na.addEventListener("change",b=>{e.coordinateSnake=b.target.checked,q(),console.log(`\u{1F40D} Snake pattern ${e.coordinateSnake?"enabled":"disabled"}`),o.showAlert(`Snake pattern ${e.coordinateSnake?"enabled":"disabled"}`,"success")})),ia&&(ia.value=e.blockWidth,ia.addEventListener("input",b=>{let E=parseInt(b.target.value);E>=1&&E<=50&&(e.blockWidth=E,q())})),oa&&(oa.value=e.blockHeight,oa.addEventListener("change",b=>{let E=parseInt(b.target.value);E>=1&&E<=50&&(e.blockHeight=E,q())})),xe&&xe.addEventListener("click",()=>{c.classList.toggle("wplace-compact"),c.classList.contains("wplace-compact")?(xe.innerHTML='<i class="fas fa-expand"></i>',xe.title=o.t("expandMode")):(xe.innerHTML='<i class="fas fa-compress"></i>',xe.title=o.t("compactMode"))}),ee&&ee.addEventListener("click",()=>{e.minimized=!e.minimized,e.minimized?(c.classList.add("wplace-minimized"),Qe.classList.add("wplace-hidden"),ee.innerHTML='<i class="fas fa-expand"></i>',ee.title=o.t("restore")):(c.classList.remove("wplace-minimized"),Qe.classList.remove("wplace-hidden"),ee.innerHTML='<i class="fas fa-minus"></i>',ee.title=o.t("minimize")),q()}),re&&re.addEventListener("click",()=>{let b=Pe.toggle();re.classList.toggle("active",b),re.setAttribute("aria-pressed",b?"true":"false"),o.showAlert(b?o.t("overlayEnabled"):o.t("overlayDisabled"),"info")}),e.minimized?(c.classList.add("wplace-minimized"),Qe.classList.add("wplace-hidden"),ee&&(ee.innerHTML='<i class="fas fa-expand"></i>',ee.title=o.t("restore"))):(c.classList.remove("wplace-minimized"),Qe.classList.remove("wplace-hidden"),ee&&(ee.innerHTML='<i class="fas fa-minus"></i>',ee.title=o.t("minimize"))),A&&A.addEventListener("click",()=>{if(!e.imageLoaded){o.showAlert(o.t("missingRequirements"),"error");return}o.saveProgress()?($("autoSaved","success"),o.showAlert(o.t("autoSaved"),"success")):o.showAlert(o.t("errorSavingProgress"),"error")}),W&&W.addEventListener("click",()=>{if(!e.initialSetupComplete){o.showAlert(o.t("pleaseWaitInitialSetup"),"warning");return}let b=o.loadProgress();if(!b){$("noSavedData","warning"),o.showAlert(o.t("noSavedData"),"warning");return}confirm(`${o.t("savedDataFound")}

Saved: ${new Date(b.timestamp).toLocaleString()}
Progress: ${b.state.paintedPixels}/${b.state.totalPixels} pixels`)&&(o.restoreProgress(b)?($("dataLoaded","success"),o.showAlert(o.t("dataLoaded"),"success"),lt(),Ne(),o.restoreOverlayFromData().catch(O=>{console.error("Failed to restore overlay from localStorage:",O)}),e.colorsChecked?(m.disabled=!1,y.disabled=!1):m.disabled=!1,e.imageLoaded&&e.startPosition&&e.region&&e.colorsChecked&&(S.disabled=!1)):o.showAlert(o.t("errorLoadingProgress"),"error"))}),G&&G.addEventListener("click",()=>{o.saveProgressToFile()?($("fileSaved","success"),o.showAlert(o.t("fileSaved"),"success")):o.showAlert(o.t("fileError"),"error")}),J&&J.addEventListener("click",async()=>{if(!e.initialSetupComplete){o.showAlert(o.t("pleaseWaitFileSetup"),"warning");return}try{await o.loadProgressFromFile()&&($("fileLoaded","success"),o.showAlert(o.t("fileLoaded"),"success"),lt(),await Ne(),await o.restoreOverlayFromData().catch(E=>{console.error("Failed to restore overlay from file:",E)}),e.colorsChecked?(m.disabled=!1,y.disabled=!1,f.disabled=!1):m.disabled=!1,e.imageLoaded&&e.startPosition&&e.region&&e.colorsChecked&&(S.disabled=!1))}catch(b){b.message==="Invalid JSON file"?o.showAlert(o.t("invalidFileFormat"),"error"):o.showAlert(o.t("fileError"),"error")}}),$=(b,E="default",B={},O=!1)=>{let K=o.t(b,B);Te.textContent=K,Te.className=`wplace-status status-${E}`,O||(Te.style.animation="none",Te.offsetWidth,Te.style.animation="slide-in 0.3s ease-out")};function Ba(b){let E=document.getElementById("wplace-stat-charges-value"),B=document.getElementById("wplace-stat-fullcharge-value");if(!B&&!E)return;if(!e.fullChargeData){B.textContent="--:--:--";return}let{current:O,max:K,cooldownMs:Y,startTime:ge,spentSinceShot:he}=e.fullChargeData,ce=(Date.now()-ge)/Y,ne=O+ce-he,H=Math.min(ne,K),ue;H-Math.floor(H)>=.95?ue=Math.ceil(H):ue=Math.floor(H),e.displayCharges=Math.max(0,ue),e.preciseCurrentCharges=H;let De=Qt(H,K,e.cooldown,b),pe=o.msToTimeText(De);E&&(E.innerHTML=`${e.displayCharges} / ${e.maxCharges}`),e.displayCharges<e.cooldownChargeThreshold&&!e.stopFlag&&e.running&&rn(b),B&&(e.displayCharges>=K?B.innerHTML='<span style="color:#10b981;">FULL</span>':B.innerHTML=`
            <span style="color:#f59e0b;">${pe}</span>
          `)}Ne=async(b=!1)=>{var De,pe;let E=b,B=!((De=e.fullChargeData)!=null&&De.startTime),O=6e4,Y=O+Math.random()*(9e4-O),he=Date.now()-(((pe=e.fullChargeData)==null?void 0:pe.startTime)||0)>=Y;if(E||B||he){let{charges:L,max:D,cooldown:N}=await Ta.getCharges();e.displayCharges=Math.floor(L),e.preciseCurrentCharges=L,e.cooldown=N,e.maxCharges=Math.floor(D)>1?Math.floor(D):e.maxCharges,e.fullChargeData={current:L,max:D,cooldownMs:N,startTime:Date.now(),spentSinceShot:0},We.maybeNotifyChargesReached()}e.fullChargeInterval&&(clearInterval(e.fullChargeInterval),e.fullChargeInterval=null);let ce=1e3;e.fullChargeInterval=setInterval(()=>Ba(ce),ce),et.max!==e.maxCharges&&(et.max=e.maxCharges);let ne="";if(e.imageLoaded){let L=e.totalPixels>0?Math.round(e.paintedPixels/e.totalPixels*100):0,D=e.totalPixels-e.paintedPixels;e.estimatedTime=o.calculateEstimatedTime(D,e.displayCharges,e.cooldown),Ze.style.width=`${L}%`,ne=`
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-image"></i> ${o.t("progress")}</div>
            <div class="wplace-stat-value">${L}%</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${o.t("pixels")}</div>
            <div class="wplace-stat-value">${e.paintedPixels}/${e.totalPixels}</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${o.t("estimatedTime")}</div>
            <div class="wplace-stat-value">${o.formatTime(e.estimatedTime)}</div>
          </div>
        `}let H="";e.availableColors=e.availableColors.filter(L=>L.name!=="Unknown CoIor NaN"&&L.id!==null);let ue=o.extractAvailableColors(),ke=Array.isArray(ue)?ue.length:0;if(ke===0&&b)o.showAlert(o.t("noColorsFound"),"warning");else if(ke>0&&e.availableColors.length<ke){let L=e.availableColors.length;o.showAlert(o.t("colorsUpdated",{oldCount:L,newCount:ke,diffCount:ke-L}),"success"),e.availableColors=ue}e.colorsChecked&&(H=e.availableColors.map(L=>`<div class="wplace-stat-color-swatch" style="background-color: ${`rgb(${L.rgb.join(",")})`};" title="${o.t("colorTooltip",{id:L.id,rgb:L.rgb.join(", ")})}"></div>`).join("")),ct.innerHTML=`
            ${ne}
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-bolt"></i> ${o.t("charges")}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-charges-value">
                ${e.displayCharges} / ${e.maxCharges}
              </div>
            </div>
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-battery-half"></i> ${o.t("fullChargeIn")}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-fullcharge-value">--:--:--</div>
            </div>
            ${e.colorsChecked?`
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${o.t("availableColors",{count:e.availableColors.length})}</div>
                <div class="wplace-stat-colors-grid">
                    ${H}
                </div>
            </div>
            `:""}
        `,Ba(ce)},lt=()=>{let b=e.imageLoaded&&e.imageData;A.disabled=!b,G.disabled=!b},lt();function yn(b){var Ga;let E=b,B,O;if((Ga=e.originalImage)!=null&&Ga.dataUrl)E=new Kt(e.originalImage.dataUrl),B=e.originalImage.width,O=e.originalImage.height;else{let h=b.getDimensions();B=h.width,O=h.height}let K=B/O,Y=e.resizeSettings;Me.max=B*2,Ae.max=O*2;let ge=B,he=O;Y&&Number.isFinite(Y.width)&&Number.isFinite(Y.height)&&Y.width>0&&Y.height>0&&(ge=Y.width,he=Y.height),ge=Math.max(parseInt(Me.min,10)||10,Math.min(ge,parseInt(Me.max,10))),he=Math.max(parseInt(Ae.min,10)||10,Math.min(he,parseInt(Ae.max,10))),Me.value=ge,Ae.value=he,Ia.textContent=ge,Ea.textContent=he,$e.value=1,Pt&&(Pt.textContent="100%"),Aa.checked=e.paintWhitePixels,za.checked=e.paintTransparentPixels;let se=null,ce=0,ne=!1,H=1,ue=null,ke=null,De=h=>((!ue||ue.length!==h*3)&&(ue=new Float32Array(h*3)),(!ke||ke.length!==h)&&(ke=new Uint8Array(h)),{work:ue,eligible:ke}),pe=null,L=null,D=null,N=()=>{D={minX:1/0,minY:1/0,maxX:-1,maxY:-1}},Ge=(h,x)=>{D||N(),h<D.minX&&(D.minX=h),x<D.minY&&(D.minY=x),h>D.maxX&&(D.maxX=h),x>D.maxY&&(D.maxY=x)},It=()=>{if(!D||D.maxX<D.minX||D.maxY<D.minY)return;let h=Math.max(0,D.minX),x=Math.max(0,D.minY),k=Math.min(ve.width-h,D.maxX-h+1),C=Math.min(ve.height-x,D.maxY-x+1);k>0&&C>0&&qe.putImageData(pe,0,0,h,x,k,C),N()},st=(h,x,k=!1)=>{if((!pe||pe.width!==h||pe.height!==x)&&(pe=qe.createImageData(h,x),L=pe.data,k=!0),k){let C=e.resizeIgnoreMask,P=L;if(P.fill(0),C){for(let M=0;M<C.length;M++)if(C[M]){let te=M*4;P[te]=255,P[te+1]=0,P[te+2]=0,P[te+3]=150}}qe.putImageData(pe,0,0),N()}},Et=(h,x)=>{(!e.resizeIgnoreMask||e.resizeIgnoreMask.length!==h*x)&&(e.resizeIgnoreMask=new Uint8Array(h*x)),V.width=h,V.height=x,ve.width=h,ve.height=x,qe.clearRect(0,0,ve.width,ve.height),st(h,x,!0)};we=async()=>{let h=++ce,x=parseInt(Me.value,10),k=parseInt(Ae.value,10);if(H=parseFloat($e.value),Ia.textContent=x,Ea.textContent=k,Et(x,k),mt.style.width=x+"px",mt.style.height=k+"px",tt.imageSmoothingEnabled=!1,!e.availableColors||e.availableColors.length===0){E!==b&&(!E.img||!E.canvas)&&await E.load(),tt.clearRect(0,0,x,k),tt.drawImage(E.img,0,0,x,k),qe.clearRect(0,0,ve.width,ve.height),pe&&qe.putImageData(pe,0,0),la();return}E!==b&&(!E.img||!E.canvas)&&await E.load(),tt.clearRect(0,0,x,k),tt.drawImage(E.img,0,0,x,k);let C=tt.getImageData(0,0,x,k),P=C.data,M=e.customTransparencyThreshold||w.TRANSPARENCY_THRESHOLD,te=()=>{let z=x,_=k,le=z*_,{work:R,eligible:X}=De(le);for(let U=0;U<_;U++)for(let de=0;de<z;de++){let ae=U*z+de,Se=ae*4,Ie=P[Se],Q=P[Se+1],ie=P[Se+2],oe=P[Se+3],fe=(e.paintTransparentPixels||oe>=M)&&(e.paintWhitePixels||!o.isWhitePixel(Ie,Q,ie));X[ae]=fe?1:0,R[ae*3]=Ie,R[ae*3+1]=Q,R[ae*3+2]=ie,fe||(P[Se+3]=0)}let F=(U,de,ae,Se,Ie,Q)=>{if(U<0||U>=z||de<0||de>=_)return;let ie=de*z+U;if(!X[ie])return;let oe=ie*3;R[oe]=Math.min(255,Math.max(0,R[oe]+ae*Q)),R[oe+1]=Math.min(255,Math.max(0,R[oe+1]+Se*Q)),R[oe+2]=Math.min(255,Math.max(0,R[oe+2]+Ie*Q))};for(let U=0;U<_;U++)for(let de=0;de<z;de++){let ae=U*z+de;if(!X[ae])continue;let Se=ae*3,Ie=R[Se],Q=R[Se+1],ie=R[Se+2],[oe,fe,Le]=o.findClosestPaletteColor(Ie,Q,ie,e.activeColorPalette),Ee=ae*4;P[Ee]=oe,P[Ee+1]=fe,P[Ee+2]=Le,P[Ee+3]=255;let ze=Ie-oe,Ce=Q-fe,Ke=ie-Le;F(de+1,U,ze,Ce,Ke,7/16),F(de-1,U+1,ze,Ce,Ke,3/16),F(de,U+1,ze,Ce,Ke,5/16),F(de+1,U+1,ze,Ce,Ke,1/16)}};if(e.ditheringEnabled&&!ne)te();else for(let z=0;z<P.length;z+=4){let _=P[z],le=P[z+1],R=P[z+2],X=P[z+3];if(!e.paintTransparentPixels&&X<M||!e.paintWhitePixels&&o.isWhitePixel(_,le,R)){P[z+3]=0;continue}let[F,U,de]=o.findClosestPaletteColor(_,le,R,e.activeColorPalette);P[z]=F,P[z+1]=U,P[z+2]=de,P[z+3]=255}h===ce&&(tt.putImageData(C,0,0),qe.clearRect(0,0,ve.width,ve.height),pe&&qe.putImageData(pe,0,0),la())};let Mt=()=>{Ma.checked&&(Ae.value=Math.round(parseInt(Me.value,10)/K)),we();let h=parseInt(Me.value,10),x=parseInt(Ae.value,10);e.resizeSettings={baseWidth:B,baseHeight:O,width:h,height:x},q();let k=typeof Ye=="function"?Ye():1;!isNaN(k)&&isFinite(k)&&Oe(k)},At=()=>{Ma.checked&&(Me.value=Math.round(parseInt(Ae.value,10)*K)),we();let h=parseInt(Me.value,10),x=parseInt(Ae.value,10);e.resizeSettings={baseWidth:B,baseHeight:O,width:h,height:x},q();let k=typeof Ye=="function"?Ye():1;!isNaN(k)&&isFinite(k)&&Oe(k)};Aa.onchange=h=>{e.paintWhitePixels=h.target.checked,we(),q()},za.onchange=h=>{e.paintTransparentPixels=h.target.checked,we(),q()};let ye=0,j=0,kn=()=>{let h=(me==null?void 0:me.getBoundingClientRect())||{width:0,height:0},x=(V.width||1)*H,k=(V.height||1)*H;if(x<=h.width)ye=Math.floor((h.width-x)/2);else{let C=h.width-x;ye=Math.min(0,Math.max(C,ye))}if(k<=h.height)j=Math.floor((h.height-k)/2);else{let C=h.height-k;j=Math.min(0,Math.max(C,j))}},sa=0,zt=()=>{sa||(sa=requestAnimationFrame(()=>{kn(),mt.style.transform=`translate3d(${Math.round(ye)}px, ${Math.round(j)}px, 0) scale(${H})`,sa=0}))},la=()=>{let h=V.width||1,x=V.height||1;V.style.width=h+"px",V.style.height=x+"px",ve.style.width=h+"px",ve.style.height=x+"px",mt.style.width=h+"px",mt.style.height=x+"px",zt()},Oe=h=>{H=Math.max(.05,Math.min(20,h||1)),$e.value=H,la(),Pt&&(Pt.textContent=`${Math.round(H*100)}%`)};$e.addEventListener("input",()=>{Oe(parseFloat($e.value))}),gt&&gt.addEventListener("click",()=>Oe(parseFloat($e.value)+.1)),ht&&ht.addEventListener("click",()=>Oe(parseFloat($e.value)-.1));let Ye=()=>{let h=me==null?void 0:me.getBoundingClientRect();if(!h)return 1;let x=V.width||1,k=V.height||1,C=10,P=(h.width-C)/x,M=(h.height-C)/k;return Math.max(.05,Math.min(20,Math.min(P,M)))};Da&&Da.addEventListener("click",()=>{Oe(Ye()),ft()}),La&&La.addEventListener("click",()=>{Oe(1),ft()});let ft=()=>{if(!me)return;let h=me.getBoundingClientRect(),x=(V.width||1)*H,k=(V.height||1)*H;ye=Math.floor((h.width-x)/2),j=Math.floor((h.height-k)/2),zt()},Ve=!1,Dt=0,Lt=0,Bt=0,Ot=0,Xe=!1,at=!1,Sn=h=>h.button===1||h.button===2,nt=h=>{me&&(me.style.cursor=h)},Tn=h=>at||Xe||Sn(h),Fa=()=>{ut&&(ut.classList.toggle("active",at),ut.setAttribute("aria-pressed",at?"true":"false"))};if(ut&&(Fa(),ut.addEventListener("click",()=>{at=!at,Fa(),nt(at?"grab":"")})),me){me.addEventListener("contextmenu",C=>{Xe&&C.preventDefault()}),window.addEventListener("keydown",C=>{C.code==="Space"&&(Xe=!0,nt("grab"))}),window.addEventListener("keyup",C=>{C.code==="Space"&&(Xe=!1,Ve||nt(""))}),me.addEventListener("mousedown",C=>{Tn(C)&&(C.preventDefault(),Ve=!0,Dt=C.clientX,Lt=C.clientY,Bt=ye,Ot=j,nt("grabbing"))}),window.addEventListener("mousemove",C=>{if(!Ve)return;let P=C.clientX-Dt,M=C.clientY-Lt;ye=Bt+P,j=Ot+M,zt()}),window.addEventListener("mouseup",()=>{Ve&&(Ve=!1,nt(Xe?"grab":""))}),me.addEventListener("wheel",C=>{if(!C.ctrlKey&&!C.metaKey)return;C.preventDefault();let P=me.getBoundingClientRect(),M=C.clientX-P.left-ye,te=C.clientY-P.top-j,z=H,_=Math.max(.05,Math.min(.5,Math.abs(C.deltaY)>20?.2:.1)),le=Math.max(.05,Math.min(20,z+(C.deltaY>0?-_:_)));if(le===z)return;let R=le/z;ye=ye-M*(R-1),j=j-te*(R-1),Oe(le)},{passive:!1});let h=null,x=0,k=null;me.addEventListener("touchstart",C=>{if(C.touches.length===1){let P=C.touches[0];Ve=!0,Dt=P.clientX,Lt=P.clientY,Bt=ye,Ot=j,nt("grabbing");let M=Date.now();if(M-x<300){let te=Math.abs(H-1)<.01?Ye():1;Oe(te),ft(),k&&clearTimeout(k)}else x=M,k=setTimeout(()=>{k=null},320)}else if(C.touches.length===2){let[P,M]=C.touches;h=Math.hypot(M.clientX-P.clientX,M.clientY-P.clientY)}},{passive:!0}),me.addEventListener("touchmove",C=>{if(C.touches.length===1&&Ve){let P=C.touches[0],M=P.clientX-Dt,te=P.clientY-Lt;ye=Bt+M,j=Ot+te,zt()}else if(C.touches.length===2&&h!=null){C.preventDefault();let[P,M]=C.touches,te=Math.hypot(M.clientX-P.clientX,M.clientY-P.clientY),z=me.getBoundingClientRect(),_=(P.clientX+M.clientX)/2-z.left-ye,le=(P.clientY+M.clientY)/2-z.top-j,R=H,X=te/(h||te),F=Math.max(.05,Math.min(20,R*X));F!==R&&(ye=ye-_*(F/R-1),j=j-le*(F/R-1),Oe(F)),h=te}},{passive:!1}),me.addEventListener("touchend",()=>{Ve=!1,h=null,nt(at||Xe?"grab":"")})}let ca=()=>{se&&clearTimeout(se);let h=()=>{se=null,we()};window.requestIdleCallback?se=setTimeout(()=>requestIdleCallback(h,{timeout:150}),50):se=setTimeout(()=>requestAnimationFrame(h),50)},$a=()=>{ne=!0},Wa=()=>{ne=!1,ca()};Me.addEventListener("pointerdown",$a),Ae.addEventListener("pointerdown",$a),Me.addEventListener("pointerup",Wa),Ae.addEventListener("pointerup",Wa),Me.addEventListener("input",()=>{Mt(),ca()}),Ae.addEventListener("input",()=>{At(),ca()});let Rt=!1,Cn=-1,Pn=-1,Nt=1,wt=1,je="ignore",bt=u.querySelector("#maskBrushSize"),da=u.querySelector("#maskBrushSizeValue"),pa=u.querySelector("#maskModeIgnore"),ga=u.querySelector("#maskModeUnignore"),ha=u.querySelector("#maskModeToggle"),_a=u.querySelector("#clearIgnoredBtn"),Ua=u.querySelector("#invertMaskBtn"),vt=u.querySelector("#rowColSize"),ua=u.querySelector("#rowColSizeValue"),Ha=()=>{let h=[[pa,"ignore"],[ga,"unignore"],[ha,"toggle"]];for(let[x,k]of h){if(!x)continue;let C=je===k;x.classList.toggle("active",C),x.setAttribute("aria-pressed",C?"true":"false")}},ma=h=>{je=h,Ha()};bt&&da&&(bt.addEventListener("input",()=>{Nt=parseInt(bt.value,10)||1,da.textContent=Nt}),da.textContent=bt.value,Nt=parseInt(bt.value,10)||1),vt&&ua&&(vt.addEventListener("input",()=>{wt=parseInt(vt.value,10)||1,ua.textContent=wt}),ua.textContent=vt.value,wt=parseInt(vt.value,10)||1),pa&&pa.addEventListener("click",()=>ma("ignore")),ga&&ga.addEventListener("click",()=>ma("unignore")),ha&&ha.addEventListener("click",()=>ma("toggle")),Ha();let In=(h,x)=>{let k=V.getBoundingClientRect(),C=k.width/V.width,P=k.height/V.height,M=(h-k.left)/C,te=(x-k.top)/P,z=Math.floor(M),_=Math.floor(te);return{x:z,y:_}},fa=(h,x)=>{(!e.resizeIgnoreMask||e.resizeIgnoreMask.length!==h*x)&&(e.resizeIgnoreMask=new Uint8Array(h*x))},En=(h,x,k,C)=>{let P=V.width,M=V.height;fa(P,M);let te=k*k;for(let z=x-k;z<=x+k;z++)if(!(z<0||z>=M))for(let _=h-k;_<=h+k;_++){if(_<0||_>=P)continue;let le=_-h,R=z-x;if(le*le+R*R<=te){let X=z*P+_,F=e.resizeIgnoreMask[X];if(je==="toggle"?F=F?0:1:je==="ignore"?F=1:F=0,e.resizeIgnoreMask[X]=F,L){let U=X*4;F?(L[U]=255,L[U+1]=0,L[U+2]=0,L[U+3]=150):(L[U]=0,L[U+1]=0,L[U+2]=0,L[U+3]=0),Ge(_,z)}}}},Mn=(h,x)=>{let k=V.width,C=V.height;if(fa(k,C),h<0||h>=C)return;let P=Math.floor(wt/2),M=Math.max(0,h-P),te=Math.min(C-1,h+P);for(let z=M;z<=te;z++){for(let _=0;_<k;_++){let le=z*k+_,R=e.resizeIgnoreMask[le];if(je==="toggle"?R=R?0:1:je==="ignore"?R=1:R=0,e.resizeIgnoreMask[le]=R,L){let X=le*4;R?(L[X]=255,L[X+1]=0,L[X+2]=0,L[X+3]=150):(L[X]=0,L[X+1]=0,L[X+2]=0,L[X+3]=0)}}L&&(Ge(0,z),Ge(k-1,z))}},An=(h,x)=>{let k=V.width,C=V.height;if(fa(k,C),h<0||h>=k)return;let P=Math.floor(wt/2),M=Math.max(0,h-P),te=Math.min(k-1,h+P);for(let z=M;z<=te;z++){for(let _=0;_<C;_++){let le=_*k+z,R=e.resizeIgnoreMask[le];if(je==="toggle"?R=R?0:1:je==="ignore"?R=1:R=0,e.resizeIgnoreMask[le]=R,L){let X=le*4;R?(L[X]=255,L[X+1]=0,L[X+2]=0,L[X+3]=150):(L[X]=0,L[X+1]=0,L[X+2]=0,L[X+3]=0)}}L&&(Ge(z,0),Ge(z,C-1))}},zn=()=>{It()},qa=h=>{if((h.buttons&4)===4||(h.buttons&2)===2||Xe)return;let{x,y:k}=In(h.clientX,h.clientY),C=V.width,P=V.height;if(x<0||k<0||x>=C||k>=P)return;let M=Math.max(1,Math.floor(Nt/2));h.shiftKey?Mn(k):h.altKey?An(x):En(x,k,M),Cn=x,Pn=k,zn()};ve.addEventListener("mousedown",h=>{h.button===1||h.button===2||Xe||(Rt=!0,qa(h))}),ve.addEventListener("touchstart",h=>{},{passive:!0}),ve.addEventListener("touchmove",h=>{},{passive:!0}),ve.addEventListener("touchend",h=>{},{passive:!0}),window.addEventListener("mousemove",h=>{Rt&&qa(h)}),window.addEventListener("mouseup",()=>{Rt&&(Rt=!1,q())}),_a&&_a.addEventListener("click",()=>{let h=V.width,x=V.height;e.resizeIgnoreMask&&e.resizeIgnoreMask.fill(0),st(h,x,!0),we(),q()}),Ua&&Ua.addEventListener("click",()=>{if(!e.resizeIgnoreMask)return;for(let k=0;k<e.resizeIgnoreMask.length;k++)e.resizeIgnoreMask[k]=e.resizeIgnoreMask[k]?0:1;let h=V.width,x=V.height;st(h,x,!0),we(),q()}),un.onclick=async()=>{let h=parseInt(Me.value,10),x=parseInt(Ae.value,10),k=document.createElement("canvas"),C=k.getContext("2d");k.width=h,k.height=x,C.imageSmoothingEnabled=!1,E!==b&&(!E.img||!E.canvas)&&await E.load(),C.drawImage(E.img,0,0,h,x);let P=C.getImageData(0,0,h,x),M=P.data,te=e.customTransparencyThreshold||w.TRANSPARENCY_THRESHOLD,z=0,_=e.resizeIgnoreMask&&e.resizeIgnoreMask.length===h*x?e.resizeIgnoreMask:null,le=async()=>{let F=h,U=x,de=F*U,{work:ae,eligible:Se}=De(de);for(let Q=0;Q<U;Q++){for(let ie=0;ie<F;ie++){let oe=Q*F+ie,fe=oe*4,Le=M[fe],Ee=M[fe+1],ze=M[fe+2],Ce=M[fe+3],yt=!(_&&_[oe])&&(e.paintTransparentPixels||Ce>=te)&&(e.paintWhitePixels||!o.isWhitePixel(Le,Ee,ze));Se[oe]=yt?1:0,ae[oe*3]=Le,ae[oe*3+1]=Ee,ae[oe*3+2]=ze,yt||(M[fe+3]=0)}Q&15||await Promise.resolve()}let Ie=(Q,ie,oe,fe,Le,Ee)=>{if(Q<0||Q>=F||ie<0||ie>=U)return;let ze=ie*F+Q;if(!Se[ze])return;let Ce=ze*3;ae[Ce]=Math.min(255,Math.max(0,ae[Ce]+oe*Ee)),ae[Ce+1]=Math.min(255,Math.max(0,ae[Ce+1]+fe*Ee)),ae[Ce+2]=Math.min(255,Math.max(0,ae[Ce+2]+Le*Ee))};for(let Q=0;Q<U;Q++){for(let ie=0;ie<F;ie++){let oe=Q*F+ie;if(!Se[oe])continue;let fe=oe*3,Le=ae[fe],Ee=ae[fe+1],ze=ae[fe+2],[Ce,Ke,yt]=o.findClosestPaletteColor(Le,Ee,ze,e.activeColorPalette),Ft=oe*4;M[Ft]=Ce,M[Ft+1]=Ke,M[Ft+2]=yt,M[Ft+3]=255,z++;let $t=Le-Ce,Wt=Ee-Ke,_t=ze-yt;Ie(ie+1,Q,$t,Wt,_t,7/16),Ie(ie-1,Q+1,$t,Wt,_t,3/16),Ie(ie,Q+1,$t,Wt,_t,5/16),Ie(ie+1,Q+1,$t,Wt,_t,1/16)}await Promise.resolve()}};if(e.ditheringEnabled)await le();else for(let F=0;F<M.length;F+=4){let U=M[F],de=M[F+1],ae=M[F+2],Se=M[F+3],Ie=_&&_[F>>2],Q=!e.paintTransparentPixels&&Se<te||Ie,ie=!e.paintWhitePixels&&o.isWhitePixel(U,de,ae);if(Q||ie){M[F+3]=0;continue}z++;let[oe,fe,Le]=o.findClosestPaletteColor(U,de,ae,e.activeColorPalette);M[F]=oe,M[F+1]=fe,M[F+2]=Le,M[F+3]=255}C.putImageData(P,0,0);let R=new Uint8ClampedArray(P.data);e.imageData.pixels=R,e.imageData.width=h,e.imageData.height=x,e.imageData.totalPixels=z,e.totalPixels=z,e.paintedPixels=0,e.resizeSettings={baseWidth:B,baseHeight:O,width:h,height:x},q();let X=await createImageBitmap(k);await Pe.setImage(X),Pe.enable(),re.classList.add("active"),re.setAttribute("aria-pressed","true"),Ne(),$("resizeSuccess","success",{width:h,height:x}),Oa()},fn.onclick=()=>{try{let h=V.width,x=V.height,k=document.createElement("canvas");k.width=h,k.height=x;let C=k.getContext("2d");C.imageSmoothingEnabled=!1,C.drawImage(V,0,0),C.drawImage(ve,0,0);let P=document.createElement("a");P.download="wplace-preview.png",P.href=k.toDataURL(),P.click()}catch(h){console.warn("Failed to download preview:",h)}},mn.onclick=Oa,T.style.display="block",u.style.display="block",on(u),we(),xt=()=>{try{$e.replaceWith($e.cloneNode(!0))}catch{}try{gt&&gt.replaceWith(gt.cloneNode(!0))}catch{}try{ht&&ht.replaceWith(ht.cloneNode(!0))}catch{}},setTimeout(()=>{if(typeof Ye=="function"){let h=Ye();!isNaN(h)&&isFinite(h)&&(Oe(h),ft())}else ft()},0)}function Oa(){try{typeof xt=="function"&&xt()}catch{}T.style.display="none",u.style.display="none",we=()=>{};try{typeof cancelAnimationFrame=="function"&&_panRaf&&cancelAnimationFrame(_panRaf)}catch{}try{_previewTimer&&(clearTimeout(_previewTimer),_previewTimer=null)}catch{}_maskImageData=null,_maskData=null,_dirty=null,_ditherWorkBuf=null,_ditherEligibleBuf=null,xt=null}m&&m.addEventListener("click",async()=>{let b=o.extractAvailableColors();if(b===null||b.length<10){$("noColorsFound","error"),o.showAlert(o.t("noColorsFound"),"error");return}e.colorsChecked||(e.availableColors=b,e.colorsChecked=!0,$("colorsFound","success",{count:b.length}),Ne(),y.disabled=!1,e.imageLoaded&&(f.disabled=!1));try{$("loadingImage","default");let E=await o.createImageUploader();if(!E){$("colorsFound","success",{count:e.availableColors.length});return}let B=new Kt(E);await B.load();let{width:O,height:K}=B.getDimensions(),Y=B.getPixelData(),ge=0;for(let se=0;se<Y.length;se+=4){let ce=!e.paintTransparentPixels&&Y[se+3]<(e.customTransparencyThreshold||w.TRANSPARENCY_THRESHOLD),ne=!e.paintWhitePixels&&o.isWhitePixel(Y[se],Y[se+1],Y[se+2]);!ce&&!ne&&ge++}e.imageData={width:O,height:K,pixels:Y,totalPixels:ge,processor:B},e.totalPixels=ge,e.paintedPixels=0,e.imageLoaded=!0,e.lastPosition={x:0,y:0},o.initializePaintedMap(O,K),e.resizeSettings=null,e.resizeIgnoreMask=null,e.originalImage={dataUrl:E,width:O,height:K},q();let he=await createImageBitmap(B.img);await Pe.setImage(he),Pe.enable(),re.disabled=!1,re.classList.add("active"),re.setAttribute("aria-pressed","true"),e.colorsChecked&&(f.disabled=!1),A.disabled=!1,e.startPosition&&(S.disabled=!1),Ne(),lt(),$("imageLoaded","success",{count:ge})}catch{$("imageError","error")}}),f&&f.addEventListener("click",()=>{e.imageLoaded&&e.imageData.processor&&e.colorsChecked?yn(e.imageData.processor):e.colorsChecked||o.showAlert(o.t("uploadImageFirstColors"),"warning")}),y&&y.addEventListener("click",async()=>{if(e.selectingPosition)return;e.selectingPosition=!0,e.startPosition=null,e.region=null,S.disabled=!0,o.showAlert(o.t("selectPositionAlert"),"info"),$("waitingPosition","default");let b=async(B,O)=>{var K;if(typeof B=="string"&&B.includes("https://backend.wplace.live/s0/pixel/")&&((K=O==null?void 0:O.method)==null?void 0:K.toUpperCase())==="POST")try{let Y=await E(B,O),he=await Y.clone().json();if((he==null?void 0:he.painted)===1){let se=B.match(/\/pixel\/(\d+)\/(\d+)/);se&&se.length>=3&&(e.region={x:Number.parseInt(se[1]),y:Number.parseInt(se[2])});let ce=JSON.parse(O.body);ce!=null&&ce.coords&&Array.isArray(ce.coords)&&(e.startPosition={x:ce.coords[0],y:ce.coords[1]},e.lastPosition={x:0,y:0},await Pe.setPosition(e.startPosition,e.region),e.imageLoaded&&(S.disabled=!1),window.fetch=E,e.selectingPosition=!1,$("positionSet","success"))}return Y}catch{return E(B,O)}return E(B,O)},E=window.fetch;window.fetch=b,setTimeout(()=>{e.selectingPosition&&(window.fetch=E,e.selectingPosition=!1,$("positionTimeout","error"),o.showAlert(o.t("positionTimeout"),"error"))},12e4)});async function xn(){if(!e.imageLoaded||!e.startPosition||!e.region){$("missingRequirements","error");return}if(await ka(),!!be){e.running=!0,e.stopFlag=!1,S.disabled=!0,I.disabled=!1,m.disabled=!0,y.disabled=!0,f.disabled=!0,A.disabled=!0,re.disabled=!0,$("startPaintingMsg","success");try{await ln()}catch(b){console.error("Unexpected error:",b),$("paintingError","error")}finally{e.running=!1,I.disabled=!0,A.disabled=!1,e.stopFlag?S.disabled=!1:(S.disabled=!0,m.disabled=!1,y.disabled=!1,f.disabled=!1),re.disabled=!1}}}S&&S.addEventListener("click",xn),I&&I.addEventListener("click",()=>{e.stopFlag=!0,e.running=!1,I.disabled=!0,$("paintingStoppedByUser","warning"),e.imageLoaded&&e.paintedPixels>0&&(o.saveProgress(),o.showAlert(o.t("autoSaved"),"success"))}),setTimeout(()=>{let b=o.loadProgress();if(b&&b.state.paintedPixels>0){let E=new Date(b.timestamp).toLocaleString(),B=Math.round(b.state.paintedPixels/b.state.totalPixels*100);o.showAlert(`${o.t("savedDataFound")}

Saved: ${E}
Progress: ${b.state.paintedPixels}/${b.state.totalPixels} pixels (${B}%)
${o.t("clickLoadToContinue")}`,"info")}},1e3),et&&dt&&et.addEventListener("input",b=>{let E=parseInt(b.target.value);e.cooldownChargeThreshold=E,dt.textContent=E,q(),We.resetEdgeTracking()}),gn(),We.syncFromState()}function Qt(t,a,n,i=0){let s=a-t;return Math.max(0,s*n-i)}function rn(t){if(e.stopFlag)return;let a=e.cooldownChargeThreshold,n=Qt(e.preciseCurrentCharges,a,e.cooldown,t),i=o.msToTimeText(n);$("noChargesThreshold","warning",{threshold:a,current:e.displayCharges,time:i},!0)}function sn(t,a,n,i,s,r,d){let g=[];console.log(`Generating coordinates with 
  mode:`,n,`
  direction:`,i,`
  snake:`,s,`
  blockWidth:`,r,`
  blockHeight:`,d);let c,p,l,v,u,T;switch(i){case"top-left":c=0,p=t,l=1,v=0,u=a,T=1;break;case"top-right":c=t-1,p=-1,l=-1,v=0,u=a,T=1;break;case"bottom-left":c=0,p=t,l=1,v=a-1,u=-1,T=-1;break;case"bottom-right":c=t-1,p=-1,l=-1,v=a-1,u=-1,T=-1;break;default:throw new Error(`Unknown direction: ${i}`)}if(n==="rows")for(let m=v;m!==u;m+=T)if(s&&(m-v)%2!==0)for(let f=p-l;f!==c-l;f-=l)g.push([f,m]);else for(let f=c;f!==p;f+=l)g.push([f,m]);else if(n==="columns")for(let m=c;m!==p;m+=l)if(s&&(m-c)%2!==0)for(let f=u-T;f!==v-T;f-=T)g.push([m,f]);else for(let f=v;f!==u;f+=T)g.push([m,f]);else if(n==="circle-out"){let m=Math.floor(t/2),f=Math.floor(a/2),y=Math.ceil(Math.sqrt(m*m+f*f));for(let S=0;S<=y;S++)for(let I=f-S;I<=f+S;I++)for(let A=m-S;A<=m+S;A++)A>=0&&A<t&&I>=0&&I<a&&Math.max(Math.abs(A-m),Math.abs(I-f))===S&&g.push([A,I])}else if(n==="circle-in"){let m=Math.floor(t/2),f=Math.floor(a/2),y=Math.ceil(Math.sqrt(m*m+f*f));for(let S=y;S>=0;S--)for(let I=f-S;I<=f+S;I++)for(let A=m-S;A<=m+S;A++)A>=0&&A<t&&I>=0&&I<a&&Math.max(Math.abs(A-m),Math.abs(I-f))===S&&g.push([A,I])}else if(n==="blocks"||n==="shuffle-blocks"){let m=[];for(let f=0;f<a;f+=d)for(let y=0;y<t;y+=r){let S=[];for(let I=f;I<Math.min(f+d,a);I++)for(let A=y;A<Math.min(y+r,t);A++)S.push([A,I]);m.push(S)}if(n==="shuffle-blocks")for(let f=m.length-1;f>0;f--){let y=Math.floor(Math.random()*(f+1));[m[f],m[y]]=[m[y],m[f]]}for(let f of m)g.push(...f)}else throw new Error(`Unknown mode: ${n}`);return g}async function Tt(t){if(!t||t.pixels.length===0)return!0;let a=t.pixels.length;console.log(`\u{1F4E6} Sending batch with ${a} pixels (region: ${t.regionX},${t.regionY})`);let n=await dn(t.pixels,t.regionX,t.regionY);if(n){if(t.pixels.forEach(i=>{e.paintedPixels++,o.markPixelPainted(i.x,i.y,t.regionX,t.regionY)}),e.fullChargeData={...e.fullChargeData,spentSinceShot:e.fullChargeData.spentSinceShot+a},Ne(),$("paintingProgress","default",{painted:e.paintedPixels,total:e.totalPixels}),o.performSmartSave(),w.PAINTING_SPEED_ENABLED&&e.paintingSpeed>0&&a>0){let i=1e3/e.paintingSpeed,s=Math.max(100,i*a);await o.sleep(s)}}else console.error("\u274C Batch failed permanently after retries. Stopping painting."),e.stopFlag=!0,$("paintingBatchFailed","error");return t.pixels=[],n}async function ln(){let{width:t,height:a,pixels:n}=e.imageData,{x:i,y:s}=e.startPosition,{x:r,y:d}=e.region;if(!await Pe.waitForTiles(r,d,t,a,i,s,1e4)){$("overlayTilesNotLoaded","error"),e.stopFlag=!0;return}let c=null,p={transparent:0,white:0,alreadyPainted:0,colorUnavailable:0},l=e.customTransparencyThreshold||w.TRANSPARENCY_THRESHOLD;function v(T,m){let f=(m*t+T)*4,y=n[f],S=n[f+1],I=n[f+2],A=n[f+3];if(!e.paintTransparentPixels&&A<l)return{eligible:!1,reason:"transparent"};if(!e.paintWhitePixels&&o.isWhitePixel(y,S,I))return{eligible:!1,reason:"white"};let W=o.isWhitePixel(y,S,I)?[255,255,255]:o.findClosestPaletteColor(y,S,I,e.activeColorPalette),G=o.resolveColor(W,e.availableColors,!e.paintUnavailablePixels);return!e.paintUnavailablePixels&&!G.id?{eligible:!1,reason:"colorUnavailable",r:y,g:S,b:I,a:A,mappedColorId:G.id}:{eligible:!0,r:y,g:S,b:I,a:A,mappedColorId:G.id}}function u(T,m,f,y,S){T!=="transparent"&&console.log(`Skipped pixel for ${T} (id: ${m}, (${f.join(", ")})) at (${y}, ${S})`),p[T]++}try{let T=sn(t,a,e.coordinateMode,e.coordinateDirection,e.coordinateSnake,e.blockWidth,e.blockHeight);e:for(let[m,f]of T){if(e.stopFlag){c&&c.pixels.length>0&&(console.log(`\u{1F3AF} Sending last batch before stop with ${c.pixels.length} pixels`),await Tt(c)),e.lastPosition={x:m,y:f},$("paintingPaused","warning",{x:m,y:f});break e}let y=v(m,f),S=i+m,I=s+f,A=Math.floor(S/1e3),W=Math.floor(I/1e3),G=S%1e3,J=I%1e3,ee=y.mappedColorId;if(!y.eligible){u(y.reason,ee,[y.r,y.g,y.b],G,J);continue}if(!c||c.regionX!==r+A||c.regionY!==d+W){if(c&&c.pixels.length>0)if(console.log(`\u{1F30D} Sending region-change batch with ${c.pixels.length} pixels (switching to region ${r+A},${d+W})`),await Tt(c)){if(w.PAINTING_SPEED_ENABLED&&e.paintingSpeed>0&&c.pixels.length>0){let re=Math.max(1,100/e.paintingSpeed),Te=Math.max(100,re*c.pixels.length);await o.sleep(Te)}Ne()}else{console.error("\u274C Batch failed permanently after retries. Stopping painting."),e.stopFlag=!0,$("paintingBatchFailed","error");break e}c={regionX:r+A,regionY:d+W,pixels:[]}}try{let Z=[c.regionX,c.regionY],re=await Pe.getTilePixelColor(Z[0],Z[1],G,J);if(re&&Array.isArray(re)){let Te=o.resolveColor(re.slice(0,3),e.availableColors),Ze=Te.id===ee;if(Ze){u("alreadyPainted",ee,[y.r,y.g,y.b],G,J);continue}console.debug(`[COMPARE] Pixel at \u{1F4CD} (${G}, ${J}) in region (${r+A}, ${d+W})
  \u251C\u2500\u2500 Current color: rgb(${re.slice(0,3).join(", ")}) (id: ${Te.id})
  \u251C\u2500\u2500 Target color:  rgb(${y.r}, ${y.g}, ${y.b}) (id: ${ee})
  \u2514\u2500\u2500 Status: ${Ze?"\u2705 Already painted \u2192 SKIP":"\u{1F534} Needs paint \u2192 PAINT"}
`)}}catch(Z){console.error(`[DEBUG] Error checking existing pixel at (${G}, ${J}):`,Z),$("paintingPixelCheckFailed","error",{x:G,y:J}),e.stopFlag=!0;break e}c.pixels.push({x:G,y:J,color:ee,localX:m,localY:f});let xe=cn();if(c.pixels.length>=xe){let Z=e.batchMode==="random"?`random (${e.randomBatchMin}-${e.randomBatchMax})`:"normal";if(console.log(`\u{1F4E6} Sending batch with ${c.pixels.length} pixels (mode: ${Z}, target: ${xe})`),!await Tt(c)){console.error("\u274C Batch failed permanently after retries. Stopping painting."),e.stopFlag=!0,$("paintingBatchFailed","error");break e}c.pixels=[]}if(e.displayCharges<e.cooldownChargeThreshold&&!e.stopFlag&&await o.dynamicSleep(()=>e.displayCharges>=e.cooldownChargeThreshold?(We.maybeNotifyChargesReached(!0),0):e.stopFlag?0:Qt(e.preciseCurrentCharges,e.cooldownChargeThreshold,e.cooldown)),e.stopFlag)break e}c&&c.pixels.length>0&&!e.stopFlag&&(console.log(`\u{1F3C1} Sending final batch with ${c.pixels.length} pixels`),await Tt(c)||console.warn(`\u26A0\uFE0F Final batch failed with ${c.pixels.length} pixels after all retries.`))}finally{window._chargesInterval&&clearInterval(window._chargesInterval),window._chargesInterval=null}if(e.stopFlag)o.saveProgress();else{$("paintingComplete","success",{count:e.paintedPixels}),e.lastPosition={x:0,y:0},o.saveProgress(),Pe.clear();let T=document.getElementById("toggleOverlayBtn");T&&(T.classList.remove("active"),T.disabled=!0)}console.log("\u{1F4CA} Pixel Statistics:"),console.log(`   Painted: ${e.paintedPixels}`),console.log(`   Skipped - Transparent: ${p.transparent}`),console.log(`   Skipped - White (disabled): ${p.white}`),console.log(`   Skipped - Already painted: ${p.alreadyPainted}`),console.log(`   Skipped - Color Unavailable: ${p.colorUnavailable}`),console.log(`   Total processed: ${e.paintedPixels+p.transparent+p.white+p.alreadyPainted+p.colorUnavailable}`),Ne()}function cn(){let t;if(e.batchMode==="random"){let i=Math.max(1,e.randomBatchMin),s=Math.max(i,e.randomBatchMax);t=Math.floor(Math.random()*(s-i+1))+i,console.log(`\u{1F3B2} Random batch size generated: ${t} (range: ${i}-${s})`)}else t=e.paintingSpeed;let a=e.displayCharges;return Math.min(t,a)}async function dn(t,a,n,i=xa){let s=0;for(;s<i&&!e.stopFlag;){s++,console.log(`\u{1F504} Attempting to send batch (attempt ${s}/${i}) for region ${a},${n} with ${t.length} pixels`);let r=await pn(t,a,n);if(r===!0)return console.log(`\u2705 Batch succeeded on attempt ${s}`),!0;if(r==="token_error"){console.log(`\u{1F511} Token error on attempt ${s}, regenerating...`),$("captchaSolving","warning");try{await Jt(),s--;continue}catch(d){console.error(`\u274C Token regeneration failed on attempt ${s}:`,d),$("captchaFailed","error"),await o.sleep(5e3)}}else{console.warn(`\u26A0\uFE0F Batch failed on attempt ${s}, retrying...`);let d=Math.min(1e3*Math.pow(2,s-1),3e4),g=Math.random()*1e3;await o.sleep(d+g)}}return s>=i&&(console.error(`\u274C Batch failed after ${i} attempts (MAX_BATCH_RETRIES=${xa}). This will stop painting to prevent infinite loops.`),$("paintingError","error")),!1}async function pn(t,a,n){let i=be;if(!i)try{console.log("\u{1F511} Generating Turnstile token for pixel batch..."),i=await Jt(),be=i}catch(d){return console.error("\u274C Failed to generate Turnstile token:",d),it=new Promise(g=>{Re=g}),"token_error"}let s=new Array(t.length*2),r=new Array(t.length);for(let d=0;d<t.length;d++){let g=t[d];s[d*2]=g.x,s[d*2+1]=g.y,r[d]=g.color}try{let d={coords:s,colors:r,t:i},g=await fetch(`https://backend.wplace.live/s0/pixel/${a}/${n}`,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},credentials:"include",body:JSON.stringify(d)});if(g.status===403){let p=null;try{p=await g.json()}catch{}console.error("\u274C 403 Forbidden. Turnstile token might be invalid or expired.");try{console.log("\u{1F504} Regenerating Turnstile token after 403..."),i=await Jt(),be=i;let l={coords:s,colors:r,t:i},v=await fetch(`https://backend.wplace.live/s0/pixel/${a}/${n}`,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},credentials:"include",body:JSON.stringify(l)});if(v.status===403)return be=null,it=new Promise(T=>{Re=T}),"token_error";let u=await v.json();return(u==null?void 0:u.painted)===t.length}catch(l){return console.error("\u274C Token regeneration failed:",l),be=null,it=new Promise(v=>{Re=v}),"token_error"}}let c=await g.json();return(c==null?void 0:c.painted)===t.length}catch(d){return console.error("Batch paint request failed:",d),!1}}function q(){var t,a;try{let n={paintingSpeed:e.paintingSpeed,paintingSpeedEnabled:(t=document.getElementById("enableSpeedToggle"))==null?void 0:t.checked,batchMode:e.batchMode,randomBatchMin:e.randomBatchMin,randomBatchMax:e.randomBatchMax,cooldownChargeThreshold:e.cooldownChargeThreshold,tokenSource:e.tokenSource,minimized:e.minimized,overlayOpacity:e.overlayOpacity,blueMarbleEnabled:(a=document.getElementById("enableBlueMarbleToggle"))==null?void 0:a.checked,ditheringEnabled:e.ditheringEnabled,colorMatchingAlgorithm:e.colorMatchingAlgorithm,enableChromaPenalty:e.enableChromaPenalty,chromaPenaltyWeight:e.chromaPenaltyWeight,customTransparencyThreshold:e.customTransparencyThreshold,customWhiteThreshold:e.customWhiteThreshold,paintWhitePixels:e.paintWhitePixels,paintTransparentPixels:e.paintTransparentPixels,resizeSettings:e.resizeSettings,paintUnavailablePixels:e.paintUnavailablePixels,coordinateMode:e.coordinateMode,coordinateDirection:e.coordinateDirection,coordinateSnake:e.coordinateSnake,blockWidth:e.blockWidth,blockHeight:e.blockHeight,resizeIgnoreMask:e.resizeIgnoreMask&&e.resizeSettings&&e.resizeSettings.width*e.resizeSettings.height===e.resizeIgnoreMask.length?{w:e.resizeSettings.width,h:e.resizeSettings.height,data:btoa(String.fromCharCode(...e.resizeIgnoreMask))}:null,notificationsEnabled:e.notificationsEnabled,notifyOnChargesReached:e.notifyOnChargesReached,notifyOnlyWhenUnfocused:e.notifyOnlyWhenUnfocused,notificationIntervalMinutes:e.notificationIntervalMinutes,originalImage:e.originalImage};w.PAINTING_SPEED_ENABLED=n.paintingSpeedEnabled,localStorage.setItem("wplace-bot-settings",JSON.stringify(n))}catch(n){console.warn("Could not save bot settings:",n)}}function gn(){try{let t=localStorage.getItem("wplace-bot-settings");if(!t)return;let a=JSON.parse(t);if(e.paintingSpeed=a.paintingSpeed||w.PAINTING_SPEED.DEFAULT,e.batchMode=a.batchMode||w.BATCH_MODE,e.randomBatchMin=a.randomBatchMin||w.RANDOM_BATCH_RANGE.MIN,e.randomBatchMax=a.randomBatchMax||w.RANDOM_BATCH_RANGE.MAX,e.cooldownChargeThreshold=a.cooldownChargeThreshold||w.COOLDOWN_CHARGE_THRESHOLD,e.tokenSource=a.tokenSource||w.TOKEN_SOURCE,e.minimized=a.minimized??!1,w.PAINTING_SPEED_ENABLED=a.paintingSpeedEnabled??!1,w.AUTO_CAPTCHA_ENABLED=a.autoCaptchaEnabled??!1,e.overlayOpacity=a.overlayOpacity??w.OVERLAY.OPACITY_DEFAULT,e.blueMarbleEnabled=a.blueMarbleEnabled??w.OVERLAY.BLUE_MARBLE_DEFAULT,e.ditheringEnabled=a.ditheringEnabled??!1,e.colorMatchingAlgorithm=a.colorMatchingAlgorithm||"lab",e.enableChromaPenalty=a.enableChromaPenalty??!0,e.chromaPenaltyWeight=a.chromaPenaltyWeight??.15,e.customTransparencyThreshold=a.customTransparencyThreshold??w.TRANSPARENCY_THRESHOLD,e.customWhiteThreshold=a.customWhiteThreshold??w.WHITE_THRESHOLD,e.paintWhitePixels=a.paintWhitePixels??!0,e.paintTransparentPixels=a.paintTransparentPixels??!1,e.resizeSettings=a.resizeSettings??null,e.originalImage=a.originalImage??null,e.paintUnavailablePixels=a.paintUnavailablePixels??w.PAINT_UNAVAILABLE,e.coordinateMode=a.coordinateMode??w.COORDINATE_MODE,e.coordinateDirection=a.coordinateDirection??w.COORDINATE_DIRECTION,e.coordinateSnake=a.coordinateSnake??w.COORDINATE_SNAKE,e.blockWidth=a.blockWidth??w.COORDINATE_BLOCK_WIDTH,e.blockHeight=a.blockHeight??w.COORDINATE_BLOCK_HEIGHT,e.notificationsEnabled=a.notificationsEnabled??w.NOTIFICATIONS.ENABLED,e.notifyOnChargesReached=a.notifyOnChargesReached??w.NOTIFICATIONS.ON_CHARGES_REACHED,e.notifyOnlyWhenUnfocused=a.notifyOnlyWhenUnfocused??w.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED,e.notificationIntervalMinutes=a.notificationIntervalMinutes??w.NOTIFICATIONS.REPEAT_MINUTES,a.resizeIgnoreMask&&a.resizeIgnoreMask.data&&e.resizeSettings&&a.resizeIgnoreMask.w===e.resizeSettings.width&&a.resizeIgnoreMask.h===e.resizeSettings.height)try{let Ue=atob(a.resizeIgnoreMask.data),pt=new Uint8Array(Ue.length);for(let He=0;He<Ue.length;He++)pt[He]=Ue.charCodeAt(He);e.resizeIgnoreMask=pt}catch{e.resizeIgnoreMask=null}else e.resizeIgnoreMask=null;let n=document.getElementById("coordinateModeSelect");n&&(n.value=e.coordinateMode);let i=document.getElementById("coordinateDirectionSelect");i&&(i.value=e.coordinateDirection);let s=document.getElementById("coordinateSnakeToggle");s&&(s.checked=e.coordinateSnake);let r=document.getElementById("wplace-settings-container"),d=r.querySelector("#directionControls"),g=r.querySelector("#snakeControls"),c=r.querySelector("#blockControls");o.updateCoordinateUI({mode:e.coordinateMode,directionControls:d,snakeControls:g,blockControls:c});let p=document.getElementById("paintUnavailablePixelsToggle");p&&(p.checked=e.paintUnavailablePixels);let l=r.querySelector("#settingsPaintWhiteToggle");l&&(l.checked=e.paintWhitePixels);let v=r.querySelector("#settingsPaintTransparentToggle");v&&(v.checked=e.paintTransparentPixels);let u=document.getElementById("speedSlider");u&&(u.value=e.paintingSpeed);let T=document.getElementById("speedValue");T&&(T.textContent=`${e.paintingSpeed} (batch size)`);let m=document.getElementById("enableSpeedToggle");m&&(m.checked=w.PAINTING_SPEED_ENABLED);let f=document.getElementById("batchModeSelect");f&&(f.value=e.batchMode);let y=document.getElementById("normalBatchControls"),S=document.getElementById("randomBatchControls");y&&S&&(e.batchMode==="random"?(y.style.display="none",S.style.display="block"):(y.style.display="block",S.style.display="none"));let I=document.getElementById("randomBatchMin");I&&(I.value=e.randomBatchMin);let A=document.getElementById("randomBatchMax");A&&(A.value=e.randomBatchMax);let W=document.getElementById("cooldownSlider");W&&(W.value=e.cooldownChargeThreshold);let G=document.getElementById("cooldownValue");G&&(G.textContent=e.cooldownChargeThreshold);let J=document.getElementById("overlayOpacitySlider");J&&(J.value=e.overlayOpacity);let ee=document.getElementById("overlayOpacityValue");ee&&(ee.textContent=`${Math.round(e.overlayOpacity*100)}%`);let xe=document.getElementById("enableBlueMarbleToggle");xe&&(xe.checked=e.blueMarbleEnabled);let Z=document.getElementById("tokenSourceSelect");Z&&(Z.value=e.tokenSource);let re=document.getElementById("colorAlgorithmSelect");re&&(re.value=e.colorMatchingAlgorithm);let Te=document.getElementById("enableChromaPenaltyToggle");Te&&(Te.checked=e.enableChromaPenalty);let Ze=document.getElementById("chromaPenaltyWeightSlider");Ze&&(Ze.value=e.chromaPenaltyWeight);let ct=document.getElementById("chromaWeightValue");ct&&(ct.textContent=e.chromaPenaltyWeight);let Qe=document.getElementById("transparencyThresholdInput");Qe&&(Qe.value=e.customTransparencyThreshold);let rt=document.getElementById("whiteThresholdInput");rt&&(rt.value=e.customWhiteThreshold);let Fe=document.getElementById("notifEnabledToggle");Fe&&(Fe.checked=e.notificationsEnabled);let et=document.getElementById("notifOnChargesToggle");et&&(et.checked=e.notifyOnChargesReached);let dt=document.getElementById("notifOnlyUnfocusedToggle");dt&&(dt.checked=e.notifyOnlyWhenUnfocused);let ea=document.getElementById("notifIntervalInput");ea&&(ea.value=e.notificationIntervalMinutes),We.resetEdgeTracking()}catch(t){console.warn("Could not load bot settings:",t)}}console.log("\u{1F680} WPlace Auto-Image with Turnstile Token Generator loaded"),console.log("\u{1F511} Turnstile token generator: ALWAYS ENABLED (Background mode)"),console.log("\u{1F3AF} Manual pixel captcha solving: Available as fallback/alternative"),console.log("\u{1F4F1} Turnstile widgets: DISABLED - pure background token generation only!");function Ct(){e.initialSetupComplete=!0;let t=document.querySelector("#loadBtn"),a=document.querySelector("#loadFromFileBtn"),n=document.querySelector("#uploadBtn");t&&(t.disabled=!1,t.title="",t.style.animation="pulse 0.6s ease-in-out",setTimeout(()=>{t&&(t.style.animation="")},600),console.log("\u2705 Load Progress button enabled after initial setup")),a&&(a.disabled=!1,a.title="",a.style.animation="pulse 0.6s ease-in-out",setTimeout(()=>{a&&(a.style.animation="")},600),console.log("\u2705 Load from File button enabled after initial setup")),n&&(n.disabled=!1,n.title="",n.style.animation="pulse 0.6s ease-in-out",setTimeout(()=>{n&&(n.style.animation="")},600),console.log("\u2705 Upload Image button enabled after initial setup")),o.showAlert(o.t("fileOperationsAvailable"),"success")}async function hn(){if(ot()){console.log("\u2705 Valid token already available, skipping initialization"),$("tokenReady","success"),Ct();return}try{console.log("\u{1F527} Initializing Turnstile token generator..."),$("initializingToken","default"),console.log("Attempting to load Turnstile script..."),await o.loadTurnstile(),console.log("Turnstile script loaded. Attempting to generate token...");let t=await Sa();t?(Je(t),console.log("\u2705 Startup token generated successfully"),$("tokenReady","success"),o.showAlert(o.t("tokenGeneratorReady"),"success"),Ct()):(console.warn("\u26A0\uFE0F Startup token generation failed (no token received), will retry when needed"),$("tokenRetryLater","warning"),Ct())}catch(t){console.error("\u274C Critical error during Turnstile initialization:",t),$("tokenRetryLater","warning"),Ct()}}va(),Ht(),Zt().then(()=>{setTimeout(hn,1e3),setTimeout(()=>{let a=document.getElementById("chromaPenaltyWeightSlider"),n=document.getElementById("chromaWeightValue"),i=document.getElementById("resetAdvancedColorBtn"),s=document.getElementById("colorAlgorithmSelect"),r=document.getElementById("enableChromaPenaltyToggle"),d=document.getElementById("transparencyThresholdInput"),g=document.getElementById("whiteThresholdInput"),c=document.getElementById("enableDitheringToggle");s&&s.addEventListener("change",p=>{e.colorMatchingAlgorithm=p.target.value,q(),we()}),r&&r.addEventListener("change",p=>{e.enableChromaPenalty=p.target.checked,q(),we()}),a&&n&&a.addEventListener("input",p=>{e.chromaPenaltyWeight=parseFloat(p.target.value)||.15,n.textContent=e.chromaPenaltyWeight.toFixed(2),q(),we()}),d&&d.addEventListener("change",p=>{let l=parseInt(p.target.value,10);!isNaN(l)&&l>=0&&l<=255&&(e.customTransparencyThreshold=l,w.TRANSPARENCY_THRESHOLD=l,q(),we())}),g&&g.addEventListener("change",p=>{let l=parseInt(p.target.value,10);!isNaN(l)&&l>=200&&l<=255&&(e.customWhiteThreshold=l,w.WHITE_THRESHOLD=l,q(),we())}),c&&c.addEventListener("change",p=>{e.ditheringEnabled=p.target.checked,q(),we()}),i&&i.addEventListener("click",()=>{e.colorMatchingAlgorithm="lab",e.enableChromaPenalty=!0,e.chromaPenaltyWeight=.15,e.customTransparencyThreshold=w.TRANSPARENCY_THRESHOLD=100,e.customWhiteThreshold=w.WHITE_THRESHOLD=250,q();let p=document.getElementById("colorAlgorithmSelect");p&&(p.value="lab");let l=document.getElementById("enableChromaPenaltyToggle");l&&(l.checked=!0),a&&(a.value=.15),n&&(n.textContent="0.15"),d&&(d.value=100),g&&(g.value=250),we(),o.showAlert(o.t("advancedColorSettingsReset"),"success")})},500),window.addEventListener("beforeunload",()=>{o.cleanupTurnstile()})})})();})();
