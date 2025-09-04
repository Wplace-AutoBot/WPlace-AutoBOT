# Auto-Image.js Documentation

> JavaScript module: `src/Auto-Image.js` • ~361.4 KB

## Overview

This module is auto-documented. The extractor lists classes, key objects, and functions it can detect.
If you want richer docs for specific APIs, add JSDoc blocks (`/** ... */`) above declarations — those will be included under "JSDoc".

### Quick stats
- Lines: 9025
- Characters: 370062

## Classes
### class OverlayManager
*No methods detected*

### class ImageProcessor
*No methods detected*


## Key Objects
### CONFIG (object)
Properties detected: 55
- AUTO_CAPTCHA_ENABLED
- BATCH_MODE
- BLUE_MARBLE_DEFAULT
- COLOR_MAP
- COOLDOWN_CHARGE_THRESHOLD
- COOLDOWN_DEFAULT
- COORDINATE_BLOCK_HEIGHT
- COORDINATE_BLOCK_WIDTH
- COORDINATE_DIRECTION
- COORDINATE_MODE
- COORDINATE_SNAKE
- DEFAULT
- ENABLED
- LOG_INTERVAL
- MAX
- MIN
- NOTIFICATIONS
- ONLY_WHEN_UNFOCUSED
- ON_CHARGES_REACHED
- OPACITY_DEFAULT
- OVERLAY
- PAINTING_SPEED
- PAINTING_SPEED_ENABLED
- PAINT_UNAVAILABLE
- RANDOM_BATCH_RANGE
- REPEAT_MINUTES
- THEMES
- TOKEN_SOURCE
- TRANSPARENCY_THRESHOLD
- WHITE_THRESHOLD
- accent
- animations
- backdropFilter
- borderRadius
- borderStyle
- borderWidth
- boxShadow
- currentTheme
- ditheringEnabled
- error
- fontFamily
- glow
- highlight
- id
- name
- neon
- pink
- primary
- purple
- rgb
- scanline
- secondary
- success
- text
- warning

### FALLBACK_TEXT (object)
Properties detected: 14
- batchSize
- charges
- en
- initMessage
- pixels
- progress
- resizeImage
- scanColors
- selectPosition
- startPainting
- stopPainting
- title
- toggleOverlay
- uploadImage

### state (object)
Properties detected: 60
- _lastChargesBelow
- _lastChargesNotifyAt
- _lastSavePixelCount
- _lastSaveTime
- _saveInProgress
- activeColorPalette
- availableColors
- batchMode
- blockHeight
- blockWidth
- blueMarbleEnabled
- chargesThresholdInterval
- chromaPenaltyWeight
- colorMatchingAlgorithm
- colorsChecked
- cooldown
- cooldownChargeThreshold
- coordinateDirection
- coordinateMode
- coordinateSnake
- customTransparencyThreshold
- customWhiteThreshold
- displayCharges
- ditheringEnabled
- enableChromaPenalty
- estimatedTime
- fullChargeData
- fullChargeInterval
- imageData
- imageLoaded
- initialSetupComplete
- language
- lastPosition
- maxCharges
- minimized
- notificationIntervalMinutes
- notificationsEnabled
- notifyOnChargesReached
- notifyOnlyWhenUnfocused
- originalImage
- overlayOpacity
- paintTransparentPixels
- paintUnavailablePixels
- paintWhitePixels
- paintedMap
- paintedPixels
- paintingSpeed
- preciseCurrentCharges
- processing
- randomBatchMax
- randomBatchMin
- region
- resizeIgnoreMask
- resizeSettings
- running
- selectingPosition
- startPosition
- stopFlag
- tokenSource
- totalPixels

