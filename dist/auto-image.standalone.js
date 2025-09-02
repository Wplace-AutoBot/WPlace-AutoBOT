(() => {
  // asset-inject:embedded-assets
  var EMBEDDED_CSS = `/* WPlace Auto-Image Bot - Unified CSS Styles (decoupled from JS)
   Why: bring external CSS in-sync with the UI that Auto-Image.js renders,
   fix layout (positions, widths, z-index), and ensure class names match JS
   (e.g., .wplace-dragging) so buttons and panels behave correctly. */

/* ========================= */
/* Theme tokens (CSS vars)   */
/* ========================= */

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
  border-radius: var(--wplace-radius, 12px);

  /* Theme-specific styling applied via theme files */
}

.wplace-section {
  margin-bottom: 6px;
  padding: 8px;
  border-radius: var(--wplace-radius, 12px);

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
  border: 1px solid rgb(255 255 255 / 10%);
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
  
  /* Default styling - themes can override these */
  background: linear-gradient(135deg, #222 0%, #4a4a4a 100%);
  color: var(--wplace-text);
  border-radius: var(--wplace-btn-radius, 16px);
  font-family: var(--wplace-font);
  box-shadow: 0 2px 8px rgb(0 0 0 / 20%);

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
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 10%), transparent);

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
  box-shadow: 0 4px 12px rgb(0 0 0 / 30%);

  /* Theme-specific styling applied via theme files */
}

.wplace-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Default button variants - themes can override these */
.wplace-btn-upload {
  background: rgb(111 66 193 / 10%) !important;
  border: 2px dashed var(--wplace-highlight) !important;
  color: var(--wplace-highlight) !important;
}

.wplace-btn-upload:hover:not(:disabled) {
  background: rgb(111 66 193 / 15%) !important;
  border-color: var(--wplace-highlight) !important;
  box-shadow: 0 4px 12px rgb(111 66 193 / 20%) !important;
}

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
  border-radius: var(--wplace-radius, 12px);

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
  
  /* Default fallback background - themes override this */
  background: rgb(0 0 0 / 90%);
  border-radius: var(--wplace-radius);
  border: 1px solid rgb(255 255 255 / 20%);
  backdrop-filter: var(--wplace-backdrop);

  /* Theme-specific styling applied via theme files */
}

/* Default alert type styles - themes can override these */
.wplace-alert-info {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.wplace-alert-success {
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
}

.wplace-alert-warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.wplace-alert-error {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

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
  margin: 4px 0;
  padding: 0;
  width: 100%;
  min-height: 16px;
  position: relative;
}

.wplace-speed-min {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  position: absolute;
  left: 20px;
  transform: translateX(-50%);
}

.wplace-speed-max {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  position: absolute;
  right: 20px;
  transform: translateX(50%);
}

.wplace-speed-min i,
.wplace-speed-max i {
  font-size: 10px;
  opacity: 0.8;
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

/* ========================= */
/* Enhanced Slider Controls */
/* ========================= */

/* Vertical Layout - Slider on top, controls below */
.wplace-speed-slider-container, 
.wplace-slider-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0;
}

.wplace-speed-slider, 
.wplace-slider {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.wplace-speed-slider::-webkit-slider-thumb, 
.wplace-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4facfe;
  cursor: pointer;
  transition: all 0.2s ease;
}

.wplace-speed-slider::-webkit-slider-thumb:hover, 
.wplace-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
}

/* Controls row - input group + unit label */
.wplace-speed-controls, 
.wplace-cooldown-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* Input group with +/- buttons */
.wplace-speed-input-group, 
.wplace-cooldown-input-group {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
  padding: 2px;
  flex-shrink: 0;
}

/* Small +/- buttons */
.wplace-input-btn-small {
  background: transparent;
  color: #4facfe;
  border: none;
  border-radius: 2px;
  width: 16px;
  height: 18px;
  cursor: pointer;
  font-weight: bold;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.wplace-input-btn-small:hover {
  background: rgba(79, 172, 254, 0.15);
  color: white;
}

.wplace-input-btn-small:active {
  background: rgba(79, 172, 254, 0.3);
}

/* Number input fields */
.wplace-speed-input, 
.wplace-cooldown-input {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px;
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  width: 42px;
  text-align: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  /* Hide native HTML number input spin buttons */
  -moz-appearance: textfield; /* Firefox */
}

/* Hide WebKit spin buttons */
.wplace-speed-input::-webkit-outer-spin-button,
.wplace-speed-input::-webkit-inner-spin-button,
.wplace-cooldown-input::-webkit-outer-spin-button,
.wplace-cooldown-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.wplace-speed-input:focus, 
.wplace-cooldown-input:focus {
  outline: none;
  background: rgba(0,0,0,0.5);
  border-color: #4facfe;
  box-shadow: 0 0 0 1px rgba(79, 172, 254, 0.3);
}

/* Unit labels */
.wplace-speed-unit, 
.wplace-cooldown-unit {
  color: rgba(255,255,255,0.7);
  font-size: 11px;
  min-width: 35px;
}

/* ========================= */
/* Additional UI Components */
/* ========================= */

/* Keyframes for animations */
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

/* Overlay opacity slider */
#overlayOpacitySlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
  cursor: pointer;
  transition: all 0.2s ease;
}

#overlayOpacitySlider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
}

#overlayOpacitySlider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

/* Theme and language selects */
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

/* Dragging state */
.wplace-dragging {
  opacity: 0.9;
  box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2);
  transition: none;
}

/* Settings header interactions */
.wplace-settings-header:hover {
  background: rgba(255,255,255,0.15) !important;
}

.wplace-settings-header:active {
  background: rgba(255,255,255,0.2) !important;
}

/* ========================= */
/* Dynamic Warning Banner    */
/* ========================= */
.wplace-warning-banner {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10001;
  background: rgba(255, 193, 7, 0.95);
  color: #212529;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 193, 7, 0.8);
  max-width: 300px;
  word-wrap: break-word;
}

/* ========================= */
/* Settings Container Theme  */
/* ========================= */
.wplace-settings-container-themed {
  min-width: 420px;
  max-width: 480px;
  z-index: 99999;
  color: var(--theme-text, white);
  font-family: var(--theme-font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  box-shadow: var(--theme-box-shadow, 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1));
  backdrop-filter: var(--theme-backdrop-filter, blur(10px));
  overflow: hidden;
  animation: settings-slide-in 0.4s ease-out;
}

.wplace-settings-container-themed.glow-effect {
  box-shadow: var(--theme-box-shadow, 0 20px 40px rgba(0,0,0,0.3)), 
             0 0 30px var(--theme-glow-color, #00ffff);
}

/* Theme-aware dynamic text colors */
.wplace-settings-section-label,
.wplace-overlay-opacity-label,
.wplace-settings-toggle-title,
.wplace-settings-toggle-description,
.resize-dialog-title {
  color: var(--theme-text, white) !important;
}

.wplace-icon-eye {
  color: var(--theme-highlight, #48dbfb) !important;
}

/* Dynamic accent color for checkboxes and inputs */
.wplace-settings-checkbox,
.wplace-slider,
input[type="range"] {
  accent-color: var(--theme-highlight, #48dbfb);
}

/* ========================= */
/* Reusable CSS Classes      */
/* ========================= */
.wplace-btn-primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.wplace-btn-secondary {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wplace-modern-card {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 18px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
}

.wplace-gradient-text {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}
`;
  var EMBEDDED_THEMES = {
    "classic-light": "/* WPlace Auto-Image Bot - Classic Light Theme */\n\n/* Clean, bright theme based on classic design with light backgrounds */\n\n.wplace-theme-classic-light {\n  /* === CORE COLORS === */\n  --wplace-primary: #fff;           /* Clean white */\n  --wplace-secondary: #f8f9fa;         /* Light gray */\n  --wplace-accent: #e9ecef;            /* Lighter gray */\n  --wplace-text: #212529;              /* Dark text */\n  --wplace-highlight: #6f42c1;         /* Purple highlight */\n  --wplace-success: #28a745;           /* Bootstrap green */\n  --wplace-error: #dc3545;             /* Bootstrap red */\n  --wplace-warning: #ffc107;           /* Bootstrap yellow */\n\n  /* === UI PROPERTIES === */\n  --wplace-radius: 8px;\n  --wplace-btn-radius: 12px;\n  --wplace-border-style: solid;\n  --wplace-border-width: 1px;\n  --wplace-border-color: #415a77;\n  --wplace-shadow: 0 8px 32px rgb(0 0 0 / 15%), 0 0 0 1px rgb(0 0 0 / 8%);\n  --wplace-backdrop: blur(10px);\n  --wplace-font: 'Segoe UI', roboto, sans-serif;\n\n  /* === EXTENDED COLOR PALETTE === */\n\n  /* Icon colors */\n  --wplace-icon-primary: #4facfe;      /* Light blue */\n  --wplace-icon-secondary: #00f2fe;    /* Cyan */\n  --wplace-icon-palette: #f093fb;      /* Pink */\n  \n  /* Additional UI colors */\n  --wplace-danger: #dc3545;            /* Bootstrap red */\n  --wplace-danger-dark: #c82333;       /* Darker red */\n  --wplace-muted-text: rgb(33 37 41 / 70%);\n  --wplace-highlight-secondary: #d3a4ff;\n  \n  /* Text variants */\n  --wplace-text-secondary: rgb(33 37 41 / 90%);\n  --wplace-text-muted: rgb(33 37 41 / 70%);\n  --wplace-text-dim: rgb(33 37 41 / 60%);\n  --wplace-text-faded: rgb(33 37 41 / 80%);\n\n  /* Background variants */\n  --wplace-bg-input:     #f3f3f3; /* neutral-100 */\n  --wplace-bg-subtle:    #f3f3f3; /* neutral-100 \u2014 hover */\n  --wplace-bg-faint:     #e0e0e0; /* neutral-200 */\n  --wplace-bg-ghost:     #d1d1d1; /* neutral-300 */\n  --wplace-bg-whisper:   #e0e0e0; /* can be used as whisper on hover */\n\n  /* Border variants */\n  --wplace-border-subtle:      #d1d1d1; /* neutral-300 */\n  --wplace-border-faint:       #e0e0e0; /* neutral-200 */\n  --wplace-border-ghost:       #e0e0e0; /* neutral-200 */\n  --wplace-border-ultra-faint: #e0e0e0; /* neutral-200 \u2014 very faint */\n  \n  /* Shadow variants */\n  --wplace-shadow-drag: 0 12px 40px rgb(0 0 0 / 20%), 0 0 0 2px rgb(111 66 193 / 30%);\n  --wplace-shadow-notification: 0 4px 12px rgb(0 0 0 / 15%);\n  --wplace-shadow-slider-thumb: 0 3px 6px rgb(0 0 0 / 20%), 0 0 0 2px var(--wplace-icon-primary);\n  --wplace-shadow-slider-hover: 0 4px 8px rgb(0 0 0 / 25%), 0 0 0 3px var(--wplace-icon-primary);\n  \n  /* Animation colors */\n  --wplace-pulse-start: rgb(40 167 69 / 70%);\n  --wplace-pulse-mid: rgb(40 167 69 / 0%);\n  --wplace-pulse-end: rgb(40 167 69 / 0%);\n  \n  /* Slider colors */\n  --wplace-slider-thumb-bg: #6f42c1;\n  --wplace-slider-track-bg: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);\n}\n\n/* === COMPONENT STYLING === */\n\n/* Main container with clean light styling */\n.wplace-theme-classic-light #wplace-image-bot-container {\n  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%) !important;\n  color: var(--wplace-text) !important;\n  border: 1px solid rgb(0 0 0 / 15%) !important;\n  border-radius: 12px !important;\n  box-shadow: 0 8px 32px rgb(0 0 0 / 15%), 0 0 0 1px rgb(0 0 0 / 8%) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  backdrop-filter: blur(10px) !important;\n}\n\n\n/* Stats container with proper contrast */\n.wplace-theme-classic-light #wplace-stats-container {\n  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  border-radius: 12px !important;\n  box-shadow: 0 8px 32px rgb(0 0 0 / 15%) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  color: var(--wplace-text) !important;\n  position: fixed !important;\n  overflow: hidden !important;\n  z-index: 9998 !important;\n}\n\n/* Headers with light gradient */\n.wplace-theme-classic-light .wplace-header {\n  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;\n  color: var(--wplace-highlight) !important;\n  border-bottom: 1px solid rgb(0 0 0 / 15%) !important;\n  text-shadow: none !important;\n}\n\n/* Stats header styling */\n.wplace-theme-classic-light #wplace-stats-container .wplace-header {\n  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;\n  color: var(--wplace-text) !important;\n  border-bottom: 1px solid rgb(0 0 0 / 20%) !important;\n  text-shadow: none !important;\n  font-weight: 600 !important;\n}\n\n/* Stats title specific styling */\n.wplace-theme-classic-light #wplace-stats-container .wplace-header .wplace-stats-title {\n  color: var(--wplace-text) !important;\n  text-shadow: none !important;\n}\n\n/* Comprehensive text and element styling for light theme - scoped to bot containers only */\n\n.wplace-theme-classic-light .wplace-status,\n.wplace-theme-classic-light .wplace-stats,\n.wplace-theme-classic-light .wplace-section,\n.wplace-theme-classic-light .wplace-controls,\n.wplace-theme-classic-light .wplace-data-management,\n.wplace-theme-classic-light .wplace-cooldown-settings {\n  color: var(--wplace-text) !important;\n}\n\n/* Buttons with light styling */\n.wplace-theme-classic-light .wplace-btn {\n  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  border-radius: 12px !important;\n  color: var(--wplace-text) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  font-weight: 500 !important;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;\n}\n\n/* Data management section buttons */\n.wplace-theme-classic-light .wplace-data-management .wplace-btn {\n  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  color: #212529 !important;\n  font-weight: 500 !important;\n}\n\n.wplace-theme-classic-light .wplace-btn:hover:not(:disabled) {\n  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;\n  box-shadow: 0 4px 12px rgb(0 0 0 / 15%) !important;\n  transform: translateY(-1px) !important;\n}\n\n.wplace-theme-classic-light .wplace-data-management .wplace-btn:hover:not(:disabled) {\n  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;\n  box-shadow: 0 4px 12px rgb(0 0 0 / 15%) !important;\n}\n\n/* Settings dialog */\n.wplace-theme-classic-light #wplace-settings-container {\n  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%) !important;\n  border: 1px solid rgb(0 0 0 / 15%) !important;\n  border-radius: 12px !important;\n  box-shadow: 0 16px 48px rgb(0 0 0 / 20%), 0 0 0 1px rgb(0 0 0 / 8%) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  backdrop-filter: blur(10px) !important;\n  color: var(--wplace-text) !important;\n}\n\n/* Settings dialog text elements */\n.wplace-theme-classic-light .wplace-stat-colors-grid * {\n  color: var(--wplace-text) !important;\n  font-weight: 500 !important;\n}\n\n.wplace-theme-classic-light #wplace-settings-container * {\n  color: var(--wplace-text) !important;\n}\n\n.wplace-theme-classic-light #wplace-settings-container .wplace-settings-section-wrapper * {\n  color: var(--wplace-text) !important;\n}\n\n/* Color palette text labels */\n.wplace-theme-classic-light .wplace-color-label {\n  color: var(--wplace-text) !important;\n  font-weight: 500 !important;\n  text-shadow: none !important;\n}\n\n.wplace-theme-classic-light .wplace-color-name {\n  color: var(--wplace-text) !important;\n  font-weight: 500 !important;\n}\n\n.wplace-theme-classic-light .wplace-color-item-name {\n  color: #000 !important;\n  font-weight: 600 !important;\n  text-shadow: none !important;\n}\n\n/* Resize dialog */\n.wplace-theme-classic-light .resize-container {\n  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%) !important;\n  border: 1px solid rgb(0 0 0 / 15%) !important;\n  border-radius: 12px !important;\n  box-shadow: 0 16px 48px rgb(0 0 0 / 20%), 0 0 0 1px rgb(0 0 0 / 8%) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  backdrop-filter: blur(10px) !important;\n}\n\n/* Settings header */\n.wplace-theme-classic-light .wplace-settings-header {\n  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;\n  border-bottom: 1px solid rgb(0 0 0 / 15%) !important;\n}\n\n.wplace-theme-classic-light .wplace-settings-title {\n  color: var(--wplace-text) !important;\n  text-shadow: none !important;\n}\n\n.wplace-theme-classic-light .wplace-settings-close-btn {\n  background: rgb(0 0 0 / 5%) !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  border-radius: 50% !important;\n  color: var(--wplace-text) !important;\n  transition: all 0.3s ease !important;\n}\n\n.wplace-theme-classic-light .wplace-settings-close-btn:hover {\n  background: rgb(220 53 69 / 10%) !important;\n  border-color: var(--wplace-error) !important;\n  box-shadow: 0 0 12px rgb(220 53 69 / 30%) !important;\n}\n\n/* Section titles */\n.wplace-theme-classic-light .wplace-section-title {\n  color: var(--wplace-highlight) !important;\n  text-shadow: none !important;\n  font-weight: 600 !important;\n}\n\n/* Button variants with classic light colors */\n.wplace-theme-classic-light .wplace-btn-start {\n  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;\n  color: white !important;\n  font-weight: 600 !important;\n}\n\n.wplace-theme-classic-light .wplace-btn-start:hover:not(:disabled) {\n  box-shadow: 0 4px 12px rgb(40 167 69 / 40%) !important;\n}\n\n.wplace-theme-classic-light .wplace-btn-stop {\n  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;\n  color: white !important;\n  font-weight: 600 !important;\n}\n\n.wplace-theme-classic-light .wplace-btn-stop:hover:not(:disabled) {\n  box-shadow: 0 4px 12px rgb(220 53 69 / 40%) !important;\n}\n\n.wplace-theme-classic-light .wplace-btn-upload {\n  background: rgb(111 66 193 / 10%) !important;\n  border: 2px dashed var(--wplace-highlight) !important;\n  color: var(--wplace-highlight) !important;\n}\n\n.wplace-theme-classic-light .wplace-btn-upload:hover:not(:disabled) {\n  background: rgb(111 66 193 / 15%) !important;\n  box-shadow: 0 4px 12px rgb(111 66 193 / 20%) !important;\n}\n\n/* Progress bars with clean light styling */\n.wplace-theme-classic-light .wplace-progress {\n  background: rgb(0 0 0 / 10%) !important;\n  border: 1px solid rgb(0 0 0 / 15%) !important;\n  border-radius: 12px !important;\n}\n\n.wplace-theme-classic-light .wplace-progress-bar {\n  background: linear-gradient(135deg, #6f42c1 0%, #9370db 100%) !important;\n  box-shadow: none !important;\n}\n\n.wplace-theme-classic-light .wplace-progress-bar::after {\n  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 30%), transparent) !important;\n}\n\n/* Status indicators with light colors */\n.wplace-theme-classic-light .status-success {\n  background: rgb(40 167 69 / 10%) !important;\n  border-color: var(--wplace-success) !important;\n  color: var(--wplace-success) !important;\n  box-shadow: 0 0 15px rgb(40 167 69 / 20%) !important;\n  text-shadow: none !important;\n}\n\n.wplace-theme-classic-light .status-error {\n  background: rgb(220 53 69 / 10%) !important;\n  border-color: var(--wplace-error) !important;\n  color: var(--wplace-error) !important;\n  box-shadow: 0 0 15px rgb(220 53 69 / 20%) !important;\n  text-shadow: none !important;\n}\n\n.wplace-theme-classic-light .status-default {\n  background: rgb(111 66 193 / 10%) !important;\n  border-color: var(--wplace-highlight) !important;\n  color: var(--wplace-highlight) !important;\n  text-shadow: none !important;\n}\n\n.wplace-theme-classic-light .wplace-stat-label {\n  color: var(--wplace-text) !important;\n  text-shadow: none !important;\n  font-weight: 500 !important;\n}\n\n.wplace-theme-classic-light .wplace-stat-value {\n  color: var(--wplace-highlight) !important;\n  text-shadow: none !important;\n  font-weight: 600 !important;\n}\n\n/* Sections with light styling */\n.wplace-theme-classic-light .wplace-section {\n  background: rgb(0 0 0 / 3%) !important;\n  border: 1px solid rgb(0 0 0 / 10%) !important;\n  border-radius: 12px !important;\n}\n\n.wplace-theme-classic-light .wplace-status-section {\n  background: rgb(0 0 0 / 3%) !important;\n  border: 1px solid rgb(0 0 0 / 10%) !important;\n  border-radius: 12px !important;\n}\n\n.wplace-theme-classic-light .wplace-settings-section-wrapper {\n  background: rgb(0 0 0 / 3%) !important;\n  border: 1px solid rgb(0 0 0 / 10%) !important;\n  border-radius: 12px !important;\n}\n\n/* Form controls with light styling */\n.wplace-theme-classic-light .wplace-settings-select {\n  background: #fff !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  border-radius: 8px !important;\n  color: var(--wplace-text) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  box-shadow: 0 2px 8px rgb(0 0 0 / 10%) !important;\n}\n\n.wplace-theme-classic-light .wplace-settings-select:focus {\n  border-color: var(--wplace-highlight) !important;\n  box-shadow: 0 0 0 2px rgb(111 66 193 / 30%) !important;\n}\n\n/* Dropdown menu options */\n.wplace-theme-classic-light .wplace-settings-select option {\n  background: #fff !important;\n  color: var(--wplace-text) !important;\n}\n\n.wplace-theme-classic-light .wplace-settings-option {\n  background: #fff !important;\n  color: var(--wplace-text) !important;\n}\n\n/* Sliders with classic gradient */\n.wplace-theme-classic-light .wplace-speed-slider {\n  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;\n  border-radius: 4px !important;\n}\n\n.wplace-theme-classic-light .wplace-overlay-opacity-slider {\n  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;\n  border-radius: 4px !important;\n}\n\n.wplace-theme-classic-light .wplace-slider {\n  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%) !important;\n  border-radius: 4px !important;\n}\n\n.wplace-theme-classic-light .wplace-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--wplace-slider-thumb-bg);\n  border: 1px solid rgb(0 0 0 / 20%);\n  cursor: pointer;\n  transition: all 0.2s ease;\n  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);\n}\n\n.wplace-theme-classic-light .wplace-speed-value {\n  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;\n  border-radius: 8px !important;\n  color: white !important;\n  font-weight: 600 !important;\n  box-shadow: 0 3px 10px rgb(79 172 254 / 30%) !important;\n  border: 1px solid rgb(0 0 0 / 10%) !important;\n}\n\n/* Settings labels */\n.wplace-theme-classic-light .wplace-settings-section-label {\n  color: var(--wplace-highlight) !important;\n  text-shadow: none !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  font-weight: 600 !important;\n}\n\n/* Icon colors for classic light theme */\n.wplace-theme-classic-light .wplace-icon-key { color: #4facfe; }\n.wplace-theme-classic-light .wplace-icon-robot { color: #4facfe; }\n.wplace-theme-classic-light .wplace-icon-speed { color: #4facfe; }\n.wplace-theme-classic-light .wplace-icon-bell { color: #ffc107; }\n.wplace-theme-classic-light .wplace-icon-palette { color: #f093fb; }\n.wplace-theme-classic-light .wplace-icon-globe { color: #ffeaa7; }\n.wplace-theme-classic-light .wplace-icon-paint { color: #4facfe; }\n.wplace-theme-classic-light .wplace-icon-eye { color: #6f42c1; }\n\n/* Clean light theme animations */\n@keyframes light-shimmer {\n  0% {\n    transform: translateX(-100%);\n  }\n\n  100% {\n    transform: translateX(200%);\n  }\n}\n\n/* Turnstile/CF checkbox overlay - CRITICAL FIX */\n.wplace-theme-classic-light .wplace-turnstile-overlay {\n  background: rgb(255 255 255 / 98%) !important;\n  border-radius: 12px !important;\n  box-shadow: 0 8px 32px rgb(0 0 0 / 30%) !important;\n  backdrop-filter: blur(10px) !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  color: var(--wplace-text) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n}\n\n.wplace-theme-classic-light .wplace-turnstile-title {\n  color: var(--wplace-text) !important;\n}\n\n.wplace-theme-classic-light .wplace-turnstile-hide-btn {\n  color: var(--wplace-text) !important;\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  border-radius: 6px !important;\n  background: rgb(0 0 0 / 5%) !important;\n}\n\n.wplace-theme-classic-light .wplace-turnstile-hide-btn:hover {\n  background: rgb(0 0 0 / 10%) !important;\n}\n\n/* Dual control layout styling for classic light theme */\n.wplace-theme-classic-light .wplace-dual-control-compact {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 12px;\n  margin: 8px 0;\n  flex-wrap: wrap;\n}\n\n.wplace-theme-classic-light .wplace-slider-container-compact {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: 1;\n  min-width: 160px;\n}\n\n.wplace-theme-classic-light .wplace-speed-slider-container-compact {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: 1;\n  min-width: 160px;\n}\n\n.wplace-theme-classic-light .wplace-input-group-compact {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n}\n\n.wplace-theme-classic-light .wplace-input-btn-compact {\n  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);\n  color: white;\n  border: none;\n  border-radius: 4px;\n  width: 22px;\n  height: 22px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n}\n\n.wplace-theme-classic-light .wplace-input-btn-compact:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.3);\n  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);\n}\n\n.wplace-theme-classic-light .wplace-input-btn-compact:active {\n  transform: translateY(0);\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n}\n\n.wplace-theme-classic-light .wplace-number-input-compact {\n  background: #fff;\n  border: 1px solid rgb(0 0 0 / 20%);\n  border-radius: 4px;\n  color: var(--wplace-text);\n  padding: 4px 8px;\n  font-size: 12px;\n  width: 50px;\n  text-align: center;\n  transition: all 0.2s ease;\n  height: 22px;\n}\n\n.wplace-theme-classic-light .wplace-number-input-compact:focus {\n  outline: none;\n  border-color: #4facfe;\n  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);\n  background: #f8f9fa;\n}\n\n.wplace-theme-classic-light .wplace-input-label-compact {\n  color: var(--wplace-text);\n  font-size: 11px;\n  margin-left: 4px;\n  white-space: nowrap;\n}\n\n.wplace-theme-classic-light .wplace-batch-size-header {\n  margin-bottom: 8px;\n}\n\n.wplace-theme-classic-light .wplace-batch-size-label {\n  color: var(--wplace-highlight);\n  font-weight: 500;\n  font-size: 13px;\n}\n\n/* Cooldown control styling for classic light theme */\n.wplace-theme-classic-light .wplace-cooldown-control {\n  margin: 12px 0;\n}\n\n.wplace-theme-classic-light .wplace-cooldown-control label {\n  color: var(--wplace-highlight);\n  font-weight: 500;\n  font-size: 13px;\n  margin-bottom: 8px;\n  display: block;\n}\n\n/* Color swatches with light styling */\n.wplace-theme-classic-light .wplace-color-swatch {\n  border: 1px solid rgb(0 0 0 / 20%) !important;\n  border-radius: 4px !important;\n  box-shadow: 0 2px 8px rgb(0 0 0 / 10%) !important;\n}\n\n.wplace-theme-classic-light .wplace-color-swatch:hover {\n  box-shadow: 0 4px 16px rgb(111 66 193 / 30%) !important;\n  transform: translateY(-1px);\n}\n\n.wplace-theme-classic-light .wplace-stat-colors-grid {\n  background: rgb(0 0 0 / 5%) !important;\n  border-radius: 8px !important;\n  border: 1px solid rgb(0 0 0 / 10%) !important;\n}\n\n/* Alert styling for classic light theme */\n.wplace-theme-classic-light .wplace-alert-base {\n  border-radius: var(--wplace-radius) !important;\n  font-family: 'Segoe UI', Roboto, sans-serif !important;\n  box-shadow: 0 8px 32px rgb(0 0 0 / 25%), 0 0 0 1px rgb(0 0 0 / 10%) !important;\n  backdrop-filter: blur(10px) !important;\n}\n\n.wplace-theme-classic-light .wplace-alert-info {\n  background: linear-gradient(135deg, #3498db, #2980b9) !important;\n  color: white !important;\n  box-shadow: 0 8px 32px rgb(52 152 219 / 30%), 0 0 0 1px rgb(0 0 0 / 10%) !important;\n}\n\n.wplace-theme-classic-light .wplace-alert-success {\n  background: linear-gradient(135deg, #28a745, #20c997) !important;\n  color: white !important;\n  box-shadow: 0 8px 32px rgb(40 167 69 / 30%), 0 0 0 1px rgb(0 0 0 / 10%) !important;\n}\n\n.wplace-theme-classic-light .wplace-alert-warning {\n  background: linear-gradient(135deg, #ffc107, #ff8c00) !important;\n  color: #000 !important;\n  box-shadow: 0 8px 32px rgb(255 193 7 / 30%), 0 0 0 1px rgb(0 0 0 / 10%) !important;\n}\n\n.wplace-theme-classic-light .wplace-alert-error {\n  background: linear-gradient(135deg, #dc3545, #c82333) !important;\n  color: white !important;\n  box-shadow: 0 8px 32px rgb(220 53 69 / 30%), 0 0 0 1px rgb(0 0 0 / 10%) !important;\n}\n\n/* Input field styling for light theme - Higher specificity */\nbody .wplace-theme-classic-light .wplace-speed-input,\nbody .wplace-theme-classic-light .wplace-cooldown-input,\n.wplace-theme-classic-light .wplace-speed-input,\n.wplace-theme-classic-light .wplace-cooldown-input {\n  background: #f8f9fa !important;\n  border: 1px solid #d1d1d1 !important;\n  color: #212529 !important;\n  border-radius: 6px !important;\n}\n\nbody .wplace-theme-classic-light .wplace-speed-input:focus,\nbody .wplace-theme-classic-light .wplace-cooldown-input:focus,\n.wplace-theme-classic-light .wplace-speed-input:focus,\n.wplace-theme-classic-light .wplace-cooldown-input:focus {\n  background: #ffffff !important;\n  border-color: #6f42c1 !important;\n  color: #212529 !important;\n  box-shadow: 0 0 0 2px rgba(111, 66, 193, 0.2) !important;\n}\n\n/* Input group background for light theme - Higher specificity */\nbody .wplace-theme-classic-light .wplace-speed-input-group,\nbody .wplace-theme-classic-light .wplace-cooldown-input-group,\n.wplace-theme-classic-light .wplace-speed-input-group,\n.wplace-theme-classic-light .wplace-cooldown-input-group {\n  background: #e9ecef !important;\n  border: 1px solid #d1d1d1 !important;\n  border-radius: 8px !important;\n}\n\n/* Button styling for light theme - Higher specificity */\nbody .wplace-theme-classic-light .wplace-input-btn-small,\n.wplace-theme-classic-light .wplace-input-btn-small {\n  background: #ffffff !important;\n  border: 1px solid #d1d1d1 !important;\n  color: #212529 !important;\n  border-radius: 6px !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;\n}\n\nbody .wplace-theme-classic-light .wplace-input-btn-small:hover,\n.wplace-theme-classic-light .wplace-input-btn-small:hover {\n  background: #f8f9fa !important;\n  border-color: #6f42c1 !important;\n  color: #212529 !important;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;\n}\n\nbody .wplace-theme-classic-light .wplace-input-btn-small:active,\n.wplace-theme-classic-light .wplace-input-btn-small:active {\n  background: #e9ecef !important;\n  color: #212529 !important;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;\n}\n",
    "classic": `/* WPlace Auto-Image Bot - Classic Theme */
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

/* Dual control layout styling for classic theme */
:root .wplace-dual-control-compact,
.wplace-theme-classic .wplace-dual-control-compact {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  flex-wrap: wrap;
}

:root .wplace-slider-container-compact,
.wplace-theme-classic .wplace-slider-container-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 160px;
}

:root .wplace-speed-slider-container-compact,
.wplace-theme-classic .wplace-speed-slider-container-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 160px;
}

:root .wplace-input-group-compact,
.wplace-theme-classic .wplace-input-group-compact {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

:root .wplace-input-btn-compact,
.wplace-theme-classic .wplace-input-btn-compact {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 4px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

:root .wplace-input-btn-compact:hover,
.wplace-theme-classic .wplace-input-btn-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
}

:root .wplace-input-btn-compact:active,
.wplace-theme-classic .wplace-input-btn-compact:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

:root .wplace-number-input-compact,
.wplace-theme-classic .wplace-number-input-compact {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  width: 50px;
  text-align: center;
  transition: all 0.2s ease;
  height: 22px;
}

:root .wplace-number-input-compact:focus,
.wplace-theme-classic .wplace-number-input-compact:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
  background: rgba(255,255,255,0.15);
}

:root .wplace-input-label-compact,
.wplace-theme-classic .wplace-input-label-compact {
  color: rgba(255,255,255,0.8);
  font-size: 11px;
  margin-left: 4px;
  white-space: nowrap;
}

:root .wplace-batch-size-header,
.wplace-theme-classic .wplace-batch-size-header {
  margin-bottom: 8px;
}

:root .wplace-batch-size-label,
.wplace-theme-classic .wplace-batch-size-label {
  color: var(--wplace-highlight);
  font-weight: 500;
  font-size: 13px;
}

/* Cooldown control styling for classic theme */
:root .wplace-cooldown-control,
.wplace-theme-classic .wplace-cooldown-control {
  margin: 12px 0;
}

:root .wplace-cooldown-control label,
.wplace-theme-classic .wplace-cooldown-control label {
  color: var(--wplace-highlight);
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 8px;
  display: block;
}
/* Resize dialog styling for classic theme */
:root .resize-container,
.wplace-theme-classic .resize-container {
  background: #000;
  border: 1px solid #fff;
  border-radius: 12px;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
}
`,
    "neon": "/* WPlace Auto-Image Bot - Neon Theme */\n/* Retro cyberpunk aesthetic with green neon glow effects */\n\n.wplace-theme-neon {\n  /* Neon theme colors - matching upstream main neon theme */\n  --wplace-primary: #1a1a2e;\n  --wplace-secondary: #16213e;\n  --wplace-accent: #0f3460;\n  --wplace-text: #00ff41;\n  --wplace-highlight: #ff6b35;\n  --wplace-success: #39ff14;\n  --wplace-error: #ff073a;\n  --wplace-warning: #ff0;\n\n  /* Neon UI properties */\n  --wplace-radius: 0;\n  --wplace-border-style: solid;\n  --wplace-border-width: 2px;\n  --wplace-border-color: #00ff41;\n  --wplace-shadow: 0 0 20px rgb(0 255 65 / 30%), inset 0 0 20px rgb(0 255 65 / 10%);\n  --wplace-backdrop: none;\n  --wplace-font: 'Press Start 2P', monospace, 'Courier New';\n\n  /* Z-index layers */\n  --wplace-z-overlay: 10000;\n  --wplace-z-alert: 10002;\n  --wplace-z-settings: 10002;\n\n  /* Feature toggles */\n  --wplace-scanline: 1;\n  --wplace-pixel-blink: 1;\n\n  /* Icon colors - neon variants */\n  --wplace-icon-primary: #00ff41;\n  --wplace-icon-secondary: #39ff14;\n  --wplace-icon-palette: #ff6b35;\n  \n  /* Additional UI colors - neon variants */\n  --wplace-danger: #ff073a;\n  --wplace-danger-dark: #cc0531;\n  --wplace-muted-text: #00ff4180;\n  --wplace-highlight-secondary: #fa0;\n  \n  /* Text variants - neon style */\n  --wplace-text-secondary: #00ff41dd;\n  --wplace-text-muted: #00ff41bb;\n  --wplace-text-dim: #00ff4199;\n  --wplace-text-faded: #00ff41cc;\n  \n  /* Background variants - neon style */\n  --wplace-bg-input: rgb(0 255 65 / 15%);\n  --wplace-bg-subtle: rgb(0 255 65 / 8%);\n  --wplace-bg-faint: rgb(0 255 65 / 5%);\n  --wplace-bg-ghost: rgb(0 255 65 / 3%);\n  --wplace-bg-whisper: rgb(0 255 65 / 2%);\n  \n  /* Border variants - neon style */\n  --wplace-border-subtle: rgb(0 255 65 / 40%);\n  --wplace-border-faint: rgb(0 255 65 / 25%);\n  --wplace-border-ghost: rgb(0 255 65 / 15%);\n  --wplace-border-ultra-faint: rgb(0 255 65 / 8%);\n  \n  /* Shadow variants - neon style */\n  --wplace-shadow-drag: 0 12px 40px rgb(0 255 65 / 60%), 0 0 0 2px rgb(0 255 65 / 80%), 0 0 20px rgb(0 255 65 / 30%);\n  --wplace-shadow-notification: 0 4px 12px rgb(0 255 65 / 40%), 0 0 15px rgb(0 255 65 / 20%);\n  --wplace-shadow-slider-thumb: 0 3px 6px rgb(0 255 65 / 50%), 0 0 0 2px var(--wplace-icon-primary), 0 0 10px rgb(0 255 65 / 30%);\n  --wplace-shadow-slider-hover: 0 4px 8px rgb(0 255 65 / 60%), 0 0 0 3px var(--wplace-icon-primary), 0 0 15px rgb(0 255 65 / 40%);\n  \n  /* Animation colors - neon style */\n  --wplace-pulse-start: rgb(0 255 65 / 80%);\n  --wplace-pulse-mid: rgb(0 255 65 / 0%);\n  --wplace-pulse-end: rgb(0 255 65 / 0%);\n  \n  /* Slider colors - neon style */\n  --wplace-slider-thumb-bg: #00ff41;\n}\n\n/* Neon-specific styling overrides */\n.wplace-theme-neon #wplace-image-bot-container {\n  background: var(--wplace-primary) !important;\n  border: 2px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 20px rgb(0 255 65 / 10%) !important;\n  font-family: var(--wplace-font) !important;\n}\n\n.wplace-theme-neon #wplace-stats-container {\n  background: var(--wplace-primary) !important;\n  border: 2px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 20px rgb(0 255 65 / 10%) !important;\n  font-family: var(--wplace-font) !important;\n  position: fixed !important;\n  overflow: hidden !important;\n  z-index: 9998 !important;\n}\n\n.wplace-theme-neon .wplace-header {\n  background: var(--wplace-secondary) !important;\n  border-bottom: 1px solid var(--wplace-text) !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 10px var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n}\n\n.wplace-theme-neon .wplace-section {\n  background: rgb(22 33 62 / 50%) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n}\n\n.wplace-theme-neon .wplace-status-section {\n  background: rgb(22 33 62 / 50%) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n}\n\n.wplace-theme-neon .wplace-section-title {\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  text-transform: uppercase !important;\n  font-family: var(--wplace-font) !important;\n  font-size: 10px !important;\n}\n\n.wplace-theme-neon .wplace-btn {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 5px var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n  font-size: 9px !important;\n  text-transform: uppercase !important;\n}\n\n/* Pixel blinking and neon glow animation for buttons */\n.wplace-theme-neon .wplace-btn:hover:not(:disabled) {\n  box-shadow: 0 0 15px var(--wplace-text), inset 0 0 15px rgb(0 255 65 / 10%) !important;\n  animation: pixel-blink 0.5s infinite, neon-glow 1s ease-in-out infinite alternate !important;\n}\n\n.wplace-theme-neon .wplace-btn-start {\n  background: var(--wplace-secondary) !important;\n  border-color: var(--wplace-success) !important;\n  color: var(--wplace-success) !important;\n  text-shadow: 0 0 8px var(--wplace-success) !important;\n}\n\n.wplace-theme-neon .wplace-btn-stop {\n  background: var(--wplace-secondary) !important;\n  border-color: var(--wplace-error) !important;\n  color: var(--wplace-error) !important;\n  text-shadow: 0 0 8px var(--wplace-error) !important;\n}\n\n.wplace-theme-neon .wplace-btn-upload {\n  background: var(--wplace-secondary) !important;\n  border: 1px dashed var(--wplace-highlight) !important;\n  color: var(--wplace-highlight) !important;\n  text-shadow: 0 0 8px var(--wplace-highlight) !important;\n}\n\n.wplace-theme-neon .wplace-btn-select {\n  background: var(--wplace-secondary) !important;\n  border-color: var(--wplace-highlight) !important;\n  color: var(--wplace-highlight) !important;\n  text-shadow: 0 0 8px var(--wplace-highlight) !important;\n}\n\n.wplace-theme-neon .wplace-btn-file {\n  background: var(--wplace-secondary) !important;\n  border-color: var(--wplace-warning) !important;\n  color: var(--wplace-warning) !important;\n  text-shadow: 0 0 8px var(--wplace-warning) !important;\n}\n\n.wplace-theme-neon .wplace-progress {\n  background: rgb(0 0 0 / 80%) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n}\n\n.wplace-theme-neon .wplace-progress-bar {\n  background: linear-gradient(90deg, var(--wplace-success) 0%, var(--wplace-text) 100%) !important;\n  box-shadow: 0 0 10px var(--wplace-success) !important;\n}\n\n.wplace-theme-neon .wplace-stat-value {\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 5px var(--wplace-text) !important;\n}\n\n.wplace-theme-neon .status-success {\n  background: rgb(57 255 20 / 10%) !important;\n  border-color: var(--wplace-success) !important;\n  color: var(--wplace-success) !important;\n  box-shadow: 0 0 15px var(--wplace-success) !important;\n  text-shadow: 0 0 8px var(--wplace-success) !important;\n}\n\n.wplace-theme-neon .status-error {\n  background: rgb(255 7 58 / 10%) !important;\n  border-color: var(--wplace-error) !important;\n  color: var(--wplace-error) !important;\n  box-shadow: 0 0 15px var(--wplace-error) !important;\n  text-shadow: 0 0 8px var(--wplace-error) !important;\n}\n\n.wplace-theme-neon .status-default {\n  background: rgb(0 255 65 / 10%) !important;\n  border-color: var(--wplace-text) !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 5px var(--wplace-text) !important;\n}\n\n/* Settings dialog neon styling */\n.wplace-theme-neon #wplace-settings-container {\n  background: var(--wplace-primary) !important;\n  border: 2px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  box-shadow: 0 0 30px var(--wplace-text), inset 0 0 30px rgb(0 255 65 / 10%) !important;\n  font-family: var(--wplace-font) !important;\n}\n\n.wplace-theme-neon .wplace-settings-header {\n  background: var(--wplace-secondary) !important;\n  border-bottom: 1px solid var(--wplace-text) !important;\n}\n\n.wplace-theme-neon .wplace-settings-header h3 {\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 10px var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n  font-size: 16px !important;\n  text-transform: uppercase !important;\n}\n\n.wplace-theme-neon .wplace-settings-close-btn {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n}\n\n.wplace-theme-neon .wplace-settings-close-btn:hover {\n  background: var(--wplace-error) !important;\n  box-shadow: 0 0 15px var(--wplace-error) !important;\n}\n\n.wplace-theme-neon .wplace-settings-section-wrapper {\n  background: rgb(22 33 62 / 30%) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n}\n\n.wplace-theme-neon .wplace-settings-select {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n  font-size: 11px !important;\n}\n\n.wplace-theme-neon .wplace-settings-section-label {\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n  font-size: 12px !important;\n  text-transform: uppercase !important;\n}\n\n.wplace-theme-neon .wplace-speed-value {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n  box-shadow: 0 0 10px rgb(0 255 65 / 30%) !important;\n}\n\n.wplace-theme-neon .wplace-overlay-opacity-value {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 5px var(--wplace-text) !important;\n}\n\n/* Neon slider styling */\n.wplace-theme-neon .wplace-slider,\n.wplace-theme-neon .wplace-speed-slider,\n.wplace-theme-neon .wplace-overlay-opacity-slider {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  box-shadow: 0 0 10px rgb(0 255 65 / 30%) !important;\n}\n\n.wplace-theme-neon .wplace-slider::-webkit-slider-thumb,\n.wplace-theme-neon .wplace-speed-slider::-webkit-slider-thumb,\n.wplace-theme-neon .wplace-overlay-opacity-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 16px;\n  height: 16px;\n  border-radius: 0 !important;\n  background: var(--wplace-slider-thumb-bg) !important;\n  border: 2px solid var(--wplace-text) !important;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  box-shadow: 0 0 8px rgb(0 255 65 / 50%) !important;\n}\n\n.wplace-theme-neon .wplace-slider::-webkit-slider-thumb:hover,\n.wplace-theme-neon .wplace-speed-slider::-webkit-slider-thumb:hover,\n.wplace-theme-neon .wplace-overlay-opacity-slider::-webkit-slider-thumb:hover {\n  transform: scale(1.1);\n  box-shadow: 0 0 15px var(--wplace-text) !important;\n}\n\n/* Scanline animation for neon theme */\n.wplace-theme-neon #wplace-image-bot-container::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: linear-gradient(90deg, transparent, var(--wplace-text), transparent);\n  z-index: 1;\n  pointer-events: none;\n  animation: scanline 3s linear infinite;\n  opacity: 0.7;\n}\n\n\n.wplace-theme-neon #wplace-stats-container::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: linear-gradient(90deg, transparent, var(--wplace-text), transparent);\n  z-index: 1;\n  pointer-events: none;\n  animation: scanline-stats 4s linear infinite;\n  opacity: 0.7;\n}\n\n\n/* Text glow animations */\n@keyframes neon-glow {\n  0%, 100% {\n    text-shadow: 0 0 5px currentcolor, 0 0 10px currentcolor, 0 0 15px currentcolor;\n  }\n\n  50% {\n    text-shadow: 0 0 2px currentcolor, 0 0 5px currentcolor, 0 0 8px currentcolor;\n  }\n}\n\n@keyframes pixel-blink {\n  0%, 50% {\n    opacity: 1;\n  }\n\n  51%, 100% {\n    opacity: 0.7;\n  }\n}\n\n@keyframes scanline {\n  0% {\n    transform: translateY(-100%);\n  }\n\n  100% {\n    transform: translateY(400px);\n  }\n}\n\n@keyframes scanline-stats {\n  0% {\n    transform: translateY(-100%);\n  }\n\n  100% {\n    transform: translateY(300px);\n  }\n}\n\n/* Dual control layout styling for neon theme */\n.wplace-theme-neon .wplace-dual-control-compact {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 8px;\n  margin: 6px 0;\n  flex-wrap: wrap;\n}\n\n.wplace-theme-neon .wplace-slider-container-compact {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: 1;\n  min-width: 160px;\n}\n\n.wplace-theme-neon .wplace-speed-slider-container-compact {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: 1;\n  min-width: 160px;\n}\n\n.wplace-theme-neon .wplace-input-group-compact {\n  display: flex;\n  align-items: center;\n  gap: 3px;\n  flex-shrink: 0;\n}\n\n.wplace-theme-neon .wplace-input-btn-compact {\n  background: var(--wplace-secondary) !important;\n  border: 1px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  font-family: 'Press Start 2P', monospace !important;\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 10px rgb(0 255 65 / 10%) !important;\n  backdrop-filter: none !important;\n  font-size: 10px !important;\n  text-transform: uppercase !important;\n}\n\n/* Alert styling for neon theme */\n.wplace-theme-neon .wplace-alert-base {\n  border: 2px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  font-family: 'Press Start 2P', monospace !important;\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 10px rgb(0 255 65 / 10%) !important;\n  backdrop-filter: none !important;\n  font-size: 10px !important;\n  text-transform: uppercase !important;\n}\n\n.wplace-theme-neon .wplace-alert-info {\n  background: var(--wplace-primary) !important;\n  color: var(--wplace-text) !important;\n  border-color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 10px rgb(0 255 65 / 10%) !important;\n}\n\n.wplace-theme-neon .wplace-alert-success {\n  background: var(--wplace-primary) !important;\n  color: var(--wplace-success) !important;\n  border-color: var(--wplace-success) !important;\n  text-shadow: 0 0 8px var(--wplace-success) !important;\n  box-shadow: 0 0 20px var(--wplace-success), inset 0 0 10px rgb(57 255 20 / 10%) !important;\n}\n\n.wplace-theme-neon .wplace-alert-warning {\n  background: var(--wplace-primary) !important;\n  color: var(--wplace-warning) !important;\n  border-color: var(--wplace-warning) !important;\n  text-shadow: 0 0 8px var(--wplace-warning) !important;\n  box-shadow: 0 0 20px var(--wplace-warning), inset 0 0 10px rgb(255 255 0 / 10%) !important;\n}\n\n.wplace-theme-neon .wplace-alert-error {\n  background: var(--wplace-primary) !important;\n  color: var(--wplace-error) !important;\n  border-color: var(--wplace-error) !important;\n  text-shadow: 0 0 8px var(--wplace-error) !important;\n  box-shadow: 0 0 20px var(--wplace-error), inset 0 0 10px rgb(255 7 58 / 10%) !important;\n}\n\n/* Cooldown control styling for neon theme */\n.wplace-theme-neon .wplace-cooldown-control {\n  margin: 8px 0;\n}\n\n.wplace-theme-neon .wplace-cooldown-control label {\n  color: var(--wplace-text) !important;\n  font-weight: 500;\n  font-size: 11px;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: var(--wplace-font) !important;\n  text-transform: uppercase;\n  margin-bottom: 6px;\n  display: block;\n}\n\n/* Resize dialog styling for neon theme */\n.wplace-theme-neon .resize-container {\n  background: #1a1a2e !important;\n  border: 3px solid #00ff41 !important;\n  border-radius: 0 !important;\n  box-shadow: 0 0 30px rgb(0 255 65 / 50%) !important;\n  font-family: 'Press Start 2P', monospace !important;\n}\n\n/* Input field styling for neon theme */\n.wplace-theme-neon .wplace-speed-input,\n.wplace-theme-neon .wplace-cooldown-input {\n  background: var(--wplace-secondary) !important;\n  border: 2px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: 'Press Start 2P', monospace !important;\n  font-size: 10px !important;\n  box-shadow: 0 0 10px rgb(0 255 65 / 30%) !important;\n  text-align: center !important;\n  width: 50px !important;\n}\n\n.wplace-theme-neon .wplace-speed-input:focus,\n.wplace-theme-neon .wplace-cooldown-input:focus {\n  background: var(--wplace-primary) !important;\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 10px rgb(0 255 65 / 20%) !important;\n  text-shadow: 0 0 12px var(--wplace-text) !important;\n}\n\n/* Button styling for neon theme */\n.wplace-theme-neon .wplace-input-btn-small {\n  background: var(--wplace-secondary) !important;\n  border: 2px solid var(--wplace-text) !important;\n  border-radius: 0 !important;\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: 'Press Start 2P', monospace !important;\n  font-size: 10px !important;\n  width: 24px !important;\n  height: 24px !important;\n  box-shadow: 0 0 10px rgb(0 255 65 / 30%) !important;\n}\n\n.wplace-theme-neon .wplace-input-btn-small:hover {\n  box-shadow: 0 0 20px var(--wplace-text), inset 0 0 15px rgb(0 255 65 / 20%) !important;\n  animation: pixel-blink 0.5s infinite, neon-glow 1s ease-in-out infinite alternate !important;\n}\n\n/* Speed/Cooldown unit labels for neon theme */\n.wplace-theme-neon .wplace-speed-unit,\n.wplace-theme-neon .wplace-cooldown-unit {\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: 'Press Start 2P', monospace !important;\n  font-size: 9px !important;\n  text-transform: uppercase !important;\n}\n\n/* Min/Max labels for neon theme */\n.wplace-theme-neon .wplace-speed-labels {\n  padding: 0 !important;\n  width: 100% !important;\n  min-height: 16px !important;\n}\n\n.wplace-theme-neon .wplace-speed-min,\n.wplace-theme-neon .wplace-speed-max {\n  color: var(--wplace-text) !important;\n  text-shadow: 0 0 8px var(--wplace-text) !important;\n  font-family: 'Press Start 2P', monospace !important;\n  font-size: 9px !important;\n  text-transform: uppercase !important;\n  gap: 6px !important;\n}\n\n.wplace-theme-neon .wplace-speed-min i,\n.wplace-theme-neon .wplace-speed-max i {\n  text-shadow: 0 0 5px currentColor !important;\n}\n\n"
  };
  var EMBEDDED_LANGUAGES = {
    "en": {
      "title": "Auto-Image",
      "toggleOverlay": "Toggle Overlay",
      "scanColors": "Scan Colors",
      "uploadImage": "Upload",
      "resizeImage": "Resize",
      "selectPosition": "Select Position",
      "startPainting": "Start",
      "stopPainting": "Stop",
      "checkingColors": "\u{1F50D} Checking available colors...",
      "noColorsFound": "\u274C To update the color swatch, open the color palette on the site and try again!",
      "colorsUpdated": "\u2705 Available colors increased {oldCount} -> {newCount}, {diffCount} new colors found",
      "colorsFound": "\u2705 {count} available colors found. Ready to upload.",
      "loadingImage": "\u{1F5BC}\uFE0F Loading image...",
      "imageLoaded": "\u2705 Image loaded with {count} valid pixels",
      "imageError": "\u274C Error loading image",
      "selectPositionAlert": "Paint the first pixel at the location where you want the art to start!",
      "waitingPosition": "\u{1F446} Waiting for you to paint the reference pixel...",
      "positionSet": "\u2705 Position set successfully!",
      "positionTimeout": "\u274C Timeout for position selection",
      "startPaintingMsg": "\u{1F3A8} Starting painting...",
      "paintingProgress": "\u{1F9F1} Progress: {painted}/{total} pixels...",
      "noCharges": "\u231B No charges. Waiting {time}...",
      "overlayTilesNotLoaded": "\u274C Required map tiles not loaded. Check connection or retry.",
      "paintingStoppedByUser": "\u23F9\uFE0F Painting stopped by user",
      "paintingBatchFailed": "\u274C Failed to send pixel batch after retries. Painting stopped.",
      "paintingPixelCheckFailed": "\u274C Failed to read pixel at ({x}, {y}). Painting stopped.",
      "paintingFinalBatchFailed": "\u26A0\uFE0F Final batch of {count} pixels failed after retries.",
      "paintingComplete": "\u2705 Painting complete! {count} pixels painted.",
      "paintingError": "\u274C Unexpected error during painting",
      "missingRequirements": "\u274C Load an image and select a position first",
      "progress": "Progress",
      "pixels": "Pixels",
      "charges": "Charges",
      "fullChargeIn": "Full Charge In",
      "estimatedTime": "Estimated time",
      "initMessage": "Click 'Upload Image' to begin",
      "waitingInit": "Waiting for initialization...",
      "initializingToken": "\u{1F527} Initializing Turnstile token generator...",
      "tokenReady": "\u2705 Token generator ready - you can now start painting!",
      "tokenRetryLater": "\u26A0\uFE0F Token generator will retry when needed",
      "resizeSuccess": "\u2705 Image resized to {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F Painting paused at position X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 Token generation failed. Please try again in a moment.",
      "saveData": "Save Progress",
      "loadData": "Load Progress",
      "saveToFile": "Save to File",
      "loadFromFile": "Load from File",
      "dataManager": "Data Manager",
      "autoSaved": "\u2705 Progress saved automatically",
      "dataLoaded": "\u2705 Progress loaded successfully",
      "fileSaved": "\u2705 Progress saved to file successfully",
      "fileLoaded": "\u2705 Progress loaded from file successfully",
      "noSavedData": "\u274C No saved progress found",
      "savedDataFound": "\u2705 Saved progress found! Load to continue?",
      "savedDate": "Saved on: {date}",
      "clickLoadToContinue": "Click 'Load Progress' to continue.",
      "fileError": "\u274C Error processing file",
      "invalidFileFormat": "\u274C Invalid file format",
      "paintingSpeed": "Painting Speed",
      "pixelsPerSecond": "pixels/second",
      "speedSetting": "Speed: {speed} pixels/sec",
      "settings": "Settings",
      "botSettings": "Bot Settings",
      "close": "Close",
      "language": "Language",
      "themeSettings": "Theme Settings",
      "themeSettingsDesc": "Choose your preferred color theme for the interface.",
      "languageSelectDesc": "Select your preferred language. Changes will take effect immediately.",
      "autoCaptcha": "Auto-CAPTCHA Solver (Turnstile)",
      "autoCaptchaDesc": "Automatically generates Turnstile tokens using integrated generator. Falls back to browser automation if needed.",
      "applySettings": "Apply Settings",
      "settingsSaved": "\u2705 Settings saved successfully!",
      "speedOn": "On",
      "speedOff": "Off",
      "cooldownSettings": "Cooldown Settings",
      "waitCharges": "Wait until charges reach",
      "captchaSolving": "\u{1F511} Generating Turnstile token...",
      "captchaFailed": "\u274C Turnstile token generation failed. Trying fallback method...",
      "automation": "Automation",
      "noChargesThreshold": "\u231B Waiting to reach {threshold} charges. Currently {current}. Estimated time: {time}.",
      "tokenCapturedSuccess": "Token captured successfully! You can start the bot now.",
      "notificationsNotSupported": "Notifications are not supported in this browser.",
      "chargesReadyNotification": "WPlace \u2014 Charges Ready",
      "chargesReadyMessage": "Charges ready: {current} / {max}. Threshold: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Test",
      "testNotificationMessage": "This is a test notification.",
      "showStats": "Show Stats",
      "compactMode": "Compact Mode",
      "refreshCharges": "Refresh Charges",
      "closeStats": "Close Stats",
      "zoomOut": "Zoom Out",
      "zoomIn": "Zoom In",
      "fitToView": "Fit to view",
      "actualSize": "Actual size (100%)",
      "panMode": "Pan (drag to move view)",
      "clearIgnoredPixels": "Clear all ignored pixels",
      "invertMask": "Invert mask",
      "waitingSetupComplete": "\u{1F504} Waiting for initial setup to complete...",
      "waitingTokenGenerator": "\u{1F504} Waiting for token generator to initialize...",
      "uploadImageFirst": "Upload an image first to capture available colors",
      "pleaseWaitInitialSetup": "\u{1F504} Please wait for the initial setup to complete before loading progress.",
      "pleaseWaitFileSetup": "\u{1F504} Please wait for the initial setup to complete before loading from file.",
      "errorSavingProgress": "\u274C Error saving progress",
      "errorLoadingProgress": "\u274C Error loading progress",
      "fileOperationsAvailable": "\u{1F4C2} File operations (Load/Upload) are now available!",
      "tokenGeneratorReady": "\u{1F511} Token generator ready!",
      "paintingStats": "Painting Stats",
      "enablePaintingSpeedLimit": "Enable painting speed limit (batch size control)",
      "enableNotifications": "Enable notifications",
      "notifyOnChargesThreshold": "Notify when charges reach threshold",
      "onlyWhenNotFocused": "Only when tab is not focused",
      "repeatEvery": "Repeat every",
      "minutesPl": "minute(s)",
      "grantPermission": "Grant Permission",
      "test": "Test",
      "showAllColorsIncluding": "Show All Colors (including unavailable)",
      "chromaWeight": "Chroma Weight",
      "downloadPreview": "Download Preview",
      "apply": "Apply",
      "cancel": "Cancel",
      "fit": "Fit",
      "hundred": "100%",
      "clear": "Clear",
      "invert": "Invert",
      "reprocessingOverlay": "Re-processing overlay...",
      "overlayUpdated": "Overlay updated!",
      "notificationsEnabled": "Notifications enabled.",
      "notificationsPermissionDenied": "Notifications permission denied.",
      "overlayEnabled": "Overlay enabled.",
      "overlayDisabled": "Overlay disabled.",
      "tokenSourceSet": "Token source set to: {source}",
      "batchModeSet": "Batch mode set to: {mode}",
      "randomRange": "Random Range",
      "normalFixedSize": "Normal Fixed Size",
      "advancedColorSettingsReset": "Advanced color settings reset.",
      "shiftRowAltColumn": "Shift = Row \u2022 Alt = Column",
      "hideTurnstileBtn": "Hide",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 please complete the check if shown",
      "uploadImageFirstColors": "Please upload an image first to capture available colors",
      "availableColors": "Available Colors ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "Expand Mode",
      "minimize": "Minimize",
      "restore": "Restore",
      "hideStats": "Hide Stats",
      "paintOptions": "Paint Options",
      "paintWhitePixels": "Paint White",
      "paintWhitePixelsDescription": "If enabled, template white pixels will be painted.",
      "paintTransparentPixels": "Paint Transparent",
      "paintTransparentPixelsDescription": "If enabled, template transparent pixels will be painted",
      "paintUnavailablePixels": "Paint Unavailable",
      "paintUnavailablePixelsDescription": "If enabled, template colors that are unavailable will be painted using the closest available color"
    },
    "es-MX": {
      "title": "WPlace Auto-Imagen",
      "toggleOverlay": "Alternar superposici\xF3n",
      "scanColors": "Escanear colores",
      "uploadImage": "Subir imagen",
      "resizeImage": "Cambiar tama\xF1o de imagen",
      "selectPosition": "Seleccionar posici\xF3n",
      "startPainting": "Iniciar pintado",
      "stopPainting": "Detener pintado",
      "checkingColors": "\u{1F50D} Verificando colores disponibles...",
      "noColorsFound": "\u274C \xA1Abre la paleta de colores en el sitio e int\xE9ntalo de nuevo!",
      "colorsFound": "\u2705 Se encontraron {count} colores disponibles. Listo para subir.",
      "loadingImage": "\u{1F5BC}\uFE0F Cargando imagen...",
      "imageLoaded": "\u2705 Imagen cargada con {count} p\xEDxeles v\xE1lidos",
      "imageError": "\u274C Error al cargar la imagen",
      "selectPositionAlert": "\xA1Pinta el primer p\xEDxel en la ubicaci\xF3n donde quieres que comience el arte!",
      "waitingPosition": "\u{1F446} Esperando que pintes el p\xEDxel de referencia...",
      "positionSet": "\u2705 \xA1Posici\xF3n establecida con \xE9xito!",
      "positionTimeout": "\u274C Tiempo de espera para seleccionar la posici\xF3n agotado",
      "startPaintingMsg": "\u{1F3A8} Iniciando pintado...",
      "paintingProgress": "\u{1F9F1} Progreso: {painted}/{total} p\xEDxeles...",
      "noCharges": "\u231B Sin cargas. Esperando {time}...",
      "paintingStopped": "\u23F9\uFE0F Pintado detenido por el usuario",
      "paintingComplete": "\u2705 \xA1Pintado completo! Se pintaron {count} p\xEDxeles.",
      "paintingError": "\u274C Error durante el pintado",
      "missingRequirements": "\u274C Primero carga una imagen y selecciona una posici\xF3n",
      "progress": "Progreso",
      "pixels": "P\xEDxeles",
      "charges": "Cargas",
      "estimatedTime": "Tiempo estimado",
      "initMessage": "Haz clic en 'Subir imagen' para comenzar",
      "waitingInit": "Esperando inicializaci\xF3n...",
      "initializingToken": "\u{1F527} Inicializando generador de token Turnstile...",
      "tokenReady": "\u2705 \xA1Generador de token listo! Ya puedes empezar a pintar.",
      "tokenRetryLater": "\u26A0\uFE0F El generador de token volver\xE1 a intentarlo cuando sea necesario",
      "resizeSuccess": "\u2705 Imagen redimensionada a {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F Pintado pausado en la posici\xF3n X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 Fall\xF3 la generaci\xF3n de token. Por favor, int\xE9ntalo de nuevo en un momento.",
      "saveData": "Guardar progreso",
      "loadData": "Cargar progreso",
      "saveToFile": "Guardar en archivo",
      "loadFromFile": "Cargar desde archivo",
      "dataManager": "Gestor de datos",
      "autoSaved": "\u2705 Progreso guardado autom\xE1ticamente",
      "dataLoaded": "\u2705 Progreso cargado con \xE9xito",
      "fileSaved": "\u2705 Progreso guardado en archivo con \xE9xito",
      "fileLoaded": "\u2705 Progreso cargado desde archivo con \xE9xito",
      "noSavedData": "\u274C No se encontr\xF3 progreso guardado",
      "savedDataFound": "\u2705 \xA1Se encontr\xF3 progreso guardado! \xBFCargar para continuar?",
      "savedDate": "Guardado el: {date}",
      "clickLoadToContinue": "Haz clic en 'Cargar progreso' para continuar.",
      "fileError": "\u274C Error al procesar el archivo",
      "invalidFileFormat": "\u274C Formato de archivo inv\xE1lido",
      "paintingSpeed": "Velocidad de pintado",
      "pixelsPerSecond": "p\xEDxeles/segundo",
      "speedSetting": "Velocidad: {speed} p\xEDxeles/seg",
      "settings": "Ajustes",
      "botSettings": "Ajustes del bot",
      "close": "Cerrar",
      "language": "Idioma",
      "themeSettings": "Ajustes de tema",
      "themeSettingsDesc": "Elige tu tema de color preferido para la interfaz.",
      "languageSelectDesc": "Selecciona tu idioma preferido. Los cambios se aplicar\xE1n inmediatamente.",
      "autoCaptcha": "Solucionador autom\xE1tico de CAPTCHA (Turnstile)",
      "autoCaptchaDesc": "Genera autom\xE1ticamente tokens de Turnstile usando el generador integrado. Utiliza la automatizaci\xF3n del navegador como alternativa si es necesario.",
      "applySettings": "Aplicar ajustes",
      "settingsSaved": "\u2705 \xA1Ajustes guardados con \xE9xito!",
      "speedOn": "Activado",
      "speedOff": "Desactivado",
      "cooldownSettings": "Ajustes de tiempo de espera",
      "waitCharges": "Esperar hasta que las cargas lleguen a",
      "captchaSolving": "\u{1F511} Generando token de Turnstile...",
      "captchaFailed": "\u274C Fall\xF3 la generaci\xF3n de token de Turnstile. Probando m\xE9todo alternativo...",
      "automation": "Automatizaci\xF3n",
      "noChargesThreshold": "\u231B Esperando que las cargas lleguen a {threshold}. Actual: {current}. Siguiente en {time}...",
      "tokenCapturedSuccess": "\xA1Token capturado con \xE9xito! Ya puedes iniciar el bot.",
      "notificationsNotSupported": "Las notificaciones no son compatibles con este navegador.",
      "chargesReadyNotification": "WPlace \u2014 Cargas listas",
      "chargesReadyMessage": "Cargas listas: {current} / {max}. Umbral: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Prueba",
      "testNotificationMessage": "Esta es una notificaci\xF3n de prueba.",
      "showStats": "Mostrar estad\xEDsticas",
      "compactMode": "Modo compacto",
      "refreshCharges": "Actualizar cargas",
      "closeStats": "Cerrar estad\xEDsticas",
      "zoomOut": "Alejar",
      "zoomIn": "Acercar",
      "fitToView": "Ajustar a la vista",
      "actualSize": "Tama\xF1o real (100%)",
      "panMode": "Desplazamiento (arrastra para mover la vista)",
      "clearIgnoredPixels": "Limpiar todos los p\xEDxeles ignorados",
      "invertMask": "Invertir m\xE1scara",
      "waitingSetupComplete": "\u{1F504} Esperando que se complete la configuraci\xF3n inicial...",
      "waitingTokenGenerator": "\u{1F504} Esperando que se inicialice el generador de tokens...",
      "uploadImageFirst": "Sube una imagen primero para capturar los colores disponibles",
      "pleaseWaitInitialSetup": "\u{1F504} Por favor, espera a que se complete la configuraci\xF3n inicial antes de cargar el progreso.",
      "pleaseWaitFileSetup": "\u{1F504} Por favor, espera a que se complete la configuraci\xF3n inicial antes de cargar desde un archivo.",
      "errorSavingProgress": "\u274C Error al guardar el progreso",
      "errorLoadingProgress": "\u274C Error al cargar el progreso",
      "fileOperationsAvailable": "\u{1F4C2} \xA1Las operaciones de archivo (Cargar/Subir) ya est\xE1n disponibles!",
      "tokenGeneratorReady": "\u{1F511} \xA1Generador de tokens listo!",
      "paintingStats": "Estad\xEDsticas de pintado",
      "enablePaintingSpeedLimit": "Activar l\xEDmite de velocidad de pintado (control de lotes)",
      "enableNotifications": "Activar notificaciones",
      "notifyOnChargesThreshold": "Notificar cuando las cargas alcancen el umbral",
      "onlyWhenNotFocused": "Solo cuando la pesta\xF1a no est\xE9 en foco",
      "repeatEvery": "Repetir cada",
      "minutesPl": "minuto(s)",
      "grantPermission": "Otorgar permiso",
      "test": "Probar",
      "showAllColorsIncluding": "Mostrar todos los colores (incluidos los no disponibles)",
      "chromaWeight": "Peso de croma",
      "downloadPreview": "Descargar vista previa",
      "apply": "Aplicar",
      "cancel": "Cancelar",
      "fit": "Ajustar",
      "hundred": "100%",
      "clear": "Limpiar",
      "invert": "Invertir",
      "reprocessingOverlay": "Reprocesando superposici\xF3n...",
      "overlayUpdated": "\xA1Superposici\xF3n actualizada!",
      "notificationsEnabled": "Notificaciones activadas.",
      "notificationsPermissionDenied": "Permiso de notificaciones denegado.",
      "overlayEnabled": "Superposici\xF3n activada.",
      "overlayDisabled": "Superposici\xF3n desactivada.",
      "tokenSourceSet": "Fuente de token establecida en: {source}",
      "batchModeSet": "Modo por lotes establecido en: {mode}",
      "randomRange": "Rango aleatorio",
      "normalFixedSize": "Tama\xF1o fijo normal",
      "advancedColorSettingsReset": "Ajustes de color avanzados restablecidos.",
      "shiftRowAltColumn": "Shift = Fila \u2022 Alt = Columna",
      "hideTurnstileBtn": "Ocultar",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 por favor, completa la verificaci\xF3n si se muestra",
      "uploadImageFirstColors": "Por favor, sube una imagen primero para capturar los colores disponibles",
      "availableColors": "Colores disponibles ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "Modo expandido",
      "minimize": "Minimizar",
      "restore": "Restaurar",
      "hideStats": "Ocultar estad\xEDsticas",
      "paintOptions": "Opciones de pintado",
      "paintWhitePixels": "Pintar p\xEDxeles blancos",
      "paintTransparentPixels": "Pintar p\xEDxeles transparentes"
    },
    "fr": {
      "title": "WPlace Auto-Image",
      "toggleOverlay": "Basculer l'overlay",
      "scanColors": "Scanner les couleurs",
      "uploadImage": "T\xE9l\xE9charger l'image",
      "resizeImage": "Redimensionner l'image",
      "selectPosition": "S\xE9lectionner la position",
      "startPainting": "Commencer \xE0 peindre",
      "stopPainting": "Arr\xEAter de peindre",
      "checkingColors": "\u{1F50D} V\xE9rification des couleurs disponibles...",
      "noColorsFound": "\u274C Ouvrez la palette de couleurs sur le site et r\xE9essayez!",
      "colorsFound": "\u2705 {count} couleurs trouv\xE9es. Pr\xEAt \xE0 t\xE9l\xE9charger.",
      "loadingImage": "\u{1F5BC}\uFE0F Chargement de l'image...",
      "imageLoaded": "\u2705 Image charg\xE9e avec {count} pixels valides",
      "imageError": "\u274C Erreur lors du chargement de l'image",
      "selectPositionAlert": "Peignez le premier pixel \xE0 l'endroit o\xF9 vous voulez que l'art commence!",
      "waitingPosition": "\u{1F446} En attente que vous peigniez le pixel de r\xE9f\xE9rence...",
      "positionSet": "\u2705 Position d\xE9finie avec succ\xE8s!",
      "positionTimeout": "\u274C D\xE9lai d'attente pour la s\xE9lection de position",
      "startPaintingMsg": "\u{1F3A8} D\xE9but de la peinture...",
      "paintingProgress": "\u{1F9F1} Progr\xE8s: {painted}/{total} pixels...",
      "noCharges": "\u231B Aucune charge. En attente {time}...",
      "paintingStopped": "\u23F9\uFE0F Peinture arr\xEAt\xE9e par l'utilisateur",
      "paintingComplete": "\u2705 Peinture termin\xE9e! {count} pixels peints.",
      "paintingError": "\u274C Erreur pendant la peinture",
      "missingRequirements": "\u274C Veuillez charger une image et s\xE9lectionner une position d'abord",
      "progress": "Progr\xE8s",
      "pixels": "Pixels",
      "charges": "Charges",
      "estimatedTime": "Temps estim\xE9",
      "initMessage": "Cliquez sur 'T\xE9l\xE9charger l'image' pour commencer",
      "waitingInit": "En attente d'initialisation...",
      "initializingToken": "\u{1F527} Initialisation du g\xE9n\xE9rateur de tokens Turnstile...",
      "tokenReady": "\u2705 G\xE9n\xE9rateur de tokens pr\xEAt - vous pouvez commencer \xE0 peindre!",
      "tokenRetryLater": "\u26A0\uFE0F Le g\xE9n\xE9rateur de tokens r\xE9essaiera si n\xE9cessaire",
      "resizeSuccess": "\u2705 Image redimensionn\xE9e en {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F Peinture en pause \xE0 la position X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 \xC9chec de la g\xE9n\xE9ration de token. Veuillez r\xE9essayer dans un moment.",
      "saveData": "Sauvegarder le progr\xE8s",
      "loadData": "Charger le progr\xE8s",
      "saveToFile": "Sauvegarder dans un fichier",
      "loadFromFile": "Charger depuis un fichier",
      "dataManager": "Donn\xE9es",
      "autoSaved": "\u2705 Progr\xE8s sauvegard\xE9 automatiquement",
      "dataLoaded": "\u2705 Progr\xE8s charg\xE9 avec succ\xE8s",
      "fileSaved": "\u2705 Sauvegard\xE9 dans un fichier avec succ\xE8s",
      "fileLoaded": "\u2705 Charg\xE9 depuis un fichier avec succ\xE8s",
      "noSavedData": "\u274C Aucun progr\xE8s sauvegard\xE9 trouv\xE9",
      "savedDataFound": "\u2705 Progr\xE8s sauvegard\xE9 trouv\xE9! Charger pour continuer?",
      "savedDate": "Sauvegard\xE9 le: {date}",
      "clickLoadToContinue": "Cliquez sur 'Charger le progr\xE8s' pour continuer.",
      "fileError": "\u274C Erreur lors du traitement du fichier",
      "invalidFileFormat": "\u274C Format de fichier invalide",
      "paintingSpeed": "Vitesse de peinture",
      "pixelsPerSecond": "pixels/seconde",
      "speedSetting": "Vitesse: {speed} pixels/sec",
      "settings": "Param\xE8tres",
      "botSettings": "Param\xE8tres du Bot",
      "close": "Fermer",
      "language": "Langue",
      "themeSettings": "Param\xE8tres de Th\xE8me",
      "themeSettingsDesc": "Choisissez votre th\xE8me de couleurs pr\xE9f\xE9r\xE9 pour l'interface.",
      "languageSelectDesc": "S\xE9lectionnez votre langue pr\xE9f\xE9r\xE9e. Les changements prendront effet imm\xE9diatement.",
      "autoCaptcha": "R\xE9solveur de CAPTCHA automatique (Turnstile)",
      "autoCaptchaDesc": "G\xE9n\xE8re automatiquement des jetons Turnstile en utilisant le g\xE9n\xE9rateur int\xE9gr\xE9. Se replie sur l'automatisation du navigateur si n\xE9cessaire.",
      "applySettings": "Appliquer les param\xE8tres",
      "settingsSaved": "\u2705 Param\xE8tres enregistr\xE9s avec succ\xE8s !",
      "speedOn": "Activ\xE9",
      "speedOff": "D\xE9sactiv\xE9",
      "cooldownSettings": "Param\xE8tres de recharge",
      "waitCharges": "Attendre que les charges atteignent",
      "captchaSolving": "\u{1F511} G\xE9n\xE9ration du jeton Turnstile...",
      "captchaFailed": "\u274C \xC9chec de g\xE9n\xE9ration du jeton Turnstile. Tentative de m\xE9thode alternative...",
      "automation": "Automatisation",
      "noChargesThreshold": "\u231B En attente que les charges atteignent {threshold}. Actuel: {current}. Prochaine dans {time}...",
      "tokenCapturedSuccess": "Jeton captur\xE9 avec succ\xE8s ! Vous pouvez d\xE9marrer le bot maintenant.",
      "notificationsNotSupported": "Les notifications ne sont pas support\xE9es dans ce navigateur.",
      "chargesReadyNotification": "WPlace \u2014 Charges Pr\xEAtes",
      "chargesReadyMessage": "Charges pr\xEAtes : {current} / {max}. Seuil : {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Test",
      "testNotificationMessage": "Ceci est une notification de test.",
      "showStats": "Afficher les Stats",
      "compactMode": "Mode Compact",
      "refreshCharges": "Actualiser les Charges",
      "closeStats": "Fermer les Stats",
      "zoomOut": "D\xE9zoomer",
      "zoomIn": "Zoomer",
      "fitToView": "Ajuster \xE0 la vue",
      "actualSize": "Taille r\xE9elle (100%)",
      "panMode": "Panoramique (glisser pour d\xE9placer la vue)",
      "clearIgnoredPixels": "Effacer tous les pixels ignor\xE9s",
      "invertMask": "Inverser le masque",
      "waitingSetupComplete": "\u{1F504} En attente de la fin de l'installation initiale...",
      "waitingTokenGenerator": "\u{1F504} En attente de l'initialisation du g\xE9n\xE9rateur de jetons...",
      "uploadImageFirst": "T\xE9l\xE9chargez d'abord une image pour capturer les couleurs disponibles",
      "pleaseWaitInitialSetup": "\u{1F504} Veuillez attendre la fin de l'installation initiale avant de charger les progr\xE8s.",
      "pleaseWaitFileSetup": "\u{1F504} Veuillez attendre la fin de l'installation initiale avant de charger depuis un fichier.",
      "errorSavingProgress": "\u274C Erreur lors de la sauvegarde des progr\xE8s",
      "errorLoadingProgress": "\u274C Erreur lors du chargement des progr\xE8s",
      "fileOperationsAvailable": "\u{1F4C2} Les op\xE9rations sur fichiers (Charger/T\xE9l\xE9charger) sont maintenant disponibles !",
      "tokenGeneratorReady": "\u{1F511} G\xE9n\xE9rateur de jetons pr\xEAt !",
      "paintingStats": "Statistiques de Peinture",
      "enablePaintingSpeedLimit": "Activer la limite de vitesse de peinture (contr\xF4le de la taille de lot)",
      "enableNotifications": "Activer les notifications",
      "notifyOnChargesThreshold": "Notifier quand les charges atteignent le seuil",
      "onlyWhenNotFocused": "Seulement quand l'onglet n'est pas au premier plan",
      "repeatEvery": "R\xE9p\xE9ter toutes les",
      "minutesPl": "minute(s)",
      "grantPermission": "Accorder la Permission",
      "test": "Test",
      "showAllColorsIncluding": "Afficher toutes les couleurs (y compris indisponibles)",
      "chromaWeight": "Poids de Chrominance",
      "downloadPreview": "T\xE9l\xE9charger l'Aper\xE7u",
      "apply": "Appliquer",
      "cancel": "Annuler",
      "fit": "Ajuster",
      "hundred": "100%",
      "clear": "Effacer",
      "invert": "Inverser",
      "reprocessingOverlay": "Retraitement de l'overlay...",
      "overlayUpdated": "Overlay mis \xE0 jour !",
      "notificationsEnabled": "Notifications activ\xE9es.",
      "notificationsPermissionDenied": "Permission de notifications refus\xE9e.",
      "overlayEnabled": "Overlay activ\xE9.",
      "overlayDisabled": "Overlay d\xE9sactiv\xE9.",
      "tokenSourceSet": "Source de jeton d\xE9finie \xE0 : {source}",
      "batchModeSet": "Mode lot d\xE9fini \xE0 : {mode}",
      "randomRange": "Plage Al\xE9atoire",
      "normalFixedSize": "Taille Fixe Normale",
      "advancedColorSettingsReset": "Param\xE8tres de couleur avanc\xE9s r\xE9initialis\xE9s.",
      "shiftRowAltColumn": "Shift = Ligne \u2022 Alt = Colonne",
      "hideTurnstileBtn": "Masquer",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 veuillez compl\xE9ter la v\xE9rification si affich\xE9e",
      "uploadImageFirstColors": "Veuillez d'abord t\xE9l\xE9charger une image pour capturer les couleurs disponibles",
      "availableColors": "Couleurs Disponibles ({count})",
      "colorTooltip": "ID : {id}\nRVB : {rgb}",
      "expandMode": "Mode \xC9tendu",
      "minimize": "R\xE9duire",
      "restore": "Restaurer",
      "hideStats": "Masquer les Stats",
      "paintOptions": "Options de peinture",
      "paintWhitePixels": "Peindre les pixels blancs",
      "paintTransparentPixels": "Peindre les pixels transparents"
    },
    "id": {
      "title": "WPlace Auto-Image",
      "toggleOverlay": "Toggle Overlay",
      "scanColors": "Pindai Warna",
      "uploadImage": "Unggah Gambar",
      "resizeImage": "Ubah Ukuran Gambar",
      "selectPosition": "Pilih Posisi",
      "startPainting": "Mulai Melukis",
      "stopPainting": "Berhenti Melukis",
      "checkingColors": "\u{1F50D} Memeriksa warna yang tersedia...",
      "noColorsFound": "\u274C Buka palet warna di situs dan coba lagi!",
      "colorsFound": "\u2705 {count} warna ditemukan. Siap untuk diunggah.",
      "loadingImage": "\u{1F5BC}\uFE0F Memuat gambar...",
      "imageLoaded": "\u2705 Gambar dimuat dengan {count} piksel valid",
      "imageError": "\u274C Kesalahan saat memuat gambar",
      "selectPositionAlert": "Lukis piksel pertama di lokasi tempat karya seni akan dimulai!",
      "waitingPosition": "\u{1F446} Menunggu Anda melukis piksel referensi...",
      "positionSet": "\u2705 Posisi berhasil diatur!",
      "positionTimeout": "\u274C Waktu habis untuk memilih posisi",
      "startPaintingMsg": "\u{1F3A8} Mulai melukis...",
      "paintingProgress": "\u{1F9F1} Progres: {painted}/{total} piksel...",
      "noCharges": "\u231B Tidak ada muatan. Menunggu {time}...",
      "paintingStopped": "\u23F9\uFE0F Melukis dihentikan oleh pengguna",
      "paintingComplete": "\u2705 Melukis selesai! {count} piksel telah dilukis.",
      "paintingError": "\u274C Kesalahan selama melukis",
      "missingRequirements": "\u274C Unggah gambar dan pilih posisi terlebih dahulu",
      "progress": "Progres",
      "pixels": "Piksel",
      "charges": "Muatan",
      "estimatedTime": "Perkiraan waktu",
      "initMessage": "Klik 'Unggah Gambar' untuk memulai",
      "waitingInit": "Menunggu inisialisasi...",
      "initializingToken": "\u{1F527} Menginisialisasi generator token Turnstile...",
      "tokenReady": "\u2705 Generator token siap - Anda bisa mulai melukis!",
      "tokenRetryLater": "\u26A0\uFE0F Generator token akan mencoba lagi saat diperlukan",
      "resizeSuccess": "\u2705 Gambar berhasil diubah ukurannya menjadi {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F Melukis dijeda di posisi X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 Pembuatan token gagal. Silakan coba lagi sebentar lagi.",
      "saveData": "Simpan Progres",
      "loadData": "Muat Progres",
      "saveToFile": "Simpan ke File",
      "loadFromFile": "Muat dari File",
      "dataManager": "Data",
      "autoSaved": "\u2705 Progres disimpan secara otomatis",
      "dataLoaded": "\u2705 Progres berhasil dimuat",
      "fileSaved": "\u2705 Berhasil disimpan ke file",
      "fileLoaded": "\u2705 Berhasil dimuat dari file",
      "noSavedData": "\u274C Tidak ditemukan progres yang disimpan",
      "savedDataFound": "\u2705 Progres yang disimpan ditemukan! Muat untuk melanjutkan?",
      "savedDate": "Disimpan pada: {date}",
      "clickLoadToContinue": "Klik 'Muat Progres' untuk melanjutkan.",
      "fileError": "\u274C Kesalahan saat memproses file",
      "invalidFileFormat": "\u274C Format file tidak valid",
      "paintingSpeed": "Kecepatan Melukis",
      "pixelsPerSecond": "piksel/detik",
      "speedSetting": "Kecepatan: {speed} piksel/detik",
      "settings": "Pengaturan",
      "botSettings": "Pengaturan Bot",
      "close": "Tutup",
      "language": "Bahasa",
      "themeSettings": "Pengaturan Tema",
      "themeSettingsDesc": "Pilih tema warna favorit Anda untuk antarmuka.",
      "languageSelectDesc": "Pilih bahasa yang Anda inginkan. Perubahan akan berlaku segera.",
      "autoCaptcha": "Penyelesai CAPTCHA Otomatis",
      "autoCaptchaDesc": "Mencoba menyelesaikan CAPTCHA secara otomatis dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",
      "applySettings": "Terapkan Pengaturan",
      "settingsSaved": "\u2705 Pengaturan berhasil disimpan!",
      "speedOn": "Nyala",
      "speedOff": "Mati",
      "cooldownSettings": "Pengaturan Cooldown",
      "waitCharges": "Tunggu hingga muatan mencapai",
      "captchaSolving": "\u{1F916} Mencoba menyelesaikan CAPTCHA...",
      "captchaFailed": "\u274C Gagal menyelesaikan CAPTCHA. Lukis satu piksel secara manual.",
      "automation": "Automasi",
      "noChargesThreshold": "\u231B Menunggu muatan mencapai {threshold}. Saat ini: {current}. Berikutnya dalam {time}...",
      "tokenCapturedSuccess": "Token berhasil ditangkap! Anda bisa memulai bot sekarang.",
      "notificationsNotSupported": "Notifikasi tidak didukung di browser ini.",
      "chargesReadyNotification": "WPlace \u2014 Muatan Siap",
      "chargesReadyMessage": "Muatan siap: {current} / {max}. Batas: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Tes",
      "testNotificationMessage": "Ini adalah notifikasi tes.",
      "showStats": "Tampilkan Statistik",
      "compactMode": "Mode Kompak",
      "refreshCharges": "Segarkan Muatan",
      "closeStats": "Tutup Statistik",
      "zoomOut": "Perkecil",
      "zoomIn": "Perbesar",
      "fitToView": "Sesuaikan tampilan",
      "actualSize": "Ukuran sebenarnya (100%)",
      "panMode": "Geser (seret untuk memindahkan tampilan)",
      "clearIgnoredPixels": "Bersihkan semua piksel yang diabaikan",
      "invertMask": "Balik masker",
      "waitingSetupComplete": "\u{1F504} Menunggu pengaturan awal selesai...",
      "waitingTokenGenerator": "\u{1F504} Menunggu generator token diinisialisasi...",
      "uploadImageFirst": "Unggah gambar terlebih dahulu untuk menangkap warna yang tersedia",
      "pleaseWaitInitialSetup": "\u{1F504} Harap tunggu pengaturan awal selesai sebelum memuat progres.",
      "pleaseWaitFileSetup": "\u{1F504} Harap tunggu pengaturan awal selesai sebelum memuat dari file.",
      "errorSavingProgress": "\u274C Kesalahan menyimpan progres",
      "errorLoadingProgress": "\u274C Kesalahan memuat progres",
      "fileOperationsAvailable": "\u{1F4C2} Operasi file (Muat/Unggah) sekarang tersedia!",
      "tokenGeneratorReady": "\u{1F511} Generator token siap!",
      "paintingStats": "Statistik Melukis",
      "enablePaintingSpeedLimit": "Aktifkan batas kecepatan melukis (kontrol ukuran batch)",
      "enableNotifications": "Aktifkan notifikasi",
      "notifyOnChargesThreshold": "Beri tahu saat muatan mencapai batas",
      "onlyWhenNotFocused": "Hanya saat tab tidak difokuskan",
      "repeatEvery": "Ulangi setiap",
      "minutesPl": "menit",
      "grantPermission": "Berikan Izin",
      "test": "Tes",
      "showAllColorsIncluding": "Tampilkan Semua Warna (termasuk yang tidak tersedia)",
      "chromaWeight": "Bobot Kroma",
      "downloadPreview": "Unduh Pratinjau",
      "apply": "Terapkan",
      "cancel": "Batal",
      "fit": "Sesuaikan",
      "hundred": "100%",
      "clear": "Bersihkan",
      "invert": "Balik",
      "reprocessingOverlay": "Memproses ulang overlay...",
      "overlayUpdated": "Overlay diperbarui!",
      "notificationsEnabled": "Notifikasi diaktifkan.",
      "notificationsPermissionDenied": "Izin notifikasi ditolak.",
      "overlayEnabled": "Overlay diaktifkan.",
      "overlayDisabled": "Overlay dinonaktifkan.",
      "tokenSourceSet": "Sumber token diatur ke: {source}",
      "batchModeSet": "Mode batch diatur ke: {mode}",
      "randomRange": "Rentang Acak",
      "normalFixedSize": "Ukuran Tetap Normal",
      "advancedColorSettingsReset": "Pengaturan warna lanjutan direset.",
      "shiftRowAltColumn": "Shift = Baris \u2022 Alt = Kolom",
      "hideTurnstileBtn": "Sembunyikan",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 harap selesaikan pemeriksaan jika ditampilkan",
      "uploadImageFirstColors": "Harap unggah gambar terlebih dahulu untuk menangkap warna yang tersedia",
      "availableColors": "Warna Tersedia ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "Mode Perluas",
      "minimize": "Minimalkan",
      "restore": "Pulihkan",
      "hideStats": "Sembunyikan Statistik",
      "paintOptions": "Opsi Pewarnaan",
      "paintWhitePixels": "Warnai piksel putih",
      "paintTransparentPixels": "Warnai piksel transparan"
    },
    "ja": {
      "title": "WPlace \u81EA\u52D5\u753B\u50CF",
      "toggleOverlay": "\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u5207\u66FF",
      "scanColors": "\u8272\u3092\u30B9\u30AD\u30E3\u30F3",
      "uploadImage": "\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
      "resizeImage": "\u753B\u50CF\u30B5\u30A4\u30BA\u5909\u66F4",
      "selectPosition": "\u4F4D\u7F6E\u3092\u9078\u629E",
      "startPainting": "\u63CF\u753B\u958B\u59CB",
      "stopPainting": "\u63CF\u753B\u505C\u6B62",
      "checkingColors": "\u{1F50D} \u5229\u7528\u53EF\u80FD\u306A\u8272\u3092\u78BA\u8A8D\u4E2D...",
      "noColorsFound": "\u274C \u30B5\u30A4\u30C8\u3067\u30AB\u30E9\u30FC\u30D1\u30EC\u30C3\u30C8\u3092\u958B\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\uFF01",
      "colorsFound": "\u2705 \u5229\u7528\u53EF\u80FD\u306A\u8272 {count} \u4EF6\u3092\u691C\u51FA\u3002\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u3002",
      "loadingImage": "\u{1F5BC}\uFE0F \u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",
      "imageLoaded": "\u2705 \u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\u3002\u6709\u52B9\u306A\u30D4\u30AF\u30BB\u30EB {count}",
      "imageError": "\u274C \u753B\u50CF\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC",
      "selectPositionAlert": "\u4F5C\u54C1\u3092\u958B\u59CB\u3057\u305F\u3044\u4F4D\u7F6E\u306B\u6700\u521D\u306E\u30D4\u30AF\u30BB\u30EB\u3092\u7F6E\u3044\u3066\u304F\u3060\u3055\u3044\uFF01",
      "waitingPosition": "\u{1F446} \u53C2\u7167\u30D4\u30AF\u30BB\u30EB\u306E\u63CF\u753B\u3092\u5F85\u3063\u3066\u3044\u307E\u3059...",
      "positionSet": "\u2705 \u4F4D\u7F6E\u3092\u8A2D\u5B9A\u3057\u307E\u3057\u305F\uFF01",
      "positionTimeout": "\u274C \u4F4D\u7F6E\u9078\u629E\u306E\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8",
      "startPaintingMsg": "\u{1F3A8} \u63CF\u753B\u3092\u958B\u59CB...",
      "paintingProgress": "\u{1F9F1} \u9032\u6357: {painted}/{total} \u30D4\u30AF\u30BB\u30EB...",
      "noCharges": "\u231B \u30C1\u30E3\u30FC\u30B8\u306A\u3057\u3002{time} \u5F85\u6A5F...",
      "paintingStopped": "\u23F9\uFE0F \u30E6\u30FC\u30B6\u30FC\u306B\u3088\u308A\u505C\u6B62\u3055\u308C\u307E\u3057\u305F",
      "paintingComplete": "\u2705 \u63CF\u753B\u5B8C\u4E86\uFF01 {count} \u30D4\u30AF\u30BB\u30EB\u63CF\u753B\u3002",
      "paintingError": "\u274C \u63CF\u753B\u4E2D\u306B\u30A8\u30E9\u30FC",
      "missingRequirements": "\u274C \u5148\u306B\u753B\u50CF\u3092\u8AAD\u307F\u8FBC\u307F\u4F4D\u7F6E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
      "progress": "\u9032\u6357",
      "pixels": "\u30D4\u30AF\u30BB\u30EB",
      "charges": "\u30C1\u30E3\u30FC\u30B8",
      "estimatedTime": "\u63A8\u5B9A\u6642\u9593",
      "initMessage": "\u300C\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u300D\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u958B\u59CB",
      "waitingInit": "\u521D\u671F\u5316\u5F85\u6A5F\u4E2D...",
      "initializingToken": "\u{1F527} Turnstile \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u5668\u3092\u521D\u671F\u5316\u4E2D...",
      "tokenReady": "\u2705 \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u5668\u6E96\u5099\u5B8C\u4E86 - \u63CF\u753B\u3067\u304D\u307E\u3059\uFF01",
      "tokenRetryLater": "\u26A0\uFE0F \u5FC5\u8981\u306B\u5FDC\u3058\u3066\u518D\u8A66\u884C\u3057\u307E\u3059",
      "resizeSuccess": "\u2705 \u753B\u50CF\u3092 {width}x{height} \u306B\u30EA\u30B5\u30A4\u30BA",
      "paintingPaused": "\u23F8\uFE0F X: {x}, Y: {y} \u3067\u4E00\u6642\u505C\u6B62",
      "captchaNeeded": "\u2757 \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u306B\u5931\u6557\u3002\u5C11\u3057\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "saveData": "\u9032\u6357\u3092\u4FDD\u5B58",
      "loadData": "\u9032\u6357\u3092\u8AAD\u307F\u8FBC\u307F",
      "saveToFile": "\u30D5\u30A1\u30A4\u30EB\u3078\u4FDD\u5B58",
      "loadFromFile": "\u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u307F",
      "dataManager": "\u30C7\u30FC\u30BF\u7BA1\u7406",
      "autoSaved": "\u2705 \u81EA\u52D5\u4FDD\u5B58\u3057\u307E\u3057\u305F",
      "dataLoaded": "\u2705 \u9032\u6357\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F",
      "fileSaved": "\u2705 \u30D5\u30A1\u30A4\u30EB\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F",
      "fileLoaded": "\u2705 \u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F",
      "noSavedData": "\u274C \u4FDD\u5B58\u3055\u308C\u305F\u9032\u6357\u304C\u3042\u308A\u307E\u305B\u3093",
      "savedDataFound": "\u2705 \u4FDD\u5B58\u3055\u308C\u305F\u9032\u6357\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\u7D9A\u884C\u3057\u307E\u3059\u304B\uFF1F",
      "savedDate": "\u4FDD\u5B58\u65E5\u6642: {date}",
      "clickLoadToContinue": "\u300C\u9032\u6357\u3092\u8AAD\u307F\u8FBC\u307F\u300D\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u7D9A\u884C\u3002",
      "fileError": "\u274C \u30D5\u30A1\u30A4\u30EB\u51E6\u7406\u30A8\u30E9\u30FC",
      "invalidFileFormat": "\u274C \u7121\u52B9\u306A\u30D5\u30A1\u30A4\u30EB\u5F62\u5F0F",
      "paintingSpeed": "\u63CF\u753B\u901F\u5EA6",
      "pixelsPerSecond": "\u30D4\u30AF\u30BB\u30EB/\u79D2",
      "speedSetting": "\u901F\u5EA6: {speed} \u30D4\u30AF\u30BB\u30EB/\u79D2",
      "settings": "\u8A2D\u5B9A",
      "botSettings": "\u30DC\u30C3\u30C8\u8A2D\u5B9A",
      "close": "\u9589\u3058\u308B",
      "language": "\u8A00\u8A9E",
      "themeSettings": "\u30C6\u30FC\u30DE\u8A2D\u5B9A",
      "themeSettingsDesc": "\u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\u306E\u597D\u304D\u306A\u30AB\u30E9\u30FC\u30C6\u30FC\u30DE\u3092\u9078\u629E\u3002",
      "languageSelectDesc": "\u5E0C\u671B\u8A00\u8A9E\u3092\u9078\u629E\u3002\u5909\u66F4\u306F\u5373\u6642\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",
      "autoCaptcha": "\u81EA\u52D5 CAPTCHA \u30BD\u30EB\u30D0\u30FC",
      "autoCaptchaDesc": "\u7D71\u5408\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u30FC\u3067 Turnstile \u30C8\u30FC\u30AF\u30F3\u3092\u81EA\u52D5\u751F\u6210\u3057\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30D6\u30E9\u30A6\u30B6\u81EA\u52D5\u5316\u306B\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u3002",
      "applySettings": "\u8A2D\u5B9A\u3092\u9069\u7528",
      "settingsSaved": "\u2705 \u8A2D\u5B9A\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\uFF01",
      "speedOn": "\u30AA\u30F3",
      "speedOff": "\u30AA\u30D5",
      "cooldownSettings": "\u30AF\u30FC\u30EB\u30C0\u30A6\u30F3\u8A2D\u5B9A",
      "waitCharges": "\u30C1\u30E3\u30FC\u30B8\u6570\u304C\u6B21\u306B\u9054\u3059\u308B\u307E\u3067\u5F85\u6A5F",
      "captchaSolving": "\u{1F511} Turnstile \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u4E2D...",
      "captchaFailed": "\u274C \u30C8\u30FC\u30AF\u30F3\u751F\u6210\u5931\u6557\u3002\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u3092\u8A66\u884C...",
      "automation": "\u81EA\u52D5\u5316",
      "noChargesThreshold": "\u231B \u30C1\u30E3\u30FC\u30B8 {threshold} \u3092\u5F85\u6A5F\u4E2D\u3002\u73FE\u5728 {current}\u3002\u6B21\u306F {time} \u5F8C...",
      "tokenCapturedSuccess": "\u30C8\u30FC\u30AF\u30F3\u30AD\u30E3\u30D7\u30C1\u30E3\u6210\u529F\uFF01\u30DC\u30C3\u30C8\u3092\u958B\u59CB\u3067\u304D\u307E\u3059\u3002",
      "notificationsNotSupported": "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F\u901A\u77E5\u304C\u30B5\u30DD\u30FC\u30C8\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002",
      "chargesReadyNotification": "WPlace \u2014 \u30C1\u30E3\u30FC\u30B8\u6E96\u5099\u5B8C\u4E86",
      "chargesReadyMessage": "\u30C1\u30E3\u30FC\u30B8\u6E96\u5099\u5B8C\u4E86: {current} / {max}\u3002\u3057\u304D\u3044\u5024: {threshold}\u3002",
      "testNotificationTitle": "WPlace \u2014 \u30C6\u30B9\u30C8",
      "testNotificationMessage": "\u3053\u308C\u306F\u30C6\u30B9\u30C8\u901A\u77E5\u3067\u3059\u3002",
      "showStats": "\u7D71\u8A08\u8868\u793A",
      "compactMode": "\u30B3\u30F3\u30D1\u30AF\u30C8\u30E2\u30FC\u30C9",
      "refreshCharges": "\u30C1\u30E3\u30FC\u30B8\u66F4\u65B0",
      "closeStats": "\u7D71\u8A08\u3092\u9589\u3058\u308B",
      "zoomOut": "\u7E2E\u5C0F",
      "zoomIn": "\u62E1\u5927",
      "fitToView": "\u753B\u9762\u306B\u5408\u308F\u305B\u308B",
      "actualSize": "\u5B9F\u969B\u306E\u30B5\u30A4\u30BA (100%)",
      "panMode": "\u30D1\u30F3\uFF08\u30C9\u30E9\u30C3\u30B0\u3067\u79FB\u52D5\uFF09",
      "clearIgnoredPixels": "\u7121\u8996\u3055\u308C\u305F\u30D4\u30AF\u30BB\u30EB\u3092\u3059\u3079\u3066\u30AF\u30EA\u30A2",
      "invertMask": "\u30DE\u30B9\u30AF\u3092\u53CD\u8EE2",
      "waitingSetupComplete": "\u{1F504} \u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u306E\u5B8C\u4E86\u3092\u5F85\u6A5F\u4E2D...",
      "waitingTokenGenerator": "\u{1F504} \u30C8\u30FC\u30AF\u30F3\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u306E\u521D\u671F\u5316\u3092\u5F85\u6A5F\u4E2D...",
      "uploadImageFirst": "\u5229\u7528\u53EF\u80FD\u306A\u8272\u3092\u53D6\u5F97\u3059\u308B\u305F\u3081\u306B\u6700\u521D\u306B\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044",
      "pleaseWaitInitialSetup": "\u{1F504} \u9032\u6357\u3092\u8AAD\u307F\u8FBC\u3080\u524D\u306B\u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u306E\u5B8C\u4E86\u3092\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",
      "pleaseWaitFileSetup": "\u{1F504} \u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u3080\u524D\u306B\u521D\u671F\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u306E\u5B8C\u4E86\u3092\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",
      "errorSavingProgress": "\u274C \u9032\u6357\u306E\u4FDD\u5B58\u30A8\u30E9\u30FC",
      "errorLoadingProgress": "\u274C \u9032\u6357\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC",
      "fileOperationsAvailable": "\u{1F4C2} \u30D5\u30A1\u30A4\u30EB\u64CD\u4F5C\uFF08\u8AAD\u307F\u8FBC\u307F/\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\uFF09\u304C\u5229\u7528\u53EF\u80FD\u306B\u306A\u308A\u307E\u3057\u305F\uFF01",
      "tokenGeneratorReady": "\u{1F511} \u30C8\u30FC\u30AF\u30F3\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u6E96\u5099\u5B8C\u4E86\uFF01",
      "paintingStats": "\u63CF\u753B\u7D71\u8A08",
      "enablePaintingSpeedLimit": "\u63CF\u753B\u901F\u5EA6\u5236\u9650\u3092\u6709\u52B9\u5316\uFF08\u30D0\u30C3\u30C1\u30B5\u30A4\u30BA\u5236\u5FA1\uFF09",
      "enableNotifications": "\u901A\u77E5\u3092\u6709\u52B9\u5316",
      "notifyOnChargesThreshold": "\u30C1\u30E3\u30FC\u30B8\u304C\u3057\u304D\u3044\u5024\u306B\u9054\u3057\u305F\u3089\u901A\u77E5",
      "onlyWhenNotFocused": "\u30BF\u30D6\u304C\u975E\u30A2\u30AF\u30C6\u30A3\u30D6\u306E\u6642\u306E\u307F",
      "repeatEvery": "\u7E70\u308A\u8FD4\u3057\u9593\u9694",
      "minutesPl": "\u5206",
      "grantPermission": "\u8A31\u53EF\u3092\u4E0E\u3048\u308B",
      "test": "\u30C6\u30B9\u30C8",
      "showAllColorsIncluding": "\u3059\u3079\u3066\u306E\u8272\u3092\u8868\u793A\uFF08\u5229\u7528\u4E0D\u53EF\u542B\u3080\uFF09",
      "chromaWeight": "\u5F69\u5EA6\u91CD\u307F",
      "downloadPreview": "\u30D7\u30EC\u30D3\u30E5\u30FC\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
      "apply": "\u9069\u7528",
      "cancel": "\u30AD\u30E3\u30F3\u30BB\u30EB",
      "fit": "\u30D5\u30A3\u30C3\u30C8",
      "hundred": "100%",
      "clear": "\u30AF\u30EA\u30A2",
      "invert": "\u53CD\u8EE2",
      "reprocessingOverlay": "\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u518D\u51E6\u7406\u4E2D...",
      "overlayUpdated": "\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u66F4\u65B0\u5B8C\u4E86\uFF01",
      "notificationsEnabled": "\u901A\u77E5\u304C\u6709\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002",
      "notificationsPermissionDenied": "\u901A\u77E5\u306E\u8A31\u53EF\u304C\u62D2\u5426\u3055\u308C\u307E\u3057\u305F\u3002",
      "overlayEnabled": "\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u304C\u6709\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002",
      "overlayDisabled": "\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u304C\u7121\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002",
      "tokenSourceSet": "\u30C8\u30FC\u30AF\u30F3\u30BD\u30FC\u30B9\u3092\u8A2D\u5B9A: {source}",
      "batchModeSet": "\u30D0\u30C3\u30C1\u30E2\u30FC\u30C9\u3092\u8A2D\u5B9A: {mode}",
      "randomRange": "\u30E9\u30F3\u30C0\u30E0\u7BC4\u56F2",
      "normalFixedSize": "\u901A\u5E38\u56FA\u5B9A\u30B5\u30A4\u30BA",
      "advancedColorSettingsReset": "\u9AD8\u5EA6\u306A\u8272\u8A2D\u5B9A\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u307E\u3057\u305F\u3002",
      "shiftRowAltColumn": "Shift = \u884C \u2022 Alt = \u5217",
      "hideTurnstileBtn": "\u96A0\u3059",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 \u8868\u793A\u3055\u308C\u305F\u5834\u5408\u306F\u78BA\u8A8D\u3092\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044",
      "uploadImageFirstColors": "\u5229\u7528\u53EF\u80FD\u306A\u8272\u3092\u53D6\u5F97\u3059\u308B\u305F\u3081\u306B\u6700\u521D\u306B\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044",
      "availableColors": "\u5229\u7528\u53EF\u80FD\u306A\u8272 ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "\u5C55\u958B\u30E2\u30FC\u30C9",
      "minimize": "\u6700\u5C0F\u5316",
      "restore": "\u5FA9\u5143",
      "hideStats": "\u7D71\u8A08\u3092\u975E\u8868\u793A",
      "paintOptions": "\u63CF\u753B\u30AA\u30D7\u30B7\u30E7\u30F3",
      "paintWhitePixels": "\u767D\u3044\u30D4\u30AF\u30BB\u30EB\u3092\u63CF\u753B",
      "paintTransparentPixels": "\u900F\u660E\u30D4\u30AF\u30BB\u30EB\u3092\u63CF\u753B"
    },
    "ko": {
      "title": "WPlace \uC790\uB3D9 \uC774\uBBF8\uC9C0",
      "toggleOverlay": "\uC624\uBC84\uB808\uC774 \uC804\uD658",
      "scanColors": "\uC0C9\uC0C1 \uC2A4\uCE94",
      "uploadImage": "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC",
      "resizeImage": "\uD06C\uAE30 \uC870\uC815",
      "selectPosition": "\uC704\uCE58 \uC120\uD0DD",
      "startPainting": "\uADF8\uB9AC\uAE30 \uC2DC\uC791",
      "stopPainting": "\uADF8\uB9AC\uAE30 \uC911\uC9C0",
      "checkingColors": "\u{1F50D} \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1 \uD655\uC778 \uC911...",
      "noColorsFound": "\u274C \uC0AC\uC774\uD2B8\uC5D0\uC11C \uC0C9\uC0C1 \uD314\uB808\uD2B8\uB97C \uC5F0 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694!",
      "colorsFound": "\u2705 \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1 {count}\uAC1C \uBC1C\uACAC. \uC5C5\uB85C\uB4DC \uC900\uBE44 \uC644\uB8CC.",
      "loadingImage": "\u{1F5BC}\uFE0F \uC774\uBBF8\uC9C0 \uBD88\uB7EC\uC624\uB294 \uC911...",
      "imageLoaded": "\u2705 \uC774\uBBF8\uC9C0 \uB85C\uB4DC \uC644\uB8CC. \uC720\uD6A8 \uD53D\uC140 {count}\uAC1C",
      "imageError": "\u274C \uC774\uBBF8\uC9C0 \uB85C\uB4DC \uC624\uB958",
      "selectPositionAlert": "\uC791\uD488\uC744 \uC2DC\uC791\uD560 \uC704\uCE58\uC5D0 \uCCAB \uD53D\uC140\uC744 \uCE60\uD558\uC138\uC694!",
      "waitingPosition": "\u{1F446} \uAE30\uC900 \uD53D\uC140\uC744 \uCE60\uD560 \uB54C\uAE4C\uC9C0 \uB300\uAE30 \uC911...",
      "positionSet": "\u2705 \uC704\uCE58 \uC124\uC815 \uC644\uB8CC!",
      "positionTimeout": "\u274C \uC704\uCE58 \uC120\uD0DD \uC2DC\uAC04 \uCD08\uACFC",
      "startPaintingMsg": "\u{1F3A8} \uADF8\uB9AC\uAE30 \uC2DC\uC791...",
      "paintingProgress": "\u{1F9F1} \uC9C4\uD589: {painted}/{total} \uD53D\uC140...",
      "noCharges": "\u231B \uC0AC\uC6A9 \uAC00\uB2A5 \uD69F\uC218 \uC5C6\uC74C. {time} \uB300\uAE30...",
      "paintingStopped": "\u23F9\uFE0F \uC0AC\uC6A9\uC790\uC5D0 \uC758\uD574 \uC911\uC9C0\uB428",
      "paintingComplete": "\u2705 \uADF8\uB9AC\uAE30 \uC644\uB8CC! {count} \uD53D\uC140 \uADF8\uB838\uC2B5\uB2C8\uB2E4.",
      "paintingError": "\u274C \uADF8\uB9AC\uB294 \uC911 \uC624\uB958",
      "missingRequirements": "\u274C \uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uACE0 \uC704\uCE58\uB97C \uC120\uD0DD\uD558\uC138\uC694",
      "progress": "\uC9C4\uD589",
      "pixels": "\uD53D\uC140",
      "charges": "\uD69F\uC218",
      "estimatedTime": "\uC608\uC0C1 \uC2DC\uAC04",
      "initMessage": "'\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC'\uB97C \uD074\uB9AD\uD558\uC5EC \uC2DC\uC791",
      "waitingInit": "\uCD08\uAE30\uD654 \uB300\uAE30 \uC911...",
      "initializingToken": "\u{1F527} Turnstile \uD1A0\uD070 \uC0DD\uC131\uAE30 \uCD08\uAE30\uD654 \uC911...",
      "tokenReady": "\u2705 \uD1A0\uD070 \uC0DD\uC131 \uC900\uBE44 \uC644\uB8CC - \uADF8\uB9AC\uAE30\uB97C \uC2DC\uC791\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4!",
      "tokenRetryLater": "\u26A0\uFE0F \uD544\uC694 \uC2DC \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4",
      "resizeSuccess": "\u2705 \uC774\uBBF8\uC9C0\uAC00 {width}x{height} \uD06C\uAE30\uB85C \uC870\uC815\uB428",
      "paintingPaused": "\u23F8\uFE0F \uC704\uCE58 X: {x}, Y: {y} \uC5D0\uC11C \uC77C\uC2DC \uC911\uC9C0",
      "captchaNeeded": "\u2757 \uD1A0\uD070 \uC0DD\uC131 \uC2E4\uD328. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.",
      "saveData": "\uC9C4\uD589 \uC800\uC7A5",
      "loadData": "\uC9C4\uD589 \uBD88\uB7EC\uC624\uAE30",
      "saveToFile": "\uD30C\uC77C\uB85C \uC800\uC7A5",
      "loadFromFile": "\uD30C\uC77C\uC5D0\uC11C \uBD88\uB7EC\uC624\uAE30",
      "dataManager": "\uB370\uC774\uD130",
      "autoSaved": "\u2705 \uC9C4\uD589 \uC790\uB3D9 \uC800\uC7A5\uB428",
      "dataLoaded": "\u2705 \uC9C4\uD589 \uBD88\uB7EC\uC624\uAE30 \uC131\uACF5",
      "fileSaved": "\u2705 \uD30C\uC77C \uC800\uC7A5 \uC131\uACF5",
      "fileLoaded": "\u2705 \uD30C\uC77C \uBD88\uB7EC\uC624\uAE30 \uC131\uACF5",
      "noSavedData": "\u274C \uC800\uC7A5\uB41C \uC9C4\uD589 \uC5C6\uC74C",
      "savedDataFound": "\u2705 \uC800\uC7A5\uB41C \uC9C4\uD589 \uBC1C\uACAC! \uACC4\uC18D\uD558\uB824\uBA74 \uBD88\uB7EC\uC624\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?",
      "savedDate": "\uC800\uC7A5 \uC2DC\uAC01: {date}",
      "clickLoadToContinue": "'\uC9C4\uD589 \uBD88\uB7EC\uC624\uAE30'\uB97C \uD074\uB9AD\uD558\uC5EC \uACC4\uC18D.",
      "fileError": "\u274C \uD30C\uC77C \uCC98\uB9AC \uC624\uB958",
      "invalidFileFormat": "\u274C \uC798\uBABB\uB41C \uD30C\uC77C \uD615\uC2DD",
      "paintingSpeed": "\uADF8\uB9AC\uAE30 \uC18D\uB3C4",
      "pixelsPerSecond": "\uD53D\uC140/\uCD08",
      "speedSetting": "\uC18D\uB3C4: {speed} \uD53D\uC140/\uCD08",
      "settings": "\uC124\uC815",
      "botSettings": "\uBD07 \uC124\uC815",
      "close": "\uB2EB\uAE30",
      "language": "\uC5B8\uC5B4",
      "themeSettings": "\uD14C\uB9C8 \uC124\uC815",
      "themeSettingsDesc": "\uC778\uD130\uD398\uC774\uC2A4\uC6A9 \uC120\uD638 \uC0C9\uC0C1 \uD14C\uB9C8\uB97C \uC120\uD0DD\uD558\uC138\uC694.",
      "languageSelectDesc": "\uC120\uD638 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD558\uC138\uC694. \uBCC0\uACBD \uC0AC\uD56D\uC740 \uC989\uC2DC \uC801\uC6A9\uB429\uB2C8\uB2E4.",
      "autoCaptcha": "\uC790\uB3D9 CAPTCHA \uD574\uACB0",
      "autoCaptchaDesc": "\uD1B5\uD569 \uC0DD\uC131\uAE30\uB97C \uC0AC\uC6A9\uD574 Turnstile \uD1A0\uD070\uC744 \uC790\uB3D9 \uC0DD\uC131\uD558\uACE0 \uD544\uC694 \uC2DC \uBE0C\uB77C\uC6B0\uC800 \uC790\uB3D9\uD654\uB85C \uD3F4\uBC31.",
      "applySettings": "\uC124\uC815 \uC801\uC6A9",
      "settingsSaved": "\u2705 \uC124\uC815 \uC800\uC7A5 \uC644\uB8CC!",
      "speedOn": "\uCF1C\uC9D0",
      "speedOff": "\uAEBC\uC9D0",
      "cooldownSettings": "\uCFE8\uB2E4\uC6B4 \uC124\uC815",
      "waitCharges": "\uD69F\uC218\uAC00 \uB2E4\uC74C \uAC12\uC5D0 \uB3C4\uB2EC\uD560 \uB54C\uAE4C\uC9C0 \uB300\uAE30",
      "captchaSolving": "\u{1F511} Turnstile \uD1A0\uD070 \uC0DD\uC131 \uC911...",
      "captchaFailed": "\u274C \uD1A0\uD070 \uC0DD\uC131 \uC2E4\uD328. \uD3F4\uBC31 \uC2DC\uB3C4...",
      "automation": "\uC790\uB3D9\uD654",
      "noChargesThreshold": "\u231B \uD69F\uC218\uAC00 {threshold} \uC5D0 \uB3C4\uB2EC\uD560 \uB54C\uAE4C\uC9C0 \uB300\uAE30 \uC911. \uD604\uC7AC {current}. \uB2E4\uC74C {time} \uD6C4...",
      "tokenCapturedSuccess": "\uD1A0\uD070 \uC0DD\uC131 \uC131\uACF5! \uC774\uC81C \uBD07\uC744 \uC2DC\uC791\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
      "notificationsNotSupported": "\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 \uC54C\uB9BC\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
      "chargesReadyNotification": "WPlace \u2014 \uD69F\uC218 \uC900\uBE44 \uC644\uB8CC",
      "chargesReadyMessage": "\uD69F\uC218 \uC900\uBE44 \uC644\uB8CC: {current} / {max}. \uC784\uACC4\uAC12: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 \uD14C\uC2A4\uD2B8",
      "testNotificationMessage": "\uC774\uAC83\uC740 \uD14C\uC2A4\uD2B8 \uC54C\uB9BC\uC785\uB2C8\uB2E4.",
      "showStats": "\uD1B5\uACC4 \uBCF4\uAE30",
      "compactMode": "\uCEF4\uD329\uD2B8 \uBAA8\uB4DC",
      "refreshCharges": "\uD69F\uC218 \uC0C8\uB85C\uACE0\uCE68",
      "closeStats": "\uD1B5\uACC4 \uB2EB\uAE30",
      "zoomOut": "\uCD95\uC18C",
      "zoomIn": "\uD655\uB300",
      "fitToView": "\uD654\uBA74\uC5D0 \uB9DE\uCDA4",
      "actualSize": "\uC2E4\uC81C \uD06C\uAE30 (100%)",
      "panMode": "\uC774\uB3D9 (\uB04C\uC5B4\uC11C \uBCF4\uAE30 \uC774\uB3D9)",
      "clearIgnoredPixels": "\uBB34\uC2DC\uB41C \uBAA8\uB4E0 \uD53D\uC140 \uC9C0\uC6B0\uAE30",
      "invertMask": "\uB9C8\uC2A4\uD06C \uBC18\uC804",
      "waitingSetupComplete": "\u{1F504} \uCD08\uAE30 \uC124\uC815 \uC644\uB8CC \uB300\uAE30 \uC911...",
      "waitingTokenGenerator": "\u{1F504} \uD1A0\uD070 \uC0DD\uC131\uAE30 \uCD08\uAE30\uD654 \uB300\uAE30 \uC911...",
      "uploadImageFirst": "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1\uC744 \uC5BB\uAE30 \uC704\uD574 \uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD558\uC138\uC694",
      "pleaseWaitInitialSetup": "\u{1F504} \uC9C4\uD589\uB3C4\uB97C \uB85C\uB4DC\uD558\uAE30 \uC804\uC5D0 \uCD08\uAE30 \uC124\uC815 \uC644\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uC138\uC694.",
      "pleaseWaitFileSetup": "\u{1F504} \uD30C\uC77C\uC5D0\uC11C \uB85C\uB4DC\uD558\uAE30 \uC804\uC5D0 \uCD08\uAE30 \uC124\uC815 \uC644\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uC138\uC694.",
      "errorSavingProgress": "\u274C \uC9C4\uD589 \uC800\uC7A5 \uC624\uB958",
      "errorLoadingProgress": "\u274C \uC9C4\uD589 \uB85C\uB4DC \uC624\uB958",
      "fileOperationsAvailable": "\u{1F4C2} \uD30C\uC77C \uC791\uC5C5(\uB85C\uB4DC/\uC5C5\uB85C\uB4DC)\uC774 \uC774\uC81C \uC0AC\uC6A9 \uAC00\uB2A5\uD569\uB2C8\uB2E4!",
      "tokenGeneratorReady": "\u{1F511} \uD1A0\uD070 \uC0DD\uC131\uAE30 \uC900\uBE44 \uC644\uB8CC!",
      "paintingStats": "\uADF8\uB9AC\uAE30 \uD1B5\uACC4",
      "enablePaintingSpeedLimit": "\uADF8\uB9AC\uAE30 \uC18D\uB3C4 \uC81C\uD55C \uD65C\uC131\uD654 (\uBC30\uCE58 \uD06C\uAE30 \uC81C\uC5B4)",
      "enableNotifications": "\uC54C\uB9BC \uD65C\uC131\uD654",
      "notifyOnChargesThreshold": "\uD69F\uC218\uAC00 \uC784\uACC4\uAC12\uC5D0 \uB3C4\uB2EC\uD558\uBA74 \uC54C\uB9BC",
      "onlyWhenNotFocused": "\uD0ED\uC774 \uD3EC\uCEE4\uC2A4\uB418\uC9C0 \uC54A\uC558\uC744 \uB54C\uB9CC",
      "repeatEvery": "\uBC18\uBCF5 \uAC04\uACA9",
      "minutesPl": "\uBD84",
      "grantPermission": "\uAD8C\uD55C \uBD80\uC5EC",
      "test": "\uD14C\uC2A4\uD2B8",
      "showAllColorsIncluding": "\uBAA8\uB4E0 \uC0C9\uC0C1 \uBCF4\uAE30 (\uC0AC\uC6A9 \uBD88\uAC00 \uD3EC\uD568)",
      "chromaWeight": "\uC0C9\uB3C4 \uAC00\uC911\uCE58",
      "downloadPreview": "\uBBF8\uB9AC\uBCF4\uAE30 \uB2E4\uC6B4\uB85C\uB4DC",
      "apply": "\uC801\uC6A9",
      "cancel": "\uCDE8\uC18C",
      "fit": "\uB9DE\uCDA4",
      "hundred": "100%",
      "clear": "\uC9C0\uC6B0\uAE30",
      "invert": "\uBC18\uC804",
      "reprocessingOverlay": "\uC624\uBC84\uB808\uC774 \uC7AC\uCC98\uB9AC \uC911...",
      "overlayUpdated": "\uC624\uBC84\uB808\uC774 \uC5C5\uB370\uC774\uD2B8 \uC644\uB8CC!",
      "notificationsEnabled": "\uC54C\uB9BC\uC774 \uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      "notificationsPermissionDenied": "\uC54C\uB9BC \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      "overlayEnabled": "\uC624\uBC84\uB808\uC774\uAC00 \uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      "overlayDisabled": "\uC624\uBC84\uB808\uC774\uAC00 \uBE44\uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      "tokenSourceSet": "\uD1A0\uD070 \uC18C\uC2A4 \uC124\uC815: {source}",
      "batchModeSet": "\uBC30\uCE58 \uBAA8\uB4DC \uC124\uC815: {mode}",
      "randomRange": "\uB79C\uB364 \uBC94\uC704",
      "normalFixedSize": "\uC77C\uBC18 \uACE0\uC815 \uD06C\uAE30",
      "advancedColorSettingsReset": "\uACE0\uAE09 \uC0C9\uC0C1 \uC124\uC815\uC774 \uCD08\uAE30\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      "shiftRowAltColumn": "Shift = \uD589 \u2022 Alt = \uC5F4",
      "hideTurnstileBtn": "\uC228\uAE30\uAE30",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 \uD45C\uC2DC\uB418\uBA74 \uAC80\uC0AC\uB97C \uC644\uB8CC\uD558\uC138\uC694",
      "uploadImageFirstColors": "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1\uC744 \uC5BB\uAE30 \uC704\uD574 \uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD558\uC138\uC694",
      "availableColors": "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC0C9\uC0C1 ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "\uD655\uC7A5 \uBAA8\uB4DC",
      "minimize": "\uCD5C\uC18C\uD654",
      "restore": "\uBCF5\uC6D0",
      "hideStats": "\uD1B5\uACC4 \uC228\uAE40",
      "paintOptions": "\uD398\uC778\uD2B8 \uC635\uC158",
      "paintWhitePixels": "\uD770\uC0C9 \uD53D\uC140 \uCE60\uD558\uAE30",
      "paintTransparentPixels": "\uD22C\uBA85 \uD53D\uC140 \uCE60\uD558\uAE30"
    },
    "pt": {
      "title": "WPlace Auto-Image",
      "toggleOverlay": "Toggle Overlay",
      "scanColors": "Escanear Cores",
      "uploadImage": "Upload da Imagem",
      "resizeImage": "Redimensionar Imagem",
      "selectPosition": "Selecionar Posi\xE7\xE3o",
      "startPainting": "Iniciar Pintura",
      "stopPainting": "Parar Pintura",
      "checkingColors": "\u{1F50D} Verificando cores dispon\xEDveis...",
      "noColorsFound": "\u274C Abra a paleta de cores no site e tente novamente!",
      "colorsFound": "\u2705 {count} cores encontradas. Pronto para upload.",
      "loadingImage": "\u{1F5BC}\uFE0F Carregando imagem...",
      "imageLoaded": "\u2705 Imagem carregada com {count} pixels v\xE1lidos",
      "imageError": "\u274C Erro ao carregar imagem",
      "selectPositionAlert": "Pinte o primeiro pixel \u043D\u0430 localiza\xE7\xE3o onde deseja que a arte comece!",
      "waitingPosition": "\u{1F446} Aguardando voc\xEA pintar o pixel de refer\xEAncia...",
      "positionSet": "\u2705 Posi\xE7\xE3o definida com sucesso!",
      "positionTimeout": "\u274C Tempo esgotado para selecionar posi\xE7\xE3o",
      "startPaintingMsg": "\u{1F3A8} Iniciando pintura...",
      "paintingProgress": "\u{1F9F1} Progresso: {painted}/{total} pixels...",
      "noCharges": "\u231B Sem cargas. Aguardando {time}...",
      "paintingStopped": "\u23F9\uFE0F Pintura interrom\u043F\u0438\u0434\u0430 pelo usu\xE1rio",
      "paintingComplete": "\u2705 Pintura conclu\xEDda! {count} pixels pintados.",
      "paintingError": "\u274C Erro durante a pintura",
      "missingRequirements": "\u274C Carregue uma imagem e selecione uma posi\xE7\xE3o primeiro",
      "progress": "Progresso",
      "pixels": "Pixels",
      "charges": "Cargas",
      "estimatedTime": "Tempo estimado",
      "initMessage": "Clique em 'Upload da Imagem' para come\xE7ar",
      "waitingInit": "Aguardando inicializa\xE7\xE3o...",
      "initializingToken": "\u{1F527} Inicializando gerador de tokens Turnstile...",
      "tokenReady": "\u2705 Gerador de tokens pronto - voc\xEA pode come\xE7ar a pintar!",
      "tokenRetryLater": "\u26A0\uFE0F Gerador de tokens tentar\xE1 novamente quando necess\xE1rio",
      "resizeSuccess": "\u2705 Imagem redimensionada \u0434\u043B\u044F {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F Pintura pausada na posi\xE7\xE3o X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 Falha na gera\xE7\xE3o de token. Tente novamente em alguns instantes.",
      "saveData": "Salvar Progresso",
      "loadData": "Carregar Progresso",
      "saveToFile": "Salvar em Arquivo",
      "loadFromFile": "Carregar de Arquivo",
      "dataManager": "Dados",
      "autoSaved": "\u2705 Progresso salvo automaticamente",
      "dataLoaded": "\u2705 Progresso carregado com sucesso",
      "fileSaved": "\u2705 Salvo em arquivo com sucesso",
      "fileLoaded": "\u2705 Carregado de arquivo com sucesso",
      "noSavedData": "\u274C Nenhum progresso salvo encontrado",
      "savedDataFound": "\u2705 Progresso salvo encontrado! Carregar para continuar?",
      "savedDate": "Salvo em: {date}",
      "clickLoadToContinue": "Clique em 'Carregar Progresso' para continuar.",
      "fileError": "\u274C Erro ao processar arquivo",
      "invalidFileFormat": "\u274C Formato de arquivo inv\xE1lido",
      "paintingSpeed": "Velocidade de Pintura",
      "pixelsPerSecond": "pixels/segundo",
      "speedSetting": "Velocidade: {speed} pixels/seg",
      "settings": "Configura\xE7\xF5es",
      "botSettings": "Configura\xE7\xF5es do Bot",
      "close": "Fechar",
      "language": "Idioma",
      "themeSettings": "Configura\xE7\xF5es de Tema",
      "themeSettingsDesc": "Escolha seu tema de cores preferido para a interface.",
      "languageSelectDesc": "Selecione seu idioma preferido. As altera\xE7\xF5es ter\xE3o efeito imediatamente.",
      "autoCaptcha": "Resolvedor de CAPTCHA Autom\xE1tico",
      "autoCaptchaDesc": "Tenta resolver o CAPTCHA automaticamente simulando a coloca\xE7\xE3o manual de um pixel quando o token expira.",
      "applySettings": "Aplicar Configura\xE7\xF5es",
      "settingsSaved": "\u2705 Configura\xE7\xF5es salvas com sucesso!",
      "speedOn": "Ligado",
      "speedOff": "Desligado",
      "cooldownSettings": "Configura\xE7\xF5es de Cooldown",
      "waitCharges": "Aguardar at\xE9 as cargas atingirem",
      "captchaSolving": "\u{1F916} Tentando resolver o CAPTCHA...",
      "captchaFailed": "\u274C Falha ao resolver CAPTCHA. Pinte um pixel manualmente.",
      "automation": "Automa\xE7\xE3o",
      "noChargesThreshold": "\u231B Aguardando cargas atingirem {threshold}. Atual: {current}. Pr\xF3xima em {time}...",
      "tokenCapturedSuccess": "Token capturado com sucesso! Voc\xEA pode iniciar o bot agora.",
      "notificationsNotSupported": "Notifica\xE7\xF5es n\xE3o s\xE3o suportadas neste navegador.",
      "chargesReadyNotification": "WPlace \u2014 Cargas Prontas",
      "chargesReadyMessage": "Cargas prontas: {current} / {max}. Limite: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Teste",
      "testNotificationMessage": "Esta \xE9 uma notifica\xE7\xE3o de teste.",
      "showStats": "Mostrar Estat\xEDsticas",
      "compactMode": "Modo Compacto",
      "refreshCharges": "Atualizar Cargas",
      "closeStats": "Fechar Estat\xEDsticas",
      "zoomOut": "Diminuir Zoom",
      "zoomIn": "Aumentar Zoom",
      "fitToView": "Ajustar \xE0 visualiza\xE7\xE3o",
      "actualSize": "Tamanho real (100%)",
      "panMode": "Arrastar (arrastar para mover visualiza\xE7\xE3o)",
      "clearIgnoredPixels": "Limpar pixels ignorados",
      "invertMask": "Inverter m\xE1scara",
      "waitingSetupComplete": "\u{1F504} Aguardando conclus\xE3o da configura\xE7\xE3o inicial...",
      "waitingTokenGenerator": "\u{1F504} Aguardando inicializa\xE7\xE3o do gerador de tokens...",
      "uploadImageFirst": "Fa\xE7a upload de uma imagem primeiro para capturar cores dispon\xEDveis",
      "pleaseWaitInitialSetup": "\u{1F504} Aguarde a conclus\xE3o da configura\xE7\xE3o inicial antes de carregar o progresso.",
      "pleaseWaitFileSetup": "\u{1F504} Aguarde a conclus\xE3o da configura\xE7\xE3o inicial antes de carregar do arquivo.",
      "errorSavingProgress": "\u274C Erro ao salvar progresso",
      "errorLoadingProgress": "\u274C Erro ao carregar progresso",
      "fileOperationsAvailable": "\u{1F4C2} Opera\xE7\xF5es de arquivo (Carregar/Upload) agora dispon\xEDveis!",
      "tokenGeneratorReady": "\u{1F511} Gerador de tokens pronto!",
      "paintingStats": "Estat\xEDsticas de Pintura",
      "enablePaintingSpeedLimit": "Ativar limite de velocidade de pintura (controle de tamanho de lote)",
      "enableNotifications": "Ativar notifica\xE7\xF5es",
      "notifyOnChargesThreshold": "Notificar quando as cargas atingirem o limite",
      "onlyWhenNotFocused": "Apenas quando a aba n\xE3o est\xE1 em foco",
      "repeatEvery": "Repetir a cada",
      "minutesPl": "minuto(s)",
      "grantPermission": "Conceder Permiss\xE3o",
      "test": "Teste",
      "showAllColorsIncluding": "Mostrar Todas as Cores (incluindo indispon\xEDveis)",
      "chromaWeight": "Peso da Satura\xE7\xE3o",
      "downloadPreview": "Baixar Pr\xE9-visualiza\xE7\xE3o",
      "apply": "Aplicar",
      "cancel": "Cancelar",
      "fit": "Ajustar",
      "hundred": "100%",
      "clear": "Limpar",
      "invert": "Inverter",
      "reprocessingOverlay": "Reprocessando sobreposi\xE7\xE3o...",
      "overlayUpdated": "Sobreposi\xE7\xE3o atualizada!",
      "notificationsEnabled": "Notifica\xE7\xF5es ativadas.",
      "notificationsPermissionDenied": "Permiss\xE3o de notifica\xE7\xF5es negada.",
      "overlayEnabled": "Sobreposi\xE7\xE3o ativada.",
      "overlayDisabled": "Sobreposi\xE7\xE3o desativada.",
      "tokenSourceSet": "Fonte de token definida para: {source}",
      "batchModeSet": "Modo de lote definido para: {mode}",
      "randomRange": "Intervalo Aleat\xF3rio",
      "normalFixedSize": "Tamanho Fixo Normal",
      "advancedColorSettingsReset": "Configura\xE7\xF5es avan\xE7adas de cor redefinidas.",
      "shiftRowAltColumn": "Shift = Linha \u2022 Alt = Coluna",
      "hideTurnstileBtn": "Ocultar",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 complete a verifica\xE7\xE3o se mostrada",
      "uploadImageFirstColors": "Fa\xE7a upload de uma imagem primeiro para capturar cores dispon\xEDveis",
      "availableColors": "Cores Dispon\xEDveis ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "Modo Expandir",
      "minimize": "Minimizar",
      "restore": "Restaurar",
      "hideStats": "Ocultar Estat\xEDsticas",
      "paintOptions": "Op\xE7\xF5es de pintura",
      "paintWhitePixels": "Pintar pixels brancos",
      "paintTransparentPixels": "Pintar pixels transparentes"
    },
    "ru": {
      "title": "WPlace \u0410\u0432\u0442\u043E-\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
      "toggleOverlay": "Toggle Overlay",
      "scanColors": "\u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0446\u0432\u0435\u0442\u0430",
      "uploadImage": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
      "resizeImage": "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
      "selectPosition": "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u043E\u0437\u0438\u0446\u0438\u044E",
      "startPainting": "\u041D\u0430\u0447\u0430\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435",
      "stopPainting": "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435",
      "checkingColors": "\u{1F50D} \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432...",
      "noColorsFound": "\u274C \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u0430\u043B\u0438\u0442\u0440\u0443 \u0446\u0432\u0435\u0442\u043E\u0432 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430!",
      "colorsFound": "\u2705 \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432: {count}. \u0413\u043E\u0442\u043E\u0432\u043E \u043A \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435.",
      "loadingImage": "\u{1F5BC}\uFE0F \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F...",
      "imageLoaded": "\u2705 \u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E, \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0445 \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439: {count}",
      "imageError": "\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
      "selectPositionAlert": "\u041D\u0430\u0440\u0438\u0441\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u0439 \u043F\u0438\u043A\u0441\u0435\u043B\u044C \u0432 \u043C\u0435\u0441\u0442\u0435, \u043E\u0442\u043A\u0443\u0434\u0430 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u0440\u0438\u0441\u0443\u043D\u043E\u043A!",
      "waitingPosition": "\u{1F446} \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435, \u043F\u043E\u043A\u0430 \u0432\u044B \u043D\u0430\u0440\u0438\u0441\u0443\u0435\u0442\u0435 \u043E\u043F\u043E\u0440\u043D\u044B\u0439 \u043F\u0438\u043A\u0441\u0435\u043B\u044C...",
      "positionSet": "\u2705 \u041F\u043E\u0437\u0438\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430!",
      "positionTimeout": "\u274C \u0412\u0440\u0435\u043C\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0438\u0441\u0442\u0435\u043A\u043B\u043E",
      "startPaintingMsg": "\u{1F3A8} \u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435...",
      "paintingProgress": "\u{1F9F1} \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: {painted}/{total} \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439...",
      "noCharges": "\u231B \u041D\u0435\u0442 \u0437\u0430\u0440\u044F\u0434\u043E\u0432. \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 {time}...",
      "paintingStopped": "\u23F9\uFE0F \u0420\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u043C",
      "paintingComplete": "\u2705 \u0420\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E! \u041D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D\u043E \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439: {count}.",
      "paintingError": "\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",
      "missingRequirements": "\u274C \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u0437\u0438\u0446\u0438\u044E",
      "progress": "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",
      "pixels": "\u041F\u0438\u043A\u0441\u0435\u043B\u0438",
      "charges": "\u0417\u0430\u0440\u044F\u0434\u044B",
      "estimatedTime": "\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F",
      "initMessage": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435', \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C",
      "waitingInit": "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438...",
      "initializingToken": "\u{1F527} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 Turnstile \u0442\u043E\u043A\u0435\u043D\u043E\u0432...",
      "tokenReady": "\u2705 \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0433\u043E\u0442\u043E\u0432 - \u043C\u043E\u0436\u0435\u0442\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435!",
      "tokenRetryLater": "\u26A0\uFE0F \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438",
      "resizeSuccess": "\u2705 \u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0434\u043E {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F \u0420\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 \u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u0442\u043E\u043A\u0435\u043D\u0430 \u043D\u0435 \u0443\u0434\u0430\u043B\u0430\u0441\u044C. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0432\u0440\u0435\u043C\u044F.",
      "saveData": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",
      "loadData": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",
      "saveToFile": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 \u0444\u0430\u0439\u043B",
      "loadFromFile": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437 \u0444\u0430\u0439\u043B\u0430",
      "dataManager": "\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0434\u0430\u043D\u043D\u044B\u0445",
      "autoSaved": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438",
      "dataLoaded": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D",
      "fileSaved": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u0444\u0430\u0439\u043B",
      "fileLoaded": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \u0438\u0437 \u0444\u0430\u0439\u043B\u0430",
      "noSavedData": "\u274C \u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D",
      "savedDataFound": "\u2705 \u041D\u0430\u0439\u0434\u0435\u043D \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441! \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C?",
      "savedDate": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E: {date}",
      "clickLoadToContinue": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441', \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C.",
      "fileError": "\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u0444\u0430\u0439\u043B\u0430",
      "invalidFileFormat": "\u274C \u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0430",
      "paintingSpeed": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",
      "pixelsPerSecond": "\u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439/\u0441\u0435\u043A",
      "speedSetting": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C: {speed} \u043F\u0438\u043A\u0441./\u0441\u0435\u043A",
      "settings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
      "botSettings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u043E\u0442\u0430",
      "close": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
      "language": "\u042F\u0437\u044B\u043A",
      "themeSettings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0442\u0435\u043C\u044B",
      "themeSettingsDesc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u0446\u0432\u0435\u0442\u043E\u0432\u0443\u044E \u0442\u0435\u043C\u0443 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430.",
      "languageSelectDesc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u044F\u0437\u044B\u043A. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432\u0441\u0442\u0443\u043F\u044F\u0442 \u0432 \u0441\u0438\u043B\u0443 \u043D\u0435\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E.",
      "autoCaptcha": "\u0410\u0432\u0442\u043E-\u0440\u0435\u0448\u0435\u043D\u0438\u0435 CAPTCHA (Turnstile)",
      "autoCaptchaDesc": "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u0442 Turnstile \u0442\u043E\u043A\u0435\u043D\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440. \u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u043A \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u0438 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438.",
      "applySettings": "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
      "settingsSaved": "\u2705 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B!",
      "speedOn": "\u0412\u043A\u043B",
      "speedOff": "\u0412\u044B\u043A\u043B",
      "cooldownSettings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0438",
      "waitCharges": "\u0416\u0434\u0430\u0442\u044C \u0434\u043E \u043D\u0430\u043A\u043E\u043F\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u0440\u044F\u0434\u043E\u0432",
      "captchaSolving": "\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E Turnstile \u0442\u043E\u043A\u0435\u043D...",
      "captchaFailed": "\u274C \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C Turnstile \u0442\u043E\u043A\u0435\u043D. \u041F\u0440\u043E\u0431\u0443\u044E \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u043C\u0435\u0442\u043E\u0434...",
      "automation": "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044F",
      "noChargesThreshold": "\u231B \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0437\u0430\u0440\u044F\u0434\u043E\u0432 \u0434\u043E {threshold}. \u0421\u0435\u0439\u0447\u0430\u0441 {current}. \u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0447\u0435\u0440\u0435\u0437 {time}...",
      "tokenCapturedSuccess": "\u0422\u043E\u043A\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0445\u0432\u0430\u0447\u0435\u043D! \u0422\u0435\u043F\u0435\u0440\u044C \u043C\u043E\u0436\u043D\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0431\u043E\u0442\u0430.",
      "notificationsNotSupported": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0432 \u044D\u0442\u043E\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.",
      "chargesReadyNotification": "WPlace \u2014 \u0417\u0430\u0440\u044F\u0434\u044B \u0433\u043E\u0442\u043E\u0432\u044B",
      "chargesReadyMessage": "\u0417\u0430\u0440\u044F\u0434\u044B \u0433\u043E\u0442\u043E\u0432\u044B: {current} / {max}. \u041F\u043E\u0440\u043E\u0433: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 \u0422\u0435\u0441\u0442",
      "testNotificationMessage": "\u042D\u0442\u043E \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.",
      "showStats": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "compactMode": "\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",
      "refreshCharges": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0437\u0430\u0440\u044F\u0434\u044B",
      "closeStats": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "zoomOut": "\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C",
      "zoomIn": "\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C",
      "fitToView": "\u041F\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0443 \u044D\u043A\u0440\u0430\u043D\u0430",
      "actualSize": "\u0420\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 (100%)",
      "panMode": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 (\u043F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F)",
      "clearIgnoredPixels": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0435\u043C\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438",
      "invertMask": "\u0418\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u0441\u043A\u0443",
      "waitingSetupComplete": "\u{1F504} \u0416\u0434\u0451\u043C \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438...",
      "waitingTokenGenerator": "\u{1F504} \u0416\u0434\u0451\u043C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0442\u043E\u043A\u0435\u043D\u043E\u0432...",
      "uploadImageFirst": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0437\u0430\u0445\u0432\u0430\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432",
      "pleaseWaitInitialSetup": "\u{1F504} \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430.",
      "pleaseWaitFileSetup": "\u{1F504} \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439 \u0438\u0437 \u0444\u0430\u0439\u043B\u0430.",
      "errorSavingProgress": "\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430",
      "errorLoadingProgress": "\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430",
      "fileOperationsAvailable": "\u{1F4C2} \u0424\u0430\u0439\u043B\u043E\u0432\u044B\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 (\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430/\u0412\u044B\u0433\u0440\u0443\u0437\u043A\u0430) \u0442\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B!",
      "tokenGeneratorReady": "\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0433\u043E\u0442\u043E\u0432!",
      "paintingStats": "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",
      "enablePaintingSpeedLimit": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F (\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u043F\u0430\u043A\u0435\u0442\u0430)",
      "enableNotifications": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
      "notifyOnChargesThreshold": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0438 \u043F\u043E\u0440\u043E\u0433\u0430 \u0437\u0430\u0440\u044F\u0434\u043E\u0432",
      "onlyWhenNotFocused": "\u0422\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u043D\u0435 \u0432 \u0444\u043E\u043A\u0443\u0441\u0435",
      "repeatEvery": "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u0442\u044C \u043A\u0430\u0436\u0434\u044B\u0435",
      "minutesPl": "\u043C\u0438\u043D\u0443\u0442(\u0430/\u044B)",
      "grantPermission": "\u0414\u0430\u0442\u044C \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435",
      "test": "\u0422\u0435\u0441\u0442",
      "showAllColorsIncluding": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0446\u0432\u0435\u0442\u0430 (\u0432\u043A\u043B\u044E\u0447\u0430\u044F \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435)",
      "chromaWeight": "\u0412\u0435\u0441 \u0446\u0432\u0435\u0442\u043D\u043E\u0441\u0442\u0438",
      "downloadPreview": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043F\u0440\u0435\u0432\u044C\u044E",
      "apply": "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",
      "cancel": "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C",
      "fit": "\u041F\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0443",
      "hundred": "100%",
      "clear": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C",
      "invert": "\u0418\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
      "reprocessingOverlay": "\u041F\u0435\u0440\u0435\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043E\u0432\u0435\u0440\u043B\u0435\u044F...",
      "overlayUpdated": "\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D!",
      "notificationsEnabled": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
      "notificationsPermissionDenied": "\u0412 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0438 \u043D\u0430 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0442\u043A\u0430\u0437\u0430\u043D\u043E.",
      "overlayEnabled": "\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0432\u043A\u043B\u044E\u0447\u0451\u043D.",
      "overlayDisabled": "\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u0442\u043A\u043B\u044E\u0447\u0451\u043D.",
      "tokenSourceSet": "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D: {source}",
      "batchModeSet": "\u0420\u0435\u0436\u0438\u043C \u043F\u0430\u043A\u0435\u0442\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D: {mode}",
      "randomRange": "\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      "normalFixedSize": "\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440",
      "advancedColorSettingsReset": "\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0446\u0432\u0435\u0442\u0430 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u044B.",
      "shiftRowAltColumn": "Shift = \u0421\u0442\u0440\u043E\u043A\u0430 \u2022 Alt = \u0421\u0442\u043E\u043B\u0431\u0435\u0446",
      "hideTurnstileBtn": "\u0421\u043A\u0440\u044B\u0442\u044C",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443, \u0435\u0441\u043B\u0438 \u043E\u043D\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430",
      "uploadImageFirstColors": "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0437\u0430\u0445\u0432\u0430\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432",
      "availableColors": "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0446\u0432\u0435\u0442\u0430 ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "\u0420\u0435\u0436\u0438\u043C \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F",
      "minimize": "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",
      "restore": "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C",
      "hideStats": "\u0421\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "paintOptions": "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F",
      "paintWhitePixels": "\u0420\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0431\u0435\u043B\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438",
      "paintTransparentPixels": "\u0420\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438"
    },
    "tr": {
      "title": "WPlace Otomatik-Resim",
      "toggleOverlay": "Katman\u0131 A\xE7/Kapat",
      "scanColors": "Renkleri Tara",
      "uploadImage": "Resim Y\xFCkle",
      "resizeImage": "Resmi Yeniden Boyutland\u0131r",
      "selectPosition": "Konum Se\xE7",
      "startPainting": "Boyamay\u0131 Ba\u015Flat",
      "stopPainting": "Boyamay\u0131 Durdur",
      "checkingColors": "\u{1F50D} Uygun renkler kontrol ediliyor...",
      "noColorsFound": "\u274C Sitede renk paletini a\xE7\u0131n ve tekrar deneyin!",
      "colorsFound": "\u2705 {count} uygun renk bulundu. Y\xFCklemeye haz\u0131r.",
      "loadingImage": "\u{1F5BC}\uFE0F Resim y\xFCkleniyor...",
      "imageLoaded": "\u2705 Resim {count} ge\xE7erli piksel ile y\xFCklendi",
      "imageError": "\u274C Resim y\xFCklenirken hata olu\u015Ftu",
      "selectPositionAlert": "Sanat\u0131 ba\u015Flatmak istedi\u011Finiz ilk pikseli boyay\u0131n!",
      "waitingPosition": "\u{1F446} Referans pikseli boyaman\u0131z bekleniyor...",
      "positionSet": "\u2705 Konum ba\u015Far\u0131yla ayarland\u0131!",
      "positionTimeout": "\u274C Konum se\xE7me s\xFCresi doldu",
      "startPaintingMsg": "\u{1F3A8} Boyama ba\u015Flat\u0131l\u0131yor...",
      "paintingProgress": "\u{1F9F1} \u0130lerleme: {painted}/{total} piksel...",
      "noCharges": "\u231B Yeterli hak yok. Bekleniyor {time}...",
      "paintingStopped": "\u23F9\uFE0F Boyama kullan\u0131c\u0131 taraf\u0131ndan durduruldu",
      "paintingComplete": "\u2705 Boyama tamamland\u0131! {count} piksel boyand\u0131.",
      "paintingError": "\u274C Boyama s\u0131ras\u0131nda hata olu\u015Ftu",
      "missingRequirements": "\u274C \xD6nce resim y\xFCkleyip konum se\xE7melisiniz",
      "progress": "\u0130lerleme",
      "pixels": "Pikseller",
      "charges": "Haklar",
      "estimatedTime": "Tahmini s\xFCre",
      "initMessage": "Ba\u015Flamak i\xE7in 'Resim Y\xFCkle'ye t\u0131klay\u0131n",
      "waitingInit": "Ba\u015Flatma bekleniyor...",
      "initializingToken": "\u{1F527} Turnstile token \xFCreticisi ba\u015Flat\u0131l\u0131yor...",
      "tokenReady": "\u2705 Token \xFCreteci haz\u0131r - art\u0131k boyamaya ba\u015Flayabilirsiniz!",
      "tokenRetryLater": "\u26A0\uFE0F Token \xFCreteci gerekti\u011Finde yeniden deneyecek",
      "resizeSuccess": "\u2705 Resim {width}x{height} boyutuna yeniden boyutland\u0131r\u0131ld\u0131",
      "paintingPaused": "\u23F8\uFE0F Boyama duraklat\u0131ld\u0131, Konum X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 CAPTCHA gerekli. Devam etmek i\xE7in bir pikseli manuel olarak boyay\u0131n.",
      "saveData": "\u0130lerlemeyi Kaydet",
      "loadData": "\u0130lerlemeyi Y\xFCkle",
      "saveToFile": "Dosyaya Kaydet",
      "loadFromFile": "Dosyadan Y\xFCkle",
      "dataManager": "Veri Y\xF6neticisi",
      "autoSaved": "\u2705 \u0130lerleme otomatik olarak kaydedildi",
      "dataLoaded": "\u2705 \u0130lerleme ba\u015Far\u0131yla y\xFCklendi",
      "fileSaved": "\u2705 \u0130lerleme dosyaya ba\u015Far\u0131yla kaydedildi",
      "fileLoaded": "\u2705 \u0130lerleme dosyadan ba\u015Far\u0131yla y\xFCklendi",
      "noSavedData": "\u274C Kay\u0131tl\u0131 ilerleme bulunamad\u0131",
      "savedDataFound": "\u2705 Kay\u0131tl\u0131 ilerleme bulundu! Devam etmek i\xE7in y\xFCkleyin.",
      "savedDate": "Kaydedilme tarihi: {date}",
      "clickLoadToContinue": "Devam etmek i\xE7in '\u0130lerlemeyi Y\xFCkle'ye t\u0131klay\u0131n.",
      "fileError": "\u274C Dosya i\u015Flenirken hata olu\u015Ftu",
      "invalidFileFormat": "\u274C Ge\xE7ersiz dosya format\u0131",
      "paintingSpeed": "Boyama H\u0131z\u0131",
      "pixelsPerSecond": "piksel/saniye",
      "speedSetting": "H\u0131z: {speed} piksel/sn",
      "settings": "Ayarlar",
      "botSettings": "Bot Ayarlar\u0131",
      "close": "Kapat",
      "language": "Dil",
      "themeSettings": "Tema Ayarlar\u0131",
      "themeSettingsDesc": "Aray\xFCz i\xE7in tercih etti\u011Finiz renk temas\u0131n\u0131 se\xE7in.",
      "languageSelectDesc": "Tercih etti\u011Finiz dili se\xE7in. De\u011Fi\u015Fiklikler hemen uygulanacakt\u0131r.",
      "autoCaptcha": "Oto-CAPTCHA \xC7\xF6z\xFCc\xFC",
      "autoCaptchaDesc": "CAPTCHA s\xFCresi doldu\u011Funda manuel piksel yerle\u015Ftirmeyi taklit ederek otomatik \xE7\xF6zmeyi dener.",
      "applySettings": "Ayarlar\u0131 Uygula",
      "settingsSaved": "\u2705 Ayarlar ba\u015Far\u0131yla kaydedildi!",
      "speedOn": "A\xE7\u0131k",
      "speedOff": "Kapal\u0131",
      "cooldownSettings": "Bekleme S\xFCresi Ayarlar\u0131",
      "waitCharges": "Haklar \u015Fu seviyeye ula\u015Fana kadar bekle",
      "captchaSolving": "\u{1F916} CAPTCHA \xE7\xF6z\xFClmeye \xE7al\u0131\u015F\u0131l\u0131yor...",
      "captchaFailed": "\u274C Oto-CAPTCHA ba\u015Far\u0131s\u0131z oldu. Bir pikseli manuel boyay\u0131n.",
      "automation": "Otomasyon",
      "noChargesThreshold": "\u231B Haklar\u0131n {threshold} seviyesine ula\u015Fmas\u0131 bekleniyor. \u015Eu anda {current}. Sonraki {time} i\xE7inde...",
      "tokenCapturedSuccess": "Token ba\u015Far\u0131yla yakaland\u0131! \u015Eimdi botu ba\u015Flatabilirsiniz.",
      "notificationsNotSupported": "Bu taray\u0131c\u0131da bildirimler desteklenmiyor.",
      "chargesReadyNotification": "WPlace \u2014 Haklar Haz\u0131r",
      "chargesReadyMessage": "Haklar haz\u0131r: {current} / {max}. E\u015Fik: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Test",
      "testNotificationMessage": "Bu bir test bildirimidir.",
      "showStats": "\u0130statistikleri G\xF6ster",
      "compactMode": "Kompakt Mod",
      "refreshCharges": "Haklar\u0131 Yenile",
      "closeStats": "\u0130statistikleri Kapat",
      "zoomOut": "Uzakla\u015Ft\u0131r",
      "zoomIn": "Yak\u0131nla\u015Ft\u0131r",
      "fitToView": "G\xF6r\xFCn\xFCme s\u0131\u011Fd\u0131r",
      "actualSize": "Ger\xE7ek boyut (100%)",
      "panMode": "Kayd\u0131r (g\xF6r\xFCn\xFCm\xFC hareket ettirmek i\xE7in s\xFCr\xFCkle)",
      "clearIgnoredPixels": "G\xF6rmezden gelinen t\xFCm pikselleri temizle",
      "invertMask": "Maskeyi ters \xE7evir",
      "waitingSetupComplete": "\u{1F504} \u0130lk kurulumun tamamlanmas\u0131 bekleniyor...",
      "waitingTokenGenerator": "\u{1F504} Token \xFCretecinin ba\u015Flat\u0131lmas\u0131 bekleniyor...",
      "uploadImageFirst": "Uygun renkleri yakalamak i\xE7in \xF6nce bir resim y\xFCkleyin",
      "pleaseWaitInitialSetup": "\u{1F504} \u0130lerlemeyi y\xFCklemeden \xF6nce l\xFCtfen ilk kurulumun tamamlanmas\u0131n\u0131 bekleyin.",
      "pleaseWaitFileSetup": "\u{1F504} Dosyadan y\xFCklemeden \xF6nce l\xFCtfen ilk kurulumun tamamlanmas\u0131n\u0131 bekleyin.",
      "errorSavingProgress": "\u274C \u0130lerlemeyi kaydetme hatas\u0131",
      "errorLoadingProgress": "\u274C \u0130lerlemeyi y\xFCkleme hatas\u0131",
      "fileOperationsAvailable": "\u{1F4C2} Dosya i\u015Flemleri (Y\xFCkle/Kar\u015F\u0131ya Y\xFCkle) art\u0131k mevcut!",
      "tokenGeneratorReady": "\u{1F511} Token \xFCreteci haz\u0131r!",
      "paintingStats": "Boyama \u0130statistikleri",
      "enablePaintingSpeedLimit": "Boyama h\u0131z limitini etkinle\u015Ftir (batch boyut kontrol\xFC)",
      "enableNotifications": "Bildirimleri etkinle\u015Ftir",
      "notifyOnChargesThreshold": "Haklar e\u015Fi\u011Fe ula\u015Ft\u0131\u011F\u0131nda bildir",
      "onlyWhenNotFocused": "Sadece sekme odaklanmad\u0131\u011F\u0131nda",
      "repeatEvery": "Her tekrarla",
      "minutesPl": "dakika",
      "grantPermission": "\u0130zin Ver",
      "test": "Test",
      "showAllColorsIncluding": "T\xFCm Renkleri G\xF6ster (kullan\u0131lamayanlar dahil)",
      "chromaWeight": "Renk Doygunlu\u011Fu A\u011F\u0131rl\u0131\u011F\u0131",
      "downloadPreview": "\xD6nizlemeyi \u0130ndir",
      "apply": "Uygula",
      "cancel": "\u0130ptal",
      "fit": "S\u0131\u011Fd\u0131r",
      "hundred": "100%",
      "clear": "Temizle",
      "invert": "Ters \xE7evir",
      "reprocessingOverlay": "Katman yeniden i\u015Fleniyor...",
      "overlayUpdated": "Katman g\xFCncellendi!",
      "notificationsEnabled": "Bildirimler etkinle\u015Ftirildi.",
      "notificationsPermissionDenied": "Bildirim izni reddedildi.",
      "overlayEnabled": "Katman etkinle\u015Ftirildi.",
      "overlayDisabled": "Katman devre d\u0131\u015F\u0131 b\u0131rak\u0131ld\u0131.",
      "tokenSourceSet": "Token kayna\u011F\u0131 \u015Funa ayarland\u0131: {source}",
      "batchModeSet": "Batch modu \u015Funa ayarland\u0131: {mode}",
      "randomRange": "Rastgele Aral\u0131k",
      "normalFixedSize": "Normal Sabit Boyut",
      "advancedColorSettingsReset": "Geli\u015Fmi\u015F renk ayarlar\u0131 s\u0131f\u0131rland\u0131.",
      "shiftRowAltColumn": "Shift = Sat\u0131r \u2022 Alt = S\xFCtun",
      "hideTurnstileBtn": "Gizle",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 g\xF6sterilirse l\xFCtfen kontrol\xFC tamamlay\u0131n",
      "uploadImageFirstColors": "Uygun renkleri yakalamak i\xE7in l\xFCtfen \xF6nce bir resim y\xFCkleyin",
      "availableColors": "Uygun Renkler ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "Geni\u015Fletme Modu",
      "minimize": "K\xFC\xE7\xFClt",
      "restore": "Geri Y\xFCkle",
      "hideStats": "\u0130statistikleri Gizle",
      "paintOptions": "Boya Se\xE7enekleri",
      "paintWhitePixels": "Beyaz pikselleri boya",
      "paintTransparentPixels": "\u015Eeffaf pikselleri boya"
    },
    "uk": {
      "title": "WPlace \u0410\u0432\u0442\u043E-\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",
      "toggleOverlay": "\u041F\u0435\u0440\u0435\u043C\u043A\u043D\u0443\u0442\u0438 \u043E\u0432\u0435\u0440\u043B\u0435\u0439",
      "scanColors": "\u0421\u043A\u0430\u043D\u0443\u0432\u0430\u0442\u0438 \u043A\u043E\u043B\u044C\u043E\u0440\u0438",
      "uploadImage": "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",
      "resizeImage": "\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0440\u043E\u0437\u043C\u0456\u0440 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",
      "selectPosition": "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E",
      "startPainting": "\u041F\u043E\u0447\u0430\u0442\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",
      "stopPainting": "\u0417\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",
      "checkingColors": "\u{1F50D} \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432...",
      "noColorsFound": "\u274C \u0412\u0456\u0434\u043A\u0440\u0438\u0439 \u043F\u0430\u043B\u0456\u0442\u0440\u0443 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432 \u043D\u0430 \u0441\u0430\u0439\u0442\u0456 \u0442\u0430 \u0441\u043F\u0440\u043E\u0431\u0443\u0439 \u0449\u0435 \u0440\u0430\u0437!",
      "colorsFound": "\u2705 \u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E {count} \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432. \u0413\u043E\u0442\u043E\u0432\u043E \u0434\u043E \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F.",
      "loadingImage": "\u{1F5BC}\uFE0F \u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F...",
      "imageLoaded": "\u2705 \u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E. \u0412\u0430\u043B\u0456\u0434\u043D\u0438\u0445 \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432: {count}",
      "imageError": "\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",
      "selectPositionAlert": "\u041D\u0430\u043C\u0430\u043B\u044E\u0439 \u043F\u0435\u0440\u0448\u0438\u0439 \u043F\u0456\u043A\u0441\u0435\u043B\u044C \u0443 \u043C\u0456\u0441\u0446\u0456, \u0434\u0435 \u043C\u0430\u0454 \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0430\u0440\u0442!",
      "waitingPosition": "\u{1F446} \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u043D\u0430 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u043D\u043E\u0433\u043E \u043F\u0456\u043A\u0441\u0435\u043B\u044F...",
      "positionSet": "\u2705 \u041F\u043E\u0437\u0438\u0446\u0456\u044E \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E!",
      "positionTimeout": "\u274C \u0427\u0430\u0441 \u0432\u0438\u0431\u043E\u0440\u0443 \u043F\u043E\u0437\u0438\u0446\u0456\u0457 \u0432\u0438\u0447\u0435\u0440\u043F\u0430\u043D\u043E",
      "startPaintingMsg": "\u{1F3A8} \u041F\u043E\u0447\u0430\u0442\u043E\u043A \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F...",
      "paintingProgress": "\u{1F9F1} \u041F\u0440\u043E\u0433\u0440\u0435\u0441: {painted}/{total} \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432...",
      "noCharges": "\u231B \u041D\u0435\u043C\u0430\u0454 \u0437\u0430\u0440\u044F\u0434\u0456\u0432. \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F {time}...",
      "paintingStopped": "\u23F9\uFE0F \u041C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0435\u043C",
      "paintingComplete": "\u2705 \u041C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E! \u041D\u0430\u043C\u0430\u043B\u044C\u043E\u0432\u0430\u043D\u043E {count} \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432.",
      "paintingError": "\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0456\u0434 \u0447\u0430\u0441 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",
      "missingRequirements": "\u274C \u0421\u043F\u0435\u0440\u0448\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0442\u0430 \u0432\u0438\u0431\u0435\u0440\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E",
      "progress": "\u041F\u0440\u043E\u0433\u0440\u0435\u0441",
      "pixels": "\u041F\u0456\u043A\u0441\u0435\u043B\u0456",
      "charges": "\u0417\u0430\u0440\u044F\u0434\u0438",
      "estimatedTime": "\u041E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u0438\u0439 \u0447\u0430\u0441",
      "initMessage": "\u041D\u0430\u0442\u0438\u0441\u043D\u0438 '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F', \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438",
      "waitingInit": "\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0456\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u0430\u0446\u0456\u0457...",
      "initializingToken": "\u{1F527} \u0406\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u0430\u0446\u0456\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 Turnstile...",
      "tokenReady": "\u2705 \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u0433\u043E\u0442\u043E\u0432\u0438\u0439 \u2013 \u043C\u043E\u0436\u043D\u0430 \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F!",
      "tokenRetryLater": "\u26A0\uFE0F \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0441\u043F\u0440\u043E\u0431\u0443 \u0437\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0438",
      "resizeSuccess": "\u2705 \u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u043C\u0456\u043D\u0435\u043D\u043E \u0434\u043E {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F \u041C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u043F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0456\u0457 X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 \u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 \u0442\u043E\u043A\u0435\u043D. \u0421\u043F\u0440\u043E\u0431\u0443\u0439 \u0442\u0440\u043E\u0445\u0438 \u043F\u0456\u0437\u043D\u0456\u0448\u0435.",
      "saveData": "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441",
      "loadData": "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441",
      "saveToFile": "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0443 \u0444\u0430\u0439\u043B",
      "loadFromFile": "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437 \u0444\u0430\u0439\u043B\u0443",
      "dataManager": "\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0434\u0430\u043D\u0438\u0445",
      "autoSaved": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",
      "dataLoaded": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E",
      "fileSaved": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0443 \u0444\u0430\u0439\u043B",
      "fileLoaded": "\u2705 \u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E \u0437 \u0444\u0430\u0439\u043B\u0443",
      "noSavedData": "\u274C \u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443",
      "savedDataFound": "\u2705 \u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441! \u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438, \u0449\u043E\u0431 \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438?",
      "savedDate": "\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E: {date}",
      "clickLoadToContinue": "\u041D\u0430\u0442\u0438\u0441\u043D\u0438 '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441', \u0449\u043E\u0431 \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438.",
      "fileError": "\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043E\u0431\u0440\u043E\u0431\u043A\u0438 \u0444\u0430\u0439\u043B\u0443",
      "invalidFileFormat": "\u274C \u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0443",
      "paintingSpeed": "\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",
      "pixelsPerSecond": "\u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432/\u0441\u0435\u043A\u0443\u043D\u0434\u0430",
      "speedSetting": "\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C: {speed} \u043F\u0456\u043A\u0441\u0435\u043B\u0456\u0432/\u0441\u0435\u043A",
      "settings": "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
      "botSettings": "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0431\u043E\u0442\u0430",
      "close": "\u0417\u0430\u043A\u0440\u0438\u0442\u0438",
      "language": "\u041C\u043E\u0432\u0430",
      "themeSettings": "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0435\u043C\u0438",
      "themeSettingsDesc": "\u0412\u0438\u0431\u0435\u0440\u0438 \u0431\u0430\u0436\u0430\u043D\u0443 \u043A\u043E\u043B\u0456\u0440\u043D\u0443 \u0442\u0435\u043C\u0443 \u0434\u043B\u044F \u0456\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443.",
      "languageSelectDesc": "\u0412\u0438\u0431\u0435\u0440\u0438 \u0431\u0430\u0436\u0430\u043D\u0443 \u043C\u043E\u0432\u0443. \u0417\u043C\u0456\u043D\u0438 \u043D\u0430\u0431\u0443\u0434\u0443\u0442\u044C \u0447\u0438\u043D\u043D\u043E\u0441\u0442\u0456 \u043E\u0434\u0440\u0430\u0437\u0443.",
      "autoCaptcha": "\u0410\u0432\u0442\u043E-CAPTCHA (Turnstile)",
      "autoCaptchaDesc": "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u0442\u043E\u043A\u0435\u043D\u0438 Turnstile \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E \u0432\u0431\u0443\u0434\u043E\u0432\u0430\u043D\u043E\u0433\u043E \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430. \u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0454 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0456\u044E \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0443 \u0440\u0430\u0437\u0456 \u043F\u043E\u0442\u0440\u0435\u0431\u0438.",
      "applySettings": "\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
      "settingsSaved": "\u2705 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E!",
      "speedOn": "\u0423\u0432\u0456\u043C\u043A",
      "speedOff": "\u0412\u0438\u043C\u043A",
      "cooldownSettings": "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F",
      "waitCharges": "\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u0442\u0438, \u0434\u043E\u043A\u0438 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u0430\u0440\u044F\u0434\u0456\u0432 \u0434\u043E\u0441\u044F\u0433\u043D\u0435",
      "captchaSolving": "\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u044F \u0442\u043E\u043A\u0435\u043D\u0430 Turnstile...",
      "captchaFailed": "\u274C \u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 \u0442\u043E\u043A\u0435\u043D Turnstile. \u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u044E \u0437\u0430\u043F\u0430\u0441\u043D\u0438\u0439 \u043C\u0435\u0442\u043E\u0434...",
      "automation": "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0456\u044F",
      "noChargesThreshold": "\u231B \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F, \u0434\u043E\u043A\u0438 \u0437\u0430\u0440\u044F\u0434\u0438 \u0434\u043E\u0441\u044F\u0433\u043D\u0443\u0442\u044C {threshold}. \u0417\u0430\u0440\u0430\u0437 {current}. \u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0435 \u0447\u0435\u0440\u0435\u0437 {time}...",
      "tokenCapturedSuccess": "\u0422\u043E\u043A\u0435\u043D \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u043E! \u041C\u043E\u0436\u0435\u0448 \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u0438 \u0431\u043E\u0442\u0430.",
      "notificationsNotSupported": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043D\u0435 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u044E\u0442\u044C\u0441\u044F \u0432 \u0446\u044C\u043E\u043C\u0443 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456.",
      "chargesReadyNotification": "WPlace \u2014 \u0417\u0430\u0440\u044F\u0434\u0438 \u0433\u043E\u0442\u043E\u0432\u0456",
      "chargesReadyMessage": "\u0417\u0430\u0440\u044F\u0434\u0438 \u0433\u043E\u0442\u043E\u0432\u0456: {current} / {max}. \u041F\u043E\u0440\u0456\u0433: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 \u0422\u0435\u0441\u0442",
      "testNotificationMessage": "\u0426\u0435 \u0442\u0435\u0441\u0442\u043E\u0432\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F.",
      "showStats": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "compactMode": "\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",
      "refreshCharges": "\u041E\u043D\u043E\u0432\u0438\u0442\u0438 \u0437\u0430\u0440\u044F\u0434\u0438",
      "closeStats": "\u0417\u0430\u043A\u0440\u0438\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "zoomOut": "\u0417\u043C\u0435\u043D\u0448\u0438\u0442\u0438",
      "zoomIn": "\u0417\u0431\u0456\u043B\u044C\u0448\u0438\u0442\u0438",
      "fitToView": "\u041F\u0456\u0434\u0456\u0433\u043D\u0430\u0442\u0438 \u043F\u0456\u0434 \u0432\u0456\u043A\u043D\u043E",
      "actualSize": "\u0420\u0435\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440 (100%)",
      "panMode": "\u041F\u0435\u0440\u0435\u043C\u0456\u0449\u0435\u043D\u043D\u044F (\u043F\u0435\u0440\u0435\u0442\u044F\u0433\u043D\u0438 \u0434\u043B\u044F \u0440\u0443\u0445\u0443)",
      "clearIgnoredPixels": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0456 \u0456\u0433\u043D\u043E\u0440\u043E\u0432\u0430\u043D\u0456 \u043F\u0456\u043A\u0441\u0435\u043B\u0456",
      "invertMask": "\u0406\u043D\u0432\u0435\u0440\u0442\u0443\u0432\u0430\u0442\u0438 \u043C\u0430\u0441\u043A\u0443",
      "waitingSetupComplete": "\u{1F504} \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F...",
      "waitingTokenGenerator": "\u{1F504} \u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0456\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u0430\u0446\u0456\u0457 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0442\u043E\u043A\u0435\u043D\u0456\u0432...",
      "uploadImageFirst": "\u0421\u043F\u0435\u0440\u0448\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u043B\u044F \u0437\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u043D\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432",
      "pleaseWaitInitialSetup": "\u{1F504} \u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u043F\u043E\u0447\u0435\u043A\u0430\u0439 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u043C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443.",
      "pleaseWaitFileSetup": "\u{1F504} \u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u043F\u043E\u0447\u0435\u043A\u0430\u0439 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u043E\u0433\u043E \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u043C \u0437 \u0444\u0430\u0439\u043B\u0443.",
      "errorSavingProgress": "\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443",
      "errorLoadingProgress": "\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0443",
      "fileOperationsAvailable": "\u{1F4C2} \u0424\u0430\u0439\u043B\u043E\u0432\u0456 \u043E\u043F\u0435\u0440\u0430\u0446\u0456\u0457 (\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F/\u0412\u0438\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F) \u0442\u0435\u043F\u0435\u0440 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456!",
      "tokenGeneratorReady": "\u{1F511} \u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u0433\u043E\u0442\u043E\u0432\u0438\u0439!",
      "paintingStats": "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",
      "enablePaintingSpeedLimit": "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u043D\u044F \u0448\u0432\u0438\u0434\u043A\u043E\u0441\u0442\u0456 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F (\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0440\u043E\u0437\u043C\u0456\u0440\u0443 \u043F\u0430\u043A\u0435\u0442\u0430)",
      "enableNotifications": "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F",
      "notifyOnChargesThreshold": "\u0421\u043F\u043E\u0432\u0456\u0441\u0447\u0430\u0442\u0438 \u043F\u0440\u0438 \u0434\u043E\u0441\u044F\u0433\u043D\u0435\u043D\u043D\u0456 \u043F\u043E\u0440\u043E\u0433\u0443 \u0437\u0430\u0440\u044F\u0434\u0456\u0432",
      "onlyWhenNotFocused": "\u041B\u0438\u0448\u0435 \u043A\u043E\u043B\u0438 \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u043D\u0435 \u0432 \u0444\u043E\u043A\u0443\u0441\u0456",
      "repeatEvery": "\u041F\u043E\u0432\u0442\u043E\u0440\u044E\u0432\u0430\u0442\u0438 \u043A\u043E\u0436\u043D\u0456",
      "minutesPl": "\u0445\u0432\u0438\u043B\u0438\u043D",
      "grantPermission": "\u041D\u0430\u0434\u0430\u0442\u0438 \u0434\u043E\u0437\u0432\u0456\u043B",
      "test": "\u0422\u0435\u0441\u0442",
      "showAllColorsIncluding": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u043A\u043E\u043B\u044C\u043E\u0440\u0438 (\u0432\u043A\u043B\u044E\u0447\u0430\u044E\u0447\u0438 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456)",
      "chromaWeight": "\u0412\u0430\u0433\u0430 \u043D\u0430\u0441\u0438\u0447\u0435\u043D\u043E\u0441\u0442\u0456",
      "downloadPreview": "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434",
      "apply": "\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438",
      "cancel": "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",
      "fit": "\u041F\u0456\u0434\u0456\u0433\u043D\u0430\u0442\u0438",
      "hundred": "100%",
      "clear": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438",
      "invert": "\u0406\u043D\u0432\u0435\u0440\u0442\u0443\u0432\u0430\u0442\u0438",
      "reprocessingOverlay": "\u041F\u0435\u0440\u0435\u043E\u0431\u0440\u043E\u0431\u043A\u0430 \u043E\u0432\u0435\u0440\u043B\u0435\u044F...",
      "overlayUpdated": "\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043E!",
      "notificationsEnabled": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E.",
      "notificationsPermissionDenied": "\u0414\u043E\u0437\u0432\u0456\u043B \u043D\u0430 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043E.",
      "overlayEnabled": "\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E.",
      "overlayDisabled": "\u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E.",
      "tokenSourceSet": "\u0414\u0436\u0435\u0440\u0435\u043B\u043E \u0442\u043E\u043A\u0435\u043D\u0456\u0432 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E: {source}",
      "batchModeSet": "\u041F\u0430\u043A\u0435\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E: {mode}",
      "randomRange": "\u0412\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0438\u0439 \u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D",
      "normalFixedSize": "\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439 \u0444\u0456\u043A\u0441\u043E\u0432\u0430\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440",
      "advancedColorSettingsReset": "\u041F\u0440\u043E\u0441\u0443\u043D\u0443\u0442\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432 \u0441\u043A\u0438\u043D\u0443\u0442\u043E.",
      "shiftRowAltColumn": "Shift = \u0420\u044F\u0434\u043E\u043A \u2022 Alt = \u0421\u0442\u043E\u0432\u043F\u0435\u0446\u044C",
      "hideTurnstileBtn": "\u0421\u0445\u043E\u0432\u0430\u0442\u0438",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 \u0431\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0437\u0430\u0432\u0435\u0440\u0448\u0438 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0443, \u044F\u043A\u0449\u043E \u0432\u043E\u043D\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430",
      "uploadImageFirstColors": "\u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0441\u043F\u0435\u0440\u0448\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u043B\u044F \u0437\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u043D\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u043A\u043E\u043B\u044C\u043E\u0440\u0456\u0432",
      "availableColors": "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043A\u043E\u043B\u044C\u043E\u0440\u0438 ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "\u0420\u0435\u0436\u0438\u043C \u0440\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u043D\u044F",
      "minimize": "\u041C\u0456\u043D\u0456\u043C\u0456\u0437\u0443\u0432\u0430\u0442\u0438",
      "restore": "\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438",
      "hideStats": "\u041F\u0440\u0438\u0445\u043E\u0432\u0430\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "paintOptions": "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u043C\u0430\u043B\u044E\u0432\u0430\u043D\u043D\u044F",
      "paintWhitePixels": "\u041C\u0430\u043B\u044E\u0432\u0430\u0442\u0438 \u0431\u0456\u043B\u0456 \u043F\u0456\u043A\u0441\u0435\u043B\u0456",
      "paintTransparentPixels": "\u041C\u0430\u043B\u044E\u0432\u0430\u0442\u0438 \u043F\u0440\u043E\u0437\u043E\u0440\u0456 \u043F\u0456\u043A\u0441\u0435\u043B\u0456"
    },
    "vi": {
      "title": "WPlace Auto-Image",
      "toggleOverlay": "B\u1EADt/t\u1EAFt l\u1EDBp ph\u1EE7",
      "scanColors": "Qu\xE9t m\xE0u",
      "uploadImage": "T\u1EA3i l\xEAn h\xECnh \u1EA3nh",
      "resizeImage": "Thay \u0111\u1ED5i k\xEDch th\u01B0\u1EDBc",
      "selectPosition": "Ch\u1ECDn v\u1ECB tr\xED",
      "startPainting": "B\u1EAFt \u0111\u1EA7u v\u1EBD",
      "stopPainting": "D\u1EEBng v\u1EBD",
      "checkingColors": "\u{1F50D} \u0110ang ki\u1EC3m tra m\xE0u s\u1EAFc c\xF3 s\u1EB5n...",
      "noColorsFound": "\u274C H\xE3y m\u1EDF b\u1EA3ng m\xE0u tr\xEAn trang web v\xE0 th\u1EED l\u1EA1i!",
      "colorsFound": "\u2705 T\xECm th\u1EA5y {count} m\xE0u. S\u1EB5n s\xE0ng \u0111\u1EC3 t\u1EA3i l\xEAn.",
      "loadingImage": "\u{1F5BC}\uFE0F \u0110ang t\u1EA3i h\xECnh \u1EA3nh...",
      "imageLoaded": "\u2705 \u0110\xE3 t\u1EA3i h\xECnh \u1EA3nh v\u1EDBi {count} pixel h\u1EE3p l\u1EC7",
      "imageError": "\u274C L\u1ED7i khi t\u1EA3i h\xECnh \u1EA3nh",
      "selectPositionAlert": "V\u1EBD pixel \u0111\u1EA7u ti\xEAn t\u1EA1i v\u1ECB tr\xED b\u1EA1n mu\u1ED1n t\xE1c ph\u1EA9m ngh\u1EC7 thu\u1EADt b\u1EAFt \u0111\u1EA7u!",
      "waitingPosition": "\u{1F446} \u0110ang ch\u1EDD b\u1EA1n v\u1EBD pixel tham chi\u1EBFu...",
      "positionSet": "\u2705 \u0110\xE3 \u0111\u1EB7t v\u1ECB tr\xED th\xE0nh c\xF4ng!",
      "positionTimeout": "\u274C H\u1EBFt th\u1EDDi gian ch\u1ECDn v\u1ECB tr\xED",
      "startPaintingMsg": "\u{1F3A8} B\u1EAFt \u0111\u1EA7u v\u1EBD...",
      "paintingProgress": "\u{1F9F1} Ti\u1EBFn tr\xECnh: {painted}/{total} pixel...",
      "noCharges": "\u231B Kh\xF4ng c\xF3 \u0111i\u1EC7n t\xEDch. \u0110ang ch\u1EDD {time}...",
      "paintingStopped": "\u23F9\uFE0F Ng\u01B0\u1EDDi d\xF9ng \u0111\xE3 d\u1EEBng v\u1EBD",
      "paintingComplete": "\u2705 Ho\xE0n th\xE0nh v\u1EBD! \u0110\xE3 v\u1EBD {count} pixel.",
      "paintingError": "\u274C L\u1ED7i trong qu\xE1 tr\xECnh v\u1EBD",
      "missingRequirements": "\u274C H\xE3y t\u1EA3i l\xEAn h\xECnh \u1EA3nh v\xE0 ch\u1ECDn v\u1ECB tr\xED tr\u01B0\u1EDBc",
      "progress": "Ti\u1EBFn tr\xECnh",
      "pixels": "Pixel",
      "charges": "\u0110i\u1EC7n t\xEDch",
      "estimatedTime": "Th\u1EDDi gian \u01B0\u1EDBc t\xEDnh",
      "initMessage": "Nh\u1EA5p 'T\u1EA3i l\xEAn h\xECnh \u1EA3nh' \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u",
      "waitingInit": "\u0110ang ch\u1EDD kh\u1EDFi t\u1EA1o...",
      "initializingToken": "\u{1F527} \u0110ang kh\u1EDFi t\u1EA1o b\u1ED9 t\u1EA1o token Turnstile...",
      "tokenReady": "\u2705 B\u1ED9 t\u1EA1o token \u0111\xE3 s\u1EB5n s\xE0ng - b\u1EA1n c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u v\u1EBD!",
      "tokenRetryLater": "\u26A0\uFE0F B\u1ED9 t\u1EA1o token s\u1EBD th\u1EED l\u1EA1i khi c\u1EA7n thi\u1EBFt",
      "resizeSuccess": "\u2705 \u0110\xE3 thay \u0111\u1ED5i k\xEDch th\u01B0\u1EDBc h\xECnh \u1EA3nh th\xE0nh {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F T\u1EA1m d\u1EEBng v\u1EBD t\u1EA1i v\u1ECB tr\xED X: {x}, Y: {y}",
      "captchaNeeded": "\u2757 T\u1EA1o token th\u1EA5t b\u1EA1i. Vui l\xF2ng th\u1EED l\u1EA1i sau.",
      "saveData": "L\u01B0u ti\u1EBFn tr\xECnh",
      "loadData": "T\u1EA3i ti\u1EBFn tr\xECnh",
      "saveToFile": "L\u01B0u v\xE0o t\u1EC7p",
      "loadFromFile": "T\u1EA3i t\u1EEB t\u1EC7p",
      "dataManager": "D\u1EEF li\u1EC7u",
      "autoSaved": "\u2705 \u0110\xE3 t\u1EF1 \u0111\u1ED9ng l\u01B0u ti\u1EBFn tr\xECnh",
      "dataLoaded": "\u2705 \u0110\xE3 t\u1EA3i ti\u1EBFn tr\xECnh th\xE0nh c\xF4ng",
      "fileSaved": "\u2705 \u0110\xE3 l\u01B0u v\xE0o t\u1EC7p th\xE0nh c\xF4ng",
      "fileLoaded": "\u2705 \u0110\xE3 t\u1EA3i t\u1EEB t\u1EC7p th\xE0nh c\xF4ng",
      "noSavedData": "\u274C Kh\xF4ng t\xECm th\u1EA5y ti\u1EBFn tr\xECnh \u0111\xE3 l\u01B0u",
      "savedDataFound": "\u2705 T\xECm th\u1EA5y ti\u1EBFn tr\xECnh \u0111\xE3 l\u01B0u! T\u1EA3i \u0111\u1EC3 ti\u1EBFp t\u1EE5c?",
      "savedDate": "\u0110\xE3 l\u01B0u v\xE0o: {date}",
      "clickLoadToContinue": "Nh\u1EA5p 'T\u1EA3i ti\u1EBFn tr\xECnh' \u0111\u1EC3 ti\u1EBFp t\u1EE5c.",
      "fileError": "\u274C L\u1ED7i khi x\u1EED l\xFD t\u1EC7p",
      "invalidFileFormat": "\u274C \u0110\u1ECBnh d\u1EA1ng t\u1EC7p kh\xF4ng h\u1EE3p l\u1EC7",
      "paintingSpeed": "T\u1ED1c \u0111\u1ED9 v\u1EBD",
      "pixelsPerSecond": "pixel/gi\xE2y",
      "speedSetting": "T\u1ED1c \u0111\u1ED9: {speed} pixel/gi\xE2y",
      "settings": "C\xE0i \u0111\u1EB7t",
      "botSettings": "C\xE0i \u0111\u1EB7t Bot",
      "close": "\u0110\xF3ng",
      "language": "Ng\xF4n ng\u1EEF",
      "themeSettings": "C\xE0i \u0111\u1EB7t Giao di\u1EC7n",
      "themeSettingsDesc": "Ch\u1ECDn ch\u1EE7 \u0111\u1EC1 m\xE0u s\u1EAFc y\xEAu th\xEDch cho giao di\u1EC7n.",
      "languageSelectDesc": "Ch\u1ECDn ng\xF4n ng\u1EEF \u01B0a th\xEDch. Thay \u0111\u1ED5i s\u1EBD c\xF3 hi\u1EC7u l\u1EF1c ngay l\u1EADp t\u1EE9c.",
      "autoCaptcha": "T\u1EF1 \u0111\u1ED9ng gi\u1EA3i CAPTCHA",
      "autoCaptchaDesc": "T\u1EF1 \u0111\u1ED9ng c\u1ED1 g\u1EAFng gi\u1EA3i CAPTCHA b\u1EB1ng c\xE1ch m\xF4 ph\u1ECFng vi\u1EC7c \u0111\u1EB7t pixel th\u1EE7 c\xF4ng khi token h\u1EBFt h\u1EA1n.",
      "applySettings": "\xC1p d\u1EE5ng c\xE0i \u0111\u1EB7t",
      "settingsSaved": "\u2705 \u0110\xE3 l\u01B0u c\xE0i \u0111\u1EB7t th\xE0nh c\xF4ng!",
      "speedOn": "B\u1EADt",
      "speedOff": "T\u1EAFt",
      "cooldownSettings": "C\xE0i \u0111\u1EB7t th\u1EDDi gian ch\u1EDD",
      "waitCharges": "Ch\u1EDD cho \u0111\u1EBFn khi s\u1ED1 l\u1EA7n s\u1EA1c \u0111\u1EA1t",
      "captchaSolving": "\u{1F916} \u0110ang c\u1ED1 g\u1EAFng gi\u1EA3i CAPTCHA...",
      "captchaFailed": "\u274C Gi\u1EA3i CAPTCHA t\u1EF1 \u0111\u1ED9ng th\u1EA5t b\u1EA1i. Vui l\xF2ng v\u1EBD m\u1ED9t pixel th\u1EE7 c\xF4ng.",
      "automation": "T\u1EF1 \u0111\u1ED9ng h\xF3a",
      "noChargesThreshold": "\u231B \u0110ang ch\u1EDD s\u1ED1 l\u1EA7n s\u1EA1c \u0111\u1EA1t {threshold}. Hi\u1EC7n t\u1EA1i {current}. L\u1EA7n ti\u1EBFp theo trong {time}...",
      "tokenCapturedSuccess": "\u0110\xE3 b\u1EAFt token th\xE0nh c\xF4ng! B\u1EA1n c\xF3 th\u1EC3 kh\u1EDFi \u0111\u1ED9ng bot ngay.",
      "notificationsNotSupported": "Th\xF4ng b\xE1o kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 trong tr\xECnh duy\u1EC7t n\xE0y.",
      "chargesReadyNotification": "WPlace \u2014 \u0110i\u1EC7n t\xEDch s\u1EB5n s\xE0ng",
      "chargesReadyMessage": "\u0110i\u1EC7n t\xEDch s\u1EB5n s\xE0ng: {current} / {max}. Ng\u01B0\u1EE1ng: {threshold}.",
      "testNotificationTitle": "WPlace \u2014 Th\u1EED nghi\u1EC7m",
      "testNotificationMessage": "\u0110\xE2y l\xE0 th\xF4ng b\xE1o th\u1EED nghi\u1EC7m.",
      "showStats": "Hi\u1EC3n th\u1ECB th\u1ED1ng k\xEA",
      "compactMode": "Ch\u1EBF \u0111\u1ED9 g\u1ECDn",
      "refreshCharges": "L\xE0m m\u1EDBi \u0111i\u1EC7n t\xEDch",
      "closeStats": "\u0110\xF3ng th\u1ED1ng k\xEA",
      "zoomOut": "Thu nh\u1ECF",
      "zoomIn": "Ph\xF3ng to",
      "fitToView": "V\u1EEBa m\xE0n h\xECnh",
      "actualSize": "K\xEDch th\u01B0\u1EDBc th\u1EF1c (100%)",
      "panMode": "Di chuy\u1EC3n (k\xE9o \u0111\u1EC3 di chuy\u1EC3n)",
      "clearIgnoredPixels": "X\xF3a t\u1EA5t c\u1EA3 pixel b\u1ECB b\u1ECF qua",
      "invertMask": "\u0110\u1EA3o ng\u01B0\u1EE3c m\u1EB7t n\u1EA1",
      "waitingSetupComplete": "\u{1F504} \u0110ang ch\u1EDD thi\u1EBFt l\u1EADp ban \u0111\u1EA7u ho\xE0n t\u1EA5t...",
      "waitingTokenGenerator": "\u{1F504} \u0110ang ch\u1EDD b\u1ED9 t\u1EA1o token kh\u1EDFi t\u1EA1o...",
      "uploadImageFirst": "T\u1EA3i l\xEAn h\xECnh \u1EA3nh tr\u01B0\u1EDBc \u0111\u1EC3 b\u1EAFt m\xE0u c\xF3 s\u1EB5n",
      "pleaseWaitInitialSetup": "\u{1F504} Vui l\xF2ng \u0111\u1EE3i thi\u1EBFt l\u1EADp ban \u0111\u1EA7u ho\xE0n t\u1EA5t tr\u01B0\u1EDBc khi t\u1EA3i ti\u1EBFn tr\xECnh.",
      "pleaseWaitFileSetup": "\u{1F504} Vui l\xF2ng \u0111\u1EE3i thi\u1EBFt l\u1EADp ban \u0111\u1EA7u ho\xE0n t\u1EA5t tr\u01B0\u1EDBc khi t\u1EA3i t\u1EEB t\u1EC7p.",
      "errorSavingProgress": "\u274C L\u1ED7i khi l\u01B0u ti\u1EBFn tr\xECnh",
      "errorLoadingProgress": "\u274C L\u1ED7i khi t\u1EA3i ti\u1EBFn tr\xECnh",
      "fileOperationsAvailable": "\u{1F4C2} C\xE1c thao t\xE1c t\u1EC7p (T\u1EA3i/Upload) \u0111\xE3 c\xF3 s\u1EB5n!",
      "tokenGeneratorReady": "\u{1F511} B\u1ED9 t\u1EA1o token \u0111\xE3 s\u1EB5n s\xE0ng!",
      "paintingStats": "Th\u1ED1ng k\xEA v\u1EBD",
      "enablePaintingSpeedLimit": "B\u1EADt gi\u1EDBi h\u1EA1n t\u1ED1c \u0111\u1ED9 v\u1EBD (ki\u1EC3m so\xE1t k\xEDch th\u01B0\u1EDBc l\xF4)",
      "enableNotifications": "B\u1EADt th\xF4ng b\xE1o",
      "notifyOnChargesThreshold": "Th\xF4ng b\xE1o khi \u0111i\u1EC7n t\xEDch \u0111\u1EA1t ng\u01B0\u1EE1ng",
      "onlyWhenNotFocused": "Ch\u1EC9 khi tab kh\xF4ng \u0111\u01B0\u1EE3c ch\u1ECDn",
      "repeatEvery": "L\u1EB7p l\u1EA1i m\u1ED7i",
      "minutesPl": "ph\xFAt",
      "grantPermission": "C\u1EA5p quy\u1EC1n",
      "test": "Th\u1EED nghi\u1EC7m",
      "showAllColorsIncluding": "Hi\u1EC3n th\u1ECB t\u1EA5t c\u1EA3 m\xE0u (bao g\u1ED3m kh\xF4ng c\xF3 s\u1EB5n)",
      "chromaWeight": "Tr\u1ECDng s\u1ED1 \u0111\u1ED9 b\xE3o h\xF2a",
      "downloadPreview": "T\u1EA3i xu\u1ED1ng xem tr\u01B0\u1EDBc",
      "apply": "\xC1p d\u1EE5ng",
      "cancel": "H\u1EE7y",
      "fit": "V\u1EEBa khung",
      "hundred": "100%",
      "clear": "X\xF3a",
      "invert": "\u0110\u1EA3o ng\u01B0\u1EE3c",
      "reprocessingOverlay": "\u0110ang x\u1EED l\xFD l\u1EA1i l\u1EDBp ph\u1EE7...",
      "overlayUpdated": "L\u1EDBp ph\u1EE7 \u0111\xE3 c\u1EADp nh\u1EADt!",
      "notificationsEnabled": "\u0110\xE3 b\u1EADt th\xF4ng b\xE1o.",
      "notificationsPermissionDenied": "Quy\u1EC1n th\xF4ng b\xE1o b\u1ECB t\u1EEB ch\u1ED1i.",
      "overlayEnabled": "\u0110\xE3 b\u1EADt l\u1EDBp ph\u1EE7.",
      "overlayDisabled": "\u0110\xE3 t\u1EAFt l\u1EDBp ph\u1EE7.",
      "tokenSourceSet": "Ngu\u1ED3n token \u0111\u01B0\u1EE3c \u0111\u1EB7t th\xE0nh: {source}",
      "batchModeSet": "Ch\u1EBF \u0111\u1ED9 l\xF4 \u0111\u01B0\u1EE3c \u0111\u1EB7t th\xE0nh: {mode}",
      "randomRange": "Ph\u1EA1m vi ng\u1EABu nhi\xEAn",
      "normalFixedSize": "K\xEDch th\u01B0\u1EDBc c\u1ED1 \u0111\u1ECBnh b\xECnh th\u01B0\u1EDDng",
      "advancedColorSettingsReset": "\u0110\xE3 \u0111\u1EB7t l\u1EA1i c\xE0i \u0111\u1EB7t m\xE0u n\xE2ng cao.",
      "shiftRowAltColumn": "Shift = H\xE0ng \u2022 Alt = C\u1ED9t",
      "hideTurnstileBtn": "\u1EA8n",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 vui l\xF2ng ho\xE0n th\xE0nh ki\u1EC3m tra n\u1EBFu \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB",
      "uploadImageFirstColors": "Vui l\xF2ng t\u1EA3i l\xEAn h\xECnh \u1EA3nh tr\u01B0\u1EDBc \u0111\u1EC3 b\u1EAFt m\xE0u c\xF3 s\u1EB5n",
      "availableColors": "M\xE0u c\xF3 s\u1EB5n ({count})",
      "colorTooltip": "ID: {id}\nRGB: {rgb}",
      "expandMode": "Ch\u1EBF \u0111\u1ED9 m\u1EDF r\u1ED9ng",
      "minimize": "Thu nh\u1ECF",
      "restore": "Kh\xF4i ph\u1EE5c",
      "hideStats": "\u1EA8n th\u1ED1ng k\xEA",
      "paintOptions": "T\xF9y ch\u1ECDn v\u1EBD",
      "paintWhitePixels": "V\u1EBD \u0111i\u1EC3m \u1EA3nh tr\u1EAFng",
      "paintTransparentPixels": "V\u1EBD \u0111i\u1EC3m \u1EA3nh trong su\u1ED1t"
    },
    "zh-CN": {
      "title": "WPlace \u81EA\u52A8\u56FE\u50CF",
      "toggleOverlay": "\u5207\u6362\u8986\u76D6\u5C42",
      "scanColors": "\u626B\u63CF\u989C\u8272",
      "uploadImage": "\u4E0A\u4F20\u56FE\u50CF",
      "resizeImage": "\u8C03\u6574\u5927\u5C0F",
      "selectPosition": "\u9009\u62E9\u4F4D\u7F6E",
      "startPainting": "\u5F00\u59CB\u7ED8\u5236",
      "stopPainting": "\u505C\u6B62\u7ED8\u5236",
      "checkingColors": "\u{1F50D} \u6B63\u5728\u68C0\u67E5\u53EF\u7528\u989C\u8272...",
      "noColorsFound": "\u274C \u8BF7\u5728\u7F51\u7AD9\u4E0A\u6253\u5F00\u8C03\u8272\u677F\u540E\u518D\u8BD5\uFF01",
      "colorsFound": "\u2705 \u627E\u5230 {count} \u4E2A\u53EF\u7528\u989C\u8272\uFF0C\u51C6\u5907\u4E0A\u4F20\u3002",
      "loadingImage": "\u{1F5BC}\uFE0F \u6B63\u5728\u52A0\u8F7D\u56FE\u50CF...",
      "imageLoaded": "\u2705 \u56FE\u50CF\u5DF2\u52A0\u8F7D\uFF0C\u5305\u542B {count} \u4E2A\u6709\u6548\u50CF\u7D20",
      "imageError": "\u274C \u52A0\u8F7D\u56FE\u50CF\u65F6\u51FA\u9519",
      "selectPositionAlert": "\u8BF7\u5728\u4F60\u60F3\u8BA9\u4F5C\u54C1\u5F00\u59CB\u7684\u4F4D\u7F6E\u7ED8\u5236\u7B2C\u4E00\u4E2A\u50CF\u7D20\uFF01",
      "waitingPosition": "\u{1F446} \u6B63\u5728\u7B49\u5F85\u4F60\u7ED8\u5236\u53C2\u8003\u50CF\u7D20...",
      "positionSet": "\u2705 \u4F4D\u7F6E\u8BBE\u7F6E\u6210\u529F\uFF01",
      "positionTimeout": "\u274C \u9009\u62E9\u4F4D\u7F6E\u8D85\u65F6",
      "startPaintingMsg": "\u{1F3A8} \u5F00\u59CB\u7ED8\u5236...",
      "paintingProgress": "\u{1F9F1} \u8FDB\u5EA6: {painted}/{total} \u50CF\u7D20...",
      "noCharges": "\u231B \u65E0\u53EF\u7528\u6B21\u6570\uFF0C\u7B49\u5F85 {time}...",
      "paintingStopped": "\u23F9\uFE0F \u5DF2\u88AB\u7528\u6237\u505C\u6B62",
      "paintingComplete": "\u2705 \u7ED8\u5236\u5B8C\u6210\uFF01\u5171\u7ED8\u5236 {count} \u4E2A\u50CF\u7D20\u3002",
      "paintingError": "\u274C \u7ED8\u5236\u8FC7\u7A0B\u4E2D\u51FA\u9519",
      "missingRequirements": "\u274C \u8BF7\u5148\u52A0\u8F7D\u56FE\u50CF\u5E76\u9009\u62E9\u4F4D\u7F6E",
      "progress": "\u8FDB\u5EA6",
      "pixels": "\u50CF\u7D20",
      "charges": "\u6B21\u6570",
      "estimatedTime": "\u9884\u8BA1\u65F6\u95F4",
      "initMessage": '\u70B9\u51FB"\u4E0A\u4F20\u56FE\u50CF"\u5F00\u59CB',
      "waitingInit": "\u6B63\u5728\u7B49\u5F85\u521D\u59CB\u5316...",
      "initializingToken": "\u{1F527} \u6B63\u5728\u521D\u59CB\u5316 Turnstile \u4EE4\u724C\u751F\u6210\u5668...",
      "tokenReady": "\u2705 \u4EE4\u724C\u751F\u6210\u5668\u5DF2\u5C31\u7EEA - \u53EF\u4EE5\u5F00\u59CB\u7ED8\u5236\uFF01",
      "tokenRetryLater": "\u26A0\uFE0F \u4EE4\u724C\u751F\u6210\u5668\u7A0D\u540E\u5C06\u91CD\u8BD5",
      "resizeSuccess": "\u2705 \u56FE\u50CF\u5DF2\u8C03\u6574\u4E3A {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F \u5728\u4F4D\u7F6E X: {x}, Y: {y} \u6682\u505C",
      "captchaNeeded": "\u2757 \u4EE4\u724C\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002",
      "saveData": "\u4FDD\u5B58\u8FDB\u5EA6",
      "loadData": "\u52A0\u8F7D\u8FDB\u5EA6",
      "saveToFile": "\u4FDD\u5B58\u5230\u6587\u4EF6",
      "loadFromFile": "\u4ECE\u6587\u4EF6\u52A0\u8F7D",
      "dataManager": "\u6570\u636E\u7BA1\u7406",
      "autoSaved": "\u2705 \u8FDB\u5EA6\u5DF2\u81EA\u52A8\u4FDD\u5B58",
      "dataLoaded": "\u2705 \u8FDB\u5EA6\u52A0\u8F7D\u6210\u529F",
      "fileSaved": "\u2705 \u5DF2\u6210\u529F\u4FDD\u5B58\u5230\u6587\u4EF6",
      "fileLoaded": "\u2705 \u5DF2\u6210\u529F\u4ECE\u6587\u4EF6\u52A0\u8F7D",
      "noSavedData": "\u274C \u672A\u627E\u5230\u5DF2\u4FDD\u5B58\u8FDB\u5EA6",
      "savedDataFound": "\u2705 \u627E\u5230\u5DF2\u4FDD\u5B58\u8FDB\u5EA6\uFF01\u662F\u5426\u52A0\u8F7D\u7EE7\u7EED\uFF1F",
      "savedDate": "\u4FDD\u5B58\u65F6\u95F4: {date}",
      "clickLoadToContinue": '\u70B9\u51FB"\u52A0\u8F7D\u8FDB\u5EA6"\u7EE7\u7EED\u3002',
      "fileError": "\u274C \u5904\u7406\u6587\u4EF6\u65F6\u51FA\u9519",
      "invalidFileFormat": "\u274C \u6587\u4EF6\u683C\u5F0F\u65E0\u6548",
      "paintingSpeed": "\u7ED8\u5236\u901F\u5EA6",
      "pixelsPerSecond": "\u50CF\u7D20/\u79D2",
      "speedSetting": "\u901F\u5EA6: {speed} \u50CF\u7D20/\u79D2",
      "settings": "\u8BBE\u7F6E",
      "botSettings": "\u673A\u5668\u4EBA\u8BBE\u7F6E",
      "close": "\u5173\u95ED",
      "language": "\u8BED\u8A00",
      "themeSettings": "\u4E3B\u9898\u8BBE\u7F6E",
      "themeSettingsDesc": "\u4E3A\u754C\u9762\u9009\u62E9\u4F60\u559C\u6B22\u7684\u914D\u8272\u4E3B\u9898\u3002",
      "languageSelectDesc": "\u9009\u62E9\u4F60\u504F\u597D\u7684\u8BED\u8A00\uFF0C\u53D8\u66F4\u7ACB\u5373\u751F\u6548\u3002",
      "autoCaptcha": "\u81EA\u52A8 CAPTCHA \u89E3\u51B3",
      "autoCaptchaDesc": "\u4F7F\u7528\u96C6\u6210\u7684\u751F\u6210\u5668\u81EA\u52A8\u751F\u6210 Turnstile \u4EE4\u724C\uFF0C\u5FC5\u8981\u65F6\u56DE\u9000\u5230\u6D4F\u89C8\u5668\u81EA\u52A8\u5316\u3002",
      "applySettings": "\u5E94\u7528\u8BBE\u7F6E",
      "settingsSaved": "\u2705 \u8BBE\u7F6E\u4FDD\u5B58\u6210\u529F\uFF01",
      "speedOn": "\u5F00\u542F",
      "speedOff": "\u5173\u95ED",
      "cooldownSettings": "\u51B7\u5374\u8BBE\u7F6E",
      "waitCharges": "\u7B49\u5F85\u6B21\u6570\u8FBE\u5230",
      "captchaSolving": "\u{1F511} \u6B63\u5728\u751F\u6210 Turnstile \u4EE4\u724C...",
      "captchaFailed": "\u274C \u4EE4\u724C\u751F\u6210\u5931\u8D25\u3002\u5C1D\u8BD5\u56DE\u9000\u65B9\u6CD5...",
      "automation": "\u81EA\u52A8\u5316",
      "noChargesThreshold": "\u231B \u7B49\u5F85\u6B21\u6570\u8FBE\u5230 {threshold}\u3002\u5F53\u524D {current}\u3002\u4E0B\u6B21\u5728 {time}...",
      "tokenCapturedSuccess": "\u4EE4\u724C\u6355\u83B7\u6210\u529F\uFF01\u73B0\u5728\u53EF\u4EE5\u542F\u52A8\u673A\u5668\u4EBA\u3002",
      "notificationsNotSupported": "\u6B64\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u901A\u77E5\u3002",
      "chargesReadyNotification": "WPlace \u2014 \u6B21\u6570\u5C31\u7EEA",
      "chargesReadyMessage": "\u6B21\u6570\u5C31\u7EEA\uFF1A{current} / {max}\u3002\u9608\u503C\uFF1A{threshold}\u3002",
      "testNotificationTitle": "WPlace \u2014 \u6D4B\u8BD5",
      "testNotificationMessage": "\u8FD9\u662F\u4E00\u4E2A\u6D4B\u8BD5\u901A\u77E5\u3002",
      "showStats": "\u663E\u793A\u7EDF\u8BA1",
      "compactMode": "\u7D27\u51D1\u6A21\u5F0F",
      "refreshCharges": "\u5237\u65B0\u6B21\u6570",
      "closeStats": "\u5173\u95ED\u7EDF\u8BA1",
      "zoomOut": "\u7F29\u5C0F",
      "zoomIn": "\u653E\u5927",
      "fitToView": "\u9002\u5408\u7A97\u53E3",
      "actualSize": "\u5B9E\u9645\u5927\u5C0F (100%)",
      "panMode": "\u5E73\u79FB\uFF08\u62D6\u52A8\u79FB\u52A8\u89C6\u56FE\uFF09",
      "clearIgnoredPixels": "\u6E05\u9664\u6240\u6709\u5FFD\u7565\u7684\u50CF\u7D20",
      "invertMask": "\u53CD\u8F6C\u8499\u7248",
      "waitingSetupComplete": "\u{1F504} \u7B49\u5F85\u521D\u59CB\u8BBE\u7F6E\u5B8C\u6210...",
      "waitingTokenGenerator": "\u{1F504} \u7B49\u5F85\u4EE4\u724C\u751F\u6210\u5668\u521D\u59CB\u5316...",
      "uploadImageFirst": "\u8BF7\u5148\u4E0A\u4F20\u56FE\u50CF\u4EE5\u83B7\u53D6\u53EF\u7528\u989C\u8272",
      "pleaseWaitInitialSetup": "\u{1F504} \u8BF7\u7B49\u5F85\u521D\u59CB\u8BBE\u7F6E\u5B8C\u6210\u540E\u518D\u52A0\u8F7D\u8FDB\u5EA6\u3002",
      "pleaseWaitFileSetup": "\u{1F504} \u8BF7\u7B49\u5F85\u521D\u59CB\u8BBE\u7F6E\u5B8C\u6210\u540E\u518D\u4ECE\u6587\u4EF6\u52A0\u8F7D\u3002",
      "errorSavingProgress": "\u274C \u4FDD\u5B58\u8FDB\u5EA6\u65F6\u51FA\u9519",
      "errorLoadingProgress": "\u274C \u52A0\u8F7D\u8FDB\u5EA6\u65F6\u51FA\u9519",
      "fileOperationsAvailable": "\u{1F4C2} \u6587\u4EF6\u64CD\u4F5C\uFF08\u52A0\u8F7D/\u4E0A\u4F20\uFF09\u73B0\u5DF2\u53EF\u7528\uFF01",
      "tokenGeneratorReady": "\u{1F511} \u4EE4\u724C\u751F\u6210\u5668\u51C6\u5907\u5C31\u7EEA\uFF01",
      "paintingStats": "\u7ED8\u5236\u7EDF\u8BA1",
      "enablePaintingSpeedLimit": "\u542F\u7528\u7ED8\u5236\u901F\u5EA6\u9650\u5236\uFF08\u6279\u6B21\u5927\u5C0F\u63A7\u5236\uFF09",
      "enableNotifications": "\u542F\u7528\u901A\u77E5",
      "notifyOnChargesThreshold": "\u6B21\u6570\u8FBE\u5230\u9608\u503C\u65F6\u901A\u77E5",
      "onlyWhenNotFocused": "\u4EC5\u5728\u6807\u7B7E\u9875\u672A\u805A\u7126\u65F6",
      "repeatEvery": "\u91CD\u590D\u95F4\u9694",
      "minutesPl": "\u5206\u949F",
      "grantPermission": "\u6388\u4E88\u6743\u9650",
      "test": "\u6D4B\u8BD5",
      "showAllColorsIncluding": "\u663E\u793A\u6240\u6709\u989C\u8272\uFF08\u5305\u62EC\u4E0D\u53EF\u7528\uFF09",
      "chromaWeight": "\u8272\u5EA6\u6743\u91CD",
      "downloadPreview": "\u4E0B\u8F7D\u9884\u89C8",
      "apply": "\u5E94\u7528",
      "cancel": "\u53D6\u6D88",
      "fit": "\u9002\u5408",
      "hundred": "100%",
      "clear": "\u6E05\u9664",
      "invert": "\u53CD\u8F6C",
      "reprocessingOverlay": "\u91CD\u65B0\u5904\u7406\u8986\u76D6\u5C42...",
      "overlayUpdated": "\u8986\u76D6\u5C42\u5DF2\u66F4\u65B0\uFF01",
      "notificationsEnabled": "\u5DF2\u542F\u7528\u901A\u77E5\u3002",
      "notificationsPermissionDenied": "\u901A\u77E5\u6743\u9650\u88AB\u62D2\u7EDD\u3002",
      "overlayEnabled": "\u5DF2\u542F\u7528\u8986\u76D6\u5C42\u3002",
      "overlayDisabled": "\u5DF2\u7981\u7528\u8986\u76D6\u5C42\u3002",
      "tokenSourceSet": "\u4EE4\u724C\u6E90\u8BBE\u7F6E\u4E3A\uFF1A{source}",
      "batchModeSet": "\u6279\u6B21\u6A21\u5F0F\u8BBE\u7F6E\u4E3A\uFF1A{mode}",
      "randomRange": "\u968F\u673A\u8303\u56F4",
      "normalFixedSize": "\u6B63\u5E38\u56FA\u5B9A\u5927\u5C0F",
      "advancedColorSettingsReset": "\u5DF2\u91CD\u7F6E\u9AD8\u7EA7\u989C\u8272\u8BBE\u7F6E\u3002",
      "shiftRowAltColumn": "Shift = \u884C \u2022 Alt = \u5217",
      "hideTurnstileBtn": "\u9690\u85CF",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 \u5982\u6709\u663E\u793A\u8BF7\u5B8C\u6210\u9A8C\u8BC1",
      "uploadImageFirstColors": "\u8BF7\u5148\u4E0A\u4F20\u56FE\u50CF\u4EE5\u83B7\u53D6\u53EF\u7528\u989C\u8272",
      "availableColors": "\u53EF\u7528\u989C\u8272 ({count})",
      "colorTooltip": "ID\uFF1A{id}\nRGB\uFF1A{rgb}",
      "expandMode": "\u5C55\u5F00\u6A21\u5F0F",
      "minimize": "\u6700\u5C0F\u5316",
      "restore": "\u6062\u590D",
      "hideStats": "\u9690\u85CF\u7EDF\u8BA1",
      "paintOptions": "\u7ED8\u56FE\u9009\u9879",
      "paintWhitePixels": "\u7ED8\u5236\u767D\u8272\u50CF\u7D20",
      "paintTransparentPixels": "\u7ED8\u5236\u900F\u660E\u50CF\u7D20"
    },
    "zh-TW": {
      "title": "WPlace \u81EA\u52D5\u5716\u50CF",
      "toggleOverlay": "\u5207\u63DB\u8986\u84CB\u5C64",
      "scanColors": "\u6383\u63CF\u984F\u8272",
      "uploadImage": "\u4E0A\u50B3\u5716\u50CF",
      "resizeImage": "\u8ABF\u6574\u5927\u5C0F",
      "selectPosition": "\u9078\u64C7\u4F4D\u7F6E",
      "startPainting": "\u958B\u59CB\u7E6A\u88FD",
      "stopPainting": "\u505C\u6B62\u7E6A\u88FD",
      "checkingColors": "\u{1F50D} \u6B63\u5728\u6AA2\u67E5\u53EF\u7528\u984F\u8272...",
      "noColorsFound": "\u274C \u8ACB\u5728\u7DB2\u7AD9\u4E0A\u6253\u958B\u8ABF\u8272\u677F\u5F8C\u518D\u8A66\uFF01",
      "colorsFound": "\u2705 \u627E\u5230 {count} \u500B\u53EF\u7528\u984F\u8272\uFF0C\u6E96\u5099\u4E0A\u50B3\u3002",
      "loadingImage": "\u{1F5BC}\uFE0F \u6B63\u5728\u8F09\u5165\u5716\u50CF...",
      "imageLoaded": "\u2705 \u5716\u50CF\u5DF2\u8F09\u5165\uFF0C\u5305\u542B {count} \u500B\u6709\u6548\u50CF\u7D20",
      "imageError": "\u274C \u8F09\u5165\u5716\u50CF\u6642\u51FA\u932F",
      "selectPositionAlert": "\u8ACB\u5728\u4F60\u60F3\u8B93\u4F5C\u54C1\u958B\u59CB\u7684\u4F4D\u7F6E\u7E6A\u88FD\u7B2C\u4E00\u500B\u50CF\u7D20\uFF01",
      "waitingPosition": "\u{1F446} \u6B63\u5728\u7B49\u5F85\u4F60\u7E6A\u88FD\u53C3\u8003\u50CF\u7D20...",
      "positionSet": "\u2705 \u4F4D\u7F6E\u8A2D\u5B9A\u6210\u529F\uFF01",
      "positionTimeout": "\u274C \u9078\u64C7\u4F4D\u7F6E\u903E\u6642",
      "startPaintingMsg": "\u{1F3A8} \u958B\u59CB\u7E6A\u88FD...",
      "paintingProgress": "\u{1F9F1} \u9032\u5EA6: {painted}/{total} \u50CF\u7D20...",
      "noCharges": "\u231B \u7121\u53EF\u7528\u6B21\u6578\uFF0C\u7B49\u5F85 {time}...",
      "paintingStopped": "\u23F9\uFE0F \u5DF2\u88AB\u4F7F\u7528\u8005\u505C\u6B62",
      "paintingComplete": "\u2705 \u7E6A\u88FD\u5B8C\u6210\uFF01\u5171\u7E6A\u88FD {count} \u500B\u50CF\u7D20\u3002",
      "paintingError": "\u274C \u7E6A\u88FD\u904E\u7A0B\u4E2D\u51FA\u932F",
      "missingRequirements": "\u274C \u8ACB\u5148\u8F09\u5165\u5716\u50CF\u4E26\u9078\u64C7\u4F4D\u7F6E",
      "progress": "\u9032\u5EA6",
      "pixels": "\u50CF\u7D20",
      "charges": "\u6B21\u6578",
      "estimatedTime": "\u9810\u8A08\u6642\u9593",
      "initMessage": "\u9EDE\u64CA\u300C\u4E0A\u50B3\u5716\u50CF\u300D\u958B\u59CB",
      "waitingInit": "\u6B63\u5728\u7B49\u5F85\u521D\u59CB\u5316...",
      "initializingToken": "\u{1F527} \u6B63\u5728\u521D\u59CB\u5316 Turnstile \u4EE4\u724C\u7522\u751F\u5668...",
      "tokenReady": "\u2705 \u4EE4\u724C\u7522\u751F\u5668\u5DF2\u5C31\u7DD2 - \u53EF\u4EE5\u958B\u59CB\u7E6A\u88FD\uFF01",
      "tokenRetryLater": "\u26A0\uFE0F \u4EE4\u724C\u7522\u751F\u5668\u7A0D\u5F8C\u5C07\u91CD\u8A66",
      "resizeSuccess": "\u2705 \u5716\u50CF\u5DF2\u8ABF\u6574\u70BA {width}x{height}",
      "paintingPaused": "\u23F8\uFE0F \u5728\u4F4D\u7F6E X: {x}, Y: {y} \u66AB\u505C",
      "captchaNeeded": "\u2757 \u4EE4\u724C\u7522\u751F\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66\u3002",
      "saveData": "\u5132\u5B58\u9032\u5EA6",
      "loadData": "\u8F09\u5165\u9032\u5EA6",
      "saveToFile": "\u5132\u5B58\u81F3\u6A94\u6848",
      "loadFromFile": "\u5F9E\u6A94\u6848\u8F09\u5165",
      "dataManager": "\u8CC7\u6599\u7BA1\u7406",
      "autoSaved": "\u2705 \u9032\u5EA6\u5DF2\u81EA\u52D5\u5132\u5B58",
      "dataLoaded": "\u2705 \u9032\u5EA6\u8F09\u5165\u6210\u529F",
      "fileSaved": "\u2705 \u5DF2\u6210\u529F\u5132\u5B58\u81F3\u6A94\u6848",
      "fileLoaded": "\u2705 \u5DF2\u6210\u529F\u5F9E\u6A94\u6848\u8F09\u5165",
      "noSavedData": "\u274C \u672A\u627E\u5230\u5DF2\u5132\u5B58\u9032\u5EA6",
      "savedDataFound": "\u2705 \u627E\u5230\u5DF2\u5132\u5B58\u9032\u5EA6\uFF01\u662F\u5426\u8F09\u5165\u4EE5\u7E7C\u7E8C\uFF1F",
      "savedDate": "\u5132\u5B58\u6642\u9593: {date}",
      "clickLoadToContinue": "\u9EDE\u64CA\u300C\u8F09\u5165\u9032\u5EA6\u300D\u7E7C\u7E8C\u3002",
      "fileError": "\u274C \u8655\u7406\u6A94\u6848\u6642\u51FA\u932F",
      "invalidFileFormat": "\u274C \u6A94\u6848\u683C\u5F0F\u7121\u6548",
      "paintingSpeed": "\u7E6A\u88FD\u901F\u5EA6",
      "pixelsPerSecond": "\u50CF\u7D20/\u79D2",
      "speedSetting": "\u901F\u5EA6: {speed} \u50CF\u7D20/\u79D2",
      "settings": "\u8A2D\u5B9A",
      "botSettings": "\u6A5F\u5668\u4EBA\u8A2D\u5B9A",
      "close": "\u95DC\u9589",
      "language": "\u8A9E\u8A00",
      "themeSettings": "\u4E3B\u984C\u8A2D\u5B9A",
      "themeSettingsDesc": "\u70BA\u4ECB\u9762\u9078\u64C7\u4F60\u559C\u6B61\u7684\u914D\u8272\u4E3B\u984C\u3002",
      "languageSelectDesc": "\u9078\u64C7\u4F60\u504F\u597D\u7684\u8A9E\u8A00\uFF0C\u8B8A\u66F4\u7ACB\u5373\u751F\u6548\u3002",
      "autoCaptcha": "\u81EA\u52D5 CAPTCHA \u89E3\u6C7A",
      "autoCaptchaDesc": "\u4F7F\u7528\u6574\u5408\u7684\u7522\u751F\u5668\u81EA\u52D5\u7522\u751F Turnstile \u4EE4\u724C\uFF0C\u5FC5\u8981\u6642\u56DE\u9000\u5230\u700F\u89BD\u5668\u81EA\u52D5\u5316\u3002",
      "applySettings": "\u5957\u7528\u8A2D\u5B9A",
      "settingsSaved": "\u2705 \u8A2D\u5B9A\u5132\u5B58\u6210\u529F\uFF01",
      "speedOn": "\u958B\u555F",
      "speedOff": "\u95DC\u9589",
      "cooldownSettings": "\u51B7\u537B\u8A2D\u5B9A",
      "waitCharges": "\u7B49\u5F85\u6B21\u6578\u9054\u5230",
      "captchaSolving": "\u{1F511} \u6B63\u5728\u7522\u751F Turnstile \u4EE4\u724C...",
      "captchaFailed": "\u274C \u4EE4\u724C\u7522\u751F\u5931\u6557\u3002\u5617\u8A66\u56DE\u9000\u65B9\u6CD5...",
      "automation": "\u81EA\u52D5\u5316",
      "noChargesThreshold": "\u231B \u7B49\u5F85\u6B21\u6578\u9054\u5230 {threshold}\u3002\u76EE\u524D {current}\u3002\u4E0B\u6B21\u5728 {time}...",
      "tokenCapturedSuccess": "\u4EE4\u724C\u6355\u7372\u6210\u529F\uFF01\u73FE\u5728\u53EF\u4EE5\u555F\u52D5\u6A5F\u5668\u4EBA\u3002",
      "notificationsNotSupported": "\u6B64\u700F\u89BD\u5668\u4E0D\u652F\u6301\u901A\u77E5\u3002",
      "chargesReadyNotification": "WPlace \u2014 \u6B21\u6578\u5C31\u7DD2",
      "chargesReadyMessage": "\u6B21\u6578\u5C31\u7DD2\uFF1A{current} / {max}\u3002\u95BE\u503C\uFF1A{threshold}\u3002",
      "testNotificationTitle": "WPlace \u2014 \u6E2C\u8A66",
      "testNotificationMessage": "\u9019\u662F\u4E00\u500B\u6E2C\u8A66\u901A\u77E5\u3002",
      "showStats": "\u986F\u793A\u7D71\u8A08",
      "compactMode": "\u7DCA\u51D1\u6A21\u5F0F",
      "refreshCharges": "\u5237\u65B0\u6B21\u6578",
      "closeStats": "\u95DC\u9589\u7D71\u8A08",
      "zoomOut": "\u7E2E\u5C0F",
      "zoomIn": "\u653E\u5927",
      "fitToView": "\u9069\u5408\u8996\u7A97",
      "actualSize": "\u5BE6\u969B\u5927\u5C0F (100%)",
      "panMode": "\u5E73\u79FB\uFF08\u62D6\u62C9\u79FB\u52D5\u8996\u5716\uFF09",
      "clearIgnoredPixels": "\u6E05\u9664\u6240\u6709\u5FFD\u7565\u7684\u50CF\u7D20",
      "invertMask": "\u53CD\u8F49\u906E\u7F69",
      "waitingSetupComplete": "\u{1F504} \u7B49\u5F85\u521D\u59CB\u8A2D\u5B9A\u5B8C\u6210...",
      "waitingTokenGenerator": "\u{1F504} \u7B49\u5F85\u4EE4\u724C\u7522\u751F\u5668\u521D\u59CB\u5316...",
      "uploadImageFirst": "\u8ACB\u5148\u4E0A\u50B3\u5716\u50CF\u4EE5\u7372\u53D6\u53EF\u7528\u984F\u8272",
      "pleaseWaitInitialSetup": "\u{1F504} \u8ACB\u7B49\u5F85\u521D\u59CB\u8A2D\u5B9A\u5B8C\u6210\u5F8C\u518D\u8F09\u5165\u9032\u5EA6\u3002",
      "pleaseWaitFileSetup": "\u{1F504} \u8ACB\u7B49\u5F85\u521D\u59CB\u8A2D\u5B9A\u5B8C\u6210\u5F8C\u518D\u5F9E\u6A94\u6848\u8F09\u5165\u3002",
      "errorSavingProgress": "\u274C \u5132\u5B58\u9032\u5EA6\u6642\u51FA\u932F",
      "errorLoadingProgress": "\u274C \u8F09\u5165\u9032\u5EA6\u6642\u51FA\u932F",
      "fileOperationsAvailable": "\u{1F4C2} \u6A94\u6848\u64CD\u4F5C\uFF08\u8F09\u5165/\u4E0A\u50B3\uFF09\u73FE\u5DF2\u53EF\u7528\uFF01",
      "tokenGeneratorReady": "\u{1F511} \u4EE4\u724C\u7522\u751F\u5668\u6E96\u5099\u5C31\u7DD2\uFF01",
      "paintingStats": "\u7E6A\u5236\u7D71\u8A08",
      "enablePaintingSpeedLimit": "\u555F\u7528\u7E6A\u5236\u901F\u5EA6\u9650\u5236\uFF08\u6279\u6B21\u5927\u5C0F\u63A7\u5236\uFF09",
      "enableNotifications": "\u555F\u7528\u901A\u77E5",
      "notifyOnChargesThreshold": "\u6B21\u6578\u9054\u5230\u95FE\u503C\u6642\u901A\u77E5",
      "onlyWhenNotFocused": "\u50C5\u5728\u6A19\u7C64\u9801\u672A\u805A\u7126\u6642",
      "repeatEvery": "\u91CD\u8907\u9593\u9694",
      "minutesPl": "\u5206\u9418",
      "grantPermission": "\u6388\u4E88\u6B0A\u9650",
      "test": "\u6E2C\u8A66",
      "showAllColorsIncluding": "\u986F\u793A\u6240\u6709\u984F\u8272\uFF08\u5305\u62EC\u4E0D\u53EF\u7528\uFF09",
      "chromaWeight": "\u8272\u5EA6\u6B0A\u91CD",
      "downloadPreview": "\u4E0B\u8F09\u9810\u89BD",
      "apply": "\u5957\u7528",
      "cancel": "\u53D6\u6D88",
      "fit": "\u9069\u5408",
      "hundred": "100%",
      "clear": "\u6E05\u9664",
      "invert": "\u53CD\u8F49",
      "reprocessingOverlay": "\u91CD\u65B0\u8655\u7406\u8986\u84CB\u5C64...",
      "overlayUpdated": "\u8986\u84CB\u5C64\u5DF2\u66F4\u65B0\uFF01",
      "notificationsEnabled": "\u5DF2\u555F\u7528\u901A\u77E5\u3002",
      "notificationsPermissionDenied": "\u901A\u77E5\u6B0A\u9650\u88AB\u62D2\u7D55\u3002",
      "overlayEnabled": "\u5DF2\u555F\u7528\u8986\u84CB\u5C64\u3002",
      "overlayDisabled": "\u5DF2\u7981\u7528\u8986\u84CB\u5C64\u3002",
      "tokenSourceSet": "\u4EE4\u724C\u4F86\u6E90\u8A2D\u5B9A\u70BA\uFF1A{source}",
      "batchModeSet": "\u6279\u6B21\u6A21\u5F0F\u8A2D\u5B9A\u70BA\uFF1A{mode}",
      "randomRange": "\u96A8\u6A5F\u7BC4\u570D",
      "normalFixedSize": "\u6B63\u5E38\u56FA\u5B9A\u5927\u5C0F",
      "advancedColorSettingsReset": "\u5DF2\u91CD\u7F6E\u9032\u968E\u984F\u8272\u8A2D\u5B9A\u3002",
      "shiftRowAltColumn": "Shift = \u5217 \u2022 Alt = \u884C",
      "hideTurnstileBtn": "\u96B1\u85CF",
      "turnstileInstructions": "Cloudflare Turnstile \u2014 \u5982\u6709\u986F\u793A\u8ACB\u5B8C\u6210\u9A57\u8B49",
      "uploadImageFirstColors": "\u8ACB\u5148\u4E0A\u50B3\u5716\u50CF\u4EE5\u7372\u53D6\u53EF\u7528\u984F\u8272",
      "availableColors": "\u53EF\u7528\u984F\u8272 ({count})",
      "colorTooltip": "ID\uFF1A{id}\nRGB\uFF1A{rgb}",
      "expandMode": "\u5C55\u958B\u6A21\u5F0F",
      "minimize": "\u6700\u5C0F\u5316",
      "restore": "\u6062\u5FA9",
      "hideStats": "\u96B1\u85CF\u7D71\u8A08",
      "paintOptions": "\u7E6A\u5716\u9078\u9805",
      "paintWhitePixels": "\u7E6A\u88FD\u767D\u8272\u50CF\u7D20",
      "paintTransparentPixels": "\u7E6A\u88FD\u900F\u660E\u50CF\u7D20"
    }
  };

  // src/Auto-Image.js
  (async () => {
    const CONFIG = {
      COOLDOWN_DEFAULT: 31e3,
      TRANSPARENCY_THRESHOLD: 100,
      WHITE_THRESHOLD: 250,
      LOG_INTERVAL: 10,
      PAINTING_SPEED: {
        MIN: 1,
        // Minimum 1 pixel batch size
        MAX: 1e3,
        // Maximum 1000 pixels batch size
        DEFAULT: 5
        // Default 5 pixels batch size
      },
      BATCH_MODE: "normal",
      // "normal" or "random" - default to normal
      RANDOM_BATCH_RANGE: {
        MIN: 3,
        // Random range minimum
        MAX: 20
        // Random range maximum
      },
      PAINTING_SPEED_ENABLED: false,
      // On by default
      AUTO_CAPTCHA_ENABLED: true,
      // Turnstile generator enabled by default
      TOKEN_SOURCE: "generator",
      // "generator", "manual", or "hybrid" - default to generator
      COOLDOWN_CHARGE_THRESHOLD: 1,
      // Default wait threshold
      // Desktop Notifications (defaults)
      NOTIFICATIONS: {
        ENABLED: false,
        ON_CHARGES_REACHED: true,
        ONLY_WHEN_UNFOCUSED: true,
        REPEAT_MINUTES: 5
        // repeat reminder while threshold condition holds
      },
      OVERLAY: {
        OPACITY_DEFAULT: 0.2,
        BLUE_MARBLE_DEFAULT: false,
        ditheringEnabled: false
      },
      // --- START: Color data from colour-converter.js ---
      // New color structure with proper ID mapping
      COLOR_MAP: {
        0: { id: 1, name: "Black", rgb: { r: 0, g: 0, b: 0 } },
        1: { id: 2, name: "Dark Gray", rgb: { r: 60, g: 60, b: 60 } },
        2: { id: 3, name: "Gray", rgb: { r: 120, g: 120, b: 120 } },
        3: { id: 4, name: "Light Gray", rgb: { r: 210, g: 210, b: 210 } },
        4: { id: 5, name: "White", rgb: { r: 255, g: 255, b: 255 } },
        5: { id: 6, name: "Deep Red", rgb: { r: 96, g: 0, b: 24 } },
        6: { id: 7, name: "Red", rgb: { r: 237, g: 28, b: 36 } },
        7: { id: 8, name: "Orange", rgb: { r: 255, g: 127, b: 39 } },
        8: { id: 9, name: "Gold", rgb: { r: 246, g: 170, b: 9 } },
        9: { id: 10, name: "Yellow", rgb: { r: 249, g: 221, b: 59 } },
        10: { id: 11, name: "Light Yellow", rgb: { r: 255, g: 250, b: 188 } },
        11: { id: 12, name: "Dark Green", rgb: { r: 14, g: 185, b: 104 } },
        12: { id: 13, name: "Green", rgb: { r: 19, g: 230, b: 123 } },
        13: { id: 14, name: "Light Green", rgb: { r: 135, g: 255, b: 94 } },
        14: { id: 15, name: "Dark Teal", rgb: { r: 12, g: 129, b: 110 } },
        15: { id: 16, name: "Teal", rgb: { r: 16, g: 174, b: 166 } },
        16: { id: 17, name: "Light Teal", rgb: { r: 19, g: 225, b: 190 } },
        17: { id: 20, name: "Cyan", rgb: { r: 96, g: 247, b: 242 } },
        18: { id: 44, name: "Light Cyan", rgb: { r: 187, g: 250, b: 242 } },
        19: { id: 18, name: "Dark Blue", rgb: { r: 40, g: 80, b: 158 } },
        20: { id: 19, name: "Blue", rgb: { r: 64, g: 147, b: 228 } },
        21: { id: 21, name: "Indigo", rgb: { r: 107, g: 80, b: 246 } },
        22: { id: 22, name: "Light Indigo", rgb: { r: 153, g: 177, b: 251 } },
        23: { id: 23, name: "Dark Purple", rgb: { r: 120, g: 12, b: 153 } },
        24: { id: 24, name: "Purple", rgb: { r: 170, g: 56, b: 185 } },
        25: { id: 25, name: "Light Purple", rgb: { r: 224, g: 159, b: 249 } },
        26: { id: 26, name: "Dark Pink", rgb: { r: 203, g: 0, b: 122 } },
        27: { id: 27, name: "Pink", rgb: { r: 236, g: 31, b: 128 } },
        28: { id: 28, name: "Light Pink", rgb: { r: 243, g: 141, b: 169 } },
        29: { id: 29, name: "Dark Brown", rgb: { r: 104, g: 70, b: 52 } },
        30: { id: 30, name: "Brown", rgb: { r: 149, g: 104, b: 42 } },
        31: { id: 31, name: "Beige", rgb: { r: 248, g: 178, b: 119 } },
        32: { id: 52, name: "Light Beige", rgb: { r: 255, g: 197, b: 165 } },
        33: { id: 32, name: "Medium Gray", rgb: { r: 170, g: 170, b: 170 } },
        34: { id: 33, name: "Dark Red", rgb: { r: 165, g: 14, b: 30 } },
        35: { id: 34, name: "Light Red", rgb: { r: 250, g: 128, b: 114 } },
        36: { id: 35, name: "Dark Orange", rgb: { r: 228, g: 92, b: 26 } },
        37: { id: 37, name: "Dark Goldenrod", rgb: { r: 156, g: 132, b: 49 } },
        38: { id: 38, name: "Goldenrod", rgb: { r: 197, g: 173, b: 49 } },
        39: { id: 39, name: "Light Goldenrod", rgb: { r: 232, g: 212, b: 95 } },
        40: { id: 40, name: "Dark Olive", rgb: { r: 74, g: 107, b: 58 } },
        41: { id: 41, name: "Olive", rgb: { r: 90, g: 148, b: 74 } },
        42: { id: 42, name: "Light Olive", rgb: { r: 132, g: 197, b: 115 } },
        43: { id: 43, name: "Dark Cyan", rgb: { r: 15, g: 121, b: 159 } },
        44: { id: 45, name: "Light Blue", rgb: { r: 125, g: 199, b: 255 } },
        45: { id: 46, name: "Dark Indigo", rgb: { r: 77, g: 49, b: 184 } },
        46: { id: 47, name: "Dark Slate Blue", rgb: { r: 74, g: 66, b: 132 } },
        47: { id: 48, name: "Slate Blue", rgb: { r: 122, g: 113, b: 196 } },
        48: { id: 49, name: "Light Slate Blue", rgb: { r: 181, g: 174, b: 241 } },
        49: { id: 53, name: "Dark Peach", rgb: { r: 155, g: 82, b: 73 } },
        50: { id: 54, name: "Peach", rgb: { r: 209, g: 128, b: 120 } },
        51: { id: 55, name: "Light Peach", rgb: { r: 250, g: 182, b: 164 } },
        52: { id: 50, name: "Light Brown", rgb: { r: 219, g: 164, b: 99 } },
        53: { id: 56, name: "Dark Tan", rgb: { r: 123, g: 99, b: 82 } },
        54: { id: 57, name: "Tan", rgb: { r: 156, g: 132, b: 107 } },
        55: { id: 36, name: "Light Tan", rgb: { r: 214, g: 181, b: 148 } },
        56: { id: 51, name: "Dark Beige", rgb: { r: 209, g: 128, b: 81 } },
        57: { id: 61, name: "Dark Stone", rgb: { r: 109, g: 100, b: 63 } },
        58: { id: 62, name: "Stone", rgb: { r: 148, g: 140, b: 107 } },
        59: { id: 63, name: "Light Stone", rgb: { r: 205, g: 197, b: 158 } },
        60: { id: 58, name: "Dark Slate", rgb: { r: 51, g: 57, b: 65 } },
        61: { id: 59, name: "Slate", rgb: { r: 109, g: 117, b: 141 } },
        62: { id: 60, name: "Light Slate", rgb: { r: 179, g: 185, b: 209 } },
        63: { id: 0, name: "Transparent", rgb: null }
      },
      // --- END: Color data ---
      // CSS Classes moved to src/auto-image-styles.css
      THEMES: {
        "Classic Autobot": {
          primary: "#000000",
          secondary: "#111111",
          accent: "#222222",
          text: "#ffffff",
          highlight: "#775ce3",
          success: "#00ff00",
          error: "#ff0000",
          warning: "#ffaa00",
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          borderRadius: "12px",
          borderStyle: "solid",
          borderWidth: "1px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          animations: {
            glow: false,
            scanline: false,
            "pixel-blink": false
          }
        },
        "Classic Light": {
          primary: "#ffffff",
          secondary: "#f8f9fa",
          accent: "#e9ecef",
          text: "#212529",
          highlight: "#6f42c1",
          success: "#28a745",
          error: "#dc3545",
          warning: "#ffc107",
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          borderRadius: "12px",
          borderStyle: "solid",
          borderWidth: "1px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
          backdropFilter: "blur(10px)",
          animations: {
            glow: false,
            scanline: false,
            "pixel-blink": false
          }
        },
        "Neon Retro": {
          primary: "#1a1a2e",
          secondary: "#16213e",
          accent: "#0f3460",
          text: "#00ff41",
          highlight: "#ff6b35",
          success: "#39ff14",
          error: "#ff073a",
          warning: "#ffff00",
          neon: "#00ffff",
          purple: "#bf00ff",
          pink: "#ff1493",
          fontFamily: "'Press Start 2P', monospace",
          borderRadius: "0",
          borderStyle: "solid",
          borderWidth: "3px",
          boxShadow: "0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)",
          backdropFilter: "none",
          animations: {
            glow: true,
            scanline: true,
            "pixel-blink": true
          }
        }
      },
      currentTheme: "Classic Autobot",
      PAINT_UNAVAILABLE: true,
      COORDINATE_MODE: "rows",
      COORDINATE_DIRECTION: "bottom-left",
      COORDINATE_SNAKE: true,
      COORDINATE_BLOCK_WIDTH: 6,
      COORDINATE_BLOCK_HEIGHT: 2
    };
    const getCurrentTheme = () => CONFIG.THEMES[CONFIG.currentTheme];
    const getAvailableThemes = () => Object.keys(EMBEDDED_THEMES);
    const getCurrentThemeName = () => CONFIG.currentTheme;
    const switchTheme = (themeName) => {
      if (CONFIG.THEMES[themeName]) {
        CONFIG.currentTheme = themeName;
        saveThemePreference();
        applyTheme();
        createUI();
      }
    };
    function applyTheme() {
      const theme = getCurrentTheme();
      document.documentElement.classList.remove(
        "wplace-theme-classic",
        "wplace-theme-classic-light",
        "wplace-theme-neon"
      );
      const themeClassMapping = {
        "Classic Autobot": "wplace-theme-classic",
        "Classic Light": "wplace-theme-classic-light",
        "Neon Retro": "wplace-theme-neon"
      };
      const themeClass = themeClassMapping[CONFIG.currentTheme] || "wplace-theme-classic";
      document.documentElement.classList.add(themeClass);
      const existingThemeStyle = document.getElementById("wplace-theme-css");
      if (existingThemeStyle) {
        existingThemeStyle.remove();
      }
      const themeName = getCurrentThemeName();
      const themeFileMapping = {
        "Classic Autobot": "classic",
        "Classic Light": "classic-light",
        "Neon Retro": "neon"
      };
      const themeFileName = themeFileMapping[themeName] || "classic";
      if (EMBEDDED_THEMES[themeFileName]) {
        const style = document.createElement("style");
        style.id = "wplace-theme-css";
        style.textContent = EMBEDDED_THEMES[themeFileName];
        document.head.appendChild(style);
      }
      const root = document.documentElement;
      const setVar = (k, v) => {
        try {
          root.style.setProperty(k, v);
        } catch {
        }
      };
      setVar("--wplace-primary", theme.primary);
      setVar("--wplace-secondary", theme.secondary);
      setVar("--wplace-accent", theme.accent);
      setVar("--wplace-text", theme.text);
      setVar("--wplace-highlight", theme.highlight);
      setVar("--wplace-success", theme.success);
      setVar("--wplace-error", theme.error);
      setVar("--wplace-warning", theme.warning);
      setVar("--wplace-font", theme.fontFamily || "'Segoe UI', Roboto, sans-serif");
      setVar("--wplace-radius", "" + (theme.borderRadius || "12px"));
      setVar("--wplace-border-style", "" + (theme.borderStyle || "solid"));
      setVar("--wplace-border-width", "" + (theme.borderWidth || "1px"));
      setVar("--wplace-backdrop", "" + (theme.backdropFilter || "blur(10px)"));
      setVar("--wplace-border-color", "rgba(255,255,255,0.1)");
    }
    const saveThemePreference = () => {
      try {
        localStorage.setItem("wplace-theme", CONFIG.currentTheme);
      } catch (e) {
        console.warn("Could not save theme preference:", e);
      }
    };
    const loadThemePreference = () => {
      try {
        const saved = localStorage.getItem("wplace-theme");
        if (saved && CONFIG.THEMES[saved]) {
          CONFIG.currentTheme = saved;
        }
      } catch (e) {
        console.warn("Could not load theme preference:", e);
      }
    };
    const translationCache = /* @__PURE__ */ new Map();
    let loadedTranslations = {};
    const AVAILABLE_LANGUAGES = [
      "en",
      "ru",
      "pt",
      "vi",
      "fr",
      "id",
      "tr",
      "zh-CN",
      "zh-TW",
      "ja",
      "ko",
      "uk"
    ];
    const loadTranslations = async (language, retryCount2 = 0) => {
      if (loadedTranslations[language]) {
        return loadedTranslations[language];
      }
      if (EMBEDDED_LANGUAGES[language]) {
        const translations = EMBEDDED_LANGUAGES[language];
        if (typeof translations === "object" && translations !== null && Object.keys(translations).length > 0) {
          loadedTranslations[language] = translations;
          console.log(
            `\u{1F4DA} Loaded ${language} translations successfully from embedded assets (${Object.keys(translations).length} keys)`
          );
          return translations;
        } else {
          console.warn(`\u274C Invalid translation format for ${language}`);
        }
      } else {
        console.warn(`\u274C Language ${language} not found in embedded assets`);
      }
      return null;
    };
    const loadLanguagePreference = async () => {
      const savedLanguage = localStorage.getItem("wplace_language");
      const browserLocale = navigator.language;
      const browserLanguage = browserLocale.split("-")[0];
      let selectedLanguage = "en";
      try {
        if (savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage)) {
          selectedLanguage = savedLanguage;
          console.log(`\u{1F504} Using saved language preference: ${selectedLanguage}`);
        } else if (AVAILABLE_LANGUAGES.includes(browserLocale)) {
          selectedLanguage = browserLocale;
          localStorage.setItem("wplace_language", browserLocale);
          console.log(`\u{1F504} Using browser locale: ${selectedLanguage}`);
        } else if (AVAILABLE_LANGUAGES.includes(browserLanguage)) {
          selectedLanguage = browserLanguage;
          localStorage.setItem("wplace_language", browserLanguage);
          console.log(`\u{1F504} Using browser language: ${selectedLanguage}`);
        } else {
          console.log(`\u{1F504} No matching language found, using English fallback`);
        }
        state.language = selectedLanguage;
        if (selectedLanguage !== "en" && !loadedTranslations[selectedLanguage]) {
          const loaded = await loadTranslations(selectedLanguage);
          if (!loaded) {
            console.warn(
              `\u26A0\uFE0F Failed to load ${selectedLanguage} translations, falling back to English`
            );
            state.language = "en";
            localStorage.setItem("wplace_language", "en");
          }
        }
      } catch (error) {
        console.error(`\u274C Error in loadLanguagePreference:`, error);
        state.language = "en";
      }
    };
    const showTranslationWarning = (message) => {
      try {
        const warning = document.createElement("div");
        warning.className = "wplace-warning-banner";
        warning.textContent = message;
        document.body.appendChild(warning);
        setTimeout(() => {
          if (warning.parentNode) {
            warning.remove();
          }
        }, 8e3);
      } catch (e) {
        console.warn("Failed to show translation warning UI:", e);
      }
    };
    const initializeTranslations = async () => {
      try {
        console.log("\u{1F310} Initializing translation system...");
        if (!loadedTranslations["en"]) {
          const englishLoaded = await loadTranslations("en");
          if (!englishLoaded) {
            console.warn("\u26A0\uFE0F Failed to load English translations from CDN, using fallback");
            showTranslationWarning("\u26A0\uFE0F Translation loading failed, using basic fallbacks");
          }
        }
        await loadLanguagePreference();
        console.log(`\u2705 Translation system initialized. Active language: ${state.language}`);
      } catch (error) {
        console.error("\u274C Translation initialization failed:", error);
        if (!state.language) {
          state.language = "en";
        }
        console.warn("\u26A0\uFE0F Using fallback translations due to initialization failure");
        showTranslationWarning("\u26A0\uFE0F Translation system error, using basic English");
      }
    };
    const FALLBACK_TEXT = {
      en: {
        title: "WPlace Auto-Image",
        toggleOverlay: "Toggle Overlay",
        scanColors: "Scan Colors",
        uploadImage: "Upload Image",
        resizeImage: "Resize Image",
        selectPosition: "Select Position",
        startPainting: "Start Painting",
        stopPainting: "Stop Painting",
        progress: "Progress",
        pixels: "Pixels",
        charges: "Charges",
        batchSize: "Batch Size",
        initMessage: "Click 'Upload Image' to begin"
      }
    };
    const getText = (key, replacements = {}) => {
      var _a, _b, _c;
      let text = (_a = loadedTranslations[state.language]) == null ? void 0 : _a[key];
      if (!text && state.language !== "en") {
        text = (_b = loadedTranslations["en"]) == null ? void 0 : _b[key];
      }
      if (!text) {
        text = (_c = FALLBACK_TEXT["en"]) == null ? void 0 : _c[key];
      }
      if (!text) {
        console.warn(`\u26A0\uFE0F Missing translation for key: ${key}`);
        return key;
      }
      return Object.entries(replacements).reduce((result, [placeholder, value]) => {
        return result.replace(new RegExp(`\\{${placeholder}\\}`, "g"), value);
      }, text);
    };
    const state = {
      running: false,
      imageLoaded: false,
      processing: false,
      totalPixels: 0,
      paintedPixels: 0,
      availableColors: [],
      activeColorPalette: [],
      // User-selected colors for conversion
      paintWhitePixels: true,
      // Default to ON
      fullChargeData: null,
      fullChargeInterval: null,
      paintTransparentPixels: false,
      // Default to OFF
      displayCharges: 0,
      preciseCurrentCharges: 0,
      maxCharges: 1,
      // Default max charges
      cooldown: CONFIG.COOLDOWN_DEFAULT,
      imageData: null,
      stopFlag: false,
      colorsChecked: false,
      startPosition: null,
      selectingPosition: false,
      region: null,
      minimized: false,
      lastPosition: { x: 0, y: 0 },
      estimatedTime: 0,
      language: "en",
      paintingSpeed: CONFIG.PAINTING_SPEED.DEFAULT,
      // pixels batch size
      batchMode: CONFIG.BATCH_MODE,
      // "normal" or "random"
      randomBatchMin: CONFIG.RANDOM_BATCH_RANGE.MIN,
      // Random range minimum
      randomBatchMax: CONFIG.RANDOM_BATCH_RANGE.MAX,
      // Random range maximum
      cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
      chargesThresholdInterval: null,
      tokenSource: CONFIG.TOKEN_SOURCE,
      // "generator" or "manual"
      initialSetupComplete: false,
      // Track if initial startup setup is complete (only happens once)
      overlayOpacity: CONFIG.OVERLAY.OPACITY_DEFAULT,
      blueMarbleEnabled: CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT,
      ditheringEnabled: true,
      // Advanced color matching settings
      colorMatchingAlgorithm: "lab",
      enableChromaPenalty: true,
      chromaPenaltyWeight: 0.15,
      customTransparencyThreshold: CONFIG.TRANSPARENCY_THRESHOLD,
      customWhiteThreshold: CONFIG.WHITE_THRESHOLD,
      resizeSettings: null,
      originalImage: null,
      resizeIgnoreMask: null,
      paintUnavailablePixels: CONFIG.PAINT_UNAVAILABLE,
      // Coordinate generation settings
      coordinateMode: CONFIG.COORDINATE_MODE,
      coordinateDirection: CONFIG.COORDINATE_DIRECTION,
      coordinateSnake: CONFIG.COORDINATE_SNAKE,
      blockWidth: CONFIG.COORDINATE_BLOCK_WIDTH,
      blockHeight: CONFIG.COORDINATE_BLOCK_HEIGHT,
      notificationsEnabled: CONFIG.NOTIFICATIONS.ENABLED,
      notifyOnChargesReached: CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED,
      notifyOnlyWhenUnfocused: CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED,
      notificationIntervalMinutes: CONFIG.NOTIFICATIONS.REPEAT_MINUTES,
      _lastChargesNotifyAt: 0,
      _lastChargesBelow: true,
      // Smart save tracking
      _lastSavePixelCount: 0,
      _lastSaveTime: 0,
      _saveInProgress: false,
      paintedMap: null
    };
    let _updateResizePreview = () => {
    };
    let _resizeDialogCleanup = null;
    class OverlayManager {
      constructor() {
        this.isEnabled = false;
        this.startCoords = null;
        this.imageBitmap = null;
        this.chunkedTiles = /* @__PURE__ */ new Map();
        this.originalTiles = /* @__PURE__ */ new Map();
        this.originalTilesData = /* @__PURE__ */ new Map();
        this.tileSize = 1e3;
        this.processPromise = null;
        this.lastProcessedHash = null;
        this.workerPool = null;
      }
      toggle() {
        this.isEnabled = !this.isEnabled;
        console.log(`Overlay ${this.isEnabled ? "enabled" : "disabled"}.`);
        return this.isEnabled;
      }
      enable() {
        this.isEnabled = true;
      }
      disable() {
        this.isEnabled = false;
      }
      clear() {
        this.disable();
        this.imageBitmap = null;
        this.chunkedTiles.clear();
        this.originalTiles.clear();
        this.originalTilesData.clear();
        this.lastProcessedHash = null;
        if (this.processPromise) {
          this.processPromise = null;
        }
      }
      async setImage(imageBitmap) {
        this.imageBitmap = imageBitmap;
        this.lastProcessedHash = null;
        if (this.imageBitmap && this.startCoords) {
          await this.processImageIntoChunks();
        }
      }
      async setPosition(startPosition, region) {
        if (!startPosition || !region) {
          this.startCoords = null;
          this.chunkedTiles.clear();
          this.lastProcessedHash = null;
          return;
        }
        this.startCoords = { region, pixel: startPosition };
        this.lastProcessedHash = null;
        if (this.imageBitmap) {
          await this.processImageIntoChunks();
        }
      }
      // Generate hash for cache invalidation
      _generateProcessHash() {
        if (!this.imageBitmap || !this.startCoords)
          return null;
        const { width, height } = this.imageBitmap;
        const { x: px, y: py } = this.startCoords.pixel;
        const { x: rx, y: ry } = this.startCoords.region;
        return `${width}x${height}_${px},${py}_${rx},${ry}_${state.blueMarbleEnabled}_${state.overlayOpacity}`;
      }
      // --- OVERLAY UPDATE: Optimized chunking with caching and batch processing ---
      async processImageIntoChunks() {
        if (!this.imageBitmap || !this.startCoords)
          return;
        if (this.processPromise) {
          return this.processPromise;
        }
        const currentHash = this._generateProcessHash();
        if (this.lastProcessedHash === currentHash && this.chunkedTiles.size > 0) {
          console.log(`\u{1F4E6} Using cached overlay chunks (${this.chunkedTiles.size} tiles)`);
          return;
        }
        this.processPromise = this._doProcessImageIntoChunks();
        try {
          await this.processPromise;
          this.lastProcessedHash = currentHash;
        } finally {
          this.processPromise = null;
        }
      }
      async _doProcessImageIntoChunks() {
        const startTime = performance.now();
        this.chunkedTiles.clear();
        const { width: imageWidth, height: imageHeight } = this.imageBitmap;
        const { x: startPixelX, y: startPixelY } = this.startCoords.pixel;
        const { x: startRegionX, y: startRegionY } = this.startCoords.region;
        const { startTileX, startTileY, endTileX, endTileY } = Utils.calculateTileRange(
          startRegionX,
          startRegionY,
          startPixelX,
          startPixelY,
          imageWidth,
          imageHeight,
          this.tileSize
        );
        const totalTiles = (endTileX - startTileX + 1) * (endTileY - startTileY + 1);
        console.log(`\u{1F504} Processing ${totalTiles} overlay tiles...`);
        const batchSize = 4;
        const tilesToProcess = [];
        for (let ty = startTileY; ty <= endTileY; ty++) {
          for (let tx = startTileX; tx <= endTileX; tx++) {
            tilesToProcess.push({ tx, ty });
          }
        }
        for (let i = 0; i < tilesToProcess.length; i += batchSize) {
          const batch = tilesToProcess.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async ({ tx, ty }) => {
              const tileKey = `${tx},${ty}`;
              const chunkBitmap = await this._processTile(
                tx,
                ty,
                imageWidth,
                imageHeight,
                startPixelX,
                startPixelY,
                startRegionX,
                startRegionY
              );
              if (chunkBitmap) {
                this.chunkedTiles.set(tileKey, chunkBitmap);
              }
            })
          );
          if (i + batchSize < tilesToProcess.length) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
        const processingTime = performance.now() - startTime;
        console.log(
          `\u2705 Overlay processed ${this.chunkedTiles.size} tiles in ${Math.round(processingTime)}ms`
        );
      }
      async _processTile(tx, ty, imageWidth, imageHeight, startPixelX, startPixelY, startRegionX, startRegionY) {
        const tileKey = `${tx},${ty}`;
        const imgStartX = (tx - startRegionX) * this.tileSize - startPixelX;
        const imgStartY = (ty - startRegionY) * this.tileSize - startPixelY;
        const sX = Math.max(0, imgStartX);
        const sY = Math.max(0, imgStartY);
        const sW = Math.min(imageWidth - sX, this.tileSize - (sX - imgStartX));
        const sH = Math.min(imageHeight - sY, this.tileSize - (sY - imgStartY));
        if (sW <= 0 || sH <= 0)
          return null;
        const dX = Math.max(0, -imgStartX);
        const dY = Math.max(0, -imgStartY);
        const chunkCanvas = new OffscreenCanvas(this.tileSize, this.tileSize);
        const chunkCtx = chunkCanvas.getContext("2d");
        chunkCtx.imageSmoothingEnabled = false;
        chunkCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, dX, dY, sW, sH);
        if (state.blueMarbleEnabled) {
          const imageData = chunkCtx.getImageData(dX, dY, sW, sH);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;
            const pixelY = Math.floor(pixelIndex / sW);
            const pixelX = pixelIndex % sW;
            if ((pixelX + pixelY) % 2 === 0 && data[i + 3] > 0) {
              data[i + 3] = 0;
            }
          }
          chunkCtx.putImageData(imageData, dX, dY);
        }
        return await chunkCanvas.transferToImageBitmap();
      }
      // --- OVERLAY UPDATE: Optimized compositing with caching ---
      async processAndRespondToTileRequest(eventData) {
        const { endpoint, blobID, blobData } = eventData;
        let finalBlob = blobData;
        if (this.isEnabled && this.chunkedTiles.size > 0) {
          const tileMatch = endpoint.match(/(\d+)\/(\d+)\.png/);
          if (tileMatch) {
            const tileX = parseInt(tileMatch[1], 10);
            const tileY = parseInt(tileMatch[2], 10);
            const tileKey = `${tileX},${tileY}`;
            const chunkBitmap = this.chunkedTiles.get(tileKey);
            try {
              const originalBitmap = await createImageBitmap(blobData);
              this.originalTiles.set(tileKey, originalBitmap);
              try {
                let canvas, ctx;
                if (typeof OffscreenCanvas !== "undefined") {
                  canvas = new OffscreenCanvas(originalBitmap.width, originalBitmap.height);
                  ctx = canvas.getContext("2d");
                } else {
                  canvas = document.createElement("canvas");
                  canvas.width = originalBitmap.width;
                  canvas.height = originalBitmap.height;
                  ctx = canvas.getContext("2d");
                }
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(originalBitmap, 0, 0);
                const imgData = ctx.getImageData(0, 0, originalBitmap.width, originalBitmap.height);
                this.originalTilesData.set(tileKey, {
                  w: originalBitmap.width,
                  h: originalBitmap.height,
                  data: new Uint8ClampedArray(imgData.data)
                });
              } catch (e) {
                console.warn("OverlayManager: could not cache ImageData for", tileKey, e);
              }
            } catch (e) {
              console.warn("OverlayManager: could not create original bitmap for", tileKey, e);
            }
            if (chunkBitmap) {
              try {
                finalBlob = await this._compositeTileOptimized(blobData, chunkBitmap);
              } catch (e) {
                console.error("Error compositing overlay:", e);
                finalBlob = blobData;
              }
            }
          }
        }
        window.postMessage(
          {
            source: "auto-image-overlay",
            blobID,
            blobData: finalBlob
          },
          "*"
        );
      }
      // Returns [r,g,b,a] for a pixel inside a region tile (tileX, tileY are region coords)
      async getTilePixelColor(tileX, tileY, pixelX, pixelY) {
        const tileKey = `${tileX},${tileY}`;
        const alphaThresh = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
        const cached = this.originalTilesData.get(tileKey);
        if (cached && cached.data && cached.w > 0 && cached.h > 0) {
          const x = Math.max(0, Math.min(cached.w - 1, pixelX));
          const y = Math.max(0, Math.min(cached.h - 1, pixelY));
          const idx = (y * cached.w + x) * 4;
          const d = cached.data;
          const a = d[idx + 3];
          if (!state.paintTransparentPixels && a < alphaThresh) {
            if (window._overlayDebug)
              console.debug("OverlayManager: pixel transparent (cached), skipping", tileKey, x, y, a);
            return null;
          }
          return [d[idx], d[idx + 1], d[idx + 2], a];
        }
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          const bitmap = this.originalTiles.get(tileKey);
          if (!bitmap) {
            if (attempt === maxRetries) {
              console.warn("OverlayManager: no bitmap for", tileKey, "after", maxRetries, "attempts");
            } else {
              await Utils.sleep(50 * attempt);
            }
            continue;
          }
          try {
            let canvas, ctx;
            if (typeof OffscreenCanvas !== "undefined") {
              canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
              ctx = canvas.getContext("2d");
            } else {
              canvas = document.createElement("canvas");
              canvas.width = bitmap.width;
              canvas.height = bitmap.height;
              ctx = canvas.getContext("2d");
            }
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(bitmap, 0, 0);
            const x = Math.max(0, Math.min(bitmap.width - 1, pixelX));
            const y = Math.max(0, Math.min(bitmap.height - 1, pixelY));
            const data = ctx.getImageData(x, y, 1, 1).data;
            const a = data[3];
            if (!state.paintTransparentPixels && a < alphaThresh) {
              if (window._overlayDebug)
                console.debug("OverlayManager: pixel transparent (fallback)", tileKey, x, y, a);
              return null;
            }
            return [data[0], data[1], data[2], a];
          } catch (e) {
            console.warn("OverlayManager: failed to read pixel (attempt", attempt, ")", tileKey, e);
            if (attempt < maxRetries) {
              await Utils.sleep(50 * attempt);
            } else {
              console.error(
                "OverlayManager: failed to read pixel after",
                maxRetries,
                "attempts",
                tileKey
              );
            }
          }
        }
        return null;
      }
      async _compositeTileOptimized(originalBlob, overlayBitmap) {
        const originalBitmap = await createImageBitmap(originalBlob);
        const canvas = new OffscreenCanvas(originalBitmap.width, originalBitmap.height);
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(originalBitmap, 0, 0);
        ctx.globalAlpha = state.overlayOpacity;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(overlayBitmap, 0, 0);
        return await canvas.convertToBlob({
          type: "image/png",
          quality: 0.95
          // Slight compression for faster processing
        });
      }
      /**
       * Wait until all required tiles are loaded and cached
       * @param {number} startRegionX
       * @param {number} startRegionY
       * @param {number} pixelWidth
       * @param {number} pixelHeight
       * @param {number} startPixelX
       * @param {number} startPixelY
       * @param {number} timeoutMs
       * @returns {Promise<boolean>} true if tiles are ready
       */
      async waitForTiles(startRegionX, startRegionY, pixelWidth, pixelHeight, startPixelX = 0, startPixelY = 0, timeoutMs = 1e4) {
        const { startTileX, startTileY, endTileX, endTileY } = Utils.calculateTileRange(
          startRegionX,
          startRegionY,
          startPixelX,
          startPixelY,
          pixelWidth,
          pixelHeight,
          this.tileSize
        );
        const requiredTiles = [];
        for (let ty = startTileY; ty <= endTileY; ty++) {
          for (let tx = startTileX; tx <= endTileX; tx++) {
            requiredTiles.push(`${tx},${ty}`);
          }
        }
        if (requiredTiles.length === 0)
          return true;
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
          if (state.stopFlag) {
            console.log("waitForTiles: stopped by user");
            return false;
          }
          const missing = requiredTiles.filter((key) => !this.originalTiles.has(key));
          if (missing.length === 0) {
            console.log(`\u2705 All ${requiredTiles.length} required tiles are loaded`);
            return true;
          }
          await Utils.sleep(100);
        }
        console.warn(`\u274C Timeout waiting for tiles: ${requiredTiles.length} required, 
        ${requiredTiles.filter((k) => this.originalTiles.has(k)).length} loaded`);
        return false;
      }
    }
    const overlayManager = new OverlayManager();
    let turnstileToken = null;
    let tokenExpiryTime = 0;
    let tokenGenerationInProgress = false;
    let _resolveToken = null;
    let tokenPromise = new Promise((resolve) => {
      _resolveToken = resolve;
    });
    let retryCount = 0;
    const MAX_RETRIES = 10;
    const MAX_BATCH_RETRIES = 10;
    const TOKEN_LIFETIME = 24e4;
    function setTurnstileToken(token) {
      if (_resolveToken) {
        _resolveToken(token);
        _resolveToken = null;
      }
      turnstileToken = token;
      tokenExpiryTime = Date.now() + TOKEN_LIFETIME;
      console.log("\u2705 Turnstile token set successfully");
    }
    function isTokenValid() {
      return turnstileToken && Date.now() < tokenExpiryTime;
    }
    function invalidateToken() {
      turnstileToken = null;
      tokenExpiryTime = 0;
      console.log("\u{1F5D1}\uFE0F Token invalidated, will force fresh generation");
    }
    async function ensureToken(forceRefresh = false) {
      if (isTokenValid() && !forceRefresh) {
        return turnstileToken;
      }
      if (forceRefresh)
        invalidateToken();
      if (tokenGenerationInProgress) {
        console.log("\u{1F504} Token generation already in progress, waiting...");
        await Utils.sleep(2e3);
        return isTokenValid() ? turnstileToken : null;
      }
      tokenGenerationInProgress = true;
      try {
        console.log("\u{1F504} Token expired or missing, generating new one...");
        const token = await handleCaptchaWithRetry();
        if (token && token.length > 20) {
          setTurnstileToken(token);
          console.log("\u2705 Token captured and cached successfully");
          return token;
        }
        console.log("\u26A0\uFE0F Invisible Turnstile failed, forcing browser automation...");
        const fallbackToken = await handleCaptchaFallback();
        if (fallbackToken && fallbackToken.length > 20) {
          setTurnstileToken(fallbackToken);
          console.log("\u2705 Fallback token captured successfully");
          return fallbackToken;
        }
        console.log("\u274C All token generation methods failed");
        return null;
      } finally {
        tokenGenerationInProgress = false;
      }
    }
    async function handleCaptchaWithRetry() {
      const startTime = performance.now();
      try {
        const { sitekey, token: preGeneratedToken } = await Utils.obtainSitekeyAndToken();
        if (!sitekey) {
          throw new Error("No valid sitekey found");
        }
        console.log("\u{1F511} Using sitekey:", sitekey);
        if (typeof window !== "undefined" && window.navigator) {
          console.log(
            "\u{1F9ED} UA:",
            window.navigator.userAgent.substring(0, 50) + "...",
            "Platform:",
            window.navigator.platform
          );
        }
        let token = null;
        if (preGeneratedToken && typeof preGeneratedToken === "string" && preGeneratedToken.length > 20) {
          console.log("\u267B\uFE0F Reusing pre-generated Turnstile token");
          token = preGeneratedToken;
        } else {
          if (isTokenValid()) {
            console.log("\u267B\uFE0F Using existing cached token (from previous session)");
            token = turnstileToken;
          } else {
            console.log("\u{1F510} Generating new token with executeTurnstile...");
            token = await Utils.executeTurnstile(sitekey, "paint");
            if (token)
              setTurnstileToken(token);
          }
        }
        if (token && typeof token === "string" && token.length > 20) {
          const elapsed = Math.round(performance.now() - startTime);
          console.log(`\u2705 Turnstile token generated successfully in ${elapsed}ms`);
          return token;
        } else {
          throw new Error(`Invalid or empty token received - Length: ${(token == null ? void 0 : token.length) || 0}`);
        }
      } catch (error) {
        const elapsed = Math.round(performance.now() - startTime);
        console.error(`\u274C Turnstile token generation failed after ${elapsed}ms:`, error);
        throw error;
      }
    }
    async function handleCaptchaFallback() {
      console.log("\u{1F504} Attempting fallback token generation...");
      return null;
    }
    function inject(callback) {
      var _a;
      const script = document.createElement("script");
      script.textContent = `(${callback})();`;
      (_a = document.documentElement) == null ? void 0 : _a.appendChild(script);
      script.remove();
    }
    inject(() => {
      const fetchedBlobQueue = /* @__PURE__ */ new Map();
      window.addEventListener("message", (event) => {
        const { source, blobID, blobData } = event.data;
        if (source === "auto-image-overlay" && blobID && blobData) {
          const callback = fetchedBlobQueue.get(blobID);
          if (typeof callback === "function") {
            callback(blobData);
          }
          fetchedBlobQueue.delete(blobID);
        }
      });
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        var _a;
        const response = await originalFetch.apply(this, args);
        const url = args[0] instanceof Request ? args[0].url : args[0];
        if (typeof url === "string") {
          if (url.includes("https://backend.wplace.live/s0/pixel/")) {
            try {
              const payload = JSON.parse(args[1].body);
              if (payload.t) {
                console.log(
                  `\u{1F50D}\u2705 Turnstile Token Captured - Type: ${typeof payload.t}, Value: ${payload.t ? typeof payload.t === "string" ? payload.t.length > 50 ? payload.t.substring(0, 50) + "..." : payload.t : JSON.stringify(payload.t) : "null/undefined"}, Length: ${((_a = payload.t) == null ? void 0 : _a.length) || 0}`
                );
                window.postMessage({ source: "turnstile-capture", token: payload.t }, "*");
              }
            } catch (_) {
            }
          }
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("image/png") && url.includes(".png")) {
            const cloned = response.clone();
            return new Promise(async (resolve) => {
              const blobUUID = crypto.randomUUID();
              const originalBlob = await cloned.blob();
              fetchedBlobQueue.set(blobUUID, (processedBlob) => {
                resolve(
                  new Response(processedBlob, {
                    headers: cloned.headers,
                    status: cloned.status,
                    statusText: cloned.statusText
                  })
                );
              });
              window.postMessage(
                {
                  source: "auto-image-tile",
                  endpoint: url,
                  blobID: blobUUID,
                  blobData: originalBlob
                },
                "*"
              );
            });
          }
        }
        return response;
      };
    });
    window.addEventListener("message", (event) => {
      var _a;
      const { source, endpoint, blobID, blobData, token } = event.data;
      if (source === "auto-image-tile" && endpoint && blobID && blobData) {
        overlayManager.processAndRespondToTileRequest(event.data);
      }
      if (source === "turnstile-capture" && token) {
        setTurnstileToken(token);
        if ((_a = document.querySelector("#statusText")) == null ? void 0 : _a.textContent.includes("CAPTCHA")) {
          Utils.showAlert(Utils.t("tokenCapturedSuccess"), "success");
          updateUI("colorsFound", "success", { count: state.availableColors.length });
        }
      }
    });
    async function detectLanguage() {
      try {
        const response = await fetch("https://backend.wplace.live/me", {
          credentials: "include"
        });
        const data = await response.json();
        state.language = data.language === "pt" ? "pt" : "en";
      } catch {
        state.language = navigator.language.startsWith("pt") ? "pt" : "en";
      }
    }
    const Utils = {
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      dynamicSleep: async function(tickAndGetRemainingMs) {
        let remaining = Math.max(0, await tickAndGetRemainingMs());
        while (remaining > 0) {
          const interval = remaining > 5e3 ? 2e3 : remaining > 1e3 ? 500 : 100;
          await this.sleep(Math.min(interval, remaining));
          remaining = Math.max(0, await tickAndGetRemainingMs());
        }
      },
      waitForSelector: async (selector, interval = 200, timeout = 5e3) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          const el = document.querySelector(selector);
          if (el)
            return el;
          await Utils.sleep(interval);
        }
        return null;
      },
      msToTimeText(ms) {
        const totalSeconds = Math.ceil(ms / 1e3);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds % 3600 / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0)
          return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0)
          return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
      },
      /**
       * Calculate the range of tile coordinates (in region space) that cover a given image area.
       * @param {number} startRegionX - Base region X
       * @param {number} startRegionY - Base region Y
       * @param {number} startPixelX - Starting pixel X within the region grid
       * @param {number} startPixelY - Starting pixel Y within the region grid
       * @param {number} width - Image width in pixels
       * @param {number} height - Image height in pixels
       * @param {number} tileSize - Size of a tile (default 1000)
       * @returns {{ startTileX: number, startTileY: number, endTileX: number, endTileY: number }}
       */
      calculateTileRange(startRegionX, startRegionY, startPixelX, startPixelY, width, height, tileSize = 1e3) {
        const endPixelX = startPixelX + width;
        const endPixelY = startPixelY + height;
        return {
          startTileX: startRegionX + Math.floor(startPixelX / tileSize),
          startTileY: startRegionY + Math.floor(startPixelY / tileSize),
          endTileX: startRegionX + Math.floor((endPixelX - 1) / tileSize),
          endTileY: startRegionY + Math.floor((endPixelY - 1) / tileSize)
        };
      },
      // Turnstile Generator Integration - Optimized with widget reuse and proper cleanup
      turnstileLoaded: false,
      _turnstileContainer: null,
      _turnstileOverlay: null,
      _turnstileWidgetId: null,
      _lastSitekey: null,
      async loadTurnstile() {
        if (window.turnstile) {
          this.turnstileLoaded = true;
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          if (document.querySelector(
            'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
          )) {
            const checkReady = () => {
              if (window.turnstile) {
                this.turnstileLoaded = true;
                resolve();
              } else {
                setTimeout(checkReady, 100);
              }
            };
            return checkReady();
          }
          const script = document.createElement("script");
          script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            this.turnstileLoaded = true;
            console.log("\u2705 Turnstile script loaded successfully");
            resolve();
          };
          script.onerror = () => {
            console.error("\u274C Failed to load Turnstile script");
            reject(new Error("Failed to load Turnstile"));
          };
          document.head.appendChild(script);
        });
      },
      // Create or reuse the turnstile container - completely hidden for token generation
      ensureTurnstileContainer() {
        if (!this._turnstileContainer || !document.body.contains(this._turnstileContainer)) {
          if (this._turnstileContainer) {
            this._turnstileContainer.remove();
          }
          this._turnstileContainer = document.createElement("div");
          this._turnstileContainer.className = "wplace-turnstile-hidden";
          this._turnstileContainer.setAttribute("aria-hidden", "true");
          this._turnstileContainer.id = "turnstile-widget-container";
          document.body.appendChild(this._turnstileContainer);
        }
        return this._turnstileContainer;
      },
      // Interactive overlay container for visible widgets when needed
      ensureTurnstileOverlayContainer() {
        if (this._turnstileOverlay && document.body.contains(this._turnstileOverlay)) {
          return this._turnstileOverlay;
        }
        const overlay = document.createElement("div");
        overlay.id = "turnstile-overlay-container";
        overlay.className = "wplace-turnstile-overlay wplace-overlay-hidden";
        const title = document.createElement("div");
        title.textContent = Utils.t("turnstileInstructions");
        title.className = "wplace-turnstile-title";
        const host = document.createElement("div");
        host.id = "turnstile-overlay-host";
        host.className = "wplace-turnstile-host";
        const hideBtn = document.createElement("button");
        hideBtn.textContent = Utils.t("hideTurnstileBtn");
        hideBtn.className = "wplace-turnstile-hide-btn";
        hideBtn.addEventListener("click", () => overlay.remove());
        overlay.appendChild(title);
        overlay.appendChild(host);
        overlay.appendChild(hideBtn);
        document.body.appendChild(overlay);
        this._turnstileOverlay = overlay;
        return overlay;
      },
      async executeTurnstile(sitekey, action = "paint") {
        var _a;
        await this.loadTurnstile();
        if (this._turnstileWidgetId && this._lastSitekey === sitekey && ((_a = window.turnstile) == null ? void 0 : _a.execute)) {
          try {
            console.log("\u{1F504} Reusing existing Turnstile widget...");
            const token = await Promise.race([
              window.turnstile.execute(this._turnstileWidgetId, { action }),
              new Promise(
                (_, reject) => setTimeout(() => reject(new Error("Execute timeout")), 15e3)
              )
            ]);
            if (token && token.length > 20) {
              console.log("\u2705 Token generated via widget reuse");
              return token;
            }
          } catch (error) {
            console.log("\uFFFD Widget reuse failed, will create a fresh widget:", error.message);
          }
        }
        const invisibleToken = await this.createTurnstileWidget(sitekey, action);
        if (invisibleToken && invisibleToken.length > 20) {
          return invisibleToken;
        }
        console.log("\uFFFD Falling back to interactive Turnstile (visible).");
        return await this.createTurnstileWidgetInteractive(sitekey, action);
      },
      async createTurnstileWidget(sitekey, action) {
        return new Promise((resolve) => {
          var _a, _b;
          try {
            if (this._turnstileWidgetId && ((_a = window.turnstile) == null ? void 0 : _a.remove)) {
              try {
                window.turnstile.remove(this._turnstileWidgetId);
                console.log("\u{1F9F9} Cleaned up existing Turnstile widget");
              } catch (e) {
                console.warn("\u26A0\uFE0F Widget cleanup warning:", e.message);
              }
            }
            const container = this.ensureTurnstileContainer();
            container.innerHTML = "";
            if (!((_b = window.turnstile) == null ? void 0 : _b.render)) {
              console.error("\u274C Turnstile not available for rendering");
              resolve(null);
              return;
            }
            console.log("\u{1F527} Creating invisible Turnstile widget...");
            const widgetId = window.turnstile.render(container, {
              sitekey,
              action,
              size: "invisible",
              retry: "auto",
              "retry-interval": 8e3,
              callback: (token) => {
                console.log("\u2705 Invisible Turnstile callback");
                resolve(token);
              },
              "error-callback": () => resolve(null),
              "timeout-callback": () => resolve(null)
            });
            this._turnstileWidgetId = widgetId;
            this._lastSitekey = sitekey;
            if (!widgetId) {
              return resolve(null);
            }
            Promise.race([
              window.turnstile.execute(widgetId, { action }),
              new Promise(
                (_, reject) => setTimeout(() => reject(new Error("Invisible execute timeout")), 12e3)
              )
            ]).then(resolve).catch(() => resolve(null));
          } catch (e) {
            console.error("\u274C Invisible Turnstile creation failed:", e);
            resolve(null);
          }
        });
      },
      async createTurnstileWidgetInteractive(sitekey, action) {
        console.log("\u{1F504} Creating interactive Turnstile widget (visible)");
        return new Promise((resolve) => {
          var _a;
          try {
            if (this._turnstileWidgetId && ((_a = window.turnstile) == null ? void 0 : _a.remove)) {
              try {
                window.turnstile.remove(this._turnstileWidgetId);
              } catch (e) {
                console.warn("\u26A0\uFE0F Widget cleanup warning:", e.message);
              }
            }
            const overlay = this.ensureTurnstileOverlayContainer();
            overlay.classList.remove("wplace-overlay-hidden");
            overlay.style.display = "block";
            const host = overlay.querySelector("#turnstile-overlay-host");
            host.innerHTML = "";
            const timeout = setTimeout(() => {
              console.warn("\u23F0 Interactive Turnstile widget timeout");
              overlay.classList.add("wplace-overlay-hidden");
              overlay.style.display = "none";
              resolve(null);
            }, 6e4);
            const widgetId = window.turnstile.render(host, {
              sitekey,
              action,
              size: "normal",
              theme: "light",
              callback: (token) => {
                clearTimeout(timeout);
                overlay.classList.add("wplace-overlay-hidden");
                overlay.style.display = "none";
                console.log("\u2705 Interactive Turnstile completed successfully");
                if (typeof token === "string" && token.length > 20) {
                  resolve(token);
                } else {
                  console.warn("\u274C Invalid token from interactive widget");
                  resolve(null);
                }
              },
              "error-callback": (error) => {
                clearTimeout(timeout);
                overlay.classList.add("wplace-overlay-hidden");
                overlay.style.display = "none";
                console.warn("\u274C Interactive Turnstile error:", error);
                resolve(null);
              }
            });
            this._turnstileWidgetId = widgetId;
            this._lastSitekey = sitekey;
            if (!widgetId) {
              clearTimeout(timeout);
              overlay.classList.add("wplace-overlay-hidden");
              overlay.style.display = "none";
              console.warn("\u274C Failed to create interactive Turnstile widget");
              resolve(null);
            } else {
              console.log("\u2705 Interactive Turnstile widget created, waiting for user interaction...");
            }
          } catch (e) {
            console.error("\u274C Interactive Turnstile creation failed:", e);
            resolve(null);
          }
        });
      },
      // Cleanup method for when the script is disabled/reloaded
      cleanupTurnstile() {
        var _a;
        if (this._turnstileWidgetId && ((_a = window.turnstile) == null ? void 0 : _a.remove)) {
          try {
            window.turnstile.remove(this._turnstileWidgetId);
          } catch (e) {
            console.warn("Failed to cleanup Turnstile widget:", e);
          }
        }
        if (this._turnstileContainer && document.body.contains(this._turnstileContainer)) {
          this._turnstileContainer.remove();
        }
        if (this._turnstileOverlay && document.body.contains(this._turnstileOverlay)) {
          this._turnstileOverlay.remove();
        }
        this._turnstileWidgetId = null;
        this._turnstileContainer = null;
        this._turnstileOverlay = null;
        this._lastSitekey = null;
      },
      async obtainSitekeyAndToken(fallback = "0x4AAAAAABpqJe8FO0N84q0F") {
        var _a;
        if (this._cachedSitekey) {
          console.log("\u{1F50D} Using cached sitekey:", this._cachedSitekey);
          return isTokenValid() ? {
            sitekey: this._cachedSitekey,
            token: turnstileToken
          } : { sitekey: this._cachedSitekey, token: null };
        }
        const potentialSitekeys = [
          "0x4AAAAAABpqJe8FO0N84q0F",
          // WPlace common sitekey
          "0x4AAAAAAAJ7xjKAp6Mt_7zw",
          // Alternative WPlace sitekey
          "0x4AAAAAADm5QWx6Ov2LNF2g"
          // Another common sitekey
        ];
        const trySitekey = async (sitekey, source) => {
          if (!sitekey || sitekey.length < 10)
            return null;
          console.log(`\u{1F50D} Testing sitekey from ${source}:`, sitekey);
          const token = await this.executeTurnstile(sitekey);
          if (token && token.length >= 20) {
            console.log(`\u2705 Valid token generated from ${source} sitekey`);
            setTurnstileToken(token);
            this._cachedSitekey = sitekey;
            return { sitekey, token };
          } else {
            console.log(`\u274C Failed to get token from ${source} sitekey`);
            return null;
          }
        };
        try {
          const sitekeySel = document.querySelector("[data-sitekey]");
          if (sitekeySel) {
            const sitekey = sitekeySel.getAttribute("data-sitekey");
            const result = await trySitekey(sitekey, "data attribute");
            if (result) {
              return result;
            }
          }
          const turnstileEl = document.querySelector(".cf-turnstile");
          if ((_a = turnstileEl == null ? void 0 : turnstileEl.dataset) == null ? void 0 : _a.sitekey) {
            const sitekey = turnstileEl.dataset.sitekey;
            const result = await trySitekey(sitekey, "turnstile element");
            if (result) {
              return result;
            }
          }
          const metaTags = document.querySelectorAll(
            'meta[name*="turnstile"], meta[property*="turnstile"]'
          );
          for (const meta of metaTags) {
            const content = meta.getAttribute("content");
            const result = await trySitekey(content, "meta tag");
            if (result) {
              return result;
            }
          }
          if (window.__TURNSTILE_SITEKEY) {
            const result = await trySitekey(window.__TURNSTILE_SITEKEY, "global variable");
            if (result) {
              return result;
            }
          }
          const scripts = document.querySelectorAll("script");
          for (const script of scripts) {
            const content = script.textContent || script.innerHTML;
            const match = content.match(
              /(?:sitekey|data-sitekey)['"\s\[\]:\=\(]*['"]?([0-9a-zA-Z_-]{20,})['"]?/i
            );
            if (match && match[1]) {
              const extracted = match[1].replace(/['"]/g, "");
              const result = await trySitekey(extracted, "script content");
              if (result) {
                return result;
              }
            }
          }
          console.log("\u{1F50D} Testing known potential sitekeys...");
          for (const testSitekey of potentialSitekeys) {
            const result = await trySitekey(testSitekey, "known list");
            if (result) {
              return result;
            }
          }
        } catch (error) {
          console.warn("\u26A0\uFE0F Error during sitekey detection:", error);
        }
        console.log("\u{1F527} Trying fallback sitekey:", fallback);
        const fallbackResult = await trySitekey(fallback, "fallback");
        if (fallbackResult) {
          return fallbackResult;
        }
        console.error("\u274C No working sitekey or token found.");
        return { sitekey: null, token: null };
      },
      createElement: (tag, props = {}, children = []) => {
        const element = document.createElement(tag);
        Object.entries(props).forEach(([key, value]) => {
          if (key === "style" && typeof value === "object") {
            Object.assign(element.style, value);
          } else if (key === "className") {
            element.className = value;
          } else if (key === "innerHTML") {
            element.innerHTML = value;
          } else {
            element.setAttribute(key, value);
          }
        });
        if (typeof children === "string") {
          element.textContent = children;
        } else if (Array.isArray(children)) {
          children.forEach((child) => {
            if (typeof child === "string") {
              element.appendChild(document.createTextNode(child));
            } else {
              element.appendChild(child);
            }
          });
        }
        return element;
      },
      createButton: (id, text, icon, onClick, className = "wplace-btn-primary") => {
        const button = Utils.createElement("button", {
          id,
          className,
          innerHTML: `${icon ? `<i class="${icon}"></i>` : ""}<span>${text}</span>`
        });
        if (onClick)
          button.addEventListener("click", onClick);
        return button;
      },
      // Add hold-to-repeat functionality to buttons (for +/- buttons)
      addHoldToRepeatListener: (button, callback, initialDelay = 500, initialInterval = 150) => {
        let timeout, interval;
        let currentInterval = initialInterval;
        const minInterval = 25;
        const acceleration = 0.9;
        const startRepeating = () => {
          callback();
          currentInterval = initialInterval;
          timeout = setTimeout(() => {
            const acceleratingRepeat = () => {
              callback();
              currentInterval = Math.max(minInterval, currentInterval * acceleration);
              interval = setTimeout(acceleratingRepeat, currentInterval);
            };
            acceleratingRepeat();
          }, initialDelay);
        };
        const stopRepeating = () => {
          clearTimeout(timeout);
          clearTimeout(interval);
          currentInterval = initialInterval;
        };
        button.addEventListener("mousedown", startRepeating);
        button.addEventListener("mouseup", stopRepeating);
        button.addEventListener("mouseleave", stopRepeating);
        button.addEventListener("touchstart", startRepeating);
        button.addEventListener("touchend", stopRepeating);
        button.addEventListener("contextmenu", (e) => e.preventDefault());
      },
      // Synchronous translation function for UI rendering
      t: (key, params = {}) => {
        var _a, _b, _c, _d;
        const cacheKey = `${state.language}_${key}`;
        if (translationCache.has(cacheKey)) {
          let text2 = translationCache.get(cacheKey);
          Object.keys(params).forEach((param) => {
            text2 = text2.replace(`{${param}}`, params[param]);
          });
          return text2;
        }
        if ((_a = loadedTranslations[state.language]) == null ? void 0 : _a[key]) {
          let text2 = loadedTranslations[state.language][key];
          translationCache.set(cacheKey, text2);
          Object.keys(params).forEach((param) => {
            text2 = text2.replace(`{${param}}`, params[param]);
          });
          return text2;
        }
        if (state.language !== "en" && ((_b = loadedTranslations["en"]) == null ? void 0 : _b[key])) {
          let text2 = loadedTranslations["en"][key];
          Object.keys(params).forEach((param) => {
            text2 = text2.replace(`{${param}}`, params[param]);
          });
          return text2;
        }
        let text = ((_c = FALLBACK_TEXT[state.language]) == null ? void 0 : _c[key]) || ((_d = FALLBACK_TEXT.en) == null ? void 0 : _d[key]) || key;
        Object.keys(params).forEach((param) => {
          text = text.replace(new RegExp(`\\{${param}\\}`, "g"), params[param]);
        });
        if (text === key && key !== "undefined") {
          console.warn(`\u26A0\uFE0F Missing translation for key: ${key} (language: ${state.language})`);
        }
        return text;
      },
      showAlert: (message, type = "info") => {
        const alertDiv = document.createElement("div");
        alertDiv.className = `wplace-alert-base wplace-alert-${type}`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
          alertDiv.style.animation = "slide-down 0.3s ease-out reverse";
          setTimeout(() => {
            document.body.removeChild(alertDiv);
          }, 300);
        }, 4e3);
      },
      colorDistance: (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)),
      _labCache: /* @__PURE__ */ new Map(),
      // key: (r<<16)|(g<<8)|b  value: [L,a,b]
      _rgbToLab: (r, g, b) => {
        const srgbToLinear = (v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const rl = srgbToLinear(r);
        const gl = srgbToLinear(g);
        const bl = srgbToLinear(b);
        let X = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
        let Y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
        let Z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;
        X /= 0.95047;
        Y /= 1;
        Z /= 1.08883;
        const f = (t) => t > 8856e-6 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
        const fX = f(X), fY = f(Y), fZ = f(Z);
        const L = 116 * fY - 16;
        const a = 500 * (fX - fY);
        const b2 = 200 * (fY - fZ);
        return [L, a, b2];
      },
      _lab: (r, g, b) => {
        const key = r << 16 | g << 8 | b;
        let v = Utils._labCache.get(key);
        if (!v) {
          v = Utils._rgbToLab(r, g, b);
          Utils._labCache.set(key, v);
        }
        return v;
      },
      findClosestPaletteColor: (r, g, b, palette) => {
        if (!palette || palette.length === 0) {
          palette = Object.values(CONFIG.COLOR_MAP).filter((c) => c.rgb).map((c) => [c.rgb.r, c.rgb.g, c.rgb.b]);
        }
        if (state.colorMatchingAlgorithm === "legacy") {
          let menorDist = Infinity;
          let cor = [0, 0, 0];
          for (let i = 0; i < palette.length; i++) {
            const [pr, pg, pb] = palette[i];
            const rmean = (pr + r) / 2;
            const rdiff = pr - r;
            const gdiff = pg - g;
            const bdiff = pb - b;
            const dist = Math.sqrt(
              ((512 + rmean) * rdiff * rdiff >> 8) + 4 * gdiff * gdiff + ((767 - rmean) * bdiff * bdiff >> 8)
            );
            if (dist < menorDist) {
              menorDist = dist;
              cor = [pr, pg, pb];
            }
          }
          return cor;
        }
        const [Lt, at, bt] = Utils._lab(r, g, b);
        const targetChroma = Math.sqrt(at * at + bt * bt);
        let best = null;
        let bestDist = Infinity;
        for (let i = 0; i < palette.length; i++) {
          const [pr, pg, pb] = palette[i];
          const [Lp, ap, bp] = Utils._lab(pr, pg, pb);
          const dL = Lt - Lp;
          const da = at - ap;
          const db = bt - bp;
          let dist = dL * dL + da * da + db * db;
          if (state.enableChromaPenalty && targetChroma > 20) {
            const candChroma = Math.sqrt(ap * ap + bp * bp);
            if (candChroma < targetChroma) {
              const chromaDiff = targetChroma - candChroma;
              dist += chromaDiff * chromaDiff * state.chromaPenaltyWeight;
            }
          }
          if (dist < bestDist) {
            bestDist = dist;
            best = palette[i];
            if (bestDist === 0)
              break;
          }
        }
        return best || [0, 0, 0];
      },
      isWhitePixel: (r, g, b) => {
        const wt = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
        return r >= wt && g >= wt && b >= wt;
      },
      resolveColor(targetRgb, availableColors, exactMatch = false) {
        if (!availableColors || availableColors.length === 0) {
          return {
            id: null,
            rgb: targetRgb
          };
        }
        const cacheKey = `${targetRgb[0]},${targetRgb[1]},${targetRgb[2]}|${state.colorMatchingAlgorithm}|${state.enableChromaPenalty ? "c" : "nc"}|${state.chromaPenaltyWeight}|${exactMatch ? "exact" : "closest"}`;
        if (colorCache.has(cacheKey))
          return colorCache.get(cacheKey);
        if (exactMatch) {
          const match = availableColors.find(
            (c) => c.rgb[0] === targetRgb[0] && c.rgb[1] === targetRgb[1] && c.rgb[2] === targetRgb[2]
          );
          const result2 = match ? { id: match.id, rgb: [...match.rgb] } : { id: null, rgb: targetRgb };
          colorCache.set(cacheKey, result2);
          return result2;
        }
        const whiteThreshold = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
        if (targetRgb[0] >= whiteThreshold && targetRgb[1] >= whiteThreshold && targetRgb[2] >= whiteThreshold) {
          const whiteEntry = availableColors.find(
            (c) => c.rgb[0] >= whiteThreshold && c.rgb[1] >= whiteThreshold && c.rgb[2] >= whiteThreshold
          );
          if (whiteEntry) {
            const result2 = { id: whiteEntry.id, rgb: [...whiteEntry.rgb] };
            colorCache.set(cacheKey, result2);
            return result2;
          }
        }
        let bestId = availableColors[0].id;
        let bestRgb = [...availableColors[0].rgb];
        let bestScore = Infinity;
        if (state.colorMatchingAlgorithm === "legacy") {
          for (let i = 0; i < availableColors.length; i++) {
            const c = availableColors[i];
            const [r, g, b] = c.rgb;
            const rmean = (r + targetRgb[0]) / 2;
            const rdiff = r - targetRgb[0];
            const gdiff = g - targetRgb[1];
            const bdiff = b - targetRgb[2];
            const dist = Math.sqrt(
              ((512 + rmean) * rdiff * rdiff >> 8) + 4 * gdiff * gdiff + ((767 - rmean) * bdiff * bdiff >> 8)
            );
            if (dist < bestScore) {
              bestScore = dist;
              bestId = c.id;
              bestRgb = [...c.rgb];
              if (dist === 0)
                break;
            }
          }
        } else {
          const [Lt, at, bt] = Utils._lab(targetRgb[0], targetRgb[1], targetRgb[2]);
          const targetChroma = Math.sqrt(at * at + bt * bt);
          const penaltyWeight = state.enableChromaPenalty ? state.chromaPenaltyWeight || 0.15 : 0;
          for (let i = 0; i < availableColors.length; i++) {
            const c = availableColors[i];
            const [r, g, b] = c.rgb;
            const [L2, a2, b2] = Utils._lab(r, g, b);
            const dL = Lt - L2, da = at - a2, db = bt - b2;
            let dist = dL * dL + da * da + db * db;
            if (penaltyWeight > 0 && targetChroma > 20) {
              const candChroma = Math.sqrt(a2 * a2 + b2 * b2);
              if (candChroma < targetChroma) {
                const cd = targetChroma - candChroma;
                dist += cd * cd * penaltyWeight;
              }
            }
            if (dist < bestScore) {
              bestScore = dist;
              bestId = c.id;
              bestRgb = [...c.rgb];
              if (dist === 0)
                break;
            }
          }
        }
        const result = { id: bestId, rgb: bestRgb };
        colorCache.set(cacheKey, result);
        if (colorCache.size > 15e3) {
          const firstKey = colorCache.keys().next().value;
          colorCache.delete(firstKey);
        }
        return result;
      },
      createImageUploader: () => new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpeg";
        input.onchange = () => {
          const fr = new FileReader();
          fr.onload = () => resolve(fr.result);
          fr.readAsDataURL(input.files[0]);
        };
        input.click();
      }),
      createFileDownloader: (data, filename) => {
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      createFileUploader: () => new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const data = JSON.parse(reader.result);
                resolve(data);
              } catch (error) {
                reject(new Error("Invalid JSON file"));
              }
            };
            reader.onerror = () => reject(new Error("File reading error"));
            reader.readAsText(file);
          } else {
            reject(new Error("No file selected"));
          }
        };
        input.click();
      }),
      extractAvailableColors: () => {
        const colorElements = document.querySelectorAll('.tooltip button[id^="color-"]');
        if (colorElements.length === 0) {
          console.log("\u274C No color elements found on page");
          return null;
        }
        const availableColors = [];
        const unavailableColors = [];
        Array.from(colorElements).forEach((el) => {
          const id = Number.parseInt(el.id.replace("color-", ""));
          if (id === 0)
            return;
          const rgbStr = el.style.backgroundColor.match(/\d+/g);
          if (!rgbStr || rgbStr.length < 3) {
            console.warn(`Skipping color element ${el.id} \u2014 cannot parse RGB`);
            return;
          }
          const rgb = rgbStr.map(Number);
          const colorInfo = Object.values(CONFIG.COLOR_MAP).find((color) => color.id === id);
          const name = colorInfo ? colorInfo.name : `Unknown Color ${id}`;
          const colorData = { id, name, rgb };
          if (!el.querySelector("svg")) {
            availableColors.push(colorData);
          } else {
            unavailableColors.push(colorData);
          }
        });
        console.log("=== CAPTURED COLORS STATUS ===");
        console.log(`Total available colors: ${availableColors.length}`);
        console.log(`Total unavailable colors: ${unavailableColors.length}`);
        console.log(`Total colors scanned: ${availableColors.length + unavailableColors.length}`);
        if (availableColors.length > 0) {
          console.log("\n--- AVAILABLE COLORS ---");
          availableColors.forEach((color, index) => {
            console.log(
              `${index + 1}. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`
            );
          });
        }
        if (unavailableColors.length > 0) {
          console.log("\n--- UNAVAILABLE COLORS ---");
          unavailableColors.forEach((color, index) => {
            console.log(
              `${index + 1}. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]}) [LOCKED]`
            );
          });
        }
        console.log("=== END COLOR STATUS ===");
        return availableColors;
      },
      formatTime: (ms) => {
        const seconds = Math.floor(ms / 1e3 % 60);
        const minutes = Math.floor(ms / (1e3 * 60) % 60);
        const hours = Math.floor(ms / (1e3 * 60 * 60) % 24);
        const days = Math.floor(ms / (1e3 * 60 * 60 * 24));
        let result = "";
        if (days > 0)
          result += `${days}d `;
        if (hours > 0 || days > 0)
          result += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0)
          result += `${minutes}m `;
        result += `${seconds}s`;
        return result;
      },
      calculateEstimatedTime: (remainingPixels, charges, cooldown) => {
        if (remainingPixels <= 0)
          return 0;
        const paintingSpeedDelay = state.paintingSpeed > 0 ? 1e3 / state.paintingSpeed : 1e3;
        const timeFromSpeed = remainingPixels * paintingSpeedDelay;
        const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1));
        const timeFromCharges = cyclesNeeded * cooldown;
        return timeFromSpeed + timeFromCharges;
      },
      // --- Painted pixel tracking helpers ---
      initializePaintedMap: (width, height) => {
        if (!state.paintedMap || state.paintedMap.length !== height) {
          state.paintedMap = Array(height).fill().map(() => Array(width).fill(false));
          console.log(`\u{1F4CB} Initialized painted map: ${width}x${height}`);
        }
      },
      markPixelPainted: (x, y, regionX = 0, regionY = 0) => {
        const actualX = x + regionX;
        const actualY = y + regionY;
        if (state.paintedMap && state.paintedMap[actualY] && actualX >= 0 && actualX < state.paintedMap[actualY].length) {
          state.paintedMap[actualY][actualX] = true;
        }
      },
      isPixelPainted: (x, y, regionX = 0, regionY = 0) => {
        const actualX = x + regionX;
        const actualY = y + regionY;
        if (state.paintedMap && state.paintedMap[actualY] && actualX >= 0 && actualX < state.paintedMap[actualY].length) {
          return state.paintedMap[actualY][actualX];
        }
        return false;
      },
      // Smart save - only save if significant changes
      shouldAutoSave: () => {
        const now = Date.now();
        const pixelsSinceLastSave = state.paintedPixels - state._lastSavePixelCount;
        const timeSinceLastSave = now - state._lastSaveTime;
        return !state._saveInProgress && pixelsSinceLastSave >= 25 && timeSinceLastSave >= 3e4;
      },
      performSmartSave: () => {
        if (!Utils.shouldAutoSave())
          return false;
        state._saveInProgress = true;
        const success = Utils.saveProgress();
        if (success) {
          state._lastSavePixelCount = state.paintedPixels;
          state._lastSaveTime = Date.now();
          console.log(`\u{1F4BE} Auto-saved at ${state.paintedPixels} pixels`);
        }
        state._saveInProgress = false;
        return success;
      },
      // --- Data management helpers ---
      // Base64 compression helpers for efficient storage
      packPaintedMapToBase64: (paintedMap, width, height) => {
        if (!paintedMap || !width || !height)
          return null;
        const totalBits = width * height;
        const byteLen = Math.ceil(totalBits / 8);
        const bytes = new Uint8Array(byteLen);
        let bitIndex = 0;
        for (let y = 0; y < height; y++) {
          const row = paintedMap[y];
          for (let x = 0; x < width; x++) {
            const bit = row && row[x] ? 1 : 0;
            const b = bitIndex >> 3;
            const o = bitIndex & 7;
            if (bit)
              bytes[b] |= 1 << o;
            bitIndex++;
          }
        }
        let binary = "";
        const chunk = 32768;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(
            null,
            bytes.subarray(i, Math.min(i + chunk, bytes.length))
          );
        }
        return btoa(binary);
      },
      unpackPaintedMapFromBase64: (base64, width, height) => {
        if (!base64 || !width || !height)
          return null;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++)
          bytes[i] = binary.charCodeAt(i);
        const map = Array(height).fill().map(() => Array(width).fill(false));
        let bitIndex = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const b = bitIndex >> 3;
            const o = bitIndex & 7;
            map[y][x] = (bytes[b] >> o & 1) === 1;
            bitIndex++;
          }
        }
        return map;
      },
      // Migration helpers for backward compatibility
      migrateProgressToV2: (saved) => {
        var _a, _b;
        if (!saved)
          return saved;
        const isV1 = !saved.version || saved.version === "1" || saved.version === "1.0" || saved.version === "1.1";
        if (!isV1)
          return saved;
        try {
          const migrated = { ...saved };
          const width = (_a = migrated.imageData) == null ? void 0 : _a.width;
          const height = (_b = migrated.imageData) == null ? void 0 : _b.height;
          if (migrated.paintedMap && width && height) {
            const data = Utils.packPaintedMapToBase64(migrated.paintedMap, width, height);
            migrated.paintedMapPacked = { width, height, data };
          }
          delete migrated.paintedMap;
          migrated.version = "2";
          return migrated;
        } catch (e) {
          console.warn("Migration to v2 failed, using original data:", e);
          return saved;
        }
      },
      migrateProgressToV21: (saved) => {
        var _a, _b;
        if (!saved)
          return saved;
        if (saved.version === "2.1")
          return saved;
        const isV2 = saved.version === "2" || saved.version === "2.0";
        const isV1 = !saved.version || saved.version === "1" || saved.version === "1.0" || saved.version === "1.1";
        if (!isV2 && !isV1)
          return saved;
        try {
          const migrated = { ...saved };
          if (isV1) {
            const width = (_a = migrated.imageData) == null ? void 0 : _a.width;
            const height = (_b = migrated.imageData) == null ? void 0 : _b.height;
            if (migrated.paintedMap && width && height) {
              const data = Utils.packPaintedMapToBase64(migrated.paintedMap, width, height);
              migrated.paintedMapPacked = { width, height, data };
            }
            delete migrated.paintedMap;
          }
          migrated.version = "2.1";
          return migrated;
        } catch (e) {
          console.warn("Migration to v2.1 failed, using original data:", e);
          return saved;
        }
      },
      migrateProgressToV22: (data) => {
        try {
          const migrated = { ...data };
          migrated.version = "2.2";
          if (!migrated.state.coordinateMode) {
            migrated.state.coordinateMode = CONFIG.COORDINATE_MODE;
          }
          if (!migrated.state.coordinateDirection) {
            migrated.state.coordinateDirection = CONFIG.COORDINATE_DIRECTION;
          }
          if (!migrated.state.coordinateSnake) {
            migrated.state.coordinateSnake = CONFIG.COORDINATE_SNAKE;
          }
          if (!migrated.state.blockWidth) {
            migrated.state.blockWidth = CONFIG.COORDINATE_BLOCK_WIDTH;
          }
          if (!migrated.state.blockHeight) {
            migrated.state.blockHeight = CONFIG.COORDINATE_BLOCK_HEIGHT;
          }
          return migrated;
        } catch (e) {
          console.warn("Migration to v2.2 failed, using original data:", e);
          return data;
        }
      },
      buildPaintedMapPacked() {
        if (state.paintedMap && state.imageData) {
          const data = Utils.packPaintedMapToBase64(
            state.paintedMap,
            state.imageData.width,
            state.imageData.height
          );
          if (data) {
            return {
              width: state.imageData.width,
              height: state.imageData.height,
              data
            };
          }
        }
        return null;
      },
      buildProgressData() {
        return {
          timestamp: Date.now(),
          version: "2.2",
          state: {
            totalPixels: state.totalPixels,
            paintedPixels: state.paintedPixels,
            lastPosition: state.lastPosition,
            startPosition: state.startPosition,
            region: state.region,
            imageLoaded: state.imageLoaded,
            colorsChecked: state.colorsChecked,
            coordinateMode: state.coordinateMode,
            coordinateDirection: state.coordinateDirection,
            coordinateSnake: state.coordinateSnake,
            blockWidth: state.blockWidth,
            blockHeight: state.blockHeight,
            availableColors: state.availableColors
          },
          imageData: state.imageData ? {
            width: state.imageData.width,
            height: state.imageData.height,
            pixels: Array.from(state.imageData.pixels),
            totalPixels: state.imageData.totalPixels
          } : null,
          paintedMapPacked: Utils.buildPaintedMapPacked()
        };
      },
      migrateProgress(saved) {
        if (!saved)
          return null;
        let data = saved;
        const ver = data.version;
        if (!ver || ver === "1" || ver === "1.0" || ver === "1.1") {
          data = Utils.migrateProgressToV2(data);
        }
        if (data.version === "2" || data.version === "2.0") {
          data = Utils.migrateProgressToV21(data);
        }
        if (data.version === "2.1") {
          data = Utils.migrateProgressToV22(data);
        }
        return data;
      },
      saveProgress: () => {
        try {
          const progressData = Utils.buildProgressData(state);
          localStorage.setItem("wplace-bot-progress", JSON.stringify(progressData));
          return true;
        } catch (error) {
          console.error("Error saving progress:", error);
          return false;
        }
      },
      loadProgress: () => {
        try {
          const saved = localStorage.getItem("wplace-bot-progress");
          if (!saved)
            return null;
          let data = JSON.parse(saved);
          const migrated = Utils.migrateProgress(data);
          if (migrated && migrated !== data) {
            try {
              localStorage.setItem("wplace-bot-progress", JSON.stringify(migrated));
            } catch {
            }
          }
          return migrated;
        } catch (error) {
          console.error("Error loading progress:", error);
          return null;
        }
      },
      clearProgress: () => {
        try {
          localStorage.removeItem("wplace-bot-progress");
          state.paintedMap = null;
          state._lastSavePixelCount = 0;
          state._lastSaveTime = 0;
          state.coordinateMode = CONFIG.COORDINATE_MODE;
          state.coordinateDirection = CONFIG.COORDINATE_DIRECTION;
          state.coordinateSnake = CONFIG.COORDINATE_SNAKE;
          state.blockWidth = CONFIG.COORDINATE_BLOCK_WIDTH;
          state.blockHeight = CONFIG.COORDINATE_BLOCK_HEIGHT;
          console.log("\u{1F4CB} Progress and painted map cleared");
          return true;
        } catch (error) {
          console.error("Error clearing progress:", error);
          return false;
        }
      },
      restoreProgress: (savedData) => {
        try {
          Object.assign(state, savedData.state);
          if (savedData.state.coordinateMode) {
            state.coordinateMode = savedData.state.coordinateMode;
          }
          if (savedData.state.coordinateDirection) {
            state.coordinateDirection = savedData.state.coordinateDirection;
          }
          if (savedData.state.coordinateSnake !== void 0) {
            state.coordinateSnake = savedData.state.coordinateSnake;
          }
          if (savedData.state.blockWidth) {
            state.blockWidth = savedData.state.blockWidth;
          }
          if (savedData.state.blockHeight) {
            state.blockHeight = savedData.state.blockHeight;
          }
          if (savedData.imageData) {
            state.imageData = {
              ...savedData.imageData,
              pixels: new Uint8ClampedArray(savedData.imageData.pixels)
            };
            try {
              const canvas = document.createElement("canvas");
              canvas.width = state.imageData.width;
              canvas.height = state.imageData.height;
              const ctx = canvas.getContext("2d");
              const imageData = new ImageData(
                state.imageData.pixels,
                state.imageData.width,
                state.imageData.height
              );
              ctx.putImageData(imageData, 0, 0);
              const proc = new ImageProcessor("");
              proc.img = canvas;
              proc.canvas = canvas;
              proc.ctx = ctx;
              state.imageData.processor = proc;
            } catch (e) {
              console.warn("Could not rebuild processor from saved image data:", e);
            }
          }
          if (savedData.paintedMapPacked && savedData.paintedMapPacked.data) {
            const { width, height, data } = savedData.paintedMapPacked;
            state.paintedMap = Utils.unpackPaintedMapFromBase64(data, width, height);
          } else if (savedData.paintedMap) {
            state.paintedMap = savedData.paintedMap.map((row) => Array.from(row));
          }
          return true;
        } catch (error) {
          console.error("Error restoring progress:", error);
          return false;
        }
      },
      saveProgressToFile: () => {
        try {
          const progressData = Utils.buildProgressData();
          const filename = `wplace-bot-progress-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
          Utils.createFileDownloader(JSON.stringify(progressData, null, 2), filename);
          return true;
        } catch (error) {
          console.error("Error saving to file:", error);
          return false;
        }
      },
      loadProgressFromFile: async () => {
        try {
          const data = await Utils.createFileUploader();
          if (!data || !data.state) {
            throw new Error("Invalid file format");
          }
          const migrated = Utils.migrateProgress(data);
          const success = Utils.restoreProgress(migrated);
          return success;
        } catch (error) {
          console.error("Error loading from file:", error);
          throw error;
        }
      },
      // Helper function to restore overlay from loaded data
      restoreOverlayFromData: async () => {
        if (!state.imageLoaded || !state.imageData || !state.startPosition || !state.region) {
          return false;
        }
        try {
          const imageData = new ImageData(
            state.imageData.pixels,
            state.imageData.width,
            state.imageData.height
          );
          const canvas = new OffscreenCanvas(state.imageData.width, state.imageData.height);
          const ctx = canvas.getContext("2d");
          ctx.putImageData(imageData, 0, 0);
          const imageBitmap = await canvas.transferToImageBitmap();
          await overlayManager.setImage(imageBitmap);
          await overlayManager.setPosition(state.startPosition, state.region);
          overlayManager.enable();
          const toggleOverlayBtn = document.getElementById("toggleOverlayBtn");
          if (toggleOverlayBtn) {
            toggleOverlayBtn.disabled = false;
            toggleOverlayBtn.classList.add("active");
          }
          console.log("Overlay restored from data");
          return true;
        } catch (error) {
          console.error("Failed to restore overlay from data:", error);
          return false;
        }
      },
      updateCoordinateUI({ mode, directionControls, snakeControls, blockControls }) {
        const isLinear = mode === "rows" || mode === "columns";
        const isBlock = mode === "blocks" || mode === "shuffle-blocks";
        if (directionControls)
          directionControls.style.display = isLinear ? "block" : "none";
        if (snakeControls)
          snakeControls.style.display = isLinear ? "block" : "none";
        if (blockControls)
          blockControls.style.display = isBlock ? "block" : "none";
      }
    };
    class ImageProcessor {
      constructor(imageSrc) {
        this.imageSrc = imageSrc;
        this.img = null;
        this.canvas = null;
        this.ctx = null;
      }
      async load() {
        return new Promise((resolve, reject) => {
          this.img = new Image();
          this.img.crossOrigin = "anonymous";
          this.img.onload = () => {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = this.img.width;
            this.canvas.height = this.img.height;
            this.ctx.drawImage(this.img, 0, 0);
            resolve();
          };
          this.img.onerror = reject;
          this.img.src = this.imageSrc;
        });
      }
      getDimensions() {
        return {
          width: this.canvas.width,
          height: this.canvas.height
        };
      }
      getPixelData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
      }
      resize(newWidth, newHeight) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(this.canvas, 0, 0, newWidth, newHeight);
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(tempCanvas, 0, 0);
        return this.ctx.getImageData(0, 0, newWidth, newHeight).data;
      }
      generatePreview(width, height) {
        const previewCanvas = document.createElement("canvas");
        const previewCtx = previewCanvas.getContext("2d");
        previewCanvas.width = width;
        previewCanvas.height = height;
        previewCtx.imageSmoothingEnabled = false;
        previewCtx.drawImage(this.img, 0, 0, width, height);
        return previewCanvas.toDataURL();
      }
    }
    const WPlaceService = {
      async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
        try {
          await ensureToken();
          if (!turnstileToken)
            return "token_error";
          const payload = {
            coords: [pixelX, pixelY],
            colors: [color],
            t: turnstileToken
          };
          const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            credentials: "include",
            body: JSON.stringify(payload)
          });
          if (res.status === 403) {
            console.error("\u274C 403 Forbidden. Turnstile token might be invalid or expired.");
            turnstileToken = null;
            tokenPromise = new Promise((resolve) => {
              _resolveToken = resolve;
            });
            return "token_error";
          }
          const data = await res.json();
          return (data == null ? void 0 : data.painted) === 1;
        } catch (e) {
          console.error("Paint request failed:", e);
          return false;
        }
      },
      async getCharges() {
        var _a, _b, _c;
        const defaultResult = {
          charges: 0,
          max: 1,
          cooldown: CONFIG.COOLDOWN_DEFAULT
        };
        try {
          const res = await fetch("https://backend.wplace.live/me", {
            credentials: "include"
          });
          if (!res.ok) {
            console.error(`Failed to get charges: HTTP ${res.status}`);
            return defaultResult;
          }
          const data = await res.json();
          return {
            charges: ((_a = data.charges) == null ? void 0 : _a.count) ?? 0,
            max: ((_b = data.charges) == null ? void 0 : _b.max) ?? 1,
            cooldown: ((_c = data.charges) == null ? void 0 : _c.cooldownMs) ?? CONFIG.COOLDOWN_DEFAULT
          };
        } catch (e) {
          console.error("Failed to get charges:", e);
          return defaultResult;
        }
      }
    };
    const NotificationManager = {
      pollTimer: null,
      pollIntervalMs: 6e4,
      icon() {
        const link = document.querySelector("link[rel~='icon']");
        return (link == null ? void 0 : link.href) || location.origin + "/favicon.ico";
      },
      async requestPermission() {
        if (!("Notification" in window)) {
          Utils.showAlert(Utils.t("notificationsNotSupported"), "warning");
          return "denied";
        }
        if (Notification.permission === "granted")
          return "granted";
        try {
          const perm = await Notification.requestPermission();
          return perm;
        } catch {
          return Notification.permission;
        }
      },
      canNotify() {
        return state.notificationsEnabled && typeof Notification !== "undefined" && Notification.permission === "granted";
      },
      notify(title, body, tag = "wplace-charges", force = false) {
        if (!this.canNotify())
          return false;
        if (!force && state.notifyOnlyWhenUnfocused && document.hasFocus())
          return false;
        try {
          new Notification(title, {
            body,
            tag,
            renotify: true,
            icon: this.icon(),
            badge: this.icon(),
            silent: false
          });
          return true;
        } catch {
          Utils.showAlert(body, "info");
          return false;
        }
      },
      resetEdgeTracking() {
        state._lastChargesBelow = state.displayCharges < state.cooldownChargeThreshold;
        state._lastChargesNotifyAt = 0;
      },
      maybeNotifyChargesReached(force = false) {
        if (!state.notificationsEnabled || !state.notifyOnChargesReached)
          return;
        const reached = state.displayCharges >= state.cooldownChargeThreshold;
        const now = Date.now();
        const repeatMs = Math.max(1, Number(state.notificationIntervalMinutes || 5)) * 6e4;
        if (reached) {
          const shouldEdge = state._lastChargesBelow || force;
          const shouldRepeat = now - (state._lastChargesNotifyAt || 0) >= repeatMs;
          if (shouldEdge || shouldRepeat) {
            const msg = Utils.t("chargesReadyMessage", {
              current: state.displayCharges,
              max: state.maxCharges,
              threshold: state.cooldownChargeThreshold
            });
            this.notify(Utils.t("chargesReadyNotification"), msg, "wplace-notify-charges");
            state._lastChargesNotifyAt = now;
          }
          state._lastChargesBelow = false;
        } else {
          state._lastChargesBelow = true;
        }
      },
      startPolling() {
        this.stopPolling();
        if (!state.notificationsEnabled || !state.notifyOnChargesReached)
          return;
        this.pollTimer = setInterval(async () => {
          try {
            const { charges, cooldown, max } = await WPlaceService.getCharges();
            state.displayCharges = Math.floor(charges);
            state.cooldown = cooldown;
            state.maxCharges = Math.max(1, Math.floor(max));
            this.maybeNotifyChargesReached();
          } catch {
          }
        }, this.pollIntervalMs);
      },
      stopPolling() {
        if (this.pollTimer) {
          clearInterval(this.pollTimer);
          this.pollTimer = null;
        }
      },
      syncFromState() {
        this.resetEdgeTracking();
        if (state.notificationsEnabled && state.notifyOnChargesReached)
          this.startPolling();
        else
          this.stopPolling();
      }
    };
    const colorCache = /* @__PURE__ */ new Map();
    let updateUI = () => {
    };
    let updateStats = (isManualRefresh) => {
    };
    let updateDataButtons = () => {
    };
    function updateActiveColorPalette() {
      var _a;
      state.activeColorPalette = [];
      const activeSwatches = document.querySelectorAll(".wplace-color-swatch.active");
      if (activeSwatches) {
        activeSwatches.forEach((swatch) => {
          const rgbStr = swatch.getAttribute("data-rgb");
          if (rgbStr) {
            const rgb = rgbStr.split(",").map(Number);
            state.activeColorPalette.push(rgb);
          }
        });
      }
      if (((_a = document.querySelector(".resize-container")) == null ? void 0 : _a.style.display) === "block") {
        _updateResizePreview();
      }
    }
    function toggleAllColors(select, showingUnavailable = false) {
      const swatches = document.querySelectorAll(".wplace-color-swatch");
      if (swatches) {
        swatches.forEach((swatch) => {
          const isUnavailable = swatch.classList.contains("unavailable");
          if (!isUnavailable || showingUnavailable) {
            if (!isUnavailable) {
              swatch.classList.toggle("active", select);
            }
          }
        });
      }
      updateActiveColorPalette();
    }
    function unselectAllPaidColors() {
      const swatches = document.querySelectorAll(".wplace-color-swatch");
      if (swatches) {
        swatches.forEach((swatch) => {
          const colorId = parseInt(swatch.getAttribute("data-color-id"), 10);
          if (!isNaN(colorId) && colorId >= 32) {
            swatch.classList.toggle("active", false);
          }
        });
      }
      updateActiveColorPalette();
    }
    function initializeColorPalette(container) {
      var _a, _b, _c;
      const colorsContainer = container.querySelector("#colors-container");
      const showAllToggle = container.querySelector("#showAllColorsToggle");
      if (!colorsContainer)
        return;
      if (!state.availableColors || state.availableColors.length === 0) {
        colorsContainer.innerHTML = `<div class="wplace-colors-placeholder">${Utils.t(
          "uploadImageFirst"
        )}</div>`;
        return;
      }
      function populateColors(showUnavailable = false) {
        colorsContainer.innerHTML = "";
        let availableCount = 0;
        let totalCount = 0;
        const allColors = Object.values(CONFIG.COLOR_MAP).filter((color) => color.rgb !== null);
        allColors.forEach((colorData) => {
          const { id, name, rgb } = colorData;
          const rgbKey = `${rgb.r},${rgb.g},${rgb.b}`;
          totalCount++;
          const isAvailable = state.availableColors.some(
            (c) => c.rgb[0] === rgb.r && c.rgb[1] === rgb.g && c.rgb[2] === rgb.b
          );
          if (!showUnavailable && !isAvailable) {
            return;
          }
          if (isAvailable)
            availableCount++;
          const colorItem = Utils.createElement("div", {
            className: "wplace-color-item"
          });
          const swatch = Utils.createElement("button", {
            className: `wplace-color-swatch ${!isAvailable ? "unavailable" : ""}`,
            title: `${name} (ID: ${id})${!isAvailable ? " (Unavailable)" : ""}`,
            "data-rgb": rgbKey,
            "data-color-id": id
          });
          swatch.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          if (!isAvailable) {
            swatch.style.opacity = "0.4";
            swatch.style.filter = "grayscale(50%)";
            swatch.disabled = true;
          } else {
            swatch.classList.add("active");
          }
          const nameLabel = Utils.createElement(
            "span",
            {
              className: "wplace-color-item-name",
              style: !isAvailable ? "color: #888; font-style: italic;" : ""
            },
            name + (!isAvailable ? " (N/A)" : "")
          );
          if (isAvailable) {
            swatch.addEventListener("click", () => {
              swatch.classList.toggle("active");
              updateActiveColorPalette();
            });
          }
          colorItem.appendChild(swatch);
          colorItem.appendChild(nameLabel);
          colorsContainer.appendChild(colorItem);
        });
        updateActiveColorPalette();
      }
      populateColors(false);
      if (showAllToggle) {
        showAllToggle.addEventListener("change", (e) => {
          populateColors(e.target.checked);
        });
      }
      (_a = container.querySelector("#selectAllBtn")) == null ? void 0 : _a.addEventListener("click", () => toggleAllColors(true, showAllToggle == null ? void 0 : showAllToggle.checked));
      (_b = container.querySelector("#unselectAllBtn")) == null ? void 0 : _b.addEventListener("click", () => toggleAllColors(false, showAllToggle == null ? void 0 : showAllToggle.checked));
      (_c = container.querySelector("#unselectPaidBtn")) == null ? void 0 : _c.addEventListener("click", () => unselectAllPaidColors());
    }
    async function handleCaptcha() {
      const startTime = performance.now();
      if (state.tokenSource === "manual") {
        console.log("\u{1F3AF} Manual token source selected - using pixel placement automation");
        return await handleCaptchaFallback();
      }
      try {
        const { sitekey, token: preGeneratedToken } = await Utils.obtainSitekeyAndToken();
        if (!sitekey) {
          throw new Error("No valid sitekey found");
        }
        console.log("\u{1F511} Generating Turnstile token for sitekey:", sitekey);
        console.log(
          "\u{1F9ED} UA:",
          navigator.userAgent.substring(0, 50) + "...",
          "Platform:",
          navigator.platform
        );
        if (!window.turnstile) {
          await Utils.loadTurnstile();
        }
        let token = null;
        if (preGeneratedToken && typeof preGeneratedToken === "string" && preGeneratedToken.length > 20) {
          console.log("\u267B\uFE0F Reusing pre-generated token from sitekey detection phase");
          token = preGeneratedToken;
        } else if (isTokenValid()) {
          console.log("\u267B\uFE0F Using existing cached token (from previous operation)");
          token = turnstileToken;
        } else {
          console.log("\u{1F510} No valid pre-generated or cached token, creating new one...");
          token = await Utils.executeTurnstile(sitekey, "paint");
          if (token) {
            setTurnstileToken(token);
          }
        }
        console.log(
          `\u{1F50D} Token received - Type: ${typeof token}, Value: ${token ? typeof token === "string" ? token.length > 50 ? token.substring(0, 50) + "..." : token : JSON.stringify(token) : "null/undefined"}, Length: ${(token == null ? void 0 : token.length) || 0}`
        );
        if (typeof token === "string" && token.length > 20) {
          const duration = Math.round(performance.now() - startTime);
          console.log(`\u2705 Turnstile token generated successfully in ${duration}ms`);
          return token;
        } else {
          throw new Error(
            `Invalid or empty token received - Type: ${typeof token}, Value: ${JSON.stringify(
              token
            )}, Length: ${(token == null ? void 0 : token.length) || 0}`
          );
        }
      } catch (error) {
        const duration = Math.round(performance.now() - startTime);
        console.error(`\u274C Turnstile token generation failed after ${duration}ms:`, error);
        if (state.tokenSource === "hybrid") {
          console.log(
            "\u{1F504} Hybrid mode: Generator failed, automatically switching to manual pixel placement..."
          );
          const fbToken = await handleCaptchaFallback();
          return fbToken;
        } else {
          throw error;
        }
      }
    }
    async function handleCaptchaFallback() {
      return new Promise(async (resolve, reject) => {
        try {
          if (!_resolveToken) {
            tokenPromise = new Promise((res) => {
              _resolveToken = res;
            });
          }
          const timeoutPromise = Utils.sleep(2e4).then(
            () => reject(new Error("Auto-CAPTCHA timed out."))
          );
          const solvePromise = (async () => {
            const mainPaintBtn = await Utils.waitForSelector(
              "button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl",
              200,
              1e4
            );
            if (!mainPaintBtn)
              throw new Error("Could not find the main paint button.");
            mainPaintBtn.click();
            await Utils.sleep(500);
            const transBtn = await Utils.waitForSelector("button#color-0", 200, 5e3);
            if (!transBtn)
              throw new Error("Could not find the transparent color button.");
            transBtn.click();
            await Utils.sleep(500);
            const canvas = await Utils.waitForSelector("canvas", 200, 5e3);
            if (!canvas)
              throw new Error("Could not find the canvas element.");
            canvas.setAttribute("tabindex", "0");
            canvas.focus();
            const rect = canvas.getBoundingClientRect();
            const centerX = Math.round(rect.left + rect.width / 2);
            const centerY = Math.round(rect.top + rect.height / 2);
            canvas.dispatchEvent(
              new MouseEvent("mousemove", {
                clientX: centerX,
                clientY: centerY,
                bubbles: true
              })
            );
            canvas.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: " ",
                code: "Space",
                bubbles: true
              })
            );
            await Utils.sleep(50);
            canvas.dispatchEvent(
              new KeyboardEvent("keyup", {
                key: " ",
                code: "Space",
                bubbles: true
              })
            );
            await Utils.sleep(500);
            await Utils.sleep(800);
            const confirmLoop = async () => {
              while (!turnstileToken) {
                let confirmBtn = await Utils.waitForSelector(
                  "button.btn.btn-primary.btn-lg, button.btn.btn-primary.sm\\:btn-xl"
                );
                if (!confirmBtn) {
                  const allPrimary = Array.from(document.querySelectorAll("button.btn-primary"));
                  confirmBtn = allPrimary.length ? allPrimary[allPrimary.length - 1] : null;
                }
                if (confirmBtn) {
                  confirmBtn.click();
                }
                await Utils.sleep(500);
              }
            };
            confirmLoop();
            const token = await tokenPromise;
            await Utils.sleep(300);
            resolve(token);
          })();
          await Promise.race([solvePromise, timeoutPromise]);
        } catch (error) {
          console.error("Auto-CAPTCHA process failed:", error);
          reject(error);
        }
      });
    }
    async function createUI() {
      var _a, _b;
      await detectLanguage();
      const existingContainer = document.getElementById("wplace-image-bot-container");
      const existingStats = document.getElementById("wplace-stats-container");
      const existingSettings = document.getElementById("wplace-settings-container");
      const existingResizeContainer = document.querySelector(".resize-container");
      const existingResizeOverlay = document.querySelector(".resize-overlay");
      if (existingContainer)
        existingContainer.remove();
      if (existingStats)
        existingStats.remove();
      if (existingSettings)
        existingSettings.remove();
      if (existingResizeContainer)
        existingResizeContainer.remove();
      if (existingResizeOverlay)
        existingResizeOverlay.remove();
      loadThemePreference();
      await initializeTranslations();
      const theme = getCurrentTheme();
      applyTheme();
      function appendLinkOnce(href, attributes = {}) {
        const exists = Array.from(document.head.querySelectorAll("link")).some(
          (link2) => link2.href === href
        );
        if (exists)
          return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        for (const [key, value] of Object.entries(attributes)) {
          link.setAttribute(key, value);
        }
        document.head.appendChild(link);
      }
      appendLinkOnce("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
      if (theme.fontFamily.includes("Press Start 2P")) {
        appendLinkOnce("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
      }
      const styleElement = document.createElement("style");
      styleElement.textContent = EMBEDDED_CSS;
      styleElement.setAttribute("data-wplace-theme", "true");
      document.head.appendChild(styleElement);
      const isDevMode = localStorage.getItem("dev-mode") === "true";
      const devInfoHeader = isDevMode ? `
      <div class="wplace-dev-info" style="
        font-size: 11px; 
        color: #888; 
        padding: 2px 8px; 
        background: rgba(0,0,0,0.1); 
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-family: 'Courier New', monospace;
      ">
        Build: 2025-09-02 22:33:31 <br /> Commit: fd4382d
      </div>
    ` : "";
      const container = document.createElement("div");
      container.id = "wplace-image-bot-container";
      container.innerHTML = `
      ${devInfoHeader}
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${Utils.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${Utils.t("settings")}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="${Utils.t("showStats")}">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="${Utils.t("compactMode")}">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${Utils.t("minimize")}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${Utils.t("initMessage")}
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
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled title="${Utils.t(
        "waitingSetupComplete"
      )}">
                <i class="fas fa-upload"></i>
                <span>${Utils.t("uploadImage")}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${Utils.t("resizeImage")}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${Utils.t("selectPosition")}</span>
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
                <span>${Utils.t("startPainting")}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${Utils.t("stopPainting")}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${Utils.t("toggleOverlay")}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">\u23F1\uFE0F ${Utils.t("cooldownSettings")}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${Utils.t("waitCharges")}:</label>
                <div class="wplace-slider-container">
                    <input type="range" id="cooldownSlider" class="wplace-slider" min="1" max="1" value="${state.cooldownChargeThreshold}">
                    <div class="wplace-cooldown-controls">
                        <div class="wplace-cooldown-input-group">
                            <button id="cooldownDecrease" class="wplace-input-btn wplace-input-btn-small" type="button">-</button>
                            <input type="number" id="cooldownInput" class="wplace-cooldown-input" min="1" max="999" value="${state.cooldownChargeThreshold}">
                            <button id="cooldownIncrease" class="wplace-input-btn wplace-input-btn-small" type="button">+</button>
                        </div>
                        <span class="wplace-cooldown-unit">Charges</span>
                    </div>
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
                <span>${Utils.t("saveData")}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary" disabled title="${Utils.t(
        "waitingTokenGenerator"
      )}">
                <i class="fas fa-folder-open"></i>
                <span>${Utils.t("loadData")}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${Utils.t("saveToFile")}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file" disabled title="${Utils.t(
        "waitingTokenGenerator"
      )}">
                <i class="fas fa-upload"></i>
                <span>${Utils.t("loadFromFile")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
      const statsContainer = document.createElement("div");
      statsContainer.id = "wplace-stats-container";
      statsContainer.style.display = "none";
      statsContainer.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>${Utils.t("paintingStats")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="${Utils.t(
        "refreshCharges"
      )}">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="${Utils.t("closeStats")}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t(
        "initMessage"
      )}</div>
            </div>
          </div>
        </div>
      </div>
    `;
      const settingsContainer = document.createElement("div");
      settingsContainer.id = "wplace-settings-container";
      const themeBackground = theme.primary ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary || theme.primary} 100%)` : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
      settingsContainer.className = "wplace-settings-container-base wplace-settings-container-themed";
      settingsContainer.style.background = themeBackground;
      settingsContainer.style.setProperty("--theme-text", theme.text || "white");
      settingsContainer.style.setProperty("--theme-font-family", theme.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
      settingsContainer.style.setProperty("--theme-box-shadow", theme.boxShadow || "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)");
      settingsContainer.style.setProperty("--theme-backdrop-filter", theme.backdropFilter || "blur(10px)");
      settingsContainer.style.setProperty("--theme-highlight", theme.highlight || "#48dbfb");
      if ((_a = theme.animations) == null ? void 0 : _a.glow) {
        settingsContainer.classList.add("glow-effect");
        settingsContainer.style.setProperty("--theme-glow-color", theme.highlight || theme.neon || "#00ffff");
      }
      settingsContainer.innerHTML = `
      <div class="wplace-settings-header">
        <div class="wplace-settings-title-wrapper">
          <h3 class="wplace-settings-title">
            <i class="fas fa-cog wplace-settings-icon"></i>
            ${Utils.t("settings")}
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
              <option value="generator" ${state.tokenSource === "generator" ? "selected" : ""} class="wplace-settings-option">\u{1F916} Automatic Token Generator (Recommended)</option>
              <option value="hybrid" ${state.tokenSource === "hybrid" ? "selected" : ""} class="wplace-settings-option">\u{1F504} Generator + Auto Fallback</option>
              <option value="manual" ${state.tokenSource === "manual" ? "selected" : ""} class="wplace-settings-option">\u{1F3AF} Manual Pixel Placement</option>
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
            ${Utils.t("automation")}
          </label>
          <!-- Token generator is always enabled - settings moved to Token Source above -->
        </div>

        <!-- Overlay Settings Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-eye wplace-icon-eye"></i>
            Overlay Settings
          </label>
          <div class="wplace-settings-section-wrapper wplace-overlay-wrapper" style="
            background: ${theme.accent ? `${theme.accent}20` : "rgba(255,255,255,0.1)"}; 
            border-radius: ${theme.borderRadius || "12px"}; 
            padding: 18px; 
            border: 1px solid ${theme.accent || "rgba(255,255,255,0.1)"};
            ${((_b = theme.animations) == null ? void 0 : _b.glow) ? `
              box-shadow: 0 0 15px ${theme.accent || "rgba(255,255,255,0.1)"}33;
            ` : ""}
          ">
              <!-- Opacity Slider -->
              <div class="wplace-overlay-opacity-control">
                <div class="wplace-overlay-opacity-header">
                   <span class="wplace-overlay-opacity-label" style="color: ${theme.text || "white"};">Overlay Opacity</span>
                   <div id="overlayOpacityValue" class="wplace-overlay-opacity-value" style="
                     background: ${theme.secondary || "rgba(0,0,0,0.2)"}; 
                     color: ${theme.text || "white"};
                     padding: 4px 8px; 
                     border-radius: ${theme.borderRadius === "0" ? "0" : "6px"}; 
                     font-size: 12px;
                     border: 1px solid ${theme.accent || "transparent"};
                   ">${Math.round(state.overlayOpacity * 100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${state.overlayOpacity}" class="wplace-overlay-opacity-slider" style="
                  background: linear-gradient(to right, ${theme.highlight || "#48dbfb"} 0%, ${theme.purple || theme.neon || "#d3a4ff"} 100%); 
                  border-radius: ${theme.borderRadius === "0" ? "0" : "4px"}; 
                ">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" class="wplace-settings-toggle">
                  <div>
                      <span class="wplace-settings-toggle-title" style="color: ${theme.text || "white"};">Blue Marble Effect</span>
                      <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : "rgba(255,255,255,0.7)"};">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${state.blueMarbleEnabled ? "checked" : ""} class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || "#48dbfb"};
                  "/>
              </label>
          </div>
        </div>

        <!-- Paint Options Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-paint-brush wplace-icon-paint"></i>
            ${Utils.t("paintOptions")}
          </label>
          <!-- Pixel Filter Toggles -->
          <div id="pixelFilterControls" class="wplace-settings-section-wrapper wplace-pixel-filter-controls">
            <!-- Paint White Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" >
                  ${Utils.t("paintWhitePixels")}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : "rgba(255,255,255,0.7)"};">
                  ${Utils.t("paintWhitePixelsDescription")}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintWhiteToggle" ${state.paintWhitePixels ? "checked" : ""} 
                class="wplace-settings-checkbox"
                />
            </label>
            
            <!-- Paint Transparent Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" >
                  ${Utils.t("paintTransparentPixels")}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : "rgba(255,255,255,0.7)"};">
                  ${Utils.t("paintTransparentPixelsDescription")}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintTransparentToggle" ${state.paintTransparentPixels ? "checked" : ""} 
                class="wplace-settings-checkbox"
                />
            </label>
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${theme.text || "white"};">${Utils.t("paintUnavailablePixels")}</span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : "rgba(255,255,255,0.7)"};">${Utils.t("paintUnavailablePixelsDescription")}</p>
              </div>
              <input type="checkbox" id="paintUnavailablePixelsToggle" ${state.paintUnavailablePixels ? "checked" : ""} class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || "#48dbfb"};
                  "/>
            </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-tachometer-alt wplace-icon-speed"></i>
            ${Utils.t("paintingSpeed")}
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
              <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}" class="wplace-speed-slider">
              <div class="wplace-speed-labels">
                <span class="wplace-speed-min">\u{1F422} ${CONFIG.PAINTING_SPEED.MIN}</span>
                <span class="wplace-speed-max">${CONFIG.PAINTING_SPEED.MAX} \u{1F407}</span>
              </div>
              <div class="wplace-speed-controls">
                <div class="wplace-speed-input-group">
                  <button id="speedDecrease" class="wplace-input-btn wplace-input-btn-small" type="button">-</button>
                  <input type="number" id="speedInput" class="wplace-speed-input" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}">
                  <button id="speedIncrease" class="wplace-input-btn wplace-input-btn-small" type="button">+</button>
                </div>
                <span class="wplace-speed-unit">pixels</span>
              </div>
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
                <input type="number" id="randomBatchMin" min="1" max="1000" value="${CONFIG.RANDOM_BATCH_RANGE.MIN}" class="wplace-settings-number-input">
              </div>
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-up wplace-icon-max"></i>
                  Maximum Batch Size
                </label>
                <input type="number" id="randomBatchMax" min="1" max="1000" value="${CONFIG.RANDOM_BATCH_RANGE.MAX}" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-random-batch-description">
              \u{1F3B2} Random batch size between min and max values
            </p>
          </div>
          
          <!-- Speed Control Toggle -->
          <label class="wplace-speed-control-toggle">
            <input type="checkbox" id="enableSpeedToggle" ${CONFIG.PAINTING_SPEED_ENABLED ? "checked" : ""} class="wplace-speed-checkbox"/>
            <span>${Utils.t("enablePaintingSpeedLimit")}</span>
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
                <span class="wplace-settings-toggle-title" style="color: ${theme.text || "white"};">Snake Pattern</span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : "rgba(255,255,255,0.7)"};">Alternate direction for each row/column (zigzag pattern)</p>
              </div>
              <input type="checkbox" id="coordinateSnakeToggle" ${state.coordinateSnake ? "checked" : ""} class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || "#48dbfb"};
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
              <span>${Utils.t("enableNotifications")}</span>
              <input type="checkbox" id="notifEnabledToggle" ${state.notificationsEnabled ? "checked" : ""} class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${Utils.t("notifyOnChargesThreshold")}</span>
              <input type="checkbox" id="notifOnChargesToggle" ${state.notifyOnChargesReached ? "checked" : ""} class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${Utils.t("onlyWhenNotFocused")}</span>
              <input type="checkbox" id="notifOnlyUnfocusedToggle" ${state.notifyOnlyWhenUnfocused ? "checked" : ""} class="wplace-notification-checkbox" />
            </label>
            <div class="wplace-notification-interval">
              <span>${Utils.t("repeatEvery")}</span>
              <input type="number" id="notifIntervalInput" min="1" max="60" value="${state.notificationIntervalMinutes}" class="wplace-notification-interval-input" />
              <span>${Utils.t("minutesPl")}</span>
            </div>
            <div class="wplace-notification-buttons">
              <button id="notifRequestPermBtn" class="wplace-btn wplace-btn-secondary wplace-notification-perm-btn"><i class="fas fa-unlock"></i><span>${Utils.t(
        "grantPermission"
      )}</span></button>
              <button id="notifTestBtn" class="wplace-btn wplace-notification-test-btn"><i class="fas fa-bell"></i><span>${Utils.t(
        "test"
      )}</span></button>
            </div>
          </div>
        </div>

        <!-- Theme Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-palette wplace-icon-palette"></i>
            ${Utils.t("themeSettings")}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="themeSelect" class="wplace-settings-select">
              ${Object.keys(CONFIG.THEMES).map(
        (themeName) => `<option value="${themeName}" ${CONFIG.currentTheme === themeName ? "selected" : ""} class="wplace-settings-option">${themeName}</option>`
      ).join("")}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-globe wplace-icon-globe"></i>
            ${Utils.t("language")}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="languageSelect" class="wplace-settings-select">
              <option value="vi" ${state.language === "vi" ? "selected" : ""} class="wplace-settings-option">\u{1F1FB}\u{1F1F3} Ti\u1EBFng Vi\u1EC7t</option>
              <option value="id" ${state.language === "id" ? "selected" : ""} class="wplace-settings-option">\u{1F1EE}\u{1F1E9} Bahasa Indonesia</option>
              <option value="ru" ${state.language === "ru" ? "selected" : ""} class="wplace-settings-option">\u{1F1F7}\u{1F1FA} \u0420\u0443\u0441\u0441\u043A\u0438\u0439</option>
              <option value="uk" ${state.language === "uk" ? "selected" : ""} class="wplace-settings-option">\u{1F1FA}\u{1F1E6} \u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430</option>
              <option value="en" ${state.language === "en" ? "selected" : ""} class="wplace-settings-option">\u{1F1FA}\u{1F1F8} English</option>
              <option value="pt" ${state.language === "pt" ? "selected" : ""} class="wplace-settings-option">\u{1F1E7}\u{1F1F7} Portugu\xEAs</option>
              <option value="fr" ${state.language === "fr" ? "selected" : ""} class="wplace-settings-option">\u{1F1EB}\u{1F1F7} Fran\xE7ais</option>
              <option value="tr" ${state.language === "tr" ? "selected" : ""} class="wplace-settings-option">\u{1F1F9}\u{1F1F7} T\xFCrk\xE7e</option>
              <option value="zh-CN" ${state.language === "zh-CN" ? "selected" : ""} class="wplace-settings-option">\u{1F1E8}\u{1F1F3} \u7B80\u4F53\u4E2D\u6587</option>
              <option value="zh-TW" ${state.language === "zh-TW" ? "selected" : ""} class="wplace-settings-option">\u{1F1F9}\u{1F1FC} \u7E41\u9AD4\u4E2D\u6587</option>
              <option value="ja" ${state.language === "ja" ? "selected" : ""} class="wplace-settings-option">\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E</option>
              <option value="ko" ${state.language === "ko" ? "selected" : ""} class="wplace-settings-option">\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4</option>
              </select>
          </div>
        </div>
      </div>

        <div class="wplace-settings-footer">
             <button id="applySettingsBtn" class="wplace-settings-apply-btn">
                 <i class="fas fa-check"></i> ${Utils.t("applySettings")}
          </button>
        </div>
    `;
      const resizeContainer = document.createElement("div");
      resizeContainer.className = "resize-container";
      resizeContainer.innerHTML = `
      <h3 class="resize-dialog-title">${Utils.t("resizeImage")}</h3>
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
          ${Utils.t("keepAspectRatio")}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintWhiteToggle" checked>
            ${Utils.t("paintWhitePixels")}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintTransparentToggle" checked>
            ${Utils.t("paintTransparentPixels")}
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
        "zoomOut"
      )}"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider resize-zoom-slider" min="0.1" max="20" value="1" step="0.05">
          <button id="zoomInBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
        "zoomIn"
      )}"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
        "fitToView"
      )}">${Utils.t("fit")}</button>
          <button id="zoomActualBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
        "actualSize"
      )}">${Utils.t("hundred")}</button>
          <button id="panModeBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t("panMode")}">
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
                      <span>${Utils.t("showAllColorsIncluding")}</span>
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
              <option value="lab" ${state.colorMatchingAlgorithm === "lab" ? "selected" : ""}>Perceptual (Lab)</option>
            <option value="legacy" ${state.colorMatchingAlgorithm === "legacy" ? "selected" : ""}>Legacy (RGB)</option>
            </select>
          </label>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Chroma Penalty</span>
              <div class="resize-advanced-description">Preserve vivid colors (Lab only)</div>
            </div>
            <input type="checkbox" id="enableChromaPenaltyToggle" ${state.enableChromaPenalty ? "checked" : ""} class="resize-advanced-checkbox" />
          </label>
          <div class="resize-chroma-weight-control">
            <div class="resize-chroma-weight-header">
              <span>${Utils.t("chromaWeight")}</span>
              <span id="chromaWeightValue" class="resize-chroma-weight-value">${state.chromaPenaltyWeight}</span>
            </div>
            <input type="range" id="chromaPenaltyWeightSlider" min="0" max="0.5" step="0.01" value="${state.chromaPenaltyWeight}" class="resize-chroma-weight-slider" />
          </div>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Enable Dithering</span>
              <div class="resize-advanced-description">Floyd\u2013Steinberg error diffusion in preview and applied output</div>
            </div>
            <input type="checkbox" id="enableDitheringToggle" ${state.ditheringEnabled ? "checked" : ""} class="resize-advanced-checkbox" />
          </label>
          <div class="resize-threshold-controls">
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">Transparency</span>
              <input type="number" id="transparencyThresholdInput" min="0" max="255" value="${state.customTransparencyThreshold}" class="resize-threshold-input" />
            </label>
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">White Thresh</span>
              <input type="number" id="whiteThresholdInput" min="200" max="255" value="${state.customWhiteThreshold}" class="resize-threshold-input" />
            </label>
          </div>
          <button id="resetAdvancedColorBtn" class="wplace-btn resize-reset-advanced-btn">Reset Advanced</button>
        </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>${Utils.t("downloadPreview")}</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>${Utils.t("apply")}</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>${Utils.t("cancel")}</span>
        </button>
      </div>
    `;
      const resizeOverlay = document.createElement("div");
      resizeOverlay.className = "resize-overlay";
      document.body.appendChild(container);
      document.body.appendChild(resizeOverlay);
      document.body.appendChild(resizeContainer);
      document.body.appendChild(statsContainer);
      document.body.appendChild(settingsContainer);
      container.style.display = "block";
      const uploadBtn = container.querySelector("#uploadBtn");
      const resizeBtn = container.querySelector("#resizeBtn");
      const selectPosBtn = container.querySelector("#selectPosBtn");
      const startBtn = container.querySelector("#startBtn");
      const stopBtn = container.querySelector("#stopBtn");
      const saveBtn = container.querySelector("#saveBtn");
      const loadBtn = container.querySelector("#loadBtn");
      const saveToFileBtn = container.querySelector("#saveToFileBtn");
      const loadFromFileBtn = container.querySelector("#loadFromFileBtn");
      container.querySelectorAll(".wplace-section-title").forEach((title) => {
        if (!title.querySelector("i.arrow")) {
          const arrow = document.createElement("i");
          arrow.className = "fas fa-chevron-down arrow";
          title.appendChild(arrow);
        }
        title.addEventListener("click", () => {
          const section = title.parentElement;
          section.classList.toggle("collapsed");
        });
      });
      if (loadBtn) {
        loadBtn.disabled = !state.initialSetupComplete;
        loadBtn.title = state.initialSetupComplete ? "" : "\u{1F504} Waiting for initial setup to complete...";
      }
      if (loadFromFileBtn) {
        loadFromFileBtn.disabled = !state.initialSetupComplete;
        loadFromFileBtn.title = state.initialSetupComplete ? "" : "\u{1F504} Waiting for initial setup to complete...";
      }
      if (uploadBtn) {
        uploadBtn.disabled = !state.initialSetupComplete;
        uploadBtn.title = state.initialSetupComplete ? "" : "\u{1F504} Waiting for initial setup to complete...";
      }
      const minimizeBtn = container.querySelector("#minimizeBtn");
      const compactBtn = container.querySelector("#compactBtn");
      const statsBtn = container.querySelector("#statsBtn");
      const toggleOverlayBtn = container.querySelector("#toggleOverlayBtn");
      const statusText = container.querySelector("#statusText");
      const progressBar = container.querySelector("#progressBar");
      const statsArea = statsContainer.querySelector("#statsArea");
      const content = container.querySelector(".wplace-content");
      const closeStatsBtn = statsContainer.querySelector("#closeStatsBtn");
      const refreshChargesBtn = statsContainer.querySelector("#refreshChargesBtn");
      const cooldownSlider = container.querySelector("#cooldownSlider");
      const cooldownInput = container.querySelector("#cooldownInput");
      const cooldownDecrease = container.querySelector("#cooldownDecrease");
      const cooldownIncrease = container.querySelector("#cooldownIncrease");
      const cooldownValue = container.querySelector("#cooldownValue");
      if (!uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
        console.error("Some UI elements not found:", {
          uploadBtn: !!uploadBtn,
          selectPosBtn: !!selectPosBtn,
          startBtn: !!startBtn,
          stopBtn: !!stopBtn
        });
      }
      if (!statsContainer || !statsArea || !closeStatsBtn) {
      }
      const header = container.querySelector(".wplace-header");
      makeDraggable(container);
      function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        const header2 = element.querySelector(".wplace-header") || element.querySelector(".wplace-settings-header");
        if (!header2) {
          console.warn("No draggable header found for element:", element);
          return;
        }
        header2.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
          if (e.target.closest(".wplace-header-btn") || e.target.closest("button"))
            return;
          e.preventDefault();
          isDragging = true;
          const rect = element.getBoundingClientRect();
          element.style.transform = "none";
          element.style.top = rect.top + "px";
          element.style.left = rect.left + "px";
          pos3 = e.clientX;
          pos4 = e.clientY;
          element.classList.add("wplace-dragging");
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
          document.body.style.userSelect = "none";
        }
        function elementDrag(e) {
          if (!isDragging)
            return;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          let newTop = element.offsetTop - pos2;
          let newLeft = element.offsetLeft - pos1;
          const rect = element.getBoundingClientRect();
          const maxTop = window.innerHeight - rect.height;
          const maxLeft = window.innerWidth - rect.width;
          newTop = Math.max(0, Math.min(newTop, maxTop));
          newLeft = Math.max(0, Math.min(newLeft, maxLeft));
          element.style.top = newTop + "px";
          element.style.left = newLeft + "px";
        }
        function closeDragElement() {
          isDragging = false;
          element.classList.remove("wplace-dragging");
          document.onmouseup = null;
          document.onmousemove = null;
          document.body.style.userSelect = "";
        }
      }
      makeDraggable(statsContainer);
      makeDraggable(container);
      if (statsBtn && closeStatsBtn) {
        statsBtn.addEventListener("click", () => {
          const isVisible = statsContainer.style.display !== "none";
          if (isVisible) {
            statsContainer.style.display = "none";
            statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
            statsBtn.title = Utils.t("showStats");
          } else {
            statsContainer.style.display = "block";
            statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
            statsBtn.title = Utils.t("hideStats");
          }
        });
        closeStatsBtn.addEventListener("click", () => {
          statsContainer.style.display = "none";
          statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
          statsBtn.title = Utils.t("showStats");
        });
        if (refreshChargesBtn) {
          refreshChargesBtn.addEventListener("click", async () => {
            refreshChargesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            refreshChargesBtn.disabled = true;
            try {
              await updateStats(true);
            } catch (error) {
              console.error("Error refreshing charges:", error);
            } finally {
              refreshChargesBtn.innerHTML = '<i class="fas fa-sync"></i>';
              refreshChargesBtn.disabled = false;
            }
          });
        }
      }
      if (statsContainer && statsBtn) {
        statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
        statsBtn.title = Utils.t("showStats");
      }
      const settingsBtn = container.querySelector("#settingsBtn");
      const closeSettingsBtn = settingsContainer.querySelector("#closeSettingsBtn");
      const applySettingsBtn = settingsContainer.querySelector("#applySettingsBtn");
      if (settingsBtn && closeSettingsBtn && applySettingsBtn) {
        settingsBtn.addEventListener("click", () => {
          const isVisible = settingsContainer.classList.contains("show");
          if (isVisible) {
            settingsContainer.style.animation = "settings-fade-out 0.3s ease-out forwards";
            settingsContainer.classList.remove("show");
            setTimeout(() => {
              settingsContainer.style.animation = "";
            }, 300);
          } else {
            settingsContainer.style.top = "50%";
            settingsContainer.style.left = "50%";
            settingsContainer.style.transform = "translate(-50%, -50%)";
            settingsContainer.classList.add("show");
            settingsContainer.style.animation = "settings-slide-in 0.4s ease-out";
          }
        });
        closeSettingsBtn.addEventListener("click", () => {
          settingsContainer.style.animation = "settings-fade-out 0.3s ease-out forwards";
          settingsContainer.classList.remove("show");
          setTimeout(() => {
            settingsContainer.style.animation = "";
            settingsContainer.style.top = "50%";
            settingsContainer.style.left = "50%";
            settingsContainer.style.transform = "translate(-50%, -50%)";
          }, 300);
        });
        applySettingsBtn.addEventListener("click", () => {
          const colorAlgorithmSelect = document.getElementById("colorAlgorithmSelect");
          if (colorAlgorithmSelect)
            state.colorMatchingAlgorithm = colorAlgorithmSelect.value;
          const enableChromaPenaltyToggle = document.getElementById("enableChromaPenaltyToggle");
          if (enableChromaPenaltyToggle)
            state.enableChromaPenalty = enableChromaPenaltyToggle.checked;
          const chromaPenaltyWeightSlider = document.getElementById("chromaPenaltyWeightSlider");
          if (chromaPenaltyWeightSlider)
            state.chromaPenaltyWeight = parseFloat(chromaPenaltyWeightSlider.value) || 0.15;
          const transparencyThresholdInput = document.getElementById("transparencyThresholdInput");
          if (transparencyThresholdInput) {
            const v = parseInt(transparencyThresholdInput.value, 10);
            if (!isNaN(v) && v >= 0 && v <= 255)
              state.customTransparencyThreshold = v;
          }
          const whiteThresholdInput = document.getElementById("whiteThresholdInput");
          if (whiteThresholdInput) {
            const v = parseInt(whiteThresholdInput.value, 10);
            if (!isNaN(v) && v >= 200 && v <= 255)
              state.customWhiteThreshold = v;
          }
          CONFIG.TRANSPARENCY_THRESHOLD = state.customTransparencyThreshold;
          CONFIG.WHITE_THRESHOLD = state.customWhiteThreshold;
          const notifEnabledToggle = document.getElementById("notifEnabledToggle");
          const notifOnChargesToggle = document.getElementById("notifOnChargesToggle");
          const notifOnlyUnfocusedToggle = document.getElementById("notifOnlyUnfocusedToggle");
          const notifIntervalInput = document.getElementById("notifIntervalInput");
          if (notifEnabledToggle)
            state.notificationsEnabled = !!notifEnabledToggle.checked;
          if (notifOnChargesToggle)
            state.notifyOnChargesReached = !!notifOnChargesToggle.checked;
          if (notifOnlyUnfocusedToggle)
            state.notifyOnlyWhenUnfocused = !!notifOnlyUnfocusedToggle.checked;
          if (notifIntervalInput) {
            const v = parseInt(notifIntervalInput.value, 10);
            if (!isNaN(v) && v >= 1 && v <= 60)
              state.notificationIntervalMinutes = v;
          }
          saveBotSettings();
          Utils.showAlert(Utils.t("settingsSaved"), "success");
          closeSettingsBtn.click();
          NotificationManager.syncFromState();
        });
        makeDraggable(settingsContainer);
        const tokenSourceSelect = settingsContainer.querySelector("#tokenSourceSelect");
        if (tokenSourceSelect) {
          tokenSourceSelect.addEventListener("change", (e) => {
            state.tokenSource = e.target.value;
            saveBotSettings();
            console.log(`\u{1F511} Token source changed to: ${state.tokenSource}`);
            const sourceNames = {
              generator: "Automatic Generator",
              hybrid: "Generator + Auto Fallback",
              manual: "Manual Pixel Placement"
            };
            Utils.showAlert(
              Utils.t("tokenSourceSet", { source: sourceNames[state.tokenSource] }),
              "success"
            );
          });
        }
        const batchModeSelect = settingsContainer.querySelector("#batchModeSelect");
        const normalBatchControls = settingsContainer.querySelector("#normalBatchControls");
        const randomBatchControls = settingsContainer.querySelector("#randomBatchControls");
        const randomBatchMin = settingsContainer.querySelector("#randomBatchMin");
        const randomBatchMax = settingsContainer.querySelector("#randomBatchMax");
        if (batchModeSelect) {
          batchModeSelect.addEventListener("change", (e) => {
            state.batchMode = e.target.value;
            if (normalBatchControls && randomBatchControls) {
              if (e.target.value === "random") {
                normalBatchControls.style.display = "none";
                randomBatchControls.style.display = "block";
              } else {
                normalBatchControls.style.display = "block";
                randomBatchControls.style.display = "none";
              }
            }
            saveBotSettings();
            console.log(`\u{1F4E6} Batch mode changed to: ${state.batchMode}`);
            Utils.showAlert(
              Utils.t("batchModeSet", {
                mode: state.batchMode === "random" ? Utils.t("randomRange") : Utils.t("normalFixedSize")
              }),
              "success"
            );
          });
        }
        if (randomBatchMin) {
          randomBatchMin.addEventListener("input", (e) => {
            const min = parseInt(e.target.value);
            if (min >= 1 && min <= 1e3) {
              state.randomBatchMin = min;
              if (randomBatchMax && min > state.randomBatchMax) {
                state.randomBatchMax = min;
                randomBatchMax.value = min;
              }
              saveBotSettings();
            }
          });
        }
        if (randomBatchMax) {
          randomBatchMax.addEventListener("input", (e) => {
            const max = parseInt(e.target.value);
            if (max >= 1 && max <= 1e3) {
              state.randomBatchMax = max;
              if (randomBatchMin && max < state.randomBatchMin) {
                state.randomBatchMin = max;
                randomBatchMin.value = max;
              }
              saveBotSettings();
            }
          });
        }
        const languageSelect = settingsContainer.querySelector("#languageSelect");
        if (languageSelect) {
          languageSelect.addEventListener("change", async (e) => {
            const newLanguage = e.target.value;
            state.language = newLanguage;
            localStorage.setItem("wplace_language", newLanguage);
            await loadTranslations(newLanguage);
            setTimeout(() => {
              settingsContainer.style.display = "none";
              createUI();
            }, 100);
          });
        }
        const themeSelect = settingsContainer.querySelector("#themeSelect");
        if (themeSelect) {
          themeSelect.addEventListener("change", (e) => {
            const newTheme = e.target.value;
            switchTheme(newTheme);
          });
        }
        const overlayOpacitySlider = settingsContainer.querySelector("#overlayOpacitySlider");
        const overlayOpacityValue = settingsContainer.querySelector("#overlayOpacityValue");
        const enableBlueMarbleToggle = settingsContainer.querySelector("#enableBlueMarbleToggle");
        const settingsPaintWhiteToggle = settingsContainer.querySelector("#settingsPaintWhiteToggle");
        const settingsPaintTransparentToggle = settingsContainer.querySelector(
          "#settingsPaintTransparentToggle"
        );
        if (overlayOpacitySlider && overlayOpacityValue) {
          overlayOpacitySlider.addEventListener("input", (e) => {
            const opacity = parseFloat(e.target.value);
            state.overlayOpacity = opacity;
            overlayOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
          });
        }
        if (settingsPaintWhiteToggle) {
          settingsPaintWhiteToggle.checked = state.paintWhitePixels;
          settingsPaintWhiteToggle.addEventListener("change", (e) => {
            state.paintWhitePixels = e.target.checked;
            saveBotSettings();
            console.log(`\u{1F3A8} Paint white pixels: ${state.paintWhitePixels ? "ON" : "OFF"}`);
            const statusText2 = state.paintWhitePixels ? "White pixels in the template will be painted" : "White pixels will be skipped";
            Utils.showAlert(statusText2, "success");
          });
        }
        if (settingsPaintTransparentToggle) {
          settingsPaintTransparentToggle.checked = state.paintTransparentPixels;
          settingsPaintTransparentToggle.addEventListener("change", (e) => {
            state.paintTransparentPixels = e.target.checked;
            saveBotSettings();
            console.log(
              `\u{1F3A8} Paint transparent pixels: ${state.paintTransparentPixels ? "ON" : "OFF"}`
            );
            const statusText2 = state.paintTransparentPixels ? "Transparent pixels in the template will be painted with the closest available color" : "Transparent pixels will be skipped";
            Utils.showAlert(statusText2, "success");
          });
        }
        const speedSlider = settingsContainer.querySelector("#speedSlider");
        const speedInput = settingsContainer.querySelector("#speedInput");
        const speedDecrease = settingsContainer.querySelector("#speedDecrease");
        const speedIncrease = settingsContainer.querySelector("#speedIncrease");
        if (speedSlider && speedInput) {
          const updateSpeed = (newValue, source) => {
            const speed = Math.max(CONFIG.PAINTING_SPEED.MIN, Math.min(CONFIG.PAINTING_SPEED.MAX, parseInt(newValue)));
            state.paintingSpeed = speed;
            if (source !== "slider")
              speedSlider.value = speed;
            if (source !== "input")
              speedInput.value = speed;
            saveBotSettings();
          };
          speedSlider.addEventListener("input", (e) => {
            updateSpeed(e.target.value, "slider");
          });
          speedInput.addEventListener("input", (e) => {
            updateSpeed(e.target.value, "input");
          });
          if (speedDecrease) {
            Utils.addHoldToRepeatListener(speedDecrease, () => {
              updateSpeed(parseInt(speedInput.value) - 1, "button");
            });
          }
          if (speedIncrease) {
            Utils.addHoldToRepeatListener(speedIncrease, () => {
              updateSpeed(parseInt(speedInput.value) + 1, "button");
            });
          }
        }
        if (enableBlueMarbleToggle) {
          enableBlueMarbleToggle.addEventListener("click", async () => {
            state.blueMarbleEnabled = enableBlueMarbleToggle.checked;
            if (state.imageLoaded && overlayManager.imageBitmap) {
              Utils.showAlert(Utils.t("reprocessingOverlay"), "info");
              await overlayManager.processImageIntoChunks();
              Utils.showAlert(Utils.t("overlayUpdated"), "success");
            }
          });
        }
        const notifPermBtn = settingsContainer.querySelector("#notifRequestPermBtn");
        const notifTestBtn = settingsContainer.querySelector("#notifTestBtn");
        if (notifPermBtn) {
          notifPermBtn.addEventListener("click", async () => {
            const perm = await NotificationManager.requestPermission();
            if (perm === "granted")
              Utils.showAlert(Utils.t("notificationsEnabled"), "success");
            else
              Utils.showAlert(Utils.t("notificationsPermissionDenied"), "warning");
          });
        }
        if (notifTestBtn) {
          notifTestBtn.addEventListener("click", () => {
            NotificationManager.notify(
              Utils.t("testNotificationTitle"),
              Utils.t("testNotificationMessage"),
              "wplace-notify-test",
              true
            );
          });
        }
      }
      const widthSlider = resizeContainer.querySelector("#widthSlider");
      const heightSlider = resizeContainer.querySelector("#heightSlider");
      const widthValue = resizeContainer.querySelector("#widthValue");
      const heightValue = resizeContainer.querySelector("#heightValue");
      const keepAspect = resizeContainer.querySelector("#keepAspect");
      const paintWhiteToggle = resizeContainer.querySelector("#paintWhiteToggle");
      const paintTransparentToggle = resizeContainer.querySelector("#paintTransparentToggle");
      const zoomSlider = resizeContainer.querySelector("#zoomSlider");
      const zoomValue = resizeContainer.querySelector("#zoomValue");
      const zoomInBtn = resizeContainer.querySelector("#zoomInBtn");
      const zoomOutBtn = resizeContainer.querySelector("#zoomOutBtn");
      const zoomFitBtn = resizeContainer.querySelector("#zoomFitBtn");
      const zoomActualBtn = resizeContainer.querySelector("#zoomActualBtn");
      const panModeBtn = resizeContainer.querySelector("#panModeBtn");
      const panStage = resizeContainer.querySelector("#resizePanStage");
      const canvasStack = resizeContainer.querySelector("#resizeCanvasStack");
      const baseCanvas = resizeContainer.querySelector("#resizeCanvas");
      const maskCanvas = resizeContainer.querySelector("#maskCanvas");
      const baseCtx = baseCanvas.getContext("2d");
      const maskCtx = maskCanvas.getContext("2d");
      const confirmResize = resizeContainer.querySelector("#confirmResize");
      const cancelResize = resizeContainer.querySelector("#cancelResize");
      const downloadPreviewBtn = resizeContainer.querySelector("#downloadPreviewBtn");
      const clearIgnoredBtn = resizeContainer.querySelector("#clearIgnoredBtn");
      const coordinateModeSelect = settingsContainer.querySelector("#coordinateModeSelect");
      const coordinateDirectionSelect = settingsContainer.querySelector("#coordinateDirectionSelect");
      const coordinateSnakeToggle = settingsContainer.querySelector("#coordinateSnakeToggle");
      const directionControls = settingsContainer.querySelector("#directionControls");
      const snakeControls = settingsContainer.querySelector("#snakeControls");
      const blockControls = settingsContainer.querySelector("#blockControls");
      const blockWidthInput = settingsContainer.querySelector("#blockWidthInput");
      const blockHeightInput = settingsContainer.querySelector("#blockHeightInput");
      const paintUnavailablePixelsToggle = settingsContainer.querySelector(
        "#paintUnavailablePixelsToggle"
      );
      if (paintUnavailablePixelsToggle) {
        paintUnavailablePixelsToggle.checked = state.paintUnavailablePixels;
        paintUnavailablePixelsToggle.addEventListener("change", (e) => {
          state.paintUnavailablePixels = e.target.checked;
          saveBotSettings();
          console.log(`\u{1F3A8} Paint unavailable colors: ${state.paintUnavailablePixels ? "ON" : "OFF"}`);
          const statusText2 = state.paintUnavailablePixels ? "Unavailable template colors will be painted with the closest available color" : "Unavailable template colors will be skipped";
          Utils.showAlert(statusText2, "success");
        });
      }
      if (coordinateModeSelect) {
        coordinateModeSelect.value = state.coordinateMode;
        coordinateModeSelect.addEventListener("change", (e) => {
          state.coordinateMode = e.target.value;
          Utils.updateCoordinateUI({
            mode: state.coordinateMode,
            directionControls,
            snakeControls,
            blockControls
          });
          saveBotSettings();
          console.log(`\u{1F504} Coordinate mode changed to: ${state.coordinateMode}`);
          Utils.showAlert(`Coordinate mode set to: ${state.coordinateMode}`, "success");
        });
      }
      if (coordinateDirectionSelect) {
        coordinateDirectionSelect.value = state.coordinateDirection;
        coordinateDirectionSelect.addEventListener("change", (e) => {
          state.coordinateDirection = e.target.value;
          saveBotSettings();
          console.log(`\u{1F9ED} Coordinate direction changed to: ${state.coordinateDirection}`);
          Utils.showAlert(`Coordinate direction set to: ${state.coordinateDirection}`, "success");
        });
      }
      if (coordinateSnakeToggle) {
        coordinateSnakeToggle.checked = state.coordinateSnake;
        coordinateSnakeToggle.addEventListener("change", (e) => {
          state.coordinateSnake = e.target.checked;
          saveBotSettings();
          console.log(`\u{1F40D} Snake pattern ${state.coordinateSnake ? "enabled" : "disabled"}`);
          Utils.showAlert(
            `Snake pattern ${state.coordinateSnake ? "enabled" : "disabled"}`,
            "success"
          );
        });
      }
      if (blockWidthInput) {
        blockWidthInput.value = state.blockWidth;
        blockWidthInput.addEventListener("input", (e) => {
          const width = parseInt(e.target.value);
          if (width >= 1 && width <= 50) {
            state.blockWidth = width;
            saveBotSettings();
          }
        });
      }
      if (blockHeightInput) {
        blockHeightInput.value = state.blockHeight;
        blockHeightInput.addEventListener("change", (e) => {
          const height = parseInt(e.target.value);
          if (height >= 1 && height <= 50) {
            state.blockHeight = height;
            saveBotSettings();
          }
        });
      }
      if (compactBtn) {
        compactBtn.addEventListener("click", () => {
          container.classList.toggle("wplace-compact");
          const isCompact = container.classList.contains("wplace-compact");
          if (isCompact) {
            compactBtn.innerHTML = '<i class="fas fa-expand"></i>';
            compactBtn.title = Utils.t("expandMode");
          } else {
            compactBtn.innerHTML = '<i class="fas fa-compress"></i>';
            compactBtn.title = Utils.t("compactMode");
          }
        });
      }
      if (minimizeBtn) {
        minimizeBtn.addEventListener("click", () => {
          state.minimized = !state.minimized;
          if (state.minimized) {
            container.classList.add("wplace-minimized");
            content.classList.add("wplace-hidden");
            minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
            minimizeBtn.title = Utils.t("restore");
          } else {
            container.classList.remove("wplace-minimized");
            content.classList.remove("wplace-hidden");
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            minimizeBtn.title = Utils.t("minimize");
          }
          saveBotSettings();
        });
      }
      if (toggleOverlayBtn) {
        toggleOverlayBtn.addEventListener("click", () => {
          const isEnabled = overlayManager.toggle();
          toggleOverlayBtn.classList.toggle("active", isEnabled);
          toggleOverlayBtn.setAttribute("aria-pressed", isEnabled ? "true" : "false");
          Utils.showAlert(isEnabled ? Utils.t("overlayEnabled") : Utils.t("overlayDisabled"), "info");
        });
      }
      if (state.minimized) {
        container.classList.add("wplace-minimized");
        content.classList.add("wplace-hidden");
        if (minimizeBtn) {
          minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
          minimizeBtn.title = Utils.t("restore");
        }
      } else {
        container.classList.remove("wplace-minimized");
        content.classList.remove("wplace-hidden");
        if (minimizeBtn) {
          minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
          minimizeBtn.title = Utils.t("minimize");
        }
      }
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          if (!state.imageLoaded) {
            Utils.showAlert(Utils.t("missingRequirements"), "error");
            return;
          }
          const success = Utils.saveProgress();
          if (success) {
            updateUI("autoSaved", "success");
            Utils.showAlert(Utils.t("autoSaved"), "success");
          } else {
            Utils.showAlert(Utils.t("errorSavingProgress"), "error");
          }
        });
      }
      if (loadBtn) {
        loadBtn.addEventListener("click", () => {
          if (!state.initialSetupComplete) {
            Utils.showAlert(Utils.t("pleaseWaitInitialSetup"), "warning");
            return;
          }
          const savedData = Utils.loadProgress();
          if (!savedData) {
            updateUI("noSavedData", "warning");
            Utils.showAlert(Utils.t("noSavedData"), "warning");
            return;
          }
          const confirmLoad = confirm(
            `${Utils.t("savedDataFound")}

Saved: ${new Date(savedData.timestamp).toLocaleString()}
Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels`
          );
          if (confirmLoad) {
            const success = Utils.restoreProgress(savedData);
            if (success) {
              updateUI("dataLoaded", "success");
              Utils.showAlert(Utils.t("dataLoaded"), "success");
              updateDataButtons();
              updateStats();
              Utils.restoreOverlayFromData().catch((error) => {
                console.error("Failed to restore overlay from localStorage:", error);
              });
              if (!state.colorsChecked) {
                uploadBtn.disabled = false;
              } else {
                uploadBtn.disabled = false;
                selectPosBtn.disabled = false;
              }
              if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
                startBtn.disabled = false;
              }
            } else {
              Utils.showAlert(Utils.t("errorLoadingProgress"), "error");
            }
          }
        });
      }
      if (saveToFileBtn) {
        saveToFileBtn.addEventListener("click", () => {
          const success = Utils.saveProgressToFile();
          if (success) {
            updateUI("fileSaved", "success");
            Utils.showAlert(Utils.t("fileSaved"), "success");
          } else {
            Utils.showAlert(Utils.t("fileError"), "error");
          }
        });
      }
      if (loadFromFileBtn) {
        loadFromFileBtn.addEventListener("click", async () => {
          if (!state.initialSetupComplete) {
            Utils.showAlert(Utils.t("pleaseWaitFileSetup"), "warning");
            return;
          }
          try {
            const success = await Utils.loadProgressFromFile();
            if (success) {
              updateUI("fileLoaded", "success");
              Utils.showAlert(Utils.t("fileLoaded"), "success");
              updateDataButtons();
              await updateStats();
              await Utils.restoreOverlayFromData().catch((error) => {
                console.error("Failed to restore overlay from file:", error);
              });
              if (state.colorsChecked) {
                uploadBtn.disabled = false;
                selectPosBtn.disabled = false;
                resizeBtn.disabled = false;
              } else {
                uploadBtn.disabled = false;
              }
              if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
                startBtn.disabled = false;
              }
            }
          } catch (error) {
            if (error.message === "Invalid JSON file") {
              Utils.showAlert(Utils.t("invalidFileFormat"), "error");
            } else {
              Utils.showAlert(Utils.t("fileError"), "error");
            }
          }
        });
      }
      updateUI = (messageKey, type = "default", params = {}, silent = false) => {
        const message = Utils.t(messageKey, params);
        statusText.textContent = message;
        statusText.className = `wplace-status status-${type}`;
        if (!silent) {
          statusText.style.animation = "none";
          void statusText.offsetWidth;
          statusText.style.animation = "slide-in 0.3s ease-out";
        }
      };
      function updateChargeStatsDisplay(intervalMs) {
        const currentChargesEl = document.getElementById("wplace-stat-charges-value");
        const fullChargeEl = document.getElementById("wplace-stat-fullcharge-value");
        if (!fullChargeEl && !currentChargesEl)
          return;
        if (!state.fullChargeData) {
          fullChargeEl.textContent = "--:--:--";
          return;
        }
        const { current, max, cooldownMs, startTime, spentSinceShot } = state.fullChargeData;
        const elapsed = Date.now() - startTime;
        const chargesGained = elapsed / cooldownMs;
        const rawCharges = current + chargesGained - spentSinceShot;
        const cappedCharges = Math.min(rawCharges, max);
        let displayCharges;
        const fraction = cappedCharges - Math.floor(cappedCharges);
        if (fraction >= 0.95) {
          displayCharges = Math.ceil(cappedCharges);
        } else {
          displayCharges = Math.floor(cappedCharges);
        }
        state.displayCharges = Math.max(0, displayCharges);
        state.preciseCurrentCharges = cappedCharges;
        const remainingMs = getMsToTargetCharges(cappedCharges, max, state.cooldown, intervalMs);
        const timeText = Utils.msToTimeText(remainingMs);
        if (currentChargesEl) {
          currentChargesEl.innerHTML = `${state.displayCharges} / ${state.maxCharges}`;
        }
        if (state.displayCharges < state.cooldownChargeThreshold && !state.stopFlag && state.running) {
          updateChargesThresholdUI(intervalMs);
        }
        if (fullChargeEl) {
          if (state.displayCharges >= max) {
            fullChargeEl.innerHTML = `<span style="color:#10b981;">FULL</span>`;
          } else {
            fullChargeEl.innerHTML = `
            <span style="color:#f59e0b;">${timeText}</span>
          `;
          }
        }
      }
      updateStats = async (isManualRefresh = false) => {
        var _a2, _b2;
        const isForcedRefresh = isManualRefresh;
        const isFirstCheck = !((_a2 = state.fullChargeData) == null ? void 0 : _a2.startTime);
        const minUpdateInterval = 6e4;
        const maxUpdateInterval = 9e4;
        const randomUpdateThreshold = minUpdateInterval + Math.random() * (maxUpdateInterval - minUpdateInterval);
        const timeSinceLastUpdate = Date.now() - (((_b2 = state.fullChargeData) == null ? void 0 : _b2.startTime) || 0);
        const isTimeToUpdate = timeSinceLastUpdate >= randomUpdateThreshold;
        const shouldCallApi = isForcedRefresh || isFirstCheck || isTimeToUpdate;
        if (shouldCallApi) {
          const { charges, max, cooldown } = await WPlaceService.getCharges();
          state.displayCharges = Math.floor(charges);
          state.preciseCurrentCharges = charges;
          state.cooldown = cooldown;
          state.maxCharges = Math.floor(max) > 1 ? Math.floor(max) : state.maxCharges;
          state.fullChargeData = {
            current: charges,
            max,
            cooldownMs: cooldown,
            startTime: Date.now(),
            spentSinceShot: 0
          };
          NotificationManager.maybeNotifyChargesReached();
        }
        if (state.fullChargeInterval) {
          clearInterval(state.fullChargeInterval);
          state.fullChargeInterval = null;
        }
        const intervalMs = 1e3;
        state.fullChargeInterval = setInterval(
          () => updateChargeStatsDisplay(intervalMs),
          intervalMs
        );
        if (cooldownSlider && cooldownSlider.max !== state.maxCharges) {
          cooldownSlider.max = state.maxCharges;
        }
        if (cooldownInput && cooldownInput.max !== state.maxCharges) {
          cooldownInput.max = state.maxCharges;
        }
        let imageStatsHTML = "";
        if (state.imageLoaded) {
          const progress = state.totalPixels > 0 ? Math.round(state.paintedPixels / state.totalPixels * 100) : 0;
          const remainingPixels = state.totalPixels - state.paintedPixels;
          state.estimatedTime = Utils.calculateEstimatedTime(
            remainingPixels,
            state.displayCharges,
            state.cooldown
          );
          progressBar.style.width = `${progress}%`;
          imageStatsHTML = `
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t("progress")}</div>
            <div class="wplace-stat-value">${progress}%</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t(
            "pixels"
          )}</div>
            <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${Utils.t(
            "estimatedTime"
          )}</div>
            <div class="wplace-stat-value">${Utils.formatTime(state.estimatedTime)}</div>
          </div>
        `;
        }
        let colorSwatchesHTML = "";
        state.availableColors = state.availableColors.filter(
          (c) => c.name !== "Unknown CoIor NaN" && c.id !== null
        );
        const availableColors = Utils.extractAvailableColors();
        const newCount = Array.isArray(availableColors) ? availableColors.length : 0;
        if (newCount === 0 && isManualRefresh) {
          Utils.showAlert(Utils.t("noColorsFound"), "warning");
        } else if (newCount > 0 && state.availableColors.length < newCount) {
          const oldCount = state.availableColors.length;
          Utils.showAlert(
            Utils.t("colorsUpdated", {
              oldCount,
              newCount,
              diffCount: newCount - oldCount
            }),
            "success"
          );
          state.availableColors = availableColors;
        }
        if (state.colorsChecked) {
          colorSwatchesHTML = state.availableColors.map((color) => {
            const rgbString = `rgb(${color.rgb.join(",")})`;
            return `<div class="wplace-stat-color-swatch" style="background-color: ${rgbString};" title="${Utils.t(
              "colorTooltip",
              { id: color.id, rgb: color.rgb.join(", ") }
            )}"></div>`;
          }).join("");
        }
        statsArea.innerHTML = `
            ${imageStatsHTML}
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-bolt"></i> ${Utils.t("charges")}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-charges-value">
                ${state.displayCharges} / ${state.maxCharges}
              </div>
            </div>
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-battery-half"></i> ${Utils.t("fullChargeIn")}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-fullcharge-value">--:--:--</div>
            </div>
            ${state.colorsChecked ? `
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${Utils.t(
          "availableColors",
          { count: state.availableColors.length }
        )}</div>
                <div class="wplace-stat-colors-grid">
                    ${colorSwatchesHTML}
                </div>
            </div>
            ` : ""}
        `;
        updateChargeStatsDisplay(intervalMs);
      };
      updateDataButtons = () => {
        const hasImageData = state.imageLoaded && state.imageData;
        saveBtn.disabled = !hasImageData;
        saveToFileBtn.disabled = !hasImageData;
      };
      updateDataButtons();
      function showResizeDialog(processor) {
        var _a2;
        let baseProcessor = processor;
        let width, height;
        if ((_a2 = state.originalImage) == null ? void 0 : _a2.dataUrl) {
          baseProcessor = new ImageProcessor(state.originalImage.dataUrl);
          width = state.originalImage.width;
          height = state.originalImage.height;
        } else {
          const dims = processor.getDimensions();
          width = dims.width;
          height = dims.height;
        }
        const aspectRatio = width / height;
        const rs = state.resizeSettings;
        widthSlider.max = width * 2;
        heightSlider.max = height * 2;
        let initialW = width;
        let initialH = height;
        if (rs && Number.isFinite(rs.width) && Number.isFinite(rs.height) && rs.width > 0 && rs.height > 0) {
          initialW = rs.width;
          initialH = rs.height;
        }
        initialW = Math.max(
          parseInt(widthSlider.min, 10) || 10,
          Math.min(initialW, parseInt(widthSlider.max, 10))
        );
        initialH = Math.max(
          parseInt(heightSlider.min, 10) || 10,
          Math.min(initialH, parseInt(heightSlider.max, 10))
        );
        widthSlider.value = initialW;
        heightSlider.value = initialH;
        widthValue.textContent = initialW;
        heightValue.textContent = initialH;
        zoomSlider.value = 1;
        if (zoomValue)
          zoomValue.textContent = "100%";
        paintWhiteToggle.checked = state.paintWhitePixels;
        paintTransparentToggle.checked = state.paintTransparentPixels;
        let _previewTimer2 = null;
        let _previewJobId = 0;
        let _isDraggingSize = false;
        let _zoomLevel = 1;
        let _ditherWorkBuf2 = null;
        let _ditherEligibleBuf2 = null;
        const ensureDitherBuffers = (n) => {
          if (!_ditherWorkBuf2 || _ditherWorkBuf2.length !== n * 3)
            _ditherWorkBuf2 = new Float32Array(n * 3);
          if (!_ditherEligibleBuf2 || _ditherEligibleBuf2.length !== n)
            _ditherEligibleBuf2 = new Uint8Array(n);
          return { work: _ditherWorkBuf2, eligible: _ditherEligibleBuf2 };
        };
        let _maskImageData2 = null;
        let _maskData2 = null;
        let _dirty2 = null;
        const _resetDirty = () => {
          _dirty2 = { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 };
        };
        const _markDirty = (x, y) => {
          if (!_dirty2)
            _resetDirty();
          if (x < _dirty2.minX)
            _dirty2.minX = x;
          if (y < _dirty2.minY)
            _dirty2.minY = y;
          if (x > _dirty2.maxX)
            _dirty2.maxX = x;
          if (y > _dirty2.maxY)
            _dirty2.maxY = y;
        };
        const _flushDirty = () => {
          if (!_dirty2 || _dirty2.maxX < _dirty2.minX || _dirty2.maxY < _dirty2.minY)
            return;
          const x = Math.max(0, _dirty2.minX);
          const y = Math.max(0, _dirty2.minY);
          const w = Math.min(maskCanvas.width - x, _dirty2.maxX - x + 1);
          const h = Math.min(maskCanvas.height - y, _dirty2.maxY - y + 1);
          if (w > 0 && h > 0)
            maskCtx.putImageData(_maskImageData2, 0, 0, x, y, w, h);
          _resetDirty();
        };
        const _ensureMaskOverlayBuffers = (w, h, rebuildFromMask = false) => {
          if (!_maskImageData2 || _maskImageData2.width !== w || _maskImageData2.height !== h) {
            _maskImageData2 = maskCtx.createImageData(w, h);
            _maskData2 = _maskImageData2.data;
            rebuildFromMask = true;
          }
          if (rebuildFromMask) {
            const m = state.resizeIgnoreMask;
            const md = _maskData2;
            md.fill(0);
            if (m) {
              for (let i = 0; i < m.length; i++)
                if (m[i]) {
                  const p = i * 4;
                  md[p] = 255;
                  md[p + 1] = 0;
                  md[p + 2] = 0;
                  md[p + 3] = 150;
                }
            }
            maskCtx.putImageData(_maskImageData2, 0, 0);
            _resetDirty();
          }
        };
        const ensureMaskSize = (w, h) => {
          if (!state.resizeIgnoreMask || state.resizeIgnoreMask.length !== w * h) {
            state.resizeIgnoreMask = new Uint8Array(w * h);
          }
          baseCanvas.width = w;
          baseCanvas.height = h;
          maskCanvas.width = w;
          maskCanvas.height = h;
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          _ensureMaskOverlayBuffers(w, h, true);
        };
        _updateResizePreview = async () => {
          const jobId = ++_previewJobId;
          const newWidth = parseInt(widthSlider.value, 10);
          const newHeight = parseInt(heightSlider.value, 10);
          _zoomLevel = parseFloat(zoomSlider.value);
          widthValue.textContent = newWidth;
          heightValue.textContent = newHeight;
          ensureMaskSize(newWidth, newHeight);
          canvasStack.style.width = newWidth + "px";
          canvasStack.style.height = newHeight + "px";
          baseCtx.imageSmoothingEnabled = false;
          if (!state.availableColors || state.availableColors.length === 0) {
            if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
              await baseProcessor.load();
            }
            baseCtx.clearRect(0, 0, newWidth, newHeight);
            baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            if (_maskImageData2)
              maskCtx.putImageData(_maskImageData2, 0, 0);
            updateZoomLayout();
            return;
          }
          if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
            await baseProcessor.load();
          }
          baseCtx.clearRect(0, 0, newWidth, newHeight);
          baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
          const imgData = baseCtx.getImageData(0, 0, newWidth, newHeight);
          const data = imgData.data;
          const tThresh = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
          const applyFSDither = () => {
            const w = newWidth, h = newHeight;
            const n = w * h;
            const { work, eligible } = ensureDitherBuffers(n);
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const idx = y * w + x;
                const i4 = idx * 4;
                const r = data[i4], g = data[i4 + 1], b = data[i4 + 2], a = data[i4 + 3];
                const isEligible = (state.paintTransparentPixels || a >= tThresh) && (state.paintWhitePixels || !Utils.isWhitePixel(r, g, b));
                eligible[idx] = isEligible ? 1 : 0;
                work[idx * 3] = r;
                work[idx * 3 + 1] = g;
                work[idx * 3 + 2] = b;
                if (!isEligible) {
                  data[i4 + 3] = 0;
                }
              }
            }
            const diffuse = (nx, ny, er, eg, eb, factor) => {
              if (nx < 0 || nx >= w || ny < 0 || ny >= h)
                return;
              const nidx = ny * w + nx;
              if (!eligible[nidx])
                return;
              const base = nidx * 3;
              work[base] = Math.min(255, Math.max(0, work[base] + er * factor));
              work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
              work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
            };
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const idx = y * w + x;
                if (!eligible[idx])
                  continue;
                const base = idx * 3;
                const r0 = work[base], g0 = work[base + 1], b0 = work[base + 2];
                const [nr, ng, nb] = Utils.findClosestPaletteColor(
                  r0,
                  g0,
                  b0,
                  state.activeColorPalette
                );
                const i4 = idx * 4;
                data[i4] = nr;
                data[i4 + 1] = ng;
                data[i4 + 2] = nb;
                data[i4 + 3] = 255;
                const er = r0 - nr;
                const eg = g0 - ng;
                const eb = b0 - nb;
                diffuse(x + 1, y, er, eg, eb, 7 / 16);
                diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
                diffuse(x, y + 1, er, eg, eb, 5 / 16);
                diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
              }
            }
          };
          if (state.ditheringEnabled && !_isDraggingSize) {
            applyFSDither();
          } else {
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
              if (!state.paintTransparentPixels && a < tThresh || !state.paintWhitePixels && Utils.isWhitePixel(r, g, b)) {
                data[i + 3] = 0;
                continue;
              }
              const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
              data[i] = nr;
              data[i + 1] = ng;
              data[i + 2] = nb;
              data[i + 3] = 255;
            }
          }
          if (jobId !== _previewJobId)
            return;
          baseCtx.putImageData(imgData, 0, 0);
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          if (_maskImageData2)
            maskCtx.putImageData(_maskImageData2, 0, 0);
          updateZoomLayout();
        };
        const onWidthInput = () => {
          if (keepAspect.checked) {
            heightSlider.value = Math.round(parseInt(widthSlider.value, 10) / aspectRatio);
          }
          _updateResizePreview();
          const curW = parseInt(widthSlider.value, 10);
          const curH = parseInt(heightSlider.value, 10);
          state.resizeSettings = {
            baseWidth: width,
            baseHeight: height,
            width: curW,
            height: curH
          };
          saveBotSettings();
          const fit = typeof computeFitZoom === "function" ? computeFitZoom() : 1;
          if (!isNaN(fit) && isFinite(fit))
            applyZoom(fit);
        };
        const onHeightInput = () => {
          if (keepAspect.checked) {
            widthSlider.value = Math.round(parseInt(heightSlider.value, 10) * aspectRatio);
          }
          _updateResizePreview();
          const curW = parseInt(widthSlider.value, 10);
          const curH = parseInt(heightSlider.value, 10);
          state.resizeSettings = {
            baseWidth: width,
            baseHeight: height,
            width: curW,
            height: curH
          };
          saveBotSettings();
          const fit = typeof computeFitZoom === "function" ? computeFitZoom() : 1;
          if (!isNaN(fit) && isFinite(fit))
            applyZoom(fit);
        };
        paintWhiteToggle.onchange = (e) => {
          state.paintWhitePixels = e.target.checked;
          _updateResizePreview();
          saveBotSettings();
        };
        paintTransparentToggle.onchange = (e) => {
          state.paintTransparentPixels = e.target.checked;
          _updateResizePreview();
          saveBotSettings();
        };
        let panX = 0, panY = 0;
        const clampPan = () => {
          const wrapRect = (panStage == null ? void 0 : panStage.getBoundingClientRect()) || {
            width: 0,
            height: 0
          };
          const w = (baseCanvas.width || 1) * _zoomLevel;
          const h = (baseCanvas.height || 1) * _zoomLevel;
          if (w <= wrapRect.width) {
            panX = Math.floor((wrapRect.width - w) / 2);
          } else {
            const minX = wrapRect.width - w;
            panX = Math.min(0, Math.max(minX, panX));
          }
          if (h <= wrapRect.height) {
            panY = Math.floor((wrapRect.height - h) / 2);
          } else {
            const minY = wrapRect.height - h;
            panY = Math.min(0, Math.max(minY, panY));
          }
        };
        let _panRaf2 = 0;
        const applyPan = () => {
          if (_panRaf2)
            return;
          _panRaf2 = requestAnimationFrame(() => {
            clampPan();
            canvasStack.style.transform = `translate3d(${Math.round(
              panX
            )}px, ${Math.round(panY)}px, 0) scale(${_zoomLevel})`;
            _panRaf2 = 0;
          });
        };
        const updateZoomLayout = () => {
          const w = baseCanvas.width || 1, h = baseCanvas.height || 1;
          baseCanvas.style.width = w + "px";
          baseCanvas.style.height = h + "px";
          maskCanvas.style.width = w + "px";
          maskCanvas.style.height = h + "px";
          canvasStack.style.width = w + "px";
          canvasStack.style.height = h + "px";
          applyPan();
        };
        const applyZoom = (z) => {
          _zoomLevel = Math.max(0.05, Math.min(20, z || 1));
          zoomSlider.value = _zoomLevel;
          updateZoomLayout();
          if (zoomValue)
            zoomValue.textContent = `${Math.round(_zoomLevel * 100)}%`;
        };
        zoomSlider.addEventListener("input", () => {
          applyZoom(parseFloat(zoomSlider.value));
        });
        if (zoomInBtn)
          zoomInBtn.addEventListener("click", () => applyZoom(parseFloat(zoomSlider.value) + 0.1));
        if (zoomOutBtn)
          zoomOutBtn.addEventListener("click", () => applyZoom(parseFloat(zoomSlider.value) - 0.1));
        const computeFitZoom = () => {
          const wrapRect = panStage == null ? void 0 : panStage.getBoundingClientRect();
          if (!wrapRect)
            return 1;
          const w = baseCanvas.width || 1;
          const h = baseCanvas.height || 1;
          const margin = 10;
          const scaleX = (wrapRect.width - margin) / w;
          const scaleY = (wrapRect.height - margin) / h;
          return Math.max(0.05, Math.min(20, Math.min(scaleX, scaleY)));
        };
        if (zoomFitBtn)
          zoomFitBtn.addEventListener("click", () => {
            applyZoom(computeFitZoom());
            centerInView();
          });
        if (zoomActualBtn)
          zoomActualBtn.addEventListener("click", () => {
            applyZoom(1);
            centerInView();
          });
        const centerInView = () => {
          if (!panStage)
            return;
          const rect = panStage.getBoundingClientRect();
          const w = (baseCanvas.width || 1) * _zoomLevel;
          const h = (baseCanvas.height || 1) * _zoomLevel;
          panX = Math.floor((rect.width - w) / 2);
          panY = Math.floor((rect.height - h) / 2);
          applyPan();
        };
        let isPanning = false;
        let startX = 0, startY = 0, startPanX = 0, startPanY = 0;
        let allowPan = false;
        let panMode = false;
        const isPanMouseButton = (e) => e.button === 1 || e.button === 2;
        const setCursor = (val) => {
          if (panStage)
            panStage.style.cursor = val;
        };
        const isPanActive = (e) => panMode || allowPan || isPanMouseButton(e);
        const updatePanModeBtn = () => {
          if (!panModeBtn)
            return;
          panModeBtn.classList.toggle("active", panMode);
          panModeBtn.setAttribute("aria-pressed", panMode ? "true" : "false");
        };
        if (panModeBtn) {
          updatePanModeBtn();
          panModeBtn.addEventListener("click", () => {
            panMode = !panMode;
            updatePanModeBtn();
            setCursor(panMode ? "grab" : "");
          });
        }
        if (panStage) {
          panStage.addEventListener("contextmenu", (e) => {
            if (allowPan)
              e.preventDefault();
          });
          window.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
              allowPan = true;
              setCursor("grab");
            }
          });
          window.addEventListener("keyup", (e) => {
            if (e.code === "Space") {
              allowPan = false;
              if (!isPanning)
                setCursor("");
            }
          });
          panStage.addEventListener("mousedown", (e) => {
            if (!isPanActive(e))
              return;
            e.preventDefault();
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            startPanX = panX;
            startPanY = panY;
            setCursor("grabbing");
          });
          window.addEventListener("mousemove", (e) => {
            if (!isPanning)
              return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panX = startPanX + dx;
            panY = startPanY + dy;
            applyPan();
          });
          window.addEventListener("mouseup", () => {
            if (isPanning) {
              isPanning = false;
              setCursor(allowPan ? "grab" : "");
            }
          });
          panStage.addEventListener(
            "wheel",
            (e) => {
              if (!e.ctrlKey && !e.metaKey)
                return;
              e.preventDefault();
              const rect = panStage.getBoundingClientRect();
              const cx = e.clientX - rect.left - panX;
              const cy = e.clientY - rect.top - panY;
              const before = _zoomLevel;
              const step = Math.max(0.05, Math.min(0.5, Math.abs(e.deltaY) > 20 ? 0.2 : 0.1));
              const next = Math.max(0.05, Math.min(20, before + (e.deltaY > 0 ? -step : step)));
              if (next === before)
                return;
              const scale = next / before;
              panX = panX - cx * (scale - 1);
              panY = panY - cy * (scale - 1);
              applyZoom(next);
            },
            { passive: false }
          );
          let lastTouchDist = null;
          let touchStartTime = 0;
          let doubleTapTimer = null;
          panStage.addEventListener(
            "touchstart",
            (e) => {
              if (e.touches.length === 1) {
                const t = e.touches[0];
                isPanning = true;
                startX = t.clientX;
                startY = t.clientY;
                startPanX = panX;
                startPanY = panY;
                setCursor("grabbing");
                const now = Date.now();
                if (now - touchStartTime < 300) {
                  const z = Math.abs(_zoomLevel - 1) < 0.01 ? computeFitZoom() : 1;
                  applyZoom(z);
                  centerInView();
                  if (doubleTapTimer)
                    clearTimeout(doubleTapTimer);
                } else {
                  touchStartTime = now;
                  doubleTapTimer = setTimeout(() => {
                    doubleTapTimer = null;
                  }, 320);
                }
              } else if (e.touches.length === 2) {
                const [a, b] = e.touches;
                lastTouchDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
              }
            },
            { passive: true }
          );
          panStage.addEventListener(
            "touchmove",
            (e) => {
              if (e.touches.length === 1 && isPanning) {
                const t = e.touches[0];
                const dx = t.clientX - startX;
                const dy = t.clientY - startY;
                panX = startPanX + dx;
                panY = startPanY + dy;
                applyPan();
              } else if (e.touches.length === 2 && lastTouchDist != null) {
                e.preventDefault();
                const [a, b] = e.touches;
                const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
                const rect = panStage.getBoundingClientRect();
                const centerX = (a.clientX + b.clientX) / 2 - rect.left - panX;
                const centerY = (a.clientY + b.clientY) / 2 - rect.top - panY;
                const before = _zoomLevel;
                const scale = dist / (lastTouchDist || dist);
                const next = Math.max(0.05, Math.min(20, before * scale));
                if (next !== before) {
                  panX = panX - centerX * (next / before - 1);
                  panY = panY - centerY * (next / before - 1);
                  applyZoom(next);
                }
                lastTouchDist = dist;
              }
            },
            { passive: false }
          );
          panStage.addEventListener("touchend", () => {
            isPanning = false;
            lastTouchDist = null;
            setCursor(panMode || allowPan ? "grab" : "");
          });
        }
        const schedulePreview = () => {
          if (_previewTimer2)
            clearTimeout(_previewTimer2);
          const run = () => {
            _previewTimer2 = null;
            _updateResizePreview();
          };
          if (window.requestIdleCallback) {
            _previewTimer2 = setTimeout(() => requestIdleCallback(run, { timeout: 150 }), 50);
          } else {
            _previewTimer2 = setTimeout(() => requestAnimationFrame(run), 50);
          }
        };
        const markDragStart = () => {
          _isDraggingSize = true;
        };
        const markDragEnd = () => {
          _isDraggingSize = false;
          schedulePreview();
        };
        widthSlider.addEventListener("pointerdown", markDragStart);
        heightSlider.addEventListener("pointerdown", markDragStart);
        widthSlider.addEventListener("pointerup", markDragEnd);
        heightSlider.addEventListener("pointerup", markDragEnd);
        widthSlider.addEventListener("input", () => {
          onWidthInput();
          schedulePreview();
        });
        heightSlider.addEventListener("input", () => {
          onHeightInput();
          schedulePreview();
        });
        let draggingMask = false;
        let lastPaintX = -1, lastPaintY = -1;
        let brushSize = 1;
        let rowColSize = 1;
        let maskMode = "ignore";
        const brushEl = resizeContainer.querySelector("#maskBrushSize");
        const brushValEl = resizeContainer.querySelector("#maskBrushSizeValue");
        const btnIgnore = resizeContainer.querySelector("#maskModeIgnore");
        const btnUnignore = resizeContainer.querySelector("#maskModeUnignore");
        const btnToggle = resizeContainer.querySelector("#maskModeToggle");
        const clearIgnoredBtnEl = resizeContainer.querySelector("#clearIgnoredBtn");
        const invertMaskBtn = resizeContainer.querySelector("#invertMaskBtn");
        const rowColSizeEl = resizeContainer.querySelector("#rowColSize");
        const rowColSizeValEl = resizeContainer.querySelector("#rowColSizeValue");
        const updateModeButtons = () => {
          const map = [
            [btnIgnore, "ignore"],
            [btnUnignore, "unignore"],
            [btnToggle, "toggle"]
          ];
          for (const [el, m] of map) {
            if (!el)
              continue;
            const active = maskMode === m;
            el.classList.toggle("active", active);
            el.setAttribute("aria-pressed", active ? "true" : "false");
          }
        };
        const setMode = (mode) => {
          maskMode = mode;
          updateModeButtons();
        };
        if (brushEl && brushValEl) {
          brushEl.addEventListener("input", () => {
            brushSize = parseInt(brushEl.value, 10) || 1;
            brushValEl.textContent = brushSize;
          });
          brushValEl.textContent = brushEl.value;
          brushSize = parseInt(brushEl.value, 10) || 1;
        }
        if (rowColSizeEl && rowColSizeValEl) {
          rowColSizeEl.addEventListener("input", () => {
            rowColSize = parseInt(rowColSizeEl.value, 10) || 1;
            rowColSizeValEl.textContent = rowColSize;
          });
          rowColSizeValEl.textContent = rowColSizeEl.value;
          rowColSize = parseInt(rowColSizeEl.value, 10) || 1;
        }
        if (btnIgnore)
          btnIgnore.addEventListener("click", () => setMode("ignore"));
        if (btnUnignore)
          btnUnignore.addEventListener("click", () => setMode("unignore"));
        if (btnToggle)
          btnToggle.addEventListener("click", () => setMode("toggle"));
        updateModeButtons();
        const mapClientToPixel = (clientX, clientY) => {
          const rect = baseCanvas.getBoundingClientRect();
          const scaleX = rect.width / baseCanvas.width;
          const scaleY = rect.height / baseCanvas.height;
          const dx = (clientX - rect.left) / scaleX;
          const dy = (clientY - rect.top) / scaleY;
          const x = Math.floor(dx);
          const y = Math.floor(dy);
          return { x, y };
        };
        const ensureMask = (w, h) => {
          if (!state.resizeIgnoreMask || state.resizeIgnoreMask.length !== w * h) {
            state.resizeIgnoreMask = new Uint8Array(w * h);
          }
        };
        const paintCircle = (cx, cy, radius, value) => {
          const w = baseCanvas.width, h = baseCanvas.height;
          ensureMask(w, h);
          const r2 = radius * radius;
          for (let yy = cy - radius; yy <= cy + radius; yy++) {
            if (yy < 0 || yy >= h)
              continue;
            for (let xx = cx - radius; xx <= cx + radius; xx++) {
              if (xx < 0 || xx >= w)
                continue;
              const dx = xx - cx, dy = yy - cy;
              if (dx * dx + dy * dy <= r2) {
                const idx = yy * w + xx;
                let val = state.resizeIgnoreMask[idx];
                if (maskMode === "toggle") {
                  val = val ? 0 : 1;
                } else if (maskMode === "ignore") {
                  val = 1;
                } else {
                  val = 0;
                }
                state.resizeIgnoreMask[idx] = val;
                if (_maskData2) {
                  const p = idx * 4;
                  if (val) {
                    _maskData2[p] = 255;
                    _maskData2[p + 1] = 0;
                    _maskData2[p + 2] = 0;
                    _maskData2[p + 3] = 150;
                  } else {
                    _maskData2[p] = 0;
                    _maskData2[p + 1] = 0;
                    _maskData2[p + 2] = 0;
                    _maskData2[p + 3] = 0;
                  }
                  _markDirty(xx, yy);
                }
              }
            }
          }
        };
        const paintRow = (y, value) => {
          const w = baseCanvas.width, h = baseCanvas.height;
          ensureMask(w, h);
          if (y < 0 || y >= h)
            return;
          const halfSize = Math.floor(rowColSize / 2);
          const startY2 = Math.max(0, y - halfSize);
          const endY = Math.min(h - 1, y + halfSize);
          for (let rowY = startY2; rowY <= endY; rowY++) {
            for (let x = 0; x < w; x++) {
              const idx = rowY * w + x;
              let val = state.resizeIgnoreMask[idx];
              if (maskMode === "toggle") {
                val = val ? 0 : 1;
              } else if (maskMode === "ignore") {
                val = 1;
              } else {
                val = 0;
              }
              state.resizeIgnoreMask[idx] = val;
              if (_maskData2) {
                const p = idx * 4;
                if (val) {
                  _maskData2[p] = 255;
                  _maskData2[p + 1] = 0;
                  _maskData2[p + 2] = 0;
                  _maskData2[p + 3] = 150;
                } else {
                  _maskData2[p] = 0;
                  _maskData2[p + 1] = 0;
                  _maskData2[p + 2] = 0;
                  _maskData2[p + 3] = 0;
                }
              }
            }
            if (_maskData2) {
              _markDirty(0, rowY);
              _markDirty(w - 1, rowY);
            }
          }
        };
        const paintColumn = (x, value) => {
          const w = baseCanvas.width, h = baseCanvas.height;
          ensureMask(w, h);
          if (x < 0 || x >= w)
            return;
          const halfSize = Math.floor(rowColSize / 2);
          const startX2 = Math.max(0, x - halfSize);
          const endX = Math.min(w - 1, x + halfSize);
          for (let colX = startX2; colX <= endX; colX++) {
            for (let y = 0; y < h; y++) {
              const idx = y * w + colX;
              let val = state.resizeIgnoreMask[idx];
              if (maskMode === "toggle") {
                val = val ? 0 : 1;
              } else if (maskMode === "ignore") {
                val = 1;
              } else {
                val = 0;
              }
              state.resizeIgnoreMask[idx] = val;
              if (_maskData2) {
                const p = idx * 4;
                if (val) {
                  _maskData2[p] = 255;
                  _maskData2[p + 1] = 0;
                  _maskData2[p + 2] = 0;
                  _maskData2[p + 3] = 150;
                } else {
                  _maskData2[p] = 0;
                  _maskData2[p + 1] = 0;
                  _maskData2[p + 2] = 0;
                  _maskData2[p + 3] = 0;
                }
              }
            }
            if (_maskData2) {
              _markDirty(colX, 0);
              _markDirty(colX, h - 1);
            }
          }
        };
        const redrawMaskOverlay = () => {
          _flushDirty();
        };
        const handlePaint = (e) => {
          if ((e.buttons & 4) === 4 || (e.buttons & 2) === 2 || allowPan)
            return;
          const { x, y } = mapClientToPixel(e.clientX, e.clientY);
          const w = baseCanvas.width, h = baseCanvas.height;
          if (x < 0 || y < 0 || x >= w || y >= h)
            return;
          const radius = Math.max(1, Math.floor(brushSize / 2));
          if (e.shiftKey) {
            paintRow(y);
          } else if (e.altKey) {
            paintColumn(x);
          } else {
            paintCircle(x, y, radius);
          }
          lastPaintX = x;
          lastPaintY = y;
          redrawMaskOverlay();
        };
        maskCanvas.addEventListener("mousedown", (e) => {
          if (e.button === 1 || e.button === 2 || allowPan)
            return;
          draggingMask = true;
          handlePaint(e);
        });
        maskCanvas.addEventListener(
          "touchstart",
          (e) => {
          },
          { passive: true }
        );
        maskCanvas.addEventListener(
          "touchmove",
          (e) => {
          },
          { passive: true }
        );
        maskCanvas.addEventListener(
          "touchend",
          (e) => {
          },
          { passive: true }
        );
        window.addEventListener("mousemove", (e) => {
          if (draggingMask)
            handlePaint(e);
        });
        window.addEventListener("mouseup", () => {
          if (draggingMask) {
            draggingMask = false;
            saveBotSettings();
          }
        });
        if (clearIgnoredBtnEl)
          clearIgnoredBtnEl.addEventListener("click", () => {
            const w = baseCanvas.width, h = baseCanvas.height;
            if (state.resizeIgnoreMask)
              state.resizeIgnoreMask.fill(0);
            _ensureMaskOverlayBuffers(w, h, true);
            _updateResizePreview();
            saveBotSettings();
          });
        if (invertMaskBtn)
          invertMaskBtn.addEventListener("click", () => {
            if (!state.resizeIgnoreMask)
              return;
            for (let i = 0; i < state.resizeIgnoreMask.length; i++)
              state.resizeIgnoreMask[i] = state.resizeIgnoreMask[i] ? 0 : 1;
            const w = baseCanvas.width, h = baseCanvas.height;
            _ensureMaskOverlayBuffers(w, h, true);
            _updateResizePreview();
            saveBotSettings();
          });
        confirmResize.onclick = async () => {
          const newWidth = parseInt(widthSlider.value, 10);
          const newHeight = parseInt(heightSlider.value, 10);
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = newWidth;
          tempCanvas.height = newHeight;
          tempCtx.imageSmoothingEnabled = false;
          if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
            await baseProcessor.load();
          }
          tempCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
          const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
          const data = imgData.data;
          const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
          let totalValidPixels = 0;
          const mask = state.resizeIgnoreMask && state.resizeIgnoreMask.length === newWidth * newHeight ? state.resizeIgnoreMask : null;
          const applyFSDitherFinal = async () => {
            const w = newWidth, h = newHeight;
            const n = w * h;
            const { work, eligible } = ensureDitherBuffers(n);
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const idx = y * w + x;
                const i4 = idx * 4;
                const r = data[i4], g = data[i4 + 1], b = data[i4 + 2], a = data[i4 + 3];
                const masked = mask && mask[idx];
                const isEligible = !masked && (state.paintTransparentPixels || a >= tThresh2) && (state.paintWhitePixels || !Utils.isWhitePixel(r, g, b));
                eligible[idx] = isEligible ? 1 : 0;
                work[idx * 3] = r;
                work[idx * 3 + 1] = g;
                work[idx * 3 + 2] = b;
                if (!isEligible) {
                  data[i4 + 3] = 0;
                }
              }
              if ((y & 15) === 0)
                await Promise.resolve();
            }
            const diffuse = (nx, ny, er, eg, eb, factor) => {
              if (nx < 0 || nx >= w || ny < 0 || ny >= h)
                return;
              const nidx = ny * w + nx;
              if (!eligible[nidx])
                return;
              const base = nidx * 3;
              work[base] = Math.min(255, Math.max(0, work[base] + er * factor));
              work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
              work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
            };
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const idx = y * w + x;
                if (!eligible[idx])
                  continue;
                const base = idx * 3;
                const r0 = work[base], g0 = work[base + 1], b0 = work[base + 2];
                const [nr, ng, nb] = Utils.findClosestPaletteColor(
                  r0,
                  g0,
                  b0,
                  state.activeColorPalette
                );
                const i4 = idx * 4;
                data[i4] = nr;
                data[i4 + 1] = ng;
                data[i4 + 2] = nb;
                data[i4 + 3] = 255;
                totalValidPixels++;
                const er = r0 - nr;
                const eg = g0 - ng;
                const eb = b0 - nb;
                diffuse(x + 1, y, er, eg, eb, 7 / 16);
                diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
                diffuse(x, y + 1, er, eg, eb, 5 / 16);
                diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
              }
              await Promise.resolve();
            }
          };
          if (state.ditheringEnabled) {
            await applyFSDitherFinal();
          } else {
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
              const masked = mask && mask[i >> 2];
              const isTransparent = !state.paintTransparentPixels && a < tThresh2 || masked;
              const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(r, g, b);
              if (isTransparent || isWhiteAndSkipped) {
                data[i + 3] = 0;
                continue;
              }
              totalValidPixels++;
              const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
              data[i] = nr;
              data[i + 1] = ng;
              data[i + 2] = nb;
              data[i + 3] = 255;
            }
          }
          tempCtx.putImageData(imgData, 0, 0);
          const palettedPixels = new Uint8ClampedArray(imgData.data);
          state.imageData.pixels = palettedPixels;
          state.imageData.width = newWidth;
          state.imageData.height = newHeight;
          state.imageData.totalPixels = totalValidPixels;
          state.totalPixels = totalValidPixels;
          state.paintedPixels = 0;
          state.resizeSettings = {
            baseWidth: width,
            baseHeight: height,
            width: newWidth,
            height: newHeight
          };
          saveBotSettings();
          const finalImageBitmap = await createImageBitmap(tempCanvas);
          await overlayManager.setImage(finalImageBitmap);
          overlayManager.enable();
          toggleOverlayBtn.classList.add("active");
          toggleOverlayBtn.setAttribute("aria-pressed", "true");
          updateStats();
          updateUI("resizeSuccess", "success", {
            width: newWidth,
            height: newHeight
          });
          closeResizeDialog();
        };
        downloadPreviewBtn.onclick = () => {
          try {
            const w = baseCanvas.width, h = baseCanvas.height;
            const out = document.createElement("canvas");
            out.width = w;
            out.height = h;
            const octx = out.getContext("2d");
            octx.imageSmoothingEnabled = false;
            octx.drawImage(baseCanvas, 0, 0);
            octx.drawImage(maskCanvas, 0, 0);
            const link = document.createElement("a");
            link.download = "wplace-preview.png";
            link.href = out.toDataURL();
            link.click();
          } catch (e) {
            console.warn("Failed to download preview:", e);
          }
        };
        cancelResize.onclick = closeResizeDialog;
        resizeOverlay.style.display = "block";
        resizeContainer.style.display = "block";
        initializeColorPalette(resizeContainer);
        _updateResizePreview();
        _resizeDialogCleanup = () => {
          try {
            zoomSlider.replaceWith(zoomSlider.cloneNode(true));
          } catch {
          }
          try {
            if (zoomInBtn)
              zoomInBtn.replaceWith(zoomInBtn.cloneNode(true));
          } catch {
          }
          try {
            if (zoomOutBtn)
              zoomOutBtn.replaceWith(zoomOutBtn.cloneNode(true));
          } catch {
          }
        };
        setTimeout(() => {
          if (typeof computeFitZoom === "function") {
            const z = computeFitZoom();
            if (!isNaN(z) && isFinite(z)) {
              applyZoom(z);
              centerInView();
            }
          } else {
            centerInView();
          }
        }, 0);
      }
      function closeResizeDialog() {
        try {
          if (typeof _resizeDialogCleanup === "function") {
            _resizeDialogCleanup();
          }
        } catch {
        }
        resizeOverlay.style.display = "none";
        resizeContainer.style.display = "none";
        _updateResizePreview = () => {
        };
        try {
          if (typeof cancelAnimationFrame === "function" && _panRaf) {
            cancelAnimationFrame(_panRaf);
          }
        } catch {
        }
        try {
          if (_previewTimer) {
            clearTimeout(_previewTimer);
            _previewTimer = null;
          }
        } catch {
        }
        _maskImageData = null;
        _maskData = null;
        _dirty = null;
        _ditherWorkBuf = null;
        _ditherEligibleBuf = null;
        _resizeDialogCleanup = null;
      }
      if (uploadBtn) {
        uploadBtn.addEventListener("click", async () => {
          const availableColors = Utils.extractAvailableColors();
          if (availableColors === null || availableColors.length < 10) {
            updateUI("noColorsFound", "error");
            Utils.showAlert(Utils.t("noColorsFound"), "error");
            return;
          }
          if (!state.colorsChecked) {
            state.availableColors = availableColors;
            state.colorsChecked = true;
            updateUI("colorsFound", "success", { count: availableColors.length });
            updateStats();
            selectPosBtn.disabled = false;
            if (state.imageLoaded) {
              resizeBtn.disabled = false;
            }
          }
          try {
            updateUI("loadingImage", "default");
            const imageSrc = await Utils.createImageUploader();
            if (!imageSrc) {
              updateUI("colorsFound", "success", {
                count: state.availableColors.length
              });
              return;
            }
            const processor = new ImageProcessor(imageSrc);
            await processor.load();
            const { width, height } = processor.getDimensions();
            const pixels = processor.getPixelData();
            let totalValidPixels = 0;
            for (let i = 0; i < pixels.length; i += 4) {
              const isTransparent = !state.paintTransparentPixels && pixels[i + 3] < (state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD);
              const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(pixels[i], pixels[i + 1], pixels[i + 2]);
              if (!isTransparent && !isWhiteAndSkipped) {
                totalValidPixels++;
              }
            }
            state.imageData = {
              width,
              height,
              pixels,
              totalPixels: totalValidPixels,
              processor
            };
            state.totalPixels = totalValidPixels;
            state.paintedPixels = 0;
            state.imageLoaded = true;
            state.lastPosition = { x: 0, y: 0 };
            Utils.initializePaintedMap(width, height);
            state.resizeSettings = null;
            state.resizeIgnoreMask = null;
            state.originalImage = { dataUrl: imageSrc, width, height };
            saveBotSettings();
            const imageBitmap = await createImageBitmap(processor.img);
            await overlayManager.setImage(imageBitmap);
            overlayManager.enable();
            toggleOverlayBtn.disabled = false;
            toggleOverlayBtn.classList.add("active");
            toggleOverlayBtn.setAttribute("aria-pressed", "true");
            if (state.colorsChecked) {
              resizeBtn.disabled = false;
            }
            saveBtn.disabled = false;
            if (state.startPosition) {
              startBtn.disabled = false;
            }
            updateStats();
            updateDataButtons();
            updateUI("imageLoaded", "success", { count: totalValidPixels });
          } catch {
            updateUI("imageError", "error");
          }
        });
      }
      if (resizeBtn) {
        resizeBtn.addEventListener("click", () => {
          if (state.imageLoaded && state.imageData.processor && state.colorsChecked) {
            showResizeDialog(state.imageData.processor);
          } else if (!state.colorsChecked) {
            Utils.showAlert(Utils.t("uploadImageFirstColors"), "warning");
          }
        });
      }
      if (selectPosBtn) {
        selectPosBtn.addEventListener("click", async () => {
          if (state.selectingPosition)
            return;
          state.selectingPosition = true;
          state.startPosition = null;
          state.region = null;
          startBtn.disabled = true;
          Utils.showAlert(Utils.t("selectPositionAlert"), "info");
          updateUI("waitingPosition", "default");
          const tempFetch = async (url, options) => {
            var _a2;
            if (typeof url === "string" && url.includes("https://backend.wplace.live/s0/pixel/") && ((_a2 = options == null ? void 0 : options.method) == null ? void 0 : _a2.toUpperCase()) === "POST") {
              try {
                const response = await originalFetch(url, options);
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();
                if ((data == null ? void 0 : data.painted) === 1) {
                  const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/);
                  if (regionMatch && regionMatch.length >= 3) {
                    state.region = {
                      x: Number.parseInt(regionMatch[1]),
                      y: Number.parseInt(regionMatch[2])
                    };
                  }
                  const payload = JSON.parse(options.body);
                  if ((payload == null ? void 0 : payload.coords) && Array.isArray(payload.coords)) {
                    state.startPosition = {
                      x: payload.coords[0],
                      y: payload.coords[1]
                    };
                    state.lastPosition = { x: 0, y: 0 };
                    await overlayManager.setPosition(state.startPosition, state.region);
                    if (state.imageLoaded) {
                      startBtn.disabled = false;
                    }
                    window.fetch = originalFetch;
                    state.selectingPosition = false;
                    updateUI("positionSet", "success");
                  }
                }
                return response;
              } catch {
                return originalFetch(url, options);
              }
            }
            return originalFetch(url, options);
          };
          const originalFetch = window.fetch;
          window.fetch = tempFetch;
          setTimeout(() => {
            if (state.selectingPosition) {
              window.fetch = originalFetch;
              state.selectingPosition = false;
              updateUI("positionTimeout", "error");
              Utils.showAlert(Utils.t("positionTimeout"), "error");
            }
          }, 12e4);
        });
      }
      async function startPainting() {
        if (!state.imageLoaded || !state.startPosition || !state.region) {
          updateUI("missingRequirements", "error");
          return;
        }
        await ensureToken();
        if (!turnstileToken)
          return;
        state.running = true;
        state.stopFlag = false;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        uploadBtn.disabled = true;
        selectPosBtn.disabled = true;
        resizeBtn.disabled = true;
        saveBtn.disabled = true;
        toggleOverlayBtn.disabled = true;
        updateUI("startPaintingMsg", "success");
        try {
          await processImage();
        } catch (e) {
          console.error("Unexpected error:", e);
          updateUI("paintingError", "error");
        } finally {
          state.running = false;
          stopBtn.disabled = true;
          saveBtn.disabled = false;
          if (state.stopFlag) {
            startBtn.disabled = false;
          } else {
            startBtn.disabled = true;
            uploadBtn.disabled = false;
            selectPosBtn.disabled = false;
            resizeBtn.disabled = false;
          }
          toggleOverlayBtn.disabled = false;
        }
      }
      if (startBtn) {
        startBtn.addEventListener("click", startPainting);
      }
      if (stopBtn) {
        stopBtn.addEventListener("click", () => {
          state.stopFlag = true;
          state.running = false;
          stopBtn.disabled = true;
          updateUI("paintingStoppedByUser", "warning");
          if (state.imageLoaded && state.paintedPixels > 0) {
            Utils.saveProgress();
            Utils.showAlert(Utils.t("autoSaved"), "success");
          }
        });
      }
      const checkSavedProgress = () => {
        const savedData = Utils.loadProgress();
        if (savedData && savedData.state.paintedPixels > 0) {
          const savedDate = new Date(savedData.timestamp).toLocaleString();
          const progress = Math.round(
            savedData.state.paintedPixels / savedData.state.totalPixels * 100
          );
          Utils.showAlert(
            `${Utils.t("savedDataFound")}

Saved: ${savedDate}
Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)
${Utils.t("clickLoadToContinue")}`,
            "info"
          );
        }
      };
      setTimeout(checkSavedProgress, 1e3);
      if (cooldownSlider && cooldownInput) {
        const updateCooldown = (newValue, source) => {
          const threshold = Math.max(1, Math.min(state.maxCharges || 999, parseInt(newValue)));
          state.cooldownChargeThreshold = threshold;
          if (source !== "slider")
            cooldownSlider.value = threshold;
          if (source !== "input")
            cooldownInput.value = threshold;
          saveBotSettings();
          NotificationManager.resetEdgeTracking();
        };
        cooldownSlider.addEventListener("input", (e) => {
          updateCooldown(e.target.value, "slider");
        });
        cooldownInput.addEventListener("input", (e) => {
          updateCooldown(e.target.value, "input");
        });
        if (cooldownDecrease) {
          Utils.addHoldToRepeatListener(cooldownDecrease, () => {
            updateCooldown(parseInt(cooldownInput.value) - 1, "button");
          });
        }
        if (cooldownIncrease) {
          Utils.addHoldToRepeatListener(cooldownIncrease, () => {
            updateCooldown(parseInt(cooldownInput.value) + 1, "button");
          });
        }
      }
      loadBotSettings();
      NotificationManager.syncFromState();
    }
    function getMsToTargetCharges(current, target, cooldown, intervalMs = 0) {
      const remainingCharges = target - current;
      return Math.max(0, remainingCharges * cooldown - intervalMs);
    }
    function updateChargesThresholdUI(intervalMs) {
      if (state.stopFlag)
        return;
      const threshold = state.cooldownChargeThreshold;
      const remainingMs = getMsToTargetCharges(
        state.preciseCurrentCharges,
        threshold,
        state.cooldown,
        intervalMs
      );
      const timeText = Utils.msToTimeText(remainingMs);
      updateUI(
        "noChargesThreshold",
        "warning",
        {
          threshold,
          current: state.displayCharges,
          time: timeText
        },
        true
      );
    }
    function generateCoordinates(width, height, mode, direction, snake, blockWidth, blockHeight) {
      const coords = [];
      console.log(
        "Generating coordinates with \n  mode:",
        mode,
        "\n  direction:",
        direction,
        "\n  snake:",
        snake,
        "\n  blockWidth:",
        blockWidth,
        "\n  blockHeight:",
        blockHeight
      );
      let xStart, xEnd, xStep;
      let yStart, yEnd, yStep;
      switch (direction) {
        case "top-left":
          xStart = 0;
          xEnd = width;
          xStep = 1;
          yStart = 0;
          yEnd = height;
          yStep = 1;
          break;
        case "top-right":
          xStart = width - 1;
          xEnd = -1;
          xStep = -1;
          yStart = 0;
          yEnd = height;
          yStep = 1;
          break;
        case "bottom-left":
          xStart = 0;
          xEnd = width;
          xStep = 1;
          yStart = height - 1;
          yEnd = -1;
          yStep = -1;
          break;
        case "bottom-right":
          xStart = width - 1;
          xEnd = -1;
          xStep = -1;
          yStart = height - 1;
          yEnd = -1;
          yStep = -1;
          break;
        default:
          throw new Error(`Unknown direction: ${direction}`);
      }
      if (mode === "rows") {
        for (let y = yStart; y !== yEnd; y += yStep) {
          if (snake && (y - yStart) % 2 !== 0) {
            for (let x = xEnd - xStep; x !== xStart - xStep; x -= xStep) {
              coords.push([x, y]);
            }
          } else {
            for (let x = xStart; x !== xEnd; x += xStep) {
              coords.push([x, y]);
            }
          }
        }
      } else if (mode === "columns") {
        for (let x = xStart; x !== xEnd; x += xStep) {
          if (snake && (x - xStart) % 2 !== 0) {
            for (let y = yEnd - yStep; y !== yStart - yStep; y -= yStep) {
              coords.push([x, y]);
            }
          } else {
            for (let y = yStart; y !== yEnd; y += yStep) {
              coords.push([x, y]);
            }
          }
        }
      } else if (mode === "circle-out") {
        const cx = Math.floor(width / 2);
        const cy = Math.floor(height / 2);
        const maxRadius = Math.ceil(Math.sqrt(cx * cx + cy * cy));
        for (let r = 0; r <= maxRadius; r++) {
          for (let y = cy - r; y <= cy + r; y++) {
            for (let x = cx - r; x <= cx + r; x++) {
              if (x >= 0 && x < width && y >= 0 && y < height) {
                const dist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
                if (dist === r)
                  coords.push([x, y]);
              }
            }
          }
        }
      } else if (mode === "circle-in") {
        const cx = Math.floor(width / 2);
        const cy = Math.floor(height / 2);
        const maxRadius = Math.ceil(Math.sqrt(cx * cx + cy * cy));
        for (let r = maxRadius; r >= 0; r--) {
          for (let y = cy - r; y <= cy + r; y++) {
            for (let x = cx - r; x <= cx + r; x++) {
              if (x >= 0 && x < width && y >= 0 && y < height) {
                const dist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
                if (dist === r)
                  coords.push([x, y]);
              }
            }
          }
        }
      } else if (mode === "blocks" || mode === "shuffle-blocks") {
        const blocks = [];
        for (let by = 0; by < height; by += blockHeight) {
          for (let bx = 0; bx < width; bx += blockWidth) {
            const block = [];
            for (let y = by; y < Math.min(by + blockHeight, height); y++) {
              for (let x = bx; x < Math.min(bx + blockWidth, width); x++) {
                block.push([x, y]);
              }
            }
            blocks.push(block);
          }
        }
        if (mode === "shuffle-blocks") {
          for (let i = blocks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
          }
        }
        for (const block of blocks) {
          coords.push(...block);
        }
      } else {
        throw new Error(`Unknown mode: ${mode}`);
      }
      return coords;
    }
    async function flushPixelBatch(pixelBatch) {
      if (!pixelBatch || pixelBatch.pixels.length === 0)
        return true;
      const batchSize = pixelBatch.pixels.length;
      console.log(
        `\u{1F4E6} Sending batch with ${batchSize} pixels (region: ${pixelBatch.regionX},${pixelBatch.regionY})`
      );
      const success = await sendBatchWithRetry(
        pixelBatch.pixels,
        pixelBatch.regionX,
        pixelBatch.regionY
      );
      if (success) {
        pixelBatch.pixels.forEach((p) => {
          state.paintedPixels++;
          Utils.markPixelPainted(p.x, p.y, pixelBatch.regionX, pixelBatch.regionY);
        });
        state.fullChargeData = {
          ...state.fullChargeData,
          spentSinceShot: state.fullChargeData.spentSinceShot + batchSize
        };
        updateStats();
        updateUI("paintingProgress", "default", {
          painted: state.paintedPixels,
          total: state.totalPixels
        });
        Utils.performSmartSave();
        if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && batchSize > 0) {
          const delayPerPixel = 1e3 / state.paintingSpeed;
          const totalDelay = Math.max(100, delayPerPixel * batchSize);
          await Utils.sleep(totalDelay);
        }
      } else {
        console.error(`\u274C Batch failed permanently after retries. Stopping painting.`);
        state.stopFlag = true;
        updateUI("paintingBatchFailed", "error");
      }
      pixelBatch.pixels = [];
      return success;
    }
    async function processImage() {
      const { width, height, pixels } = state.imageData;
      const { x: startX, y: startY } = state.startPosition;
      const { x: regionX, y: regionY } = state.region;
      const tilesReady = await overlayManager.waitForTiles(
        regionX,
        regionY,
        width,
        height,
        startX,
        startY,
        1e4
        // timeout 10s
      );
      if (!tilesReady) {
        updateUI("overlayTilesNotLoaded", "error");
        state.stopFlag = true;
        return;
      }
      let pixelBatch = null;
      let skippedPixels = {
        transparent: 0,
        white: 0,
        alreadyPainted: 0,
        colorUnavailable: 0
      };
      const transparencyThreshold = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
      function checkPixelEligibility(x, y) {
        const idx = (y * width + x) * 4;
        const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2], a = pixels[idx + 3];
        if (!state.paintTransparentPixels && a < transparencyThreshold)
          return {
            eligible: false,
            reason: "transparent"
          };
        if (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))
          return {
            eligible: false,
            reason: "white"
          };
        let targetRgb = Utils.isWhitePixel(r, g, b) ? [255, 255, 255] : Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
        const mappedTargetColorId = Utils.resolveColor(
          targetRgb,
          state.availableColors,
          !state.paintUnavailablePixels
        );
        if (!state.paintUnavailablePixels && !mappedTargetColorId.id) {
          return {
            eligible: false,
            reason: "colorUnavailable",
            r,
            g,
            b,
            a,
            mappedColorId: mappedTargetColorId.id
          };
        }
        return { eligible: true, r, g, b, a, mappedColorId: mappedTargetColorId.id };
      }
      function skipPixel(reason, id, rgb, x, y) {
        if (reason !== "transparent") {
          console.log(`Skipped pixel for ${reason} (id: ${id}, (${rgb.join(", ")})) at (${x}, ${y})`);
        }
        skippedPixels[reason]++;
      }
      try {
        const coords = generateCoordinates(
          width,
          height,
          state.coordinateMode,
          state.coordinateDirection,
          state.coordinateSnake,
          state.blockWidth,
          state.blockHeight
        );
        outerLoop:
          for (const [x, y] of coords) {
            if (state.stopFlag) {
              if (pixelBatch && pixelBatch.pixels.length > 0) {
                console.log(
                  `\u{1F3AF} Sending last batch before stop with ${pixelBatch.pixels.length} pixels`
                );
                await flushPixelBatch(pixelBatch);
              }
              state.lastPosition = { x, y };
              updateUI("paintingPaused", "warning", { x, y });
              break outerLoop;
            }
            const targetPixelInfo = checkPixelEligibility(x, y);
            let absX = startX + x;
            let absY = startY + y;
            let adderX = Math.floor(absX / 1e3);
            let adderY = Math.floor(absY / 1e3);
            let pixelX = absX % 1e3;
            let pixelY = absY % 1e3;
            const targetMappedColorId = targetPixelInfo.mappedColorId;
            if (!targetPixelInfo.eligible) {
              skipPixel(
                targetPixelInfo.reason,
                targetMappedColorId,
                [targetPixelInfo.r, targetPixelInfo.g, targetPixelInfo.b],
                pixelX,
                pixelY
              );
              continue;
            }
            if (!pixelBatch || pixelBatch.regionX !== regionX + adderX || pixelBatch.regionY !== regionY + adderY) {
              if (pixelBatch && pixelBatch.pixels.length > 0) {
                console.log(
                  `\u{1F30D} Sending region-change batch with ${pixelBatch.pixels.length} pixels (switching to region ${regionX + adderX},${regionY + adderY})`
                );
                const success = await flushPixelBatch(pixelBatch);
                if (success) {
                  if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
                    const batchDelayFactor = Math.max(1, 100 / state.paintingSpeed);
                    const totalDelay = Math.max(100, batchDelayFactor * pixelBatch.pixels.length);
                    await Utils.sleep(totalDelay);
                  }
                  updateStats();
                } else {
                  console.error(`\u274C Batch failed permanently after retries. Stopping painting.`);
                  state.stopFlag = true;
                  updateUI("paintingBatchFailed", "error");
                  break outerLoop;
                }
              }
              pixelBatch = {
                regionX: regionX + adderX,
                regionY: regionY + adderY,
                pixels: []
              };
            }
            try {
              const tileKeyParts = [pixelBatch.regionX, pixelBatch.regionY];
              const tilePixelRGBA = await overlayManager.getTilePixelColor(
                tileKeyParts[0],
                tileKeyParts[1],
                pixelX,
                pixelY
              );
              if (tilePixelRGBA && Array.isArray(tilePixelRGBA)) {
                const mappedCanvasColor = Utils.resolveColor(
                  tilePixelRGBA.slice(0, 3),
                  state.availableColors
                );
                const isMatch = mappedCanvasColor.id === targetMappedColorId;
                if (isMatch) {
                  skipPixel(
                    "alreadyPainted",
                    targetMappedColorId,
                    [targetPixelInfo.r, targetPixelInfo.g, targetPixelInfo.b],
                    pixelX,
                    pixelY
                  );
                  continue;
                }
                console.debug(
                  `[COMPARE] Pixel at \u{1F4CD} (${pixelX}, ${pixelY}) in region (${regionX + adderX}, ${regionY + adderY})
  \u251C\u2500\u2500 Current color: rgb(${tilePixelRGBA.slice(0, 3).join(", ")}) (id: ${mappedCanvasColor.id})
  \u251C\u2500\u2500 Target color:  rgb(${targetPixelInfo.r}, ${targetPixelInfo.g}, ${targetPixelInfo.b}) (id: ${targetMappedColorId})
  \u2514\u2500\u2500 Status: ${isMatch ? "\u2705 Already painted \u2192 SKIP" : "\u{1F534} Needs paint \u2192 PAINT"}
`
                );
              }
            } catch (e) {
              console.error(`[DEBUG] Error checking existing pixel at (${pixelX}, ${pixelY}):`, e);
              updateUI("paintingPixelCheckFailed", "error", { x: pixelX, y: pixelY });
              state.stopFlag = true;
              break outerLoop;
            }
            pixelBatch.pixels.push({
              x: pixelX,
              y: pixelY,
              color: targetMappedColorId,
              localX: x,
              localY: y
            });
            const maxBatchSize = calculateBatchSize();
            if (pixelBatch.pixels.length >= maxBatchSize) {
              const modeText = state.batchMode === "random" ? `random (${state.randomBatchMin}-${state.randomBatchMax})` : "normal";
              console.log(
                `\u{1F4E6} Sending batch with ${pixelBatch.pixels.length} pixels (mode: ${modeText}, target: ${maxBatchSize})`
              );
              const success = await flushPixelBatch(pixelBatch);
              if (!success) {
                console.error(`\u274C Batch failed permanently after retries. Stopping painting.`);
                state.stopFlag = true;
                updateUI("paintingBatchFailed", "error");
                break outerLoop;
              }
              pixelBatch.pixels = [];
            }
            if (state.displayCharges < state.cooldownChargeThreshold && !state.stopFlag) {
              await Utils.dynamicSleep(() => {
                if (state.displayCharges >= state.cooldownChargeThreshold) {
                  NotificationManager.maybeNotifyChargesReached(true);
                  return 0;
                }
                if (state.stopFlag)
                  return 0;
                return getMsToTargetCharges(
                  state.preciseCurrentCharges,
                  state.cooldownChargeThreshold,
                  state.cooldown
                );
              });
            }
            if (state.stopFlag) {
              break outerLoop;
            }
          }
        if (pixelBatch && pixelBatch.pixels.length > 0 && !state.stopFlag) {
          console.log(`\u{1F3C1} Sending final batch with ${pixelBatch.pixels.length} pixels`);
          const success = await flushPixelBatch(pixelBatch);
          if (!success) {
            console.warn(
              `\u26A0\uFE0F Final batch failed with ${pixelBatch.pixels.length} pixels after all retries.`
            );
          }
        }
      } finally {
        if (window._chargesInterval)
          clearInterval(window._chargesInterval);
        window._chargesInterval = null;
      }
      if (state.stopFlag) {
        Utils.saveProgress();
      } else {
        updateUI("paintingComplete", "success", { count: state.paintedPixels });
        state.lastPosition = { x: 0, y: 0 };
        Utils.saveProgress();
        overlayManager.clear();
        const toggleOverlayBtn = document.getElementById("toggleOverlayBtn");
        if (toggleOverlayBtn) {
          toggleOverlayBtn.classList.remove("active");
          toggleOverlayBtn.disabled = true;
        }
      }
      console.log(`\u{1F4CA} Pixel Statistics:`);
      console.log(`   Painted: ${state.paintedPixels}`);
      console.log(`   Skipped - Transparent: ${skippedPixels.transparent}`);
      console.log(`   Skipped - White (disabled): ${skippedPixels.white}`);
      console.log(`   Skipped - Already painted: ${skippedPixels.alreadyPainted}`);
      console.log(`   Skipped - Color Unavailable: ${skippedPixels.colorUnavailable}`);
      console.log(
        `   Total processed: ${state.paintedPixels + skippedPixels.transparent + skippedPixels.white + skippedPixels.alreadyPainted + skippedPixels.colorUnavailable}`
      );
      updateStats();
    }
    function calculateBatchSize() {
      let targetBatchSize;
      if (state.batchMode === "random") {
        const min = Math.max(1, state.randomBatchMin);
        const max = Math.max(min, state.randomBatchMax);
        targetBatchSize = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`\u{1F3B2} Random batch size generated: ${targetBatchSize} (range: ${min}-${max})`);
      } else {
        targetBatchSize = state.paintingSpeed;
      }
      const maxAllowed = state.displayCharges;
      const finalBatchSize = Math.min(targetBatchSize, maxAllowed);
      return finalBatchSize;
    }
    async function sendBatchWithRetry(pixels, regionX, regionY, maxRetries = MAX_BATCH_RETRIES) {
      let attempt = 0;
      while (attempt < maxRetries && !state.stopFlag) {
        attempt++;
        console.log(
          `\u{1F504} Attempting to send batch (attempt ${attempt}/${maxRetries}) for region ${regionX},${regionY} with ${pixels.length} pixels`
        );
        const result = await sendPixelBatch(pixels, regionX, regionY);
        if (result === true) {
          console.log(`\u2705 Batch succeeded on attempt ${attempt}`);
          return true;
        } else if (result === "token_error") {
          console.log(`\u{1F511} Token error on attempt ${attempt}, regenerating...`);
          updateUI("captchaSolving", "warning");
          try {
            await handleCaptcha();
            attempt--;
            continue;
          } catch (e) {
            console.error(`\u274C Token regeneration failed on attempt ${attempt}:`, e);
            updateUI("captchaFailed", "error");
            await Utils.sleep(5e3);
          }
        } else {
          console.warn(`\u26A0\uFE0F Batch failed on attempt ${attempt}, retrying...`);
          const baseDelay = Math.min(1e3 * Math.pow(2, attempt - 1), 3e4);
          const jitter = Math.random() * 1e3;
          await Utils.sleep(baseDelay + jitter);
        }
      }
      if (attempt >= maxRetries) {
        console.error(
          `\u274C Batch failed after ${maxRetries} attempts (MAX_BATCH_RETRIES=${MAX_BATCH_RETRIES}). This will stop painting to prevent infinite loops.`
        );
        updateUI("paintingError", "error");
        return false;
      }
      return false;
    }
    async function sendPixelBatch(pixelBatch, regionX, regionY) {
      let token = turnstileToken;
      if (!token) {
        try {
          console.log("\u{1F511} Generating Turnstile token for pixel batch...");
          token = await handleCaptcha();
          turnstileToken = token;
        } catch (error) {
          console.error("\u274C Failed to generate Turnstile token:", error);
          tokenPromise = new Promise((resolve) => {
            _resolveToken = resolve;
          });
          return "token_error";
        }
      }
      const coords = new Array(pixelBatch.length * 2);
      const colors = new Array(pixelBatch.length);
      for (let i = 0; i < pixelBatch.length; i++) {
        const pixel = pixelBatch[i];
        coords[i * 2] = pixel.x;
        coords[i * 2 + 1] = pixel.y;
        colors[i] = pixel.color;
      }
      try {
        const payload = { coords, colors, t: token };
        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
        if (res.status === 403) {
          let data2 = null;
          try {
            data2 = await res.json();
          } catch (_) {
          }
          console.error("\u274C 403 Forbidden. Turnstile token might be invalid or expired.");
          try {
            console.log("\u{1F504} Regenerating Turnstile token after 403...");
            token = await handleCaptcha();
            turnstileToken = token;
            const retryPayload = { coords, colors, t: token };
            const retryRes = await fetch(
              `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
              {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=UTF-8" },
                credentials: "include",
                body: JSON.stringify(retryPayload)
              }
            );
            if (retryRes.status === 403) {
              turnstileToken = null;
              tokenPromise = new Promise((resolve) => {
                _resolveToken = resolve;
              });
              return "token_error";
            }
            const retryData = await retryRes.json();
            return (retryData == null ? void 0 : retryData.painted) === pixelBatch.length;
          } catch (retryError) {
            console.error("\u274C Token regeneration failed:", retryError);
            turnstileToken = null;
            tokenPromise = new Promise((resolve) => {
              _resolveToken = resolve;
            });
            return "token_error";
          }
        }
        const data = await res.json();
        return (data == null ? void 0 : data.painted) === pixelBatch.length;
      } catch (e) {
        console.error("Batch paint request failed:", e);
        return false;
      }
    }
    function saveBotSettings() {
      var _a, _b;
      try {
        const settings = {
          paintingSpeed: state.paintingSpeed,
          paintingSpeedEnabled: (_a = document.getElementById("enableSpeedToggle")) == null ? void 0 : _a.checked,
          batchMode: state.batchMode,
          // "normal" or "random"
          randomBatchMin: state.randomBatchMin,
          randomBatchMax: state.randomBatchMax,
          cooldownChargeThreshold: state.cooldownChargeThreshold,
          tokenSource: state.tokenSource,
          // "generator", "hybrid", or "manual"
          minimized: state.minimized,
          overlayOpacity: state.overlayOpacity,
          blueMarbleEnabled: (_b = document.getElementById("enableBlueMarbleToggle")) == null ? void 0 : _b.checked,
          ditheringEnabled: state.ditheringEnabled,
          colorMatchingAlgorithm: state.colorMatchingAlgorithm,
          enableChromaPenalty: state.enableChromaPenalty,
          chromaPenaltyWeight: state.chromaPenaltyWeight,
          customTransparencyThreshold: state.customTransparencyThreshold,
          customWhiteThreshold: state.customWhiteThreshold,
          paintWhitePixels: state.paintWhitePixels,
          paintTransparentPixels: state.paintTransparentPixels,
          resizeSettings: state.resizeSettings,
          paintUnavailablePixels: state.paintUnavailablePixels,
          coordinateMode: state.coordinateMode,
          coordinateDirection: state.coordinateDirection,
          coordinateSnake: state.coordinateSnake,
          blockWidth: state.blockWidth,
          blockHeight: state.blockHeight,
          // Save ignore mask (as base64) with its dimensions
          resizeIgnoreMask: state.resizeIgnoreMask && state.resizeSettings && state.resizeSettings.width * state.resizeSettings.height === state.resizeIgnoreMask.length ? {
            w: state.resizeSettings.width,
            h: state.resizeSettings.height,
            data: btoa(String.fromCharCode(...state.resizeIgnoreMask))
          } : null,
          // Notifications
          notificationsEnabled: state.notificationsEnabled,
          notifyOnChargesReached: state.notifyOnChargesReached,
          notifyOnlyWhenUnfocused: state.notifyOnlyWhenUnfocused,
          notificationIntervalMinutes: state.notificationIntervalMinutes,
          originalImage: state.originalImage
        };
        CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled;
        localStorage.setItem("wplace-bot-settings", JSON.stringify(settings));
      } catch (e) {
        console.warn("Could not save bot settings:", e);
      }
    }
    function loadBotSettings() {
      try {
        const saved = localStorage.getItem("wplace-bot-settings");
        if (!saved)
          return;
        const settings = JSON.parse(saved);
        state.paintingSpeed = settings.paintingSpeed || CONFIG.PAINTING_SPEED.DEFAULT;
        state.batchMode = settings.batchMode || CONFIG.BATCH_MODE;
        state.randomBatchMin = settings.randomBatchMin || CONFIG.RANDOM_BATCH_RANGE.MIN;
        state.randomBatchMax = settings.randomBatchMax || CONFIG.RANDOM_BATCH_RANGE.MAX;
        state.cooldownChargeThreshold = settings.cooldownChargeThreshold || CONFIG.COOLDOWN_CHARGE_THRESHOLD;
        state.tokenSource = settings.tokenSource || CONFIG.TOKEN_SOURCE;
        state.minimized = settings.minimized ?? false;
        CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled ?? false;
        CONFIG.AUTO_CAPTCHA_ENABLED = settings.autoCaptchaEnabled ?? false;
        state.overlayOpacity = settings.overlayOpacity ?? CONFIG.OVERLAY.OPACITY_DEFAULT;
        state.blueMarbleEnabled = settings.blueMarbleEnabled ?? CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT;
        state.ditheringEnabled = settings.ditheringEnabled ?? false;
        state.colorMatchingAlgorithm = settings.colorMatchingAlgorithm || "lab";
        state.enableChromaPenalty = settings.enableChromaPenalty ?? true;
        state.chromaPenaltyWeight = settings.chromaPenaltyWeight ?? 0.15;
        state.customTransparencyThreshold = settings.customTransparencyThreshold ?? CONFIG.TRANSPARENCY_THRESHOLD;
        state.customWhiteThreshold = settings.customWhiteThreshold ?? CONFIG.WHITE_THRESHOLD;
        state.paintWhitePixels = settings.paintWhitePixels ?? true;
        state.paintTransparentPixels = settings.paintTransparentPixels ?? false;
        state.resizeSettings = settings.resizeSettings ?? null;
        state.originalImage = settings.originalImage ?? null;
        state.paintUnavailablePixels = settings.paintUnavailablePixels ?? CONFIG.PAINT_UNAVAILABLE;
        state.coordinateMode = settings.coordinateMode ?? CONFIG.COORDINATE_MODE;
        state.coordinateDirection = settings.coordinateDirection ?? CONFIG.COORDINATE_DIRECTION;
        state.coordinateSnake = settings.coordinateSnake ?? CONFIG.COORDINATE_SNAKE;
        state.blockWidth = settings.blockWidth ?? CONFIG.COORDINATE_BLOCK_WIDTH;
        state.blockHeight = settings.blockHeight ?? CONFIG.COORDINATE_BLOCK_HEIGHT;
        state.notificationsEnabled = settings.notificationsEnabled ?? CONFIG.NOTIFICATIONS.ENABLED;
        state.notifyOnChargesReached = settings.notifyOnChargesReached ?? CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED;
        state.notifyOnlyWhenUnfocused = settings.notifyOnlyWhenUnfocused ?? CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED;
        state.notificationIntervalMinutes = settings.notificationIntervalMinutes ?? CONFIG.NOTIFICATIONS.REPEAT_MINUTES;
        if (settings.resizeIgnoreMask && settings.resizeIgnoreMask.data && state.resizeSettings && settings.resizeIgnoreMask.w === state.resizeSettings.width && settings.resizeIgnoreMask.h === state.resizeSettings.height) {
          try {
            const bin = atob(settings.resizeIgnoreMask.data);
            const arr = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++)
              arr[i] = bin.charCodeAt(i);
            state.resizeIgnoreMask = arr;
          } catch {
            state.resizeIgnoreMask = null;
          }
        } else {
          state.resizeIgnoreMask = null;
        }
        const coordinateModeSelect = document.getElementById("coordinateModeSelect");
        if (coordinateModeSelect)
          coordinateModeSelect.value = state.coordinateMode;
        const coordinateDirectionSelect = document.getElementById("coordinateDirectionSelect");
        if (coordinateDirectionSelect)
          coordinateDirectionSelect.value = state.coordinateDirection;
        const coordinateSnakeToggle = document.getElementById("coordinateSnakeToggle");
        if (coordinateSnakeToggle)
          coordinateSnakeToggle.checked = state.coordinateSnake;
        const settingsContainer = document.getElementById("wplace-settings-container");
        const directionControls = settingsContainer.querySelector("#directionControls");
        const snakeControls = settingsContainer.querySelector("#snakeControls");
        const blockControls = settingsContainer.querySelector("#blockControls");
        Utils.updateCoordinateUI({
          mode: state.coordinateMode,
          directionControls,
          snakeControls,
          blockControls
        });
        const paintUnavailablePixelsToggle = document.getElementById("paintUnavailablePixelsToggle");
        if (paintUnavailablePixelsToggle) {
          paintUnavailablePixelsToggle.checked = state.paintUnavailablePixels;
        }
        const settingsPaintWhiteToggle = settingsContainer.querySelector("#settingsPaintWhiteToggle");
        if (settingsPaintWhiteToggle) {
          settingsPaintWhiteToggle.checked = state.paintWhitePixels;
        }
        const settingsPaintTransparentToggle = settingsContainer.querySelector(
          "#settingsPaintTransparentToggle"
        );
        if (settingsPaintTransparentToggle) {
          settingsPaintTransparentToggle.checked = state.paintTransparentPixels;
        }
        const speedSlider = document.getElementById("speedSlider");
        const speedInput = document.getElementById("speedInput");
        if (speedSlider)
          speedSlider.value = state.paintingSpeed;
        if (speedInput)
          speedInput.value = state.paintingSpeed;
        const enableSpeedToggle = document.getElementById("enableSpeedToggle");
        if (enableSpeedToggle)
          enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED;
        const batchModeSelect = document.getElementById("batchModeSelect");
        if (batchModeSelect)
          batchModeSelect.value = state.batchMode;
        const normalBatchControls = document.getElementById("normalBatchControls");
        const randomBatchControls = document.getElementById("randomBatchControls");
        if (normalBatchControls && randomBatchControls) {
          if (state.batchMode === "random") {
            normalBatchControls.style.display = "none";
            randomBatchControls.style.display = "block";
          } else {
            normalBatchControls.style.display = "block";
            randomBatchControls.style.display = "none";
          }
        }
        const randomBatchMin = document.getElementById("randomBatchMin");
        if (randomBatchMin)
          randomBatchMin.value = state.randomBatchMin;
        const randomBatchMax = document.getElementById("randomBatchMax");
        if (randomBatchMax)
          randomBatchMax.value = state.randomBatchMax;
        const cooldownSlider = document.getElementById("cooldownSlider");
        const cooldownInput = document.getElementById("cooldownInput");
        if (cooldownSlider)
          cooldownSlider.value = state.cooldownChargeThreshold;
        if (cooldownInput)
          cooldownInput.value = state.cooldownChargeThreshold;
        const overlayOpacitySlider = document.getElementById("overlayOpacitySlider");
        if (overlayOpacitySlider)
          overlayOpacitySlider.value = state.overlayOpacity;
        const overlayOpacityValue = document.getElementById("overlayOpacityValue");
        if (overlayOpacityValue)
          overlayOpacityValue.textContent = `${Math.round(state.overlayOpacity * 100)}%`;
        const enableBlueMarbleToggle = document.getElementById("enableBlueMarbleToggle");
        if (enableBlueMarbleToggle)
          enableBlueMarbleToggle.checked = state.blueMarbleEnabled;
        const tokenSourceSelect = document.getElementById("tokenSourceSelect");
        if (tokenSourceSelect)
          tokenSourceSelect.value = state.tokenSource;
        const colorAlgorithmSelect = document.getElementById("colorAlgorithmSelect");
        if (colorAlgorithmSelect)
          colorAlgorithmSelect.value = state.colorMatchingAlgorithm;
        const enableChromaPenaltyToggle = document.getElementById("enableChromaPenaltyToggle");
        if (enableChromaPenaltyToggle)
          enableChromaPenaltyToggle.checked = state.enableChromaPenalty;
        const chromaPenaltyWeightSlider = document.getElementById("chromaPenaltyWeightSlider");
        if (chromaPenaltyWeightSlider)
          chromaPenaltyWeightSlider.value = state.chromaPenaltyWeight;
        const chromaWeightValue = document.getElementById("chromaWeightValue");
        if (chromaWeightValue)
          chromaWeightValue.textContent = state.chromaPenaltyWeight;
        const transparencyThresholdInput = document.getElementById("transparencyThresholdInput");
        if (transparencyThresholdInput)
          transparencyThresholdInput.value = state.customTransparencyThreshold;
        const whiteThresholdInput = document.getElementById("whiteThresholdInput");
        if (whiteThresholdInput)
          whiteThresholdInput.value = state.customWhiteThreshold;
        const notifEnabledToggle = document.getElementById("notifEnabledToggle");
        if (notifEnabledToggle)
          notifEnabledToggle.checked = state.notificationsEnabled;
        const notifOnChargesToggle = document.getElementById("notifOnChargesToggle");
        if (notifOnChargesToggle)
          notifOnChargesToggle.checked = state.notifyOnChargesReached;
        const notifOnlyUnfocusedToggle = document.getElementById("notifOnlyUnfocusedToggle");
        if (notifOnlyUnfocusedToggle)
          notifOnlyUnfocusedToggle.checked = state.notifyOnlyWhenUnfocused;
        const notifIntervalInput = document.getElementById("notifIntervalInput");
        if (notifIntervalInput)
          notifIntervalInput.value = state.notificationIntervalMinutes;
        NotificationManager.resetEdgeTracking();
      } catch (e) {
        console.warn("Could not load bot settings:", e);
      }
    }
    console.log("\u{1F680} WPlace Auto-Image with Turnstile Token Generator loaded");
    console.log("\u{1F511} Turnstile token generator: ALWAYS ENABLED (Background mode)");
    console.log("\u{1F3AF} Manual pixel captcha solving: Available as fallback/alternative");
    console.log("\u{1F4F1} Turnstile widgets: DISABLED - pure background token generation only!");
    function enableFileOperations() {
      state.initialSetupComplete = true;
      const loadBtn = document.querySelector("#loadBtn");
      const loadFromFileBtn = document.querySelector("#loadFromFileBtn");
      const uploadBtn = document.querySelector("#uploadBtn");
      if (loadBtn) {
        loadBtn.disabled = false;
        loadBtn.title = "";
        loadBtn.style.animation = "pulse 0.6s ease-in-out";
        setTimeout(() => {
          if (loadBtn)
            loadBtn.style.animation = "";
        }, 600);
        console.log("\u2705 Load Progress button enabled after initial setup");
      }
      if (loadFromFileBtn) {
        loadFromFileBtn.disabled = false;
        loadFromFileBtn.title = "";
        loadFromFileBtn.style.animation = "pulse 0.6s ease-in-out";
        setTimeout(() => {
          if (loadFromFileBtn)
            loadFromFileBtn.style.animation = "";
        }, 600);
        console.log("\u2705 Load from File button enabled after initial setup");
      }
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.title = "";
        uploadBtn.style.animation = "pulse 0.6s ease-in-out";
        setTimeout(() => {
          if (uploadBtn)
            uploadBtn.style.animation = "";
        }, 600);
        console.log("\u2705 Upload Image button enabled after initial setup");
      }
      Utils.showAlert(Utils.t("fileOperationsAvailable"), "success");
    }
    async function initializeTokenGenerator() {
      if (isTokenValid()) {
        console.log("\u2705 Valid token already available, skipping initialization");
        updateUI("tokenReady", "success");
        enableFileOperations();
        return;
      }
      try {
        console.log("\u{1F527} Initializing Turnstile token generator...");
        updateUI("initializingToken", "default");
        console.log("Attempting to load Turnstile script...");
        await Utils.loadTurnstile();
        console.log("Turnstile script loaded. Attempting to generate token...");
        const token = await handleCaptchaWithRetry();
        if (token) {
          setTurnstileToken(token);
          console.log("\u2705 Startup token generated successfully");
          updateUI("tokenReady", "success");
          Utils.showAlert(Utils.t("tokenGeneratorReady"), "success");
          enableFileOperations();
        } else {
          console.warn(
            "\u26A0\uFE0F Startup token generation failed (no token received), will retry when needed"
          );
          updateUI("tokenRetryLater", "warning");
          enableFileOperations();
        }
      } catch (error) {
        console.error("\u274C Critical error during Turnstile initialization:", error);
        updateUI("tokenRetryLater", "warning");
        enableFileOperations();
      }
    }
    loadThemePreference();
    applyTheme();
    createUI().then(() => {
      setTimeout(initializeTokenGenerator, 1e3);
      const advancedInit = () => {
        const chromaSlider = document.getElementById("chromaPenaltyWeightSlider");
        const chromaValue = document.getElementById("chromaWeightValue");
        const resetBtn = document.getElementById("resetAdvancedColorBtn");
        const algoSelect = document.getElementById("colorAlgorithmSelect");
        const chromaToggle = document.getElementById("enableChromaPenaltyToggle");
        const transInput = document.getElementById("transparencyThresholdInput");
        const whiteInput = document.getElementById("whiteThresholdInput");
        const ditherToggle = document.getElementById("enableDitheringToggle");
        if (algoSelect)
          algoSelect.addEventListener("change", (e) => {
            state.colorMatchingAlgorithm = e.target.value;
            saveBotSettings();
            _updateResizePreview();
          });
        if (chromaToggle)
          chromaToggle.addEventListener("change", (e) => {
            state.enableChromaPenalty = e.target.checked;
            saveBotSettings();
            _updateResizePreview();
          });
        if (chromaSlider && chromaValue)
          chromaSlider.addEventListener("input", (e) => {
            state.chromaPenaltyWeight = parseFloat(e.target.value) || 0.15;
            chromaValue.textContent = state.chromaPenaltyWeight.toFixed(2);
            saveBotSettings();
            _updateResizePreview();
          });
        if (transInput)
          transInput.addEventListener("change", (e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 0 && v <= 255) {
              state.customTransparencyThreshold = v;
              CONFIG.TRANSPARENCY_THRESHOLD = v;
              saveBotSettings();
              _updateResizePreview();
            }
          });
        if (whiteInput)
          whiteInput.addEventListener("change", (e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 200 && v <= 255) {
              state.customWhiteThreshold = v;
              CONFIG.WHITE_THRESHOLD = v;
              saveBotSettings();
              _updateResizePreview();
            }
          });
        if (ditherToggle)
          ditherToggle.addEventListener("change", (e) => {
            state.ditheringEnabled = e.target.checked;
            saveBotSettings();
            _updateResizePreview();
          });
        if (resetBtn)
          resetBtn.addEventListener("click", () => {
            state.colorMatchingAlgorithm = "lab";
            state.enableChromaPenalty = true;
            state.chromaPenaltyWeight = 0.15;
            state.customTransparencyThreshold = CONFIG.TRANSPARENCY_THRESHOLD = 100;
            state.customWhiteThreshold = CONFIG.WHITE_THRESHOLD = 250;
            saveBotSettings();
            const a = document.getElementById("colorAlgorithmSelect");
            if (a)
              a.value = "lab";
            const ct = document.getElementById("enableChromaPenaltyToggle");
            if (ct)
              ct.checked = true;
            if (chromaSlider)
              chromaSlider.value = 0.15;
            if (chromaValue)
              chromaValue.textContent = "0.15";
            if (transInput)
              transInput.value = 100;
            if (whiteInput)
              whiteInput.value = 250;
            _updateResizePreview();
            Utils.showAlert(Utils.t("advancedColorSettingsReset"), "success");
          });
      };
      setTimeout(advancedInit, 500);
      window.addEventListener("beforeunload", () => {
        Utils.cleanupTurnstile();
      });
    });
  })();
})();
