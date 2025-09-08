// State management for WPlace Auto-Image Bot
const createState = () => {
    const state = {
        // Bot status
        running: false,
        pausedForManual: false,
        processing: false,
        stopFlag: false,

        // Image processing
        imageLoaded: false,
        imageData: null,
        originalImage: null,
        resizeSettings: null,
        resizeIgnoreMask: null,

        // Statistics
        paintedPixels: 0,
        totalPixels: 0,
        lastPosition: { x: 0, y: 0 },
        estimatedTime: 0,

        // Colors and painting
        availableColors: [],
        activeColorPalette: [],
        paintWhitePixels: true,
        paintTransparentPixels: false,
        paintUnavailablePixels: false,
        colorsChecked: false,

        // Charges and cooldown
        displayCharges: 0,
        preciseCurrentCharges: 0,
        maxCharges: 1,
        cooldown: 30000,
        fullChargeData: null,
        fullChargeInterval: null,
        cooldownChargeThreshold: 5,
        chargesThresholdInterval: null,

        // Position and region
        startPosition: null,
        selectingPosition: false,
        region: null,

        // UI state
        minimized: false,
        menuOpen: false,

        // Settings
        language: 'en',
        paintingSpeed: 1,
        batchMode: 'normal',
        randomBatchMin: 1,
        randomBatchMax: 5,
        tokenSource: 'generator',
        initialSetupComplete: false,

        // Overlay settings
        overlayOpacity: 0.8,
        blueMarbleEnabled: true,

        // Advanced settings
        ditheringEnabled: true,
        colorMatchingAlgorithm: 'lab',
        enableChromaPenalty: true,
        chromaPenaltyWeight: 0.15,
        customTransparencyThreshold: 128,
        customWhiteThreshold: 200,

        // Coordinate generation settings
        coordinateMode: 'sequential',
        coordinateDirection: 'right',
        coordinateSnake: false,
        blockWidth: 10,
        blockHeight: 10,

        // Notifications
        notificationsEnabled: true,
        notifyOnChargesReached: true,
        notifyOnlyWhenUnfocused: true,
        notificationIntervalMinutes: 5,
        _lastChargesNotifyAt: 0,
        _lastChargesBelow: true,

        // Smart save tracking
        _lastSavePixelCount: 0,
        _lastSaveTime: 0,
        _saveInProgress: false,
        paintedMap: null,
    };

    // State update methods
    const updateState = {
        setRunning: running => {
            state.running = running;
        },

        setPausedForManual: paused => {
            state.pausedForManual = paused;
        },

        setProcessing: processing => {
            state.processing = processing;
        },

        setStopFlag: stop => {
            state.stopFlag = stop;
        },

        setImageLoaded: loaded => {
            state.imageLoaded = loaded;
        },

        setImageData: data => {
            state.imageData = data;
        },

        setOriginalImage: image => {
            state.originalImage = image;
        },

        setPaintedPixels: count => {
            state.paintedPixels = count;
        },

        incrementPaintedPixels: () => {
            state.paintedPixels++;
        },

        setTotalPixels: count => {
            state.totalPixels = count;
        },

        setLastPosition: (x, y) => {
            state.lastPosition = { x, y };
        },

        setEstimatedTime: time => {
            state.estimatedTime = time;
        },

        setAvailableColors: colors => {
            state.availableColors = colors;
        },

        setActiveColorPalette: palette => {
            state.activeColorPalette = palette;
        },

        setPaintWhitePixels: paint => {
            state.paintWhitePixels = paint;
        },

        setPaintTransparentPixels: paint => {
            state.paintTransparentPixels = paint;
        },

        setColorsChecked: checked => {
            state.colorsChecked = checked;
        },

        setDisplayCharges: charges => {
            state.displayCharges = charges;
        },

        setPreciseCurrentCharges: charges => {
            state.preciseCurrentCharges = charges;
        },

        setMaxCharges: max => {
            state.maxCharges = max;
        },

        setCooldown: cooldown => {
            state.cooldown = cooldown;
        },

        setStartPosition: position => {
            state.startPosition = position;
        },

        setSelectingPosition: selecting => {
            state.selectingPosition = selecting;
        },

        setRegion: region => {
            state.region = region;
        },

        setMinimized: minimized => {
            state.minimized = minimized;
        },

        setMenuOpen: open => {
            state.menuOpen = open;
        },

        setLanguage: language => {
            state.language = language;
        },

        setPaintingSpeed: speed => {
            state.paintingSpeed = speed;
        },

        setBatchMode: mode => {
            state.batchMode = mode;
        },

        setOverlayOpacity: opacity => {
            state.overlayOpacity = opacity;
        },

        setBlueMarbleEnabled: enabled => {
            state.blueMarbleEnabled = enabled;
        },

        setColorMatchingAlgorithm: algorithm => {
            state.colorMatchingAlgorithm = algorithm;
        },

        setCoordinateMode: mode => {
            state.coordinateMode = mode;
        },

        setCoordinateDirection: direction => {
            state.coordinateDirection = direction;
        },

        setPaintedMap: map => {
            state.paintedMap = map;
        },

        reset: () => {
            state.running = false;
            state.pausedForManual = false;
            state.processing = false;
            state.stopFlag = false;
            state.paintedPixels = 0;
            state.lastPosition = { x: 0, y: 0 };
            state.estimatedTime = 0;
        },

        resetImage: () => {
            state.imageLoaded = false;
            state.imageData = null;
            state.originalImage = null;
            state.paintedPixels = 0;
            state.totalPixels = 0;
            state.paintedMap = null;
            state.colorsChecked = false;
            state.startPosition = null;
            state.region = null;
        },
    };

    // State getter methods
    const getState = {
        isRunning: () => state.running,
        isPausedForManual: () => state.pausedForManual,
        isProcessing: () => state.processing,
        getStopFlag: () => state.stopFlag,
        isImageLoaded: () => state.imageLoaded,
        getImageData: () => state.imageData,
        getOriginalImage: () => state.originalImage,
        getPaintedPixels: () => state.paintedPixels,
        getTotalPixels: () => state.totalPixels,
        getLastPosition: () => state.lastPosition,
        getEstimatedTime: () => state.estimatedTime,
        getAvailableColors: () => state.availableColors,
        getActiveColorPalette: () => state.activeColorPalette,
        getPaintWhitePixels: () => state.paintWhitePixels,
        getPaintTransparentPixels: () => state.paintTransparentPixels,
        areColorsChecked: () => state.colorsChecked,
        getDisplayCharges: () => state.displayCharges,
        getPreciseCurrentCharges: () => state.preciseCurrentCharges,
        getMaxCharges: () => state.maxCharges,
        getCooldown: () => state.cooldown,
        getStartPosition: () => state.startPosition,
        isSelectingPosition: () => state.selectingPosition,
        getRegion: () => state.region,
        isMinimized: () => state.minimized,
        isMenuOpen: () => state.menuOpen,
        getLanguage: () => state.language,
        getPaintingSpeed: () => state.paintingSpeed,
        getBatchMode: () => state.batchMode,
        getOverlayOpacity: () => state.overlayOpacity,
        isBlueMarbleEnabled: () => state.blueMarbleEnabled,
        getColorMatchingAlgorithm: () => state.colorMatchingAlgorithm,
        getCoordinateMode: () => state.coordinateMode,
        getCoordinateDirection: () => state.coordinateDirection,
        getPaintedMap: () => state.paintedMap,
        getAll: () => ({ ...state }),
    };

    return {
        state,
        update: updateState,
        get: getState,
    };
};

export { createState };