### Utils (object)
Properties detected: 78
- _lab
- _labCache
- _lastSitekey
- _rgbToLab
- _turnstileContainer
- _turnstileOverlay
- _turnstileWidgetId
- addHoldToRepeatListener
- availableColors
- blockHeight
- blockWidth
- calculateEstimatedTime
- callback
- className
- clearProgress
- colorDistance
- colorsChecked
- coordinateDirection
- coordinateMode
- coordinateSnake
- createButton
- createElement
- createFileDownloader
- createFileUploader
- createImageUploader
- data
- dynamicSleep
- endTileX
- endTileY
- extractAvailableColors
- findClosestPaletteColor
- formatTime
- height
- id
- imageData
- imageLoaded
- initializePaintedMap
- innerHTML
- isPixelPainted
- isWhitePixel
- lastPosition
- loadProgress
- loadProgressFromFile
- markPixelPainted
- migrateProgressToV2
- migrateProgressToV21
- migrateProgressToV22
- packPaintedMapToBase64
- paintedMapPacked
- paintedPixels
- performSmartSave
- pixels
- region
- restoreOverlayFromData
- restoreProgress
- retry
- rgb
- saveProgress
- saveProgressToFile
- shouldAutoSave
… (18 more omitted for brevity)

### WPlaceService (object)
Properties detected: 10
- body
- charges
- colors
- cooldown
- coords
- credentials
- headers
- max
- method
- t

### NotificationManager (object)
Properties detected: 9
- badge
- current
- icon
- max
- pollIntervalMs
- pollTimer
- renotify
- silent
- threshold

### settings (object)
Properties detected: 34
- batchMode
- blockHeight
- blockWidth
- blueMarbleEnabled
- chromaPenaltyWeight
- colorMatchingAlgorithm
- cooldownChargeThreshold
- coordinateDirection
- coordinateMode
- coordinateSnake
- customTransparencyThreshold
- customWhiteThreshold
- data
- ditheringEnabled
- enableChromaPenalty
- h
- minimized
- notificationIntervalMinutes
- notificationsEnabled
- notifyOnChargesReached
- notifyOnlyWhenUnfocused
- originalImage
- overlayOpacity
- paintTransparentPixels
- paintUnavailablePixels
- paintWhitePixels
- paintingSpeed
- paintingSpeedEnabled
- randomBatchMax
- randomBatchMin
- resizeIgnoreMask
- resizeSettings
- tokenSource
- w


## Functions (detected)
#### Flow anchors detected
- `processImage()`
- `flushPixelBatch()`
- `sendPixelBatch()`
- `sendBatchWithRetry()`
- `generateCoordinates()`
- `ensureToken()`
- `handleCaptcha()`
- `handleCaptchaFallback()`
- `initializeTokenGenerator()`
- `createUI()`

#### All detected functions
- `_ensureMaskOverlayBuffers()`
- `_flushDirty()`
- `_markDirty()`
- `_resetDirty()`
- `acceleratingRepeat()`
- `advancedInit()`
- `appendLinkOnce()`
- `applyFSDither()`
- `applyFSDitherFinal()`
- `applyTheme()`
- `calculateBatchSize()`
- `centerInView()`
- `centerX()`
- `checkPixelEligibility()`
- `checkReady()`
- `checkSavedProgress()`
- `clampPan()`
- `closeDragElement()`
- `closeResizeDialog()`
- `computeFitZoom()`
- `confirmLoop()`
- `createUI()`
- `detectLanguage()`
- `diffuse()`
- `dragMouseDown()`
- `dx()`
- `elementDrag()`
- `enableFileOperations()`
- `ensureMaskSize()`
- `ensureToken()`
- `flushPixelBatch()`
- `generateCoordinates()`
- `getAvailableThemes()`
- `getCurrentTheme()`
- `getCurrentThemeName()`
- `getMsToTargetCharges()`
- `getText()`
- `handleCaptcha()`
- `handleCaptchaFallback()`
- `handleCaptchaWithRetry()`
- `idx()`
- `imgStartX()`
- `initializeColorPalette()`
- `initializeTokenGenerator()`
- `initializeTranslations()`
- `inject()`
- `invalidateToken()`
- `isEligible()`
- `isTokenValid()`
- `isTransparent()`
- `key()`
- `loadBotSettings()`
- `loadLanguagePreference()`
- `loadThemePreference()`
- `loadTranslations()`
- `makeDraggable()`
- `mapClientToPixel()`
- `markDragEnd()`
- `markDragStart()`
- `onHeightInput()`
- `onWidthInput()`
- `paintCircle()`
- `paintColumn()`
- `paintRow()`
- `populateColors()`
- `processImage()`
- `redrawMaskOverlay()`
- `rmean()`
- `run()`
- `saveBotSettings()`
- `saveThemePreference()`
- `scaleX()`
- `schedulePreview()`
- `sendBatchWithRetry()`
- `sendPixelBatch()`
- `setTurnstileToken()`
- `setVar()`
- `showResizeDialog()`
- `skipPixel()`
- `solvePromise()`
- `startPainting()`
- `startRepeating()`
- `stopRepeating()`
- `tempFetch()`
- `toggleAllColors()`
- `totalTiles()`
- `trySitekey()`
- `unselectAllPaidColors()`
- `updateActiveColorPalette()`
- `updateChargeStatsDisplay()`
- `updateChargesThresholdUI()`
- `updateCooldown()`
- `updateModeButtons()`
- `updateSpeed()`
- `updateZoomLayout()`
- `w()`

## JSDoc (if present)
### `getCurrentTheme()`
Get the current active theme name.
**Returns:** `string` - Current theme name

### `getAvailableThemes()`
Get list of available theme names.
**Returns:** `Array<string>` - Array of theme names

### `getCurrentThemeName()`
Get the current active theme name.
**Returns:** `string` - Current theme name

### `switchTheme()`
Switch to a different theme by name.
**Parameters:**
- `themeName` (`string`) - The name of the theme to switch to

### `applyTheme()`
Apply the current theme to the document by setting CSS classes and variables.

### `saveThemePreference()`
Save the current theme preference to localStorage.

### `loadThemePreference()`
Load the saved theme preference from localStorage.

### `loadTranslations()`
Load translations for a specific language from embedded assets.
**Parameters:**
- `language` (`string`) - The language code to load (e.g., 'en', 'ru', 'pt')
**Returns:** `Promise<Object|null>` - The loaded translations object or null if failed

### `loadLanguagePreference()`
Load and set the user's language preference.
**Returns:** `Promise<void>` - */

### `initializeTranslations()`
Initialize the translation system by loading English fallback and user preference.
**Returns:** `Promise<void>` - */

### `getText()`
Get translated text for a given key with fallback support.
**Parameters:**
- `key` (`string`) - The translation key to look up
**Returns:** `string` - The translated text or the key if no translation found

### `setTurnstileToken()`
Wait until all required tiles are loaded and cached
**Parameters:**
- `startRegionX` (`number`) - * @param {number} startRegionY
- `pixelWidth` (`number`) - * @param {number} pixelHeight
- `startPixelX` (`number`) - * @param {number} startPixelY
- `timeoutMs` (`number`) - * @returns {Promise<boolean>} true if tiles are ready
**Returns:** `Promise<boolean>` - true if tiles are ready

### `isTokenValid()`
Check if the current Turnstile token is valid and not expired.
**Returns:** `boolean` - True if token exists and hasn't expired

### `invalidateToken()`
Invalidate the current Turnstile token by clearing it and expiry time.

### `ensureToken()`
Ensure a valid Turnstile token is available, generating one if needed.
**Returns:** `Promise<string|null>` - The valid token or null if generation failed

### `handleCaptchaWithRetry()`
Handle Turnstile CAPTCHA generation with retry logic.
**Returns:** `Promise<string|null>` - The generated token or null if failed

### `handleCaptchaFallback()`
Fallback method for CAPTCHA token generation when primary method fails.
**Returns:** `Promise<string|null>` - The fallback token or null if not implemented

### `inject()`
Inject and execute a JavaScript function in the page context.
**Parameters:**
- `callback` (`Function`) - The function to inject and execute

### `detectLanguage()`
Detect the user's language from the backend API or browser settings.
**Returns:** `Promise<void>` - */

### `updateActiveColorPalette()`
Calculate the range of tile coordinates (in region space) that cover a given image area.
**Parameters:**
- `startRegionX` (`number`) - Base region X
- `startRegionY` (`number`) - Base region Y
- `startPixelX` (`number`) - Starting pixel X within the region grid
- `startPixelY` (`number`) - Starting pixel Y within the region grid
- `width` (`number`) - Image width in pixels
- `height` (`number`) - Image height in pixels
- `tileSize` (`number`) - Size of a tile (default 1000)
**Returns:** `{ startTileX: number, startTileY: number, endTileX: number, endTileY: number ` - }

### `toggleAllColors()`
Toggle selection of all colors in the palette.
**Parameters:**
- `select` (`boolean`) - Whether to select (true) or deselect (false) all colors

### `unselectAllPaidColors()`
Deselect all paid colors from the active palette.

### `initializeColorPalette()`
Initialize the color palette UI within a container element.
**Parameters:**
- `container` (`HTMLElement`) - The container element to populate with color options

### `handleCaptcha()`
Handle CAPTCHA generation and validation process.
**Returns:** `Promise<void>` - */

### `createUI()`
Create and initialize the main user interface.
**Returns:** `Promise<void>` - */

### `getMsToTargetCharges()`
Calculate milliseconds needed to reach target charges from current level.
**Parameters:**
- `current` (`number`) - Current number of charges
- `target` (`number`) - Target number of charges to reach
- `cooldown` (`number`) - Cooldown time per charge in milliseconds
**Returns:** `number` - Time in milliseconds to reach target

### `updateChargesThresholdUI()`
Update the charges threshold UI with current interval information.
**Parameters:**
- `intervalMs` (`number`) - The interval time in milliseconds

### `generateCoordinates()`
Generate coordinate array for painting pixels in the specified order.
**Parameters:**
- `width` (`number`) - Image width in pixels
- `height` (`number`) - Image height in pixels
- `mode` (`string`) - Coordinate generation mode ('rows', 'columns', 'blocks')
- `direction` (`string`) - Starting direction ('top-left', 'bottom-left', etc.)
- `snake` (`boolean`) - Whether to use snake pattern (reverse alternate rows/columns)
- `blockWidth` (`number`) - Width of blocks (for block mode)
- `blockHeight` (`number`) - Height of blocks (for block mode)
**Returns:** `Array<{x: number, y: number` - >} Array of coordinate objects

### `flushPixelBatch()`
Flush a batch of pixels by sending them to the backend.
**Parameters:**
- `pixelBatch` (`Array`) - Array of pixel objects to send
**Returns:** `Promise<void>` - */

### `processImage()`
Main image processing function that handles the painting workflow.
**Returns:** `Promise<void>` - */

### `calculateBatchSize()`
Calculate the optimal batch size for pixel painting based on current settings.
**Returns:** `number` - The calculated batch size

### `sendBatchWithRetry()`
Send a pixel batch with automatic retry logic.
**Parameters:**
- `pixelBatch` (`Array`) - Array of pixel objects to send
- `regionX` (`number`) - Region X coordinate
- `regionY` (`number`) - Region Y coordinate
**Returns:** `Promise<boolean>` - True if successful, false if all retries failed

### `sendPixelBatch()`
Send a batch of pixels to the backend API.
**Parameters:**
- `pixelBatch` (`Array`) - Array of pixel objects with x, y, and color data
- `regionX` (`number`) - Region X coordinate
- `regionY` (`number`) - Region Y coordinate
**Returns:** `Promise<boolean>` - True if request was successful

### `saveBotSettings()`
Save current bot settings to localStorage for persistence.

### `loadBotSettings()`
Load bot settings from localStorage and apply them to current state.


## i18n usage report (Utils.t)
- Keys referenced via Utils.t(): 108
- Keys present in en.json: 152
- Missing in en.json (1):
- `keepAspectRatio`

## Related Files

- [`auto-image-styles.css`](auto-image-styles.css.md)

---

*Auto-generated documentation — Last updated: 2025-09-04T15:16:15.351Z*
